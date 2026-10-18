// 道 MICHI: sobre mí
import { Layer } from '@/world/World';
import { Bamboo, Seigaiha } from '@/art';
import { BigKanji, ChapterLabel, Chip, DisplayTitle } from '@/components/ui';
import { RevealWords, Rise } from '@/components/Reveal';
import { useLang } from '@/i18n/LangContext';
import { PROFILE } from '@/content/profile';
import { Gate } from './Gate';

export function PathIntro({ compact = false }: { compact?: boolean }) {
  const { t } = useLang();
  return (
    <div className="relative mx-auto flex h-full max-w-[1200px] flex-col justify-center gap-8 px-4 md:px-10">
      <BigKanji className="-top-[4vh] right-[2vw]">道</BigKanji>
      <ChapterLabel kanji="道" n={2} name={t.michi.label} />
      <DisplayTitle text={t.michi.title} />
      <RevealWords text={t.michi.body} className="brutal-panel max-w-2xl text-lg leading-relaxed text-ink md:text-xl" />
      {/* mobile: las tarjetas laterales no entran, van compactas acá */}
      <div className={`${compact ? '' : 'md:hidden'} grid gap-3`}>
        <p className="border-l-[6px] border-accent bg-surface px-3 py-2 text-sm leading-relaxed text-ink">
          <span className="font-brush text-2xl" aria-hidden>{PROFILE.katakana} </span>{t.michi.roman}
        </p>
        <ul className="flex flex-wrap gap-2">
          {t.michi.facts.map((f) => <li key={f.k}><Chip>{f.v}</Chip></li>)}
        </ul>
      </div>
    </div>
  );
}

/** Tarjetas a distinta profundidad (parallax entre sí). */
export function PathRoman() {
  const { t } = useLang();
  return (
    <Rise at={0.4} className="brutal-border brutal-shadow relative w-[min(420px,88vw)] overflow-hidden bg-surface-raised">
      <Seigaiha className="absolute inset-0" />
      <div className="relative flex items-center justify-between border-b-[3px] border-line bg-accent px-4 py-2">
        <span className="label-mono text-on-accent">{t.michi.romanTitle}</span>
        <span className="label-mono text-on-accent">01</span>
      </div>
      <div className="relative p-5">
        <p className="font-brush text-6xl leading-none text-ink md:text-7xl" aria-hidden>{PROFILE.katakana}</p>
        <p className="mt-3 text-base leading-relaxed text-ink">{t.michi.roman}</p>
      </div>
    </Rise>
  );
}

export function PathFacts() {
  const { t } = useLang();
  return (
    <dl className="grid w-[min(360px,88vw)] gap-3">
      {t.michi.facts.map((f, i) => (
        <Rise key={f.k} at={0.36 + i * 0.05} className="brutal-border brutal-shadow bg-surface-raised px-4 py-3">
          <dt className="label-mono text-accent">{f.k}</dt>
          <dd className="font-display mt-1 text-lg uppercase leading-tight text-ink">{f.v}</dd>
        </Rise>
      ))}
    </dl>
  );
}

export function PathScene() {
  return (
    <>
      <Layer kind="scenery" depth={900} speed={0.5}>
        <Bamboo className="absolute top-0 left-0 h-full w-[22vw] opacity-60" seed={3} stalks={4} />
        <Bamboo className="absolute top-0 right-0 h-full w-[22vw] opacity-60" seed={12} stalks={4} flip />
      </Layer>
      <Gate />
      <Layer className="md:pr-[34vw]" label="Sobre mí">
        <PathIntro />
      </Layer>
      <Layer depth={-160} className="hidden items-start justify-end pt-[16vh] pr-[6vw] md:flex">
        <PathRoman />
      </Layer>
      <Layer depth={220} className="hidden items-end justify-end pr-[10vw] pb-[10vh] md:flex">
        <PathFacts />
      </Layer>
    </>
  );
}
