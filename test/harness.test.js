// Harness guarantees: replays are exact, the screen view never carries hidden state,
// and the trace agrees with the engine. No dependencies — run with: node test/harness.test.js
const assert = require('assert');
const H = require('../harness');
const { checkScreen, screenTerms } = require('../harness/leak-check');

const build = H.loadBuild();
let passed = 0;
const ok = (name, fn) => { fn(); passed++; console.log('✓ ' + name); };

function playRandom(origin, seed, opts = {}) {
  const r = H.rng(seed + 1);
  let run = H.newRun(origin, seed, { build: opts.build || build, rival: !!opts.rival });
  const screens = [];
  for (let t = 0; t < 95 && run.phase !== 'ending'; t++) {
    if (opts.screens) screens.push({ view: H.screen(run), text: H.screenText(run) });
    const live = H.choices(run).filter(c => c.available);
    run = H.step(run, live[Math.floor(r() * live.length)].id);
  }
  if (opts.screens) screens.push({ view: H.screen(run), text: H.screenText(run) });
  return { run, screens };
}

ok('a run replays exactly from (build, origin, seed, choices)', () => {
  for (const origin of ['scholar', 'grad', 'poly']) for (const seed of [1, 99, 123456]) {
    const { run } = playRandom(origin, seed);
    const t = H.trace(run);
    const again = H.replay({ buildHash: t.buildHash, origin, seed, name: t.name, choices: t.choices });
    assert.deepStrictEqual(H.trace(again), t);
    assert.strictEqual(H.screenText(again), H.screenText(run));
  }
  for (const origin of ['grad', 'poly']) for (const seed of [7, 4242]) {   // with a batchmate too
    const { run } = playRandom(origin, seed, { rival: true });
    const t = H.trace(run);
    assert.ok(t.batchmate && t.rival);
    const again = H.replay({ buildHash: t.buildHash, origin, seed, name: t.name, rival: true, choices: t.choices });
    assert.deepStrictEqual(H.trace(again), t);
  }
});

ok('a game has no batchmate unless asked for, and the batchmate stays hidden until the end', () => {
  for (const origin of ['scholar', 'grad', 'poly']) for (let seed = 1; seed <= 20; seed++) {
    const S = build.engine.newGame(build.content, origin, 'X', seed);
    assert.ok(!('rival' in S), 'no batchmate unless asked for');
    const { screens } = playRandom(origin, seed, { rival: true, screens: true });
    for (const sc of screens.slice(0, -1)) {
      assert.ok(!/\bability\b|cepStart|"rel"|\{rival\}|\{the(y|m|ir)\}|\{[^{}\s]+\}/i.test(sc.text), 'batchmate internals or placeholders on screen: ' + sc.text.slice(0, 200));
    }
  }
  // batchmate cards: every schedule target exists, every choice has text and outcome, no dominated choices
  const { dominatedChoices } = require('./metrics');
  const rc = build.content.rival;
  assert.ok(rc && rc.events.length >= 4);
  for (const e of rc.events) for (const c of e.choices) assert.ok(c.text && c.outcome, e.id);
  assert.deepStrictEqual(dominatedChoices({ events: rc.events }), [], 'a batchmate card has a choice worse than a sibling on every stat');
});

ok('build hash is stable, and changes when the content does', () => {
  assert.strictEqual(H.loadBuild().hash, build.hash);
  const withCanaries = H.loadBuild({ canaries: true });
  assert.notStrictEqual(withCanaries.hash, build.hash);
  assert.ok(withCanaries.content.events.some(e => e.canary === 'bland'));
  assert.ok(withCanaries.content.events.some(e => e.canary === 'wink'));
  assert.ok(!build.content.events.some(e => e.canary), 'canaries must not leak into the plain build');
  assert.throws(() => H.replay({ buildHash: '000000000000', origin: 'grad', seed: 1, choices: [] }, { build }));
});

