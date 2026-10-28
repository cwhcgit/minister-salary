// How varied is a playthrough, and does a second career replay the first?
// Plays "players" who each play several careers in a row on the same phone, with and without the
// phone's freshness memory (cards and card versions seen in the last two runs are drawn less, and
// another version of a card is preferred). Reports, per bot and origin:
//   cards in the pool, taps and distinct cards per run, and how often a full card replays a scene
//     the same run already showed,
//   next-run overlap: share of a run's cards that the previous run also showed (by card, and by
//     scene, i.e. card + version),
//   the spine: non-structural cards (not priority, not triggered) shown in more than 60% of runs,
//     by card and by scene (a card with versions spreads across them).
//
//   node test/variety.js [players=120] [runsEach=4] [--json FILE]
const H = require('../harness');
const fs = require('fs');

const argv = process.argv.slice(2);
const jsonAt = argv.indexOf('--json');
const jsonOut = jsonAt >= 0 ? argv.splice(jsonAt, 2)[1] : null;
const PLAYERS = +argv[0] || 120, RUNS = +argv[1] || 4;
const build = H.loadBuild();
const C = build.content;
const structural = new Set(C.events.filter(e => e.priority || e.triggered).map(e => e.id));
const pool = C.events.length;

const BOTS = {
  random: null,
  sensible: f => (f.standing || 0) * 1.2 + (f.competence || 0) + (f.reputation || 0) + (f.integrity || 0) * 0.8 + (f.cep || 0) * 15 - (f.heat || 0) * 0.7
};

function career(origin, seed, recent, score) {
  const r = H.rng((seed * 97 + 13) >>> 0);
  let run = H.newRun(origin, seed, { build, recent });
  while (run.phase !== 'ending' && run.turn < 95) {
    const live = H.choices(run).filter(c => c.available), ev = H.currentEvent(build, run.S);
    let pick;
    if (!score) pick = live[Math.floor(r() * live.length)].id;
    else {
      let best = -Infinity;
      for (const c of live) {
        const ch = ev.choices['ABCDEFGH'.indexOf(c.id)];
        const v = score(ch.effects || {}) + (r() - 0.5) * 8 - (ch.privateSector ? 30 : 0);
        if (v > best) { best = v; pick = c.id; }
      }
    }
    run = H.step(run, pick);
  }
  const t = H.trace(run);
  const turns = t.turns.filter(x => !x.event.id.startsWith('__'));
  return {
    cards: new Set(turns.map(x => x.event.id)),
    scenes: new Set(turns.map(x => x.event.id + '#' + (x.event.variant || 0))),
    taps: t.turns.length,
    cardTaps: turns.length,
    recentNext: build.engine.recentKeys(C, run.S)
  };
}

function measure(score, origin, fresh) {
  const runs = [], overlapCards = [], overlapScenes = [];
  for (let p = 0; p < PLAYERS; p++) {
    let memory = [];   // [last run keys, run before keys]
    let prev = null;
    for (let k = 0; k < RUNS; k++) {
      const seed = (p * 1009 + k * 7 + 3) >>> 0;
      const c = career(origin, seed, fresh ? memory.flat() : [], score);
      runs.push(c);
      if (prev) {
        overlapCards.push([...c.cards].filter(x => prev.cards.has(x)).length / Math.max(1, c.cards.size));
        overlapScenes.push([...c.scenes].filter(x => prev.scenes.has(x)).length / Math.max(1, c.scenes.size));
      }
      prev = c;
      memory = [c.recentNext, memory[0] || []].slice(0, 2);
    }
  }
  const avg = a => a.reduce((n, x) => n + x, 0) / Math.max(1, a.length);
  const seen = {};
  for (const r of runs) for (const id of r.cards) seen[id] = (seen[id] || 0) + 1;
  const spineOf = counts => Object.entries(counts).filter(([id, n]) => !structural.has(id.split('#')[0]) && n / runs.length > 0.6)
    .sort((a, b) => b[1] - a[1]).map(([id, n]) => `${id} ${Math.round(100 * n / runs.length)}%`);
  const seenScene = {};
  for (const r of runs) for (const id of r.scenes) seenScene[id] = (seenScene[id] || 0) + 1;
  const spine = spineOf(seen), spineScenes = spineOf(seenScene);
  return {
    taps: +avg(runs.map(r => r.taps)).toFixed(1),
    distinct: +avg(runs.map(r => r.cards.size)).toFixed(1),
    // full cards that replay a scene this same run already showed
    repeatWithin: Math.round(100 * avg(runs.map(r => 1 - r.scenes.size / Math.max(1, r.cardTaps)))),
    overlapCards: Math.round(100 * avg(overlapCards)),
    overlapScenes: Math.round(100 * avg(overlapScenes)),
    cardsSeenEver: Object.keys(seen).length,
    spine, spineScenes
  };
}

const out = { pool, players: PLAYERS, runsEach: RUNS, results: {} };
console.log(`cards in the pool: ${pool} (plus ${(C.rival && C.rival.events || []).length} batchmate cards); ${PLAYERS} players x ${RUNS} careers each`);
for (const [bot, score] of Object.entries(BOTS)) for (const origin of ['grad', 'poly', 'scholar']) {
  const off = measure(score, origin, false), on = measure(score, origin, true);
  out.results[`${bot}/${origin}`] = { off, on };
  console.log(`${bot.padEnd(9)} ${origin.padEnd(8)} taps ${on.taps}, distinct cards ${on.distinct}, ${on.repeatWithin}% of full cards replay a scene from earlier in the run; next run repeats ${off.overlapCards}% of cards / ${off.overlapScenes}% of scenes without memory, ${on.overlapCards}% / ${on.overlapScenes}% with it`);
  console.log(`${''.padEnd(18)} cards in >60% of runs: ${on.spine.join(', ') || 'none'}`);
  console.log(`${''.padEnd(18)} scenes (card#version) in >60% of runs: ${on.spineScenes.join(', ') || 'none'}`);
}
if (jsonOut) { fs.writeFileSync(jsonOut, JSON.stringify(out, null, 1) + '\n'); console.log(`written to ${jsonOut}`); }
