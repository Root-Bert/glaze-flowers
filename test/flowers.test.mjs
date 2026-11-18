import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Avatar, Style } from '@dicebear/core';
import { createFlower, createFlowerDataUri, FLOWERS, EYES, MOUTHS, BACKGROUNDS, SCENES } from '../src/flowers.mjs';

test('a seed always gives the same flower, parts can be set, every part renders', () => {
  assert.equal(createFlower({ seed: 'Robert' }), createFlower({ seed: 'Robert' }));
  assert.notEqual(createFlower({ seed: 'Robert' }), createFlower({ seed: 'Mia' }));
  for (const flower of Object.keys(FLOWERS))
    for (const eyes of Object.keys(EYES))
      for (const mouth of Object.keys(MOUTHS)) {
        const svg = createFlower({ seed: 'x', flower, eyes, mouth });
        assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 200 200"/);
        assert.match(svg, new RegExp(`data-flower="${flower}"`));
        assert.doesNotMatch(svg, /undefined|NaN/);
      }
  for (const background of [...Object.keys(BACKGROUNDS), ...Object.keys(SCENES), 'auto', 'transparent', '#123456'])
    assert.doesNotMatch(createFlower({ seed: 'x', background }), /undefined|NaN/);
  assert.doesNotMatch(createFlower({ seed: 'x', texture: false }), /<filter/);
  assert.match(createFlower({ seed: 'x', size: 64, radius: 50 }), /width="64" height="64".*clip-path/s);
  assert.match(createFlowerDataUri({ seed: 'x' }), /^data:image\/svg\+xml;utf8,%3Csvg/);
});

test('the DiceBear definition is up to date, passes the schema and renders', async () => {
  const file = new URL('../dicebear/glaze-flowers.json', import.meta.url);
  const before = readFileSync(file, 'utf8');
  await import('../scripts/dicebear.mjs');
  assert.equal(readFileSync(file, 'utf8'), before, 'run `npm run build` and commit dicebear/glaze-flowers.json');
  const style = new Style(JSON.parse(before));
  const svg = new Avatar(style, { seed: 'Robert' }).toString();
  assert.equal(svg, new Avatar(style, { seed: 'Robert' }).toString());
  assert.match(svg, /glaze-flowers-glaze/);
  assert.doesNotMatch(svg, /undefined|NaN/);
});
