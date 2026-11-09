// La TV es la ventana: bisel fijo + panel de controles (desktop) o tira (mobile).
// Los controles cambian de canal con un corte (salto instantáneo + estática), no con scroll.
import type { ReactNode } from 'react';
import { useWorld } from '@/world/World';
import { STATIONS } from '@/world/stations';
import { useLang } from '@/i18n/LangContext';
import { ART } from '@/content/profile';
import CircularText from './bits/CircularText';

const N = STATIONS.length;
/** Ángulo de cada canal en la perilla: arco de 270° (de -135° a 135°). */
const ANGLE = (i: number) => -135 + (270 / (N - 1)) * i;
/** La marca de knob-dial apunta ~40° a la derecha de las 12. */
const DIAL_OFFSET = -40;
/** La marca de knob-small apunta ~32° a la derecha de las 12. */
const KNOB_OFFSET = -32;

function TvButton({ onClick, label, children, className = '' }: { onClick: () => void; label: string; children: ReactNode; className?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label}
      className={`tv-btn font-display flex aspect-[3/2] cursor-pointer items-center justify-center text-on-paper uppercase active:translate-y-px ${className}`}>
      {children}
    </button>
  );
}

/** Perilla de idioma. compact (tira mobile): sólo la perilla y el idioma activo. */
function LangKnob({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  const { t, lang, setLang } = useLang();
  return (
    <button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={`ES / EN · ${t.nav.langLabel}`}
      className={`label-px group flex shrink-0 cursor-pointer items-center gap-1.5 text-paper ${className}`}>
      <span className={lang === 'es' ? 'text-glow' : 'opacity-60'} hidden={compact && lang !== 'es'}>ES</span>
      {/* la placa (con su arco) queda fija; sólo gira la perilla, recortada de la misma imagen */}
      <span className={`relative aspect-square shrink-0 ${compact ? 'w-10' : 'w-16'}`}>
        <img src={ART.knob} alt="" className="absolute inset-0 h-full w-full" />
        <img src={ART.knob} alt="" className="absolute inset-0 h-full w-full transition-[rotate] duration-300 ease-snap [clip-path:circle(21%_at_50%_50%)]"
          style={{ rotate: `${(lang === 'es' ? -60 : 60) + KNOB_OFFSET}deg` }} />
      </span>
      <span className={lang === 'en' ? 'text-glow' : 'opacity-60'} hidden={compact && lang !== 'en'}>EN</span>
    </button>
  );
}

export function TvFrame() {
  const { t } = useLang();
  const { active, cut } = useWorld();
  const name = (i: number) => `${t.nav.ch} ${STATIONS[i].ch} · ${t.nav.channels[STATIONS[i].id]}`;
  const step = (d: number) => cut((active + d + N) % N);
  const cur = STATIONS[active];

  return (
    <>
      {/* el bisel y el fondo de la tira están estáticos en index.html */}
      <p className="sr-only" aria-live="polite">{name(active)}</p>

      {/* placa de marca en el bisel de abajo */}
      <button type="button" onClick={() => cut(0)} aria-label={`ROMÁN · ${name(0)}`}
        className="fixed z-50 hidden -translate-x-1/2 cursor-pointer items-center justify-center bg-[url(/img/senal/plate.webp)] bg-contain bg-center bg-no-repeat md:flex"
        style={{ left: 'calc((100% - var(--panel-w)) / 2)', bottom: 'calc(var(--bz) * 0.2)', height: 'calc(var(--bz) * 1)', aspectRatio: '360 / 96' }}>
        <span className="font-display text-[calc(var(--bz)*0.48)] tracking-[0.2em] text-paper">ROMÁN</span>
      </button>


      {/* panel de controles (desktop) */}
      <nav aria-label={t.nav.menu} className="tv-panel z-50 hidden items-center justify-center md:flex">
        <div className="relative w-full max-h-full" style={{ aspectRatio: '483 / 1759' }}>
          <img src={ART.panel} alt="" className="absolute inset-0 h-full w-full" />
          {/* perilla de canal: clic = siguiente; las marcas saltan a cada canal */}
          {/* w 46% y radio 72%: las marcas quedan fuera de la perilla y dentro del recuadro del panel */}
          <div className="absolute top-[19%] left-1/2 aspect-square w-[46%] -translate-1/2">
            <button type="button" onClick={() => step(1)} aria-label={t.nav.next} className="absolute inset-0 cursor-pointer rounded-full">
              <img src={ART.dial} alt="" className="h-full w-full transition-[rotate] duration-500 ease-snap"
                style={{ rotate: `${ANGLE(active) + DIAL_OFFSET}deg` }} />
            </button>
            {STATIONS.map((s, i) => {
              const a = (ANGLE(i) * Math.PI) / 180;
              const on = i === active;
              return (
                <button key={s.id} type="button" onClick={() => cut(i)} aria-label={name(i)} aria-current={on ? 'step' : undefined}
                  className={`label-px absolute flex h-6 min-w-7 -translate-1/2 cursor-pointer items-center justify-center rounded px-1 text-[clamp(0.65rem,0.9vw,0.78rem)]! tabular-nums transition-colors ${on ? 'bg-accent text-on-accent' : 'text-paper hover:text-glow focus-visible:text-glow'}`}
                  style={{ left: `${50 + 72 * Math.sin(a)}%`, top: `${50 - 72 * Math.cos(a)}%` }}>
                  {s.ch}
                </button>
              );
            })}
          </div>
          <div className="absolute inset-x-[12%] top-[38%] grid grid-cols-2 gap-[8%]">
            <TvButton onClick={() => step(-1)} label={`▼ CH · ${t.nav.prev}`} className="text-[clamp(0.7rem,1vw,0.95rem)]">▼ CH</TvButton>
            <TvButton onClick={() => step(1)} label={`CH ▲ · ${t.nav.next}`} className="text-[clamp(0.7rem,1vw,0.95rem)]">CH ▲</TvButton>
          </div>
          <LangKnob className="absolute top-[50%] left-1/2 w-[80%] -translate-x-1/2 justify-center" />
          {/* sticker pegado sobre la rejilla del parlante */}
          <div aria-hidden className="pointer-events-none absolute top-[80%] left-1/2 -translate-1/2">
            <CircularText text={t.senal.seal} size={112} fontSize={10} color="var(--color-paper)" spinDuration={22}>
              <img src={ART.sticker} alt="" className="size-14" />
            </CircularText>
          </div>
        </div>
      </nav>

      {/* tira de control (mobile) */}
      <nav aria-label={t.nav.menu} className="tv-strip flex items-center gap-1.5 pr-2 pl-[22%] md:hidden">
        <TvButton onClick={() => step(-1)} label={`▼ CH · ${t.nav.prev}`} className="w-11 shrink-0 text-[0.6rem]">▼ CH</TvButton>
        <p aria-hidden className="osd min-w-0 flex-1 truncate rounded bg-line px-2 py-1 text-sm text-glow">
          {cur.ch} · {t.nav.channels[cur.id]}
        </p>
        <TvButton onClick={() => step(1)} label={`CH ▲ · ${t.nav.next}`} className="w-11 shrink-0 text-[0.6rem]">CH ▲</TvButton>
        <LangKnob compact />
      </nav>
    </>
  );
}
