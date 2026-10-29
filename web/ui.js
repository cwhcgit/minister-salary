// Rendering + interaction. Holds no game rules — those live in engine.js.
(() => {
const app = document.getElementById("app");
const SAVE = "ministerSalary.v1";
let content, S = null, phase = "start", outcome = "", log = [], pickedOrigin = "grad";
// Play with a batchmate: remembered between runs as a convenience, saved inside each run as S.rival.
let rivalOn = (() => { try { return localStorage.getItem("ms.rival") === "1"; } catch (e) { return false; } })();
// The player's gender, for how colleagues, the papers and Hansard refer to them: remembered like
// the name, saved inside each run as S.gender. Text only.
const GENDERS = [["f", "Female"], ["m", "Male"]];
let pickedGender = (() => { try { return localStorage.getItem("ms.gender") === "m" ? "m" : "f"; } catch (e) { return "f"; } })();
// The remembered name. Older versions stored "You" for a blank name, which is a blank name.
const rememberedName = () => { try { const n = localStorage.getItem("ms.name") || ""; return n === "You" ? "" : n; } catch (e) { return ""; } };

const money = n =>
  Math.abs(n) >= 1e6 ? "$" + (n / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M"
                     : "$" + Math.round(n).toLocaleString();

// The four stats are hidden during play and revealed on the ending screen, in these colours.
const STATCOL = { reputation: "--rep", standing: "--std", integrity: "--int", competence: "--com" };
const STATS_LABEL = "Your numbers";

// Log tags as the player reads them. CEP hints and Heat rumours are both just rumours on
// screen: naming the hidden values would give away what the player is meant to infer.
const TAG_LABEL = { cep: "rumour", heat: "rumour", rival: "batchmate", noted: "appraisal" };

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
    // a save from before the start screen asked for a gender gets the defaults (Engine.upgradePlayer)
    if (d && d.S) { S = Engine.upgradePlayer(content, d.S); phase = d.phase; outcome = d.outcome; log = d.log || []; return true; }
  } catch (e) {}
  return false;
}

// ---------- header ----------
// Rank, grade, age, year, ministry and earnings. No stat values: those are kept for the end.
function header() {
  const r = Engine.rank(content, S);
  return `<header>
    <div class="rankline">
      <div>
        <div class="rank">${esc(r.title)}<span class="grade">${esc(r.grade)}</span></div>
        <div class="sub">Age ${S.age} &middot; Year ${S.year} &middot; ${esc(S.ministry)}</div>
        ${S.rival ? `<div class="mate">Batchmate: ${esc(Engine.batchmate(content, S))}</div>` : ""}
      </div>
      <div class="cashbox"><div class="cash">${money(S.wealth)}</div><div class="cashlab">lifetime earnings</div></div>
    </div>
  </header>`;
}

// ---------- screens ----------
function startScreen() {
  app.innerHTML = `
    <div class="title serif">Minister<br>Salary</div>
    <div class="tag-line">You join the public service. The formula that sets the Prime Minister's pay is published, and so is the distance between you and it.</div>
    <input id="nm" placeholder="Your name" maxlength="28" value="${esc(rememberedName())}">
    <div class="gender" role="radiogroup" aria-label="Gender">${GENDERS.map(([g, label]) =>
      `<div class="g" role="radio" tabindex="0" data-g="${g}" aria-checked="${g === pickedGender}">${label}</div>`).join("")}</div>
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
    <div class="hint">One tap is one year, and every year ends with an appraisal grade. A or B+ gets you considered for promotion; two Ds in a row and you are asked to leave. Choices are permanent, and some of them come back.</div>`;

  app.querySelectorAll(".origin").forEach(el =>
    el.onclick = () => {
      pickedOrigin = el.dataset.o;
      app.querySelectorAll(".origin").forEach(x => x.setAttribute("aria-checked", x === el));
    });

  app.querySelectorAll(".gender .g").forEach(el => {
    el.onclick = () => {
      pickedGender = el.dataset.g;
      try { localStorage.setItem("ms.gender", pickedGender); } catch (e) {}
      app.querySelectorAll(".gender .g").forEach(x => x.setAttribute("aria-checked", x === el));
    };
    el.onkeydown = ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); el.onclick(); } };
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
    // a blank name stays blank here: the engine draws one for the run, a new one each run
    const name = (app.querySelector("#nm").value || "").trim();
    try { localStorage.setItem("ms.name", name); } catch (e) {}
    S = Engine.newGame(content, pickedOrigin, name, (Math.random() * 2 ** 31) | 0,
      { rival: rivalOn && !!content.rival, recent: recentList(), gender: pickedGender });
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
        // a locked choice says why in words, never the number it needs
        const why = ok ? "" : `<span class="why">${esc(Engine.lockedText(content, c))}</span>`;
        return `<button class="choice" data-i="${i}" ${ok ? "" : "disabled"}>${esc(c.text)}${why}</button>`;
      }).join("")}</div>
    </div>`;
  app.querySelectorAll(".choice").forEach(b =>
    b.onclick = () => choose(+b.dataset.i));
}

function outcomeScreen() {
  // One screen per event: the card's outcome first, then each year's review on its own page.
  // Every page is in the document (one shown at a time), so the log reads the same as before.
  const pages = [[]];
  log.forEach(l => { if (l.kind === "year") pages.push([l]); else pages[pages.length - 1].push(l); });
  const last = pages.length - 1;
  app.innerHTML = header() + pages.map((pg, k) => `
    <div class="card page" data-p="${k}"${k ? " hidden" : ""}>
      ${k === 0 ? `<div class="outcome serif">${esc(outcome)}</div>` : ""}
      <div class="log">${pg.map(l => `
        <div class="li${l.kind === "year" ? " yr" : ""}"><span class="tag t-${l.kind}">${TAG_LABEL[l.kind] || l.kind}</span>
        <span>${esc(l.text)}</span></div>`).join("")}</div>
      ${k === last ? `<button class="primary" id="next">${S.ending ? "The Final Position" : "Confirm Another Year"}</button>` : `<button class="primary more">Continue</button>`}
    </div>`).join("");
  app.querySelectorAll(".more").forEach(b => b.onclick = () => {
    const page = b.closest(".page"), k = +page.dataset.p;
    page.hidden = true;
    app.querySelector(`.page[data-p="${k + 1}"]`).hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  app.querySelector("#next").onclick = nextTurn;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function endingScreen() {
  const e = Engine.ending(content, S);
  const r = Engine.rank(content, S);
  const L = Engine.finalLabels(content, S);
  app.innerHTML = `
    <div class="card ending">
      <div class="lab">${esc(Engine.player(content, S).name)} &middot; the final position</div>
      <h1 class="serif">${esc(e.title)}</h1>
      <div class="ep serif">${esc(e.epitaph)}</div>
      <div class="final">
        <div><div class="k">${esc(L.position)}</div><div class="v" style="font-size:15px">${esc(r.title)}</div></div>
        <div><div class="k">${esc(L.age)}</div><div class="v">${S.age}</div></div>
        <div class="wide"><div class="k">Lifetime earnings</div><div class="v" style="color:var(--cash)">${money(S.wealth)}</div></div>
      </div>
      <div class="reveal">
        <div class="lab">${STATS_LABEL}</div>
        ${Engine.statVerdicts(content, S).map(x => `
          <div class="rv">
            <div class="rk"><span class="k">${esc(x.label)}</span><span class="v">${x.value}</span></div>
            <div class="track"><div class="fill" style="width:${x.value}%;background:var(${STATCOL[x.key]})"></div></div>
            <div class="t">${esc(x.text)}</div>
          </div>`).join("")}
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
  const btn = app.querySelector("#share");
  btn.onclick = () => { btn.disabled = true; shareEnding().finally(() => { btn.disabled = false; }); };
}

