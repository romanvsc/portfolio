// Primitivas: bloques duros (DESIGN.md §5) + piezas de TV (canal, título con brillo).
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Tone = 'accent' | 'raised' | 'paper';
const tones: Record<Tone, string> = {
  accent: 'bg-accent text-on-accent',
  raised: 'bg-surface-raised text-ink',
  paper: 'bg-paper text-on-paper',
};
const btn = 'brutal-border brutal-shadow brutal-press inline-flex items-center gap-3 px-5 py-3 label-px !text-sm cursor-pointer select-none';

export function BrutalLink({ tone = 'raised', className = '', children, ...a }: AnchorHTMLAttributes<HTMLAnchorElement> & { tone?: Tone }) {
  const ext = a.href?.startsWith('http');
  return (
    <a {...a} className={`${btn} ${tones[tone]} ${className}`} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
      {ext && <span aria-hidden>↗</span>}
    </a>
  );
}

export function BrutalButton({ tone = 'raised', className = '', children, ...b }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone }) {
  return <button type="button" {...b} className={`${btn} ${tones[tone]} ${className}`}>{children}</button>;
}

export function Chip({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`label-px inline-block border-2 border-line bg-surface-raised px-2.5 py-1 text-ink ${className}`}>
      {children}
    </span>
  );
}

/** Etiqueta de canal: ● CH 02 · QUIÉN TRANSMITE */
export function ChannelLabel({ ch, name }: { ch: string; name: string }) {
  return (
    <p className="label-px flex items-center gap-3 text-glow">
      <span aria-hidden className="size-2.5 animate-[blink_1.2s_steps(1)_infinite] rounded-full bg-accent-alt" />
      <span className="osd text-base">CH {ch}</span>
      <span aria-hidden className="h-0.5 w-8 bg-glow/50" />
      <span className="text-ink">{name}</span>
    </p>
  );
}

/** Número de canal gigante de fondo, decorativo. */
export function BigNumber({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span aria-hidden
      className={`font-display pointer-events-none absolute select-none leading-none text-glow opacity-[0.07] ${className}`}
      style={{ fontSize: 'clamp(14rem, 46vh, 38rem)' }}>
      {children}
    </span>
  );
}

/** Título display multilínea (respeta \n de i18n), inclinado como ref1 y con brillo de fósforo. */
export function DisplayTitle({ text, as: Tag = 'h2', className = '' }: { text: string; as?: 'h1' | 'h2' | 'h3'; className?: string }) {
  return (
    <Tag className={`glow-text font-display text-display-l uppercase text-ink ${className}`}>
      {text.split('\n').map((l, i) => <span key={i} className="block -skew-x-6">{l}</span>)}
    </Tag>
  );
}