ok('locked and unknown choices are refused', () => {
  let found = false;
  for (let seed = 1; seed < 400 && !found; seed++) {
    let run = H.newRun('poly', seed, { build });
    for (let t = 0; t < 30 && run.phase === 'event'; t++) {
      const locked = H.choices(run).find(c => !c.available);
      if (locked) { assert.throws(() => H.step(run, locked.id), /locked/); found = true; break; }
      run = H.step(run, H.choices(run).find(c => c.available).id);
    }
  }
  assert.ok(found, 'expected some locked choice within 400 poly runs');
  assert.throws(() => H.step(H.newRun('grad', 5, { build }), 'Z'), /no choice/);
});

ok('the screen view carries nothing hidden', () => {
  // Every key that may appear in a screen object. Anything else is a leak by construction.
  const allowed = new Set(['phase', 'start', 'title', 'tagline', 'hint', 'origin', 'name', 'difficulty', 'blurb',
    'header', 'rank', 'grade', 'age', 'year', 'ministry', 'wealth', 'wealthLabel', 'batchmate', 'stats', 'key', 'label', 'value', 'delta',
    'outcome', 'text', 'log', 'tag', 'event', 'body', 'choices', 'id', 'available', 'requires',
    'ending', 'epitaph', 'positionLabel', 'position', 'ageLabel', 'lifetimeEarnings', 'integrity',
    // the ending screen's Declassified file: the hidden values, revealed on purpose once the run is over
    'declassified']);
  const walk = (o, where) => {
    if (Array.isArray(o)) return o.forEach((x, i) => walk(x, `${where}[${i}]`));
    if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) {
      assert.ok(allowed.has(k), `screen has unexpected field ${where}.${k}`);
      walk(v, `${where}.${k}`);
    }
  };
  const statKeys = new Set(H.STATS);
  const terms = screenTerms(build);
  for (const origin of ['scholar', 'grad', 'poly']) for (let seed = 1; seed <= 40; seed++) {
    for (const s of playRandom(origin, seed, { screens: true, rival: seed % 2 === 0 }).screens) {
      walk(s.view, 'screen');
      if (s.view.header) for (const st of s.view.header.stats) assert.ok(statKeys.has(st.key), 'only the four visible stats');
      assert.deepStrictEqual(checkScreen(s.text, build, terms), [], s.text);
      assert.ok(!/\b(cep|heat)\b\s*\d/i.test(s.text));
    }
  }
});

ok('every alternate exists and only fires through its card', () => {
  for (const e of build.content.events) for (const a of (e.alternates || [])) {
    const x = build.content.events.find(y => y.id === a);
    assert.ok(x, `${e.id} names a missing alternate ${a}`);
    assert.ok(x.triggered, `alternate ${a} must be triggered, or it would also fire at random`);
  }
});

ok('the trace agrees with the engine (appraisal weights, consequences, flags)', () => {
  for (const origin of ['scholar', 'grad', 'poly']) for (let seed = 1; seed <= 60; seed++) {
    const t = H.trace(playRandom(origin, seed, { rival: seed % 3 === 0 }).run);
    for (const turn of t.turns) {
      // (the vetting's folder and the campaign move stats outside choice effects, so skip those turns)
      if (turn.appraisal && !['the_vetting', 'the_election'].includes(turn.event.id) && !turn.rivalContest) {
        // stats as they stood at appraisal: before + the choice's effects, clamped
        const at = k => Math.max(0, Math.min(100, turn.before[k] + (turn.choice.effects[k] || 0)));
        const base = Object.entries(H.APPRAISAL_WEIGHTS).reduce((n, [k, w]) => n + w * at(k), 0);
        assert.ok(Math.abs(base - turn.appraisal.base) < 1e-9, `APPRAISAL_WEIGHTS no longer match engine.js: ${base} vs ${turn.appraisal.base}`);
      }
      if (turn.event.source === 'scheduled')
        assert.ok(t.turns.some(x => x.turn < turn.turn && x.scheduled.some(s => s.eventId === turn.event.fired.eventId && s.fireYear === turn.event.fired.fireYear)),
          `${turn.event.id} fired in year ${turn.year} but no earlier turn scheduled it`);
      for (const f of turn.flagsSet) assert.ok(t.final.flags.includes(f) || t.turns.some(x => x.flagsCleared.includes(f)));
    }
    if (t.ending) assert.ok(t.endingCause && t.endingCause.kind);
    assert.strictEqual(t.turns.length, t.choices.length);
  }
});

