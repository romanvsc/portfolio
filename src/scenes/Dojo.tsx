// 技 WAZA: skills como ema (tablillas votivas) colgando a distinta profundidad
import { Layer } from '@/world/World';
import { Bamboo } from '@/art';
import { BigKanji, ChapterLabel, DisplayTitle } from '@/components/ui';
import { Rise } from '@/components/Reveal';
import { useLang } from '@/i18n/LangContext';
import { SKILLS, STACK_BAND } from '@/content/profile';
import ScrollVelocity from '@/components/bits/ScrollVelocity';
import { Gate } from './Gate';

type Group = keyof typeof SKILLS;

export function Ema({ group, n, tilt = 0 }: { group: Group; n: number; tilt?: number }) {
  const { t } = useLang();
  return (
    <Rise at={0.3 + n * 0.04} className="relative w-[min(250px,42vw)]" style={{ rotate: `${tilt}deg` }}>
      {/* cordón + techo de la tablilla */}
      <span aria-hidden className="absolute -top-16 left-1/2 h-16 w-[3px] -translate-x-1/2 bg-line" />
      <svg viewBox="0 0 250 40" aria-hidden className="relative -mb-[3px] block w-full" preserveAspectRatio="none">
        <path d="M1.5 38.5 L125 2 L248.5 38.5 Z" fill="var(--color-accent)" stroke="var(--color-line)" strokeWidth="3" />
      </svg>
      <div className="brutal-border brutal-shadow brutal-grid bg-surface-raised p-4">
        <div className="mb-3 flex items-baseline justify-between border-b-[3px] border-line pb-2">
          <h3 className="font-display text-xl uppercase text-ink">{t.waza.groups[group]}</h3>
          <span className="font-brush text-2xl text-accent" aria-hidden>{['壱', '弐', '参', '肆'][n]}</span>
        </div>
        <ul className="grid gap-1.5">
          {SKILLS[group].map((s) => (
            <li key={s} className="label-mono flex items-center gap-2 !text-[0.8rem] text-ink">
              <span aria-hidden className="size-2 bg-accent" />{s}
            </li>
          ))}
        </ul>
      </div>
    </Rise>
  );
}

export function DojoIntro() {
  const { t } = useLang();
  return (
    <div className="flex flex-col gap-6">
      <ChapterLabel kanji="技" n={3} name={t.waza.label} />
      <DisplayTitle text={t.waza.title} />
    </div>
  );
}

const GROUPS: { g: Group; depth: number; tilt: number; pos: string }[] = [
  { g: 'front', depth: -120, tilt: -3, pos: 'md:left-[50%] md:top-[16%]' },
  { g: 'back', depth: 140, tilt: 2, pos: 'md:left-[71%] md:top-[9%]' },
  { g: 'data', depth: 60, tilt: 3, pos: 'md:left-[55%] md:top-[56%]' },
  { g: 'infra', depth: -240, tilt: -2, pos: 'md:left-[76%] md:top-[52%]' },
];

export function DojoScene() {
  return (
    <>
      <Layer kind="scenery" depth={1300} speed={0.35} className="flex flex-col justify-center gap-6 opacity-25">
        <ScrollVelocity
          texts={[STACK_BAND.join('  ·  '), [...STACK_BAND].reverse().join('  ·  ')]}
          velocity={40} numCopies={4} outlineAlternate fadeEdges={false}
          className="font-display uppercase text-ink" fontSize="clamp(3rem, 8vw, 7rem)" gap={32}
        />
      </Layer>
      <Layer kind="scenery" depth={500} speed={0.6}>
        <Bamboo className="absolute top-0 left-[4vw] h-full w-[16vw]" seed={31} stalks={3} />
        <Bamboo className="absolute top-0 right-0 h-full w-[14vw]" seed={17} stalks={2} flip />
      </Layer>
      <Gate />
      <Layer label="Skills" className="mx-auto flex max-w-[1300px] items-start px-4 pt-24 md:items-center md:px-10 md:pt-0">
        <BigKanji className="top-[6vh] left-[4vw]">技</BigKanji>
        <div className="relative w-full md:w-[40%]">
          <DojoIntro />
        </div>
      </Layer>
      {/* desktop: cada ema en su propia capa y profundidad */}
      {GROUPS.map(({ g, depth, tilt, pos }, n) => (
        <Layer key={g} depth={depth} className="hidden md:block">
          <div className={`absolute ${pos}`}><Ema group={g} n={n} tilt={tilt} /></div>
        </Layer>
      ))}
      {/* mobile: grilla 2×2 en una capa */}
      <Layer className="flex items-end px-4 pb-[8vh] md:hidden">
        <div className="grid w-full grid-cols-2 gap-x-3 gap-y-10">
          {GROUPS.map(({ g }, n) => <Ema key={g} group={g} n={n} />)}
        </div>
      </Layer>
    </>
  );
}
