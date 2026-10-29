// Offline checks for the agent pipeline: no API calls, no credits.
//   cd agents && npm ci && node test.ts
import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { execFile, execFileSync } from "node:child_process";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "playtest-"));
process.env.PLAYTEST_REPORTS = path.join(tmp, "reports");
process.env.PLAYTEST_PROPOSALS = path.join(tmp, "proposals");
const { PERSONAS, runPlan, sessionPlan, FUN_DEFAULTS, DEFAULTS } = await import("./lib/config.ts");
const { H } = await import("./lib/harness.ts");
const { leakGate, systemPrompt, mechanicsAppendix, funTemplates } = await import("./lib/prompts.ts");
const { Meter } = await import("./lib/meter.ts");
const { buildParams } = await import("./lib/llm.ts");
const { Leak } = await import("./lib/harness.ts");
const { summarizeCohort, readRun, runFiles } = await import("./lib/report.ts");
const { applyOps, loadContent } = await import("./lib/proposals.ts");
const here = path.dirname(new URL(import.meta.url).pathname);
let passed = 0;
const ok = async (name: string, fn: () => unknown) => { await fn(); passed++; console.log("✓ " + name); };

await ok("blind prompts pass the leak gate; full-knowledge prompts carry the mechanics", () => {
  const b = H.loadBuild({ canaries: true });
  for (const p of PERSONAS) {
    if (p.blind) assert.deepStrictEqual(leakGate(p, b), [], p.id);
    else assert.ok(systemPrompt(p, b).includes(mechanicsAppendix(H.loadBuild())), p.id);
  }
});

await ok("every persona starts under its own name and a gender to match, the same one wherever the name recurs", () => {
  const byName = new Map<string, string>();
  const b = H.loadBuild();
  const choices = b.engine.genders(b.content).map((g: { id: string }) => g.id);
  for (const p of PERSONAS) {
    assert.ok(p.name && choices.includes(p.gender), `${p.id}: a name, and a gender from the start screen's choices`);
    assert.strictEqual(byName.get(p.name) ?? p.gender, p.gender, `${p.name} has two genders`);
    byName.set(p.name, p.gender);
    const run = H.newRun("grad", 5, { name: p.name, gender: p.gender });
    assert.deepStrictEqual([run.name, run.gender], [p.name, p.gender]);
  }
});

await ok("cohorts share seeds and split origins evenly", () => {
  const byId = (id: string) => PERSONAS.find(p => p.id === id)!;
  const a = runPlan(byId("blind-insider")), c = runPlan(byId("blind-international"));
  assert.deepStrictEqual(a.map(x => [x.origin, x.seed]), c.map(x => [x.origin, x.seed]));
  const n = (o: string) => a.filter(x => x.origin === o).length;
  assert.ok(Math.abs(n("scholar") - n("poly")) <= 1);
  const L = runPlan(PERSONAS.find(p => p.lineage)!);
  const lp = PERSONAS.find(p => p.lineage)!; assert.strictEqual(L.length, lp.lineage!.lineages * lp.lineage!.runsEach);
  assert.ok(L.every(x => x.origin === L.find(y => y.lineage === x.lineage)!.origin), "a lineage keeps its origin");
});

