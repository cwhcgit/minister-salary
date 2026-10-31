#!/usr/bin/env node
// The deck: every card in the game, numbered from the first card a career can meet to the last,
// then the endings. Two views, both generated from the content, never edited by hand:
//
//   docs/DECK.md          the player's view: each card as the phone shows it, every choice and
//                         its outcome, and links to the cards and endings a choice can lead to
//   docs/DECK-DESIGN.md   the designer's view: the same text, plus who sees each card, what each
//                         choice does to the hidden numbers, follow-up chances and delays, hidden
//                         witnesses, decision groups, series, and the Meanwhile lines
//
// A view too big for GitHub to render as one page (LIMIT) is split into chapter files, one per
// stage of a career (docs/deck/, docs/deck-design/), and its file in docs/ becomes the contents.
//
// The order is a career's spine. The first card of each start comes first; then the cards by the
// earliest grade they can appear at (a card that fires the moment it qualifies first), then the
// earliest age, then pack order, then id. The crossing into politics (the tea and the cards it
// leads to) sits between the service and Parliament. A follow-up card (one that is only ever
// scheduled, never drawn) comes right after the first card that can schedule it, with its
// versions for other grades, so a story reads in sequence. The batchmate's cards have a section
// of their own, then the career's last years, then the endings.
//
// Text is rendered by the engine's own render(), so it reads exactly as the game puts it: the
// card parts assembled, the run's people introduced on first mention, the player's name in the
// form the speaker uses. One sample career throughout: the player, Lim Wei Ling (Female), in the
// Ministry of Health, with one fixed person in each cast role and Hui Min as the batchmate.
//
//   node tools/deck.js           write both views
//   node tools/deck.js --check   exit 1 if either view is stale, or a link, a card or a token is
//                                wrong (the same checks run, and must pass, when writing)
//
// No dependencies beyond Node and the harness.
"use strict";
const fs = require("fs");
const path = require("path");
const H = require("../harness");

const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const LIMIT = 400 * 1024;   // bytes: GitHub stops rendering long Markdown pages; split above this
const CHECK = process.argv.includes("--check");

const build = H.loadBuild();
const E = build.engine, C = build.content;
const MANIFEST = (JSON.parse(fs.readFileSync(path.join(build.root, "content/packs/manifest.json"), "utf8")).packs) || [];
const RIVAL_EVENTS = (C.rival && C.rival.events) || [];
const ALL = C.events.concat(RIVAL_EVENTS);
const BY_ID = new Map(ALL.map(e => [e.id, e]));
const IS_RIVAL = new Set(RIVAL_EVENTS.map(e => e.id));
const LETTERS = "ABCDEFGH";

// --- the sample career --------------------------------------------------------
const SAMPLE = {
  player: { name: "Lim Wei Ling", gender: "f" },
  ministry: "Ministry of Health",
  rival: "Hui Min",
  cast: { peer: "Ho Xin Yi", junior: "Faizal bin Osman", senior: "Chua Shi Ting", journalist: "Rajesh Nair",
    grassroots: "Rohani binte Kassim", mp: "Benedict Loh" }
};
const ME = E.player(C, SAMPLE.player);
// one person per role, from the cast pool (another from the pool if a sample name is ever removed)
const PEOPLE = (() => {
  const words = n => n.full.toLowerCase().split(/\s+/);
  const used = new Set(ME.name.toLowerCase().split(/\s+/).concat(SAMPLE.rival.toLowerCase().split(/\s+/)));
  const out = {};
  for (const role of Object.keys(C.cast.roles)) {
    let n = C.cast.names.find(x => x.full === SAMPLE.cast[role] && words(x).every(w => !used.has(w)));
    if (!n) n = C.cast.names.find(x => words(x).every(w => !used.has(w)));
    words(n).forEach(w => used.add(w));
    out[role] = { nm: { given: n.given, formal: n.formal, full: n.full }, pron: n.pron };
  }
  return out;
})();
const RIVAL = (() => {
  const n = (C.rival && C.rival.names || []).find(x => x.name === SAMPLE.rival) || (C.rival && C.rival.names[0]) || { name: SAMPLE.rival, pron: "f" };
  return { name: n.name, pron: n.pron };
})();
const ROLE_LABEL = { peer: "the peer", junior: "the junior officer", senior: "the reporting officer", journalist: "the journalist",
  grassroots: "the grassroots leader", mp: "the fellow MP" };

// --- stages -------------------------------------------------------------------
const STAGES = [
  { key: "first-years", file: "01-first-years.md", title: "The first years",
    about: "Each start's first card, then Management Executive and Senior Management Executive." },
  { key: "service", file: "02-service.md", title: "The service", about: "Assistant Director to Senior Director." },
  { key: "top", file: "03-top-of-service.md", title: "The top of the service", about: "Deputy Secretary and Permanent Secretary." },
  { key: "crossing", file: "04-crossing.md", title: "The crossing",
    about: "The tea, the background check and the election: from the service into politics, and what follows from them." },
  { key: "politics", file: "05-politics.md", title: "Politics", about: "Member of Parliament to Senior Parliamentary Secretary." },
  { key: "cabinet", file: "06-cabinet.md", title: "Cabinet", about: "Minister of State to Prime Minister." },
  { key: "batchmate", file: "07-batchmate.md", title: "The batchmate",
    about: "Only with the batchmate on: the start screen's option to play against someone from your intake, who climbs alongside you." },
  { key: "endgame", file: "08-endgame.md", title: "The endgame",
    about: "The last years: the service's last year, the party's renewal, the offer to stay, the last year in politics, and a Prime Minister's tenure." },
  { key: "endings", file: "09-endings.md", title: "Endings", about: "Every way a career ends." }
];
const stageOfRank = r => r <= 1 ? "first-years" : r <= 5 ? "service" : r <= 7 ? "top" : r <= 10 ? "politics" : "cabinet";

// --- the spine ----------------------------------------------------------------
const packIndex = e => IS_RIVAL.has(e.id) ? MANIFEST.length + 1 : e.pack ? 1 + MANIFEST.indexOf(e.pack) : 0;
const packFile = e => IS_RIVAL.has(e.id) ? "rival.json" : e.pack ? `packs/${e.pack}.json` : "events.json";
const minRank = e => ((e.requires || {}).minRank) || 0;
const sortKey = e => [minRank(e), e.priority ? 0 : 1, ((e.requires || {}).minAge) || 0, packIndex(e), e.id];
const cmp = (a, b) => { const x = sortKey(a), y = sortKey(b); for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1; return 0; };

// What a choice can schedule: its own schedule, and the election the background check's answer
// books (the engine's answerFolder, for either answer).
const ELECTION = "the_election", TEA = "tea_session";
function followUps(ch) {
  const out = (ch.schedule || []).map(x => ({ id: x.eventId, inYears: x.inYears, chance: x.chance === undefined ? 1 : x.chance }));
  if (ch.folder && BY_ID.has(ELECTION) && !out.some(x => x.id === ELECTION)) out.push({ id: ELECTION, inYears: 1, chance: 1, folder: ch.folder });
  return out;
}
const targetsOf = ev => [...new Set(ev.choices.flatMap(ch => followUps(ch).map(x => x.id)))].filter(id => BY_ID.has(id));
const scheduled = new Set(ALL.flatMap(targetsOf));
const alternateOf = new Map();
for (const e of ALL) for (const a of e.alternates || []) if (!alternateOf.has(a)) alternateOf.set(a, e.id);
const EG = (C.endgame || {}).cards || {};
const TENURE = (C.endgame || {}).pmTenure ? Object.values(C.endgame.pmTenure.cards) : [];
const isEndgame = e => !!e.endgame;

