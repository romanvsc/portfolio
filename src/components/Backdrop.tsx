// Vidrio de la pantalla (recortado al hueco de la TV): scanlines, viñeta, estática en cada cambio de canal y OSD.
// Sin GradualBlur (ensuciaba la barra del hero) ni Noise (casi invisible y Lighthouse lo tomaba como LCP a los 7 s).
import { STATIONS } from '@/world/stations';
import { useWorld } from '@/world/World';
import { useLang } from '@/i18n/LangContext';

export function Backdrop() {
  const { active, cuts } = useWorld();
  const { t } = useLang();
  const st = STATIONS[active];
  const key = `${active}:${cuts}`;
  return (
    <div className="tv-screen pointer-events-none z-40" aria-hidden>
      <div className="scanlines absolute inset-0 opacity-20" />
      <div className="crt-vignette absolute inset-0 opacity-70" />
      {/* key: se vuelve a montar (y a animar) en cada cambio de canal o corte; el encendido no destella */}
      {(active > 0 || cuts > 0) && (
        <div key={key} className="static-noise absolute inset-0 opacity-0"
          // ambas animaciones terminan: después no queda nada repintando
          style={{ animation: 'zap-flash 0.55s ease-out forwards, static-shift 0.3s steps(3) 2' }} />
      )}
      {/* OSD de la tele: canal actual, se va solo */}
      <p key={`osd-${key}`} className="glow-text osd absolute top-[4%] left-[3%] z-10 animate-[osd_2.4s_steps(1)_forwards] text-lg text-glow md:text-2xl">
        {t.nav.ch} {st.ch} · {t.nav.channels[st.id]}
      </p>
    </div>
  );
}