await ok("a mock cohort writes complete, hygienic run logs", () => {
  execFileSync(process.execPath, [path.join(here, "runner.ts"), "play", "blind-insider", "lineage", "breaker", "--mock", "--runs", "5", "--concurrency", "2"],
    { env: process.env, stdio: "ignore" });
  const dirs = fs.readdirSync(path.join(tmp, "reports/cohorts")).map(d => path.join(tmp, "reports/cohorts", d));
  assert.strictEqual(dirs.length, 3);
  for (const d of dirs) {
    const manifest = JSON.parse(fs.readFileSync(path.join(d, "manifest.json"), "utf8"));
    for (const f of runFiles(d)) {
      const lines = readRun(f);
      assert.strictEqual(lines[0].type, "meta");
      assert.strictEqual(lines[lines.length - 1].type, "summary");
      const turns = lines.filter(l => l.type === "turn");
      assert.ok(turns.length >= 3, `${f}: ${turns.length} turns`);
      turns.forEach((t, i) => assert.strictEqual(t.turn, i + 1, "keyed by turn"));
      for (const t of turns) {
        assert.ok(t.trace && t.trace.event && t.trace.choice, "full trace on every turn");
        if (manifest.persona.blind) assert.ok(!/\bCEP \d|Heat \d|Pending consequences/.test(t.screen), "blind screen carries no trace view");
      }
      assert.ok(lines.some(l => l.type === "diary"));
      assert.strictEqual(lines[0].name, manifest.persona.name, "the run starts under the persona's name");
      assert.strictEqual(lines[0].gender, manifest.persona.gender, "and the persona's gender");
      const replay = H.replay({ buildHash: lines[0].buildHash, origin: lines[0].origin, seed: lines[0].seed, name: lines[0].name, gender: lines[0].gender, choices: turns.map(t => t.choice) },
        { build: H.loadBuild({ canaries: manifest.canaries }) });
      assert.strictEqual(replay.turns.length, turns.length, "a logged run replays from its choices");
      // the replay key (with the name and gender) replays the screens too, word for word
      const diary = lines.find(l => l.type === "diary");
      assert.ok(diary, "a diary at the end");
      assert.strictEqual(H.screenText(replay, { tags: manifest.tags }), diary!.finalScreen, "a logged run's last screen replays exactly");
    }
    const s = summarizeCohort(d);
    assert.strictEqual(s.runs, runFiles(d).length);
    assert.ok(s.cost.total > 0);
    if (manifest.persona.canaries) assert.ok(s.canaries.bland.shown + s.canaries.wink.shown > 0, "canaries appear in canary builds");
    for (const id of Object.keys(s.events)) assert.ok(!id.startsWith("canary_"), "canaries are held out of event stats");
  }
});

await ok("lineage lives inherit only their own notes", () => {
  const d = fs.readdirSync(path.join(tmp, "reports/cohorts")).find(x => x.includes("lineage"))!;
  const files = runFiles(path.join(tmp, "reports/cohorts", d));
  assert.strictEqual(files.length, 5);
  const lives = files.map(f => readRun(f)).sort((a, b) => a[0].life - b[0].life);
  assert.strictEqual(lives[0][0].inheritedNotes, null, "the first life starts blank");
  for (let k = 1; k < lives.length; k++) {
    const inherited: string = lives[k][0].inheritedNotes;
    for (let j = 0; j < k; j++) assert.ok(inherited.includes(lives[j].at(-1)!.notesForNextLife), `life ${k + 1} carries life ${j + 1}'s notes`);
    const own = lives.slice(0, k).map(l => l.at(-1)!.notesForNextLife).join(" ");
    const extra = inherited.replace(/Life \d+ \([^)]*\):/g, "").split(/\s+/).filter(w => w && !own.includes(w));
    assert.deepStrictEqual(extra, [], "nothing but the agent's own notes and the ending titles it saw");
  }
});

await ok("designer ops are validated before anything is built", () => {
  const c = loadContent();
  const bad = applyOps(c, [
    { op: "add_event", target: "events", id: null, path: null, json: JSON.stringify({ id: "the_work", title: "x", body: "y", choices: [] }) },
    { op: "set", target: "events", id: "no_such_event", path: "weight", json: "3" },
    { op: "add_event", target: "events", id: null, path: null, json: JSON.stringify({ id: "Bad Id", title: "t", body: "b", choices: [{ text: "a", outcome: "o", effects: { luck: 3 } }] }) },
    { op: "set", target: "game", id: null, path: "minYearsInGrade", json: "not json" }
  ]);
  assert.ok(bad.errors.some(e => /already exists/.test(e)));
  assert.ok(bad.errors.some(e => /no event no_such_event/.test(e)));
  assert.ok(bad.errors.some(e => /snake_case/.test(e)));
  assert.ok(bad.errors.some(e => /unknown effect luck/.test(e)));
  assert.ok(bad.errors.some(e => /does not parse/.test(e)));
  const good = applyOps(c, [{ op: "set", target: "events", id: "the_crisis", path: "choices.1.effects.integrity", json: "8" }]);
  assert.deepStrictEqual(good.errors, []);
  assert.strictEqual(good.content.events.find((e: any) => e.id === "the_crisis").choices[1].effects.integrity, 8);
  assert.strictEqual(c.events.find((e: any) => e.id === "the_crisis").choices[1].effects.integrity, undefined, "the original is untouched");
});

// --- fun-meter sessions --------------------------------------------------------------

const cfg = (o: Partial<typeof FUN_DEFAULTS> = {}) => ({ ...FUN_DEFAULTS, ...o });

