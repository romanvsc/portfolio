// Revelados atados al progreso de la estación (reemplazo de ScrollReveal para el mundo 3D).
import { motion, motionValue, useTransform, type MotionStyle, type MotionValue } from 'motion/react';
import type { ReactNode } from 'react';
import { useStationMaybe } from '@/world/World';

const FULL = motionValue(0.5);

/** Progreso de la estación, o 0.5 (centrado) fuera del mundo. */
export const useProgress = () => useStationMaybe()?.progress ?? FULL;

function Word({ p, from, to, children }: { p: MotionValue<number>; from: number; to: number; children: string }) {
  const opacity = useTransform(p, [from, to], [0.12, 1]);
  const filter = useTransform(p, [from, to], ['blur(6px)', 'blur(0px)']);
  const y = useTransform(p, [from, to], ['0.35em', '0em']);
  return <motion.span className="inline-block" style={{ opacity, filter, y }}>{children}&nbsp;</motion.span>;
}

/** Texto que se revela palabra por palabra mientras la cámara llega (progreso 0.1 → 0.48). */
export function RevealWords({ text, className = '', start = 0.1, end = 0.48 }: { text: string; className?: string; start?: number; end?: number }) {
  const p = useProgress();
  const words = text.split(' ');
  const span = (end - start) / words.length;
  return (
    <p className={className}>
      {words.map((w, i) => (
        <Word key={i} p={p} from={start + i * span * 0.6} to={start + (i + 1) * span * 0.6 + (end - start) * 0.4}>{w}</Word>
      ))}
    </p>
  );
}

/** Contenedor que sube y aparece con el progreso. */
export function Rise({ children, className = '', at = 0.3, style }: { children: ReactNode; className?: string; at?: number; style?: MotionStyle }) {
  const p = useProgress();
  const opacity = useTransform(p, [at - 0.15, at], [0, 1]);
  const y = useTransform(p, [at - 0.15, at], [40, 0]);
  return <motion.div className={className} style={{ ...style, opacity, y }}>{children}</motion.div>;
}
