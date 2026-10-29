// The phone screen as data, then as plain text. Mirrors web/ui.js field for field and
// adds nothing the phone does not show: no event ids, no effect numbers, no hidden values.
// test/screen.test.js checks this against the real DOM, so a UI change that is not
// copied here fails the build instead of silently diverging.

const LETTERS = "ABCDEFGH";

// The heading over the four stats on the ending screen (ui.js endingScreen).
const STATS_LABEL = "Your numbers";

// same as ui.js: the CEP hint and the Heat rumour both read as RUMOUR
const TAG_LABEL = { cep: "rumour", heat: "rumour", rival: "batchmate", noted: "appraisal" };

// same as ui.js
const money = n =>
  Math.abs(n) >= 1e6 ? "$" + (n / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M"
                     : "$" + Math.round(n).toLocaleString();

// Text the start screen shows around the origin picker (ui.js startScreen).
const START = {
  title: "Minister Salary",
  tagline: "You join the public service. The formula that sets the Prime Minister's pay is published, and so is the distance between you and it.",
  hint: "One tap is one year, and every year ends with an appraisal grade. A or B+ gets you considered for promotion; two Ds in a row and you are asked to leave. Choices are permanent, and some of them come back."
};

// The four stats are hidden during play: the header carries no values, bars or changes.
function header(build, S) {
  const r = build.engine.rank(build.content, S);
  return {
    rank: r.title, grade: r.grade,
    age: S.age, year: S.year, ministry: S.ministry,
    // same as ui.js: the batchmate line appears only in a run with a batchmate
    ...(S.rival ? { batchmate: build.engine.batchmate(build.content, S) } : {}),
    wealth: money(S.wealth), wealthLabel: "lifetime earnings"
  };
}

// A locked choice gives an in-world reason, never the number (engine.lockedText; same words as ui.js).
function requirementText(build, ch) {
  return build.engine.lockedText ? build.engine.lockedText(build.content, ch)
    : "Requires " + Object.entries(ch.requiresStat).map(([k, v]) => `${k} ${v}`).join(", ");
}

function eventCard(build, S, ev) {
  return {
    title: ev.title,
    body: ev.body,
    choices: ev.choices.map((c, i) => {
      const ok = build.engine.choiceAvailable(c, S);
      return { id: LETTERS[i], text: c.text, available: ok, requires: ok ? null : requirementText(build, c) };
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
    // not every ending is a retirement (engine.finalLabels; same words as ui.js)
    positionLabel: build.engine.finalLabels ? build.engine.finalLabels(build.content, S).position : "Retired as",
    position: r.title,
    ageLabel: build.engine.finalLabels ? build.engine.finalLabels(build.content, S).age : "At age",
    age: S.age,
    lifetimeEarnings: money(S.wealth),
    // the four stats, hidden until now, each with its verdict (engine.statVerdicts; same lines as ui.js)
    stats: build.engine.statVerdicts ? build.engine.statVerdicts(build.content, S).map(v => ({ label: v.label, value: v.value, verdict: v.text })) : [],
    // what was really going on, revealed only now (engine.declassify; same lines as ui.js)
    declassified: build.engine.declassify ? build.engine.declassify(build.content, S) : []
  };
}

function startCard(build, originId, rival = false) {
  const o = build.content.origins.find(x => x.id === originId);
  return { ...START, origin: { name: o.name, difficulty: o.difficulty + (rival ? " + batchmate" : ""), blurb: o.blurb } };
}

// --- plain text --------------------------------------------------------
// The phone uppercases log tags and stat labels with CSS; the text keeps that.
// opts.tags: "phone" (default, as displayed) or "none" (drop the tag labels).

function headerText(h) {
  return `${h.rank} [${h.grade}]   ${h.wealth} ${h.wealthLabel.toUpperCase()}\nAge ${h.age} · Year ${h.year} · ${h.ministry}`
    + (h.batchmate ? `\nBatchmate: ${h.batchmate}` : "");
}

function toText(view, opts = {}) {
  const tags = opts.tags || "phone";
  const out = [];
  if (view.start) {
    out.push(`${view.start.title}\n${view.start.tagline}\n\nYou chose: ${view.start.origin.name} (${view.start.origin.difficulty.toUpperCase()})\n${view.start.origin.blurb}\n\n${view.start.hint}`);
  }
  if (view.header) out.push(headerText(view.header));
  if (view.outcome) {
    const lines = view.outcome.log.map(l => l.tag === "year" ? `  ${l.text.toUpperCase()}` : tags === "none" ? `  ${l.text}` : `  [${l.tag.toUpperCase()}] ${l.text}`);
    out.push(`LAST YEAR\n${view.outcome.text}${lines.length ? "\n" + lines.join("\n") : ""}`);
  }
  // the ending card comes after the last outcome (ui.js shows it on the next screen)
  if (view.ending) {
    const e = view.ending;
    out.push(`${e.label.toUpperCase()}\n${e.title}\n\n${e.epitaph}\n\n${e.positionLabel.toUpperCase()} ${e.position}\n${e.ageLabel.toUpperCase()} ${e.age}\nLIFETIME EARNINGS ${e.lifetimeEarnings}`
      + (e.stats.length ? `\n\n${STATS_LABEL.toUpperCase()}\n` + e.stats.map(x => `${x.label.toUpperCase()} ${x.value}: ${x.verdict}`).join("\n") : "")
      + (e.declassified.length ? "\n\nDECLASSIFIED\n" + e.declassified.map(l => `${l.label.toUpperCase()}: ${l.text}`).join("\n") : ""));
    return out.join("\n\n");
  }
  if (view.event) {
    const ev = view.event;
    const ch = ev.choices.map(c => `  ${c.id}) ${c.text}${c.available ? "" : `   [unavailable: ${c.requires}]`}`);
    out.push(`THIS YEAR: ${ev.title}\n${ev.body}\n\n${ch.join("\n")}`);
  }
  return out.join("\n\n");
}

module.exports = { header, eventCard, outcomeCard, endingCard, startCard, toText, money, LETTERS, STATS_LABEL };