function buildOrder() {
  const order = [], placed = new Set();
  const put = (ev, stage, rank, extra = {}) => { placed.add(ev.id); order.push({ ev, stage, rank, ...extra }); };
  const rankIn = (ev, parent) => {
    const q = ev.requires || {};
    return Math.min(q.maxRank === undefined ? 16 : q.maxRank, Math.max(q.minRank || 0, parent));
  };
  // a card, its versions for other grades, then (depth first, in choice order) the follow-ups
  // they can schedule that no earlier card could
  const group = (ev, stage, parentRank, extra) => {
    if (placed.has(ev.id)) return;
    const g = [ev, ...(ev.alternates || []).map(a => BY_ID.get(a)).filter(x => x && !placed.has(x.id))];
    g.forEach((x, i) => put(x, stage, rankIn(x, parentRank), i ? {} : extra));
    for (const x of g) for (const id of targetsOf(x)) {
      const t = BY_ID.get(id);
      if (t && t.triggered && !isEndgame(t) && !placed.has(id)) group(t, stage, rankIn(x, parentRank));
    }
  };
  // 1. each start's first card (the card a new career draws first, when it is that start's own)
  const openings = [];
  for (const o of C.origins) {
    const drawn = E.nextEvent(C, E.newGame(C, o.id, SAMPLE.player.name, 1, { gender: SAMPLE.player.gender })).event;
    const ev = drawn && BY_ID.get(drawn.id);   // the card itself, not the copy rendered for that run
    const q = (ev && ev.requires) || {};
    if (ev && ev.priority && q.origin && q.origin.length === 1 && q.origin[0] === o.id && !placed.has(ev.id)) {
      openings.push(ev.id);
      group(ev, "first-years", o.startRank, { opening: o });
    }
  }
  // 2. the spine: every card drawn at random or by priority, and follow-ups nothing schedules
  //    (the improvement plan, which the year-end review books), by grade
  const spine = ALL.filter(e => !IS_RIVAL.has(e.id) && !isEndgame(e) && !placed.has(e.id) && e.id !== TEA
    && (!e.triggered || (!scheduled.has(e.id) && !alternateOf.has(e.id)))).sort(cmp);
  const service = spine.filter(e => minRank(e) <= 7), politics = spine.filter(e => minRank(e) >= 8);
  for (const e of service) group(e, stageOfRank(minRank(e)), minRank(e));
  // 3. the crossing: the tea, and the cards it leads to
  if (BY_ID.has(TEA)) group(BY_ID.get(TEA), "crossing", minRank(BY_ID.get(TEA)));
  for (const e of politics) group(e, stageOfRank(minRank(e)), minRank(e));
  // 4. the batchmate's cards, by grade
  for (const e of RIVAL_EVENTS.slice().sort(cmp)) group(e, "batchmate", minRank(e));
  // 5. the career's last years, in the order a career meets them
  const endgame = ALL.filter(isEndgame).sort((a, b) => endRank(a) - endRank(b) || ALL.indexOf(a) - ALL.indexOf(b));
  for (const e of endgame) group(e, "endgame", endContext(e).rank);
  // anything left (a follow-up whose only scheduler is itself, or a card no rule placed): by grade
  for (const e of ALL.filter(e => !placed.has(e.id)).sort(cmp)) group(e, IS_RIVAL.has(e.id) ? "batchmate" : stageOfRank(minRank(e)), minRank(e));
  return order;
}
// the endgame's cards in a career's order: the service's last year, then the party's renewal,
// the offer to stay and the last year in politics, then a Prime Minister's tenure
function endRank(e) {
  if (e.id === EG.lastService) return 0;
  if (e.id === EG.renewal) return 1;
  if (e.id === EG.stay) return 2;
  if (e.id === EG.lastPolitics) return 3;
  const longest = TENURE.reduce((a, b) => (b.length > a.length ? b : a), []);
  const i = longest.indexOf(e.id);
  return i >= 0 ? 10 + i : 9;
}
// where a sample career would be when the endgame card comes
function endContext(e) {
  if (e.id === EG.lastService) return { rank: 4, age: C.retireAge - 1, endKind: "retire" };
  if (e.id === EG.renewal) return { rank: 8, age: ((C.endgame || {}).renewalAge || 65) - 1, endKind: "election" };
  if (e.id === EG.stay) return { rank: 13, age: ((C.endgame || {}).renewalAge || 65) - 1, endKind: "election" };
  if (e.id === EG.lastPolitics) return { rank: 8, age: ((C.endgame || {}).renewalAge || 65), endKind: "election" };
  return { rank: 16, age: 60 };
}

const ORDER = buildOrder();
const NUM = new Map(ORDER.map((o, i) => [o.ev.id, i + 1]));

// --- rendering the text, as the game does ------------------------------------------
const baseAge = r => r <= 7 ? 23 + 3 * r : 44 + 2 * (r - 8);
const introduced = new Set();   // roles already introduced, in deck order (later cards give the tag)
const castRank = (cfg, r) => {
  if (cfg.track === "alongside") return r <= 7 ? r : 5;
  if (cfg.track === "below") return Math.max(0, Math.min(r, 7) - 1);
  if (cfg.track === "above") return Math.min(7, Math.min(r, 7) + 2);
  if (cfg.track === "political") return cfg.rank || 8;
  return 0;
};
// A state that meets the card's own requirements, at the grade it is placed at, for render().
function stateFor(ev, ctx) {
  const q = ev.requires || {};
  const rank = ctx.rank;
  let age = ctx.age !== undefined ? ctx.age : Math.max(baseAge(rank), (C.ladder[Math.min(rank, 7)] || {}).minAge || 0);
  if (q.minAge !== undefined) age = Math.max(age, q.minAge);
  if (q.maxAge !== undefined) age = Math.min(age, q.maxAge);
  const ids = C.origins.map(o => o.id);
  const origin = (q.origin && q.origin[0]) || ids.find(o => !(q.originNot || []).includes(o)) || ids[0];
  const s = {
    seed: 1, name: SAMPLE.player.name, gender: SAMPLE.player.gender, origin, age, year: 12, rank, yearsInGrade: 1,
    bondYears: q.duringBond ? 99 : 0, ministry: q.ministry || SAMPLE.ministry,
    reputation: 60, standing: 60, integrity: 60, competence: 60, wealth: 0, cep: 16, heat: 0, nbMonths: 3, appraisalMod: 0,
    flags: (q.flagsAll || []).slice(), seen: [], scheduled: [], history: [], recent: [], series: {}, exclusive: {}, habits: {},
    fillerSeen: {}, linesUsed: {}, cardsPlayed: 10, consecutiveD: q.warned ? 1 : 0, consecutiveC: 0
  };
  if (ctx.endKind) s.endKind = ctx.endKind;
  for (const [k, v] of Object.entries(q.minStats || {})) s[k] = Math.max(s[k], v);
  for (const [k, v] of Object.entries(q.maxStats || {})) s[k] = Math.min(s[k], v);
  s.cast = { on: {}, past: [], vacant: {}, gen: {}, n: 0 };
  for (const [role, cfg] of Object.entries(C.cast.roles)) {
    const want = (q.cast || {})[role];
    if (want === false || (want && want.vacant)) continue;
    const p = { id: ++s.cast.n, role, nm: PEOPLE[role].nm, pron: PEOPLE[role].pron, ageOff: 0, rank: castRank(cfg, rank),
      since: s.year - 3, rankYear: s.year, flags: ((want && want.flagsAll) || []).slice() };
    if (want && want.minRank !== undefined) p.rank = Math.max(p.rank, want.minRank);
    if (want && want.maxRank !== undefined) p.rank = Math.min(p.rank, want.maxRank);
    if (cfg.posts) p.post = cfg.posts[0];
    if (introduced.has(role)) { p.met = s.year; p.seenCard = -1; }
    s.cast.on[role] = p;
  }
  if (IS_RIVAL.has(ev.id) || q.rival) {
    const R = q.rival || {};
    const rr = R.ahead ? rank + 1 : R.minRank !== undefined && !R.sameRank ? Math.max(rank, R.minRank) : rank;
    s.rival = { name: RIVAL.name, pron: RIVAL.pron, rank: Math.min(16, rr), cep: 16, status: "active", rel: Math.max(0, R.relMin || 0),
      mod: 0, calls: 0, met: 0, wonMet: 0, ahead: 0, behind: 0, seenCard: -1 };
  }
  return s;
}
const slotsOf = ev => ev.parts ? E.partSlots(ev) : [];
const optKey = (o, k) => (o.id !== undefined ? String(o.id) : String(k));
// the first combination of part options that fits the sample state (else each slot's first)
function firstPick(ev, s) {
  if (!ev.parts) return null;
  const fit = E.partCombos(ev, s, 1)[0];
  return fit || Object.fromEntries(slotsOf(ev).map(([k, sl]) => [k, optKey(sl.options[0] || {}, 0)]));
}
const show = (ev, s, pick) => E.render(C, ev, s, { parts: pick });
// any string with the card's tokens and part options, filled as the card's text is
const fill = (ev, s, pick, text) => typeof text === "string"
  ? E.render(C, { id: ev.id, parts: ev.parts, title: text, body: "", choices: [] }, s, { parts: pick }).title : text;
// a series' second showing, as engine.sceneOf builds it for a habit (`stance`)
function againScene(ev, stance) {
  const sc = ev.again.scenes[stance], k = ev.choices.findIndex(c => c.stance === stance);
  const add = (a, b) => { const o = { ...(a || {}) }; for (const [x, v] of Object.entries(b || {})) { o[x] = (o[x] || 0) + v; if (!o[x]) delete o[x]; } return o; };
  return { ...ev, variant: "again:" + stance, keep: k, title: sc.title || ev.title, body: sc.body,
    choices: ev.choices.map((c, i) => ({ ...c, text: (sc.choices[i] || {}).text || c.text, outcome: (sc.choices[i] || {}).outcome || c.outcome,
      effects: add(c.effects, i === k ? ev.again.keep : ev.again.change) })) };
}
// One showing as data: title, body, choices in the order shown (own: the card's own index).
function asShown(ev, s, pick, version) {
  const out = show(version, s, pick);
  const said = Object.keys(out.saw || {}).filter(r => r !== "rival");
  return {
    title: out.title, body: out.body, said,
    choices: out.choices.map((c, i) => {
      const own = out.order ? out.order[i] : i;
      const src = ev.choices[own];
      return { own, letter: LETTERS[i], text: c.text, outcome: c.outcome, effects: c.effects || {},
        win: c.rival && c.rival.contest ? c.rival.contest.winText : null, lose: c.rival && c.rival.contest ? c.rival.contest.loseText : null,
        risk: src.nationalBonusRisk ? fill(ev, s, pick, src.nationalBonusRisk.outcome) : null, src };
    })
  };
}
const meet = roles => roles.forEach(r => introduced.add(r));

