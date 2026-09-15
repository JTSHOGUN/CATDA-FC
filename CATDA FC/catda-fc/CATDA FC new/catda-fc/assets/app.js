/* =====================================================================
   CATDA FC  ·  shared shell
   Utility bar, nav, league ribbon, match strip, footer, helpers, boot.
   No scroll animations. No decorative gradients. Content from data.json.
   ===================================================================== */

const PAGES = [
  { href: 'index.html',     label: 'Home' },
  { href: 'club.html',      label: 'Club' },
  { href: 'matches.html',   label: 'Matches' },
  { href: 'squad.html',     label: 'Squad' },
  { href: 'cup.html',       label: 'Uganda Cup' },
  { href: 'community.html', label: 'Community' },
  { href: 'fans.html',      label: 'Lufula' },
  { href: 'news.html',      label: 'News' },
  { href: 'contact.html',   label: 'Contact' }
];

const LEGAL_PAGES = [
  { href: 'compliance.html', label: 'Licensing and governance' },
  { href: 'privacy.html',    label: 'Privacy policy' },
  { href: 'terms.html',      label: 'Terms and conditions' }
];

const DATA_URL = 'assets/data.json';
let D = null;

/* ---------- helpers ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s = '') => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const n = v => (v === null || v === undefined || v === '') ? null : Number(v);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmtDate(iso, long = false) {
  if (!iso || !/^\d{4}-\d{2}(-\d{2})?$/.test(iso)) return iso || '';
  const p = iso.split('-').map(Number);
  const d = new Date(Date.UTC(p[0], (p[1] || 1) - 1, p[2] || 1));
  if (long) return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MONTHS[d.getUTCMonth()]} ${String(d.getUTCFullYear()).slice(2)}`;
}
const ord = i => (['th','st','nd','rd'][(i % 100 - 20) % 10] || ['th','st','nd','rd'][i % 100] || 'th');
const initials = name => name.replace(/[^A-Za-z ]/g, '').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const currentPage = () => location.pathname.split('/').pop() || 'index.html';

/* ---------- shell ---------- */

