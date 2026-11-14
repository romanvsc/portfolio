// Matemática pura del viaje en Z. Sin DOM: testeada en stations.test.ts.
import type { Mood } from './moods';

export type StationId = 'senal' | 'quien' | 'guia' | 'sistemas' | 'webs' | 'ajuste' | 'contacto';

export interface StationDef {
  id: StationId;
  /** número de canal en el OSD */
  ch: string;
  mood: Mood;
  /** paradas dentro de la estación (grupos de proyectos: 4). Default 1. */
  stops?: number;
}

export const STATIONS: StationDef[] = [
  { id: 'senal', ch: '01', mood: 'fosforo' },
  { id: 'quien', ch: '02', mood: 'uva' },
  { id: 'guia', ch: '03', mood: 'fosforo' },
  { id: 'sistemas', ch: '04', mood: 'fosforo', stops: 4 },
  { id: 'webs', ch: '05', mood: 'brasa', stops: 4 },
  { id: 'ajuste', ch: '06', mood: 'uva' },
  { id: 'contacto', ch: '404', mood: 'brasa' },
];

/** unidades Z entre estaciones */
export const GAP = 1600;
/** perspectiva CSS del Stage, en px */
export const PERSPECTIVE = 1000;
/** scroll extra (en estaciones) por cada parada adicional */
const STOP_WEIGHT = 0.6;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export const stopsOf = (i: number) => STATIONS[i]?.stops ?? 1;
/** Peso de scroll de la estación i (1 = una pantalla y pico). */
export const weightOf = (i: number) => 1 + (stopsOf(i) - 1) * STOP_WEIGHT;
const STARTS = STATIONS.map((_, i) => STATIONS.slice(0, i).reduce((a, __, j) => a + weightOf(j), 0));
const TOTAL = STARTS[STATIONS.length - 1] + weightOf(STATIONS.length - 1);

/**
 * Normaliza el progreso local crudo p de una estación de peso w: la llegada y la salida ocupan
 * siempre el mismo scroll que en una estación normal ([0,.35] y [.65,1]); el resto es meseta [.35,.65].
 * Lineal fuera de [0,1]. Con w = 1 es la identidad.
 */
export function normP(p: number, w: number): number {
  const e = 0.35 / w;
  if (p < e) return (p / e) * 0.35;
  if (p <= 1 - e) return 0.35 + ((p - e) / (1 - 2 * e)) * 0.3;
  return 0.65 + ((p - (1 - e)) / e) * 0.35;
}

/**
 * Curva de permanencia dentro de una estación (sobre progreso normalizado): la cámara frena cerca del contenido.
 * Tramo [0.35, 0.65] casi quieto alrededor de 0.5.
 */
export function dwell(p: number): number {
  p = clamp(p);
  if (p < 0.35) return (p / 0.35) * 0.47;
  if (p < 0.65) return 0.47 + ((p - 0.35) / 0.3) * 0.06;
  return 0.53 + ((p - 0.65) / 0.35) * 0.47;
}

/** Progreso crudo del centro de la parada k de la estación i (con 1 parada: 0.5). */
export function stopP(i: number, k = 0): number {
  const e = 0.35 / weightOf(i);
  return e + (1 - 2 * e) * ((k + 0.5) / stopsOf(i));
}

/**
 * scroll → u (índice de estación + progreso local crudo). El scroll arranca con la cámara frente a la
 * estación 0 y termina frente a la última.
 */
export function scrollToU(scrollY: number, perStation: number): number {
  const s = clamp(0.5 + scrollY / perStation, 0.5, TOTAL - 0.5);
  let i = 0;
  while (i < STATIONS.length - 1 && s >= STARTS[i + 1]) i++;
  return i + (s - STARTS[i]) / weightOf(i);
}

/** u → scroll (inversa de scrollToU). */
export function uToScrollY(u: number, perStation: number): number {
  const i = Math.min(STATIONS.length - 1, Math.max(0, Math.floor(u)));
  return (STARTS[i] + (u - i) * weightOf(i) - 0.5) * perStation;
}

