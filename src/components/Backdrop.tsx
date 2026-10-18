// Capa "híbrida": un único canvas WebGL de fondo (komorebi de día, luz de luna de noche) + grano + DOF + tinta.
import { lazy, Suspense, useEffect, useState } from 'react';
import { useWorld } from '@/world/World';
import { STATIONS } from '@/world/stations';
import { MOODS } from '@/world/moods';
import LightRays from './bits/LightRays';
import Noise from './bits/Noise';
import GradualBlur from './bits/GradualBlur';

const Ribbons = lazy(() => import('./bits/Ribbons'));

const MORI = STATIONS.findIndex((s) => s.id === 'mori');
const EN = STATIONS.findIndex((s) => s.id === 'en');

/** Intensidad del komorebi por estación: crece a medida que te adentrás, pico en 森, luna tenue en 縁. */
const rays = (i: number) => (i >= EN ? 0.45 : i === MORI ? 1.7 : 0.55 + Math.min(i, 11) * 0.05);

const finePointer = () => matchMedia('(pointer: fine)').matches;

export function Backdrop() {
  const { active } = useWorld();
  const mood = STATIONS[active].mood;
  const night = active >= EN;
  const [ink, setInk] = useState(false);
  useEffect(() => setInk(finePointer()), []);
  // el WebGL se crea después del primer render (el loader lo tapa igual)
  const [webgl, setWebgl] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setWebgl(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        {webgl && <LightRays
          raysOrigin={night ? 'top-right' : 'top-center'} raysColor={mood === 'dawn' ? MOODS.dawn.accent : MOODS.forest['accent-bright']}
          lightMode={mood === 'dawn'} intensity={rays(active)} raysSpeed={0.6} lightSpread={0.9} rayLength={1.6}
          haze={0.35} noiseAmount={0.08} followMouse mouseInfluence={0.12} maxDevicePixelRatio={1.25}
        />}
      </div>
      <Noise fixed opacity={0.07} blendMode="overlay" fps={12} zIndex={45} />
      <GradualBlur position="top" target="page" height="5rem" strength={1.6} zIndex={35} />
      <GradualBlur position="bottom" target="page" height="5rem" strength={1.6} zIndex={35} />
      {ink && (
        <Suspense fallback={null}>
          <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden>
            <Ribbons colors={[MOODS[mood].ink]} thickness={7} length={26} opacity={0.8} shape="comet" />
          </div>
        </Suspense>
      )}
    </>
  );
}
