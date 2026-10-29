// One fun-meter session: careers back to back until the meter hits the quit line or the
// session's careers run out, then a three-question exit survey. One JSONL file per session.
//
// Each career is one conversation: every turn appends the new screen (as the harness renders
// it, plus the meter line) and the player's ~35-token reply, and top-level automatic caching
// moves the cache breakpoint forward, so a turn pays full price only for what is new. The
// meter, the cards seen and the repeat streak carry across careers; the conversation does not
// (a new career opens with one line on how the earlier ones went).
//
// Careers in a session pass the engine the cards of the last two finished careers, exactly as
// the phone does after each ending (ui.js rememberRun), so the next career prefers cards and
// card versions the player has not just seen. A session measures the variety players get.
import fs from "node:fs";
import path from "node:path";
import { DEFAULTS, type Persona, type SessionSpec } from "./config.ts";
import { H, Leak, type Build } from "./harness.ts";
import { CapReached, type CallResult, type Llm, type Msg, type Spend, type Usage } from "./llm.ts";
import { Meter } from "./meter.ts";
import { funOpener, funSurveyText, funTurnText, lostReplyText, retryText, type CareerRecap, type RecapMoment } from "./prompts.ts";
import { DIARY, funTurnSchema } from "./schemas.ts";

export interface SessionCtx {
  cohort: string;
  persona: Persona;
  playerName: string;
  playerGender: string;       // the start screen's choice (a key of game.json player.genders)
  builds: { plain: Build; canary: Build };
  llm: Llm;
  spend: Spend;
  outDir: string;
  maxTurns: number;         // per career
  careers: number;          // most careers this session
  canaryCareers: number;    // canaries are planted in the first this-many careers
  tags: "phone" | "none";
  system: string;
  systemHash: string;
  log: (s: string) => void;
}
export interface SessionResult {
  file: string; spec: SessionSpec; quit: boolean; taps: number; careersPlayed: number; careersFinished: number;
  meter: number; cost: number; aborted: string | null; autoPicks: number; refusals: number;
  quitAt: { tap: number; career: number; card: string; title: string | null; meter: number } | null;
}

// The card the player saw: its id, plus the version when it is not the first. A new version of a
// card is a different scene with the same mechanics, so it is fresh, not a repeat.
export const cardKey = (id: string, variant?: number) => (variant ? `${id}#${variant}` : id);
export const PHONE_MEMORY = 2;   // finished careers the phone remembers for freshness (ui.js)
export const cardTitle = (screen: string) => screen.match(/^THIS YEAR: (.*)$/m)?.[1]?.trim() ?? null;
const words = (s: string) => String(s ?? "").split(/\s+/).filter(Boolean).length;
const addUsage = (a: Usage, b: Usage): Usage => ({ input: a.input + b.input, output: a.output + b.output, cacheWrite: a.cacheWrite + b.cacheWrite,
  cacheRead: a.cacheRead + b.cacheRead, thinking: (a.thinking ?? 0) + (b.thinking ?? 0) });

