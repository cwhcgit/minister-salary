// Similarity check for card writing. Free, no dependencies:
//   node test/similarity.js            report + exit 1 only on hard failures
//   node test/similarity.js --json F   also write the findings as JSON
//
// It reads every card the game loads (events.json, every pack, the batchmate's cards) and flags:
//   1. near-duplicates: two card bodies, or two choice outcomes, sharing many word 4-grams
//      (Jaccard on 4-gram shingles). Alternate scenes of one card are exempt: they are
//      meant to be close (ids that extend another id, e.g. ally_returns / ally_returns_ps).
//   2. overused phrases: a 4-6 word phrase that recurs across many different cards, which
//      is how a joke template wears out ("which in this building is", "you are not told").
//   3. overused sentence openers: the first three words of sentences, across cards.
//
// Thresholds: WARN entries are for writers and reviewers; FAIL entries break CI. They are
// set so today's content passes with warnings; tighten them as the card count grows.
const fs = require("fs"), path = require("path");
const H = require("../harness");

const LIMITS = {
  nearDupWarn: 0.22, nearDupFail: 0.5,       // Jaccard on word 4-gram shingles
  phraseWarn: 4, phraseFail: 10,             // distinct cards sharing one 4-6 word phrase
  openerWarn: 6, openerFail: 14              // distinct cards sharing one 3-word sentence opener
};

// Function words only: a phrase made of these alone is not a template.
const STOP = new Set(("a an the and or but of to in on at for with by from as is are was were be been it its this that " +
  "you your yours he she they them their his her we our i me my not no so than then there which who whom what when " +
  "one two do does did has have had will would can could should may might into out up about over after before").split(" "));

