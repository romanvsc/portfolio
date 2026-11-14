// Halftone + duotono horneados (lógica pura, testeada en halftone.test.mjs).
// Un filtro en vivo se recalcula en cada repintado; acá se hace una sola vez en npm run images.

/** '#rrggbb' → [r, g, b] */
export const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** Rampa de colores: t 0 (oscuro) → 1 (claro). */
export function ramp(stops, t) {
  const s = Math.min(1, Math.max(0, t)) * (stops.length - 1);
  const k = Math.min(stops.length - 2, Math.floor(s));
  const f = s - k;
  return [0, 1, 2].map((c) => stops[k][c] + (stops[k + 1][c] - stops[k][c]) * f);
}

/** ¿El punto (dx, dy), relativo al centro de su celda, cae dentro del punto de trama? Más oscuro = punto más grande. */
export const inDot = (dx, dy, cellLum, cell) => Math.hypot(dx, dy) < cell * 0.62 * Math.sqrt(Math.max(0, 1 - cellLum));

/**
 * rgba: Uint8 RGBA (w×h). blur: luminancia suavizada (1 canal) para medir cada celda.
 * Trama girada 45°. Dentro del punto se oscurece hacia stops[0] (strength); el resto queda en duotono.
 */
export function bake(rgba, blur, w, h, stops, cell = 7, strength = 0.45) {
  const out = Buffer.alloc(w * h * 4);
  const S = Math.SQRT1_2;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const p = (y * w + x) * 4;
      const lum = (0.299 * rgba[p] + 0.587 * rgba[p + 1] + 0.114 * rgba[p + 2]) / 255;
      // coordenadas en la grilla girada y centro de la celda, vuelto a xy
      const u = (x + y) * S, v = (x - y) * S;
      const cu = (Math.floor(u / cell) + 0.5) * cell, cv = (Math.floor(v / cell) + 0.5) * cell;
      const cx = Math.min(w - 1, Math.max(0, Math.round((cu + cv) * S)));
      const cy = Math.min(h - 1, Math.max(0, Math.round((cu - cv) * S)));
      const cellLum = blur[cy * w + cx] / 255;
      let c = ramp(stops, lum);
      if (inDot(u - cu, v - cv, cellLum, cell)) c = c.map((ch, i) => ch + (stops[0][i] - ch) * strength);
      out[p] = c[0]; out[p + 1] = c[1]; out[p + 2] = c[2]; out[p + 3] = rgba[p + 3];
    }
  return out;
}
