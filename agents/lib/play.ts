// One run: optional title probe, the turn loop, the end-of-run diary. Writes one JSONL file
// per run, keyed by turn: what the agent saw, what it chose and felt, and the full trace.
import fs from "node:fs";
import path from "node:path";
import { DEFAULTS, type Persona } from "./config.ts";
import { H, Leak, traceView, type Build, type Run } from "./harness.ts";
import { CapReached, type Llm, type Spend } from "./llm.ts";
import { diaryPrompt, titleProbePrompt, turnBlocks } from "./prompts.ts";
import { DIARY, TITLE_PROBE, TURN } from "./schemas.ts";

export interface Ctx {
  cohort: string;
  persona: Persona;
  playerName: string;
  playerGender: "f" | "m";    // the start screen's Female / Male
  build: Build;
  llm: Llm;
  spend: Spend;
  outDir: string;
  maxTurns: number;
  tags: "phone" | "none";
  system: string;
  systemHash: string;
  log: (s: string) => void;
}
export interface Spec { origin: string; seed: number; lineage?: number; life?: number; lineageNotes?: string }
export interface RunResult {
  file: string; spec: Spec; ending: string | null; turns: number; cost: number;
  notesForNextLife: string | null; aborted: string | null; autoPicks: number; refusals: number;
}

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const capWords = (s: string, n: number) => (words(s) <= n ? s : s.split(/\s+/).slice(0, n).join(" ") + " …");

// The agent's own notes: a line a year, rewritten by the agent when they outgrow the cap.
// If it does not rewrite them, the oldest lines go.
function updateNotes(notes: string, reply: any, year: number, hardCap: number): string {
  if (!reply) return notes;
  if (typeof reply.rewrite_notes === "string" && reply.rewrite_notes.trim()) notes = reply.rewrite_notes.trim();
  if (typeof reply.remember === "string" && reply.remember.trim()) notes += (notes ? "\n" : "") + `Year ${year}: ${reply.remember.trim()}`;
  while (words(notes) > hardCap && notes.includes("\n")) notes = notes.slice(notes.indexOf("\n") + 1);
  return capWords(notes, hardCap);
}

