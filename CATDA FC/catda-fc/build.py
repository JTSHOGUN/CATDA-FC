#!/usr/bin/env python3
"""
CATDA FC static site generator.

Produces every HTML page from one template (head, meta, JSON-LD, noscript
fallback), plus the deployment and security files:

    robots.txt  sitemap.xml  _headers  _redirects  netlify.toml
    .htaccess   .well-known/security.txt

Never hand-edit a generated .html file. Edit this script or assets/data.json
and re-run:

    python3 build.py
"""

import base64
import hashlib
import json
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ORIGIN = "https://catdafc.com"

PAGES = {
    "index.html": (
        "CATDA FC | The Lufula Boys | FUFA Big League, Kampala",
        "Official site of CATDA Football Club, the Lufula Boys of Kampala. Kampala region champions 2024/25, "
        "FUFA licensed for the Big League, Uganda's national second tier. Fixtures, results, table, honours, "
        "squad, Uganda Cup history, ownership and community.",
    ),
    "club.html": (
        "Club | CATDA FC | From the abattoir to the national pyramid",
        "The story, ownership and identity of CATDA FC: a community-owned club from the Lufula abattoir area on "
        "Old Port Bell Road, Kampala. Timeline, FUFA ownership register, grounds, brand colours and channels.",
    ),
    "honours.html": (
        "Honours and records | CATDA FC",
        "CATDA FC honours: Nakawa District champions 2017/18, Kampala region champions 2024/25, play-off finals "
        "2019/20 and 2023/24, and the club's FUFA Big League record.",
    ),
    "matches.html": (
        "Fixtures, results and table | CATDA FC",
        "CATDA FC match centre: 2026/27 FUFA Big League fixtures, 2025/26 results on record, the final 16-club "
        "table, and matchday information for Bugolobi Coffee Grounds.",
    ),
    "squad.html": (
        "First team, staff and alumni | CATDA FC",
        "CATDA FC players and technical staff, trials and scouting, and the alumni list including exports to the "
        "Uganda Premier League.",
    ),
    "cup.html": (
        "Stanbic Uganda Cup | Giant killers | CATDA FC",
        "CATDA FC's Uganda Cup record, including the tie that made KCCA's Mike Mutebi call a third-tier CATDA "
        "the best side they had faced all season, and the 2025 round of 32 against holders Kitara FC.",
    ),
    "community.html": (
        "Community and development | CATDA FC",
        "How a traders' association and six community shareholders run a national football club: funding, youth "
        "pathway, FUFA governance, facilities and what the club needs next.",
    ),
    "fans.html": (
        "The Lufula | Fan zone | CATDA FC",
        "Matchday at Bugolobi Coffee Grounds: the Lufula Boys' supporters, away days across the FUFA Big League "
        "and the club's social channels.",
    ),
    "news.html": (
        "News and media centre | CATDA FC",
        "Club announcements, match reports and the national press coverage of CATDA FC's rise from the Nakawa "
        "District League to the FUFA Big League.",
    ),
    "contact.html": (
        "Contact | CATDA FC",
        "Contact CATDA Football Club, Kampala: sponsorship and partnership, player trials, media enquiries, "
        "fixtures and general messages.",
    ),
    "compliance.html": (
        "Licensing and governance | CATDA FC",
        "Public evidence of CATDA FC's FUFA club licensing and registration: the 2025/26 licensing decision, the "
        "Article 13 ownership register, governing bodies, regulatory framework and site security.",
    ),
    "privacy.html": (
        "Privacy policy | CATDA FC",
        "How CATDA FC handles personal data. No cookies, no analytics, no third-party scripts. Your rights under "
        "the Data Protection and Privacy Act 2019 of Uganda.",
    ),
    "terms.html": (
        "Terms and conditions | CATDA FC",
        "The terms governing use of the CATDA FC website: content nature, intellectual property, acceptable use, "
        "liability and governing law.",
    ),
}

