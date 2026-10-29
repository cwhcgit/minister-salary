// Where each card actually fires. Plays seeded careers with three bots across all origins, alone
// and with a batchmate, and records, per card, the contexts it appears in: rank range, age range,
// origins, acts, the player's seniority, montage habits, and for consequence cards the years since
// the choice that scheduled them. It does the same for the batchmate's log lines, and checks the
// service's age floors for the player and the batchmate alike.
// Card text must make sense in every context listed here; the content auditor reads this table,
// and the lint checks all text against it (exit 1 on any contradiction).
//
// The run's cast and card parts are checked where they fire: every card that names a cast member
// or has parts is re-rendered in every context it was seen in (rank, act, origin, who holds each
// role and what they remember), with every version and every part combination that fits there
// (all of them when there are few, a sample when there are many), and the assembled text is
// linted. Also checked: no raw {token} survives, nobody vacant or departed is named, a cast
// member's grade is right for their rank (a senior above you, a junior below, the age floors),
// names never repeat within a run or match the batchmate's or the player's, and a callback only
// ever names the person the earlier choice was about. The player's own tokens ({player.given},
// {player.formal}, {player.full}, {player.they}...) are checked the same way: careers are played
// under every choice in game.json's player.genders, with typed names and drawn ones, and no screen
// may give the player another choice's honorific. How people address the player is checked from
// the content alone (playerAddress): a colleague never calls you {player.formal} or {player.full}.
//
//   node test/contexts.js [runsPerBotPerOrigin=600] [--json FILE] [--md FILE] [--table]
//   (the lint always runs; --table prints the per-card table; --check is accepted for old scripts)
const fs = require('fs'), path = require('path');
const H = require('../harness');

const BOTS = {
  random: null,
  optimiser: f => (f.competence||0)*1.6 + (f.standing||0)*1.5 + (f.reputation||0)*1.2 + (f.cep||0)*14 - (f.heat||0)*0.6,
  winner: f => (f.cep||0)*60 + (f.standing||0)*1.5 + (f.competence||0)*1.4 + (f.reputation||0)*1.3 - (f.heat||0)*0.8
};
const ORIGINS = ['scholar', 'grad', 'poly'];
const MONTAGE = '__montage:';
// The start screen, by run: every gender choice the table has, a blank name (drawn for the run)
// and typed names that share words with the batchmate's and the cast's pools, so the renames are
// exercised too.
const NAMES = ['Sim', '', 'Tan Wei Ming', 'Priya Nair'];
const playerAt = (build, i) => {
  const G = build.engine.genders ? build.engine.genders(build.content).map(g => g.id) : ['f'];
  return [NAMES[i % NAMES.length], G[Math.floor(i / NAMES.length) % G.length]];
};

// Plays the careers once and returns everything the table and the lint need.
function sample(build, n = 600, opts = {}) {
  const modes = opts.rival === 'off' ? [false] : opts.rival === 'on' ? [true] : [false, true];
  const cards = {}, lines = {}, floors = [];
  const cast = { problems: new Set(), states: {}, shown: 0, named: 0, lines: 0, options: {} };
  const card = id => cards[id] ||= { fires: 0, ranks: new Set(), ageMin: 99, ageMax: 0, origins: new Set(),
    acts: new Set(), since: [], service: 0, permsec: 0, politics: 0, montage: 0, habits: {}, rivalOn: 0,
    batchmate: { active: 0, inactive: 0, service: 0, politics: 0, ranks: new Set() } };
  const line = key => lines[key] ||= { fires: 0, playerService: 0, playerPolitics: 0, apart: 0, same: 0,
    batchmateStatus: {}, batchmateRanks: new Set(), playerRanks: new Set() };
  const minAge = (r, flags) => {
    const L = build.content.ladder[r];
    if (!L) return 0;
    // an exceptional file (two standout moments) may use the rung's lower floor, never anything lower
    if (flags && flags.includes('exceptional') && L.minAgeExceptional !== undefined) return L.minAgeExceptional;
    return L.minAge || 0;
  };

  for (const rival of modes) for (const [bot, score] of Object.entries(BOTS)) for (const origin of ORIGINS) for (let i = 0; i < n; i++) {
    const pick = H.rng((i * 2654435761 + 17 + (rival ? 99991 : 0)) >>> 0);
    const [name, gender] = playerAt(build, i);
    let run = H.newRun(origin, i * 7 + 3, { build, name, gender, rival });
    const scheduledAt = [];   // { eventId, fireYear, year }
    const touched = {};       // eventId@fireYear -> { role: person id } for the people the scheduling choice changed
    const linesShown = new Set();   // cast line versions this run has shown
    castInvariants(build, run.S, cast.problems);
    while (run.phase !== 'ending' && run.turn < 95) {
      const S = run.S, ev = H.currentEvent(build, S);
      const base = ev.id.startsWith(MONTAGE) ? ev.id.slice(MONTAGE.length) : ev.id;
      castShown(build, S, ev, base, run.pendingDraw, touched, cast);
      const c = card(base);
      c.fires++; if (rival) c.rivalOn++;
      if (ev.id !== base) { c.montage++; const h = (S.habits || {})[base]; c.habits[h] = (c.habits[h] || 0) + 1; }
      c.ranks.add(S.rank); c.ageMin = Math.min(c.ageMin, S.age); c.ageMax = Math.max(c.ageMax, S.age);
      c.origins.add(origin);
      c.acts.add(['tea_session', 'the_vetting', 'the_election'].includes(base) ? 'II' : S.rank >= 8 ? 'III' : 'I');
      if (S.rank >= 8) c.politics++; else if (S.rank === 7) c.permsec++; else c.service++;
      if (S.rival) {
        const v = S.rival;
        if (v.status === 'active') c.batchmate.active++; else c.batchmate.inactive++;
        if (v.rank >= 8) c.batchmate.politics++; else c.batchmate.service++;
        c.batchmate.ranks.add(v.rank);
      }
      if (ev.triggered) {
        const k = scheduledAt.findIndex(x => x.eventId === base && x.fireYear <= S.year);
        if (k >= 0) { c.since.push(S.year - scheduledAt[k].year); scheduledAt.splice(k, 1); }
      }
      const live = H.choices(run).filter(x => x.available);
      let id;
      if (!score) id = live[Math.floor(pick() * live.length)].id;
      else {
        let best = -Infinity;
        for (const x of live) {
          const ch = ev.choices['ABCDEFGH'.indexOf(x.id)];
          const v = score(ch.effects || {}) - (ch.privateSector ? 1e6 : 0);
          if (v > best) { best = v; id = x.id; }
        }
      }
      const year = run.S.year;
      run = H.step(run, id);
      const t = run.turns[run.turns.length - 1];
      for (const sc of t.scheduled) scheduledAt.push({ eventId: sc.eventId, fireYear: sc.fireYear, year });
      // a consequence remembers who its choice was about
      for (const sc of t.scheduled) for (const op of t.castOps || []) if ((op.flags || []).length)
        (touched[sc.eventId + '@' + sc.fireYear] ||= {})[op.role] = op.person;
      castInvariants(build, run.S, cast.problems);
      const notes = (run.last ? run.last.log : []).filter(l => l.cast);
      // one cast line per outcome screen, and no version of a line twice in a run
      if (notes.length > 1) cast.problems.add(`${notes.length} cast lines on one outcome screen (${notes.map(l => l.cast + '/' + l.key).join(', ')})`);
      for (const l of notes) {
        cast.lines++;
        if (RAW.test(l.text)) cast.problems.add(`cast line ${l.cast}/${l.key}: unfilled token in "${l.text}"`);
        const k = `${l.cast}.${l.key}#${l.line}`;
        if (linesShown.has(k)) cast.problems.add(`cast line ${l.cast}/${l.key} version ${l.line} shown twice in one run`);
        linesShown.add(k);
      }
      // years that passed by themselves: their Meanwhile lines appear in these contexts too
      for (const p of t.passed || []) {
        if (p.event === '__quiet') continue;
        const c2 = card(p.event);
        c2.fires++; c2.montage++; if (rival) c2.rivalOn++;
        if (p.habit !== undefined) c2.habits[p.habit] = (c2.habits[p.habit] || 0) + 1;
        c2.ranks.add(p.rank); c2.ageMin = Math.min(c2.ageMin, p.age); c2.ageMax = Math.max(c2.ageMax, p.age);
        c2.origins.add(origin); c2.acts.add(p.rank >= 8 ? 'III' : 'I');
        if (p.rank >= 8) c2.politics++; else if (p.rank === 7) c2.permsec++; else c2.service++;
      }

      // the batchmate's log lines, in the context they were shown
      const after = run.S;
      for (const l of (run.last ? run.last.log : [])) {
        if (l.kind !== 'rival') continue;
        // the state the line was written in (an outcome screen can span several years)
        const at = l.at || { player: after.rank, batchmate: after.rival ? after.rival.rank : null, status: after.rival ? after.rival.status : null };
        const x = line(l.key || '?');
        x.fires++;
        if (at.player >= 8) x.playerPolitics++; else x.playerService++;
        if (at.batchmate !== null) {
          x.batchmateStatus[at.status] = (x.batchmateStatus[at.status] || 0) + 1;
          x.batchmateRanks.add(at.batchmate);
          if ((at.batchmate >= 8) !== (at.player >= 8)) x.apart++; else x.same++;
        }
        x.playerRanks.add(at.player);
      }
      // the service's age floors hold for everyone in the same intake, in passed years too
      if (after.rank < 8 && after.age < minAge(after.rank, after.flags)) floors.push(`player ${build.content.ladder[after.rank].title} at ${after.age}`);
      for (const p of t.passed || []) if (p.rank < 8 && p.age < minAge(p.rank, after.flags)) floors.push(`player ${build.content.ladder[p.rank].title} at ${p.age}`);
      const v = after.rival;
      if (v && v.rank < 8 && after.age < minAge(v.rank)) floors.push(`batchmate ${build.content.ladder[v.rank].title} at ${after.age}`);
    }
  }
  return { cards, lines, floors, cast };
}

