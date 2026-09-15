# CATDA FC  ·  Structural analysis and website design, revision 2

**Prepared:** 10 September 2026
**Supersedes:** revision 1 of this document
**Scope:** fact validation, brand system, information architecture, league ribbon and governance evidence, security and legal layers, deployment gates

---

## 0. What changed in revision 2

Revision 1 shipped a site with several facts flagged as unconfirmed. Revision 2
closed most of them with primary sources, rebuilt the visual system around the
club's real crest, added the league ribbon, sponsor and governance evidence the
club asked for, added the three legal pages and the security layer, and removed
every pattern on the client's anti-slop list.

Four findings drove the rebuild.

**1. The club's official crest exists in a public document.** The FUFA 2nd
Division Club Ownership register for 2025/26 publishes a certificate per club.
CATDA's shows the real badge: a cyan starburst ring, a cow head and ball over
red rays, the motto *Kick With Skills*, and *Lufula* beneath. The site now uses
a faithful vector redraw of that badge (`assets/crest.svg`), and the brand
palette is sampled pixel-by-pixel from it: cyan `#1C9FCD`, red `#CE2C33`, ink
`#17141A`. The invented crest and proposed palette of revision 1 are gone.

**2. The acronym question is closed.** The same register lists the subscriber
*City Abattiour Traders Development Association* at 35%, FUFA's spelling of
Abattoir. The FUFA register is treated as authoritative. The club is not a
no-owner collective: it is 35% association and 65% six named natural persons,
all published by FUFA. The community page now states the legal structure
exactly rather than romanticising it.

**3. Licensing is documented, not asserted.** FUFA's decision of 23 August
2025 names CATDA FC among the 14 clubs granted a FUFA Big League licence for
2025/26. The same decision records that Bugolobi Coffee Grounds was not
approved at first inspection and went to a second inspection, which the site
reports as evidence of a working licensing system. For 2026/27 the site states
the published FUFA cycle (licences issued 24 August 2026) and does not claim a
certificate the club has not yet published.

**4. There is no Higgsfield MCP in this session.** The request could not be
met as specified. Imagery was produced with the workspace's built-in image
generator instead, is disclosed as AI-generated in every caption and in the
footer, and is scheduled for replacement with licensed club photography in
`LAUNCH-CHECKLIST.md`.

---

## 1. Fact status after revision 2

| Item | Status | Source |
|---|---|---|
| Nickname, location, abattoir identity | Confirmed | Club channels; FUFA register |
| Official expansion of CATDA | Confirmed | FUFA ownership register 2025/26 |
| Ownership structure | Confirmed | Same |
| Crest and motto | Confirmed | Same, certificate image |
| Brand colours | Confirmed | Sampled from the crest in that certificate |
| FUFA Big League licence 2025/26 | Confirmed | FUFA decision, 23 Aug 2025 |
| Stadium classification of home ground | Confirmed | Same decision, second inspection |
| 2025/26 league position and table | Confirmed | Final table, ugandafootball.com |
| 2026/27 season dates and licensing cycle | Confirmed | FUFA core process, 22 Jun 2026 |
| League naming and broadcast partner | Confirmed | FUFA, Aug 2018: StarTimes, UPL and Big League |
| Cup title sponsor | Confirmed | Stanbic Uganda Cup branding |
| Federation partner band | Confirmed as federation-level | Partner band on fufa.co.ug |
| Club-level commercial partners | None publicly announced | No source; site says the inventory is open |
| Kit colours | Still unconfirmed | Site claims crest colours only |
| 2026/27 opening fixture | Awaiting club confirmation | Shown TBC, never guessed |
| 2026/27 licence certificate | Awaiting club copy | Evidence ladder states the cycle |
| Kumi United cup result, MD1 and MD29 scores | Not sourced | Shown TBC |
| Soltilo Bright Stars MD16 | Contradictory reports | Carried with a review note |

The full machine-readable register is `VERIFICATION-LOG.csv`, 54 rows.

---

## 2. Brand system v2

**Source of truth:** the club's own crest, not a proposal. Palette sampled from
the FUFA certificate. Type: Archivo variable for text and UI, Barlow Condensed
for display, both self-hosted as woff2 (OFL licences, roughly 80 KB total). No
CDN requests at runtime, so the site is identical offline, on a Kampala phone
over 3G, and inside sandboxed previews.

