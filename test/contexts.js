// Where each card actually fires. Plays seeded careers with three bots across all origins, alone
// and with a batchmate, and records, per card, the contexts it appears in: rank range, age range,
// origins, acts, the player's seniority, montage habits, and for consequence cards the years since
// the choice that scheduled them. It does the same for the batchmate's log lines, and checks the
// service's age floors for the player and the batchmate alike.
// Card text must make sense in every context listed here; the content auditor reads this table,
// and --check runs a phrase lint over all text against it (exit 1 on any contradiction).
//
//   node test/contexts.js [runsPerBotPerOrigin=600] [--json FILE] [--md FILE] [--check]
const fs = require('fs'), path = require('path');
const H = require('../harness');

const BOTS = {
  random: null,
  optimiser: f => (f.competence||0)*1.6 + (f.standing||0)*1.5 + (f.reputation||0)*1.2 + (f.cep||0)*14 - (f.heat||0)*0.6,
  winner: f => (f.cep||0)*60 + (f.standing||0)*1.5 + (f.competence||0)*1.4 + (f.reputation||0)*1.3 - (f.heat||0)*0.8
};
const ORIGINS = ['scholar', 'grad', 'poly'];
const MONTAGE = '__montage:';

// Plays the careers once and returns everything the table and the lint need.
function sample(build, n = 600, opts = {}) {
  const modes = opts.rival === 'off' ? [false] : opts.rival === 'on' ? [true] : [false, true];
  const cards = {}, lines = {}, floors = [];
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
    let run = H.newRun(origin, i * 7 + 3, { build, name: 'Sim', rival });
    const scheduledAt = [];   // { eventId, fireYear, year }
    while (run.phase !== 'ending' && run.turn < 95) {
      const S = run.S, ev = H.currentEvent(build, S);
      const base = ev.id.startsWith(MONTAGE) ? ev.id.slice(MONTAGE.length) : ev.id;
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
  return { cards, lines, floors };
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
  // every version of the card is shown in the same contexts as the card itself
  for (const v of e.variants || []) { out.push(v.title, v.body); for (const c of v.choices || []) out.push(c.text, c.outcome); }
  const m = e.montageLines;
  if (m) out.push(...(Array.isArray(m) ? m : Object.values(m).flat()));
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
  const jsonOut = flag('--json'), mdOut = flag('--md'), check = has('--check');
  const N = +argv[0] || 600;
  const build = H.loadBuild();
  const smp = sample(build, N);
  const t = table(build, smp);
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(t, null, 1) + '\n');
  const md = toMarkdown(t);
  if (mdOut) fs.writeFileSync(mdOut, md); else if (!check) process.stdout.write(md);
  if (check) {
    const problems = lint(build, smp);
    const cards = Object.keys(t).length, lineKeys = Object.keys(smp.lines).length;
    if (problems.length) {
      console.log(`✗ ${problems.length} immersion contradictions:`);
      problems.forEach(p => console.log('  ' + p));
      process.exitCode = 1;
    } else console.log(`✓ no immersion contradictions: ${cards} cards and ${lineKeys} batchmate lines checked against where they fire; age floors held`);
  }
}

module.exports = { contexts, sample, table, lint, toMarkdown, RULES };