function renderCard(o) {
  const ev = o.ev;
  const ctx = isEndgame(ev) ? endContext(ev) : { rank: o.rank };
  let s = stateFor(ev, ctx);
  const pick = firstPick(ev, s);
  const main = asShown(ev, s, pick, ev);
  meet(main.said);
  const again = [];
  for (const stance of Object.keys((ev.again && ev.again.scenes) || {})) {
    if (ev.choices.findIndex(c => c.stance === stance) < 0) continue;
    s = stateFor(ev, ctx);
    const scene = asShown(ev, s, pick, againScene(ev, stance));
    meet(scene.said);
    again.push({ stance, habit: main.choices.find(c => c.own === ev.choices.findIndex(x => x.stance === stance)), scene });
  }
  const variants = [];
  for (let i = 1; i <= (ev.variants || []).length; i++) {
    s = stateFor(ev, ctx);
    const v = asShown(ev, s, pick, E.applyVariant(ev, i));
    meet(v.said);
    variants.push({ i, ...v });
  }
  // the card's parts: every option of every slot, filled; an option with no text of its own
  // (its words are fields the card's text uses) is shown as the whole card read with it
  s = stateFor(ev, ctx);
  const parts = slotsOf(ev).map(([slot, sl]) => ({
    slot, first: sl.pick === "first",
    options: sl.options.map((op, k) => {
      const id = optKey(op, k), chosen = pick && pick[slot] === id;
      const extra = Object.entries(op).filter(([f, v]) => typeof v === "string" && !["id", "text"].includes(f));
      const base = { id, chosen, requires: op.requires || null, effects: op.effects || null, scale: op.scale || null, prefer: !!op.prefer };
      if (typeof op.text === "string")
        return { ...base, text: fill(ev, s, { ...pick, [slot]: id }, op.text), extra: extra.map(([f, v]) => ({ field: f, text: fill(ev, s, { ...pick, [slot]: id }, v) })) };
      return { ...base, card: chosen ? null : asShown(ev, stateFor(ev, ctx), { ...pick, [slot]: id }, ev) };
    })
  }));
  // Meanwhile lines (the habit's years that pass by themselves) and a safe seat's lines
  const lines = [];
  const ml = ev.montageLines;
  if (Array.isArray(ml)) lines.push({ label: null, lines: ml.map(t => fill(ev, s, pick, t)) });
  else if (ml) for (const [k, list] of Object.entries(ml)) lines.push({ label: k, lines: list.map(t => fill(ev, s, pick, t)) });
  const auto = ev.autoPlay ? [].concat(ev.autoPlay.lines || (ev.autoPlay.line ? [ev.autoPlay.line] : []))
    .concat((ev.variants || []).map(v => v.autoPlayLine).filter(Boolean)).map(t => fill(ev, s, pick, t)) : [];
  return { ...o, n: NUM.get(ev.id), ctx, pick, main, again, variants, parts, lines, auto };
}
const CARDS = ORDER.map(renderCard);
const CARD = new Map(CARDS.map(c => [c.ev.id, c]));

// --- mechanics, in words ------------------------------------------------------------
const STAT = { competence: "Competence", standing: "Standing", reputation: "Reputation", integrity: "Integrity", heat: "Heat", wealth: "wealth" };
const sign = v => (v > 0 ? "+" : "−") + Math.abs(v);
const pct = x => `${Math.round(x * 100)}%`;
const money = n => "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");   // (no Intl: the same on every Node)
const NUMW = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const nw = n => NUMW[n] || String(n);
const years = n => n === 1 ? "a year" : `${nw(n)} years`;
const rankName = r => {
  const L = C.ladder[r];
  if (!L) return `rank ${r}`;
  return C.ladder.filter(x => x.title === L.title).length > 1 ? `${L.title} (${L.grade})` : L.title;
};
function rankRange(lo, hi) {
  if (lo === undefined && hi === undefined) return null;
  if (lo === undefined || lo === 0) return hi === undefined || hi >= 16 ? null : `up to ${rankName(hi)}`;
  if (hi === undefined || hi >= 16) return `${rankName(lo)} and up`;
  return lo === hi ? `${rankName(lo)} only` : `${rankName(lo)} to ${rankName(hi)}`;
}
function effectWords(fx) {
  const out = [];
  const size = v => { const a = Math.abs(v); return a <= 2 ? " a little" : a >= 6 ? " a lot" : ""; };
  for (const k of ["competence", "standing", "reputation", "integrity", "heat"]) {
    const v = fx[k];
    if (v) out.push(`${STAT[k]} ${v > 0 ? "up" : "down"}${size(v)} (${sign(v)})`);
  }
  if (fx.cep) out.push(`the ceiling (CEP) ${fx.cep > 0 ? "up" : "down"} ${Math.abs(fx.cep) === 1 ? "one grade" : `${nw(Math.abs(fx.cep))} grades`} (${sign(fx.cep)})`);
  if (fx.wealth) out.push(`wealth ${fx.wealth > 0 ? "+" : "−"}${money(Math.abs(fx.wealth))}`);
  if (fx.appraisal) out.push(`this year's appraisal ${fx.appraisal < 0 ? "marked down" : "marked up"} (${sign(fx.appraisal)}, said on screen)`);
  for (const [k, v] of Object.entries(fx)) if (!(k in STAT) && !["cep", "appraisal"].includes(k) && v) out.push(`${k} ${sign(v)}`);
  return out;
}
// Who sets each flag, on the player or on a cast member, and who reads it.
const SETS = new Map(), CAST_SETS = new Map(), READS = new Map();
const push = (m, k, v) => { if (!m.has(k)) m.set(k, []); m.get(k).push(v); };
for (const e of ALL) e.choices.forEach((ch, k) => {
  for (const f of ch.setFlags || []) push(SETS, f, { id: e.id, own: k });
  for (const [role, op] of Object.entries(ch.cast || {})) for (const f of op.flags || []) push(CAST_SETS, `${role}.${f}`, { id: e.id, own: k });
});
function walkReads(id, o, role) {
  if (!o || typeof o !== "object") return;
  for (const [k, v] of Object.entries(o)) {
    if ((k === "flagsAll" || k === "flagsNone") && Array.isArray(v)) v.forEach(f => push(READS, role ? `${role}.${f}` : f, id));
    else if (k === "cast" && v && typeof v === "object" && !Array.isArray(v)) for (const [r, q] of Object.entries(v)) walkReads(id, q, r);
    else if (typeof v === "object") walkReads(id, v, role);
  }
}
for (const e of ALL) { walkReads(e.id, e.requires); walkReads(e.id, e.parts); walkReads(e.id, e.witnesses); walkReads(e.id, e.exclusive); }
const FOLDER = new Set((C.folder || []).map(f => f.flag));
const LEGACY = new Set(C.legacyFlags || []);
const DECLASS = new Set([...(C.declassifiedFlags || []), ...((C.endgame || {}).declassifiedFlags || [])].flatMap(d => [].concat((d.requires || {}).flagsAll || [])));
// flags the engine sets itself
const ENGINE_FLAGS = {
  moved_ministry: "you have been moved to another ministry",
  noticed_swing: "your ward swung to you at a re-election (Reputation 75 or more), once a career",
  tea_withdrawn: "the party's invitation lapsed at the background check",
  exceptional: "two standout moments have marked your file exceptional",
  told_too_late: "you were told you were too near 70 to lead",
  told_pm_taken: "you were told the top job is someone else's"
};
const ENDINGS = new Map(C.endings.map(x => [x.id, x]));

