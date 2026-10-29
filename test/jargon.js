// Jargon is introduced before it is used. web/content/jargon.json lists every term a newcomer to
// Singapore's government would not know (acronyms, institutions, procedures, local words), with a
// regex for its uses and the places that introduce it: cards whose story makes the meaning clear
// the first time the player meets it. After that, any card may use the term freely.
//
// This plays careers with random play and with the win-seeking bot, every origin, alone and with
// a batchmate, and reads each screen in the order the phone shows it: the start screen, the
// header, last year's outcome and its review lines, this year's card, the ending. For each career
// and each term it finds the first place the term appears. That place must be one of the term's
// entry points, or the check fails, naming the term, where it appeared first and how often.
//
// A place is a card id (its body, choices and outcomes, every version and part), "start" (the
// start screen's own words), "header" (rank, grade and ministry), or a path into game.json or
// rival.json for lines that come from there (review lines, cast lines, endings), such as
// "game.json:endgame.headsUp.service.first". A card whose body names a cast member for the first
// time carries that role's introduction (game.json cast.roles.<role>.intro); a term inside it is
// placed there, not on the card.
//
// Also checked: every term is well formed (term, meaning, a regex that compiles and never matches
// an empty string or its own `skip` examples, entry points that exist and use the term), and no
// text in the content has a malformed {token}, and none reaches a screen unfilled.
//
//   node test/jargon.js [careersPerOriginPerBot=300] [--report]
//   --report   also print every term's first-use places, entry points or not
const fs = require("fs"), path = require("path");
const H = require("../harness");

const ROOT = path.join(__dirname, "..");
const LIST_FILE = path.join(ROOT, "web", "content", "jargon.json");
const argv = process.argv.slice(2);
const REPORT = argv.includes("--report");
const N = +(argv.find(a => /^\d+$/.test(a)) || 300);

const build = H.loadBuild();
const C = build.content;
const read = f => JSON.parse(fs.readFileSync(path.join(ROOT, "web", "content", f), "utf8"));
const problems = [];

// --- the strings of game.json and rival.json, by path ------------------------------------------
// Paths drop array indices: "game.json:cast.lines.journalist.retired".
const TEXT_SKIP = new Set(["id", "eventId", "requires", "effects", "setFlags", "clearFlags", "flags", "schedule",
  "unflags", "origin", "kind", "pron", "flag", "prefer", "pick", "want", "code", "grade", "org", "ministry", "key", "events"]);
function strings(o, p, out) {
  if (typeof o === "string") out.push({ path: p, text: o });
  else if (Array.isArray(o)) for (const x of o) strings(x, p, out);
  else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) {
    if (TEXT_SKIP.has(k)) continue;
    strings(v, p ? p + "." + k : k, out);
  }
  return out;
}
const GAME = read("game.json"), RIVAL = fs.existsSync(path.join(ROOT, "web", "content", "rival.json")) ? read("rival.json") : null;
const lineStrings = strings(GAME, "", []).map(s => ({ ...s, path: "game.json:" + s.path }))
  .concat(RIVAL ? strings({ ...RIVAL, events: undefined }, "", []).map(s => ({ ...s, path: "rival.json:" + s.path })) : []);
const linePaths = new Set(lineStrings.map(s => s.path));

// Every card, events.json, the packs and the batchmate's, by id.
const cards = new Map();
for (const e of C.events.concat((C.rival && C.rival.events) || [])) cards.set(e.id, e);
const cardStrings = e => strings(e, "", []).map(s => s.text);

// --- templates: which game.json or rival.json line a piece of screen text came from ------------
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// A token stands for a name, a title or a short phrase. A role's introduction is added after a
// name as ", <intro>,", so its template keeps the commas.
function template(path, text, intro) {
  const lits = text.split(/\{[^{}]*\}/);
  const lit = lits.reduce((a, b) => (b.length > a.length ? b : a), "");
  const body = lits.map(esc).join(intro ? "[^,.\\n]{1,60}?" : "[^\\n]{1,120}?");
  return { path, lit, litLen: lits.join("").length, re: new RegExp(intro ? ", " + body + "," : body, "g") };
}
const templates = lineStrings.filter(s => s.text.length >= 12 && !/\.intro$/.test(s.path))
  .map(s => template(s.path, s.text)).filter(t => t.lit.length >= 8);
const introTemplates = lineStrings.filter(s => /^game\.json:cast\.roles\.\w+\.intro$/.test(s.path))
  .map(s => template(s.path, s.text, true));

