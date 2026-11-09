import { describe, expect, it } from 'vitest';
import { bake, inDot, ramp, rgb } from './halftone.mjs';

describe('halftone', () => {
  it('celda clara: sin punto; oscura: punto que llena la celda', () => {
    expect(inDot(0, 0, 1, 8)).toBe(false);
    expect(inDot(0, 0, 0, 8)).toBe(true);
    expect(inDot(3.9, 0, 0, 8)).toBe(true);
    // el radio crece con la oscuridad
    expect(inDot(2.5, 0, 0.8, 8)).toBe(false);
    expect(inDot(2.5, 0, 0.3, 8)).toBe(true);
  });

  it('ramp interpola entre paradas', () => {
    const stops = [rgb('#000000'), rgb('#ffffff')];
    expect(ramp(stops, 0)).toEqual([0, 0, 0]);
    expect(ramp(stops, 1)).toEqual([255, 255, 255]);
    expect(ramp(stops, 0.5)).toEqual([127.5, 127.5, 127.5]);
  });

  it('bake conserva el alfa y usa sólo la rampa', () => {
    const w = 4, h = 1;
    const rgba = Buffer.from([255, 255, 255, 0, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 128]);
    const out = bake(rgba, Buffer.from([255, 255, 0, 0]), w, h, [rgb('#102030'), rgb('#f0e0d0')], 2);
    expect([out[3], out[7], out[11], out[15]]).toEqual([0, 255, 255, 128]);
    expect([out[4], out[5], out[6]]).toEqual([0xf0, 0xe0, 0xd0]); // blanco, celda clara → color claro
    expect([out[8], out[9], out[10]]).toEqual([0x10, 0x20, 0x30]); // negro → color oscuro
  });
});
