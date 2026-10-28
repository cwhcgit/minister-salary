// One tiny Haiku call through the client the runner uses, to prove workload identity
// federation works end to end before a paid cohort depends on it. Costs a fraction of a cent.
//   node agents/wif-smoke.ts        (run by .github/workflows/wif-smoke.yml)
import Anthropic from "@anthropic-ai/sdk";
import { client, costOf, credentialSource, RETRIES, usageOf } from "./lib/llm.ts";

const MODEL = "claude-haiku-5-5";

try {
  const source = credentialSource();
  console.log(`credential: ${source}`);
  const c = client();
  if (source === "workload identity federation" && (c.apiKey !== null || c.authToken !== null))
    throw new Error("the client holds a static key or token; federation would not be used");
  const msg = await c.messages.create({
    model: MODEL,
    max_tokens: 200,
    output_config: { effort: "low" },
    messages: [{ role: "user", content: "Reply with the one word: ready" }]
  }, RETRIES);
  const text = msg.content.map(b => (b.type === "text" ? b.text : "")).join("").trim();
  const usage = usageOf(msg.usage);
  console.log(`✓ ${msg.model} replied "${text}" (stop: ${msg.stop_reason}; ${usage.input} tokens in, ${usage.output} out; $${costOf(MODEL, usage).toFixed(6)})`);
  if (msg.stop_reason === "refusal") throw new Error("the request was declined");
} catch (e) {
  const err = e as Error;
  console.error(`✗ ${err.name}: ${err.message}`);
  if (e instanceof Anthropic.AuthenticationError || /token exchange|identity token/i.test(err.message))
    console.error("  Check the federation rule matches this job's subject (repo:<owner>/<repo>:environment:playtest) and its audience https://api.anthropic.com, then see the authentication history on the Console's Workload identity page.");
  process.exit(1);
}
