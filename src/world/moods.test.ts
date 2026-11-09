import { describe, expect, it } from 'vitest';
import { MOODS, type Mood } from './moods';

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// [texto, fondo, mínimo]: 4.5 = texto normal AA; 3 = texto grande / gráficos
const PAIRS: [string, string, number][] = [
  ['ink', 'surface', 4.5], ['ink', 'surface-raised', 4.5],
  ['ink-muted', 'surface', 4.5], ['ink-muted', 'surface-raised', 4.5],
  ['accent', 'surface', 4.5], ['accent', 'surface-raised', 4.5],
  ['accent-alt', 'surface', 4.5], ['glow', 'surface', 4.5], ['pop', 'surface', 3],
  ['on-accent', 'accent', 4.5], ['on-accent', 'accent-alt', 4.5], ['on-accent', 'pop', 4.5],
  ['on-paper', 'paper', 4.5],
];

describe('moods', () => {
  it('cada mood define los mismos tokens', () => {
    const keys = Object.keys(MOODS.fosforo).sort();
    for (const m of Object.keys(MOODS) as Mood[]) expect(Object.keys(MOODS[m]).sort()).toEqual(keys);
  });

  for (const m of Object.keys(MOODS) as Mood[])
    it(`${m}: pares texto/fondo cumplen WCAG AA`, () => {
      for (const [fg, bg, min] of PAIRS)
        expect(ratio(MOODS[m][fg], MOODS[m][bg]), `${fg} sobre ${bg}`).toBeGreaterThanOrEqual(min);
    });
});