function mountChrome() {
  const here = currentPage();
  const c = D.club;

  const header = document.createElement('header');
  header.innerHTML = `
    <div class="utilbar">
      <div class="wrap utilbar__in">
        <span class="utilbar__badge"><i aria-hidden="true"></i>FUFA licensed, Big League 2025/26</span>
        <nav aria-label="Utility">
          ${LEGAL_PAGES.map(p => `<a href="${p.href}">${p.label}</a>`).join('')}
          <a href="${esc(c.social.x)}" target="_blank" rel="noopener">X</a>
          <a href="${esc(c.social.facebook)}" target="_blank" rel="noopener">Facebook</a>
        </nav>
      </div>
    </div>
    <div class="topbar">
      <div class="wrap topbar__in">
        <a class="brand" href="index.html" aria-label="CATDA FC, home">
          <img src="assets/img/logo.png" alt="CATDA Football Club badge" width="46" height="46">
          <span class="brand__txt"><b>CATDA FC</b><span>The Lufula Boys, Kampala</span></span>
        </a>
        <nav class="nav" aria-label="Main">
          ${PAGES.map(p => `<a href="${p.href}"${p.href === here ? ' aria-current="page"' : ''}>${p.label}</a>`).join('')}
        </nav>
        <a class="btn btn--red nav-cta" href="contact.html#partners">Partner with us</a>
        <button class="nav-toggle" aria-expanded="false" aria-controls="drawer" aria-label="Open menu"><span></span></button>
      </div>
      <div class="drawer" id="drawer">
        ${PAGES.map(p => `<a href="${p.href}"${p.href === here ? ' aria-current="page"' : ''}>${p.label}</a>`).join('')}
        ${LEGAL_PAGES.map(p => `<a href="${p.href}">${p.label}</a>`).join('')}
      </div>
    </div>`;
  document.body.prepend(header);

  const tg = $('.nav-toggle');
  tg.addEventListener('click', () => {
    const open = $('#drawer').classList.toggle('open');
    tg.setAttribute('aria-expanded', String(open));
  });

  /* league ribbon */
  const partners = D.partners.federationPartners.map(p => esc(p.name)).join(', ');
  const ribbon = document.createElement('div');
  ribbon.className = 'ribbon';
  ribbon.setAttribute('role', 'note');
  ribbon.setAttribute('aria-label', 'League, partners and governing bodies');
  ribbon.innerHTML = `
    <div class="wrap ribbon__in">
      <div class="ribbon__row">
        <b>${esc(c.league)}</b>
        <span class="ribbon__sep">/</span> Tier ${c.leagueTier} of Ugandan football
        <span class="ribbon__sep">/</span> ${c.leagueSize} clubs, nationwide
        <span class="ribbon__sep">/</span> Season ${esc(c.seasonLabel)} kicks off ${fmtDate(c.seasonStarts)}
        <span class="ribbon__sep">/</span> Naming and broadcast: <b>${esc(D.partners.leagueNaming.name)}</b>
        <span class="ribbon__sep">/</span> Governed by
        ${D.governance.map(g => `<a href="${esc(g.url)}" target="_blank" rel="noopener">${esc(g.body)}</a>`).join(' <span class="ribbon__sep">&gt;</span> ')}
        <span class="ribbon__sep">/</span> <a href="compliance.html">Club licensing</a>
      </div>
      <div class="ribbon__row ribbon__partners">
        <b>Federation and competition partners:</b> ${partners}. ${esc(D.partners.cupNaming.name)} titles the Uganda Cup.
      </div>
    </div>`;
  header.after(ribbon);

  /* match strip */
  const played = D.results.filter(r => r.status !== 'unrecorded');
  const last = played[played.length - 1];
  const st = D.standings.rows.find(r => r.us);
  const strip = document.createElement('div');
  strip.className = 'strip';
  strip.innerHTML = `
    <div class="wrap strip__in">
      <a class="strip__cell" href="matches.html#next">
        <span class="strip__label">Next</span>
        <span>
          <span class="strip__main">${esc(D.nextFixture.opponent)}</span><br>
          <span class="strip__sub">${esc(D.nextFixture.competition)}, ${fmtDate(D.nextFixture.kickoffDate)}</span>
        </span>
      </a>
      <a class="strip__cell" href="matches.html#results">
        <span class="strip__label">Last result</span>
        ${last ? `<span class="strip__score strip__score--${last.status === 'win' ? 'w' : 'l'}">${last.hs}-${last.as}</span>
        <span>
          <span class="strip__main">${esc(last.home)} v ${esc(last.away)}</span><br>
          <span class="strip__sub">${fmtDate(last.date)}, ${esc(last.md)}</span>
        </span>` : ''}
      </a>
      <a class="strip__cell" href="matches.html#table">
        <span class="strip__label">2025/26</span>
        <span>
          <span class="strip__main">${st.pos}${ord(st.pos)} of ${D.standings.rows.length}</span><br>
          <span class="strip__sub">${st.pts} points, ${st.w}-${st.d}-${st.l}</span>
        </span>
      </a>
    </div>`;
  ribbon.after(strip);

  /* footer */
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="wrap">
      <div class="footer__top">
        <div class="footer__brand">
          <span class="logo-plate"><img src="assets/img/logo.png" alt="CATDA Football Club badge" width="76" height="76"></span>
          <h3>CATDA FC</h3>
          <p class="small" style="color:var(--muted-lt)">${esc(c.officialExpansion)}.<br>
          ${esc(c.homeArea)}.<br>Kick With Skills.</p>
        </div>
        <div>
          <h4>Club</h4>
          <ul>
            <li><a href="club.html">Our story and ownership</a></li>
            <li><a href="honours.html">Honours and records</a></li>
            <li><a href="squad.html">First team and alumni</a></li>
            <li><a href="community.html">Community and development</a></li>
            <li><a href="compliance.html">Licensing and governance</a></li>
          </ul>
        </div>
        <div>
          <h4>Football</h4>
          <ul>
            <li><a href="matches.html">Fixtures and results</a></li>
            <li><a href="matches.html#table">League table</a></li>
            <li><a href="cup.html">Stanbic Uganda Cup</a></li>
            <li><a href="news.html">News and media</a></li>
            <li><a href="fans.html">Matchday and the Lufula</a></li>
          </ul>
        </div>
        <div>
          <h4>Club business</h4>
          <ul>
            <li><a href="contact.html#partners">Sponsorship and partnership</a></li>
            <li><a href="contact.html#trials">Trials and scouting</a></li>
            <li><a href="news.html#media">Media enquiries</a></li>
            <li><a href="contact.html">Contact the club</a></li>
          </ul>
        </div>
        <div>
          <h4>Legal</h4>
          <ul>
            <li><a href="privacy.html">Privacy policy</a></li>
            <li><a href="terms.html">Terms and conditions</a></li>
            <li><a href="compliance.html">Legal compliance</a></li>
            <li><a href="/.well-known/security.txt">Security disclosure</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span>&copy; ${new Date().getFullYear()} CATDA Football Club, Kampala, Uganda</span>
        <span class="footer__legal">
          <a href="privacy.html">Privacy</a>
          <a href="terms.html">Terms</a>
          <a href="compliance.html">Compliance</a>
        </span>
        <span>Site data compiled ${fmtDate(D.meta.dataUpdated, true)}</span>
      </div>
    </div>`;
  document.body.appendChild(footer);
}

/* ---------- shared components ---------- */

function hero({ kicker, title, lede, chips = [], image, meta = '' }) {
  const img = image ? D.images[image] : null;
  return `<section class="hero">
    ${img ? `<img class="hero__img" src="${esc(img.src)}" alt="${esc(img.alt)}">
    <div class="hero__scrim" aria-hidden="true"></div>` : ''}
    <div class="wrap hero__in">
      <div class="kicker">${esc(kicker)}</div>
      <h1>${esc(title)}</h1>
      ${lede ? `<p class="lede">${lede}</p>` : ''}
      ${chips.length ? `<div class="hero__meta">${chips.map(ch => `<span class="chip ${ch.type || ''}">${esc(ch.text)}</span>`).join('')}</div>` : ''}
      ${meta}
    </div>
  </section>`;
}

const statBlock = (label, value) =>
  `<div class="stat"><b>${esc(value)}</b><span>${esc(label)}</span></div>`;

function matchRow(r) {
  const cls = r.status === 'win' ? 'win' : r.status === 'loss' ? 'loss' : 'tbc';
  const score = (n(r.hs) === null || n(r.as) === null)
    ? '<span class="match__score">TBC</span>'
    : `<span class="match__score match__score--${cls}">${r.hs}-${r.as}</span>`;
  const usHome = r.home.toUpperCase().includes('CATDA');
  return `<article class="match match--${cls}">
    <div class="match__date">${esc(r.md || '')}<br>${fmtDate(r.date)}</div>
    <div class="match__teams">
      <b>${usHome ? 'CATDA FC' : esc(r.home)}</b> v <b>${!usHome ? 'CATDA FC' : esc(r.away)}</b>
      <div class="tiny" style="margin-top:.2rem">${esc(r.comp)}, ${esc(r.venue)}</div>
    </div>
    ${score}
    ${r.note ? `<p class="match__note">${esc(r.note)}</p>` : ''}
  </article>`;
}

function tableHTML() {
  const s = D.standings;
  return `<div class="table-scroll">
    <table>
      <caption>
        <div class="tiny" style="color:var(--cyan-deep)">Final table</div>
        <b style="font-family:var(--cond);font-size:1.25rem;text-transform:uppercase;letter-spacing:.03em;color:var(--ink)">${esc(s.competition)} ${esc(s.season)}</b>
        <div class="tiny" style="margin-top:.3rem">${esc(s.note)}</div>
      </caption>
      <thead><tr>
        <th class="num">#</th><th scope="col">Club</th>
        <th class="num">P</th><th class="num">W</th><th class="num">D</th><th class="num">L</th>
        <th class="num">GF</th><th class="num">GA</th><th class="num">GD</th><th class="num">Pts</th>
        <th scope="col">Status</th>
      </tr></thead>
      <tbody>
        ${s.rows.map(r => {
          const gd = r.gf - r.ga;
          const tag = r.tag
            ? `<span class="tag ${/Champions/i.test(r.tag) ? 'tag--champ' : /Promoted/i.test(r.tag) ? 'tag--promoted' : /Relegated/i.test(r.tag) ? 'tag--rel' : ''}">${esc(r.tag)}</span>`
            : '';
          return `<tr class="${r.us ? 'us' : ''}">
            <td class="num">${r.pos}</td><td>${esc(r.team)}</td>
            <td class="num">${r.p}</td><td class="num">${r.w}</td><td class="num">${r.d}</td><td class="num">${r.l}</td>
            <td class="num">${r.gf}</td><td class="num">${r.ga}</td>
            <td class="num">${gd > 0 ? '+' : ''}${gd}</td>
            <td class="num" style="font-weight:800">${r.pts}</td>
            <td>${tag}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}

function figureHTML(key) {
  const img = D.images[key];
  if (!img) return '';
  return `<figure><img src="${esc(img.src)}" alt="${esc(img.alt)}" loading="lazy"></figure>`;
}

/* ---------- boot ---------- */

let BOOTED = false;

async function boot() {
  if (BOOTED) return;
  BOOTED = true;
  try {
    D = await (await fetch(DATA_URL, { cache: 'no-cache' })).json();
  } catch (e) {
    const slot = $('#page');
    if (slot) slot.innerHTML = `<div class="wrap section"><h2>Content data unavailable</h2>
      <p class="lede mt2">This site reads its content from assets/data.json over HTTP. Serve the folder with a web server rather than opening the file directly.</p></div>`;
    return;
  }
  window.CATDA = D;

  $('.topbar, .ribbon, .strip, .footer')?.remove();
  mountChrome();

  const page = currentPage().replace('.html', '') || 'index';
  const render = (window.RENDERERS || {})[page];
  const slot = $('#page');
  if (slot && slot.hasAttribute('data-static')) { /* page ships its own markup */ }
  else if (render && slot) slot.innerHTML = render(D);
  else if (slot && slot.children.length) { /* keep existing markup */ }
  else if (slot) slot.innerHTML = '<div class="wrap section"><h2>Page not found</h2><p class="lede mt2"><a href="index.html">Return to the home page</a></p></div>';
}

document.addEventListener('DOMContentLoaded', boot);

/* ---------- contact form: validate locally, hand off by mail, drop bot posts ---------- */
document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-form="contact"]');
  if (!f) return;
  e.preventDefault();
  const status = f.querySelector('[data-form-status]');
  if (f.elements.website && f.elements.website.value) { status.textContent = 'Submission rejected.'; return; }  // honeypot
  const name = f.elements.name.value.trim();
  const contact = f.elements.contact.value.trim();
  const msg = f.elements.message.value.trim();
  if (name.length < 2 || contact.length < 5 || msg.length < 10) {
    status.textContent = 'Please complete your name, a contact detail and a message of at least ten characters.';
    status.style.color = 'var(--red-ink)';
    return;
  }
  if (msg.length > 4000) { status.textContent = 'Message is too long. Keep it under 4,000 characters.'; return; }
  const club = (window.CATDA && window.CATDA.club.email) || 'catdaclub@gmail.com';
  const body = encodeURIComponent(`Name: ${name}\nContact: ${contact}\nTopic: ${f.elements.topic.value}\n\n${msg}`);
  window.location.href = `mailto:${club}?subject=${encodeURIComponent('Website enquiry, CATDA FC')}&body=${body}`;
  status.textContent = 'Opening your mail app. If nothing opens, write directly to ' + club;
  status.style.color = 'var(--win)';
});

/* Tactile click feedback on metric cards: one cyan pulse ring per click. */
document.addEventListener('click', (e) => {
  const card = e.target.closest('.stat');
  if (!card) return;
  card.classList.remove('stat--ping');
  void card.offsetWidth;
  card.classList.add('stat--ping');
});

/* Publish helpers on the global object so page renderers can use them
   regardless of script load order or execution context. */
if (typeof window !== 'undefined') {
  Object.assign(window, {
    PAGES, LEGAL_PAGES, DATA_URL, $, $$, esc, n, fmtDate, ord, initials, currentPage,
    hero, statBlock, matchRow, tableHTML, figureHTML
  });
}
