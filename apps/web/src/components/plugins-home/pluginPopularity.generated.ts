// AUTO-GENERATED — DO NOT EDIT BY HAND.
//
// Blended template popularity, used to order the plugin/example grid and the
// Home rail so the templates users actually reach for lead each category and
// sub-category (OPEND-449). Higher score = more popular; range [0, 1].
//
// How it is built (deterministic, creds-free transform):
//   score = 0.6 * norm(log1p(distinctUsers)) + 0.4 * norm(log1p(runs))
//   • window: trailing 28 days of `run_finished` events (by plugin_id)
//   • distinct users are the anti-gaming signal; runs add engagement depth
//   • log1p tames the head-template scale gap; min-max normalized over the
//     live-catalog template set so both metrics land in [0, 1]
//   • RETIRED plugins (absent from the live catalog) are dropped
//   • templates with no renderable preview are EXCLUDED — mode-seed entries
//     (e.g. the generic Live Artifact / HyperFrames options) live in the
//     composer mode picker, not the gallery, so usage must not float them up
//   • templates below 20 distinct users are OMITTED so thin-sample
//     tail templates keep their curated/visual fallback order
//
// Regenerate with: pnpm exec tsx scripts/refresh-plugin-popularity.ts --write
// Refreshed weekly by .github/workflows/refresh-plugin-popularity.yml.
// See pluginPopularity.RUNBOOK.md here.

export interface PluginPopularityMeta {
  readonly generatedAt: string;
  readonly windowDays: number;
  readonly weights: { readonly users: number; readonly runs: number };
  readonly minUsers: number;
  readonly count: number;
}

export const PLUGIN_POPULARITY_META: PluginPopularityMeta = {
  generatedAt: '2026-08-03',
  windowDays: 28,
  weights: { users: 0.6, runs: 0.4 },
  minUsers: 20,
  count: 109,
};

