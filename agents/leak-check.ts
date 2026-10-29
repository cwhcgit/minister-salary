// Checks every blind persona's prompts for hidden terms before any cohort can launch, then plays
// a few careers under each persona's own name and gender and checks every screen they would see:
// no hidden values, no raw token (the player's {player} tokens included), and never the wrong
// honorific before the persona's name.
// Needs no install: node agents/leak-check.ts
import { PERSONAS } from "./lib/config.ts";
import { H, Leak } from "./lib/harness.ts";
import { leakGate } from "./lib/prompts.ts";

const build = H.loadBuild({ canaries: true });
const terms = Leak.screenTerms(build);
let bad = 0;
for (const p of PERSONAS.filter(x => x.blind)) {
  const hits = leakGate(p, build).map(h => `${h.file}${h.line ? `:${h.line}` : ""}  ${h.why}: "${h.match}"`);
  if (!["f", "m"].includes(p.gender)) hits.push(`no gender for ${p.name}: give the persona "f" or "m", to match the name`);
  let screens = 0;
  for (const [i, origin] of ["scholar", "grad", "poly"].entries()) {
    const r = H.rng(i * 101 + p.id.length);
    let run = H.newRun(origin, 1000 + i, { build, name: p.name, gender: p.gender, rival: i === 1 });
    if (run.name !== p.name || run.gender !== p.gender) hits.push(`the run did not start as ${p.name} (${p.gender})`);
    for (let t = 0; t < 95; t++) {
      const found = Leak.checkScreen(H.screenText(run), build, terms, { ending: run.phase === "ending", player: { name: run.name, gender: run.gender } });
      screens++;
      for (const h of found.slice(0, 3)) hits.push(`${origin} turn ${run.turn}: ${h.why}: "${h.match}"`);
      if (run.phase === "ending") break;
      const live = H.choices(run).filter(c => c.available);
      run = H.step(run, live[Math.floor(r() * live.length)].id);
    }
  }
  if (hits.length) {
    bad += hits.length;
    console.log(`✗ ${p.id}`);
    for (const h of hits.slice(0, 12)) console.log(`    ${h}`);
  } else console.log(`✓ ${p.id}: no hidden terms, nothing copied from the secret docs; ${screens} screens as ${p.name} (${p.gender === "f" ? "Female" : "Male"}) clean`);
}
process.exit(bad ? 1 : 0);
