/* CATDA FC site QA harness. Run: node tools/qa.js
   Renders every page in jsdom exactly as a browser would (app.js + renderers.js
   eval'd, fetch stubbed to assets/data.json), then audits chrome, content rules,
   asset references, CSP hashes and the stylesheet. Exits 1 on any failure. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { JSDOM } = require('jsdom');
const SITE = path.resolve(__dirname, '..');
const PAGES = ['index', 'club', 'squad', 'matches', 'cup', 'honours', 'news',
  'fans', 'community', 'contact', 'privacy', 'terms', 'compliance']
  .map(p => p + '.html').concat(['404.html']);
const DATA = JSON.parse(fs.readFileSync(SITE + '/assets/data.json', 'utf8'));
const appjs = fs.readFileSync(SITE + '/assets/app.js', 'utf8');
const renjs = fs.readFileSync(SITE + '/assets/renderers.js', 'utf8');
const css = fs.readFileSync(SITE + '/assets/styles.css', 'utf8');
const headers = fs.readFileSync(SITE + '/_headers', 'utf8');
const fails = [];
const ok = (c, msg, where) => { if (!c) fails.push(where + ': ' + msg); };

(async () => {
  for (const f of PAGES) {
    const html = fs.readFileSync(SITE + '/' + f, 'utf8');
    const dom = new JSDOM(html, { url: 'https://catdafc.com/' + f, runScripts: 'outside-only' });
    const w = dom.window;
    w.fetch = () => Promise.resolve({ json: () => Promise.resolve(DATA) });
    let checks = 0;
    const tick = () => { checks++; };
    try { w.eval(appjs); w.eval(renjs); await w.eval('boot()'); }
    catch (e) { fails.push(f + ': boot error ' + e.message); continue; }
    const doc = w.document, body = doc.body.textContent;
    tick(ok(doc.querySelector('header .brand img[src="assets/img/logo.png"]'), 'header logo', f));
    tick(ok(doc.querySelector('footer .logo-plate img[src="assets/img/logo.png"]'), 'footer logo plate', f));
    tick(ok(!/AI-generated|made with AI/i.test(body), 'no AI tag text', f));
    tick(ok(!/—|–/.test(body), 'no em/en dash', f));
    tick(ok(doc.querySelectorAll('figcaption').length === (f === 'compliance.html' ? 1 : 0), 'figcaption count', f));
    tick(ok(doc.title.length > 10, 'title', f));
    tick(ok(doc.querySelector('meta[name="description"]'), 'meta description', f));
    tick(ok(doc.querySelector('link[rel="canonical"]'), 'canonical', f));
    tick(ok(doc.querySelector('script[type="application/ld+json"]'), 'JSON-LD', f));
    tick(ok(doc.querySelector('noscript'), 'noscript fallback', f));
    tick(ok(doc.querySelector('.ribbon'), 'league ribbon', f));
    tick(ok(doc.querySelectorAll('#page *').length > (f === '404.html' ? 4 : 20), 'page body rendered', f));
    for (const el of doc.querySelectorAll('img[src], link[href], script[src], a[href]')) {
      const u = el.getAttribute('src') || el.getAttribute('href') || '';
      if (/^(https?:|mailto:|#|data:|tel:)/.test(u)) continue;
      tick(ok(fs.existsSync(SITE + '/' + u.split('#')[0].split('?')[0]), 'local ref exists: ' + u, f));
    }
    if (f === 'club.html') tick(ok(doc.querySelector('aside img[src="assets/img/logo.png"]'), 'badge panel', f));
    if (f === 'terms.html') tick(ok(/illustrative composite/i.test(body), 'imagery clause', f));
    
    if (f === 'index.html') tick(ok(/Rwenzori|confirmed by the club/.test(body), 'next fixture panel', f));
    console.log('ok  ', f.padEnd(16), String(body.length).padStart(5) + ' chars', checks + ' checks');
  }
  for (const page of ['index.html', '404.html']) {
    const html = fs.readFileSync(SITE + '/' + page, 'utf8');
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const h = 'sha256-' + crypto.createHash('sha256').update(m[1], 'utf8').digest('base64');
      ok(headers.includes(h), 'CSP hash listed in _headers', page);
    }
  }
  ok(/\.stat\s*{[^}]*background:\s*transparent/.test(css), 'metric frames stay see-through over the hero photo', 'styles.css');
  ok(/\.stat\s*{[^}]*border:\s*1px solid/.test(css), 'metric card chrome present', 'styles.css');
  ok(/\.stat b\s*{[^}]*color:\s*var\(--white\)/.test(css), 'metric figures in white ink', 'styles.css');
  ok(/\.card\s*{[^}]*background:\s*var\(--paper\)/.test(css), 'content cards light-filled', 'styles.css');
  ok(/\.grid\s*{[^}]*align-items:\s*start/.test(css), 'cards hug their content', 'styles.css');
  ok(/\.stat:hover\s*{/.test(css), 'stat hover effect', 'styles.css');
  ok(/\.stat:active\s*{/.test(css), 'stat press effect', 'styles.css');
  ok(/stat--ping/.test(css) && /stat--ping/.test(appjs), 'stat click feedback wired', 'styles.css + app.js');
  ok(!/Home: Bugolobi/.test(JSON.stringify(DATA)) && !/Home: Bugolobi/.test(renjs), 'no stale home-ground chip', 'renderers.js');
  ok(!/linear-gradient|radial-gradient/.test(css), 'no gradients', 'styles.css');
  ok(!/border-radius:\s*(50%|999)/.test(css), 'no pill or circular radii', 'styles.css');
  ok(!/@keyframes\s+(rise|fade|slide|enter)/.test(css), 'no entrance animation', 'styles.css');
  ok(JSON.stringify(DATA).includes('"leagueSize":14'), 'leagueSize is 14', 'data.json');
  ok(DATA.nextFixture.kickoffDate === '2026-09-27', 'kickoff 2026-09-27', 'data.json');
  for (const r of DATA.results.filter(r => r.status !== 'unrecorded'))
    ok(typeof r.hs === 'number' && typeof r.as === 'number', 'recorded result has scores', 'data.json');
  if (fails.length) { console.log('\nFAILURES:'); fails.forEach(x => console.log('  -', x)); process.exit(1); }
  console.log('\nCSP hashes verified against _headers; stylesheet audit clean.');
  console.log('All pages and checks clean.');
})();
