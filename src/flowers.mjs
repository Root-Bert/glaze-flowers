// Flower avatars in the look of a hand-painted, glazed ceramic vase.
// Built like DiceBear: a seed picks from parts (flower, eyes, mouth, cheeks, background),
// and every part can also be set explicitly. The result is a self-contained SVG (200 × 200).

export const COLORS = {
  cream: '#F3EAD0',
  white: '#FAF4E1',
  stem: '#74A862',
  glaze: '#3A1D15',
  yellow: '#F1CB3C',
  blue: '#9CCBE8',
  mauve: '#A9718F',
  plum: '#8C4A6B',
  tan: '#D0926A',
  tanDark: '#B5754F',
  blush: '#E8998A',
  tongue: '#C9695B',
};

export const BACKGROUNDS = {
  cream: '#F3EAD0',
  lightBlue: '#DCEBF0',
  rose: '#F4DDD6',
  sage: '#DDE7CF',
  butter: '#F7E7AE',
  lilac: '#E6DCEA',
};

const f = (n) => Math.round(n * 10) / 10;
const pt = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [f(r * Math.sin(a)), f(-r * Math.cos(a))];
};

// Teardrop petal, points up at 0°, turns clockwise.
function petal(deg, len, w, inner = 0, attrs = '') {
  const d =
    `M0,${-inner} C${w},${f(-inner - (len - inner) * 0.25)} ${f(w * 0.85)},${f(-len * 0.9)} 0,${-len} ` +
    `C${f(-w * 0.85)},${f(-len * 0.9)} ${-w},${f(-inner - (len - inner) * 0.25)} 0,${-inner}Z`;
  return `<path d="${d}" transform="rotate(${deg})" ${attrs}/>`;
}
const petals = (angles, len, w, inner, attrs) => angles.map((a) => petal(a, len, w, inner, attrs)).join('');
const ring = (n, start = 0) => Array.from({ length: n }, (_, i) => start + (360 / n) * i);
const dots = (r, from, to, n, size, attrs = '') =>
  Array.from({ length: n }, (_, i) => {
    const [x, y] = pt(r, from + ((to - from) * i) / (n - 1));
    return `<circle cx="${x}" cy="${y}" r="${size}" ${attrs}/>`;
  }).join('');
