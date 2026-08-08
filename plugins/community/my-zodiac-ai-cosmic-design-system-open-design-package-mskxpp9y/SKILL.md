# My Zodiac AI — Cosmic Design System (Open Design package)

**Source product:** Soulwise AI, also shipped as My Zodiac AI.  
**Source tree:** `front/src/css/design-system/colors_and_type.css` and `front/src/shared/ui/*` in `/Users/valentinyakovlev/projects/my_zodiac_ai/front`.  
**Stack:** Vue 3 + Quasar + Capacitor 8, Pinia, GSAP, vue-i18n.  
**Visual universe:** Cosmic — a single dark-first, glassmorphic, celestial UI for astrology and self-discovery.

## Product overview

Soulwise AI is a mobile-first astrological analysis product. Core flows include:

- Natal chart generation and D3 visualization
- Synastry and relationship compatibility
- Daily, weekly, and monthly horoscopes
- Cosmic weather and planetary transit tracking
- AI astrologer chat (Aria)
- Multi-language support (English, Russian, Ukrainian)

All user-facing surfaces resolve to the **Cosmic** universe: deep navy `#0c0c20`, lavender `#a78bfa`, gold `#ffd166`, pink `#ec4899`, mint `#6ee7b7`, and glassmorphism. The earlier Warm universe (`#241c0f`) has been retired.

## Source and context

This package is the registered design system for **Soulwise AI** (My Zodiac AI). The canonical source files were extracted from the live project at `front/src/css/design-system/colors_and_type.css` and `front/src/shared/ui/*`, plus preserved runtime assets, icons, and font files. The product is a Vue 3 + Quasar + Capacitor 8 mobile-first application with a NestJS backend. The package is intended as a source-backed handoff and review artifact; reuse it before inventing new tokens.

## Package contents

- `colors_and_type.css` — root Cosmic token file (colors, type, spacing, radius, shadows, motion, status, zodiac, glass).
- `DESIGN.md` — full design system documentation: principles, 23-color palette, type, spacing, components, motion, accessibility, theming, voice, anti-patterns, and source references.
- `README.md` — package overview, quick-start, and preview links.
- `guide.md` — concise brand guide (color, type, voice, imagery, layout, interaction).
- `SCORECARD.md` — verification scorecard and reconciliation report.
- `index.html` — dark package overview and launcher.
- `SKILL.md` — agent-facing skill file with usage rules for this design system.
- `brand.json` — canonical brand manifest with 62 source hex colors, typography, voice, imagery, and layout posture.
- `brand.json.seed` — authorised overrides protecting canonical Cosmic values from future `od brand finalize` runs.
- `system/BRAND-SYSTEM.md` — re-theming and build instructions for the Open Design generated system.
- `scripts/reconcile-package.mjs` — reconciles generated `system/` files with canonical Cosmic tokens.
- `scripts/validate-package.js` — package consistency checks (`npm run validate`).
- `scripts/expand-palette.mjs` — one-off extraction helper that adds every hex color found in `colors_and_type.css` to `brand.json.seed`.
- `assets/design-system/` — logo, splash, orb glow, welcome star and main logo.
- `assets/icons/` — app icon, favicons, Apple touch icon, 192/512 PNGs.
- `build/` — runtime icons (`icon-192-any.png`, `icon-512-any.png`, `android-chrome-*.png`, `main-logo.webp`).
- `fonts/` — preserved Material Design Icons webfont and a declaration CSS file.
- `source_examples/` — original Vue SFCs and docs (`AppButton.vue`, `AppCard.vue`, `AppTextInput.vue`, `AppSelect.vue`, `COMPONENT-USAGE-GUIDE.md`, `DESIGN_SYSTEM.md`).
- `preview/` — self-contained dark HTML preview cards:
  - `colors.html` — broad color token swatches
  - `colors-primary.html` — primary, accent, status, and surface ramps
  - `typography.html` — type ramp overview
  - `typography-specimens.html` — focused display and body specimens
  - `spacing.html` — spacing, radii, shadows, and blur overview
  - `spacing-tokens.html` — focused 4-pt scale, radius, shadow specimens
  - `components.html` — broad component specimen overview
  - `components-buttons.html` — button variants and sizes
  - `components-cards.html` — card variants
  - `components-inputs.html` — input, select, textarea, switch and form states
  - `brand.html` — brand values and tokens
  - `brand-assets.html` — logos, icons, and runtime assets
  - `kit-canonical.html` — canonical Cosmic button/card/input/chip/tabs specimen