await ok("fun meter: decay every tap, the model's delta clamped, capped at 100, quits at the line", () => {
  const m = new Meter(cfg({ start: 50, quitLine: 25, decay: 2 }));
  let t = m.tap({ card: "a", model: 0 });
  assert.deepStrictEqual([t.before, t.model, t.repeat, t.decay, t.after, t.quit], [50, 0, 0, -2, 48, false]);
  t = m.tap({ card: "b", model: 40 });
  assert.strictEqual(t.model, 10, "clamped to maxDelta");
  assert.strictEqual(t.after, 56);
  const hi = new Meter(cfg({ start: 98 }));
  assert.strictEqual(hi.tap({ card: "x", model: 10 }).after, 100, "capped");
  const lo = new Meter(cfg({ start: 30, quitLine: 25, decay: 2 }));
  assert.strictEqual(lo.tap({ card: "x", model: -2 }).quit, false, "26 is above the line");
  const q = lo.tap({ card: "y", model: -1 });
  assert.strictEqual(q.after, 23); assert.strictEqual(q.quit, true, "at or below the line quits");
  const floor = new Meter(cfg({ start: 3 }));
  assert.strictEqual(floor.tap({ card: "x", model: -10 }).after, 0, "never below 0");
  const probe = new Meter(cfg({ start: 50, decay: 2 }));
  const c = probe.tap({ card: "canary_wink", model: -5, canary: true });
  assert.deepStrictEqual([c.decay, c.after], [0, 50], "a canary tap leaves the meter alone");
});

await ok("fun meter: repeats cost 5, 10, 15 when close together, and the streak resets after 3 fresh cards", () => {
  const m = new Meter(cfg({ decay: 0 }));
  for (const c of ["a", "b", "c", "d", "e"]) m.tap({ card: c, model: 0 });
  const r = (card: string) => m.tap({ card, model: 0 });
  assert.deepStrictEqual([r("a"), r("b"), r("c"), r("d")].map(t => t.repeat), [-5, -10, -15, -15], "compounds, then holds at the last step");
  assert.ok(r("f").repeat === 0 && r("g").repeat === 0, "fresh cards cost nothing");
  assert.strictEqual(r("e").repeat, -15, "two fresh cards do not reset the streak");
  r("h"); r("i"); r("j");
  assert.strictEqual(r("a").repeat, -5, "three fresh cards in a row reset it");
  const casual = new Meter(cfg({ decay: 0, repeatMultiplier: 1.5 }));
  for (const c of ["a", "b", "c"]) casual.tap({ card: c, model: 0 });
  assert.deepStrictEqual(["a", "b", "c"].map(card => casual.tap({ card, model: 0 }).repeat), [-8, -15, -23], "×1.5, rounded");
});

await ok("fun meter: Meanwhile years, one-line cards, endings and canaries never count as repeats; a new card version is fresh", () => {
  const m = new Meter(cfg({ decay: 0 }));
  for (const card of ["__quiet", "__quiet", "__montage:the_work", "__montage:the_work", "canary_bland", "canary_bland", null, null])
    assert.strictEqual(m.tap({ card, model: 0, canary: !!card?.startsWith("canary_") }).repeat, 0, String(card));
  m.tap({ card: "the_work", model: 0 });
  assert.strictEqual(m.tap({ card: "the_work#1", model: 0 }).repeat, 0, "another version");
  assert.strictEqual(m.tap({ card: "the_work", model: 0 }).repeat, -5, "the same version again");
});

await ok("fun prompts: the meter instructions are filled in, and every runner-written line passes the leak gate", () => {
  const b = H.loadBuild({ canaries: true });
  for (const p of PERSONAS.filter(x => x.fun)) {
    const sys = systemPrompt(p, b);
    assert.ok(Object.keys(p.fun!.verdicts).every(v => sys.includes("`" + v + "`")) && !sys.includes("{{"), p.id);
    assert.ok(p.blind && p.canaries, `${p.id} is blind and plays with canaries`);
    assert.deepStrictEqual(leakGate(p, b), [], p.id);
  }
  assert.deepStrictEqual(Leak.checkPrompt(funTemplates(), {}), []);
  assert.ok(Leak.checkPrompt(funTemplates() + "\nYour heat is 50.", {}).length > 0, "the gate would catch a leak in them");
  const ids = PERSONAS.filter(p => p.fun).map(p => p.id);
  for (const id of ["fun-casual", "fun-insider", "fun-completionist", "fun-critic"]) assert.ok(ids.includes(id), id);
  const casual = PERSONAS.find(p => p.id === "fun-casual")!;
  assert.deepStrictEqual([casual.model, casual.fun!.quitLine, casual.fun!.repeatMultiplier], ["claude-haiku-5-5", 35, 1.5]);
  assert.strictEqual(PERSONAS.find(p => p.id === "fun-completionist")!.fun!.quitLine, 15);
  assert.strictEqual(PERSONAS.find(p => p.id === "fun-critic")!.model, "claude-sonnet-5-5");
});