const line = (d, w = 6, extra = '') =>
  `<path d="${d}" fill="none" stroke="${COLORS.glaze}" stroke-width="${f(w * 1.35)}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

const TULIP =
  'M-44,-42 Q-30,-36 -20,-20 Q-10,-46 0,-54 Q10,-46 20,-20 Q30,-36 44,-42 C50,0 34,44 0,44 C-34,44 -50,0 -44,-42Z';

// Painted backgrounds: base = ground colour, paint = brush shapes on top (canvas 200 × 200, edges overlap generously).
const SKY = '#D3E8F2';
const MEADOW = 'M-20,142 C24,130 66,148 108,138 C150,129 184,142 220,135 L220,220 L-20,220Z';
const MEADOW_LOW = '<path d="M-20,172 C40,160 96,176 150,166 C180,161 200,168 220,164 L220,220 L-20,220Z" fill="#A6CC7C" opacity=".85"/>';
const tufts = (list) =>
  list
    .map(
      ([x, y, k = 1]) =>
        `<path d="M${x},${y} l${-5 * k},${-11 * k} M${x},${y} l0,${-14 * k} M${x},${y} l${5 * k},${-11 * k}" fill="none" stroke="#7FB05E" stroke-width="${f(3 * k)}" stroke-linecap="round"/>`,
    )
    .join('');
const cloud = (x, y, k = 1, fill = COLORS.white) =>
  `<g transform="translate(${x} ${y}) scale(${k})" fill="${fill}"><ellipse cx="0" cy="6" rx="30" ry="10"/><circle cx="-12" cy="0" r="11"/><circle cx="4" cy="-6" r="14"/><circle cx="18" cy="2" r="9"/></g>`;
const TUFTS = [[22, 160], [58, 186, 1.2], [150, 158], [178, 188, 1.2], [128, 192], [36, 196]];

export const SCENES = {
  // Meadow under a pale sky
  meadow: () => ({
    base: SKY,
    paint: `<path d="${MEADOW}" fill="#BBD88C"/>${MEADOW_LOW}${tufts(TUFTS)}`,
  }),
  // Meadow with hills on the horizon
  meadowHills: () => ({
    base: SKY,
    paint:
      `<path d="M-20,150 C10,96 60,96 92,140 L92,220 L-20,220Z" fill="#CFE2A8"/>` +
      `<path d="M96,150 C126,104 176,100 220,138 L220,220 L96,220Z" fill="#C6DD9C"/>` +
      `<path d="${MEADOW}" fill="#BBD88C"/>${MEADOW_LOW}${tufts(TUFTS.slice(0, 4))}`,
  }),
  // Meadow with small flower dots
  meadowFlowers: () => ({
    base: SKY,
    paint:
      `<path d="${MEADOW}" fill="#BBD88C"/>${MEADOW_LOW}${tufts(TUFTS.slice(0, 3))}` +
      [[18, 176, COLORS.yellow], [44, 158, COLORS.white], [66, 190, COLORS.blush], [140, 180, COLORS.white], [164, 156, COLORS.yellow], [184, 184, COLORS.blush], [126, 160, COLORS.blue], [30, 194, COLORS.blue]]
        .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="4.6" fill="${c}"/>`)
        .join(''),
  }),
  // Sky with clouds
  sky: () => ({
    base: '#BFDDEE',
    paint: cloud(36, 44, 1.1) + cloud(170, 86, 0.95) + cloud(150, 176, 1.2) + cloud(22, 150, 0.8),
  }),
  // Sky with sun
  skySun: () => ({
    base: '#BFDDEE',
    paint:
      `<circle cx="164" cy="38" r="21" fill="${COLORS.yellow}"/>` +
      ring(8, 10)
        .map((a) => {
          const [x1, y1] = pt(28, a);
          const [x2, y2] = pt(38, a);
          return `<path d="M${f(164 + x1)},${f(38 + y1)} L${f(164 + x2)},${f(38 + y2)}" stroke="${COLORS.yellow}" stroke-width="5" stroke-linecap="round"/>`;
        })
        .join('') +
      cloud(34, 56, 1.1) +
      cloud(166, 158, 1),
  }),
  // Evening sky
  skyDusk: () => ({
    base: '#F6D7B4',
    paint:
      `<path d="M-20,-20 L220,-20 L220,58 C150,74 70,50 -20,70Z" fill="#D9B7D3"/>` +
      `<path d="M-20,150 C60,136 140,158 220,142 L220,220 L-20,220Z" fill="#F4B79A" opacity=".9"/>` +
      cloud(40, 96, 1, '#F7E3D0') +
      cloud(168, 118, 0.9, '#F7E3D0') +
      `<circle cx="160" cy="44" r="15" fill="#F9E6A8"/>`,
  }),
};