export async function playSession(ctx: SessionCtx, spec: SessionSpec): Promise<SessionResult> {
  const p = ctx.persona, cfg = p.fun!;
  const name = `s${String(spec.index + 1).padStart(3, "0")}`;
  const file = path.join(ctx.outDir, "sessions", `${name}.jsonl`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, "");
  const write = (o: object) => fs.appendFileSync(file, JSON.stringify(o) + "\n");
  const careers = spec.careers.slice(0, ctx.careers);
  const pick = H.rng(careers[0].seed ^ 0x5bd1e995);
  const schema = funTurnSchema(Object.keys(cfg.verdicts));
  const terms = new Map<string, string[]>();
  const meter = new Meter(cfg);
  let cost = 0, autoPicks = 0, refusals = 0, taps = 0, careersPlayed = 0, careersFinished = 0, quit = false;
  let aborted: string | null = null, quitAt: SessionResult["quitAt"] = null;
  const recaps: CareerRecap[] = [];
  const moments: RecapMoment[] = [];
  const flagged: string[] = [];
  const memory: string[][] = [];   // recentKeys of the last finished careers, newest first

  const call = async <T>(messages: Msg[], s: Record<string, unknown>, maxTokens: number, autoCache: boolean): Promise<CallResult<T>> => {
    if (ctx.spend.exhausted) throw new CapReached(`cohort cap $${ctx.spend.cap} reached`);
    const r = await ctx.llm.call<T>({ model: p.model, effort: p.effort, thinking: p.thinking, system: ctx.system, messages, schema: s, maxTokens, autoCache });
    ctx.spend.add(r); cost += r.cost;
    if (r.refusal) refusals++;
    return r;
  };

  write({ type: "meta", kind: "fun-session", cohort: ctx.cohort, persona: p.id, model: p.model, effort: p.effort, thinking: p.thinking ?? null,
    fun: cfg, session: spec.index, careersPlanned: careers, canaryCareers: ctx.canaryCareers, maxTurns: ctx.maxTurns,
    buildHashes: { plain: ctx.builds.plain.hash, canary: ctx.builds.canary.hash }, systemHash: ctx.systemHash, tags: ctx.tags,
    startedAt: new Date().toISOString(), mock: ctx.llm.mock });

  try {
    for (const [k, c] of careers.entries()) {
      if (ctx.spend.exhausted) throw new CapReached(`cohort cap $${ctx.spend.cap} reached`);
      // Canaries probe the reader, but a player who met the wink remembers it for the rest of the
      // session (it led the exit survey). So only every canaryEvery-th session carries them
      // (calibration: every session), and retention and the survey are read from the clean ones.
      const canarySession = !Number.isFinite(ctx.canaryCareers) || spec.index % DEFAULTS.canaryEvery === 0;
      const build = p.canaries && canarySession && k < ctx.canaryCareers ? ctx.builds.canary : ctx.builds.plain;
      if (!terms.has(build.hash)) terms.set(build.hash, Leak.screenTerms(build));
      const leakCheck = (screen: string) => {
        if (!p.blind) return;
        const hits = Leak.checkScreen(screen, build, terms.get(build.hash), { player: { name: run.name, gender: run.gender } });
        if (hits.length) throw new Error(`screen leak on ${name} career ${k + 1}: ${JSON.stringify(hits)}`);
      };
      const recent = memory.flat();
      let run = H.newRun(c.origin, c.seed, { build, name: ctx.playerName, gender: ctx.playerGender, recent });
      const originName = build.content.origins.find((o: any) => o.id === c.origin)?.name ?? c.origin;
      write({ type: "career_start", career: k + 1, origin: c.origin, seed: c.seed, name: run.name, gender: run.gender, buildHash: build.hash, canaries: build.canaries, recent, meter: meter.value });
      careersPlayed++;
      const messages: Msg[] = [];
      let opener = funOpener(k, recaps), careerTaps = 0, endingTitle: string | null = null;

      // One tap: the screen goes out as the next user message (or onto the last one, if the
      // previous reply was lost), one retry for an unusable reply, then a random pick.
      const ask = async (text: string, available: string[]) => {
        const last = messages[messages.length - 1];
        if (last?.role === "user") last.content.push({ text }); else messages.push({ role: "user", content: [{ text }] });
        let r = await call<any>(messages, schema, DEFAULTS.funTurnMaxTokens, true);
        let usage = r.usage, turnCost = r.cost, retried: string | null = null;
        // enum casing is not guaranteed by structured outputs, so "b" is read as "B"
        const letter = (x: typeof r) => String(x.data?.choice ?? "").trim().toUpperCase();
        const problem = (x: typeof r) => !x.data ? `no usable reply (stop: ${x.stop})` : !available.includes(letter(x)) ? `choice ${x.data.choice} is not available` : null;
        if (problem(r)) {
          retried = problem(r);
          const cur = messages[messages.length - 1];
          const retry: Msg[] = [...messages.slice(0, -1), { role: "user", content: [...cur.content, { text: retryText(retried!, available) }] }];
          r = await call<any>(retry, schema, DEFAULTS.funTurnMaxTokens * 4, true);
          usage = addUsage(usage, r.usage); turnCost += r.cost;
        }
        let choice: string, autoPicked = false, reply: any = null;
        if (problem(r)) {
          choice = available[Math.floor(pick() * available.length)]; autoPicked = true; autoPicks++;
          messages[messages.length - 1].content.push({ text: lostReplyText(choice) });
        } else {
          reply = r.data; choice = letter(r);
          reply.delta = cfg.verdicts[String(reply.verdict ?? "").trim().toLowerCase()] ?? 0;
          messages.push({ role: "assistant", content: [{ text: r.text }] });
        }
        return { choice, reply, autoPicked, retried, stop: r.stop, refusal: r.refusal, servedBy: r.servedBy, usage, cost: turnCost };
      };
      const remember = (title: string | null, a: Awaited<ReturnType<typeof ask>>, delta: number) => {
        if (title && a.reply) moments.push({ title, delta, reason: String(a.reply.reason ?? "").slice(0, 160) });
        if (a.reply?.off_tone) flagged.push(String(a.reply.off_tone).slice(0, 160));
      };

      while (run.phase === "event" && run.turn <= ctx.maxTurns) {
        const screen = H.screenText(run, { tags: ctx.tags });
        leakCheck(screen);
        const available = H.choices(run).filter(x => x.available).map(x => x.id);
        const a = await ask(funTurnText({ screen, meter: meter.value, opener }), available);
        opener = null;
        const shownTurn = run.turn, year = run.S.year;
        run = H.step(run, a.choice);
        const tr = run.turns[run.turns.length - 1];
        const canary = tr.event.id.startsWith("canary_");
        const key = cardKey(tr.event.id, tr.event.variant);
        const t = meter.tap({ card: key, model: a.reply ? a.reply.delta : 0, canary });
        taps++; careerTaps++;
        const title = cardTitle(screen);
        remember(title, a, t.model);
        write({ type: "turn", career: k + 1, tap: taps, turn: shownTurn, year, screen,
          card: { id: key, event: tr.event.id, variant: tr.event.variant ?? 0, title, canary, repeat: t.isRepeat, streak: t.streak },
          agent: a.reply, reasonWords: a.reply ? words(a.reply.reason) : null, choice: a.choice, autoPicked: a.autoPicked, retried: a.retried,
          stop: a.stop, refusal: a.refusal, servedBy: a.servedBy, meter: t, usage: a.usage, cost: a.cost, trace: tr });
        if (t.quit) { quit = true; quitAt = { tap: taps, career: k + 1, card: key, title, meter: t.after }; break; }
      }

      const ending: string | null = run.phase === "ending" ? H.trace(run).ending : null;
      if (ending) {
        careersFinished++;
        if (build.engine.recentKeys) { memory.unshift(build.engine.recentKeys(build.content, run.S)); memory.length = Math.min(memory.length, PHONE_MEMORY); }
      }
      if (ending && !quit) {
        // The ending card is a screen too (often the best one): a tap with no card and no repeat.
        const screen = H.screenText(run, { tags: ctx.tags });
        leakCheck(screen);
        endingTitle = build.content.endings.find((e: any) => e.id === ending)?.title ?? ending;
        const a = await ask(funTurnText({ screen, meter: meter.value, ending: true }), ["A"]);
        const t = meter.tap({ card: null, model: a.reply ? a.reply.delta : 0 });
        taps++; careerTaps++;
        remember(endingTitle, a, t.model);
        write({ type: "turn", ending: true, career: k + 1, tap: taps, turn: run.turn, year: run.S.year, screen,
          card: { id: `ending:${ending}`, title: endingTitle, canary: false, repeat: false, streak: t.streak },
          agent: a.reply, reasonWords: a.reply ? words(a.reply.reason) : null, choice: a.choice, autoPicked: a.autoPicked, retried: a.retried,
          stop: a.stop, refusal: a.refusal, servedBy: a.servedBy, meter: t, usage: a.usage, cost: a.cost, trace: null });
        if (t.quit) { quit = true; quitAt = { tap: taps, career: k + 1, card: `ending:${ending}`, title: endingTitle, meter: t.after }; }
      }
      const tc = H.trace(run);
      write({ type: "career_end", career: k + 1, origin: c.origin, seed: c.seed, name: tc.name, gender: tc.gender, buildHash: build.hash, ending, endingSeen: !!endingTitle,
        endingCause: tc.endingCause, cut: !ending && !quit ? "turn_cap" : null, quit, taps: careerTaps, turns: tc.turns.length,
        recent, choices: tc.choices, final: tc.final, meter: meter.value });
      recaps.push({ origin: originName, ending: endingTitle, taps: careerTaps });
      ctx.log(`    ${name} career ${k + 1} (${c.origin}): ${ending ?? (quit ? "quit" : "turn cap")} after ${careerTaps} taps, fun ${meter.value}`);
      if (quit) break;
    }

    // Exit survey: its own short request (see funSurveyText).
    const byDelta = [...moments].sort((a, b) => b.delta - a.delta);
    const text = funSurveyText({ careers: recaps, quit,
      tops: byDelta.filter(m => m.delta > 0).slice(0, 3), bottoms: byDelta.filter(m => m.delta < 0).reverse().slice(0, 3),
      last: moments.slice(-3), flagged: flagged.slice(-3) });
    const s = await call<any>([{ role: "user", content: [{ text }] }], DIARY.fun, DEFAULTS.surveyMaxTokens, false);
    write({ type: "survey", trigger: quit ? "quit" : "session_end", prompt: text, answer: s.data, stop: s.stop, refusal: s.refusal, usage: s.usage, cost: s.cost });
  } catch (e) {
    if (e instanceof CapReached) aborted = e.message;
    else { aborted = `error: ${(e as Error).message}`; ctx.log(`  ! ${name}: ${(e as Error).message}`); }
  }

  write({ type: "summary", quit, quitAt, tapsToQuit: quitAt?.tap ?? null, runsToQuit: quitAt?.career ?? null, taps, careersPlayed, careersFinished,
    meterFinal: meter.value, cost, autoPicks, refusals, aborted });
  return { file, spec, quit, taps, careersPlayed, careersFinished, meter: meter.value, cost, aborted, autoPicks, refusals, quitAt };
}