// --- the cast and card parts, where they fire ----------------------------------------
const RAW = /\{[^{}\s]{1,40}\}/;
const CAP_STATES = 40;   // contexts kept per card for re-rendering
const castSig = S => Object.entries((S.cast && S.cast.on) || {}).map(([r, p]) => p ? `${r}:${p.rank}:${[...p.flags].sort().join('+')}` : `${r}:-`).join(',');

// The cast's own congruence at one moment of a run: a senior is above you, a junior below,
// nobody is under their rung's age floor, and no two people share a name (nor the batchmate's).
function castInvariants(build, S, problems) {
  if (!S.cast || S.ending) return;   // a finished run's people are not updated again
  const L = build.content.ladder, E = build.engine;
  const on = Object.entries(S.cast.on).filter(([, p]) => p);
  for (const [role, p] of on) {
    const cfg = build.content.cast.roles[role], age = S.age + p.ageOff;
    if (cfg.track === 'above' && S.rank < 8 && !(p.rank > S.rank)) problems.add(`senior ${p.nm.full} (${L[p.rank].title}) is not senior to a ${L[S.rank].title}`);
    if (cfg.track === 'below' && !(p.rank < S.rank)) problems.add(`junior ${p.nm.full} (${L[p.rank].title}) does not report to a ${L[S.rank].title}`);
    if (cfg.track === 'below' && S.rank >= 8) problems.add(`junior ${p.nm.full} still reports to a ${L[S.rank].title}`);
    if (['alongside', 'below', 'above'].includes(cfg.track) && p.rank > E.maxRankForAge(build.content, age)) problems.add(`age floor broken: ${role} ${L[p.rank].title} at ${age}`);
    if (cfg.retireAge && age > cfg.retireAge) problems.add(`${role} ${p.nm.full} still working at ${age}`);
  }
  const people = on.map(([, p]) => p).concat(S.cast.past);
  const words = new Map();
  for (const p of people) for (const w of p.nm.full.toLowerCase().split(/\s+/).filter(w => !['bin', 'binte', 'de', 'd/o', 's/o'].includes(w))) {
    if (words.has(w) && words.get(w) !== p.id) problems.add(`two of the run's people share the name "${w}"`);
    words.set(w, p.id);
  }
  if (S.rival) for (const w of S.rival.name.toLowerCase().split(/\s+/)) if (words.has(w)) problems.add(`a cast member shares the batchmate's name "${w}"`);
  // nobody shares a word with the player's name either
  if (E.playerWords) for (const w of E.playerWords(S.name, build.content)) {
    if (words.has(w)) problems.add(`a cast member shares the player's name "${w}"`);
    if (S.rival && S.rival.name.toLowerCase().split(/\s+/).includes(w)) problems.add(`the batchmate shares the player's name "${w}"`);
  }
}

