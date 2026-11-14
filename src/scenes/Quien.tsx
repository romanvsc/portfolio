// CH 02 · QUIÉN: collage de papel (ref4). Manifiesto, datos con cinta y la tira rasgada con los ojos.
import type { CSSProperties } from 'react';
import { Layer } from '@/world/World';
import { Scribble, Sparkle } from '@/art';
import { ChannelLabel, DisplayTitle } from '@/components/ui';
import { RevealWords, Rise } from '@/components/Reveal';
import { useLang } from '@/i18n/LangContext';
import { ART } from '@/content/profile';

const TILT = [-3, 2, 2.5, -2];

function Facts({ className = '' }: { className?: string }) {
  const { t } = useLang();
  return (
    <dl className={`grid grid-cols-2 gap-x-3 gap-y-5 md:gap-x-6 md:gap-y-8 ${className}`}>
      {t.quien.facts.map((f, i) => (
        <Rise key={f.k} at={0.34 + i * 0.04}>
          {/* papel pegado: en hover se endereza */}
          <div style={{ '--tilt': `${TILT[i]}deg` } as CSSProperties}
            className="relative h-full rotate-(--tilt) border-[3px] border-line bg-paper px-3 pt-4 pb-3 text-on-paper shadow-[5px_5px_0_var(--color-shadow)] transition-[rotate,translate] duration-300 ease-snap hover:-translate-y-0.5 hover:rotate-0">
            <img src={ART.tape} alt="" aria-hidden className="absolute -top-4 left-1/2 w-20 -translate-x-1/2 -rotate-3 md:w-24" />
            <dt className="label-px !text-[0.7rem]">{f.k}</dt>
            <dd className="font-display mt-1 text-sm leading-tight uppercase md:text-base">{f.v}</dd>
          </div>
        </Rise>
      ))}
    </dl>
  );
}

export function QuienIntro({ flat = false }: { flat?: boolean }) {
  const { t } = useLang();
  return (
    <div className={`relative mx-auto flex w-full max-w-325 flex-col gap-4 px-4 md:gap-5 md:px-10 ${flat ? '' : 'pt-20 md:pt-24'}`}>
      <ChannelLabel ch="02" name={t.quien.label} />
      <div className="grid gap-4 md:grid-cols-[1.45fr_1fr] md:items-end md:gap-10">
        <div className="flex flex-col gap-3 md:gap-5">
          <DisplayTitle text={t.quien.title} className="text-[clamp(2.1rem,4.4vw,4.6rem)]!" />
          <p className="font-hand relative w-fit text-2xl text-ink md:text-4xl">
            {t.quien.hand}
            <Scribble className="absolute -bottom-3 left-0 h-3 w-full text-pop" />
          </p>
        </div>
        <RevealWords text={t.quien.body} className="brutal-panel max-w-xl text-sm leading-relaxed text-ink md:text-lg" />
      </div>
      <Facts className="md:mt-2 md:grid-cols-4" />
    </div>
  );
}

/** Lentes en eyes.webp (en % de la imagen): ahí se "refleja" el texto, como en ref4. */
const LENSES = [
  { left: '27.5%', top: '29%', width: '19.2%', height: '33%', rotate: '-4deg' },
  { left: '53.8%', top: '29%', width: '18.7%', height: '32%', rotate: '3deg' },
];

/**
 * Tira rasgada con los ojos. --w = ancho de la imagen (más ancha que la pantalla en mobile);
 * se ve la franja 20%–86% de su alto, donde están los anteojos.
 */
export function EyesStrip({ className = '' }: { className?: string }) {
  const { t } = useLang();
  return (
    <div role="img" aria-label={t.quien.eyesAlt}
      className={`relative w-full overflow-hidden [--w:170vw] md:[--w:100vw] ${className}`}
      style={{ height: 'min(calc(var(--w) * 0.2), 36vh)' }}>
      <div className="absolute" style={{ width: 'var(--w)', left: 'calc((100% - var(--w)) / 2)', top: 'calc(var(--w) * -0.08)' }}>
        <img src={ART.eyes} alt="" width={1600} height={600} loading="lazy" decoding="async" className="block h-auto w-full" />
        {[t.quien.lensL, t.quien.lensR].map((w, i) => (
          <span key={w} aria-hidden style={LENSES[i] as CSSProperties}
            className="font-display absolute flex items-center justify-center uppercase text-glow opacity-80 mix-blend-screen [font-size:calc(var(--w)*0.032)] blur-[0.4px]">
            {w}
          </span>
        ))}
      </div>
      <span aria-hidden className="torn-down absolute inset-x-0 -top-px h-[3vw] min-h-4 text-surface" />
      <span aria-hidden className="torn-up absolute inset-x-0 -bottom-px h-[3vw] min-h-4 text-surface" />
    </div>
  );
}

export function QuienScene() {
  return (
    <>
      <Layer kind="scenery" depth={800} speed={0.5}>
        <div className="paper-bg absolute -inset-[10%]" />
      </Layer>
      <Layer kind="scenery" depth={120} className="flex flex-col justify-end">
        <EyesStrip />
      </Layer>
      <Layer label="Quién transmite">
        <QuienIntro />
      </Layer>
      <Layer kind="scenery" depth={-140}>
        <Sparkle className="absolute top-[14vh] left-[46vw] w-8 text-ink" />
        <Sparkle className="absolute top-[48vh] right-[40vw] w-5 text-ink max-md:hidden" />
      </Layer>
    </>
  );
}
