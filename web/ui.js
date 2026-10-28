// Rendering + interaction. Holds no game rules — those live in engine.js.
(() => {
const app = document.getElementById("app");
const SAVE = "ministerSalary.v1";
let content, S = null, phase = "start", outcome = "", log = [], prev = null, pickedOrigin = "grad";
// Play with a batchmate: remembered between runs as a convenience, saved inside each run as S.rival.
let rivalOn = (() => { try { return localStorage.getItem("ms.rival") === "1"; } catch (e) { return false; } })();

const money = n =>
  Math.abs(n) >= 1e6 ? "$" + (n / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M"
                     : "$" + Math.round(n).toLocaleString();

const STATKEYS = [
  ["reputation", "Rep",   "--rep"],
  ["standing",   "Stand", "--std"],
  ["integrity",  "Integ", "--int"],
  ["competence", "Comp",  "--com"]
];

// Log tags as the player reads them. CEP hints and Heat rumours are both just rumours on
// screen: naming the hidden values would give away what the player is meant to infer.
const TAG_LABEL = { cep: "rumour", heat: "rumour", rival: "batchmate" };

const esc = s => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

// Cards seen in the last two runs on this phone, so the next career does not replay the last one.
// A convenience only: if storage is blocked, every run is simply drawn fresh.
const RECENT = "ms.recent";
function recentList() {
  try { const r = JSON.parse(localStorage.getItem(RECENT)); return Array.isArray(r) ? r.flat().filter(x => typeof x === "string") : []; }
  catch (e) { return []; }
}
function rememberRun() {
  try {
    const prev = JSON.parse(localStorage.getItem(RECENT) || "[]");
    const runs = Array.isArray(prev) ? prev.filter(Array.isArray) : [];
    runs.unshift(Engine.recentKeys(content, S));
    localStorage.setItem(RECENT, JSON.stringify(runs.slice(0, 2)));
  } catch (e) {}
}

// Storage can be blocked (private windows, embedded previews); the game must still play.
function save()  { try { if (S) localStorage.setItem(SAVE, JSON.stringify({ S, phase, outcome, log })); } catch (e) {} }
function wipe()  { try { localStorage.removeItem(SAVE); } catch (e) {} }
function load()  {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE));
    if (d && d.S) { S = d.S; phase = d.phase; outcome = d.outcome; log = d.log || []; return true; }
  } catch (e) {}
  return false;
}

// ---------- header + stats ----------
function header() {
  const r = Engine.rank(content, S);
  const delta = k => {
    if (!prev || prev[k] === S[k]) return "";
    const d = S[k] - prev[k];
    return `<span class="d ${d > 0 ? "up" : "dn"}">${d > 0 ? "+" : ""}${d}</span>`;
  };
  return `<header>
    <div class="rankline">
      <div>
        <div class="rank">${esc(r.title)}<span class="grade">${esc(r.grade)}</span></div>
        <div class="sub">Age ${S.age} &middot; Year ${S.year} &middot; ${esc(S.ministry)}</div>
        ${S.rival ? `<div class="mate">Batchmate: ${esc(Engine.batchmate(content, S))}</div>` : ""}
      </div>
      <div class="cashbox"><div class="cash">${money(S.wealth)}</div><div class="cashlab">lifetime earnings</div></div>
    </div>
    <div class="stats">${STATKEYS.map(([k, label, col]) => `
      <div class="stat">
        <div class="k">${label}</div>
        <div class="v">${S[k]}${delta(k)}</div>
        <div class="track"><div class="fill" style="width:${S[k]}%;background:var(${col})"></div></div>
      </div>`).join("")}</div>
  </header>`;
}

// ---------- screens ----------
function startScreen() {
  app.innerHTML = `
    <div class="title serif">Minister<br>Salary</div>
    <div class="tag-line">You join the public service at the bottom. The formula that sets the Prime Minister's pay is published, and so is the distance between you and it.</div>
    <input id="nm" placeholder="Your name" maxlength="28" value="${esc((() => { try { return localStorage.getItem("ms.name") || ""; } catch (e) { return ""; } })())}">
    ${content.origins.map(o => `
      <div class="origin" role="radio" tabindex="0" data-o="${o.id}" aria-checked="${o.id === pickedOrigin}">
        <div class="n"><span>${esc(o.name)}</span><span class="diff">${esc(o.difficulty + (rivalOn ? " + batchmate" : ""))}</span></div>
        <div class="b">${esc(o.blurb)}</div>
      </div>`).join("")}
    ${content.rival ? `<label class="mate-toggle" for="rival">
      <input type="checkbox" id="rival" ${rivalOn ? "checked" : ""}>
      <span><span class="mt">Join with a batchmate</span>
      <span class="mn">Someone from your intake, on the same ladder, competing for the same promotion slots. Harder.</span></span>
    </label>` : ""}
    <button class="primary" id="go">Begin</button>
    <div class="hint">One tap is one year. Choices are permanent, and some of them come back.</div>`;

  app.querySelectorAll(".origin").forEach(el =>
    el.onclick = () => {
      pickedOrigin = el.dataset.o;
      app.querySelectorAll(".origin").forEach(x => x.setAttribute("aria-checked", x === el));
    });

  const toggle = app.querySelector("#rival");
  if (toggle) toggle.onchange = () => {
    rivalOn = toggle.checked;
    try { localStorage.setItem("ms.rival", rivalOn ? "1" : "0"); } catch (e) {}
    app.querySelectorAll(".origin").forEach(el => {
      const o = content.origins.find(x => x.id === el.dataset.o);
      el.querySelector(".diff").textContent = o.difficulty + (rivalOn ? " + batchmate" : "");
    });
  };

  app.querySelector("#go").onclick = () => {
    const name = (app.querySelector("#nm").value || "").trim() || "You";
    try { localStorage.setItem("ms.name", name); } catch (e) {}
    S = Engine.newGame(content, pickedOrigin, name, (Math.random() * 2 ** 31) | 0, { rival: rivalOn && !!content.rival, recent: recentList() });
    prev = null;
    nextTurn();
  };
}