// Every flower: paint = brush shapes, glaze = dark brown glaze lines, face = offset of the face.
export const FLOWERS = {
  // Yellow star with veins and dots at the tips
  star: () => ({
    paint:
      petals(ring(5), 64, 21, 0, `fill="${COLORS.yellow}"`) +
      `<circle r="29" fill="${COLORS.yellow}"/>` +
      petals(ring(5), 50, 8, 30, `fill="#F8E27A" opacity=".7"`),
    glaze:
      ring(5)
        .map((a) => {
          const [x1, y1] = pt(33, a);
          const [x2, y2] = pt(50, a);
          return line(`M${x1},${y1} L${x2},${y2}`, 5.5);
        })
        .join('') + dots(60, 0, 288, 5, 3.6, `fill="${COLORS.glaze}"`),
    face: [0, 0],
  }),

  // Yellow and mauve ball with a row of dots along the bottom
  ball: () => ({
    paint:
      `<circle r="45" fill="#E7B63B"/>` +
      `<ellipse cx="-3" cy="-4" rx="33" ry="31" fill="${COLORS.mauve}" opacity=".85"/>` +
      `<path d="M-20,-8 C-18,-30 16,-30 20,-6 C24,16 -6,24 -10,6 C-12,-6 4,-10 6,0" fill="none" stroke="#E7B63B" stroke-width="5" stroke-linecap="round" opacity=".45"/>`,
    glaze: dots(46, 122, 238, 6, 6.2, `fill="${COLORS.glaze}"`),
    face: [0, -4],
  }),

  // Brown tulip with a scalloped rim
  tulipBrown: () => ({
    paint:
      `<path d="M-44,-30 C-48,10 -30,46 0,46 C30,46 48,10 44,-30 Q30,-50 15,-32 Q0,-54 -15,-32 Q-30,-50 -44,-30Z" fill="${COLORS.tan}"/>` +
      `<path d="M0,42 C-6,10 -22,-10 -32,-28 M0,42 C6,10 22,-10 32,-28 M0,42 L0,-30" fill="none" stroke="${COLORS.tanDark}" stroke-width="7" stroke-linecap="round" opacity=".45"/>`,
    glaze: line('M-45,-28 Q-30,-52 -15,-33 Q0,-56 15,-33 Q30,-52 45,-28', 7.5) + line('M-17,45 Q0,54 17,45', 8),
    face: [0, 4],
  }),

  // Yellow tulip with purple petals
  tulipPurple: () => ({
    paint:
      `<path d="${TULIP}" fill="${COLORS.yellow}"/>` +
      `<path d="${TULIP}" fill="${COLORS.plum}" opacity=".9" transform="translate(0 3) scale(.76)"/>` +
      `<path d="M0,38 Q-13,6 -16,-14 M0,38 Q13,6 16,-14" fill="none" stroke="${COLORS.yellow}" stroke-width="5" stroke-linecap="round"/>`,
    glaze: '',
    face: [0, 6],
    faceColor: COLORS.glaze,
    faceLight: true,
  }),

  // Pale tulip with a yellow rim and brown dabs at the tips
  tulipYellow: () => ({
    paint:
      `<path d="${TULIP}" fill="${COLORS.white}" stroke="${COLORS.yellow}" stroke-width="9" stroke-linejoin="round" transform="scale(.94)"/>`,
    glaze:
      petal(0, 50, 5, 34, `fill="${COLORS.glaze}"`) +
      petal(-44, 54, 5, 40, `fill="${COLORS.glaze}"`) +
      petal(44, 54, 5, 40, `fill="${COLORS.glaze}"`),
    face: [0, 6],
  }),

  // Blue blossom with a yellow centre and a brown zigzag rim
  cornflower: () => {
    const zz = Array.from({ length: 15 }, (_, i) => pt(i % 2 ? 47 : 59, -126 + i * 18).join(','));
    return {
      paint:
        petals(ring(8, 10), 56, 20, 0, `fill="${COLORS.blue}"`) +
        petals(ring(5, 20), 36, 13, 0, `fill="${COLORS.yellow}" opacity=".9"`) +
        `<circle r="24" fill="${COLORS.yellow}"/>`,
      glaze: line(`M${zz.join(' L')}`, 6),
      face: [0, 2],
    };
  },

  // Blue and yellow blossom with a wavy rim below and a pointed bud on top
  flame: () => ({
    paint:
      petals([-100, -55, 55, 100, 150, 210], 52, 21, 0, `fill="${COLORS.blue}"`) +
      petal(0, 66, 17, 0, `fill="${COLORS.blue}"`) +
      petals(ring(6, 30), 38, 14, 0, `fill="${COLORS.yellow}" opacity=".9"`) +
      `<circle r="25" fill="${COLORS.yellow}"/>`,
    glaze:
      line('M-9,-38 Q-15,-56 0,-68 Q15,-56 9,-38', 5) +
      `<circle cx="0" cy="-50" r="3.6" fill="${COLORS.glaze}"/>` +
      line('M-56,6 Q-58,26 -44,30 Q-46,48 -28,46 Q-18,60 0,50 Q18,60 28,46 Q46,48 44,30 Q58,26 56,6', 6.5),
    face: [0, 2],
  }),

  // Small blue and yellow blossom on a brown calyx star
  calyx: () => ({
    paint:
      petals([-90, -45, 0, 45, 90], 54, 19, 0, `fill="${COLORS.blue}"`) +
      petals([-68, -22, 22, 68], 44, 12, 0, `fill="${COLORS.yellow}" opacity=".9"`) +
      `<circle r="30" fill="${COLORS.yellow}"/>`,
    glaze:
      petals([128, 180, 232], 60, 13, 30, `fill="${COLORS.glaze}"`) +
      dots(40, 104, 256, 2, 4.5, `fill="${COLORS.glaze}"`),
    face: [0, -2],
  }),

  // Egg-shaped bud with a glaze cap and calyx
  bud: () => ({
    paint:
      `<path d="M0,-52 C28,-52 41,-10 39,14 C37,38 20,48 0,48 C-20,48 -37,38 -39,14 C-41,-10 -28,-52 0,-52Z" fill="#D9A273"/>` +
      `<path d="M-14,-30 C-22,-6 -20,20 -8,38 M12,-34 C22,-8 20,18 10,38" fill="none" stroke="${COLORS.tanDark}" stroke-width="7" stroke-linecap="round" opacity=".35"/>`,
    glaze:
      `<path d="M-25,-34 Q0,-64 25,-34 Q25,-22 20,-24 Q16,-30 12,-30 Q9,-14 5,-30 Q0,-33 -5,-30 Q-9,-16 -13,-30 Q-17,-30 -20,-24 Q-25,-22 -25,-34Z" fill="${COLORS.glaze}"/>` +
      `<path d="M-33,28 Q0,66 33,28 Q0,46 -33,28Z" fill="${COLORS.glaze}" stroke="${COLORS.glaze}" stroke-width="4" stroke-linejoin="round"/>`,
    face: [0, 2],
  }),

  // Mauve ball with a glaze band and yellow dots
  bandBall: () => ({
    paint:
      `<circle r="44" fill="${COLORS.mauve}"/>` +
      `<path d="M-26,-14 C-10,-30 14,-28 26,-12 M-30,8 C-12,-2 12,-2 30,8" fill="none" stroke="#C99AB2" stroke-width="8" stroke-linecap="round" opacity=".6"/>` +
      dots(35, -52, 52, 5, 4.6, `fill="${COLORS.yellow}"`),
    glaze: line('M-41,16 Q0,36 41,16', 9),
    face: [0, -12],
  }),

  // Round disc with a glaze arc on top and a ring of dots below
  disc: () => {
    const [ax, ay] = pt(47, -72);
    return {
      paint:
        `<circle r="45" fill="${COLORS.tan}"/>` +
        `<path d="M-24,-20 C-8,-32 12,-30 26,-16 M-28,4 C-10,-6 12,-6 30,6" fill="none" stroke="#DDA883" stroke-width="9" stroke-linecap="round" opacity=".5"/>`,
      glaze:
        line(`M${ax},${f(ay + 16)} L${ax},${ay} A47,47 0 0 1 ${-ax},${ay} L${-ax},${f(ay + 16)}`, 9) +
        dots(46, 112, 248, 9, 4.6, `fill="${COLORS.glaze}"`),
      face: [0, 0],
    };
  },
};

