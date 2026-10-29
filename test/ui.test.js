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

// jsdom cannot draw on a canvas, so the share test records what the card would draw instead.
function recorder(drawn) {
  let font = '10px sans-serif';
  const ctx = {
    get font() { return font; }, set font(f) { font = f; },
    measureText: t => ({ width: String(t).length * (+(font.match(/(\d+)px/) || [0, 10])[1]) * 0.5 }),
    fillText: t => drawn.push(String(t))
  };
  return new Proxy(ctx, { get: (o, k) => (k in o ? o[k] : () => {}), set: (o, k, v) => { o[k] = v; return true; } });
}
const norm = t => t.replace(/\s+/g, ' ').trim();

async function shareTests(window, $, $$, wait) {
  const nav = window.navigator, C = window.HTMLCanvasElement.prototype;
  const set = (o, k, v) => Object.defineProperty(o, k, { value: v, configurable: true, writable: true });
  const ending = { title: $('.ending h1').textContent, epitaph: $('.ending .ep').textContent,
    stats: $$('.rv').map(el => [el.querySelector('.rk .k').textContent, el.querySelector('.rk .v').textContent, el.querySelector('.t').textContent]),
    declassified: $$('.dl').map(el => [el.querySelector('.k').textContent, el.querySelector('.t').textContent]) };
  let drawn = [], shared = null, copied = null, shareError = null;
  set(C, 'getContext', function () { return recorder(drawn); });
  set(C, 'toBlob', function (cb, type) { cb(new window.Blob(['png:' + this.width + 'x' + this.height], { type })); });
  set(nav, 'canShare', d => !!(d.files && d.files.length));
  set(nav, 'share', async d => { shared = d; if (shareError) throw shareError; });
  set(nav, 'clipboard', { writeText: async t => { copied = t; } });
  set(window.URL, 'createObjectURL', () => 'blob:card');
  set(window.URL, 'revokeObjectURL', () => {});
  const quiet = window.console.error; window.console.error = () => {};   // the failures below are logged on purpose
  const btn = $('#share'), panel = () => $('.sharepanel'), toastText = () => ($('.toast') || {}).textContent || '';

  // 1. a tap opens the panel at once; the picture follows as a preview, saved by a real download link
  btn.click();
  if (!panel()) throw new Error('tapping Share did not open the share panel at once');
  if (btn.disabled) throw new Error('the Share button was disabled');
  await wait(60);
  const img = $('.sharepanel .sprev img');
  if (!img || img.getAttribute('src') !== 'blob:card') throw new Error('the panel shows no picture');
  const save = $('#ssave');
  if (!save || save.tagName !== 'A' || save.getAttribute('download') !== 'minister-salary.png' || !/^blob:/.test(save.getAttribute('href') || '') || save.getAttribute('aria-disabled'))
    throw new Error('Save picture is not a download link to the picture: ' + (save && save.outerHTML));
  const card = norm(drawn.join(' '));
  if (/\{[^{}\s]+\}/.test(card)) throw new Error('the share card has a raw token: ' + card.match(/\{[^{}\s]+\}/)[0]);
  const want = ['MINISTER SALARY', 'TAN WEI MING', ending.title, ending.epitaph, 'LIFETIME EARNINGS', $('.final .v[style*=cash]').textContent,
    ...ending.stats.flatMap(([k, v, t]) => [k.toUpperCase(), v, t]), $('.final .k').textContent.toUpperCase(), $('.final .v').textContent, 'ORIGIN'];
  for (const w of want.filter(Boolean)) if (!card.includes(norm(w))) throw new Error('the share card is missing: ' + w);
  const origins = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'game.json'), 'utf8')).origins;
  if (!origins.some(o => card.includes(norm(`${o.name} · ${o.difficulty}`)))) throw new Error('the share card has no origin and difficulty');
  // a local or preview address is never shared: the card always carries the public game's link
  if (!card.includes('cwhcgit.github.io/minister-salary')) throw new Error('the share card has no link to the public game in its footer');
  if (/DECLASSIFIED/i.test(card)) throw new Error('the share card carries the Declassified heading');
  for (const [k, t] of ending.declassified) if (card.includes(norm(t)) || card.includes(k.toUpperCase())) throw new Error('the share card carries a Declassified line: ' + k);
  console.log(`✓ share: a tap opens the panel with the picture (${drawn.length} lines drawn, no Declassified line) and a download link to save it`);

  // 2. Copy text and link: the words and the public link, and a toast says so
  $('#scopy').click(); await wait(10);
  if (!copied || !copied.includes('https://cwhcgit.github.io/minister-salary/') || !copied.includes(ending.title)) throw new Error('Copy did not copy the words and the public link: ' + copied);
  if (!/copied/i.test(toastText())) throw new Error('no toast says the words were copied: ' + toastText());
  // 3. Share... hands the picture to the system's sheet, from the tap itself
  const sys = $('#ssys');
  if (!sys || sys.hidden) throw new Error('no Share... button although the browser can share the picture');
  sys.click();
  if (!shared || !shared.files || !shared.files.length) throw new Error('Share... did not offer the picture');
  const f = shared.files[0];
  if (!(f instanceof window.File) || f.type !== 'image/png' || !f.size) throw new Error('the shared file is not a PNG');
  if (!shared.url || !shared.text.includes(ending.title) || !shared.title.includes('Minister Salary')) throw new Error('the share text or link is missing: ' + JSON.stringify(shared));
  // a share sheet the player closes says nothing; one that fails says so
  $('.toast') && $('.toast').remove();
  shareError = Object.assign(new Error('closed'), { name: 'AbortError' }); sys.click(); await wait(10);
  if ($('.toast')) throw new Error('closing the share sheet showed a toast: ' + toastText());
  shareError = Object.assign(new Error('nope'), { name: 'NotAllowedError' }); sys.click(); await wait(10);
  if (!/didn't work/.test(toastText())) throw new Error('a failed share said nothing: ' + toastText());
  shareError = null;
  $('#sclose').click();
  if (panel()) throw new Error('the close button did not close the panel');
  console.log('✓ share: Copy puts the words and the public link on the clipboard; Share... opens the system sheet from the tap; a failure says so; the panel closes');

  // 4. a browser that cannot share files: no Share... button, the rest as before
  set(nav, 'canShare', () => false); shared = null; drawn = [];
  btn.click(); await wait(60);
  if (!$('#ssys').hidden) throw new Error('Share... is offered although the browser cannot share files');
  if (!/^blob:/.test($('#ssave').getAttribute('href') || '')) throw new Error('no picture to save');
  // tapping Share again starts afresh: one panel, never two
  btn.click(); await wait(60);
  if ($$('.sharepanel').length !== 1) throw new Error('two share panels');
  $('#sclose').click();
  console.log('✓ share without file sharing: Save and Copy only; a second tap opens one fresh panel');

  // 5. no picture at all: the words and link are copied instead, and the Share button still works
  set(C, 'getContext', () => null); copied = null;
  btn.click(); await wait(60);
  if (!/Couldn't make the picture; copied the text and link instead/.test(toastText())) throw new Error('no toast says the picture failed: ' + toastText());
  if (!copied || !copied.includes('https://cwhcgit.github.io/minister-salary/')) throw new Error('the words and link were not copied when the picture failed');
  if (!$('#ssave').hidden || !panel()) throw new Error('the panel offers a picture it does not have');
  if (btn.disabled) throw new Error('the Share button was left disabled');
  $('#sclose').click();
  window.console.error = quiet;
  console.log('✓ share without a picture: the words and link are copied, a toast says so, and Share still works');
}

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

    // the gender choice: Female until picked, then remembered like the name
    const genders = () => $$('.gender .g').map(g => g.textContent + '=' + g.getAttribute('aria-checked')).join(' ');
    if (genders() !== 'Female=true Male=false') throw new Error('the start screen does not offer Female (chosen) and Male: ' + genders());
    $$('.gender .g').find(g => g.dataset.g === 'm').click();
    if (genders() !== 'Female=false Male=true' || window.localStorage.getItem('ms.gender') !== 'm') throw new Error('choosing Male did not register or was not remembered');
    console.log('✓ the start screen asks for a name and Female or Male, and remembers the choice');

    $('#nm').value = 'Tan Wei Ming';
    $('#go').click();
    await wait(60);
    { const st = JSON.parse(window.localStorage.getItem('ministerSalary.v1')).S;
      if (st.name !== 'Tan Wei Ming' || st.gender !== 'm') throw new Error('the run did not keep the name and gender: ' + st.name + ' ' + st.gender); }
    if (!$('.choice')) throw new Error('first event card did not render: ' + txt().slice(0,200));
    if ($('header .stat, header .track')) throw new Error('the header shows stats during play');
    if (/\b(Rep|Stand|Integ|Comp)\b/.test($('header').textContent)) throw new Error('the header names a stat: ' + $('header').textContent);
    console.log('✓ run starts, first event:', JSON.stringify($('h2').textContent), '(no stats in the header)');

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

    // the ending reveals all four stats, each with a verdict
    if ($$('.reveal .rv').length !== 4) throw new Error('the ending does not reveal the four stats');
    console.log('✓ the ending reveals', $$('.rv .rk .k').map(k => k.textContent).join(', '));

    // sharing: a picture of the result (never the Declassified file), with the link as text
    await shareTests(window, $, $$, wait);

    // persistence
    $('#again').click(); await wait(30);
    if (!$('#go')) throw new Error('Start Again did not reset');
    if ($('#nm').value !== 'Tan Wei Ming' || !$$('.gender .g')[1] || $$('.gender .g')[1].getAttribute('aria-checked') !== 'true') throw new Error('the next start screen forgot the name or the gender');
    // a blank name: one is drawn for the run, for the gender chosen, and the field stays blank next time
    $$('.gender .g').find(g => g.dataset.g === 'f').click();
    $('#nm').value = '';
    $('#go').click(); await wait(30);
    { const st = JSON.parse(window.localStorage.getItem('ministerSalary.v1')).S;
      const pool = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'game.json'), 'utf8')).cast.names;
      if (!pool.some(n => n.full === st.name && n.pron === 'f')) throw new Error('a blank name did not draw a Female name from the pool: ' + st.name);
      if (window.localStorage.getItem('ms.name') !== '') throw new Error('a blank name was remembered as ' + window.localStorage.getItem('ms.name'));
      console.log('✓ a blank name draws one for the run: ' + st.name); }
    $('.choice').click(); await wait(30);
    while (!$('.ending')) { if ($('.choice')) $$('.choice').filter(b => !b.disabled)[0].click(); else $('#next').click(); await wait(2); }
    if (!$('.ending .lab').textContent.startsWith(JSON.parse(window.localStorage.getItem('ministerSalary.v1')).S.name + ' ·')) throw new Error('the ending card does not carry the drawn name');
    $('#again').click(); await wait(30);
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

    // a save from before the start screen asked: name "You", no gender. It loads with the
    // defaults (Female, a drawn name) and plays on, with no raw token and no "Ms You".
    const old = JSON.parse(window.localStorage.getItem('ministerSalary.v1'));
    old.S.name = 'You'; delete old.S.gender;
    window.localStorage.setItem('ministerSalary.v1', JSON.stringify(old));
    window.localStorage.setItem('ms.name', 'You'); window.localStorage.removeItem('ms.gender');
    const dom3 = await JSDOM.fromURL(url, { runScripts:'dangerously', resources:'usable',
      beforeParse(w) { w.scrollTo=()=>{}; w.alert=()=>{};
        w.fetch = window.fetch;
        Object.defineProperty(w,'localStorage',{ value: window.localStorage }); } });
    await wait(500);
    const d3 = dom3.window.document, t3 = () => d3.getElementById('app').textContent;
    if (t3().includes('Begin')) throw new Error('an old save did not load');
    for (let k = 0; k < 400 && !d3.querySelector('.ending'); k++) {
      if (/\{[^{}\s]+\}|\b(Ms|Mr) You\b/.test(t3())) throw new Error('an old save shows: ' + t3().slice(0, 200));
      const live = [...d3.querySelectorAll('.choice')].filter(b => !b.disabled);
      if (live.length) live[0].click(); else d3.querySelector('#next').click();
      await wait(2);
    }
    const up = JSON.parse(window.localStorage.getItem('ministerSalary.v1')).S;
    if (up.gender !== 'f' || up.name === 'You') throw new Error('an old save was not given the defaults: ' + up.name + ' ' + up.gender);
    if (!d3.querySelector('.ending') || !d3.querySelector('.ending .lab').textContent.startsWith(up.name + ' ·')) throw new Error('the old save did not play to an ending under its new name');
    d3.querySelector('#again').click(); await wait(30);
    if (d3.querySelector('#nm').value !== '') throw new Error('the old "You" placeholder came back as a name');
    console.log('✓ a save from before the gender choice loads as Female, named ' + up.name + ', and plays to the end');
    dom3.window.close();

    // a save from an older version of the game: the player is told, and can start fresh or carry on;
    // and the header's Reincarnate control abandons a run only on a second tap
    const boot = async () => { const dm = await JSDOM.fromURL(url, { runScripts:'dangerously', resources:'usable',
      beforeParse(w) { w.scrollTo=()=>{}; w.alert=()=>{}; w.fetch = window.fetch;
        Object.defineProperty(w,'localStorage',{ value: window.localStorage }); } }); await wait(500); return dm; };
    const dom4 = await boot(), d4 = dom4.window.document, t4 = () => d4.getElementById('app').textContent;
    d4.querySelector('#go').click(); await wait(20);
    for (let k = 0; k < 3; k++) { const live = [...d4.querySelectorAll('.choice')].filter(b => !b.disabled); if (live.length) live[0].click(); else d4.querySelector('#next').click(); await wait(5); }
    dom4.window.close();
    const sv = JSON.parse(window.localStorage.getItem('ministerSalary.v1'));
    if (!sv.v) throw new Error('the save does not record the game version');
    sv.v = 'older'; window.localStorage.setItem('ministerSalary.v1', JSON.stringify(sv));
    const dom5 = await boot(), d5 = dom5.window.document, t5 = () => d5.getElementById('app').textContent;
    if (!t5().includes('The game has been updated')) throw new Error('an older save was not flagged');
    if (d5.querySelector('#fresh').textContent !== 'Reincarnate') throw new Error('the old-version screen\'s fresh start is not labelled Reincarnate: ' + d5.querySelector('#fresh').textContent);
    d5.querySelector('#carry').click(); await wait(10);
    if (t5().includes('The game has been updated') || t5().includes('Begin')) throw new Error('carrying on did not resume the run');
    const nc = d5.querySelector('#newcareer');
    if (!nc) throw new Error('no Reincarnate control in the header');
    if (nc.textContent !== 'Reincarnate') throw new Error('the header control is not labelled Reincarnate: ' + nc.textContent);
    nc.click(); await wait(5);
    if (t5().includes('Begin')) throw new Error('one tap abandoned the career');
    if (d5.querySelector('#newcareer').textContent !== 'Tap again to abandon this career') throw new Error('the first tap did not ask for a second: ' + d5.querySelector('#newcareer').textContent);
    // left alone, the button goes back to Reincarnate, and a later tap asks again
    await wait(3100);
    if (d5.querySelector('#newcareer').textContent !== 'Reincarnate' || d5.querySelector('#newcareer').classList.contains('armed')) throw new Error('the button did not go back to Reincarnate: ' + d5.querySelector('#newcareer').textContent);
    if (t5().includes('Begin')) throw new Error('waiting abandoned the career');
    d5.querySelector('#newcareer').click(); await wait(5);
    if (d5.querySelector('#newcareer').textContent !== 'Tap again to abandon this career') throw new Error('a tap after the reset did not ask for a second');
    d5.querySelector('#newcareer').click(); await wait(10);
    if (!t5().includes('Begin')) throw new Error('two taps did not reincarnate (start a new career)');
    if (window.localStorage.getItem('ministerSalary.v1')) throw new Error('the abandoned career is still saved');
    console.log('✓ an older save is flagged (Reincarnate, or carry on); Reincarnate takes two taps, and resets after three seconds');
    dom5.window.close();

    const real = errors.filter(e => e && !/serviceWorker|Not implemented/i.test(e));
    if (real.length) { console.log('\n✗ runtime errors:'); real.forEach(e=>console.log('  '+e)); process.exit(1); }
    console.log('\nAll UI tests passed.');
  } catch (e) {
    console.log('\n✗ FAILED: ' + e.message);
    errors.forEach(x => console.log('  err: ' + x));
    process.exitCode = 1;
  } finally { window.close(); server.close(); }
});
