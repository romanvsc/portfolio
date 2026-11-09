import {
  createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState,
  type CSSProperties, type ReactNode,
} from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { motionValue, type MotionValue } from 'motion/react';
import {
  STATIONS, PERSPECTIVE, scrollToU, uToScrollY, cameraZ, anchorZ, activeIndex, layerZ, layerOpacity, snapTarget,
  spacerHeight, stationScrollY, normP, weightOf, type LayerKind,
} from './stations';
import { MOODS } from './moods';

interface LayerReg { el: HTMLElement; station: number; offset: number; speed: number; kind: LayerKind }

interface WorldApi {
  register: (l: LayerReg) => () => void;
  progress: MotionValue<number>[];
  active: number;
  /** lleva la cámara a la estación i (parada `stop` en los grupos de proyectos) */
  goTo: (i: number, immediate?: boolean, stop?: number) => void;
  /** cambio de canal: salto instantáneo + estática (controles de la TV, CTAs, paginador) */
  cut: (i: number, stop?: number) => void;
  /** cuántos cortes hubo: Backdrop lo usa de key para el destello */
  cuts: number;
}

const WorldCtx = createContext<WorldApi | null>(null);
export const useWorld = () => {
  const w = useContext(WorldCtx);
  if (!w) throw new Error('useWorld fuera de <World>');
  return w;
};
/** null fuera del World (FlatStory). */
export const useWorldMaybe = () => useContext(WorldCtx);

const perStation = () => window.innerHeight * 1.15;
const MOUNT_RANGE = 2;

/**
 * Escenario 3D. Un espaciador da scroll nativo; cada frame se traduce el scroll a profundidad de cámara
 * y se posiciona cada Layer en Z. Ver CLAUDE.md "Cómo funciona la profundidad".
 */
export function World({ children, background, overlay }: { children: ReactNode; background?: ReactNode; overlay?: ReactNode }) {
  const layers = useRef(new Set<LayerReg>());
  const lenisRef = useRef<Lenis | null>(null);
  const progress = useMemo(() => STATIONS.map((_, i) => motionValue(0.5 - i)), []);
  const [active, setActive] = useState(0);
  const [spacer, setSpacer] = useState(() => spacerHeight(perStation(), window.innerHeight));

  const dirty = useRef(true);
  const register = useCallback((l: LayerReg) => {
    layers.current.add(l);
    dirty.current = true;
    return () => void layers.current.delete(l);
  }, []);

  const activeRef = useRef(0);
  const goTo = useCallback((i: number, immediate = false, stop = 0) => {
    const y = stationScrollY(i, perStation(), stop);
    if (!Number.isFinite(y)) return; // un NaN deja a Lenis trabado para siempre
    lenisRef.current?.scrollTo(y, {
      immediate, duration: Math.min(2.4, 0.9 + Math.abs(i - activeRef.current) * 0.18),
      easing: (t: number) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2), // expo-ish inOut
    });
  }, []);

  useLayoutEffect(() => {
    const lenis = new Lenis({ autoRaf: false, lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
    lenisRef.current = lenis;
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    let lastActive = -1;
    let lastU = NaN;
    let snapTimer = 0;

    const frame = () => {
      const per = perStation();
      const u = scrollToU(lenis.animatedScroll, per);
      if (!Number.isFinite(u)) return; // Lenis recién creado/destruido (HMR, resize)
      if (u === lastU && !dirty.current) return; // cámara quieta: nada que recalcular
      lastU = u;
      dirty.current = false;
      const cam = cameraZ(u);
      for (const l of layers.current) {
        const z = layerZ(cam, l.station, l.offset, l.speed);
        const o = layerOpacity(z, l.kind, anchorZ(l.station) - cam);
        const s = l.el.style;
        if (o <= 0.001) {
          if (s.visibility !== 'hidden') s.visibility = 'hidden';
          continue;
        }
        s.visibility = 'visible';
        s.opacity = o.toFixed(3);
        s.transform = `translate3d(0,0,${z.toFixed(1)}px)`;
        s.pointerEvents = l.kind === 'content' && Math.abs(z) < 260 ? 'auto' : 'none';
      }
      for (let i = 0; i < progress.length; i++) if (Math.abs(u - i) < MOUNT_RANGE + 1) progress[i].set(normP(u - i, weightOf(i)));

      const a = activeIndex(u);
      if (a !== lastActive) {
        lastActive = a;
        activeRef.current = a;
        setActive(a);
        const vars = Object.fromEntries(Object.entries(MOODS[STATIONS[a].mood]).map(([k, v]) => [`--${k}`, v]));
        gsap.to(document.documentElement, { ...vars, duration: 1.2, ease: 'power2.inOut', overwrite: true });
        document.documentElement.dataset.station = STATIONS[a].id;
      }
    };
    gsap.ticker.add(frame);

    lenis.on('scroll', () => {
      clearTimeout(snapTimer);
      snapTimer = window.setTimeout(() => {
        if (lenis.isScrolling) return;
        const t = snapTarget(scrollToU(lenis.targetScroll, perStation()));
        if (t !== null) lenis.scrollTo(uToScrollY(t, perStation()), { duration: 0.7 });
      }, 180);
    });

    // Foco por teclado en una estación lejana → llevar la cámara hasta ella
    const onFocus = (e: FocusEvent) => {
      const st = (e.target as HTMLElement).closest<HTMLElement>('#main [data-station]'); // el <html> también lleva data-station (id, no índice)
      if (!st) return;
      const i = Number(st.dataset.station);
      if (i !== activeRef.current) goTo(i);
    };
    document.addEventListener('focusin', onFocus);
    if (import.meta.env.DEV) Object.assign(window, { __goTo: goTo, __lenis: lenis });

    const onResize = () => {
      dirty.current = true;
      setSpacer(spacerHeight(perStation(), window.innerHeight));
    };
    window.addEventListener('resize', onResize);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.remove(frame);
      clearTimeout(snapTimer);
      document.removeEventListener('focusin', onFocus);
      window.removeEventListener('resize', onResize);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [goTo, progress]);

  const [cuts, setCuts] = useState(0);
  const cut = useCallback((i: number, stop = 0) => {
    setCuts((c) => c + 1);
    goTo(i, true, stop);
  }, [goTo]);

  const api = useMemo(() => ({ register, progress, active, goTo, cut, cuts }), [register, progress, active, goTo, cut, cuts]);

  return (
    <WorldCtx.Provider value={api}>
      <div style={{ height: spacer }} aria-hidden />
      {background}
      <div
        className="tv-screen"
        style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: '50% 50%' }}
      >
        {/* preserve-3d: el navegador ordena las capas por Z real. Las capas deben ser hijas DIRECTAS
            (un wrapper intermedio, incluso display:contents, aplana el contexto 3D).
            pointer-events-none: la caja del main vive en z=0 y taparía los clics a capas con z<0. */}
        <main id="main" tabIndex={-1} className="pointer-events-none absolute inset-0 outline-none" style={{ transformStyle: 'preserve-3d' }}>
          {children}
        </main>
      </div>
      {overlay}
    </WorldCtx.Provider>
  );
}

