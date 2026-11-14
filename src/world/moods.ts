// Fuente de verdad del color (DESIGN.md §3). Tríada 150° / 30° / 270°: fósforo, brasa, uva.
// index.css sólo repite el mood fosforo para el primer paint; scripts/optimize-images.mjs hornea con P.
export type Mood = 'fosforo' | 'uva' | 'brasa';

export const P = {
  fosforo950: '#04140e', fosforo800: '#0e3b2a', fosforo500: '#1fc27a', fosforo300: '#7cf0b4',
  brasa950: '#2a0e04', brasa900: '#4a1a08', brasa800: '#b33a0b', brasa500: '#ff6a1f', brasa300: '#ffb27a',
  uva950: '#120a22', uva800: '#2a1c4a', uva500: '#7b5cf5', uva300: '#b9a7ff',
  tinta: '#0b0812', papel200: '#e6d8bf', papel50: '#f5ecdc',
};

const base = { ink: P.papel50, line: P.tinta, 'on-accent': P.tinta, paper: P.papel50, 'on-paper': P.tinta };

export const MOODS: Record<Mood, Record<string, string>> = {
  fosforo: {
    ...base, surface: P.fosforo950, 'surface-raised': P.fosforo800, 'ink-muted': '#a8d9c2', shadow: P.tinta,
    accent: P.fosforo500, 'accent-alt': P.brasa500, pop: P.uva300, glow: P.fosforo300,
  },
  uva: {
    ...base, surface: P.uva950, 'surface-raised': P.uva800, 'ink-muted': '#c9bee6', shadow: P.tinta,
    accent: P.fosforo500, 'accent-alt': P.uva300, pop: P.brasa500, glow: P.uva300,
  },
  brasa: {
    ...base, surface: P.brasa950, 'surface-raised': P.brasa900, 'ink-muted': '#f2c3a3', shadow: P.brasa800,
    accent: P.brasa500, 'accent-alt': P.fosforo300, pop: P.uva300, glow: P.brasa300,
  },
};

/**
 * Variables CSS de un mood para style={} en una sección (FlatStory).
 * Emite también --color-*: Tailwind las resuelve en :root, así que redefinir sólo --surface en un hijo no alcanza.
 */
export const moodVars = (m: Mood) =>
  Object.fromEntries(Object.entries(MOODS[m]).flatMap(([k, v]) => [[`--${k}`, v], [`--color-${k}`, v]]));