// Ladder titles, longest first, so "Senior Director" is not read as "Director".
const titlesOf = build => [...new Set(build.content.ladder.map(r => r.title))].sort((a, b) => b.length - a.length);
const escRe = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Checks on one assembled card in one state: no raw token, and every grade written next to a
// cast member's name is that person's grade.
function textProblems(build, S, id, texts, where) {
  const out = [];
  for (const t of texts) {
    if (typeof t !== 'string') continue;
    const m = t.match(RAW);
    if (m) out.push(`${id}: ${where}unfilled token ${m[0]} (a vacant role, or a missing part field)`);
    const hon = wrongHonorific(build, S, t);
    if (hon) out.push(`${id}: ${where}calls the player "${hon}"`);
    if (/,\s*,|\s{2,}|\s[,.]/.test(t)) out.push(`${id}: ${where}empty field in "${t.slice(0, 60)}..."`);
    if (/\ba [AEIOU]/.test(t) && (build.__vowelTitles ||= titlesOf(build).filter(x => /^[AEIOU]/.test(x))).some(x => t.includes('a ' + x))) out.push(`${id}: ${where}"a" before a vowel title`);
    for (const [role, p] of Object.entries((S.cast && S.cast.on) || {})) {
      if (!p) continue;
      const call = build.engine.personField(build.content, S, role, p, '');
      if (!t.includes(p.nm.given) && !t.includes(call)) continue;   // not named here
      const mine = build.content.cast.roles[role].track === 'none' ? null : build.content.ladder[Math.min(16, p.rank)].title;
      for (const hit of t.matchAll(nameTitleRe(build, p, call))) {
        const title = hit[1] || hit[2];
        const a = x => (/^[AEIOU]/.test(x) ? 'an ' : 'a ') + x;
        if (mine && title !== mine) out.push(`${id}: ${where}calls ${role} ${a(title)} when ${p.nm.full} is ${a(mine)}`);
        if (!mine) out.push(`${id}: ${where}gives ${role} (${p.nm.full}) a ladder grade`);
      }
    }
  }
  return out;
}
// Another choice's honorific before the player's name (game.json player.genders): "Mr" for a
// player who chose Female, and so on for any choice the table has; before the name as typed, the
// whole name ("Mr Lim Wei Ling") or the surname ("Mr Lim").
const HON_CACHE = new Map();
function wrongHonorific(build, S, t) {
  if (!build.engine.player || !S.name) return null;
  const key = S.name + '|' + S.gender + '|' + build.hash;
  if (!HON_CACHE.has(key)) {
    const T = build.content.player.genders, me = build.engine.player(build.content, S);
    const mine = T[me.gender].honorific;
    const wrong = [...new Set(Object.values(T).map(g => g.honorific).filter(h => h && h !== mine))];
    const names = playerNames(me);
    HON_CACHE.set(key, wrong.length ? { names, re: new RegExp(`\\b(?:${wrong.map(escRe).join('|')}) (?:${names.map(escRe).join('|')})\\b`) } : null);
  }
  const c = HON_CACHE.get(key);
  if (!c || !c.names.some(n => t.includes(n))) return null;
  const hit = t.match(c.re);
  return hit ? hit[0] : null;
}
// The player's name as typed, and the whole name and the surname without the honorific (engine.player).
function playerNames(me) {
  const bare = x => x && me.honorific && x.startsWith(me.honorific + ' ') ? x.slice(me.honorific.length + 1) : x;
  return [...new Set([me.name, bare(me.full), bare(me.formal)].filter(Boolean))].sort((a, b) => b.length - a.length);
}
// "<name>, the <grade>" or "<grade> <name>": compiled once per person and name form
const RE_CACHE = new Map();
function nameTitleRe(build, p, call) {
  const key = p.id + '|' + call + '|' + build.hash;
  if (!RE_CACHE.has(key)) {
    const names = [...new Set([call, p.nm.full, p.nm.given])].map(escRe).join('|');
    const titles = (build.__titleAlt ||= titlesOf(build).map(escRe).join('|'));
    RE_CACHE.set(key, new RegExp(`(?:\\b(?:${names}),? (?:the |a |an |now |our |your |as )?(${titles})\\b)|(?:\\b(${titles}) (?:${names})\\b)`, 'g'));
  }
  return RE_CACHE.get(key);
}
const cardStrings = ev => [ev.title, ev.body, ...ev.choices.flatMap(c => [c.text, c.outcome])];
const PLAYER_RE = /\{[Pp]layer(?:\.[A-Za-z]+)?\}/;
const namesPlayer = ev => JSON.stringify([ev.title, ev.body, ev.choices, ev.variants || [], ev.parts || {}]).match(PLAYER_RE);
const castOrParts = (E, ev) => !!(ev.parts || E.roleNeeds(ev).length || namesPlayer(ev));

// Every displayed card: the text as shown, the person a callback names, and the context kept.
function castShown(build, S, ev, base, draw, touched, cast) {
  const E = build.engine;
  cast.shown++;
  for (const p of textProblems(build, S, base, cardStrings(ev), '')) cast.problems.add(p);
  if (ev.who) cast.named++;
  // a consequence names the person its choice was about, or nobody: never a stranger in the role
  // (naming someone else in the role is fine when the text is written for that: it must not
  // be text that assumes the history, i.e. text that required one of the person's flags)
  const fired = draw && draw.fired;
  if (fired && ev.who) {
    const was = touched[fired.eventId + '@' + fired.fireYear] || {};
    const src = build.content.events.find(e => e.id === base) || {};
    const assumes = (q, role) => !!((((q || {}).cast || {})[role] || {}).flagsAll || []).length;
    for (const [role, id] of Object.entries(ev.who)) if (was[role] !== undefined && was[role] !== id) {
      const opts = Object.entries(ev.picked || {}).map(([slot, oid]) => (E.partSlots(src).find(([k]) => k === slot) || [, { options: [] }])[1].options.find(o => String(o.id) === oid)).filter(Boolean);
      if (assumes(src.requires, role) || opts.some(o => E.optionNeeds(o, src).includes(role) && assumes(o.requires, role)))
        cast.problems.add(`${base}: callback names a different ${role} from the one the earlier choice was about`);
    }
  }
  if (ev.picked) for (const [slot, id] of Object.entries(ev.picked)) (cast.options[base] ||= new Set()).add(slot + '=' + id);
  const src = build.content.events.concat((build.content.rival || {}).events || []).find(e => e.id === base);
  if (!src || !castOrParts(E, src)) return;
  const keep = cast.states[base] ||= new Map();
  // a card that names the player is kept in both genders' contexts
  const sig = `${S.rank}|${S.origin}|${namesPlayer(src) ? S.gender + '|' : ''}${castSig(S)}`;
  if (!keep.has(sig) && keep.size < CAP_STATES) keep.set(sig, S);
}