await ok("a fun turn is one growing conversation with automatic caching and thinking off", () => {
  const p = PERSONAS.find(x => x.id === "fun-insider")!;
  const params: any = buildParams({ model: p.model, effort: p.effort, thinking: p.thinking, system: "sys", autoCache: true, schema: {}, maxTokens: 400,
    messages: [{ role: "user", content: [{ text: "s1" }] }, { role: "assistant", content: [{ text: "{}" }] }, { role: "user", content: [{ text: "s2" }] }] });
  assert.deepStrictEqual(params.cache_control, { type: "ephemeral" });
  assert.deepStrictEqual(params.thinking, { type: "disabled" });
  assert.deepStrictEqual(params.messages.map((m: any) => m.role), ["user", "assistant", "user"]);
  assert.ok(!params.fallbacks, "Haiku has no refusal fallback");
  const old: any = buildParams({ model: "claude-sonnet-5-5", effort: "low", system: "sys", user: [{ text: "x" }], schema: {}, maxTokens: 10 });
  assert.ok(!("cache_control" in old) && !("thinking" in old) && old.fallbacks === "default", "single requests are unchanged");
  const plan = sessionPlan(p, 4);
  assert.deepStrictEqual(plan.map(s => s.careers[0].seed), sessionPlan(PERSONAS.find(x => x.id === "fun-casual")!, 4).map(s => s.careers[0].seed), "fun personas share seeds");
  assert.deepStrictEqual(plan[0].careers.map(c => c.origin), ["scholar", "grad", "poly", "scholar", "grad"], "rotate");
  assert.ok(sessionPlan(PERSONAS.find(x => x.id === "fun-casual")!, 2)[1].careers.every(c => c.origin === "grad"), "keep");
});

