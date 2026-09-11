import fs from 'node:fs';
const css = fs.readFileSync('assets/tokens-v2.css', 'utf8');
const rel = [...css.matchAll(/url\(\s*(['"]?)(?!data:|https?:|#)([^'")]+)\1\s*\)/g)].map(m => m[2]);
console.log('remaining relative url():', rel);
console.log('css size KB:', (fs.statSync('assets/tokens-v2.css').size / 1024).toFixed(0));
const left = [];
for (const f of fs.readdirSync('.').filter(f => f.endsWith('.html'))) {
  const t = fs.readFileSync(f, 'utf8');
  for (const m of t.matchAll(/src="(assets\/[^"]+)"/g)) left.push(f + ' -> ' + m[1]);
}
console.log('remaining <img src assets>:', left);
for (const f of fs.readdirSync('assets').filter(f => f.endsWith('.js'))) {
  const t = fs.readFileSync('assets/' + f, 'utf8');
  const hits = t.match(/['"]assets\/[^'"]+\.(svg|png|jpg)['"]/g);
  if (hits) console.log(f, 'left:', hits.slice(0, 6));
}
