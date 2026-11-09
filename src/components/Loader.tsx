// La tele se enciende (dentro del hueco del marco): la línea se abre en pantalla, estática y "sintonizando". Se salta con cualquier interacción.
import { useEffect, useLayoutEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLang } from '@/i18n/LangContext';
import { ART } from '@/content/profile';
import DecryptedText from './bits/DecryptedText';

const GLYPHS = '!<>-_\\/[]{}=+*^?#01';

export function Loader() {
  const { t } = useLang();
  const [show, setShow] = useState(true);
  // sin esperar las fuentes, el texto cambia de ancho al cargar y genera layout shift
  const [fonts, setFonts] = useState(false);
  // antes del primer paint: el hero espera (.enter) hasta que se apague el loader
  useLayoutEffect(() => {
    document.documentElement.dataset.loading = '';
    return () => { delete document.documentElement.dataset.loading; };
  }, []);

  useEffect(() => {
    document.fonts.ready.then(() => setFonts(true));
    let gone = false;
    const done = () => {
      if (gone) return;
      gone = true;
      setShow(false);
      delete document.documentElement.dataset.loading;
    };
    const timer = setTimeout(done, 2400);
    const evs = ['wheel', 'keydown', 'pointerdown', 'touchstart'] as const;
    evs.forEach((e) => window.addEventListener(e, done, { once: true, passive: true }));
    return () => {
      clearTimeout(timer);
      evs.forEach((e) => window.removeEventListener(e, done));
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div key="loader" role="status" aria-label={`ROMÁN · ${t.loader.tuning}`}
          className="tv-screen z-[80] flex items-center justify-center bg-line"
          exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: [0.87, 0, 0.13, 1] }}>
          {/* pantalla que se enciende: línea horizontal → cuadro completo */}
          <motion.div className="static-noise absolute inset-0 flex flex-col items-center justify-center gap-5"
            initial={{ scaleX: 0.002, scaleY: 0.004 }} animate={{ scaleX: [0.002, 1, 1], scaleY: [0.004, 0.004, 1] }}
            transition={{ duration: 0.75, times: [0, 0.45, 1], ease: 'easeOut' }}>
            <img src={ART.sticker} alt="" className="size-24 md:size-32" />
            {fonts && <DecryptedText
              text="ROMÁN" characters={GLYPHS} animateOn="view" sequential revealDirection="start" speed={70}
              className="glow-text font-display text-ink" encryptedClassName="font-pixel text-glow"
              parentClassName="text-[clamp(3rem,11vh,6.5rem)] -skew-x-6 bg-surface px-4 brutal-border"
            />}
            <p className="osd animate-[blink_1s_steps(1)_infinite] bg-surface px-2 py-1 text-glow">● {t.loader.tuning}…</p>
            <p className="label-px bg-surface px-2 py-1 text-ink-muted">{t.loader.hint}</p>
          </motion.div>
          <div aria-hidden className="scanlines pointer-events-none absolute inset-0" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
