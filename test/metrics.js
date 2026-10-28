// Fun proxies a bot can count, so LLM agents are never spent on them.
// Fed one harness trace at a time (traces are large; nothing is kept per turn).
//
// Each metric answers one of the brief's criteria:
//   deadTurns        every year gives something worth reading
//   statDirection    every stat pushed both ways
//   dominance        no obviously dominant choice
//   reach            content actually reaches players
//   earlyLoss        losable early only through choices (open question 3)
//   cepSafeguard     a CEP-raising event stays reachable once you hit the ceiling
//   consequences     callbacks actually land
//   origins          balance invariant: scholar > grad > poly
const STATS = ["reputation", "standing", "integrity", "competence"];
const ALL_FX = [...STATS, "wealth", "heat", "cep"];
const ORIGINS = ["scholar", "grad", "poly"];

const isReal = e => !e.canary;
const pct = (n, d) => d ? +(100 * n / d).toFixed(1) : null;

// Wilson score interval, 95%.
function wilson(k, n) {
  if (!n) return [0, 0];
  const z = 1.96, p = k / n, d = 1 + z * z / n;
  const c = (p + z * z / (2 * n)) / d, h = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d;
  return [+(100 * Math.max(0, c - h)).toFixed(1), +(100 * Math.min(1, c + h)).toFixed(1)];
}

// Two-proportion z statistic for "a > b".
function zDiff(ka, na, kb, nb) {
  const p = (ka + kb) / (na + nb);
  const se = Math.sqrt(p * (1 - p) * (1 / na + 1 / nb));
  return se ? (ka / na - kb / nb) / se : 0;
}

function quantile(sorted, q) { return sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))] : null; }

// --- metrics that come from the content alone ----------------------------

function staticStatDirection(content) {
  const out = {};
  for (const k of ALL_FX) out[k] = { up: 0, down: 0 };
  for (const e of content.events.filter(isReal)) for (const c of e.choices)
    for (const k of ALL_FX) { const v = (c.effects || {})[k] || 0; if (v > 0) out[k].up++; if (v < 0) out[k].down++; }
  return out;
}

// y dominates x when y is at least as good on every stat (lower Heat is better), strictly
// better on one, and no harder to unlock. Hidden consequences on x (a scheduled event, a
// flag, an election) may still justify it, so they are listed rather than excused.
function dominatedChoices(content) {
  const better = (fy, fx) => {
    let strict = false;
    for (const k of ALL_FX) {
      const a = (fy[k] || 0) * (k === "heat" ? -1 : 1), b = (fx[k] || 0) * (k === "heat" ? -1 : 1);
      if (a < b) return false;
      if (a > b) strict = true;
    }
    return strict;
  };
  const noHarder = (y, x) => Object.entries(y.requiresStat || {}).every(([k, v]) => ((x.requiresStat || {})[k] || 0) >= v);
  const out = [];
  for (const e of content.events.filter(isReal)) e.choices.forEach((x, i) => e.choices.forEach((y, j) => {
    if (i === j || x.election || y.election) return;
    if (better(y.effects || {}, x.effects || {}) && noHarder(y, x)) {
      const hidden = [x.schedule && "schedule", x.setFlags && "flags", x.setRank !== undefined && "setRank"].filter(Boolean);
      out.push({ event: e.id, dominated: "ABCD"[i], by: "ABCD"[j], text: x.text, hiddenConsequences: hidden });
    }
  }));
  return out;
}

function cepRaisingEvents(content) {
  return content.events.filter(e => isReal(e) && e.choices.some(c => ((c.effects || {}).cep || 0) > 0)).map(e => e.id);
}

function validateContent(content) {
  const errors = [], ev = content.events, ids = ev.map(e => e.id);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) errors.push("duplicate event ids: " + dup);
  const missing = [...new Set(ev.flatMap(e => e.choices.flatMap(c => (c.schedule || []).map(s => s.eventId))))].filter(x => !ids.includes(x));
  if (missing.length) errors.push("schedule targets missing: " + missing);
  for (const e of ev) {
    if (!e.choices || !e.choices.length) errors.push(e.id + ": no choices");
    else for (const c of e.choices) if (!c.text || !c.outcome) errors.push(e.id + ": choice missing text/outcome");
  }
  if (content.ladder.length !== 17) errors.push("ladder must have 17 rungs");
  return errors;
}