// ---------- sharing the ending ----------
// The result as a picture, with the game's link as text alongside. The picture carries the ending
// and the four numbers, never the Declassified file: that would spoil the game for whoever gets it.
function shareCard() {
  const e = Engine.ending(content, S), r = Engine.rank(content, S), L = Engine.finalLabels(content, S);
  const o = content.origins.find(x => x.id === S.origin) || { name: S.origin, difficulty: "" };
  const name = Engine.player(content, S).name;
  // the public game, never a local or preview address
  const here = location.href.split("#")[0].split("?")[0];
  const url = /^https:\/\/[^/]*github\.io\//.test(here) ? here : "https://cwhcgit.github.io/minister-salary/";
  return {
    game: "Minister Salary",
    name,
    title: e.title, epitaph: e.epitaph,
    position: { label: L.position, value: r.title }, age: { label: L.age, value: String(S.age) },
    earnings: money(S.wealth),
    stats: Engine.statVerdicts(content, S),
    origin: o.name, difficulty: o.difficulty + (S.rival ? " + batchmate" : ""),
    url, site: url.replace(/^https?:\/\//, "").replace(/index\.html$/, "").replace(/\/$/, ""),
    line: `${name} ${L.share} ${S.ending === "pm" ? "" : r.title + " at "}${S.age}, having earned ${money(S.wealth)}.`
  };
}

const SERIF = 'ui-serif, Georgia, "Times New Roman", serif';
const SANS = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

// Draws the card in the page's own style, 1080 wide and as tall as its text needs.
function drawCard(canvas, card) {
  const ctx = canvas.getContext && canvas.getContext("2d");
  if (!ctx) throw new Error("this browser cannot draw the picture");
  const css = (k, d) => { try { return getComputedStyle(document.documentElement).getPropertyValue(k).trim() || d; } catch (err) { return d; } };
  const C = { bg: css("--bg", "#14171c"), panel: css("--panel", "#1c2028"), panel2: css("--panel2", "#232833"), line: css("--line", "#2e3542"),
    ink: css("--ink", "#e8e6e1"), dim: css("--dim", "#8e97a6"), faint: css("--faint", "#5d6675"), cash: css("--cash", "#d4574e"), soft: "#c3cad6" };
  const W = 1080, M = 40, P = 72, X = M + P, IN = W - 2 * X, GAP = 18;
  const f = (w, px, fam) => `${w} ${px}px ${fam}`;
  const spaced = px => (px * 0.12).toFixed(1) + "px";
  const wrap = (text, font, max, spacing) => {
    ctx.font = font;
    if ("letterSpacing" in ctx) ctx.letterSpacing = spacing || "0px";
    const out = [];
    let cur = "";
    for (const w of String(text).split(/\s+/).filter(Boolean)) {
      const t = cur ? cur + " " + w : w;
      if (cur && ctx.measureText(t).width > max) { out.push(cur); cur = w; } else cur = t;
    }
    if (cur) out.push(cur);
    return out;
  };
  const rect = (x, y, w, h, r, fill, stroke) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
  };

  // One pass to measure, one to draw. `y` is the top of the next line.
  const pass = draw => {
    let y = M + P;
    const text = (t, font, color, x, base, align, spacing) => {
      if (!draw) return;
      ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align || "left"; ctx.textBaseline = "alphabetic";
      if ("letterSpacing" in ctx) ctx.letterSpacing = spacing || "0px";
      ctx.fillText(t, x, base);
    };
    // a wrapped paragraph; returns its height
    const para = (t, font, px, lh, color, opts = {}) => {
      const x = opts.x === undefined ? X : opts.x, max = opts.max || IN, top = opts.top === undefined ? y : opts.top;
      const ls = wrap(t, font, max, opts.spacing);
      ls.forEach((l, i) => text(l, font, color, opts.align === "center" ? x + max / 2 : x, top + i * px * lh + px * (lh + 0.6) / 2, opts.align, opts.spacing));
      return ls.length * px * lh;
    };
    const label = (t, x, top, max, color) => para(t.toUpperCase(), f(600, 22, SANS), 22, 1.3, color || C.faint, { x, top, max, spacing: spaced(22) });

    if (draw) {
      ctx.fillStyle = C.bg; ctx.fillRect(0, 0, canvas.width, canvas.height);
      rect(M, M, W - 2 * M, canvas.height - 2 * M, 36, C.panel, C.line);
    }
    y += para(card.game.toUpperCase(), f(700, 26, SANS), 26, 1.3, C.dim, { align: "center", spacing: spaced(26) }) + 8;
    y += para(((card.name ? card.name + " · " : "") + "the final position").toUpperCase(), f(500, 22, SANS), 22, 1.4, C.faint, { align: "center", spacing: spaced(22) }) + 22;
    y += para(card.title, f(700, 76, SERIF), 76, 1.12, C.ink, { align: "center" }) + 30;
    y += para(card.epitaph, f(400, 36, SERIF), 36, 1.5, C.soft) + 40;

    // the final position and age side by side, then lifetime earnings
    const w1 = Math.round((IN - GAP) * 0.66), w2 = IN - GAP - w1, pad = 26;
    const posLines = wrap(card.position.value, f(650, 40, SANS), w1 - 2 * pad);
    const boxH = pad + 22 * 1.3 + 10 + Math.max(1, posLines.length) * 40 * 1.2 + pad - 6;
    if (draw) { rect(X, y, w1, boxH, 18, C.panel2); rect(X + w1 + GAP, y, w2, boxH, 18, C.panel2); }
    label(card.position.label, X + pad, y + pad, w1 - 2 * pad);
    label(card.age.label, X + w1 + GAP + pad, y + pad, w2 - 2 * pad);
    para(card.position.value, f(650, 40, SANS), 40, 1.2, C.ink, { x: X + pad, top: y + pad + 22 * 1.3 + 10, max: w1 - 2 * pad });
    para(card.age.value, f(650, 40, SANS), 40, 1.2, C.ink, { x: X + w1 + GAP + pad, top: y + pad + 22 * 1.3 + 10, max: w2 - 2 * pad });
    y += boxH + GAP;
    const cashH = pad + 22 * 1.3 + 10 + 56 * 1.15 + pad - 6;
    if (draw) rect(X, y, IN, cashH, 18, C.panel2);
    label("Lifetime earnings", X + pad, y + pad, IN - 2 * pad);
    para(card.earnings, f(700, 56, SANS), 56, 1.15, C.cash, { x: X + pad, top: y + pad + 22 * 1.3 + 10, max: IN - 2 * pad });
    y += cashH + 44;

    // the four numbers, hidden until the end, each with its verdict
    y += label(STATS_LABEL, X, y, IN) + 18;
    for (const st of card.stats) {
      text(st.label.toUpperCase(), f(600, 24, SANS), C.dim, X, y + 34, "left", spaced(24));
      text(String(st.value), f(700, 44, SANS), C.ink, X + IN, y + 38, "right");
      y += 52;
      if (draw) {
        rect(X, y, IN, 8, 4, "#000");
        if (st.value > 0) rect(X, y, Math.max(8, IN * st.value / 100), 8, 4, css(STATCOL[st.key], C.ink));
      }
      y += 20;
      y += para(st.text, f(400, 28, SANS), 28, 1.45, C.soft) + 34;
    }

    // where the career started, then the link
    y += 6;
    y += label("Origin", X, y, IN) + 6;
    y += para(`${card.origin} · ${card.difficulty}`, f(500, 30, SANS), 30, 1.4, C.ink) + 40;
    if (draw) { ctx.fillStyle = C.line; ctx.fillRect(X, y, IN, 2); }
    y += 30;
    y += para(card.site, f(500, 28, SANS), 28, 1.4, C.dim, { align: "center" });
    return Math.ceil(y + P + M - 10);
  };
  canvas.width = W;
  canvas.height = 2400;
  canvas.height = pass(false);
  pass(true);
  return canvas;
}

