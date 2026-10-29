// Balance simulation and fun proxies. No dependencies — run with: node test/sim.js
// Three bots stand in for three kinds of player. The origin difficulty ladder
// (scholar easiest → poly hardest) must hold for random and win-seeking play;
// if a content change inverts it, the change is wrong.
//
//   node test/sim.js [N]                 win rates + fun-proxy metrics (N runs per bot per origin)
//   node test/sim.js regress [N]         the same, then exit 1 if the regression rule fails
//     --json [FILE]      write the aggregated metrics (default reports/baseline/bot-metrics.json)
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
const BASELINE = path.join(__dirname, '..', 'reports', 'baseline', 'bot-metrics.json');
const jsonOut = (() => {   // --json with no file name writes the baseline
  const i = argv.indexOf('--json');
  if (i < 0) return null;
  const v = argv[i + 1];
  if (v && v.endsWith('.json')) return argv.splice(i, 2)[1];
  argv.splice(i, 1);
  return BASELINE;
})();
const contentDir = flag('--content'), baseline = flag('--baseline');
const mode = argv[0] === 'regress' ? argv.shift() : 'report';
const N = +argv[0] || 800;

const build = H.loadBuild(contentDir ? { root: contentDir } : {});
const content = build.content;
const cepEvents = content.events.filter(e => cepRaisingEvents(content).includes(e.id));

function play(origin, seed, score, rival = false) {
  const pickRandom = H.rng((seed * 2654435761) >>> 0);
  let run = H.newRun(origin, seed, { build, name: "Sim", rival });
  const cepReachable = [];
  for (let t = 0; t < 95 && run.phase !== 'ending'; t++) {
    const S = run.S;
    if (cepEvents.some(e => build.engine.eligible(e, S)) || S.scheduled.some(x => cepEvents.some(e => e.id === x.eventId)))
      cepReachable.push(run.turn);
    const ev = H.currentEvent(build, S);
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

// The same seeds again with a batchmate (the start-screen option), for the bots the balance rule
// checks. "+ batchmate" bots get their own entries in m.bots; m.batchmate counts the ranking exercise.
const RIVAL_BOTS = content.rival ? ["first-timer", "knows the win"] : [];
const rivalStats = {};
for (const name of RIVAL_BOTS)
  for (const origin of ORIGINS) {
    const st = (rivalStats[`${name} + batchmate`] ||= {})[origin] = { runs: 0, rankings: 0, rankingsWon: 0, cards: 0, batchmatePM: 0, batchmateGone: 0 };
    for (let i = 0; i < N; i++) {
      const { trace, cepReachable } = play(origin, i*7+3, BOTS[name], true);
      metrics.add(`${name} + batchmate`, trace, { cepReachable });
      st.runs++;
      for (const t of trace.turns) {
        if (t.ranking) { st.rankings++; if (t.ranking.won) st.rankingsWon++; }
        if (t.event.id.startsWith("rival_")) st.cards++;
      }
      if (trace.batchmate.rank === 16) st.batchmatePM++;
      if (["consultancy", "scandal"].includes(trace.batchmate.status)) st.batchmateGone++;
    }
  }
const batchmate = Object.fromEntries(Object.entries(rivalStats).map(([bot, per]) => [bot, Object.fromEntries(
  Object.entries(per).map(([o, x]) => [o, { rankingsPerRun: +(x.rankings / x.runs).toFixed(2),
    rankingWinRate: x.rankings ? +(100 * x.rankingsWon / x.rankings).toFixed(1) : null,
    cardsPerRun: +(x.cards / x.runs).toFixed(2), batchmatePMRate: +(100 * x.batchmatePM / x.runs).toFixed(1),
    batchmateLeftRate: +(100 * x.batchmateGone / x.runs).toFixed(1) }]))]));
const m = { build: build.hash, runsPerBotPerOrigin: N, ...metrics.result(), batchmate };

// --- report ----------------------------------------------------------------
console.log(`build ${build.hash}${contentDir ? ` (${contentDir})` : ''}`);
for (const [name, r] of Object.entries(m.bots)) {
  console.log(`\n=== ${name} (${N} runs each) ===`);
  for (const [o, x] of Object.entries(r.origins))
    console.log(`  ${o.padEnd(8)} PM ${(x.pmRate.toFixed(1)+"%").padEnd(7)}`
      + `median $${(x.medianWealth/1e6).toFixed(1)}M  ${JSON.stringify(x.endings)}`);
}

if (Object.keys(batchmate).length) {
  console.log('\n=== batchmate (start-screen option) ===');
  for (const [bot, per] of Object.entries(batchmate)) for (const [o, x] of Object.entries(per))
    console.log(`  ${bot.padEnd(26)} ${o.padEnd(8)} ranking exercise ${x.rankingsPerRun}/run (player wins ${x.rankingWinRate ?? '-'}%), `
      + `batchmate cards ${x.cardsPerRun}/run, batchmate becomes PM ${x.batchmatePMRate}%, leaves early ${x.batchmateLeftRate}%`);
}

const ft = m.bots['first-timer'], kw = m.bots['knows the win'];
const line = (label, s) => console.log(`  ${label.padEnd(22)}${s}`);
console.log('\n=== fun proxies ===');
console.log('dead turns (first-timer | knows the win), per act: turns/run, repeat-filler share, dead/run');
for (const act of ['I', 'II', 'III']) {
  const a = ft.deadTurns[act], b = kw.deadTurns[act];
  line(`Act ${act}`, `${a.turnsPerRun} taps + ${a.passedYearsPerRun} passed years, ${a.repeatFillerShare ?? '-'}% repeat filler, ${a.deadPerRun} dead`
    + `  |  ${b.turnsPerRun} taps + ${b.passedYearsPerRun} passed, ${b.repeatFillerShare ?? '-'}% repeat filler, ${b.deadPerRun} dead`);
}
console.log('run length (first-timer), taps / years: ' + ORIGINS.map(o => { const x = ft.origins[o];
  return `${o} ${x.turns.mean} / ${x.years.mean} (median years ${x.years.median}, ${x.years.inRange35to50}% in 35-50)`; }).join('; '));
console.log('run length (knows the win), taps / years: ' + ORIGINS.map(o => `${o} ${kw.origins[o].turns.mean} / ${kw.origins[o].years.mean}`).join('; '));

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

console.log('consequences (first-timer): fired / scheduled (late: waited behind another that fell due the same year; pending: run ended first)');
for (const [id, c] of Object.entries(ft.consequences).sort()) line(id, `${c.fired}/${c.scheduled} (${c.fireRate}%), late ${c.firedLate} (avg ${c.meanYearsLate}y), dropped ${c.dropped}, ${c.struck ? `struck ${c.struck}, ` : ''}pending ${c.pendingAtEnd}`);

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