ok('ladder pay and age floors match the published figures', () => {
  // 2026 political salary review (accepted 8 Sep 2026, effective 15 Oct 2026): MR4 is the
  // benchmark; the rest are multiples of it. MOS, SMS and DPM keep the old multiples.
  const L = build.content.ladder, mr4 = L[13].pay;
  assert.strictEqual(mr4, 1800000);
  assert.strictEqual(L[8].pay, 18500 * 14, 'MP allowance, monthly x 14');
  const multiple = { 9: 0.45, 10: 0.45, 11: 0.7, 12: 0.85, 14: 1.3, 15: 1.6, 16: 2 };
  for (const [r, m] of Object.entries(multiple)) assert.strictEqual(L[r].pay, Math.round(mr4 * m), `${L[r].title} (${L[r].grade})`);
  assert.strictEqual(L[4].minAge, 28); assert.strictEqual(L[6].minAge, 35); assert.strictEqual(L[7].minAge, 40);
  // an exceptional file (two standout moments) may go lower, and never below 38 for Permanent Secretary
  assert.strictEqual(L[6].minAgeExceptional, 33); assert.strictEqual(L[7].minAgeExceptional, 38);
  const scholar = build.content.origins.find(o => o.id === 'scholar');
  assert.ok(scholar.startRank <= 2 && scholar.startAge === 25, 'scholars start as Assistant Directors at 25');
});

ok('a seat is only lost on a card the player saw', () => {
  // A re-election passes by itself only when the seat is safe, and a safe seat is never lost.
  let passedElections = 0;
  const score = f => (f.cep||0)*60 + (f.standing||0)*1.5 + (f.competence||0)*1.4 + (f.reputation||0)*1.3;
  for (const origin of ['scholar', 'grad', 'poly']) for (let seed = 1; seed <= 150; seed++) {
    let run = H.newRun(origin, seed, { build, name: 'T' });
    while (run.phase !== 'ending' && run.turn < 95) {
      const ev = H.currentEvent(build, run.S);
      const live = ev.choices.map((c, i) => [c, i]).filter(([c]) => build.engine.choiceAvailable(c, run.S));
      run = H.step(run, live.reduce((a, b) => score(b[0].effects || {}) > score(a[0].effects || {}) ? b : a)[1]);
    }
    for (const turn of H.trace(run).turns) for (const p of turn.passed) if (p.election) {
      passedElections++;
      assert.ok(p.election.won && p.election.safe, `${origin} ${seed}: a re-election that passed by itself was lost`);
    }
  }
  assert.ok(passedElections > 100, 'expected safe re-elections to pass by themselves');
});

ok('ending causes classify losses', () => {
  const kinds = {};
  for (const origin of ['grad', 'poly', 'scholar']) for (let seed = 1; seed <= 300; seed++) {
    const t = H.trace(playRandom(origin, seed).run);
    if (['quiet', 'scandal', 'lostward'].includes(t.ending)) {
      kinds[t.ending + ':' + t.endingCause.kind] = (kinds[t.ending + ':' + t.endingCause.kind] || 0) + 1;
      if (t.ending === 'quiet') assert.strictEqual(t.endingCause.appraisals.length, 2);
      if (t.ending === 'lostward') assert.ok(t.endingCause.chain[0].chance > 0);
      if (t.ending === 'scandal') assert.ok(t.endingCause.chain.length > 0);
    } else if (t.ending) assert.strictEqual(t.endingCause.kind, 'outcome');
  }
  assert.ok(Object.keys(kinds).length > 0, 'expected some losses in 900 random runs');
});

console.log(`\nAll ${passed} harness tests passed.`);
