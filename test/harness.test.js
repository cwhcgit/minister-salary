// Harness guarantees: replays are exact, the screen view never carries hidden state,
// and the trace agrees with the engine. No dependencies — run with: node test/harness.test.js
const assert = require('assert');
const H = require('../harness');
const View = require('../harness/screen');
const { checkScreen, screenTerms } = require('../harness/leak-check');

const build = H.loadBuild();
let passed = 0;
const ok = (name, fn) => { fn(); passed++; console.log('✓ ' + name); };

function playRandom(origin, seed, opts = {}) {
  const r = H.rng(seed + 1);
  let run = H.newRun(origin, seed, { build: opts.build || build, rival: !!opts.rival, name: opts.name, gender: opts.gender });
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
    for (const [name, gender] of [['', 'f'], ['Tan Wei Ming', 'm']]) {
      const { run } = playRandom(origin, seed, { name, gender });
      const t = H.trace(run);
      assert.strictEqual(t.gender, gender);
      const again = H.replay({ buildHash: t.buildHash, origin, seed, name: t.name, gender: t.gender, choices: t.choices });
      assert.deepStrictEqual(H.trace(again), t);
      assert.strictEqual(H.screenText(again), H.screenText(run));
    }
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
    'namePlaceholder', 'genders', 'player', 'gender',   // the start screen's name field and gender choice
    'header', 'rank', 'grade', 'age', 'year', 'ministry', 'wealth', 'wealthLabel', 'batchmate', 'label',
    'outcome', 'text', 'log', 'tag', 'event', 'body', 'choices', 'id', 'available', 'requires',
    'ending', 'epitaph', 'positionLabel', 'position', 'ageLabel', 'lifetimeEarnings',
    // the ending screen's four stats and its Declassified file: the hidden values, revealed on
    // purpose once the run is over
    'stats', 'value', 'verdict', 'declassified']);
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
      // the four stats are hidden during play: not in the header, not anywhere on the screen
      if (s.view.header) assert.ok(!('stats' in s.view.header), 'the header carries no stats');
      if (s.view.ending) assert.deepStrictEqual(s.view.ending.stats.map(x => x.label.toLowerCase()).sort(), [...statKeys].sort(), 'the ending reveals all four stats');
      assert.deepStrictEqual(checkScreen(s.text, build, terms), [], s.text);
      assert.ok(!/\b(cep|heat)\b\s*\d/i.test(s.text));
    }
  }
  // a stat value during play is a leak; the same words on the ending screen are the reveal
  for (const leak of ['REP 35   STAND 40   INTEG 60   COMP 41', '[unavailable: Requires competence 45]', 'Competence 55, Standing 40, Reputation 30: B level'])
    assert.ok(checkScreen(`Senior Officer [MX9]\n${leak}`, build, terms).some(h => h.why === 'stat value during play'), leak);
  assert.deepStrictEqual(checkScreen('TAN WEI MING · THE FINAL POSITION\nRetired\n\nCOMPETENCE 72: Yours was never the problem.', build, terms), []);
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