// Eyes – always happy. c = glaze colour, hi = highlight.
export const EYES = {
  dot: (c, hi) =>
    [-16, 16]
      .map((x) => `<circle cx="${x}" cy="-6" r="7.4" fill="${c}"/><circle cx="${x - 2}" cy="-8.4" r="2" fill="${hi}"/>`)
      .join(''),
  arc: (c) =>
    [-16, 16]
      .map(
        (x) =>
          `<path d="M${x - 7.5},-3 Q${x},-14 ${x + 7.5},-3" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`,
      )
      .join(''),
  big: (c, hi) =>
    [-16, 16]
      .map(
        (x) =>
          `<ellipse cx="${x}" cy="-7" rx="7" ry="9.6" fill="${c}"/><circle cx="${x - 2.2}" cy="-10.6" r="2.8" fill="${hi}"/><circle cx="${x + 2.4}" cy="-4" r="1.3" fill="${hi}"/>`,
      )
      .join(''),
  googly: (c, hi) =>
    [-16, 16]
      .map(
        (x) =>
          `<circle cx="${x}" cy="-7" r="9.6" fill="${hi}" stroke="${c}" stroke-width="3.4"/><circle cx="${x + 1.6}" cy="-5.6" r="4.6" fill="${c}"/>`,
      )
      .join(''),
  wink: (c, hi) =>
    `<circle cx="-16" cy="-6" r="7.4" fill="${c}"/><circle cx="-18" cy="-8.4" r="2" fill="${hi}"/>` +
    `<path d="M8.5,-3 Q16,-14 23.5,-3" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`,
};