// --- links ----------------------------------------------------------------------------------
// layout: { split, fileOf(n) -> path under docs/, endingsFile, stageFile(key) }. A link is relative
// to the file it is written in.
function relLink(from, to, anchor) {
  if (from === to) return `#${anchor}`;
  const rel = path.posix.relative(path.posix.dirname(from), to);
  return `${rel}#${anchor}`;
}
const esc = t => String(t).replace(/\\/g, "\\\\").replace(/([`*_[\]<>$~|])/g, "\\$1");
const escHtml = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const quoteBlock = t => String(t).split(/\n+/).map(p => `> ${esc(p)}`).join("\n>\n");

function makeView(view, layout) {
  const design = view === "design";
  const V = VIEWS[view];
  const cardLink = (from, id, label) => {
    const c = CARD.get(id);
    if (!c) return esc(label || id);
    return `[${esc(label || `${c.n}. ${c.main.title}`)}](${relLink(from, layout.fileOf(c.n), `c${c.n}`)})`;
  };
  const numLink = (from, id) => cardLink(from, id, `#${CARD.get(id) ? CARD.get(id).n : id}`);
  const endLink = (from, id) => `[${esc(ENDINGS.get(id).title)}](${relLink(from, layout.endingsFile, `end-${id}`)})`;
  const contentsLink = from => relLink(from, V.index, "contents");
  const lettersOf = (id, owns) => {
    const c = CARD.get(id);
    if (!c) return owns.map(k => LETTERS[k]).join(", ");
    return owns.map(k => (c.main.choices.find(x => x.own === k) || {}).letter || LETTERS[k]).join(", ");
  };
  // "[#12](…) B" per card; whole cards when every choice sets it; numbers only when there are many
  const settersText = (from, list, self) => {
    const byCard = new Map();
    for (const x of list) if (x.id !== self) push(byCard, x.id, x.own);
    const items = [...byCard.entries()].sort((a, b) => (NUM.get(a[0]) || 0) - (NUM.get(b[0]) || 0));
    const one = ([id, owns]) => {
      const all = owns.length >= BY_ID.get(id).choices.length;
      return items.length > 4 ? numLink(from, id) + (all ? "" : ` ${lettersOf(id, owns)}`) : `${cardLink(from, id)}${all ? " (any choice)" : `, ${lettersOf(id, owns)}`}`;
    };
    return (items.length > 4 ? "any of " : "") + items.map(one).join(items.length > 4 ? ", " : "; ");
  };
  const readersText = (from, key, self) => {
    const ids = [...new Set(READS.get(key) || [])].filter(id => id !== self).sort((a, b) => (NUM.get(a) || 0) - (NUM.get(b) || 0));
    return ids.map(id => numLink(from, id)).join(", ");
  };
  const flagWords = (from, f, not, self) => {
    const by = (SETS.get(f) || []).filter(x => x.id !== self);
    if (by.length) return `${not ? "not after" : "after"} ${settersText(from, by, self)} (\`${f}\`)`;
    if (ENGINE_FLAGS[f]) return `${not ? "not if" : "only if"} ${ENGINE_FLAGS[f]} (\`${f}\`)`;
    return `${not ? "without" : "with"} the flag \`${f}\``;
  };
  const castWords = (from, role, q, self) => {
    const who = `${ROLE_LABEL[role] || role} (${E.personField(C, { year: 12 }, role, { ...PEOPLE[role], rank: 0, since: 9, post: "" }, "")})`;
    if (q === false || (q && q.vacant)) return `no one in post as ${ROLE_LABEL[role] || role}`;
    const bits = [];
    for (const f of (q && q.flagsAll) || []) bits.push(CAST_SETS.has(`${role}.${f}`) ? `is the one from ${settersText(from, CAST_SETS.get(`${role}.${f}`), self)} (\`${f}\`)` : `carries \`${f}\``);
    for (const f of (q && q.flagsNone) || []) bits.push(CAST_SETS.has(`${role}.${f}`) ? `is not the one from ${settersText(from, CAST_SETS.get(`${role}.${f}`), self)} (\`${f}\`)` : `does not carry \`${f}\``);
    const rr = q ? rankRange(q.minRank, q.maxRank) : null;
    if (rr) bits.push(`is ${rr}`);
    if (q && q.minYears !== undefined) bits.push(`has been in the role ${years(q.minYears)} or more`);
    return bits.length ? `${who} ${bits.join(" and ")}` : `${who} in post`;
  };
  const ORIGIN = Object.fromEntries(C.origins.map(o => [o.id, o.name]));
  function requiresWords(from, q, self) {
    q = q || {};
    const out = [];
    const rr = rankRange(q.minRank, q.maxRank);
    if (rr) out.push(rr);
    if (q.act) out.push(q.act === "III" ? "in politics" : "in the service");
    if (q.minAge !== undefined && q.maxAge !== undefined) out.push(`aged ${q.minAge} to ${q.maxAge}`);
    else if (q.minAge !== undefined) out.push(`aged ${q.minAge} or more`);
    else if (q.maxAge !== undefined) out.push(`aged ${q.maxAge} or less`);
    if (q.origin) out.push(`${q.origin.map(o => ORIGIN[o] || o).join(" or ")} only`);
    if (q.originNot) out.push(`not for ${q.originNot.map(o => ORIGIN[o] || o).join(" or ")}`);
    if (q.ministry) out.push(`only in the ${q.ministry}`);
    for (const [k, v] of Object.entries(q.minStats || {})) out.push(`needs ${STAT[k] || k} of at least ${v}`);
    for (const [k, v] of Object.entries(q.maxStats || {})) out.push(`needs ${STAT[k] || k} of ${v} or less`);
    if (q.notDuringBond) out.push("not while the scholarship bond runs");
    if (q.duringBond) out.push("only while the scholarship bond runs");
    for (const f of q.flagsAll || []) out.push(flagWords(from, f, false, self));
    for (const f of q.flagsNone || []) out.push(flagWords(from, f, true, self));
    for (const [role, c] of Object.entries(q.cast || {})) out.push(castWords(from, role, c, self));
    if (q.economy) out.push(q.economy === "strong" ? "only in a strong economy" : "only in a downturn");
    if (q.electionDue !== undefined) out.push(q.electionDue ? "only when a general election is due within the year" : "not when a general election is due within the year");
    if (q.cooldown) out.push(`one card on the \`${q.cooldown.key}\` clock every ${nw(q.cooldown.years)} years`);
    if (q.warned !== undefined) out.push(q.warned ? "only on a formal warning (a D)" : "not on a formal warning");
    if (q.endKind) out.push(q.endKind === "election" ? "when the end is the renewal election" : q.endKind === "limit" ? "when the end is the age limit, 70" : "when the end is retirement");
    if (q.rival) {
      const R = q.rival, b = ["with an active batchmate"];
      if (R.sameRank) b.push("at your grade");
      if (R.ahead) b.push("a grade or more ahead of you");
      if (R.near !== undefined) b.push(`within ${R.near === 1 ? "one grade" : `${nw(R.near)} grades`} of you`);
      const br = rankRange(R.minRank, R.maxRank);
      if (br) b.push(`(the batchmate ${br})`);
      if (R.relMin !== undefined) b.push(`whose goodwill toward you is at least ${R.relMin}`);
      out.push(b.join(" "));
    }
    if (q.parts) for (const [slot, ids] of Object.entries(q.parts)) out.push(`when the part \`${slot}\` is ${ids.map(x => `\`${x}\``).join(" or ")}`);
    if (q.variants) out.push(q.variants.map(v => v === 0 ? "the main version" : `version ${v + 1}`).join(" or ") + " only");
    return out;
  }

  // the choices' links: the cards a choice can schedule (with their versions for other grades)
  // and the endings it can cause
  function endingsOf(ev, ch) {
    const out = [];
    if (ch.privateSector) out.push("consultancy");
    if (ch.election) out.push("lostward");
    if (ch.folder === "disclose") out.push("withdrawn");
    if ((ch.setFlags || []).includes("declined_tea")) out.push("declined");
    if (ch.pip && !ch.resetWarnings) out.push("quiet");
    if (((ch.effects || {}).heat || 0) >= 6) out.push("scandal");
    if (ev.id === EG.lastService) out.push("level", "permsec", "declined", "withdrawn");
    if (ev.id === EG.lastPolitics || ev.id === EG.renewal || (ev.id === EG.stay && ch.leaving)) out.push("backbench", "office", "retired");
    if (ev.endgame === "pm" && TENURE.length && TENURE.every(t => t[t.length - 1] === ev.id)) out.push("pm");
    return [...new Set(out)].filter(id => ENDINGS.has(id));
  }
  function leadsTo(from, ev, own) {
    const ch = ev.choices[own];
    const bits = [];
    for (const f of followUps(ch)) {
      const t = BY_ID.get(f.id);
      if (!t) continue;
      let txt = cardLink(from, f.id);
      if (design) {
        const when = f.folder ? "the year after" : f.inYears === 0 ? "on the next card" : `in ${years(f.inYears)}`;
        txt += `, ${when}${f.chance < 1 ? `, ${pct(f.chance)}` : ""}`;
        if (f.folder) txt += f.folder === "disclose" ? " (unless the Folder lapses the invitation)" : "";
      }
      const alts = (t.alternates || []).filter(a => CARD.has(a));
      if (alts.length) txt += ` (or, at another grade, ${alts.map(a => numLink(from, a)).join(", ")})`;
      bits.push(txt);
    }
    for (const id of endingsOf(ev, ch)) bits.push(endLink(from, id));
    return bits;
  }

  // --- one card ---
  function nav(from, n) {
    const bits = [];
    if (n > 1) bits.push(`[← ${n - 1}](${relLink(from, layout.fileOf(n - 1), `c${n - 1}`)})`);
    bits.push(n < CARDS.length ? `[Next → ${n + 1}](${relLink(from, layout.fileOf(n + 1), `c${n + 1}`)})`
      : `[Next → Endings](${relLink(from, layout.endingsFile, "endings")})`);
    bits.push(`[Contents](${contentsLink(from)})`);
    return bits.join(" · ");
  }
  function choiceBlock(from, ev, c, opts = {}) {
    const out = [`**${c.letter}. ${esc(c.text)}**`];
    if (c.src.requiresStat && !design) out[0] += " *(not every career is offered this one)*";
    out.push("", quoteBlock(c.outcome));
    if (c.win || c.lose) {
      out.push(">", `> *If you come out ahead:* ${esc(c.win || "")}`, ">", `> *If ${esc(RIVAL.name)} does:* ${esc(c.lose || "")}`);
    }
    if (c.risk) out.push(">", `> *If the plan misses:* ${esc(c.risk)}`);
    const lines = [];
    if (design && !opts.textOnly) {
      const fx = effectWords(c.effects);
      if (fx.length) lines.push(`Hidden: ${fx.join(", ")}.`);
      const ch = c.src;
      if (ch.requiresStat) lines.push(`Only offered with ${Object.entries(ch.requiresStat).map(([k, v]) => `${STAT[k] || k} of at least ${v}`).join(" and ")}; otherwise it is left off the card.`);
      if (ch.stance !== undefined) lines.push(`Habit: \`${ch.stance}\`.`);
      for (const f of ch.setFlags || []) {
        const where = [FOLDER.has(f) ? "in the Folder the background check reads" : null, LEGACY.has(f) ? "counts toward Legacy" : null,
          DECLASS.has(f) ? "named in the Declassified file" : null].filter(Boolean);
        const rd = readersText(from, f, ev.id);
        lines.push(`Sets \`${f}\`${where.length ? `: ${where.join("; ")}` : ""}${rd ? `${where.length ? ";" : ":"} read by ${rd}` : ""}.`);
      }
      for (const [role, op] of Object.entries(ch.cast || {})) {
        const b = [];
        for (const f of op.flags || []) { const rd = readersText(from, `${role}.${f}`, ev.id); b.push(`marks \`${f}\`${rd ? ` (read by ${rd})` : ""}`); }
        for (const f of op.unflags || []) b.push(`clears \`${f}\``);
        if (op.promote) b.push(`promoted ${op.promote === 1 ? "one grade" : `${nw(op.promote)} grades`} at once`);
        if (op.leave) b.push(`leaves the story (${op.leave === true ? "left" : op.leave})`);
        if (b.length) lines.push(`${ROLE_LABEL[role] ? ROLE_LABEL[role].charAt(0).toUpperCase() + ROLE_LABEL[role].slice(1) : role}, if this showing named them: ${b.join("; ")}.`);
      }
      if (ch.election === "incumbent") lines.push("Re-election: won with chance 0.72 + Reputation/250 (at most 98%); lost, the career ends.");
      else if (ch.election === "grc") lines.push("Election, in a GRC team: won with chance 0.60 + Reputation/400 + Standing/500. Won: Member of Parliament; lost: the career ends. Concealed Folder items may surface first.");
      else if (ch.election === "smc") lines.push("Election, in a single seat: won with chance 0.28 + Reputation/200. Won: Member of Parliament; lost: the career ends. Concealed Folder items may surface first.");
      if (ch.folder === "disclose") lines.push(`The Folder, disclosed: each item costs Standing 5 and gives Integrity 2; ${C.folderLimit || 3} or more items and the invitation lapses.`);
      if (ch.folder === "conceal") lines.push("The Folder, concealed: each item may surface in the campaign (20% + Heat/250), costing Reputation 7 and adding Heat 6.");
      if (ch.readFolder) lines.push("Reads out the Folder: the flags the background check would find.");
      if (ch.nationalBonus !== undefined) lines.push(`Sets next year's National Bonus at ${ch.nationalBonus} months${ch.nationalBonusRisk ? `; ${pct(ch.nationalBonusRisk.chance)} chance the plan misses, and it is ${ch.nationalBonusRisk.months}` : ""}.`);
      if (ch.newMinistry) lines.push(`Moves you to another ministry${Array.isArray(ch.newMinistry) ? ` (one of: ${ch.newMinistry.join("; ")})` : ""}; sets \`moved_ministry\`.`);
      if (ch.privateSector) lines.push("Leaves for the private sector: the career ends, with fees of twice the grade's pay for each year to retirement (3 to 10 years), after tax.");
      if (ch.pip) lines.push(ch.resetWarnings ? "Closes the improvement plan, and clears the warnings: a fresh start." : "Closes the improvement plan: another D now ends the career.");
      else if (ch.resetWarnings) lines.push("Clears the warnings.");
      if (ch.bond) lines.push(`Adds ${years(ch.bond)} to the scholarship bond.`);
      if (ch.lasting) lines.push(`A lasting mark: this year's appraisal and the next ones, ${years(ch.lasting.years)} in all, ${ch.lasting.appraisal < 0 ? "marked down" : "marked up"} (${sign(ch.lasting.appraisal)} each, never said on screen); it lapses on the other ladder.`);
      if (ch.standout) lines.push("A standout moment (in the service; two mark the file exceptional).");
      if (ch.leaving) lines.push("Leaves at the coming election: the career ends there.");
      if (ch.markSeen) lines.push(`Marks ${ch.markSeen.map(id => numLink(from, id)).join(", ")} as already seen.`);
      if (ch.rival) {
        const r = ch.rival, b = [];
        if (r.rel) b.push(`goodwill ${sign(r.rel)}`);
        if (r.mod) b.push(`their next score ${sign(r.mod)}`);
        if (r.cep) b.push(`their ceiling ${sign(r.cep)}`);
        if (r.contest) {
          const k = r.contest;
          b.push(`a head-to-head now${k.bonus ? ` (you ${sign(k.bonus)})` : ""}: won, ${effectWords(k.win || {}).join(", ") || "nothing"}; lost, ${effectWords(k.lose || {}).join(", ") || "nothing"}`);
        }
        if (b.length) lines.push(`Batchmate: ${b.join("; ")}.`);
      }
    }
    if (!opts.noLinks) {
      const to = leadsTo(from, ev, c.own);
      if (to.length) lines.push(`↳ Can lead to: ${to.join(" · ")}`);
    }
    if (lines.length) out.push("", design ? lines.map(l => `- ${l}`).join("\n") : lines.join("\n"));
    return out.join("\n");
  }
  function showingBlock(from, ev, sh, opts = {}) {
    const out = [];
    if (opts.title) out.push(`**${esc(sh.title)}**`, "");
    out.push(esc(sh.body));
    for (const c of sh.choices) out.push("", choiceBlock(from, ev, c, opts));
    return out.join("\n");
  }
  const details = (summary, body) => `<details><summary>${escHtml(summary)}</summary>\n\n${body}\n\n</details>`;

  function whoSees(from, c) {
    const ev = c.ev, q = ev.requires || {};
    const out = [];
    if (c.opening) out.push(`the first card of every ${c.opening.name} career`);
    if (isEndgame(ev)) {
      const E2 = C.endgame || {};
      if (ev.id === EG.lastService) out.push(`drawn by the engine: the last year in the service, the year before the retirement age (${C.retireAge})`);
      else if (ev.id === EG.renewal) out.push(`drawn by the engine: the year before the first general election after you turn ${E2.renewalAge || 65}; the party asks you not to stand`);
      else if (ev.id === EG.stay) out.push(`drawn by the engine instead of ${numLink(from, EG.renewal)}, for ${requiresWords(from, E2.stayOn).join(", ")}: the party asks you to stay on`);
      else if (ev.id === EG.lastPolitics) out.push(`drawn by the engine: the last year in politics (the year of the renewal election, or the year before ${C.politicalRetireAge})`);
      else if (ev.endgame === "pm") {
        const at = TENURE.map(t => `${t.length}-year tenure: year ${t.indexOf(ev.id) + 1}`).filter(x => !/year 0$/.test(x));
        out.push(`drawn by the engine in a Prime Minister's tenure (${at.join("; ")}; the tenure is as long as fits before ${C.politicalRetireAge})`);
      }
    } else if (alternateOf.has(ev.id)) {
      out.push(`fires instead of ${cardLink(from, alternateOf.get(ev.id))} when that card falls due and this one's conditions hold (the first version that fits)`);
    } else if (ev.triggered) {
      const by = [];
      for (const e of ALL) e.choices.forEach((ch, k) => {
        for (const f of followUps(ch)) if (f.id === ev.id) by.push({ id: e.id, own: k, f });
      });
      if (by.length) {
        const byCard = new Map();
        for (const x of by) push(byCard, x.id, x);
        const items = [...byCard.entries()].sort((a, b) => NUM.get(a[0]) - NUM.get(b[0])).map(([id, xs]) => {
          // choices that schedule it the same way share one entry
          const ways = new Map();
          for (const x of xs) push(ways, `${x.f.folder ? "the year after" : x.f.inYears === 0 ? "on the next card" : `in ${years(x.f.inYears)}`}${x.f.chance < 1 ? `, ${pct(x.f.chance)}` : ""}`, x.own);
          const how = [...ways.entries()].map(([w, owns]) => `${owns.length >= BY_ID.get(id).choices.length ? "any choice" : lettersOf(id, owns)}: ${w}`);
          return `${cardLink(from, id)} (${how.join("; ")})`;
        });
        out.push(`only as a follow-up to ${items.join("; ")}`);
      } else if (ev.id === "improvement_plan") out.push("only as a follow-up: the year-end review books it for the year after a first D (a formal warning)");
      else out.push("only as a follow-up");
    }
    const rq = requiresWords(from, q, ev.id);
    if (rq.length) out.push((ev.triggered && !isEndgame(ev) ? "when it falls due: " : "") + rq.join("; "));
    else if (!ev.triggered && !c.opening) out.push("any grade");
    if (IS_RIVAL.has(ev.id) && !q.rival) out.push("only with the batchmate on");
    const lc = ((C.endgame || {}).lastCalls || {})[ev.id];
    if (lc !== undefined) out.push(`not in the service's last ${nw(lc)} years before ${C.retireAge}`);
    return out;
  }
  function designNotes(from, c) {
    const ev = c.ev, out = [];
    out.push(`\`${ev.id}\` · ${packFile(ev)}`);
    const kind = [];
    if (ev.once) kind.push("once a career");
    else if (!ev.triggered) kind.push("can come back");
    if (!ev.triggered && !isEndgame(ev)) kind.push(`weight ${ev.weight === undefined ? 5 : ev.weight}`);
    if (ev.priority === "first") kind.push("opens a chapter: comes before anything scheduled");
    else if (ev.priority) kind.push("priority: drawn the moment it qualifies");
    if (ev.standout) kind.push("a standout moment, whichever choice (in the service)");
    if (ev.cooldown) kind.push(`starts the \`${ev.cooldown}\` clock`);
    if (kind.length) out[0] += ` · ${kind.join(" · ")}`;
    const lines = [`**Who sees it:** ${whoSees(from, c).join("; ")}.`];
    if (ev.series) {
      const S = ev.series, same = ALL.filter(e => e.series && e.series.key === S.key && e.id !== ev.id);
      const full = S.full >= 99 ? "always shown in full" : S.full === 1 ? "shown in full once a career, then its years pass by themselves on the habit" : `shown in full ${nw(S.full) === "two" ? "twice" : `${nw(S.full)} times`} a career (the second time asking whether to keep the habit), then its years pass by themselves on the habit`;
      lines.push(`**Series** \`${S.key}\`${same.length ? ` with ${same.map(e => numLink(from, e.id)).join(", ")}` : ""}: ${full}${S.opens ? "; this card opens it" : ""}${S.spend ? "; a card whose Meanwhile lines are spent is not drawn again" : ""}.`);
    }
    for (const g of [].concat(ev.exclusive || [])) {
      const name = typeof g === "string" ? g : g.group;
      const others = ALL.filter(e => e.id !== ev.id && [].concat(e.exclusive || []).some(x => (typeof x === "string" ? x : x.group) === name));
      const when = typeof g === "string" ? "" : ` (${requiresWords(from, g.requires, ev.id).join("; ")})`;
      lines.push(`**Shares a decision** (\`${name}\`)${when} with ${others.map(e => numLink(from, e.id)).join(", ") || "no other card yet"}: a career sees only one.`);
    }
    if (ev.replaces) lines.push(`**Whichever choice:** ${ev.replaces.map(r => ROLE_LABEL[r] || r).join(", ")} leaves the story, and a new one arrives.`);
    if (ev.autoPlay) lines.push(`**Passes by itself** (choice ${LETTERS[ev.autoPlay.choice || 0]}, with a Meanwhile line) when ${requiresWords(from, ev.autoPlay.when).join(", ") || "always"}.`);
    if (ev.again) lines.push(`**The second showing** (folded below): keeping the habit adds ${effectWords(ev.again.keep || {}).join(", ") || "nothing"}; breaking it adds ${effectWords(ev.again.change || {}).join(", ") || "nothing"}.`);
    if (ev.montageEffects) lines.push(`**A Meanwhile year with no habit:** ${effectWords(ev.montageEffects).join(", ")}.`);
    return [out.join(""), "", lines.join("\n\n")].join("\n");
  }
  function witnessBlock(from, c) {
    const by = (c.ev.witnesses || {}).by;
    if (!by) return null;
    const T = (C.witnesses || {}).types || {};
    const own = k => (c.main.choices.find(x => x.own === k) || {}).letter || LETTERS[k];
    const rows = Object.entries(by).map(([type, w]) => {
      const t = T[type] || {};
      const who = String(t.about || type).split(/[:.]/)[0];
      const n = c.ev.choices.length;
      const per = (x, k) => (Array.isArray(x) ? x[k] : x) || 0;
      const chance = Array.isArray(w.chance) ? w.chance.map((x, k) => `${own(k)} ${pct(x)}`).join(", ") : pct(w.chance || 0);
      const reacts = [];
      for (let k = 0; k < n; k++) {
        const v = per(w.react, k), cp = per(w.cep, k);
        if (v) reacts.push(`${own(k)} ${v > 0 ? "helps" : "hurts"} (${sign(v)})`);
        if (cp) reacts.push(`${own(k)} raises the ceiling ${cp === 1 ? "a grade" : `${nw(cp)} grades`}`);
      }
      reacts.sort();
      const rq = w.requires ? requiresWords(from, w.requires, c.ev.id) : [];
      return `- ${esc(who)} (${t.ladder === "politics" ? "politics" : "service"}, \`${type}\`), ${chance}${rq.length ? `, ${rq.join("; ")}` : ""}: ${reacts.join(" · ") || "doesn't mind either way"}.`;
    });
    const [d0, d1] = (C.witnesses || {}).delay || [1, 3];
    return `**Who might notice** (unseen; one who notices moves one appraisal ${d0} to ${d1} years later):\n\n${rows.join("\n")}`;
  }
  function partsBlock(from, c) {
    if (!c.parts.length) return null;
    const out = [design ? "Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields)."
      : "Each time the card is shown, it is put together from one option of each part. The text above is one of them. Under an option, the words it brings to the rest of the card."];
    c.parts.forEach((p, i) => {
      out.push("", `**Part ${i + 1}**${design ? ` · \`${p.slot}\`${p.first ? " (the first option that fits)" : ""}` : ""}`, "");
      for (const op of p.options) {
        const notes = [];
        if (design) {
          if (op.requires) notes.push(`when ${requiresWords(from, op.requires, c.ev.id).join("; ")}`);
          if (op.prefer) notes.push("preferred");
          for (const [k, fx] of Object.entries(op.effects || {})) notes.push(`${k === "*" ? "every choice" : `choice ${LETTERS[+k]}`}: ${effectWords(fx).join(", ")}`);
          for (const [k, f] of Object.entries(op.scale || {})) notes.push(`${STAT[k] || k} ×${f}`);
          notes.unshift(`\`${op.id}\``);
        }
        if (op.chosen) notes.push("shown above");
        const tail = notes.length ? ` *(${notes.join("; ")})*` : "";
        if (op.text !== undefined) {
          out.push(`- ${esc(op.text) || "*(nothing)*"}${tail}`);
          for (const x of op.extra || []) out.push(`  - ${design ? `\`${x.field}\`: ` : ""}${esc(x.text)}`);
        } else if (op.card) {
          out.push(`- *Read with this option${design ? ` (${notes.join("; ")})` : ""}:*`, "", showingBlock(from, c.ev, op.card, { title: true, textOnly: true, noLinks: true }).split("\n").map(l => (l ? `  ${l}` : l)).join("\n"), "");
        } else out.push(`- *The text above.*${design ? ` *(${notes.filter(x => x !== "shown above").join("; ")})*` : ""}`);
      }
    });
    return details(`This card varies (${c.parts.length} part${c.parts.length === 1 ? "" : "s"})`, out.join("\n"));
  }
  function againBlock(from, c) {
    if (!c.again.length) return null;
    const out = [design ? "The series' second full showing, written per habit: the habit is the first choice, and the answer stands for the rest of the career."
      : "The second time this comes round, it is written for the habit you have formed, which is the first choice. It is the last time you are asked."];
    for (const a of c.again) {
      out.push("", "---", "", `*If your habit so far is “${esc(a.habit ? a.habit.text : a.stance)}”${design ? ` (\`${a.stance}\`)` : ""}:*`, "", showingBlock(from, c.ev, a.scene, { title: true }));
    }
    return details(`When it comes back (${c.again.length} scene${c.again.length === 1 ? "" : "s"})`, out.join("\n"));
  }
  function variantsBlock(from, c) {
    if (!c.variants.length) return null;
    const out = ["The same choices, with the same consequences, in another scene. A career is shown one of them."];
    for (const v of c.variants) {
      out.push("", "---", "", `*Version ${v.i + 1}${v.title !== c.main.title ? `: ${esc(v.title)}` : ""}*`, "", showingBlock(from, c.ev, v, { textOnly: true, noLinks: true }));
    }
    return details(`Other versions (${c.variants.length})`, out.join("\n"));
  }
  function linesBlock(c) {
    const groups = c.lines.slice();
    if (c.auto.length) groups.push({ label: "a safe seat", lines: c.auto });
    if (!groups.length) return null;
    const total = groups.reduce((n, g) => n + g.lines.length, 0);
    const habit = st => { const k = c.ev.choices.findIndex(x => x.stance === st || String(c.ev.choices.indexOf(x)) === st); return k >= 0 ? `${(c.main.choices.find(x => x.own === k) || {}).letter || LETTERS[k]}, \`${st}\`` : `\`${st}\``; };
    const out = ["A year that passes by itself on the habit shows one line, never the same one twice in a career."];
    for (const g of groups) {
      out.push("", g.label ? `**${g.label === "a safe seat" ? "When the seat is safe" : `Habit ${habit(g.label)}`}**` : "**Every habit**", "");
      out.push(g.lines.map(l => `- ${esc(l)}`).join("\n"));
    }
    return details(`Meanwhile lines (${total})`, out.join("\n"));
  }
  function cardBlock(from, c) {
    const out = [`### <a id="c${c.n}"></a>${c.n}. ${esc(c.main.title)}`, "", nav(from, c.n), ""];
    if (IS_RIVAL.has(c.ev.id)) out.push("*Only with the batchmate on.*", "");
    if (c.opening && !design) out.push(`*The first card of every ${esc(c.opening.name)} career.*`, "");
    if (design) out.push(designNotes(from, c), "");
    out.push(esc(c.main.body));
    for (const ch of c.main.choices) out.push("", choiceBlock(from, c.ev, ch));
    for (const b of [design ? witnessBlock(from, c) : null, againBlock(from, c), variantsBlock(from, c), partsBlock(from, c), design ? linesBlock(c) : null])
      if (b) out.push("", b);
    out.push("", nav(from, c.n));
    return out.join("\n");
  }

  // --- the endings ---
  const ENDING_HOW = {
    pm: ["Reach the top: promoted from Deputy Prime Minister. The career ends after your time as Prime Minister.",
      "Promotion from Deputy Prime Minister needs an A, the years in grade, a ceiling (CEP) of 16, room for a tenure before 70, and not having put someone else in the job. The tenure's cards follow (three or four years), and the career ends after the last."],
    permsec: ["Retire from the service as Permanent Secretary.", "Retirement (the last year at 63) at Permanent Secretary."],
    level: ["Retire from the service below Permanent Secretary, never having gone into politics.", "Retirement (the last year at 63) at Deputy Secretary or below, without the tea's flags."],
    declined: ["Decline the party's invitation at the tea, then retire from the service.", "Retirement with `declined_tea` set (the tea's second choice)."],
    lostward: ["Lose an election: your first, or a later one.", "The first election lost (a GRC: 0.60 + Reputation/400 + Standing/500; a single seat: 0.28 + Reputation/200), or a re-election lost (0.72 + Reputation/250, at most 98%; a safe seat passes by itself and is never lost)."],
    scandal: ["Too much of what you kept quiet comes out at once.", "Heat of 85 or more at any year-end review. Every choice that adds Heat moves toward it; the choices listed here add 6 or more."],
    quiet: ["Two D grades in a row, after an improvement plan or the Whip's word.", "A second D in a row once the improvement plan (or the Whip's word) has been played and the probation is over (after year four and the sixth card)."],
    backbench: ["Leave Parliament without ever holding office.", "The political career ends (the renewal election after 65, or the year before 70) as a Member of Parliament."],
    office: ["Leave Parliament as a Parliamentary Secretary or Minister of State, never a full Minister.", "The political career ends as Parliamentary Secretary to Senior Minister of State."],
    retired: ["Leave Parliament as a Minister or Deputy Prime Minister.", "The political career ends as a Minister (MR4) or higher, below Prime Minister."],
    consultancy: ["Take a headhunter's offer and leave for the private sector.", "A choice that leaves for the private sector ends the career at once, with the fees."],
    withdrawn: ["Disclose too much at the background check: the invitation lapses, and you retire from the service.", `Disclosing ${C.folderLimit || 3} or more Folder items at the background check sets \`tea_withdrawn\`; the career ends at retirement.`]
  };
  function endingsBlock(from) {
    const lead = new Map();
    for (const c of CARDS) c.ev.choices.forEach((ch, k) => { for (const id of endingsOf(c.ev, ch)) push(lead, id, { id: c.ev.id, own: k }); });
    const s = stateFor({ id: "__end", requires: {} }, { rank: 8 });
    const out = [`## <a id="endings"></a>Endings`, "", STAGES.find(x => x.key === "endings").about, ""];
    for (const e of C.endings) {
      const shown = E.ending(C, { ...s, ending: e.id });
      out.push(`### <a id="end-${e.id}"></a>${esc(shown.title)}`, "", quoteBlock(shown.epitaph), "");
      const how = ENDING_HOW[e.id];
      if (how) out.push(`**How it happens:** ${design ? how[1] : esc(how[0])}`, "");
      const list = lead.get(e.id) || [];
      if (list.length) out.push(`**Choices that lead here:** ${settersText(from, list)}`, "");
    }
    out.push(`[Contents](${contentsLink(from)})`);
    return out.join("\n");
  }

  // --- the files ---
  function stageHead(from, st, part) {
    const cards = CARDS.filter(c => c.stage === st.key);
    const range = cards.length ? `Cards ${cards[0].n} to ${cards[cards.length - 1].n}.` : "";
    return [`## <a id="stage-${st.key}"></a>${st.title}${part ? ` (part ${part})` : ""}`, "", `${st.about} ${range}`.trim()].join("\n");
  }
  function intro() {
    const p = ME, cast = Object.keys(C.cast.roles).map(r => `${ROLE_LABEL[r] || r}, ${E.personField(C, { year: 12 }, r, { ...PEOPLE[r], rank: 0, since: 9, post: "" }, "")}`);
    const lines = [
      `# ${V.title}`, "",
      design
        ? `Every card in Minister Salary, with the mechanics: who sees each card, what each choice does to the hidden numbers, the follow-ups it can schedule and their chances, who might notice, the decisions cards share, series and Meanwhile lines. The text is exactly as in [the player's view](${VIEWS.player.index}).`
        : `Every card in Minister Salary, as a player reads it, with every choice and what follows it. [The designer's view](${VIEWS.design.index}) has the same cards with the mechanics.`,
      "",
      "Cards are numbered by when a career can first meet them: each start's first card, then by grade, from Management Executive to Prime Minister, then the batchmate's cards and a career's last years, then the endings. Read it as a career: start at card 1 and follow **Next →**, or jump from a choice to what it can lead to. A follow-up card comes right after the first card that can lead to it, so a story reads in order.",
      "",
      `One sample career throughout: you are ${esc(p.name)} (${esc(p.given)} to colleagues, ${esc(p.formal)} to officials, ${esc(p.full)} on the record), in the ${esc(SAMPLE.ministry)}. The people around you are ${cast.map(esc).join("; ")}; and the batchmate is ${esc(RIVAL.name)}. A real career draws its own names. Each person is introduced the first time they appear, as the game does.`,
      "",
      "Under a card, folded: the scenes it has when it comes back, its other versions, and the parts it is put together from.",
      "",
      `*Generated from \`web/content/\` by \`node tools/deck.js\`. Do not edit by hand: change the content and run it again.*`
    ];
    return lines.join("\n");
  }
  function contents(from) {
    const out = [`## <a id="contents"></a>Contents`, ""];
    for (const st of STAGES) {
      if (st.key === "endings") { out.push(`- [Endings](${relLink(from, layout.endingsFile, "endings")}): ${C.endings.length} endings`); continue; }
      const cards = CARDS.filter(c => c.stage === st.key);
      if (!cards.length) continue;
      out.push(`- [${st.title}](${relLink(from, layout.fileOf(cards[0].n), `c${cards[0].n}`)}): cards ${cards[0].n} to ${cards[cards.length - 1].n} (${cards.length})`);
    }
    out.push("");
    for (const st of STAGES) {
      const cards = CARDS.filter(c => c.stage === st.key);
      if (!cards.length) continue;
      out.push(details(`${st.title}: every card`, cards.map(c => `- ${cardLink(from, c.ev.id)}`).join("\n")), "");
    }
    return out.join("\n");
  }
  const files = {};
  if (!layout.split) {
    const f = V.index, parts = [intro(), contents(f)];
    for (const st of STAGES) {
      if (st.key === "endings") { parts.push(endingsBlock(f)); continue; }
      const cards = CARDS.filter(c => c.stage === st.key);
      if (!cards.length) continue;
      parts.push(stageHead(f, st), ...cards.map(c => cardBlock(f, c)));
    }
    files[f] = parts.join("\n\n") + "\n";
  } else {
    files[V.index] = [intro(), contents(V.index)].join("\n\n") + "\n";
    for (const ch of layout.chapters) {
      const f = ch.file, st = STAGES.find(x => x.key === ch.stage);
      const i = layout.chapters.indexOf(ch), prev = layout.chapters[i - 1], next = layout.chapters[i + 1];
      const top = [`[Contents](${contentsLink(f)})`];
      if (prev) top.unshift(`[← ${prev.label}](${relLink(f, prev.file, prev.anchor)})`);
      if (next) top.push(`[${next.label} →](${relLink(f, next.file, next.anchor)})`);
      const head = [`# ${V.title}: ${st.title}${ch.part ? ` (part ${ch.part})` : ""}`, "", top.join(" · ")];
      const body = ch.stage === "endings" ? [endingsBlock(f)] : [stageHead(f, st, ch.part), ...ch.cards.map(n => cardBlock(f, CARDS[n - 1]))];
      files[f] = [head.join("\n"), ...body, top.join(" · ")].join("\n\n") + "\n";
    }
  }
  return files;
}
const VIEWS = {
  player: { index: "DECK.md", dir: "deck", title: "The deck" },
  design: { index: "DECK-DESIGN.md", dir: "deck-design", title: "The deck, with the mechanics" }
};

