/* =====================================================================
   CATDA FC  ·  page renderers
   One function per page, keyed by filename. All content from data.json.
   ===================================================================== */

const RENDERERS = {

  /* ---------------- HOME ---------------- */
  index(D) {
    const c = D.club;
    const st = D.standings.rows.find(r => r.us);
    const played = D.results.filter(r => r.status !== 'unrecorded');
    const last = played[played.length - 1];
    const kcca = D.cupTies.find(t => t.season === '2021/22');
    const live = D.news.filter(x => x.status === 'live');

    return hero({
      kicker: 'Kampala, Uganda. Est. from the Lufula',
      title: 'The Lufula Boys',
      lede: `A football club owned by its community on Old Port Bell Road. District champions in 2017/18, champions of the Kampala region in 2025, licensed by FUFA for the national second tier, and back for a second season of the ${esc(c.league)}.`,
      chips: [
        { text: `${c.league}, tier ${c.leagueTier}`, type: 'chip--solid' },
        { text: `Season opens ${fmtDate(c.seasonStarts)}`, type: 'chip--cyan' },
        { text: 'Home: Hamz Stadium-Nakivubo' },
        { text: 'Kampala region champions 2024/25' }
      ],
      image: 'hero',
      meta: `<div class="grid g4 mt3">
        ${statBlock('League position 2025/26', st.pos + ord(st.pos) + ' of ' + D.standings.rows.length)}
        ${statBlock('Points, debut Big League season', st.pts)}
        ${statBlock('Seasons, district to tier two', '9')}
        ${statBlock('Share held by the traders association', '35%')}
      </div>
      <div class="mt3" style="display:flex;gap:.6rem;flex-wrap:wrap">
        <a class="btn btn--onglass" href="matches.html">Fixtures and results</a>
        <a class="btn btn--onglass" href="club.html">The story</a>
        <a class="btn btn--red" href="cup.html">Giant killers</a>
      </div>`
    }) + `

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div>
            <div class="kicker">Top stories</div>
            <h2>Latest from the club</h2>
          </div>
          <a class="btn btn--ghost" href="news.html">All news</a>
        </div>
        <div class="grid g2">
          ${live.slice(0, 4).map((x, i) => `
            <article class="card ${i === 0 ? 'card--accent' : ''}">
              ${x.image ? figureHTML(x.image) : ''}
              <div class="tiny mt2" style="color:var(--cyan-deep)">${fmtDate(x.date, true)}, ${esc(x.tag)}</div>
              <h3 class="mt1" style="font-size:1.35rem">${esc(x.title)}</h3>
              <p class="small mt1">${esc(x.body)}</p>
            </article>`).join('')}
        </div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="wrap split split--main">
        <div>
          <div class="kicker">The verdict from above</div>
          <blockquote class="quote">
            <p>${esc(kcca.quote.text)}</p>
            <footer>${esc(kcca.quote.attrib)}, after KCCA FC 2-0 CATDA FC, Stanbic Uganda Cup round of 64, September 2021. ${esc(kcca.quote.source)}</footer>
          </blockquote>
          <p class="lede mt3">A third-tier club from the Kampala playgrounds took the Ugandan champions to 90 minutes. In February 2025 the defending cup holders Kitara FC needed an own goal in the 87th minute to beat the same club by one. Every cup tie on record is documented, with sources.</p>
          <a class="btn mt2" href="cup.html">The cup record</a>
        </div>
        <div class="stack">
          ${D.cupTies.map(t => `
            <div class="card">
              <div class="tiny" style="color:var(--cyan-deep)">${esc(t.season)}, ${esc(t.round)}</div>
              <div style="font-family:var(--cond);font-weight:700;font-size:1.3rem;text-transform:uppercase;color:var(--ink);margin:.2rem 0 .4rem">${esc(t.tie)}</div>
              <p class="small">${esc(t.story)}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div>
            <div class="kicker">Where we finished</div>
            <h2>FUFA Big League 2025/26</h2>
          </div>
          <a class="btn btn--ghost" href="matches.html#table">Full table and results</a>
        </div>
        <div class="split split--main">
          ${tableHTML()}
          <div class="stack">
            <h4 style="color:var(--cyan-deep)">Results on record</h4>
            ${played.slice(-4).reverse().map(matchRow).join('')}
            <div class="callout"><b class="head">Data policy</b> The full 16-club table above is final and sourced. The match list carries only scorelines that could be sourced from published reports. Anything else is shown as TBC. This site does not estimate.</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="wrap">
        <div class="section-head">
          <div>
            <div class="kicker">What this club is</div>
            <h2>Three things worth knowing</h2>
          </div>
          <p class="small" style="max-width:34ch">Not a corporate team, not an institution, not an academy with an external owner. A community that put a football club on the national pyramid and kept it there.</p>
        </div>
        <div class="grid g3">
          ${D.identity.pillars.map((p, i) => `
            <article class="card ${i === 1 ? 'card--accent' : 'card--cyan'}">
              <div class="kicker">${esc(p.kicker)}</div>
              <h3 class="mb2">${esc(p.title)}</h3>
              <p class="small">${esc(p.body)}</p>
            </article>`).join('')}
        </div>
        <div class="grid g3 mt3">
          ${figureHTML('heritage')}
          ${figureHTML('training')}
          ${figureHTML('fans')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="panel panel--ink center">
          <div class="kicker" style="color:var(--cyan-lt)">Support the climb</div>
          <h2 style="color:var(--white)">Second season.<br>Same community.</h2>
          <p class="lede mt2" style="color:#D9D5DC;margin-inline:auto">A traders' club now carries a national fixture list from Kabale to Kumi. That costs more than a gate can raise. Partners, trials and away-day support all start with one message.</p>
          <div class="mt3" style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap">
            <a class="btn btn--red" href="contact.html#partners">Become a partner</a>
            <a class="btn btn--onglass" href="squad.html#trials">Player trials</a>
            <a class="btn btn--onglass" href="fans.html">Join the Lufula</a>
          </div>
        </div>
      </div>
    </section>`;
  },

  /* ---------------- CLUB ---------------- */
  club(D) {
    const c = D.club;
    const o = D.ownership;
    return hero({
      kicker: 'Club profile',
      title: 'From the abattoir to the national pyramid',
      lede: `CATDA FC belong to the community around the Kampala City Abattoir on Old Port Bell Road, known in Luganda as Lufula. The FUFA ownership register records it plainly: the traders' association holds 35% of the club and six individuals from the same community hold the rest.`,
      chips: [
        { text: c.nickname, type: 'chip--cyan' },
        { text: c.motto, type: 'chip--red' },
        { text: c.homeArea },
        { text: `${c.league}, tier ${c.leagueTier}`, type: 'chip--ink' }
      ],
      image: 'heritage'
    }) + `
    <section class="section">
      <div class="wrap split split--main">
        <div>
          <div class="kicker">Identity</div>
          <h2 class="mb3">Who CATDA are</h2>
          <p class="lede">The club's management, funding and fanbase are drawn from the butchers, meat traders and businesspeople of the abattoir ecosystem. Hence the name that follows the club everywhere: <b>The Lufula Boys</b>. Hence the crest, which carries the community's own words: Kick With Skills, Lufula.</p>
          <p>That origin shapes everything. There has never been a corporate backer, a ministry or a wealthy individual owner. Money comes from contributions inside a trading community, which is exactly why each promotion has been hard-won, and exactly why each one has been kept.</p>
          <p>The football follows the same logic. CATDA are traditionally physical, direct and relentless, a side built to be unpleasant to play against on a Kampala playground with the touchline full of drums. It is a style that has repeatedly embarrassed clubs with far bigger budgets in the Stanbic Uganda Cup.</p>

          <div class="kicker mt4">Registered name</div>
          <p>The acronym is officially expanded as <b>${esc(c.officialExpansion)}</b>. The FUFA ownership register prints it as "City Abattiour Traders Development Association", a spelling variant of the same name, holding a 35% share. Earlier third-party profiles rendered the acronym differently. The FUFA register is treated as authoritative on this site.</p>

          <hr class="rule">

          <div class="kicker">The climb</div>
          <h2 class="mb3">Nine seasons, one climb</h2>
          <div class="timeline">
            ${D.timeline.map(t => `
              <div class="t-item ${/Champions of Kampala|Licensed by FUFA|best side/i.test(t.event) ? 't-item--big' : ''}">
                <div class="t-item__year">${esc(t.year)}</div>
                <h3>${esc(t.event)}</h3>
                <p class="small">${esc(t.detail)}</p>
              </div>`).join('')}
          </div>
        </div>

        <aside class="stack">
          <div class="panel center">
            <div class="kicker" style="justify-content:center">The badge</div>
            <img src="assets/img/logo.png" alt="CATDA Football Club badge: cyan starburst ring, cow head and ball over red rays, CATDA Football Club, Kick With Skills, Lufula" style="width:min(340px,100%);margin-inline:auto;height:auto">
            <p class="tiny mt2">CATDA Football Club. Kick With Skills. Lufula. Display the badge at 160px or wider wherever its lettering must be read.</p>
          </div>
          <div class="panel">
            <div class="kicker">Ownership, per FUFA</div>
            <p class="small">${esc(o.source)}</p>
            <div class="table-scroll mt2" style="border:0">
              <table style="min-width:0">
                <thead><tr><th>Subscriber</th><th class="num">Share</th></tr></thead>
                <tbody>
                  ${o.shareholders.map(s => `<tr${s.type === 'association' ? ' class="us"' : ''}><td>${esc(s.name)}</td><td class="num" style="font-weight:800">${s.share}%</td></tr>`).join('')}
                </tbody>
              </table>
            </div>
            <a class="tiny mt2" style="display:inline-block" href="${esc(o.sourceUrl)}" target="_blank" rel="noopener">View the FUFA register</a>
          </div>

          <div class="panel">
            <div class="kicker">Club facts</div>
            <dl style="margin:0;display:grid;grid-template-columns:auto 1fr;gap:.6rem .9rem;font-size:.88rem">
              ${[
                ['Full name', c.officialExpansion],
                ['Nickname', c.nickname],
                ['Motto', c.motto],
                ['Based', c.homeArea],
                ['League', `${c.league} (tier ${c.leagueTier})`],
                ['Division', `${c.leagueSize} clubs, national`],
                ['Association', 'Kampala Regional FA, affiliated to FUFA'],
                ['2025/26', `${D.standings.rows.find(r => r.us).pos}${ord(D.standings.rows.find(r => r.us).pos)} of 16, ${D.standings.rows.find(r => r.us).pts} points`],
                ['2026/27', `Kickoff ${fmtDate(c.seasonStarts, true)}`],
                ['Email', c.email],
                ['Phone', c.phone]
              ].filter(r => r[1]).map(([k, v]) => `<dt class="tiny" style="padding-top:.15rem">${esc(k)}</dt><dd style="margin:0;color:var(--ink-2)">${esc(v)}</dd>`).join('')}
            </dl>
          </div>

          <div class="panel">
            <div class="kicker">Home grounds</div>
            <div class="stack" style="margin-top:.5rem">
              ${D.grounds.map(g => `
                <div style="border-left:2px solid ${g.role.startsWith('Home') ? 'var(--red)' : 'var(--line-2)'};padding-left:.8rem">
                  <b style="display:block;font-size:.92rem;color:var(--ink)">${esc(g.name)}</b>
                  <span class="tiny">${esc(g.role)}, ${esc(g.location)}</span>
                </div>`).join('')}
            </div>
          </div>

          <div class="panel">
            <div class="kicker">Brand colours</div>
            <p class="small">Sampled from the official badge. Kit colours are not documented in any published source and are not claimed here.</p>
            <div style="display:flex;gap:.4rem;margin-top:.7rem">
              ${[['#1C9FCD','Cyan'],['#CE2C33','Red'],['#17141A','Ink'],['#FFFFFF','White']].map(([hex, name]) =>
                `<div style="flex:1"><div style="height:42px;border-radius:2px;background:${hex};border:1px solid var(--line-2)"></div><span class="tiny">${name}<br>${hex}</span></div>`).join('')}
            </div>
          </div>

          <div class="panel">
            <div class="kicker">Digital footprint</div>
            <ul style="list-style:none;padding:0;margin:.4rem 0 0;font-size:.88rem">
              <li style="padding:.45rem 0;border-bottom:1px solid var(--line)">X: <a href="${esc(c.social.x)}" target="_blank" rel="noopener">@FcCatda</a><br><span class="tiny">Official handle, joined June 2025</span></li>
              <li style="padding:.45rem 0;border-bottom:1px solid var(--line)">X: <a href="${esc(c.social.xLegacy)}" target="_blank" rel="noopener">@CatdaClub</a><br><span class="tiny">Legacy handle, Industrial Area, dormant</span></li>
              <li style="padding:.45rem 0;border-bottom:1px solid var(--line)">Facebook: <a href="${esc(c.social.facebook)}" target="_blank" rel="noopener">Catda Football Club</a><br><span class="tiny">Matchday pictorials and announcements</span></li>
              <li style="padding:.45rem 0">Domain: ${esc(c.domain)}<br><span class="tiny">${esc(c.domainStatus)}</span></li>
            </ul>
          </div>
        </aside>
      </div>
    </section>`;
  },

  /* ---------------- HONOURS ---------------- */
  honours(D) {
    const st = D.standings.rows.find(r => r.us);
    return hero({
      kicker: 'Silverware and records',
      title: 'What we have won',
      lede: 'One district title, one regional championship, two play-off final defeats and one promotion. Plus a cup reputation built against clubs with ten times the budget.',
      chips: [
        { text: 'Kampala region champions 2024/25', type: 'chip--cyan' },
        { text: 'Nakawa District champions 2017/18' },
        { text: `Big League ${st.pos}${ord(st.pos)} of 16, 2025/26`, type: 'chip--ink' }
      ],
      image: 'promotion'
    }) + `
    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div><div class="kicker">Honour roll</div><h2>Titles, finals and awards</h2></div>
          <p class="small" style="max-width:34ch">Every entry is sourced from published match reports or FUFA records. Items only partly confirmed are labelled.</p>
        </div>
        <div class="grid g2">
          ${D.honors.map(h => `
            <article class="card ${/champions|winners/i.test(h.title) ? 'card--cyan' : 'card--accent'}">
              <div class="tiny" style="color:var(--cyan-deep)">${esc(h.season)}</div>
              <h3 class="mt1 mb2" style="font-size:1.25rem">${esc(h.title)}</h3>
              <p class="small">${esc(h.result)}</p>
              ${h.outcome ? `<p class="small mt1" style="color:var(--ink-2)"><b style="color:var(--red-ink)">Result:</b> ${esc(h.outcome)}</p>` : ''}
              <div class="mt2">${h.verified === true ? '<span class="tag tag--promoted">Verified</span>' : '<span class="tag tag--rel">Partly confirmed</span>'}</div>
            </article>`).join('')}
        </div>

        <hr class="rule">

        <div class="section-head">
          <div><div class="kicker">Records</div><h2>By the numbers</h2></div>
        </div>
        <div class="grid g4">
          ${statBlock('Big League games 2025/26', st.p)}
          ${statBlock('Goals scored', st.gf)}
          ${statBlock('Goals conceded', st.ga)}
          ${statBlock('Points', st.pts)}
          ${statBlock('Draws in 2025/26', st.d)}
          ${statBlock('Scorpion Group points 2023/24', '54')}
          ${statBlock('Mbalire goals 2023/24', '19')}
          ${statBlock('Penalties scored v Ntinda, 2025', '4')}
        </div>

        <div class="split split--half mt4">
          <div class="panel">
            <div class="kicker">The near misses</div>
            <h3 class="mb2">Twice within one match of the Big League</h3>
            <p class="small">In October 2020 CATDA beat Edgars FC 2-0 in the Kampala regional play-off final at the FUFA Technical Centre in Njeru, missing three players and head coach Richard Amatre to positive COVID-19 tests, then lost the inter-regional decider to Buganda champions Luweero United.</p>
            <p class="small">In May 2024 they topped the Scorpion Group with 54 points, drew 1-1 with Proline FC in the play-off final at Muteesa II Stadium, Wankulukuku, and lost 7-6 on penalties.</p>
            <p class="small" style="color:var(--ink);font-weight:600">In May 2025, at the third attempt in five seasons, they won.</p>
          </div>
          <div class="panel">
            <div class="kicker">Divisional record</div>
            <div class="table-scroll" style="border:0">
              <table style="min-width:0">
                <thead><tr><th>Tier</th><th>Competition</th><th>Best result</th></tr></thead>
                <tbody>
                  <tr><td>4</td><td>Nakawa District League</td><td>Champions 2017/18</td></tr>
                  <tr><td>3</td><td>Kampala Regional League</td><td>Champions 2024/25</td></tr>
                  <tr class="us"><td>2</td><td>FUFA Big League</td><td>10th, 2025/26</td></tr>
                  <tr><td>1</td><td>Uganda Premier League</td><td>Not yet reached</td></tr>
                </tbody>
              </table>
            </div>
            <p class="tiny mt2">Kampala Regional League seasons run from promotion in 2017/18 to the 2024/25 title.</p>
          </div>
        </div>
      </div>
    </section>`;
  },

  /* ---------------- MATCHES ---------------- */
  matches(D) {
    const played = D.results.filter(r => r.status !== 'unrecorded');
    const wins = played.filter(r => r.status === 'win').length;
    return hero({
      kicker: 'Fixtures, results, table',
      title: 'Match centre',
      lede: `The FUFA Big League is a national 16-club division. In 2025/26 that meant away days in Kabale, Mbale, Kumi, Arua, Nebbi and Ntungamo. A travel footprint no Kampala playground club had carried before.`,
      chips: [
        { text: D.nextFixture.competition, type: 'chip--cyan' },
        { text: `Kickoff ${fmtDate(D.nextFixture.kickoffDate, true)}`, type: 'chip--solid' },
        { text: `${wins} wins on record in 2025/26` }
      ],
      image: 'kabale'
    }) + `
    <section class="section section--tight" id="next">
      <div class="wrap">
        <div class="panel card--accent card">
          <div class="kicker">Next fixture</div>
          <div class="split split--main" style="align-items:center">
            <div>
              <h2 style="font-size:clamp(1.6rem,3.6vw,2.5rem)">${esc(D.nextFixture.headline)}</h2>
              <p class="lede mt2" style="font-size:1rem">${esc(D.nextFixture.copy)}</p>
            </div>
            <div class="grid g3">
              <div><div class="tiny">Opponent</div><div style="font-family:var(--cond);font-weight:700;font-size:1.7rem;color:var(--ink)">${esc(D.nextFixture.opponent)}</div></div>
              <div><div class="tiny">Kickoff</div><div style="font-family:var(--cond);font-weight:700;font-size:1.7rem;color:var(--ink)">${fmtDate(D.nextFixture.kickoffDate)}</div></div>
              <div><div class="tiny">Venue</div><div style="font-family:var(--cond);font-weight:700;font-size:1.7rem;color:var(--ink)">${esc(D.nextFixture.venue)}</div></div>
            </div>
          </div>
          <div class="callout mt3"><b class="head">Matchday information</b> Entry arrangements, gate times and ticketing for Big League home fixtures are announced by the club on its social channels in the week of each match. Nothing is sold through this site.</div>
        </div>
      </div>
    </section>

    <section class="section" id="results">
      <div class="wrap">
        <div class="section-head">
          <div><div class="kicker">2025/26, FUFA Big League</div><h2>Results on record</h2></div>
          <p class="small" style="max-width:34ch">Scorelines captured from published match reports. Fixtures without a sourced scoreline show TBC.</p>
        </div>
        <div class="stack">${D.results.map(matchRow).join('')}</div>

        <div class="section-head mt4" id="table">
          <div><div class="kicker">Final standings</div><h2>FUFA Big League 2025/26</h2></div>
          <div class="tiny" style="max-width:30ch">Top four promoted to the StarTimes Uganda Premier League. Bottom four relegated.</div>
        </div>
        ${tableHTML()}

        <div class="split split--half mt4">
          <div class="panel">
            <div class="kicker">Season shape</div>
            <h3 class="mb2">Refusal to lose</h3>
            <p class="small">CATDA scored 24 goals in 30 games, the joint-lowest tally of any club that stayed up. What kept them in the division was refusal to be beaten: ten draws and 37 points, three clear of the drop.</p>
            <p class="small">The wins came where they mattered. A 1-0 over Young Elephants at Bugolobi in March was a direct six-pointer in the relegation fight. A 2-1 over Ntugasaze in April beat a side that finished second and went up. The season closed with a 1-0 at Kigezi Home Boyz in Kabale against a club chasing the title.</p>
          </div>
          <div class="panel">
            <div class="kicker">Home</div>
            <h3 class="mb2">Hamz Stadium-Nakivubo</h3>
            <p class="small">The club's 2026/27 Big League home, per the fixtures FUFA released on 15 September 2026. The 2025/26 home, Bugolobi Coffee Grounds, passed FUFA stadium classification at the second inspection in August 2025 after a first-inspection deferral, which is the licensing system working as designed.</p>
            <div class="mt2">
              ${D.grounds.map(g => `<div class="tiny" style="padding:.3rem 0;border-bottom:1px solid var(--line)">${esc(g.name)}, ${esc(g.role)}</div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>`;
  },

  /* ---------------- SQUAD ---------------- */
  squad(D) {
    const p = D.people;
    return hero({
      kicker: 'First team, staff, alumni',
      title: 'The players',
      lede: 'A squad built from Kampala neighbourhood networks. Teenagers and players in their early twenties, developed here and sold on to the tiers above.',
      chips: [
        { text: 'Pathway to the UPL', type: 'chip--cyan' },
        { text: 'Trials open' },
        { text: `${p.alumni.length} alumni on record` }
      ],
      image: 'training'
    }) + `
    <section class="section">
      <div class="wrap">
        <div class="callout"><b class="head">Squad list</b> Regional and Big League rosters are not centrally published in Uganda and turn over every season. The 2026/27 first-team list will be published here in full, with shirt numbers, positions and dates of birth, once confirmed by the club secretary. No names are guessed in the meantime.</div>

        <div class="section-head mt4" id="first-team">
          <div><div class="kicker">2026/27</div><h2>First team</h2></div>
          <p class="small" style="max-width:34ch">Structure ready for the official list.</p>
        </div>
        <div class="table-scroll">
          <table>
            <thead><tr><th class="num">No.</th><th>Player</th><th>Position</th><th class="num">Age</th><th>Nationality</th><th>Joined</th></tr></thead>
            <tbody>
              ${['Goalkeeper','Defender','Defender','Midfielder','Midfielder','Forward','Forward'].map(pos => `
                <tr style="opacity:.6">
                  <td class="num">--</td>
                  <td style="color:var(--muted)">To be confirmed</td>
                  <td>${pos}</td>
                  <td class="num">--</td><td>Uganda</td><td>--</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>

        <div class="section-head mt4" id="names">
          <div><div class="kicker">Verified</div><h2>Names on record</h2></div>
          <p class="small" style="max-width:34ch">Players and staff confirmed in published match reports across the club's rise.</p>
        </div>
        <div class="grid g2">
          ${p.squad.map(pl => `
            <div class="card" style="display:flex;gap:.85rem;align-items:flex-start">
              <span style="flex:0 0 auto;width:42px;height:42px;display:grid;place-items:center;background:var(--cyan-tint);border:1px solid var(--cyan);border-radius:2px;font-family:var(--cond);font-weight:700;color:var(--cyan-deep)">${initials(pl.name)}</span>
              <span><span class="tiny" style="display:block;color:var(--cyan-deep)">${esc(pl.role)}</span>
              <b style="display:block;color:var(--ink);font-size:.98rem">${esc(pl.name)}</b>
              <span class="small">${esc(pl.detail)}</span></span>
            </div>`).join('')}
          ${p.coaches.map(pl => `
            <div class="card" style="display:flex;gap:.85rem;align-items:flex-start">
              <span style="flex:0 0 auto;width:42px;height:42px;display:grid;place-items:center;background:var(--red-tint);border:1px solid var(--red);border-radius:2px;font-family:var(--cond);font-weight:700;color:var(--red-ink)">${initials(pl.name)}</span>
              <span><span class="tiny" style="display:block;color:var(--red-ink)">${esc(pl.role)}, ${esc(pl.period)}</span>
              <b style="display:block;color:var(--ink);font-size:.98rem">${esc(pl.name)}</b>
              <span class="small">${esc(pl.detail)}</span></span>
            </div>`).join('')}
        </div>

        <div class="section-head mt4" id="alumni">
          <div><div class="kicker">The pathway</div><h2>Alumni and exports</h2></div>
          <p class="small" style="max-width:34ch">The economic model: develop players in Kampala, watch them move up the pyramid.</p>
        </div>
        <div class="grid g3">
          ${p.alumni.map(pl => `
            <article class="card">
              <div style="display:flex;align-items:center;gap:.65rem;margin-bottom:.5rem">
                <span style="flex:0 0 auto;width:36px;height:36px;display:grid;place-items:center;background:var(--paper-2);border:1px solid var(--line-2);border-radius:2px;font-family:var(--cond);font-weight:700;color:var(--ink-2)">${initials(pl.name)}</span>
                <span><b style="display:block;font-size:.98rem;color:var(--ink)">${esc(pl.name)}</b>
                ${pl.moved ? `<span class="tiny" style="color:var(--cyan-deep)">${esc(pl.moved)}${pl.tier ? ', ' + esc(pl.tier) : ''}</span>` : ''}</span>
              </div>
              <p class="small">${esc(pl.detail)}</p>
            </article>`).join('')}
        </div>

        <div class="panel panel--ink mt4" id="trials">
          <div class="split split--half" style="align-items:center">
            <div>
              <div class="kicker" style="color:var(--cyan-lt)">Recruitment</div>
              <h2 style="color:var(--white);font-size:clamp(1.5rem,3.4vw,2.2rem)">Trials and scouting</h2>
              <p class="lede mt2" style="font-size:1rem;color:#D9D5DC">CATDA recruit from Kampala's neighbourhood networks and district football. Players, coaches and scouts: send name, age, position, current or most recent club, and any match footage link.</p>
            </div>
            <div class="stack">
              <div><div class="tiny">Email</div><b style="color:var(--white)">${esc(D.club.email)}</b></div>
              <div><div class="tiny">Phone and WhatsApp</div><b style="color:var(--white)">${esc(D.club.phone)}</b></div>
              <div><div class="tiny">In person</div><b style="color:var(--white)">Hamz Stadium-Nakivubo, matchdays</b></div>
              <a class="btn btn--red" href="contact.html#trials">Enquire about trials</a>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  },

  /* ---------------- UGANDA CUP ---------------- */
  cup(D) {
    const kcca = D.cupTies.find(t => t.season === '2021/22');
    return hero({
      kicker: 'Stanbic Uganda Cup',
      title: 'Giant killers',
      lede: 'The cup is where a Kampala playground club meets the Uganda Premier League on even terms. One leg, no seeding, penalties if it stays level. CATDA have made a habit of ruining somebody\'s season in it.',
      chips: [
        { text: 'Held KCCA to two goals', type: 'chip--cyan' },
        { text: 'Held cup holders Kitara for 71 minutes' },
        { text: 'Round of 32, 2024/25', type: 'chip--ink' }
      ],
      image: 'hero'
    }) + `
    <section class="section">
      <div class="wrap">
        <blockquote class="quote" style="max-width:900px">
          <p>${esc(kcca.quote.text)}</p>
          <footer>${esc(kcca.quote.attrib)}, manager of the Ugandan champions, after their round of 64 tie against a third-tier CATDA side. ${esc(kcca.quote.source)}</footer>
        </blockquote>

        <div class="section-head mt4">
          <div><div class="kicker">Cup record</div><h2>Ties on record</h2></div>
          <p class="small" style="max-width:36ch">The Stanbic Uganda Cup is open to clubs from every tier. All ties are single leg. Level after 90 minutes goes straight to penalties.</p>
        </div>

        <div class="stack-lg">
          ${D.cupTies.map(t => `
            <article class="card card--accent">
              <div class="split split--main">
                <div>
                  <div class="tiny" style="color:var(--cyan-deep)">${esc(t.season)}, ${esc(t.round)}</div>
                  <h3 style="font-size:clamp(1.4rem,3vw,2rem);margin:.25rem 0 .6rem">${esc(t.tie)}</h3>
                  <p class="lede" style="font-size:1rem">${esc(t.story)}</p>
                  <div class="hero__meta" style="margin-top:1rem">
                    ${t.venue ? `<span class="chip">${esc(t.venue)}</span>` : ''}
                    ${t.date ? `<span class="chip">${fmtDate(t.date)}</span>` : ''}
                    <span class="chip ${t.verified === true ? 'chip--cyan' : 'chip--red'}">${t.verified === true ? 'Result verified' : 'Draw only, result TBC'}</span>
                  </div>
                </div>
                <div>${statBlock('Final score', t.result.replace('Lost ', '').replace('TBC', '--'))}</div>
              </div>
            </article>`).join('')}
        </div>

        <hr class="rule">

        <div class="split split--half">
          <div class="panel">
            <div class="kicker">Why it matters</div>
            <h3 class="mb2">The only national stage</h3>
            <p class="small">For a club below the top flight, the Uganda Cup is the single route to national attention. League football in the Kampala Regional League is played on school playgrounds in front of a few hundred people. A cup tie against KCCA FC or Kitara FC is written about across the country and watched by every scout in Kampala.</p>
            <p class="small">It is also the only competition in Ugandan football where a traders' club and a champions-league side start level. That is why CATDA's cup record, not their league record, is what most Ugandan fans know them for.</p>
          </div>
          <div class="panel">
            <div class="kicker">Against the top flight</div>
            <div class="table-scroll" style="border:0">
              <table style="min-width:0">
                <thead><tr><th>Opponent tier</th><th class="num">Ties</th><th>Margin</th></tr></thead>
                <tbody>
                  <tr><td>Uganda Premier League</td><td class="num">2</td><td>Lost by one goal on average</td></tr>
                  <tr><td>FUFA Big League</td><td class="num">0</td><td>No ties on record</td></tr>
                  <tr><td>Regional and district</td><td class="num">--</td><td>Not documented in sources reviewed</td></tr>
                </tbody>
              </table>
            </div>
            <p class="tiny mt2">Based on the ties that could be sourced. Earlier cup runs from the regional rounds are not documented in the match reporting reviewed.</p>
          </div>
        </div>
      </div>
    </section>`;
  },

  /* ---------------- COMMUNITY ---------------- */
  community(D) {
    return hero({
      kicker: 'Development and governance',
      title: 'Run by the community',
      lede: D.community.intro,
      chips: [
        { text: 'Community owned', type: 'chip--cyan' },
        { text: 'FUFA Clubs Pro-Agenda participant' },
        { text: 'No external investor', type: 'chip--ink' }
      ],
      image: 'heritage'
    }) + `
    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div><div class="kicker">The model</div><h2>How the club actually works</h2></div>
        </div>
        <div class="grid g2">
          ${D.community.pillars.map(p => `
            <article class="card card--cyan">
              <div class="kicker">${esc(p.kicker)}</div>
              <h3 class="mb2">${esc(p.title)}</h3>
              <p class="small">${esc(p.body)}</p>
            </article>`).join('')}
        </div>

        <hr class="rule">

        <div class="split split--main">
          <div>
            <div class="kicker">What is needed</div>
            <h2 class="mb3">The gap between tier three and tier two</h2>
            <p class="lede mb3">Promotion changed the cost base overnight. A Kampala regional season is played within the city. A FUFA Big League season is played across the whole country, with licensing requirements attached to every ground and every registration window.</p>
            <div class="stack">
              ${D.community.needs.map((nd, i) => `
                <div class="card" style="display:flex;gap:.9rem;align-items:flex-start">
                  <span style="font-family:var(--cond);font-weight:700;font-size:1.7rem;color:var(--red);line-height:1">0${i + 1}</span>
                  <p class="small" style="margin:0;color:var(--ink-2)">${esc(nd)}</p>
                </div>`).join('')}
            </div>
          </div>
          <aside class="stack">
            ${figureHTML('training')}
            <div class="panel">
              <div class="kicker">Governance</div>
              <h3 class="mb2">FUFA Clubs Pro-Agenda</h3>
              <p class="small">CATDA have taken part in FUFA Clubs Pro-Agenda engagement facilitated and supervised by the Kampala Regional FA, covering principles of governance, administration and football structure of command, alongside officials from Ntinda United FC and Kireka United FC.</p>
              <a class="btn mt1" href="compliance.html">Licensing and governance</a>
            </div>
            <div class="panel">
              <div class="kicker">Player export</div>
              <h3 class="mb2">Proof it works</h3>
              <p class="small">Sharif "Diao" Ssengendo scored the winner for CATDA against Kisugu United at the Kiira Road playground in January 2022. He went on to play in the Uganda Premier League with KCCA FC.</p>
              <p class="small">That is the model in one sentence: CATDA find a player in a Kampala neighbourhood, give him competitive football, and the top flight takes him. It is a source of pride and a structural problem at the same time.</p>
              <a class="btn mt1" href="squad.html#alumni">Full alumni list</a>
            </div>
            <div class="panel">
              <div class="kicker">Partner with the club</div>
              <p class="small">CATDA offer grassroots credibility that a top-flight shirt cannot buy: a Kampala working-class community, national away-day travel and a documented story.</p>
              <a class="btn btn--red mt1" href="contact.html#partners">Enquiries</a>
            </div>
          </aside>
        </div>
      </div>
    </section>`;
  },

  /* ---------------- FANS ---------------- */
  fans(D) {
    return hero({
      kicker: 'Fan zone',
      title: 'The Lufula roars',
      lede: 'Drums, chant and a touchline packed with traders who own a share of the club. Opposing teams regularly find the home end harder to play at than the scoreline suggests.',
      chips: [
        { text: 'Home: Hamz Stadium-Nakivubo', type: 'chip--cyan' },
        { text: '#LufulaBoys' },
        { text: 'Kick With Skills', type: 'chip--red' }
      ],
      image: 'fans'
    }) + `
    <section class="section">
      <div class="wrap split split--main">
        <div>
          <div class="kicker">Matchday</div>
          <h2 class="mb3">What a CATDA game feels like</h2>
          <p class="lede">The 2024/25 play-off final was played in torrential rain at MTN Omondi Stadium in Lugogo. Ninety minutes produced no goals. The trophy was decided on penalties, and the Kampala region's place in the FUFA Big League went to the club whose fans had followed it out of the abattoir.</p>
          <p>That is the standard. CATDA matches are loud, physical and close. The team's identity, direct, aggressive, relentless, is a mirror of the community behind it, and the community is on the touchline rather than in a boardroom.</p>

          <div class="callout mt3"><b class="head">Songs of the Lufula</b> The club's actual touchline songs are being collected with supporters for publication here, in Luganda with an English gloss. If you have one, send it through the contact page with the match you first heard it at.</div>

          <div class="kicker mt4">Follow the club</div>
          <div class="grid g3 mt2">
            <a class="card" href="${esc(D.club.social.x)}" target="_blank" rel="noopener">
              <div class="tiny" style="color:var(--cyan-deep)">X</div>
              <b style="font-family:var(--cond);font-weight:700;font-size:1.35rem;text-transform:uppercase;color:var(--ink)">@FcCatda</b>
              <p class="small mt1">Official handle of CATDA Football Club, aka the Lufula Boys. Joined June 2025.</p>
            </a>
            <a class="card" href="${esc(D.club.social.facebook)}" target="_blank" rel="noopener">
              <div class="tiny" style="color:var(--cyan-deep)">Facebook</div>
              <b style="font-family:var(--cond);font-weight:700;font-size:1.35rem;text-transform:uppercase;color:var(--ink)">Catda Football Club</b>
              <p class="small mt1">Matchday pictorials, results and club announcements. The most active club channel.</p>
            </a>
            <div class="card">
              <div class="tiny" style="color:var(--cyan-deep)">On the ground</div>
              <b style="font-family:var(--cond);font-weight:700;font-size:1.35rem;text-transform:uppercase;color:var(--ink)">Hamz Stadium</b>
              <p class="small mt1">Every home fixture. Kickoff times are announced on club channels in the week of the match.</p>
            </div>
          </div>
        </div>

        <aside class="stack">
          <div class="panel card--accent">
            <div class="kicker">Away days 2025/26</div>
            <h3 class="mb2">A national footprint</h3>
            <p class="small">The FUFA Big League took CATDA to grounds no player at this club had travelled to before:</p>
            <ul class="small" style="padding-left:1.1rem;line-height:1.9">
              <li>Al Madina Stadium, Kabale</li>
              <li>Mbale City Stadium, Mbale</li>
              <li>Kavumba Recreational Stadium</li>
              <li>Kumi</li>
              <li>Kyamate, Ntungamo</li>
              <li>Nakivubo War Memorial, Hamz Stadium</li>
              <li>Maroons Stadium, Luzira</li>
            </ul>
          </div>
          <div class="panel">
            <div class="kicker">Voice of the club</div>
            <ul style="list-style:none;padding:0;margin:0" class="small">
              ${D.identity.voice.map(v => `<li style="padding:.5rem 0;border-bottom:1px solid var(--line);color:var(--ink-2)">${esc(v)}</li>`).join('')}
            </ul>
            <p class="tiny mt2">The house style for all CATDA communications: social posts, match reports, statements.</p>
          </div>
          <div class="panel">
            <div class="kicker">Get involved</div>
            <p class="small">Supporter contributions are how this club reaches a national division. Volunteering, matchday help, travel support and kit donations all start with one message.</p>
            <a class="btn btn--red mt1" href="contact.html">Contact the club</a>
          </div>
        </aside>
      </div>
    </section>`;
  },

  /* ---------------- NEWS ---------------- */
  news(D) {
    const live = D.news.filter(x => x.status === 'live');
    return hero({
      kicker: 'News and media centre',
      title: 'Latest from the club',
      lede: 'Club announcements, match reports and the national press coverage that documented the climb from a Nakawa district title to the FUFA Big League.',
      chips: [
        { text: `${live.length} club posts`, type: 'chip--cyan' },
        { text: `${D.press.length} press items on record` },
        { text: 'Press: catdaclub@gmail.com', type: 'chip--ink' }
      ],
      image: 'promotion'
    }) + `
    <section class="section">
      <div class="wrap split split--main">
        <div>
          <div class="section-head">
            <div><div class="kicker">Club news</div><h2>Announcements</h2></div>
          </div>
          <div class="stack-lg">
            ${live.map(x => `
              <article class="card">
                ${x.image ? figureHTML(x.image) : ''}
                <div class="tiny mt2" style="color:var(--cyan-deep)">${fmtDate(x.date, true)}, ${esc(x.tag)}</div>
                <h3 class="mt1 mb2" style="font-size:clamp(1.25rem,2.6vw,1.7rem)">${esc(x.title)}</h3>
                <p class="small" style="font-size:.94rem">${esc(x.body)}</p>
              </article>`).join('')}
          </div>
        </div>

        <aside id="media">
          <div class="section-head">
            <div><div class="kicker">Press coverage</div><h2>In the media</h2></div>
          </div>
          <div class="stack">
            ${D.press.map(p => `
              <a class="card" href="${esc(p.url)}" target="_blank" rel="noopener">
                <div style="display:flex;justify-content:space-between;gap:.6rem;align-items:center;margin-bottom:.4rem">
                  <span class="tiny" style="color:var(--cyan-deep)">${esc(p.source)}</span>
                  <span class="tag">${esc(p.kind)}</span>
                </div>
                <b style="display:block;font-size:.98rem;line-height:1.35;color:var(--ink);margin-bottom:.35rem">${esc(p.title)}</b>
                <span class="tiny">${fmtDate(p.date, true)}</span>
                <p class="small mt1">${esc(p.excerpt)}</p>
              </a>`).join('')}
          </div>

          <div class="panel mt3">
            <div class="kicker">Media enquiries</div>
            <p class="small">Interview requests, accreditation, image licensing and fixture information.</p>
            <div class="mt2"><div class="tiny">Email</div><b style="color:var(--ink)">${esc(D.club.email)}</b></div>
            <div class="mt1"><div class="tiny">Alternate</div><b style="color:var(--ink)">${esc(D.club.emailAlt)}</b></div>
            <div class="mt1"><div class="tiny">Phone</div><b style="color:var(--ink)">${esc(D.club.phone)}</b></div>
          </div>
        </aside>
      </div>
    </section>`;
  },

  /* ---------------- CONTACT ---------------- */
  contact(D) {
    const c = D.club;
    const field = (id, label, extra = '') =>
      `<label><span class="tiny">${esc(label)}</span>
        <input id="${id}" name="${id}" type="text" maxlength="200" ${extra}>
      </label>`;

    return hero({
      kicker: 'Get in touch',
      title: 'Talk to the club',
      lede: 'Sponsorship, trials, media, fixtures or a message from a supporter. Everything reaches the same people, because at this level the people running the club are the people standing on the touchline.',
      chips: [
        { text: c.email, type: 'chip--cyan' },
        { text: c.phone },
        { text: 'Kampala, Uganda', type: 'chip--ink' }
      ]
    }) + `
    <section class="section">
      <div class="wrap split split--main">
        <div>
          <div class="kicker">Send a message</div>
          <h2 class="mb3">Contact form</h2>
          <form class="stack" data-form="contact" novalidate>
            <div class="hp-field" aria-hidden="true">
              <label>Leave this field empty<span><input name="website" type="text" tabindex="-1" autocomplete="off"></span></label>
            </div>
            <div class="split split--half" style="gap:1rem">
              ${field('name', 'Your name', 'required autocomplete="name"')}
              ${field('contact', 'Email or phone', 'required autocomplete="email"')}
            </div>
            <label><span class="tiny">Enquiry type</span>
              <select name="topic">
                <option>Sponsorship and partnership</option>
                <option>Player trials and scouting</option>
                <option>Media and press</option>
                <option>Fixtures and matchday</option>
                <option>Youth and community programmes</option>
                <option>General enquiry</option>
              </select>
            </label>
            <label><span class="tiny">Message</span>
              <textarea name="message" rows="6" required maxlength="4000"></textarea>
            </label>
            <div style="display:flex;gap:.7rem;flex-wrap:wrap;align-items:center">
              <button class="btn btn--red" type="submit">Send message</button>
              <span class="tiny" data-form-status>No account, no cookies, no server storage. The form opens your mail app.</span>
            </div>
          </form>
          <p class="small mt2">This site stores nothing. Messages leave your device through your own mail client and go straight to the club inbox. See the <a href="privacy.html">privacy policy</a>.</p>
        </div>

        <aside class="stack">
          <div class="panel card--accent" id="contacts">
            <div class="kicker">Direct lines</div>
            <div class="stack" style="margin-top:.6rem">
              <div><div class="tiny">Club email</div><b style="color:var(--ink)">${esc(c.email)}</b></div>
              <div><div class="tiny">Media email</div><b style="color:var(--ink)">${esc(c.emailAlt)}</b></div>
              <div><div class="tiny">Phone</div><b style="color:var(--ink)">${esc(c.phone)}</b></div>
              <div><div class="tiny">Based</div><b style="color:var(--ink)">${esc(c.homeArea)}</b></div>
              <div><div class="tiny">Home ground</div><b style="color:var(--ink)">Hamz Stadium-Nakivubo, Kampala</b></div>
            </div>
            <div class="mt3" style="display:flex;gap:.5rem;flex-wrap:wrap">
              <a class="btn" href="mailto:${esc(c.email)}">Email the club</a>
              <a class="btn btn--ghost" href="${esc(c.social.x)}" target="_blank" rel="noopener">X</a>
              <a class="btn btn--ghost" href="${esc(c.social.facebook)}" target="_blank" rel="noopener">Facebook</a>
            </div>
          </div>

          <div class="panel card--cyan" id="partners">
            <div class="kicker">Sponsorship and partnership</div>
            <h3 class="mb2">What you are buying</h3>
            <p class="small">A FUFA Big League club with a national fixture list, a documented rise from district football to the national second tier in nine seasons, and one of the most distinct supporter identities in Ugandan football. Kit front, kit back, sleeve, training wear, matchday presentation, digital and community activations are all available.</p>
            <p class="small" style="color:var(--ink);font-weight:600">CATDA currently have no publicly announced commercial partner. The first partner of the 2026/27 season takes the category alone.</p>
            <a class="btn btn--red mt1" href="mailto:${esc(c.email)}?subject=${encodeURIComponent('Partnership enquiry, CATDA FC')}">Request the partnership pack</a>
          </div>

          <div class="panel" id="trials">
            <div class="kicker">Trials</div>
            <p class="small">Players, coaches and scouts should contact the club secretary with name, age, position, current or most recent club, and a link to any match footage.</p>
            <a class="btn mt1" href="mailto:${esc(c.email)}?subject=${encodeURIComponent('Trial enquiry, CATDA FC')}">Enquire about trials</a>
          </div>

          <div class="panel">
            <div class="kicker">Where we play</div>
            <div class="stack" style="margin-top:.5rem">
              ${D.grounds.slice(0, 4).map(g => `
                <div style="border-left:2px solid var(--line-2);padding-left:.8rem">
                  <b style="display:block;font-size:.92rem;color:var(--ink)">${esc(g.name)}</b>
                  <span class="tiny">${esc(g.role)}, ${esc(g.location)}</span>
                </div>`).join('')}
            </div>
          </div>
        </aside>
      </div>
    </section>`;
  },

  /* ---------------- COMPLIANCE ---------------- */
  compliance(D) {
    const L = D.licensing;
    return hero({
      kicker: 'Licensing, governance, legal compliance',
      title: 'Fully registered, fully licensed',
      lede: 'CATDA FC compete in the FUFA Big League under the club licensing system of the Federation of Uganda Football Associations. This page sets out the public evidence, the governing chain and the laws this site operates under.',
      chips: [
        { text: 'FUFA Big League licence 2025/26', type: 'chip--cyan' },
        { text: 'Article 13 ownership register 2025/26' },
        { text: 'Kampala Regional FA, FUFA, CAF, FIFA', type: 'chip--ink' }
      ]
    }) + `
    <section class="section">
      <div class="wrap split split--main">
        <div class="legal">
          <div class="kicker">Club licensing</div>
          <h2 style="margin-top:0">The public record</h2>
          <p>${esc(L.status2025_26)}</p>
          <p>${esc(L.stadiumNote)}</p>
          <p>For the 2026/27 season FUFA published the club licensing core process on ${fmtDate(L.cycle2026_27.processReleased, true)}: expression of interest by ${fmtDate(L.cycle2026_27.expressionOfInterest)}, final Big League submissions by ${fmtDate(L.cycle2026_27.finalSubmission)}, First Instance Body evaluation on ${fmtDate(L.cycle2026_27.firstInstanceBody)}, appeals on ${fmtDate(L.cycle2026_27.appeals)}, and licences issued on ${fmtDate(L.cycle2026_27.licencesIssued)}. ${esc(L.cycle2026_27.note)}</p>
          <div class="stack mt2">
            <a class="btn" href="${esc(L.status2025_26Url)}" target="_blank" rel="noopener">FUFA licensing decision 2025/26</a>
            <a class="btn btn--ghost" href="${esc(L.cycle2026_27.sourceUrl)}" target="_blank" rel="noopener">FUFA licensing core process 2026/27</a>
          </div>

          <h2>Ownership</h2>
          <p>${esc(D.ownership.source)}</p>
          <div class="table-scroll mt2">
            <table style="min-width:0">
              <thead><tr><th>Subscriber</th><th>Type</th><th class="num">Share</th></tr></thead>
              <tbody>
                ${D.ownership.shareholders.map(s => `<tr${s.type === 'association' ? ' class="us"' : ''}><td>${esc(s.name)}</td><td>${esc(s.type)}</td><td class="num" style="font-weight:800">${s.share}%</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
          <figure class="mt3">
            <img src="${esc(D.ownership.certificateImage)}" alt="FUFA 2nd Division Club Ownership certificate 2025-2026 for CATDA Football Club, showing subscribers and percentage shares" loading="lazy">
            <figcaption>Reproduced from the FUFA 2nd Division Club Ownership register 2025-2026, published 11 May 2026 under Article 13 of the FUFA Club Ownership and Registration Regulations 2025.</figcaption>
          </figure>

          <h2>Governing bodies</h2>
          <div class="table-scroll">
            <table style="min-width:0">
              <thead><tr><th>Body</th><th>Role</th></tr></thead>
              <tbody>
                ${D.governance.map(g => `<tr><td><a href="${esc(g.url)}" target="_blank" rel="noopener">${esc(g.body)}</a></td><td>${esc(g.role)}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>

          <h2>Regulatory framework</h2>
          <ul>
            ${D.licensing.regulations.map(r => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.name)}</a></li>`).join('')}
            <li>Data Protection and Privacy Act 2019, Acts No. 24 of 2019, and its 2021 Regulations, administered by the Personal Data Protection Office at NITA-U</li>
            <li>Computer Misuse Act 2011, in respect of unauthorised access to or misuse of this site</li>
            <li>Copyright and Neighbouring Rights Act 2006, in respect of all content on this site</li>
          </ul>
          <p class="small">This page is a factual summary for supporters, partners and regulators. It is not legal advice. The club's advocate of record should be consulted on any specific matter.</p>
        </div>

        <aside class="stack">
          <div class="panel card--cyan">
            <div class="kicker">Evidence ladder</div>
            <ol class="small" style="padding-left:1.1rem;line-height:1.8;margin:0">
              <li>Licensed for the FUFA Big League 2025/26, named in the FUFA decision of 23 August 2025.</li>
              <li>Listed in the Article 13 ownership register for 2025/26 with a declared ownership structure.</li>
              <li>Home ground through FUFA stadium classification at second inspection, August 2025.</li>
              <li>Not relegated in 2025/26, therefore a 2026/27 Big League club under the FUFA licensing cycle concluded 24 August 2026.</li>
            </ol>
          </div>
          <div class="panel">
            <div class="kicker">League and federation partners</div>
            <p class="small">${esc(D.partners.leagueNaming.name)}: ${esc(D.partners.leagueNaming.scope)}. <a href="${esc(D.partners.leagueNaming.sourceUrl)}" target="_blank" rel="noopener">FUFA announcement, August 2018</a>.</p>
            <p class="small">${esc(D.partners.cupNaming.name)} titles the Stanbic Uganda Cup.</p>
            <p class="small">FUFA partner band as displayed on fufa.co.ug: ${D.partners.federationPartners.map(p => esc(p.name)).join(', ')}.</p>
            <p class="tiny">${esc(D.partners.federationPartnersNote)}</p>
          </div>
          <div class="panel card--accent">
            <div class="kicker">Club partners</div>
            <p class="small">${esc(D.partners.clubPartnersNote)}</p>
            <a class="btn btn--red mt1" href="contact.html#partners">Partnership enquiries</a>
          </div>
          <div class="panel">
            <div class="kicker">Site security</div>
            <p class="small">This site ships a Content Security Policy, HSTS, nosniff and referrer controls, serves no third-party scripts, sets no cookies and runs no analytics. Security disclosures: <a href="/.well-known/security.txt">security.txt</a>.</p>
            <a class="btn mt1" href="privacy.html">Privacy policy</a>
          </div>
        </aside>
      </div>
    </section>`;
  },

  /* ---------------- PRIVACY ---------------- */
  privacy(D) {
    return hero({
      kicker: 'Privacy policy',
      title: 'What we do with your data',
      lede: 'Short version: almost nothing, deliberately. This site sets no cookies, runs no analytics and stores no personal data on any server it controls.',
      chips: [
        { text: 'No cookies', type: 'chip--cyan' },
        { text: 'No analytics' },
        { text: 'No third-party scripts', type: 'chip--ink' }
      ]
    }) + `
    <section class="section">
      <div class="wrap legal">
        <p class="tiny">Effective ${fmtDate(D.meta.dataUpdated, true)}. Controller: CATDA Football Club, Kampala, Uganda. Contact: ${esc(D.club.email)}.</p>

        <h2>1. Scope</h2>
        <p>This policy covers the website of CATDA Football Club at ${esc(D.club.domain)} and explains what personal data is processed when you use it, under the Data Protection and Privacy Act 2019 of Uganda (the Act) and, where it applies to you, the EU General Data Protection Regulation.</p>

        <h2>2. What this site collects</h2>
        <p>This site sets no cookies, uses no tracking pixels, embeds no third-party scripts, fonts or analytics, and keeps no server-side logs of visitors beyond the ordinary access logs of the hosting provider, which are retained by that provider under its own policy and used only for security and capacity management.</p>
        <p>The contact form does not submit data to any server. It validates your input in your browser and opens your own mail application with the message pre-addressed to the club inbox. The transmission then happens between your mail client and your mail provider, under their policies, not ours. A hidden honeypot field discards automated submissions before they reach that step.</p>

        <h2>3. Data you choose to send</h2>
        <p>If you email the club, message its social channels or attend a trial, the club processes the identity and contact details you provide, and any footballing information you include, for the purpose you sent it: answering enquiries, arranging trials, administering partnerships or accrediting media. The lawful basis under the Act is your consent and the club's legitimate interest in operating a football club.</p>

        <h2>4. Players and minors</h2>
        <p>Trial and academy enquiries concerning a person under 18 are processed only with the consent of a parent or guardian, who must be the party making contact. The club does not knowingly collect data from children without such consent.</p>

        <h2>5. Ownership register data</h2>
        <p>The names and share percentages reproduced on the licensing page are transcribed from a register published by FUFA under Article 13 of the FUFA Club Ownership and Registration Regulations 2025. They are republished here for transparency about club governance and are not collected by this site.</p>

        <h2>6. Retention</h2>
        <p>Enquiry correspondence is kept for as long as needed to deal with the enquiry and for one further season for continuity, then deleted. Partnership and contract records are kept for the period required by Ugandan law.</p>

        <h2>7. Your rights</h2>
        <p>Under the Act you may request access to, correction of, or deletion of personal data the club holds about you, and you may withdraw consent at any time. Write to ${esc(D.club.email)}. You may also complain to the Personal Data Protection Office at the National Information Technology Authority, Uganda.</p>

        <h2>8. International transfers</h2>
        <p>The site is hosted on infrastructure that may sit outside Uganda. No personal data is transferred by the site itself, because the site collects none. Correspondence you send by email travels through the providers you and the club use.</p>

        <h2>9. Changes</h2>
        <p>Material changes to this policy will be dated at the top of this page. Continued use of the site after a change constitutes acceptance.</p>
      </div>
    </section>`;
  },

  /* ---------------- TERMS ---------------- */
  terms(D) {
    return hero({
      kicker: 'Terms and conditions',
      title: 'Use of this website',
      lede: 'The agreement between you and CATDA Football Club governing use of this website, in plain language.',
      chips: [
        { text: 'Governing law: Uganda', type: 'chip--cyan' },
        { text: 'No warranties on fixture data' },
        { text: 'All content club-owned', type: 'chip--ink' }
      ]
    }) + `
    <section class="section">
      <div class="wrap legal">
        <p class="tiny">Effective ${fmtDate(D.meta.dataUpdated, true)}. Operated by CATDA Football Club, Kampala, Uganda.</p>

        <h2>1. Acceptance</h2>
        <p>By accessing this website you accept these terms. If you do not accept them, do not use the site. The club may update these terms at any time by publishing a revised version on this page with a new effective date.</p>

        <h2>2. Nature of the content</h2>
        <p>Fixtures, results, tables and squad information are compiled in good faith from FUFA publications, published match reports and club records, and are provided for information only. Football administration changes: fixtures move, results are corrected, sanctions adjust tables. The FUFA record prevails over this site in every case, and the club gives no warranty that any datum is complete or current at the moment you read it.</p>
        <p>Some photography on this site is illustrative composite imagery produced for the club. It does not depict actual matches, grounds or identifiable individuals and must not be represented as documentary photography.</p>

        <h2>3. Intellectual property</h2>
        <p>The CATDA FC name, crest, motto and all original text, design and code on this site are the property of CATDA Football Club, protected under the Copyright and Neighbouring Rights Act 2006. The crest as reproduced here follows the badge appearing in the FUFA ownership register. Third-party names and marks, including those of FUFA, StarTimes, Stanbic Bank and other competition partners, belong to their respective owners and are referenced factually only.</p>
        <p>You may quote short passages with attribution and a link. You may not reproduce the crest, the site design or substantial extracts without written permission from the club.</p>

        <h2>4. Acceptable use</h2>
        <p>You agree not to: attempt unauthorised access to any part of this site or its hosting; submit automated or bulk enquiries, including through the contact form; scrape the site at a rate that degrades it for others; misrepresent yourself as the club; or use the site to transmit unlawful, defamatory or infringing material. Misuse may engage the Computer Misuse Act 2011.</p>

        <h2>5. Third-party links</h2>
        <p>Links to FUFA, press outlets, social platforms and partners are provided for convenience. The club is not responsible for the content, availability or practices of external sites, including their handling of personal data.</p>

        <h2>6. Tickets and matchday</h2>
        <p>This site does not sell tickets. Entry arrangements for home fixtures are announced by the club per fixture. Any third party offering CATDA FC tickets is unauthorised.</p>

        <h2>7. Limitation of liability</h2>
        <p>To the maximum extent permitted by Ugandan law, the club is not liable for loss arising from use of, or inability to use, this site, or from reliance on its content, including travel made in reliance on a fixture listing that later changes.</p>

        <h2>8. Governing law</h2>
        <p>These terms are governed by the laws of the Republic of Uganda. Disputes are subject to the exclusive jurisdiction of the courts of Uganda, seated at Kampala.</p>

        <h2>9. Contact</h2>
        <p>Questions about these terms: ${esc(D.club.email)}. Security matters: see <a href="/.well-known/security.txt">security.txt</a>.</p>
      </div>
    </section>`;
  }
};

if (typeof window !== 'undefined') window.RENDERERS = RENDERERS;
