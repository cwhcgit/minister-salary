// The harness screen must be exactly what the phone shows. Plays full careers through the
// real DOM and, on every screen, compares what is rendered with harness/screen.js given
// the same saved state. A UI change that is not mirrored in the harness fails here.
// npm i jsdom@24 && node test/screen.test.js
const { JSDOM } = require('jsdom');
const http = require('http'), fs = require('fs'), path = require('path');
const H = require('../harness');
const View = require('../harness/screen');
const ROOT = path.join(__dirname, '..', 'web');
const MIME = { '.html':'text/html', '.js':'text/javascript', '.json':'application/json',
               '.svg':'image/svg+xml', '.webmanifest':'application/manifest+json' };

const server = http.createServer((req,res) => {
  let p = decodeURI(req.url.split('?')[0]); if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end('nope'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'text/plain' });
  res.end(fs.readFileSync(f));
});

const build = H.loadBuild();
const mismatches = [];
const expect = (where, got, want) => {
  if (String(got) !== String(want)) mismatches.push(`${where}: phone ${JSON.stringify(got)} vs harness ${JSON.stringify(want)}`);
};

server.listen(0, async () => {
  const url = 'http://127.0.0.1:' + server.address().port + '/';
  const dom = await JSDOM.fromURL(url, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    beforeParse(w) {
      w.scrollTo = () => {}; w.alert = () => {};
      w.fetch = u => new Promise((res, rej) => http.get(new URL(u, url).href, r => {
        let d=''; r.on('data',c=>d+=c); r.on('end',()=>res({ ok:true, json:()=>Promise.resolve(JSON.parse(d)) }));
      }).on('error', rej));
    }
  });
  const { window } = dom;
  const doc = window.document;
  const $ = s => doc.querySelector(s);
  const $$ = s => [...doc.querySelectorAll(s)];
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const saved = () => JSON.parse(window.localStorage.getItem('ministerSalary.v1'));
  const own = el => [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('');
  const pick = H.rng(2024);

  function compareHeader(where, h) {
    expect(where + ' rank', own($('.rank')), h.rank);
    expect(where + ' grade', $('.grade').textContent, h.grade);
    expect(where + ' sub', $('.sub').textContent, `Age ${h.age} · Year ${h.year} · ${h.ministry}`);
    expect(where + ' cash', $('.cash').textContent, h.wealth);
    expect(where + ' cash label', $('.cashlab').textContent, h.wealthLabel);
    expect(where + ' batchmate', $('.mate') ? $('.mate').textContent : null, h.batchmate ? `Batchmate: ${h.batchmate}` : null);
    $$('.stat').forEach((el, i) => {
      const s = h.stats[i];
      expect(`${where} stat ${i} label`, el.querySelector('.k').textContent, s.label);
      const d = el.querySelector('.d');
      expect(`${where} ${s.key}`, own(el.querySelector('.v')), s.value);
      expect(`${where} ${s.key} delta`, d ? d.textContent : '', s.delta ? `${s.delta > 0 ? '+' : ''}${s.delta}` : '');
    });
  }

  try {
    await wait(500);
    expect('start tagline', $('.tag-line').textContent, View.startCard(build, 'grad').tagline);
    expect('start hint', $('.hint').textContent, View.startCard(build, 'grad').hint);
    let screens = 0;

    // three careers without a batchmate, then three with one
    for (const [origin, rival] of [['scholar', false], ['grad', false], ['poly', false], ['grad', true], ['poly', true], ['scholar', true]]) {
      if ($('#again')) { $('#again').click(); await wait(20); }
      const tog = $('#rival');
      if (!tog) throw new Error('no batchmate toggle on the start screen');
      if (tog.checked !== rival) { tog.checked = rival; tog.dispatchEvent(new window.Event('change')); }
      $$('.origin').find(x => x.dataset.o === origin).click();
      const o = View.startCard(build, origin, rival).origin;
      const card = $$('.origin').find(x => x.dataset.o === origin);
      expect('origin name', card.querySelector('.n span').textContent, o.name);
      expect('origin blurb', card.querySelector('.b').textContent, o.blurb);
      expect('origin difficulty', card.querySelector('.diff').textContent, o.difficulty);
      $('#nm').value = 'Tan Wei Ming';
      $('#go').click(); await wait(30);

      let prev = null;   // the state the UI diffs the outcome screen against
      for (let turn = 0; turn < 130 && !$('.ending'); turn++) {
        const st = saved();
        if (st.phase === 'event') {
          const where = `${origin} seed ${st.S.seed} y${st.S.year} event`;
          compareHeader(where, View.header(build, st.S, null));
          const ev = H.currentEvent(build, st.S);
          const want = View.eventCard(build, st.S, ev);
          expect(where + ' title', $('h2').textContent, want.title);
          expect(where + ' body', $('.body').textContent, want.body);
          const btns = $$('.choice');
          expect(where + ' choice count', btns.length, want.choices.length);
          btns.forEach((b, i) => {
            const c = want.choices[i];
            expect(`${where} choice ${c.id}`, own(b), c.text);
            expect(`${where} choice ${c.id} locked`, b.disabled, !c.available);
            const why = b.querySelector('.why');
            expect(`${where} choice ${c.id} requires`, why ? why.textContent : null, c.requires);
          });
          screens++;
          prev = st.S;
          const live = btns.filter(b => !b.disabled);
          live[Math.floor(pick() * live.length)].click(); await wait(5);
        } else if (st.phase === 'outcome') {
          const where = `${origin} seed ${prev.seed} y${prev.year} outcome`;
          compareHeader(where, View.header(build, st.S, prev));
          const want = View.outcomeCard(st.outcome, st.log);
          expect(where + ' text', $('.outcome').textContent, want.text);
          const items = $$('.li');
          expect(where + ' log length', items.length, want.log.length);
          items.forEach((li, i) => {
            const spans = li.querySelectorAll('span');
            expect(`${where} log ${i} tag`, spans[0].textContent, want.log[i].tag);
            expect(`${where} log ${i} text`, spans[1].textContent, want.log[i].text);
          });
          screens++;
          $('#next').click(); await wait(5);
        } else throw new Error('unexpected phase ' + st.phase);
      }
      if (!$('.ending')) throw new Error(origin + ': career never ended');
      const S = saved().S, want = View.endingCard(build, S);
      expect('ending label', $('.ending .lab').textContent, want.label);
      expect('ending title', $('.ending h1').textContent, want.title);
      expect('ending epitaph', $('.ending .ep').textContent, want.epitaph);
      const vals = $$('.final .v').map(v => v.textContent);
      expect('ending values', vals.join(' | '), [want.position, want.age, want.lifetimeEarnings, want.integrity].join(' | '));
      expect('ending labels', $$('.final .k').map(k => k.textContent).join(' | '), [want.positionLabel, want.ageLabel, 'Lifetime earnings', 'Integrity'].join(' | '));
      const dls = $$('.dl');
      expect('declassified count', dls.length, want.declassified.length);
      dls.forEach((el, i) => {
        expect(`declassified ${i} label`, el.querySelector('.k').textContent, want.declassified[i].label);
        expect(`declassified ${i} text`, el.querySelector('.t').textContent, want.declassified[i].text);
      });
      screens++;
      console.log(`✓ ${origin}${rival ? " + batchmate" : ""}: ${S.year - 1} years, ending "${want.title}", every screen matches`);
    }

    if (mismatches.length) {
      console.log(`\n✗ ${mismatches.length} differences between the phone and harness/screen.js:`);
      mismatches.slice(0, 25).forEach(m => console.log('  ' + m));
      process.exitCode = 1;
    } else console.log(`\nAll ${screens} screens match the harness view.`);
  } catch (e) {
    console.log('\n✗ FAILED: ' + e.message);
    process.exitCode = 1;
  } finally { window.close(); server.close(); }
});
