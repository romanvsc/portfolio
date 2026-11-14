// CH 04 Sistemas / CH 05 Webs: cada proyecto es una emisión; scrollear hace zapping al siguiente.
import { useState } from 'react';
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'motion/react';
import { Layer, useStation, useWorld } from '@/world/World';
import { STATIONS, groupS, zap, smoothstep } from '@/world/stations';
import { BigNumber, BrutalButton, BrutalLink, ChannelLabel } from '@/components/ui';
import { Rise, useProgress } from '@/components/Reveal';
import { useLang } from '@/i18n/LangContext';
import { PROJECTS, type Project } from '@/content/projects';
import { openCase } from '@/components/CaseScroll';

export type ProjectPath = Project['path'];
export const projectsOf = (path: ProjectPath) => PROJECTS.filter((p) => p.path === path);

/** Ficha del proyecto: captura en un mini CRT + metadatos (estilo ficha de producto). */
export function ProjectCard({ p }: { p: Project }) {
  const { t, tr } = useLang();
  const list = projectsOf(p.path);
  const host = p.url?.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return (
    <article className="relative mx-auto grid w-full max-w-300 items-center gap-4 px-4 md:grid-cols-[1.2fr_1fr] md:gap-12 md:px-10">
      <Rise at={0.32}>
        <button type="button" onClick={() => openCase(p.id)} aria-label={`${t.saku.open}: ${p.name}`}
          className="brutal-shadow brutal-press group relative block w-full cursor-pointer overflow-hidden rounded-[1.4rem] border-[6px] border-line bg-surface-raised p-2 md:p-3">
          <span className="relative block overflow-hidden rounded-[0.9rem]">
            <img src={p.images[0]} alt="" loading="lazy" decoding="async"
              className="aspect-16/10 max-h-[24vh] w-full short:max-h-[11vh] object-cover object-left-top transition-transform duration-700 ease-snap group-hover:scale-[1.04] md:max-h-none" />
            <span aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-60" />
            <span aria-hidden className="crt-vignette pointer-events-none absolute inset-0" />
          </span>
          <span className="label-px absolute bottom-4 left-4 rounded-md bg-accent px-2 py-0.5 text-on-accent md:bottom-6 md:left-6">
            {list.indexOf(p) + 1}/{list.length}
          </span>
        </button>
      </Rise>
      <div className="relative flex flex-col gap-2.5 md:gap-4">
        <Rise at={0.26} className="flex items-end gap-3">
          <span className="glow-text font-display text-5xl leading-none text-glow md:text-8xl" aria-hidden>{p.numeral}</span>
          <p className="label-px pb-1 text-ink-muted">{tr(p.client)}</p>
        </Rise>
        <Rise at={0.3}>
          <h3 className="font-display -skew-x-6 text-[clamp(2rem,4.6vw,4.2rem)] uppercase short:text-[1.6rem] leading-[0.92] text-ink">{p.name}</h3>
        </Rise>
        <Rise at={0.34}><p className="max-w-md text-base leading-relaxed text-ink short:text-sm short:leading-snug md:text-lg">{tr(p.summary)}</p></Rise>
        <Rise at={0.38}>
          <dl className="grid max-w-md grid-cols-[auto_1fr] border-[3px] border-line bg-surface-raised text-sm max-md:hidden">
            <dt className="label-px border-r-2 border-b-2 border-line/60 px-3 py-2 text-glow">{t.saku.role}</dt>
            <dd className="border-b-2 border-line/60 px-3 py-2 text-ink">{tr(p.role)}</dd>
            <dt className="label-px border-r-2 border-line/60 px-3 py-2 text-glow">{t.saku.stack}</dt>
            <dd className="px-3 py-2 text-ink">{p.stack.slice(0, 5).join(' · ')}</dd>
            {p.status && <>
              <dt className="label-px border-t-2 border-r-2 border-line/60 px-3 py-2 text-glow">{t.saku.status}</dt>
              <dd className="border-t-2 border-line/60 px-3 py-2 text-ink">{tr(p.status)}</dd>
            </>}
          </dl>
          <p className="label-px text-ink-muted short:hidden md:hidden">{t.saku.role}: {tr(p.role)}</p>
        </Rise>
        <Rise at={0.42} className="flex flex-wrap gap-2 md:gap-3 md:pt-1">
          <BrutalButton tone="accent" className="max-md:px-3 short:py-2" onClick={() => openCase(p.id)}>{t.saku.open} <span aria-hidden>→</span></BrutalButton>
          {p.url && <BrutalLink href={p.url} className="max-md:px-3 short:py-2" aria-label={`${t.saku.live}: ${host}`}>{t.saku.live}</BrutalLink>}
        </Rise>
      </div>
    </article>
  );
}