// --- the accumulator -----------------------------------------------------

class Metrics {
  constructor(content) {
    this.content = content;
    this.cepEvents = new Set(cepRaisingEvents(content));
    this.triggered = content.events.filter(e => e.triggered).map(e => e.id);
    this.bots = {};
  }

  bot(name) {
    if (this.bots[name]) return this.bots[name];
    const per = {};
    for (const o of ORIGINS) per[o] = { runs: 0, endings: {}, wealth: [], turns: [], earlyLoss: { n: 0, kinds: {} },
      cep: { ceilingRuns: 0, reachableAfter: 0, shownAfter: 0, takenAfter: 0, everReachable: 0, everShown: 0 } };
    return (this.bots[name] = {
      per, acts: { I: z(), II: z(), III: z() },
      picks: {},           // event -> choice -> count
      shownRuns: {},       // event -> runs it appeared in
      observedDir: Object.fromEntries(ALL_FX.map(k => [k, { up: 0, down: 0, flat: 0 }])),
      consequences: {},    // event -> { scheduled, fired, late, lateYears, dropped, pending }
      runs: 0
    });
    function z() { return { turns: 0, quiet: 0, repeat: 0, repeatFiller: 0, dead: 0 }; }
  }

  // extra.cepReachable: turns at which a CEP-raising event was eligible or scheduled
  add(botName, tr, extra = {}) {
    const b = this.bot(botName), o = b.per[tr.origin];
    b.runs++; o.runs++;
    const end = tr.ending || "UNTERMINATED";
    o.endings[end] = (o.endings[end] || 0) + 1;
    o.wealth.push(tr.final.wealth);
    o.turns.push(tr.turns.length);

    const seen = new Set();
    let ceilingTurn = null, shownAfter = false, takenAfter = false;
    for (const t of tr.turns) {
      // dead turns
      const a = b.acts[t.act];
      a.turns++;
      const quiet = t.event.id === "__quiet";
      const visibleChange = STATS.some(k => t.delta[k]);
      if (quiet) a.quiet++;
      if (t.event.repeat) a.repeat++;
      if (t.event.repeat && t.event.filler) a.repeatFiller++;
      if (quiet || (t.event.repeat && t.event.filler && !visibleChange)) a.dead++;

      // reach + picks
      if (!quiet) {
        seen.add(t.event.id);
        const p = b.picks[t.event.id] || (b.picks[t.event.id] = {});
        p[t.choice.id] = (p[t.choice.id] || 0) + 1;
        p._shown = (p._shown || 0) + 1;
        p._contested = (p._contested || 0) + (t.choice.available.length > 1 ? 1 : 0);
      }
      // observed stat direction of what was chosen
      for (const k of ALL_FX) {
        const v = t.choice.effects[k] || 0;
        b.observedDir[k][v > 0 ? "up" : v < 0 ? "down" : "flat"]++;
      }
      // consequences
      for (const s of t.scheduled) this.cons(b, s.eventId).scheduled++;
      if (t.event.source === "scheduled") {
        const c = this.cons(b, t.event.fired ? t.event.fired.eventId : t.event.id);   // alternates count as their card
        c.fired++;
        if (t.event.late) { c.late++; c.lateYears += t.event.late; }
      }
      for (const d of t.event.dropped) this.cons(b, d.eventId).dropped++;
      // CEP safeguard
      if (this.cepEvents.has(t.event.id) && ceilingTurn !== null) {
        shownAfter = true;
        const pickedCep = (t.choice.effects.cep || 0) > 0;
        if (pickedCep) takenAfter = true;
      }
      if (t.promotion && t.promotion.result === "cep_ceiling" && ceilingTurn === null) ceilingTurn = t.turn;
    }
    for (const s of tr.final.pendingScheduled) this.cons(b, s.eventId).pending++;
    for (const id of seen) b.shownRuns[id] = (b.shownRuns[id] || 0) + 1;

    const reach = extra.cepReachable || [];
    if (reach.length) o.cep.everReachable++;
    if (tr.turns.some(t => this.cepEvents.has(t.event.id))) o.cep.everShown++;
    if (ceilingTurn !== null) {
      o.cep.ceilingRuns++;
      if (reach.some(turn => turn > ceilingTurn)) o.cep.reachableAfter++;
      if (shownAfter) o.cep.shownAfter++;
      if (takenAfter) o.cep.takenAfter++;
    }

    // early loss: a loss before age 40
    if (["quiet", "scandal", "lostward"].includes(tr.ending) && tr.final.age < 40) {
      o.earlyLoss.n++;
      const k = tr.endingCause.kind;
      o.earlyLoss.kinds[k] = (o.earlyLoss.kinds[k] || 0) + 1;
    }
  }

