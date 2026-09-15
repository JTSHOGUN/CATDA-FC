#!/usr/bin/env python3
"""FUFA announcement watcher for the CATDA FC website.

Polls the FUFA WordPress REST API for new posts, keeps only those relevant to
CATDA FC or the FUFA Big League, and drafts PROPOSALS (never edits the site).
A human approves items inside a proposal by setting "approved": true, then
runs:  python3 tools/fufa_watch.py apply watcher/proposals/<id>.json

Nothing in this tool writes to assets/data.json except the apply command, and
apply only touches items a human has approved. Every apply takes a backup.

Usage:
  python3 tools/fufa_watch.py check [--posts-file F]   one poll (F = local JSON for tests)
  python3 tools/fufa_watch.py loop [--every SECONDS]   poll forever (default 6h)
  python3 tools/fufa_watch.py list                     list drafted proposals
  python3 tools/fufa_watch.py apply FILE               apply approved items of one proposal
"""
import json, os, re, sys, time, html, shutil, datetime, pathlib, urllib.request

SITE = pathlib.Path(__file__).resolve().parent.parent
DATA = SITE / 'assets' / 'data.json'
WATCH = pathlib.Path(os.environ.get('WATCHER_DIR', str(SITE.parent / 'watcher')))
STATE = WATCH / 'state.json'
PROPOSALS = WATCH / 'proposals'
BACKUPS = WATCH / 'backups'
LOG = WATCH / 'watch.log'
API = ('https://fufa.co.ug/wp-json/wp/v2/posts?per_page=30&orderby=date'
       '&order=desc&_fields=id,date,link,title,content')
UA = {'User-Agent': 'Mozilla/5.0 (compatible; catdafc-ops-watcher/1.0)'}
TOPICS = ('fixture', 'result', 'standing', 'table', 'kick', 'match day',
          'matchday', 'round', 'licen', 'ownership', 'cup')


def log(msg):
    WATCH.mkdir(parents=True, exist_ok=True)
    line = '%s  %s' % (datetime.datetime.now().isoformat(timespec='seconds'), msg)
    print(line, flush=True)
    with open(LOG, 'a', encoding='utf-8') as f:
        f.write(line + '\n')


def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=45) as r:
        return r.read().decode('utf-8', 'replace')


def lines_of(raw):
    raw = re.sub(r'(?i)<(br|/p|/li|/tr|/h[1-6]|/div)>', '\n', raw)
    raw = re.sub(r'(?s)<[^>]+>', ' ', raw)
    raw = html.unescape(raw)
    return [re.sub(r'\s+', ' ', l).strip() for l in raw.splitlines() if l.strip()]


def attachments(raw):
    out = []
    for href, text in re.findall(r'(?i)<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', raw, re.S):
        text = re.sub(r'(?s)<[^>]+>', '', text).strip()
        if href.lower().endswith('.pdf') or 'download' in text.lower():
            out.append({'href': href, 'label': text})
    return out


def relevant(title, lines):
    hay = (title + ' ' + ' '.join(lines)).lower()
    if 'catda' in hay:
        return True
    return 'big league' in hay and any(t in hay for t in TOPICS)


def score_lines(lines):
    out = []
    pat = re.compile(r'^(.+?)\s+(\d{1,2})\s*[-\u2013]\s*(\d{1,2})\s+(.+?)$')
    for l in lines:
        if 'catda' not in l.lower():
            continue
        m = pat.match(l)
        if not m:
            continue
        home, hs, aos, away = m.group(1), int(m.group(2)), int(m.group(3)), m.group(4)
        us_home = 'catda' in home.lower()
        out.append({'home': home.strip(), 'away': away.strip(), 'hs': hs, 'as': aos,
                    'us_home': us_home, 'line': l})
    return out


def make_proposal(post, lines, raw):
    today = datetime.date.today().isoformat()
    pid = '%s-%s' % (today.replace('-', ''), post['id'])
    title = html.unescape(re.sub(r'(?s)<[^>]+>', '', post['title']['rendered'])).strip()
    items = []
    for c in score_lines(lines):
        items.append({'kind': 'result', 'approved': False, 'confidence': 'medium',
                      'match': c, 'quotes': [c['line']],
                      'note': 'Score parsed from article text. Verify against the '
                              'official match report before approving.'})
    atts = attachments(raw)
    if atts and any('fixture' in (a['label'] + a['href']).lower() for a in atts):
        items.append({'kind': 'manual', 'approved': False,
                      'instruction': 'Open the attached official fixture PDF, extract '
                                     'every CATDA row and enter them as the season '
                                     'results list (status unrecorded) plus nextFixture.',
                      'attachments': atts})
    hay = ' '.join(lines).lower()
    if 'standing' in hay or 'table' in hay or 'log table' in hay:
        items.append({'kind': 'manual', 'approved': False,
                      'instruction': 'Update standings.rows from the published table in '
                                     'this article. Copy the published figures; never '
                                     'recalculate other clubs\' rows.',
                      'quotes': [l for l in lines if 'catda' in l.lower()][:6]})
    body = ' '.join(lines[1:4])[:400]
    items.append({'kind': 'news_draft', 'approved': False,
                  'entry': {'date': post['date'][:10], 'tag': 'FUFA announcement',
                            'title': title, 'body': body, 'status': 'draft',
                            'source': post['link']},
                  'note': 'Draft only. Edit title/body to club voice before approving.'})
    prop = {'id': pid, 'created': today,
            'source': {'id': post['id'], 'url': post['link'], 'title': title,
                       'date': post['date'][:10]},
            'items': items}
    PROPOSALS.mkdir(parents=True, exist_ok=True)
    with open(PROPOSALS / (pid + '.json'), 'w', encoding='utf-8') as f:
        json.dump(prop, f, ensure_ascii=False, indent=2)
    with open(PROPOSALS / (pid + '.md'), 'w', encoding='utf-8') as f:
        f.write('# Proposal %s\n\nSource: [%s](%s), %s\n\n' %
                (pid, title, post['link'], post['date'][:10]))
        for i, it in enumerate(items):
            f.write('## Item %d, kind %s, approved %s\n\n' %
                    (i, it['kind'], it.get('approved', False)))
            f.write('```json\n%s\n```\n\n' % json.dumps(it, ensure_ascii=False, indent=2))
    log('drafted proposal %s from %s (%d items)' % (pid, post['link'], len(items)))
    return pid


