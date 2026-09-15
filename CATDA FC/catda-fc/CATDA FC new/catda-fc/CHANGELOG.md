# Changelog

Compiled record of every change to the CATDA FC website. The site itself is
generated: `python3 build.py` recompiles all pages and host configs from
`assets/data.json` and the templates in that script. Runtime content (fixtures,
tables, news, stat cards) is rendered in the browser from `assets/data.json`,
so content edits go live without a rebuild. Verify with `node tools/qa.js`.

## 2026-09-15: season sync, watcher and home page polish

### Fixtures and facts (source: FUFA, 15 September 2026)
- Kickoff of the 2026/27 FUFA Big League corrected site-wide from 20 September
  (the licensing timetable) to Sunday 27 September 2026, per the FUFA release
  of 15 September. First round runs to 20 December 2026.
- Fixture release date corrected from 24 August to 15 September 2026.
- Twelve first-round CATDA fixtures installed (MD1 to MD13 except MD7), parsed
  from the official fixture PDF with pypdf. The 2025/26 fixture-only list is
  preserved under `archive.results_2025_26`.
- Next fixture confirmed: Rwenzori Lions FC, Hamz Stadium-Nakivubo, 27 Sep,
  4:00 pm. News item published in club voice.
- MD7 deliberately not entered: the away column of that block is corrupted in
  the published PDF. Flagged for club confirmation; never guessed.
- Home ground for 2026/27 is Hamz Stadium-Nakivubo per every CATDA home row in
  the fixture PDF. Seven stale Bugolobi references corrected (home hero chip,
  fans chip and lede, fans card, club home panel, contact lines). Bugolobi
  retained as the 2025/26 home and in 2025/26 match narrative.
- League size set to 14, inferred from the 13 first-round match days; flagged
  in VERIFICATION-LOG.csv for re-check against the FUFA club list.

### Tooling
- `tools/fufa_watch.py`: watches the FUFA WordPress REST API every six hours,
  drafts proposals only (parsed scores carry source lines and verify notes),
  applies nothing without a human setting `approved: true` per item and
  running apply, which backs up `data.json` first.
- Proposal `20260915-fixtures` applied with owner approval in session.
- QA harness relocated into the project at `tools/qa.js` (jsdom): renders all
  14 pages, audits chrome, content rules, local refs, CSP hashes, stylesheet
  bans and lock-in checks. Survives session restarts, unlike the old /tmp copy.

### User interface
- Metric and result cards (home hero after "The Lufula Boys", matches hero):
  solid white plates, ink figures at 18.2:1, cyan left accent, border and
  shadow for separation on the hero photo. Hover lifts 2px with cyan border
  and deeper shadow; press scales to 98%; each click fires a 320ms cyan pulse
  ring. All motion disabled under prefers-reduced-motion. Final state is white
  by owner instruction; QA asserts white plates and ink figures so they cannot
  drift back to dark.

### Documentation
- `UPDATE-GUIDE.md`: matchday routine, rebuild-vs-no-rebuild matrix, watcher
  approval flow.
- README tree and VERIFICATION-LOG.csv updated with all of the above.

## 2026-09-10: revision 3, official badge and disclosure removal
- Club-supplied artwork processed without alteration (bars cropped, trimmed,
  outer white flood-filled to transparency, 900px palette PNG, 35KB) and
  installed as `assets/img/logo.png`: header brand, footer brand on a white
  plate, favicon, apple-touch icon, JSON-LD logo, Open Graph and Twitter cards.
  The revision-2 vector redraw `crest.svg` deleted.
- Club page badge panel presents the artwork at 340px so CATDA FOOTBALL CLUB,
  KICK WITH SKILLS and LUFULA all read clearly.
- Public AI-provenance removed on owner instruction: hero caption, figure
  captions, footer note and `images.note`. Terms carry one neutral clause
  (illustrative composite imagery, not documentary). The FUFA certificate
  citation on the compliance page remains as evidence attribution.

## Standing verification state
- 13 public pages plus custom 404; robots.txt, sitemap.xml, security.txt.
- Security headers shipped twice: `_headers` (Netlify, Cloudflare Pages) and
  `.htaccess` (Apache), including CSP with both inline JSON-LD hashes.
- No gradients, pills, emoji, em dashes or entrance animations anywhere.
- `node tools/qa.js` green on all pages at compile time, 2026-09-15.
