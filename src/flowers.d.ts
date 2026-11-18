export type Flower =
  | 'star'
  | 'ball'
  | 'tulipBrown'
  | 'tulipPurple'
  | 'tulipYellow'
  | 'cornflower'
  | 'flame'
  | 'calyx'
  | 'bud'
  | 'bandBall'
  | 'disc';
export type Eyes = 'dot' | 'arc' | 'big' | 'googly' | 'wink';
export type Mouth = 'smile' | 'wide' | 'open' | 'small';
export type BackgroundColor = 'cream' | 'lightBlue' | 'rose' | 'sage' | 'butter' | 'lilac';
export type Scene = 'meadow' | 'meadowHills' | 'meadowFlowers' | 'sky' | 'skySun' | 'skyDusk';

export interface FlowerOptions {
  /** Decides everything that is not set explicitly. Same seed, same flower. */
  seed?: string;
  flower?: Flower;
  eyes?: Eyes;
  mouth?: Mouth;
  cheeks?: boolean;
  /** Colour name, scene, any CSS colour, `'auto'` (picked by the seed) or `'transparent'`. Default `'cream'`. */
  background?: BackgroundColor | Scene | 'auto' | 'transparent' | (string & {});
  /** `false` = flat shapes without filters (for Figma import or very small sizes). Default `true`. */
  texture?: boolean;
  /** Corner radius in percent, 50 = circle. Default 0. */
  radius?: number;
  /** Sets `width` and `height` on the `<svg>`. */
  size?: number;
}

/** Returns a self-contained SVG string (viewBox 0 0 200 200). */
export function createFlower(options?: FlowerOptions): string;
/** Same as `createFlower`, as a data URI for `<img src>` or CSS. */
export function createFlowerDataUri(options?: FlowerOptions): string;

export const FLOWERS: Record<Flower, unknown>;
export const EYES: Record<Eyes, unknown>;
export const MOUTHS: Record<Mouth, unknown>;
export const BACKGROUNDS: Record<BackgroundColor, string>;
export const SCENES: Record<Scene, unknown>;
export const COLORS: Record<string, string>;
