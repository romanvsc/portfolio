import { describe, expect, it } from 'vitest';
import {
  STATIONS, GAP, dwell, normP, scrollToU, uToScrollY, cameraZ, anchorZ, activeIndex, layerZ, layerOpacity,
  snapTarget, spacerHeight, stationScrollY, stopP, stopsOf, weightOf, groupS, slash,
} from './stations';
import { MOODS } from './moods';

const N = STATIONS.length;
const GROUP = STATIONS.findIndex((s) => (s.stops ?? 1) > 1);

describe('stations', () => {
  it('dwell es monótona, continua y centra en 0.5', () => {
    let prev = 0;
    for (let p = 0.01; p <= 1.0001; p += 0.01) {
      const v = dwell(p);
      expect(v).toBeGreaterThanOrEqual(prev);
      expect(v - prev).toBeLessThan(0.03);
      prev = v;
    }
    expect(dwell(0)).toBe(0);
    expect(dwell(0.5)).toBeCloseTo(0.5, 5);
    expect(dwell(1)).toBeCloseTo(1, 5);
  });

  it('normP: identidad con peso 1; con peso >1 monótona, continua y centrada', () => {
    for (const p of [-0.2, 0, 0.3, 0.5, 0.9, 1.1]) expect(normP(p, 1)).toBeCloseTo(p, 9);
    const w = weightOf(GROUP);
    expect(w).toBeGreaterThan(1);
    let prev = normP(-0.1, w);
    for (let p = -0.09; p <= 1.1; p += 0.01) {
      const v = normP(p, w);
      expect(v).toBeGreaterThan(prev);
      expect(v - prev).toBeLessThan(0.05);
      prev = v;
    }
    expect(normP(0.5, w)).toBeCloseTo(0.5, 9);
    expect(normP(0, w)).toBeCloseTo(0, 9);
    expect(normP(1, w)).toBeCloseTo(1, 9);
  });

  it('en cada parada el plano de lectura queda casi en z=0', () => {
    for (let i = 0; i < N; i++)
      for (let k = 0; k < stopsOf(i); k++)
        expect(Math.abs(layerZ(cameraZ(i + stopP(i, k)), i))).toBeLessThan(GAP * 0.035);
    expect(cameraZ(0.5)).toBeCloseTo(anchorZ(0), 5);
  });

  it('cameraZ es continua entre estaciones (también con peso distinto)', () => {
    for (let i = 1; i < N; i++) expect(cameraZ(i - 1e-9)).toBeCloseTo(cameraZ(i), 3);
  });

  it('scroll ↔ u ida y vuelta, con pesos', () => {
    const per = 900;
    for (let i = 0; i < N; i++)
      for (let k = 0; k < stopsOf(i); k++) {
        const u = scrollToU(stationScrollY(i, per, k), per);
        expect(u).toBeCloseTo(i + stopP(i, k), 9);
        expect(activeIndex(u)).toBe(i);
      }
    for (const u of [0.5, 2.3, GROUP + 0.7, N - 0.5]) expect(scrollToU(uToScrollY(u, per), per)).toBeCloseTo(u, 9);
    // el final del documento cae en la última estación centrada
    expect(scrollToU(spacerHeight(per, 800) - 800, per)).toBeCloseTo(N - 0.5);
    expect(scrollToU(0, per)).toBeCloseTo(0.5);
  });

  it('opacidad: visible en el plano, invisible lejos y detrás', () => {
    expect(layerOpacity(0, 'content', 0)).toBe(1);
    expect(layerOpacity(-GAP, 'content', GAP)).toBe(0);
    // fondo propio lejano: visible en reposo aunque su z sea muy negativa
    expect(layerOpacity(-2400, 'scenery', 0)).toBe(1);
    // fondo de la estación siguiente: oculto
    expect(layerOpacity(-2400, 'scenery', GAP)).toBe(0);
    // portales: se ven de lejos (túnel) y se cruzan
    expect(layerOpacity(-GAP, 'gate', GAP)).toBe(1);
    expect(layerOpacity(900, 'gate', -GAP)).toBe(0);
    // contenido detrás de la cámara: apagado antes de agrandarse (retroceso sin paneles gigantes)
    expect(layerOpacity(250, 'content', -250)).toBe(0);
    // fondo lento de una estación ya pasada: se apaga aunque su z siga negativa
    expect(layerOpacity(-740, 'scenery', -GAP)).toBe(0);
  });

  it('activeIndex tolera NaN', () => {
    expect(activeIndex(NaN)).toBe(0);
  });

  it('snap cae en paradas, sólo cerca', () => {
    expect(snapTarget(1.7)).toBeCloseTo(1.5); // estación normal
    expect(snapTarget(1.5)).toBeNull();
    expect(snapTarget(1.95)).toBeNull();
    // grupo: cualquier punto de la meseta snapea a la parada más cercana
    const k1 = GROUP + stopP(GROUP, 1);
    expect(snapTarget(k1 + 0.05)).toBeCloseTo(k1);
    expect(snapTarget(k1)).toBeNull();
  });

  it('slash: cut 0 en las paradas, continuo en las fronteras y nunca en el último', () => {
    const n = 4;
    for (let k = 0; k < n; k++) expect(slash(k + 0.5, n)).toEqual({ index: k, cut: 0 });
    expect(slash(1 - 1e-6, n).cut).toBeCloseTo(1, 3);
    expect(slash(1, n)).toEqual({ index: 1, cut: 0 });
    expect(slash(n, n)).toEqual({ index: n - 1, cut: 0 });
    expect(slash(-1, n).index).toBe(0);
    // la parada k de un grupo cae en s = k + 0.5
    const w = weightOf(GROUP);
    for (let k = 0; k < n; k++) expect(groupS(normP(stopP(GROUP, k), w), n)).toBeCloseTo(k + 0.5, 9);
  });

  it('cada mood define los mismos tokens', () => {
    const keys = Object.keys(MOODS.dawn).sort();
    expect(Object.keys(MOODS.forest).sort()).toEqual(keys);
    expect(Object.keys(MOODS.night).sort()).toEqual(keys);
  });
});
