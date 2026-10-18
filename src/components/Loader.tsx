// 序 JO: preludio. ロマン se descifra en ROMÁN mientras se traza el enso. Se salta con cualquier interacción.
import { useEffect, useState } from 'react';
import { animate, AnimatePresence, motion } from 'motion/react';
import { Enso } from '@/art';
import { useLang } from '@/i18n/LangContext';
import DecryptedText from './bits/DecryptedText';

const KATA = 'ロマンアイウエオカキクケコサシスセソタチツテトナニヌネノ';

export function Loader() {
  const { t } = useLang();
  const [show, setShow] = useState(true);
  const [draw, setDraw] = useState(0);
  // sin esperar las fuentes, el texto cambia de ancho al cargar y genera layout shift
  const [fonts, setFonts] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => setFonts(true));
    const ctrl = animate(0, 1, { duration: 1.6, ease: [0.65, 0, 0.35, 1], onUpdate: setDraw });
    const done = () => setShow(false);
    const timer = setTimeout(done, 2600);
    const evs = ['wheel', 'keydown', 'pointerdown', 'touchstart'] as const;
    evs.forEach((e) => window.addEventListener(e, done, { once: true, passive: true }));
    return () => {
      ctrl.stop();
      clearTimeout(timer);
      evs.forEach((e) => window.removeEventListener(e, done));
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader" role="status" aria-label="ROMÁN"
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-6 bg-surface"
          // opacidad/escala: corren en el compositor; un clip-path repintaba el enso (filtro SVG) en cada frame
          exit={{ opacity: 0, scale: 1.08 }} transition={{ duration: 0.7, ease: [0.87, 0, 0.13, 1] }}
        >
          <div className="relative size-[min(46vh,70vw)]">
            <Enso className="absolute inset-0" draw={draw} stroke="var(--color-line)" />
            <div className="absolute inset-0 flex items-center justify-center">
              {fonts && <DecryptedText
                text="ROMÁN" characters={KATA} animateOn="view" sequential revealDirection="start" speed={70}
                className="font-display text-ink" encryptedClassName="font-brush text-accent"
                parentClassName="text-[clamp(2.5rem,9vh,5.5rem)] tracking-tight"
              />}
            </div>
          </div>
          <p className="label-mono text-ink-muted">{t.loader.hint}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
