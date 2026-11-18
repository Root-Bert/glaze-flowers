// Writes dicebear/glaze-flowers.json – the same parts as src/flowers.mjs, as a DiceBear style definition.
// Usage: node scripts/dicebear.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { createFlower, FLOWERS, EYES, MOUTHS, SCENES, BACKGROUNDS, COLORS } from '../src/flowers.mjs';

// Tiny parser for the well-formed markup the generator emits: tags with quoted attributes, no text nodes.
function parse(svg) {
  const root = { children: [] };
  const stack = [root];
  for (const [, close, name, attrs, selfClose] of svg.matchAll(/<(\/?)([\w]+)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g)) {
    if (close) {
      stack.pop();
      continue;
    }
    const node = { type: 'element', name };
    const attributes = Object.fromEntries([...attrs.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, k, v]) => [k, v]));
    if (Object.keys(attributes).length) node.attributes = attributes;
    stack.at(-1).children.push(node);
    if (!selfClose) {
      node.children = [];
      stack.push(node);
    }
  }
  return root.children;
}

const g = (attributes, children) => ({ type: 'element', name: 'g', attributes, children });
const component = (name, attributes) => ({ type: 'component', name, ...(attributes ? { attributes } : {}) });
const BOX = { width: 200, height: 200 };

// The filters come straight out of a rendered avatar, so both outputs share one source.
const sample = createFlower({ seed: 'glaze' });
const filters = parse(sample.match(/<defs>([\s\S]*?)<\/defs>/)[1]).filter((n) => n.name === 'filter');
const id = (k) => ({ p: 'paint', s: 'stem', b: 'scene', g: 'glaze' })[k];
for (const fl of filters) fl.attributes.id = `glaze-flowers-${id(fl.attributes.id.at(-1))}`;
const filter = (k) => `url(#glaze-flowers-${k})`;

const flowerVariants = {};
for (const [name, make] of Object.entries(FLOWERS)) {
  const part = make();
  const at = { transform: `translate(${part.face[0]} ${part.face[1]})` };
  flowerVariants[name] = {
    elements: [
      g({ transform: 'translate(100 100) scale(1.12)' }, [
        g({ filter: filter('paint') }, [...parse(part.paint), g(at, [component('cheeks')])]),
        g({ filter: filter('glaze') }, [...parse(part.glaze), g(at, [component('eyes'), component('mouth')])]),
      ]),
    ],
  };
}

const variants = (parts, render) => Object.fromEntries(Object.keys(parts).map((k) => [k, { elements: parse(render(parts[k])) }]));

const definition = {
  $schema: 'https://cdn.hopjs.net/npm/@dicebear/schema@2.1.0/dist/definition.min.json',
  meta: {
    license: { name: 'CC0 1.0', url: 'https://creativecommons.org/publicdomain/zero/1.0/' },
    creator: { name: 'Robert Hofmann', url: 'https://github.com/Root-Bert' },
    source: { name: 'Glaze Flowers', url: 'https://github.com/Root-Bert/glaze-flowers' },
  },
  canvas: {
    ...BOX,
    elements: [
      { type: 'element', name: 'defs', children: filters },
      component('scene'),
      ...parse(sample.match(/<path d="M92,118[^>]*\/>/)[0]).map((n) => ({ ...n, attributes: { ...n.attributes, filter: filter('stem') } })),
      component('flower', { transform: 'translate(0 -16)' }),
    ],
  },
  components: {
    scene: {
      ...BOX,
      probability: 45,
      variants: Object.fromEntries(
        Object.entries(SCENES).map(([name, make]) => {
          const s = make();
          return [name, { elements: [...parse(`<rect width="200" height="200" fill="${s.base}"/>`), g({ filter: filter('scene') }, parse(s.paint))] }];
        }),
      ),
    },
    flower: { ...BOX, rotate: { min: -5, max: 5 }, variants: flowerVariants },
    eyes: { ...BOX, variants: variants(EYES, (fn) => fn(COLORS.glaze, COLORS.white)) },
    mouth: { ...BOX, variants: variants(MOUTHS, (fn) => fn(COLORS.glaze)) },
    cheeks: {
      ...BOX,
      probability: 50,
      variants: {
        blush: {
          elements: parse(
            `<g fill="${COLORS.blush}" opacity=".75"><ellipse cx="-29" cy="7" rx="7.5" ry="4.8"/><ellipse cx="29" cy="7" rx="7.5" ry="4.8"/></g>`,
          ),
        },
      },
    },
  },
  colors: { background: { values: Object.values(BACKGROUNDS) } },
};

const dir = new URL('../dicebear/', import.meta.url).pathname;
mkdirSync(dir, { recursive: true });
writeFileSync(dir + 'glaze-flowers.json', JSON.stringify(definition, null, 2) + '\n');
console.log('dicebear/glaze-flowers.json', Object.keys(flowerVariants).length, 'flowers');
