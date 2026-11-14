// CH 404 · SEÑAL PERDIDA (ref2): contacto. También recibe los #/p/<id> que no existen.
import { useEffect, useState } from 'react';
import { Layer, useStationMaybe, useWorldMaybe } from '@/world/World';
import { Sparkle } from '@/art';
import { BrutalLink, ChannelLabel } from '@/components/ui';
import { Rise } from '@/components/Reveal';
import { useLang } from '@/i18n/LangContext';
import { ART, PROFILE } from '@/content/profile';
import { PROJECTS } from '@/content/projects';
import FuzzyText from '@/components/bits/FuzzyText';
import Magnet from '@/components/bits/Magnet';

/** #/p/<id> de un caso que no existe (Chrome lleva la cámara hasta acá). */
export const missingCase = () => {
  const id = /^#\/p\/([\w-]+)$/.exec(location.hash)?.[1];
  return !!id && !PROJECTS.some((p) => p.id === id);
};

export function ContactoContent() {
  const { t, lang } = useLang();
  const world = useWorldMaybe();
  // el canvas animado sólo corre con el canal en pantalla (montado, el canal no se desmonta)
  const live = useStationMaybe()?.active ?? true;
  const [copied, setCopied] = useState(false);
  const [missing, setMissing] = useState(missingCase);

  useEffect(() => {
    const check = () => {
      const m = missingCase();
      setMissing(m);
      if (m && !world) document.getElementById('contacto')?.scrollIntoView();
    };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, [world]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <div className="relative mx-auto grid h-full w-full max-w-325 content-start gap-4 px-4 pt-20 pb-6 md:content-center md:gap-6 md:pt-16 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-10 md:px-10">
      <p aria-hidden className="label-px absolute top-20 left-1/2 hidden -translate-x-1/2 tracking-[0.9em] whitespace-nowrap text-ink-muted md:block">
        {t.contacto.lost}
      </p>
      <img src={ART.falling} alt={t.contacto.fallingAlt} loading="lazy" decoding="async"
        className="-rotate-6 animate-[float_6s_ease-in-out_infinite] drop-shadow-[0_0_40px_var(--color-accent)] w-20 max-md:justify-self-center md:mx-auto md:w-full md:max-w-lg" />

      <div className="flex min-w-0 flex-col gap-4 md:gap-6">
        <ChannelLabel ch="404" name={t.contacto.lost} />
        <h2 className="glow-text font-pixel text-[clamp(2.4rem,5.5vw,6rem)] leading-none text-paper uppercase">
          {live ? (
            <>
              <span className="sr-only">{t.contacto.big}</span>
              {/* el canvas deja ~48px de margen a cada lado para el temblor: se compensa a la izquierda; la pantalla de la TV recorta lo que sobre */}
              <span aria-hidden className="-ml-12 block">
                <FuzzyText fontFamily="'Pixelify Sans', monospace" fontSize="clamp(2.4rem, 5.5vw, 6rem)" fontWeight={500}
                  baseIntensity={0.08} hoverIntensity={0.35} fuzzRange={16} fps={30} colorSplit={2}>
                  {t.contacto.big.toUpperCase()}
                </FuzzyText>
              </span>
            </>
          ) : t.contacto.big}
        </h2>
        <p className="label-px text-glow">{missing ? t.contacto.missing : t.contacto.found}</p>
        <p className="brutal-panel max-w-xl text-base leading-relaxed text-ink max-md:hidden md:text-lg">{t.contacto.body}</p>

        <Rise at={0.32} className="flex flex-wrap items-center gap-3">
          <Magnet padding={60} magnetStrength={4}>
            <a href={`mailto:${PROFILE.email}`}
              className="brutal-border brutal-shadow brutal-press font-display block bg-accent px-5 py-3 text-[clamp(1.05rem,2.6vw,2rem)] text-on-accent">
              {PROFILE.email}
            </a>
          </Magnet>
          <button type="button" onClick={copy} aria-live="polite"
            className="brutal-border brutal-shadow brutal-press label-px cursor-pointer bg-paper px-4 py-3 text-on-paper">
            {copied ? t.contacto.copied : t.contacto.copy}
          </button>
        </Rise>

        <Rise at={0.38} className="flex flex-wrap gap-3">
          <BrutalLink href={PROFILE.github}>GitHub</BrutalLink>
          <BrutalLink href={PROFILE.linkedin}>LinkedIn</BrutalLink>
          <BrutalLink href={PROFILE.whatsapp}>WhatsApp</BrutalLink>
          {/* npm run cv genera los dos PDF */}
          <BrutalLink tone="paper" href={`/cv/roman-vogel-corach-cv-${lang}.pdf`} target="_blank" rel="noopener">{t.contacto.cv}</BrutalLink>
        </Rise>

        <footer className="flex flex-wrap items-center gap-3 border-t-[3px] border-line pt-4">
          <img src={ART.sticker} alt="" className="size-10" />
          <p className="label-px text-ink-muted">© 2026 · {t.contacto.footer}</p>
          <a href="?motion=off" className="label-px ml-auto text-ink-muted underline underline-offset-4 hover:text-glow">
            {t.contacto.flat}
          </a>
        </footer>
      </div>
    </div>
  );
}

export function ContactoScene() {
  return (
    <>
      {/* resplandor naranja de ref2 */}
      <Layer kind="scenery" depth={1200} speed={0.4}>
        <div className="absolute -inset-[20%]" style={{ background: 'radial-gradient(ellipse at 40% 45%, color-mix(in oklab, var(--color-accent) 55%, transparent), transparent 60%)' }} />
      </Layer>
      <Layer label="Contacto"><ContactoContent /></Layer>
      <Layer kind="scenery" depth={-120}>
        <Sparkle className="absolute top-[22vh] left-[8vw] w-6 text-accent-alt" />
        {/* en un hueco libre: antes pisaba el botón del CV */}
        <Sparkle className="absolute top-[38vh] right-[4vw] w-9 text-pop md:top-auto md:bottom-[10vh]" />
      </Layer>
    </>
  );
}
