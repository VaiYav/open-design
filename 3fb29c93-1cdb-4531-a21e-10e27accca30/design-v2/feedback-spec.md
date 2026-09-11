# FLOW-8555 Message Feedback — v2 handoff

Scope: quality feedback on delivered messages + production analytics for admins.
Feature, not redesign — everything reuses the Flow v2 shell, tokens, and `data-view` state engine.

## Surfaces

| Surface | File | What was added |
|---|---|---|
| Shared component | `assets/feedback.js` + `fb-*` CSS in `assets/tokens-v2.css` | `window.FlowFB`: render + hydrate + state machine |
| Chats | `chats.html` | Control under each outgoing bubble (`fb` field on `Fixtures.MESSAGES`) |
| Mails | `mails.html` | Same control under sent mail cards |
| Omniscience | `omniscience.html` | Control under completed Beloved answers only |
| Tools → Autoreplies | `tools-autoreplies.html` | Control under each generated variant (`data-fb-slot`, AI mode) |
| Tools → Presets | `tools-presets.html` | Control on AI-imported presets only (badge marks them) |
| Campaigns → Suggested moods | `campaigns-templates.html` | Per-template AI mood suggestions: approve/decline + thumbs on suggestion quality |
| Analytics | `admin-message-feedback.html` | Overview + Weak cases tabs, all data states |

## Component contract (`FlowFB`)

`FlowFB.render(cfg)` → html string; `data-fb-unit` blocks hydrate on `DOMContentLoaded` or via `FlowFB.hydrate(root)` (used after dynamic inserts in omniscience).

```js
{ mode: 'ai' | 'manual',            // label: "AI output" vs "Message review"
  st: 'unrated'|'up'|'down'|'expired'|'conflict'|'lineage'|'nonai'|'regfail'|'hidden',
  vote: 'up'|'down'|null, comment: string|null }
```

- Vote → `saving` → recorded badge. Two admins keep independent revisions (server owns `mine`/`summary`/`revision`; component renders server state, never recomputes).
- Comment editor: `Intl.Segmenter` grapheme counter, 200 max, Save disabled when empty/over limit, draft survives errors.
- Idempotency: production should send `Idempotency-Key` per vote submission; UI already models retry-safe flows.
- All `fb-*` page states map onto the control via a `data-state` observer — the atlas switcher demos every variant.

| `?state=` | Shows |
|---|---|
| `fb-default` | unrated control — vote and draft explicitly cleared |
| `fb-saving` | spinner on submit |
| `fb-comment` / `fb-comment-limit` | editor / 200-limit error |
| `fb-expired` | locked — "Feedback window closed" |
| `fb-conflict` | "Vote changed by another admin" |
| `fb-error` | save failed, retryable |
| `fb-lineage` | AI label + "Lineage pending" |
| `fb-regfail` | omniscience only: output stays, "Retry feedback" |
| `fb-no-perm` | controls hidden (account role) |

## Omniscience rules

Feedback attaches only to completed, visible, non-empty assistant output — never to the typing row / partial / failed streams. Client never sends trace/observation/provider/generation IDs; lineage is server-resolved. `fb-regfail` keeps the generated answer and offers retry. Page remains dev/stage + Admin/Main Admin only.

## Analytics page

- Filters (from/to, platform, origin, review mode) live outside `data-view` blocks → survive state changes; `invalid-range` shows inline validation.
- 6 KPI cards show exact `n / N` (incl. comment rate and active reviewers); coverage note separates verified AI lineage / pending / non-AI.
- Charts: stacked bars (votes/day, hatched pending/unknown cap + hover tooltip), reply ≤24h/≤72h and D1/D7 retention as smooth lines with area fill and end labels — each with a real table equivalent; retention shows the maturing band. Null points break the line — no interpolation across gaps.
- `Send → vote lag` histogram + `Positive rate by model` (verified lineage only, Δ vs fleet, never vs manual).
- Cohort table: exact size + D1/D7 with `n/N` + coverage chip (Complete/Pending/Unknown — icon + text, never color-only).
- No averaging profile percentages; missing windows render `pending`, never 0%.
- Weak cases: reasons = negative feedback / confirmed no-reply / confirmed D7 miss. "Content expired" placeholder instead of fabricated text; `Load more` appends without losing filters/scroll.

States: `overview`, `weak-cases`, `loading`, `empty`, `maturing`, `small-sample`, `error`, `invalid-range`, `weak-empty`, `weak-error`.

## v1.1 additions — pilot usability + analytics depth

Shipped on top of the v1 contract; nothing below weakens the "no verdict automation" rule.