/** Scroll que deja la cámara en la parada k de la estación i. */
export const stationScrollY = (i: number, perStation: number, k = 0) => uToScrollY(i + stopP(i, k), perStation);

/** Altura total del documento para recorrer todas las estaciones. */
export const spacerHeight = (perStation: number, viewport: number) => (TOTAL - 1) * perStation + viewport;

/** u → profundidad de cámara, con permanencia por estación. */
export function cameraZ(u: number): number {
  const i = Math.min(STATIONS.length - 1, Math.max(0, Math.floor(u)));
  return (i + dwell(normP(u - i, weightOf(i)))) * GAP;
}

/** Profundidad donde vive el plano de lectura de la estación i. */
export const anchorZ = (i: number) => (i + 0.5) * GAP;

/** Estación activa (la más cercana a la cámara). */
export const activeIndex = (u: number) =>
  Number.isFinite(u) ? Math.min(STATIONS.length - 1, Math.max(0, Math.floor(u))) : 0;

/** Posición dentro de un grupo de n proyectos (0→n) a partir del progreso normalizado. */
export const groupS = (pNorm: number, n: number) => clamp((pNorm - 0.35) / 0.3) * n;

/**
 * Zapping entre proyectos: index = proyecto que se muestra, cut 0→1 = cuánto avanzó el cambio de canal
 * hacia el siguiente. cut = 0 en cada parada (centro de segmento) y en el último proyecto.
 */
export function zap(s: number, n: number): { index: number; cut: number } {
  const index = Math.min(n - 1, Math.max(0, Math.floor(s)));
  const cut = index < n - 1 ? smoothstep(0.62, 0.98, s - index) : 0;
  return { index, cut };
}

export type LayerKind = 'content' | 'scenery' | 'gate';

/**
 * z efectiva de una capa (0 = plano de pantalla, negativo = lejos, positivo = pasando la cámara)
 * speed < 1 hace parallax lento (fondos), offset aleja la capa del plano de lectura.
 */
export const layerZ = (cam: number, station: number, offset = 0, speed = 1) =>
  (cam - anchorZ(station)) * speed - offset;

/**
 * Opacidad de una capa.
 * z: su Z efectiva (para saber si está pasando la cámara).
 * rel: distancia de su estación a la cámara (anchorZ - cam); positiva = estación por delante.
 * Contenido y fondos aparecen sólo cuando su estación se acerca; los portales se ven de lejos (túnel).
 * El contenido se apaga apenas pasa la cámara: al retroceder reaparece casi en su lugar, no gigante.
 */
export function layerOpacity(z: number, kind: LayerKind, rel: number): number {
  const passing = z > 0
    ? kind === 'gate' ? 1 - smoothstep(350, 880, z)
      : kind === 'content' ? 1 - smoothstep(40, 240, z)
      : 1 - smoothstep(80, 520, z)
    : 1;
  // estación ya atrás: los fondos lentos (speed < 1) nunca "pasan" la cámara, se desvanecen por distancia
  if (rel <= 0) return kind === 'gate' ? passing : Math.min(passing, 1 - smoothstep(GAP * 0.4, GAP * 0.75, -rel));
  const far =
    kind === 'gate' ? 1 - smoothstep(GAP * 1.6, GAP * 3, rel)
    : kind === 'scenery' ? 1 - smoothstep(GAP * 0.5, GAP * 0.95, rel)
    : 1 - smoothstep(GAP * 0.25, GAP * 0.75, rel);
  return Math.min(passing, far);
}

/**
 * Snap: si la cámara quedó cerca de una parada, devolver la u de esa parada.
 * La distancia se mide en unidades de scroll (pantallas), así funciona igual en estaciones con peso.
 */
export function snapTarget(u: number, threshold = 0.32): number | null {
  const i = activeIndex(u);
  const p = u - i;
  let best = stopP(i, 0);
  for (let k = 1; k < stopsOf(i); k++) if (Math.abs(stopP(i, k) - p) < Math.abs(best - p)) best = stopP(i, k);
  const delta = Math.abs(p - best) * weightOf(i);
  return delta > 0.02 && delta < threshold ? i + best : null;
}
