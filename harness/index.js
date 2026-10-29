// Playtest harness: drives the web build's rules engine headlessly and keeps two records
// of every run, strictly apart.
//
//   screen(run)  what the phone would show. The only thing a blind agent ever receives.
//   trace(run)   everything else: ids, effect numbers, CEP, Heat, flags, RNG outcomes.
//
// A run replays exactly from (build hash, origin, seed, choice list), and its screens from the
// player's name and gender as well.
//
//   const H = require("./harness");
//   let run = H.newRun("grad", 42, { name: "Tan Wei Ming", gender: "m" });
//   while (run.phase !== "ending") run = H.step(run, H.choices(run)[0].id);
//   H.trace(run);
//
// No dependencies beyond Node itself.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const View = require("./screen");
const Packs = require("../web/packs");

const WEB = path.join(__dirname, "..", "web");
const CANARIES = path.join(__dirname, "canaries.json");
const STATS = ["reputation", "standing", "integrity", "competence"];
const TRACKED = [...STATS, "wealth", "heat", "cep", "rank"];

// --- builds ------------------------------------------------------------
// A build is one engine + one content set. Its hash is stamped on every run, so results
// from different content versions are never mixed.
const builds = new Map();
let defaultBuild = null;

function loadBuild(opts = {}) {
  const root = path.resolve(opts.root || WEB);
  const engineSrc = fs.readFileSync(path.join(root, "engine.js"), "utf8");
  const read = f => JSON.parse(fs.readFileSync(path.join(root, f), "utf8"));
  const has = f => fs.existsSync(path.join(root, f));
  // the optional batchmate's cards and lines (absent in older builds and proposal copies)
  const rival = has("content/rival.json") ? read("content/rival.json") : null;
  // content packs, listed in the manifest (absent in older builds and proposal copies)
  const manifest = has(Packs.DIR + "manifest.json") ? read(Packs.DIR + "manifest.json") : { packs: [] };
  const packs = (manifest.packs || []).map(id => read(Packs.DIR + id + ".json"));
  const content = Packs.assemble(read("content/game.json"), read("content/events.json"), packs, rival);
  if (opts.canaries) content.events.push(...JSON.parse(fs.readFileSync(CANARIES, "utf8")));

  const hash = crypto.createHash("sha256")
    .update(engineSrc).update("\0").update(JSON.stringify(content))
    .digest("hex").slice(0, 12);
  if (builds.has(hash)) return builds.get(hash);

  // Evaluate the engine source directly rather than require() it, so two builds from the
  // same path (before and after a proposal) never share a module cache entry.
  const mod = { exports: {} };
  new Function("module", "exports", engineSrc)(mod, mod.exports);
  const build = { hash, root, engine: mod.exports, content, canaries: !!opts.canaries };
  builds.set(hash, build);
  return build;
}

function getBuild(hash) {
  if (hash) {
    const b = builds.get(hash);
    if (!b) throw new Error(`build ${hash} is not loaded; call loadBuild() with the same root and options first`);
    return b;
  }
  return defaultBuild || (defaultBuild = loadBuild());
}

// Seeded RNG for bots and samplers (same generator the engine uses).
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- run lifecycle -----------------------------------------------------
// A run is plain JSON (safe to log or persist). Every function returns a new run.

function snapshot(S) {
  const o = {};
  for (const k of TRACKED) o[k] = S[k];
  return o;
}

function currentEvent(build, S) {
  if (build.engine.eventOf) return build.engine.eventOf(build.content, S);   // quiet and montage years too
  if (S.currentEvent === "__quiet") return build.engine.QUIET;
  return build.content.events.find(e => e.id === S.currentEvent);
}

// Scheduled entries in `a` that are not in `b`, counting duplicates.
function minus(a, b) {
  const left = b.map(x => x.eventId + "@" + x.fireYear);
  return a.filter(x => {
    const i = left.indexOf(x.eventId + "@" + x.fireYear);
    if (i < 0) return true;
    left.splice(i, 1);
    return false;
  });
}

