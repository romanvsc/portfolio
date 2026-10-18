// Versión sin movimiento (prefers-reduced-motion): mismas escenas, flujo vertical, sin cámara ni WebGL.
import type { ReactNode } from 'react';
import { moodVars, type Mood } from '@/world/moods';
import { useLang } from '@/i18n/LangContext';
import { SKILLS } from '@/content/profile';
import { Torii } from '@/art';
import { GateContent } from './Gate';
import { PathIntro } from './Path';
import { DojoIntro, Ema } from './Dojo';
import { ProjectCard, projectsOf } from './ToriiTunnel';
import { ChapterLabel } from '@/components/ui';
import { ForestContent } from './Forest';
import { ShrineContent } from './Shrine';

function Section({ mood, children, className = '', id }: { mood: Mood; children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} style={moodVars(mood)} className={`relative bg-surface py-16 text-ink ${className}`}>{children}</section>
  );
}

export function FlatStory() {
  const { t, lang, setLang } = useLang();
  return (
    <main id="main">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={`${t.nav.lang} · ${t.nav.langLabel}`}
          className="brutal-border label-mono cursor-pointer bg-surface-raised px-2.5 py-1 text-ink">{t.nav.lang}</button>
      </div>
      <Section mood="dawn" className="h-svh min-h-[640px] !py-0" id="mon"><GateContent /></Section>
      <p className="label-mono bg-ink px-4 py-2 text-center text-surface">
        {t.flat.note} <a href="/" className="underline underline-offset-4">{t.flat.back}</a>
      </p>
      <Section mood="dawn" id="michi"><PathIntro compact /></Section>
      <Section mood="forest" id="waza">
        <div className="mx-auto grid max-w-[1200px] gap-16 px-4 md:px-10">
          <DojoIntro />
          <div className="grid grid-cols-2 gap-x-4 gap-y-16 pt-10 md:grid-cols-4">
            {(Object.keys(SKILLS) as (keyof typeof SKILLS)[]).map((g, n) => <Ema key={g} group={g} n={n} />)}
          </div>
        </div>
      </Section>
      {(['system', 'web'] as const).map((path, g) => (
        <Section key={path} mood="forest" id={path === 'system' ? 'sistemas' : 'webs'} className="border-t-[3px] border-line">
          <header className="mx-auto mb-10 flex max-w-300 flex-col gap-2 px-4 md:px-10">
            <ChapterLabel kanji={path === 'system' ? '仕' : '網'} n={4 + g} name={path === 'system' ? t.saku.systems : t.saku.webs} />
            <p className="text-lg text-ink">{path === 'system' ? t.saku.systemsLead : t.saku.websLead}</p>
          </header>
          <div className="grid gap-20">
            {projectsOf(path).map((p, n) => <ProjectCard key={p.id} p={p} flip={n % 2 === 1} />)}
          </div>
          <Torii className="pointer-events-none absolute right-4 bottom-0 h-40 opacity-20" band={false} />
        </Section>
      ))}
      <Section mood="forest" id="mori"><ForestContent /></Section>
      <Section mood="night" id="en"><ShrineContent /></Section>
    </main>
  );
}
