// 森 MORI: bosque profundo. El komorebi (LightRays de fondo) llega al máximo acá.
import { Layer, useStationMaybe } from '@/world/World';
import { Bamboo, Leaves } from '@/art';
import { BigKanji, ChapterLabel, DisplayTitle } from '@/components/ui';
import { Rise } from '@/components/Reveal';
import { useLang } from '@/i18n/LangContext';
import CountUp from '@/components/bits/CountUp';
import { Gate } from './Gate';

export function ForestContent() {
  const { t } = useLang();
  const active = useStationMaybe()?.active ?? true;
  return (
    <div className="relative mx-auto flex h-full max-w-[1200px] flex-col justify-center gap-10 px-4 md:px-10">
      <BigKanji className="top-[2vh] left-[30vw]">森</BigKanji>
      <div className="flex flex-col gap-6">
        <ChapterLabel kanji="森" n={5} name={t.mori.label} />
        <DisplayTitle text={t.mori.title} />
      </div>
      <dl className="grid gap-4 sm:grid-cols-3">
        {t.mori.stats.map((s, i) => (
          <Rise key={s.k} at={0.3 + i * 0.05} className="brutal-border brutal-shadow bg-surface-raised p-5">
            <dd className="font-display text-[clamp(3.5rem,8vw,6.5rem)] leading-none text-accent">
              <CountUp to={s.n} duration={1.6} startWhen={active} />
            </dd>
            <dt className="label-mono mt-2 text-ink">{s.k}</dt>
          </Rise>
        ))}
      </dl>
      <p className="label-mono text-ink-muted">{t.mori.note}</p>
    </div>
  );
}

/** Bosque de bambú en 4 profundidades: el parallax entre ellas da la sensación de adentrarse. */
const GROVE = [
  { depth: 2000, speed: 0.3, op: 0.35, seeds: [70, 71, 72, 73] },
  { depth: 1100, speed: 0.55, op: 0.55, seeds: [74, 75, 76] },
  { depth: 400, speed: 0.8, op: 0.8, seeds: [77, 78] },
];

export function ForestScene() {
  return (
    <>
      {GROVE.map((g) => (
        <Layer key={g.depth} kind="scenery" depth={g.depth} speed={g.speed} style={{ opacity: g.op }}>
          {g.seeds.map((s, i) => (
            <Bamboo key={s} seed={s} stalks={3} flip={i % 2 === 1}
              className="absolute top-0 h-full w-[18vw]" style={{ left: `${(i / g.seeds.length) * 100 + (g.depth % 7)}%` }} />
          ))}
        </Layer>
      ))}
      <Gate />
      <Layer label="Bosque"><ForestContent /></Layer>
      <Layer kind="scenery" depth={-200}><Leaves count={14} seed={9} /></Layer>
    </>
  );
}
