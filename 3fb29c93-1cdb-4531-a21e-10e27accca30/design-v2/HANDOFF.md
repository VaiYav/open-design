# Flow v2 — implementation handoff

Status: pitch/research version. Baseline for before/after diffs: `../design-copy/` (59 v1 screens, frozen). This file documents the v2 conventions an implementation must preserve — it is not a redesign spec per screen.

## Layout

| Piece | File | Role |
|---|---|---|
| `index.html` | atlas/launcher | Screen tree + state chips + theme/viewport switcher + deep links |
| `pitch.html` | deck | Russian-language pitch (1920×1080, deck protocol) |
| `assets/tokens-v2.css` | tokens + components | Single stylesheet; light + `[data-theme="dark"]` |
| `assets/stateful.js` | state engine | `?state=`, `?theme=`, `?chrome=0`, postMessage bridge, `data-state-link` |
| `assets/components.js` | shell | `FlowUI.mount`, rail/topbar, `platformTag`, `avatar`, `dot`, `stateBlock` |
| `assets/fixtures.js` | demo data | All screens render from `window.Fixtures` |
| `assets/feedback.js` | FLOW-8555 | `FlowFB` feedback units + `fb-*` state mapping |
| `assets/charts.js` | charts | `FlowCharts` — `bars` / `lines` / `hbars`: computed axes, crosshair tooltips, toggle legends, keyboard hits; all colors via `fc-*` classes |
| `assets/manifest.js` | source of truth | Zones, screens, state lists, v1-route coverage |
| `manifest-v2.json` | generated | Same data as JSON — regenerate after manifest edits |
| `feedback-spec.md` | feature spec | FLOW-8555 handoff (collection UI + management + analytics) |
| `check-embed.mjs` | audit | No relative `url()`/asset refs remain (all embedded) |
| `check-contrast.mjs` | audit | Rendered WCAG contrast over every screen × state × theme |
| `embed-assets.mjs` | build | Re-embeds `assets/*` refs as data URIs (idempotent) |

## State machine contract

- One `.html` file per screen; every screen carries **all** its states as sibling `[data-view]` blocks.
- `?state=<name>` selects the visible block; comma-lists (`data-view="a,b"`) share one block between states.
- `?theme=dark|light`, `?chrome=0` (hides the floating state FAB when embedded in the atlas).
- Tabs that double as states use `data-tab-scope` + `data-tab` + `data-tab-panel` — the engine syncs tab chrome.
- In-screen state jumps use `data-state-link="<state>"` on buttons/links.
- Deep link shape: `index.html?screen=<id>&state=<state>&theme=dark&role=<role>`.
- Every list gets `populated/loading/empty/error`; forms get `default/validation/submitting/success`; feedback surfaces get the `fb-*` set. New states must be added both to `data-view` and to `manifest.js` (the audit enforces sync).

## Roles