LD = json.dumps({
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    "name": "CATDA Football Club",
    "alternateName": ["CATDA FC", "The Lufula Boys", "Lufala Boys"],
    "slogan": "Kick With Skills",
    "sport": "Association football",
    "url": ORIGIN + "/",
    "logo": ORIGIN + "/assets/img/logo.png",
    "image": ORIGIN + "/assets/img/hero-matchday.jpg",
    "email": "catdaclub@gmail.com",
    "telephone": "+256758727647",
    "foundingLocation": {
        "@type": "Place",
        "name": "Lufula, Industrial Area, Old Port Bell Road",
        "address": {"@type": "PostalAddress", "addressLocality": "Kampala", "addressCountry": "UG"},
    },
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kampala",
        "addressRegion": "Central Region",
        "addressCountry": "UG",
    },
    "memberOf": {"@type": "SportsOrganization", "name": "Federation of Uganda Football Associations"},
    "parentOrganization": {"@type": "SportsOrganization", "name": "Kampala Regional Football Association"},
    "homeLocation": {
        "@type": "StadiumOrArena",
        "name": "Bugolobi Coffee Grounds",
        "address": {"@type": "PostalAddress", "addressLocality": "Bugolobi, Kampala", "addressCountry": "UG"},
    },
    "athlete": [
        {"@type": "Person", "name": "Michael Abura"},
        {"@type": "Person", "name": "Hudson Mbalire"},
        {"@type": "Person", "name": "Sharif Ssengendo"},
    ],
    "coach": {"@type": "Person", "name": "Michael Bukenya"},
    "award": [
        "Kampala Regional League champions 2024/25",
        "Nakawa District League champions 2017/18",
    ],
}, indent=2, ensure_ascii=False)


def sha256_b64(text: str) -> str:
    return base64.b64encode(hashlib.sha256(text.encode("utf-8")).digest()).decode("ascii")


TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#17141A">
<meta name="author" content="CATDA Football Club">
<link rel="canonical" href="{origin}/{fname}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="CATDA FC">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{origin}/{fname}">
<meta property="og:image" content="{origin}/assets/img/logo.png">
<meta property="og:locale" content="en_UG">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@FcCatda">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{origin}/assets/img/logo.png">

<link rel="icon" type="image/png" href="assets/img/logo.png">
<link rel="apple-touch-icon" href="assets/img/logo.png">
<link rel="stylesheet" href="assets/styles.css">

<script type="application/ld+json">
{ld}
</script>
</head>
<body>
<a class="skip" href="#page">Skip to content</a>
<main id="page"></main>

<noscript>
  <div class="wrap section">
    <div class="kicker">CATDA Football Club, Kampala, Uganda</div>
    <h1>The Lufula Boys</h1>
    <p class="lede mt2">CATDA FC are a community-owned football club from the Lufula abattoir area on Old Port Bell
    Road, Kampala. Nakawa District champions 2017/18. Kampala region champions 2024/25. Licensed by FUFA for the
    FUFA Big League, Uganda's national second tier, where they finished 10th of 16 in their debut 2025/26 season
    with 37 points. The 2026/27 season kicks off on 20 September 2026.</p>
    <p class="small mt2">Fixtures, tables and squad data on this site need JavaScript. Every page is linked below
    and the club can be contacted directly.</p>
    <ul class="small mt2" style="line-height:2.1">
      <li><a href="index.html">Home</a></li>
      <li><a href="club.html">Club</a></li>
      <li><a href="honours.html">Honours</a></li>
      <li><a href="matches.html">Matches</a></li>
      <li><a href="squad.html">Squad</a></li>
      <li><a href="cup.html">Uganda Cup</a></li>
      <li><a href="community.html">Community</a></li>
      <li><a href="fans.html">Lufula fan zone</a></li>
      <li><a href="news.html">News</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><a href="compliance.html">Licensing and governance</a></li>
      <li><a href="privacy.html">Privacy policy</a></li>
      <li><a href="terms.html">Terms and conditions</a></li>
    </ul>
    <p class="small mt2">Email catdaclub@gmail.com. Phone +256 758 727 647. Home ground: Bugolobi Coffee Grounds, Kampala.</p>
  </div>
</noscript>