// --- layout: one page, or chapters -------------------------------------------------------
function singleLayout(view) {
  const f = VIEWS[view].index;
  return { split: false, fileOf: () => f, endingsFile: f };
}
// chapters: one per stage, and a stage too big for one page in parts of about `size` bytes
function chapterLayout(view, sizes) {
  const dir = VIEWS[view].dir, chapters = [], fileOfN = new Map();
  for (const st of STAGES) {
    if (st.key === "endings") { chapters.push({ stage: st.key, file: `${dir}/${st.file}`, label: st.title, anchor: "endings", cards: [] }); continue; }
    const cards = CARDS.filter(c => c.stage === st.key).map(c => c.n);
    if (!cards.length) continue;
    const total = cards.reduce((n, k) => n + ((sizes && sizes.get(k)) || 0), 0);
    const parts = total > LIMIT * 0.9 ? Math.ceil(total / (LIMIT * 0.8)) : 1;
    let cur = [], acc = 0;
    const groups = [];
    for (const k of cards) {
      const sz = (sizes && sizes.get(k)) || 0;
      if (parts > 1 && cur.length && acc + sz > total / parts && groups.length < parts - 1) { groups.push(cur); cur = []; acc = 0; }
      cur.push(k); acc += sz;
    }
    groups.push(cur);
    groups.forEach((g, i) => {
      const file = `${dir}/${groups.length > 1 ? st.file.replace(/\.md$/, `-${i + 1}.md`) : st.file}`;
      chapters.push({ stage: st.key, part: groups.length > 1 ? i + 1 : 0, file, label: `${st.title}${groups.length > 1 ? ` (${i + 1})` : ""}`, anchor: `c${g[0]}`, cards: g });
      for (const k of g) fileOfN.set(k, file);
    });
  }
  const endingsFile = chapters.find(c => c.stage === "endings").file;
  return { split: true, chapters, fileOf: n => fileOfN.get(n), endingsFile };
}
function renderView(view) {
  // one page if it fits; otherwise chapters, measured once and then balanced by card size
  let files = makeView(view, singleLayout(view));
  const size = Object.values(files).reduce((n, t) => n + Buffer.byteLength(t), 0);
  if (size <= LIMIT) return files;
  const one = files[VIEWS[view].index];
  const sizes = new Map();
  for (const c of CARDS) {
    const m = one.indexOf(`<a id="c${c.n}"></a>`), next = c.n < CARDS.length ? one.indexOf(`<a id="c${c.n + 1}"></a>`) : one.indexOf(`<a id="endings"></a>`);
    sizes.set(c.n, Math.max(0, next - m));
  }
  files = makeView(view, chapterLayout(view, sizes));
  return files;
}

