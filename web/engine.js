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
    const g = {
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
      cepStart: null,    // set below; Declassified reads it back at the end
      heat: 0,
      nbMonths: 3,       // National Bonus months, set each year by the minister's own policy choice
      appraisalMod: 0,   // one-year hit from a choice that was "noted"
      fillerSeen: {},    // repeatable events already played in full, for montage years
      habits: {},        // the choice made on each of them, which montage years repeat
      history: [],       // one entry per year, for the Declassified screen
      flags: [],
      seen: [],
      scheduled: [],     // { eventId, fireYear }
      consecutiveC: 0,
      consecutiveD: 0,
      rngCalls: 0,
      ending: null,
      currentEvent: null
    };
    g.cepStart = g.cep;
    return g;
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
    // 1. scheduled consequences pre-empt everything. One fires a year; when several fall
    //    due together, the rest carry over to the following years, earliest first.
    const due = s.scheduled.filter(x => x.fireYear <= s.year);
    if (due.length) {
      const next = due.reduce((a, b) => (b.fireYear < a.fireYear ? b : a));
      s.scheduled.splice(s.scheduled.indexOf(next), 1);
      const ev = content.events.find(e => e.id === next.eventId);
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

  // --- the Folder ------------------------------------------------------
  // content.folder lists the flags a vetting would find, each as a noun phrase.
  const cap = x => x.charAt(0).toUpperCase() + x.slice(1);
  function folderItems(content, s) {
    return (content.folder || []).filter(f => s.flags.includes(f.flag)).map(f => f.item);
  }

  function readFolder(content, s) {
    const items = folderItems(content, s);
    if (!items.length) return [{ kind: "folder", text: "The folder on the table is thin. He seems, very slightly, disappointed." }];
    return items.map(i => ({ kind: "folder", text: `In the folder: ${i}.` }));
  }

  function answerFolder(content, s, mode, t) {
    const items = folderItems(content, s), log = [];
    t.folder = { mode, items: items.length };
    if (mode === "disclose") {
      if (!items.length) log.push({ kind: "folder", text: "There is nothing to disclose. He closes the folder, which takes no time at all." });
      for (const i of items) {
        s.standing = clamp(s.standing - 5, 0, 100);
        s.integrity = clamp(s.integrity + 2, 0, 100);
        log.push({ kind: "folder", text: `You disclose ${i}. He writes something down.` });
      }
      if (items.length >= (content.folderLimit || 3)) {
        s.flags.push("tea_withdrawn");
        t.folder.withdrawn = true;
        log.push({ kind: "warn", text: "Nobody tells you the invitation has lapsed. The next email simply never comes." });
        return log;
      }
    } else {
      s.concealed = items;   // each one may surface during the campaign
    }
    s.scheduled.push({ eventId: "the_election", fireYear: s.year + 1 });
    return log;
  }

  // Concealed items surface during the campaign, more often the higher the Heat.
  function campaignSurfacing(s, t) {
    const log = [];
    for (const i of (s.concealed || [])) {
      if (roll(s) < 0.2 + s.heat / 250) {
        s.reputation = clamp(s.reputation - 7, 0, 100);
        s.heat = clamp(s.heat + 6, 0, 100);
        log.push({ kind: "folder", text: `${cap(i)}: on day four of the campaign, someone has found it.` });
      }
    }
    t.surfaced = log.length;
    s.concealed = [];
    return log;
  }

  // --- applying a choice ----------------------------------------------
  function applyChoice(content, s, ev, ch, t = {}) {
    const log = [];
    const fx = ch.effects || {};
    for (const k of STATS) if (fx[k]) s[k] = clamp(s[k] + fx[k], 0, 100);
    if (fx.wealth) s.wealth += fx.wealth;
    if (fx.heat) s.heat = clamp(s.heat + fx.heat, 0, 100);
    if (fx.cep) s.cep = clamp(s.cep + fx.cep, 0, 16);
    // "It is noted": a choice that embarrassed someone senior costs this year's appraisal.
    if (fx.appraisal) s.appraisalMod += fx.appraisal;
    // The minister's own policy choice sets next year's National Bonus, in months (0-6).
    if (ch.nationalBonus !== undefined) s.nbMonths = clamp(ch.nationalBonus, 0, 6);

    (ch.setFlags || []).forEach(f => { if (!s.flags.includes(f)) s.flags.push(f); });
    (ch.clearFlags || []).forEach(f => { s.flags = s.flags.filter(x => x !== f); });
    if (ev.once && !s.seen.includes(ev.id)) s.seen.push(ev.id);

    for (const sc of (ch.schedule || [])) {
      if (roll(s) <= (sc.chance === undefined ? 1 : sc.chance)) {
        s.scheduled.push({ eventId: sc.eventId, fireYear: s.year + sc.inYears });
      }
    }
    if (ch.setRank !== undefined) s.rank = ch.setRank;

    // The Folder: the vetting reads back every compromise the player made.
    if (ch.readFolder) log.push(...readFolder(content, s));
    if (ch.folder) log.push(...answerFolder(content, s, ch.folder, t));

    // The headhunter: leave for the private sector. Ends the run with a lump sum.
    if (ch.privateSector) {
      const years = Math.max(3, Math.min(10, content.retireAge - s.age));
      const fees = Math.round(rank(content, s).pay * 2 * years * 0.82);
      s.wealth += fees;
      t.privateSector = { years, fees };
      log.push({ kind: "pay", text: `Signing package and ${years} years of fees, after tax: $${fees.toLocaleString()}` });
      s.ending = "consultancy";
    }

    if (ch.election === "incumbent") {
      // Re-election every five years. Ministers anchor safe teams; Reputation is what keeps them safe.
      const chance = Math.min(0.98, 0.72 + s.reputation / 250);
      const won = roll(s) < chance;
      t.election = { kind: "incumbent", chance, won };
      if (won && s.reputation >= 75 && !s.flags.includes("noticed_swing")) {
        // A strong personal vote is the one thing the party cannot estimate in advance. Once per career.
        s.cep = clamp(s.cep + 1, 0, 16);
        s.flags.push("noticed_swing");
        t.election.noticed = true;
        log.push({ kind: "promo", text: "Your ward swings towards you by six points, the best result in the region. Someone in the party notices, and writes it down." });
      } else if (won) {
        const lines = content.reElectionLines || ["The team is returned."];
        s.reElections = (s.reElections || 0) + 1;
        log.push({ kind: "promo", text: lines[(s.reElections - 1) % lines.length] });
      }
      else s.ending = "lostward";
    } else if (ch.election) {
      log.push(...campaignSurfacing(s, t));
      const chance = ch.election === "grc"
        ? 0.60 + s.reputation / 400 + s.standing / 500
        : 0.28 + s.reputation / 200;
      const won = roll(s) < chance;
      t.election = { kind: ch.election, chance, won };
      if (won) {
        s.rank = 8;
        s.yearsInGrade = 0;
        s.cep = clamp(8 + Math.floor((s.standing + s.reputation) / 28), 8, 15);
        log.push({ kind: "promo", text: ch.election === "smc"
          ? "You win the seat with 53.1%. It is yours, and everyone knows it is yours."
          : "The team takes the GRC with 61.4%. You are a Member of Parliament." });
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
    // Political office holders from Minister of State up get the National Bonus: 3 months at
    // target, up to 6, set by the indicators their own ministry pushes.
    const national = s.rank >= 11 ? (base / 16) * s.nbMonths : 0;
    const total = Math.round((base + perf + national) * 0.82); // after tax + CPF, roughly
    s.wealth += total;
    return total;
  }

  function appraise(content, s) {
    const noise = (roll(s) * 20) - 10;
    const mod = s.appraisalMod;
    const score = 0.50 * s.competence + 0.30 * s.standing + 0.15 * s.reputation + noise + mod;
    s.appraisalMod = 0;
    return { grade: content.grades.find(g => score >= g.min), score, noise, mod };
  }

  // `t` collects what the year-end decided and why, for playtest traces. The UI ignores it.
  function yearEnd(content, s, t = {}) {
    const log = [];
    const pay = payout(content, s);
    log.push({ kind: "pay", text: s.rank >= 11
      ? `Annual package: $${pay.toLocaleString()}, including a National Bonus of ${s.nbMonths} months`
      : `Annual package: $${pay.toLocaleString()}` });

    s.yearsInGrade++;
    const { grade, score, noise, mod } = appraise(content, s);
    t.appraisal = { grade: grade.code, score, noise, noted: mod };
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
    const gradeOk = grade.code === "A" || (grade.code === "B+" && !topRungs);
    const promotable = gradeOk
      && s.yearsInGrade >= needYears
      && s.rank < 16;
    t.promotion = { rank: s.rank, yearsInGrade: s.yearsInGrade, needYears, gradeOk,
      result: !promotable ? "not_eligible" : s.rank >= s.cep ? "cep_ceiling" : s.rank === 7 ? "service_ceiling" : "promoted" };

    if (promotable && s.rank >= s.cep) {
      log.push({ kind: "cep", text: content.cepHints[Math.floor(roll(s) * content.cepHints.length)] });
    } else if (promotable && s.rank === 7) {
      log.push({ kind: "cep", text: "There is no rung above this one. The next step is not a promotion; it is a different life." });
    } else if (promotable) {
      // A standout junior officer occasionally skips a grade. This is the only way
      // a late starter ever makes up the years a scholar was simply given.
      const doubleJump = grade.code === "A" && s.rank <= 4 && score >= 84 && s.rank + 1 < s.cep;
      s.rank += doubleJump ? 2 : 1;
      if (doubleJump) t.promotion.result = "promoted_two";
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
    if (s.flags.includes("tea_withdrawn")) return "withdrawn";
    if (s.rank >= 8) return "backbench";
    return "level";
  }

  // Safety net: the pool must never be empty, or a run dies of silence.
  const QUIET_YEAR = { id: "__quiet", title: "A Year Passes", body: "Nothing of consequence happens. This is, statistically, most years.",
    choices: [{ text: "Carry on.", effects: { competence: 1 }, outcome: "You carry on." }] };

  // --- montage years -------------------------------------------------------
  // A repeatable card the player has already played in full comes back as one line and
  // one button. Full cards are kept for years where something is at stake.
  const MONTAGE = "__montage:";
  const isFiller = ev => !ev.once && !ev.triggered && !ev.priority && !ev.noMontage;

  // A montage year repeats the player's habit: the effects of what they chose the first
  // time they played this card in full (without its "noted" hit or its consequences).
  function montageOf(src, s) {
    const lines = src.montageLines || ["The year passes. Most of them do."];
    const n = s.fillerSeen[src.id] || 1;
    const habit = src.choices[(s.habits || {})[src.id]];
    const effects = habit ? Object.fromEntries(Object.entries(habit.effects || {}).filter(([k]) => k !== "appraisal"))
      : (src.montageEffects || { competence: 1 });
    return { id: MONTAGE + src.id, title: src.title, body: lines[(n - 1) % lines.length], montage: true,
      choices: [{ text: habit ? `As usual: ${habit.text}` : "Carry on.", effects, outcome: "Another year." }] };
  }

  // The card the player is looking at, whatever kind it is. UI and harness both use this.
  function eventOf(content, s) {
    const id = s.currentEvent;
    if (!id) return null;
    if (id === "__quiet") return QUIET_YEAR;
    if (id.startsWith(MONTAGE)) return montageOf(content.events.find(e => e.id === id.slice(MONTAGE.length)), s);
    return content.events.find(e => e.id === id);
  }

  // --- public turn API --------------------------------------------------
  // advance(content, state, choiceIndex) -> { state, outcome, log, trace }
  function advance(content, state, choiceIndex) {
    const s = JSON.parse(JSON.stringify(state));   // immutable in, new state out
    const ev = eventOf(content, s);
    const ch = ev.choices[choiceIndex];
    const before = { year: s.year, age: s.age, cep: s.cep, heat: s.heat, rank: s.rank };
    const trace = {};
    const log = applyChoice(content, s, ev, ch, trace);
    if (!s.ending) log.push(...yearEnd(content, s, trace));
    if (ev.id.startsWith(MONTAGE)) s.fillerSeen[ev.id.slice(MONTAGE.length)]++;
    else if (isFiller(ev)) {
      s.fillerSeen[ev.id] = (s.fillerSeen[ev.id] || 0) + 1;
      (s.habits = s.habits || {})[ev.id] = choiceIndex;   // what montage years will repeat
    }
    s.history.push({ ...before, ev: ev.id, title: ev.title, choice: choiceIndex, text: ch.text,
      cepAfter: s.cep, heatAfter: s.heat, rankAfter: s.rank,
      hints: log.filter(l => l.kind === "cep" || l.kind === "heat").map(l => l.kind + "|" + l.text) });
    s.currentEvent = null;
    return { state: s, outcome: ch.outcome, log, trace };
  }

  function nextEvent(content, state) {
    const s = JSON.parse(JSON.stringify(state));
    const ev = pickEvent(content, s);
    if (!ev) { s.currentEvent = "__quiet"; return { state: s, event: QUIET_YEAR }; }
    // Every fifth time, the full card comes back, so a habit can be changed.
    const seenN = s.fillerSeen[ev.id] || 0;
    if (isFiller(ev) && seenN >= 1 && seenN % 4 !== 0) {
      s.currentEvent = MONTAGE + ev.id;
      return { state: s, event: montageOf(ev, s) };
    }
    s.currentEvent = ev.id;
    return { state: s, event: ev };
  }

  // --- the ending: legacy and the declassified file --------------------------
  // Wealth is the machine's score. Legacy is the other one: what the people you worked
  // with would say. The engine never uses it for anything else, which is the point.
  function legacy(content, s) {
    const marks = (content.legacyFlags || []).filter(f => s.flags.includes(f)).length;
    const score = s.integrity + s.reputation / 2 + 8 * marks;
    const tiers = content.legacyTiers || [];
    return (tiers.find(x => score >= x.min) || { text: "" }).text;
  }

  function title(content, r) {
    return r >= content.ladder.length ? content.ladder[content.ladder.length - 1].title : content.ladder[r].title;
  }

  // What was really going on, as a short list of lines for the ending screen.
  function declassify(content, s) {
    const out = [], H = s.history || [];
    // In the service a ceiling of 7 or more means no ceiling at all; in politics it is a rank.
    const ceiling = (r, political) => political ? title(content, r)
      : r === 7 ? "Permanent Secretary, the top of the service"
      : r >= 8 ? "no ceiling inside the service" : title(content, r);
    out.push({ label: "Your ceiling", text: s.cepStart >= 8
      ? "When you joined, your file put no ceiling on you inside the service. Most people's files do."
      : `When you joined, your file estimated your potential at ${ceiling(s.cepStart, false)}. You were not told.` });
    const won = H.find(h => h.ev === "the_election" && h.rankAfter === 8);
    if (won) out.push({ label: "The party's estimate", text: `When you won your seat, the party made its own: ${title(content, won.cepAfter)}. Nobody told you that either.` });

    // Raises that mattered: in politics, or in the service while a ceiling still applied.
    const raised = H.filter(h => h.cepAfter > h.cep && h.ev !== "the_election" && (h.rank >= 8 || h.cep < 8));
    if (!raised.length && s.cepStart >= 8 && s.rank < 8) {
      out.push({ label: "The year it changed", text: "It never needed to. That is what the scholarship was for." });
    } else if (raised.length) {
      const r = raised.reduce((a, b) => (b.cepAfter - b.cep > a.cepAfter - a.cep ? b : a));
      const to = r.rank < 8 && r.cepAfter >= 8 ? "It removed your ceiling inside the service altogether."
        : `It raised your ceiling to ${ceiling(r.cepAfter, r.rank >= 8)}.`;
      out.push({ label: "The year it changed", text: `At ${r.age}, in ${r.title}, you chose "${r.text}" ${to}` });
    } else {
      const missed = H.filter(h => {
        const ev = content.events.find(e => e.id === h.ev);
        return ev && ev.choices.some((c, i) => i !== h.choice && (c.effects || {}).cep > 0);
      }).slice(0, 2).map(h => {
        const ev = content.events.find(e => e.id === h.ev);
        const c = ev.choices.find((c, i) => i !== h.choice && (c.effects || {}).cep > 0);
        return `at ${h.age}, "${c.text}"`;
      });
      out.push({ label: "The year it changed", text: missed.length
        ? `It never did. It could have: ${missed.join("; ")}`
        : "It never did. Nothing you were offered could have changed it." });
    }

    // Only the ceiling rumours (content.cepHints); the Perm Sec "no rung above" line is not one.
    const isHint = x => x.startsWith("cep|") && content.cepHints.includes(x.slice(4));
    const blocked = H.filter(h => h.hints.some(isHint));
    if (blocked.length) {
      const first = blocked[0].hints.find(isHint).slice(4);
      out.push({ label: "The rumours, translated", text: `"${first}" meant: your work had earned a promotion and your ceiling refused it. You were told this ${blocked.length} time${blocked.length > 1 ? "s" : ""}.` });
    }

    const peak = H.reduce((a, b) => (b.heatAfter > a.heatAfter ? b : a), { heatAfter: 0 });
    out.push({ label: "Exposure", text: peak.heatAfter >= 20
      ? `Your scandal exposure peaked at ${peak.heatAfter} out of 100, after "${peak.title}" at age ${peak.age}. At 85, everything surfaces at once.`
      : "Your file is clean enough to be boring. In this building, that is a compliment." });

    out.push({ label: "Legacy", text: legacy(content, s) });
    return out;
  }

  return { newGame, advance, nextEvent, eventOf, choiceAvailable, eligible, rank, declassify, legacy,
    STATS, QUIET: QUIET_YEAR };
})();

if (typeof module !== "undefined") module.exports = Engine;
