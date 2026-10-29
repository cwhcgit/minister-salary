// Information hygiene. A blind agent must never receive anything the phone would not show.
//
//   checkPrompt(text, { secret, public })  for prompt files written by people: hidden terms,
//       effect numbers, win-route thresholds, or any 7-word run copied from a secret document
//       (the mechanics brief, the design doc) that is not also on the public store page.
//   checkScreen(text, build)                for generated screens: internal ids, JSON, render
//       bugs, and any stat value during play (the four stats are hidden until the ending screen).
//       Game text may name CEP (an event explains it); prompts may not.
//
// CLI: node harness/leak-check.js [runs]  plays seeded runs and checks every screen.
const H = require("./index");

const PROMPT_TERMS = [
  [/\bCEP\b/i, "names CEP"],
  [/currently\s+estimated\s+potential/i, "names CEP"],
  [/\bheat\b/i, "names Heat"],
  [/\bhidden\s+(stat|value|meter|number|score|ceiling)s?\b/i, "hints at hidden values"],
  [/\b(requiresStat|minStats|maxStats|flagsAll|flagsNone|setFlags|clearFlags|fireYear|rngCalls|inYears)\b/, "engine field name"],
  [/"(effects|schedule|weight|priority|triggered|requires)"\s*:/, "content JSON"],
  [/\b(reputation|standing|integrity|competence|wealth)\s*[:=]?\s*[+-]\s?\d/i, "effect number"],
  [/\b(reputation|standing)\s+(of\s+|above\s+|over\s+|>=?\s*)?\d{2}\b/i, "stat threshold"],
  [/\bwin\s+(route|condition|path)\b/i, "win route"],
  [/\bdouble[- ]?jump/i, "win route"],
  [/\b(seed|rng|random number)\b/i, "RNG"]
];

function shingles(text, n = 7) {
  const w = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const out = new Set();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(" "));
  return out;
}

function checkPrompt(text, opts = {}) {
  const hits = [];
  text.split("\n").forEach((line, i) => {
    for (const [re, why] of PROMPT_TERMS) {
      const m = line.match(re);
      if (m) hits.push({ line: i + 1, why, match: m[0] });
    }
  });
  const pub = new Set();
  for (const p of opts.public || []) for (const s of shingles(p)) pub.add(s);
  const mine = shingles(text);
  for (const doc of opts.secret || []) {
    for (const s of shingles(doc.text)) {
      if (mine.has(s) && !pub.has(s)) { hits.push({ line: null, why: `copied from ${doc.name}`, match: s }); break; }
    }
  }
  return hits;
}

function screenTerms(build) {
  const ids = new Set();
  for (const e of build.content.events) {
    if (e.id.includes("_")) ids.add(e.id);
    for (const c of e.choices) for (const f of (c.setFlags || [])) if (f.includes("_")) ids.add(f);
  }
  return [...ids];
}

// The four stats are hidden during play and revealed only on the ending card, whose first line
// is "<NAME> · THE FINAL POSITION" (harness/screen.js). The ending screen shows the last year's
// outcome above that card, and the stats stay hidden there, so only the text before the line is
// checked. opts.ending (no line in the text) treats the whole text as the ending card.
const ENDING_LINE = /^[^\n]* · THE FINAL POSITION$/m;
const STAT_VALUES = [
  [/\b(REP|STAND|INTEG|COMP)\s+\(?[+-]?\d/, "stat value during play"],   // the old header labels
  [/\b(reputation|standing|integrity|competence)\b\s*[:=(]?\s*\d{1,3}\b/i, "stat value during play"]
];

function checkScreen(text, build, terms = screenTerms(build), opts = {}) {
  const hits = [];
  const at = text.search(ENDING_LINE);
  const during = at >= 0 ? text.slice(0, at) : opts.ending ? "" : text;   // what is shown before the ending card
  for (const [re, why] of STAT_VALUES) {
    const m = during.match(re);
    if (m) hits.push({ why, match: m[0] });
  }
  for (const id of terms) if (text.includes(id)) hits.push({ why: "internal id", match: id });
  for (const [re, why] of [
    [/"\w+"\s*:/, "JSON"], [/\bundefined\b|\bNaN\b|\[object Object\]/, "render bug"],
    [/\{(rival|they|them|their|They|Them|Their|title)\}/, "unfilled batchmate placeholder"],
    // any other template token: a cast member ({peer}, {Junior.They}) or a card part ({asker})
    // that was never filled in. The screen never shows a raw token.
    [/\{[^{}\s]{1,40}\}/, "unfilled template token"],
    [/\b(heat|cep)\s*[:=]\s*-?\d/i, "hidden value"],
    [/\b(reputation|standing|integrity|competence)\s*[:=]?\s*[+-]\s?\d/i, "effect number"]
  ]) {
    const m = text.match(re);
    if (m) hits.push({ why, match: m[0] });
  }
  return hits;
}

if (require.main === module) {
  const N = +process.argv[2] || 150;
  const build = H.loadBuild({ canaries: true });
  const terms = screenTerms(build);
  let screens = 0, bad = 0;
  for (const origin of ["scholar", "grad", "poly"]) {
    for (let i = 0; i < N; i++) {
      const r = H.rng(i * 31 + 7);
      let run = H.newRun(origin, i * 13 + 1, { build, rival: i % 2 === 1 });   // half with a batchmate
      for (let t = 0; t < 95; t++) {
        for (const tags of ["phone", "none"]) {
          const text = H.screenText(run, { tags });
          screens++;
          const hits = checkScreen(text, build, terms, { ending: run.phase === "ending" });
          if (hits.length) { bad++; if (bad <= 5) console.log(`✗ ${origin} seed ${run.seed} turn ${run.turn}:`, hits); }
        }
        if (run.phase === "ending") break;
        const live = H.choices(run).filter(c => c.available);
        run = H.step(run, live[Math.floor(r() * live.length)].id);
      }
    }
  }
  console.log(`${bad ? "✗" : "✓"} ${screens} screens checked, ${bad} with leaks`);
  process.exit(bad ? 1 : 0);
}

module.exports = { checkPrompt, checkScreen, screenTerms, shingles, PROMPT_TERMS };