// --- checks ------------------------------------------------------------------------------
function checkView(view, files) {
  const problems = [];
  const anchors = new Map();
  for (const [f, t] of Object.entries(files)) {
    const set = new Set();
    for (const m of t.matchAll(/<a id="([^"]+)"><\/a>/g)) {
      if (set.has(m[1])) problems.push(`${f}: anchor #${m[1]} twice`);
      set.add(m[1]);
    }
    anchors.set(f, set);
  }
  // every link to a page of the view (or the other view) goes to an anchor that exists
  for (const [f, t] of Object.entries(files)) {
    for (const m of t.matchAll(/\]\(([^)\s]*)\)/g)) {
      const href = m[1];
      if (/^[a-z]+:/i.test(href)) continue;
      const [p, a] = href.split("#");
      const target = p ? path.posix.normalize(path.posix.join(path.posix.dirname(f), p)) : f;
      const known = anchors.get(target);
      if (!known) {
        const other = Object.values(VIEWS).some(v => v.index === target);
        if (!other) problems.push(`${f}: link to a file that is not in the deck: ${href}`);
        continue;
      }
      if (a && !known.has(a)) problems.push(`${f}: link to a missing anchor: ${href}`);
    }
    // no raw token, and nothing a broken template leaves behind
    for (const m of t.matchAll(/\{[A-Za-z]+(?:\.[A-Za-z]+)?\}/g)) problems.push(`${f}: raw token ${m[0]}`);
    for (const bad of ["undefined", "[object Object]", "NaN"]) if (t.includes(bad)) problems.push(`${f}: "${bad}" in the text`);
  }
  // every card in the content appears exactly once, as one numbered anchor
  const where = new Map();
  for (const [f, set] of anchors) for (const a of set) if (/^c\d+$/.test(a)) {
    if (where.has(a)) problems.push(`card anchor #${a} in ${where.get(a)} and ${f}`);
    where.set(a, f);
  }
  for (const ev of ALL) {
    const n = NUM.get(ev.id);
    if (!n) problems.push(`card ${ev.id} is not in the deck`);
    else if (!where.has(`c${n}`)) problems.push(`card ${ev.id} (#${n}) has no anchor`);
  }
  if (NUM.size !== ALL.length || ORDER.length !== ALL.length) problems.push(`the deck has ${ORDER.length} cards; the content has ${ALL.length}`);
  // every follow-up a choice can schedule is linked from that card
  for (const c of CARDS) {
    const f = Object.keys(files).find(k => anchors.get(k).has(`c${c.n}`));
    const t = files[f], from = t.indexOf(`<a id="c${c.n}"></a>`);
    const next = t.indexOf(`<a id="c${c.n + 1}"></a>`), to = next > from ? next : t.length;
    const block = t.slice(from, to);
    for (const id of targetsOf(c.ev)) if (!block.includes(`#c${NUM.get(id)})`)) problems.push(`#${c.n} ${c.ev.id}: its follow-up ${id} is not linked`);
  }
  // GitHub stops rendering pages that are too big
  for (const [f, t] of Object.entries(files)) if (Buffer.byteLength(t) > LIMIT) problems.push(`${f} is ${Buffer.byteLength(t)} bytes, over ${LIMIT}`);
  return problems;
}

