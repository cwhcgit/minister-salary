// Balance simulation. No dependencies — run with: node test/sim.js
// Three bots stand in for three kinds of player. The origin difficulty ladder
// (scholar easiest → poly hardest) must hold for random and win-seeking play;
// if a content change inverts it, the change is wrong.
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..', 'web');
const Engine = require(path.join(ROOT, 'engine.js'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/game.json')));
content.events = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/events.json')));

const BOTS = {
  "first-timer":    null,                                     // picks at random
  "stat-optimiser": f => (f.competence||0)*1.6 + (f.standing||0)*1.5 + (f.reputation||0)*1.2
                       + (f.cep||0)*14 - (f.heat||0)*0.6,
  "knows the win":  f => (f.cep||0)*60 + (f.standing||0)*1.5 + (f.competence||0)*1.4
                       + (f.reputation||0)*1.3 - (f.heat||0)*0.8
};

function play(origin, seed, score) {
  let s = Engine.newGame(content, origin, "Sim", seed);
  for (let t = 0; t < 95 && !s.ending; t++) {
    const n = Engine.nextEvent(content, s); s = n.state;
    if (!n.event) break;
    const live = n.event.choices.map((c,i) => [c,i]).filter(([c]) => Engine.choiceAvailable(c, s));
    let pick;
    if (!score) pick = live[Math.floor(Math.random()*live.length)][1];
    else { let best = -Infinity; for (const [c,i] of live) {
      const v = score(c.effects || {}); if (v > best) { best = v; pick = i; } } }
    s = Engine.advance(content, s, pick).state;
  }
  return s;
}

const N = +process.argv[2] || 800;
for (const [name, score] of Object.entries(BOTS)) {
  console.log(`\n=== ${name} (${N} runs each) ===`);
  for (const origin of ["scholar", "grad", "poly"]) {
    const dist = {}; const wealth = [];
    for (let i = 0; i < N; i++) {
      const s = play(origin, i*7+3, score);
      dist[s.ending || "UNTERMINATED"] = (dist[s.ending || "UNTERMINATED"] || 0) + 1;
      wealth.push(s.wealth);
    }
    wealth.sort((a,b) => a-b);
    console.log(`  ${origin.padEnd(8)} PM ${((100*(dist.pm||0)/N).toFixed(1)+"%").padEnd(7)}`
      + `median $${(wealth[N>>1]/1e6).toFixed(1)}M  ${JSON.stringify(dist)}`);
  }
}