// Re-render every cast or parts card in every context it was seen in, with every version and
// every part combination that fits there, and lint the result.
function castLint(build, smp, problems) {
  const E = build.engine, C = build.content, ladder = C.ladder;
  let renders = 0;
  const reachable = {};
  for (const [id, states] of Object.entries(smp.cast.states)) {
    const ev = C.events.concat((C.rival || {}).events || []).find(e => e.id === id);
    for (const S of states.values()) {
      const ctx = { fires: 1, inPolitics: S.rank >= 8 ? 1 : 0, atPermSec: S.rank === 7 ? 1 : 0, inService: S.rank < 7 ? 1 : 0, rankMax: S.rank };
      for (let v = 0; v <= (ev.variants || []).length; v++) {
        const ver = E.applyVariant(ev, v);
        const combos = ev.parts ? E.partCombos(ev, S, 64) : [null];
        for (const parts of combos) {
          const r = E.render(C, ver, S, parts ? { parts } : undefined);
          renders++;
          if (parts) for (const [slot, oid] of Object.entries(parts)) (reachable[id] ||= new Set()).add(slot + '=' + oid);
          for (const p of textProblems(build, S, id, cardStrings(r), `as ${ladder[S.rank].title}${parts ? ' ' + JSON.stringify(parts) : ''}: `)) problems.push(p);
          for (const t of cardStrings(r)) for (const rule of RULES) {
            const m = typeof t === 'string' && t.match(rule.re);
            if (m && rule.bad(ctx, { rivalCard: !!ev.rivalCard })) problems.push(`${id}: ${rule.why} ("${m[0]}") as ${ladder[S.rank].title}`);
          }
        }
      }
    }
  }
  // part options no sampled context could draw (a warning: a requirement may be too tight). An
  // option drawn in play counts too: the re-renders keep at most CAP_STATES contexts a card, and
  // their signature leaves out the ministry, so a ministry's option can be missed by them alone.
  const dead = [];
  for (const ev of C.events.filter(e => e.parts)) for (const [slot, sl] of E.partSlots(ev)) sl.options.forEach((o, k) => {
    const key = slot + '=' + (o.id !== undefined ? o.id : k);
    const drawn = (smp.cast.options[ev.id] || new Set()).has(key);
    if (smp.cards[ev.id] && !drawn && !(reachable[ev.id] || new Set()).has(key)) dead.push(`${ev.id} ${key}`);
  });
  return { renders, dead };
}

// What can be checked from the content alone.
function castStatic(build) {
  const E = build.engine, C = build.content, out = [];
  const roles = new Set(Object.keys((C.cast || {}).roles || {}));
  // {player}'s fields: name, formal and every token field of game.json's player.genders
  const PF = E.playerFields ? E.playerFields(C) : [];
  const rivalTok = new Set(['rival', 'they', 'them', 'their', 'They', 'Them', 'Their', 'title']);
  const all = C.events.map(e => ({ e, rivalCard: false })).concat(((C.rival || {}).events || []).map(e => ({ e, rivalCard: true })));
  const byId = Object.fromEntries(all.map(x => [x.e.id, x.e]));
  const tok = t => [...String(t).matchAll(/\{([A-Za-z]+)(?:\.([A-Za-z]+))?\}/g)].map(m => ({ name: m[1], field: m[2] || '', raw: m[0] }));
  const strs = o => typeof o === 'string' ? [o] : Array.isArray(o) ? o.flatMap(strs) : o && typeof o === 'object' ? Object.values(o).flatMap(strs) : [];
  for (const { e, rivalCard } of all) {
    const slots = new Map(E.partSlots(e));
    for (const k of slots.keys()) {
      if (roles.has(k) || rivalTok.has(k) || k === 'player') out.push(`${e.id}: part slot "${k}" has the name of a cast role, a batchmate token or the player`);
      if (k !== k.toLowerCase()) out.push(`${e.id}: part slot "${k}" must be lower case`);
      const ids = slots.get(k).options.map((o, i) => o.id !== undefined ? String(o.id) : String(i));
      if (new Set(ids).size !== ids.length) out.push(`${e.id}: part slot "${k}" has duplicate option ids`);
    }
    const texts = strs([e.title, e.body, e.choices.map(c => [c.text, c.outcome]), (e.variants || []).map(v => [v.title, v.body, v.choices]),
      Object.values((e.again || {}).scenes || {}).map(v => [v.title, v.body, v.choices]),
      [...slots.values()].map(sl => sl.options.map(o => Object.entries(o).filter(([k]) => !['id', 'requires', 'effects', 'scale', 'prefer'].includes(k)).map(([, v]) => v)))]);
    for (const t of texts) for (const { name, field, raw } of tok(t)) {
      const low = name.charAt(0).toLowerCase() + name.slice(1);
      if (slots.has(low)) {
        // every option of the slot must have the field the text asks for
        for (const o of slots.get(low).options) if (typeof (field ? o[field] : o.text) !== 'string') out.push(`${e.id}: ${raw} but option "${o.id}" of "${low}" has no ${field || 'text'}`);
      } else if (/^player$/i.test(name)) {
        // the player: {player}, {player.formal}, and the fields of game.json's player.genders
        if (!PF.includes(field.toLowerCase())) out.push(`${e.id}: unknown player field ${raw}`);
      } else if (roles.has(name.toLowerCase())) {
        if (field && !['name', 'full', 'given', 'formal', 'title', 'atitle', 'they', 'them', 'their', 'years'].includes(field.toLowerCase())) out.push(`${e.id}: unknown cast field ${raw}`);
      } else if (name === 'ministry' && !field) {
        // the player's ministry, as the header names it
      } else if (!(rivalCard && rivalTok.has(name))) out.push(`${e.id}: unknown token ${raw}`);
      // the pronoun convention: a subject pronoun never comes before a present-tense verb
    }
    for (const t of texts) for (const m of String(t).matchAll(/\{(?:[A-Za-z]+\.)?[Tt]hey\} (\w+)/g))
      if (presentVerb(m[1])) out.push(`${e.id}: subject pronoun before a present-tense verb ("${m[0]}"); use the name, or a past tense`);
    // a grade written next to a cast member, which no rank will keep right
    for (const t of texts) {
      const m = String(t).match(new RegExp(`\\{[A-Za-z]+\\}, (?:the |a |an |now )?(${titlesOf(build).map(escRe).join('|')})\\b`));
      if (m) out.push(`${e.id}: a grade written out next to a cast member ("${m[0]}"); use {role.title}`);
    }
    // tokens where nothing fills them: montage lines, autoplay lines, and part tokens in a repeatable card's title (montage years show it)
    for (const t of strs(e.montageLines)) if (tok(t).length) out.push(`${e.id}: token in a montage line ("${t.slice(0, 40)}...")`);
    for (const t of strs([(e.autoPlay || {}).line, (e.autoPlay || {}).lines, (e.variants || []).map(v => v.autoPlayLine)])) if (tok(t).some(x => !roles.has(x.name.toLowerCase()))) out.push(`${e.id}: part token in an autoplay line`);
    if (!e.once && !e.triggered && tok(e.title).some(x => slots.has(x.name.charAt(0).toLowerCase() + x.name.slice(1)))) out.push(`${e.id}: part token in a repeatable card's title`);
    // a callback that names a role must know whether the person there is the one the choice was about
    e.choices.forEach((ch, i) => {
      const flagged = Object.entries(ch.cast || {}).filter(([, op]) => (op.flags || []).length);
      for (const sc of ch.schedule || []) for (const target of [sc.eventId, ...((byId[sc.eventId] || {}).alternates || [])]) {
        const cb = byId[target];
        if (!cb) continue;
        for (const [role, op] of flagged) {
          const knows = q => { const r = ((q || {}).cast || {})[role]; return r === false || (r && (r.vacant || (r.flagsAll || []).some(f => op.flags.includes(f)) || (r.flagsNone || []).some(f => op.flags.includes(f)))); };
          if (E.roleNeeds(cb).includes(role) && !knows(cb.requires)) out.push(`${target}: names {${role}} but does not check that it is the ${role} ${e.id} choice ${'ABCD'[i]} was about`);
          for (const [slot, sl] of E.partSlots(cb)) for (const o of sl.options) if (E.optionNeeds(o, cb).includes(role) && !knows(o.requires) && !knows(cb.requires))
            out.push(`${target}: option ${slot}=${o.id} names {${role}} but does not check that it is the ${role} ${e.id} choice ${'ABCD'[i]} was about`);
        }
      }
    });
    // cast ops name a real role
    e.choices.forEach(ch => { for (const r of Object.keys(ch.cast || {})) if (!roles.has(r)) out.push(`${e.id}: choice changes unknown cast role "${r}"`); });
  }
  for (const f of (C.folder || []).concat((C.rival || {}).folder || [])) if (tok(f.item).some(x => roles.has(x.name.toLowerCase()))) out.push(`folder item ${f.flag}: names a cast role (the folder is read years later, when the role may hold someone else)`);

  // The ending card and the Declassified file fill only the player's tokens; a cast line fills
  // its own person's fields ({name}, {title}, {them}...) and the player's.
  const fixed = [
    ...(C.endings || []).flatMap(x => [[`ending ${x.id}`, x.title], [`ending ${x.id}`, x.epitaph]]),
    ...(C.legacyTiers || []).map((x, i) => [`legacyTiers[${i}]`, x.text]),
    ...Object.entries(C.legacyByEnding || {}).flatMap(([k, xs]) => xs.map((x, i) => [`legacyByEnding.${k}[${i}]`, x.text])),
    ...(C.declassifiedFlags || []).concat((C.endgame || {}).declassifiedFlags || []).map(x => [`Declassified "${x.label}"`, x.text])
  ];
  const castLines = Object.entries((C.cast || {}).lines || {}).flatMap(([role, kinds]) =>
    Object.entries(kinds).flatMap(([k, xs]) => xs.map((t, i) => [`cast line ${role}.${k}[${i}]`, t])));
  const rivalLines = Object.entries((C.rival || {}).lines || {}).flatMap(([k, xs]) => xs.map((t, i) => [`batchmate line ${k}[${i}]`, t]));
  for (const [where, t] of fixed.concat(castLines)) for (const { name, field, raw } of tok(t)) {
    if (/^player$/i.test(name)) { if (!PF.includes(field.toLowerCase())) out.push(`${where}: unknown player field ${raw}`); }
    else if (where.startsWith('cast line') ? !!field : true) out.push(`${where}: token ${raw} is never filled there`);
  }
  // the table itself: every choice has a label and an honorific, and the same token fields, so a
  // token that reads for one choice reads for all of them
  const T = (C.player || {}).genders || {}, own = ['label', 'pool'];
  const fieldsOf = g => Object.keys(g).filter(k => !own.includes(k)).sort().join(',');
  for (const [id, g] of Object.entries(T)) {
    if (!g.label || !g.honorific) out.push(`player.genders.${id}: needs a label and an honorific`);
    if (fieldsOf(g) !== fieldsOf(Object.values(T)[0])) out.push(`player.genders.${id}: has fields ${fieldsOf(g)}, but ${Object.keys(T)[0]} has ${fieldsOf(Object.values(T)[0])}`);
    if (g.pool && !(C.cast || { names: [] }).names.some(n => n.pron === g.pool)) out.push(`player.genders.${id}: no cast name has the pool "${g.pool}"`);
  }
  if (Object.keys(T).length && !(C.player.default in T)) out.push(`player.default "${C.player.default}" is not one of the choices`);
  for (const [where, t] of fixed.concat(castLines, rivalLines))
    for (const m of String(t).matchAll(/\{(?:[A-Za-z]+\.)?[Tt]hey\} (\w+)/g)) if (presentVerb(m[1]))
      out.push(`${where}: subject pronoun before a present-tense verb ("${m[0]}"); use the name, or a past tense`);
  out.push(...playerAddress(build));
  return out;
}