def check(posts_file=None):
    posts = json.load(open(posts_file, encoding='utf-8')) if posts_file \
        else json.loads(get(API))
    WATCH.mkdir(parents=True, exist_ok=True)
    state = json.load(open(STATE, encoding='utf-8')) if STATE.exists() else {'seen': {}}
    new = 0
    for p in posts:
        sid = str(p['id'])
        if sid in state['seen']:
            continue
        raw = p.get('content', {}).get('rendered', '')
        lines = lines_of(raw)
        title = html.unescape(re.sub(r'(?s)<[^>]+>', '', p['title']['rendered'])).strip()
        state['seen'][sid] = {'title': title, 'date': p['date'][:10]}
        if relevant(title, lines):
            make_proposal(p, lines, raw)
            new += 1
    with open(STATE, 'w', encoding='utf-8') as f:
        json.dump(state, f, ensure_ascii=False, indent=2)
    log('check done: %d posts scanned, %d proposals drafted' % (len(posts), new))
    return new


def apply(path):
    prop = json.load(open(path, encoding='utf-8'))
    data = json.load(open(DATA, encoding='utf-8'))
    BACKUPS.mkdir(parents=True, exist_ok=True)
    ts = datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
    shutil.copy2(DATA, BACKUPS / ('data-%s.json' % ts))
    changed = []
    for idx, it in enumerate(prop['items']):
        if not it.get('approved'):
            continue
        if it['kind'] == 'result':
            m = it['match']
            opp = (m['away'] if m['us_home'] else m['home']).lower()
            target = None
            for r in data['results']:
                if r.get('status') != 'unrecorded':
                    continue
                sides = [r['home'].lower(), r['away'].lower()]
                if any(opp in s or s in opp for s in sides):
                    target = r
                    break
            if target is None:
                log('item %d: no matching unrecorded fixture for %s; left manual' % (idx, opp))
                continue
            target['hs'], target['as'] = m['hs'], m['as']
            us = m['hs'] if m['us_home'] else m['as']
            them = m['as'] if m['us_home'] else m['hs']
            target['status'] = 'win' if us > them else 'loss' if us < them else 'draw'
            target['note'] = 'Source: %s' % prop['source']['url']
            changed.append('result %s %d-%d %s' % (target['away'] if m['us_home']
                           else target['home'], m['hs'], m['as'], target['status']))
        elif it['kind'] == 'news_draft':
            data['news'].insert(0, it['entry'])
            changed.append('news: %s' % it['entry']['title'])
        elif it['kind'] == 'fixtures':
            season = data.get('standings', {}).get('season', 'prior')
            data.setdefault('archive', {})['results_' + season.replace('/', '_')] = data['results']
            data['results'] = it['entries']
            changed.append('fixtures: %d entries installed, %s list archived' %
                           (len(it['entries']), season))
        elif it['kind'] == 'nextFixture':
            data['nextFixture'].update(it['fields'])
            changed.append('nextFixture: %s' % ', '.join(sorted(it['fields'])))
        elif it['kind'] == 'manual':
            log('item %d manual instruction: %s' % (idx, it['instruction']))
            changed.append('manual reminder printed')
    if changed:
        with open(DATA, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        json.load(open(DATA, encoding='utf-8'))  # validate
        log('applied %s: %s (backup data-%s.json)' % (path, '; '.join(changed), ts))
    else:
        log('apply %s: no approved items, data.json untouched' % path)
    return changed


def main(argv):
    cmd = argv[1] if len(argv) > 1 else 'check'
    if cmd == 'check':
        pf = argv[argv.index('--posts-file') + 1] if '--posts-file' in argv else None
        check(pf)
    elif cmd == 'loop':
        every = int(argv[argv.index('--every') + 1]) if '--every' in argv else 21600
        log('watcher loop started, interval %ds' % every)
        while True:
            try:
                check()
            except Exception as e:  # keep watching; network blips are normal
                log('check failed: %r' % e)
            time.sleep(every)
    elif cmd == 'list':
        for f in sorted(PROPOSALS.glob('*.json')):
            p = json.load(open(f, encoding='utf-8'))
            appr = sum(1 for i in p['items'] if i.get('approved'))
            print('%s  items=%d approved=%d  %s' % (p['id'], len(p['items']),
                  appr, p['source']['title'][:60]))
    elif cmd == 'apply':
        apply(argv[2])
    else:
        print(__doc__)


if __name__ == '__main__':
    main(sys.argv)