await ok("mock fun sessions: careers carry the meter and the repeat memory, a quit stops the session, every career replays", () => {
  execFileSync(process.execPath, [path.join(here, "runner.ts"), "play", "fun-insider", "fun-casual", "--mock", "--runs", "8", "--careers", "4"], { env: process.env, stdio: "ignore" });
  const dirs = fs.readdirSync(path.join(tmp, "reports/cohorts")).filter(d => d.includes("-fun-")).map(d => path.join(tmp, "reports/cohorts", d));
  assert.strictEqual(dirs.length, 2);
  let crossCareerRepeats = 0, quits = 0, endings = 0, versions = 0, canariesShown = 0;
  for (const d of dirs) {
    const manifest = JSON.parse(fs.readFileSync(path.join(d, "manifest.json"), "utf8"));
    const p = manifest.persona;
    const files = fs.readdirSync(path.join(d, "sessions")).map(f => path.join(d, "sessions", f));
    assert.strictEqual(files.length, 8);
    for (const f of files) {
      const lines = readRun(f);
      assert.strictEqual(lines[0].type, "meta"); assert.strictEqual(lines.at(-1)!.type, "summary");
      const sum = lines.at(-1)!;
      assert.ok(!sum.aborted, String(sum.aborted));
      const m = new Meter(p.fun);
      const firstSeen = new Map<string, number>();
      let career = 0, lastAfter = p.fun.start, quitSeen = false;
      for (const l of lines) {
        assert.ok(!quitSeen || ["career_end", "survey", "summary"].includes(l.type), "nothing is played after a quit");
        if (l.type === "career_start") {
          career = l.career;
          assert.deepStrictEqual([l.name, l.gender], [p.name, p.gender], "a career starts under the persona's name and gender");
          assert.strictEqual(l.meter, lastAfter, "the meter carries into the next career");
          if (career > 1 && lines.some(x => x.type === "career_end" && x.career === career - 1 && x.ending)) assert.ok(l.recent.length > 0, "the phone remembers the last career");
          const session = lines[0].session as number;
          assert.strictEqual(l.canaries, career <= 1 && session % DEFAULTS.canaryEvery === 0, "canaries in the first career of every canaryEvery-th session only");
        }
        if (l.type === "turn") {
          assert.strictEqual(l.meter.before, lastAfter);
          const t = m.tap({ card: l.ending ? null : l.card.id, model: l.agent ? l.agent.delta : 0, canary: l.card.canary });
          assert.deepStrictEqual(l.meter, t, `tap ${l.tap} matches the rules`);
          if (l.card.repeat && firstSeen.has(l.card.id) && firstSeen.get(l.card.id)! < career) crossCareerRepeats++;
          if (!firstSeen.has(l.card.id)) firstSeen.set(l.card.id, career);
          if (l.ending) { endings++; assert.ok(l.card.id.startsWith("ending:") && l.choice === "A"); }
          if (l.card.variant) versions++;
          assert.ok(!/\bCEP \d|Heat \d|Pending consequences/.test(l.screen), "blind screen");
          assert.ok(l.screen.length > 0 && l.agent && typeof l.agent.reason === "string");
          lastAfter = t.after;
          if (t.quit) { quitSeen = true; assert.ok(sum.quit && sum.quitAt.tap === l.tap && sum.tapsToQuit === l.tap && sum.runsToQuit === career); }
        }
        if (l.type === "career_end") {
          const turns = lines.filter(x => x.type === "turn" && x.career === l.career && !x.ending);
          const build = H.loadBuild({ canaries: l.career <= 1 && (lines[0].session as number) % DEFAULTS.canaryEvery === 0 });
          assert.strictEqual(build.hash, l.buildHash);
          const replay = H.replay({ buildHash: l.buildHash, origin: l.origin, seed: l.seed, name: l.name, gender: l.gender, choices: l.choices, recent: l.recent }, { build });
          assert.deepStrictEqual(replay.turns.map(t => t.event.id), turns.map(t => t.trace.event.id), "a career replays from its choices and its freshness memory");
          // and its screens, word for word, from the name and gender as well
          const shown = lines.filter(x => x.type === "turn" && x.career === l.career).at(-1);
          if (shown && shown.ending) assert.strictEqual(H.screenText(replay, { tags: manifest.tags }), shown.screen, "the ending screen replays exactly");
        }
      }
      if (sum.quit) quits++;
      else assert.strictEqual(sum.careersPlayed, 4, "a session that never quits plays every career");
      assert.ok(lines.some(l => l.type === "survey" && l.answer && l.answer.quit_reason), "exit survey at the end");
      // conversation: within a career, each turn reads the whole conversation so far from the cache and writes only what is new
      for (let k = 1; k <= sum.careersPlayed; k++) {
        const ts = lines.filter(l => l.type === "turn" && l.career === k);
        for (let i = 1; i < ts.length; i++) {
          assert.ok(ts[i].usage.cacheRead >= ts[i - 1].usage.cacheRead + ts[i - 1].usage.cacheWrite, "the conversation grows and is read back from the cache");
          // the new screen can be long (several years that passed by themselves, a page each), so
          // the bound is the screen's own size plus the turn's framing, not a fixed number
          assert.ok(ts[i].usage.cacheWrite < Math.ceil(ts[i].screen.length / 4) + 1000 && ts[i].usage.input === 0, `only the new screen is written (${JSON.stringify(ts[i].usage)}, screen ${ts[i].screen.length} chars)`);
        }
      }
    }
    const s = JSON.parse(fs.readFileSync(path.join(d, "summary.json"), "utf8"));
    assert.strictEqual(s.kind, "fun-sessions");
    assert.ok(fs.readFileSync(path.join(d, "report.md"), "utf8").includes("## Canaries"));
    assert.strictEqual(s.sessions, 8);
    assert.ok(s.funCurve.length > 0 && s.funCurve[0].playing === 8);
    assert.ok(s.cards.top.length > 0 && s.cards.bottom.length > 0);
    assert.ok(Object.keys(s.cards.all.reduce((m: any, c: any) => ((m[c.id] = 1), m), {})).every((id: string) => !id.startsWith("canary_")), "canaries are held out of the card scores");
    // (a persona that quits within a few taps may meet no canary in its two canary careers: the
    // cohorts together must show some)
    canariesShown += s.canaries.bland.shown + s.canaries.wink.shown;
    assert.ok(typeof s.canaries.passed === "boolean");
    for (const m of ["claude-haiku-5-5", "claude-sonnet-5-5"]) assert.ok(s.cost.projection.perSession[m] > 0 && s.cost.projection.fullSession[m] > 0, m);
    assert.ok(s.cost.projection.perSession["claude-sonnet-5-5"] > 5 * s.cost.projection.perSession["claude-haiku-5-5"]);
    assert.ok(s.cost.perTap > 0 && s.cost.perCareer > 0 && s.cost.perSession > 0 && s.cost.tokens.cacheRead > 0);
  }
  assert.ok(canariesShown > 0, "the mock cohorts show the canaries");
  assert.ok(crossCareerRepeats > 0, "a card seen in an earlier career counts as a repeat");
  assert.ok(quits > 0 && endings > 0 && versions > 0, `quits ${quits}, endings ${endings}, card versions ${versions}`);
});