// --- how people address the player (docs/WRITING_RULES.md rule 4.1) -----------------------
// Colleagues, peers, your reporting officer, friends and the batchmate call you {player.given};
// {player.formal} is for officials in a formal setting, residents and the press, and {player.full}
// for documents, Hansard and the record. Two checks, on every string of the content (cards, packs,
// the batchmate's cards and lines, game.json's lines; not the notes):
// - {player} or {player.name} on its own: the content always says which form it means.
// - A heuristic for a colleague who sounds like an official: a quote ("..." or “...”) holding
//   {player.formal} or {player.full} fails when the clause around it names a colleague. The clause
//   runs from the last full stop, question mark or exclamation mark before the quote to the next
//   one after it, so it holds the speaker of "X says, "..."" and of ""...," says X", and not a
//   person from the sentence before. A colleague is a service colleague's or fellow MP's token
//   ({peer}, {junior}, {senior}, {mp}, any field), the batchmate's ({rival}, {they}) or a word
//   such as "colleague", "batchmate", "reporting officer", "peers", "friend" or "your team"; in a
//   cast line of one of those roles every quote is that person's own. It cannot see a speaker
//   named two sentences earlier, and a colleague merely mentioned beside an official's quote
//   trips it (reword the clause). A line that also uses {player.given} passes: it is contrasting
//   the forms on purpose ("calls you "{player.given}" on day one and "{player.formal}" on day two").
const COLLEAGUE_ROLES = ['peer', 'junior', 'senior', 'mp'];
const COLLEAGUE_WORDS = /\b(colleagues?|batchmates?|reporting officer|peers|your peer|friends?|your team|your junior|your intake|officers you joined with)\b/i;
const SKIP_KEYS = new Set(['note', 'about', 'id', 'flag', 'requires', 'effects', 'scale', 'schedule', 'witnesses']);
function playerAddress(build) {
  const C = build.content, out = [];
  const roles = Object.keys((C.cast || {}).roles || {}).filter(r => COLLEAGUE_ROLES.includes(r)).concat(['rival', 'they']);
  const roleRe = new RegExp(`\\{(?:${roles.map(escRe).join('|')})(?:\\.[A-Za-z]+)?\\}`, 'i');
  const check = (t, where, speaker) => {
    if (/\{[Pp]layer(?:\.[Nn]ame)?\}/.test(t)) out.push(`${where}: the player named without saying how; use {player.given} (colleagues), {player.formal} (officials, residents, the press) or {player.full} (documents, Hansard) ("${t.slice(0, 60)}...")`);
    if (/\{[Pp]layer\.[Gg]iven\}/.test(t)) return;   // contrasting the forms on purpose
    for (const m of t.matchAll(/"([^"]*)"|“([^”]*)”/g)) {
      const said = m[1] !== undefined ? m[1] : m[2];
      const form = said.match(/\{[Pp]layer\.(?:[Ff]ormal|[Ff]ull)\}/);
      if (!form) continue;
      const clause = t.slice(0, m.index).split(/[.!?]["”]?\s+/).pop() + ' ' + t.slice(m.index + m[0].length).split(/[.!?](?:["”\s]|$)/)[0];
      const who = speaker || (clause.match(roleRe) || clause.match(COLLEAGUE_WORDS) || [])[0];
      if (who) out.push(`${where}: ${who} calls you ${form[0]} ("${m[0].slice(0, 50)}"); a colleague says {player.given}`);
    }
  };
  const walk = (o, where, speaker) => {
    if (typeof o === 'string') check(o, where, speaker);
    else if (Array.isArray(o)) o.forEach((x, i) => walk(x, `${where}[${i}]`, speaker));
    else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) if (!SKIP_KEYS.has(k)) walk(v, where ? `${where}.${k}` : k, speaker);
  };
  for (const e of C.events.concat((C.rival || {}).events || [])) walk(e, e.id);
  for (const [k, v] of Object.entries((C.rival || {}))) if (k !== 'events' && k !== 'names') walk(v, `batchmate ${k}`);
  for (const [k, v] of Object.entries(C)) {
    if (['events', 'rival', 'player'].includes(k) || SKIP_KEYS.has(k)) continue;
    if (k === 'cast') {
      for (const [role, kinds] of Object.entries(v.lines || {})) walk(kinds, `cast line ${role}`, COLLEAGUE_ROLES.includes(role) ? `{${role}}` : null);
      continue;
    }
    walk(v, k);
  }
  return out;
}

