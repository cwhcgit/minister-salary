// The phone screen as data, then as plain text. Mirrors web/ui.js field for field and
// adds nothing the phone does not show: no event ids, no effect numbers, no hidden values.
// test/screen.test.js checks this against the real DOM, so a UI change that is not
// copied here fails the build instead of silently diverging.

const STATKEYS = [
  ["reputation", "Rep"],
  ["standing",   "Stand"],
  ["integrity",  "Integ"],
  ["competence", "Comp"]
];

const LETTERS = "ABCDEFGH";

// same as ui.js: the CEP hint and the Heat rumour both read as RUMOUR
const TAG_LABEL = { cep: "rumour", heat: "rumour" };

// same as ui.js
const money = n =>
  Math.abs(n) >= 1e6 ? "$" + (n / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M"
                     : "$" + Math.round(n).toLocaleString();

// Text the start screen shows around the origin picker (ui.js startScreen).
const START = {
  title: "Minister Salary",
  tagline: "You join the public service at the bottom. The formula that sets the Prime Minister's pay is published, and so is the distance between you and it.",
  hint: "One tap is one year. Choices are permanent, and some of them come back."
};

function header(build, S, prev) {
  const r = build.engine.rank(build.content, S);
  return {
    rank: r.title, grade: r.grade,
    age: S.age, year: S.year, ministry: S.ministry,
    wealth: money(S.wealth), wealthLabel: "lifetime earnings",
    stats: STATKEYS.map(([key, label]) => ({
      key, label, value: S[key],
      delta: prev && prev[key] !== S[key] ? S[key] - prev[key] : 0
    }))
  };
}

function requirementText(ch) {
  return "Requires " + Object.entries(ch.requiresStat).map(([k, v]) => `${k} ${v}`).join(", ");
}

function eventCard(build, S, ev) {
  return {
    title: ev.title,
    body: ev.body,
    choices: ev.choices.map((c, i) => {
      const ok = build.engine.choiceAvailable(c, S);
      return { id: LETTERS[i], text: c.text, available: ok, requires: ok ? null : requirementText(c) };
    })
  };
}

// String() as the template literals in ui.js do, so a malformed log entry shows here
// exactly as broken as on the phone (and the leak check catches it).
function outcomeCard(outcome, log) {
  return { text: outcome, log: log.map(l => ({ tag: TAG_LABEL[l.kind] || String(l.kind), text: String(l.text) })) };
}

function endingCard(build, S) {
  const e = build.content.endings.find(x => x.id === S.ending);
  const r = build.engine.rank(build.content, S);
  return {
    label: `${S.name} · the final position`,
    title: e.title, epitaph: e.epitaph,
    retiredAs: r.title, age: S.age,
    lifetimeEarnings: money(S.wealth), integrity: S.integrity,
    // what was really going on, revealed only now (engine.declassify; same lines as ui.js)
    declassified: build.engine.declassify ? build.engine.declassify(build.content, S) : []
  };
}

function startCard(build, originId) {
  const o = build.content.origins.find(x => x.id === originId);
  return { ...START, origin: { name: o.name, difficulty: o.difficulty, blurb: o.blurb } };
}

// --- plain text --------------------------------------------------------
// The phone uppercases log tags and stat labels with CSS; the text keeps that.
// opts.tags: "phone" (default, as displayed) or "none" (drop the tag labels).

function headerText(h) {
  const stats = h.stats.map(s =>
    `${s.label.toUpperCase()} ${s.value}${s.delta ? ` (${s.delta > 0 ? "+" : ""}${s.delta})` : ""}`).join("   ");
  return `${h.rank} [${h.grade}]   ${h.wealth} ${h.wealthLabel.toUpperCase()}\nAge ${h.age} · Year ${h.year} · ${h.ministry}\n${stats}`;
}

function toText(view, opts = {}) {
  const tags = opts.tags || "phone";
  const out = [];
  if (view.start) {
    out.push(`${view.start.title}\n${view.start.tagline}\n\nYou chose: ${view.start.origin.name} (${view.start.origin.difficulty.toUpperCase()})\n${view.start.origin.blurb}\n\n${view.start.hint}`);
  }
  if (view.ending) {
    const e = view.ending;
    out.push(`${e.label.toUpperCase()}\n${e.title}\n\n${e.epitaph}\n\nRETIRED AS ${e.retiredAs}\nAT AGE ${e.age}\nLIFETIME EARNINGS ${e.lifetimeEarnings}\nINTEGRITY ${e.integrity}`
      + (e.declassified.length ? "\n\nDECLASSIFIED\n" + e.declassified.map(l => `${l.label.toUpperCase()}: ${l.text}`).join("\n") : ""));
    return out.join("\n\n");
  }
  if (view.header) out.push(headerText(view.header));
  if (view.outcome) {
    const lines = view.outcome.log.map(l => tags === "none" ? `  ${l.text}` : `  [${l.tag.toUpperCase()}] ${l.text}`);
    out.push(`LAST YEAR\n${view.outcome.text}${lines.length ? "\n" + lines.join("\n") : ""}`);
  }
  if (view.event) {
    const ev = view.event;
    const ch = ev.choices.map(c => `  ${c.id}) ${c.text}${c.available ? "" : `   [unavailable: ${c.requires}]`}`);
    out.push(`THIS YEAR: ${ev.title}\n${ev.body}\n\n${ch.join("\n")}`);
  }
  return out.join("\n\n");
}

module.exports = { header, eventCard, outcomeCard, endingCard, startCard, toText, money, LETTERS, STATKEYS };