/* ---- Station: agrupa capas lógicamente (sin DOM, para no romper la perspectiva) ---- */

interface StationApi { index: number; progress: MotionValue<number>; active: boolean }
const StationCtx = createContext<StationApi | null>(null);

/** Progreso local normalizado (MotionValue: 0 llegando, [.35,.65] meseta, 0.5 centro, 1 saliendo) y si es la estación activa. */
export const useStation = () => {
  const s = useContext(StationCtx);
  if (!s) throw new Error('useStation fuera de <Station>');
  return s;
};

/** null fuera del World (FlatStory): los componentes se muestran completos. */
export const useStationMaybe = () => useContext(StationCtx);

export function Station({ index, children }: { index: number; children: ReactNode }) {
  const { progress, active } = useWorld();
  const api = useMemo(
    () => ({ index, progress: progress[index], active: active === index }),
    [index, progress, active],
  );
  // Se monta al acercarse la cámara (los portales se ven hasta ~3 GAP) y ya no se desmonta: volver atrás no reinicia nada.
  // shortcut: hasta acercarse no está en el DOM; lectores de pantalla tienen el skip link a ?motion=off con todo el contenido.
  const seen = useRef(false);
  if (Math.abs(index - active) <= MOUNT_RANGE) seen.current = true;
  if (!seen.current) return null;
  return <StationCtx.Provider value={api}>{children}</StationCtx.Provider>;
}

/**
 * Capa posicionada en Z por el motor.
 * depth > 0 la aleja del plano de lectura; speed < 1 = parallax lento (fondos).
 * El motor escribe transform/opacity: no usar transform propio en este elemento (sí en sus hijos).
 */
export function Layer({
  depth = 0, speed = 1, kind = 'content', className = '', style, children, label,
}: {
  depth?: number; speed?: number; kind?: LayerKind; className?: string; style?: CSSProperties;
  children: ReactNode; label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { register } = useWorld();
  const { index } = useStation();
  useLayoutEffect(() => {
    const el = ref.current!;
    return register({ el, station: index, offset: depth, speed, kind });
  }, [register, index, depth, speed, kind]);

  // Compensa la perspectiva: en reposo la capa se ve al tamaño en que se diseñó, esté a la Z que esté.
  const k = (PERSPECTIVE + depth) / PERSPECTIVE;
  return (
    <div
      ref={ref}
      data-station={index}
      aria-hidden={kind !== 'content' || undefined}
      aria-label={label}
      className="absolute inset-0"
      style={{ visibility: 'hidden', willChange: 'transform, opacity', pointerEvents: 'none' }}
    >
      <div className={`absolute inset-0 ${className}`} style={{ ...style, transform: k !== 1 ? `scale(${k})` : undefined }}>
        {children}
      </div>
    </div>
  );
}
