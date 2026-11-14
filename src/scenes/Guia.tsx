// CH 03 · GUÍA: el stack como guía de programación de TV.
import { Layer } from '@/world/World';
import { ChannelLabel, DisplayTitle, BigNumber } from '@/components/ui';
import { Rise } from '@/components/Reveal';
import { useLang } from '@/i18n/LangContext';
import { SKILLS, STACK_BAND } from '@/content/profile';
import ScrollVelocity from '@/components/bits/ScrollVelocity';
import { ICON_SIZE, TECH_ICONS } from '@/art/tech-icons';

type Group = keyof typeof SKILLS;
const GROUPS = Object.keys(SKILLS) as Group[];

export function GuiaContent({ flat = false }: { flat?: boolean }) {
  const { t } = useLang();
  return (
    <div className={`relative mx-auto flex h-full w-full max-w-300 flex-col justify-center gap-6 px-4 short:gap-3 md:gap-8 md:px-10 ${flat ? '' : 'pt-16 short:pt-8'}`}>
      <div className="flex flex-col gap-3 short:gap-1.5">
        <ChannelLabel ch="03" name={t.guia.label} />
        <DisplayTitle text={t.guia.title} />
      </div>
      <div className="brutal-shadow border-[3px] border-line">
        {GROUPS.map((g, n) => (
          <Rise key={g} at={0.28 + n * 0.04}
            className="grid grid-cols-[6.5rem_1fr] border-line short:grid-cols-[5.5rem_1fr] bg-surface-raised not-last:border-b-[3px] md:grid-cols-[10rem_1fr]">
            <h3 className="label-px flex flex-col justify-center gap-0.5 border-r-[3px] md:flex-row md:items-center md:justify-start md:gap-2 border-line bg-accent px-3 text-on-accent short:px-2">
              <span aria-hidden>{String(n + 1).padStart(2, '0')}</span>{t.guia.groups[g]}
            </h3>
            <ul className="flex flex-wrap">
              {SKILLS[g].map((s) => (
                <li key={s} className="label-px flex min-w-fit flex-1 items-center gap-2.5 border-r-2 border-b-2 border-line/50 px-3 py-1.5 text-ink short:gap-1.5 short:px-2 short:py-[3px] md:py-3.5 md:!text-sm">
                  {/* logo en pixel art (scripts/pixel-icons.mjs) */}
                  <svg viewBox={`0 0 ${ICON_SIZE} ${ICON_SIZE}`} aria-hidden shapeRendering="crispEdges" className="size-5 shrink-0 text-glow md:size-6">
                    <path d={TECH_ICONS[s]} fill="currentColor" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </Rise>
        ))}
      </div>
      <p className="label-px text-ink-muted short:hidden">{t.guia.note}</p>
    </div>
  );
}

export function GuiaScene() {
  return (
    <>
      <Layer kind="scenery" depth={1300} speed={0.35} className="flex flex-col justify-center gap-6 opacity-[0.07]">
        <ScrollVelocity
          texts={[STACK_BAND.join('  ·  '), [...STACK_BAND].reverse().join('  ·  ')]}
          velocity={40} numCopies={4} outlineAlternate fadeEdges={false}
          className="font-display uppercase text-ink-muted" fontSize="clamp(3rem, 8vw, 7rem)" gap={32}
        />
      </Layer>
      <Layer kind="scenery" depth={600} speed={0.6} className="flex items-center justify-end">
        <BigNumber className="static!">03</BigNumber>
      </Layer>
      <Layer label="Guía de programación">
        <GuiaContent />
      </Layer>
    </>
  );
}
