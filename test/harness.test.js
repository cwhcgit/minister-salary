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

ok('starting stats: each career starts near its origin, the same seed starts the same career, and the origins stay apart where they are ranked', () => {
  const C = build.content, E = build.engine;
  const band = (o, k) => ((o.startBand || {})[k] ?? (C.startBand || {})[k] ?? (C.startBand || {}).default ?? 0);
  const range = (o, k) => [o.stats[k] - band(o, k), o.stats[k] + band(o, k)];
  const flat = { ...C, startBand: { default: 0 }, origins: C.origins.map(o => { const x = { ...o }; delete x.startBand; return x; }) };
  for (const o of C.origins) {
    const values = Object.fromEntries(E.STATS.map(k => [k, new Set()]));
    for (let seed = 1; seed <= 300; seed++) {
      const a = E.newGame(C, o.id, 'X', seed), b = E.newGame(C, o.id, '', seed, { gender: 'm', rival: true });
      const c = E.newGame(flat, o.id, 'X', seed);
      for (const k of E.STATS) {
        assert.ok(band(o, k) <= 5, `${o.id} ${k}: a band of ${band(o, k)} is wider than the narrow band`);
        const [lo, hi] = range(o, k);
        assert.ok(a[k] >= lo && a[k] <= hi, `${o.id} seed ${seed}: ${k} ${a[k]} is outside ${lo}-${hi}`);
        assert.strictEqual(b[k], a[k], 'the name, the gender and the batchmate do not move the start');
        assert.strictEqual(c[k], o.stats[k]);
        values[k].add(a[k]);
      }
      // the band has a stream of its own: the run's own dice start where they would without it
      assert.deepStrictEqual([a.ministry, a.cep, a.rngCalls], [c.ministry, c.cep, c.rngCalls]);
    }
    for (const k of E.STATS) assert.strictEqual(values[k].size, 2 * band(o, k) + 1, `${o.id} ${k}: every start in the band is reached`);
  }
  // a scholar starts with more standing and reputation than any graduate, and a graduate more than any poly entrant
  const O = id => C.origins.find(o => o.id === id);
  for (const k of ['standing', 'reputation']) for (const [hi, lo] of [['scholar', 'grad'], ['grad', 'poly']])
    assert.ok(range(O(lo), k)[1] < range(O(hi), k)[0], `${k}: the ${lo}'s band ${range(O(lo), k).join('-')} reaches the ${hi}'s ${range(O(hi), k).join('-')}`);
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
    'header', 'rank', 'grade', 'age', 'year', 'place', 'wealth', 'wealthLabel', 'batchmate', 'label',
    'outcome', 'pages', 'text', 'log', 'tag', 'event', 'body', 'choices', 'id', 'available', 'requires',
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
        if (f2.key !== 'indicators') continue;   // the other series set no bonus (test/duplicates.js covers them)
        passedInd++;
        const src = C.events.find(e => e.id === p.event), ch = src.choices.find(c => c.stance === p.habit);
        assert.ok(ch, `${p.event}: no choice for the habit ${p.habit}`);
        const i = log.findIndex(l => l.kind === 'year' && l.page === 'passed' && l.age === p.age);
        const pay = log.slice(i + 1).find(l => l.kind === 'pay');
        const m = pay && pay.text.match(/\((?:including a National Bonus of (\d) months?|no National Bonus)\)/);
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

ok('the National Bonus card opens the Indicators: it comes first, and every later Budget card names the choice made on it, never explaining the bonus again', () => {
  const C = build.content;
  const opener = C.events.find(e => e.id === 'the_bonus_reveal');
  assert.ok(opener.series && opener.series.opens && opener.priority, 'the National Bonus card opens its series, in the first year it can');
  const family = C.events.filter(e => e.series && e.series.key === opener.series.key && e !== opener);
  assert.ok(family.length >= 3, 'the Budget cards');
  // what each stance's second showing names: the choice made on the National Bonus card
  const names = { headline: /\bGDP\b/, lowest: /\blowest incomes\b/, steady: /\basked the other ministers\b/ };
  const explains = /National Bonus|three months' (?:extra )?salary|up to six/;
  for (const c of opener.choices) assert.ok(names[c.stance], `"${c.text}": its stance must be one every Budget card has`);
  for (const e of family) for (const st of Object.keys(names)) {
    const sc = (e.again.scenes || {})[st];
    assert.ok(sc && e.choices.some(c => c.stance === st), `${e.id}: no second showing for ${st}`);
    assert.ok(/\bLast time\b/.test(sc.body) && names[st].test(sc.body), `${e.id} ${st}: the second showing does not name the choice made on the National Bonus card`);
    assert.ok(!explains.test(sc.body), `${e.id} ${st}: explains the bonus again`);
  }
  // careers: the card comes before any Budget card, the next Budget card is its second showing,
  // and nothing in the series is ever shown in full as if new
  const ids = new Set(family.map(e => e.id)), state = new Map();
  let opened = 0, again = 0, passed = 0;
  const visit = mode => ({ origin, seed, pre, ev, res }) => {
    const key = `${mode} ${origin} ${seed}`, st = state.get(key) || {};
    state.set(key, st);
    if (ev.id === opener.id) { opened++; st.stance = res.state.series[opener.series.key].stance; st.full = 1; }
    if (ids.has(ev.id)) {
      assert.ok(pre.seen.includes(opener.id), `${key}: ${ev.id} before the National Bonus card`);
      assert.strictEqual(String(ev.variant), 'again:' + st.stance, `${key}: ${ev.id} shown in full as if new (${ev.variant})`);
      assert.ok(names[st.stance].test(ev.body) && !explains.test(ev.body), `${key}: ${ev.id} does not name the earlier choice: ${ev.body}`);
      assert.ok(++st.full <= 2, `${key}: a third full showing`);
      again++;
    }
    for (const p of res.trace.passed || []) if (ids.has(p.ev)) {
      assert.ok(st.stance !== undefined && st.full === 2, `${key}: ${p.ev} passed before its second showing`);
      passed++;
    }
  };
  careers(70, { greedy: true }, visit('greedy'));
  careers(70, {}, visit('random'));
  assert.ok(opened > 60 && again > 40 && passed > 20, `expected the card, second showings and passed years (${opened}, ${again}, ${passed})`);
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
  // with every line of a habit remembered but one, that one is taken first (a repeatable card is a
  // series now, so the habit's card is built for the test: the_work as it was, its lines by choice)
  const S = JSON.parse(JSON.stringify(first.S));
  const work = build.content.events.find(e => e.id === 'the_work');
  const ev = { ...work, series: undefined, noMontage: undefined, again: undefined, montageLines: { 0: work.montageLines.substance } };
  const C = { ...build.content, events: build.content.events.map(e => (e.id === 'the_work' ? ev : e)) };
  S.linesUsed = {}; S.fillerSeen.the_work = 1; S.habits.the_work = 0; S.currentEvent = '__montage:the_work';
  const n = ev.montageLines[0].length;
  S.recent = Array.from({ length: n }, (_, i) => `mw:the_work:0#${i}`).filter(k => k !== `mw:the_work:0#${n - 1}`);
  assert.strictEqual(build.engine.eventOf(C, S).body, ev.montageLines[0][n - 1]);
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
      let k = -1, first = res.log.length && (res.log.find(l => l.kind === 'year') || {}).page === 'review';
      for (const l of res.log) {
        if (l.kind === 'year') { k++; reviews.push({ age: l.age, promotion: first ? (k === 0 ? res.trace.promotion : (res.trace.passed[k - 1] || {}).promotion) : (res.trace.passed[k] || {}).promotion, lines: [] }); }
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
      const sw = log.filter(l => l.about === 'swing');
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

ok('the player\'s tokens: the three forms of the name and the pronouns, a blank name drawn for the gender, and old saves', () => {
  const C = build.content, E = build.engine;
  const S = (name, gender) => E.newGame(C, 'grad', name, 7, { gender });
  const say = (st, t) => E.render(C, { id: 't', title: 'T', body: t, choices: [{ text: 'A', outcome: 'B' }] }, st).body;
  const t = '"{player.given}?" {player.formal} said {player.they} would come. Ask {player.them} about {player.their} file, "{player.full}". {Player.They} said so. {player.Their} file. {player}.';
  assert.strictEqual(say(S('Tan Wei Ming', 'm'), t), '"Wei Ming?" Mr Tan said he would come. Ask him about his file, "Mr Tan Wei Ming". He said so. His file. Tan Wei Ming.');
  assert.strictEqual(say(S('Lim Hui Min', 'f'), t), '"Hui Min?" Ms Lim said she would come. Ask her about her file, "Ms Lim Hui Min". She said so. Her file. Lim Hui Min.');
  assert.strictEqual(say(S('Dr Ong', 'f'), '{player.formal}, {player.full}, {player.given}'), 'Dr Ong, Dr Ong, Dr Ong', 'a typed honorific is kept, not doubled');
  assert.strictEqual(say(S('Dr Tan Wei Ling', 'm'), '{player.given}, {player.formal}, {player.full}'), 'Wei Ling, Dr Tan, Dr Tan Wei Ling');
  assert.strictEqual(say(S('{peer} $&', 'f'), '{player} / {player.given} / {player.full}'), '{peer} $& / {peer} / Ms {peer} $&', 'what the player typed is never read as a token');
  // a blank name: a name from the cast pool for that gender, the same for the same seed, and its
  // forms are the pool's own
  for (let seed = 1; seed <= 30; seed++) for (const g of ['f', 'm']) {
    const a = E.newGame(C, 'grad', '', seed, { gender: g }), b = E.newGame(C, 'grad', '  ', seed, { gender: g });
    const n = C.cast.names.find(x => x.full === a.name);
    assert.ok(n && n.pron === g, `seed ${seed}: drawn name ${a.name} is not a ${g} name from the pool`);
    assert.strictEqual(a.name, b.name);
    const hon = C.player.genders[g].honorific;
    assert.deepStrictEqual(say(a, '{player.given}|{player.formal}|{player.full}').split('|'), [n.given, `${hon} ${n.formal}`, `${hon} ${n.full}`]);
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
  const bad = { ...C, events: C.events.concat([{ id: 'x_test', title: 'X', body: '{player.nickname} {player.they} says', choices: [{ text: 'A', outcome: 'B' }] }]) };
  const found = castStatic({ ...build, content: bad }).filter(x => x.startsWith('x_test'));
  assert.ok(found.some(x => /unknown player field/.test(x)) && found.some(x => /present-tense/.test(x)), JSON.stringify(found));
  // the leak check catches a raw token and the wrong honorific, before the whole name or the surname
  assert.ok(checkScreen('A {player.formal} B', build, []).some(h => /player placeholder/.test(h.why)));
  const lim = { player: { name: 'Lim Hui Min', gender: 'f' } };
  for (const bad of ['Thank you, Mr Lim Hui Min.', 'Thank you, Mr Lim.']) assert.ok(checkScreen(bad, build, [], lim).some(h => /honorific/.test(h.why)), bad);
  for (const good of ['Thank you, Ms Lim Hui Min.', 'Thank you, Ms Lim.', 'Hui Min, thank you.']) assert.deepStrictEqual(checkScreen(good, build, [], lim), [], good);
});

// Reading a typed name into its three forms (game.json player.names; engine nameForms): given is
// what colleagues say, formal the honorific and the surname (or the given name, with no surname),
// full the honorific and the whole name.
ok('a typed name is read into its three forms by Singapore\'s naming conventions, and never into broken text', () => {
  const C = build.content, E = build.engine;
  const forms = (name, gender = 'f') => { const p = E.player(C, { name, gender }); return [p.given, p.formal, p.full]; };
  const TABLE = [
    // surname first, as Chinese names are written (Hanyu Pinyin and dialect spellings)
    ['Lim Wei Ling', 'f', 'Wei Ling', 'Ms Lim', 'Ms Lim Wei Ling'],
    ['Tan Kok Leong', 'm', 'Kok Leong', 'Mr Tan', 'Mr Tan Kok Leong'],
    ['Zhang Xin Yi', 'f', 'Xin Yi', 'Ms Zhang', 'Ms Zhang Xin Yi'],
    ['Quek Boon Huat', 'm', 'Boon Huat', 'Mr Quek', 'Mr Quek Boon Huat'],
    ['lim wei ling', 'f', 'Wei Ling', 'Ms Lim', 'Ms Lim Wei Ling'],
    ['  Goh   Jia  Xin ', 'f', 'Jia Xin', 'Ms Goh', 'Ms Goh Jia Xin'],
    // a surname last, Western order
    ['Charmaine Ang', 'f', 'Charmaine', 'Ms Ang', 'Ms Charmaine Ang'],
    ['Wei Ling Tan', 'f', 'Wei Ling', 'Ms Tan', 'Ms Wei Ling Tan'],
    ['Siew Ling Goh', 'f', 'Siew Ling', 'Ms Goh', 'Ms Siew Ling Goh'],
    ['Mei Ling Kok', 'f', 'Mei Ling', 'Ms Kok', 'Ms Mei Ling Kok'],
    ['Charmaine Tan Wei Ling', 'f', 'Charmaine', 'Ms Tan', 'Ms Charmaine Tan Wei Ling'],
    ['Benjamin Sim Jun Hao', 'm', 'Benjamin', 'Mr Sim', 'Mr Benjamin Sim Jun Hao'],
    ['Daniel de Souza', 'm', 'Daniel', 'Mr de Souza', 'Mr Daniel de Souza'],
    ['Maya Torres', 'f', 'Maya', 'Ms Torres', 'Ms Maya Torres'],
    // a Chinese given name typed alone: no surname
    ['Jia Hui', 'f', 'Jia Hui', 'Ms Jia Hui', 'Ms Jia Hui'],
    ['Kok Leong', 'm', 'Kok Leong', 'Mr Kok Leong', 'Mr Kok Leong'],
    // Malay names: bin or binte, or a Malay first name; no surname, so formal uses the given name
    ['Nurul Huda binte Rahmat', 'f', 'Nurul Huda', 'Ms Nurul Huda', 'Ms Nurul Huda binte Rahmat'],
    ['NURUL HUDA BINTE RAHMAT', 'f', 'Nurul Huda', 'Ms Nurul Huda', 'Ms Nurul Huda binte Rahmat'],
    ['Muhammad Faizal bin Osman', 'm', 'Faizal', 'Mr Faizal', 'Mr Muhammad Faizal bin Osman'],
    ['Siti Aishah', 'f', 'Aishah', 'Ms Aishah', 'Ms Siti Aishah'],
    ['Nur Aisyah', 'f', 'Nur Aisyah', 'Ms Nur Aisyah', 'Ms Nur Aisyah'],
    // Indian names: s/o or d/o, a father's name last, initials, or a family name last
    ['Kavya Rajan', 'f', 'Kavya', 'Ms Kavya', 'Ms Kavya Rajan'],
    ['Rajesh s/o Kumar', 'm', 'Rajesh', 'Mr Rajesh', 'Mr Rajesh s/o Kumar'],
    ['Priya d/o Ramasamy', 'f', 'Priya', 'Ms Priya', 'Ms Priya d/o Ramasamy'],
    ['S. Thangaraj', 'm', 'Thangaraj', 'Mr Thangaraj', 'Mr S. Thangaraj'],
    ['Priya Nair', 'f', 'Priya', 'Ms Nair', 'Ms Priya Nair'],
    ['Harpreet Kaur', 'f', 'Harpreet', 'Ms Kaur', 'Ms Harpreet Kaur'],
    // a single word, and a typed honorific
    ['Madonna', 'f', 'Madonna', 'Ms Madonna', 'Ms Madonna'],
    ['QA', 'm', 'QA', 'Mr QA', 'Mr QA'],
    ['Dr Tan Wei Ling', 'f', 'Wei Ling', 'Dr Tan', 'Dr Tan Wei Ling'],
    ['Dr Ong', 'm', 'Dr Ong', 'Dr Ong', 'Dr Ong']
  ];
  for (const [name, g, ...want] of TABLE) assert.deepStrictEqual(forms(name, g), want, name);
  // every name in the cast pool is read as the pool reads it, by the lists alone (the pool's one
  // choice the lists cannot make: which of two Malay given names colleagues use)
  const noPool = { ...C, cast: { ...C.cast, names: [] } };
  const differ = C.cast.names.filter(n => {
    const p = E.player(noPool, { name: n.full, gender: n.pron });
    return p.given !== n.given || p.formal !== `${C.player.genders[n.pron].honorific} ${n.formal}`;
  });
  assert.deepStrictEqual(differ.map(n => n.full), ['Khairul Anwar bin Salleh']);
  // the batchmate's names are given names: read alone, they have no surname
  for (const n of C.rival.names) assert.deepStrictEqual(forms(n.name, n.pron).slice(0, 2), [n.name, `${C.player.genders[n.pron].honorific} ${n.name}`], n.name);
  // never broken text: every form of an odd name is made of what was typed, with nothing doubled or empty
  for (const name of ['Tan', 'bin', 'Siti', 'd/o Rajan', 'Ms', 'A. B.', 'de Souza', 'Lim, Wei Ling', 'Mr Mr Tan', "O'Brien-Lee", 'Tan Wei Ling Charmaine'])
    for (const f of forms(name, 'f')) assert.ok(f && !/\s{2}|^\s|\s$|undefined|null/.test(f), `${name}: "${f}"`);
});

// How people address the player (docs/WRITING_RULES.md rule 4.1): the lint in test/contexts.js.
ok('the address lint: a colleague never calls you {player.formal} or {player.full}, and the content always says which form it means', () => {
  const C = build.content, { playerAddress } = require('./contexts');
  const card = (id, body) => ({ id, title: 'X', body, choices: [{ text: 'A', outcome: 'B' }] });
  const lint = (bodies, extra = {}) => playerAddress({ ...build, content: { ...C, ...extra, events: bodies.map((b, i) => card('x' + i, b)) } }).map(x => +x.match(/^x(\d+)/)?.[1]);
  assert.deepStrictEqual(lint([
    '{peer} messages you within the minute: "Nice one, {player.formal}."',
    '"Well done, {player.full}," says {senior}, your reporting officer.',
    'Your batchmate laughs: "{player.formal}, again?"',
    'A colleague leans over: "Is that you, {player.formal}?"',
    'Everyone says {player} did well.',
    // clean: an official, the press, a sentence apart, a contrast on purpose
    'At the end your questioner says, "Thank you, {player.formal}. That was very complete."',
    '{peer} sends you the article. Its headline is "{player.formal} resigns".',
    '{junior} calls you "{player.given}" on day one and "{player.formal}" on day two.',
    'The footer says "Prepared by {player.full}, Secretariat".',
    '{senior} looks up: "{player.given}, a minute?"'
  ]), [0, 1, 2, 3, 4]);
  // a cast line of a colleague's role is that person's own speech
  const withLine = (role, t) => playerAddress({ ...build, content: { ...C, events: [], cast: { ...C.cast, lines: { [role]: { arrive: [t] } } } } });
  assert.strictEqual(withLine('peer', '{name} writes: "Dear {player.formal}, see you around."').length, 1);
  assert.strictEqual(withLine('journalist', '{name} writes: "Dear {player.formal}, it was a pleasure."').length, 0);
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
  assert.strictEqual(say(S3, '{player.full}: {player.formal} said {player.they} would do it {player.self}. {Player.Self}.'), 'Mdm Lim Hui Min: Mdm Lim said she would do it herself. Herself.');
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

ok('hidden witnesses: never named, a nudge and never a jump, landing one to three years on, on the ladder they were made on, a review line only when a grade moved; a run where nobody notices plays as before', () => {
  const C = build.content, E = build.engine, W = C.witnesses;
  const { witnessStatic, witnessWordProblems } = require('./contexts');
  assert.deepStrictEqual(witnessStatic(build), []);
  // the lint catches a witness given away: a role, a name, a pronoun, a number, a token; and a
  // politics line in the service's words
  const T = JSON.parse(JSON.stringify(W));
  T.types.panel.review.hurt.push('Your reporting officer, Ong Mei Xuan, says he had doubts about {peer}. Four out of 5.');
  T.types.branch.review.hurt.push('Your volunteers tell the party that you are never upstairs.');
  T.types.pressGallery.review.help.push('A reporter writes that you are candid.');
  const found = witnessStatic({ ...build, content: { ...C, witnesses: T } });
  for (const why of ['"reporting" says who', 'a name, "Ong Mei Xuan"', '"he" says who', 'a number', 'token {peer}',
    '"volunteers" says who', '"party" says who', 'the service\'s words ("upstairs")', '"reporter" says who'])
    assert.ok(found.some(x => x.includes(why)), `the lint missed ${why}: ${JSON.stringify(found)}`);
  assert.ok(witnessStatic({ ...build, content: { ...C, witnesses: { ...W, maxStep: 9 } } }).some(x => /maxStep/.test(x)), 'a reaction big enough to jump a grade is flagged');
  // ...a politics witness on a card only shown in the service, and a "did" line, which nothing reads
  const misplaced = { ...C, events: C.events.map(e => e.id === 'copied_in'
    ? { ...e, witnesses: { did: ['x', 'y', 'z'], by: { ...e.witnesses.by, branch: { chance: 0.5, react: [1, -1, 0] } } } } : e) };
  const f2 = witnessStatic({ ...build, content: misplaced });
  assert.ok(f2.some(x => /^copied_in: witness branch: a politics witness/.test(x)), JSON.stringify(f2));
  assert.ok(f2.some(x => /^copied_in: witnesses\.did is not read/.test(x)), JSON.stringify(f2));
  // every type has its lines, and the politics ones are their own
  const ladder = t => W.types[t].ladder || 'service';
  for (const t of ['leadership', 'whips', 'branch', 'pressGallery', 'officials', 'fellowMPs']) assert.strictEqual(ladder(t), 'politics', t);

  // careers: what the witnesses did, against the screens
  const pool = {};
  for (const [type, x] of Object.entries(W.types)) for (const sign of ['help', 'hurt']) for (const l of x.review[sign]) pool[l] = { type, sign };
  const shownSigns = new Set(), shownLadders = new Set();
  let landed = 0, moved = 0, shown = 0, lapsed = 0;
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
        // a politics witness speaks only on a politician's review page, and the service's only on an officer's
        assert.strictEqual(ladder(pool[l.text].type) === 'politics', run.S.rank >= 8, `${origin} ${seed}: "${l.text}" on the wrong ladder`);
        lines.push(l.text); shownSigns.add(pool[l.text].sign); shownLadders.add(ladder(pool[l.text].type));
      });
    }
    assert.strictEqual(new Set(lines).size, lines.length, `${origin} ${seed}: a witness line twice in one career`);
    const seen = (run.S.witness || { seen: [] }).seen;
    for (const e of seen) {
      assert.ok(e.due - e.year >= W.delay[0] && e.due - e.year <= W.delay[1], 'a judgement lands one to three years on');
      assert.ok(Math.abs(e.mod) <= W.maxStep);
      assert.strictEqual(e.service, ladder(e.type) === 'service', 'a judgement belongs to its witness\'s ladder');
      assert.ok(!('did' in e) && !('title' in e) && !('text' in e), 'a judgement keeps nothing for the ending');
      if (e.lapsed) { lapsed++; assert.ok(!e.landed, 'a judgement both lapsed and landed'); }
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
    // the ending never mentions witnesses: Declassified reads the same with or without them
    if (run.S.witness) {
      const D = E.declassify(C, run.S), bare = E.declassify(C, { ...run.S, witness: undefined });
      assert.deepStrictEqual(D, bare, `${origin} ${seed}: the ending changes with the witnesses`);
      for (const d of D) assert.ok(!/notic/i.test(d.label) && !Object.keys(pool).some(l => d.text.includes(l)), `${origin} ${seed}: ${d.label}: ${d.text}`);
    }
  }
  assert.ok(shownSigns.has('help') && shownSigns.has('hurt'), 'expected seeded runs to show a helping and a hurting line');
  assert.ok(shown > 0.3 * moved && shown < 0.7 * moved, `a line about half the time a grade moved (${shown} of ${moved})`);
  assert.ok(moved < landed, 'most judgements nudge the score without moving a grade');
  assert.ok(lapsed > 0, 'expected some of the service\'s judgements to lapse when the player left for politics');

  // same seed, same career: a run where nobody notices anything plays exactly as without witnesses,
  // and one where somebody does plays the same until the first judgement lands
  const strip = e => { if (!e.witnesses) return e; const x = { ...e }; delete x.witnesses; return x; };
  const bare = { ...C, events: C.events.map(strip), rival: C.rival && { ...C.rival, events: (C.rival.events || []).map(strip) } };
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
  assert.ok(noticed > 60 && waiting > 50, `expected careers where somebody noticed (${quiet}, ${noticed}, ${waiting})`);
});

ok('hidden witnesses in politics: a politics career can show a politics witness line, and the service\'s judgements lapse there', () => {
  const C = build.content, W = C.witnesses;
  const pol = new Map();
  for (const [type, x] of Object.entries(W.types)) if (x.ladder === 'politics') for (const sign of ['help', 'hurt']) for (const l of x.review[sign]) pol.set(l, type);
  let careers = 0, politicians = 0, shown = 0, types = new Set(), lapsedOnEntry = 0;
  for (let seed = 1; seed <= 400 && shown < 12; seed++) for (const origin of ['scholar', 'grad', 'poly']) {
    const r = H.rng(seed * 7 + 2);
    let run = H.newRun(origin, seed, { build, name: 'Sim' });
    careers++;
    let inPolitics = false;
    for (let t = 0; t < 95 && run.phase !== 'ending'; t++) {
      // head for politics: take the tea, then play at random
      const live = H.choices(run).filter(c => c.available);
      const tea = run.S.currentEvent === 'tea_session' || run.S.currentEvent === 'the_vetting';
      run = H.step(run, (tea ? live[0] : live[Math.floor(r() * live.length)]).id);
      if (run.S.rank >= 8) inPolitics = true;
      for (const l of run.last.log) if (l.about === 'witness' && pol.has(l.text)) {
        assert.ok(run.S.rank >= 8, `a politics line in the service: ${l.text}`);
        shown++; types.add(pol.get(l.text));
      }
    }
    if (inPolitics) {
      politicians++;
      // what the service noticed and had not landed by the election lapsed at the first appraisal in politics
      lapsedOnEntry += ((run.S.witness || { seen: [] }).seen).filter(e => e.service && e.lapsed).length;
    }
  }
  assert.ok(politicians > 10, `expected careers in politics (${politicians} of ${careers})`);
  assert.ok(shown > 0, `no politics career showed a politics witness line (${politicians} politicians)`);
  assert.ok(lapsedOnEntry > 0, 'expected the service\'s judgements to lapse in politics');
  console.log(`    (${shown} politics witness lines from ${types.size} types, in ${politicians} careers in politics)`);
});

// --- what the playtesters could not follow (final playtest): the engine's part ---------------

// A careers sampler for the tests below: the engine directly, so every log entry is to hand.
// greedy: the "knows the win" bot (reaches politics); otherwise random play.
function careers(n, { greedy = false, origins = ['scholar', 'grad', 'poly'], rival = s => s % 3 === 0 } = {}, visit) {
  const E = build.engine, C = build.content;
  const score = f => (f.cep||0)*60 + (f.standing||0)*1.5 + (f.competence||0)*1.4 + (f.reputation||0)*1.3 - (f.heat||0)*0.8;
  for (const origin of origins) for (let seed = 1; seed <= n; seed++) {
    const r = H.rng(seed * 17 + 3);
    let S = E.nextEvent(C, E.newGame(C, origin, 'Tan Wei Ling', seed, { rival: rival(seed), gender: 'f' })).state;
    for (let t = 0; t < 120 && !S.ending; t++) {
      const ev = E.eventOf(C, S);
      const live = ev.choices.map((c, i) => [c, i]).filter(([c]) => E.choiceAvailable(c, S));
      const pick = greedy ? live.reduce((a, b) => score(b[0].effects || {}) > score(a[0].effects || {}) ? b : a)[1] : live[Math.floor(r() * live.length)][1];
      const res = E.advance(C, S, pick);
      visit({ origin, seed, pre: S, ev, res, S: res.state });
      S = res.state;
    }
  }
}

ok('the sideways move is real: after three Cs the reporting officer stays behind, and someone new is introduced from next year', () => {
  const E = build.engine, C = build.content;
  let moves = 0, introduced = 0;
  const watch = new Map();   // origin+seed -> { old, newId, year }
  careers(80, {}, ({ origin, seed, pre, ev, res, S }) => {
    const key = origin + seed, w = watch.get(key);
    // the first card after the move that names the reporting officer names the new one, introduced
    if (w && ev.who && ev.who.senior !== undefined && !w.checked) {
      const now = pre.cast.on.senior;
      assert.notStrictEqual(ev.who.senior, w.old.id, `${key}: the old reporting officer is still named after the move`);
      const name = now && E.personField(C, pre, 'senior', now, '');
      // the introduction is in the body (a card naming them only in a choice has met them)
      w.checked = true;
      if (now && now.id === w.newId && ev.body.includes(name)) {
        assert.ok(ev.body.includes(name + ','), `${key}: the new reporting officer is not introduced on the first card: ${ev.body}`);
        assert.ok(!ev.body.includes(E.personField(C, pre, 'senior', w.old, '') + ' '), `${key}: the old reporting officer is in the body`);
        introduced++;
      }
    }
    const warn = res.log.find(l => l.about === 'sideways');
    if (!warn || !pre.cast.on.senior) return;
    // the move happened at the year-end of the card's year, or in a year that passed by itself
    const old = S.cast.past.find(p => p.why === 'sideways' && p.left >= pre.year);
    assert.ok(old, `${key}: nobody left in the sideways move`);
    assert.ok(warn.text.includes(E.personField(C, S, 'senior', old, '')), `${key}: the move does not name who stays behind: ${warn.text}`);
    assert.ok(!/\{[^{}\s]+\}/.test(warn.text) && /new reporting officer/.test(warn.text), warn.text);
    const now = S.cast.on.senior;
    if (!S.ending && S.rank < 7) {
      assert.ok(now && now.id !== old.id, `${key}: no new reporting officer after the move`);
      assert.ok(now.since > old.left, `${key}: the new reporting officer arrived in the year of the move, not the next`);
      assert.ok(!now.flags.length && now.met === undefined, `${key}: the new reporting officer has history`);
      // no arrival line: the move has said it, and the first card introduces them
      assert.ok(!res.log.some(l => l.cast === 'senior' && l.at.person === now.id), `${key}: an arrival line for the new reporting officer`);
      moves++;
      if (!watch.has(key)) watch.set(key, { old, newId: now.id, year: S.year });
    }
  });
  assert.ok(moves > 40 && introduced > 20, `expected sideways moves and introductions (${moves}, ${introduced})`);
  // in politics the select committee moves nobody
  const S = build.engine.newGame(C, 'grad', 'X', 5);
  assert.deepStrictEqual(S.cast.past, []);
});

ok('a new reporting officer card (replaces) hands {senior} to a newcomer, introduced on the next card that names them', () => {
  const E = build.engine, C = build.content;
  const cards = C.events.filter(e => e.replaces);
  assert.ok(cards.some(e => e.id === 'new_ro'), 'new_ro hands the role on');
  for (const e of cards) for (const r of e.replaces) assert.ok(C.cast.roles[r], `${e.id}: replaces an unknown role ${r}`);
  let n = 0;
  for (const origin of ['grad', 'scholar']) for (let seed = 1; seed <= 60; seed++) {
    let S = E.newGame(C, origin, 'X', seed);
    S.rank = 2; S.age = 30; S.year = 5;   // a grade new_ro can be drawn at
    S = { ...S, cast: undefined }; delete S.cast;
    S = E.nextEvent(C, { ...S, currentEvent: null }).state;
    if (!S.cast.on.senior) continue;
    S.currentEvent = 'new_ro';
    const ev = E.eventOf(C, S), old = S.cast.on.senior;
    const res = E.advance(C, S, seed % ev.choices.length);
    const now = res.state.cast.on.senior;
    assert.ok(res.state.cast.past.some(p => p.id === old.id && p.why === 'replaced'), 'the old reporting officer leaves the story');
    if (res.state.ending || res.state.rank > 6) continue;
    assert.ok(now && now.id !== old.id && now.met === undefined, 'a newcomer holds the role, not yet met');
    assert.ok(!res.log.some(l => l.cast === 'senior'), 'no arrival line: the card has said it');
    n++;
  }
  assert.ok(n > 50, `expected new_ro to hand over (${n})`);
});

ok('the header says where you are: a backbencher\'s seat, never a ministry left behind; an office holder\'s ministry', () => {
  const E = build.engine, C = build.content, M = new Set(C.ministries);
  const L = C.engineLines.place;
  let mps = 0, office = 0, candidates = 0, pages = 0;
  const check = (h, flags, ministry, where) => {
    if (h.title === C.ladder[8].title) {
      assert.ok(!M.has(h.place), `${where}: an MP's header names ${h.place}`);
      assert.strictEqual(h.place, flags.includes('seat_smc') ? L.smc : flags.includes('seat_grc') ? L.grc : L.mp, where);
      mps++;
    } else if (C.ladder.findIndex(r => r.title === h.title && r.grade === h.grade) >= 9 && h.grade !== 'PM') {
      assert.strictEqual(h.place, ministry, `${where}: an office holder's header is not the ministry they serve in`);
      office++;
    }
  };
  careers(40, { greedy: true }, ({ origin, seed, pre, ev, res, S }) => {
    const where = `${origin} ${seed} y${pre.year}`;
    const eh = E.header(C, pre);
    if (ev.id === 'the_election') { assert.strictEqual(eh.place, L.candidate, `${where}: the election card's header`); candidates++; }
    else check(eh, pre.flags, pre.ministry, where + ' event');
    // every page of the outcome, under its own header
    if (res.head) check(res.head, S.flags, S.ministry, where + ' outcome');
    for (const l of res.log.filter(l => l.kind === 'year')) { check(l.head, S.flags, S.ministry, `${where} page ${l.year}`); pages++; }
  });
  assert.ok(mps > 200 && office > 500 && candidates > 30 && pages > 1000, `expected MPs, office holders and candidates (${mps}, ${office}, ${candidates}, ${pages})`);
  // a backbencher's first office names its ministry, once
  const S = { ...E.newGame(C, 'grad', 'X', 3), rank: 8, yearsInGrade: 5, competence: 100, standing: 100, reputation: 100, cep: 15, age: 45, flags: ['seat_grc'] };
  S.currentEvent = E.nextEvent(C, S).state.currentEvent;
  const res = E.advance(C, { ...S }, 0);
  const promo = res.log.find(l => l.kind === 'promo' && /^Promoted/.test(l.text));
  if (promo) assert.ok(promo.text.includes(S.ministry), promo.text);
});

ok('a political heads-up or rumour never names a rank the player already holds', () => {
  const E = build.engine, C = build.content;
  const esc = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (let r = 0; r < 16; r++) {
    const name = E.nextName(C, r);
    assert.notStrictEqual(name, C.ladder[r].title, `the rung above ${C.ladder[r].title} (${C.ladder[r].grade}) is named as the rank itself`);
    // a rung that shares its title with the one below (Minister MR4, then MR3) is named without it
    if (C.ladder[r + 1].title === C.ladder[r].title) assert.ok(!new RegExp(`\\b${esc(C.ladder[r].title)}\\b`).test(name), `the rung above ${C.ladder[r].grade} is named "${name}"`);
    else assert.strictEqual(name, C.ladder[r + 1].title);
  }
  let lines = 0, held = 0;
  careers(40, { greedy: true }, ({ origin, seed, res }) => {
    // each page's rank is the one its header shows; the lines on it are about the next rung
    let title = res.head && res.head.title;
    for (const l of res.log) {
      if (l.kind === 'year') { title = l.head.title; continue; }
      if (!['headsUp', 'blocked'].includes(l.about) || l.rank < 8) continue;
      lines++;
      if (l.rank === 13) held++;
      const mine = C.ladder[l.rank].title;
      assert.strictEqual(mine, title, `${origin} ${seed}: a line about rank ${l.rank} on a page showing ${title}`);
      assert.ok(!new RegExp(`\\bfor ${esc(mine)}\\b`).test(l.text), `${origin} ${seed}: "${l.text}" names ${mine}, the rank held`);
    }
  });
  assert.ok(lines > 200 && held > 10, `expected political heads-ups, some at MR4 (${lines}, ${held})`);
});

ok('every outcome page heading carries its year and age, and a year with nothing to decide says why', () => {
  const C = build.content;
  let pages = 0, passed = 0, payWhy = 0, falls = 0;
  const kinds = {};
  careers(50, {}, ({ origin, seed, pre, res, S }) => {
    const where = `${origin} ${seed} y${pre.year}`;
    const ys = res.log.filter(l => l.kind === 'year');
    ys.forEach((l, i) => {
      const m = l.text.match(/^Year (\d+) · Age (\d+) · (.+)$/);
      assert.ok(m, `${where}: a page heading without its year and age: "${l.text}"`);
      assert.deepStrictEqual([+m[1], +m[2]], [l.year, l.age], where);
      // the pages run in order, one year each, from the card's own year
      assert.strictEqual(l.year, pre.year + i + (ys[0].page === 'review' ? 0 : 1), `${where}: page ${i} is year ${l.year}`);
      assert.strictEqual(l.age - pre.age, l.year - pre.year, `${where}: page ${i}'s age and year disagree`);
      // and its header is that year's
      assert.deepStrictEqual([l.head.year, l.head.age], [l.year, l.age], `${where}: page ${i}'s header is not dated to its year`);
      pages++;
      if (l.page === 'passed') {
        passed++;
        const next = res.log[res.log.indexOf(l) + 1];
        assert.ok(next && next.about === 'noDecision' && /^No decision was needed this year\./.test(next.text), `${where}: a year without a decision that does not say why: ${next && next.text}`);
        assert.ok(!/\{[^{}\s]+\}/.test(next.text), next.text);
        kinds[next.passed] = (kinds[next.passed] || 0) + 1;
      }
    });
    // the first page's header is the year the card was played in
    assert.deepStrictEqual([res.head.year, res.head.age], [pre.year, pre.age], where);
    // pay: a reason in words when it moved for a reason the player cannot see; never a stat's number
    for (const l of res.log.filter(l => l.kind === 'pay')) {
      if (!/^Annual package: /.test(l.text)) continue;
      if (/on last year: /.test(l.text)) { payWhy++; assert.ok(!/(competence|standing|reputation|integrity)\W*\d/i.test(l.text), l.text); }
      if (/, down \$[\d,]+ on last year: /.test(l.text)) falls++;
    }
  });
  assert.ok(pages > 2000 && passed > 500 && payWhy > 300 && falls > 50, `expected pages, passed years and pay reasons (${pages}, ${passed}, ${payWhy}, ${falls})`);
  // repeatable cards repeat as series now (WRITING_RULES 5.15): a year that keeps a habit is a series year
  assert.ok((kinds.habit || 0) + (kinds.series || 0) > 100 && kinds.series > 0 && kinds.auto > 10, `every kind of quiet year says why: ${JSON.stringify(kinds)}`);
});

ok('every pay line from the second year says how it compares with last year, and a fall always says why', () => {
  let checked = 0, falls = 0, same = 0, first = 0;
  const money = t => +t.replace(/[$,]/g, '');
  careers(30, { greedy: false }, ({ pre, res }) => {
    let last = pre.lastPay ? pre.lastPay.total : null;
    for (const l of res.log) {
      if (l.kind !== 'pay' || !/^Annual package: /.test(l.text)) continue;
      const now = money(l.text.match(/^Annual package: (\$[\d,]+)/)[1]);
      if (last === null) { first++; assert.ok(!/last year/.test(l.text), `the first pay line compares: ${l.text}`); last = now; continue; }
      checked++;
      const m = l.text.match(/, (?:(up|down) (\$[\d,]+) on last year|the same as last year)(?:: (.+))?$/);
      assert.ok(m, `a pay line that does not compare with last year: ${l.text}`);
      const d = m[1] ? (m[1] === 'up' ? 1 : -1) * money(m[2]) : 0;
      assert.strictEqual(d, now - last, `the difference is wrong: ${l.text} (last year $${last})`);
      if (d < 0) { falls++; assert.ok(m[3], `a fall with no reason: ${l.text}`); }
      if (d === 0) { same++; assert.ok(!m[3], l.text); }
      last = now;
    }
  });
  assert.ok(checked > 1000 && falls > 100 && same > 10 && first > 50, `expected comparisons, falls and steady years (${checked}, ${falls}, ${same}, ${first})`);
});

ok('every card says who its people are: the full introduction first, a short tag on later cards, never on the card right after', () => {
  const E = build.engine, C0 = build.content, R = C0.cast.roles;
  const card = (id, body, choices) => ({ id, title: 'Test ' + id, body, weight: 0,
    choices: choices || [{ text: 'Carry on.', effects: {}, outcome: 'You carry on.' }] });
  const C = { ...C0, events: C0.events.concat([
    card('t_peer', '{peer} asks you to lunch on Friday.'),
    card('t_own', '{peer}, the friend who never forgets a birthday, asks you to lunch.'),
    card('t_none', 'The canteen has a new menu.'),
    card('t_hidden', 'The canteen has a new menu.', [
      { text: 'Ask around.', effects: {}, outcome: '{junior} tells you the old one was better.' },
      { text: 'Eat.', effects: {}, outcome: 'You eat.' }]),
    card('t_junior', '{junior} brings you the minutes.'),
    card('t_junior_poss', "{Junior}'s minutes arrive late."),
    card('t_rival', 'The papers put {rival} on the front page.'),
    card('t_mp_poss', "{Mp}'s ward is next to yours."),
    card('t_mp_mid', "Blk 438 is in {mp}'s ward."),
    card('t_mp_later', "Blk 438 is in {mp}'s ward, but {mp} sends its residents to you.")
  ]) };
  // a run at Senior Management Executive with a junior, then in Parliament with a fellow MP
  const at = rank => { const S = { ...E.newGame(C, 'grad', 'Tan Wei Ling', 4, { rival: true, gender: 'f' }), rank, age: 30, year: 9, cardsPlayed: 8 };
    delete S.cast; if (rank >= 8) S.flags = ['seat_grc']; return E.nextEvent(C, { ...S, currentEvent: 't_none' }).state; };
  let S = at(2);
  const show = (id, St = S) => E.eventOf(C, { ...St, currentEvent: id }).body;
  const nm = (r, St = S) => E.personField(C, St, r, St.cast.on[r], '');
  const fill = t => t.replace(/\{(\w+)\.(\w+)\}/g, (m, r, f) => E.personField(C, S, r, S.cast.on[r], f));
  const set = (role, met, seenCard) => Object.assign(role === 'rival' ? S.rival : S.cast.on[role], { met, seenCard });
  const peer = nm('peer');
  set('peer', undefined, undefined);
  assert.strictEqual(show('t_peer'), `${peer}, ${R.peer.intro}, asks you to lunch on Friday.`, 'the first card gives the full introduction');
  set('peer', S.year - 1, S.cardsPlayed);
  assert.strictEqual(show('t_peer'), `${peer} asks you to lunch on Friday.`, 'the card right after does not repeat it');
  set('peer', S.year - 2, S.cardsPlayed - 1);
  assert.strictEqual(show('t_peer'), `${peer}, ${R.peer.tag}, asks you to lunch on Friday.`, 'a later card gives the short tag');
  assert.strictEqual(show('t_own'), `${peer}, the friend who never forgets a birthday, asks you to lunch.`, 'the writer\'s own introduction is kept');
  set('peer', S.year - 8, S.cardsPlayed - 3);
  assert.strictEqual(show('t_peer'), `${peer}, ${R.peer.intro}, asks you to lunch on Friday.`, 'after eight years, the full introduction again');
  // a possessive with no plain mention: a tag that is a clause cannot go in front, so none
  const jr = nm('junior');
  set('junior', S.year - 2, S.cardsPlayed - 1);
  assert.strictEqual(show('t_junior_poss'), `${jr}'s minutes arrive late.`);
  // what the player read on a card, and the outcome they chose, counts as meeting someone on it;
  // an outcome they did not choose does not
  set('junior', undefined, undefined);
  const skip = E.advance(C, { ...S, currentEvent: 't_hidden' }, 1).state, read = E.advance(C, { ...S, currentEvent: 't_hidden' }, 0).state;
  const jrOf = St => St.cast.on.junior && St.cast.on.junior.id === S.cast.on.junior.id ? St.cast.on.junior : null;
  if (jrOf(skip)) assert.strictEqual(jrOf(skip).met, undefined, 'an untaken outcome does not count as meeting them');
  assert.ok(jrOf(read) && jrOf(read).met === S.year && jrOf(read).seenCard === S.cardsPlayed + 1, 'the chosen outcome counts');
  assert.strictEqual(show('t_junior'), `${jr}, ${fill(R.junior.intro)}, brings you the minutes.`);
  // the batchmate: a tag, and not on the card right after
  const mate = S.rival.name, rt = C0.engineLines.rivalTag;
  set('rival', undefined, S.cardsPlayed - 2);
  assert.strictEqual(show('t_rival'), `The papers put ${mate}, ${rt}, on the front page.`);
  set('rival', undefined, S.cardsPlayed);
  assert.strictEqual(show('t_rival'), `The papers put ${mate} on the front page.`);
  const mates = E.advance(C, { ...S, currentEvent: 't_rival' }, 0).state;
  assert.strictEqual(mates.rival.seenCard, S.cardsPlayed + 1, 'a card naming the batchmate is remembered');
  // in politics: a possessive takes the tag in front (capitalised to open a sentence), or on the next plain mention
  S = at(8);
  const mp = nm('mp'), cap = t => t[0].toUpperCase() + t.slice(1);
  set('mp', S.year - 2, S.cardsPlayed - 1);
  assert.strictEqual(show('t_mp_poss'), `${cap(R.mp.tag)} ${mp}'s ward is next to yours.`);
  assert.strictEqual(show('t_mp_mid'), `Blk 438 is in ${R.mp.tag} ${mp}'s ward.`);
  assert.strictEqual(show('t_mp_later'), `Blk 438 is in ${mp}'s ward, but ${mp}, ${R.mp.tag}, sends its residents to you.`);
  set('mp', S.year - 1, S.cardsPlayed);
  assert.strictEqual(show('t_mp_later'), `Blk 438 is in ${mp}'s ward, but ${mp} sends its residents to you.`);
  for (const [role, r] of Object.entries(R)) assert.ok(r.tag && !/\{(?!grassroots\.aTitle)/.test(r.tag), `${role} has a tag`);

  // whole careers: a tag only for someone met before and not on the card just before; the card
  // right after a card that named someone never tags them; and how often tags come up. The same
  // build with each tag marked shows where the engine put one (a writer's own words may match a tag).
  const M = JSON.parse(JSON.stringify(build.content));
  for (const [role, r] of Object.entries(M.cast.roles)) r.tag += ` \u00a7${role}\u00a7`;
  M.engineLines.rivalTag += ' \u00a7rival\u00a7';
  let tags = 0, n = 0, after = 0;
  const per = [];
  for (const origin of ['scholar', 'grad', 'poly']) for (let seed = 1; seed <= 40; seed++) {
    const r = H.rng(seed * 13 + 7), greedy = seed % 2 === 0;
    const score = f => (f.cep||0)*60 + (f.standing||0)*1.5 + (f.competence||0)*1.4 + (f.reputation||0)*1.3 - (f.heat||0)*0.8;
    let St = E.nextEvent(build.content, E.newGame(build.content, origin, 'Tan Wei Ling', seed, { rival: seed % 3 === 0, gender: 'f' })).state;
    let prev = {}, mine = 0;
    for (let t = 0; t < 120 && !St.ending; t++) {
      const ev = E.eventOf(build.content, St), marked = E.eventOf(M, St);
      assert.strictEqual(marked.body.replace(/ \u00a7\w+\u00a7/g, ''), ev.body);
      for (const [, role] of marked.body.matchAll(/\u00a7(\w+)\u00a7/g)) {
        const p = role === 'rival' ? St.rival : St.cast.on[role];
        assert.ok(prev[role] === undefined, `${origin} ${seed} y${St.year} ${ev.id}: ${role} tagged on the card right after: ${ev.body}`);
        if (role !== 'rival') assert.ok(p.met !== undefined && St.year - p.met < 8, `${origin} ${seed} ${ev.id}: a tag where the full introduction was due`);
        tags++; mine++;
      }
      for (const role of Object.keys(prev)) if ((role === 'rival' ? St.rival : St.cast.on[role]) && ev.saw && ev.saw[role] !== undefined) after++;
      const live = ev.choices.map((c, i) => [c, i]).filter(([c]) => E.choiceAvailable(c, St));
      const pick = greedy ? live.reduce((a, b) => score(b[0].effects || {}) > score(a[0].effects || {}) ? b : a)[1] : live[Math.floor(r() * live.length)][1];
      prev = {};
      for (const [role, id] of Object.entries({ ...(ev.saw || {}), ...(ev.choices[pick].saw || {}) })) prev[role] = id;
      St = E.advance(build.content, St, pick).state;
      // someone who left and was replaced since is a new person: forget them
      for (const role of Object.keys(prev)) if (role !== 'rival' && (!St.cast.on[role] || St.cast.on[role].id !== prev[role])) delete prev[role];
    }
    per.push(mine); n++;
  }
  per.sort((a, b) => a - b);
  console.log(`    (tags: ${(tags / n).toFixed(1)} per career, median ${per[n >> 1]}, most ${per[n - 1]}; ${after} cards right after a card naming the same person, none tagged)`);
  assert.ok(tags > n && after > 100, `expected tags and cards right after (${tags}, ${after})`);
  assert.ok(per[n - 1] <= 12, `a career with ${per[n - 1]} tags is noisy`);
});

ok('a swing note in politics speaks of voters and the party, never of upstairs or the building', () => {
  const W = build.content.statWords;
  assert.ok(W.swingPolitics, 'statWords.swingPolitics');
  for (const [k, v] of Object.entries(W.swingPolitics)) if (k !== 'about') for (const d of ['up', 'down']) {
    assert.ok(v[d] && v[d].length >= 3, `swingPolitics.${k}.${d}: three lines`);
    for (const l of v[d]) assert.ok(!/upstairs|the building/i.test(l) && !/\{(?!standing\}|reputation\}|competence\})/.test(l), l);
  }
  let pol = 0, svc = 0;
  const said = new Set();
  careers(40, { greedy: true }, ({ origin, seed, pre, ev, res }) => {
    const politics = pre.rank >= 8 || res.state.rank >= 8 || ev.id === 'the_election';
    for (const l of res.log.filter(l => l.about === 'swing')) {
      assert.ok(!/\{\w+\}/.test(l.text) && /^[A-Z]/.test(l.text), l.text);
      if (politics) { pol++; said.add(l.text); assert.ok(!/upstairs|the building/i.test(l.text), `${origin} ${seed} ${ev.id}: "${l.text}" in politics`); }
      else svc++;
    }
  });
  assert.ok(pol > 100 && svc > 100 && said.size > 12, `expected swing notes in politics and the service (${pol}, ${svc}, ${said.size} different)`);
});

ok('the folder\'s lines give the party\'s unnamed officials no he or she', () => {
  const C = build.content, E = build.engine;
  const gendered = /\b(?:he|she|him|her|his|hers|himself|herself)\b/i;
  for (const [k, t] of Object.entries(C.engineLines.folder)) if (k !== 'note') assert.ok(!gendered.test(t), `engineLines.folder.${k}: ${t}`);
  for (const f of C.folder) assert.ok(!gendered.test(f.item), `folder item ${f.flag}: ${f.item}`);
  // as the engine writes them: the folder read at tea, and the background check, empty and full
  const tea = C.events.find(e => e.id === 'tea_session'), vet = C.events.find(e => e.id === 'the_vetting');
  const read = tea.choices.findIndex(c => c.readFolder), tell = vet.choices.findIndex(c => c.folder === 'disclose');
  let lines = 0;
  for (const flags of [[], C.folder.slice(0, 2).map(f => f.flag)]) for (const [id, i] of [['tea_session', read], ['the_vetting', tell]]) {
    const S = JSON.parse(JSON.stringify(H.newRun('grad', 5, { build }).S));
    Object.assign(S, { rank: 5, age: 40, flags: S.flags.concat(flags), currentEvent: id });
    for (const l of E.advance(C, S, i).log.filter(l => l.kind === 'folder')) { lines++; assert.ok(!gendered.test(l.text), l.text); }
  }
  assert.ok(lines >= 6, `expected the folder's lines (${lines})`);
});

ok('a new Member\'s first card is the maiden speech: nothing scheduled, and no promotion, comes before it', () => {
  const first = new Map();
  const visit = mode => ({ origin, seed, pre, ev }) => {
    const key = `${mode} ${origin} ${seed}`;
    if (pre.rank >= 8 && !first.has(key)) first.set(key, { id: ev.id, rank: pre.rank, endgame: !!ev.endgame });
  };
  careers(70, { greedy: true }, visit('greedy'));
  careers(70, {}, visit('random'));
  let mps = 0;
  for (const [key, f] of first) {
    mps++;
    assert.ok(f.id === 'maiden_speech' || f.endgame, `${key}: a new Member's first card is ${f.id}`);
    assert.strictEqual(f.rank, 8, `${key}: promoted before the maiden speech`);
  }
  assert.ok(mps > 50, `expected new Members (${mps})`);
});

ok('a ceiling rumour is never said twice in a career, and the rumours thin out the longer the wait', () => {
  const C = build.content, hints = new Set([...C.cepHints, ...(C.cepHintsPolitics || [])]);
  const heard = new Map();
  let total = 0, long = 0;
  const visit = mode => ({ origin, seed, res }) => {
    const key = `${mode} ${origin} ${seed}`, h = heard.get(key) || new Set();
    heard.set(key, h);
    for (const l of res.log) if (l.kind === 'cep' && hints.has(l.text)) {
      assert.ok(!h.has(l.text), `${key}: the rumour "${l.text}" again`);
      h.add(l.text); total++;
    }
    const told = res.state.cepTold || {};
    if (Object.values(told).some(n => n >= 8)) long++;
  };
  careers(80, { greedy: true }, visit('greedy'));
  careers(80, {}, visit('random'));
  assert.ok(total > 100 && long > 10, `expected rumours, and careers held at the ceiling for years (${total}, ${long})`);
});

ok('on a review page, the why line never says luck moved the grade one way while a witness line says it went the other', () => {
  const C = build.content, P = C.statWords.why, W = C.witnesses.types;
  const sign = new Map();
  for (const t of Object.values(W)) for (const s of ['help', 'hurt']) for (const l of (t.review || {})[s] || []) sign.set(l, s);
  const stem = l => l.split('{grade}')[0];
  const luck = { help: P.luckUp.map(stem), hurt: P.luckDown.map(stem) };
  let pages = 0, both = 0;
  careers(80, { rival: () => false }, ({ origin, seed, res }) => {
    let page = [];
    const check = pg => {
      const w = pg.find(l => sign.has(l.text)), why = pg.find(l => l.kind === 'why');
      if (!w) return;
      pages++;
      const said = why && ['help', 'hurt'].find(s => luck[s].some(x => why.text.includes(x)));
      if (!said) return;
      both++;
      assert.strictEqual(said, sign.get(w.text), `${origin} ${seed}: "${why.text}" beside "${w.text}"`);
    };
    for (const l of res.log) { if (l.kind === 'year') { check(page); page = []; } page.push(l); }
    check(page);
  });
  assert.ok(pages > 20 && both > 5, `expected witness lines, some beside a luck line (${pages}, ${both})`);
});

console.log(`\nAll ${passed} harness tests passed.`);
