---
name: soulwise-cosmic
user-invocable: true
description: Source-backed Cosmic design system for Soulwise AI (My Zodiac AI) — dark navy, lavender, gold, pink, mint, glassmorphism, Cormorant Garamond display over Inter body.
metadata:
  type: design-system
  product: Soulwise AI
  source: /Users/valentinyakovlev/projects/my_zodiac_ai/front
  tokens: colors_and_type.css
  design_doc: DESIGN.md
  brand: brand.json
---

# Soulwise AI — Cosmic Design System

Use this skill when implementing or designing screens, components, previews, or artifacts for **Soulwise AI** (product: My Zodiac AI). The system is **Cosmic only** — a dark-first, glassmorphic, celestial UI for astrology and self-discovery.

## What is inside

- `brand.json` — canonical brand manifest: 23 colors, typography, voice, imagery, layout, motion, accessibility, components, source provenance, and rules.
- `brand.json.seed` — authorised overrides protecting canonical Cosmic values from `od brand finalize`.
- `colors_and_type.css` — the single token file with `--cosmic-*` custom properties and the Material Design Icons `@font-face`.
- `DESIGN.md` — full design system: principles, 23-color palette, type, spacing, components, motion, accessibility, theming, product context, voice, anti-patterns, and source references.
- `README.md` — package overview, quick-start, and preview links.
- `guide.md` — concise brand guide (color, type, voice, imagery, layout, interaction).
- `SCORECARD.md` — verification scorecard and reconciliation report.
- `system/BRAND-SYSTEM.md` — package layout, re-theming, and build instructions.
- `source_examples/` — preserved Vue SFCs (`AppButton.vue`, `AppCard.vue`, `AppTextInput.vue`, `AppSelect.vue`) and docs (`COMPONENT-USAGE-GUIDE.md`, `DESIGN_SYSTEM.md`).
- `assets/design-system/`, `assets/icons/`, `build/`, `fonts/` — preserved logos, icons, runtime assets, and the icon webfont.
- `preview/` — live token and component specimen cards.
- `ui_kits/app/` — composed mobile app showcase with modular React JSX components.

## Source context

This package was extracted from the live source tree at `front/src/css/design-system/colors_and_type.css` and `front/src/shared/ui/*`. The canonical token file and source Vue components are preserved as the reference implementation. The product is a Vue 3 + Quasar + Capacitor 8 mobile-first app; every user-facing surface now resolves to the Cosmic dark universe.

## When to use

- Designing a new Soulwise AI screen, card, modal, or form.
- Choosing the correct `AppButton` or `AppCard` variant for a feature.
- Writing a new Open Design artifact (deck, landing page, email) that must match the brand.
- Auditing a screen for token compliance, accessibility, or universe mixing.
- Selecting imagery, typography, or color usage for a marketing or in-app deliverable.

## Tokens to use

Always prefer `--cosmic-*` tokens. Do not hardcode hex values in component code.

| Purpose | Token |
| --- | --- |
| Page background | `--cosmic-bg` (`#0c0c20`) |
| Card/modal surface | `--cosmic-bg-card` / `--cosmic-grad-card` |
| Primary CTA / focus | `--cosmic-lav-mid` (`#a78bfa`) |
| Premium / upgrade | `--cosmic-gold` (`#ffd166`) |
| Secondary accent | `--cosmic-pink-mid` (`#ec4899`) |
| Success / positive | `--cosmic-mint` (`#6ee7b7`) or `--status-success` |
| Info / water | `--cosmic-blue` (`#93c5fd`) |
| Muted text | `--cosmic-text-muted` (`rgba(255,255,255,0.65)`) |
| Primary text | `--cosmic-text-primary` (`rgba(255,255,255,0.95)`) |
| Glass fill | `--cosmic-glass-bg` (`rgba(255,255,255,0.04)`) |
| Card border | `--cosmic-border-subtle` (`rgba(255,255,255,0.055)`) |
| Card radius | `--radius-2xl` (`20px`) |
| Button radius | `--radius-btn-cold` (`14px`) |
| Pill radius | `--radius-full` (`9999px`) |
| Spacing base | `--space-1` = 4px … `--space-16` = 64px |
| Display font | `--font-cold-display` (Cormorant Garamond) |
| Body font | `--font-cold-body` (Inter) |
| Icon font | `--font-icon` (Material Design Icons) |

## Preferred components

Reference the source examples for structure and props:

