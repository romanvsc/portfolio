// Lógica pura de los íconos pixel (testeada en pixel-path.test.mjs).

/** Alfa (size×size, 1 canal) → path SVG con un rectángulo por tramo horizontal de píxeles encendidos. */
export function pixelPath(alpha, size, threshold = 110) {
  let d = '';
  for (let y = 0; y < size; y++) {
    let x = 0;
    while (x < size) {
      if (alpha[y * size + x] < threshold) { x++; continue; }
      const x0 = x;
      while (x < size && alpha[y * size + x] >= threshold) x++;
      d += `M${x0} ${y}h${x - x0}v1h${x0 - x}z`;
    }
  }
  return d;
}

/** Bitmap a mano ('#' encendido) → alfa para pixelPath. */
export const bitmap = (rows) => Uint8Array.from(rows.join('').split(''), (c) => (c === '#' ? 255 : 0));
