// Where each card actually fires. Plays seeded careers with three bots across all origins and
// records, per card, the contexts it appears in: rank range, age range, origins, acts, the
// player's seniority, and for consequence cards the years since the choice that scheduled them.
// Card text must make sense in every context listed here; the content auditor reads this table.
//
//   node test/contexts.js [runsPerBotPerOrigin=600] [--json FILE] [--md FILE]
const fs = require('fs'), path = require('path');
const H = require('../harness');

const argv = process.argv.slice(2);
const flag = k => { const i = argv.indexOf(k); return i >= 0 ? argv.splice(i, 2)[1] : null; };
const jsonOut = flag('--json'), mdOut = flag('--md');
const N = +argv[0] || 600;

const BOTS = {
  random: null,
  optimiser: f => (f.competence||0)*1.6 + (f.standing||0)*1.5 + (f.reputation||0)*1.2 + (f.cep||0)*14 - (f.heat||0)*0.6,
  winner: f => (f.cep||0)*60 + (f.standing||0)*1.5 + (f.competence||0)*1.4 + (f.reputation||0)*1.3 - (f.heat||0)*0.8
};
const ORIGINS = ['scholar', 'grad', 'poly'];

function contexts(build, n = N) {
  const cards = {};
  const card = id => cards[id] ||= { fires: 0, ranks: new Set(), ageMin: 99, ageMax: 0, origins: new Set(),
    acts: new Set(), since: [], service: 0, politics: 0, permsec: 0, montage: 0 };
  for (const [bot, score] of Object.entries(BOTS)) for (const origin of ORIGINS) for (let i = 0; i < n; i++) {
    const pick = H.rng((i * 2654435761 + 17) >>> 0);
    let run = H.newRun(origin, i * 7 + 3, { build, name: 'Sim' });
    const scheduledAt = [];   // { eventId, fireYear, year }
    while (run.phase !== 'ending' && run.turn < 95) {
      const S = run.S, ev = H.currentEvent(build, S);
      const base = ev.id.startsWith('__montage:') ? ev.id.slice(10) : ev.id;
      const c = card(base);
      c.fires++; if (ev.id !== base) c.montage++;
      c.ranks.add(S.rank); c.ageMin = Math.min(c.ageMin, S.age); c.ageMax = Math.max(c.ageMax, S.age);
      c.origins.add(origin);
      c.acts.add(['tea_session', 'the_vetting', 'the_election'].includes(base) ? 'II' : S.rank >= 8 ? 'III' : 'I');
      if (S.rank >= 8) c.politics++; else if (S.rank === 7) c.permsec++; else c.service++;
      if (ev.triggered) {
        const k = scheduledAt.findIndex(x => x.eventId === base && x.fireYear <= S.year);
        if (k >= 0) { c.since.push(S.year - scheduledAt[k].year); scheduledAt.splice(k, 1); }
      }
      const live = H.choices(run).filter(x => x.available);
      let id;
      if (!score) id = live[Math.floor(pick() * live.length)].id;
      else {
        let best = -Infinity;
        for (const x of live) {
          const ch = ev.choices['ABCDEFGH'.indexOf(x.id)];
          const v = score(ch.effects || {}) - (ch.privateSector ? 1e6 : 0);
          if (v > best) { best = v; id = x.id; }
        }
      }
      const before = run.S.scheduled.length, year = run.S.year;
      run = H.step(run, id);
      const t = run.turns[run.turns.length - 1];
      for (const sc of t.scheduled) scheduledAt.push({ eventId: sc.eventId, fireYear: sc.fireYear, year });
    }
  }
  const ladder = build.content.ladder;
  const out = {};
  for (const [id, c] of Object.entries(cards)) {
    const r = [...c.ranks].sort((a, b) => a - b);
    const since = c.since.sort((a, b) => a - b);
    out[id] = {
      fires: c.fires, montage: c.montage,
      ranks: r.map(x => ladder[x].title).filter((t, i, a) => a.indexOf(t) === i),
      rankMin: r[0], rankMax: r[r.length - 1],
      inService: c.service, atPermSec: c.permsec, inPolitics: c.politics,
      ages: [c.ageMin, c.ageMax], origins: [...c.origins], acts: [...c.acts].sort(),
      yearsSinceScheduled: since.length ? [since[0], since[since.length - 1]] : null
    };
  }
  return out;
}

function toMarkdown(t) {
  const rows = Object.entries(t).sort(([a], [b]) => a.localeCompare(b)).map(([id, c]) =>
    `| ${id} | ${c.fires}${c.montage ? ` (${c.montage} montage)` : ''} | ${c.ranks.join(', ')} | ${c.inService}/${c.atPermSec}/${c.inPolitics} | ${c.ages[0]}-${c.ages[1]} | ${c.origins.join(' ')} | ${c.yearsSinceScheduled ? c.yearsSinceScheduled.join('-') : ''} |`);
  return ['| card | fires | ranks seen | service / Perm Sec / politics | ages | origins | years since scheduled |',
    '| --- | --- | --- | --- | --- | --- | --- |', ...rows].join('\n') + '\n';
}

if (require.main === module) {
  const t = contexts(H.loadBuild());
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(t, null, 1) + '\n');
  const md = toMarkdown(t);
  if (mdOut) fs.writeFileSync(mdOut, md); else process.stdout.write(md);
}

module.exports = { contexts, toMarkdown };
