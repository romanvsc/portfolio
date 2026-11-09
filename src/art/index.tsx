// Doodles de collage (ref4) y barras de la carta de ajuste. SVG propios, coloreados con tokens vía currentColor.
import type { CSSProperties } from 'react';

type Art = { className?: string; style?: CSSProperties };
const stroke = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** Estrella de 8 puntas a mano alzada, en contorno. */
export function Star({ className = '', style }: Art) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className} style={style}>
      <path {...stroke} strokeWidth={4}
        d="M52 4 L58 36 L88 16 L66 44 L97 52 L64 60 L82 90 L54 68 L46 97 L40 66 L12 84 L32 56 L3 46 L34 40 L18 12 L44 32 Z" />
    </svg>
  );
}

/** Destello de 4 puntas, relleno. */
export function Sparkle({ className = '', style }: Art) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className} style={style}>
      <path fill="currentColor" d="M20 0 C21.5 13 27 18.5 40 20 C27 21.5 21.5 27 20 40 C18.5 27 13 21.5 0 20 C13 18.5 18.5 13 20 0 Z" />
    </svg>
  );
}

/** Subrayado de marcador, doble pasada. */
export function Scribble({ className = '', style }: Art) {
  return (
    <svg viewBox="0 0 220 24" preserveAspectRatio="none" aria-hidden className={className} style={style}>
      <path {...stroke} strokeWidth={5} d="M4 14 C50 6 110 4 216 10" />
      <path {...stroke} strokeWidth={3} d="M30 20 C80 14 140 13 196 17" />
    </svg>
  );
}

/** Barras de color de la carta de ajuste, en la tríada (+ papel y tinta). */
export function ColorBars({ className = '' }: Art) {
  const bars = ['var(--color-paper)', 'var(--color-glow)', 'var(--color-accent)', 'var(--color-pop)', 'var(--color-accent-alt)', 'var(--color-surface-raised)', 'var(--color-line)'];
  return (
    <div aria-hidden className={`grid grid-cols-7 ${className}`}>
      {bars.map((b) => <span key={b} style={{ background: b }} />)}
    </div>
  );
}
