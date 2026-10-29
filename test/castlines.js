// Every line that names one of the run's people outside a card says who they are to you.
// Cast lines (game.json cast.lines: a colleague retires, a new reporting officer arrives) and the
// batchmate's lines (rival.json lines) appear on the year-end page, with no card around them to
// set the person up. So the first {name} (or {rival}) in each line is followed at once by ", "
// and a short role phrase that ties the person to the player: "{name}, your old reporting
// officer, retires as {title}", "{rival}, your batchmate, is now {title}". A phrase counts when,
// tokens aside, it has "you", "your", "who", "whose" or "whom" in it, so a bare grade
// ("{name}, {aTitle}, retires") does not.
//
//   node test/castlines.js
const fs = require("fs"), path = require("path");

const read = f => JSON.parse(fs.readFileSync(path.join(__dirname, "..", "web", "content", f), "utf8"));
const game = read("game.json");
const rivalFile = path.join(__dirname, "..", "web", "content", "rival.json");
const rival = fs.existsSync(rivalFile) ? read("rival.json") : null;

const pools = [];
for (const [role, keys] of Object.entries((game.cast || {}).lines || {}))
  for (const [key, lines] of Object.entries(keys)) pools.push({ where: `game.json cast.lines.${role}.${key}`, token: "{name}", lines });
if (rival) for (const [key, lines] of Object.entries(rival.lines || {}))
  pools.push({ where: `rival.json lines.${key}`, token: "{rival}", lines });

const RELATION = /\b(you|your|yours|who|whose|whom)\b/i;
const problems = [];
let checked = 0;
for (const p of pools) {
  if (!Array.isArray(p.lines) || !p.lines.length) { problems.push(`${p.where}: not a list of lines`); continue; }
  p.lines.forEach((line, i) => {
    const at = `${p.where}[${i}]`;
    if (typeof line !== "string") { problems.push(`${at}: not a string`); return; }
    checked++;
    const k = line.indexOf(p.token);
    if (k < 0) { problems.push(`${at}: never names the person (${p.token})`); return; }
    const rest = line.slice(k + p.token.length);
    if (!rest.startsWith(", ")) { problems.push(`${at}: the first ${p.token} is not followed by ", " and who they are to you: "${line.slice(0, 100)}"`); return; }
    const phrase = rest.slice(2).split(/[,.:;]/)[0];
    if (!RELATION.test(phrase.replace(/\{[^{}]*\}/g, "")))
      problems.push(`${at}: "${phrase}" does not say who ${p.token} is to you: "${line.slice(0, 100)}"`);
  });
}

if (problems.length) {
  for (const x of problems) console.log("FAIL " + x);
  process.exit(1);
}
console.log(`OK: ${checked} lines in ${pools.length} pools each say who the person is to you`);