async function cardPng(card) {
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (err) {}
  const canvas = drawCard(document.createElement("canvas"), card);
  return new Promise((res, rej) => {
    if (!canvas.toBlob) return rej(new Error("this browser cannot save the picture"));
    canvas.toBlob(b => (b ? res(b) : rej(new Error("the picture came out empty"))), "image/png");
  });
}

function toast(msg) {
  const old = document.querySelector(".toast");
  if (old) old.remove();
  const t = document.createElement("div");
  t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("out"), 2600);
  setTimeout(() => t.remove(), 3100);
}
function copyText(text) {
  try { return navigator.clipboard.writeText(text).then(() => true, () => false); }
  catch (err) { return Promise.resolve(false); }
}
function savePng(blob) {
  try {
    const a = document.createElement("a"), u = URL.createObjectURL(blob);
    a.href = u; a.download = "minister-salary.png"; a.style.display = "none";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(u), 10000);
    return true;
  } catch (err) { return false; }
}

// The share sheet with the picture where the phone allows it; otherwise the picture is saved
// and the words and link are copied. The words alone are the last resort.
async function shareEnding() {
  const card = shareCard(), title = `Minister Salary — ${card.title}`;
  const words = `${title}\n${card.line}`, plain = `${words}\n${card.url}`;
  let png = null;
  try { png = await cardPng(card); } catch (err) { png = null; }
  if (png) {
    let file = null;
    try { file = new File([png], "minister-salary.png", { type: "image/png" }); } catch (err) {}
    if (file && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title, text: words, url: card.url }); return; }
      catch (err) { if (err && err.name === "AbortError") return; }   // the player closed the share sheet
    }
    if (savePng(png)) {
      toast(await copyText(plain) ? "Picture saved. The words and link are copied too." : "Picture saved.");
      return;
    }
  }
  if (navigator.share) {
    try { await navigator.share({ text: plain }); return; }
    catch (err) { if (err && err.name === "AbortError") return; }
  }
  toast(await copyText(plain) ? "Copied, ready to paste." : "This browser cannot share. Take a screenshot instead.");
}