// Draw the next event and note where it came from: a consequence firing, a priority
// event, the random pool, or the empty-pool safety net. More than one consequence can
// fall due in the same year; the engine fires the earliest and carries the rest over.
// `dropped` should therefore always be empty; it is kept as a check.
function draw(build, S) {
  const n = build.engine.nextEvent(build.content, S);
  const removed = minus(S.scheduled, n.state.scheduled);
  let source = n.event.id === "__quiet" ? "quiet" : n.event.priority ? "priority" : "random";
  let fired = null, dropped = [];
  if (removed.length) {
    // a scheduled card may fire as one of its alternates (the variant written for the player's rank)
    const base = build.content.events.find(e => e.id === removed[0].eventId);
    if (removed[0].eventId === n.event.id || (base && (base.alternates || []).includes(n.event.id))) {
      source = "scheduled"; fired = removed[0]; dropped = removed.slice(1);
    }
    else dropped = removed;
  }
  const deferred = n.state.scheduled.filter(x => x.fireYear <= S.year);   // due, waiting their turn
  return { S: n.state, draw: { source, fired, late: fired ? S.year - fired.fireYear : 0, dropped, deferred } };
}

function newRun(origin, seed, opts = {}) {
  const build = opts.build || getBuild(opts.buildHash);
  if (!build.content.origins.some(o => o.id === origin)) throw new Error(`unknown origin ${origin}`);
  // opts.recent: card ids and versions from the player's last runs (the phone's freshness memory)
  const recent = Array.isArray(opts.recent) ? opts.recent : [];
  // opts.name and opts.gender (a key of game.json player.genders; the engine falls back to the
  // table's default): the start screen's fields. A blank name is drawn for the gender, as on the
  // phone. Text only: the same seed plays the same either way.
  const blank = build.engine.player ? "" : "You";   // an older build's placeholder for a blank name
  const S0 = build.engine.newGame(build.content, origin, opts.name || blank, seed >>> 0, { rival: !!opts.rival, recent, gender: opts.gender });
  const { S, draw: d } = draw(build, S0);
  return {
    buildHash: build.hash, origin, seed: seed >>> 0, name: S.name, gender: S.gender || null, rival: !!opts.rival, recent,
    turn: 1, phase: S.ending ? "ending" : "event",
    S, pendingDraw: d,
    last: null,          // { outcome, log, prev } shown on the next screen
    choiceList: [],      // the replay key
    turns: [],           // full trace records, one per turn
    start: { cep: S0.cep, ministry: S0.ministry, stats: snapshot(S0) }
  };
}

// The choices on the screen, lettered as shown: only those the player can take (a choice the
// player lacks the stats for is not on the card at all). Each is { id, text }.
function choices(run) {
  if (run.phase !== "event") return [];
  const build = getBuild(run.buildHash);
  return View.eventCard(build, run.S, currentEvent(build, run.S)).choices;
}

// The card's choices as the screen letters them: shown[k] is the index in ev.choices of the k-th
// button. (The engine already leaves off what cannot be taken; an older build's card still lists
// it, and the screen skips it.)
const shownChoices = (build, S, ev) => ev.choices.map((_, j) => j).filter(j => build.engine.choiceAvailable(ev.choices[j], S));
// The card's own letter for a choice: a series' second showing puts the habit first, and a choice
// left off the card moves the ones after it up (ev.order maps each button back).
const ownLetter = (ev, i) => View.LETTERS[ev.order ? ev.order[i] : i];

function sibling(build, S, ev, i, k) {
  return { id: View.LETTERS[k], own: ownLetter(ev, i), available: true, effects: ev.choices[i].effects || {} };
}

