// Writes docs/index.html (gallery, served by GitHub Pages) and docs/svg/*.svg (one sample per flower).
// Usage: node scripts/build.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { createFlower, FLOWERS, EYES, MOUTHS, BACKGROUNDS, SCENES } from '../src/flowers.mjs';

const docs = new URL('../docs/', import.meta.url).pathname;
mkdirSync(docs + 'svg', { recursive: true });

const eyes = Object.keys(EYES);
const mouths = Object.keys(MOUTHS);
const fig = (svg, caption) => `<figure>${svg}${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
const row = (title, cells) => `<section><h3>${title}</h3><div class="row">${cells.join('')}</div></section>`;

const flowers = Object.keys(FLOWERS).map((flower) => {
  writeFileSync(`${docs}svg/${flower}.svg`, createFlower({ seed: flower, flower }));
  return row(
    flower,
    eyes.map((e, i) =>
      fig(createFlower({ seed: `${flower}-${e}`, flower, eyes: e, mouth: mouths[i % mouths.length], cheeks: i % 2 === 0 }), e),
    ),
  );
});

const demo = [
  ['star', 'dot'],
  ['tulipPurple', 'arc'],
  ['disc', 'googly'],
  ['cornflower', 'big'],
  ['bandBall', 'wink'],
];
const backgrounds = [...Object.keys(BACKGROUNDS), ...Object.keys(SCENES)].map((name) =>
  row(
    name,
    demo.map(([flower, e], i) => fig(createFlower({ seed: `${name}-${flower}`, flower, eyes: e, background: name, radius: i > 2 ? 50 : 0 }))),
  ),
);

const names = ['Robert', 'Mia', 'Jonas', 'Aylin', 'Tom', 'Lena', 'Noah', 'Ida', 'Paul', 'Emma', 'Ben', 'Zoe', 'Ada', 'Max', 'Lia', 'Kai'];
const seeded = names.map((n) => fig(createFlower({ seed: n, background: 'auto', radius: 50 }), n));
const small = names.map((n) => `<span class="s">${createFlower({ seed: n, background: 'auto', radius: 50 })}</span>`);

writeFileSync(
  docs + 'index.html',
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Glaze Flowers – happy flower avatars</title>
<style>
body{margin:0 auto;padding:32px 20px 64px;max-width:860px;background:#fbf8ef;color:#3a1d15;font:15px/1.5 ui-rounded,system-ui,sans-serif}
h1{font-size:28px;margin:0 0 4px}h2{font-size:19px;margin:48px 0 12px}
h3{font-size:13px;margin:0;width:104px;flex:none;font-weight:600}
p{margin:0 0 16px}a{color:inherit}code{background:#f0e7cf;padding:1px 5px;border-radius:5px;font-size:13px}
pre{background:#f0e7cf;padding:12px 14px;border-radius:10px;overflow:auto;font-size:13px}
section{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.row,.grid{display:flex;gap:12px;flex-wrap:wrap}
figure{margin:0;text-align:center}figure svg{width:124px;height:124px;display:block;border-radius:14px}
figcaption{font-size:11px;opacity:.6;margin-top:3px}
.s svg{width:40px;height:40px;margin-right:8px}
#hero{margin-top:24px}
</style>
<h1>Glaze Flowers</h1>
<p>Happy flower avatars in the look of a hand-painted, glazed ceramic vase. One seed, one flower. Free to use, no credit needed (CC0).
<a href="https://github.com/Root-Bert/glaze-flowers">GitHub</a></p>
<div id="hero" class="grid">${seeded.join('')}</div>
<h2>Use</h2>
<pre>npm install glaze-flowers

import { createFlower } from 'glaze-flowers';
const svg = createFlower({ seed: 'Robert', background: 'auto', radius: 50 });</pre>
<h2>Small (40 px)</h2><div>${small.join('')}</div>
<h2 id="flowers">Flowers × eyes</h2>${flowers.join('')}
<h2 id="backgrounds">Backgrounds</h2>${backgrounds.join('')}
</html>`,
);
console.log('docs/index.html', Object.keys(FLOWERS).length, 'flowers');
