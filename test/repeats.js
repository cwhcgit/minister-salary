// No line twice in a career. A player who sees the same sentence come round again (the
// batchmate's news, a rumour, a heads-up, an appraisal quote, a card's body) stops believing the
// world is being written for them. The engine keeps a memory of every sentence its pools have
// shown in a career and never takes one twice (engine.js, "no line twice in a career"); this
// checks it from the player's side, on the screen.
//
// It plays careers with random play and with the win-seeking bot, every origin, alone and with a
// batchmate, and reads every sentence the phone shows: each card's body, each outcome, every line
// on the outcome's pages (review lines, the batchmate, cast lines, Meanwhile lines, rumours,
// warnings) and the ending screen (epitaph, the four stats' verdicts, Declassified). A sentence
// of four words or more that appears twice in one career fails, unless the allowlist below says
// why it is said every time. Choice buttons and card titles are labels, not lines: a card that
// comes back in full (a series, a scheduled consequence) keeps its title and its stance names on
// purpose, so they are not counted.
//
//   node test/repeats.js [careersPerOriginPerBot=150]     (x 2: alone and with a batchmate)
const H = require("../harness");

const N = +(process.argv.slice(2).find(a => /^\d+$/.test(a)) || 150);
const build = H.loadBuild();
const C = build.content;
const ORIGINS = C.origins.map(o => o.id);

// Lines that are structural: the engine says them every time, in the same words, on purpose.
// `line: true` exempts every sentence of a line that matches; otherwise only the sentence.
const ALLOW = [
  { re: /^Annual package: /, why: "the pay line: every review gives the package against last year's" },
  { re: /^No decision was needed this year\./, line: true, why: "a year that passes by itself says why, quoting the habit it repeats" },
  { re: /^This will count (?:against you|in your favour) at this year's appraisal\.$/, why: "a choice that counts at appraisal is told so, every time (rule 5.13)" },
  { re: /^Your pay rises from next year\.$/, why: "a promotion's note on pay" },
  { re: /^(?:A D is a formal warning|This is your second warning|Another D next year)\b/, why: "a formal warning states its terms every time" }
];
// A shorter sentence is a phrase, not a line: the grade's letter ("Grade A."), "Nobody says anything.", "Once."
const MIN_WORDS = 4;

// Sentences: split after . ! ? or an ellipsis (and any closing quote), before a capital, a digit
// or an opening quote. (The engine splits the same way, but this is the player's side: written apart.)
const sentences = t => String(t).replace(/([.!?…]["”’']?)\s+(?=["“‘']?[A-Z0-9$])/g, "$1\n")
  .split("\n").map(x => x.trim()).filter(Boolean);
const words = s => s.split(/\s+/).filter(Boolean).length;
const allowed = { sentences: 0, lines: 0 }, uses = new Map(ALLOW.map(a => [a, 0]));

const WIN = f => (f.cep || 0) * 60 + (f.standing || 0) * 1.5 + (f.competence || 0) * 1.4 + (f.reputation || 0) * 1.3 - (f.heat || 0) * 0.8;
const BOTS = { random: null, "knows the win": WIN };

const problems = [];
let careers = 0, checked = 0;
for (const rival of [false, true]) for (const [bot, score] of Object.entries(BOTS)) for (const origin of ORIGINS) for (let i = 0; i < N; i++) {
  const seed = 5000 + i * 11 + (rival ? 3 : 0) + (score ? 1 : 0);
  const pick = H.rng((seed * 2654435761 + 7) >>> 0);
  const gender = i % 2 ? "m" : "f", name = i % 3 ? "" : "Tan Wei Ling";
  let run = H.newRun(origin, seed, { build, name, gender, rival });
  const seen = new Map();   // sentence -> [where]
  const read = (text, where) => {
    if (text === null || text === undefined) return;
    const t = String(text);
    const whole = ALLOW.find(a => a.line && a.re.test(t));
    if (whole) { allowed.lines++; uses.set(whole, uses.get(whole) + 1); return; }
    for (const s of sentences(t)) {
      if (words(s) < MIN_WORDS) continue;
      const a = ALLOW.find(a => !a.line && a.re.test(s));
      if (a) { allowed.sentences++; uses.set(a, uses.get(a) + 1); continue; }
      checked++;
      if (!seen.has(s)) seen.set(s, []);
      seen.get(s).push(where);
    }
  };
  for (let t = 0; t < 200 && run.phase !== "ending"; t++) {
    const ev = H.currentEvent(build, run.S), view = H.screen(run, { view: "event" }).event;
    read(view.body, `${ev.id} (body)`);
    const live = H.choices(run);
    let k = 0;
    if (!score) k = Math.floor(pick() * live.length);
    else {
      const fx = id => (ev.choices[H.choices(run).findIndex(c => c.id === id)] || {}).effects || {};
      live.forEach((c, j) => { if (score(fx(c.id)) > score(fx(live[k].id))) k = j; });
    }
    run = H.step(run, live[k].id);
    const o = H.screen(run, { view: "outcome" }).outcome;
    if (!o) continue;
    read(o.text, `${ev.id} (outcome)`);
    for (const pg of o.pages) for (const l of pg.log) if (l.tag !== "year") read(l.text, `${l.tag} line, year ${run.S.year}`);
  }
  if (run.phase === "ending") {
    const e = H.screen(run, { view: "event" }).ending;
    read(e.epitaph, "the ending's epitaph");
    for (const x of e.stats) read(x.verdict, `the ending: ${x.label}`);
    for (const x of e.declassified) read(x.text, `Declassified: ${x.label}`);
  }
  careers++;
  for (const [s, where] of seen) if (where.length > 1)
    problems.push({ career: `${origin} seed ${seed}${rival ? " with a batchmate" : ""}, ${bot}`, sentence: s, times: where.length, where: [...new Set(where)] });
}

console.log(`${careers} careers (${ORIGINS.join(", ")}; alone and with a batchmate; random and win-seeking), ${checked} sentences checked`);
console.log(`allowed as structural: ${allowed.sentences} sentences, ${allowed.lines} whole lines`);
for (const [a, n] of uses) console.log(`  ${String(n).padStart(6)}  ${a.re}  ${a.why}`);
if (problems.length) {
  const bySentence = new Map();
  for (const p of problems) { if (!bySentence.has(p.sentence)) bySentence.set(p.sentence, []); bySentence.get(p.sentence).push(p); }
  console.log(`\nFAIL: ${bySentence.size} sentences shown twice or more in one career (${problems.length} careers in all)`);
  for (const [s, ps] of [...bySentence].sort((a, b) => b[1].length - a[1].length).slice(0, 25)) {
    const worst = ps.reduce((a, b) => (b.times > a.times ? b : a));
    console.log(`  ${worst.times}x in ${worst.career} (${ps.length} careers): "${s.slice(0, 140)}"\n      from ${worst.where.slice(0, 4).join("; ")}`);
  }
  process.exit(1);
}
console.log("OK: no sentence is shown twice in a career");