// choiceId: a letter as the screen shows it ("A", "B"...), or a number, the choice's index in the
// card as engine.eventOf gives it.
function step(run, choiceId) {
  if (run.phase !== "event") throw new Error(`run is in phase ${run.phase}; nothing to choose`);
  const build = getBuild(run.buildHash);
  const ev = currentEvent(build, run.S);
  const shown = shownChoices(build, run.S, ev);
  const i = typeof choiceId === "number" ? choiceId : shown[View.LETTERS.indexOf(String(choiceId).trim().toUpperCase())];
  const ch = ev.choices[i];
  if (!ch || !shown.includes(i)) throw new Error(`no choice ${choiceId} on ${ev.id}`);
  const k = shown.indexOf(i);   // the button, as the screen letters it

  const pre = run.S;
  const r = build.engine.advance(build.content, pre, i);
  let S = r.state, nextDraw = null;
  if (!S.ending && S.currentEvent && r.trace.nextDraw) {
    // advance() passed any decision-free years and drew the next card itself
    const d = r.trace.nextDraw;
    nextDraw = { source: d.source, fired: d.fired || null, late: d.fired ? S.year - d.fired.fireYear : 0,
                 dropped: [], deferred: S.scheduled.filter(x => x.fireYear <= S.year) };
  } else if (!S.ending) ({ S, draw: nextDraw } = draw(build, S));
  const passed = (r.trace.passed || []).map(p => ({ kind: p.kind, event: p.ev, source: p.source, fired: p.fired,
    added: p.added || [], election: p.election || null, appraisal: p.appraisal ? p.appraisal.grade : null,
    promotion: p.promotion ? p.promotion.result : null, probation: !!p.probation,
    age: p.age, rank: p.rank, habit: p.habit }));

  const before = snapshot(pre), after = snapshot(S);
  const delta = {};
  for (const k of TRACKED) if (after[k] !== before[k]) delta[k] = after[k] - before[k];
  // what this turn scheduled, the chosen card and any years that passed after it
  const addedSched = r.trace.added || r.trace.passed
    ? [...(r.trace.added || []), ...passed.flatMap(p => p.added)]
    : minus(r.state.scheduled, pre.scheduled);
  const promo = r.trace.promotion;

  const rec = {
    turn: run.turn, year: pre.year, age: pre.age,
    act: actOf(ev, pre),
    event: { id: ev.id, ...run.pendingDraw, once: !!ev.once, filler: ev.id !== "__quiet" && !ev.once && !ev.triggered,
             montage: ev.id.startsWith("__montage:"), variant: ev.variant || 0,
             repeat: ev.id.startsWith("__montage:") || run.turns.some(t => t.event.id === ev.id),
             // the scene as shown: which part options were assembled, and which of the run's people it named
             ...(ev.picked ? { parts: ev.picked } : {}),
             ...(ev.who ? { cast: castNames(pre, ev.who) } : {}) },
    // id: the letter on the screen; own: the card's own letter for it (what metrics count by)
    choice: { id: View.LETTERS[k], own: ownLetter(ev, i), index: i, effects: ch.effects || {},
              available: shown.map((_, j) => View.LETTERS[j]) },
    siblings: shown.map((j, n) => sibling(build, pre, ev, j, n)),
    before, after, delta,
    flagsSet: S.flags.filter(f => !pre.flags.includes(f)),
    castOps: r.trace.cast || null,                 // what the choice did to or for the run's people
    flagsCleared: pre.flags.filter(f => !S.flags.includes(f)),
    scheduled: addedSched,
    scheduleMissed: (ch.schedule || []).filter(sc => !addedSched.some(a => a.eventId === sc.eventId)),
    election: r.trace.election || null,
    passed, yearsPassed: passed.length,                  // decision-free years after this card
    passElection: passed.map(p => p.election).filter(Boolean).pop() || null,
    bonusMissed: !!r.trace.bonusMissed, probation: !!r.trace.probation,
    rivalContest: r.trace.rivalContest || null,   // a batchmate card decided on the spot
    ranking: r.trace.ranking || null,             // the ranking exercise: one slot, two promotable officers
    // base: what the stats alone were worth (no luck, no "noted" choice, no hidden witness)
    appraisal: r.trace.appraisal ? { ...r.trace.appraisal, base: r.trace.appraisal.score - r.trace.appraisal.noise - (r.trace.appraisal.noted || 0) - (r.trace.appraisal.witness || 0) } : null,
    witnesses: r.trace.witness || null,           // who noticed this choice: type, appraisal points, when it lands
    promotion: promo ? { ...promo, why: promotionWhy(promo, r.trace.appraisal, pre) } : null,
    log: r.log.map(l => l.kind),
    ending: S.ending || null
  };

  return {
    ...run,
    turn: run.turn + 1,
    phase: S.ending ? "ending" : "event",
    S, pendingDraw: nextDraw,
    last: { outcome: r.outcome, log: r.log, prev: before, head: r.head || null },
    choiceList: run.choiceList.concat(View.LETTERS[k]),
    turns: run.turns.concat([rec])
  };
}

