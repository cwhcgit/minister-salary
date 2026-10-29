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
  namePlaceholder: "Your name",
  tagline: "You join the public service. The formula that sets the Prime Minister's pay is published, and so is the distance between you and it.",
  hint: "One tap is one year, and every year ends with an appraisal grade. A or B+ gets you considered for promotion; two Ds in a row and you are asked to leave. Choices are permanent, and some of them come back."
};

// The four stats are hidden during play: the header carries no values, bars or changes.
// engine.header gives it as data (rank, grade, age, year, place, earnings, batchmate): for the
// event screen, and for each page of an outcome (the header there is dated to that page's year).
function headerOf(h) {
  return {
    rank: h.title, grade: h.grade,
    age: h.age, year: h.year, place: h.place,
    // same as ui.js: the batchmate line appears only in a run with a batchmate
    ...(h.batchmate ? { batchmate: h.batchmate } : {}),
    wealth: money(h.wealth), wealthLabel: "lifetime earnings"
  };
}
function header(build, S) {
  if (build.engine.header) return headerOf(build.engine.header(build.content, S));
  // an older build (a proposal's copy): the ministry, as it always showed
  const r = build.engine.rank(build.content, S);
  return headerOf({ title: r.title, grade: r.grade, age: S.age, year: S.year, place: S.ministry,
    batchmate: S.rival ? build.engine.batchmate(build.content, S) : null, wealth: S.wealth });
}

// The card and the choices the player can take, lettered in the order shown (same as ui.js). A
// choice the player lacks the stats for is not on the card at all: the engine leaves it off
// (engine.eventOf). An older build still lists one, so it is left off here too.
function eventCard(build, S, ev) {
  return {
    title: ev.title,
    body: ev.body,
    choices: ev.choices.filter(c => build.engine.choiceAvailable(c, S)).map((c, i) => ({ id: LETTERS[i], text: c.text }))
  };
}

// String() as the template literals in ui.js do, so a malformed log entry shows here
// exactly as broken as on the phone (and the leak check catches it).
// The phone shows an outcome as pages: the card's outcome first, then one page per year, each
// opening with its heading. Each page has its own header (ui.js outcomeScreen): `head` is the
// first page's (engine.advance), a year heading carries its page's; `fallback` is for a log
// from an older build, which had neither (the phone then shows the current header throughout).
function outcomeCard(outcome, log, head, fallback) {
  const pages = [{ header: head ? headerOf(head) : fallback, log: [] }];
  for (const l of log) {
    if (l.kind === "year") pages.push({ header: l.head ? headerOf(l.head) : fallback, log: [] });
    pages[pages.length - 1].log.push({ tag: TAG_LABEL[l.kind] || String(l.kind), text: String(l.text) });
  }
  return { text: outcome, pages };
}

function endingCard(build, S) {
  // the title and epitaph with the player's name filled in (engine.ending; same as ui.js)
  const e = build.engine.ending ? build.engine.ending(build.content, S) : build.content.endings.find(x => x.id === S.ending);
  const r = build.engine.rank(build.content, S);
  const name = build.engine.player ? build.engine.player(build.content, S).name : S.name;
  return {
    label: `${name} · the final position`,
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

// The gender choices come from game.json player.genders, in order (engine.genders; same as ui.js).
// player: { name, gender } as the run has them (a blank name field is the name drawn for the run).
function startCard(build, originId, rival = false, player = null) {
  const o = build.content.origins.find(x => x.id === originId);
  const E = build.engine;
  const card = { ...START, origin: { name: o.name, difficulty: o.difficulty + (rival ? " + batchmate" : ""), blurb: o.blurb } };
  if (E.genders) card.genders = E.genders(build.content).map(g => g.label);
  if (player && E.player) card.player = { name: player.name, gender: E.player(build.content, { name: player.name, gender: player.gender }).label };
  return card;
}

// --- plain text --------------------------------------------------------
// The phone uppercases log tags and stat labels with CSS; the text keeps that.
// opts.tags: "phone" (default, as displayed) or "none" (drop the tag labels).

function headerText(h) {
  return `${h.rank} [${h.grade}]   ${h.wealth} ${h.wealthLabel.toUpperCase()}\nAge ${h.age} · Year ${h.year} · ${h.place}`
    + (h.batchmate ? `\nBatchmate: ${h.batchmate}` : "");
}

function toText(view, opts = {}) {
  const tags = opts.tags || "phone";
  const out = [];
  if (view.start) {
    const me = view.start.player ? `Your name: ${view.start.player.name} (${view.start.player.gender})\n` : "";
    out.push(`${view.start.title}\n${view.start.tagline}\n\n${me}You chose: ${view.start.origin.name} (${view.start.origin.difficulty.toUpperCase()})\n${view.start.origin.blurb}\n\n${view.start.hint}`);
  }
  // the outcome's pages in the order the phone shows them, each under its own header; the card's
  // outcome is the first page ("LAST YEAR"), and every later page opens with its year's heading
  if (view.outcome) view.outcome.pages.forEach((pg, k) => {
    const lines = pg.log.map(l => l.tag === "year" ? `  ${l.text.toUpperCase()}` : tags === "none" ? `  ${l.text}` : `  [${l.tag.toUpperCase()}] ${l.text}`);
    const top = k === 0 ? [`LAST YEAR\n${view.outcome.text}`] : [];
    out.push(`${headerText(pg.header)}\n\n${top.concat(lines).join("\n")}`);
  });
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
    if (view.header) out.push(headerText(view.header));
    const ch = ev.choices.map(c => `  ${c.id}) ${c.text}`);
    out.push(`THIS YEAR: ${ev.title}\n${ev.body}\n\n${ch.join("\n")}`);
  }
  return out.join("\n\n");
}

module.exports = { header, eventCard, outcomeCard, endingCard, startCard, toText, money, LETTERS, STATS_LABEL };
