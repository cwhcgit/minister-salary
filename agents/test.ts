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
