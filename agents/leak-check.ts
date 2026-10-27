// Checks every blind persona's prompts for hidden terms before any cohort can launch.
// Needs no install: node agents/leak-check.ts
import { PERSONAS } from "./lib/config.ts";
import { H } from "./lib/harness.ts";
import { leakGate } from "./lib/prompts.ts";

const build = H.loadBuild({ canaries: true });
let bad = 0;
for (const p of PERSONAS.filter(x => x.blind)) {
  const hits = leakGate(p, build);
  if (hits.length) {
    bad += hits.length;
    console.log(`✗ ${p.id}`);
    for (const h of hits) console.log(`    ${h.file}${h.line ? `:${h.line}` : ""}  ${h.why}: "${h.match}"`);
  } else console.log(`✓ ${p.id}: no hidden terms, nothing copied from the secret docs`);
}
process.exit(bad ? 1 : 0);
