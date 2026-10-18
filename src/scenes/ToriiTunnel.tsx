// 仕 Sistemas / 網 Webs: un portal por grupo; dentro, un corte de katana pasa de un proyecto al siguiente.
import { useId, useState } from 'react';
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'motion/react';
import { Layer, useStation, useWorld } from '@/world/World';
import { GAP, STATIONS, groupS, slash, smoothstep } from '@/world/stations';
import { Bamboo } from '@/art';
import { BigKanji, BrutalButton, BrutalLink, ChapterLabel, Chip } from '@/components/ui';
import { Rise, useProgress } from '@/components/Reveal';
import { useLang } from '@/i18n/LangContext';
import { PROJECTS, type Project } from '@/content/projects';
import { openCase } from '@/components/CaseScroll';
import { Gate } from './Gate';

export type ProjectPath = Project['path'];
export const projectsOf = (path: ProjectPath) => PROJECTS.filter((p) => p.path === path);

/** Placa del proyecto. */
export function ProjectCard({ p, flip = false }: { p: Project; flip?: boolean }) {
  const { t, tr } = useLang();
  const list = projectsOf(p.path);
  return (
    <article className={`relative mx-auto grid w-full max-w-300 items-center gap-4 px-4 md:grid-cols-[1.15fr_1fr] md:gap-12 md:px-10 ${flip ? 'md:[&>*:first-child]:order-2' : ''}`}>
      <Rise at={0.32} style={{ rotateY: flip ? -6 : 6, transformPerspective: 1200 }}>
        <button type="button" onClick={() => openCase(p.id)} aria-label={`${t.saku.open}: ${p.name}`}
          className="brutal-border brutal-shadow brutal-press group relative block w-full cursor-pointer overflow-hidden bg-surface-raised">
          <div className="flex items-center justify-between border-b-[3px] border-line bg-ink px-3 py-1.5">
            <span className="flex gap-1.5" aria-hidden>
              {[0, 1, 2].map((k) => <span key={k} className="size-2.5 rounded-full border-2 border-surface" />)}
            </span>
            <span className="label-mono truncate text-surface">{p.url?.replace(/^https?:\/\//, '').replace(/\/$/, '') ?? p.name}</span>
          </div>
          <img src={p.images[0]} alt="" loading="lazy" decoding="async"
            className="aspect-16/10 max-h-[22vh] w-full object-cover object-left-top md:max-h-none transition-transform duration-700 ease-brush group-hover:scale-[1.04]" />
        </button>
      </Rise>
      <div className="relative flex flex-col gap-2.5 md:gap-4">
        <Rise at={0.26} className="flex items-center gap-3">
          <span className="font-brush text-4xl leading-none text-accent md:text-7xl" aria-hidden>{p.numeral}</span>
          <div>
            <p className="label-mono text-ink-muted">
              {p.path === 'system' ? t.saku.systems : t.saku.webs} · {list.indexOf(p) + 1}/{list.length}
            </p>
            <p className="label-mono text-ink">{tr(p.client)}</p>
          </div>
        </Rise>
        <Rise at={0.3}>
          <h3 className="font-display text-[clamp(2rem,4.6vw,4rem)] uppercase leading-[0.95] tracking-[-0.02em] text-ink">{p.name}</h3>
        </Rise>
        <Rise at={0.34}><p className="max-w-md text-base leading-relaxed text-ink md:text-lg">{tr(p.summary)}</p></Rise>
        <Rise at={0.38} className="flex flex-wrap gap-2">
          <Chip className="bg-accent! text-on-accent!">{t.saku.role}: {tr(p.role)}</Chip>
          {/* en mobile no entra el stack: queda en el caso */}
          {p.stack.slice(0, 5).map((s) => <Chip key={s} className="max-md:hidden">{s}</Chip>)}
        </Rise>
        <Rise at={0.42} className="flex flex-wrap gap-3 md:pt-2">
          <BrutalButton tone="accent" onClick={() => openCase(p.id)}>{t.saku.open} <span aria-hidden>→</span></BrutalButton>
          {p.url && <BrutalLink href={p.url}>{t.saku.live}</BrutalLink>}
        </Rise>
      </div>
    </article>
  );
}

// Diagonal del tajo, en % del mazo: de (62%, 0) a (38%, 100%)
const CLIP_A = 'polygon(0% 0%, 62% 0%, 38% 100%, 0% 100%)';
const CLIP_B = 'polygon(62% 0%, 100% 0%, 100% 100%, 38% 100%)';

/** Una placa del mazo: dos copias recortadas sobre la diagonal que se separan con el corte. */
function DeckCard({ p, j, n, s, current }: { p: Project; j: number; n: number; s: MotionValue<number>; current: number }) {
  // cut propio: 0 entero, 1 ya cortada. enter: 0 sin aparecer, 1 visible.
  const cut = useTransform(s, (v) => { const r = slash(v, n); return j < r.index ? 1 : j === r.index ? r.cut : 0; });
  const enter = useTransform(s, (v) => {
    const r = slash(v, n);
    return j <= r.index ? 1 : j === r.index + 1 ? smoothstep(0.25, 0.9, r.cut) : 0;
  });
  // 'inherit' (no 'visible'): si no, pisaría el hidden de la capa cuando la estación está lejos
  const visibility = useTransform([cut, enter], ([c, e]: number[]) => (c >= 0.999 || e <= 0.001 ? 'hidden' : 'inherit'));
  const scale = useTransform(enter, (e) => 0.94 + 0.06 * e);
  const clipA = useTransform(cut, (c) => (c > 0.001 ? CLIP_A : 'none'));
  const fade = useTransform(cut, (c) => 1 - smoothstep(0.45, 1, c));
  const ax = useTransform(cut, (c) => -c * 140);
  const ay = useTransform(cut, (c) => c * 70);
  const ar = useTransform(cut, (c) => -c * 7);
  const bx = useTransform(cut, (c) => c * 140);
  const by = useTransform(cut, (c) => c * 160);
  const br = useTransform(cut, (c) => c * 9);
  const bOpacity = useTransform(cut, (c) => (c > 0.001 ? 1 - smoothstep(0.45, 1, c) : 0));
  const live = j === current;

  return (
    <motion.div className="relative" style={{ visibility, opacity: enter, scale, zIndex: n - j }}
      aria-hidden={!live || undefined} inert={!live || undefined}>
      <motion.div style={{ clipPath: clipA, x: ax, y: ay, rotate: ar, opacity: fade }}>
        <ProjectCard p={p} flip={j % 2 === 1} />
      </motion.div>
      {/* mitad derecha: copia sólo visual durante el corte */}
      <motion.div className="pointer-events-none absolute inset-0" aria-hidden inert
        style={{ clipPath: CLIP_B, x: bx, y: by, rotate: br, opacity: bOpacity }}>
        <ProjectCard p={p} flip={j % 2 === 1} />
      </motion.div>
    </motion.div>
  );
}

/** El tajo: pincelada de tinta sobre la diagonal + destello de la hoja. */
function SlashStroke({ s, n }: { s: MotionValue<number>; n: number }) {
  const id = useId().replace(/:/g, '');
  const cut = useTransform(s, (v) => slash(v, n).cut);
  const draw = useTransform(cut, (c) => smoothstep(0, 0.35, c));
  const offset = useTransform(draw, (d) => 1 - d);
  const ink = useTransform(cut, (c) => (c <= 0.001 ? 0 : 1 - smoothstep(0.55, 1, c)));
  const flash = useTransform(draw, (d) => Math.sin(Math.PI * d));
  const d = 'M63.9 -8 L36.1 108';
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden
      className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible">
      <defs>
        <filter id={`ink${id}`} x="-20%" y="-5%" width="140%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="2.5" />
        </filter>
      </defs>
      <motion.path d={d} pathLength={1} fill="none" stroke="var(--color-line)" strokeWidth={46} strokeLinecap="round"
        vectorEffect="non-scaling-stroke" filter={`url(#ink${id})`}
        style={{ strokeDasharray: 1, strokeDashoffset: offset, opacity: ink }} />
      <motion.path d={d} pathLength={1} fill="none" stroke="var(--color-accent-bright)" strokeWidth={5}
        vectorEffect="non-scaling-stroke" style={{ strokeDasharray: 1, strokeDashoffset: offset, opacity: flash }} />
    </svg>
  );
}

/** Estación de un grupo (Sistemas o Webs): encabezado + paginador + mazo con corte de katana. */
export function ProjectGroupScene({ path }: { path: ProjectPath }) {
  const { t } = useLang();
  const { goTo } = useWorld();
  const { index } = useStation();
  const list = projectsOf(path);
  const n = list.length;
  const st = STATIONS[index];
  const s = useTransform(useProgress(), (v) => groupS(v, n));
  // estado inicial desde el valor actual: si la estación se monta ya en una parada, "change" no se dispara
  const [current, setCurrent] = useState(() => slash(s.get(), n).index);
  useMotionValueEvent(s, 'change', (v) => {
    const k = slash(v, n).index;
    setCurrent((c) => (c === k ? c : k));
  });

  return (
    <>
      <Layer kind="scenery" depth={700} speed={0.5}>
        <Bamboo className="absolute top-0 left-0 h-full w-[16vw]" seed={path === 'system' ? 41 : 47} stalks={3} />
        <Bamboo className="absolute top-0 right-0 h-full w-[16vw]" seed={path === 'system' ? 43 : 49} stalks={3} flip />
      </Layer>
      <Layer kind="scenery" depth={GAP * 0.3} speed={0.8} className="flex items-center justify-center">
        <BigKanji className="static! opacity-[0.06]!">{st.kanji}</BigKanji>
      </Layer>
      <Gate className="left-1/2 h-[50vh] md:h-screen" />
      <Layer label={path === 'system' ? t.saku.systems : t.saku.webs} className="flex flex-col pt-18 pb-4 md:pt-24 md:pb-6">
        <header className="mx-auto flex w-full max-w-300 flex-wrap items-end justify-between gap-4 px-4 md:px-10">
          <div className="flex flex-col gap-2">
            <ChapterLabel kanji={st.kanji} n={index + 1} name={path === 'system' ? t.saku.systems : t.saku.webs} />
            <p className="brutal-panel py-1.5! text-sm text-ink md:text-base">{path === 'system' ? t.saku.systemsLead : t.saku.websLead}</p>
          </div>
          <nav aria-label={t.saku.pager} className="flex gap-2">
            {list.map((p, k) => (
              <button key={p.id} type="button" onClick={() => goTo(index, false, k)} aria-label={`${t.saku.pager}: ${p.name}`}
                aria-current={k === current || undefined}
                className={`font-brush flex size-10 cursor-pointer items-center justify-center border-[3px] border-line text-xl transition-all duration-300 ${k === current ? 'bg-accent text-on-accent' : 'bg-surface text-ink hover:bg-surface-raised'}`}
                style={{ boxShadow: k === current ? '4px 4px 0 var(--color-shadow)' : undefined }}>
                {p.numeral}
              </button>
            ))}
          </nav>
        </header>
        <div className="relative flex flex-1 items-center">
          <div className="relative grid w-full *:col-start-1 *:row-start-1">
            {list.map((p, j) => <DeckCard key={p.id} p={p} j={j} n={n} s={s} current={current} />)}
            <SlashStroke s={s} n={n} />
          </div>
        </div>
        <p className="label-mono text-center text-ink-muted transition-opacity duration-500" style={{ opacity: current < n - 1 ? 1 : 0 }} aria-hidden>
          ↓ {t.saku.hint}
        </p>
      </Layer>
    </>
  );
}
