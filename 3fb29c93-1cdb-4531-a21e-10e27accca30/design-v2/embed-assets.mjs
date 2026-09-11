#!/usr/bin/env node
// Embeds every relative asset reference (CSS url() + <img src> + JS string
// literals pointing at assets/) as base64 data URIs so the screens stay
// self-contained under any document base (data:, srcdoc, raw endpoint).
// Idempotent: data: URIs are skipped on re-run. Run from design-v2/.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const MIME = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const dataUri = (rel) => {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return null;
  return `data:${MIME[path.extname(abs)] || 'application/octet-stream'};base64,${fs.readFileSync(abs).toString('base64')}`;
};

let replaced = 0, missing = 0;

// 1) tokens-v2.css — url('…') -> url("data:…")
const cssPath = path.join(ROOT, 'assets/tokens-v2.css');
let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(/url\(\s*(['"]?)(?!data:|https?:|#)([^'")]+)\1\s*\)/g, (m, _q, rel) => {
  const uri = dataUri('assets/' + rel.trim());
  if (!uri) { missing++; console.log('  ! missing', rel); return m; }
  replaced++;
  return `url("${uri}")`;
});
fs.writeFileSync(cssPath, css);

// 2) HTML files — src="assets/….svg|png" -> data URI (skip .css/.js links)
for (const f of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const p = path.join(ROOT, f);
  let t = fs.readFileSync(p, 'utf8'), before = t;
  t = t.replace(/src="(assets\/[^"?#]+\.(?:svg|png|jpg))"/g, (m, rel) => {
    const uri = dataUri(rel);
    if (!uri) { missing++; console.log('  ! missing', f, rel); return m; }
    replaced++;
    return `src="${uri}"`;
  });
  if (t !== before) fs.writeFileSync(p, t);
}

// 3) JS asset files — 'assets/….svg|png' string literals -> data URI
for (const f of fs.readdirSync(path.join(ROOT, 'assets')).filter(f => f.endsWith('.js'))) {
  const p = path.join(ROOT, 'assets', f);
  let t = fs.readFileSync(p, 'utf8'), before = t;
  t = t.replace(/(['"])(assets\/[^'"?#]+\.(?:svg|png|jpg))\1/g, (m, q, rel) => {
    const uri = dataUri(rel);
    if (!uri) { missing++; console.log('  ! missing', f, rel); return m; }
    replaced++;
    return q + uri + q;
  });
  if (t !== before) fs.writeFileSync(p, t);
}

console.log(`embedded ${replaced} refs, missing ${missing}`);
