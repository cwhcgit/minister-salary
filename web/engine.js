// Pure game rules. No DOM, no I/O, no globals beyond this object.
// Mirrors :engine in docs/DESIGN.md — port target for Kotlin.

const Engine = (() => {

  // --- seeded RNG so a run is replayable from its seed -----------------
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const STATS = ["reputation", "standing", "integrity", "competence"];

  function newGame(content, originId, name, seed) {
    const origin = content.origins.find(o => o.id === originId);
    const r = rng(seed);
    return {
      seed, name, origin: origin.id,
      age: origin.startAge,
      year: 1,
      rank: origin.startRank,
      yearsInGrade: 0,
      bondYears: origin.bondYears || 0,
      ministry: content.ministries[Math.floor(r() * content.ministries.length)],
      reputation: origin.stats.reputation,
      standing: origin.stats.standing,
      integrity: origin.stats.integrity,
      competence: origin.stats.competence,
      wealth: 0,
      cep: origin.cep[0] + Math.floor(r() * (origin.cep[1] - origin.cep[0] + 1)),
      heat: 0,
      flags: [],
      seen: [],
      scheduled: [],     // { eventId, fireYear }
      consecutiveC: 0,
      consecutiveD: 0,
      rngCalls: 0,
      ending: null,
      currentEvent: null
    };
  }

  // Deterministic: derive the stream position from state so saves resume identically.
  function roll(s) {
    const r = rng(s.seed + s.rngCalls * 7919);
    s.rngCalls++;
    return r();
  }

  // --- event selection -------------------------------------------------
  function eligible(ev, s) {
    if (ev.triggered) return false;
    if (ev.once && s.seen.includes(ev.id)) return false;
    const q = ev.requires || {};
    if (q.minRank !== undefined && s.rank < q.minRank) return false;
    if (q.maxRank !== undefined && s.rank > q.maxRank) return false;
    if (q.minAge !== undefined && s.age < q.minAge) return false;
    if (q.maxAge !== undefined && s.age > q.maxAge) return false;
    if (q.originNot && q.originNot.includes(s.origin)) return false;
    if (q.origin && !q.origin.includes(s.origin)) return false;
    if (q.notDuringBond && s.year <= s.bondYears) return false;
    if (q.flagsAll && !q.flagsAll.every(f => s.flags.includes(f))) return false;
    if (q.flagsNone && q.flagsNone.some(f => s.flags.includes(f))) return false;
    for (const k in (q.minStats || {})) if (s[k] < q.minStats[k]) return false;
    for (const k in (q.maxStats || {})) if (s[k] > q.maxStats[k]) return false;
    return true;
  }

  function pickEvent(content, s) {
    // 1. scheduled consequences pre-empt everything
    const due = s.scheduled.filter(x => x.fireYear <= s.year);
    if (due.length) {
      s.scheduled = s.scheduled.filter(x => x.fireYear > s.year);
      const ev = content.events.find(e => e.id === due[0].eventId);
      if (ev) return ev;
    }
    const pool = content.events.filter(e => eligible(e, s));
    if (!pool.length) return null;
    // 2. priority events (tea session, succession) fire the moment they qualify
    const pri = pool.filter(e => e.priority);
    if (pri.length) return pri[0];
    // 3. weighted random
    const total = pool.reduce((n, e) => n + (e.weight || 5), 0);
    let x = roll(s) * total;
    for (const e of pool) { x -= (e.weight || 5); if (x <= 0) return e; }
    return pool[pool.length - 1];
  }

  function choiceAvailable(ch, s) {
    for (const k in (ch.requiresStat || {})) if (s[k] < ch.requiresStat[k]) return false;
    return true;
  }

  // --- applying a choice ----------------------------------------------
  function applyChoice(content, s, ev, ch) {
    const log = [];
    const fx = ch.effects || {};
    for (const k of STATS) if (fx[k]) s[k] = clamp(s[k] + fx[k], 0, 100);
    if (fx.wealth) s.wealth += fx.wealth;
    if (fx.heat) s.heat = clamp(s.heat + fx.heat, 0, 100);
    if (fx.cep) s.cep = clamp(s.cep + fx.cep, 0, 16);

    (ch.setFlags || []).forEach(f => { if (!s.flags.includes(f)) s.flags.push(f); });
    (ch.clearFlags || []).forEach(f => { s.flags = s.flags.filter(x => x !== f); });
    if (ev.once && !s.seen.includes(ev.id)) s.seen.push(ev.id);

    for (const sc of (ch.schedule || [])) {
      if (roll(s) <= (sc.chance === undefined ? 1 : sc.chance)) {
        s.scheduled.push({ eventId: sc.eventId, fireYear: s.year + sc.inYears });
      }
    }
    if (ch.setRank !== undefined) s.rank = ch.setRank;

    if (ch.election) {
      const chance = ch.election === "grc"
        ? 0.60 + s.reputation / 400 + s.standing / 500
        : 0.28 + s.reputation / 200;
      if (roll(s) < chance) {
        s.rank = 8;
        s.yearsInGrade = 0;
        s.cep = clamp(8 + Math.floor((s.standing + s.reputation) / 28), 8, 15);
        log.push(ch.election === "smc"
          ? "You win the seat with 53.1%. It is yours, and everyone knows it is yours."
          : "The team takes the GRC with 61.4%. You are a Member of Parliament.");
      } else {
        s.ending = "lostward";
      }
    }
    return log;
  }

  // --- year end --------------------------------------------------------
  function rank(content, s) { return content.ladder[s.rank]; }

  function payout(content, s) {
    const base = rank(content, s).pay;
    const perf = base * (0.10 + (s.competence / 100) * 0.35);
    const national = s.rank >= 13 ? base * (s.reputation / 100) * 0.30 : 0;
    const total = Math.round((base + perf + national) * 0.82); // after tax + CPF, roughly
    s.wealth += total;
    return total;
  }

  function appraise(content, s) {
    const noise = (roll(s) * 20) - 10;
    const score = 0.50 * s.competence + 0.30 * s.standing + 0.15 * s.reputation + noise;
    return { grade: content.grades.find(g => score >= g.min), score };
  }

  function yearEnd(content, s) {
    const log = [];
    const pay = payout(content, s);
    log.push({ kind: "pay", text: `Annual package: $${pay.toLocaleString()}` });

    s.yearsInGrade++;
    const { grade, score } = appraise(content, s);
    log.push({ kind: "appraisal", text: grade.label });

    if (grade.code === "C") s.consecutiveC++; else s.consecutiveC = 0;
    if (grade.code === "D") s.consecutiveD++; else s.consecutiveD = 0;
    if (s.consecutiveD >= 2) { s.ending = "quiet"; return log; }
    if (s.consecutiveD === 1) log.push({ kind: "warn", text: "Your reporting officer asks whether you have considered the private sector. It is phrased as concern." });
    if (s.consecutiveC >= 3) {
      s.consecutiveC = 0;
      s.competence = clamp(s.competence + 3, 0, 100);
      log.push({ kind: "warn", text: "You are transferred sideways to a division nobody asked to join. The work is real, at least." });
    }

    // Senior rungs cost time as well as stats: Cabinet does not turn over quickly,
    // and the last two steps are never given on "strong" alone.
    const needYears = content.minYearsInGrade
      + (s.rank >= 10 ? 1 : 0) + (s.rank >= 13 ? 1 : 0) + (s.rank >= 15 ? 1 : 0);
    const topRungs = s.rank >= 13;
    const promotable = (grade.code === "A" || (grade.code === "B+" && !topRungs))
      && s.yearsInGrade >= needYears
      && s.rank < 16;

    if (promotable && s.rank >= s.cep) {
      log.push({ kind: "cep", text: content.cepHints[Math.floor(roll(s) * content.cepHints.length)] });
    } else if (promotable && s.rank === 7) {
      log.push({ kind: "cep", text: "There is no rung above this one. The next step is not a promotion; it is a different life." });
    } else if (promotable) {
      // A standout junior officer occasionally skips a grade. This is the only way
      // a late starter ever makes up the years a scholar was simply given.
      const doubleJump = grade.code === "A" && s.rank <= 4 && score >= 84 && s.rank + 1 < s.cep;
      s.rank += doubleJump ? 2 : 1;
      s.yearsInGrade = 0;
      const r = rank(content, s);
      log.push({ kind: "promo", text: doubleJump
        ? `Promoted two grades: ${r.title} (${r.grade}). This does not normally happen.`
        : `Promoted: ${r.title} (${r.grade})` });
      if (s.rank === 16) { s.ending = "pm"; return log; }
    }

    if (s.heat >= 85) { s.ending = "scandal"; return log; }
    if (s.heat >= 55) log.push({ kind: "heat", text: "A journalist has been asking around about something old." });

    s.age++; s.year++;
    const retireAt = s.rank >= 8 ? content.politicalRetireAge : content.retireAge;
    if (s.age >= retireAt) s.ending = retirementEnding(s);
    return log;
  }

  function retirementEnding(s) {
    if (s.flags.includes("declined_tea")) return "declined";
    if (s.rank >= 13) return "retired";
    if (s.rank === 7) return "permsec";
    if (s.rank >= 8) return "backbench";
    return "level";
  }

  // Safety net: the pool must never be empty, or a run dies of silence.
  const QUIET_YEAR = { id: "__quiet", title: "A Year Passes", body: "Nothing of consequence happens. This is, statistically, most years.",
    choices: [{ text: "Carry on.", effects: { competence: 1 }, outcome: "You carry on." }] };

  // --- public turn API --------------------------------------------------
  // advance(content, state, choiceIndex) -> { state, outcome, log }
  function advance(content, state, choiceIndex) {
    const s = JSON.parse(JSON.stringify(state));   // immutable in, new state out
    const ev = s.currentEvent === "__quiet" ? QUIET_YEAR : content.events.find(e => e.id === s.currentEvent);
    const ch = ev.choices[choiceIndex];
    const log = applyChoice(content, s, ev, ch);
    if (!s.ending) log.push(...yearEnd(content, s));
    s.currentEvent = null;
    return { state: s, outcome: ch.outcome, log };
  }

  function nextEvent(content, state) {
    const s = JSON.parse(JSON.stringify(state));
    const ev = pickEvent(content, s);
    if (!ev) { s.currentEvent = "__quiet"; return { state: s, event: QUIET_YEAR }; }
    s.currentEvent = ev.id;
    return { state: s, event: ev };
  }

  return { newGame, advance, nextEvent, choiceAvailable, rank, STATS, QUIET: QUIET_YEAR };
})();

if (typeof module !== "undefined") module.exports = Engine;
