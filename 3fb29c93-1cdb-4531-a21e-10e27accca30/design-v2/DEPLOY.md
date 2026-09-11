# Deploying design-v2 to Vercel

The atlas is a plain static site — no build step, no framework.

## Recommended: workspace root as the site root

Deploy the whole project folder (the directory that contains `design-v2/`,
`design-copy/`, `assets/`). The included `vercel.json` redirects `/` to
`/design-v2/` so the atlas is the landing page, and the atlas's "v1 copy ↗"
links keep working because `design-copy/` deploys alongside.

- Framework preset: **Other** (no build command, no output directory).
- Atlas URL: `https://<site>/design-v2/` (also reachable at `/` via redirect).

## Alternative: design-v2 as the site root

If you want the atlas at `https://<site>/` directly, set **Root Directory**
to `design-v2/` (or `vercel deploy` from inside it). `design-v2/vercel.json`
already pins `cleanUrls`/`trailingSlash` off. Note: "v1 copy ↗" links point
to `../design-copy/` and will 404 in this mode — deploy the workspace root
instead if you need them.

## If screens 404 inside the atlas iframe

The atlas resolves screen URLs relative to its own directory — this works at
`/`, `/design-v2`, `/design-v2/`, and `/design-v2/index.html`. If an iframe
still shows `NOT_FOUND`, the screen files are simply not in the deployment:
check that the pushed branch contains `design-v2/*.html`
(`git ls-remote` / the repo UI), then redeploy.