// role -> { id, name } for the people a card named (the trace's view of the cast)
function castNames(S, who) {
  const all = S.cast ? Object.values(S.cast.on).concat(S.cast.past).filter(Boolean) : [];
  return Object.fromEntries(Object.entries(who).map(([role, id]) => {
    const p = all.find(x => x.id === id);
    return [role, { id, name: p ? p.nm.full : null, rank: p ? p.rank : null }];
  }));
}

function actOf(ev, S) {
  if (["tea_session", "the_vetting", "the_election"].includes(ev.id)) return "II";
  return S.rank >= 8 ? "III" : "I";
}

function promotionWhy(p, appraisal, pre) {
  if (p.result !== "not_eligible") return p.result;
  const why = [];
  if (!p.gradeOk) why.push(appraisal.grade === "B+" && p.rank >= 13 ? "B+ is not enough at Cabinet rungs" : `grade ${appraisal.grade}`);
  if (p.yearsInGrade < p.needYears) why.push(`${p.yearsInGrade}/${p.needYears} years in grade`);
  if (p.rank >= 16) why.push("top of the ladder");
  return why.join("; ");
}

// --- the two views -----------------------------------------------------

// Screen view. On the phone, a turn is two screens: the outcome of last year's choice (as
// pages: the outcome, then one page per year, each under a header dated to that year), then this
// year's event card under the current header. The agent view joins them, in that order:
// the outcome's pages, then this year's card.
// opts.view: "agent" (merged, default) | "event" | "outcome" (each phone screen alone).
function screen(run, opts = {}) {
  const build = getBuild(run.buildHash);
  const S = run.S;
  const view = opts.view || "agent";
  const outcome = () => View.outcomeCard(run.last.outcome, run.last.log, run.last.head, View.header(build, S));
  // the phone shows the last choice's outcome (and the last year-end review) before the ending
  // card, as one more outcome screen: the agent view merges the two, as it does every year
  if (run.phase === "ending") {
    const end = { phase: "ending" };
    if (run.last && view !== "event") end.outcome = outcome();
    if (view !== "outcome") end.ending = View.endingCard(build, S);
    return end;
  }
  const out = { phase: "event" };
  if (run.turn === 1 && view === "agent") out.start = View.startCard(build, run.origin, run.rival, { name: run.name, gender: run.gender });
  if (run.last && view !== "event") out.outcome = outcome();
  if (view !== "outcome") { out.header = View.header(build, S); out.event = View.eventCard(build, S, currentEvent(build, S)); }
  return out;
}

function screenText(run, opts = {}) {
  return View.toText(screen(run, opts), opts);
}

// Full trace: per-turn records plus a run summary with the cause chain behind the ending.
function trace(run) {
  const build = getBuild(run.buildHash);
  const S = run.S;
  return {
    buildHash: run.buildHash, origin: run.origin, seed: run.seed, name: run.name, gender: run.gender || null,
    rival: run.rival || false, batchmate: S.rival || null,   // the batchmate's hidden file, if any
    cast: S.cast || null,                                     // the run's people: who held each role, and what happened to them
    recent: run.recent || [],                                 // freshness memory the run started with (replay key)
    exceptional: S.flags.includes("exceptional") ? (S.exceptionalAt || true) : null,
    choices: run.choiceList,
    start: run.start,
    ending: S.ending || null,
    endingCause: S.ending ? endingCause(build, run) : null,
    final: { ...snapshot(S), age: S.age, year: S.year, flags: S.flags, pendingScheduled: S.scheduled },
    turns: run.turns
  };
}

