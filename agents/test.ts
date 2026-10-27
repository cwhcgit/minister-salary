// Offline checks for the agent pipeline: no API calls, no credits.
//   cd agents && npm ci && node test.ts
import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "playtest-"));
process.env.PLAYTEST_REPORTS = path.join(tmp, "reports");
process.env.PLAYTEST_PROPOSALS = path.join(tmp, "proposals");
const { PERSONAS, runPlan } = await import("./lib/config.ts");
const { H } = await import("./lib/harness.ts");
const { leakGate, systemPrompt, mechanicsAppendix } = await import("./lib/prompts.ts");
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

await ok("cohorts share seeds and split origins evenly", () => {
  const a = runPlan(PERSONAS[0]), c = runPlan(PERSONAS[2]);
  assert.deepStrictEqual(a.map(x => [x.origin, x.seed]), c.map(x => [x.origin, x.seed]));
  const n = (o: string) => a.filter(x => x.origin === o).length;
  assert.ok(Math.abs(n("scholar") - n("poly")) <= 1);
  const L = runPlan(PERSONAS.find(p => p.lineage)!);
  assert.strictEqual(L.length, 100);
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
      const replay = H.replay({ buildHash: lines[0].buildHash, origin: lines[0].origin, seed: lines[0].seed, choices: turns.map(t => t.choice) },
        { build: H.loadBuild({ canaries: manifest.canaries }) });
      assert.strictEqual(replay.turns.length, turns.length, "a logged run replays from its choices");
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

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\nAll ${passed} agent pipeline tests passed.`);
