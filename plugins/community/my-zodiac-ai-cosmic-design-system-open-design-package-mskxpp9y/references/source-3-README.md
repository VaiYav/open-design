# UI Kit — My Zodiac AI mobile app

`ui_kits/app/index.html` is a browser-reviewable React composition of the My Zodiac AI / Soulwise AI Cosmic design system. It is built from modular `components/*.jsx` files and rendered with React 18, ReactDOM, and Babel standalone.

## Files

| File | Role |
| --- | --- |
| `index.html` | Browser entry. Loads React, Babel, `colors_and_type.css`, and the component scripts, then mounts `<App />` into `#root`. |
| `components/ColdBG.jsx` | Fixed starfield/nebula background (`stars`). |
| `components/GlassCard.jsx` | Reusable card shell: default, elevated, glass, gradient, hero. |
| `components/OrbNav.jsx` | Bottom Orb Nav with a 56px central glowing orb and four icon-only glyphs. |
| `components/Dashboard.jsx` | App home: brand, auth teaser, energy dial, horoscope tabs, cosmic story, settings rows. |
| `components/ChatArea.jsx` | AI astrologer chat surface: scrollable message list and composer. |
| `components/AssistantList.jsx` | Assistant / list rail with selectable astrologer personas. |
| `components/MessageBubble.jsx` | User and AI chat bubbles. |
| `components/Composer.jsx` | Glass input bar with send button. |
| `components/App.jsx` | App shell that switches between `Dashboard` and `ChatArea` and passes state to `OrbNav`. |
| `components/AssistantsList.jsx` | Optional vertical assistant list for a desktop/design-review layout. |
| `components/InputBar.jsx` | Optional glass prompt composer with action chips. |
| `components/Sidebar.jsx` | Optional glass sidebar navigation. |
| `static-showcase.html` | The original single-file static HTML showcase (preserved for reference). |

## Design basis

- Tokens: `../colors_and_type.css`.
- Brand assets: `../../assets/design-system/main-logo.webp`, `logo-mark.svg`, `orb-glow.svg`, `splash-screen.svg`, `welcome-star.svg`.
- Source components: `source_examples/AppButton.vue`, `AppCard.vue`, `AppTextInput.vue`, `AppSelect.vue` and `COMPONENT-USAGE-GUIDE.md`.

## Usage

Open `ui_kits/app/index.html` in a browser. No build step is required; Babel compiles the JSX in the browser. The entry uses unpkg CDN for React, ReactDOM, and Babel standalone.

To reuse a component in a new artifact, copy the relevant `components/*.jsx` file and the token CSS into your page. Keep the Cosmic token contract: no hardcoded hex values, glass only on dark, and touch targets ≥ 44px.
