// Fuente de verdad de los moods (DESIGN.md §3). index.css sólo repite dawn para el primer paint.
export type Mood = 'dawn' | 'forest' | 'night';

const P = {
  sumi950: '#070a08', sumi800: '#16201a', moss700: '#1e3b2b', moss600: '#25483a',
  jade600: '#1f7a55', jade500: '#2e9e6e', matcha300: '#a8d672', wakaba200: '#d4f28c',
  washi50: '#f4f2ea', washi100: '#e8e5d8',
};

export const MOODS: Record<Mood, Record<string, string>> = {
  dawn: {
    surface: P.washi50, 'surface-raised': P.washi100, ink: P.sumi950, 'ink-muted': '#3a4a40',
    line: P.sumi950, shadow: P.sumi950, accent: P.jade600, 'accent-bright': P.jade500,
    'on-accent': P.washi50, sun: P.jade500, mist: P.washi100,
  },
  forest: {
    surface: P.moss700, 'surface-raised': P.moss600, ink: P.washi50, 'ink-muted': '#c9d4c4',
    line: P.sumi950, shadow: P.sumi950, accent: P.matcha300, 'accent-bright': P.wakaba200,
    'on-accent': P.sumi950, sun: P.jade500, mist: '#2b5240',
  },
  night: {
    surface: P.sumi950, 'surface-raised': P.sumi800, ink: P.washi50, 'ink-muted': '#a9b5ac',
    line: P.wakaba200, shadow: P.jade500, accent: P.wakaba200, 'accent-bright': P.wakaba200,
    'on-accent': P.sumi950, sun: P.jade600, mist: P.sumi800,
  },
};

/**
 * Variables CSS de un mood para style={} en una sección (FlatStory).
 * Emite también --color-*: Tailwind las resuelve en :root, así que redefinir sólo --surface en un hijo no alcanza.
 */
export const moodVars = (m: Mood) =>
  Object.fromEntries(Object.entries(MOODS[m]).flatMap(([k, v]) => [[`--${k}`, v], [`--color-${k}`, v]]));
