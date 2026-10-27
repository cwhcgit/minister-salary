// Balance simulation and fun proxies. No dependencies — run with: node test/sim.js
// Three bots stand in for three kinds of player. The origin difficulty ladder
// (scholar easiest → poly hardest) must hold for random and win-seeking play;
// if a content change inverts it, the change is wrong.
//
//   node test/sim.js [N]                 win rates + fun-proxy metrics (N runs per bot per origin)
//   node test/sim.js regress [N]         the same, then exit 1 if the regression rule fails
//     --json FILE        write the aggregated metrics
//     --content DIR      play another build (a web/ root, e.g. a proposal's patched copy)
//     --baseline FILE    print every metric that moved against an earlier --json
//
// Every run is seeded, the first-timer's choices included, so the same build always
// gives the same numbers.
const path = require('path'), fs = require('fs');
const H = require('../harness');
const { Metrics, regress, flatten, cepRaisingEvents, ORIGINS } = require('./metrics');

const BOTS = {
  "first-timer":    null,                                     // picks at random
  "stat-optimiser": f => (f.competence||0)*1.6 + (f.standing||0)*1.5 + (f.reputation||0)*1.2
                       + (f.cep||0)*14 - (f.heat||0)*0.6,
  "knows the win":  f => (f.cep||0)*60 + (f.standing||0)*1.5 + (f.competence||0)*1.4
                       + (f.reputation||0)*1.3 - (f.heat||0)*0.8
};

const argv = process.argv.slice(2);
const flag = k => { const i = argv.indexOf(k); return i >= 0 ? argv.splice(i, 2)[1] : null; };
const jsonOut = flag('--json'), contentDir = flag('--content'), baseline = flag('--baseline');
const mode = argv[0] === 'regress' ? argv.shift() : 'report';
const N = +argv[0] || 800;

const build = H.loadBuild(contentDir ? { root: contentDir } : {});
const content = build.content;
const cepEvents = content.events.filter(e => cepRaisingEvents(content).includes(e.id));

function play(origin, seed, score) {
  const pickRandom = H.rng((seed * 2654435761) >>> 0);
  let run = H.newRun(origin, seed, { build, name: "Sim" });
  const cepReachable = [];
  for (let t = 0; t < 95 && run.phase !== 'ending'; t++) {
    const S = run.S;
    if (cepEvents.some(e => build.engine.eligible(e, S)) || S.scheduled.some(x => cepEvents.some(e => e.id === x.eventId)))
      cepReachable.push(run.turn);
    const ev = S.currentEvent === '__quiet' ? build.engine.QUIET : content.events.find(e => e.id === S.currentEvent);
    const live = ev.choices.map((c, i) => [c, i]).filter(([c]) => build.engine.choiceAvailable(c, S));
    let pick;
    if (!score) pick = live[Math.floor(pickRandom() * live.length)][1];
    else { let best = -Infinity; for (const [c, i] of live) {
      const v = score(c.effects || {}); if (v > best) { best = v; pick = i; } } }
    run = H.step(run, pick);
  }
  return { trace: H.trace(run), cepReachable };
}

const metrics = new Metrics(content);
for (const [name, score] of Object.entries(BOTS))
  for (const origin of ORIGINS)
    for (let i = 0; i < N; i++) {
      const { trace, cepReachable } = play(origin, i*7+3, score);
      metrics.add(name, trace, { cepReachable });
    }
const m = { build: build.hash, runsPerBotPerOrigin: N, ...metrics.result() };

// --- report ----------------------------------------------------------------
console.log(`build ${build.hash}${contentDir ? ` (${contentDir})` : ''}`);
for (const [name, r] of Object.entries(m.bots)) {
  console.log(`\n=== ${name} (${N} runs each) ===`);
  for (const [o, x] of Object.entries(r.origins))
    console.log(`  ${o.padEnd(8)} PM ${(x.pmRate.toFixed(1)+"%").padEnd(7)}`
      + `median $${(x.medianWealth/1e6).toFixed(1)}M  ${JSON.stringify(x.endings)}`);
}