  cons(b, id) { return b.consequences[id] || (b.consequences[id] = { scheduled: 0, fired: 0, late: 0, lateYears: 0, dropped: 0, pending: 0 }); }

  result() {
    const content = this.content, out = { bots: {} };
    const realEvents = content.events.filter(e => isReal(e));
    for (const [name, b] of Object.entries(this.bots)) {
      const r = out.bots[name] = { runs: b.runs, origins: {}, deadTurns: {}, consequences: {}, observedDirection: {}, optimiserPicks: [] };
      for (const o of ORIGINS) {
        const x = b.per[o];
        if (!x.runs) continue;
        const pm = x.endings.pm || 0;
        const w = [...x.wealth].sort((a, c) => a - c), tu = [...x.turns].sort((a, c) => a - c);
        r.origins[o] = {
          runs: x.runs, pmRate: pct(pm, x.runs), pmCI: wilson(pm, x.runs), pm,
          endings: x.endings, medianWealth: quantile(w, 0.5),
          turns: { p10: quantile(tu, 0.1), median: quantile(tu, 0.5), p90: quantile(tu, 0.9), inRange35to50: pct(tu.filter(t => t >= 35 && t <= 50).length, tu.length) },
          earlyLoss: { rate: pct(x.earlyLoss.n, x.runs), n: x.earlyLoss.n, byCause: x.earlyLoss.kinds,
                       notByChoice: pct((x.earlyLoss.kinds.luck || 0) + (x.earlyLoss.kinds.drift || 0), x.earlyLoss.n) },
          cepSafeguard: { ...x.cep,
            everReachableRate: pct(x.cep.everReachable, x.runs),
            reachableAfterCeilingRate: pct(x.cep.reachableAfter, x.cep.ceilingRuns),
            shownAfterCeilingRate: pct(x.cep.shownAfter, x.cep.ceilingRuns),
            takenAfterCeilingRate: pct(x.cep.takenAfter, x.cep.ceilingRuns) }
        };
      }
      for (const [act, a] of Object.entries(b.acts)) {
        r.deadTurns[act] = { turnsPerRun: +(a.turns / b.runs).toFixed(2), deadPerRun: +(a.dead / b.runs).toFixed(2),
          quietShare: pct(a.quiet, a.turns), repeatShare: pct(a.repeat, a.turns), repeatFillerShare: pct(a.repeatFiller, a.turns), deadShare: pct(a.dead, a.turns) };
      }
      for (const k of ALL_FX) {
        const d = b.observedDir[k], n = d.up + d.down;
        r.observedDirection[k] = { upShare: pct(d.up, n), downShare: pct(d.down, n), moved: n };
      }
      // scheduled = fired + pendingAtEnd (the run ended first) + dropped (must stay 0).
      // late: fired after its year because another consequence fell due first.
      for (const [id, c] of Object.entries(b.consequences)) {
        r.consequences[id] = { scheduled: c.scheduled, fired: c.fired, firedLate: c.late,
          meanYearsLate: c.late ? +(c.lateYears / c.late).toFixed(2) : 0, dropped: c.dropped, pendingAtEnd: c.pending,
          fireRate: pct(c.fired, c.scheduled), triggered: this.triggered.includes(id) };
      }
      for (const [id, p] of Object.entries(b.picks)) {
        if ((p._contested || 0) < 20) continue;
        const [top, n] = Object.entries(p).filter(([k]) => !k.startsWith("_")).sort((a, c) => c[1] - a[1])[0];
        r.optimiserPicks.push({ event: id, choice: top, share: pct(n, p._shown), shown: p._shown });
      }
      r.reach = {};
      for (const e of realEvents) r.reach[e.id] = pct(b.shownRuns[e.id] || 0, b.runs);
      r.choicePicks = Object.fromEntries(Object.entries(b.picks).map(([id, p]) =>
        [id, Object.fromEntries(Object.entries(p).filter(([k]) => !k.startsWith("_")))]));
    }

    // across all bots
    const allRuns = Object.values(this.bots).reduce((n, b) => n + b.runs, 0);
    const shownAll = {};
    for (const b of Object.values(this.bots)) for (const [id, n] of Object.entries(b.shownRuns)) shownAll[id] = (shownAll[id] || 0) + n;
    const neverPicked = [];
    for (const e of realEvents) e.choices.forEach((c, i) => {
      const n = Object.values(this.bots).reduce((s, b) => s + ((b.picks[e.id] || {})["ABCD"[i]] || 0), 0);
      if (!n && shownAll[e.id]) neverPicked.push(`${e.id}:${"ABCD"[i]}`);
    });
    out.reach = {
      runs: allRuns,
      neverSeen: realEvents.filter(e => !shownAll[e.id]).map(e => e.id),
      rare: realEvents.filter(e => shownAll[e.id] && shownAll[e.id] / allRuns < 0.01).map(e => ({ event: e.id, runShare: pct(shownAll[e.id], allRuns) })),
      neverPickedChoices: neverPicked
    };

    // statDirection: the content's own balance, then what bots actually did
    const st = staticStatDirection(content);
    out.statDirection = Object.fromEntries(ALL_FX.map(k => {
      const n = st[k].up + st[k].down;
      return [k, { up: st[k].up, down: st[k].down, downShare: pct(st[k].down, n), oneDirectional: n > 0 && Math.min(st[k].up, st[k].down) / n < 0.2 }];
    }));

    // dominance: from the data. The optimising bots are deterministic, so their >90% picks
    // (bots.*.optimiserPicks) say more about the scoring function than the content; the
    // first-timer's picks show which choices people actually avoid only when locked.
    out.dominance = { dominated: dominatedChoices(content),
      optimiserOver90: ((out.bots["stat-optimiser"] || {}).optimiserPicks || []).filter(p => p.share > 90).length };

    out.cepRaisingEvents = [...this.cepEvents];
    return out;
  }
}