ok('appraisal quotes: one quoted phrase each, kept on Meanwhile lines, and none repeats before its grade has used them all', () => {
  const grade = new Map();
  for (const g of build.content.grades) for (const l of (g.labels || [g.label])) {
    const q = l.match(/"[^"]+"/g) || [];
    assert.strictEqual(q.length, 1, `${g.code}: a label quotes exactly one phrase (${l})`);
    assert.ok(!grade.has(q[0].slice(1, -1)), `two labels quote the same phrase: ${q[0]}`);
    grade.set(q[0].slice(1, -1), g);
  }
  let shown = 0;
  for (const origin of ['scholar', 'grad', 'poly']) for (let seed = 1; seed <= 20; seed++) {
    const r = H.rng(seed + 1), byGrade = {};
    let run = H.newRun(origin, seed, { build });
    for (let t = 0; t < 95 && run.phase !== 'ending'; t++) {
      const live = H.choices(run).filter(c => c.available);
      run = H.step(run, live[Math.floor(r() * live.length)].id);
      for (const l of run.last.log) {
        assert.ok(!/Appraisal: noted/.test(l.text), `a Meanwhile line lost its quote: ${l.text}`);
        const m = l.kind === 'appraisal' ? l.text.match(/described as "([^"]+)"/) : l.kind === 'pay' ? l.text.match(/Appraisal: "([^"]+)"/) : null;
        if (!m) continue;
        const q = m[1], g = grade.get(q);
        assert.ok(g, `an appraisal quote that is in no label: ${q}`);
        (byGrade[g.code] ||= []).push(q);
        shown++;
      }
    }
    for (const [code, qs] of Object.entries(byGrade)) {
      const n = (build.content.grades.find(g => g.code === code).labels || [0]).length;
      qs.forEach((q, i) => { for (let j = i + 1; j < Math.min(qs.length, i + n); j++) assert.notStrictEqual(qs[j], q, `${origin} ${seed}: "${q}" again after ${j - i} ${code} grades`); });
    }
  }
  assert.ok(shown > 500, `expected appraisal quotes on screen (${shown})`);
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

ok('the run\'s cast: names, pronouns, grades and memory hold for whole careers', () => {
  const C = build.content, L = C.ladder, E = build.engine;
  let refills = 0, named = 0;
  for (const origin of ['scholar', 'grad', 'poly']) for (let seed = 1; seed <= 40; seed++) {
    const r = H.rng(seed * 3 + 1);
    let run = H.newRun(origin, seed, { build, rival: seed % 2 === 0 });
    const pron = {}, holder = {}, lines = new Set();
    for (let t = 0; t < 95; t++) {
      const S = run.S;
      // at most one cast line per outcome screen, and no version of a line twice in a run
      const notes = run.last ? run.last.log.filter(l => l.cast) : [];
      assert.ok(notes.length <= 1, `${origin} ${seed}: ${notes.length} cast lines on one screen`);
      for (const l of notes) { const k = `${l.cast}.${l.key}#${l.line}`; assert.ok(!lines.has(k), `${origin} ${seed}: cast line ${k} repeated`); lines.add(k); }
      if (!S.ending) {
        const people = Object.values(S.cast.on).filter(Boolean).concat(S.cast.past);
        const words = people.flatMap(p => p.nm.full.toLowerCase().split(/\s+/).filter(w => !['bin', 'binte', 'de'].includes(w)));
        assert.strictEqual(new Set(words).size, words.length, `${origin} ${seed}: two of the run's people share a name`);
        if (S.rival) for (const w of S.rival.name.toLowerCase().split(/\s+/)) assert.ok(!words.includes(w), 'a cast member shares the batchmate\'s name');
        for (const [role, p] of Object.entries(S.cast.on)) {
          if (!p) continue;
          pron[p.id] = pron[p.id] || p.pron;
          assert.strictEqual(p.pron, pron[p.id], 'a person\'s pronoun changed');
          const track = C.cast.roles[role].track;
          if (track === 'above' && S.rank < 8) assert.ok(p.rank > S.rank, `senior ${L[p.rank].title} is not above ${L[S.rank].title}`);
          if (track === 'below') assert.ok(p.rank < S.rank && S.rank < 8, `junior ${L[p.rank].title} does not report to ${L[S.rank].title}`);
          if (track !== 'none' && track !== 'political') assert.ok(p.rank <= E.maxRankForAge(C, S.age + p.ageOff), `${role} under the age floor`);
          // a refilled role is a new person who arrives with no history
          if (holder[role] !== undefined && holder[role] !== p.id) { refills++; assert.deepStrictEqual(p.flags, [], `a refilled ${role} inherited flags`); }
          holder[role] = p.id;
        }
      }
      if (run.phase === 'ending') break;
      const ev = H.currentEvent(build, S);
      if (ev.who) named++;
      assert.ok(!/\{[^{}\s]+\}/.test([ev.title, ev.body, ...ev.choices.flatMap(c => [c.text, c.outcome])].join(' ')), `raw token on ${ev.id}`);
      const live = H.choices(run).filter(c => c.available);
      run = H.step(run, live[Math.floor(r() * live.length)].id);
    }
  }
  assert.ok(refills > 20 && named > 300, `expected refills and cast cards (${refills}, ${named})`);
  // the cast is drawn on its own stream: the run's dice are untouched
  const bare = { ...C, cast: undefined };
  for (const origin of ['scholar', 'grad', 'poly']) for (const seed of [1, 2, 3]) {
    const a = E.newGame(C, origin, 'X', seed), b = E.newGame(bare, origin, 'X', seed);
    assert.deepStrictEqual([a.cep, a.ministry, a.rngCalls], [b.cep, b.ministry, b.rngCalls]);
    assert.ok(a.cast && !b.cast);
  }
});

ok('card parts: one combination per showing, fresh next run, every combination renders with no dominated choice', () => {
  const C = build.content, E = build.engine;
  const cards = C.events.filter(e => e.parts);
  assert.ok(cards.length >= 3, 'expected cards with parts');
  // a state with every role filled, so every option can be assembled
  const S0 = JSON.parse(JSON.stringify(H.newRun('grad', 11, { build }).S));
  S0.rank = 3;
  for (const role of Object.keys(C.cast.roles)) S0.cast.on[role] = S0.cast.on[role] || { id: 900 + role.length, role, nm: { given: 'Kai Wen', formal: 'Pang', full: 'Pang Kai Wen' }, pron: 'm', ageOff: 9, rank: role === 'senior' ? 6 : role === 'junior' ? 1 : 3, since: 1, rankYear: 1, flags: [], post: 'CCC chairman' };
  const { dominatedChoices } = require('./metrics');
  for (const ev of cards) {
    const all = [];
    const go = (i, cur) => {
      const slots = E.partSlots(ev);
      if (i === slots.length) return all.push({ ...cur });
      const [name, sl] = slots[i];
      sl.options.forEach((o, k) => { if (!Object.entries((o.requires || {}).parts || {}).some(([x, ids]) => !ids.includes(cur[x]))) go(i + 1, { ...cur, [name]: o.id !== undefined ? String(o.id) : String(k) }); });
    };
    go(0, {});
    for (const parts of all) {
      const r = E.render(C, ev, S0, { parts });
      const text = [r.title, r.body, ...r.choices.flatMap(c => [c.text, c.outcome])].join(' ');
      assert.ok(!/\{[^{}\s]+\}/.test(text), `${ev.id} ${JSON.stringify(parts)}: raw token in "${text.slice(0, 120)}"`);
      assert.deepStrictEqual(dominatedChoices({ events: [{ ...r, choices: r.choices }] }), [], `${ev.id} ${JSON.stringify(parts)}: a dominated choice`);
    }
  }
  // freshness: with this run's options in the phone's memory, the next run picks others where it can
  const ask = cards.find(e => e.id === 'the_ask') || cards[0];
  const S = { ...S0, recent: [], history: [] };
  const first = E.render(C, ask, S).picked;
  const second = E.render(C, ask, { ...S, recent: Object.entries(first).map(([k, v]) => `${ask.id}~${k}=${v}`) }).picked;
  assert.ok(Object.keys(first).some(k => first[k] !== second[k]), 'the next run repeated every part');
  assert.deepStrictEqual(E.render(C, ask, S).picked, first, 'parts are not deterministic');
});

ok('the immersion lint\'s static checks pass (tokens, slots, pronouns, grades, guarded callbacks)', () => {
  assert.deepStrictEqual(require('./contexts').castStatic(build), []);
});

ok('the trace shows which of the run\'s people and which part options a card used', () => {
  let cast = 0, parts = 0;
  for (const origin of ['grad', 'poly']) for (let seed = 1; seed <= 30; seed++) {
    const t = H.trace(playRandom(origin, seed).run);
    assert.ok(t.cast && t.cast.on, 'trace carries the cast');
    for (const turn of t.turns) {
      if (turn.event.cast) { cast++; for (const v of Object.values(turn.event.cast)) assert.ok(v.name && v.id); }
      if (turn.event.parts) parts++;
    }
  }
  assert.ok(cast > 20 && parts > 10, `expected cast and parts in traces (${cast}, ${parts})`);
});

ok('series: the Indicators in full at most twice a career, the plan in full every time; the years after keep the habit and set the bonus', () => {
  const C = build.content;
  const fam = id => (C.events.find(e => e.id === id) || {}).series;
  const score = f => (f.cep||0)*60 + (f.standing||0)*1.5 + (f.competence||0)*1.4 + (f.reputation||0)*1.3 - (f.heat||0)*0.8;
  let again = 0, passedInd = 0, passedPlan = 0, office = 0;
  for (const origin of ['scholar', 'grad', 'poly']) for (let seed = 1; seed <= 60; seed++) {
    const r = H.rng(seed * 5 + 1), greedy = seed % 2 === 0;
    let run = H.newRun(origin, seed, { build });
    const full = {}, lines = new Set();
    while (run.phase !== 'ending' && run.turn < 95) {
      const ev = H.currentEvent(build, run.S), f = fam(ev.id);
      if (f) {
        full[f.key] = (full[f.key] || 0) + 1;
        if (String(ev.variant).startsWith('again:')) {
          // the second showing: the habit from the first is the default, and comes first
          again++;
          assert.strictEqual(full[f.key], 2, `${ev.id}: a second-showing scene on showing ${full[f.key]}`);
          assert.strictEqual(ev.choices[0].stance, run.S.series[f.key].stance, `${ev.id}: the habit is not the first choice`);
        }
      }
      const live = ev.choices.map((c, i) => [c, i]).filter(([c]) => build.engine.choiceAvailable(c, run.S));
      const pick = greedy ? live.reduce((a, b) => score(b[0].effects || {}) > score(a[0].effects || {}) ? b : a)[1] : live[Math.floor(r() * live.length)][1];
      run = H.step(run, pick);
      if (run.S.rank >= 11) office++;
      // every Meanwhile line is new to the run; a series year sets the bonus its habit sets
      const log = run.last.log;
      log.forEach((l, k) => {
        if (l.kind !== 'meanwhile') return;
        const text = l.text.replace(/^Age \d+\. /, '');
        if (!/^Nothing of consequence/.test(text)) { assert.ok(!lines.has(text), `${origin} ${seed}: Meanwhile line shown twice: ${text}`); lines.add(text); }
      });
      for (const p of run.turns[run.turns.length - 1].passed) {
        const f2 = fam(p.event);
        if (!f2) continue;
        if (f2.key === 'plan') { passedPlan++; continue; }
        passedInd++;
        const src = C.events.find(e => e.id === p.event), ch = src.choices.find(c => c.stance === p.habit);
        assert.ok(ch, `${p.event}: no choice for the habit ${p.habit}`);
        const i = log.findIndex(l => l.kind === 'year' && l.text === `Age ${p.age} · A year without a decision`);
        const pay = log.slice(i + 1).find(l => l.kind === 'pay');
        const m = pay && pay.text.match(/including (?:a National Bonus of (\d) months?|no National Bonus)/);
        assert.ok(m, `${p.event}: the pay line does not show the bonus: ${pay && pay.text}`);
        const months = m[1] === undefined ? 0 : +m[1];
        assert.ok([ch.nationalBonus, (ch.nationalBonusRisk || {}).months].includes(months), `${p.event} as ${p.habit}: ${months} months`);
      }
    }
    assert.ok((full.indicators || 0) <= 2, `${origin} ${seed}: the Indicators shown in full ${full.indicators} times`);
    // an improvement plan is never passed without a tap: it is shown in full every time it comes
  }
  assert.ok(again > 30 && passedInd > 30 && passedPlan === 0 && office > 100, `expected second showings and passed series years, and no plan passed silently (${again}, ${passedInd}, ${passedPlan})`);
});

ok('every second-showing scene renders whole, with the habit first and no dominated choice', () => {
  const C = build.content, E = build.engine;
  const { dominatedChoices } = require('./metrics');
  let n = 0;
  for (const ev of C.events.filter(e => e.again)) for (const [stance, sc] of Object.entries(ev.again.scenes)) {
    const S = JSON.parse(JSON.stringify(H.newRun('scholar', 3, { build }).S));
    Object.assign(S, { rank: 11, currentEvent: ev.id, series: { [ev.series.key]: { stance, full: 1, passed: 0 } } });
    const r = E.eventOf(C, S);
    assert.strictEqual(r.variant, 'again:' + stance);
    assert.strictEqual(r.choices.length, ev.choices.length);
    assert.strictEqual(r.choices[0].stance, stance, `${ev.id} ${stance}: the habit is not first`);
    assert.strictEqual(sc.choices.length, ev.choices.length, `${ev.id} ${stance}: one text per choice`);
    for (const c of r.choices) assert.ok(c.text && c.outcome && !/\{[^{}\s]+\}/.test(c.text + c.outcome), `${ev.id} ${stance}: a choice without words`);
    assert.deepStrictEqual(dominatedChoices({ events: [r] }), [], `${ev.id} ${stance}: a dominated choice`);
    // the button pressed is the card's own choice, whatever its place on screen
    const S2 = E.advance(C, S, 0).state;
    assert.strictEqual(S2.history[S2.history.length - 1].choice, ev.choices.findIndex(c => c.stance === stance));
    assert.strictEqual(S2.series[ev.series.key].stance, stance);
    n++;
  }
  assert.ok(n >= 9, `expected the Indicators' nine second-showing scenes (${n})`);
});

ok('Meanwhile lines: deterministic, and the next run prefers lines this one did not show', () => {
  // the replay key includes the phone's memory: the same memory replays the same lines
  const passes = run => run.turns.flatMap(t => t.passed).filter(p => p.kind !== 'quiet').length;
  let seed = 8, first = playRandom('grad', seed).run;
  while (passes(first) < 3) first = playRandom('grad', ++seed).run;
  const memory = build.engine.recentKeys(build.content, first.S);
  assert.ok(memory.some(k => k.startsWith('mw:')), 'the run remembers its Meanwhile lines');
  let a = H.newRun('grad', seed, { build, recent: memory });
  const r = H.rng(9);
  while (a.phase !== 'ending' && a.turn < 95) { const live = H.choices(a).filter(c => c.available); a = H.step(a, live[Math.floor(r() * live.length)].id); }
  const t = H.trace(a);
  assert.deepStrictEqual(H.trace(H.replay({ buildHash: t.buildHash, origin: 'grad', seed, name: t.name, recent: memory, choices: t.choices })), t);
  // with every line of a habit remembered but one, that one is taken first
  const S = JSON.parse(JSON.stringify(first.S));
  const ev = build.content.events.find(e => e.id === 'the_work');
  S.linesUsed = {}; S.fillerSeen.the_work = 1; S.habits.the_work = 0; S.currentEvent = '__montage:the_work';
  const n = ev.montageLines[0].length;
  S.recent = Array.from({ length: n }, (_, i) => `mw:the_work:0#${i}`).filter(k => k !== `mw:the_work:0#${n - 1}`);
  assert.strictEqual(build.engine.eventOf(build.content, S).body, ev.montageLines[0][n - 1]);
});

ok('story chains: Declassified names each story once, a bond can be extended, and a ministry move is remembered', () => {
  const E = build.engine;
  const card = (id, choice, requires) => ({ id, title: 'T', body: 'B', requires, once: true, choices: [{ text: 'Go.', outcome: 'Gone.', ...choice }] });
  const C = { ...build.content, events: build.content.events.concat([
    card('__t_bond', { bond: 2 }, { duringBond: true }), card('__t_move', { newMinistry: true })]) };
  const S = H.newRun('scholar', 5, { build }).S;
  // duringBond holds while the bond runs, and a bond choice adds its years after it
  assert.ok(E.eligible(C.events.find(e => e.id === '__t_bond'), S));
  const after = E.advance(C, { ...S, currentEvent: '__t_bond' }, 0).state;
  assert.strictEqual(after.bondYears, S.bondYears + 2);
  assert.ok(!E.eligible(C.events.find(e => e.id === '__t_bond'), { ...S, year: S.bondYears + 1 }));
  // after the bond has ended, a new one starts from the year it is signed
  const late = E.advance(C, { ...S, year: 9, currentEvent: '__t_bond' }, 0).state;
  assert.strictEqual(late.bondYears, 11);
  // a move to another ministry leaves a flag, once
  const moved = E.advance(C, { ...S, currentEvent: '__t_move' }, 0).state;
  assert.notStrictEqual(moved.ministry, S.ministry);
  assert.deepStrictEqual(moved.flags.filter(f => f === 'moved_ministry'), ['moved_ministry']);
  // the first matching line per label, after Exposure
  const D = { ...C, declassifiedFlags: [
    { label: 'The test', requires: { flagsAll: ['t_a'] }, text: 'first' },
    { label: 'The test', text: 'fallback' },
    { label: 'Another', requires: { flagsAll: ['t_b'] }, text: 'never' }] };
  const lines = f => E.declassify(D, { ...S, flags: f, ending: 'level' });
  const ours = f => lines(f).filter(l => ['The test', 'Another'].includes(l.label));
  assert.deepStrictEqual(ours(['t_a']), [{ label: 'The test', text: 'first' }]);
  assert.deepStrictEqual(ours([]), [{ label: 'The test', text: 'fallback' }]);
  const L = lines(['t_a']).map(l => l.label);
  assert.ok(L.indexOf('The test') > L.indexOf('Exposure'), 'story lines come after Exposure');
});

ok('a cast member\'s aTitle takes "a" or "an" by how the title is said, initialisms by their first letter', () => {
  const E = build.engine, C = build.content;
  for (const [w, a] of [['MP', 'an'], ['RC chairman', 'an'], ['SMC', 'an'], ['HDB flat', 'an'], ['FAQ', 'an'], ['CCC chairman', 'a'], ['CCMC chairman', 'a'],
    ['GRC', 'a'], ['URA officer', 'a'], ['Assistant Director', 'an'], ['Director', 'a'], ['Member of Parliament', 'a'], ['editor', 'an']])
    assert.strictEqual(E.article(w), a, `${a} ${w}`);
  // as rendered: a grassroots leader by post, a junior by grade
  const S = JSON.parse(JSON.stringify(H.newRun('grad', 3, { build }).S));
  const person = (role, extra) => ({ id: 990, role, nm: { given: 'Kai Wen', formal: 'Pang', full: 'Pang Kai Wen' }, pron: 'm', ageOff: 0, rank: 0, since: 1, rankYear: 1, flags: [], ...extra });
  for (const [post, want] of [['RC chairman', 'an RC chairman'], ['CCC chairman', 'a CCC chairman'], ['CCMC chairman', 'a CCMC chairman']])
    assert.strictEqual(E.personField(C, S, 'grassroots', person('grassroots', { post }), 'aTitle'), want);
  assert.strictEqual(E.personField(C, S, 'junior', person('junior', { rank: 2 }), 'aTitle'), 'an Assistant Director');
  assert.strictEqual(E.personField(C, S, 'junior', person('junior', { rank: 4 }), 'aTitle'), 'a Director');
  assert.strictEqual(E.personField(C, S, 'mp', person('mp', { rank: 8 }), 'aTitle'), 'a Member of Parliament');
});

ok('the end of a career is told: a foreboding line in the last three years and the last year\'s card; renewal, stay-on and the PM tenure keep their rules; no heads-up or foreboding line lies', () => {
  const E = build.engine, C = build.content, G = C.endgame;
  const LAST = [G.cards.lastService, G.cards.lastPolitics];
  const byAge = new Set(['level', 'permsec', 'retired', 'office', 'backbench', 'declined', 'withdrawn']);
  const score = f => (f.cep||0)*60 + (f.standing||0)*1.5 + (f.competence||0)*1.4 + (f.reputation||0)*1.3 - (f.heat||0)*0.8;
  const n = { byAge: 0, service: 0, renewal: 0, stayOffered: 0, stayedOn: 0, limit: 0, pm: 0, headsUp: 0, checkedUp: 0, tenure: {} };
  for (const origin of ['scholar', 'grad', 'poly']) for (let seed = 1; seed <= 60; seed++) {
    const greedy = seed % 2 === 0, r = H.rng(seed * 13 + 5), where = `${origin} ${seed}`;
    let S = E.nextEvent(C, E.newGame(C, origin, 'T', seed, { rival: seed % 3 === 0 })).state;
    const reviews = [], cards = [];
    for (let t = 0; t < 120 && !S.ending; t++) {
      const ev = E.eventOf(C, S);
      cards.push({ id: ev.id, age: S.age, rank: S.rank, year: S.year });
      const live = ev.choices.map((c, i) => [c, i]).filter(([c]) => E.choiceAvailable(c, S));
      const pick = greedy ? live.reduce((a, b) => score(b[0].effects || {}) > score(a[0].effects || {}) ? b : a)[1] : live[Math.floor(r() * live.length)][1];
      const res = E.advance(C, S, pick);
      // one entry per year-end on this outcome screen: its age, its promotion record and its lines
      let k = -1, first = res.log.length && /Year-end review$/.test((res.log.find(l => l.kind === 'year') || {}).text || '');
      for (const l of res.log) {
        if (l.kind === 'year') { k++; reviews.push({ age: +l.text.match(/^Age (\d+)/)[1], promotion: first ? (k === 0 ? res.trace.promotion : (res.trace.passed[k - 1] || {}).promotion) : (res.trace.passed[k] || {}).promotion, lines: [] }); }
        else if (k >= 0) reviews[reviews.length - 1].lines.push(l);
      }
      S = res.state;
    }
    assert.ok(S.ending, `${where}: the run never ended`);
    // the heads-up only when next year's review really considers you, at the same grade
    reviews.forEach((rv, i) => {
      const up = rv.lines.find(l => l.about === 'headsUp');
      if (!up) return;
      n.headsUp++;
      const next = reviews[i + 1];
      if (!next || !next.promotion || next.age !== rv.age + 1) return;   // the run ended first (a choice, an election)
      if (S.flags.includes('made_way') && next.promotion.result === 'career_ending') return;   // offered the stay, and chose to go
      n.checkedUp++;
      const p = next.promotion;
      assert.ok(p.rank === up.rank && p.yearsInGrade >= p.needYears && !['career_ending', 'age_floor', 'service_ceiling', 'pm_too_late', 'pm_taken', 'top'].includes(p.result),
        `${where}: at ${rv.age} "${up.text}", but next year ${JSON.stringify(p)}`);
    });
    const last = cards[cards.length - 1], forebode = reviews.filter(rv => rv.lines.some(l => l.about === 'foreboding'));
    const renewal = cards.find(c => c.id === G.cards.renewal || c.id === G.cards.stay);
    if (byAge.has(S.ending)) {
      n.byAge++;
      assert.ok(LAST.includes(last.id), `${where}: ${S.ending} at ${S.age} without the last year's card (last card ${last.id} at ${last.age})`);
      assert.ok(forebode.some(rv => rv.age >= last.age - 3 && rv.age < last.age), `${where}: ${S.ending} at ${S.age} with no foreboding line in the last three years`);
      for (const rv of forebode) for (const l of rv.lines.filter(l => l.about === 'foreboding'))
        if (!(l.pool === 'renewal' && S.flags.includes('stays_on'))) assert.strictEqual(l.last, last.age, `${where}: a foreboding line at ${rv.age} named the wrong last year`);
      if (last.id === G.cards.lastService) {
        n.service++;
        assert.ok(last.rank < 8 && S.age === last.age + 1 && S.age >= C.retireAge && S.age <= C.retireAge + 1, `${where}: the service retired at ${S.age}`);
      } else {
        assert.ok(last.rank >= 8 && S.age <= C.politicalRetireAge, `${where}: politics ended at ${S.age}`);
        if (S.flags.includes('stays_on')) { n.stayedOn++; assert.ok(last.age === C.politicalRetireAge - 1 && S.age === C.politicalRetireAge, `${where}: stayed on, but left at ${S.age}`); }
        else {
          assert.ok(renewal && renewal.age === last.age - 1, `${where}: no renewal card the year before the last`);
          if (S.age === last.age) n.renewal++; else { n.limit++; assert.strictEqual(S.age, C.politicalRetireAge); }
          assert.ok(S.age >= G.renewalAge, `${where}: renewed at ${S.age}`);
        }
      }
      // nobody is promoted once the party has asked them to make way, or in their last year
      const from = renewal && !S.flags.includes('stays_on') ? renewal : last;
      assert.strictEqual(S.rank, from.rank, `${where}: promoted after ${from.id}`);
    }
    if (cards.some(c => c.id === G.cards.stay)) {
      n.stayOffered++;
      const c = cards.find(c => c.id === G.cards.stay);
      assert.ok(c.rank >= G.stayOn.minRank, `${where}: asked to stay as rank ${c.rank}`);
    }
    if (S.ending === 'pm') {
      n.pm++;
      const T = S.pmTenure, tail = cards.slice(-T.cards.length);
      n.tenure[T.cards.length] = (n.tenure[T.cards.length] || 0) + 1;
      assert.deepStrictEqual(tail.map(c => c.id), T.cards, `${where}: the tenure's cards`);
      tail.forEach((c, i) => assert.ok(c.rank === 16 && c.age === T.at + 1 + i, `${where}: tenure card ${c.id} at ${c.age}`));
      assert.ok(S.age === T.at + T.cards.length && S.age <= C.politicalRetireAge - 1, `${where}: stepped down at ${S.age}`);
      assert.ok(E.declassify(C, S).some(l => l.label === 'In office'), `${where}: no In office line`);
    }
  }
  assert.ok(n.service > 30 && n.renewal > 10 && n.stayedOn > 5 && n.pm > 5 && n.checkedUp > 100, `expected every path in the sample ${JSON.stringify(n)}`);
});

ok('the four stats in words: the why line only when a grade needs explaining, big swings rate-limited, no numbers', () => {
  const W = build.content.statWords;
  const swings = new Set(Object.values(W.swing).flatMap(x => [...x.up, ...x.down]));
  let whys = 0, swung = 0, steady = 0;
  for (const origin of ['scholar', 'grad', 'poly']) for (let seed = 1; seed <= 40; seed++) {
    const r = H.rng(seed * 5 + 3);
    let run = H.newRun(origin, seed, { build, rival: seed % 2 === 0 });
    let prevGrade = null, lastSwing = -99, lastWhy = null;
    for (let t = 0; t < 95 && run.phase !== 'ending'; t++) {
      const live = H.choices(run).filter(c => c.available);
      for (const c of H.choices(run)) if (!c.available) assert.ok(c.requires && !/\d/.test(c.requires), `a locked choice shows a number: ${c.requires}`);
      run = H.step(run, live[Math.floor(r() * live.length)].id);
      if (run.phase === 'ending') break;
      const log = run.last.log;
      // a quiet line at most once every three cards, never two on one screen, and only on the card's own page
      const sw = log.filter(l => swings.has(l.text));
      assert.ok(sw.length <= 1, `${origin} ${seed}: two swing lines on one screen`);
      if (sw.length) {
        assert.ok(t - lastSwing >= 3, `${origin} ${seed}: swing lines ${t - lastSwing} cards apart`);
        assert.ok(log.indexOf(sw[0]) < log.findIndex(l => l.kind === 'year') || !log.some(l => l.kind === 'year'), 'a swing line belongs to the outcome, not a year-end');
        lastSwing = t; swung++;
      }
      // each year page: the why line appears exactly when the grade needs explaining
      const pages = [];
      for (const l of log) { if (l.kind === 'year') pages.push([]); else if (pages.length) pages[pages.length - 1].push(l); }
      for (const pg of pages) {
        const ap = pg.find(l => l.kind === 'appraisal');
        if (!ap) continue;
        const grade = ap.text.match(/^Grade (\S+)\./)[1];
        const why = pg.find(l => l.kind === 'why');
        // shown only in a year that needs explaining; always when the grade changed or a warning came
        const must = prevGrade === null || prevGrade !== grade || pg.some(l => l.kind === 'warn');
        const may = must || pg.some(l => l.kind === 'promo' && /^Promoted/.test(l.text));
        assert.ok(!why || may, `${origin} ${seed}: a why line in a steady year (grade ${grade})`);
        assert.ok(why || !must, `${origin} ${seed}: grade ${grade} after ${prevGrade} with no why line`);
        if (why) {
          whys++;
          assert.ok(!/\d/.test(why.text), `a why line with a number: ${why.text}`);
          if (prevGrade === null) assert.ok(why.text.startsWith(W.whyFirst), 'the first appraisal explains what an appraisal weighs');
          if (pg.some(l => l.kind === 'warn')) assert.ok(/competence|standing|reputation/i.test(why.text), 'a warning year names the stats');
          // no phrasing twice in a row (the promotion reminder is a fixed rule, not a phrasing)
          const said = why.text.replace(W.whyFirst, '').replace(' Promotion needs B+ or better.', '').trim().split(/(?<=[.;])\s/);
          for (const x of said) if (lastWhy) assert.ok(!lastWhy.includes(x), `${origin} ${seed}: "${x}" twice in a row`);
          lastWhy = said;
          if (sw.length && /competence|standing|reputation/i.test(why.text.replace(W.whyFirst, ''))) assert.ok(pages.indexOf(pg) > 0, 'no swing line on a card whose own year-end names the stats');
        } else steady++;
        prevGrade = grade;
      }
    }
  }
  assert.ok(whys > 300 && swung > 300 && steady > 300, `expected why lines, swing lines and steady years (${whys}, ${swung}, ${steady})`);
  // the ending names all four, with a verdict for each and the value
  const S = { ...H.newRun('grad', 3, { build }).S, competence: 80, standing: 10, reputation: 50, integrity: 45 };
  const v = build.engine.statVerdicts(build.content, S);
  assert.deepStrictEqual(v.map(x => [x.key, x.value]), [['competence', 80], ['standing', 10], ['reputation', 50], ['integrity', 45]]);
  for (const x of v) assert.ok(x.text.startsWith(W.verdicts[x.key].about) && x.text.length > W.verdicts[x.key].about.length, x.text);
});

// The text-only parts of a trace: who the player is and the names of everyone else.
function mechanics(t) {
  const x = JSON.parse(JSON.stringify(t));
  delete x.name; delete x.gender;
  if (x.batchmate) { delete x.batchmate.name; delete x.batchmate.pron; }
  if (x.cast) for (const p of Object.values(x.cast.on).concat(x.cast.past)) if (p) { delete p.nm; delete p.pron; }
  for (const turn of x.turns) if (turn.event.cast) for (const v of Object.values(turn.event.cast)) delete v.name;
  return x;
}

ok('the player\'s name and gender are text only: the same seed plays identically as Female and as Male', () => {
  let differ = 0, endings = 0;
  for (const origin of ['scholar', 'grad', 'poly']) for (let seed = 1; seed <= 24; seed++) {
    const rival = seed % 2 === 0;
    // the same name as Female and as Male, then a blank name (drawn) and one that clashes with the pools
    const runs = [['Lim Hui Min', 'f'], ['Lim Hui Min', 'm'], ['', 'm'], ['Zhi Wei Teo', 'f']].map(([name, gender]) => playRandom(origin, seed, { rival, name, gender, screens: true }));
    const [f, m] = runs.map(r => H.trace(r.run));
    assert.strictEqual(f.gender, 'f'); assert.strictEqual(m.gender, 'm');
    for (const r of runs.slice(1)) assert.deepStrictEqual(mechanics(H.trace(r.run)), mechanics(f), `${origin} ${seed}: the run's dice moved with the player's name or gender`);
    // the screens differ only in the text: every screen has the same shape and the same choices
    const [sf, sm] = [runs[0].screens, runs[1].screens];
    assert.strictEqual(sf.length, sm.length);
    sf.forEach((x, i) => {
      if (i > 0 && x.text !== sm[i].text) differ++;   // past the start screen, which names the gender
      assert.deepStrictEqual(Object.keys(x.view), Object.keys(sm[i].view));
      if (x.view.event) assert.deepStrictEqual(x.view.event.choices.map(c => [c.id, c.available]), sm[i].view.event.choices.map(c => [c.id, c.available]));
    });
    if (runs[0].run.phase === 'ending') {
      endings++;
      assert.strictEqual(H.screen(runs[0].run).ending.label, 'Lim Hui Min · the final position');
    }
    // nobody shares a word of the player's name: not the batchmate, not the cast
    for (const r of runs) {
      const S = r.run.S, mine = build.engine.playerWords(S.name, build.content);
      if (S.rival) for (const w of S.rival.name.toLowerCase().split(/\s+/)) assert.ok(!mine.includes(w), `${origin} ${seed}: the batchmate shares the player's name "${w}"`);
      for (const p of Object.values(S.cast.on).concat(S.cast.past)) if (p) for (const w of p.nm.full.toLowerCase().split(/\s+/)) assert.ok(!mine.includes(w), `${origin} ${seed}: ${p.nm.full} shares the player's name`);
    }
  }
  assert.ok(differ > 10 && endings > 50, `expected screens that read differently as Female and as Male (${differ}), and endings (${endings})`);
});

ok('the player\'s tokens: name, formal name and pronouns, a blank name drawn for the gender, and old saves', () => {
  const C = build.content, E = build.engine;
  const S = (name, gender) => E.newGame(C, 'grad', name, 7, { gender });
  const say = (st, t) => E.render(C, { id: 't', title: 'T', body: t, choices: [{ text: 'A', outcome: 'B' }] }, st).body;
  const t = 'Is {player} here? {player.formal} said {player.they} would come. Ask {player.them} about {player.their} file. {Player.They} said so. {player.Their} file.';
  assert.strictEqual(say(S('Tan Wei Ming', 'm'), t), 'Is Tan Wei Ming here? Mr Tan Wei Ming said he would come. Ask him about his file. He said so. His file.');
  assert.strictEqual(say(S('Lim Hui Min', 'f'), t), 'Is Lim Hui Min here? Ms Lim Hui Min said she would come. Ask her about her file. She said so. Her file.');
  assert.strictEqual(say(S('Dr Ong', 'f'), '{player.formal}'), 'Dr Ong', 'a typed honorific is kept, not doubled');
  assert.strictEqual(say(S('{peer} $&', 'f'), '{player}'), '{peer} $&', 'what the player typed is never read as a token');
  // a blank name: a name from the cast pool for that gender, the same for the same seed
  for (let seed = 1; seed <= 30; seed++) for (const g of ['f', 'm']) {
    const a = E.newGame(C, 'grad', '', seed, { gender: g }), b = E.newGame(C, 'grad', '  ', seed, { gender: g });
    const n = C.cast.names.find(x => x.full === a.name);
    assert.ok(n && n.pron === g, `seed ${seed}: drawn name ${a.name} is not a ${g} name from the pool`);
    assert.strictEqual(a.name, b.name);
    assert.deepStrictEqual([a.cep, a.ministry, a.rngCalls], [E.newGame(C, 'grad', 'X', seed, { gender: g }).cep, E.newGame(C, 'grad', 'X', seed).ministry, 0]);
  }
  // the batchmate is renamed (same pronoun) when the player has their name; their dice are not touched
  for (let seed = 1; seed <= 40; seed++) {
    const plain = E.newGame(C, 'grad', 'X', seed, { rival: true });
    const clash = E.newGame(C, 'grad', plain.rival.name + ' Tan', seed, { rival: true });
    assert.notStrictEqual(clash.rival.name, plain.rival.name);
    assert.strictEqual(clash.rival.pron, plain.rival.pron);
    assert.deepStrictEqual({ ...clash.rival, name: 0 }, { ...plain.rival, name: 0 });
  }
  // a save from before the start screen asked: "You" and no gender load as a drawn name, Female
  const old = JSON.parse(JSON.stringify(H.newRun('poly', 5, { build, rival: true }).S));
  old.name = 'You'; delete old.gender;
  const up = E.upgradePlayer(C, JSON.parse(JSON.stringify(old)));
  assert.strictEqual(up.gender, 'f');
  assert.ok(C.cast.names.some(x => x.full === up.name && x.pron === 'f'), up.name);
  const others = Object.values(old.cast.on).concat(old.cast.past).filter(Boolean).flatMap(p => p.nm.full.toLowerCase().split(/\s+/)).concat(old.rival.name.toLowerCase().split(/\s+/));
  assert.ok(E.playerWords(up.name, C).every(w => !others.includes(w)), 'the old save\'s drawn name clashes with its people');
  assert.strictEqual(E.nextEvent(C, old).state.name, up.name);
  assert.strictEqual(E.player(C, old).name, up.name, 'an un-upgraded save reads the same defaults');
  // the lint knows the tokens: an unknown field is flagged, and so is a pronoun before a present tense
  const { castStatic } = require('./contexts');
  const bad = { ...C, events: C.events.concat([{ id: 'x_test', title: 'X', body: '{player.given} {player.they} says', choices: [{ text: 'A', outcome: 'B' }] }]) };
  const found = castStatic({ ...build, content: bad }).filter(x => x.startsWith('x_test'));
  assert.ok(found.some(x => /unknown player field/.test(x)) && found.some(x => /present-tense/.test(x)), JSON.stringify(found));
  // the leak check catches a raw token and the wrong honorific
  assert.ok(checkScreen('A {player.formal} B', build, []).some(h => /player placeholder/.test(h.why)));
  assert.ok(checkScreen('Thank you, Mr Lim Hui Min.', build, [], { player: { name: 'Lim Hui Min', gender: 'f' } }).some(h => /honorific/.test(h.why)));
  assert.deepStrictEqual(checkScreen('Thank you, Ms Lim Hui Min.', build, [], { player: { name: 'Lim Hui Min', gender: 'f' } }), []);
});

ok('the player\'s choices are data: a third choice and a new token field need no code, and nothing but text reads the gender', () => {
  const C = build.content, E = build.engine;
  // the table in game.json drives the start screen
  assert.deepStrictEqual(E.genders(C), Object.entries(C.player.genders).map(([id, g]) => ({ id, label: g.label })));
  assert.deepStrictEqual(View.startCard(build, 'grad').genders, Object.values(C.player.genders).map(g => g.label));
  // add "Mdm" and a reflexive field, in data only
  const T = JSON.parse(JSON.stringify(C.player));
  T.genders.mdm = { label: 'Madam', pool: 'f', honorific: 'Mdm', they: 'she', them: 'her', their: 'her' };
  for (const [k, g] of Object.entries(T.genders)) g.self = k === 'm' ? 'himself' : 'herself';
  const C3 = { ...C, player: T }, b3 = { ...build, content: C3 };
  assert.deepStrictEqual(View.startCard(b3, 'grad').genders, ['Female', 'Male', 'Madam']);
  const say = (st, t) => E.render(C3, { id: 't', title: 'T', body: t, choices: [{ text: 'A', outcome: 'B' }] }, st).body;
  const S3 = E.newGame(C3, 'grad', 'Lim Hui Min', 9, { gender: 'mdm' });
  assert.strictEqual(S3.gender, 'mdm');
  assert.strictEqual(say(S3, '{player.formal} said {player.they} would do it {player.self}. {Player.Self}.'), 'Mdm Lim Hui Min said she would do it herself. Herself.');
  const blank = E.newGame(C3, 'grad', '', 9, { gender: 'mdm' });
  assert.ok(C.cast.names.some(n => n.full === blank.name && n.pron === 'f'), 'a blank name is drawn from the choice\'s pool');
  assert.strictEqual(E.newGame(C3, 'grad', 'X', 9, { gender: 'nonsense' }).gender, C.player.default, 'an unknown choice reads as the default');
  const { castStatic } = require('./contexts');
  const card = { id: 'x_self', title: 'X', body: '{player.formal} did it {player.self}.', choices: [{ text: 'A', outcome: 'B' }] };
  assert.deepStrictEqual(castStatic({ ...b3, content: { ...C3, events: C.events.concat([card]) } }).filter(x => /x_self|player\./.test(x)), [], 'a new field is a known token');
  delete T.genders.m.self;
  assert.ok(castStatic(b3).some(x => /player\.genders\.m: has fields/.test(x)), 'a field missing from one choice is flagged');
  // the leak check and the lint use the table's honorifics
  assert.ok(checkScreen('Thank you, Ms Lim Hui Min.', b3, [], { player: { name: 'Lim Hui Min', gender: 'mdm' } }).some(h => /honorific/.test(h.why)));
  // the same seed plays the same career under every choice: only the text reads the gender
  const play = (content, gender) => {
    let s = E.nextEvent(content, E.newGame(content, 'poly', 'Lim Hui Min', 77, { gender, rival: true })).state;
    const r = H.rng(5);
    for (let t = 0; t < 60 && !s.ending; t++) {
      const ev = E.eventOf(content, s), live = ev.choices.map((c, i) => i).filter(i => E.choiceAvailable(ev.choices[i], s));
      s = E.advance(content, s, live[Math.floor(r() * live.length)]).state;
    }
    const x = JSON.parse(JSON.stringify(s)); delete x.gender;
    return x;
  };
  const base = play(C3, 'f');
  for (const g of ['m', 'mdm']) assert.deepStrictEqual(play(C3, g), base, `the run moved with the choice ${g}`);
  // and in the engine's source, the gender is read only by the player's text functions
  const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'web', 'engine.js'), 'utf8');
  const block = src.slice(src.indexOf('// --- the player ---'), src.indexOf('// --- the cast ---'));
  const outside = src.replace(block, '').split('\n').filter(l => /\bgender\b/.test(l) && !/^\s*\/\//.test(l));
  assert.deepStrictEqual(outside.map(l => l.trim()), ['const me = playerOf(content, { name, gender: opts.gender, seed });   // text only', 'seed, name: me.name, gender: me.gender, origin: origin.id,'],
    'something outside the player\'s text functions reads the gender');
});

ok('hidden witnesses: never named, a nudge and never a jump, landing one to three years on, a review line only when a grade moved, Declassified says what was noticed; a run where nobody notices plays as before', () => {
  const C = build.content, E = build.engine, W = C.witnesses;
  const { witnessStatic, witnessWordProblems } = require('./contexts');
  assert.deepStrictEqual(witnessStatic(build), []);
  // the lint catches a witness given away: a role, a name, a pronoun, a number, a token
  const T = JSON.parse(JSON.stringify(W));
  T.types.panel.review.hurt.push('Your reporting officer, Ong Mei Xuan, says he had doubts. Four out of 5.');
  const leaky = { ...C, witnesses: T, events: C.events.map(e => e.id === 'copied_in' ? { ...e, witnesses: { ...e.witnesses, did: ['you told {peer}', 'x', 'y'] } } : e) };
  const found = witnessStatic({ ...build, content: leaky });
  for (const why of ['"reporting" says who', 'a name, "Ong Mei Xuan"', '"he" says who', 'a number', 'token {peer}'])
    assert.ok(found.some(x => x.includes(why)), `the lint missed ${why}: ${JSON.stringify(found)}`);
  assert.ok(witnessStatic({ ...build, content: { ...C, witnesses: { ...W, maxStep: 9 } } }).some(x => /maxStep/.test(x)), 'a reaction big enough to jump a grade is flagged');

  // careers: what the witnesses did, against the screens
  const pool = {};
  for (const [type, x] of Object.entries(W.types)) for (const sign of ['help', 'hurt']) for (const l of x.review[sign]) pool[l] = { type, sign };
  const shownSigns = new Set();
  let landed = 0, moved = 0, shown = 0, endings = 0;
  for (const origin of ['scholar', 'grad', 'poly']) for (let seed = 1; seed <= 40; seed++) {
    const r = H.rng(seed * 11 + 5);
    let run = H.newRun(origin, seed, { build, rival: seed % 2 === 0, name: 'Tan Wei Ling', gender: 'f' });
    const lines = [];
    for (let t = 0; t < 95 && run.phase !== 'ending'; t++) {
      const live = H.choices(run).filter(c => c.available);
      run = H.step(run, live[Math.floor(r() * live.length)].id);
      const turn = run.turns[run.turns.length - 1];
      if (turn.appraisal && turn.appraisal.witness) assert.ok(Math.abs(turn.appraisal.witness) <= W.cap, 'a year\'s witnesses over the cap');
      const log = run.last.log;
      log.forEach((l, i) => {
        if (l.about !== 'witness') return;
        // on a review page: after a year's heading, below that year's grade
        const head = log.slice(0, i).map(x => x.kind).lastIndexOf('year');
        assert.ok(head >= 0 && log.slice(head, i).some(x => x.kind === 'appraisal'), 'a witness line off a review page');
        assert.ok(pool[l.text], `not a witness line: ${l.text}`);
        assert.deepStrictEqual(witnessWordProblems(build, l.text), []);
        assert.ok(H.screenText(run).includes(l.text), 'the line is on the screen');
        lines.push(l.text); shownSigns.add(pool[l.text].sign);
      });
    }
    assert.strictEqual(new Set(lines).size, lines.length, `${origin} ${seed}: a witness line twice in one career`);
    const seen = (run.S.witness || { seen: [] }).seen;
    for (const e of seen) {
      assert.ok(e.due - e.year >= W.delay[0] && e.due - e.year <= W.delay[1], 'a judgement lands one to three years on');
      assert.ok(Math.abs(e.mod) <= W.maxStep);
      if (!e.landed) continue;
      landed++;
      assert.strictEqual(e.landed.year, e.due, 'a judgement lands at the appraisal it was due at');
      if (e.landed.without) moved++;
      if (e.landed.shown) { shown++; assert.ok(e.landed.without, 'a line shown for a grade that did not move'); }
      // one witness moves a grade by one step at most
      const order = C.grades.map(g => g.code);
      if (e.landed.without) assert.strictEqual(Math.abs(order.indexOf(e.landed.grade) - order.indexOf(e.landed.without)), 1);
    }
    assert.strictEqual(seen.filter(e => e.landed && e.landed.shown).length, lines.length, 'every line shown is one judgement that moved a grade');
    // the ending: what was noticed, never who
    const D = build.engine.declassify(C, run.S).filter(x => x.label === W.lines.label || x.label === W.lines.restLabel);
    if (seen.length) assert.ok(D.length, `${origin} ${seed}: witnesses noticed, and Declassified says nothing`);
    for (const d of D) {
      assert.deepStrictEqual(witnessWordProblems(build, d.text.replace(/^At \d+, /, '')), [], d.text);
      if (d.label === W.lines.label && /^At \d+, /.test(d.text)) assert.ok(/Your grade .* was an? \S+, not an? \S+\.|ceiling/.test(d.text), d.text);
    }
    const listed = D.filter(d => /^At \d+, /.test(d.text)).length;
    assert.strictEqual(listed, seen.filter(e => (e.landed && e.landed.without) || (e.ceiling && e.service && Math.min(e.ceiling[1], 8) > Math.min(e.ceiling[0], 8))).length);
    if (listed) {
      endings++;
      assert.ok(H.screenText(run).includes('DECLASSIFIED') && D.every(d => H.screenText(run).includes(d.text)), 'the entries are on the ending screen');
    }
  }
  assert.ok(shownSigns.has('help') && shownSigns.has('hurt'), 'expected seeded runs to show a helping and a hurting line');
  assert.ok(endings > 20, `expected endings with witness entries under Declassified (${endings})`);
  assert.ok(shown > 0.3 * moved && shown < 0.7 * moved, `a line about half the time a grade moved (${shown} of ${moved})`);
  assert.ok(moved < landed, 'most judgements nudge the score without moving a grade');

  // same seed, same career: a run where nobody notices anything plays exactly as without witnesses,
  // and one where somebody does plays the same until the first judgement lands
  const bare = { ...C, events: C.events.map(e => { if (!e.witnesses) return e; const x = { ...e }; delete x.witnesses; return x; }) };
  let quiet = 0, noticed = 0, waiting = 0;
  for (const origin of ['scholar', 'grad', 'poly']) for (let seed = 1; seed <= 30; seed++) {
    let a = E.nextEvent(C, E.newGame(C, origin, 'Sim', seed, { rival: seed % 2 === 1 })).state;
    let b = E.nextEvent(bare, E.newGame(bare, origin, 'Sim', seed, { rival: seed % 2 === 1 })).state;
    const r = H.rng(seed * 3 + 1);
    let apart = false;
    for (let t = 0; t < 95 && !a.ending; t++) {
      const ev = E.eventOf(C, a), live = ev.choices.map((c, i) => i).filter(i => E.choiceAvailable(ev.choices[i], a));
      const k = live[Math.floor(r() * live.length)];
      a = E.advance(C, a, k).state;
      if (apart) continue;
      b = E.advance(bare, b, k).state;
      const w = (a.witness || { seen: [] }).seen;
      if (w.some(e => e.landed || e.ceiling)) { apart = true; continue; }   // from here on, the careers may differ
      if (w.length) waiting++;   // somebody has noticed, and nothing has landed yet: still the same career
      const x = JSON.parse(JSON.stringify(a)); delete x.witness;
      assert.deepStrictEqual(x, JSON.parse(JSON.stringify(b)), `${origin} ${seed}: the run moved before any witness landed (turn ${t})`);
    }
    if (a.witness) noticed++; else { quiet++; assert.deepStrictEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b))); }
  }
  assert.ok(quiet >= 1 && noticed > 20 && waiting > 50, `expected careers with and without witnesses (${quiet}, ${noticed}, ${waiting})`);
});

console.log(`\nAll ${passed} harness tests passed.`);
