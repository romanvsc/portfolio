// 門 MON: el portal de entrada (hero)
import { useRef, type PointerEvent } from 'react';
import { Layer } from '@/world/World';
import { GAP } from '@/world/stations';
import { Torii, Mountains, Branch, Leaves, Enso, Hanko } from '@/art';
import { Chip } from '@/components/ui';
import { useLang } from '@/i18n/LangContext';
import { PROFILE } from '@/content/profile';
import CircularText from '@/components/bits/CircularText';

/** Retrato en duotono verde suave; con el mouse encima se revela la foto real dentro de un círculo. */
function Portrait() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect();
    ref.current!.style.setProperty('--mx', `${e.clientX - r.left}px`);
    ref.current!.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} role="img" aria-label={t.mon.portraitAlt} onPointerMove={move}
      className="absolute inset-[9%] overflow-hidden rounded-full bg-mist transition-[--reveal-r] duration-500 ease-brush [--reveal-r:0px] hover:[--reveal-r:130px]">
      {/* duotono horneado por npm run images (un filtro SVG en vivo se recalculaba en cada repintado) */}
      <img src={PROFILE.portraitDuo} alt="" fetchPriority="high" decoding="async" className="h-full w-full object-cover" />
      <img src={PROFILE.portrait} alt="" decoding="async" aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ maskImage: 'radial-gradient(circle var(--reveal-r) at var(--mx, 50%) var(--my, 40%), #000 55%, transparent 100%)' }} />
      {/* textura de impresión */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-15 mix-blend-multiply"
        style={{ backgroundImage: 'radial-gradient(var(--color-line) 0.8px, transparent 1.4px)', backgroundSize: '5px 5px' }} />
    </div>
  );
}

/** Composición del hero, usada también por FlatStory. Texto a la izquierda, sol con retrato a la derecha. */
export function GateContent() {
  const { t } = useLang();
  return (
    <div className="relative mx-auto grid h-full w-full max-w-350 grid-cols-1 grid-rows-[auto_1fr_auto] px-4 pt-24 pb-8 md:grid-cols-[1.1fr_1fr] md:grid-rows-1 md:items-center md:gap-8 md:px-12 md:pt-20">
      {/* sol-enso con el retrato */}
      <div className="relative order-1 flex items-center justify-center md:order-2">
        <div className="relative aspect-square w-[min(36vh,78vw)] md:w-[min(64vh,40vw)]">
          <Enso className="absolute inset-0 h-full w-full" fill="var(--color-sun)" stroke="var(--color-line)" />
          <Portrait />
          <span className="font-brush absolute -top-2 -right-4 text-5xl leading-none text-ink md:-right-10 md:text-7xl" style={{ writingMode: 'vertical-rl' }} aria-hidden>
            {PROFILE.katakana}
          </span>
        </div>
      </div>

      <div className="relative order-2 flex min-w-0 flex-col justify-end gap-6 md:order-1 md:justify-center">
        <p className="label-mono text-ink">{t.mon.kicker}</p>
        <h1 className="font-display uppercase text-ink tracking-[-0.03em]">
          <span className="display-shadow block text-display-xl">{PROFILE.first}</span>{' '}
          <span className="block text-[clamp(2rem,5.4vw,5.2rem)] leading-[0.95]" style={{ WebkitTextStroke: '2px var(--color-line)', color: 'var(--color-surface)' }}>
            {PROFILE.last}
          </span>
        </h1>
        <div className="flex max-w-xl flex-wrap gap-2">
          <Chip className="bg-accent! text-on-accent!">{t.mon.role}</Chip>
          <Chip>{t.mon.student}</Chip>
          <Chip>{t.mon.age}</Chip>
          <Chip>{t.mon.where}</Chip>
        </div>
      </div>

      <div className="relative order-3 flex items-end justify-between pt-6 md:absolute md:inset-x-12 md:bottom-8">
        <p className="label-mono flex items-center gap-3 text-ink">
          <span className="relative block h-10 w-0.75 overflow-hidden bg-line/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[leaf-fall_2.2s_linear_infinite] bg-accent" />
          </span>
          {t.mon.scroll}
        </p>
        <div className="relative hidden md:block">
          <CircularText text={t.mon.seal} size={140} fontSize={12} color="var(--color-ink)" spinDuration={24} onHover="speedUp">
            <Hanko size={56} />
          </CircularText>
        </div>
      </div>
    </div>
  );
}

/** Portal entre esta estación y la siguiente: detrás del contenido, se cruza en el cambio de capítulo. */
export function Gate({ className = 'left-1/2 h-[46vh] md:h-[96vh]' }: { className?: string }) {
  return (
    <Layer kind="gate" depth={GAP / 2}>
      <Torii className={`absolute bottom-0 aspect-10/9 -translate-x-1/2 ${className}`} />
    </Layer>
  );
}

export function GateScene() {
  return (
    <>
      <Layer kind="scenery" depth={2400} speed={0.2}>
        <Mountains layer={0} className="absolute inset-x-0 bottom-0 h-[70%] w-full" />
      </Layer>
      <Layer kind="scenery" depth={1200} speed={0.45}>
        <Mountains layer={1} seed={9} className="absolute inset-x-0 bottom-0 h-[55%] w-full" />
      </Layer>
      <Gate className="left-1/2 h-[44vh] md:left-[70%] md:h-[96vh]" />

      <Layer label="Román Vogel Corach">
        <GateContent />
      </Layer>
      <Layer kind="scenery" depth={80}>
        <Mountains layer={2} seed={4} className="absolute inset-x-0 bottom-0 h-[22%] w-full" />
      </Layer>
      <Layer kind="scenery" depth={-180}>
        <Branch className="absolute top-14 -left-6 w-[20vw] max-w-72" seed={21} depth={5} />
        <Branch className="absolute top-14 -right-6 w-[18vw] max-w-64 -scale-x-100" seed={8} depth={5} />
        <Leaves count={9} />
      </Layer>
    </>
  );
}
