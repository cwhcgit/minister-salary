// Playtest harness: drives the web build's rules engine headlessly and keeps two records
// of every run, strictly apart.
//
//   screen(run)  what the phone would show. The only thing a blind agent ever receives.
//   trace(run)   everything else: ids, effect numbers, CEP, Heat, flags, RNG outcomes.
//
// A run replays exactly from (build hash, origin, seed, choice list).
//
//   const H = require("./harness");
//   let run = H.newRun("grad", 42);
//   while (run.phase !== "ending") run = H.step(run, H.choices(run).find(c => c.available).id);
//   H.trace(run);
//
// No dependencies beyond Node itself.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const View = require("./screen");

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
  const content = JSON.parse(fs.readFileSync(path.join(root, "content/game.json"), "utf8"));
  content.events = JSON.parse(fs.readFileSync(path.join(root, "content/events.json"), "utf8"));
  // the optional batchmate's cards and lines (absent in older builds and proposal copies)
  const rivalFile = path.join(root, "content/rival.json");
  if (fs.existsSync(rivalFile)) content.rival = JSON.parse(fs.readFileSync(rivalFile, "utf8"));
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
  const S0 = build.engine.newGame(build.content, origin, opts.name || "You", seed >>> 0, { rival: !!opts.rival });
  const { S, draw: d } = draw(build, S0);
  return {
    buildHash: build.hash, origin, seed: seed >>> 0, name: S.name, rival: !!opts.rival,
    turn: 1, phase: S.ending ? "ending" : "event",
    S, pendingDraw: d,
    last: null,          // { outcome, log, prev } shown on the next screen
    choiceList: [],      // the replay key
    turns: [],           // full trace records, one per turn
    start: { cep: S0.cep, ministry: S0.ministry, stats: snapshot(S0) }
  };
}

function choices(run) {
  if (run.phase !== "event") return [];
  const build = getBuild(run.buildHash);
  return View.eventCard(build, run.S, currentEvent(build, run.S)).choices;
}

function sibling(build, S, ev, i) {
  const c = ev.choices[i];
  return { id: View.LETTERS[i], available: build.engine.choiceAvailable(c, S), effects: c.effects || {} };
}

function step(run, choiceId) {
  if (run.phase !== "event") throw new Error(`run is in phase ${run.phase}; nothing to choose`);
  const build = getBuild(run.buildHash);
  const ev = currentEvent(build, run.S);
  const i = typeof choiceId === "number" ? choiceId : View.LETTERS.indexOf(String(choiceId).trim().toUpperCase());
  const ch = ev.choices[i];
  if (!ch) throw new Error(`no choice ${choiceId} on ${ev.id}`);
  if (!build.engine.choiceAvailable(ch, run.S)) throw new Error(`choice ${View.LETTERS[i]} on ${ev.id} is locked`);

  const pre = run.S;
  const r = build.engine.advance(build.content, pre, i);
  let S = r.state, nextDraw = null;
  if (!S.ending) ({ S, draw: nextDraw } = draw(build, S));

  const before = snapshot(pre), after = snapshot(S);
  const delta = {};
  for (const k of TRACKED) if (after[k] !== before[k]) delta[k] = after[k] - before[k];
  const addedSched = minus(r.state.scheduled, pre.scheduled);
  const promo = r.trace.promotion;

  const rec = {
    turn: run.turn, year: pre.year, age: pre.age,
    act: actOf(ev, pre),
    event: { id: ev.id, ...run.pendingDraw, once: !!ev.once, filler: ev.id !== "__quiet" && !ev.once && !ev.triggered,
             montage: ev.id.startsWith("__montage:"),
             repeat: ev.id.startsWith("__montage:") || run.turns.some(t => t.event.id === ev.id) },
    choice: { id: View.LETTERS[i], index: i, effects: ch.effects || {},
              available: ev.choices.map((_, j) => sibling(build, pre, ev, j)).filter(x => x.available).map(x => x.id) },
    siblings: ev.choices.map((_, j) => sibling(build, pre, ev, j)),
    before, after, delta,
    flagsSet: S.flags.filter(f => !pre.flags.includes(f)),
    flagsCleared: pre.flags.filter(f => !S.flags.includes(f)),
    scheduled: addedSched,
    scheduleMissed: (ch.schedule || []).filter(sc => !addedSched.some(a => a.eventId === sc.eventId)),
    election: r.trace.election || null,
    rivalContest: r.trace.rivalContest || null,   // a batchmate card decided on the spot
    ranking: r.trace.ranking || null,             // the ranking exercise: one slot, two promotable officers
    appraisal: r.trace.appraisal ? { ...r.trace.appraisal, base: r.trace.appraisal.score - r.trace.appraisal.noise - (r.trace.appraisal.noted || 0) } : null,
    promotion: promo ? { ...promo, why: promotionWhy(promo, r.trace.appraisal, pre) } : null,
    log: r.log.map(l => l.kind),
    ending: S.ending || null
  };

  return {
    ...run,
    turn: run.turn + 1,
    phase: S.ending ? "ending" : "event",
    S, pendingDraw: nextDraw,
    last: { outcome: r.outcome, log: r.log, prev: before },
    choiceList: run.choiceList.concat(View.LETTERS[i]),
    turns: run.turns.concat([rec])
  };
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

// Screen view. On the phone, a turn is two screens: the outcome of last year's choice
// (with the stat changes it caused), then this year's event card. They show the same
// header, so the agent view merges them: header, last year's outcome, this year's card.
// opts.view: "agent" (merged, default) | "event" | "outcome" (each phone screen alone).
function screen(run, opts = {}) {
  const build = getBuild(run.buildHash);
  const S = run.S;
  if (run.phase === "ending") return { phase: "ending", ending: View.endingCard(build, S) };
  const view = opts.view || "agent";
  const out = { phase: "event" };
  if (run.turn === 1 && view === "agent") out.start = View.startCard(build, run.origin, run.rival);
  const showOutcome = run.last && view !== "event";
  out.header = View.header(build, S, showOutcome ? run.last.prev : null);
  if (showOutcome) out.outcome = View.outcomeCard(run.last.outcome, run.last.log);
  if (view !== "outcome") out.event = View.eventCard(build, S, currentEvent(build, S));
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
    buildHash: run.buildHash, origin: run.origin, seed: run.seed, name: run.name,
    rival: run.rival || false, batchmate: S.rival || null,   // the batchmate's hidden file, if any
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
  let run = newRun(spec.origin, spec.seed, { build, name: spec.name, rival: !!spec.rival });
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
    const smc = el.election.kind === "smc" && el.choice.available.length > 1;
    return { kind: smc ? "choice+luck" : "luck", driver: "election",
             chain: [{ turn: el.turn, event: el.event.id, choice: el.choice.id, kind: el.election.kind, chance: +el.election.chance.toFixed(3), risky: smc }] };
  }
  const chain = turns.filter(t => t.promotion && t.promotion.result.startsWith("promoted"))
    .map(t => ({ turn: t.turn, rank: t.after.rank }));
  return { kind: "outcome", driver: end, chain };
}

module.exports = {
  loadBuild, getBuild, newRun, screen, screenText, choices, step, trace, replay, rng, currentEvent,
  endingCause, STATS, APPRAISAL_WEIGHTS
};
