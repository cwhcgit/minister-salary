// The approval gate. Nothing reaches web/ except through `apply`, which re-runs the bot
// regression on a fresh copy first.
//
//   node agents/proposals.ts list
//   node agents/proposals.ts show <id>
//   node agents/proposals.ts check <id>             rebuild and re-run the regression
//   node agents/proposals.ts apply <id>             check, then write into web/content and bump the cache version
//   node agents/proposals.ts reject <id> <reason>
//
// After applying, play a fresh blind cohort and pass --proposals <id> to analyse.ts to
// see whether the prediction came true.
import fs from "node:fs";
import path from "node:path";
import { PROPOSALS, REPO } from "./lib/config.ts";
import { dirOf, materialize, proposalMarkdown, readJson, writeStatus, type Proposal } from "./lib/proposals.ts";

const [cmd, id, ...rest] = process.argv.slice(2);
const load = (pid: string) => {
  if (!fs.existsSync(path.join(dirOf(pid), "proposal.json"))) throw new Error(`no proposal ${pid}`);
  return { p: readJson(path.join(dirOf(pid), "proposal.json")) as Proposal, s: readJson(path.join(dirOf(pid), "status.json")) };
};

function check(pid: string) {
  const { p } = load(pid);
  const { applied, diff, status } = materialize(p);
  writeStatus(pid, status);
  fs.writeFileSync(path.join(dirOf(pid), "proposal.md"), proposalMarkdown(p, status, diff));
  if (status.regression) console.log(status.regression.output.split("\n").slice(-6).join("\n"));
  else console.log(status.errors.map(e => "✗ " + e).join("\n"));
  const pr = status.prediction;
  if (pr) console.log(`prediction ${pr.metric}: ${pr.before} → ${pr.after} (${pr.direction}${pr.matched === null ? ", not a bot metric" : pr.matched ? ", as predicted" : ", NOT as predicted"})`);
  return { ok: status.status === "awaiting_approval", applied };
}

function bumpCache() {
  const f = path.join(REPO, "web/sw.js");
  const s = fs.readFileSync(f, "utf8");
  const next = s.replace(/const VERSION = "ms-v(\d+)";/, (_, n) => `const VERSION = "ms-v${+n + 1}";`);
  fs.writeFileSync(f, next);
  return next.match(/ms-v\d+/)![0];
}

if (cmd === "list" || !cmd) {
  if (!fs.existsSync(PROPOSALS)) process.exit(0);
  for (const d of fs.readdirSync(PROPOSALS).filter(x => fs.existsSync(path.join(PROPOSALS, x, "proposal.json"))).sort()) {
    const { p, s } = load(d);
    console.log(`${s.status.padEnd(18)} ${d}  ${p.title}`);
  }
} else if (cmd === "show") {
  console.log(fs.readFileSync(path.join(dirOf(id), "proposal.md"), "utf8"));
} else if (cmd === "check") {
  check(id);
} else if (cmd === "apply") {
  const { ok, applied } = check(id);
  if (!ok) { console.error(`✗ ${id} does not pass the bot regression; not applied`); process.exit(1); }
  fs.writeFileSync(path.join(REPO, "web/content/game.json"), JSON.stringify(applied.content.game, null, 2));
  fs.writeFileSync(path.join(REPO, "web/content/events.json"), JSON.stringify(applied.content.events, null, 2));
  const v = bumpCache();
  const { s } = load(id);
  writeStatus(id, { ...s, status: "approved" });
  console.log(`✓ applied ${id} to web/content; service worker cache is now ${v}. Review with git diff, then commit.`);
} else if (cmd === "reject") {
  const { s } = load(id);
  writeStatus(id, { ...s, status: "rejected", reason: rest.join(" ") || "no reason given" });
  console.log(`rejected ${id}`);
} else {
  console.error(`unknown command ${cmd}`);
  process.exit(1);
}