**Light theme.** White and warm paper surfaces, ink text, cyan for structure
and links, red reserved for scores, form losses and primary calls to action.
A light theme reads as a club institution rather than a startup, matches the
reference site's register, and gives the crest its natural white ground.

**Contrast is arithmetic, not taste.** Every text token was checked against its
background: ink on white 18.2:1, body grey 9.3:1, muted 5.6:1, cyan text token
`#0B7BA3` 4.8:1, red `#CE2C33` 5.2:1, and on the dark footer paper 17.3:1,
light cyan 9.2:1. The raw crest cyan is used only for graphics and large
elements where 3:1 applies.

**Anti-slop rules, enforced by the QA harness, not by intention:**
zero linear, radial or conic gradients anywhere; zero pill shapes and zero
circular radii, including status dots and timeline nodes, which are squared at
1px; zero emoji; zero entrance or scroll animation, with motion limited to
160ms colour transitions on hover and focus; no em dashes in any string on the
site; no invented metrics, no testimonials, no lorem; every image carries a
visible provenance caption.

**Reference emulation.** The client asked to reverse-engineer Arsenal.com.
What was taken is structural, not cosmetic: a persistent utility bar above the
main nav; a scoreboard strip (next fixture, last result, table position) that
sits above every page; a top-stories grid led by one large card; content-type
sections stacked by audience; a partner and governance band; and a wide footer
carrying the legal pages. Nothing was copied from Arsenal's content, marks or
code.

---

## 3. Information architecture v2

Fourteen templates. The nine club pages keep their revision 1 roles, tightened;
three legal pages and a compliance page join them.

```
index        hero, top stories, cup quote, table snapshot, pillars, CTA
club         identity, registered name, ownership table, timeline, facts
honours      honour roll, records grid, near misses, divisional record
matches      next fixture, results on record, final table, matchday info
squad        empty-state roster, verified names, alumni, trials
cup          Mutebi quote as hero asset, ties on record, record v top flight
community    ownership model, needs, governance, export proof
fans         matchday, song collection slot, channels, away days
news         club posts, sourced press list, media contacts
contact      hardened form, direct lines, partnership, trials
compliance   licensing evidence, ownership register, governing bodies,
             regulatory framework, site security summary
privacy      no-cookie policy, DPPA 2019 rights, retention, minors
terms        content nature, IP, acceptable use, liability, Ugandan law
404          static, chrome still mounts
```

**Navigation.** Nine items in the main nav, because a tenth forces wrapping on
laptop widths and a club site that wraps its nav looks broken. The three legal
pages live in the utility bar and the footer, which is where reference sites
put them and where regulators expect them.

**The league ribbon** is a permanent two-row band under the nav, present on
every page, as the client specified:

- Row one: competition name, tier, club count, national footprint, season
  kickoff, naming and broadcast partner, the governance chain
  FIFA > CAF > FUFA > Kampala Regional FA as live links, and a jump to the
  licensing page.
- Row two: the federation and competition partner band, explicitly labelled as
  federation-level so no reader infers a club sponsorship that does not exist.

