// Content packs load, play and fail loudly. Free: node test/packs.test.js
const assert = require("assert"), fs = require("fs"), path = require("path"), os = require("os");
const H = require("../harness");
const Packs = require("../web/packs");
const WEB = path.join(__dirname, "..", "web");
let n = 0;
const ok = (name, fn) => { fn(); n++; console.log("✓ " + name); };
const read = f => JSON.parse(fs.readFileSync(path.join(WEB, f), "utf8"));

// A disposable copy of web/ with a pack holding one ordinary card.
function copyWithPack(packEvents, packId = "test_pack") {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ms-packs-"));
  fs.cpSync(WEB, root, { recursive: true });
  fs.writeFileSync(path.join(root, "content/packs/manifest.json"), JSON.stringify({ packs: ["example", packId] }));
  fs.writeFileSync(path.join(root, `content/packs/${packId}.json`), JSON.stringify({ id: packId, title: "Test", events: packEvents }));
  return root;
}
const CARD = { id: "pack_test_card", title: "The Test Card", body: "A card from a pack.", weight: 500, once: true,
  requires: { minRank: 0, maxRank: 2 },
  choices: [{ text: "Do it.", effects: { competence: 1 }, outcome: "Done." }, { text: "Do not.", effects: { standing: 1 }, outcome: "Not done." }] };

ok("the manifest's packs are part of every build, and an empty pack changes nothing", () => {
  const b = H.loadBuild();
  const manifest = read("content/packs/manifest.json");
  const inPacks = manifest.packs.reduce((k, id) => k + read(`content/packs/${id}.json`).events.length, 0);
  assert.strictEqual(b.content.events.length, read("content/events.json").length + inPacks);
});

ok("a pack's cards load with their pack tag, are drawn and play through", () => {
  const b = H.loadBuild({ root: copyWithPack([CARD]) });
  const card = b.content.events.find(e => e.id === CARD.id);
  assert.ok(card && card.pack === "test_pack");
  let seen = false;
  for (let seed = 1; seed < 40 && !seen; seed++) {
    let run = H.newRun("grad", seed, { build: b });
    while (run.phase !== "ending" && run.turn < 95) {
      if (H.currentEvent(b, run.S).id === CARD.id) seen = true;
      run = H.step(run, H.choices(run).find(c => c.available).id);
    }
  }
  assert.ok(seen, "the pack card was never drawn");
});

ok("a duplicate card id across files is refused", () => {
  const dup = { ...CARD, id: read("content/events.json")[0].id };
  assert.throws(() => H.loadBuild({ root: copyWithPack([dup]) }), /duplicate card ids/);
  assert.throws(() => Packs.assemble({}, [CARD], [{ id: "a", events: [CARD] }], null), /duplicate card ids/);
});

ok("a malformed or missing pack is refused", () => {
  assert.throws(() => Packs.assemble({}, [], [{ id: "x" }], null), /malformed pack/);
  const root = copyWithPack([]);
  fs.writeFileSync(path.join(root, "content/packs/manifest.json"), JSON.stringify({ packs: ["no_such_pack"] }));
  assert.throws(() => H.loadBuild({ root }), /ENOENT/);
});

ok("a missing or malformed player table is refused, by the build and by the engine", () => {
  const game = read("content/game.json"), events = read("content/events.json");
  const without = { ...game }; delete without.player;
  const bads = [
    [without, /player\.genders is missing/],
    [{ ...game, player: { ...game.player, genders: {} } }, /player\.genders is missing or empty/],
    [{ ...game, player: { ...game.player, genders: { ...game.player.genders, x: { label: "X" } } } }, /player\.genders\.x has no honorific/],
    [{ ...game, player: { ...game.player, genders: { ...game.player.genders, x: { honorific: "Mx" } } } }, /player\.genders\.x has no label/],
    [{ ...game, player: { ...game.player, default: "z" } }, /player\.default "z"/],
    [{ ...game, player: { ...game.player, names: undefined } }, /player\.names is missing/],
    [{ ...game, player: { ...game.player, names: { ...game.player.names, fatherNames: "Rajan" } } }, /player\.names\.fatherNames is not a list/],
    [{ ...game, player: { ...game.player, genders: { ...game.player.genders, x: { label: "X", honorific: "Mx", given: "Sam" } } } }, /player\.genders\.x has a field "given"/]
  ];
  for (const [g, why] of bads) {
    assert.throws(() => Packs.assemble(JSON.parse(JSON.stringify(g)), events.slice(), [], null), why);
    // the engine never falls back to a copy of its own: newGame throws the same reason
    assert.throws(() => H.getBuild().engine.newGame({ ...H.getBuild().content, player: g.player }, "grad", "", 1), why);
  }
  // and a web/ copy whose game.json has no table does not load at all
  const root = copyWithPack([]);
  fs.writeFileSync(path.join(root, "content/game.json"), JSON.stringify(without));
  assert.throws(() => H.loadBuild({ root }), /player\.genders is missing/);
});

console.log(`\nAll ${n} pack tests passed.`);