// --- the regression rule ------------------------------------------------------
// Rejects a change before any agent sees it. The stat-optimiser's grad-above-scholar
// result is accepted, per the brief, so only first-timer and win-seeking play are checked.
const RANDOM_PM_MAX = 15;   // % of first-timer runs. "Rare by accident": today's worst is ~9%.

function regress(m, content) {
  const fails = [], warns = [];
  for (const e of validateContent(content)) fails.push("content: " + e);
  for (const bot of ["first-timer", "knows the win"]) {
    const r = m.bots[bot];
    if (!r) continue;
    for (const [hi, lo] of [["scholar", "grad"], ["grad", "poly"]]) {
      const a = r.origins[hi], b = r.origins[lo];
      if (b.pm <= a.pm) continue;
      const z = zDiff(b.pm, b.runs, a.pm, a.runs);
      const msg = `${bot}: ${lo} PM ${b.pmRate}% ${b.pmCI.join("-")} > ${hi} ${a.pmRate}% ${a.pmCI.join("-")} (z=${z.toFixed(2)})`;
      (z > 1.96 ? fails : warns).push("origin order inverted: " + msg);
    }
  }
  const ft = m.bots["first-timer"];
  if (ft) for (const o of ORIGINS) if (ft.origins[o] && ft.origins[o].pmRate > RANDOM_PM_MAX)
    fails.push(`PM is common for first-timer ${o}: ${ft.origins[o].pmRate}% (max ${RANDOM_PM_MAX}%)`);
  for (const [bot, r] of Object.entries(m.bots)) for (const [o, x] of Object.entries(r.origins))
    if (x.endings.UNTERMINATED) fails.push(`${bot} ${o}: ${x.endings.UNTERMINATED} runs never ended`);
  for (const [bot, r] of Object.entries(m.bots)) for (const [id, c] of Object.entries(r.consequences))
    if (c.dropped) fails.push(`${bot}: ${c.dropped} ${id} consequences were scheduled and silently dropped`);
  return { pass: !fails.length, fails, warns };
}

// Numeric leaves as dotted keys, for comparing a proposal against its prediction.
function flatten(o, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(o)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "number") out[key] = v;
    else if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
  }
  return out;
}

module.exports = { Metrics, regress, flatten, validateContent, cepRaisingEvents, dominatedChoices, wilson, ORIGINS, RANDOM_PM_MAX };
