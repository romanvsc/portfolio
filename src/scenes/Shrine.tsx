// 縁 EN: contacto. Santuario de noche.
import { useState } from 'react';
import { Layer } from '@/world/World';
import { Contours, Enso, Hanko, Torii } from '@/art';
import { BrutalLink, ChapterLabel, DisplayTitle } from '@/components/ui';
import { Rise } from '@/components/Reveal';
import { useLang } from '@/i18n/LangContext';
import { PROFILE } from '@/content/profile';
import Magnet from '@/components/bits/Magnet';

export function ShrineContent() {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
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
    <div className="relative mx-auto flex h-full max-w-300 flex-col justify-center gap-5 px-4 pb-16 md:gap-6 md:px-10">
      <ChapterLabel kanji="縁" n={6} name={t.en.label} />
      <DisplayTitle text={t.en.title} className="text-[clamp(2rem,7.5vw,7.5rem)]!" />
      <p className="brutal-panel max-w-xl text-lg leading-relaxed text-ink">{t.en.body}</p>

      <Rise at={0.32} className="flex flex-wrap items-center gap-4">
        <Magnet padding={60} magnetStrength={4}>
          <a href={`mailto:${PROFILE.email}`}
            className="brutal-border brutal-shadow brutal-press font-display block bg-accent px-6 py-4 text-[clamp(1.1rem,3vw,2.2rem)] text-on-accent">
            {PROFILE.email}
          </a>
        </Magnet>
        <button type="button" onClick={copy} aria-live="polite"
          className="brutal-border brutal-shadow brutal-press label-mono cursor-pointer bg-surface-raised px-4 py-3 text-ink">
          {copied ? t.en.copied : t.en.copy}
        </button>
      </Rise>

      <Rise at={0.38} className="flex flex-wrap gap-3">
        <BrutalLink href={PROFILE.github}>GitHub</BrutalLink>
        <BrutalLink href={PROFILE.linkedin}>LinkedIn</BrutalLink>
        <BrutalLink href={PROFILE.whatsapp}>WhatsApp</BrutalLink>
      </Rise>

      <footer className="mt-2 flex flex-wrap items-center gap-4 border-t-[3px] border-line pt-4">
        <Hanko size={44} />
        <p className="label-mono text-ink-muted">© 2026 · {t.en.footer}</p>
        <a href="?motion=off" className="label-mono ml-auto text-ink-muted underline underline-offset-4 hover:text-accent">
          {t.en.flat}
        </a>
      </footer>
    </div>
  );
}

export function ShrineScene() {
  return (
    <>
      <Layer kind="scenery" depth={2600} speed={0.15} className="flex items-center justify-center">
        <Contours className="h-[140vh] w-[140vw] max-w-none" />
      </Layer>
      <Layer kind="scenery" depth={1600} speed={0.3} className="flex items-center justify-end pr-[6vw]">
        <Enso className="size-[40vh] opacity-60 md:size-[70vh] md:opacity-90" stroke="var(--color-accent)" />
      </Layer>
      <Layer kind="scenery" depth={700} speed={0.6}>
        <Torii className="absolute right-[4vw] bottom-0 aspect-10/9 h-[34vh] opacity-60 md:h-[70vh] md:opacity-100" />
      </Layer>
      <Layer label="Contacto"><ShrineContent /></Layer>
    </>
  );
}