await ok("an unusable reply is retried once, then picked at random; the conversation stays well formed", async () => {
  const { playSession } = await import("./lib/session.ts");
  const { mockLlm, Spend } = await import("./lib/llm.ts");
  const p = { ...PERSONAS.find(x => x.id === "fun-casual")!, fun: cfg({ quitLine: 0, careers: 1 }) };
  const inner = mockLlm(3);
  const seen: any[] = [];
  let n = 0;
  const llm = { mock: true, async call<T>(o: any) {
    seen.push(JSON.parse(JSON.stringify(o)));   // the session keeps appending to its arrays
    const r = await inner.call<T>(o);
    if (o.messages.length < 2) return r;
    // a refusal rescued by the retry; ten calls later, a refusal and then a choice that does not exist
    const k = ++n % 20;
    if (k === 1 || k === 11) return { ...r, data: null, stop: "refusal" };
    if (k === 12) return { ...r, data: { ...(r.data as any), choice: "Z" } as T };
    return r;
  } };
  const outDir = path.join(tmp, "reports/cohorts/failing");
  const builds = { plain: H.loadBuild(), canary: H.loadBuild({ canaries: true }) };
  // Keep playing careers until a turn has been auto-picked: how long a career lasts depends on the
  // cards, so one career may end before the scripted bad replies come round.
  const plan = sessionPlan(p, 12), turns: any[] = [];
  let picked: any[] = [];
  for (let i = 0; i < plan.length && !picked.length; i++) {
    const r = await playSession({ cohort: "failing", persona: p, playerName: "X", playerGender: "m", builds, llm, spend: new Spend(1), outDir, maxTurns: 30, careers: 1,
      canaryCareers: 0, tags: "phone", system: systemPrompt(p, builds.plain), systemHash: "x", log: () => {} }, plan[i]);
    assert.ok(!r.aborted, String(r.aborted));
    turns.push(...readRun(r.file).filter(l => l.type === "turn"));
    picked = turns.filter(t => t.autoPicked);
  }
  assert.ok(picked.length > 0 && picked.every(t => t.meter.model === 0 && t.retried), "auto-picked taps carry no reaction");
  assert.ok(turns.some(t => t.retried && !t.autoPicked), "a retry can rescue a turn");
  for (const o of seen.filter(x => x.messages.length > 1 && x.schema.properties.delta)) {
    const roles = o.messages.map((m: any) => m.role);
    assert.ok(roles.every((x: string, i: number) => i === 0 || x !== roles[i - 1]), "user and assistant alternate");
    assert.strictEqual(roles.at(-1), "user");
  }
  assert.ok(seen.some(o => o.messages.some((m: any) => m.content.some((b: any) => /was made for you/.test(b.text)))), "the player is told a choice was made for them");
});

await ok("calibration plays the Haiku players and the Sonnet critic, then compares them", () => {
  const out = execFileSync(process.execPath, [path.join(here, "runner.ts"), "play", "calibration", "--mock", "--dry-run"], { env: process.env }).toString();
  assert.ok(/projected full cohort: 3 sessions/.test(out), out);
  const d = fs.readdirSync(path.join(tmp, "reports/cohorts")).find(x => x.includes("-calibration-"))!;
  const c = JSON.parse(fs.readFileSync(path.join(tmp, "reports/cohorts", d, "calibration.json"), "utf8"));
  assert.ok(c.models["claude-haiku-5-5"] && c.models["claude-sonnet-5-5"] && c.agreement && c.agreement.sharedCards > 0);
  assert.ok(typeof c.models["claude-haiku-5-5"].bland.passed === "boolean" && typeof c.models["claude-haiku-5-5"].wink.passed === "boolean");
  assert.strictEqual(c.cohorts.length, 4);
});

// --- workload identity federation, against fake GitHub and Anthropic endpoints -----------