- **Button** — `AppButton` (`primary`, `secondary`, `ghost`, `danger`, `link`, `unstyled`); `AppCosmicCta` (`gradient`, `gold`, `submit`); `AppOnboardingButton` / `AppAuthButton` / `AppGlassButton` for specialized contexts.
- **Card** — `AppCard` with variants `default`, `elevated`, `outlined`, `flat`, `gradient`, `glassmorphism`, `cosmic`, `cosmic-elevated`, `cosmic-glass`, `hero`, `feat`, `gold-card`.
- **Form / Input** — `AppTextInput` and `AppSelect` with floating labels, dark fill, lavender focus glow, and 44px touch targets.
- **Navigation / Tabs** — `AppTabs` pill/capsule segmented control; bottom **Orb Nav** with a 56px central glowing orb.
- **Dialog / Modal** — `AppModal` with gradient surface, 20px radius, blur backdrop.
- **Chips / Badges** — `AppChip` / `AppBadge` as tinted capsules (bg ~15%, border ~30%, solid text).
- **Zodiac chips** — use `--el-fire`, `--el-earth`, `--el-air`, `--el-water` with the same capsule formula.

## Rules

1. **Cosmic only.** The Warm universe (`#241c0f`) is retired. Do not use warm tokens, warm cards, or warm buttons in new code.
2. **No mixing universes.** Do not place a `cosmic-cta` button inside a warm-styled card or combine legacy warm and cosmic tokens in one composition.
3. **Glassmorphism only on dark.** Translucent blur cards, nav bars, and modals sit on `#0c0c20`. Never use glass on light backgrounds.
4. **No hex literals.** Use `--cosmic-*` and `--status-*` tokens. The only exceptions are chart/D3 domain colors and legacy compatibility rings.
5. **Dark-first text.** Use the white-with-opacity text ramp (`--cosmic-text-primary` through `--cosmic-text-faint`) or `--cosmic-text-solid` (`#f5f5f5`).
6. **Touch & a11y.** Minimum touch target is `44px` (`--touch-min`). Every interactive element has visible text or `aria-label`. Focus rings are `--cosmic-lav-mid`.
7. **Motion respects preference.** Wrap animations in `@media (prefers-reduced-motion: no-preference)`. Use GSAP if needed, but teardown in `onUnmounted`.
8. **Title Case for screen titles, sentence case inline, ALL-CAPS only for small labels with `letter-spacing ≥ 6px`.**
9. **Voice.** Warm, second-person, invitational. Use "insight" not "advice". Avoid prediction, guaranteed, fate, command, fortune-telling.
10. **No bare `:hover` on tappable surfaces.** Gate hover states behind `@media (hover: hover) and (pointer: fine)`.

## How to use

Import `colors_and_type.css` once and apply the Cosmic body styles:

```css
@import 'colors_and_type.css';

body {
  background: var(--cosmic-bg);
  color: var(--cosmic-text-primary);
  font-family: var(--font-cold-body);
  font-size: var(--cosmic-text-base);
  line-height: var(--leading-normal);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, .display {
  font-family: var(--font-cold-display);
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.15;
}
```

## Design system highlights

- **Dark-first cosmic palette** on a deep navy canvas.
- **Glassmorphism** with `rgba(255,255,255,0.04)` fills, `20–28px` backdrops, and lavender-tinted borders.
- **One accent per screen** — lavender for primary CTAs, gold for premium, pink for love/relationship insights, mint for success.
- **Cormorant Garamond display** over **Inter body** for a celestial but readable hierarchy.
- **4-pt spacing grid**, `20px` card radius, `14px` cold CTA radius.
- **Status and zodiac chips** as tinted capsules, never solid fills.
- **Orb Nav** as the signature bottom navigation pattern.

## Previews

- [`preview/colors.html`](preview/colors.html) — color tokens
- [`preview/colors-primary.html`](preview/colors-primary.html) — primary and accent ramps
- [`preview/typography.html`](preview/typography.html) — type overview
- [`preview/typography-specimens.html`](preview/typography-specimens.html) — focused type specimens
- [`preview/spacing.html`](preview/spacing.html) — spacing, radii & shadows
- [`preview/spacing-tokens.html`](preview/spacing-tokens.html) — focused spacing tokens
- [`preview/components.html`](preview/components.html) — component overview
- [`preview/components-buttons.html`](preview/components-buttons.html) — button variants
- [`preview/components-cards.html`](preview/components-cards.html) — card variants
- [`preview/components-inputs.html`](preview/components-inputs.html) — input, select, textarea, switch and form states
- [`preview/brand.html`](preview/brand.html) — brand values
- [`preview/brand-assets.html`](preview/brand-assets.html) — brand assets
- [`preview/kit-canonical.html`](preview/kit-canonical.html) — canonical Cosmic button/card/input/chip/tabs specimen
- [`ui_kits/app/index.html`](ui_kits/app/index.html) — composed mobile app
- [`system/kit.html`](system/kit.html) — generated component kit, re-aligned with `brand-cosmic-overrides.css`
- [`system/kit.dark.html`](system/kit.dark.html) — generated component kit (dark alias)
- [`system/index.html`](system/index.html) — gallery, re-aligned with `brand-cosmic-overrides.css`
- [`index.html`](index.html) — package overview and launcher
- [`guide.md`](guide.md) — quick brand guide

When in doubt, read `DESIGN.md` and `source_examples/COMPONENT-USAGE-GUIDE.md` before inventing a new component or token.