/** Una emisión del grupo: se apaga en una línea (CRT) y se enciende la siguiente. */
function ZapCard({ p, j, n, s, current }: { p: Project; j: number; n: number; s: MotionValue<number>; current: number }) {
  const scaleY = useTransform(s, (v) => {
    const r = zap(v, n);
    if (j === r.index) return 1 - 0.985 * smoothstep(0, 0.5, r.cut);
    if (j === r.index + 1) return 0.015 + 0.985 * smoothstep(0.5, 1, r.cut);
    return 0.015;
  });
  const opacity = useTransform(s, (v) => {
    const r = zap(v, n);
    if (j === r.index) return 1 - smoothstep(0.42, 0.5, r.cut);
    if (j === r.index + 1) return smoothstep(0.5, 0.58, r.cut);
    return 0;
  });
  // 'inherit' (no 'visible'): si no, pisaría el hidden de la capa cuando la estación está lejos
  const visibility = useTransform(opacity, (o) => (o <= 0.001 ? 'hidden' : 'inherit'));
  const live = j === current;
  return (
    <motion.div className="relative origin-center" style={{ scaleY, opacity, visibility }}
      aria-hidden={!live || undefined} inert={!live || undefined}>
      <ProjectCard p={p} />
    </motion.div>
  );
}

/** Estación de un grupo (Sistemas o Webs): encabezado + paginador + emisiones con zapping. */
export function ProjectGroupScene({ path }: { path: ProjectPath }) {
  const { t } = useLang();
  const { cut } = useWorld();
  const { index } = useStation();
  const list = projectsOf(path);
  const n = list.length;
  const st = STATIONS[index];
  const s = useTransform(useProgress(), (v) => groupS(v, n));
  const noise = useTransform(s, (v) => Math.sin(Math.PI * zap(v, n).cut) * 0.9);
  // oculta (no sólo transparente) fuera del zapping: así su animación no repinta
  const noiseVis = useTransform(noise, (o) => (o <= 0.01 ? 'hidden' : 'inherit'));
  // estado inicial desde el valor actual: si la estación se monta ya en una parada, "change" no se dispara
  const [current, setCurrent] = useState(() => zap(s.get(), n).index);
  useMotionValueEvent(s, 'change', (v) => {
    const k = zap(v, n).index;
    setCurrent((c) => (c === k ? c : k));
  });
  const name = path === 'system' ? t.saku.systems : t.saku.webs;

  return (
    <>
      <Layer kind="scenery" depth={900} speed={0.5}>
        <div className="hatch absolute -inset-[10%]" />
      </Layer>
      <Layer kind="scenery" depth={500} speed={0.7} className="flex items-center justify-center">
        <BigNumber className="static!">{st.ch}</BigNumber>
      </Layer>
      <Layer label={name} className="flex flex-col pt-18 pb-4 md:pt-24 md:pb-6">
        <header className="mx-auto flex w-full max-w-300 flex-wrap items-end justify-between gap-4 px-4 md:px-10">
          <div className="flex flex-col gap-2">
            <ChannelLabel ch={st.ch} name={name} />
            <p className="brutal-panel py-1.5! text-sm text-ink md:text-base">{path === 'system' ? t.saku.systemsLead : t.saku.websLead}</p>
          </div>
          <nav aria-label={t.saku.pager} className="flex gap-2">
            {list.map((p, k) => (
              <button key={p.id} type="button" onClick={() => cut(index, k)} aria-label={`${t.saku.pager}: ${p.name}`}
                aria-current={k === current || undefined}
                className={`osd flex size-10 cursor-pointer items-center justify-center rounded-md border-[3px] border-line transition-all duration-300 ${k === current ? 'bg-accent text-on-accent' : 'bg-surface text-ink hover:bg-surface-raised'}`}
                style={{ boxShadow: k === current ? '4px 4px 0 var(--color-shadow)' : undefined }}>
                {p.numeral}
              </button>
            ))}
          </nav>
        </header>
        <div className="relative flex flex-1 items-center">
          <div className="relative grid w-full *:col-start-1 *:row-start-1">
            {list.map((p, j) => <ZapCard key={p.id} p={p} j={j} n={n} s={s} current={current} />)}
          </div>
        </div>
        <p className="label-px text-center text-ink-muted transition-opacity duration-500" style={{ opacity: current < n - 1 ? 1 : 0 }} aria-hidden>
          ▼ {t.saku.hint}
        </p>
        {/* la estática cubre toda la pantalla de la tele: sin bordes ni líneas */}
        <motion.div aria-hidden className="static-noise pointer-events-none absolute -inset-[6%] z-30" style={{ opacity: noise, visibility: noiseVis }} />
      </Layer>
    </>
  );
}
