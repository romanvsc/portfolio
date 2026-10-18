// Caso de estudio: se desenrolla como un makimono. URL compartible: #/p/<id>
import { useEffect, useRef, useState } from 'react';
import { animate } from 'motion/react';
import { PROJECTS } from '@/content/projects';
import { useLang } from '@/i18n/LangContext';
import { BrutalButton, BrutalLink, Chip } from './ui';
import { Seigaiha } from '@/art';

const parse = () => /^#\/p\/([\w-]+)$/.exec(location.hash)?.[1] ?? null;

export const openCase = (id: string) => { location.hash = `/p/${id}`; };
const closeCase = () => history.pushState(null, '', location.pathname + location.search);

export function CaseScroll() {
  const { t, tr } = useLang();
  const [id, setId] = useState(parse);
  const dlg = useRef<HTMLDialogElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const p = PROJECTS.find((x) => x.id === id);

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
        animate(paper.current, { clipPath: ['inset(0 50% 0 50%)', 'inset(0 0% 0 0%)'] }, { duration: 0.9, ease: [0.87, 0, 0.13, 1] });
      }
    } else if (!p && d.open) {
      d.close();
      (opener.current as HTMLElement | null)?.focus?.();
    }
  }, [p]);

  const close = () => { closeCase(); setId(null); };

  return (
    <dialog ref={dlg} onCancel={(e) => { e.preventDefault(); close(); }} aria-labelledby="case-title"
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-[color-mix(in_oklab,var(--color-surface)_70%,transparent)] backdrop:backdrop-blur-sm">
      {p && (
        <div ref={paper} className="relative mx-auto flex h-full max-w-[1280px] p-2 md:p-6">
          {/* rodillos del pergamino */}
          <span aria-hidden className="brutal-border absolute inset-y-0 left-0 w-3 bg-accent md:left-3" />
          <span aria-hidden className="brutal-border absolute inset-y-0 right-0 w-3 bg-accent md:right-3" />
          <div data-lenis-prevent className="brutal-border brutal-shadow relative mx-3 w-full overflow-y-auto bg-surface md:mx-6">
            <Seigaiha className="pointer-events-none absolute inset-x-0 top-0 h-64" opacity={0.06} />
            <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b-[3px] border-line bg-accent px-4 py-3 md:px-8">
              <span className="label-mono text-on-accent">
                <span className="font-brush text-xl normal-case" aria-hidden>{p.numeral}</span> · {p.path === 'system' ? t.saku.systems : t.saku.webs}
              </span>
              <BrutalButton onClick={close} className="!px-3 !py-1.5" autoFocus>{t.saku.close} ✕</BrutalButton>
            </header>

            <div className="relative grid gap-10 px-4 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:px-8 md:py-12">
              <div className="flex flex-col gap-6">
                <p className="label-mono text-ink-muted">{tr(p.client)}</p>
                <h2 id="case-title" className="font-display text-[clamp(1.9rem,4vw,4rem)] leading-[0.95] break-words uppercase tracking-[-0.02em] text-ink">{p.name}</h2>
                <p className="text-xl leading-relaxed text-ink">{tr(p.summary)}</p>
                {p.status && <Chip className="self-start">{t.saku.status}: {tr(p.status)}</Chip>}
                <section>
                  <h3 className="label-mono mb-2 text-accent">{t.saku.role}</h3>
                  <p className="text-lg leading-relaxed text-ink">{tr(p.role)}</p>
                </section>
                <section>
                  <h3 className="label-mono mb-2 text-accent">{t.saku.problem}</h3>
                  <p className="text-lg leading-relaxed text-ink">{tr(p.problem)}</p>
                </section>
                <section>
                  <h3 className="label-mono mb-3 text-accent">{t.saku.features}</h3>
                  <ul className="grid gap-2">
                    {p.features.map((f) => (
                      <li key={f.es} className="brutal-border flex gap-3 bg-surface-raised px-3 py-2 text-ink">
                        <span aria-hidden className="mt-2 size-2 shrink-0 bg-accent" />{tr(f)}
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="label-mono mb-3 text-accent">{t.saku.stack}</h3>
                  <div className="flex flex-wrap gap-2">{p.stack.map((s) => <Chip key={s}>{s}</Chip>)}</div>
                </section>
                <div className="flex flex-wrap gap-3">
                  {p.url && <BrutalLink tone="accent" href={p.url}>{t.saku.live}</BrutalLink>}
                  <BrutalLink href={p.repo}>{t.saku.repo}</BrutalLink>
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
