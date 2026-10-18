// Copia y optimiza retrato + capturas de proyectos a public/img (webp). Uso: npm run images
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const P = resolve(import.meta.dirname, '../..'); // carpeta Proyectos
const CAP = `${P}/portfolio/public/brand/capturas_apps`;
const OUT = resolve(import.meta.dirname, '../public/img');

// [destino, origen, crop opcional {left, top, width, height}]
const jobs = [
  ['roman.webp', resolve(import.meta.dirname, '../ChatGPT Image 16 sept 2026, 23_27_44.png'), null, 900],
  ['projects/ipac/1.webp', `${CAP}/IPAC/portfolio/01-dashboard-desktop.png`],
  ['projects/ipac/2.webp', `${CAP}/IPAC/portfolio/03-alumno-cuenta-desktop.png`],
  ['projects/ipac/3.webp', `${CAP}/IPAC/portfolio/05-caja-diaria-desktop.png`],
  ['projects/produccion/1.webp', `${CAP}/produccion/capturas/desktop/admin/16-admin-dashboard.png`],
  ['projects/produccion/2.webp', `${CAP}/produccion/capturas/desktop/admin/10-produccion.png`],
  ['projects/produccion/3.webp', `${CAP}/produccion/capturas/desktop/admin/14-pendientes.png`],
  ['projects/mantenimiento/1.webp', `${CAP}/mantenimiento/ui/dashboard-desktop.png`],
  ['projects/mantenimiento/2.webp', `${CAP}/mantenimiento/ui/ficha-equipo-desktop.png`],
  ['projects/mantenimiento/3.webp', `${CAP}/mantenimiento/ui/servicios-desktop.png`],
  ['projects/gimnasio/1.webp', `${CAP}/gimnasio/portfolio/dashboard-desktop.png`],
  ['projects/gimnasio/2.webp', `${CAP}/gimnasio/portfolio/control-acceso-desktop.png`],
  ['projects/gimnasio/3.webp', `${CAP}/gimnasio/portfolio/caja-desktop.png`],
  ['projects/forestal/1.webp', `${P}/web_forestal/docs/evidencia/tercera-modernizacion-2026-10-06/home-1440.png`, { left: 0, top: 0, width: 1425, height: 900 }],
  ['projects/fgpy/1.webp', `${P}/web_forestal_py/fgpy-site/public/img/og.jpg`],
  ['projects/anasociados/1.webp', `${P}/web_ana_asociados/web_anasociados/public/assets/images/og-compartir.jpg`],
  ['projects/vogel/1.webp', `${P}/web_vogel_consultoria/docs/capturas/release-2026-10-07/home-1440x900.png`],
];

for (const [dest, src, crop, width = 1280] of jobs) {
  const out = `${OUT}/${dest}`;
  await mkdir(dirname(out), { recursive: true });
  let img = sharp(src);
  if (crop) img = img.extract(crop);
  await img.resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
  console.log('✓', dest);
}

// Retrato en duotono verde suave, horneado (un filtro SVG en vivo se recalcula en cada repintado).
// Paradas = tokens de world/moods.ts: night.surface-raised, forest.mist, night.ink-muted, dawn.surface
const STOPS = ['#16201a', '#2b5240', '#a9b5ac', '#f4f2ea'].map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));
const portrait = resolve(import.meta.dirname, '../ChatGPT Image 16 sept 2026, 23_27_44.png');
const { data, info } = await sharp(portrait).resize({ width: 900 }).greyscale().raw().toBuffer({ resolveWithObject: true });
const out = Buffer.alloc(info.width * info.height * 3);
for (let p = 0; p < info.width * info.height; p++) {
  const t = (data[p * info.channels] / 255) * (STOPS.length - 1);
  const k = Math.min(STOPS.length - 2, Math.floor(t));
  const f = t - k;
  for (let c = 0; c < 3; c++) out[p * 3 + c] = Math.round(STOPS[k][c] + (STOPS[k + 1][c] - STOPS[k][c]) * f);
}
await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } }).webp({ quality: 80 }).toFile(`${OUT}/roman-duo.webp`);
console.log('✓ roman-duo.webp');
