// CH 06 · AJUSTE: carta de ajuste con los números reales (CONTEXT.md).
import { Layer, useStationMaybe } from '@/world/World';
import { ColorBars, Sparkle } from '@/art';
import { ChannelLabel, DisplayTitle } from '@/components/ui';
import { Rise } from '@/components/Reveal';
import { useLang } from '@/i18n/LangContext';
import CountUp from '@/components/bits/CountUp';

export function AjusteContent() {
  const { t } = useLang();
  const active = useStationMaybe()?.active ?? true;
  return (
    <div className="relative mx-auto flex h-full max-w-300 flex-col justify-center gap-8 px-4 md:gap-10 md:px-10">
      <div className="flex flex-col gap-3">
        <ChannelLabel ch="06" name={t.ajuste.label} />
        <DisplayTitle text={t.ajuste.title} />
      </div>
      <dl className="grid gap-4 sm:grid-cols-3">
        {t.ajuste.stats.map((s, i) => (
          <Rise key={s.k} at={0.3 + i * 0.05} className="brutal-border brutal-shadow flex flex-col-reverse bg-surface-raised p-5">
            <dt className="label-px mt-2 text-ink">{s.k}</dt>
            <dd className="glow-text font-display text-[clamp(3.5rem,8vw,6.5rem)] leading-none text-glow">
              <CountUp to={s.n} duration={1.6} startWhen={active} />
            </dd>
          </Rise>
        ))}
      </dl>
      <p className="label-px text-ink-muted">{t.ajuste.note}</p>
    </div>
  );
}

export function AjusteScene() {
  return (
    <>
      <Layer kind="scenery" depth={900} speed={0.5}>
        <div className="paper-bg absolute -inset-[10%]" />
      </Layer>
      {/* barras de ajuste en la tríada, detrás del contenido */}
      <Layer kind="scenery" depth={400} speed={0.7} className="flex flex-col justify-between opacity-80">
        <ColorBars className="h-[11vh] w-full" />
        <ColorBars className="h-[4vh] w-full -scale-x-100" />
      </Layer>
      <Layer label="Carta de ajuste"><AjusteContent /></Layer>
      <Layer kind="scenery" depth={-120}>
        <Sparkle className="absolute top-[30vh] right-[8vw] w-10 text-ink" />
        <Sparkle className="absolute bottom-[18vh] left-[6vw] w-6 text-pop" />
      </Layer>
    </>
  );
}