const repo = path.resolve(here, "..");
const KEY_VARS = ["ANTHROPIC_API_KEY", "PLAYTEST_ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN", "ANTHROPIC_PROFILE", "ANTHROPIC_BASE_URL"];
const cleanEnv = () => { const e = { ...process.env }; for (const k of KEY_VARS) delete e[k]; return e; };
const run = (file: string, args: string[], env: NodeJS.ProcessEnv) =>
  new Promise<{ code: number; out: string }>(res => execFile(file, args, { env, cwd: repo }, (err, stdout, stderr) =>
    res({ code: err ? (typeof err.code === "number" ? err.code : 1) : 0, out: stdout + stderr })));
const serve = (handler: http.RequestListener) => new Promise<{ url: string; close: () => void }>(res => {
  const s = http.createServer(handler).listen(0, "127.0.0.1", () =>
    res({ url: `http://127.0.0.1:${(s.address() as any).port}`, close: () => s.close() }));
});
const body = (req: http.IncomingMessage) => new Promise<string>(res => { let d = ""; req.on("data", c => (d += c)); req.on("end", () => res(d)); });
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

await ok("the token script fetches with the right audience, keeps the file fresh, and refuses API keys", async () => {
  let n = 0;
  const seen: string[] = [];
  const gh = await serve((req, res) => {
    const u = new URL(req.url!, "http://x");
    seen.push(`${req.headers.authorization} ${u.searchParams.get("audience")} ${u.searchParams.get("api-version")}`);
    res.end(JSON.stringify({ value: `gh-jwt-${++n}` }));
  });
  const file = path.join(tmp, "wif", "github-oidc.jwt");
  const env = { ...cleanEnv(), ACTIONS_ID_TOKEN_REQUEST_URL: `${gh.url}/token?api-version=2.0`, ACTIONS_ID_TOKEN_REQUEST_TOKEN: "request-token",
    ANTHROPIC_IDENTITY_TOKEN_FILE: file, ANTHROPIC_FEDERATION_RULE_ID: "fdrl_test", ANTHROPIC_ORGANIZATION_ID: "org-test",
    ANTHROPIC_SERVICE_ACCOUNT_ID: "svac_test", OIDC_REFRESH_SECONDS: "1" };
  const script = path.join(repo, ".github/scripts/anthropic-wif.sh");
  try {
    const start = await run(script, ["start"], env);
    assert.strictEqual(start.code, 0, start.out);
    assert.ok(!start.out.includes("gh-jwt"), "the token is never printed");
    assert.strictEqual(fs.readFileSync(file, "utf8").trim(), "gh-jwt-1");
    assert.strictEqual(fs.statSync(file).mode & 0o077, 0, "only the job user can read the token");
    await sleep(2600);
    assert.ok(n >= 3, `refreshed in the background (${n} fetches)`);
    assert.strictEqual(fs.readFileSync(file, "utf8").trim(), `gh-jwt-${n}`, "the file holds the newest token");
    assert.ok(seen.every(x => x === "Bearer request-token https://api.anthropic.com 2.0"), seen.join("\n"));
    const before = n;
    assert.strictEqual((await run(script, ["refresh"], env)).code, 0);
    assert.ok(n > before);
    for (const k of ["ANTHROPIC_API_KEY", "PLAYTEST_ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN"]) {
      const r = await run(script, ["check"], { ...env, [k]: "" });
      assert.strictEqual(r.code, 1, `${k}, even empty, fails the check`);
      assert.ok(r.out.includes(k));
    }
    const missing = await run(script, ["check"], { ...env, ANTHROPIC_FEDERATION_RULE_ID: "" });
    assert.strictEqual(missing.code, 1);
  } finally {
    const stop = await run(script, ["stop"], env);
    assert.strictEqual(stop.code, 0, stop.out);
    gh.close();
  }
  assert.ok(!fs.existsSync(file), "stop deletes the token");
  const settled = n;
  await sleep(1300);
  assert.strictEqual(n, settled, "the refresher is gone");
});

