// Information hygiene. A blind agent must never receive anything the phone would not show.
//
//   checkPrompt(text, { secret, public })  for prompt files written by people: hidden terms,
//       effect numbers, win-route thresholds, or any 7-word run copied from a secret document
//       (the mechanics brief, the design doc) that is not also on the public store page.
//   checkScreen(text, build)                for generated screens: internal ids, JSON, render
//       bugs, and any stat value during play (the four stats are hidden until the ending screen).
//       Game text may name CEP (an event explains it); prompts may not. With opts.player
//       ({ name, gender }, the run's start screen), also the wrong honorific before the name.
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

// Another choice's honorific before the player's name (game.json player.genders): "Mr Tan Wei
// Ming" or "Mr Tan" for a player who chose Female, "Ms ..." for one who chose Male, and so on for
// any choice. The name as typed, the whole name and the surname are each checked (engine.player
// gives the forms of the name; an older engine has only the name as typed).
function wrongHonorific(text, player, build) {
  if (!player || !player.name) return null;
  const T = ((build && build.content.player) || {}).genders;
  if (!T || !T[player.gender]) return null;
  const me = build.engine && build.engine.player ? build.engine.player(build.content, { name: player.name, gender: player.gender }) : { name: player.name };
  const bare = x => x && me.honorific && x.startsWith(me.honorific + " ") ? x.slice(me.honorific.length + 1) : x;
  const names = [...new Set([player.name, bare(me.full), bare(me.formal)].filter(Boolean))].sort((a, b) => b.length - a.length);
  if (!names.some(n => text.includes(n))) return null;
  const re = x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const mine = T[player.gender].honorific;
  const wrong = [...new Set(Object.values(T).map(g => g.honorific).filter(h => h && h !== mine))];
  const m = wrong.length && text.match(new RegExp(`\\b(?:${wrong.map(re).join("|")}) (?:${names.map(re).join("|")})\\b`));
  return m ? m[0] : null;
}

function checkScreen(text, build, terms = screenTerms(build), opts = {}) {
  const hits = [];
  const hon = wrongHonorific(text, opts.player, build);
  if (hon) hits.push({ why: "wrong honorific for the player", match: hon });
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
    [/\{[Pp]layer(\.[A-Za-z]+)?\}/, "unfilled player placeholder"],
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
  // the start screen, by run: every gender choice in game.json, a blank name (drawn for the run),
  // and typed names that share words with the batchmate's and the cast's pools
  const NAMES = ["", "Tan Wei Ming", "Nur Aisyah", "Kumar", "Ong Mei Xuan"];
  const GENDERS = build.engine.genders ? build.engine.genders(build.content).map(g => g.id) : [undefined];
  const terms = screenTerms(build);
  let screens = 0, bad = 0;
  for (const origin of ["scholar", "grad", "poly"]) {
    for (let i = 0; i < N; i++) {
      const r = H.rng(i * 31 + 7);
      const name = NAMES[i % NAMES.length], gender = GENDERS[i % GENDERS.length];
      let run = H.newRun(origin, i * 13 + 1, { build, rival: i % 2 === 1, name, gender });   // half with a batchmate
      const player = { name: run.name, gender: run.gender };
      for (let t = 0; t < 95; t++) {
        for (const tags of ["phone", "none"]) {
          const text = H.screenText(run, { tags });
          screens++;
          const hits = checkScreen(text, build, terms, { ending: run.phase === "ending", player });
          if (hits.length) { bad++; if (bad <= 5) console.log(`✗ ${origin} seed ${run.seed} turn ${run.turn}:`, hits); }
        }
        if (run.phase === "ending") break;
        const live = H.choices(run);
        run = H.step(run, live[Math.floor(r() * live.length)].id);
      }
    }
  }
  console.log(`${bad ? "✗" : "✓"} ${screens} screens checked, ${bad} with leaks`);
  process.exit(bad ? 1 : 0);
}

module.exports = { checkPrompt, checkScreen, screenTerms, shingles, wrongHonorific, PROMPT_TERMS };
