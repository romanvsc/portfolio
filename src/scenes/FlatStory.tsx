// Versión sin movimiento (prefers-reduced-motion): mismas escenas, flujo vertical, sin cámara.
import type { ReactNode } from 'react';
import { moodVars, type Mood } from '@/world/moods';
import { useLang } from '@/i18n/LangContext';
import { ChannelLabel } from '@/components/ui';
import { SenalContent } from './Senal';
import { EyesStrip, QuienIntro } from './Quien';
import { GuiaContent } from './Guia';
import { ProjectCard, projectsOf } from './Canales';
import { AjusteContent } from './Ajuste';
import { ContactoContent } from './Contacto';

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
          className="brutal-border label-px cursor-pointer bg-surface-raised px-2.5 py-1 text-ink">{t.nav.lang}</button>
      </div>
      <Section mood="fosforo" className="h-svh min-h-[46rem] overflow-hidden !p-0" id="senal"><SenalContent /></Section>
      <p className="label-px bg-paper px-4 py-2 text-center text-on-paper">
        {t.flat.note} <a href="/" className="underline underline-offset-4">{t.flat.back}</a>
      </p>
      <Section mood="uva" id="quien" className="paper-bg !pb-0">
        <QuienIntro flat />
        <EyesStrip className="mt-12" />
      </Section>
      <Section mood="fosforo" id="guia"><GuiaContent flat /></Section>
      {(['system', 'web'] as const).map((path) => (
        <Section key={path} mood={path === 'system' ? 'fosforo' : 'brasa'} id={path === 'system' ? 'sistemas' : 'webs'} className="border-t-[3px] border-line">
          <header className="mx-auto mb-10 flex max-w-300 flex-col gap-2 px-4 md:px-10">
            <ChannelLabel ch={path === 'system' ? '04' : '05'} name={path === 'system' ? t.saku.systems : t.saku.webs} />
            <p className="text-lg text-ink">{path === 'system' ? t.saku.systemsLead : t.saku.websLead}</p>
          </header>
          <div className="grid gap-20">
            {projectsOf(path).map((p) => <ProjectCard key={p.id} p={p} />)}
          </div>
        </Section>
      ))}
      <Section mood="uva" id="ajuste" className="paper-bg"><AjusteContent /></Section>
      <Section mood="brasa" id="contacto"><ContactoContent /></Section>
    </main>
  );
}
