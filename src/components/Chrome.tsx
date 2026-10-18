// Navegación fija: menú (StaggeredMenu), idioma y barra de progreso con kanji.
import { useWorld } from '@/world/World';
import { STATIONS } from '@/world/stations';
import { useLang } from '@/i18n/LangContext';
import { PROFILE } from '@/content/profile';
import { Hanko } from '@/art';
import StaggeredMenu from './bits/StaggeredMenu';

const NAV = STATIONS.map((s, i) => ({ ...s, i }));

export function Chrome() {
  const { t, lang, setLang } = useLang();
  const { active, goTo } = useWorld();
  const current = STATIONS[active].id;

  return (
    <>
      <StaggeredMenu
        isFixed position="right" displaySocials displayItemNumbering={false}
        colors={['var(--color-accent)', 'var(--color-surface-raised)']}
        accentColor="var(--color-accent)"
        menuButtonColor="var(--color-ink)" openMenuButtonColor="var(--color-ink)"
        menuLabel={t.nav.menu} closeLabel={t.nav.close} socialsTitle={t.nav.socials}
        logo={
          <button type="button" onClick={() => goTo(0)} className="flex cursor-pointer items-center gap-3">
            <Hanko size={40} />
            <span className="label-mono sr-only text-ink sm:not-sr-only">{PROFILE.name}</span>
          </button>
        }
        items={NAV.map((n) => ({
          label: `${n.kanji} ${t.nav.chapters[n.id]}`,
          ariaLabel: t.nav.chapters[n.id],
          link: `#${n.id}`,
        }))}
        onItemClick={(k) => goTo(NAV[k].i)}
        socialItems={[
          { label: 'GitHub', link: PROFILE.github },
          { label: 'LinkedIn', link: PROFILE.linkedin },
          { label: 'WhatsApp', link: PROFILE.whatsapp },
          { label: 'Email', link: `mailto:${PROFILE.email}` },
        ]}
      />

      <button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={`${t.nav.lang} · ${t.nav.langLabel}`}
        className="brutal-border brutal-press label-mono fixed top-[1.55rem] right-[8.5rem] z-50 cursor-pointer bg-surface-raised px-2.5 py-1 text-ink"
        style={{ boxShadow: '3px 3px 0 var(--color-shadow)' }}>
        {t.nav.lang}
      </button>

      {/* barra de progreso de pincel (desktop) */}
      <nav aria-label={t.nav.menu} className="fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 md:block">
        <ol className="relative flex flex-col items-center gap-5">
          <span aria-hidden className="absolute inset-y-2 left-1/2 w-[3px] -translate-x-1/2 bg-line opacity-25" />
          {NAV.map((n) => {
            const on = n.id === current;
            return (
              <li key={n.id} className="relative">
                <button type="button" onClick={() => goTo(n.i)} aria-current={on ? 'step' : undefined}
                  aria-label={t.nav.chapters[n.id]}
                  className={`group relative flex size-10 cursor-pointer items-center justify-center border-[3px] border-line font-brush text-xl transition-all duration-300 ${on ? 'scale-110 bg-accent text-on-accent' : 'bg-surface text-ink hover:bg-surface-raised'}`}
                  style={{ boxShadow: on ? '4px 4px 0 var(--color-shadow)' : undefined }}>
                  {n.kanji}
                  <span className="label-mono pointer-events-none absolute right-14 whitespace-nowrap border-2 border-line bg-surface-raised px-2 py-0.5 text-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    {t.nav.chapters[n.id]}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