function replay(spec, opts = {}) {
  const build = opts.build || getBuild(spec.buildHash);
  if (spec.buildHash && spec.buildHash !== build.hash)
    throw new Error(`run was recorded on build ${spec.buildHash}, this build is ${build.hash}`);
  let run = newRun(spec.origin, spec.seed, { build, name: spec.name, gender: spec.gender, rival: !!spec.rival, recent: spec.recent || [] });
  for (const c of spec.choices) run = step(run, c);
  return run;
}

// --- why the run ended ---------------------------------------------------
// A choice is "risky" for an ending if an available sibling was safer on what drove that
// ending. The engine's appraisal weights are needed to judge that for the quiet ending;
// test/harness.test.js checks they still match engine.js.
const APPRAISAL_WEIGHTS = { competence: 0.50, standing: 0.30, reputation: 0.15 };
const appraisalValue = fx => Object.entries(APPRAISAL_WEIGHTS).reduce((n, [k, w]) => n + (fx[k] || 0) * w, 0);

function riskyOn(t, value, worseIfLower, margin = 0) {
  const mine = value(t.choice.effects);
  return t.siblings.some(s => s.available && s.id !== t.choice.id &&
    (worseIfLower ? value(s.effects) - mine > margin : mine - value(s.effects) > margin));
}

// kind: "choice"       a risky choice the player made is enough to explain the ending
//       "choice+luck"  a risky choice is in the chain, but a roll decided it
//       "luck"         no risky choice; a roll decided it
//       "drift"        no risky choice and no decisive roll (starting stats, forced effects)
//       "outcome"      not a loss (PM, retirement, declining the tea)
function endingCause(build, run) {
  const turns = run.turns, end = run.S.ending;
  const cMin = build.content.grades.find(g => g.code === "C").min;
  if (end === "scandal") {
    const chain = turns.filter(t => (t.choice.effects.heat || 0) > 0).map(t => ({
      turn: t.turn, event: t.event.id, choice: t.choice.id, heat: t.choice.effects.heat,
      risky: riskyOn(t, fx => fx.heat || 0, false)
    }));
    return { kind: chain.some(c => c.risky) ? "choice" : "drift", driver: "heat", chain };
  }
  if (end === "quiet") {
    const ds = turns.filter(t => t.appraisal).slice(-2);
    const luck = ds.some(t => t.appraisal.base >= cMin);
    const firstD = ds.length ? ds[0].turn : run.turn;
    const chain = turns.filter(t => t.turn >= firstD - 3 && appraisalValue(t.choice.effects) < 0).map(t => ({
      turn: t.turn, event: t.event.id, choice: t.choice.id, appraisalEffect: +appraisalValue(t.choice.effects).toFixed(2),
      risky: riskyOn(t, appraisalValue, true, 1)
    }));
    const risky = chain.some(c => c.risky);
    return { kind: risky ? (luck ? "choice+luck" : "choice") : (luck ? "luck" : "drift"), driver: "appraisal",
             appraisals: ds.map(t => ({ turn: t.turn, grade: t.appraisal.grade, base: +t.appraisal.base.toFixed(1), noise: +t.appraisal.noise.toFixed(1) })),
             chain };
  }
  if (end === "lostward") {
    const el = turns[turns.length - 1];
    const e = el.election || el.passElection;   // a safe re-election can be lost in a year that passed by itself
    const smc = e.kind === "smc" && el.choice.available.length > 1;
    return { kind: smc ? "choice+luck" : "luck", driver: "election",
             chain: [{ turn: el.turn, event: el.election ? el.event.id : "re_election", choice: el.election ? el.choice.id : "auto", kind: e.kind, chance: +e.chance.toFixed(3), risky: smc }] };
  }
  const chain = turns.filter(t => t.promotion && t.promotion.result.startsWith("promoted"))
    .map(t => ({ turn: t.turn, rank: t.after.rank }));
  return { kind: "outcome", driver: end, chain };
}

module.exports = {
  loadBuild, getBuild, newRun, screen, screenText, choices, step, trace, replay, rng, currentEvent,
  endingCause, STATS, APPRAISAL_WEIGHTS
};