- `ui_kits/app/` — composed mobile-sized app showcase:
  - `index.html` — React/Babel browser entry that loads modular `components/*.jsx`
  - `components/` — `ColdBG`, `GlassCard`, `OrbNav`, `Dashboard`, `ChatArea`, `AssistantList`, `MessageBubble`, `Composer`, `App`
  - `static-showcase.html` — the original standalone HTML showcase
- `system/` — Open Design generated token files and component kit, reconciled to the Cosmic palette:
  - `seed.json`, `theme.json`, `tokens.default.json`, `tokens.dark.json`, `tokens.compact.json`
  - `variables.css`, `variables.dark.css`
  - `kit.html`, `kit.dark.html`, `index.html`
  - `brand-cosmic-overrides.css` — runtime CSS override that re-aligns generated `--brand-*` tokens with canonical `--cosmic-*` values

## How to use

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap');
@import 'colors_and_type.css';

body {
  background: var(--cosmic-bg);
  color: var(--cosmic-text-primary);
  font-family: var(--font-cold-body);
  font-size: var(--cosmic-text-base);
  line-height: var(--leading-normal);
}
```

For Quasar / Vue builds, the source project loads `colors_and_type.css` once at the app entry and uses the `App*` wrappers in `shared/ui/` instead of raw `q-*` primitives.

## Preview cards

| Preview | Path |
| --- | --- |
| Color tokens (broad) | `preview/colors.html` |
| Color tokens (focused) | `preview/colors-primary.html` |
| Typography (overview) | `preview/typography.html` |
| Typography (specimens) | `preview/typography-specimens.html` |
| Spacing / radii / shadows (overview) | `preview/spacing.html` |
| Spacing tokens (focused) | `preview/spacing-tokens.html` |
| Components (overview) | `preview/components.html` |
| Button variants | `preview/components-buttons.html` |
| Card variants | `preview/components-cards.html` |
| Input & form controls | `preview/components-inputs.html` |
| Brand values | `preview/brand.html` |
| Brand assets | `preview/brand-assets.html` |
| Canonical Cosmic kit | `preview/kit-canonical.html` |
| Mobile app showcase | `ui_kits/app/index.html` |
| Component kit (dark) | `system/kit.html` / `system/kit.dark.html` |
| Artifacts index | `system/index.html` |
| Package overview | `index.html` |
| Quick brand guide | `guide.md` |

## Review and reuse workflow

1. Open `DESIGN.md` to confirm the visual direction and rules.
2. Import `colors_and_type.css` for tokens and the Google Fonts.
3. Use `source_examples/` to understand the original `AppButton`, `AppCard`, `AppTextInput`, and `AppSelect` patterns.
4. Build with the token variables; do not hardcode hex values.
5. Run `npm run validate` (or `node scripts/validate-package.js`) to check package consistency.
6. After any Open Design `od brand finalize` run, run `npm run reconcile` (or `node scripts/reconcile-package.mjs`) to restore the canonical Cosmic values in `system/`.
7. Review the UI kit and preview cards in a browser before handoff.

## Token highlights

- **Primary:** `#a78bfa` (lavender)
- **Gold / premium:** `#ffd166`
- **Background:** `#0c0c20`, **Card:** `#141420`, **Text base:** `#f5f5f5`
- **Body font:** Inter, **Display font:** Cormorant Garamond, **Icon font:** Material Design Icons
- **Base radius:** `8px` inputs, `14px` cold CTAs, `20px` cards and modals
- **Grid:** 4-pt spacing scale

## Provenance

Formalized by Open Design from candidate 0198e6d5-7f92-4747-9a04-5854828d0540.
