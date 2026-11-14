// CH 01 · SEÑAL: el hero (ref1). La TV ya es la ventana (TvFrame): esto es lo que se ve en su pantalla.
import type { CSSProperties, MouseEvent } from 'react';
import { Layer, useWorldMaybe } from '@/world/World';
import { STATIONS, type StationId } from '@/world/stations';
import { Sparkle, Star } from '@/art';
import { BrutalLink } from '@/components/ui';
import { useLang } from '@/i18n/LangContext';
import { ART, PROFILE } from '@/content/profile';
import GlitchText from '@/components/bits/GlitchText';

/** Entrada escalonada al terminar el loader (.enter en index.css). */
const enter = (d: number, y = '24px', r = '0deg') => ({ '--d': `${d}ms`, '--from-y': y, '--from-r': r }) as CSSProperties;

function useJump() {
  const world = useWorldMaybe();
  // en la TV: corte de canal; en FlatStory el ancla baja a la sección
  return (id: StationId) => (e: MouseEvent) => {
    if (!world) return;
    e.preventDefault();
    world.cut(STATIONS.findIndex((s) => s.id === id));
  };
}

function Pitch() {
  const { t } = useLang();
  const jump = useJump();
  return (
    <div className="flex flex-col gap-4">
      <p className="brutal-panel text-base leading-snug text-ink md:text-[clamp(1rem,1.6cqw,1.25rem)]">{t.senal.pitch}</p>
      {/* un solo CTA fuerte; hablar queda como enlace secundario */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <BrutalLink tone="accent" href="#sistemas" onClick={jump('sistemas')}>{t.senal.ctaWork} <span aria-hidden>→</span></BrutalLink>
        <a href="#contacto" onClick={jump('contacto')}
          className="label-px inline-flex min-h-11 items-center text-ink underline decoration-glow decoration-2 underline-offset-4 hover:text-glow">
          {t.senal.ctaTalk}
        </a>
      </div>
    </div>
  );
}

/**
 * La pantalla del hero. @container: todo va en cq; min(cqw, cqh) para que no explote en pantallas muy anchas.
 * Mobile (pantalla vertical): pitch en el medio y el avatar abajo.
 */
export function SenalContent() {
  const { t } = useLang();
  return (
    <div className="@container hatch absolute inset-0 overflow-hidden bg-surface">
      <span className="enter sticker absolute top-[4cqh] left-[5cqw] z-20 -rotate-3 text-[max(0.65rem,min(2.2cqw,3cqh))] md:top-[6cqh]" style={enter(250, '-40px', '-14deg')}>{t.senal.analyst}</span>
      <span className="enter absolute top-[20cqh] right-[6cqw] w-[min(10cqw,13cqh)] max-md:hidden" style={enter(420, '0px', '-90deg')}><Star className="w-full text-pop" /></span>
      <Sparkle className="absolute top-[46cqh] left-[4cqw] w-[min(3cqw,4cqh)] text-glow max-md:hidden" />

      <img src={ART.peek} srcSet={`${ART.peekSmall} 700w, ${ART.peek} 1400w`} sizes="(max-width: 767px) 96vw, 60vw" width={1400} height={817}
        alt={t.senal.peekAlt} fetchPriority="high" decoding="async" style={enter(120, '45%')}
        className="enter absolute right-[-6cqw] bottom-0 w-[96cqw] max-w-none md:right-[-2cqw] md:bottom-[8cqh] md:w-[min(60cqw,80cqh)]" />
      <h1 className="enter glow-text font-display absolute top-[15cqh] left-[5cqw] z-10 uppercase leading-[0.84] text-ink md:top-[17cqh]" style={enter(0, '30px')}>
        <GlitchText trigger="hover" mode="rgb" offset={6} shadowColors={['var(--color-accent-alt)', 'var(--color-pop)']}
          className="-skew-x-6 text-[min(21cqw,26cqh)]">
          {PROFILE.first}
        </GlitchText>
        <span className="block -skew-x-6 text-[min(9.5cqw,11.8cqh)]">{PROFILE.last}</span>
      </h1>
      <div className="enter absolute inset-x-[5cqw] top-[33cqh] z-20 md:inset-x-auto md:top-auto md:bottom-[11cqh] md:left-[5cqw] md:w-[min(44cqw,60cqh)]" style={enter(500)}>
        <Pitch />
      </div>

      <div style={enter(600, '100%')} className="enter absolute inset-x-0 bottom-0 z-20 hidden h-[8cqh] min-h-9 items-center gap-[2.5cqw] border-t-2 border-glow/40 bg-surface/90 px-[4cqw] md:flex">
        <span className="label-px rounded-md bg-accent px-2 py-0.5 text-on-accent">{t.senal.version}</span>
        {[['GitHub', PROFILE.github], ['LinkedIn', PROFILE.linkedin], ['WhatsApp', PROFILE.whatsapp]].map(([k, href]) => (
          <a key={k} href={href} target="_blank" rel="noopener noreferrer" className="label-px text-ink-muted hover:text-glow">{k}</a>
        ))}
        <span aria-hidden className="label-px ml-auto animate-[blink_1.6s_steps(1)_infinite] text-glow">▼ {t.senal.scroll}</span>
      </div>
    </div>
  );
}

export function SenalScene() {
  return (
    <Layer label="Román Vogel Corach">
      <SenalContent />
    </Layer>
  );
}
