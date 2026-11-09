import { describe, expect, it } from 'vitest';
import { bitmap, pixelPath } from './pixel-path.mjs';

describe('pixelPath', () => {
  it('un tramo por fila, juntando píxeles contiguos', () => {
    const a = bitmap(['.##.', '#..#', '....', '####']);
    expect(pixelPath(a, 4)).toBe('M1 0h2v1h-2zM0 1h1v1h-1zM3 1h1v1h-1zM0 3h4v1h-4z');
  });

  it('vacío → path vacío; respeta el umbral', () => {
    expect(pixelPath(new Uint8Array(4), 2)).toBe('');
    expect(pixelPath(Uint8Array.from([100, 200, 0, 0]), 2, 150)).toBe('M1 0h1v1h-1z');
  });
});
