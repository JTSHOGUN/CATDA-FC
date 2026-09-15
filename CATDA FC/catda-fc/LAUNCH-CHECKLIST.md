# Launch checklist

The site is complete and QA-clean. It must not go live until every item in
Section 1 is done by a human with the right access. Nothing in Section 1 can
be done from inside this workspace: they are registrar, DNS and club-side acts.

## 1. Blocking gates (human, outside this workspace)

1. **Custom domain.** The club owns `catdafc.com` (listed on its official X and
   Facebook profiles; not resolving publicly at build time).
   - Deploy this folder to any static host (Netlify, Cloudflare Pages, GitHub
     Pages, cPanel). `netlify.toml`, `_headers`, `_redirects` and `.htaccess`
     are already in the folder and will be picked up automatically.
   - At the registrar: point the apex `catdafc.com` to the host (ALIAS/ANAME or
     the host's A records) and `www` to the host's CNAME target. Enable the
     host's TLS certificate for both names.
   - On the host, set `https://catdafc.com` as the primary domain and redirect
     `www` to apex (or the reverse, but pick one). Canonical tags, sitemap and
     JSON-LD in every page already use `https://catdafc.com`.
   - Until DNS is live, the staging preview host is for review only.
2. **Club sign-off on content.** One read-through by the club secretary:
   ownership table, honours, alumni, contact details, and the 2026/27 opening
   fixture once FUFA's released list is in the club's hands (enter it in
   `assets/data.json` under `nextFixture`).
3. **Replace illustrative imagery.** The six launch photographs are composite
   imagery produced for the club; captions and footer disclosure were removed on
   the owner's instruction (10 Sep 2026) and `terms.html` now carries the neutral
   composite-imagery clause. When licensed club photography exists, overwrite the
   files in `assets/img/` under the same filenames. The badge in
   `assets/img/logo.png` is the club's official artwork and must never be
   redrawn, recoloured or cropped.
4. **Squad list.** Enter the confirmed 2026/27 first team in
   `data.json > people.squad`; the page table is already structured for it.
5. **2026/27 licence certificate.** When FUFA's copy reaches the club, add it
   to the compliance page evidence ladder.
6. **Contact form backend (optional).** The form currently hands off to the
   user's mail client and stores nothing. If a server endpoint is preferred,
   wire it to Formspree, Basin or a serverless function and update the
   `form-action` value in the CSP inside `build.py`.

## 2. Done in this workspace (verified)

- 14 pages plus 404, all rendering clean under a 19-point jsdom harness.
- No cookies, no analytics, no third-party scripts. CSP pins the only inline
  scripts (JSON-LD) by SHA-256 hash; hash re-verified against `_headers`.
- HSTS, nosniff, referrer-policy, permissions-policy, CORP and cross-domain
  policy headers in `_headers` and `.htaccess`.
- `robots.txt`, `sitemap.xml`, `.well-known/security.txt` (RFC 9116).
- Privacy policy, terms and conditions, and a licensing/compliance page
  written for Ugandan law (Data Protection and Privacy Act 2019, Computer
  Misuse Act 2011, Copyright and Neighbouring Rights Act 2006).
- Self-hosted fonts (Archivo variable, Barlow Condensed 600/700, OFL). No CDN
  calls at runtime, so the site renders identically offline.
- Contact form hardened: client validation, length caps, hidden honeypot
  field that silently drops bot submissions, mailto handoff so no message is
  lost.
- Design constraints enforced by the QA harness: zero gradients, zero pill
  shapes, zero circular radii, zero emoji, zero entrance or scroll
  animation, no em dashes, no inline event handlers, no invented metrics or
  testimonials.

## 3. After launch (first 30 days)

- Submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools.
- Add real match photography per fixture; one report within 24 hours of each
  match day.
- Publish the Lufula songs collected from supporters (fans page has the slot).
- Build the partnership pack with real attendance and social reach figures.
