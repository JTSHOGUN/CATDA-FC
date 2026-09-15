
## The watcher: drafts, never publishes

`tools/fufa_watch.py` polls the FUFA WordPress REST API every six hours while it
is running. New posts that mention CATDA or the Big League become proposal
files under `watcher/proposals/` (outside the published folder), each with
typed items: parsed scores, fixture lists, next-fixture updates, news drafts
and manual reminders. Nothing touches the site until a human opens the
proposal, sets `"approved": true` on the items they accept, and runs:

    python3 tools/fufa_watch.py apply watcher/proposals/<id>.json

Apply backs up `assets/data.json` first and validates the result. Parsed scores
always carry the source line and a verify-before-approving note, because
article prose can misprint a score. The watcher loop is started with:

    python3 tools/fufa_watch.py loop --every 21600

On a hosted setup the loop can run on any small machine or cron job
(`check` is the one-shot variant); the site itself stays fully static.

## The watcher: drafts, never publishes

`tools/fufa_watch.py` polls the FUFA WordPress REST API every six hours while it
is running. New posts that mention CATDA or the Big League become proposal
files under `watcher/proposals/` (outside the published folder), each with
typed items: parsed scores, fixture lists, next-fixture updates, news drafts
and manual reminders. Nothing touches the site until a human opens the
proposal, sets `"approved": true` on the items they accept, and runs:

    python3 tools/fufa_watch.py apply watcher/proposals/<id>.json

Apply backs up `assets/data.json` first and validates the result. Parsed scores
always carry the source line and a verify-before-approving note, because
article prose can misprint a score. The watcher loop is started with:

    python3 tools/fufa_watch.py loop --every 21600

On a hosted setup the loop can run on any small machine or cron job
(`check` is the one-shot variant); the site itself stays fully static.
