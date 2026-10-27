// One-shot jobs that can wait (diary coding, the content audit) go through the Message
// Batches API at half price. Results can take up to 24 hours, usually under one; this
// polls once a minute. Play never uses it: a turn cannot wait an hour for the next.
import Anthropic from "@anthropic-ai/sdk";
import { buildParams, client, parseMessage, type CallOpts, type CallResult, type Llm } from "./llm.ts";

export interface BatchItem { id: string; opts: CallOpts }

export async function runBatch<T>(llm: Llm, items: BatchItem[], log: (s: string) => void, useBatch = true): Promise<Record<string, CallResult<T>>> {
  const out: Record<string, CallResult<T>> = {};
  if (llm.mock || !useBatch) {
    for (const it of items) out[it.id] = await llm.call<T>(it.opts);
    return out;
  }
  const c = client();
  const requests = items.map(it => {
    // Server-side fallbacks are not accepted on the Batches API.
    const { betas: _b, fallbacks: _f, ...params } = buildParams(it.opts) as Anthropic.Beta.MessageCreateParamsNonStreaming;
    return { custom_id: it.id, params: params as unknown as Anthropic.Messages.MessageCreateParamsNonStreaming };
  });
  const batch = await c.messages.batches.create({ requests });
  log(`  batch ${batch.id}: ${requests.length} requests submitted`);
  let b = batch;
  while (b.processing_status !== "ended") {
    await new Promise(r => setTimeout(r, 60_000));
    b = await c.messages.batches.retrieve(batch.id);
    log(`  batch ${batch.id}: ${b.request_counts.processing} processing, ${b.request_counts.succeeded} done`);
  }
  const model = Object.fromEntries(items.map(it => [it.id, it.opts.model]));
  for await (const r of await c.messages.batches.results(batch.id)) {
    if (r.result.type === "succeeded") out[r.custom_id] = parseMessage<T>(model[r.custom_id], r.result.message, true);
    else log(`  ! ${r.custom_id}: ${r.result.type}`);
  }
  return out;
}