await ok("the zero-argument client exchanges the token file via WIF, once per access token, never reusing a token", async () => {
  const used = new Set<string>();
  const exchanges: any[] = [], calls: string[] = [];
  let issued = 0;
  const api = await serve(async (req, res) => {
    const b = await body(req);
    res.setHeader("content-type", "application/json");
    if (req.url === "/v1/oauth/token") {
      const j = JSON.parse(b);
      exchanges.push(j);
      const fine = j.grant_type === "urn:ietf:params:oauth:grant-type:jwt-bearer" && j.federation_rule_id === "fdrl_test"
        && j.organization_id === "org-test" && j.service_account_id === "svac_test" && j.workspace_id === "wrkspc_test";
      if (!fine || used.has(j.assertion)) { res.statusCode = 401; return res.end(JSON.stringify({ type: "error", error: { type: "authentication_error", message: "Authentication failed" } })); }
      used.add(j.assertion);
      // Just over the SDK's 120 s refresh window, so a refresh comes due a few seconds in.
      return res.end(JSON.stringify({ access_token: `sk-ant-oat01-test-${++issued}`, token_type: "Bearer", expires_in: 123 }));
    }
    if (req.url?.startsWith("/v1/messages")) {
      calls.push(`${req.headers.authorization ?? ""}|${req.headers["x-api-key"] ?? ""}`);
      if (!String(req.headers.authorization).startsWith("Bearer sk-ant-oat01-test-")) { res.statusCode = 401; return res.end("{}"); }
      return res.end(JSON.stringify({ id: "msg_test", type: "message", role: "assistant", model: "claude-haiku-5-5",
        content: [{ type: "text", text: "ready" }], stop_reason: "end_turn", stop_sequence: null, stop_details: null,
        usage: { input_tokens: 14, output_tokens: 3, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 } }));
    }
    res.statusCode = 404; res.end("{}");
  });
  const file = path.join(tmp, "wif2", "jwt");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const env = { ...cleanEnv(), ANTHROPIC_BASE_URL: api.url, ANTHROPIC_IDENTITY_TOKEN_FILE: file, ANTHROPIC_FEDERATION_RULE_ID: "fdrl_test",
    ANTHROPIC_ORGANIZATION_ID: "org-test", ANTHROPIC_SERVICE_ACCOUNT_ID: "svac_test", ANTHROPIC_WORKSPACE_ID: "wrkspc_test", PLAYTEST_REQUIRE_WIF: "1" };
  try {
    fs.writeFileSync(file, "gh-jwt-A\n");
    const smoke = await run(process.execPath, [path.join(here, "wif-smoke.ts")], env);
    assert.strictEqual(smoke.code, 0, smoke.out);
    assert.ok(smoke.out.includes("credential: workload identity federation") && smoke.out.includes('replied "ready"'), smoke.out);
    assert.deepStrictEqual(exchanges.map(e => e.assertion), ["gh-jwt-A"]);
    assert.deepStrictEqual(calls, ["Bearer sk-ant-oat01-test-1|"], "bearer token only, no x-api-key");

    const keyed = await run(process.execPath, [path.join(here, "wif-smoke.ts")], { ...env, ANTHROPIC_API_KEY: "sk-ant-api03-not-a-real-key" });
    assert.strictEqual(keyed.code, 1);
    assert.ok(keyed.out.includes("would be used instead"), keyed.out);
    const required = await run(process.execPath, [path.join(here, "wif-smoke.ts")], { ...env, ANTHROPIC_FEDERATION_RULE_ID: "" });
    assert.strictEqual(required.code, 1);
    assert.ok(required.out.includes("PLAYTEST_REQUIRE_WIF"), required.out);
    assert.strictEqual(exchanges.length, 1, "neither refused setup reached the token endpoint");

    // A longer process: the file is rotated (as the refresher does), then the access token
    // nears expiry and the SDK exchanges the new file contents. The old token is never re-sent.
    const script = path.join(tmp, "wif-long.ts");
    fs.writeFileSync(script, `import fs from "node:fs";
import { client } from ${JSON.stringify(path.join(here, "lib/llm.ts"))};
const c = client();
const ask = () => c.messages.create({ model: "claude-haiku-5-5", max_tokens: 10, messages: [{ role: "user", content: "hi" }] });
const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
await ask(); await ask();
fs.writeFileSync(process.env.ANTHROPIC_IDENTITY_TOKEN_FILE!, "gh-jwt-C2");
await wait(3500); await ask(); await wait(300); await ask();
`);
    fs.writeFileSync(file, "gh-jwt-C1");
    const long = await run(process.execPath, [script], env);
    assert.strictEqual(long.code, 0, long.out);
    assert.deepStrictEqual(exchanges.slice(1).map(e => e.assertion), ["gh-jwt-C1", "gh-jwt-C2"], "one exchange per access token, each with a fresh file");
    assert.strictEqual(calls.length, 5);
    assert.ok(calls[4].startsWith("Bearer sk-ant-oat01-test-3"), `the last call uses the new access token: ${calls[4]}`);
    assert.ok(calls.every(c => c.endsWith("|")), "never an x-api-key");
  } finally { api.close(); }
});

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\nAll ${passed} agent pipeline tests passed.`);
