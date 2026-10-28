// How varied is a playthrough, and does a second career replay the first?
// Plays "players" who each play several careers in a row on the same phone, with and without the
// phone's freshness memory (cards and card versions seen in the last two runs are drawn less, and
// another version of a card is preferred). Reports, per bot and origin:
//   cards in the pool, taps and distinct cards per run, and how often a full card replays a scene
//     the same run already showed,
//   next-run overlap: share of a run's cards that the previous run also showed, at three levels:
//     card (the id), version (card + variant + part combination: the same words), and scene
//     (version + the cast it named: the same words about the same people),
//   the spine: non-structural cards (not priority, not triggered) shown in more than 60% of runs,
//     by card and by scene (a card with versions spreads across them),
//   repeats inside one run: how often an office holder's career shows the Indicators in full and
//     lets them pass, and the Meanwhile lines a run shows (how many, how many different).
//
//   node test/variety.js [players=120] [runsEach=4] [--json FILE] [--content DIR]
const H = require('../harness');
const fs = require('fs');

const argv = process.argv.slice(2);
const jsonAt = argv.indexOf('--json');
const jsonOut = jsonAt >= 0 ? argv.splice(jsonAt, 2)[1] : null;
const contentAt = argv.indexOf('--content');
const contentDir = contentAt >= 0 ? argv.splice(contentAt, 2)[1] : null;
const PLAYERS = +argv[0] || 120, RUNS = +argv[1] || 4;
const build = H.loadBuild(contentDir ? { root: contentDir } : {});
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
  const meanwhile = [];
  let office = false;
  while (run.phase !== 'ending' && run.turn < 95) {
    if (run.S.rank >= 11) office = true;
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
    for (const l of run.last.log) if (l.kind === 'meanwhile' && !/^(Age \d+\. )?Nothing of consequence/.test(l.text)) meanwhile.push(l.text.replace(/^Age \d+\. /, ''));
  }
  const t = H.trace(run);
  const indicators = id => /^the_indicators/.test(id);
  const turns = t.turns.filter(x => !x.event.id.startsWith('__'));
  const version = x => x.event.id + '#' + (x.event.variant || 0) + (x.event.parts ? '~' + Object.entries(x.event.parts).map(([k, v]) => k + '=' + v).join(',') : '');
  const scene = x => version(x) + (x.event.cast ? '@' + Object.entries(x.event.cast).map(([k, v]) => k + '=' + v.name).sort().join(',') : '');
  return {
    cards: new Set(turns.map(x => x.event.id)),
    versions: new Set(turns.map(version)),
    scenes: new Set(turns.map(scene)),
    taps: t.turns.length,
    cardTaps: turns.length,
    recentNext: build.engine.recentKeys(C, run.S),
    office: office || run.S.rank >= 11,
    indicatorsFull: t.turns.filter(x => indicators(x.event.id)).length,
    indicatorsPassed: t.turns.flatMap(x => x.passed).filter(p => indicators(p.event)).length,
    meanwhile: meanwhile.length, meanwhileDistinct: new Set(meanwhile).size
  };
}

function measure(score, origin, fresh) {
  const runs = [], overlapCards = [], overlapVersions = [], overlapScenes = [];
  for (let p = 0; p < PLAYERS; p++) {
    let memory = [];   // [last run keys, run before keys]
    let prev = null;
    for (let k = 0; k < RUNS; k++) {
      const seed = (p * 1009 + k * 7 + 3) >>> 0;
      const c = career(origin, seed, fresh ? memory.flat() : [], score);
      runs.push(c);
      if (prev) {
        overlapCards.push([...c.cards].filter(x => prev.cards.has(x)).length / Math.max(1, c.cards.size));
        overlapVersions.push([...c.versions].filter(x => prev.versions.has(x)).length / Math.max(1, c.versions.size));
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
  for (const r of runs) for (const id of r.versions) seenScene[id] = (seenScene[id] || 0) + 1;
  const spine = spineOf(seen), spineScenes = spineOf(seenScene);
  const office = runs.filter(r => r.office);
  return {
    taps: +avg(runs.map(r => r.taps)).toFixed(1),
    distinct: +avg(runs.map(r => r.cards.size)).toFixed(1),
    // full cards that replay a scene this same run already showed
    repeatWithin: Math.round(100 * avg(runs.map(r => 1 - r.versions.size / Math.max(1, r.cardTaps)))),
    overlapCards: Math.round(100 * avg(overlapCards)),
    overlapVersions: Math.round(100 * avg(overlapVersions)),
    overlapScenes: Math.round(100 * avg(overlapScenes)),
    cardsSeenEver: Object.keys(seen).length,
    spine, spineScenes,
    officeRuns: office.length,
    indicatorsFull: +avg(office.map(r => r.indicatorsFull)).toFixed(2),
    indicatorsFullMax: Math.max(0, ...office.map(r => r.indicatorsFull)),
    indicatorsPassed: +avg(office.map(r => r.indicatorsPassed)).toFixed(2),
    meanwhile: +avg(runs.map(r => r.meanwhile)).toFixed(1),
    meanwhileDistinct: +avg(runs.map(r => r.meanwhileDistinct)).toFixed(1),
    meanwhileRepeatRuns: Math.round(100 * runs.filter(r => r.meanwhileDistinct < r.meanwhile).length / Math.max(1, runs.length))
  };
}

const out = { pool, players: PLAYERS, runsEach: RUNS, results: {} };
console.log(`build ${build.hash}${contentDir ? ` (${contentDir})` : ''}`);
console.log(`cards in the pool: ${pool} (plus ${(C.rival && C.rival.events || []).length} batchmate cards); ${PLAYERS} players x ${RUNS} careers each`);
for (const [bot, score] of Object.entries(BOTS)) for (const origin of ['grad', 'poly', 'scholar']) {
  const off = measure(score, origin, false), on = measure(score, origin, true);
  out.results[`${bot}/${origin}`] = { off, on };
  console.log(`${bot.padEnd(9)} ${origin.padEnd(8)} taps ${on.taps}, distinct cards ${on.distinct}, ${on.repeatWithin}% of full cards replay a version from earlier in the run`);
  console.log(`${''.padEnd(18)} next run repeats (cards / versions / scenes): ${off.overlapCards}% / ${off.overlapVersions}% / ${off.overlapScenes}% without memory, ${on.overlapCards}% / ${on.overlapVersions}% / ${on.overlapScenes}% with it`);
  console.log(`${''.padEnd(18)} cards in >60% of runs: ${on.spine.join(', ') || 'none'}`);
  console.log(`${''.padEnd(18)} versions (card#variant~parts) in >60% of runs: ${on.spineScenes.join(', ') || 'none'}`);
  console.log(`${''.padEnd(18)} the Indicators per office holder's career (${on.officeRuns} careers): ${on.indicatorsFull} in full (most ${on.indicatorsFullMax}), ${on.indicatorsPassed} passed`);
  console.log(`${''.padEnd(18)} Meanwhile lines per run: ${on.meanwhile}, ${on.meanwhileDistinct} different; runs that repeat one: ${on.meanwhileRepeatRuns}%`);
}
if (jsonOut) { fs.writeFileSync(jsonOut, JSON.stringify(out, null, 1) + '\n'); console.log(`written to ${jsonOut}`); }
