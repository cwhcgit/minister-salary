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

  // opts.gender: a choice from content.player.genders (the start screen; default: the table's
  // default). A blank name is drawn from the cast's name pool for it. Both are text only:
  // neither touches the run's dice.
  function newGame(content, originId, name, seed, opts = {}) {
    playerTable(content);   // throws on a missing or malformed table: never a quiet default
    const origin = content.origins.find(o => o.id === originId);
    const r = rng(seed);
    const me = playerOf(content, { name, gender: opts.gender, seed });   // text only
    const g = {
      seed, name: me.name, gender: me.gender, origin: origin.id,
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
      gradeSeen: {},     // appraisal quotes used so far this run, per grade (see gradeLabel)
      fillerSeen: {},    // repeatable events already played in full, for montage years
      habits: {},        // the choice made on each of them, which montage years repeat
      series: {},        // habits shared by sibling cards (see seriesOf): { key: { stance, full, passed } }
      linesUsed: {},     // Meanwhile lines this run has shown, per card and habit (see pickLine)
      history: [],       // one entry per year, for the Declassified screen
      flags: [],
      seen: [],
      scheduled: [],     // { eventId, fireYear }
      consecutiveC: 0,
      consecutiveD: 0,
      cardsPlayed: 0,    // taps on real cards; probation counts these as well as years
      standouts: 0,      // standout moments toward an "exceptional" file
      // cards (and card versions) seen in the player's last runs on this phone: drawn less
      // often this run, so a second career does not replay the first
      recent: Array.isArray(opts.recent) ? opts.recent.slice(0, 400) : [],
      rngCalls: 0,
      ending: null,
      currentEvent: null
    };
    g.cepStart = g.cep;
    if (opts.rival && content.rival) g.rival = newRival(content, origin, seed, playerWords(g.name, content));
    castSync(content, g, null, true);   // the run's people, before the first card
    return g;
  }

  // --- the batchmate ------------------------------------------------------
  // Optional. Someone from the player's intake: same origin, same start, a hidden ceiling
  // drawn the same way, and a simple seeded career of their own. A batch is ranked against
  // itself, so the batchmate is as good as the player by construction: their yearly score is
  // the player's own appraisal baseline plus a small hidden edge and their own luck. They
  // compete with the player for the same slots in the ranking exercise. All their randomness
  // comes from a separate stream (rivalRoll), so a game without a batchmate plays as before.
  // `avoid`: the player's name words. A batchmate who would share one gets another name (the same
  // pronoun where the pool allows), drawn on a stream of its own, so the batchmate's dice are untouched.
  function newRival(content, origin, seed, avoid = []) {
    const R = content.rival, r = rng((seed ^ 0x5bd1e995) >>> 0);
    let who = R.names[Math.floor(r() * R.names.length)];
    const clear = n => n.name.toLowerCase().split(/\s+/).every(w => !avoid.includes(w));
    if (!clear(who)) {
      const r2 = rng((seed ^ 0x2545f491) >>> 0);
      const order = R.names.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r2() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      const k = order.find(i => R.names[i].pron === who.pron && clear(R.names[i])) ?? order.find(i => clear(R.names[i]));
      if (k !== undefined) who = R.names[k];
    }
    const ed = (R.edge || {})[origin.id] || [-3, 5];
    const cep = origin.cep[0] + Math.floor(r() * (origin.cep[1] - origin.cep[0] + 1));
    return { name: who.name, pron: who.pron, rank: origin.startRank, cep, cepStart: cep,
      edge: ed[0] + Math.floor(r() * (ed[1] - ed[0] + 1)), yearsInGrade: 0,
      bondYears: origin.bondYears || 0, political: false, triedPolitics: false,
      status: "active", rel: 0, mod: 0, calls: 0, met: 0, wonMet: 0, ahead: 0, behind: 0 };
  }

  function rivalRoll(s) {
    const r = rng((s.seed * 31 + 977 + s.rival.calls * 7919) >>> 0);
    s.rival.calls++;
    return r();
  }

  // {rival} is the name; pronouns only as object/possessive or before past-tense verbs.
  // The same holds for the cast's pronoun tokens ({peer.they} etc.), so a line never depends on
  // whether the pronoun takes "is" or "are".
  const PRON = { f: { they: "she", them: "her", their: "her" }, m: { they: "he", them: "him", their: "his" } };
  // Every name token on a card: {peer}, {Peer.They}, {asker.short}, {rival}. Card parts are
  // filled first, then the cast, then the batchmate.
  // The player last of all, so nothing the player typed is ever read as a token.
  function sub(text, s, content) {
    if (typeof text !== "string" || text.indexOf("{") < 0) return text;
    if (s.ministry) text = text.replace(/\{ministry\}/g, s.ministry);
    if (content && s.cast) text = castSub(content, s, text);
    if (s.rival) {
      const p = PRON[s.rival.pron] || PRON.f;
      text = text.replace(/\{rival\}/g, () => s.rival.name)
        .replace(/\{(They|Them|Their)\}/g, (_, k) => cap(p[k.toLowerCase()]))
        .replace(/\{(they|them|their)\}/g, (_, k) => p[k]);
    }
    return playerSub(text, s, content);
  }

  // --- the player ------------------------------------------------------------
  // The game says "you", so the player's name and gender only show where someone else speaks of
  // or to them: a colleague, Hansard, the papers, the batchmate, the ending card. Every player
  // token is filled here, by playerSub, which only sub() calls. What each choice fills in is data:
  // content.player.genders (game.json), in the order the start screen shows them.
  //   {player}           the name as entered (or drawn, when left blank)
  //   {player.formal}    the choice's honorific and the name ("Ms Tan Wei Ling")
  //   {player.<field>}   any other field of the choice: they, them, their, or one a writer adds;
  //                      capitalised as {Player.They} or {player.They}
  // As with the cast, a subject pronoun only comes before a past-tense verb ("{player.they} said").
  // Nothing outside text reads the gender: not the dice, not the draw, not the appraisal.
  const PLAYER_TOKEN = /\{([Pp]layer)(?:\.([A-Za-z]+))?\}/g;
  const PLAYER_OWN = ["label", "pool"];   // a choice's fields that are not tokens
  // The table is the only source: content without it, or with a malformed one, is an error,
  // never a quiet default. (web/packs.js refuses such a build too, so the phone never loads one.)
  const CHECKED = new WeakSet();
  function playerTable(content) {
    const P = content && content.player;
    if (P && CHECKED.has(P)) return P;
    const problem = playerTableProblem(P);
    if (problem) throw new Error(`game.json player table: ${problem} (see docs/DESIGN.md section 7)`);
    CHECKED.add(P);
    return P;
  }
  function playerTableProblem(P) {
    const G = P && P.genders;
    if (!G || typeof G !== "object" || Array.isArray(G) || !Object.keys(G).length) return "player.genders is missing or empty";
    for (const [id, g] of Object.entries(G)) {
      if (!g || typeof g !== "object") return `player.genders.${id} is not an object`;
      if (typeof g.label !== "string" || !g.label) return `player.genders.${id} has no label`;
      if (typeof g.honorific !== "string" || !g.honorific) return `player.genders.${id} has no honorific`;
    }
    if (!Object.prototype.hasOwnProperty.call(G, P.default)) return `player.default "${P.default}" is not one of player.genders`;
    return null;
  }
  // The start screen's choices, in order: [{ id, label }].
  function genders(content) {
    return Object.entries(playerTable(content).genders).map(([id, g]) => ({ id, label: g.label }));
  }
  // A choice the table has, or the table's default.
  function genderId(content, g) {
    const T = playerTable(content);
    return Object.prototype.hasOwnProperty.call(T.genders, g) ? g : T.default;
  }
  // The token fields a text may use: {player}, {player.name}, {player.formal}, and every field the
  // table's choices have (other than their own label and pool).
  function playerFields(content) {
    const out = new Set(["", "name", "formal"]);
    for (const g of Object.values(playerTable(content).genders)) for (const k of Object.keys(g)) if (!PLAYER_OWN.includes(k)) out.add(k.toLowerCase());
    return [...out];
  }
  // Honorifics a typed name may already start with ("Dr Tan"): the table's, and the usual ones.
  function honorifics(content) {
    const out = new Set(["mr", "ms", "mrs", "mdm", "miss", "dr", "prof"]);
    for (const g of Object.values(playerTable(content).genders)) if (g.honorific) out.add(String(g.honorific).toLowerCase().replace(/\.$/, ""));
    return out;
  }
  // The words of a typed name that a cast member or the batchmate must not share.
  function playerWords(name, content) {
    const hon = honorifics(content);
    return String(name || "").toLowerCase().replace(/[.,\-]/g, " ").split(/\s+/)
      .filter(w => w && !NAME_PARTICLES.has(w) && !hon.has(w));
  }
  // A name for a blank field: one of the cast pool's names for the choice's pool, in an order
  // drawn on the player's own stream, clear of any name words in `avoid`.
  function drawName(content, seed, gender, avoid) {
    const C = content && content.cast;
    if (!C || !(C.names || []).length) throw new Error("game.json has no cast.names to draw a blank name from");
    const r = rng((Math.imul(seed >>> 0, 0x2C1B3C6D) ^ hashStr("player")) >>> 0);
    const want = playerTable(content).genders[gender].pool || gender;
    const pool = C.names.filter(n => n.pron === want);
    const list = pool.length ? pool : C.names;
    const order = list.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    const i = order.find(k => nameWords(list[k]).every(w => !avoid.has(w))) ?? order[0];
    return list[i].full;
  }
  // The player as the text sees them. A save from before the start screen asked has no gender
  // (it reads as the table's default) and, if its name was left blank, the old placeholder "You":
  // it gets a name drawn as for a blank field, clear of the run's people as they stand.
  function playerOf(content, s) {
    const gender = genderId(content, s.gender);
    const typed = typeof s.name === "string" ? s.name.trim() : "";
    if (typed && typed !== "You") return { name: typed, gender };
    const avoid = new Set();
    if (s.cast) for (const p of Object.values(s.cast.on).concat(s.cast.past)) if (p) nameWords(p.nm).forEach(w => avoid.add(w));
    if (s.rival) s.rival.name.toLowerCase().split(/\s+/).forEach(w => avoid.add(w));
    return { name: drawName(content, s.seed || 0, gender, avoid), gender };
  }
  // Fills in an old save's name and gender for good (the defaults above), so they never change.
  function upgradePlayer(content, s) {
    if (s) {
      const me = playerOf(content, s);
      if (me.gender !== s.gender || me.name !== s.name) { s.name = me.name; s.gender = me.gender; }
    }
    return s;
  }
  function playerField(content, me, field) {
    const f = (field || "").toLowerCase(), g = playerTable(content).genders[me.gender];
    if (f === "" || f === "name") return me.name;
    if (f === "formal") {
      const first = me.name.split(/\s+/)[0].toLowerCase().replace(/\.$/, "");
      return honorifics(content).has(first) ? me.name : `${g.honorific} ${me.name}`;
    }
    if (PLAYER_OWN.includes(f)) return null;
    const k = Object.keys(g).find(x => x.toLowerCase() === f);
    return k && typeof g[k] === "string" ? g[k] : null;
  }
  function playerSub(text, s, content) {
    if (!/\{[Pp]layer[.}]/.test(text)) return text;
    const me = playerOf(content, s);
    return text.replace(PLAYER_TOKEN, (m, nm, field) => {
      const v = playerField(content, me, field);
      if (v === null) return m;   // an unknown field stays raw: the lint and the leak check catch it
      return isUpper(nm) || isUpper(field) ? cap(v) : v;
    });
  }
  // The player for the UI and the checks: name, gender, its label and the formal name.
  function player(content, s) {
    const me = playerOf(content, s);
    return { ...me, label: playerTable(content).genders[me.gender].label, formal: playerField(content, me, "formal") };
  }

  // --- the cast ------------------------------------------------------------
  // A handful of recurring people per run (content.cast): a peer from your intake, an officer
  // who reports to you, someone senior, a journalist, and in politics a grassroots leader and a
  // fellow MP. Names, pronouns and ages are drawn from the seed on their own stream, so the cast
  // never moves the run's dice. Each role holds one person at a time. A role is filled only in
  // the player contexts it makes sense in (role.when); when its holder leaves (retires, is caught
  // up with, leaves the service, or a choice says so) the role is vacant, cards that name it
  // cannot be drawn, and a refill is a new person with no history. What the player did to or for
  // a person is kept on that person (their flags), so callbacks can never land on a stranger.
  const TOKEN = /\{([A-Za-z]+)(?:\.([A-Za-z]+))?\}/g;
  const NOT_ROLES = new Set(["rival", "they", "them", "their", "title", "ministry", "player"]);
  const NAME_PARTICLES = new Set(["bin", "binte", "bte", "s/o", "d/o", "a/l", "a/p", "de", "da", "van"]);
  const lc1 = x => x.charAt(0).toLowerCase() + x.slice(1);
  const isUpper = x => !!x && x.charAt(0) !== x.charAt(0).toLowerCase();
  function hashStr(id) { let h = 2166136261; for (const ch of id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0; return h; }

  // The highest service rung (0-7) a person of this age may hold (ladder minAge).
  function maxRankForAge(content, age) {
    let r = 0;
    for (let k = 1; k <= 7; k++) { if ((content.ladder[k].minAge || 0) > age) break; r = k; }
    return r;
  }
  const personAge = (s, p) => s.age + p.ageOff;
  const nameWords = nm => nm.full.split(/\s+/).filter(w => !NAME_PARTICLES.has(w.toLowerCase())).map(w => w.toLowerCase());

  function personTitle(content, cfg, p, s) {
    if (cfg.track === "none") {
      if (p.post) return p.post;
      const yrs = s.year - p.since;
      return (cfg.titles || []).reduce((t, [y, x]) => (yrs >= y ? x : t), "");
    }
    return content.ladder[Math.min(16, p.rank)].title;
  }
  // One field of a person, for a token or a log line.
  function personField(content, s, role, p, field) {
    const C = content.cast, cfg = C.roles[role], f = (field || "").toLowerCase();
    const hon = ((C.honorifics || {})[role] || (C.honorifics || {}).default || { m: "Mr", f: "Ms" })[p.pron];
    const P = PRON[p.pron] || PRON.f;
    switch (f) {
      case "": case "name": return cfg.call === "formal" ? `${hon} ${p.nm.formal}` : cfg.call === "full" ? p.nm.full : p.nm.given;
      case "full": return p.nm.full;
      case "given": return p.nm.given;
      case "formal": return `${hon} ${p.nm.formal}`;
      case "title": return personTitle(content, cfg, p, s);
      case "atitle": { const t = personTitle(content, cfg, p, s); return article(t) + " " + t; }
      case "they": case "them": case "their": return P[f];
      case "years": { const n = s.year - p.since; return n < 1 ? "less than a year" : n === 1 ? "a year" : `${NUM_WORDS[n] || n} years`; }
      default: return null;
    }
  }
  // "a" or "an", by how the word is said. An initialism is read letter by letter, so it goes by
  // its first letter's name: an MP, an RC, an SMC, an HDB flat; a CCC, a GRC, a URA.
  function article(t) {
    const w = (String(t).match(/^[A-Za-z]+/) || [""])[0];
    if (w.length >= 2 && w === w.toUpperCase()) return /^[AEFHILMNORSX]/.test(w) ? "an" : "a";
    return /^[aeiou]/i.test(w) ? "an" : "a";
  }
  const NUM_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
  function castSub(content, s, text) {
    if (!content.cast || !s.cast || text.indexOf("{") < 0) return text;
    return text.replace(TOKEN, (m, name, field) => {
      const role = name.toLowerCase();
      if (!content.cast.roles[role]) return m;
      const p = s.cast.on[role];
      if (!p) return m;   // a vacant role is never filled in; the lint and the leak check catch it
      const v = personField(content, s, role, p, field);
      if (v === null) return m;
      return isUpper(name) || isUpper(field) ? cap(v) : v;
    });
  }

  // Roles a text names, and the slots of the card's own parts it uses.
  function tokensIn(text) {
    const out = [];
    if (typeof text === "string") for (const m of text.matchAll(TOKEN)) out.push({ name: lc1(m[1]), field: m[2] || "" });
    return out;
  }
  // The roles a card names in its own text (title, body, choices, every version), which must all
  // be filled for the card to be drawn. Roles named only inside a part option gate that option.
  // Derived data is cached on the content objects under symbols, which JSON (saves, the build
  // hash) never sees.
  const NEEDS = Symbol("needs"), SLOTS = Symbol("slots"), ROLES = Symbol("roles");
  function cardTexts(ev) {
    const out = [ev.title, ev.body];
    for (const c of ev.choices || []) { out.push(c.text, c.outcome); if (c.rival && c.rival.contest) out.push(c.rival.contest.winText, c.rival.contest.loseText); }
    for (const v of ev.variants || []) { out.push(v.title, v.body, v.autoPlayLine); for (const c of v.choices || []) if (c) out.push(c.text, c.outcome); }
    return out.filter(x => typeof x === "string");
  }
  function roleNeeds(ev) {
    if (ev[NEEDS]) return ev[NEEDS];
    const slots = new Set(partSlots(ev).map(([k]) => k));
    const roles = new Set();
    for (const t of cardTexts(ev)) for (const { name } of tokensIn(t))
      if (!slots.has(name) && !NOT_ROLES.has(name.toLowerCase())) roles.add(name.toLowerCase());
    const out = [...roles];
    if (Object.prototype.hasOwnProperty.call(ev, "id")) Object.defineProperty(ev, NEEDS, { value: out });
    return out;
  }
  // (an option's own text may use another slot's words, e.g. {asker.their}: those are not roles)
  function optionNeeds(opt, ev) {
    if (opt[NEEDS]) return opt[NEEDS];
    const slots = new Set(ev ? partSlots(ev).map(([k]) => k) : []);
    const roles = new Set();
    for (const v of Object.values(opt)) for (const { name } of tokensIn(v)) if (!slots.has(name) && !NOT_ROLES.has(name.toLowerCase())) roles.add(name.toLowerCase());
    const out = [...roles];
    if (ev) Object.defineProperty(opt, NEEDS, { value: out });
    return out;
  }
  const rolesFilled = (roles, s) => roles.every(r => !!(s.cast && s.cast.on[r]));

  // Requirements on a cast member: { peer: {} } (the role is filled), { peer: false } or
  // { peer: { vacant: true } } (it is not), plus flagsAll / flagsNone / minRank / maxRank /
  // minYears (years in the role) on the person who holds it.
  function castMeets(q, s) {
    for (const [role, c] of Object.entries(q)) {
      const p = s.cast && s.cast.on[role];
      if (c === false || (c && c.vacant)) { if (p) return false; continue; }
      if (!p) return false;
      if (!c) continue;
      if (c.flagsAll && !c.flagsAll.every(f => p.flags.includes(f))) return false;
      if (c.flagsNone && c.flagsNone.some(f => p.flags.includes(f))) return false;
      if (c.minRank !== undefined && p.rank < c.minRank) return false;
      if (c.maxRank !== undefined && p.rank > c.maxRank) return false;
      if (c.minYears !== undefined && s.year - p.since < c.minYears) return false;
    }
    return true;
  }

  // A new person for a role: a name nobody else in this run shares a word with (nor the
  // batchmate, nor the player), preferring names the phone has not seen in its last runs; age, and where the
  // role has one, a rank.
  function drawPerson(content, s, role) {
    const C = content.cast, cfg = C.roles[role], K = s.cast;
    const gen = (K.gen[role] = (K.gen[role] || 0) + 1);
    const r = rng((Math.imul(s.seed >>> 0, 2654435761) ^ Math.imul(hashStr(role), 31) ^ Math.imul(gen, 7919)) >>> 0);
    const used = new Set();
    for (const p of Object.values(K.on).concat(K.past)) if (p) nameWords(p.nm).forEach(w => used.add(w));
    if (s.rival) s.rival.name.split(/\s+/).forEach(w => used.add(w.toLowerCase()));
    playerWords(s.name, content).forEach(w => used.add(w));   // nor the player's own
    const order = C.names.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    const ok = i => nameWords(C.names[i]).every(w => !used.has(w));
    const recent = s.recent || [];
    const i = order.find(i => ok(i) && !recent.includes("cast:" + C.names[i].full)) ?? order.find(ok);
    if (i === undefined) return null;   // the pool is exhausted: the role stays vacant
    const n = C.names[i];
    const span = ([a, b]) => a + Math.floor(r() * (b - a + 1));
    let ageOff = cfg.age ? span(cfg.age) - s.age : span(cfg.ageOff || [0, 0]);
    if (cfg.retireAge) ageOff = Math.min(ageOff, cfg.retireAge - 8 - s.age);   // nobody arrives only to retire
    if (cfg.minAge) ageOff = Math.max(ageOff, cfg.minAge - s.age);
    const p = { id: ++K.n, role, nm: { given: n.given, formal: n.formal, full: n.full }, pron: n.pron,
      ageOff, rank: 0, since: s.year, rankYear: s.year, flags: [] };
    if (cfg.track === "alongside") {
      p.lead = 0; p.cap = span(cfg.cap || [7, 7]);
      p.rank = Math.min(s.rank < 8 ? s.rank : 7, maxRankForAge(content, personAge(s, p)));
    } else if (cfg.track === "below") {
      p.gap = span(cfg.gap || [1, 1]);
      p.rank = Math.max(0, Math.min(s.rank - p.gap, maxRankForAge(content, personAge(s, p))));
    } else if (cfg.track === "above") {
      while (maxRankForAge(content, personAge(s, p)) <= s.rank && p.ageOff < 40) p.ageOff++;
      p.rank = Math.min(7, s.rank + span(cfg.gap || [1, 1]), maxRankForAge(content, personAge(s, p)));
    } else if (cfg.track === "political") {
      p.rank = cfg.rank || 8;
    } else if (cfg.posts) {
      p.post = cfg.posts[Math.floor(r() * cfg.posts.length)];
    }
    return p;
  }

  // Why the holder of a role has to go now, if they do.
  function exitReason(content, s, role, cfg, p) {
    if (cfg.retireAge && personAge(s, p) >= cfg.retireAge) return "retired";
    if (cfg.track === "above" && s.rank < 8 && s.rank >= p.rank) return "caughtUp";
    if (cfg.track === "below" && p.rank >= s.rank && s.rank < 8) return "movedUp";
    if (!meets(cfg.when || {}, s)) return "context";
    return null;
  }
  // A person's own career, one step a year at most.
  function stepRank(content, s, cfg, p) {
    if (s.year <= p.rankYear) return;
    const ceil = Math.min(7, maxRankForAge(content, personAge(s, p)));
    if (cfg.track === "alongside") {
      // in the service they move up alongside you; once you have left it they go at their own pace
      const target = s.rank < 8 ? Math.min(ceil, s.rank + (p.lead || 0)) : Math.min(ceil, p.cap);
      if (p.rank < target && (s.rank < 8 || s.year - p.rankYear >= (cfg.driftEvery || 3))) { p.rank++; p.rankYear = s.year; }
    } else if (cfg.track === "below") {
      const target = Math.max(0, Math.min(s.rank - p.gap, ceil));
      if (p.rank < target && s.year - p.rankYear >= (cfg.catchUpEvery || 2)) { p.rank++; p.rankYear = s.year; }
    } else if (cfg.track === "above") {
      // never more than three grades above you: a reporting officer, not a distant name
      if (p.rank < Math.min(ceil, s.rank + 3) && s.year - p.rankYear >= (cfg.promoteEvery || 4)) { p.rank++; p.rankYear = s.year; }
    }
  }
  // A line for an arrival or a departure nobody chose. Each kind has several versions, taken in
  // an order drawn from the seed and never repeated within a run; when a kind has run out, the
  // change happens without a line. The version is only used up if the line is shown (see capNotes).
  function castLine(content, s, role, key, p) {
    const lines = ((content.cast.lines || {})[role] || {})[key];
    if (!lines || !lines.length) return null;
    const used = ((s.cast && s.cast.used) || {})[role + "." + key] || [];
    const r = rng((s.seed ^ hashStr(role + "." + key)) >>> 0);
    const order = lines.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    const i = order.find(k => !used.includes(k));
    if (i === undefined) return null;
    const text = sub(lines[i].replace(/\{([A-Za-z]+)\}/g, (m, f) => {
      const v = personField(content, s, role, p, f);
      return v === null ? m : isUpper(f) ? cap(v) : v;
    }), s, content);
    return { kind: "note", text, cast: role, key, line: i, at: { player: s.rank, rank: p.rank, person: p.id } };
  }

  // One cast line per outcome screen, however many years it covers: the one that matters most.
  // Someone you have history with (flags) first, then by role (peer, senior, journalist, junior,
  // grassroots leader, fellow MP); a departure before an arrival. Nobody who arrived and left
  // within the same screen is mentioned at all. The others change without a line.
  const NOTE_ORDER = ["peer", "senior", "journalist", "junior", "grassroots", "mp"];
  function capNotes(s, log) {
    const notes = log.filter(l => l.cast);
    if (!notes.length) return log;
    const ids = key => new Set(notes.filter(l => (key === "arrive") === ["arrive", "first"].includes(l.key)).map(l => l.at.person));
    const came = ids("arrive"), went = ids("leave");
    const person = id => Object.values(s.cast.on).concat(s.cast.past).find(p => p && p.id === id);
    const rank = l => {
      const p = person(l.at.person), role = NOTE_ORDER.indexOf(l.cast);
      return [p && p.flags.length ? 0 : 1, role < 0 ? NOTE_ORDER.length : role, ["arrive", "first"].includes(l.key) ? 1 : 0];
    };
    const cmp = (a, b) => { const x = rank(a), y = rank(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; };
    const best = notes.filter(l => !(came.has(l.at.person) && went.has(l.at.person))).sort(cmp)[0];
    if (best) {
      const u = (s.cast.used = s.cast.used || {}), k = best.cast + "." + best.key;
      (u[k] = u[k] || []).push(best.line);
    }
    return log.filter(l => !l.cast || l === best);
  }

  // Bring the cast up to date with the player: called when a run starts, after every choice and
  // after every year end. Deterministic and free of the run's dice. `log` (optional) collects the
  // lines for arrivals and departures that nobody chose.
  function castSync(content, s, log, quiet) {
    const C = content.cast;
    if (!C) return;
    const K = s.cast || (s.cast = { on: {}, past: [], vacant: {}, gen: {}, n: 0 });
    const roles = C[ROLES] || (Object.defineProperty(C, ROLES, { value: Object.entries(C.roles) }), C[ROLES]);
    for (const [role, cfg] of roles) {
      let p = K.on[role];
      if (p) {
        const why = exitReason(content, s, role, cfg, p);
        if (why) {
          p.left = s.year; p.why = why;
          K.past.push(p); K.on[role] = null; K.vacant[role] = s.year;
          const l = !quiet && castLine(content, s, role, why, p);
          if (l && log) log.push(l);
          p = null;
        } else stepRank(content, s, cfg, p);
      }
      if (!p && meets(cfg.when || {}, s)) {
        const first = K.vacant[role] === undefined;
        if (!first && !meets(cfg.refillWhen || {}, s)) continue;
        if (!first && s.year - K.vacant[role] < (cfg.refillYears || 0)) continue;
        const np = drawPerson(content, s, role);
        // nobody is cast who would have to leave at once (a senior who cannot be senior to you)
        if (!np || exitReason(content, s, role, cfg, np)) continue;
        K.on[role] = np;
        // after a move (sideways, or a card that hands the role on: moveOn) the move has said
        // someone new is coming; they are introduced on the first card they appear on
        const moved = K.moved && K.moved[role] !== undefined && s.year - K.moved[role] <= 1;
        if (K.moved) delete K.moved[role];
        const l = !quiet && !moved && castLine(content, s, role, first ? "first" : "arrive", np);
        if (l && log) log.push(l);
      }
    }
  }

  // A choice's effect on the cast: { junior: { flags: [...], unflags: [...], promote: 1, leave: "resigned" } }.
  // Only someone the card named, as shown, is changed: a choice on a version of the card (or a
  // part option) that never mentioned the junior does nothing to the junior.
  function castOps(content, s, ops, t, who) {
    if (!s.cast || !content.cast) return;
    for (const [role, op] of Object.entries(ops)) {
      const p = s.cast.on[role], cfg = content.cast.roles[role];
      if (!p || !cfg || !who || who[role] !== p.id) continue;
      for (const f of op.flags || []) if (!p.flags.includes(f)) p.flags.push(f);
      if (op.unflags) p.flags = p.flags.filter(f => !op.unflags.includes(f));
      if (op.promote) {
        const ceil = cfg.track === "political" ? 15 : Math.min(7, maxRankForAge(content, personAge(s, p)));
        const to = Math.min(ceil, p.rank + op.promote);
        if (cfg.track === "alongside") p.lead = (p.lead || 0) + (to - p.rank);
        if (cfg.track === "below") p.gap = Math.max(0, p.gap - (to - p.rank));
        p.rank = to; p.rankYear = s.year;
      }
      if (op.leave) {
        p.left = s.year; p.why = typeof op.leave === "string" ? op.leave : "left";
        s.cast.past.push(p); s.cast.on[role] = null; s.cast.vacant[role] = s.year;
      }
      (t.cast = t.cast || []).push({ role, person: p.id, ...op });
    }
  }

  // --- card parts ------------------------------------------------------------
  // A card may declare parts: named slots, each with interchangeable options. Its text uses
  // {slot} (the option's text), {Slot} (capitalised) or {slot.field} (another of the option's
  // strings). Each showing assembles one combination: options whose requires hold (rank, act,
  // flags, cast, and earlier slots' picks via requires.parts), in an order drawn from the seed,
  // preferring options this phone has not shown in its last runs and this run has not shown yet.
  // A slot written { "pick": "first", "options": [...] } takes the first option that fits
  // instead: conditional text, for callbacks that name someone only if they are still there.
  // An option may also carry effects (added to the card's choices: { "*": {...}, "1": {...} })
  // or scale ({ "heat": 1.5 }), so who is asking can change the stakes, and "prefer": true to win
  // ties with options just as fresh (a callback to something this run did).
  function partSlots(ev) {
    if (!ev.parts) return [];
    if (ev.parts[SLOTS]) return ev.parts[SLOTS];
    const out = Object.entries(ev.parts).map(([k, v]) => [k, Array.isArray(v) ? { pick: "fresh", options: v } : { pick: v.pick || "fresh", options: v.options || [] }]);
    Object.defineProperty(ev.parts, SLOTS, { value: out });
    return out;
  }
  const optId = (o, k) => (o.id !== undefined ? String(o.id) : String(k));
  function optionOk(ev, o, s, picked) {
    const q = o.requires || {};
    if (!meets(q, s)) return false;
    for (const [slot, ids] of Object.entries(q.parts || {})) if (!ids.includes(picked[slot])) return false;
    return rolesFilled(optionNeeds(o, ev), s);
  }
  function partOrder(ev, slot, opts, s) {
    const r = rng((s.seed ^ hashStr(ev.id + "~" + slot)) >>> 0);
    const order = opts.map((_, k) => k);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    const recent = s.recent || [];
    const shown = {};
    for (const h of s.history || []) if (h.ev === ev.id && !h.passed && h.parts && h.parts[slot] !== undefined) shown[h.parts[slot]] = (shown[h.parts[slot]] || 0) + 1;
    const stale = k => { const id = optId(opts[k], k); return shown[id] ? 2 + shown[id] : recent.includes(`${ev.id}~${slot}=${id}`) ? 1 : 0; };
    // among equally fresh options, one marked "prefer" (usually a callback to this run) goes first
    return order.map((k, i) => ({ k, i, st: stale(k), pr: opts[k].prefer ? 0 : 1 }))
      .sort((a, b) => a.st - b.st || a.pr - b.pr || a.i - b.i).map(x => x.k);
  }
  // The combination this showing uses, or null when no combination fits.
  function pickParts(ev, s) {
    const slots = partSlots(ev), out = {};
    const go = i => {
      if (i === slots.length) return true;
      const [name, sl] = slots[i];
      const order = sl.pick === "first" ? sl.options.map((_, k) => k) : partOrder(ev, name, sl.options, s);
      for (const k of order) {
        if (!optionOk(ev, sl.options[k], s, out)) continue;
        out[name] = optId(sl.options[k], k);
        if (go(i + 1)) return true;
      }
      delete out[name];
      return false;
    };
    return go(0) ? out : null;
  }
  // Whether any combination fits (the order does not matter for that).
  function partsFit(ev, s) {
    const slots = partSlots(ev), cur = {};
    const go = i => {
      if (i === slots.length) return true;
      const [name, sl] = slots[i];
      for (let k = 0; k < sl.options.length; k++) {
        if (!optionOk(ev, sl.options[k], s, cur)) continue;
        cur[name] = optId(sl.options[k], k);
        if (go(i + 1)) return true;
      }
      delete cur[name];
      return false;
    };
    return go(0);
  }
  // Every combination that fits this state (up to `limit`), for the immersion lint.
  function partCombos(ev, s, limit = 64) {
    const slots = partSlots(ev), out = [], cur = {};
    const go = i => {
      if (out.length >= limit) return;
      if (i === slots.length) { out.push({ ...cur }); return; }
      const [name, sl] = slots[i];
      sl.options.forEach((o, k) => { if (out.length < limit && optionOk(ev, o, s, cur)) { cur[name] = optId(o, k); go(i + 1); delete cur[name]; } });
    };
    go(0);
    return out;
  }
  function partOption(ev, slot, id) {
    const sl = partSlots(ev).find(([k]) => k === slot);
    return sl ? sl[1].options.find((o, k) => optId(o, k) === id) : null;
  }
  function fillParts(text, ev, pick) {
    if (typeof text !== "string" || !pick || text.indexOf("{") < 0) return text;
    return text.replace(TOKEN, (m, name, field) => {
      const slot = lc1(name);
      if (pick[slot] === undefined) return m;
      const o = partOption(ev, slot, pick[slot]);
      let v = o && (field ? o[field] : o.text);
      if (typeof v !== "string") return m;
      v = fillParts(v, ev, pick);   // an option may use another slot's words
      // {Slot}: capitalise the first letter, or the first token if the option opens with one
      return isUpper(name) ? (v.startsWith("{") ? "{" + cap(v.slice(1)) : cap(v)) : v;
    });
  }
  function partEffects(fx, k, ev, pick) {
    let out = { ...(fx || {}) }, changed = false;
    for (const [slot, id] of Object.entries(pick)) {
      const o = partOption(ev, slot, id);
      if (!o) continue;
      for (const [stat, f] of Object.entries(o.scale || {})) if (out[stat]) { out[stat] = Math.round(out[stat] * f); changed = true; }
      for (const add of [(o.effects || {})["*"], (o.effects || {})[k]]) for (const [stat, n] of Object.entries(add || {})) {
        out[stat] = (out[stat] || 0) + n; changed = true;
        if (!out[stat]) delete out[stat];
      }
    }
    return changed ? out : fx;
  }

  // The card as the player sees it: parts assembled, every name filled in. `force` (lint only)
  // renders a given combination instead of the one this showing would pick.
  function render(content, ev, s, force) {
    const pick = ev.parts ? (force && force.parts) || pickParts(ev, s) || fallbackParts(ev) : null;
    // who: the people this showing actually names (not every role some other version of it names)
    // saw: the people the player reads on the card itself (title, body, choices; "rival" for the
    // batchmate). A choice's outcome keeps its own, as the player only reads the one they chose.
    const who = {}, saw = {};
    const named = (t, seen) => {
      if (t.indexOf("{") < 0) return t;
      for (const { name } of tokensIn(t)) {
        const r = name.toLowerCase();
        if (r === "rival") { if (s.rival) seen.rival = true; continue; }
        if (!NOT_ROLES.has(r) && s.cast && s.cast.on[r]) who[r] = seen[r] = s.cast.on[r].id;
      }
      return t;
    };
    const T = (t, seen = saw) => (typeof t === "string" ? sub(named(fillParts(t, ev, pick), seen), s, content) : t);
    const B = t => (typeof t === "string" ? sub(named(introduce(content, s, fillParts(t, ev, pick)), saw), s, content) : t);
    const out = { ...ev, title: T(ev.title), body: B(ev.body),
      choices: ev.choices.map((c, k) => {
        const own = {};
        const x = { ...c, text: T(c.text), outcome: T(c.outcome, own) };
        if (pick) x.effects = partEffects(c.effects, k, ev, pick);
        if (c.rival && c.rival.contest) x.rival = { ...c.rival, contest: { ...c.rival.contest, winText: T(c.rival.contest.winText, own), loseText: T(c.rival.contest.loseText, own) } };
        if (Object.keys(own).length) x.saw = own;
        return x;
      }) };
    if (pick) out.picked = pick;
    if (Object.keys(who).length) out.who = who;
    if (Object.keys(saw).length) out.saw = saw;
    // a series' second showing: the habit is the default, so it comes first (order maps the
    // buttons back to the card's own choices)
    if (ev.keep > 0) {
      out.order = [ev.keep, ...out.choices.map((_, i) => i).filter(i => i !== ev.keep)];
      out.choices = out.order.map(i => out.choices[i]);
    }
    return out;
  }
  // Every card says who its people are, so a name never has to be remembered from cards ago.
  // The first card a person appears on (and the first after INTRO_AGAIN years without them) gives
  // their role's introduction ("Joanne, who joined the service the same week as you,"). Every
  // later card gives a short tag instead ("Nurul Huda, your fellow MP,"), unless they were on the
  // card the player saw just before. Either goes on the first mention of them in the body. A
  // mention the writer already followed with a comma or a bracket (their own introduction) is left
  // alone, and so is one inside a quotation. A possessive ("{mp}'s ward") takes neither: the next
  // plain mention does, or, if there is none, a tag that is a noun phrase goes in front of the name
  // ("your fellow MP Nurul Huda's ward"). The batchmate ({rival}) has a tag only (engineLines.rivalTag):
  // the writer introduces them in their own words, and the header names them throughout.
  const INTRO_AGAIN = 8;
  // Whether a tag reads in front of a name ("your fellow MP Nurul Huda's"): "your ..." or "the ...",
  // with no clause of its own.
  const nounTag = t => /^(?:your|the) [^,]+$/i.test(t) && !/\b(?:who|in|from|with|and)\b/.test(t);
  const inQuote = (text, i) => (text.slice(0, i).match(/"/g) || []).length % 2 === 1
    || text.lastIndexOf("\u201c", i) > text.lastIndexOf("\u201d", i);
  // What a card's body says about a person on this showing: "intro", "tag" or nothing.
  function introKind(content, s, role) {
    if (role === "rival") return s.rival && s.rival.seenCard !== (s.cardsPlayed || 0) ? "tag" : null;
    const p = s.cast && s.cast.on[role];
    if (!p) return null;
    if (p.met === undefined || s.year - p.met >= INTRO_AGAIN) return "intro";
    return p.seenCard === (s.cardsPlayed || 0) ? null : "tag";
  }
  function introduce(content, s, text) {
    if (typeof text !== "string" || text.indexOf("{") < 0) return text;
    const roles = (content.cast || {}).roles || {};
    const byRole = new Map();
    for (const m of text.matchAll(/\{([A-Za-z]+)\}/g)) {
      const role = m[1].toLowerCase();
      if (role === "rival" ? !s.rival : !(roles[role] && s.cast && s.cast.on[role])) continue;
      const end = m.index + m[0].length, after = text.slice(end);
      if (!byRole.has(role)) byRole.set(role, []);
      byRole.get(role).push({ at: m.index, end, upper: isUpper(m[1]), poss: /^(?:'s|\u2019s)/.test(after),
        own: /^\s*[,(]/.test(after), quoted: inQuote(text, m.index) });
    }
    const edits = [];   // { at, text } insertions, applied from the end
    for (const [role, ms] of byRole) {
      const kind = introKind(content, s, role);
      if (!kind) continue;
      const tag = role === "rival" ? (EL(content).rivalTag || "your batchmate") : (roles[role].tag || null);
      const phrase = kind === "intro" ? roles[role].intro : tag;
      if (!phrase) continue;
      const open = ms.filter(x => !x.quoted);
      const first = open[0];
      if (!first || first.own) continue;   // the writer introduced them, or only quotes them
      const plain = first.poss ? open.find(x => !x.poss) : first;
      if (plain) {
        if (plain.own) continue;
        const next = text.charAt(plain.end);
        edits.push({ at: plain.end, text: `, ${phrase}${/[.?!;:)"\u201d\u2019\u2014]/.test(next) || !next ? "" : ","}` });
      } else if (tag && nounTag(tag)) {
        // possessives only: the tag goes in front, capitalised at the start of a sentence
        const start = first.upper || /(?:^|[.?!]["\u201d]?\s+)$/.test(text.slice(0, first.at));
        edits.push({ at: first.at, text: `${start ? cap(tag) : tag} ` });
      }
    }
    if (!edits.length) return text;
    let out = text;
    for (const e of edits.sort((a, b) => b.at - a.at)) out = out.slice(0, e.at) + e.text + out.slice(e.at);
    return out;
  }
  // Only for a save made before a card's parts changed: the first option of every slot.
  function fallbackParts(ev) {
    return Object.fromEntries(partSlots(ev).map(([k, sl]) => [k, optId(sl.options[0] || {}, 0)]));
  }

  const REL_WEIGHT = 1.2;   // each point of goodwill is worth this much in a close ranking call
  function rivalScore(s) {
    return 0.5 * s.competence + 0.3 * s.standing + 0.15 * s.reputation + s.rival.edge + (rivalRoll(s) * 20 - 10) + s.rival.mod;
  }
  function rivalLine(content, s, key, extra = {}) {
    const lines = (content.rival.lines || {})[key] || [];
    const n = (s.rival.lineN = (s.rival.lineN || 0) + 1);
    let text = lines.length ? lines[(n - 1) % lines.length] : "";
    for (const [k, v] of Object.entries(extra)) text = text.split("{" + k + "}").join(v);
    // `at`: the state the line was written in (one outcome screen can span several years); the UI ignores it
    return { kind: "rival", key, text: sub(text, s, content), at: { player: s.rank, batchmate: s.rival.rank, status: s.rival.status } };
  }

  // A head-to-head right now (one posting, one slot): the player's appraisal-style score,
  // adjusted by goodwill, against the batchmate's hidden one.
  function rivalContest(content, s, c, t) {
    const v = s.rival;
    const mine = 0.5 * s.competence + 0.3 * s.standing + 0.15 * s.reputation + (rivalRoll(s) * 20 - 10)
      + (c.bonus || 0) + v.rel * REL_WEIGHT;
    const theirs = rivalScore(s);
    const won = mine >= theirs;
    v.met++; if (won) v.wonMet++;
    t.rivalContest = { mine: +mine.toFixed(1), theirs: +theirs.toFixed(1), won };
    applyEffects(s, (won ? c.win : c.lose) || {});
    return [{ kind: "rival", key: won ? "contestWon" : "contestLost", text: sub(won ? c.winText : c.loseText, s, content),
      at: { player: s.rank, batchmate: v.rank, status: v.status } }];
  }

  function rivalChoice(content, s, rc, t) {
    const v = s.rival;
    if (!v || v.status !== "active") return [];
    if (rc.rel) v.rel = clamp(v.rel + rc.rel, -5, 5);
    if (rc.mod) v.mod += rc.mod;
    if (rc.cep) v.cep = clamp(v.cep + rc.cep, 0, 16);
    return rc.contest ? rivalContest(content, s, rc.contest, t) : [];
  }

  // The batchmate's year. Runs before the player's promotion is settled, because when both are
  // promotable at the same grade there is one slot, and the ranking exercise decides who gets it.
  // playerScore: the player's appraisal score when they would otherwise be promoted, else null.
  function rivalYear(content, s, t, playerScore) {
    const v = s.rival, out = { lost: false, log: [] };
    if (!v || v.status !== "active") return out;
    // Their last year is their last year: retirement comes first, so nobody is promoted,
    // ranked or elected in the same breath as their farewell lunch.
    if (s.age + 1 >= (v.rank >= 8 ? content.politicalRetireAge : content.retireAge) && v.rank !== 16) {
      v.status = "retired";
      out.log.push(rivalLine(content, s, "retired", { title: title(content, v.rank) }));
      return out;
    }
    const politicalNow = v.rank >= 8;
    // exits and crossings
    if (s.year > Math.max(v.bondYears, 3) && !(v.rank === 16)) {   // nobody leaves in their first three years
      const x = rivalRoll(s);
      if (x < 0.0015 && v.rank >= 3) { v.status = "scandal"; out.log.push(rivalLine(content, s, v.rank >= 8 ? "scandalPolitics" : "scandal")); return out; }
      if (x < 0.0065 && ((v.rank >= 2 && v.rank <= 7) || (v.rank >= 9 && v.rank <= 14))) {
        v.status = "consultancy"; out.log.push(rivalLine(content, s, v.rank >= 8 ? "consultancyPolitics" : "consultancy")); return out;
      }
      // The party talent-spots batches, not individuals: once the player is in Parliament,
      // their batchmate is far likelier to be asked to tea as well.
      const ge = !!t.election;   // this turn was a general election the player stood in
      const canCross = s.rank >= 8 ? ge : true;
      if (!politicalNow && !v.triedPolitics && v.rank >= 4 && v.rank <= 7 && canCross
          && rivalRoll(s) < (s.rank >= 8 ? 0.45 : 0.06)) {
        v.triedPolitics = true;
        if (rivalRoll(s) < 0.78) {
          v.rank = 8; v.yearsInGrade = 0; v.political = true;
          v.cep = clamp(11 + Math.floor(rivalRoll(s) * 6), 11, 16);
          out.log.push(rivalLine(content, s, ge ? "electedTogether" : "elected"));
        } else out.log.push(rivalLine(content, s, ge ? "lostSeatTogether" : "lostSeat"));
        return out;
      }
    }
    v.yearsInGrade++;
    const score = rivalScore(s);
    v.mod = 0;
    const need = yearsNeeded(content, s.origin, v.rank);   // same intake, same fast lane
    const gradeOk = score >= 72 || (score >= 58 && v.rank < 13);
    // If the player backed someone else in the succession, that someone is Prime Minister, not the batchmate.
    const pmTaken = s.rank === 16 || (s.flags.includes("kingmaker") && !s.flags.includes("backed_batchmate"));
    // Same intake, same age: the service's age floors (ladder minAge) hold the batchmate too.
    let promotable = gradeOk && v.yearsInGrade >= need && v.rank < v.cep && v.rank !== 7 && v.rank < 16
      && !(v.rank === 15 && pmTaken) && (content.ladder[v.rank + 1].minAge || 0) <= s.age;
    // The ranking exercise ranks everyone at a grade every year. When the player is up for
    // promotion and the batchmate is at the same grade (and not at their own ceiling), the one
    // ranked lower waits. The batchmate takes the slot only if they are eligible themselves.
    if (playerScore !== null && v.rank === s.rank && v.rank < v.cep) {
      const mine = playerScore + v.rel * REL_WEIGHT;
      const won = mine >= score;
      v.met++; if (won) v.wonMet++;
      t.ranking = { mine: +mine.toFixed(1), theirs: +score.toFixed(1), won, theyWentUp: !won && promotable };
      const pol = s.rank >= 8;
      if (won) { promotable = false; out.log.push(rivalLine(content, s, pol ? "winPolitics" : "winService")); }
      else {
        out.lost = true;
        out.log.push(rivalLine(content, s, promotable ? (pol ? "losePolitics" : "loseService") : (pol ? "rankedBelowPolitics" : "rankedBelowService")));
      }
    }
    if (promotable) {
      v.rank++; v.yearsInGrade = 0;
      if (v.rank === 16) out.log.push(rivalLine(content, s, "pm"));
      else if (!out.lost) {
        const apart = (v.rank >= 8) !== (s.rank >= 8);   // one of you in Parliament, the other in the service
        out.log.push(rivalLine(content, s, apart ? "promotedApart" : v.rank >= 9 ? "appointed" : "promoted", { title: title(content, v.rank) }));
      }
    }
    // a Prime Minister batchmate is a closed door
    if (playerScore !== null && s.rank === 15 && v.rank === 16 && !out.lost) {
      out.lost = true; out.log.push(rivalLine(content, s, "pmBlocked"));
    }
    return out;
  }

  // --- the header -------------------------------------------------------------
  // Lines the engine writes around the cards (game.json engineLines): page headings, why a year
  // needed no decision, why the pay moved, the header's place, the sideways move. A {key} is
  // filled from `fill`; anything else is left as it is.
  const EL = content => content.engineLines || {};
  const fillT = (t, fill) => String(t).replace(/\{(\w+)\}/g, (m, k) => (fill[k] !== undefined ? fill[k] : m));
  // Where the player is, as the header's second line says it: the ministry in the service and
  // for an office holder (the ministry they serve in); a backbencher's seat; the Prime
  // Minister's Office; and, on the election card itself, a candidate who has left the service.
  function placeOf(content, s) {
    const P = EL(content).place || {};
    if (s.rank === 16) return P.pm || "Prime Minister's Office";
    if (s.rank === 8) return s.flags.includes("seat_smc") ? P.smc || "Member for a single seat"
      : s.flags.includes("seat_grc") ? P.grc || "Member for a GRC" : P.mp || "Member of Parliament";
    if (s.rank < 8 && s.currentEvent === "the_election" && P.candidate) return P.candidate;
    return s.ministry;
  }
  // The header as data: rank, grade, age, year, place, lifetime earnings (a number) and the
  // batchmate line. The UI and the harness both draw it from here. No stat is ever in it.
  function header(content, s) {
    const r = content.ladder[s.rank];
    return { title: r.title, grade: r.grade, age: s.age, year: s.year, place: placeOf(content, s),
      wealth: s.wealth, batchmate: batchmate(content, s) };
  }
  // A page's header: the state at the end of that page, dated to the year the page is about
  // (the year-end review ages the player on its last line).
  const pageHead = (content, s, at) => ({ ...header(content, s), age: at.age, year: at.year });
  // A page heading: the year, the age, and what the page is.
  function yearHeading(content, kind, at) {
    const Y = EL(content).yearHeading || {};
    const t = Y[kind] || (kind === "review" ? "Year {year} · Age {age} · Year-end review" : "Year {year} · Age {age} · A year without a decision");
    return { kind: "year", text: fillT(t, { year: at.year, age: at.age }), year: at.year, age: at.age, page: kind };
  }

  // What the header says about the batchmate: their name and where they are.
  function batchmate(content, s) {
    const v = s.rival;
    if (!v) return null;
    const where = v.status === "consultancy" ? "left for the private sector"
      : v.status === "scandal" ? "resigned"
      : v.status === "retired" ? `retired as ${title(content, v.rank)}`
      : title(content, v.rank);
    return `${v.name} · ${where}`;
  }

  // Deterministic: derive the stream position from state so saves resume identically.
  function roll(s) {
    const r = rng(s.seed + s.rngCalls * 7919);
    s.rngCalls++;
    return r();
  }

  // --- event selection -------------------------------------------------
  // content (optional) adds the career's own clock: a card listed in endgame.lastCalls is not
  // offered within that many years of the service's retirement age (nobody is asked to tea for an
  // election they would retire before).
  function eligible(ev, s, content) {
    if (ev.triggered) return false;
    if (ev.once && s.seen.includes(ev.id)) return false;
    if (spent(ev, s)) return false;   // a repeatable card with nothing new to say this run
    if (content && tooLate(content, ev, s)) return false;
    // a series' opening card (series.opens) is its first showing, so it never comes once the
    // series has begun (a save from before the card opened it)
    if (ev.series && ev.series.opens && seriesOf(ev, s)) return false;
    return cardOk(ev, s);
  }
  function tooLate(content, ev, s) {
    const n = ((content.endgame || {}).lastCalls || {})[ev.id];
    return n !== undefined && s.rank < 8 && content.retireAge - s.age < n;
  }

  // --- the end of a career ---------------------------------------------------
  // A career that ends by age is told so. The year-end reviews two years and one year before
  // the last year say plainly that the end is coming (endgame.foreboding), and the last year
  // itself is a card of its own, which takes that year whatever else falls due.
  //   The service: officers retire at retireAge, so the last year is the one before it. An
  //   officer who went to tea and has the election still ahead has resigned to stand: the
  //   service's clock waits for the result.
  //   Politics: the party asks Members not to stand at the first general election after they
  //   turn endgame.renewalAge, the year before it falls due (the renewal card), and that election
  //   ends the career. A Member doing very well (endgame.stayOn) is asked to stay instead, and
  //   may; nobody serves past politicalRetireAge, the hard stop for everyone.
  //   The Prime Minister: a short tenure of cards of its own (endgame.pmTenure), then the
  //   ending. Promotion to the top needs room for at least the shortest tenure before the stop.
  const END = content => content.endgame || null;
  const EARLIEST = (s, id) => s.scheduled.filter(x => x.eventId === id).reduce((a, x) => (a === null || x.fireYear < a ? x.fireYear : a), null);
  function entryPending(s) {
    return s.rank < 8 && s.flags.includes("went_to_tea") && !s.flags.includes("tea_withdrawn")
      && s.scheduled.some(x => x.eventId === "the_vetting" || x.eventId === "the_election");
  }
  // { track, kind, last }: the age of the career's last year, or null when no end by age is in
  // view (a Prime Minister, a candidate waiting for an election). kind is "retire" (the service),
  // "election" (the renewal election) or "limit" (the hard stop).
  function endPlan(content, s) {
    const E = END(content);
    if (!E || s.rank === 16) return null;
    if (s.rank < 8) return entryPending(s) ? null : { track: "service", kind: "retire", last: Math.max(content.retireAge - 1, s.age) };
    const limit = content.politicalRetireAge - 1;
    if (s.flags.includes("stays_on")) return { track: "politics", kind: "limit", last: limit };
    const next = EARLIEST(s, "re_election");
    let at = next === null ? Infinity : s.age + Math.max(0, next - s.year);
    while (at < E.renewalAge) at += E.term || 5;
    return at <= limit ? { track: "politics", kind: "election", last: at } : { track: "politics", kind: "limit", last: limit };
  }
  // Whether next year's card is already decided by the career's end (so no improvement plan,
  // reshuffle or ranking can be promised for it).
  function endNext(content, s, plan) {
    if (!plan) return false;
    const renewalAhead = plan.track === "politics" && !s.flags.includes("stays_on") && s.leaving === undefined;
    return s.age + 1 >= plan.last - (renewalAhead ? 1 : 0);
  }
  function stayOffered(content, s, plan) {
    const E = END(content);
    return !!E.stayOn && plan.kind === "election" && plan.last < content.politicalRetireAge - 1 && meets(E.stayOn, s);
  }
  // The card this year must be, if the career's end decides it; null otherwise.
  function endgameCard(content, s) {
    const E = END(content);
    if (!E || !E.cards) return null;
    let id = null;
    if (s.rank === 16) {
      const T = s.pmTenure;
      if (T) id = T.cards[Math.min(T.cards.length - 1, s.year - T.since)] || null;
      if (id && s.seen.includes(id)) id = null;
    } else if (s.lastYear === undefined) {
      const p = endPlan(content, s);
      if (p && s.age >= p.last) id = p.track === "service" ? E.cards.lastService : E.cards.lastPolitics;
      else if (p && p.track === "politics" && !s.flags.includes("stays_on") && s.leaving === undefined && s.age === p.last - 1)
        id = stayOffered(content, s, p) ? E.cards.stay : E.cards.renewal;
      if (id) s.endKind = p.kind;   // the card's text says which end it is (requires.endKind)
    }
    return id ? allEvents(content, s).find(e => e.id === id) || null : null;
  }
  // A choice on one of those cards: the last year is marked (its year-end ends the career), the
  // renewal is accepted, or the offer to stay is taken up.
  function endgameChoice(s, ev, ch, t) {
    if (ev.endgame === "last") s.lastYear = s.year;
    if (ev.endgame === "renewal" || ch.leaving) s.leaving = s.year;
    if (ev.endgame === "pm" && s.pmTenure && s.pmTenure.cards[s.pmTenure.cards.length - 1] === ev.id) s.lastYear = s.year;
    t.endgame = { card: ev.id, kind: ev.endgame };
  }
  // On taking office: the tenure's cards, as many as fit before the hard stop.
  function startTenure(content, s) {
    const E = END(content), P = E && E.pmTenure;
    if (!P) return false;
    const room = content.politicalRetireAge - 1 - s.age;
    const n = Math.max(...Object.keys(P.cards).map(Number).filter(k => k <= room));
    const cards = P.cards[n];
    if (!cards || !cards.every(id => content.events.some(e => e.id === id))) return false;
    s.pmTenure = { since: s.year + 1, at: s.age, cards };
    return true;
  }
  // Whether a Deputy Prime Minister promoted at this review would have room for a tenure.
  function pmRoom(content, s, age = s.age) {
    const P = (END(content) || {}).pmTenure;
    return !P || content.politicalRetireAge - 1 - age >= Math.min(...Object.keys(P.cards).map(Number));
  }
  // Next year's ranking (or reshuffle): "in" when it will consider the player (the years in grade
  // will be there, and no age floor, candidacy or career's end takes the year), "ceiling" when only
  // the ceiling keeps them out of it, null otherwise.
  function nextRanking(content, s) {
    const r = s.rank;
    if (r >= 16 || r === 7) return null;
    if (s.yearsInGrade + 1 < yearsNeeded(content, s.origin, r)) return null;
    // a candidate whose election is next year may not be in the service for next year's ranking
    if (entryPending(s) && s.scheduled.some(x => x.eventId === "the_election" && x.fireYear <= s.year + 1)) return null;
    if (r >= 8 && s.leaving !== undefined) return null;
    // the career's end takes next year, unless next year is the party's offer to stay (known
    // now: rank and Standing do not move before it), when the ranking goes ahead for those who stay
    const plan = endPlan(content, s);
    if (endNext(content, s, plan) && !(plan.track === "politics" && plan.kind === "election" && s.age + 1 === plan.last - 1
        && !s.flags.includes("stays_on") && stayOffered(content, s, { ...plan }))) return null;
    // the ceiling comes first, as it does at the review itself (before the age floor, the
    // succession given away, a batchmate in the top job, or too little time for a tenure)
    if (r >= s.cep) return "ceiling";
    if (r === 15 && (s.flags.includes("kingmaker") || (s.rival && s.rival.status === "active" && s.rival.rank === 16) || !pmRoom(content, s, s.age + 1))) return null;
    return floorAge(content, s, r + 1) > s.age + 1 ? null : "in";
  }
  // Signals for next year, each said once: the heads-up before a ranking (or, when only the
  // ceiling stands in the way, the quiet news that your name is not on the list), the party's
  // interest before the tea, and a seat that is not safe before a general election.
  function signals(content, s, log, leaving) {
    const E = END(content);
    if (!E) return;
    const seen = (s.headsUp = s.headsUp || {});
    const next = E.headsUp ? nextRanking(content, s) : null;
    const fill = t => t.replace(/\{next\}/g, nextName(content, s.rank)).replace(/\{now\}/g, title(content, s.rank)).replace(/\{need\}/g, s.rank >= 13 ? "an A" : "a B+ or better");
    if (next === "in" && seen.at !== s.rank) {
      const pol = s.rank >= 8, H = pol ? E.headsUp.politics : E.headsUp.service, k = pol ? "politics" : "service";
      // the first one on each ladder says how it works; after that, shorter lines
      const text = s.rank === 15 && H.pm ? H.pm : !seen[k] && H.first ? H.first : endLine(content, s, pol ? "upPolitics" : "upService", H.lines, true);
      seen.at = s.rank; seen[k] = (seen[k] || 0) + 1;
      // (about: for traces and tests; the screen shows only the tag and the text)
      if (text) log.push({ kind: "note", about: "headsUp", rank: s.rank, text: fill(text) });
    } else if (next === "ceiling" && seen.at !== s.rank && seen.blockedAt !== s.rank) {
      const H = s.rank >= 8 ? E.headsUp.politics : E.headsUp.service;
      const text = s.rank === 15 && H.blockedPm ? H.blockedPm : H.blocked;
      seen.blockedAt = s.rank;
      if (text) log.push({ kind: "cep", about: "blocked", rank: s.rank, text: fill(text) });
    }
    const L = E.lines || {};
    // the tea: in reach next year (the grade, the bond, the clock, and both stats within a few points)
    const tea = content.events.find(e => e.id === "tea_session");
    if (L.teaNear && tea && !seen.tea && !s.seen.includes(tea.id) && !["went_to_tea", "declined_tea", "tea_withdrawn"].some(f => s.flags.includes(f))) {
      const q = tea.requires || {}, w = (E.teaNear || {}).within || 5;
      const near = s.rank >= (q.minRank || 0) && s.rank <= (q.maxRank ?? 7) && s.year + 1 > (s.bondYears || 0)
        && !tooLate(content, tea, { ...s, age: s.age + 1 }) && Object.entries(q.minStats || {}).every(([k, v]) => s[k] >= v - w);
      if (near) { seen.tea = true; const text = endLine(content, s, "tea", L.teaNear, true); if (text) log.push({ kind: "note", about: "tea", text }); }
    }
    // a general election next year, in a seat that would not pass as safe
    const F = EARLIEST(s, "re_election"), re = content.events.find(e => e.id === "re_election");
    if (L.seatAtRisk && re && s.rank >= 8 && s.rank < 16 && !leaving && F === s.year + 1 && seen.seat !== F
        && !(re.autoPlay && meets(re.autoPlay.when || {}, s))) {
      seen.seat = F;
      const text = endLine(content, s, "seat", L.seatAtRisk, true);
      if (text) log.push({ kind: "note", about: "seat", text });
    }
  }
  // The next rung up, as a heads-up or a rumour names it. Two rungs can share a title (a Minister
  // is MR4, then MR3): the next one is then named so that it never reads as the rank the player
  // already holds (engineLines.nextSameTitle).
  function nextName(content, r) {
    const L = content.ladder, next = L[Math.min(r + 1, L.length - 1)];
    if (!L[r] || next.title !== L[r].title) return next.title;
    return fillT(EL(content).nextSameTitle || "{grade}, the next grade up", { title: next.title, grade: next.grade });
  }
  // A line from one of the endgame pools, never twice in a run (cycle: taken again in order).
  function endLine(content, s, key, lines, cycle, fill = {}) {
    if (!lines || !lines.length) return null;
    const i = pickLine(s, "__end:" + key, lines.length, cycle);
    if (i === null) return null;
    useLine(s, "__end:" + key, i);
    return lines[i].replace(/\{(\w+)\}/g, (m, k) => (fill[k] !== undefined ? fill[k] : m));
  }

  // A card can be shown when its requirements hold, every cast member its text names is in
  // their role, and its parts (if any) have at least one combination that fits.
  function cardOk(ev, s) {
    return meets(ev.requires || {}, s) && rolesFilled(roleNeeds(ev), s) && (!ev.parts || partsFit(ev, s));
  }

  // A scheduled consequence waits, still scheduled, until its own requirements hold (a
  // promotion-board callback never lands on a Minister). It is never silently dropped.
  function fits(ev, s) {
    return !!ev && !(ev.once && s.seen.includes(ev.id)) && cardOk(ev, s);
  }

  // A scheduled card may list alternates: written for wherever the player has got to by the
  // time it falls due. The first of [card, ...alternates] whose requirements hold fires.
  function resolve(content, id, s) {
    const events = allEvents(content, s);
    const ev = events.find(e => e.id === id);
    if (!ev) return null;
    const all = [ev, ...(ev.alternates || []).map(a => events.find(e => e.id === a))];
    return all.find(x => fits(x, s)) || null;
  }

  function meets(q, s) {
    if (q.minRank !== undefined && s.rank < q.minRank) return false;
    if (q.maxRank !== undefined && s.rank > q.maxRank) return false;
    if (q.minAge !== undefined && s.age < q.minAge) return false;
    if (q.maxAge !== undefined && s.age > q.maxAge) return false;
    if (q.originNot && q.originNot.includes(s.origin)) return false;
    if (q.origin && !q.origin.includes(s.origin)) return false;
    if (q.notDuringBond && s.year <= s.bondYears) return false;
    if (q.duringBond && s.year > s.bondYears) return false;   // a beat about the bond itself
    if (q.flagsAll && !q.flagsAll.every(f => s.flags.includes(f))) return false;
    if (q.flagsNone && q.flagsNone.some(f => s.flags.includes(f))) return false;
    for (const k in (q.minStats || {})) if (s[k] < q.minStats[k]) return false;
    for (const k in (q.maxStats || {})) if (s[k] > q.maxStats[k]) return false;
    if (q.ministry !== undefined && s.ministry !== q.ministry) return false;   // ministry decks
    if (q.economy !== undefined && economy(s) !== q.economy) return false;
    if (q.electionDue !== undefined && electionDue(s) !== q.electionDue) return false;
    if (q.act !== undefined && (q.act === "III") !== (s.rank >= 8)) return false;   // I: the service, III: politics
    if (q.endKind !== undefined && s.endKind !== q.endKind) return false;   // which end a last-year card is about
    if (q.warned !== undefined && (s.consecutiveD >= 1) !== q.warned) return false;   // on a formal warning (a D)
    if (q.cast && !castMeets(q.cast, s)) return false;
    if (q.cooldown) {   // a shared clock: e.g. one Budget-cycle card every three years
      const last = (s.cooldowns || {})[q.cooldown.key];
      if (last !== undefined && s.year - last < q.cooldown.years) return false;
    }
    if (q.rival) {   // batchmate cards: only with an active batchmate in the right position
      const v = s.rival;
      if (!v || v.status !== "active") return false;
      if (q.rival.sameRank && v.rank !== s.rank) return false;
      if (q.rival.ahead && !(v.rank > s.rank)) return false;
      if (q.rival.minRank !== undefined && v.rank < q.rival.minRank) return false;
      if (q.rival.maxRank !== undefined && v.rank > q.rival.maxRank) return false;
      if (q.rival.relMin !== undefined && v.rel < q.rival.relMin) return false;
      if (q.rival.near !== undefined && Math.abs(v.rank - s.rank) > q.rival.near) return false;
    }
    return true;
  }

  // The economy, one draw per three-year cycle, derived from the seed so it never moves the
  // run's own dice: most cycles are strong, about a third are a downturn.
  function economy(s) {
    return rng((s.seed * 131 + Math.floor(s.year / 3) * 7919 + 17) >>> 0)() < 0.35 ? "downturn" : "strong";
  }
  // A general election falls due within the year (the player's own re-election is scheduled).
  function electionDue(s) {
    return s.scheduled.some(x => x.eventId === "re_election" && x.fireYear - s.year <= 1);
  }

  // Every card the run can draw: the batchmate's only when there is one.
  function allEvents(content, s) {
    // batchmate cards first, so a batchmate priority card (First Among Equals) stands in for the generic one
    return s && s.rival && content.rival ? (content.rival.events || []).concat(content.events) : content.events;
  }

  // info (optional) says where the card came from, for playtest traces.
  function pickEvent(content, s, info = {}) {
    // 0. the career's end takes its years (the renewal, the last year, a Prime Minister's
    //    tenure): anything scheduled for them carries over, as below
    const end = endgameCard(content, s);
    if (end) { info.source = "priority"; info.endgame = end.id; return end; }
    // 0b. a card that opens a chapter ("priority": "first": the maiden speech, a new Member's
    //     first card) comes before anything scheduled, which waits its turn as below
    const opener = allEvents(content, s).find(e => e.priority === "first" && eligible(e, s, content));
    if (opener) { info.source = "priority"; return opener; }
    // 1. scheduled consequences pre-empt everything. One fires a year; when several fall
    //    due together, the rest carry over to the following years, earliest first.
    const due = s.scheduled.filter(x => x.fireYear <= s.year && resolve(content, x.eventId, s));
    if (due.length) {
      const next = due.reduce((a, b) => (b.fireYear < a.fireYear ? b : a));
      s.scheduled.splice(s.scheduled.indexOf(next), 1);
      const ev = resolve(content, next.eventId, s);
      if (ev) { info.source = "scheduled"; info.fired = next; return ev; }
    }
    const pool = allEvents(content, s).filter(e => eligible(e, s, content));
    if (!pool.length) { info.source = "quiet"; return null; }
    // 2. priority events (tea session, succession) fire the moment they qualify
    const pri = pool.filter(e => e.priority);
    if (pri.length) { info.source = "priority"; return pri[0]; }
    // 3. weighted random
    info.source = "random";
    const w = e => (e.weight || 5) * (s.recent && s.recent.includes(e.id) ? (content.freshness || 0.35) : 1);
    const total = pool.reduce((n, e) => n + w(e), 0);
    let x = roll(s) * total;
    for (const e of pool) { x -= w(e); if (x <= 0) return e; }
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
    const list = (content.folder || []).concat(s.rival && content.rival ? content.rival.folder || [] : []);
    return list.filter(f => s.flags.includes(f.flag)).map(f => sub(f.item, s, content));
  }

  // The folder's lines (engineLines.folder). The party's people are unnamed officials, so no line
  // gives them a "he" or "she" (WRITING_RULES 4.8).
  const FOLDER = {
    thin: "The folder on the table is thin. The person reading it seems, very slightly, disappointed.",
    item: "In the folder: {item}.",
    nothing: "There is nothing to disclose. Your interviewer closes the folder, which takes no time at all.",
    disclosed: "You disclose {item}. The interviewer writes something down.",
    found: "{item}: on day four of the campaign, someone has found it."
  };
  const folderLine = (content, key, item) => fillT((EL(content).folder || {})[key] || FOLDER[key], { item });
  function readFolder(content, s) {
    const items = folderItems(content, s);
    if (!items.length) return [{ kind: "folder", text: folderLine(content, "thin") }];
    return items.map(i => ({ kind: "folder", text: folderLine(content, "item", i) }));
  }

  function answerFolder(content, s, mode, t) {
    const items = folderItems(content, s), log = [];
    t.folder = { mode, items: items.length };
    if (mode === "disclose") {
      if (!items.length) log.push({ kind: "folder", text: folderLine(content, "nothing") });
      for (const i of items) {
        s.standing = clamp(s.standing - 5, 0, 100);
        s.integrity = clamp(s.integrity + 2, 0, 100);
        log.push({ kind: "folder", text: folderLine(content, "disclosed", i) });
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
    const e = { eventId: "the_election", fireYear: s.year + 1 };
    s.scheduled.push(e);
    (t.added = t.added || []).push(e);
    return log;
  }

  // Concealed items surface during the campaign, more often the higher the Heat.
  function campaignSurfacing(content, s, t) {
    const log = [];
    for (const i of (s.concealed || [])) {
      if (roll(s) < 0.2 + s.heat / 250) {
        s.reputation = clamp(s.reputation - 7, 0, 100);
        s.heat = clamp(s.heat + 6, 0, 100);
        log.push({ kind: "folder", text: folderLine(content, "found", cap(i)) });
      }
    }
    t.surfaced = log.length;
    s.concealed = [];
    return log;
  }

  function applyEffects(s, fx) {
    for (const k of STATS) if (fx[k]) s[k] = clamp(s[k] + fx[k], 0, 100);
    if (fx.wealth > 0) s.wealth += fx.wealth;   // lifetime earnings never go down
    if (fx.heat) s.heat = clamp(s.heat + fx.heat, 0, 100);
    if (fx.cep) s.cep = clamp(s.cep + fx.cep, 0, 16);
  }

  // --- applying a choice ----------------------------------------------
  // opts.safe: a re-election that passed by itself (the seat was safe). It is won outright: a seat
  // is only ever lost on a card the player saw.
  function applyChoice(content, s, ev, ch, t = {}, opts = {}) {
    const log = [];
    const fx = ch.effects || {};
    for (const k of STATS) if (fx[k]) s[k] = clamp(s[k] + fx[k], 0, 100);
    if (fx.wealth > 0) s.wealth += fx.wealth;   // lifetime earnings never go down
    if (fx.heat) s.heat = clamp(s.heat + fx.heat, 0, 100);
    if (fx.cep) s.cep = clamp(s.cep + fx.cep, 0, 16);
    // "It is noted": a choice that embarrassed someone senior costs this year's appraisal.
    if (fx.appraisal) {
      s.appraisalMod += fx.appraisal;
      // say so when it happens, not only at year-end
      if (!opts.safe) log.push({ kind: "noted", text: fx.appraisal < 0
        ? "This will count against you at this year's appraisal."
        : "This will count in your favour at this year's appraisal." });
    }
    // The minister's own policy choice sets next year's National Bonus, in months (0-6).
    if (ch.nationalBonus !== undefined) {
      s.nbMonths = clamp(ch.nationalBonus, 0, 6);
      // the plan can miss: then the bonus is what the indicators say, and so is the outcome
      const risk = ch.nationalBonusRisk;
      if (risk && roll(s) < risk.chance) {
        s.nbMonths = clamp(risk.months, 0, 6);
        t.outcome = risk.outcome;
        t.bonusMissed = true;
      }
    }

    (ch.setFlags || []).forEach(f => { if (!s.flags.includes(f)) s.flags.push(f); });
    if (ev.endgame) endgameChoice(s, ev, ch, t);
    // What the choice did to or for a cast member stays with that person.
    if (ch.cast) castOps(content, s, ch.cast, t, ev.who);
    // A card whose story hands a role to someone new (ev.replaces: ["senior"]: a new reporting
    // officer takes over): whichever choice is made, the person the card named leaves the story,
    // and the role refills with a newcomer at the castSync below, before the next card.
    if (ev.replaces) {
      const named = ev.replaces.filter(r => !ev.who || ev.who[r] === undefined || (s.cast && s.cast.on[r] && s.cast.on[r].id === ev.who[r]));
      const left = moveOn(s, named, "replaced");
      if (left.length) (t.cast = t.cast || []).push(...left.map(x => ({ ...x, leave: "replaced" })));
    }
    // Standout moments in the service. Two of them mark the file "exceptional", which lets the
    // top rungs' age floors give a little (ladder minAgeExceptional). Rare by design.
    if ((ch.standout || ev.standout) && s.rank < 8) {
      s.standouts = (s.standouts || 0) + 1;
      if (s.standouts >= (content.exceptionalAfter || 2) && !s.flags.includes("exceptional")) {
        s.flags.push("exceptional");
        s.exceptionalAt = { age: s.age, title: ev.title };
        t.exceptional = true;
      }
    }
    // The improvement plan: being eased out always follows a card the player saw.
    if (ch.pip) s.pipDone = true;
    if (ch.resetWarnings) { s.consecutiveD = 0; s.consecutiveC = 0; }
    (ch.markSeen || []).forEach(id => { if (!s.seen.includes(id)) s.seen.push(id); });
    (ch.clearFlags || []).forEach(f => { s.flags = s.flags.filter(x => x !== f); });
    if (ev.once && !s.seen.includes(ev.id)) s.seen.push(ev.id);

    for (const sc of (ch.schedule || [])) {
      if (roll(s) <= (sc.chance === undefined ? 1 : sc.chance)) {
        const e = { eventId: sc.eventId, fireYear: s.year + sc.inYears };
        s.scheduled.push(e);
        (t.added = t.added || []).push(e);   // for traces: what this choice scheduled
      }
    }
    if (ch.setRank !== undefined) s.rank = ch.setRank;
    // A sponsorship that comes with a bond of its own: the years are served after any bond
    // still running, and the bond keeps its usual teeth (notDuringBond cards wait for it).
    if (ch.bond) s.bondYears = Math.max(s.bondYears || 0, s.year) + ch.bond;
    // Batchmate cards: goodwill, their next score, their ceiling, or a head-to-head now.
    if (ch.rival && s.rival) log.push(...rivalChoice(content, s, ch.rival, t));
    // A reshuffle moves the minister to a different ministry, and the header says so.
    if (ch.newMinistry) {
      const pool = Array.isArray(ch.newMinistry) ? ch.newMinistry : content.ministries;
      const others = pool.filter(m => m !== s.ministry).length ? pool.filter(m => m !== s.ministry) : content.ministries.filter(m => m !== s.ministry);
      s.ministry = others[Math.floor(roll(s) * others.length)];
      // a story that began in the old ministry must not carry on as if it were in this one
      if (!s.flags.includes("moved_ministry")) s.flags.push("moved_ministry");
      log.push({ kind: "note", text: `You are moved to the ${s.ministry}. The handover notes run to 140 pages, and the first page says "for information".` });
    }

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
      const won = opts.safe ? true : roll(s) < chance;
      t.election = { kind: "incumbent", chance, won, safe: !!opts.safe };
      if (won && s.reputation >= 75 && !s.flags.includes("noticed_swing")) {
        // A strong personal vote is the one thing the party cannot estimate in advance. Once per career.
        s.cep = clamp(s.cep + 1, 0, 16);
        s.flags.push("noticed_swing");
        t.election.noticed = true;
        log.push({ kind: "promo", text: "Your ward swings towards you by six points, the best result in the region. Someone in the party notices, and writes it down." });
      } else if (won) {
        const lines = content.reElectionLines || ["The team is returned."];
        s.reElections = (s.reElections || 0) + 1;
        const i = pickLine(s, "__reElection", lines.length, true);
        useLine(s, "__reElection", i);
        log.push({ kind: "promo", text: lines[i] });
      }
      else s.ending = "lostward";
    } else if (ch.election) {
      log.push(...campaignSurfacing(content, s, t));
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
    // the cast follows the player: a junior stays behind in the service, a fellow MP arrives
    if (!s.ending) castSync(content, s, log);
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

  // Years in grade before a promotion. Senior rungs cost time as well as stats: Cabinet does not
  // turn over quickly. An origin's fast lane (the scholars' Administrative Service clock) halves
  // the wait below a given rank; it starts nobody higher up.
  function fastLane(content, originId, r) {
    const o = content.origins.find(x => x.id === originId);
    return !!(o && o.fastLane && r < o.fastLane.untilRank);
  }
  function yearsNeeded(content, originId, r) {
    if (fastLane(content, originId, r)) return content.origins.find(x => x.id === originId).fastLane.yearsInGrade;
    // endgame.yearsInGrade, by rank, sets the political ladder's pace (careers end by 70)
    const P = (content.endgame || {}).yearsInGrade;
    if (P && P[r] !== undefined) return P[r];
    return content.minYearsInGrade + (r >= 10 ? 1 : 0) + (r >= 13 ? 1 : 0) + (r >= 15 ? 1 : 0);
  }

  // The age floor on a rung (ladder minAge). A file marked exceptional (two standout moments)
  // may use the rung's minAgeExceptional instead, and nothing goes lower than that.
  function floorAge(content, s, r) {
    const L = content.ladder[r];
    if (!L) return 0;
    if (s.flags.includes("exceptional") && L.minAgeExceptional !== undefined) return L.minAgeExceptional;
    return L.minAge || 0;
  }

  function appraise(content, s) {
    const noise = (roll(s) * 10) - 5;
    const mod = s.appraisalMod;
    const wit = witnessDue(content, s);   // hidden witnesses whose judgement lands this year
    const score = 0.50 * s.competence + 0.30 * s.standing + 0.15 * s.reputation + noise + mod + wit.mod;
    s.appraisalMod = 0;
    return { grade: gradeAt(content, score), score, noise, mod, wit };
  }
  const gradeAt = (content, x) => content.grades.find(g => x >= g.min) || content.grades[content.grades.length - 1];

  // --- the four stats, in words ---------------------------------------------------
  // The stats are never shown as numbers during play, only in words (content.statWords): the
  // appraisal's "why" line in a year that needs explaining, one quiet line when a single choice
  // moves a stat a long way, a locked choice's reason, and the verdicts on the ending screen.
  // Each phrasing is drawn from the seed on its own stream, never twice in a row, so the run's
  // dice never move.
  const APPRAISAL = { competence: 0.50, standing: 0.30, reputation: 0.15 };
  function voice(s, key, lines) {
    if (!lines || !lines.length) return null;
    const v = (s.voice = s.voice || {}), [n, last] = v[key] || [0, -1];
    const r = rng((s.seed ^ hashStr("voice:" + key + "#" + n)) >>> 0);
    let i = Math.floor(r() * lines.length);
    if (i === last && lines.length > 1) i = (i + 1 + Math.floor(r() * (lines.length - 1))) % lines.length;
    v[key] = [n + 1, i];
    return lines[i];
  }
  // {A} the strong suit, {B} the weak spot, {competence} etc. by name; sentences start with a capital
  function sayStats(text, names, fill) {
    return text.replace(/\{(\w+)\}/g, (m, k) => fill[k] !== undefined ? fill[k] : names[k] !== undefined ? names[k] : m)
      .replace(/(^|[.!?]\s+)([a-z])/g, (m, p, c) => p + c.toUpperCase());
  }

  // What the appraisal was made of, kept for the end of the year: the "why" line is written only
  // when there is something to explain (see yearEnd).
  function whyFacts(content, s, grade, mod) {
    const gradeAt = x => content.grades.find(g => x >= g.min) || content.grades[content.grades.length - 1];
    const base = 0.50 * s.competence + 0.30 * s.standing + 0.15 * s.reputation;
    return { grade: grade.code, fromStats: gradeAt(base).code, withChoices: gradeAt(base + mod).code, mod,
      rank: s.rank, year: s.year, stats: { competence: s.competence, standing: s.standing, reputation: s.reputation } };
  }

  // The strong suit (60 or more) and the weak spot (under 45, the one costing the grade the most)
  // among the three stats an appraisal weighs, and the shape they make.
  function statShape(st) {
    const keys = Object.keys(APPRAISAL);
    const strong = keys.filter(k => st[k] >= 60).sort((a, b) => st[b] - st[a])[0];
    const weak = keys.filter(k => st[k] < 45).sort((a, b) => APPRAISAL[b] * (60 - st[b]) - APPRAISAL[a] * (60 - st[a]))[0];
    const shape = keys.every(k => st[k] >= 60) ? "strong" : strong && weak ? "contrast" : strong ? "carried" : weak ? "thin" : "even";
    return { shape, strong, weak, key: [shape, strong || "", weak || ""].join(":") };
  }

  // Why the grade came out as it did, in plain words. The stats are named only when that is news:
  // the first appraisal, a warning (opts.stats), or a strong suit or weak spot that has changed since
  // they were last named. Otherwise the line says what a choice or the year's luck did, which way the
  // file moved (opts.moved), or that last year's grade was off the file (opts.lastOff). Returns ""
  // when there is nothing new to say.
  function appraisalWhy(content, s, f, opts) {
    const W = content.statWords || {}, P = W.why || {}, v = s.voice;
    const names = (W.names || {})[f.rank >= 8 ? "politics" : "service"] || {};
    const order = content.grades.map(g => g.code);   // best first
    const say = (key, fallback, fill) => sayStats(voice(s, "why." + key, P[key]) || fallback, names, fill || {});
    const tails = [];
    if (f.mod < 0) tails.push(f.withChoices !== f.fromStats
      ? say("choiceDown", "A choice this year that counted against you took the grade down to {grade}.", { grade: f.withChoices })
      : say("choiceAgainst", "A choice this year counted against you."));
    if (f.mod > 0) tails.push(f.withChoices !== f.fromStats
      ? say("choiceUp", "A choice this year that counted in your favour lifted the grade to {grade}.", { grade: f.withChoices })
      : say("choiceFor", "A choice this year counted in your favour."));
    if (f.grade !== f.withChoices) {
      const better = order.indexOf(f.grade) < order.indexOf(f.withChoices);
      tails.push(f.year <= 1 && f.grade === "C" && f.withChoices === "D" ? "A first appraisal never goes below C."
        : say(better ? "luckUp" : "luckDown", better ? "A good year lifted the grade to {grade}." : "A bad year took the grade down to {grade}.", { grade: f.grade }));
    }
    const parts = [];
    if (opts.first && W.whyFirst) parts.push(W.whyFirst);
    const sh = statShape(f.stats);
    if (opts.stats || sh.key !== v.said) {
      const line = voice(s, "why." + sh.shape, P[sh.shape]);
      if (line) { parts.push(sayStats(line, names, { A: names[sh.strong], B: names[sh.weak] })); v.said = sh.key; v.wordsAt = s.cardsPlayed || 0; }
    } else if (!tails.length && opts.moved) parts.push(say(opts.moved > 0 ? "better" : "worse", opts.moved > 0 ? "Your file is stronger than it was a year ago." : "Your file is weaker than it was a year ago."));
    else if (!tails.length && opts.lastOff) parts.push(say(opts.lastOff > 0 ? "lastHigh" : "lastLow", opts.lastOff > 0 ? "Last year's grade was higher than your file deserved, and this year's is not." : "Last year's grade was lower than your file deserved, and this year's is not."));
    parts.push(...tails);
    if (!parts.length) return "";
    if (f.rank < 8 && order.indexOf(f.grade) > order.indexOf("B+")) parts.push("Promotion needs B+ or better.");
    return parts.join(" ");
  }

  // One quiet line on the outcome screen when a single choice moves a stat by 6 or more: the
  // biggest move, and only when no line has named a stat in the last two cards (a why line that
  // names them counts too), so the stats come up every few cards, not on every one.
  // In politics (pol: the player was an MP or a candidate when they chose) the lines come from
  // statWords.swingPolitics where it has them, since "upstairs" and "outside the building" are the
  // service's; a pool may also name a stat as {standing}, {reputation} or {competence}, in the
  // phase's own words (statWords.names).
  function swingLine(content, s, moved, pol) {
    const SW = content.statWords || {}, at = (s.voice || {}).wordsAt;
    const W = pol && SW.swingPolitics ? SW.swingPolitics : SW.swing, key = W === SW.swing ? "swing" : "swingPolitics";
    if (!W || (at !== undefined && (s.cardsPlayed || 0) - at < 3)) return null;
    const [k, d] = moved.reduce((a, b) => (Math.abs(b[1]) > Math.abs(a[1]) ? b : a), [null, 0]);
    const dir = d > 0 ? "up" : "down";
    const pool = (W[k] || {})[dir] && W[k][dir].length ? W[k][dir] : ((SW.swing || {})[k] || {})[dir];
    if (Math.abs(d) < 6 || !pool) return null;
    const text = voice(s, `${pool === (W[k] || {})[dir] ? key : "swing"}.${k}.${dir}`, pool);
    if (!text) return null;
    s.voice.wordsAt = s.cardsPlayed || 0;
    return { kind: "note", about: "swing", text: sayStats(text, (SW.names || {})[pol ? "politics" : "service"] || {}, {}) };
  }

  // Why a choice is locked, in words: the stat it needs, never the number.
  function lockedText(content, ch) {
    const L = (content.statWords || {}).locked || {};
    return [...new Set(Object.keys(ch.requiresStat || {}).map(k => L[k] || "You are not yet in a position to do this."))].join(" ");
  }

  // The four stats, revealed on the ending screen: each with what it was and what it did to the run.
  function statVerdicts(content, s) {
    const V = (content.statWords || {}).verdicts || {};
    return ["competence", "standing", "reputation", "integrity"].map(k => {
      const v = V[k] || {}, band = (v.bands || []).find(b => s[k] >= b.min);
      return { key: k, label: v.label || cap(k), value: s[k], text: [v.about, band && band.text].filter(Boolean).join(" ") };
    });
  }

  // The words for a grade. A grade may list several (labels; label is the fallback): each time
  // the grade comes round in a run it takes the next one, in an order drawn from the seed on its
  // own stream, so the run's dice never move and a quote only returns after the whole list has
  // been used. Every label quotes its phrase once, in double quotes, for compress().
  function gradeLabel(s, grade) {
    const list = grade.labels && grade.labels.length ? grade.labels : [grade.label];
    const seen = s.gradeSeen || (s.gradeSeen = {});   // a save from before the labels starts at zero
    const n = seen[grade.code] || 0;
    seen[grade.code] = n + 1;
    const r = rng((s.seed ^ hashStr("grade:" + grade.code)) >>> 0);
    const order = list.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    return list[order[n % order.length]];
  }

  // `t` collects what the year-end decided and why, for playtest traces. The UI ignores it.
  // The appraisal's "why" line is written only in a year that may need explaining (the first
  // appraisal, a grade that differs from last year's, a year-end with a promotion or a warning in
  // it), and only if it has something new to say. A steady year shows just the grade and its quote.
  function yearEnd(content, s, t = {}) {
    const prev = (s.history || []).filter(h => h.grade).pop(), rank0 = s.rank;
    const log = reviewYear(content, s, t);
    const i = log.findIndex(l => l.kind === "why" && l.facts);
    if (i < 0) return log;
    const f = log[i].facts, v = (s.voice = s.voice || {}), order = content.grades.map(g => g.code);
    // the grade last year's stats alone were worth, and whether last year's grade was above or
    // below it (a choice or luck), for which way the file moved
    const base0 = v.base, off0 = v.off || 0;
    v.base = f.fromStats;
    v.off = Math.sign(order.indexOf(f.fromStats) - order.indexOf(f.grade));
    const warned = log.some(l => l.kind === "warn");
    const text = !prev || warned || s.rank > rank0 || prev.grade !== f.grade
      ? appraisalWhy(content, s, f, { first: !prev, stats: !prev || warned,
          moved: base0 === undefined ? 0 : Math.sign(order.indexOf(base0) - order.indexOf(f.fromStats)), lastOff: off0 })
      : "";
    if (text) log[i] = { kind: "why", text }; else log.splice(i, 1);
    return log;
  }
  // People who leave the run's story because the player's job changed around them, not by the
  // usual lifecycle: the role is vacant, and refills (from the next castSync that may refill it)
  // with a new person, quietly: whatever moved them has said so, and the newcomer is introduced on
  // the first card they appear on. Their flags stay with them, so no callback lands on a stranger.
  function moveOn(s, roles, why) {
    const K = s.cast, left = [];
    if (!K) return left;
    for (const role of roles) {
      const p = K.on[role];
      if (!p) continue;
      p.left = s.year; p.why = why;
      K.past.push(p); K.on[role] = null; K.vacant[role] = s.year;
      (K.moved = K.moved || {})[role] = s.year;
      left.push({ role, person: p.id });
    }
    return left;
  }
  // Three Cs in a row in the service: HR moves the player sideways, to another division at the
  // same grade. The move is real: the reporting officer (and anyone who reported to the player)
  // stays behind in the old division, and the roles refill from next year with new people.
  const DIVISION = ["senior", "junior"];
  function sideways(content, s, t) {
    const L = EL(content).sideways || {}, K = s.cast;
    const was = K && K.on.senior ? personField(content, s, "senior", K.on.senior, "") : null;
    t.sideways = { left: moveOn(s, DIVISION, "sideways") };
    const text = was
      ? fillT(L.named || "That's three Cs in a row, so HR moves you sideways: the same grade, in another division. From next year your papers go to a new reporting officer instead of {senior}. It's meant as a fresh start. Nobody there asked for you, but the work is real.", { senior: was })
      : L.plain || "That's three Cs in a row, so HR moves you sideways: the same grade, in another division, for a fresh start. Nobody there asked for you, but the work is real.";
    return { kind: "warn", about: "sideways", text };
  }
  const months = n => `${n} month${n === 1 ? "" : "s"}`;
  // The years held at the ceiling (counted on each ladder) that bring a ceiling rumour.
  const CEP_SAID = [1, 2, 4, 7, 11, 16, 22, 29];
  // The pay line: the package, the National Bonus in it (office holders), and from the second
  // year on how it compares with last year, in dollars ("up $6,000 on last year", "the same as last
  // year"). When the player could not tell why it moved, a reason follows: their first year on a
  // new grade's pay, the National Bonus months, or the performance bonus moving with how good their
  // work was. One reason, the biggest; a small rise from the work goes without one (people expect a
  // raise), a fall never does. No stat is named, and no stat's number.
  function payLine(content, s, was, now) {
    const P = EL(content).payWhy || {}, $ = n => "$" + n.toLocaleString();
    const m = n => (n === 0 ? P.none || "none" : months(n));
    const nb = now.nb === null ? "" : fillT(now.nb === 0 ? P.noBonus || " (no National Bonus)" : P.withBonus || " (including a National Bonus of {months})", { months: m(now.nb) });
    let text = fillT(P.line || "Annual package: {pay}{bonus}", { pay: $(now.total), bonus: nb });
    if (!was) return text;
    const d = now.total - was.total;
    if (d === 0) return text + (P.same || ", the same as last year");
    text += fillT(d > 0 ? P.up || ", up {diff} on last year" : P.down || ", down {diff} on last year", { diff: $(Math.abs(d)) });
    let why = null;
    if (was.rank !== now.rank) {
      const t = title(content, now.rank);
      why = fillT(P.rank || "this was your first year paid as {aTitle}", { aTitle: `${article(t)} ${t}` });
    } else if (now.nb !== null && was.nb !== null && was.nb !== now.nb) {
      why = fillT(P.bonus || "the National Bonus went from {was} to {now}, because of how the national targets went", { was: m(was.nb), now: m(now.nb) });
    } else if (d < 0 || now.total >= was.total * (1 + (P.workRise || 0.03))) {
      why = P.work || "your bonus follows how good your work was";
    }
    return why ? `${text}: ${why}` : text;
  }
  function reviewYear(content, s, t) {
    const log = [];
    const pay = payout(content, s);
    const was = s.lastPay;
    s.lastPay = { total: pay, rank: s.rank, nb: s.rank >= 11 ? s.nbMonths : null };
    log.push({ kind: "pay", text: payLine(content, s, was, s.lastPay) });

    s.yearsInGrade++;
    // The career's end: the plan (when the last year comes), whether this is it, and whether the
    // party has already asked you not to stand.
    const E = END(content), plan = endPlan(content, s);
    const finalYear = s.lastYear === s.year, leaving = s.rank >= 8 && s.leaving !== undefined;
    // a year that was due to be the last but was not (a candidate whose invitation lapsed late):
    // the last year is next year
    if (plan && !finalYear && plan.last <= s.age) plan.last = s.age + 1;
    // A Prime Minister has no appraisal: the year is the tenure's card, the package and the news.
    if (s.rank === 16 && s.pmTenure) return pmYearEnd(content, s, t, log, finalYear);
    let { grade, score, noise, mod, wit } = appraise(content, s);
    // The first appraisal comes after months in the job, not years: it can be middling, not a D.
    if (s.year <= 1 && grade.code === "D") grade = content.grades.find(g => g.code === "C") || grade;
    t.appraisal = { grade: grade.code, score, noise, noted: mod };
    // A choice that was noted shows up here, in the one word that matters.
    const label = gradeLabel(s, grade);
    // The letter goes first: the euphemism is the joke, the letter is what it means.
    log.push({ kind: "appraisal", text: `Grade ${grade.code}. ${mod < 0
      ? `${label} The comments section includes the word "however".` : label}` });
    log.push({ kind: "why", facts: whyFacts(content, s, grade, mod) });
    witnessReview(content, s, log, t, grade, score, wit);   // what somebody noticed, if it moved the grade

    // the last review: nothing that follows from a grade (a warning, a plan, a move) is to come
    if (grade.code === "C" && !finalYear) s.consecutiveC++; else s.consecutiveC = 0;
    if (grade.code === "D" && !finalYear) s.consecutiveD++; else { s.consecutiveD = 0; s.pipDone = false; }
    // Probation: nobody is eased out in their first four years, or before their sixth card;
    // a second D is a second warning.
    if (s.consecutiveD >= 2 && (s.year <= (content.probationYears || 4) || (s.cardsPlayed || 0) < (content.probationCards || 6))) {
      s.consecutiveD = 1; t.probation = true;
    }
    // Nobody is eased out without the improvement plan in front of them first.
    if (s.consecutiveD >= 2 && !s.pipDone) { s.consecutiveD = 1; t.pipHeld = true; }
    if (s.consecutiveD >= 2) { s.ending = "quiet"; return log; }
    if (s.consecutiveD === 1) {
      // the warning, in one of several wordings, none twice until all have been used
      const pol = s.rank >= 8, key = pol ? "__warnPolitics" : "__warn";
      const lines = (pol ? content.warnLinesPolitics : content.warnLines) || [pol
        ? "The Whip asks, kindly, whether you have thought about spending more time in your ward. It is phrased as concern."
        : "Your reporting officer asks whether you have considered the private sector. It is phrased as concern."];
      const w = pickLine(s, key, lines.length, true);
      useLine(s, key, w);
      // a plan cannot be started in a year the career's end has already taken: the warning says
      // what happens instead (endgame.warnLate), and no plan is scheduled
      const late = endNext(content, s, plan) && E && E.warnLate;
      const planNext = !late && !s.pipDone && !s.scheduled.some(x => x.eventId === "improvement_plan") && content.events.some(e => e.id === "improvement_plan");
      const then = late
        ? " " + (pol ? (leaving || (plan && s.age + 1 >= plan.last) ? E.warnLate.leaving : E.warnLate.slate) : E.warnLate.service)
        : planNext
        ? (pol ? " A D is a formal warning: next year the Whip will put you on notice, and another D after that ends your time in office."
               : " A D is a formal warning: next year you will be put on an improvement plan, and another D after that and you will be asked to leave.")
        : (pol ? " This is your second warning. Another D next year ends your time in office."
               : " This is your second warning. Another D next year and you will be asked to leave.");
      log.push({ kind: "warn", text: lines[w] + then });
      if (planNext) {
        const e = { eventId: "improvement_plan", fireYear: s.year + 1 };
        s.scheduled.push(e);
        (t.added = t.added || []).push(e);
      }
    }
    if (s.consecutiveC >= 3) {
      s.consecutiveC = 0;
      s.competence = clamp(s.competence + 3, 0, 100);
      if (s.rank >= 8) log.push({ kind: "warn", text: "That's three Cs in a row, so the Whip moves you to chair a parliamentary committee nobody wanted to sit on. The work is real, at least." });
      else log.push(sideways(content, s, t));
    }

    // The last two steps are never given on "strong" alone.
    const needYears = yearsNeeded(content, s.origin, s.rank);
    const fast = fastLane(content, s.origin, s.rank);
    const topRungs = s.rank >= 13;
    const gradeOk = grade.code === "A" || (grade.code === "B+" && !topRungs);
    // Nobody is promoted in their last year, or once the party has asked them not to stand.
    const ending = finalYear || leaving;
    const promotable = gradeOk
      && s.yearsInGrade >= needYears
      && s.rank < 16 && !ending;
    t.promotion = { rank: s.rank, yearsInGrade: s.yearsInGrade, needYears, gradeOk,
      result: ending ? "career_ending" : !promotable ? "not_eligible" : s.rank >= s.cep ? "cep_ceiling" : s.rank === 7 ? "service_ceiling" : "promoted" };

    // The batchmate's year runs first: at the same grade there is one slot. A player held by
    // the age floor is not in that year's contest at all.
    const ageFloored = s.rank < 16 && floorAge(content, s, s.rank + 1) > s.age;
    const pmGivenAway = s.rank === 15 && s.flags.includes("kingmaker");
    const noRoom = s.rank === 15 && !pmRoom(content, s);   // too near the stop for even a short tenure
    const wouldPromote = promotable && s.rank < s.cep && s.rank !== 7 && !ageFloored && !pmGivenAway && !noRoom;
    const rv = s.rival ? rivalYear(content, s, t, wouldPromote ? score : null) : { lost: false, log: [] };

    if (promotable && s.rank >= s.cep) {
      const pol = s.rank >= 8 && content.cepHintsPolitics, hints = pol ? content.cepHintsPolitics : content.cepHints;
      // the rumours are taken like Meanwhile lines, and never twice in a career: the first two
      // years held at the ceiling say so, then the rumours thin out (the 4th, 7th, 11th... such
      // year), as a wait does. The die this used to read is still rolled, so the run's other
      // dice fall where they did.
      roll(s);
      const key = pol ? "__cepPolitics" : "__cep";
      const told = (s.cepTold = s.cepTold || {}), n = told[key] = (told[key] || 0) + 1;
      const i = CEP_SAID.includes(n) ? pickLine(s, key, hints.length, false) : null;
      if (i !== null) { useLine(s, key, i); log.push({ kind: "cep", text: hints[i] }); }
    } else if (promotable && s.rank === 7) {
      // Said a few times, differently, then not again: a Permanent Secretary can be there for years.
      const lines = content.topRungLines || ["There is no rung above this one. The next step is not a promotion; it is a different life."];
      s.topRungTold = (s.topRungTold || 0) + 1;
      if (s.topRungTold <= lines.length) log.push({ kind: "cep", text: lines[s.topRungTold - 1] });
    } else if (promotable && ageFloored) {
      // The top rungs of the service have an age floor (ladder minAge): a brilliant
      // 29-year-old is told to wait, in the house style.
      t.promotion.result = "age_floor";
      const lines = content.ageFloorLines || ["The board describes you as \"ready, in time\"."];
      // Said on the 1st, 3rd, 6th and 10th year of waiting, not every year: a wait is quiet.
      s.ageFloorSeen = (s.ageFloorSeen || 0) + 1;
      const k = [1, 3, 6, 10].indexOf(s.ageFloorSeen);
      if (k >= 0) log.push({ kind: "note", text: lines[k % lines.length] });
    } else if (promotable && rv.lost) {
      t.promotion.result = "ranking_lost";
    } else if (promotable && noRoom) {
      // the party wants a leader with a few years before the stop; said once
      t.promotion.result = "pm_too_late";
      if (!s.flags.includes("told_too_late") && E && E.pmTooLate) { s.flags.push("told_too_late"); log.push({ kind: "note", text: E.pmTooLate }); }
    } else if (promotable && pmGivenAway) {
      // You put someone else in the top job. It is theirs, not the next rung of yours.
      t.promotion.result = "pm_taken";
      if (!s.flags.includes("told_pm_taken")) {
        s.flags.push("told_pm_taken");
        log.push({ kind: "note", text: s.flags.includes("backed_batchmate")
          ? "There is no rung above this one that is yours to take. You gave it away, in a room, and it was the right call, mostly."
          : "There is no rung above this one that is yours to take. You know exactly who is standing on it, because you are the one who put the Prime Minister there." });
      }
    } else if (promotable) {
      // A standout junior officer occasionally skips a grade. This is the only way
      // a late starter ever makes up the years a scholar was simply given.
      const doubleJump = !fast && grade.code === "A" && s.rank <= 4 && score >= 84 && s.rank + 1 < s.cep
        && floorAge(content, s, s.rank + 2) <= s.age;
      const from = s.rank;
      s.rank += doubleJump ? 2 : 1;
      if (doubleJump) t.promotion.result = "promoted_two";
      s.yearsInGrade = 0;
      const r = rank(content, s);
      // a backbencher's first office is in a ministry: the header names it from now on
      const where = from === 8 ? `, ${s.ministry}` : "";
      // this year was paid at the old grade: the new grade's pay starts next year
      const rise = r.pay > content.ladder[from].pay && (EL(content).payWhy || {}).promoted;
      log.push({ kind: "promo", text: (doubleJump
        ? `Promoted two grades: ${r.title} (${r.grade}). This does not normally happen.`
        : `Promoted: ${r.title} (${r.grade})${where}`) + (rise ? `${doubleJump ? "" : "."} ${rise}` : "") });
      // The top job: a short tenure of its own cards follows, then the ending. (A build without
      // them ends here, as it always did.)
      if (s.rank === 16) {
        if (!startTenure(content, s)) { log.push(...rv.log); s.ending = "pm"; return log; }
        if (E.lines && E.lines.tookOffice) log.push({ kind: "note", text: E.lines.tookOffice });
      }
    }
    log.push(...rv.log);
    if (!finalYear) signals(content, s, log, leaving);
    if (s.rival) {   // years each outranked the other, and the batchmate's own retirement
      const v = s.rival;
      if (v.status === "active") {
        // outranking only means something on the same ladder: a Permanent Secretary and a
        // backbench MP are not above or below each other
        if ((v.rank >= 8) === (s.rank >= 8)) { if (v.rank > s.rank) v.ahead++; else if (s.rank > v.rank) v.behind++; else v.level = (v.level || 0) + 1; }
      }
    }

    if (s.heat >= 85) { s.ending = "scandal"; return log; }
    if (s.heat >= 55) log.push({ kind: "heat", text: "A journalist has been asking around about something old." });

    // The end coming: a plain line two years and one year before the last year.
    if (E && E.foreboding && plan && !finalYear && s.rank < 16 && plan.last - s.age >= 1 && plan.last - s.age <= 2) {
      const pool = plan.track === "service" ? "service" : s.flags.includes("stays_on") ? "limit" : "renewal";
      const k = plan.last - s.age, lines = (E.foreboding[pool] || [])[2 - k];
      const text = endLine(content, s, `${pool}:${k}`, lines, false, { retire: content.retireAge, limit: content.politicalRetireAge });
      if (text) { log.push({ kind: "note", about: "foreboding", pool, last: plan.last, text }); t.foreboding = { pool, k }; }
    }
    return endOfYear(content, s, log, finalYear, plan);
  }

  // The year turns: the career ends here if its last year (or a Prime Minister's tenure) has
  // just been played. An election ends a political career within the year, and a Prime Minister
  // steps down within it, so neither ages another year; the service and the hard stop do.
  function endOfYear(content, s, log, finalYear, plan) {
    if (finalYear && (s.rank === 16 || (plan && plan.kind === "election"))) { s.ending = s.rank === 16 ? "pm" : retirementEnding(s); return log; }
    s.age++; s.year++;
    // the last year's card ends the career; the old age limits are kept only as a safety net
    // (for a build without the endgame cards, and for saves from before them)
    const E = END(content), slack = E && E.cards ? 3 : 0;
    const retireAt = (s.rank >= 8 ? content.politicalRetireAge : content.retireAge) + slack;
    if (finalYear || (s.age >= retireAt && s.rank !== 16 && !entryPending(s))) s.ending = retirementEnding(s);
    else castSync(content, s, log);   // the cast's own year: promotions, retirements, arrivals
    return log;
  }

  // A Prime Minister's year-end: the package, the batchmate's year, the Heat, and a line from
  // the tenure (endgame.lines.pmYears), never the same twice.
  function pmYearEnd(content, s, t, log, finalYear) {
    const E = END(content);
    t.promotion = { rank: s.rank, yearsInGrade: s.yearsInGrade, needYears: 0, gradeOk: false, result: "top" };
    const rv = s.rival ? rivalYear(content, s, t, null) : { log: [] };
    log.push(...rv.log);
    if (s.heat >= 85) { s.ending = "scandal"; return log; }
    if (s.heat >= 55) log.push({ kind: "heat", text: "A journalist has been asking around about something old." });
    // a general election that falls due in the tenure is held in it: the party is returned (a
    // Prime Minister's tenure ends when the tenure does), and the next one is due in a term
    const L = E.lines || {};
    const due = s.scheduled.filter(x => x.eventId === "re_election" && x.fireYear <= s.year);
    if (due.length) {
      s.scheduled = s.scheduled.filter(x => !due.includes(x));
      const e = { eventId: "re_election", fireYear: s.year + (E.term || 5) };
      s.scheduled.push(e);
      (t.added = t.added || []).push(e);
      t.election = { kind: "incumbent", chance: 1, won: true, safe: true, pm: true };
      const text = endLine(content, s, "pmElection", L.pmElection, true);
      if (text) log.push({ kind: "promo", text });
    }
    // the first review says why there is no grade, the last one packs up; the others are lines from the tenure
    const first = !(s.pmTenure.reviews > 0);
    s.pmTenure.reviews = (s.pmTenure.reviews || 0) + 1;
    const text = finalYear && L.pmLastYear ? L.pmLastYear : first && L.pmFirstYear ? L.pmFirstYear : endLine(content, s, "pmYears", L.pmYears, false);
    if (text) log.push({ kind: "note", text });
    return endOfYear(content, s, log, finalYear, null);
  }

  function retirementEnding(s) {
    if (s.flags.includes("declined_tea")) return "declined";
    if (s.rank >= 13) return "retired";
    if (s.rank === 7) return "permsec";
    if (s.flags.includes("tea_withdrawn")) return "withdrawn";
    // a junior office-holder is not a backbencher: Parliamentary Secretary to Senior Minister of State
    if (s.rank >= 9) return "office";
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

  // --- Meanwhile lines ---------------------------------------------------------
  // A year that passes by itself shows one line. A run never shows the same line twice: each
  // card-and-habit takes its lines in an order drawn from the seed, preferring lines the phone
  // has not shown in its last runs (the freshness memory, as card versions do). The lines used
  // are kept in the state, so a replay shows the same ones.
  // montageLines is either one list, or lists keyed by the habit (a choice index, or a series
  // stance), so a year of coasting never reads like a year of hard work.
  function linesFor(src, habit) {
    const pool = src.montageLines;
    if (Array.isArray(pool)) return { key: src.id, lines: pool };
    if (pool && habit !== undefined && pool[habit]) return { key: `${src.id}:${habit}`, lines: pool[habit] };
    if (pool) return { key: `${src.id}:*`, lines: Object.values(pool).flat() };
    return { key: "__year", lines: ["The year passes. Most of them do."] };
  }
  // The index of the line to show next, or null when every line has been shown this run. With
  // `cycle`, lines that have all been shown are taken again in the same order: for a series,
  // which cannot come back in full, and for rumours and election results, which must be said.
  function pickLine(s, key, n, cycle) {
    if (!n) return null;
    const used = (s.linesUsed || {})[key] || [];
    const r = rng((s.seed ^ hashStr("mw:" + key)) >>> 0);
    const order = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    const fresh = order.filter(i => !used.includes(i)), recent = s.recent || [];
    const i = fresh.find(i => !recent.includes(`mw:${key}#${i}`)) ?? fresh[0];
    if (i !== undefined) return i;
    return cycle ? order[used.length % n] : null;
  }
  function useLine(s, key, i) {
    const u = (s.linesUsed = s.linesUsed || {});
    (u[key] = u[key] || []).push(i);
  }

  // A montage year repeats the player's habit: the effects of what they chose the first
  // time they played this card in full (without its "noted" hit or its consequences).
  function montageOf(content, src, s) {
    const h = (s.habits || {})[src.id];
    const { key, lines } = linesFor(src, h);
    const line = pickLine(s, key, lines.length, true);
    const habit = src.choices[h];
    const effects = habit ? Object.fromEntries(Object.entries(habit.effects || {}).filter(([k]) => k !== "appraisal"))
      : (src.montageEffects || { competence: 1 });
    return { id: MONTAGE + src.id, title: sub(src.title, s, content), body: lines[line], montage: true, lineKey: key, line,
      choices: [{ text: habit ? `As usual: ${habit.text}` : "Carry on.", effects, outcome: "Another year." }] };
  }
  // A habit year passes while it has a line this run has not shown (every fourth time the card
  // comes back in full instead, while it has a scene this run has not shown). Once its lines for
  // the habit are spent, the card comes back in full, as a new scene, and the player chooses again.
  const scenesLeft = (ev, s) => (ev.variants || []).length + 1 - (s.history || []).filter(x => x.ev === ev.id && !x.passed).length;
  function freshLine(ev, s) {
    const { key, lines } = linesFor(ev, (s.habits || {})[ev.id]);
    return pickLine(s, key, lines.length, false) !== null;
  }
  function habitYear(ev, s) {
    const n = s.fillerSeen[ev.id] || 0;
    if (!isFiller(ev) || n < 1 || (s.habits || {})[ev.id] === undefined || !freshLine(ev, s)) return false;
    return n % 4 !== 0 || scenesLeft(ev, s) <= 0;
  }
  // A repeatable card with no scene and no line left for its habit has nothing new to say this
  // run: it is not drawn again.
  function spent(ev, s) {
    return isFiller(ev) && (s.fillerSeen[ev.id] || 0) >= 1 && (s.habits || {})[ev.id] !== undefined
      && scenesLeft(ev, s) <= 0 && !freshLine(ev, s);
  }

  // --- series ------------------------------------------------------------------
  // Sibling cards can share one habit: the National Bonus and the Budgets after it (the Indicators
  // in a strong year, in a downturn and before an election) are one decision, made in different
  // weather. Each card says "series": { "key": "indicators", "full": 2 }, and each of its choices
  // names its "stance".
  // The series is shown in full `full` times a career. After that, a card of the series passes
  // as a Meanwhile year that repeats the habit in full, its mechanics included (the National
  // Bonus it sets, the protection an improvement plan gives), with a line for that card and stance.
  // The second full showing may have its own scene, `again`: the habit from the first is the
  // default and comes first, and the question is whether to break it. `again.keep` and
  // `again.change` are added to the effects of keeping the habit and of breaking it.
  // A card with "opens": true in its series is the series' first showing: it is drawn only
  // before the series has begun (see eligible). The National Bonus card opens the Indicators: a
  // priority card in the first year as an office holder who is paid the bonus, so the Budgets
  // after it are always second showings, which name the choice made on it.
  function seriesOf(ev, s) { return ev && ev.series ? (s.series || {})[ev.series.key] || null : null; }
  const stanceIndex = (ev, stance) => stance === undefined ? -1 : ev.choices.findIndex(c => c.stance === stance);
  function seriesYear(ev, s) {
    const f = seriesOf(ev, s);
    return !!f && f.full >= (ev.series.full || Infinity) && stanceIndex(ev, f.stance) >= 0;
  }
  function addFx(a, b) {
    if (!b) return a;
    const out = { ...(a || {}) };
    for (const [k, v] of Object.entries(b)) { out[k] = (out[k] || 0) + v; if (!out[k]) delete out[k]; }
    return out;
  }
  // The card as shown this time: its second-showing scene, or one of its versions.
  function sceneOf(ev, s) {
    const f = seriesOf(ev, s), k = f ? stanceIndex(ev, f.stance) : -1;
    const sc = k >= 0 && f.full === 1 && ev.again && (ev.again.scenes || {})[f.stance];
    if (!sc) return variantOf(ev, s);
    return { ...ev, variant: "again:" + f.stance, keep: k, title: sc.title || ev.title, body: sc.body,
      choices: ev.choices.map((c, i) => ({ ...c, text: (sc.choices[i] || {}).text || c.text, outcome: (sc.choices[i] || {}).outcome || c.outcome,
        effects: addFx(c.effects, i === k ? ev.again.keep : ev.again.change) })) };
  }

  // The card the player is looking at, whatever kind it is. UI and harness both use this.
  function eventOf(content, s) {
    const id = s.currentEvent;
    if (!id) return null;
    if (id === "__quiet") return QUIET_YEAR;
    if (!s.cast && content.cast) { s = { ...s }; castSync(content, s, null, true); }   // a save from before the cast
    if (id.startsWith(MONTAGE)) return montageOf(content, content.events.find(e => e.id === id.slice(MONTAGE.length)), s);
    // the same card in the same state renders the same way: the UI and the harness ask several times
    const key = `${id}|${s.year}|${s.rank}|${s.flags.length}|${(s.history || []).length}|${s.cardsPlayed || 0}`;
    const hit = SHOWN.get(s);
    if (hit && hit.key === key && hit.content === content) return hit.ev;
    const ev = allEvents(content, s).find(e => e.id === id);
    const out = ev ? render(content, sceneOf(ev, s), s) : ev;
    SHOWN.set(s, { key, content, ev: out });
    return out;
  }
  const SHOWN = new WeakMap();

  // --- card versions ---------------------------------------------------------
  // A card may carry variants: the same mechanics, flags and choices in a different scene.
  // The first showing in a run is chosen from the seed, preferring a version the player has not
  // seen in their last runs on this phone; a card shown in full again later in the same run moves
  // on to its next version. Only words change (title, body, choice text, outcomes).
  function hashId(id) { let h = 2166136261; for (const ch of id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0; return h; }
  function variantIndex(ev, s) {
    const n = (ev.variants || []).length + 1;
    if (n === 1) return 0;
    const start = Math.floor(rng((s.seed ^ hashId(ev.id)) >>> 0)() * n);
    const order = Array.from({ length: n }, (_, k) => (start + k) % n);
    const recent = s.recent || [];
    const fresh = order.filter(i => !recent.includes(ev.id + "#" + i));
    const list = fresh.concat(order.filter(i => !fresh.includes(i)));
    // a card shown in full again in the same run (a repeat card) moves on
    const shownBefore = (s.history || []).filter(h => h.ev === ev.id && !h.passed).length;
    return list[shownBefore % n];
  }
  function variantOf(ev, s) { return applyVariant(ev, variantIndex(ev, s)); }
  function applyVariant(ev, i) {
    if (!i || !ev.variants || !ev.variants[i - 1]) return ev;
    const v = ev.variants[i - 1];
    return { ...ev, variant: i, title: v.title || ev.title, body: v.body || ev.body,
      choices: ev.choices.map((c, k) => ({ ...c, ...(v.choices && v.choices[k] ? { text: v.choices[k].text || c.text, outcome: v.choices[k].outcome || c.outcome } : {}) })),
      ...(v.autoPlayLine && ev.autoPlay ? { autoPlay: { ...ev.autoPlay, line: v.autoPlayLine, lines: null } } : {}) };
  }

  // What this run showed, for the next run's freshness: card ids, the versions and part options
  // seen, and the names of the run's people.
  function recentKeys(content, s) {
    const out = new Set();
    for (const h of s.history || []) {
      if (h.passed || !h.ev || h.ev.startsWith("__")) continue;
      out.add(h.ev); out.add(h.ev + "#" + (h.variant || 0));
      for (const [slot, id] of Object.entries(h.parts || {})) out.add(`${h.ev}~${slot}=${id}`);
    }
    if (s.cast) for (const p of Object.values(s.cast.on).concat(s.cast.past)) if (p) out.add("cast:" + p.nm.full);
    for (const [key, used] of Object.entries(s.linesUsed || {})) for (const i of used) out.add(`mw:${key}#${i}`);
    return [...out];
  }

  // --- years that pass by themselves ---------------------------------------
  // A year with no decision in it is not a card. A habit year (a repeatable card already played
  // in full, three draws in four, while it has a fresh line), a series card already shown in
  // full as often as it may be, a safe re-election (ev.autoPlay) or an empty pool passes
  // on its own: pay, appraisal, promotion and the batchmate's year all still happen, and the
  // outcome screen the player is already looking at shows it as a short Meanwhile entry.
  function passKind(ev, s) {
    if (!ev) return "quiet";
    if (seriesYear(ev, s)) return "series";
    if (habitYear(ev, s)) return "habit";
    if (ev.autoPlay && meets(ev.autoPlay.when || {}, s)) return "auto";
    return null;
  }
  // A safe re-election's line: the next of autoPlay.lines (a version's own line replaces them).
  function autoLine(ev, s) {
    const own = ev.autoPlay.lines === null;   // a version that brought its own line
    const lines = ev.autoPlay.lines || (ev.autoPlay.line ? [ev.autoPlay.line] : []);
    const key = `${ev.id}:auto${own ? "#" + ev.variant : ""}`, i = pickLine(s, key, lines.length, true);
    return i === null ? { text: null } : { text: lines[i], key, i };
  }

  // The plain line a year with nothing to decide opens with: no decision was needed, and why
  // (the card came round again and the habit decided it, the plan chosen before still stands, the
  // seat was safe, or nothing came up). {title} and {choice} are the card and the choice as shown.
  function noDecision(content, kind, fill) {
    const N = EL(content).noDecision || {};
    const t = N[kind] || {
      habit: "No decision was needed this year. \"{title}\" came round again, and you did what you chose last time: \"{choice}\"",
      series: "No decision was needed this year. \"{title}\" came up, and the plan you chose before still stands: \"{choice}\"",
      auto: "No decision was needed this year. A general election came, and your seat was safe.",
      quiet: "No decision was needed this year. Nothing came up that needed you."
    }[kind];
    return { kind: "note", about: "noDecision", passed: kind, text: fillT(t, fill) };
  }
  // A card's words as this showing would put them (its version), for quoting a choice.
  const src = (ev, s) => variantOf(ev, s);
  // pay + appraisal on one line; everything else (promotions, rumours, warnings) as it was
  function compress(log) {
    const pay = log.find(l => l.kind === "pay"), ap = log.find(l => l.kind === "appraisal");
    const quote = ap && (ap.text.match(/"([^"]+)"/) || [])[1];
    const out = [];
    if (pay) out.push({ kind: "pay", text: `${pay.text}. Appraisal: ${quote ? `"${quote}"` : "noted"}.` });
    return out.concat(log.filter(l => l !== pay && l !== ap));
  }

  function passYears(content, s, t) {
    const log = [];
    t.passed = [];
    for (let k = 0; k < 60 && !s.ending; k++) {
      const info = {};
      let ev = pickEvent(content, s, info);
      const kind = passKind(ev, s);
      if (!kind) { s.currentEvent = ev.id; t.nextDraw = info; return log; }
      const before = { year: s.year, age: s.age, cep: s.cep, heat: s.heat, rank: s.rank };
      const pt = { kind, ev: ev ? ev.id : "__quiet", source: info.source, fired: info.fired || null, age: s.age, rank: s.rank, origin: s.origin };
      let choice = 0, ch, lines = [];
      // the page opens by saying why there was nothing to decide this year
      const heading = yearHeading(content, "passed", before);
      if (kind === "habit") {
        const m = montageOf(content, ev, s);
        choice = s.habits[ev.id]; ch = m.choices[0]; pt.habit = choice; pt.line = m.body;
        // the card and the choice as the player last saw them in full
        const last = (s.history || []).filter(h => h.ev === ev.id && !h.passed).pop();
        const why = noDecision(content, "habit", { title: last ? last.title : m.title, choice: last ? last.text : src(ev, s).choices[choice].text });
        applyEffects(s, ch.effects);
        s.fillerSeen[ev.id]++;
        useLine(s, m.lineKey, m.line);
        lines.push(heading, why, { kind: "meanwhile", text: m.body });
        ev = { ...ev, title: m.title };
      } else if (kind === "series") {
        // the habit, in full: the same choice the player made, with everything it does
        const f = s.series[ev.series.key];
        choice = stanceIndex(ev, f.stance); ch = ev.choices[choice]; pt.habit = f.stance;
        const { key, lines: pool } = linesFor(ev, f.stance);
        const li = pickLine(s, key, pool.length, true);
        pt.line = pool[li];
        const shown = src(ev, s);
        const why = noDecision(content, "series", { title: sub(shown.title, s, content), choice: shown.choices[choice].text });
        const al = applyChoice(content, s, ev, ch, pt);
        if (ev.cooldown) (s.cooldowns = s.cooldowns || {})[ev.cooldown] = before.year;
        f.passed = (f.passed || 0) + 1;
        useLine(s, key, li);
        lines.push(heading, why, { kind: "meanwhile", text: pool[li] }, ...al);
      } else if (kind === "auto") {
        const vev = render(content, variantOf(ev, s), s);
        choice = ev.autoPlay.choice || 0; ch = vev.choices[choice];
        ev = vev;
        const line = autoLine(ev, s);
        const al = applyChoice(content, s, ev, ch, pt, { safe: true });
        if (line.key) useLine(s, line.key, line.i);
        lines.push(heading, noDecision(content, "auto", {}), { kind: "meanwhile", text: line.text || ch.outcome }, ...al);
      } else {
        ch = QUIET_YEAR.choices[0];
        applyEffects(s, ch.effects);
        lines.push(heading, noDecision(content, "quiet", {}), { kind: "meanwhile", text: QUIET_YEAR.body });
      }
      const yl = s.ending ? [] : yearEnd(content, s, pt);
      heading.head = pageHead(content, s, before);
      lines.push(...yl);
      log.push(...lines);
      t.passed.push(pt);
      s.history.push({ ...before, ev: pt.ev, title: ev ? ev.title : QUIET_YEAR.title, choice, text: ch.text, passed: kind,
        grade: (pt.appraisal || {}).grade,
        cepAfter: s.cep, heatAfter: s.heat, rankAfter: s.rank, standing: s.standing, reputation: s.reputation, noted: false,
        hints: yl.filter(l => l.kind === "cep" || l.kind === "heat").map(l => l.kind + "|" + l.text) });
    }
    if (!s.ending) s.currentEvent = "__quiet";   // sixty empty years: show the safety-net card
    return log;
  }

  // --- public turn API --------------------------------------------------
  // advance(content, state, choiceIndex) -> { state, outcome, log, trace }
  // After the chosen card's year, any years with no decision in them pass by themselves, and
  // the next card is drawn: state.currentEvent is set unless the run has ended.
  function advance(content, state, choiceIndex) {
    const s = JSON.parse(JSON.stringify(state));   // immutable in, new state out
    upgradePlayer(content, s);                      // a save from before the start screen asked
    if (!s.cast && content.cast) castSync(content, s, null, true);   // a save from before the cast
    // the card as shown: a pure function of the state, so the copy reads the same as the original
    const ev = eventOf(content, state);
    const ch = ev.choices[choiceIndex];
    // the card's own index for the button pressed (a series' second showing puts the habit first)
    const ci = ev.order ? ev.order[choiceIndex] : choiceIndex;
    const own = ev.order ? ev.choices.map((_, j) => ev.choices[ev.order.indexOf(j)]) : ev.choices;
    const before = { year: s.year, age: s.age, cep: s.cep, heat: s.heat, rank: s.rank };
    const trace = {};
    const log = applyChoice(content, s, ev, ch, trace);
    witnessSee(content, s, ev, ci, trace);                // who, unseen, noticed what was chosen
    const moved = STATS.map(k => [k, s[k] - state[k]]);   // what this choice did to the four stats
    // in politics when they chose: an MP, or a candidate on the election card
    const pol = state.rank >= 8 || s.rank >= 8 || ev.id === "the_election";
    if (ev.cooldown) (s.cooldowns = s.cooldowns || {})[ev.cooldown] = before.year;
    // a card in a series: what was chosen becomes the habit its later years repeat
    if (ev.series) {
      const S = (s.series = s.series || {}), k = ev.series.key, cur = S[k] || { full: 0, passed: 0 };
      S[k] = { ...cur, stance: ch.stance !== undefined ? ch.stance : cur.stance, full: cur.full + 1 };
    }
    // the outcome's own page shows the header as the choice left it, before the year-end
    const head = header(content, s);
    if (!s.ending) {
      const ye = yearEnd(content, s, trace);
      const sw = swingLine(content, s, moved, pol);
      if (sw) log.push(sw);
      if (ye.length) log.push({ ...yearHeading(content, "review", before), head: pageHead(content, s, before) }, ...ye);
    }
    if (ev.id.startsWith(MONTAGE)) {
      s.fillerSeen[ev.id.slice(MONTAGE.length)]++;
      if (ev.line !== null && ev.line !== undefined) useLine(s, ev.lineKey, ev.line);
    } else if (isFiller(ev)) {
      s.fillerSeen[ev.id] = (s.fillerSeen[ev.id] || 0) + 1;
      (s.habits = s.habits || {})[ev.id] = ci;   // what habit years will repeat
    }
    s.cardsPlayed = (s.cardsPlayed || 0) + 1;
    // the people the player read on the card and the outcome they chose (not an outcome they did
    // not choose) have been met, on this card: the next card leaves out their tag (introduce).
    // Only those people: someone who took over the role this year (a sideways move, a retirement
    // at the year-end) has not been met yet, and is introduced on their first card.
    const saw = { ...(ev.saw || {}), ...(ch.saw || {}) };
    for (const [r, id] of Object.entries(saw)) {
      if (r === "rival") { if (s.rival) s.rival.seenCard = s.cardsPlayed; continue; }
      const p = s.cast && s.cast.on[r];
      if (p && p.id === id) { p.met = before.year; p.seenCard = s.cardsPlayed; }
    }
    // A card with parts or cast keeps what it showed: the combination (freshness, the next
    // showing's rotation), who it named, and, when the Declassified file may quote an untaken
    // choice from it (one that raised the ceiling), its choices' words as read.
    const quoted = own.some((c, i) => i !== ci && ((c.effects || {}).cep || 0) > 0);
    const shown = ev.picked || ev.who ? { ...(ev.picked ? { parts: ev.picked } : {}), ...(ev.who ? { who: ev.who } : {}),
      ...(quoted ? { texts: own.map(c => c.text) } : {}) } : {};
    s.history.push({ ...before, ev: ev.id, title: ev.title, choice: ci, text: ch.text, variant: ev.variant || 0, ...shown,
      grade: (trace.appraisal || {}).grade,
      cepAfter: s.cep, heatAfter: s.heat, rankAfter: s.rank, standing: s.standing, reputation: s.reputation,
      noted: ((ch.effects || {}).appraisal || 0) < 0,
      hints: log.filter(l => l.kind === "cep" || l.kind === "heat").map(l => l.kind + "|" + l.text) });
    s.currentEvent = null;
    if (!s.ending) {
      log.push(...passYears(content, s, trace));
    }
    return { state: s, outcome: trace.outcome ? sub(trace.outcome, s, content) : ch.outcome, log: capNotes(s, log), trace, head };
  }

  // The card for this year. advance() has normally drawn it already; this draws only for the
  // first year of a run (and for saves from before years passed by themselves).
  function nextEvent(content, state) {
    const s = JSON.parse(JSON.stringify(state));
    upgradePlayer(content, s);                      // a save from before the start screen asked
    if (!s.cast && content.cast) castSync(content, s, null, true);   // a save from before the cast
    if (s.currentEvent) return { state: s, event: eventOf(content, s) };
    const ev = pickEvent(content, s);
    if (!ev) { s.currentEvent = "__quiet"; return { state: s, event: QUIET_YEAR }; }
    // An old save may still land on a habit year: show it as the one-line card it used to be.
    if (habitYear(ev, s)) {
      s.currentEvent = MONTAGE + ev.id;
      return { state: s, event: montageOf(content, ev, s) };
    }
    s.currentEvent = ev.id;
    return { state: s, event: eventOf(content, s) };
  }

  // --- hidden witnesses ----------------------------------------------------------
  // Somebody is always watching whom you don't expect: the officer who countersigns your
  // appraisal, the office whose email it was, the panel that ranks you, the people around you;
  // in politics, the party's leadership, the Whip's office, your branch's volunteers, the press
  // gallery, the officials who work with you, your fellow Members. A card lists who could
  // plausibly know what the player did there (card.witnesses), and each kind of witness (game.json
  // witnesses.types) judges by its own motive, so the same act can help with one and hurt with
  // another. It is an add-on: a card's own effects are untouched.
  //
  //   "witnesses": {
  //     "by": { "<type>": { "chance": 0.5 | [one per choice],     how likely they are to notice
  //                         "react": [3, -4, 0],                   per choice: appraisal points, later
  //                         "cep": [0, 1, 0],                      optional, rare: the ceiling, now
  //                         "requires": { "variants": [0], "parts": { "to": ["minister"] }, ... } } }
  //   }
  //
  // Each type belongs to a ladder (witnesses.types.<type>.ladder: "service", the default, or
  // "politics"). A witness sees only what the player does on its own ladder, judged by where the
  // player stands once the choice is made (so the election card is seen from politics if it is
  // won), and its judgement lapses if the player is on the other ladder when it falls due: the
  // service's judgement of someone who has left for politics no longer counts.
  //   When the player chooses, each witness who could be there for this showing (the ladder, the
  // version, the part options and any card requirement) has its chance of noticing. One who
  // notices and cares moves one later appraisal, one to three years on (witnesses.delay), once:
  // like a "noted" choice, but late and unannounced. Several landing in one year are capped
  // (witnesses.cap). A rare, strong case raises the ceiling by a grade when it is noticed.
  //   Nobody is ever named. When a witness moves a grade, the review page says what was noticed
  // about half the time (witnesses.show), in a line from that witness's own pool that this run has
  // not shown; otherwise nothing is said, during play or at the end: the ending never mentions
  // witnesses. Players work it out on their own.
  //   Every die here is drawn on the witnesses' own stream, keyed by the card, the year and the
  // witness, so the run's own dice never move, and a run that meets no witness who notices
  // anything plays exactly as it did before.
  const WIT = content => content.witnesses || null;
  const witDie = (s, key) => rng((s.seed ^ hashStr("witness:" + key)) >>> 0)();
  const perChoice = (x, ci) => (Array.isArray(x) ? x[ci] : x) || 0;
  const onService = (W, type) => ((W.types[type] || {}).ladder || "service") === "service";

  // The witnesses a card lists who could be there for this showing.
  function witnessesOn(content, s, ev) {
    const W = WIT(content), by = ev && ev.witnesses && ev.witnesses.by;
    if (!W || !by) return [];
    const variant = typeof ev.variant === "number" ? ev.variant : 0;
    return Object.entries(by).filter(([type, w]) => {
      const q = w.requires || {};
      if (!W.types[type] || onService(W, type) !== (s.rank < 8)) return false;
      if (q.variants && !q.variants.includes(variant)) return false;
      for (const [slot, ids] of Object.entries(q.parts || {})) if (!ev.picked || !ids.includes(ev.picked[slot])) return false;
      return meets(q, s);
    });
  }

  // After a choice: who noticed. Each is kept with the year their judgement lands.
  function witnessSee(content, s, ev, ci, t) {
    const W = WIT(content), on = witnessesOn(content, s, ev);
    if (!on.length) return;
    const [d0, d1] = W.delay || [1, 3], key = `${ev.id}#${s.year}`;
    for (const [type, w] of on) {
      const mod = perChoice(w.react, ci), cep = perChoice(w.cep, ci);
      if (!mod && !cep) continue;                                           // they saw it, and didn't mind
      if (witDie(s, `${key}:${type}:seen`) >= perChoice(w.chance, ci)) continue;   // nobody noticed
      const delay = d0 + Math.floor(witDie(s, `${key}:${type}:delay`) * (d1 - d0 + 1));
      const e = { card: ev.id, choice: ci, type, mod, year: s.year, service: onService(W, type), due: s.year + delay };
      if (cep) { e.ceiling = [s.cep, clamp(s.cep + cep, 0, 16)]; s.cep = e.ceiling[1]; }
      (s.witness = s.witness || { seen: [] }).seen.push(e);
      (t.witness = t.witness || []).push({ type, mod, cep: cep || 0, due: e.due });
    }
  }

  // At an appraisal: the judgements due by this year, on the ladder they were made on; the rest of
  // those due lapse. Returns the total (capped) and the entries.
  function witnessDue(content, s) {
    const W = WIT(content), all = (s.witness && s.witness.seen) || [];
    const here = [];
    if (W) for (const e of all) {
      if (e.landed || e.lapsed || !e.mod || e.due > s.year) continue;
      if (e.service !== (s.rank < 8)) e.lapsed = s.year; else here.push(e);
    }
    const cap = W && W.cap || 8;
    return { mod: clamp(here.reduce((n, e) => n + e.mod, 0), -cap, cap), due: here };
  }

  // The review page: whether this year's judgements moved the grade, and, about half the time when
  // they did, one line saying what was noticed. The "why" line is left as it is.
  function witnessReview(content, s, log, t, grade, score, wit) {
    if (!wit || !wit.due.length) return;
    const W = WIT(content), cap = W.cap || 8;
    const bare = score - wit.mod, without = gradeAt(content, bare).code;
    t.appraisal.witness = wit.mod;
    let lead = null;
    for (const e of wit.due) {
      // the grade without this one: alone, or as the biggest of several that moved it together
      const other = clamp(wit.due.reduce((n, x) => n + x.mod, 0) - e.mod, -cap, cap);
      const alone = gradeAt(content, bare + other).code;
      e.landed = { year: s.year, grade: grade.code, without: alone !== grade.code ? alone : null };
      if (e.landed.without && (!lead || Math.abs(e.mod) > Math.abs(lead.mod))) lead = e;
    }
    if (!lead && without !== grade.code) {
      lead = wit.due.filter(e => Math.sign(e.mod) === Math.sign(wit.mod)).sort((a, b) => Math.abs(b.mod) - Math.abs(a.mod))[0];
      if (lead) lead.landed.without = without;
    }
    if (!lead) return;
    t.witnessMoved = { grade: grade.code, without: lead.landed.without, type: lead.type };   // for traces
    if (witDie(s, `show#${s.year}`) >= (W.show === undefined ? 0.5 : W.show)) return;
    const sign = lead.mod > 0 ? "help" : "hurt", lines = ((W.types[lead.type].review || {})[sign]) || [];
    const key = `__witness:${lead.type}:${sign}`, i = pickLine(s, key, lines.length, false);
    if (i === null) return;   // every line for it has been shown this run: nothing is said
    useLine(s, key, i);
    lead.landed.shown = true;
    log.push({ kind: "note", about: "witness", text: lines[i] });
  }

  // --- the ending: legacy and the declassified file --------------------------
  // Wealth is the machine's score. Legacy is the other one: what the people you worked
  // with would say. The engine never uses it for anything else, which is the point.
  function legacy(content, s) {
    const marks = (content.legacyFlags || []).filter(f => s.flags.includes(f)).length;
    const score = s.integrity + s.reputation / 2 + 8 * marks;
    // an exit that was not a retirement has its own lines: nobody gives a farewell speech for those
    const tiers = (content.legacyByEnding || {})[s.ending] || content.legacyTiers || [];
    return sub((tiers.find(x => score >= x.min) || { text: "" }).text, s, content);
  }

  // The ending card's labels: not every ending is a retirement.
  function finalLabels(content, s) {
    const politician = s.rank >= 8;
    switch (s.ending) {
      // with a tenure, the career ends when you step down, not when you take office
      case "pm": return s.pmTenure
        ? { position: "Final position", age: "Stepped down at", share: "stepped down as Prime Minister at" }
        : { position: "Final position", age: "Took office at", share: "became Prime Minister at" };
      case "consultancy": return politician
        ? { position: "Left Parliament as", age: "At age", share: "left Parliament as" }
        : { position: "Left the service as", age: "At age", share: "left the service as" };
      case "quiet": return { position: "Last held", age: "At age", share: "was eased out as" };
      case "scandal": return { position: "Resigned as", age: "At age", share: "resigned as" };
      case "lostward": return politician
        ? { position: "Lost the seat as", age: "At age", share: "lost the seat as" }
        : { position: "Last held", age: "At age", share: "lost the election, having been" };
      default: return { position: "Retired as", age: "At age", share: "retired as" };
    }
  }

  // The ending card's title and epitaph, with the player's name and pronouns filled in.
  function ending(content, s) {
    const e = content.endings.find(x => x.id === s.ending);
    return e && { ...e, title: sub(e.title, s, content), epitaph: sub(e.epitaph, s, content) };
  }

  function title(content, r) {
    return r >= content.ladder.length ? content.ladder[content.ladder.length - 1].title : content.ladder[r].title;
  }

  // What was really going on, as a short list of lines for the ending screen.
  const NUM = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

  // The day-one ceiling only ever applied to the service, so its line says which story the run
  // told: reached the top, left for politics, stopped by it, or simply never told. A ceiling a
  // choice later raised (The move) was only the first day's plan, and the line says so.
  function serviceCeilingLine(content, s, H, ceiling) {
    const day1 = ceiling(Math.min(s.cepStart, 7), false);
    const reachedPS = s.rank === 7 || H.some(h => h.rank === 7 || h.rankAfter === 7);
    // the ceiling as it stood when the player last served (it can be raised by a choice)
    const served = H.filter(h => h.rankAfter < 8);   // years that ended still in the service (not the election)
    const lastCep = s.rank < 8 ? s.cep : served.length ? served[served.length - 1].cepAfter : s.cepStart;
    const raised = Math.min(lastCep, 7) > Math.min(s.cepStart, 7);
    if (s.cepStart >= 7 && reachedPS)
      return "There wasn't one. On your first day the service marked you as able to reach Permanent Secretary, the top grade. You did.";
    if (s.rank >= 8) return raised
      ? `On your first day, the service decided the highest grade it would give you: ${day1}. It did not apply in politics.`
      : `On your first day, the service decided the highest grade it would ever give you: ${day1}. It did not apply in politics.`;
    if (raised) return `On your first day, the service decided the highest grade it would give you: ${day1}. Nobody mentioned it.`;
    // sat at it: reached the day-one ceiling, stayed there 3 years or more, and heard a ceiling rumour there
    const hints = [...content.cepHints, ...(content.cepHintsPolitics || [])];
    const up = H.find(h => h.rankAfter === s.cepStart && h.rank < s.cepStart);
    const stuck = s.cepStart < 7 && s.rank === s.cepStart && up && s.age - (up.age + 1) >= 3
      && H.some(h => h.rank === s.cepStart && h.hints.some(x => x.startsWith("cep|") && hints.includes(x.slice(4))));
    if (stuck) return `On your first day, the service decided the highest grade it would give you: ${day1}. You reached it at ${up.age}, and that is why the promotions stopped.`;
    return `On your first day, the service decided the highest grade it would ever give you: ${day1}. Nobody mentioned it.`;
  }

  // Each line is one idea, short enough to read at a glance: the label names it, the text says it.
  function declassify(content, s) {
    const out = [], H = s.history || [];
    const count = n => NUM[n] || String(n);
    // In the service a ceiling of 7 is the top rung and 8 or more is none at all; in politics it is a rank.
    const ceiling = (r, political) => political ? title(content, r)
      : r === 7 ? "Permanent Secretary" : r >= 8 ? "none" : title(content, r);
    out.push({ label: "Your civil service ceiling", text: serviceCeilingLine(content, s, H, ceiling) });
    const won = H.find(h => h.ev === "the_election" && h.rankAfter === 8);
    // the party's own ceiling, set when it won the seat (a choice can raise it later: The next move)
    if (won) out.push({ label: "The party's estimate", text: `The highest office the party expected you to reach, decided when you were elected: ${title(content, won.cepAfter)}. Nobody told you.` });

    // The move that raised the ceiling: in the service while a ceiling below the top still applied;
    // in politics, after the election that set the party's own estimate. A politician sees both.
    const political = s.rank >= 8;
    // A year that passed by itself was not a choice, so it is neither a raise you chose nor one you missed.
    const raisesIn = pol => H.filter(h => !h.passed && h.cepAfter > h.cep && h.ev !== "the_election"
      && (pol ? h.rank >= 8 : h.rank < 8 && h.cep < 7));
    // The choice that set the final ceiling, not merely the biggest step: a career's story ends
    // at the raise that made its last rung possible.
    const last = xs => xs.reduce((a, b) => (b.cepAfter >= a.cepAfter ? b : a));
    // what the choice did, said in full: which ceiling it moved, and to where
    const said = r => `At ${r.age}, on "${r.title}", you chose "${r.text}" ${r.rank >= 8 ? `That raised the party's estimate to ${ceiling(r.cepAfter, true)}.`
      : r.cepAfter >= 8 ? "That removed your ceiling in the service altogether." : `That raised your ceiling in the service to ${ceiling(r.cepAfter, false)}.`}`;
    // The first choice that would have raised it, had you taken it.
    const missed = pol => {
      const h = H.filter(h => !h.passed && (pol ? h.rank >= 8 : h.rank < 8)).find(h => {
        const ev = content.events.find(e => e.id === h.ev);
        return ev && ev.choices.some((c, i) => i !== h.choice && (c.effects || {}).cep > 0);
      });
      if (!h) return "None. Nothing you were offered could have raised it.";
      // quoted as the player saw it: the version of the card that run showed, names and all
      const cs = applyVariant(content.events.find(e => e.id === h.ev), h.variant).choices;
      const i = cs.findIndex((c, i) => i !== h.choice && (c.effects || {}).cep > 0);
      return `None. At ${h.age}, "${h.texts ? h.texts[i] : cs[i].text}" would have raised it.`;
    };
    const service = raisesIn(false);
    let moved = false;
    if (service.length) { out.push({ label: "The move", text: said(last(service)) }); moved = true; }
    else if (s.cepStart >= 7 && !political) out.push({ label: "The move", text: s.origin === "scholar"
      ? "Never needed one. That is what the scholarship was for."
      : "Never needed one. Your file expected it from day one." });
    else if (!political) out.push({ label: "The move", text: missed(false) });
    if (political) {
      const pol = raisesIn(true);
      out.push({ label: moved ? "The next move" : "The move", text: pol.length ? said(last(pol)) : missed(true) });
    }

    // Only the ceiling rumours (content.cepHints); the Perm Sec "no rung above" line is not one.
    const allHints = [...content.cepHints, ...(content.cepHintsPolitics || [])];
    const isHint = x => x.startsWith("cep|") && allHints.includes(x.slice(4));
    const blocked = H.filter(h => h.hints.some(isHint)).length;
    if (blocked) out.push({ label: blocked === 1 ? "The rumour" : "The rumours", text: blocked === 1
      ? "It meant you had earned the promotion, and your ceiling stopped it."
      : `You heard ${count(blocked)}. Each time, you had earned the promotion, and your ceiling stopped it.` });

    // Why the tea never came, for a career that stayed in the service and was never asked.
    // One reason, the one that fell furthest short.
    const asked = ["went_to_tea", "declined_tea", "tea_withdrawn"].some(f => s.flags.includes(f));
    const tea = content.events.find(e => e.id === "tea_session");
    if (!asked && tea && s.rank < 8 && s.ending && !["consultancy", "scandal"].includes(s.ending)) {
      const q = tea.requires || {}, need = q.minStats || {};
      const window = H.filter(h => h.rankAfter >= (q.minRank || 0) && h.rankAfter <= (q.maxRank ?? 7));
      let text;
      if (!window.length) text = `Never came. The party only asks officers at ${title(content, q.minRank || 0)} or above to tea. You never got there.`;
      else {
        const peak = k => Math.max(...window.map(h => h[k] ?? 0));
        const short = Object.keys(need).map(k => ({ k, need: need[k], got: peak(k) })).filter(x => x.got < x.need)
          .sort((a, b) => (b.need - b.got) - (a.need - a.got))[0];
        const both = Object.keys(need).map(k => `their ${cap(k)} is at least ${need[k]}`).join(" and ");
        // the numbers are the ones the ending has just revealed above (Your numbers)
        text = short ? `Never came. The party only asks people to tea once their ${cap(short.k)} reaches ${short.need}. Your ${cap(short.k)} never went higher than ${short.got}.`
          : `Never came. The party only asks people to tea once ${both}, at the same time. You never had both at once.`;
      }
      out.push({ label: "The invitation", text });
      const noted = H.filter(h => h.noted).length;
      if (noted) out.push({ label: "Noted", text: noted === 1
        ? "Once. It cost that year's appraisal."
        : `${cap(noted === 2 ? "twice" : `${count(noted)} times`)}. Each cost that year's appraisal.` });
    }

    // The exception: two standout moments marked the file, and the top rungs' age floors gave.
    if (s.flags.includes("exceptional") && s.exceptionalAt) {
      const L = content.ladder;
      const early = [7, 6].map(r => ({ r, h: H.find(h => h.rankAfter === r && h.rank !== r) }))
        .find(x => x.h && L[x.r].minAge && x.h.age < L[x.r].minAge);
      const x = s.exceptionalAt;
      // what the mark is for: the top grades' minimum ages give way for it
      const what = `Your file was marked "exceptional" at ${x.age}, which lets the top grades take an officer younger than their usual minimum age.`;
      out.push({ label: "The exception", text: early
        ? `${what} That is how you became ${article(L[early.r].title)} ${L[early.r].title} at ${early.h.age}, when the usual minimum is ${L[early.r].minAge}.`
        : x.age >= (L[7].minAge || 0) ? `${what} By then you were old enough anyway.`
        : `${what} It never came to that.` });
    }

    // A career that ended below its ceiling was not stopped by the ceiling: say what did.
    const ownCeiling = s.rank < 8 ? (s.cep >= 7 ? 7 : s.cep) : s.cep;
    if (["level", "backbench", "office"].includes(s.ending) && ownCeiling > s.rank) {
      const gs = H.map(h => h.grade).filter(Boolean);
      const low = gs.filter(g => !["A", "B+"].includes(g)).length;
      out.push({ label: "What stopped you", text: `Your appraisals, not the ceiling: ${low} of your ${gs.length} grades were below B+.` });
    }

    // The top job: when you took it, and how long it lasted.
    if (s.pmTenure && s.rank === 16) {
      const yrs = s.age - s.pmTenure.at;
      out.push({ label: "In office", text: `Took office at ${s.pmTenure.at}. ${s.ending === "pm" ? `Stepped down at ${s.age}` : `Left at ${s.age}`}, after ${count(yrs)} year${yrs === 1 ? "" : "s"}.` });
    }

    const peak = H.reduce((a, b) => (b.heatAfter > a.heatAfter ? b : a), { heatAfter: 0 });
    out.push({ label: "Exposure", text: peak.heatAfter >= 20
      ? `How much there was for a journalist to find. It peaked at ${peak.heatAfter}, after "${peak.title}". At 85, it all comes out and the career ends.`
      : "Clean enough to be boring. In this building, a compliment." });

    // Stories that ran across a career (content.declassifiedFlags): one line per label, the first
    // entry whose requires hold at the end, so a chain is named by where it finished.
    const told = new Set();
    for (const d of (content.declassifiedFlags || []).concat((content.endgame || {}).declassifiedFlags || [])) {
      if (told.has(d.label) || !meets(d.requires || {}, s)) continue;
      told.add(d.label);
      out.push({ label: d.label, text: sub(d.text, s, content) });
    }

    if (s.rival) out.push(...declassifyRival(content, s));
    out.push({ label: "Legacy", text: legacy(content, s) });
    return out;
  }

  function declassifyRival(content, s) {
    const v = s.rival, p = PRON[v.pron] || PRON.f, out = [];
    const t = title(content, v.rank);
    const where = v.status === "consultancy" ? `Left for a consultancy as ${t}.`
      : v.status === "scandal" ? `Resigned as ${t}. Personal reasons.`
      : v.status === "retired" ? `Retired as ${t}.`
      : v.rank === 16 ? "Prime Minister."
      : `${t} when you finished.`;
    const yrs = n => `${n} year${n === 1 ? "" : "s"}`;
    const level = v.level || 0;
    const ranks = v.ahead + v.behind === 0 ? (level
        ? `Level with you for ${yrs(level)}. Neither outranked the other.`
        : "Never on the same ladder long enough to compare.")
      : !v.behind ? `Outranked you for ${yrs(v.ahead)}. Never the reverse.`
      : !v.ahead ? `You outranked ${p.them} for ${yrs(v.behind)}. Never the reverse.`
      : `Outranked you for ${yrs(v.ahead)}; you outranked ${p.them} for ${yrs(v.behind)}.`;
    out.push({ label: v.name, text: `${where} ${ranks}` });
    out.push({ label: `${v.name}'s ceiling`, text: v.cepStart >= 8 ? `None inside the service. Not mentioned to ${p.them} either.`
      : `${v.cepStart === 7 ? "Permanent Secretary" : title(content, v.cepStart)}. Not mentioned to ${p.them} either.` });
    if (v.met) {
      const times = v.met === 1 ? "Once" : v.met === 2 ? "Twice" : `${cap(NUM[v.met] || String(v.met))} times`;
      const won = v.met === 1 ? (v.wonMet ? "You came out ahead." : `${v.name} came out ahead.`)
        : v.wonMet === v.met ? "You came out ahead every time."
        : v.wonMet === 0 ? `${v.name} came out ahead every time.`
        : `You came out ahead ${v.wonMet === 1 ? "once" : v.wonMet === 2 ? "twice" : `${NUM[v.wonMet] || v.wonMet} times`}.`;
      out.push({ label: "Head to head", text: `${times}. ${won}` });
    }
    const said = v.rel >= 3 ? `"{player} was the best colleague I ever had." Usually when you are not there.`
      : v.rel <= -3 ? "Nothing, in public. In this building, that is a statement."
      : `"{player}? A good colleague." In this building, a complete sentence.`;
    out.push({ label: `What ${v.name} says`, text: sub(said, s, content) });
    return out;
  }

  return { newGame, advance, nextEvent, eventOf, choiceAvailable, eligible, rank, declassify, legacy, batchmate,
    finalLabels, ending, recentKeys, lockedText, statVerdicts, endPlan,
    // the header as data (the event screen, and each page of an outcome), and the next rung's name
    header, nextName,
    // the player's name and gender: the start screen, old saves, the lint and the tests
    player, genders, upgradePlayer, playerWords, playerFields, playerTableProblem,
    // cast and card parts, for the immersion lint and the tests
    render, applyVariant, partSlots, partCombos, roleNeeds, optionNeeds, maxRankForAge, personField, TOKEN,
    article, STATS, QUIET: QUIET_YEAR };
})();

if (typeof module !== "undefined") module.exports = Engine;
