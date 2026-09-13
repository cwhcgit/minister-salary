const { JSDOM } = require('jsdom');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = require('path').join(__dirname, '..', 'web');
const MIME = { '.html':'text/html', '.js':'text/javascript', '.json':'application/json',
               '.svg':'image/svg+xml', '.webmanifest':'application/manifest+json' };

const server = http.createServer((req,res) => {
  let p = decodeURI(req.url.split('?')[0]); if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end('nope'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'text/plain' });
  res.end(fs.readFileSync(f));
});

server.listen(0, async () => {
  const url = 'http://127.0.0.1:' + server.address().port + '/';
  const errors = [];
  const dom = await JSDOM.fromURL(url, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    beforeParse(w) {
      w.scrollTo = () => {}; w.alert = () => {};
      w.fetch = u => new Promise((res, rej) => http.get(new URL(u, url).href, r => {
        let d=''; r.on('data',c=>d+=c); r.on('end',()=>res({ ok:true, json:()=>Promise.resolve(JSON.parse(d)) }));
      }).on('error', rej));
      w.addEventListener('error', e => errors.push(e.message || String(e.error)));
    }
  });
  const { window } = dom;
  const $ = s => window.document.querySelector(s);
  const $$ = s => [...window.document.querySelectorAll(s)];
  const txt = () => window.document.getElementById('app').textContent;
  const wait = ms => new Promise(r => setTimeout(r, ms));

  try {
    await wait(500);
    if (!$('#go')) throw new Error('start screen never rendered: ' + txt().slice(0,150));
    console.log('✓ page loads over HTTP, both scripts execute,', $$('.origin').length, 'origins');

    // every origin must start a valid run
    for (const o of ['scholar','grad','poly']) {
      $$('.origin').find(x => x.dataset.o === o).click();
      if ($$('.origin').find(x => x.dataset.o === o).getAttribute('aria-checked') !== 'true')
        throw new Error(o + ': selection did not register');
    }
    console.log('✓ origin selection works for all three');

    $('#nm').value = 'Tan Wei Ming';
    $('#go').click();
    await wait(60);
    if (!$('.choice')) throw new Error('first event card did not render: ' + txt().slice(0,200));
    if (!$('.stat')) throw new Error('stat bars did not render');
    console.log('✓ run starts, first event:', JSON.stringify($('h2').textContent));

    // play 3 full careers
    for (let run = 0; run < 3; run++) {
      if (run) { $('#again').click(); await wait(30); $('#go').click(); await wait(30); }
      let turns = 0, promos = 0, titles = new Set(), sawAppraisal = false;
      while (!$('.ending') && turns < 130) {
        if ($('.choice')) {
          titles.add($('h2').textContent);
          const live = $$('.choice').filter(b => !b.disabled);
          if (!live.length) throw new Error('event with no selectable choices: ' + $('h2').textContent);
          live[Math.floor(Math.random()*live.length)].click(); turns++;
          if (!$('.ending')) {
            if (!$('#next')) throw new Error('outcome screen missing Confirm button');
            promos += $$('.t-promo').length;
            if ($('.t-appraisal')) sawAppraisal = true;
            $('#next').click();
          }
        } else if ($('#next')) $('#next').click();
        else throw new Error('stuck: no choices, no continue');
      }
      if (!$('.ending')) throw new Error('career never terminated after ' + turns + ' turns');
      if (!sawAppraisal) throw new Error('no appraisal ever shown');
      if (!$('#again') || !$('#share')) throw new Error('ending screen missing buttons');
      console.log(`✓ career ${run+1}: ${turns}y, ${promos} promotions, ${titles.size} distinct events → "${$('.ending h1').textContent}"`);
    }

    // persistence
    $('#again').click(); await wait(30);
    if (!$('#go')) throw new Error('Start Again did not reset');
    $('#go').click(); await wait(30); $('.choice').click(); await wait(30);
    const saved = JSON.parse(window.localStorage.getItem('ministerSalary.v1'));
    if (!saved || !saved.S) throw new Error('run did not persist');
    console.log('✓ saves to localStorage (year ' + saved.S.year + ', age ' + saved.S.age + ')');

    const dom2 = await JSDOM.fromURL(url, { runScripts:'dangerously', resources:'usable',
      beforeParse(w) { w.scrollTo=()=>{}; w.alert=()=>{};
        w.fetch = window.fetch;
        Object.defineProperty(w,'localStorage',{ value: window.localStorage }); } });
    await wait(500);
    if (dom2.window.document.getElementById('app').textContent.includes('Begin'))
      throw new Error('reload lost the saved run');
    console.log('✓ reload resumes mid-run (offline-safe)');
    dom2.window.close();

    const real = errors.filter(e => e && !/serviceWorker|Not implemented/i.test(e));
    if (real.length) { console.log('\n✗ runtime errors:'); real.forEach(e=>console.log('  '+e)); process.exit(1); }
    console.log('\nAll UI tests passed.');
  } catch (e) {
    console.log('\n✗ FAILED: ' + e.message);
    errors.forEach(x => console.log('  err: ' + x));
    process.exitCode = 1;
  } finally { window.close(); server.close(); }
});