export async function playRun(ctx: Ctx, spec: Spec): Promise<RunResult> {
  const p = ctx.persona;
  const name = `${spec.origin}-${spec.seed}${spec.lineage !== undefined ? `-L${spec.lineage}-life${spec.life}` : ""}`;
  const file = path.join(ctx.outDir, "runs", `${name}.jsonl`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, "");
  const write = (o: object) => fs.appendFileSync(file, JSON.stringify(o) + "\n");
  const pick = H.rng(spec.seed ^ 0x5bd1e995);
  const terms = Leak.screenTerms(ctx.build);
  let cost = 0, autoPicks = 0, refusals = 0, aborted: string | null = null;

  const call = async <T>(schema: object, blocks: Array<{ text: string; cache?: boolean }>, maxTokens: number) => {
    if (ctx.spend.exhausted) throw new CapReached(`cohort cap $${ctx.spend.cap} reached`);
    const r = await ctx.llm.call<T>({ model: p.model, effort: p.effort, system: ctx.system, user: blocks, schema: schema as Record<string, unknown>, maxTokens });
    ctx.spend.add(r); cost += r.cost;
    if (r.refusal) refusals++;
    return r;
  };

  write({ type: "meta", cohort: ctx.cohort, persona: p.id, model: p.model, effort: p.effort, buildHash: ctx.build.hash,
    canaries: ctx.build.canaries, origin: spec.origin, seed: spec.seed, name: ctx.playerName, gender: ctx.playerGender, lineage: spec.lineage ?? null, life: spec.life ?? null,
    systemHash: ctx.systemHash, tags: ctx.tags, inheritedNotes: spec.lineageNotes ?? null, startedAt: new Date().toISOString(), mock: ctx.llm.mock });

  let run: Run = H.newRun(spec.origin, spec.seed, { build: ctx.build, name: ctx.playerName, gender: ctx.playerGender });
  let memory = "";
  const cap = p.turnSchema === "veteran" ? 150 : p.turnSchema === "breaker" ? 200 : DEFAULTS.notesWordCap;
  const hardCap = Math.round(cap * DEFAULTS.notesHardCap / DEFAULTS.notesWordCap);
  let notesForNextLife: string | null = null;

  try {
    if (p.titleProbe) {
      const flip = pick() < 0.5;   // alternate which title is listed first
      const r = await call<Record<string, unknown>>(TITLE_PROBE, [{ text: titleProbePrompt(flip) }], 2000);
      write({ type: "title_probe", titleFirst: flip ? "Confirmed & Substantive" : "Minister Salary", answer: r.data, stop: r.stop, usage: r.usage, cost: r.cost });
    }

    while (run.phase === "event" && run.turn <= ctx.maxTurns) {
      const screen = H.screenText(run, { tags: ctx.tags });
      if (p.blind) {
        const hits = Leak.checkScreen(screen, ctx.build, terms, { player: { name: run.name, gender: run.gender } });
        if (hits.length) throw new Error(`screen leak on ${name} turn ${run.turn}: ${JSON.stringify(hits)}`);
      }
      const available = H.choices(run).filter(c => c.available).map(c => c.id);
      const blocks = turnBlocks({ lineageNotes: spec.lineageNotes, memory, screen, trace: p.blind ? undefined : traceView(run) });
      const askRewrite = words(memory) > cap;
      if (askRewrite) blocks.push({ text: `Your notes are ${words(memory)} words, over the ${cap}-word limit. Rewrite them in \`rewrite_notes\` this turn.` });

      let r = await call<any>(TURN[p.turnSchema], blocks, DEFAULTS.turnMaxTokens);
      let retried: string | null = null;
      const problem = (x: typeof r) => !x.data ? `no usable reply (stop: ${x.stop})` : !available.includes(x.data.choice) ? `choice ${x.data.choice} is not available` : null;
      if (problem(r)) {
        retried = problem(r);
        r = await call<any>(TURN[p.turnSchema], [...blocks, { text: `Your last reply could not be used: ${retried}. The available choices are ${available.join(", ")}. Reply again with one JSON object.` }], DEFAULTS.turnMaxTokens * 2);
      }
      let choice: string, autoPicked = false;
      if (problem(r)) { choice = available[Math.floor(pick() * available.length)]; autoPicked = true; autoPicks++; }
      else choice = r.data.choice;
      const shownTurn = run.turn, year = run.S.year;
      memory = updateNotes(memory, r.data, year, hardCap);
      run = H.step(run, choice);
      write({ type: "turn", turn: shownTurn, year, screen, agent: r.data, choice, autoPicked, retried,
        stop: r.stop, refusal: r.refusal, servedBy: r.servedBy, askedRewrite: askRewrite, notesWords: words(memory), usage: r.usage, cost: r.cost,
        trace: run.turns[run.turns.length - 1] });
    }

    // The diary sees what the phone sees at the end: the ending card (or, at the turn cap, the current screen).
    const finalScreen = H.screenText(run, { tags: ctx.tags });
    const capped = run.phase !== "ending";
    const diaryBlocks = turnBlocks({ lineageNotes: spec.lineageNotes, memory, screen: finalScreen, trace: p.blind ? undefined : traceView(run) });
    diaryBlocks.push({ text: (capped ? "The playtest stopped this run at its turn limit before the career ended.\n\n" : "") + diaryPrompt(p) });
    const d = await call<any>(DIARY[p.diarySchema], diaryBlocks, DEFAULTS.diaryMaxTokens);
    if (d.data && typeof d.data.notes_for_next_life === "string") notesForNextLife = capWords(d.data.notes_for_next_life, 250);
    write({ type: "diary", answer: d.data, finalScreen, capped, stop: d.stop, refusal: d.refusal, usage: d.usage, cost: d.cost });
  } catch (e) {
    if (e instanceof CapReached) aborted = e.message;
    else { aborted = `error: ${(e as Error).message}`; ctx.log(`  ! ${name}: ${(e as Error).message}`); }
  }

  const t = H.trace(run);
  const ending = t.ending ?? (aborted ? null : "turn_cap");
  write({ type: "summary", ending, endingCause: t.endingCause, final: t.final, start: t.start, choices: t.choices,
    turns: t.turns.length, cost, autoPicks, refusals, aborted, notesForNextLife });
  return { file, spec, ending, turns: t.turns.length, cost, notesForNextLife, aborted, autoPicks, refusals };
}
