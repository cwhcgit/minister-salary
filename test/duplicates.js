// One decision, once (docs/WRITING_RULES.md rule 5.15). Cards that pose the same decision in
// different words share an exclusive group ("exclusive" on the card), and a career meets one card
// of each group. A card that repeats does so as a series: shown in full at most `full` times a
// career, its second showing asking whether to keep the habit, and every year after passing by itself.
//
// This plays careers with random play and with the win-seeking bot, every origin, alone and with a
// batchmate, and fails when:
//   - a career is shown two different cards of one exclusive group;
//   - a repeatable card, or any card of a series, is shown in full more often than its series allows,
//     or a series' second full showing is not its second-showing scene;
//   - a consequence is left waiting for a card the career can no longer see, or is dropped without
//     the state saying it was struck;
//   - a group is claimed by a card the career was not shown.
// It also checks the data: every group has two cards or more, every repeatable card is in a series,
// every series that shows a card twice has a second-showing scene for each of its stances, and a
// card that a consequence fires (a triggered card) is in a group only if it ends its story (it
// schedules nothing), so striking it never cuts a chain in the middle: a chain joins a group through
// its first card. And: a save from before the groups reads them back from its history, and a card
// whose group depends on its role (the reply to an adjournment motion) poses it only in that role.
//
//   node test/duplicates.js [careersPerOriginPerBotPerMode=150]
const assert = require("assert");
const H = require("../harness");

const N = +(process.argv[2] || 150);
const build = H.loadBuild();
const C = build.content, E = build.engine;
const ALL = C.events.concat((C.rival && C.rival.events) || []);
const byId = new Map(ALL.map(e => [e.id, e]));
const failures = [];
const fail = m => { if (failures.length < 40) failures.push(m); };
const ok = (name, fn) => { try { fn(); console.log("✓ " + name); } catch (e) { failures.push(`${name}: ${e.message}`); console.log("✗ " + name); } };

const groupList = x => (Array.isArray(x) ? x : [x]).map(g => (typeof g === "string" ? g : g.group));
const isRepeatable = e => !e.once && !e.triggered && !e.priority;

// --- the data ----------------------------------------------------------------------------------
const groups = {};
for (const e of ALL) if (e.exclusive) for (const g of groupList(e.exclusive)) (groups[g] = groups[g] || []).push(e.id);
const series = {};
for (const e of ALL) if (e.series) (series[e.series.key] = series[e.series.key] || []).push(e);

ok("every exclusive group has two cards or more, and is well formed", () => {
  assert.ok(Object.keys(groups).length >= 10, `expected the audit's groups (${Object.keys(groups).length})`);
  for (const [g, ids] of Object.entries(groups)) assert.ok(ids.length >= 2, `${g}: only ${ids.join(", ")}`);
  for (const e of ALL.filter(e => e.exclusive)) for (const g of (Array.isArray(e.exclusive) ? e.exclusive : [e.exclusive]))
    assert.ok(typeof g === "string" || (g && typeof g.group === "string" && g.requires && typeof g.requires === "object"), `${e.id}: malformed group ${JSON.stringify(g)}`);
});

ok("every repeatable card repeats as a series", () => {
  for (const e of ALL.filter(isRepeatable)) {
    assert.ok(e.series, `${e.id} repeats, and is in no series: its later showings would pose its decision as new`);
    assert.ok(e.noMontage, `${e.id}: a repeatable card in a series must not also come back as a habit (noMontage)`);
  }
});

ok("a series that shows a card twice has a second-showing scene for each stance, and lines for each habit it can pass on", () => {
  for (const [key, cards] of Object.entries(series)) {
    const full = cards[0].series.full;
    if (full >= 99) continue;   // the improvement plan: shown in full every time
    for (const e of cards) {
      assert.strictEqual(e.series.full, full, `${e.id}: its series ${key} says a different "full"`);
      const stances = [...new Set(e.choices.map(c => c.stance))];
      assert.ok(stances.every(Boolean), `${e.id}: a choice without a stance`);
      if (full >= 2 && !e.series.opens) for (const st of stances)
        assert.ok(e.again && e.again.scenes && e.again.scenes[st], `${e.id}: no second-showing scene for ${st}`);
      if (!e.series.opens && (!e.once || full >= 2) && key !== "footing") for (const st of stances)
        assert.ok(e.montageLines && Array.isArray(e.montageLines[st]) && e.montageLines[st].length >= 4, `${e.id}: fewer than four Meanwhile lines for ${st}`);
    }
  }
});

ok("a card a consequence fires is in a group only if it ends its story", () => {
  for (const e of ALL.filter(e => e.triggered && e.exclusive)) {
    const next = e.choices.flatMap(c => (c.schedule || []).map(s => s.eventId));
    assert.deepStrictEqual(next, [], `${e.id} is in a group and schedules ${next.join(", ")}: put the chain's first card in the group instead`);
  }
});

ok("a card whose group depends on its role poses it only in that role", () => {
  const adj = byId.get("bench_adjournment");
  const S = H.newRun("grad", 4, { build }).S;
  assert.deepStrictEqual(E.groupsOf(adj, { ...S, rank: 8 }), [], "the mover (rank 8) poses no group");
  assert.deepStrictEqual(E.groupsOf(adj, { ...S, rank: 9 }), ["house_brief"], "the reply (rank 9+) poses the House's");
});