- `?role=all|account|admin|main_admin` → `data-role` on `<html>`, persisted in `localStorage['v2-role']`. An absent param reads storage; an **invalid** or missing param falls back to `all` — the ungated design-review lens. `all` is preview-only (not a product role): every screen, nav item and feedback control renders. Picking a concrete role is what switches gating on.
- Canonical model lives in `fixtures.js`: `F.ROLES` (persona name/label/home/fb flag), `F.SCREEN_ROLES` (file → allowed roles), `F.roleAllows(file, role)`. It mirrors `src/router.jsx` `checkRole()` + `roleMenus`: `account` = full workspace + campaigns, no admin zone — **operators vote and comment on feedback too** (the management page stays admin-only); `admin` = workspace + admin, but no `campaigns-groups`/`campaigns-posts` (account-only in v1) and no Administrators screens; `main_admin` = admin + tools + omniscience + alerts, but no chats/mails/history (router-gated to operators).
- Effects: rail + zone sub-nav filter out disallowed items (section headers only render when children survive); a denied screen hides `<main>` and renders `.v2-denied` (lock icon, explanation, CTA to the role's home carrying `?role=`); the topbar persona + `.status-pill--role` swap to the role's identity; `feedback.js` consults `F.ROLES[role].fb` — currently `true` for every role, and `fb-no-perm` (→ `none`) demonstrates revoked permission without needing a role.
- Atlas: `#atlas-role` seg switches `cur.role`, persists it, marks locked tree items (`is-locked` + "no access"), shows `#atlas-role-note` on denied screens, and propagates `&role=` into the iframe src, the open-link, and the deep-link URL. Standalone screens expose the same switcher inside the expanded state FAB (`data-st-role` chips → `applyRole` → one reload).
- `manifest-v2.json` embeds the model (`roleModel`) plus a `roles` array per screen, so the handoff JSON is self-contained.

## Theming

- Dark palette is derived — `oklch(from var(--c-*) …)` only, no new hex literals. Never fork component CSS per theme.
- Accent has three roles — pick the right token:
  - `--accent` — fills (buttons, chips, counters) under `--accent-fg` text, borders, icons.
  - `--accent-txt` — links and any accent-colored *text* on surfaces or `--accent-soft` (darker in light, lighter in dark so it keeps ≥4.5 both ways).
  - `--lav-fg` — lavender text on lav-tinted backgrounds (avatars, `badge--lav`, `badge-new`, `.fb-eyebrow`).
- `--faint`/`--muted` are solid (no alpha) so contrast stays honest on tinted rows; muted text inside `is-active` accent-soft rows escalates to `--fg-2`.
- Contrast targets: ≥4.5:1 normal text, ≥3:1 large text (≥24px / ≥18.66px bold) — verified by `check-contrast.mjs` across all 474 pageviews (27.5k text elements): ALL PASS in both themes.
- Pending/unknown data is text + icon, never red, never 0%.

## Navigation (rail)

Three modes, all driven by `.v2-shell` classes set in `components.js` `syncRail()`:

- **Expanded** (216px, `var(--rail-w)`) — default ≥1081px. Grouped sections (`.v2-rail__sec`), icon+label+count links, zone sub-nav as indented tree (`.v2-rail__sub` + `.v2-rail__sublink`, hairline guide at icon center, tick on active item).
- **Compact** (64px, `.rail-min`) — user pref `localStorage['v2-rail']='min'` **or** auto ≤1080px (pref `'full'` overrides auto). Icon-only links with styled tooltips (`data-tip` → fixed `::after`, positioned by `app.js` via `--tip-top`); counts become corner mini-badges; section headers become hairline dividers; zone sub-navs leave the flow and reopen as fixed flyouts (`--sub-left/--sub-top`, `:hover`/`:focus-within`); collapse button flips its arrow and swaps `aria-expanded`/`aria-label`. `[` hotkey toggles.
- **Drawer** (≤780px) — rail leaves the grid (`position:fixed`, `translateX(-105%)`), opens via topbar burger (`data-nav-open`) into `.nav-open`, closes via scrim (`data-nav-close`), drawer ×, or ESC. Content inside is always expanded (labels visible, `.rail-min` removed by syncRail). `.v2-rail__foot` (collapse) is hidden in drawer mode.

Fixed-position flyouts/tooltips exist because `.v2-rail__nav` is a scroll container — absolute children would be clipped on X. Never move them back to `position:absolute`.

## Assets

Icons and platform marks are **embedded as data URIs** (CSS masks + `F.PLATFORMS.*.logo`). Screens are self-contained: they render from `file://`, `data:`, srcdoc, or the raw endpoint. After adding an asset reference, run `embed-assets.mjs`, then `check-embed.mjs` must report 0 relative refs. Platform logos come from `design-copy/assets/logos` — do not redraw or recolor.

## Message feedback (FLOW-8555)

`FlowFB.mount(el, opts)` renders the control under outgoing items. Six surfaces: `chats`, `mails`, `omniscience` (completed Beloved output only), `tools-autoreplies` (per AI variant), `tools-presets` (AI imports), `campaigns-templates` `moods` tab. `fb-no-perm` state must render zero controls — verified in smoke. Data contract, idempotency, lineage rules: `feedback-spec.md`.

## v1 route coverage

All 66 v1 routes map to v2 screens in `manifest.js` (`v1:` arrays). Variant routes (5 blacklist types, 4 campaign pivots, moderation tabs) collapsed into states. `/tools/:lady_id/mailing` was a stub in v1 — `tools-mailing.html` is now a full screen.

## Verification

```bash
node check-embed.mjs        # 0 relative url()/asset refs
node check-contrast.mjs     # full matrix, ~6 min; --quick for first-state pass
node --check assets/*.js    # syntax
```

Playwright smoke convention (see git history / run ad hoc): every `file × state × {light,dark}` — assert no console/page/request errors, no `undefined`/`NaN` text, at least one visible `[data-view]`, `fb-no-perm` → 0 feedback units.