// The line that covers position i of text, or null.
function lineAt(text, i, pool = templates) {
  let best = null;
  for (const t of pool) {
    if (t.lit && !text.includes(t.lit)) continue;
    t.re.lastIndex = 0;
    let m;
    while ((m = t.re.exec(text))) {
      if (m.index <= i && i < m.index + m[0].length && (!best || t.litLen > best.litLen)) best = t;
      if (m[0].length === 0) t.re.lastIndex++;
    }
  }
  return best && best.path;
}

// --- the list ---------------------------------------------------------------------------------
let LIST;
try { LIST = JSON.parse(fs.readFileSync(LIST_FILE, "utf8")); }
catch (e) { console.error("jargon.json: " + e.message); process.exit(1); }
const terms = [];
const KNOWN = new Set(["start", "header"]);
const seenNames = new Set();
for (const [i, t] of (Array.isArray(LIST.terms) ? LIST.terms : []).entries()) {
  const at = `jargon.json term ${i + 1}${t && t.term ? ` ("${t.term}")` : ""}`;
  if (!t || typeof t !== "object") { problems.push(`${at}: not an object`); continue; }
  for (const k of ["term", "meaning", "match"]) if (typeof t[k] !== "string" || !t[k].trim()) problems.push(`${at}: no ${k}`);
  if (seenNames.has(t.term)) problems.push(`${at}: listed twice`);
  seenNames.add(t.term);
  let re = null;
  try { re = new RegExp(t.match, "u"); } catch (e) { problems.push(`${at}: match does not compile: ${e.message}`); }
  if (re && re.test("")) problems.push(`${at}: match accepts an empty string`);
  if (re) for (const s of t.skip || []) if (re.test(s)) problems.push(`${at}: match accepts its skip example "${s}"`);
  if (re) for (const s of t.examples || []) if (!re.test(s)) problems.push(`${at}: match misses its example "${s}"`);
  if (!Array.isArray(t.entryPoints) || !t.entryPoints.length) problems.push(`${at}: no entry points`);
  for (const p of t.entryPoints || []) {
    if (typeof p !== "string") { problems.push(`${at}: entry point ${JSON.stringify(p)} is not a string`); continue; }
    if (KNOWN.has(p)) continue;
    if (/^(game|rival)\.json:/.test(p)) {
      if (!linePaths.has(p)) { problems.push(`${at}: entry point ${p} is not a path in the content`); continue; }
      if (re && !lineStrings.some(s => s.path === p && re.test(s.text))) problems.push(`${at}: entry point ${p} never uses the term`);
      continue;
    }
    const e = cards.get(p);
    if (!e) { problems.push(`${at}: entry point ${p} is not a card`); continue; }
    if (re && !cardStrings(e).some(s => re.test(s))) problems.push(`${at}: entry point ${p} never uses the term`);
  }
  if (re) terms.push({ ...t, re, entry: new Set(t.entryPoints || []), first: {}, careers: 0 });
}
if (!terms.length) problems.push("jargon.json: no terms");

// --- tokens: well formed everywhere, and never on a screen unfilled ----------------------------
const TOKEN = /\{[A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z][A-Za-z0-9]*)?\}/g;
function badToken(s) {
  const rest = s.replace(TOKEN, "");
  return /[{}]/.test(rest) ? s : null;
}
for (const e of cards.values()) for (const s of cardStrings(e)) if (badToken(s)) problems.push(`${e.id}: malformed {token} in "${s.slice(0, 120)}"`);
for (const s of lineStrings) if (badToken(s.text)) problems.push(`${s.path}: malformed {token} in "${s.text.slice(0, 120)}"`);

// --- careers ----------------------------------------------------------------------------------
const WIN = f => (f.cep || 0) * 60 + (f.standing || 0) * 1.5 + (f.competence || 0) * 1.4 + (f.reputation || 0) * 1.3 - (f.heat || 0) * 0.8;
const BOTS = { random: null, "knows the win": WIN };
const cardId = id => String(id).replace(/^__montage:/, "");
const unfilled = new Map();