ok("a save from before the groups reads them back from its history", () => {
  let checked = 0;
  for (let seed = 1; seed <= 40 && checked < 10; seed++) {
    let run = H.newRun("grad", seed, { build });
    const r = H.rng(seed);
    while (run.phase !== "ending" && Object.keys(run.S.exclusive || {}).length < 2) {
      const live = H.choices(run);   // the choices on screen
      run = H.step(run, live[Math.floor(r() * live.length)].id);
    }
    if (run.phase === "ending") continue;
    const old = JSON.parse(JSON.stringify(run.S));
    delete old.exclusive;
    const back = E.nextEvent(C, old).state.exclusive;
    for (const [g, id] of Object.entries(run.S.exclusive)) assert.strictEqual(back[g], id, `seed ${seed}: ${g} read back as ${back[g]}, was ${id}`);
    checked++;
  }
  assert.ok(checked >= 5, `expected saves to read back (${checked})`);
});

// --- careers -----------------------------------------------------------------------------------
const score = f => (f.cep || 0) * 60 + (f.standing || 0) * 1.5 + (f.competence || 0) * 1.4 + (f.reputation || 0) * 1.3 - (f.heat || 0) * 0.8;
const stats = { careers: 0, claimed: 0, struck: 0, again: 0, seriesPassed: 0, metGroups: {} };
for (const bot of ["random", "win"]) for (const rival of [false, true]) for (const origin of ["scholar", "grad", "poly"]) for (let i = 0; i < N; i++) {
  const seed = 50000 + i * 13 + (rival ? 7 : 0) + (bot === "win" ? 3 : 0);
  const pick = H.rng(seed * 2654435761 >>> 0);
  let run = H.newRun(origin, seed, { build, rival });
  const met = {}, full = {}, where = () => `${bot}${rival ? "+batchmate" : ""} ${origin} ${seed}`;
  while (run.phase !== "ending" && run.turn < 95) {
    const S = run.S, ev = H.currentEvent(build, S), base = byId.get(ev.id);
    if (base) {
      for (const g of E.groupsOf(base, S)) {
        if (met[g] && met[g] !== base.id) fail(`${where()}: ${base.id} after ${met[g]}, the same decision (${g})`);
        met[g] = met[g] || base.id;
      }
      if (base.series && base.series.full < 99) {
        const k = base.series.key, n = (full[k] = (full[k] || 0) + 1);
        if (n > base.series.full) fail(`${where()}: ${base.id} shown in full ${n} times in its series ${k} (at most ${base.series.full})`);
        if (n === 2) { if (String(ev.variant).startsWith("again:")) stats.again++; else if (base.again) fail(`${where()}: ${base.id}, the second showing of ${k}, posed as new`); }
      } else if (isRepeatable(base) && run.turns.some(t => t.event.id === base.id)) fail(`${where()}: ${base.id} repeats in full outside a series`);
    }
    const live = ev.choices.map((c, k) => [c, k]).filter(([c]) => E.choiceAvailable(c, S));
    const k = bot === "random" ? live[Math.floor(pick() * live.length)][1]
      : live.reduce((a, b) => (score(b[0].effects || {}) > score(a[0].effects || {}) ? b : a))[1];
    run = H.step(run, k);
    const t = run.turns[run.turns.length - 1];
    if (t.event.dropped.length) fail(`${where()}: consequences dropped without being struck: ${t.event.dropped.map(d => d.eventId)}`);
    // a consequence that is due and can never be shown has been struck, not left waiting
    if (run.phase === "event") for (const x of run.S.scheduled) {
      const ev = byId.get(x.eventId), vs = [ev, ...((ev && ev.alternates) || []).map(a => byId.get(a))].filter(Boolean);
      if (x.fireYear <= run.S.year && vs.length && vs.every(v => E.excluded(v, run.S))) fail(`${where()}: ${x.eventId} waiting, though the career has had its decision`);
    }
    stats.seriesPassed += t.passed.filter(p => p.kind === "series").length;
  }
  const S = run.S;
  // a group is claimed only by a card the career was actually shown
  for (const [g, id] of Object.entries(S.exclusive || {})) if (met[g] !== id) fail(`${where()}: ${g} claimed by ${id}, which was not shown as its first card (${met[g]})`);
  stats.careers++;
  stats.claimed += Object.keys(S.exclusive || {}).length;
  stats.struck += (S.struck || []).length;
  for (const g of Object.keys(met)) stats.metGroups[g] = (stats.metGroups[g] || 0) + 1;
}

ok(`${stats.careers} careers: no career meets two cards of one group, and no card repeats outside its series`, () => {
  assert.ok(stats.careers >= 6 * N, "careers played");
  assert.ok(stats.again > stats.careers / 4, `expected second showings (${stats.again})`);
  assert.ok(stats.seriesPassed > stats.careers, `expected series years (${stats.seriesPassed})`);
  for (const g of Object.keys(groups))
    assert.ok(stats.metGroups[g] > 0, `no career met the group ${g}: is it reachable?`);
});
console.log(`  (${(stats.claimed / stats.careers).toFixed(1)} groups met per career, ${stats.again} second showings, ${stats.seriesPassed} series years, ${stats.struck} consequences struck)`);

if (failures.length) {
  console.log(`\n✗ ${failures.length}${failures.length >= 40 ? "+" : ""} failures:`);
  for (const f of failures) console.log("  " + f);
  process.exitCode = 1;
} else console.log("\nOK: one decision, once");
