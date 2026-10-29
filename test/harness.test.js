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

console.log(`\nAll ${passed} harness tests passed.`);
