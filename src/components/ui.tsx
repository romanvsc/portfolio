// Primitivas neobrutalistas (DESIGN.md §5)
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Tone = 'accent' | 'raised' | 'ink';
const tones: Record<Tone, string> = {
  accent: 'bg-accent text-on-accent',
  raised: 'bg-surface-raised text-ink',
  ink: 'bg-ink text-surface',
};
const btn = 'brutal-border brutal-shadow brutal-press inline-flex items-center gap-3 px-5 py-3 label-mono !text-sm cursor-pointer select-none';

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
    <span className={`label-mono inline-block border-2 border-line bg-surface-raised px-2.5 py-1 text-ink ${className}`}>
      {children}
    </span>
  );
}

/** Etiqueta de capítulo: 門 · 01 / MON */
export function ChapterLabel({ kanji, n, name }: { kanji: string; n: number; name: string }) {
  return (
    <p className="label-mono flex items-center gap-3 text-ink">
      <span className="font-brush text-2xl normal-case leading-none text-accent" aria-hidden>{kanji}</span>
      <span aria-hidden className="h-[3px] w-8 bg-line" />
      <span>{String(n).padStart(2, '0')} / {name}</span>
    </p>
  );
}

/** Kanji gigante de fondo, decorativo. */
export function BigKanji({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span aria-hidden
      className={`font-brush pointer-events-none absolute select-none leading-none text-ink opacity-[0.07] ${className}`}
      style={{ fontSize: 'clamp(16rem, 42vh, 34rem)' }}>
      {children}
    </span>
  );
}

/** Título display multilínea (respeta \n de i18n). */
export function DisplayTitle({ text, as: Tag = 'h2', className = '' }: { text: string; as?: 'h1' | 'h2' | 'h3'; className?: string }) {
  return (
    <Tag className={`display-shadow font-display text-display-l uppercase tracking-[-0.02em] text-ink ${className}`}>
      {text.split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
    </Tag>
  );
}