const presentVerb = w => /^(is|was|has|does|isn't|wasn't|hasn't|doesn't)$/.test(w) || (/[^s]s$/.test(w) && !/^(always|perhaps|sometimes|this|thus|as|its)$/.test(w));

// --- hidden witnesses ------------------------------------------------------------------
// A witness is never named, during play or at the end: what was noticed, never who noticed it
// (docs/WRITING_RULES.md 5.6). Every line a player can read from the witnesses (the review lines;
// the ending never mentions them) is checked for a cast name, the batchmate's, a grade's title, a
// word for a role or a pronoun that would give a person away, a number, and a token, which nothing
// fills there. A politics witness's lines are also checked for the service's words: "upstairs",
// "the building", "appraisal".
const WITNESS_ROLE_WORDS = ['officer', 'officers', 'director', 'directors', 'secretary', 'secretaries', 'minister', 'ministers',
  'ministerial', 'hr', 'panel', 'panels', 'board', 'boards', 'boss', 'bosses', 'supervisor', 'supervisors', 'manager', 'managers',
  'colleague', 'colleagues', 'junior', 'juniors', 'senior', 'seniors', 'peer', 'peers', 'batchmate', 'intern', 'interns',
  'assistant', 'pa', 'sender', 'senders', 'countersign', 'countersigns', 'countersigned', 'countersigning', 'countersigner',
  'reporting', 'mentor', 'deputy', 'chief', 'chair', 'chairman', 'chairwoman', 'mp', 'mps', 'journalist', 'journalists',
  'correspondent', 'editor', 'whip', 'auditor', 'newcomer', 'scholar', 'he', 'she', 'him', 'her', 'his', 'hers', 'himself',
  'herself', 'mr', 'ms', 'mrs', 'mdm', 'dr', 'sir', 'madam',
  // politics: the people and the bodies a politics witness belongs to
  'whips', 'member', 'members', 'backbencher', 'backbenchers', 'volunteer', 'volunteers', 'activist', 'activists', 'leader',
  'leaders', 'leadership', 'pm', 'premier', 'official', 'officials', 'civil', 'servant', 'servants', 'reporter', 'reporters',
  'columnist', 'columnists', 'editors', 'press', 'party', 'branch', 'cabinet', 'speaker', 'clerk', 'clerks', 'adviser', 'advisers'];
