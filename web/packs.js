// Content packs. The game's cards live in content/events.json plus any number of packs, one
// file per theme (content/packs/<id>.json), listed in content/packs/manifest.json. The phone
// (ui.js) and the harness both assemble content through this one function, so a duplicate
// card id or a malformed pack fails the same way everywhere. No game rules live here.
const Packs = (() => {
  const DIR = "content/packs/";

  // game: game.json; events: events.json; packs: [{ id, title, events: [...] }]; rival: rival.json or null
  function assemble(game, events, packs, rival) {
    const all = events.slice();
    for (const p of (packs || [])) {
      if (!p || typeof p.id !== "string" || !Array.isArray(p.events)) throw new Error(`malformed pack ${p && p.id}`);
      // each card remembers its pack, for reports; the screen never shows it
      for (const e of p.events) all.push(e.pack === p.id ? e : Object.assign({ pack: p.id }, e));
    }
    const ids = all.concat((rival && rival.events) || []).map(e => e.id);
    const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
    if (dup.length) throw new Error(`duplicate card ids: ${[...new Set(dup)].join(", ")}`);
    game.events = all;
    if (rival) game.rival = rival;
    return game;
  }

  return { DIR, assemble };
})();

if (typeof module !== "undefined") module.exports = Packs;