// The screen as the phone shows it, in reading order, each piece with where it came from.
function pieces(run) {
  const v = H.screen(run), out = [];
  if (v.start) {
    out.push({ src: "start", text: [v.start.title, v.start.tagline, v.start.hint].join("\n") });
    out.push({ src: "game.json:origins", text: `${v.start.origin.name}\n${v.start.origin.blurb}` });
  }
  if (v.header) out.push({ src: "header", text: `${v.header.rank} [${v.header.grade}] ${v.header.age} ${v.header.ministry}${v.header.batchmate ? " " + v.header.batchmate : ""}` });
  if (v.outcome && run.last) {
    const prev = run.turns[run.turns.length - 1];
    out.push({ src: cardId(prev.event.id), text: String(run.last.outcome) });
    let pi = 0;
    for (const l of run.last.log) {
      if (l.kind === "year") continue;
      if (l.kind === "meanwhile") {
        const p = prev.passed[pi++];
        out.push({ src: p && p.event !== "__quiet" ? cardId(p.event) : "engine:quiet", text: String(l.text) });
      } else out.push({ src: null, kind: l.kind, text: String(l.text) });
    }
  }
  if (v.event) {
    const ev = H.currentEvent(build, run.S);
    const id = ev.id === "__quiet" ? "engine:quiet" : cardId(ev.id);
    out.push({ src: id, card: true, text: [v.event.title, v.event.body, ...v.event.choices.map(c => c.text)].join("\n") });
    for (const c of v.event.choices) if (c.requires) out.push({ src: null, kind: "locked", text: c.requires });
  }
  if (v.ending) {
    const e = v.ending;
    out.push({ src: null, kind: "ending", text: [e.title, e.epitaph].join("\n") });
    for (const x of e.stats) out.push({ src: null, kind: "ending", text: x.verdict });
    for (const x of e.declassified) out.push({ src: null, kind: "ending", text: `${x.label}: ${x.text}` });
  }
  return out;
}

function source(piece, i) {
  if (piece.card) {   // a cast member's introduction, added to the body by the engine
    const intro = lineAt(piece.text, i, introTemplates);
    return intro || piece.src;
  }
  if (piece.src) return piece.src;
  return lineAt(piece.text, i) || "engine:" + piece.kind;
}

let careers = 0;
function read_(run, seen) {
  for (const p of pieces(run)) {
    const raw = p.text.match(/\{[^{}\s]*\}/);
    if (raw) {
      const k = (p.src || p.kind) + " " + raw[0];
      unfilled.set(k, (unfilled.get(k) || 0) + 1);
    }
    for (const t of terms) {
      if (seen.has(t)) continue;
      const m = t.re.exec(p.text);
      if (!m) continue;
      seen.add(t);
      const src = source(p, m.index);
      const f = t.first[src] ||= { n: 0, example: null };
      f.n++;
      if (!f.example) f.example = p.text.slice(Math.max(0, m.index - 80), m.index + 100).replace(/\s+/g, " ");
    }
  }
}

for (const [bot, score] of Object.entries(BOTS)) for (const origin of ["scholar", "grad", "poly"]) for (let i = 0; i < N; i++) {
  const seed = i * 11 + 5, rival = i % 2 === 1;
  const pick = H.rng((seed * 2654435761) >>> 0);
  let run = H.newRun(origin, seed, { build, name: "Sim", rival });
  const seen = new Set();
  for (let t = 0; t < 95 && run.phase !== "ending"; t++) {
    read_(run, seen);
    const S = run.S, ev = H.currentEvent(build, S);
    const live = ev.choices.map((c, j) => [c, j]).filter(([c]) => build.engine.choiceAvailable(c, S));
    let j;
    if (!score) j = live[Math.floor(pick() * live.length)][1];
    else { let best = -Infinity; for (const [c, k] of live) { const v = score(c.effects || {}); if (v > best) { best = v; j = k; } } }
    run = H.step(run, j);
  }
  read_(run, seen);
  for (const t of seen) t.careers++;
  careers++;
}

// --- report -----------------------------------------------------------------------------------
for (const [k, n] of unfilled) problems.push(`unfilled token on screen: ${k} (${n} screens)`);
const pct = n => (100 * n / careers).toFixed(1) + "%";
let failing = 0;
for (const t of terms) {
  const firsts = Object.entries(t.first).sort((a, b) => b[1].n - a[1].n);
  const bad = firsts.filter(([src]) => !t.entry.has(src));
  if (bad.length) failing++;
  for (const [src, f] of bad)
    problems.push(`"${t.term}" is first used by ${src}, not an entry point, in ${f.n} careers (${pct(f.n)}): "…${f.example}…"`);
  if (REPORT) {
    console.log(`\n${t.term}  (seen in ${t.careers}/${careers} careers)`);
    for (const [src, f] of firsts) console.log(`  ${t.entry.has(src) ? "  " : "! "}${src.padEnd(48)} ${String(f.n).padStart(5)}  …${f.example.slice(0, 150)}…`);
  }
}

console.log(`${careers} careers, ${terms.length} terms; ${terms.length - failing} introduced before first use, ${failing} not`);
if (problems.length) {
  for (const p of problems) console.log("FAIL " + p);
  process.exit(1);
}
console.log("OK: every term is introduced before it is used");