**Collection surface (`assets/feedback.js`)**
- Reason chips in the comment editor: `Unnatural tone / Ignored context / Wrong language / Too pushy / Timing off`. One tap attaches a structured reason; free text stays optional, save enabled with chips only. Persisted reasons render as `fb__rtag` pills on the recorded row.
- Undo: after a vote lands, `Undo` is offered for 6s — cheaper than an edit-vote flow, kills misclick anxiety.
- `Next unrated ↓` on recorded rows jumps to the next unrated unit in the same scroll container (manual `scrollTop`, no `scrollIntoView`).
- Keyboard: hovering a message row enables `U` / `D` votes (`aria-keyshortcuts`, title hints).
- Rule worth keeping in the API: other admins' votes/comments are never rendered to the current user — no anchoring bias.

**Overview tab (`admin-message-feedback.html`)**
- Metrics regrouped: **Message quality** (rated/eligible with a coverage meter, positive votes with WoW pill, AI-output positive with `Δ pp vs manual` delta pill, template/manual baseline, median send→vote lag) vs **Outcomes** (reply ≤24h/≤72h, retention D1/D7) — visually separated so outcome ≠ quality.
- `Top negative reasons` — reason-chip distribution bars (exact counts, share note).
- `Reviewer coverage` — per-reviewer rated / % pos / agreement on double-rated messages. Agreement measures rater consistency, never message truth.
- `Positive rate by platform × origin` — tinted slice matrix; exact `%` + `n=` per cell, `no coverage` cells marked, never 0%.
- `Copy link` — filter state serialized into query params for a shareable URL.

**Weak cases**
- `Mark reviewed` — personal queue marker (`is-reviewed` row style, `aria-pressed`); explicitly not adjudication.
- `Create fix task` — modal prefilled with reason + `?msg=` message ref; human-owned loop closure, no LLM judge / dataset action.
- Message links are deep links carrying `?msg=<id>`.

**Omniscience**
- New `?state=ab`: blind A/B compare — same prompt, two anonymous outputs, identities (`GPT-4o` / `Grok 4.1 Fast`) revealed only after both carry votes.

**Alerts**
- New `Feedback` tab: weekly digest entry, lineage-pending backlog notice, coverage milestone.

## v1.2 additions — generation surfaces + review depth

**Everywhere generation happens, a control exists**
- Tools → Autoreplies: each chain step renders its `message_chains[].variants` as separate `.variant` blocks — weight badge + AI-generated mark + `FlowFB` unit (AI mode) per variant, so feedback attaches to the alternative, not the chain.
- Tools → Presets: presets produced by generation/import carry an `AI import` badge, a one-line preview, and the same control (AI mode). Operator-authored presets stay plain — reviewing your own text is meaningless.
- Campaigns → Suggested moods: replaced the static mood-cards tab with a per-template suggestion table (template ref + text preview + suggested chips + Approve/Decline). Approve/Decline is the moderation decision; the thumbs rate *suggestion quality* — the same AI-quality stream, explicitly not template stats.

**New state**
- `?state=fb-default` maps to `unrated` and explicitly clears `vote`/`draft`/`draftReasons` — the control must render unrated even if a previous vote was rendered.

**Analytics depth**
- `Comments attached` KPI (share of rated votes carrying text) + `Reviewers active` KPI.
- `Send → vote lag` histogram — buckets `<1h / 1–4h / 4–24h / >24h`, median in the footer.
- `Positive rate by model` — verified-AI lineage only, Δ pp measured against the fleet AI rate.
- Daily chart: pending + unknown render as a hatched cap segment (never colored negative); hover tooltip shows the full breakdown.
- Line charts: Catmull-Rom smoothed paths, gradient area fill, end-value labels, dashed grid. Null runs still break the line — no interpolation.

## v1.3 — shared chart engine (`assets/charts.js`)

All visualizations moved onto `window.FlowCharts` — a zero-dependency SVG engine whose colors resolve through `fc-*` classes in `tokens-v2.css` (dark theme is automatic, no re-render):

- **Real axes** — Y ticks computed by a nice-number pass; gridlines align to them. Line charts auto-fit the domain (e.g. 60–90%) with labeled ticks; bar charts always start at zero.
- **Crosshair tooltips** — one HTML overlay per chart: bars show per-segment rows + rated/awaiting-lineage meta; lines show every series at the hovered date plus `n / pending / unknown` and cohort coverage. Tooltips flip left near the right edge.
- **Clickable legends** — `aria-pressed` buttons dim a series/segment without rescaling the axis.
- **Keyboard access** — every datum has a focusable hit target (`tabindex`, `aria-label`); focus raises the same tooltip.
- **`hbars`** — shared horizontal-bar renderer used by Send→vote lag (median bucket highlighted + annotated) and Top negative reasons (value + share of all negatives).
- Table-backed equivalents (`details.data-table`) are preserved for every chart.

## Verified

- `node --check` on all touched JS; inline scripts extracted and checked.
- Playwright smoke: 58 pageviews (4 screens × all states × light/dark) — zero console/page/network errors.
- `?state=fb-no-perm` renders zero controls on every surface.
- v1.3: 20 pageviews (10 states × light/dark) clean; tooltip/crosshair/legend/keyboard interactions verified; zero horizontal overflow at 390px.
