#!/usr/bin/env node
/* Flow v2 — systematic WCAG contrast audit.
   Loads every screen × state × theme in headless Chromium and measures the
   rendered contrast of every visible text element (canvas-resolved colors,
   effective background via alpha compositing, incl. gradients flagged for
   review). Fails below 4.5:1 for normal text, 3:1 for large text.
   Usage: node check-contrast.mjs [--quick]  (—quick = first state per screen) */
import { chromium } from 'playwright-core';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = new URL('.', import.meta.url).pathname;
const SHELL = process.env.CHROMIUM ||
  '/Users/valentinyakovlev/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const QUICK = process.argv.includes('--quick');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.md': 'text/plain' };

const server = http.createServer(async (req, res) => {
  try {
    const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^\/+/, '');
    const file = join(ROOT, p || 'index.html');
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ executablePath: SHELL });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
const manifest = await page.evaluate(() => window.V2_MANIFEST);
const screens = manifest.zones.flatMap(z => z.screens);

const AUDIT_FN = `(() => {
  const cnv = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const cache = new Map();
  function rgb(str) {
    if (cache.has(str)) return cache.get(str);
    cnv.clearRect(0, 0, 1, 1);
    cnv.fillStyle = '#010203'; cnv.fillStyle = str;
    if (cnv.fillStyle === '#010203' && str.toLowerCase() !== '#010203' && str !== 'rgb(1,2,3)') { cache.set(str, null); return null; }
    cnv.fillRect(0, 0, 1, 1);
    const d = cnv.getImageData(0, 0, 1, 1).data;
    const out = [d[0], d[1], d[2], d[3] / 255];
    cache.set(str, out); return out;
  }
  function over(fg, bg) { const a = fg[3] + bg[3] * (1 - fg[3]); if (!a) return [0,0,0,0];
    return [ (fg[0]*fg[3] + bg[0]*bg[3]*(1-fg[3]))/a, (fg[1]*fg[3] + bg[1]*bg[3]*(1-fg[3]))/a, (fg[2]*fg[3] + bg[2]*bg[3]*(1-fg[3]))/a, a ]; }
  function lum(c) { const f = v => { v /= 255; return v <= 0.04045 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); };
    return 0.2126*f(c[0]) + 0.7152*f(c[1]) + 0.0722*f(c[2]); }
  function ratio(a, b) { const l1 = lum(a), l2 = lum(b); return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05); }
  function effBg(el) {
    const stack = []; let gradImg = null; let layersBeforeGrad = -1;
    for (let n = el; n && n !== document.documentElement.parentElement; n = n === document.body ? document.documentElement : n.parentElement) {
      if (!n || !n.tagName) break;
      const cs = getComputedStyle(n);
      if (!gradImg && (cs.backgroundImage||'').includes('gradient')) { gradImg = cs.backgroundImage; layersBeforeGrad = stack.length; }
      const b = rgb(cs.backgroundColor);
      if (b && b[3] > 0) stack.push(b);
      if (n === document.documentElement) break;
    }
    let base = [255,255,255,1];
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    if (gradImg && layersBeforeGrad > 0) {
      /* gradient ancestor fully hidden when layers above it are already opaque */
      let occ = [0,0,0,0];
      for (let i = layersBeforeGrad - 1; i >= 0; i--) occ = over(stack[i], occ);
      if (occ[3] >= 0.98) gradImg = null;
    }
    return { c: base, gradImg };
  }
  const out = [];
  const sel = 'h1,h2,h3,h4,h5,h6,p,span,a,button,td,th,label,li,dt,dd,small,legend,caption,summary,input,textarea,select,option,[role=button]';
  for (const el of document.querySelectorAll(sel)) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility !== 'visible' || !cs.opacity || +cs.opacity === 0) continue;
    let hiddenByAncestor = false;
    for (let n = el.parentElement; n; n = n.parentElement) {
      const a = getComputedStyle(n);
      if (a.display === 'none' || a.visibility !== 'visible' || +a.opacity === 0) { hiddenByAncestor = true; break; }
    }
    if (hiddenByAncestor) continue;
    let txt = '';
    for (const n of el.childNodes) if (n.nodeType === 3) txt += n.textContent;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') txt = el.placeholder || '';
    if (!txt.trim()) continue;
    const fg = rgb(cs.color); if (!fg) continue;
    const bg = effBg(el);
    const fs = parseFloat(cs.fontSize), fw = parseInt(cs.fontWeight) || 400;
    const large = fs >= 24 || (fs >= 18.66 && fw >= 700);
    let cr = null;
    if (bg.gradImg) {
      const gradStops = [...bg.gradImg.matchAll(/(?:oklch|oklab|lab|lch|rgba?|color)\([^)]*\)|#[0-9a-fA-F]{3,8}/g)]
        .map(m => rgb(m[0])).filter(c => c && c[3] > 0.9);
      if (gradStops.length) cr = Math.min.apply(null, gradStops.map(s => ratio(fg[3] < 1 ? over(fg, s) : fg, s)));
    } else {
      cr = ratio(fg[3] < 1 ? over(fg, bg.c) : fg, bg.c);
    }
    out.push({ t: txt.trim().slice(0, 48), r: cr === null ? null : +cr.toFixed(2), fs, fw, large,
      fg: cs.color, bgc: 'rgb(' + bg.c.slice(0,3).map(Math.round).join(',') + ')', grad: bg.gradImg && cr === null,
      cls: (typeof el.className === 'string' ? el.className : '').slice(0, 60), tag: el.tagName.toLowerCase() });
  }
  return out;
})()`;

const fails = [], warns = [], grads = new Set();
let pv = 0, el = 0;
for (const theme of ['light', 'dark']) {
  for (const s of screens) {
    const states = QUICK ? [s.states[0]] : s.states;
    for (const st of states) {
      await page.goto(`${BASE}/${s.file}?state=${st}&theme=${theme}&chrome=0`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(120);
      const rows = await page.evaluate(AUDIT_FN);
      pv++; el += rows.length;
      for (const x of rows) {
        const lim = x.large ? 3 : 4.5;
        const rec = `${s.file} [${st}/${theme}] ${x.tag}.${x.cls} "${x.t}" ${x.r}:1 fg=${x.fg} bg=${x.bgc}`;
        if (x.grad) { grads.add(`${s.file} ${x.tag}.${x.cls} "${x.t.slice(0,30)}"`); continue; }
        if (x.r < lim) fails.push(rec);
        else if (!x.large && x.r < 5.5) warns.push(rec); /* watch-zone */
      }
    }
  }
}
await browser.close(); server.close();
console.log(`audited ${pv} pageviews · ${el} text elements`);
if (grads.size) console.log(`\nGRADIENT-BG (manual review):\n${[...grads].join('\n')}`);
if (warns.length) console.log(`\nWATCH 4.5–5.5:\n${warns.join('\n')}`);
if (fails.length) { console.log(`\nFAIL <${'4.5/3.0'}:\n${fails.join('\n')}`); process.exit(1); }
console.log('\nCONTRAST: ALL PASS');