<script src="assets/app.js"></script>
<script src="assets/renderers.js"></script>
</body>
</html>
"""


def write(path: str, content: str) -> None:
    full = os.path.join(HERE, path)
    os.makedirs(os.path.dirname(full) or HERE, exist_ok=True)
    with open(full, "w", encoding="utf-8") as fh:
        fh.write(content)
    print(f"  wrote {path:32s} {os.path.getsize(full):>8,} bytes")


def main() -> None:
    print("Building CATDA FC site")
    for fname, (title, desc) in PAGES.items():
        html = TEMPLATE.format(title=title, desc=desc, fname=fname, origin=ORIGIN, ld=LD)
        write(fname, html)

    write("404.html", TEMPLATE.format(
        title="Page not found | CATDA FC",
        desc="That page does not exist. Return to the CATDA FC home page.",
        fname="404.html", origin=ORIGIN, ld="{}"
    ).replace(
        '<main id="page"></main>',
        '<main id="page" data-static><section class="section"><div class="wrap center">'
        '<div class="kicker" style="justify-content:center">Error 404</div>'
        '<h1 style="font-size:clamp(3rem,12vw,8rem)">Offside</h1>'
        '<p class="lede mt2" style="margin-inline:auto">That page does not exist. The referee has waved play on.</p>'
        '<div class="mt3"><a class="btn btn--red" href="index.html">Back to the home page</a></div>'
        '</div></section></main>',
    ))

    # robots and sitemap
    urls = [p for p in PAGES]
    write("robots.txt", "User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n" % ORIGIN)
    write("sitemap.xml",
          '<?xml version="1.0" encoding="UTF-8"?>\n'
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
          + "".join(
              f'  <url><loc>{ORIGIN}/{u}</loc><changefreq>{"daily" if u == "index.html" else "weekly"}</changefreq></url>\n'
              for u in urls)
          + "</urlset>\n")

    # Content Security Policy. Inline scripts are only the JSON-LD blocks,
    # pinned by hash. No unsafe-inline for scripts anywhere.
    hash_main = sha256_b64("\n" + LD + "\n")
    hash_404 = sha256_b64("\n{}\n")
    csp = (
        "default-src 'self'; "
        f"script-src 'self' 'sha256-{hash_main}' 'sha256-{hash_404}'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data:; "
        "font-src 'self'; "
        "connect-src 'self'; "
        "form-action 'self' mailto:; "
        "base-uri 'self'; "
        "object-src 'none'; "
        "frame-ancestors https://*.e2b.app https://catdafc.com https://www.catdafc.com"
    )
    write("_headers", f"""/*
  Content-Security-Policy: {csp}
  Strict-Transport-Security: max-age=63072000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Cross-Origin-Resource-Policy: same-origin
  X-Permitted-Cross-Domain-Policies: none

/assets/data.json
  Cache-Control: no-cache

/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/assets/img/*
  Cache-Control: public, max-age=86400

/assets/*.css
  Cache-Control: public, max-age=604800

/assets/*.js
  Cache-Control: public, max-age=604800
""")

    write("_redirects", "/404 /404.html 404\n/* /404.html 404\n")

    write("netlify.toml", """[build]
  publish = "."
  command = "python3 build.py"

[build.environment]
  PYTHON_VERSION = "3.11"
""")

    htaccess = (
        '<IfModule mod_headers.c>\n'
        f'  Header set Content-Security-Policy "{csp}"\n'
        '  Header set Strict-Transport-Security "max-age=63072000; includeSubDomains"\n'
        '  Header set X-Content-Type-Options "nosniff"\n'
        '  Header set Referrer-Policy "strict-origin-when-cross-origin"\n'
        '  Header set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()"\n'
        '  Header set Cross-Origin-Resource-Policy "same-origin"\n'
        '  Header set X-Permitted-Cross-Domain-Policies "none"\n'
        '</IfModule>\n\n'
        '<IfModule mod_rewrite.c>\n'
        '  RewriteEngine On\n'
        '  RewriteBase /\n'
        '  RewriteCond %{REQUEST_FILENAME} !-f\n'
        '  RewriteCond %{REQUEST_FILENAME} !-d\n'
        '  RewriteRule . /404.html [L]\n'
        '</IfModule>\n\n'
        'ErrorDocument 404 /404.html\n'
    )
    write(".htaccess", htaccess)

    write(".well-known/security.txt", f"""Contact: mailto:catdaclub@gmail.com
Expires: 2027-09-10T00:00:00.000Z
Preferred-Languages: en
Canonical: {ORIGIN}/.well-known/security.txt
Policy: Responsible disclosure is welcomed. Please allow 30 days for remediation before public disclosure.
""")

    print("Done.")


if __name__ == "__main__":
    main()
