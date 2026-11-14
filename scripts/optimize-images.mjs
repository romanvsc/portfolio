// Optimiza capturas de proyectos y el arte de SEÑAL a public/img (webp). Uso: npm run images
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { P as C } from '../src/world/moods.ts';
import { bake, rgb } from './halftone.mjs';

const P = resolve(import.meta.dirname, '../..'); // carpeta Proyectos
const CAP = `${P}/portfolio/public/brand/capturas_apps`;
const GEN = resolve(import.meta.dirname, '../imagenes-generadas');
const OUT = resolve(import.meta.dirname, '../public/img');

const save = async (img, dest, opts = { quality: 78 }) => {
  const out = `${OUT}/${dest}`;
  await mkdir(dirname(out), { recursive: true });
  await (dest.endsWith('.png') ? img.png() : dest.endsWith('.jpg') ? img : img.webp(opts)).toFile(out);
  console.log('✓', dest);
};

// [destino, origen, crop opcional {left, top, width, height}]
const shots = [
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
// sin la carpeta de capturas (otra máquina): sólo se regenera el arte
if (!process.argv.includes('--art'))
  for (const [dest, src, crop] of shots) {
    let img = sharp(src);
    if (crop) img = img.extract(crop);
    await save(img.resize({ width: 1280, withoutEnlargement: true }), dest);
  }

// ---- Arte de SEÑAL (imagenes-generadas/, set animado) ----
const S = 'senal';

/** Halftone + duotono con una rampa de primitivos (oscuro → claro). */
async function halftone(src, dest, width, stops, cell = 7) {
  const base = sharp(`${GEN}/${src}`).resize({ width }).ensureAlpha();
  const { data, info } = await base.clone().raw().toBuffer({ resolveWithObject: true });
  const blur = await base.clone().blur(cell * 0.6).greyscale().extractChannel(0).raw().toBuffer();
  const out = bake(data, blur, info.width, info.height, stops.map((h) => rgb(h)), cell);
  await save(sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }), `${S}/${dest}`, { quality: 82 });
}

await halftone('avatar-peek-un-arito.png', 'peek.webp', 1400, [C.fosforo950, C.fosforo800, C.fosforo500, C.fosforo300, C.papel50]);
// mobile: el hero lo muestra a ~375 px (srcset en Senal.tsx)
await save(sharp(`${OUT}/${S}/peek.webp`).resize({ width: 700 }), `${S}/peek-700.webp`, { quality: 80 });
await halftone('avatar-falling-animado.png', 'falling.webp', 1000, [C.brasa950, C.brasa800, C.brasa500, C.brasa300, C.papel50]);
await halftone('avatar-eyes-animado.png', 'eyes.webp', 1600, [C.uva950, C.uva800, C.uva500, C.uva300, C.papel50], 6);

const sticker = `${GEN}/avatar-sticker-animado.png`;
await save(sharp(sticker).resize(200), `${S}/sticker.webp`, { quality: 85 });
await save(sharp(sticker).resize(64), '../favicon.png');
await save(sharp(sticker).resize(180), '../apple-touch-icon.png');

// Marco de la TV (TvFrame). El bisel se exporta a 1800×1200: los slices de index.css están en px de ese tamaño.
await save(sharp(`${GEN}/tv-bezel.png`).resize(1800, 1200), `${S}/bezel.webp`, { quality: 84 });
await save(sharp(`${GEN}/tv-panel.png`).extract({ left: 58, top: 70, width: 483, height: 1759 }).resize({ height: 1200 }), `${S}/panel.webp`, { quality: 82 });
await save(sharp(`${GEN}/tv-strip.png`).extract({ left: 0, top: 32, width: 1600, height: 195 }).resize({ width: 1200 }), `${S}/strip.webp`, { quality: 82 });
await save(sharp(`${GEN}/knob-dial.png`).resize(360), `${S}/dial.webp`, { quality: 85 });
await save(sharp(`${GEN}/knob-small.png`).resize(160), `${S}/knob.webp`, { quality: 85 });
await save(sharp(`${GEN}/button-up.png`).resize(180), `${S}/btn-up.webp`, { quality: 85 });
await save(sharp(`${GEN}/button-down.png`).resize(180), `${S}/btn-down.webp`, { quality: 85 });
await save(sharp(`${GEN}/brand-plate.png`).resize(360), `${S}/plate.webp`, { quality: 85 });
await save(sharp(`${GEN}/paper-crumpled.jpg`).resize(900).greyscale(), `${S}/paper.webp`, { quality: 70 });
// las tiras rasgadas se usan como máscara: sólo importa el alfa
await save(sharp(`${GEN}/paper-torn-top.png`).resize({ width: 1500 }), `${S}/torn-top.webp`, { quality: 80 });
await save(sharp(`${GEN}/paper-torn-bottom.png`).resize({ width: 1500 }), `${S}/torn-bottom.webp`, { quality: 80 });
await save(sharp(`${GEN}/tape.png`).extract({ left: 135, top: 627, width: 787, height: 247 }).resize({ width: 400 }), `${S}/tape.webp`, { quality: 80 });

// OG 1200×630: la TV con el avatar asomando en la pantalla
{
  const tvW = 945, tvH = 630, x0 = 127;
  const scr = { left: x0 + 65, top: 54, width: tvW - 130, height: tvH - 54 - 90 };
  const peek = await sharp(`${OUT}/${S}/peek.webp`).resize({ width: 420 }).toBuffer();
  const pm = await sharp(peek).metadata();
  const screen = await sharp({ create: { width: scr.width, height: scr.height, channels: 4, background: C.fosforo800 } })
    .composite([{ input: peek, left: scr.width - 420, top: scr.height - pm.height }]).png().toBuffer();
  const tv = await sharp(`${GEN}/tv-bezel.png`).resize(tvW, tvH).toBuffer();
  await save(sharp({ create: { width: 1200, height: 630, channels: 3, background: C.fosforo950 } })
    .composite([{ input: screen, left: scr.left, top: scr.top }, { input: tv, left: x0, top: 0 }]).jpeg({ quality: 82 }), '../og.jpg');
}