const ft = m.bots['first-timer'], kw = m.bots['knows the win'];
const line = (label, s) => console.log(`  ${label.padEnd(22)}${s}`);
console.log('\n=== fun proxies ===');
console.log('dead turns (first-timer | knows the win), per act: turns/run, repeat-filler share, dead/run');
for (const act of ['I', 'II', 'III']) {
  const a = ft.deadTurns[act], b = kw.deadTurns[act];
  line(`Act ${act}`, `${a.turnsPerRun} turns, ${a.repeatFillerShare ?? '-'}% repeat filler, ${a.deadPerRun} dead`
    + `  |  ${b.turnsPerRun} turns, ${b.repeatFillerShare ?? '-'}% repeat filler, ${b.deadPerRun} dead`);
}
console.log('run length (first-timer): ' + ORIGINS.map(o => `${o} median ${ft.origins[o].turns.median} (p10 ${ft.origins[o].turns.p10}, p90 ${ft.origins[o].turns.p90}, ${ft.origins[o].turns.inRange35to50}% in 35-50)`).join('; '));

console.log('stat direction (choices in the data that raise / lower):');
for (const [k, d] of Object.entries(m.statDirection))
  line(k, `${d.up} up / ${d.down} down${d.oneDirectional ? '   ← one-directional' : ''}`);

console.log(`dominated choices in the data: ${m.dominance.dominated.length}`);
for (const d of m.dominance.dominated) line('', `${d.event} ${d.dominated} ≤ ${d.by}${d.hiddenConsequences.length ? `  (has ${d.hiddenConsequences.join(', ')})` : ''}`);

console.log(`reach over ${m.reach.runs} runs: never seen ${m.reach.neverSeen.join(', ') || 'none'}; `
  + `rare (<1%) ${m.reach.rare.map(x => `${x.event} ${x.runShare}%`).join(', ') || 'none'}; `
  + `never picked ${m.reach.neverPickedChoices.join(', ') || 'none'}`);

console.log('early losses before 40 (first-timer): share of runs, and share NOT caused by an active choice');
for (const o of ORIGINS) { const e = ft.origins[o].earlyLoss;
  line(o, `${e.rate}% of runs, ${e.notByChoice ?? '-'}% luck/drift  ${JSON.stringify(e.byCause)}`); }

console.log('CEP safeguard (first-timer): runs that hit the ceiling, then share where a CEP-raising event was reachable / shown / taken after');
for (const o of ORIGINS) { const c = ft.origins[o].cepSafeguard;
  line(o, `${c.ceilingRuns} hit it; ${c.reachableAfterCeilingRate ?? '-'}% reachable, ${c.shownAfterCeilingRate ?? '-'}% shown, ${c.takenAfterCeilingRate ?? '-'}% taken`); }

console.log('consequences (first-timer): fired / scheduled (dropped: fell due the same year as another; pending: run ended first)');
for (const [id, c] of Object.entries(ft.consequences).sort()) line(id, `${c.fired}/${c.scheduled} (${c.fireRate}%), dropped ${c.dropped}, pending ${c.pendingAtEnd}`);

console.log('origin invariant (PM rate, 95% CI):');
for (const [bot, r] of [['first-timer', ft], ['knows the win', kw]])
  line(bot, ORIGINS.map(o => `${o} ${r.origins[o].pmRate}% [${r.origins[o].pmCI.join('-')}]`).join('  >  '));

if (baseline) {
  const before = flatten(JSON.parse(fs.readFileSync(baseline)));
  const after = flatten(m);
  const moved = Object.keys(after).filter(k => k in before && before[k] !== after[k] && !/\.(runs|scheduled|fired|pm|n)$/.test(k));
  console.log(`\n=== moved against ${baseline} (${moved.length} metrics) ===`);
  for (const k of moved.slice(0, 80)) line('', `${k}: ${before[k]} → ${after[k]}`);
}

if (jsonOut) {
  fs.mkdirSync(path.dirname(path.resolve(jsonOut)), { recursive: true });
  fs.writeFileSync(jsonOut, JSON.stringify(m, null, 1) + '\n');
  console.log(`\nmetrics written to ${jsonOut}`);
}

if (mode === 'regress') {
  const r = regress(m, content);
  console.log('\n=== regression ===');
  r.warns.forEach(w => console.log('  ! ' + w));
  r.fails.forEach(f => console.log('  ✗ ' + f));
  console.log(r.pass ? '  ✓ passes: origin order holds, PM stays rare by accident, every run ends' : '  ✗ REJECTED');
  process.exitCode = r.pass ? 0 : 1;
}