**Sponsors, honestly partitioned.** Three buckets, never blended: league naming
and broadcast (StarTimes, sourced), federation and competition partners (the
seven names in FUFA's own partner band, sourced, labelled as federation-level),
and club partners (empty, stated as empty, positioned as an opportunity). A
sponsor wall of invented logos would have satisfied the letter of the request
and destroyed the site's credibility with every Ugandan reader who knows better.

---

## 4. Security and legal layer

**Headers**, in `_headers` for Netlify and mirrored in `.htaccess` for Apache:
Content-Security-Policy, HSTS, X-Content-Type-Options nosniff, Referrer-Policy
strict-origin-when-cross-origin, Permissions-Policy denying camera, mic,
geolocation, payment and usb, Cross-Origin-Resource-Policy same-origin,
X-Permitted-Cross-Domain-Policies none.

**CSP detail.** `script-src` is `'self'` plus SHA-256 hashes of exactly two
inline scripts, the JSON-LD blocks, recomputed by `build.py` on every build and
re-verified against the generated HTML by the QA harness. There is no
`unsafe-inline` for scripts anywhere. `style-src` allows inline declarations
because the templates emit style attributes; `frame-ancestors` permits the
production domain and the preview host so the live preview keeps working
without weakening production.

**Forms.** Client-side validation with length caps, a hidden honeypot field
that silently discards bot posts, and a mailto handoff so a message can never
be lost to a missing backend. The privacy policy says exactly this.

**Privacy posture as a feature.** No cookies, no analytics, no third-party
scripts, fonts or embeds. The policy is written against the Data Protection and
Privacy Act 2019 of Uganda, names the Personal Data Protection Office at
NITA-U as the complaint route, covers minors in trial enquiries, and explains
that the ownership data on the compliance page is republished from a FUFA
register rather than collected.

**Disclosure.** `.well-known/security.txt` per RFC 9116, linked from the footer.

**Ops files.** `robots.txt`, `sitemap.xml` for all thirteen indexable pages,
`_redirects` and `netlify.toml` with the build command wired to `build.py`.

---

## 5. Imagery policy

Six AI-generated photographs carry the launch build: matchday hero, a highland
away day, the touchline crowd, a market-district heritage plate, pathway
training, and the promotion night in rain. Each is captioned *Illustrative
image, AI-generated* and the footer repeats the policy. This is a disclosure
commitment, not a disclaimer buried in terms: a club site that passes synthetic
crowds for its own supporters would be lying to the community it represents.
`LAUNCH-CHECKLIST.md` gates launch on replacing them with licensed club
photography at the same filenames, so the swap is a copy operation.

---

## 6. Deployment and launch gates

Everything inside this workspace is done and verified: 14 pages plus 404 pass a
19-point jsdom harness per page; CSP hashes verified; hygiene rules verified;
links, image paths and alt text verified.

Everything outside it is in `LAUNCH-CHECKLIST.md` section 1 and cannot be
performed from here: DNS and TLS for `catdafc.com`, club sign-off on the squad
list and opening fixture, photography replacement, and the 2026/27 licence
certificate. The client's rule stands: **no launch until the domain is
connected.** The staging preview is for review only.

---

## 7. Primary sources added in revision 2

- FUFA, Club Licensing Committee confirms FUFA Big League clubs for 2025/26, 23 Aug 2025
- FUFA, FUFA Big League club ownership 2025/26 season, 11 May 2026, including the CATDA certificate image archived at `assets/img/source/fufa-catda-ownership.jpeg`
- FUFA, Club licensing core process for the 2026/27 FWSL, FBL and FWEL seasons, 22 Jun 2026
- FUFA, StarTimes take over naming and broadcasting rights of the Uganda Premier League, 9 Aug 2018
- FUFA, Club licensing decisions for UPL clubs for 2026/27, 23 Jul 2026, for cycle context
- Partner band and competition branding as displayed on fufa.co.ug

Revision 1 sources (Kawowo Sports, MTN Sports, goal.com, Africa Top Sports,
Swift Sports Uganda, ugandafootball.com, club channels) remain in force for all
match facts and are itemised in `VERIFICATION-LOG.csv`.

## Revision 3, 10 September 2026: official badge and disclosure removal

The club supplied its official badge artwork (`uploads/catda logo.jpeg`,
1290x1188). It was processed without altering the artwork: scan bars cropped,
trimmed with a 12px pad, outer white flood-filled to transparency, downscaled to
900x900 and saved as `assets/img/logo.png` (35KB palette PNG). It replaces the
revision-2 vector redraw (`crest.svg`, deleted) everywhere: header brand, footer
brand on a white plate, favicon, apple-touch icon, JSON-LD `logo`, and the
Open Graph and Twitter cards. The club page presents the badge at 340px so the
arc text, ribbon motto and "LUFULA" all read clearly; elsewhere the badge is
shown at sizes appropriate to its role with the wordmark carrying the name.

Public AI-provenance labelling (hero caption, figure captions, footer note and
the `images.note` field) was removed on the owner's instruction. `terms.html`
retains one neutral clause: some photography is illustrative composite imagery
produced for the club and does not depict actual matches, grounds or
identifiable individuals. The single remaining caption on the site is the
source citation under the FUFA ownership certificate on the compliance page,
which is evidence attribution, not an AI tag. Provenance of the launch imagery
is retained here and in `VERIFICATION-LOG.csv` as an internal record only.