function eventScreen() {
  const ev = Engine.eventOf(content, S) || Engine.QUIET;
  app.innerHTML = header() + `
    <div class="card">
      <h2 class="serif">${esc(ev.title)}</h2>
      <div class="body serif">${esc(ev.body)}</div>
      <div class="choices">${ev.choices.map((c, i) => {
        const ok = Engine.choiceAvailable(c, S);
        const why = ok ? "" : `<span class="why">Requires ${Object.entries(c.requiresStat)
          .map(([k, v]) => `${k} ${v}`).join(", ")}</span>`;
        return `<button class="choice" data-i="${i}" ${ok ? "" : "disabled"}>${esc(c.text)}${why}</button>`;
      }).join("")}</div>
    </div>`;
  app.querySelectorAll(".choice").forEach(b =>
    b.onclick = () => choose(+b.dataset.i));
}

function outcomeScreen() {
  app.innerHTML = header() + `
    <div class="card">
      <div class="outcome serif">${esc(outcome)}</div>
      <div class="log">${log.map(l => `
        <div class="li"><span class="tag t-${l.kind}">${TAG_LABEL[l.kind] || l.kind}</span>
        <span>${esc(l.text)}</span></div>`).join("")}</div>
      <button class="primary" id="next">Confirm Another Year</button>
    </div>`;
  app.querySelector("#next").onclick = nextTurn;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function endingScreen() {
  const e = content.endings.find(x => x.id === S.ending);
  const r = Engine.rank(content, S);
  const L = Engine.finalLabels(content, S);
  app.innerHTML = `
    <div class="card ending">
      <div class="lab">${esc(S.name)} &middot; the final position</div>
      <h1 class="serif">${esc(e.title)}</h1>
      <div class="ep serif">${esc(e.epitaph)}</div>
      <div class="final">
        <div><div class="k">${esc(L.position)}</div><div class="v" style="font-size:15px">${esc(r.title)}</div></div>
        <div><div class="k">${esc(L.age)}</div><div class="v">${S.age}</div></div>
        <div><div class="k">Lifetime earnings</div><div class="v" style="color:var(--cash)">${money(S.wealth)}</div></div>
        <div><div class="k">Integrity</div><div class="v">${S.integrity}</div></div>
      </div>
      <div class="declass">
        <div class="lab">Declassified</div>
        ${Engine.declassify(content, S).map(l => `
          <div class="dl"><div class="k">${esc(l.label)}</div><div class="t">${esc(l.text)}</div></div>`).join("")}
      </div>
      <button class="primary" id="again">Start Again</button>
      <button class="primary ghost" id="share" style="margin-top:8px">Share this ending</button>
    </div>`;
  app.querySelector("#again").onclick = () => { wipe(); S = null; phase = "start"; startScreen(); };
  app.querySelector("#share").onclick = () => {
    const txt = `Minister Salary — ${e.title}\n${S.name} ${L.share} ${S.ending === "pm" ? "" : r.title + " at "}${S.age}, having earned ${money(S.wealth)}.\n${location.href}`;
    if (navigator.share) navigator.share({ text: txt }).catch(() => {});
    else navigator.clipboard.writeText(txt).then(() => alert("Copied."));
  };
}

// ---------- turn flow ----------
function choose(i) {
  prev = { ...S };
  const r = Engine.advance(content, S, i);
  S = r.state; outcome = r.outcome; log = r.log;
  phase = S.ending ? "ending" : "outcome";
  if (S.ending) rememberRun();
  save(); render();
}

function nextTurn() {
  if (S.ending) { phase = "ending"; save(); return render(); }
  prev = { ...S };
  const r = Engine.nextEvent(content, S);
  S = r.state;
  phase = S.ending ? "ending" : "event";
  save(); render();
}

function render() {
  if (phase === "start")   return startScreen();
  if (phase === "event")   return eventScreen();
  if (phase === "outcome") return outcomeScreen();
  if (phase === "ending")  return endingScreen();
}

// ---------- boot ----------
Promise.all([
  fetch("content/game.json").then(r => r.json()),
  fetch("content/events.json").then(r => r.json()),
  // the batchmate's cards; optional, so an old cached copy without them still plays
  fetch("content/rival.json").then(r => (r.ok ? r.json() : null)).catch(() => null)
]).then(([g, ev, rv]) => {
  content = g; content.events = ev;
  if (rv) content.rival = rv;
  if (load() && S) render(); else startScreen();
}).catch(err => {
  app.innerHTML = `<div class="card"><h2>Could not load content</h2>
    <div class="body">${esc(err.message)}</div></div>`;
});

if ("serviceWorker" in navigator)
  navigator.serviceWorker.register("sw.js").catch(() => {});
})();
