# Soulwise AI design-system package — verification scorecard

Run: 2026-08-09

## Extraction status

- Source deep-dive completed — canonical Cosmic tokens from `front/src/css/tokens/`, components from `front/src/shared/ui/*`, and design docs from `front/src/css/COSMIC-DESIGN-SYSTEM.md`, `COMPONENT-USAGE-GUIDE.md`, and `DESIGN_SYSTEM.md` are preserved in `source_examples/`.
- `od tools connectors local-design-context --path '/Users/valentinyakovlev/projects/my_zodiac_ai/front' --output context/local-code/front.md` — refreshed local source evidence.
- `od brand preview product-128638` — passed.
- `od brand finalize product-128638` — completed; registered design system `user:product` in place.
- `npm run reconcile` — re-applied canonical Cosmic palette, dark `brand.html` theme, full source-backed brand payload, and restored `DESIGN.md` from `scripts/design-md-template.mjs`.
- `npm run validate` — all checks pass.
- `od tools connectors design-system-package-audit --path . --fail-on-warnings` — passed with 0 errors and 0 warnings.
- `npx -y @google/design.md lint DESIGN.md` — passed with 0 errors and 0 warnings.

## Validation summary

```
35 passed
0 failed
0 warnings
```

## What changed in this pass

- Restored the Material Design Icons webfont files (`fonts/materialdesignicons-webfont-Dp5v-WZN.woff2` and `fonts/materialdesignicons-webfont-PXm3-2wK.woff`) from the preserved local source build.
- Refreshed local source evidence with `od tools connectors local-design-context`.
- Ran `od brand preview product-128638` and `od brand finalize product-128638` to keep the registered `user:product` design system in sync.
- Re-applied the canonical Cosmic palette and dark `brand.html` theme via `npm run reconcile`.
- Updated `scripts/design-md-template.mjs` with a design.md-compliant YAML frontmatter (`primary`, `colors`, `spacing`, `rounded`, `typography`) so `DESIGN.md` now passes the Google `design.md` linter with 0 errors and 0 warnings.
- Expanded `brand.json.seed` and `brand.json` to include all 62 source hex colors found in `colors_and_type.css` (via `scripts/expand-palette.mjs`), so the registered brand palette is now a complete source-of-truth set.

### Brand manifest and reconciliation
- `brand.json` — merged with `brand.json.seed` to the full 23-color canonical Cosmic palette, source provenance, typography, voice, imagery, layout, motion, accessibility, 32-component catalog, rules, anti-patterns, and stack.
- `brand.json.seed` — preserved as the Open Design engine guard.
- `scripts/reconcile-package.mjs` — now also restores `DESIGN.md` from `scripts/design-md-template.mjs` after any `od brand finalize` pass that resets it.
- `scripts/design-md-template.mjs` — new canonical `DESIGN.md` template used by the reconciliation pipeline.

### Documentation
- `DESIGN.md` — fully rewritten as a comprehensive design-system reference: context, principles, 23-color palette, gradients, typography, spacing/radius/shadows, glassmorphism, components, voice, imagery, motion, accessibility, anti-pattern, implementation, do's/don'ts, and source files.
- `scripts/design-md-template.mjs` — canonical `DESIGN.md` template used by the reconciliation pipeline to survive `od brand finalize`.
- `guide.md` — expanded brand guide with color roles, typography, spacing, voice, imagery, layout, and rules.
- `README.md` and `SKILL.md` — already reference the reconciliation workflow and `brand-cosmic-overrides.css`.

### Generated system files
- `system/seed.json`, `system/theme.json`, `system/tokens.*.json`, `system/variables.css`, `system/variables.dark.css`, `system/kit.html`, `system/kit.dark.html`, `system/index.html`, and all `system/artifacts/*.html` are reconciled to the canonical Cosmic palette and load `system/brand-cosmic-overrides.css`.
- `brand.html` — re-patched with the dark Cosmic theme and full canonical payload.

### UI kit
- `ui_kits/app/` components are documented in `ui_kits/app/README.md`; optional extra components (`AssistantsList.jsx`, `InputBar.jsx`, `Sidebar.jsx`) are noted for desktop/design-review layouts.

## Commands

```bash
# Preview the registered brand
"$OD_NODE_BIN" "$OD_BIN" brand preview product-128638

# Finalize / update the registered design system
"$OD_NODE_BIN" "$OD_BIN" brand finalize product-128638

# Reconcile after any Open Design finalize pass
npm run reconcile
# or
node scripts/reconcile-package.mjs

# Validate the package
npm run validate
# or
node scripts/validate-package.js
```

## Files to review

- `brand.html` — self-contained dark Cosmic brand kit.
- `brand.json` — canonical brand manifest.
- `brand.json.seed` — authorised overrides and source-backed canonical values.
- `colors_and_type.css` — canonical token file.
- `DESIGN.md` — full design-system reference.
- `guide.md` — concise brand guide.
- `README.md` — package overview.
- `SKILL.md` — agent-facing skill.
- `system/BRAND-SYSTEM.md` — re-theming and build instructions.
- `system/brand-cosmic-overrides.css` — runtime token reconciliation.
- `ui_kits/app/index.html` — composed mobile app showcase.