const WITNESS_SERVICE_WORDS = /\bupstairs\b|\bthe building\b|\bthis building\b|\bappraisals?\b/i;
// the cards that can list witnesses: events.json, the packs and the batchmate's
const witnessCards = build => build.content.events.concat((build.content.rival || {}).events || []);
// [where, text, ladder] for every player-facing witness line
function witnessTexts(build) {
  const W = build.content.witnesses, out = [];
  if (!W) return out;
  for (const [type, x] of Object.entries(W.types || {}))
    for (const sign of ['help', 'hurt']) (((x.review || {})[sign]) || []).forEach((t, i) => out.push([`witnesses.types.${type}.review.${sign}[${i}]`, t, x.ladder || 'service']));
  return out;
}
// What would give a witness away in one line: [] when it is clean.
function witnessWordProblems(build, text) {
  const C = build.content, t = String(text), out = [];
  const words = new Set(t.toLowerCase().replace(/[^a-z'\s-]/g, ' ').split(/[\s-]+/).map(w => w.replace(/'s$|^'|'$/g, '')).filter(Boolean));
  for (const w of WITNESS_ROLE_WORDS) if (words.has(w)) out.push(`the word "${w}" says who`);
  for (const title of titlesOf(build)) if (new RegExp(`\\b${escRe(title)}\\b`, 'i').test(t)) out.push(`a grade's title, "${title}"`);
  const names = new Set();
  for (const n of (C.cast || {}).names || []) for (const w of [n.full, n.given, n.formal]) names.add(w);
  for (const n of ((C.rival || {}).names || [])) names.add(n.name);
  for (const nm of names) if (nm && new RegExp(`\\b${escRe(nm)}\\b`).test(t)) out.push(`a name, "${nm}"`);
  if (/\d/.test(t)) out.push('a number');
  return out;
}
// The ranks a card can be shown at, from its own requirements: [lowest, highest].
const cardRanks = e => [((e.requires || {}).minRank) || 0, (e.requires || {}).maxRank !== undefined ? e.requires.maxRank : 16];
function witnessStatic(build) {
  const C = build.content, W = C.witnesses, out = [];
  const cards = witnessCards(build).filter(e => e.witnesses);
  if (!W) return cards.length ? [`${cards.length} cards list witnesses, but game.json has no witnesses block`] : [];
  const types = W.types || {}, max = W.maxStep || 6, cap = W.cap || 8;
  // one witness nudges a grade and never jumps two: no reaction is half a grade wide, and no year's
  // total a whole grade
  const bands = C.grades.slice(0, -1).map((g, i) => g.min - C.grades[i + 1].min);
  if (max >= Math.min(...bands) / 2) out.push(`witnesses.maxStep ${max} is half a grade or more`);
  if (cap >= Math.min(...bands)) out.push(`witnesses.cap ${cap} could move a grade by two`);
  for (const [type, x] of Object.entries(types))
    if (x.ladder !== undefined && !['service', 'politics'].includes(x.ladder)) out.push(`witnesses.types.${type}: ladder must be "service" or "politics"`);
  const used = {};
  const use = (type, sign) => (used[type] = used[type] || new Set()).add(sign);
  for (const e of cards) {
    const n = e.choices.length, by = e.witnesses.by || {};
    for (const k of Object.keys(e.witnesses)) if (k !== 'by') out.push(`${e.id}: witnesses.${k} is not read (a card lists only who could know: witnesses.by)`);
    if (!Object.keys(by).length) out.push(`${e.id}: witnesses.by lists nobody`);
    const slots = new Map(build.engine.partSlots(e));
    const [lo, hi] = cardRanks(e);
    for (const [type, w] of Object.entries(by)) {
      const at = `${e.id}: witness ${type}`;
      if (!types[type]) { out.push(`${at}: no such type in game.json witnesses.types`); continue; }
      // a witness sees only what is done on its own ladder (rank 8 and up is politics)
      const pol = types[type].ladder === 'politics', q0 = w.requires || {};
      const wlo = Math.max(lo, q0.minRank || 0), whi = Math.min(hi, q0.maxRank !== undefined ? q0.maxRank : 16);
      if (pol ? whi < 8 : wlo >= 8) out.push(`${at}: a ${pol ? 'politics' : 'service'} witness on a card only shown in ${pol ? 'the service' : 'politics'} never sees anything`);
      if (Array.isArray(w.chance) && w.chance.length !== n) out.push(`${at}: chance needs one number per choice`);
      if ([].concat(w.chance).some(x => typeof x !== 'number' || x <= 0 || x > 1)) out.push(`${at}: chance must be above 0 and at most 1`);
      if (!Array.isArray(w.react) || w.react.length !== n || w.react.some(x => !Number.isInteger(x))) out.push(`${at}: react needs one whole number per choice`);
      else w.react.forEach((x, i) => {
        if (Math.abs(x) > max) out.push(`${at}: choice ${'ABCD'[i]} moves ${x}, more than maxStep ${max}`);
        if (x) use(type, x > 0 ? 'help' : 'hurt');
      });
      // the ceiling only ever goes up here
      if (w.cep !== undefined) {
        if (!Array.isArray(w.cep) || w.cep.length !== n || w.cep.some(x => x !== 0 && x !== 1)) out.push(`${at}: cep needs a 0 or 1 per choice`);
      }
      const q = w.requires || {};
      for (const v of q.variants || []) if (!Number.isInteger(v) || v < 0 || v > (e.variants || []).length) out.push(`${at}: the card has no version ${v}`);
      for (const [slot, ids] of Object.entries(q.parts || {})) {
        if (!slots.has(slot)) { out.push(`${at}: no part slot "${slot}"`); continue; }
        const have = slots.get(slot).options.map((o, i) => (o.id !== undefined ? String(o.id) : String(i)));
        for (const id of ids) if (!have.includes(id)) out.push(`${at}: part slot "${slot}" has no option "${id}"`);
      }
    }
  }
  // a type that helps or hurts somewhere has lines to say so on the review page
  for (const [type, signs] of Object.entries(used)) for (const sign of signs)
    if (((((types[type] || {}).review) || {})[sign] || []).length < 2) out.push(`witnesses.types.${type}.review.${sign}: needs at least two lines`);
  const seen = new Map();
  for (const [where, t, ladder] of witnessTexts(build)) {
    for (const p of witnessWordProblems(build, t)) out.push(`${where}: ${p} ("${String(t).slice(0, 60)}")`);
    for (const m of String(t).matchAll(/\{(\w+)\}/g)) out.push(`${where}: token ${m[0]} is never filled there`);
    if (ladder === 'politics' && WITNESS_SERVICE_WORDS.test(t)) out.push(`${where}: a politics line in the service's words ("${String(t).match(WITNESS_SERVICE_WORDS)[0]}")`);
    if (seen.has(t)) out.push(`${where}: the same line as ${seen.get(t)}`); else seen.set(t, where);
  }
  return out;
}

function table(build, smp) {
  const ladder = build.content.ladder, out = {};
  for (const [id, c] of Object.entries(smp.cards)) {
    const r = [...c.ranks].sort((a, b) => a - b);
    const since = c.since.sort((a, b) => a - b);
    out[id] = {
      fires: c.fires, montage: c.montage, montageHabits: c.montage ? c.habits : undefined,
      ranks: r.map(x => ladder[x].title).filter((t, i, a) => a.indexOf(t) === i),
      rankMin: r[0], rankMax: r[r.length - 1],
      inService: c.service, atPermSec: c.permsec, inPolitics: c.politics,
      ages: [c.ageMin, c.ageMax], origins: [...c.origins], acts: [...c.acts].sort(),
      yearsSinceScheduled: since.length ? [since[0], since[since.length - 1]] : null,
      withBatchmate: c.rivalOn ? { fires: c.rivalOn, batchmateActive: c.batchmate.active, batchmateGone: c.batchmate.inactive,
        batchmateInService: c.batchmate.service, batchmateInPolitics: c.batchmate.politics } : undefined
    };
  }
  return out;
}

// Back-compatible entry point for the auditor: the per-card table, alone and with a batchmate.
function contexts(build, n = 600, opts = {}) {
  return table(build, sample(build, n, opts));
}