export const MOUTHS = {
  smile: (c) => `<path d="M-11,11 Q0,22 11,11" fill="none" stroke="${c}" stroke-width="6.6" stroke-linecap="round"/>`,
  wide: (c) => `<path d="M-16,8 Q0,27 16,8" fill="none" stroke="${c}" stroke-width="6.6" stroke-linecap="round"/>`,
  open: (c) =>
    `<path d="M-13,9 Q0,32 13,9Z" fill="${c}" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>` +
    `<ellipse cx="0" cy="20" rx="5.4" ry="3.6" fill="${COLORS.tongue}"/>`,
  small: (c) => `<path d="M-6.5,12 Q0,20 6.5,12" fill="none" stroke="${c}" stroke-width="6.6" stroke-linecap="round"/>`,
};

function hash(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  // Final mix, otherwise short seeds of equal length land on the same parts.
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}
function prng(seed) {
  let a = hash(seed);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (rnd, list) => list[Math.floor(rnd() * list.length)];

/**
 * @param {object} o
 * @param {string} [o.seed]        decides everything that is not set explicitly
 * @param {keyof FLOWERS} [o.flower]
 * @param {keyof EYES} [o.eyes]
 * @param {keyof MOUTHS} [o.mouth]
 * @param {boolean} [o.cheeks]
 * @param {keyof BACKGROUNDS|keyof SCENES|string} [o.background] colour name, scene (meadow…, sky…), any CSS colour, 'auto' (picked by the seed) or 'transparent'
 * @param {boolean} [o.texture]    false = flat shapes without filters (for Figma import or very small sizes)
 * @param {number} [o.radius]      corner radius in percent (50 = circle)
 * @param {number} [o.size]
 */
export function createFlower(o = {}) {
  const seed = o.seed ?? 'flower';
  const rnd = prng(seed);
  // The order of draws stays fixed so a seed keeps its avatar when options are added.
  const flower = pick(rnd, Object.keys(FLOWERS));
  const eyes = pick(rnd, Object.keys(EYES));
  const mouth = pick(rnd, Object.keys(MOUTHS));
  const cheeks = rnd() < 0.5;
  const tilt = f((rnd() - 0.5) * 10);
  const noise = Math.floor(rnd() * 900) + 1;
  const autoBg = pick(rnd, [...Object.keys(BACKGROUNDS), ...Object.keys(SCENES)]);

  const name = o.flower ?? flower;
  const part = FLOWERS[name]();
  const texture = o.texture ?? true;
  const bgKey = o.background === 'auto' ? autoBg : (o.background ?? 'cream');
  const scene = SCENES[bgKey]?.();
  const bg = scene ? scene.base : bgKey === 'transparent' ? null : (BACKGROUNDS[bgKey] ?? bgKey);
  const id = `b${hash(seed + name).toString(36)}`;
  const c = COLORS.glaze;
  const hi = COLORS.white;
  const [fx, fy] = part.face;
  const showCheeks = o.cheeks ?? cheeks;
  const radius = o.radius ?? 0;
  const size = o.size ? ` width="${o.size}" height="${o.size}"` : '';

  const defs = texture
    ? `<defs>
<filter id="${id}p" x="-20%" y="-20%" width="140%" height="140%">
<feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="${noise}" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" result="d"/>
<feTurbulence type="fractalNoise" baseFrequency=".018 .11" numOctaves="3" seed="${noise + 7}" result="s"/>
<feColorMatrix in="s" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.2 0 0 0 .38" result="a"/>
<feComposite in="d" in2="a" operator="in"/>
</filter>
<filter id="${id}s" x="-60%" y="-10%" width="220%" height="120%">
<feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="2" seed="${noise + 3}" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="8" xChannelSelector="R" yChannelSelector="G" result="d"/>
<feTurbulence type="fractalNoise" baseFrequency=".16 .012" numOctaves="3" seed="${noise + 11}" result="s"/>
<feColorMatrix in="s" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.2 0 0 0 .36" result="a"/>
<feComposite in="d" in2="a" operator="in"/>
</filter>
<filter id="${id}b" x="0" y="0" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency=".025" numOctaves="2" seed="${noise + 9}" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" result="d"/>
<feTurbulence type="fractalNoise" baseFrequency=".012 .09" numOctaves="3" seed="${noise + 13}" result="s"/>
<feColorMatrix in="s" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 .5" result="a"/>
<feComposite in="d" in2="a" operator="in"/>
</filter>
<filter id="${id}g" x="-20%" y="-20%" width="140%" height="140%">
<feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="${noise + 5}" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="4.5" xChannelSelector="R" yChannelSelector="G" result="d"/>
<feGaussianBlur in="d" stdDeviation="2.2" result="b"/>
<feSpecularLighting in="b" surfaceScale="2.4" specularConstant=".2" specularExponent="16" lighting-color="#E2A988" result="l"><feDistantLight azimuth="230" elevation="58"/></feSpecularLighting>
<feComposite in="l" in2="d" operator="in" result="lc"/>
<feMerge><feMergeNode in="d"/><feMergeNode in="lc"/></feMerge>
</filter>
${radius ? `<clipPath id="${id}c"><rect width="200" height="200" rx="${radius * 2}"/></clipPath>` : ''}
</defs>`
    : radius
      ? `<defs><clipPath id="${id}c"><rect width="200" height="200" rx="${radius * 2}"/></clipPath></defs>`
      : '';
  const use = (k) => (texture ? ` filter="url(#${id}${k})"` : '');

  const stem = `<path d="M92,118 C90,146 95,170 91,206 L109,206 C112,172 106,146 108,118Z" fill="${COLORS.stem}"${use('s')}/>`;
  const blush = showCheeks
    ? `<g fill="${COLORS.blush}" opacity=".75"><ellipse cx="${fx - 29}" cy="${fy + 7}" rx="7.5" ry="4.8"/><ellipse cx="${fx + 29}" cy="${fy + 7}" rx="7.5" ry="4.8"/></g>`
    : '';
  const faceC = part.faceColor ?? c;
  const face = `<g transform="translate(${fx} ${fy})">${EYES[o.eyes ?? eyes](faceC, hi)}${MOUTHS[o.mouth ?? mouth](faceC)}</g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"${size} data-flower="${name}">${defs}<g${
    radius ? ` clip-path="url(#${id}c)"` : ''
  }>${bg ? `<rect width="200" height="200" fill="${bg}"/>` : ''}${scene ? `<g${use('b')}>${scene.paint}</g>` : ''}${stem}<g transform="translate(100 84) rotate(${tilt}) scale(1.12)"><g${use(
    'p',
  )}>${part.paint}${blush}</g><g${use('g')}>${part.glaze}${face}</g></g></g></svg>`;
}

/** Same as createFlower, as a data URI for `<img src>` or CSS. */
export function createFlowerDataUri(o = {}) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(createFlower(o))}`;
}