// --- main ------------------------------------------------------------------------------
const out = {};
let problems = [];
for (const view of Object.keys(VIEWS)) {
  const files = renderView(view);
  problems = problems.concat(checkView(view, files).map(p => `${view}: ${p}`));
  Object.assign(out, files);
}
// the files the deck owns: both indexes, and every .md in the chapter folders
const owned = () => {
  const list = Object.values(VIEWS).map(v => v.index);
  for (const v of Object.values(VIEWS)) {
    const d = path.join(DOCS, v.dir);
    if (fs.existsSync(d)) for (const f of fs.readdirSync(d)) if (f.endsWith(".md")) list.push(`${v.dir}/${f}`);
  }
  return list;
};
if (CHECK) {
  for (const [f, t] of Object.entries(out)) {
    const p = path.join(DOCS, f);
    if (!fs.existsSync(p)) problems.push(`docs/${f} is missing`);
    else if (fs.readFileSync(p, "utf8") !== t) problems.push(`docs/${f} is stale`);
  }
  for (const f of owned()) if (!(f in out) && fs.existsSync(path.join(DOCS, f))) problems.push(`docs/${f} is no longer part of the deck`);
  if (problems.length) {
    for (const p of problems.slice(0, 40)) console.log(`✗ ${p}`);
    if (problems.length > 40) console.log(`  ...and ${problems.length - 40} more`);
    console.log("Run `node tools/deck.js` to regenerate the deck.");
    process.exit(1);
  }
  console.log(`✓ deck: ${CARDS.length} cards, ${C.endings.length} endings, ${Object.keys(out).length} files, current`);
} else {
  if (problems.length) {
    for (const p of problems.slice(0, 40)) console.log(`✗ ${p}`);
    process.exit(1);
  }
  for (const f of owned()) if (!(f in out)) fs.unlinkSync(path.join(DOCS, f));
  for (const [f, t] of Object.entries(out)) {
    const p = path.join(DOCS, f);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, t);
  }
  for (const v of Object.values(VIEWS)) {
    const d = path.join(DOCS, v.dir);
    if (fs.existsSync(d) && !fs.readdirSync(d).length) fs.rmdirSync(d);
  }
  const by = STAGES.filter(s => s.key !== "endings").map(s => `${s.title} ${CARDS.filter(c => c.stage === s.key).length}`).join(", ");
  console.log(`deck: ${CARDS.length} cards (${by}), ${C.endings.length} endings`);
  for (const [f, t] of Object.entries(out)) console.log(`  docs/${f}  ${(Buffer.byteLength(t) / 1024).toFixed(0)} KB`);
}