// --- the phrase lint ---------------------------------------------------------------
// Each rule: text that assumes a context, and the fire contexts that would contradict it.
const RULES = [
  { re: /\b(reporting officer|your RO|your director|your division|clearances?|the ranking exercise)\b/i,
    why: 'civil-service phrase in a card that fires in politics', bad: c => c.inPolitics > 0 },
  { re: /\byour director\b/i, why: '"your director" for a player who is a Director or above', bad: c => c.rankMax >= 4 },
  { re: /\byour (Permanent Secretary|Perm Sec)\b/i, why: '"your Permanent Secretary" for a Permanent Secretary', bad: c => c.atPermSec > 0 },
  { re: /\b(the Whip|your ward|your constituents|your GRC|Question Time|by-election)\b/,
    why: 'political phrase in a card that fires in the service', bad: c => c.inService + c.atPermSec > 0 },
  { re: /\b(wife|husband|girlfriend|boyfriend)\b/i, why: 'assumes the player\'s gender or family', bad: () => true },
  { re: /\b(sir|madam|ma'am)\b/i, why: 'addresses the player by a gendered word; use {player.formal}', bad: () => true },
  { re: /\{(rival|they|them|their|They|Them|Their)\}/, why: 'batchmate placeholder in a card that can fire with no batchmate',
    bad: (c, card) => !card.rivalCard && c.fires > 0 }
];

// The batchmate's log lines, by key: the contexts each one's wording assumes.
const LINE_RULES = {
  winService: x => x.playerPolitics === 0, loseService: x => x.playerPolitics === 0, rankedBelowService: x => x.playerPolitics === 0,
  winPolitics: x => x.playerService === 0, losePolitics: x => x.playerService === 0, rankedBelowPolitics: x => x.playerService === 0,
  promoted: x => x.apart === 0, appointed: x => x.apart === 0, promotedApart: x => x.same === 0,
  elected: x => x.playerPolitics === 0, lostSeat: x => x.playerPolitics === 0,
  electedTogether: x => x.playerService === 0, lostSeatTogether: x => x.playerService === 0,
  consultancyPolitics: x => true, scandalPolitics: x => true
};

function texts(e) {
  const out = [e.title, e.body];
  for (const c of e.choices || []) out.push(c.text, c.outcome);
  // every version of the card is shown in the same contexts as the card itself, and so is a
  // series' second-showing scene
  for (const v of e.variants || []) { out.push(v.title, v.body); for (const c of v.choices || []) out.push(c.text, c.outcome); }
  for (const v of Object.values((e.again || {}).scenes || {})) { out.push(v.title, v.body); for (const c of v.choices || []) out.push(c.text, c.outcome); }
  const m = e.montageLines;
  if (m) out.push(...(Array.isArray(m) ? m : Object.values(m).flat()));
  if (e.autoPlay) out.push(e.autoPlay.line, ...(e.autoPlay.lines || []));
  return out.filter(Boolean);
}

function lint(build, smp) {
  const t = table(build, smp), problems = [];
  const rivalEvents = (build.content.rival && build.content.rival.events) || [];
  const all = build.content.events.map(e => ({ e, rivalCard: false })).concat(rivalEvents.map(e => ({ e, rivalCard: true })));
  for (const { e, rivalCard } of all) {
    const c = t[e.id];
    if (!c) continue;   // never fired in the sample: nothing to contradict
    for (const s of texts(e)) for (const r of RULES) {
      const m = s.match(r.re);
      if (m && r.bad(c, { rivalCard })) problems.push(`${e.id}: ${r.why} ("${m[0]}")`);
    }
  }
  for (const [key, x] of Object.entries(smp.lines)) {
    const ok = LINE_RULES[key];
    if (ok && !ok(x)) problems.push(`batchmate line "${key}": shown in a context its wording does not fit ${JSON.stringify({ playerService: x.playerService, playerPolitics: x.playerPolitics, apart: x.apart, same: x.same })}`);
    const allowed = { retired: ['retired'], consultancy: ['consultancy'], consultancyPolitics: ['consultancy'], scandal: ['scandal'], scandalPolitics: ['scandal'] }[key] || ['active'];
    for (const st of Object.keys(x.batchmateStatus)) if (!allowed.includes(st)) problems.push(`batchmate line "${key}": shown while the batchmate is ${st}`);
  }
  for (const f of [...new Set(smp.floors)]) problems.push(`age floor broken: ${f}`);
  // the cast and card parts
  problems.push(...castStatic(build), ...smp.cast.problems);
  problems.push(...witnessStatic(build));   // hidden witnesses: never named, never more than a nudge
  const cl = castLint(build, smp, problems);
  lint.last = { renders: cl.renders, dead: cl.dead, shown: smp.cast.shown, named: smp.cast.named, lines: smp.cast.lines };
  return [...new Set(problems)];
}

function toMarkdown(t) {
  const rows = Object.entries(t).sort(([a], [b]) => a.localeCompare(b)).map(([id, c]) =>
    `| ${id} | ${c.fires}${c.montage ? ` (${c.montage} montage)` : ''} | ${c.ranks.join(', ')} | ${c.inService}/${c.atPermSec}/${c.inPolitics} | ${c.ages[0]}-${c.ages[1]} | ${c.origins.join(' ')} | ${c.yearsSinceScheduled ? c.yearsSinceScheduled.join('-') : ''} |`);
  return ['| card | fires | ranks seen | service / Perm Sec / politics | ages | origins | years since scheduled |',
    '| --- | --- | --- | --- | --- | --- | --- |', ...rows].join('\n') + '\n';
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  const flag = k => { const i = argv.indexOf(k); return i >= 0 ? argv.splice(i, 2)[1] : null; };
  const has = k => { const i = argv.indexOf(k); if (i >= 0) argv.splice(i, 1); return i >= 0; };
  const jsonOut = flag('--json'), mdOut = flag('--md'), showTable = has('--table');
  has('--check');   // the lint always runs
  const N = +argv[0] || 600;
  const build = H.loadBuild();
  const smp = sample(build, N);
  const t = table(build, smp);
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(t, null, 1) + '\n');
  const md = toMarkdown(t);
  if (mdOut) fs.writeFileSync(mdOut, md); else if (showTable) process.stdout.write(md);
  const problems = lint(build, smp);
  const cards = Object.keys(t).length, lineKeys = Object.keys(smp.lines).length, x = lint.last;
  const partCards = build.content.events.filter(e => e.parts), opts = partCards.reduce((n, e) => n + build.engine.partSlots(e).reduce((k, [, sl]) => k + sl.options.length, 0), 0);
  console.log(`cast and parts: ${x.shown} cards shown, ${x.named} naming the run's people, ${x.lines} cast lines; ${partCards.length} cards with ${opts} part options; ${x.renders} re-renders across the contexts they fired in`);
  if (x.dead.length) console.log(`! part options no sampled context could draw: ${x.dead.join(', ')}`);
  if (problems.length) {
    console.log(`✗ ${problems.length} immersion contradictions:`);
    problems.forEach(p => console.log('  ' + p));
    process.exitCode = 1;
  } else console.log(`✓ no immersion contradictions: ${cards} cards and ${lineKeys} batchmate lines checked against where they fire; cast and parts checked in every context; age floors held`);
}

module.exports = { contexts, sample, table, lint, toMarkdown, RULES, castStatic, playerAddress, witnessStatic, witnessTexts, witnessWordProblems };