// Plugin id -> blended popularity score in [0, 1], most-popular first.
export const PLUGIN_POPULARITY: Readonly<Record<string, number>> = {
  'example-web-prototype': 1.0,
  'example-simple-deck': 0.8637,
  'example-web-clone': 0.7995,
  'example-open-design-landing': 0.6955,
  'example-mobile-app': 0.6935,
  'example-gamified-app': 0.6116,
  'example-wireframe-mobile-flow': 0.5927,
  'example-webgl-experience': 0.5885,
  'example-kanban-board': 0.5834,
  'example-fs-creative-voltage': 0.5817,
  'example-wireframe-sketch': 0.5716,
  'example-fs-notebook-tabs': 0.5408,
  'example-fs-electric-studio': 0.5407,
  'example-mobile-onboarding': 0.5368,
  'example-wireframe-greybox': 0.5228,
  'example-social-carousel': 0.5226,
  'example-dashboard': 0.5214,
  'image-template-anime-martial-arts-battle-illustration': 0.5163,
  'example-digital-eguide': 0.5118,
  'example-guizang-ppt': 0.51,
  'example-fs-editorial-forest': 0.5094,
  'video-template-video-seedance-three-kingdoms-lyubu-yuanmen-archery': 0.4979,
  'example-huashu-keynote-black': 0.4882,
  'example-social-media-matrix-tracker-template': 0.4866,
  'example-huashu-bento-insight': 0.4859,
  'example-video-hyperframes': 0.4853,
  'example-huashu-slides': 0.4819,
  'example-html-ppt-zhangzara-creative-mode': 0.4765,
  'example-wireframe-annotated': 0.4744,
  'video-template-seedance-2-0-15-second-cinematic-japanese-romance-short-film': 0.4743,
  'example-webgl-caustic-pool': 0.4721,
  'example-motion-frames': 0.4716,
  'example-html-ppt-course-module': 0.4651,
  'example-resume-modern': 0.462,
  'example-velar-luxury-real-estate': 0.4543,
  'example-hps-academic-paper': 0.4532,
  'example-html-ppt-knowledge-arch-blueprint': 0.4509,
  'example-fs-emerald-editorial': 0.4493,
  'example-codex-interactive-capability-map': 0.448,
  'image-template-e-commerce-live-stream-ui-mockup': 0.4437,
  'example-mockup-device-3d': 0.4283,
  'example-html-ppt-zhangzara-capsule': 0.4266,
  'example-doc-kami-parchment': 0.4244,
  'example-blog-post': 0.4238,
  'example-html-ppt-hermes-cyber-terminal': 0.4222,
  'video-template-frame-kinetic-type': 0.4218,
  'example-huashu-takram-soft-tech': 0.4207,
  'image-template-profile-avatar-casual-fashion-grid-photoshoot': 0.4203,
  'example-hps-bauhaus': 0.4195,
  'example-audio-jingle': 0.4161,
  'example-html-ppt-zhangzara-scatterbrain': 0.4114,
  'video-template-luxury-supercar-cinematic-narrative': 0.4113,
  'example-html-ppt-weekly-report': 0.4105,
  'image-template-profile-avatar-anime-girl-to-cinematic-photo': 0.4022,
  'example-huashu-golden-circle': 0.4004,
  'example-html-ppt-tech-sharing': 0.3934,
  'example-docs-page': 0.3932,
  'example-image-poster': 0.3931,
  'example-html-ppt-zhangzara-block-frame': 0.3928,
  'example-hps-true-blueprint': 0.3927,
  'example-html-ppt-zhangzara-cobalt-grid': 0.3893,
  'image-template-3d-stone-staircase-evolution-infographic': 0.3892,
  'example-html-ppt-zhangzara-sakura-chroma': 0.3887,
  'image-template-illustrated-city-food-map': 0.3832,
  'example-open-design-landing-deck': 0.3796,
  'example-trading-analysis-dashboard-template': 0.3789,
  'video-template-frame-logo-outro': 0.3787,
  'image-template-illustration-crayon-kid-drawing-rework': 0.3783,
  'image-template-notion-team-dashboard-live-artifact': 0.375,
  'example-huashu-pentagram-grid': 0.3727,
  'image-template-social-media-post-showa-day-retro-culture-magazine-cover': 0.372,
  'example-frontend-slides': 0.3714,
  'example-webgl-aurora-veil': 0.3709,
  'example-huashu-sparkline-arc': 0.3705,
  'example-deck-swiss-international': 0.3703,
  'example-html-ppt-graphify-dark-graph': 0.3683,
  'example-pm-spec': 0.3679,
  'example-social-media-dashboard': 0.3641,
  'video-template-frame-liquid-bg-hero': 0.364,
  'example-github-dashboard': 0.3623,
  'example-finance-report': 0.3618,
  'image-template-game-screenshot-anime-fighting-game-captain-ryuuga-vs-kaze-renshin': 0.3608,
  'video-template-3d-animated-boy-building-lego': 0.3586,
  'video-template-frame-bold-poster': 0.3586,
  'video-template-frame-glitch-title': 0.3581,
  'image-template-infographic-otaku-dance-choreography-breakdown-gokurakujodo-16-panels': 0.358,
  'image-template-momotaro-explainer-slide-in-hybrid-style': 0.3565,
  'example-frame-logo-outro': 0.3485,
  'example-invoice': 0.3475,
  'video-template-frame-build-minimal': 0.3454,
  'example-huashu-luxe-whitespace': 0.3452,
  'example-html-ppt-zhangzara-signal': 0.3439,
  'example-eng-runbook': 0.3437,
  'example-hps-memphis-pop': 0.3414,
  'example-html-ppt-obsidian-claude-gradient': 0.3414,
  'example-html-ppt-zhangzara-blue-professional': 0.3412,
  'example-html-ppt-presenter-mode-reveal': 0.3408,
  'image-template-profile-avatar-cinematic-south-asian-male-portrait-with-vultures': 0.3402,
  'example-hps-y2k-chrome': 0.3396,
  'example-huashu-annual-letter': 0.3355,
  'video-template-a-decade-of-refinement-glow-up': 0.3336,
  'example-critique': 0.3316,
  'video-template-cinematic-east-asian-woman-hand-dance': 0.3276,
  'example-webgl-distortion-grain': 0.3241,
  'example-frame-flowchart-sticky': 0.3216,
  'example-kami-deck': 0.3199,
  'example-video-shortform': 0.3173,
  'video-template-forbidden-city-cat-satire': 0.3115,
  'video-template-frame-light-leak-cinema': 0.3112,
};

// Templates with no renderable preview — suppressed from the visual gallery
// grid so they never show as an empty letter card. They still reach users
// through the composer's mode picker. Repo-derived (baked manifest + on-disk
// `od.preview` entry existence), refreshed alongside the scores above.
export const PLUGIN_NO_PREVIEW: readonly string[] = [
  'example-dcf-valuation',
  'example-design-brief',
  'example-hatch-pet',
  'example-html-ppt',
  'example-hyperframes',
  'example-last30days',
  'example-live-artifact',
  'example-pptx-html-fidelity-audit',
  'example-x-research',
];