const words = s => String(s).toLowerCase().replace(/[“”"]/g, " ").replace(/[^a-z0-9'\s]/g, " ").split(/\s+/).filter(Boolean);
const ngrams = (w, n) => { const out = []; for (let i = 0; i + n <= w.length; i++) out.push(w.slice(i, i + n).join(" ")); return out; };
const sentences = s => String(s).split(/(?<=[.!?])\s+/).map(x => x.trim()).filter(Boolean);

function cards(build) {
  const list = [...build.content.events];
  if (build.content.rival && Array.isArray(build.content.rival.events)) list.push(...build.content.rival.events);
  return list.filter(e => !String(e.id).startsWith("canary"));
}

// Every string in a value (montage lines may be an array, or keyed by habit).
const strings = v => typeof v === "string" ? [v] : Array.isArray(v) ? v.flatMap(strings)
  : v && typeof v === "object" ? Object.values(v).flatMap(strings) : [];

// Texts per card: its body, each choice's outcome and its montage lines, the same for each of its
// versions; plus ending epitaphs.
function texts(list, game) {
  const out = [];
  for (const e of list) {
    if (e.body) out.push({ card: e.id, kind: "body", where: `${e.id}.body`, text: e.body });
    (e.choices || []).forEach((c, i) => c.outcome && out.push({ card: e.id, kind: "outcome", where: `${e.id}.choices[${i}].outcome`, text: c.outcome }));
    strings(e.montageLines).forEach((m, i) => out.push({ card: e.id, kind: "montage", where: `${e.id}.montageLines#${i}`, text: m }));
    // a card's other versions are the same card in another scene: checked against every other card
    (e.variants || []).forEach((v, k) => {
      if (v.body) out.push({ card: e.id, kind: "body", where: `${e.id}.variants[${k}].body`, text: v.body });
      (v.choices || []).forEach((c, i) => c && c.outcome && out.push({ card: e.id, kind: "outcome", where: `${e.id}.variants[${k}].choices[${i}].outcome`, text: c.outcome }));
    });
  }
  for (const en of (game.endings || [])) out.push({ card: `ending:${en.id}`, kind: "epitaph", where: `endings.${en.id}.epitaph`, text: en.epitaph });
  return out;
}

// Refrains the game repeats on purpose (a mechanic's voice, not a worn joke).
const REFRAINS = [/^it is noted\b/];
const refrain = s => REFRAINS.some(re => re.test(s));
// Names of real institutions recur because they are real; a phrase inside one is not a template.
const TERMS = ["meet the people session", "committee of supply", "permanent secretary", "national day award",
  "straits times forum", "inter ministry committee", "general election", "public service division",
  "minister of state", "parliamentary secretary", "deputy prime minister", "national bonus"];
const term = p => TERMS.some(t => t.includes(p) || p.includes(t));

// Alternate scenes of one card are meant to be close: a card's `alternates` list, or ids that
// extend another id (ally_returns / ally_returns_ps), form one family.
let FAMILY = new Map();
function families(list) {
  FAMILY = new Map();
  const ids = list.map(e => e.id);
  for (const e of list) for (const a of (e.alternates || [])) FAMILY.set(a, e.id);
  for (const id of ids) if (!FAMILY.has(id)) {
    const base = ids.filter(o => o !== id && id.startsWith(o + "_")).sort((a, b) => a.length - b.length)[0];
    FAMILY.set(id, base ? (FAMILY.get(base) || base) : id);
  }
}
const fam = id => FAMILY.get(id) || id;
const related = (a, b) => fam(a) === fam(b);

function nearDuplicates(items) {
  const sh = items.map(t => new Set(ngrams(words(t.text), 4)));
  const found = [];
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    if (items[i].kind !== items[j].kind || related(items[i].card, items[j].card)) continue;
    const a = sh[i], b = sh[j];
    if (a.size < 3 || b.size < 3) continue;
    let inter = 0; for (const x of a) if (b.has(x)) inter++;
    const jac = inter / (a.size + b.size - inter);
    if (jac >= LIMITS.nearDupWarn) found.push({ a: items[i].where, b: items[j].where, jaccard: +jac.toFixed(2), fail: jac >= LIMITS.nearDupFail });
  }
  return found.sort((x, y) => y.jaccard - x.jaccard);
}

function overusedPhrases(items) {
  const byPhrase = new Map();
  for (const t of items) {
    const w = words(t.text);
    for (const n of [4, 5, 6]) for (const g of ngrams(w, n)) {
      const toks = g.split(" ");
      if (toks.filter(x => !STOP.has(x)).length < 2 || term(g)) continue;   // two content words, not a name
      if (!byPhrase.has(g)) byPhrase.set(g, new Set());
      byPhrase.get(g).add(t.card);
    }
  }
  // Count card families, not cards: alternate scenes of one card share their lines on purpose.
  // Overlapping windows of one long phrase cover the same cards, so keep one row per card set.
  const rows = [...byPhrase].map(([p, s]) => ({ phrase: p, cards: [...s].sort(), n: new Set([...s].map(fam)).size }))
    .filter(r => r.n >= LIMITS.phraseWarn);
  const bySet = new Map();
  for (const r of rows) {
    const k = r.cards.join(",");
    const cur = bySet.get(k);
    if (!cur || r.phrase.split(" ").length > cur.phrase.split(" ").length) bySet.set(k, r);
  }
  const kept = [...bySet.values()].filter(r => ![...bySet.values()].some(o => o !== r && o.phrase.includes(r.phrase) && o.n >= r.n));
  return kept.map(r => ({ ...r, fail: r.n >= LIMITS.phraseFail })).sort((a, b) => b.n - a.n);
}

function overusedOpeners(items) {
  const by = new Map();
  for (const t of items) for (const s of sentences(t.text)) {
    const w = words(s).slice(0, 3);
    if (w.length < 3 || refrain(w.join(" "))) continue;
    const k = w.join(" ");
    if (!by.has(k)) by.set(k, new Set());
    by.get(k).add(fam(t.card));
  }
  return [...by].filter(([, s]) => s.size >= LIMITS.openerWarn)
    .map(([k, s]) => ({ opener: k, n: s.size, cards: [...s].sort(), fail: s.size >= LIMITS.openerFail }))
    .sort((a, b) => b.n - a.n);
}

function check(build) {
  const list = cards(build), items = texts(list, build.content);
  families(list);
  return { cards: list.length, texts: items.length, limits: LIMITS,
    nearDuplicates: nearDuplicates(items), phrases: overusedPhrases(items), openers: overusedOpeners(items) };
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  const jsonAt = argv.indexOf("--json");
  const r = check(H.loadBuild());
  const fails = [...r.nearDuplicates, ...r.phrases, ...r.openers].filter(x => x.fail);
  console.log(`similarity: ${r.cards} cards, ${r.texts} texts (bodies, outcomes, montage lines, epitaphs)`);
  console.log(`\nnear-duplicates (4-gram Jaccard >= ${LIMITS.nearDupWarn}; fail >= ${LIMITS.nearDupFail}): ${r.nearDuplicates.length}`);
  r.nearDuplicates.slice(0, 15).forEach(d => console.log(`  ${d.fail ? "✗" : "!"} ${d.jaccard}  ${d.a}  ~  ${d.b}`));
  console.log(`\nphrases recurring across cards (>= ${LIMITS.phraseWarn} cards; fail >= ${LIMITS.phraseFail}): ${r.phrases.length}`);
  r.phrases.slice(0, 20).forEach(p => console.log(`  ${p.fail ? "✗" : "!"} ${p.n}  "${p.phrase}"  (${p.cards.slice(0, 6).join(", ")}${p.n > 6 ? ", ..." : ""})`));
  console.log(`\nsentence openers recurring across cards (>= ${LIMITS.openerWarn} cards; fail >= ${LIMITS.openerFail}): ${r.openers.length}`);
  r.openers.slice(0, 15).forEach(o => console.log(`  ${o.fail ? "✗" : "!"} ${o.n}  "${o.opener} ..."`));
  if (jsonAt >= 0) fs.writeFileSync(argv[jsonAt + 1], JSON.stringify(r, null, 1) + "\n");
  console.log(fails.length ? `\n✗ ${fails.length} findings over the hard limits` : `\n✓ no findings over the hard limits`);
  process.exitCode = fails.length ? 1 : 0;
}

module.exports = { check, LIMITS };