// ---------- turn flow ----------
function choose(i) {
  const r = Engine.advance(content, S, i);
  S = r.state; outcome = r.outcome; log = r.log;
  // the last choice's outcome (and the last year-end review) is shown too, before the ending
  phase = "outcome";
  if (S.ending) rememberRun();
  save(); render();
}

function nextTurn() {
  if (S.ending) { phase = "ending"; save(); return render(); }
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
const optional = u => fetch(u).then(r => (r.ok ? r.json() : null)).catch(() => null);
const pack = id => fetch(Packs.DIR + id + ".json").then(r => {
  if (!r.ok) throw new Error(`content pack "${id}" is missing`);
  return r.json();
});
Promise.all([
  fetch("content/game.json").then(r => r.json()),
  fetch("content/events.json").then(r => r.json()),
  // the batchmate's cards; optional, so an old cached copy without them still plays
  optional("content/rival.json"),
  // content packs, listed in the manifest (optional, so an old cached copy still plays)
  optional(Packs.DIR + "manifest.json").then(m => Promise.all(((m && m.packs) || []).map(pack)))
]).then(([g, ev, rv, packs]) => {
  content = Packs.assemble(g, ev, packs, rv);
  if (load() && S) render(); else startScreen();
}).catch(err => {
  app.innerHTML = `<div class="card"><h2>Could not load content</h2>
    <div class="body">${esc(err.message)}</div></div>`;
});

if ("serviceWorker" in navigator)
  navigator.serviceWorker.register("sw.js").catch(() => {});
})();
