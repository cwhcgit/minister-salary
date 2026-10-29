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
    expect(where + ' sub', $('.sub').textContent, `Age ${h.age} · Year ${h.year} · ${h.place}`);
    expect(where + ' cash', $('.cash').textContent, h.wealth);
    expect(where + ' cash label', $('.cashlab').textContent, h.wealthLabel);
    expect(where + ' batchmate', $('.mate') ? $('.mate').textContent : null, h.batchmate ? `Batchmate: ${h.batchmate}` : null);
    // the four stats are hidden during play: no values, bars or changes anywhere in the header
    // the Reincarnate button is a control, not part of the screen the harness shows
    const hd = $('header').cloneNode(true); hd.querySelectorAll('.newcareer').forEach(b => b.remove());
    expect(where + ' header text', hd.textContent.replace(/\s+/g, ' ').trim(),
      [`${h.rank}${h.grade}`, `Age ${h.age} · Year ${h.year} · ${h.place}`, h.batchmate ? `Batchmate: ${h.batchmate}` : null, h.wealth + h.wealthLabel].filter(Boolean).join(' '));
    expect(where + ' stat bars', $$('header .track, header .stat').length, 0);
  }

  try {
    await wait(500);
    expect('start tagline', $('.tag-line').textContent, View.startCard(build, 'grad').tagline);
    expect('start hint', $('.hint').textContent, View.startCard(build, 'grad').hint);
    // the name field and the gender choice (Female first, and chosen until the player picks)
    expect('start name placeholder', $('#nm').placeholder, View.startCard(build, 'grad').namePlaceholder);
    expect('start genders', $$('.gender .g').map(g => g.textContent).join(' | '), View.startCard(build, 'grad').genders.join(' | '));
    expect('start gender chosen', $$('.gender .g').map(g => g.getAttribute('aria-checked')).join(' '), 'true false');
    let screens = 0, payLines = 0, witnessLines = 0;   // (witnesses: seeds vary, so counted, not required)

    // three careers without a batchmate, then three with one; as Female and as Male, with a typed
    // name and with the field left blank (a name is drawn for the run)
    const careers = [['scholar', false, 'f', 'Tan Wei Ming'], ['grad', false, 'm', 'Tan Wei Ming'], ['poly', false, 'm', ''],
      ['grad', true, 'f', ''], ['poly', true, 'f', 'Tan Wei Ming'], ['scholar', true, 'm', 'Tan Wei Ming']];
    for (const [origin, rival, gender, typed] of careers) {
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
      $$('.gender .g').find(g => g.dataset.g === gender).click();
      expect('gender chosen', $$('.gender .g').map(g => g.getAttribute('aria-checked')).join(' '), gender === 'f' ? 'true false' : 'false true');
      $('#nm').value = typed;
      $('#go').click(); await wait(30);
      const S0 = saved().S;
      expect('run gender', S0.gender, gender);
      if (typed) expect('run name', S0.name, typed);
      else expect('a drawn name for the gender', (build.content.cast.names.find(n => n.full === S0.name) || {}).pron, gender);
      // the start screen as the harness shows it, for this run
      const st = View.startCard(build, origin, rival, { name: S0.name, gender: S0.gender });
      expect('start card player', `${st.player.name} (${st.player.gender})`, `${S0.name} (${gender === 'f' ? 'Female' : 'Male'})`);

      let prev = null;   // the state the last choice was made in (names the outcome screen in messages)
      for (let turn = 0; turn < 130 && !$('.ending'); turn++) {
        const st = saved();
        if (st.phase === 'event') {
          const where = `${origin} seed ${st.S.seed} y${st.S.year} event`;
          compareHeader(where, View.header(build, st.S));
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
          const want = View.outcomeCard(st.outcome, st.log, st.head, View.header(build, st.S));
          expect(where + ' text', $('.outcome').textContent, want.text);
          // page by page, as the player taps Continue: each page under its own header
          const pages = $$('.page');
          expect(where + ' page count', pages.length, want.pages.length);
          want.pages.forEach((wp, k) => {
            const pg = pages[k];
            if (!pg) return;
            expect(`${where} page ${k} on show`, pages.filter(x => !x.hidden).map(x => x.dataset.p).join(), String(k));
            compareHeader(`${where} page ${k}`, wp.header);
            const items = [...pg.querySelectorAll('.li')];
            expect(`${where} page ${k} log length`, items.length, wp.log.length);
            items.forEach((li, i) => {
              const spans = li.querySelectorAll('span');
              expect(`${where} page ${k} log ${i} tag`, spans[0].textContent, wp.log[i] && wp.log[i].tag);
              expect(`${where} page ${k} log ${i} text`, spans[1].textContent, wp.log[i] && wp.log[i].text);
            });
            // the pay line, from the second year on, says how it compares with last year
            const yr = pg.querySelector('.li.yr span:last-child'), year = yr && +(yr.textContent.match(/^Year (\d+) · /) || [])[1];
            for (const li of items.filter(li => li.querySelector('.t-pay') && /^Annual package: /.test(li.querySelectorAll('span')[1].textContent))) {
              const t = li.querySelectorAll('span')[1].textContent;
              if (!year) mismatches.push(`${where} page ${k}: a pay line on a page with no year heading: ${t}`);
              else if (year >= 2) { payLines++; if (!/, (?:up|down) \$[\d,]+ on last year|, the same as last year/.test(t)) mismatches.push(`${where} page ${k} (year ${year}): the pay line does not compare with last year: ${t}`); }
            }
            if (k < pages.length - 1) pg.querySelector('.more').click();
          });
          witnessLines += (st.log || []).filter(l => l.about === 'witness').length;
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
      expect('ending values', vals.join(' | '), [want.position, want.age, want.lifetimeEarnings].join(' | '));
      expect('ending labels', $$('.final .k').map(k => k.textContent).join(' | '), [want.positionLabel, want.ageLabel, 'Lifetime earnings'].join(' | '));
      // the four stats, revealed only now, each with its verdict
      expect('stats heading', $('.reveal .lab').textContent, View.STATS_LABEL);
      const rvs = $$('.rv');
      expect('stats count', rvs.length, want.stats.length);
      rvs.forEach((el, i) => {
        expect(`stat ${i} label`, el.querySelector('.rk .k').textContent, want.stats[i].label);
        expect(`stat ${i} value`, el.querySelector('.rk .v').textContent, want.stats[i].value);
        expect(`stat ${i} verdict`, el.querySelector('.t').textContent, want.stats[i].verdict);
      });
      // the ending never mentions a witness: no line from a witness's pool, here or under Declassified
      const pool = Object.values((build.content.witnesses || {}).types || {}).flatMap(t => [...((t.review || {}).help || []), ...((t.review || {}).hurt || [])]);
      for (const d of want.declassified) if (pool.some(l => d.text.includes(l)) || /notic/i.test(d.label)) mismatches.push(`${origin}: Declassified mentions a witness: ${d.label}: ${d.text}`);
      const dls = $$('.dl');
      expect('declassified count', dls.length, want.declassified.length);
      dls.forEach((el, i) => {
        expect(`declassified ${i} label`, el.querySelector('.k').textContent, want.declassified[i].label);
        expect(`declassified ${i} text`, el.querySelector('.t').textContent, want.declassified[i].text);
      });
      screens++;
      console.log(`✓ ${origin}${rival ? " + batchmate" : ""}, ${gender === 'f' ? 'Female' : 'Male'}, ${typed ? 'typed name' : 'blank name'} (${S.name}): ${S.year - 1} years, ending "${want.title}", every screen matches`);
    }

    if (payLines < 50) mismatches.push(`only ${payLines} pay lines from the second year on were checked against last year`);
    else console.log(`✓ ${payLines} pay lines from the second year on each say how they compare with last year`);
    console.log(`✓ ${witnessLines} review lines from hidden witnesses among the screens compared, and none in an ending`);
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
