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
    const bad = playerProblem(game.player);
    if (bad) throw new Error(`game.json player table: ${bad}`);
    game.events = all;
    if (rival) game.rival = rival;
    return game;
  }

  // The start screen's choices (game.json player.genders) are the only source of the player's
  // honorifics and pronouns, and player.names of how a typed name is read: a build without them,
  // or with a malformed table, is refused.
  // Same rules as the engine's playerTableProblem.
  function playerProblem(P) {
    const G = P && P.genders;
    if (!G || typeof G !== "object" || Array.isArray(G) || !Object.keys(G).length) return "player.genders is missing or empty";
    for (const [id, g] of Object.entries(G)) {
      if (!g || typeof g !== "object") return `player.genders.${id} is not an object`;
      if (typeof g.label !== "string" || !g.label) return `player.genders.${id} has no label`;
      if (typeof g.honorific !== "string" || !g.honorific) return `player.genders.${id} has no honorific`;
      const taken = ["name", ...FORMS].find(k => Object.keys(g).some(x => x.toLowerCase() === k));
      if (taken) return `player.genders.${id} has a field "${taken}", which is a form of the player's name`;
    }
    if (!Object.prototype.hasOwnProperty.call(G, P.default)) return `player.default "${P.default}" is not one of player.genders`;
    const N = P.names;
    if (!N || typeof N !== "object" || Array.isArray(N)) return "player.names is missing (the lists a typed name is read by)";
    for (const k of NAME_LISTS) if (!Array.isArray(N[k]) || N[k].some(x => typeof x !== "string" || !x)) return `player.names.${k} is not a list of words`;
    return null;
  }
  // the forms of the player's name, and the lists a typed name is read by (as engine.js)
  const FORMS = ["given", "formal", "full"];
  const NAME_LISTS = ["chineseSurnames", "chineseGiven", "surnames", "fatherNames", "patronymics", "surnameParticles", "noSurname", "dropFromGiven"];

  return { DIR, assemble, playerProblem };
})();

if (typeof module !== "undefined") module.exports = Packs;
