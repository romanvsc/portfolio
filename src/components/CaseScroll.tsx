// Caso de estudio: se enciende como un CRT. URL compartible: #/p/<id>
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { animate } from 'motion/react';
import { PROJECTS } from '@/content/projects';
import { moodVars } from '@/world/moods';
import { useLang } from '@/i18n/LangContext';
import { BrutalButton, BrutalLink, Chip } from './ui';

const parse = () => /^#\/p\/([\w-]+)$/.exec(location.hash)?.[1] ?? null;

export const openCase = (id: string) => { location.hash = `/p/${id}`; };
const closeCase = () => history.pushState(null, '', location.pathname + location.search);

function Item({ children }: { children: ReactNode }) {
  return (
    <li className="brutal-border flex gap-3 bg-surface-raised px-3 py-2 text-ink">
      <span aria-hidden className="mt-2 size-2 shrink-0 bg-accent" />{children}
    </li>
  );
}

export function CaseScroll() {
  const { t, tr } = useLang();
  const [id, setId] = useState(parse);
  const dlg = useRef<HTMLDialogElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const p = PROJECTS.find((x) => x.id === id);
  // siguiente emisión del mismo grupo (vuelve a la primera)
  const group = PROJECTS.filter((x) => x.path === p?.path);
  const next = group[(group.findIndex((x) => x.id === id) + 1) % group.length];

  useEffect(() => {
    const on = () => setId(parse());
    window.addEventListener('hashchange', on);
    window.addEventListener('popstate', on);
    return () => { window.removeEventListener('hashchange', on); window.removeEventListener('popstate', on); };
  }, []);

  useEffect(() => {
    const d = dlg.current!;
    if (p && !d.open) {
      opener.current = document.activeElement;
      d.showModal();
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduce && paper.current) {
        animate(paper.current, { clipPath: ['inset(50% 0 50% 0)', 'inset(0% 0 0% 0)'] }, { duration: 0.6, ease: [0.87, 0, 0.13, 1] });
      }
    } else if (!p && d.open) {
      d.close();
      (opener.current as HTMLElement | null)?.focus?.();
    }
  }, [p]);

  const close = () => { closeCase(); setId(null); };

  return (
    // el caso toma el color de su grupo, no el del canal donde estás
    <dialog ref={dlg} style={p ? moodVars(p.path === 'system' ? 'fosforo' : 'brasa') : undefined} onCancel={(e) => { e.preventDefault(); close(); }} aria-labelledby="case-title"
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-[color-mix(in_oklab,var(--color-surface)_70%,transparent)] backdrop:backdrop-blur-sm">
      {p && (
        <div ref={paper} className="relative mx-auto flex h-full max-w-[1280px] p-2 md:p-6">
          <div key={p.id} data-lenis-prevent className="brutal-shadow relative w-full overflow-y-auto rounded-2xl border-[6px] border-line bg-surface">
            <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b-[3px] border-line bg-accent px-4 py-3 md:px-8">
              <span className="label-px text-on-accent">
                {p.numeral} · {p.path === 'system' ? t.saku.systems : t.saku.webs}
              </span>
              <BrutalButton onClick={close} className="!px-3 !py-1.5" autoFocus>{t.saku.close} ✕</BrutalButton>
            </header>

            <div className="relative grid gap-10 px-4 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:px-8 md:py-12">
              <div className="flex flex-col gap-6">
                <p className="label-px text-ink-muted">{tr(p.client)}</p>
                <h2 id="case-title" className="font-display text-[clamp(1.9rem,4vw,4rem)] leading-[0.95] break-words uppercase tracking-[-0.02em] text-ink">{p.name}</h2>
                <p className="text-xl leading-relaxed text-ink">{tr(p.summary)}</p>
                {p.status && <Chip className="self-start">{t.saku.status}: {tr(p.status)}</Chip>}
                <section>
                  <h3 className="label-px mb-2 text-accent">{t.saku.role}</h3>
                  <p className="text-lg leading-relaxed text-ink">{tr(p.role)}</p>
                </section>
                <section>
                  <h3 className="label-px mb-2 text-accent">{t.saku.problem}</h3>
                  <p className="text-lg leading-relaxed text-ink">{tr(p.problem)}</p>
                </section>
                <section>
                  <h3 className="label-px mb-2 text-accent">{t.saku.solution}</h3>
                  <p className="text-lg leading-relaxed text-ink">{tr(p.solution)}</p>
                </section>
                <section>
                  <h3 className="label-px mb-3 text-accent">{t.saku.features}</h3>
                  <ul className="grid gap-2">{p.features.map((f) => <Item key={f.es}>{tr(f)}</Item>)}</ul>
                </section>
                <section>
                  <h3 className="label-px mb-3 text-accent">{t.saku.decisions}</h3>
                  <ul className="grid gap-2">{p.decisions.map((d) => <Item key={d.es}>{tr(d)}</Item>)}</ul>
                  <h4 className="sr-only">{t.saku.stack}</h4>
                  <div className="mt-3 flex flex-wrap gap-2">{p.stack.map((s) => <Chip key={s}>{s}</Chip>)}</div>
                </section>
                {p.outcome && (
                  <section className="brutal-border brutal-shadow bg-accent px-4 py-3">
                    <h3 className="label-px mb-1 text-on-accent">{t.saku.outcome}</h3>
                    <p className="text-lg leading-relaxed text-on-accent">{tr(p.outcome)}</p>
                  </section>
                )}
                <div className="flex flex-wrap gap-3">
                  {p.url && <BrutalLink tone="accent" href={p.url}>{t.saku.live}</BrutalLink>}
                  <BrutalLink href={p.repo}>{t.saku.repo}</BrutalLink>
                  <BrutalButton tone="paper" onClick={() => openCase(next.id)}>{t.saku.next}: {next.name} <span aria-hidden>→</span></BrutalButton>
                </div>
              </div>
              <section aria-label={t.saku.gallery} className="flex flex-col gap-6">
                {p.images.map((src, i) => (
                  <img key={src} src={src} alt={`${p.name} · ${i + 1}`} loading="lazy" decoding="async"
                    className="brutal-border brutal-shadow w-full bg-surface-raised"
                    style={{ rotate: `${i % 2 ? 1 : -1}deg` }} />
                ))}
              </section>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
