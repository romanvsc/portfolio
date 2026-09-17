import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { optimize } from 'svgo';

const root = new URL('../', import.meta.url);
const at = (path) => fileURLToPath(new URL(path, root));
await mkdir(at('public/brand/dorito'), { recursive: true });
await mkdir(at('.asset-cache'), { recursive: true });
const sheet = at('ChatGPT Image 16 sept 2026, 23_23_03.png');
const metadata = await sharp(sheet).metadata();
// Normalized bounds exclude the labels. Original composition and background retained.
const poses = [
  { id: 'comentando', x: 15, y: 12, w: 603, h: 497 },
  { id: 'trabajando', x: 637, y: 12, w: 602, h: 497 },
  { id: 'feliz', x: 15, y: 619, w: 603, h: 521 },
  { id: 'saludando', x: 637, y: 619, w: 602, h: 521 },
];
const manifest = [];
for (const pose of poses) {
  const scale = metadata.width / 1254;
  const rect = { left: Math.round(pose.x * scale), top: Math.round(pose.y * scale), width: Math.round(pose.w * scale), height: Math.round(pose.h * scale) };
  const buffer = await sharp(sheet).extract(rect).resize({ width: 440 }).png().toBuffer();
  const input = at(`.asset-cache/${pose.id}.png`);
  const output = at(`public/brand/dorito/${pose.id}.svg`);
  await writeFile(input, buffer);
  await sharp(buffer).webp({ quality: 86 }).toFile(at(`public/brand/dorito/${pose.id}.webp`));
  const python = at('.venv-assets/Scripts/python.exe');
  const result = spawnSync(python, [at('scripts/vectorize.py'), input, output], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || 'Vector conversion failed');
  let svg = optimize(await readFile(output, 'utf8'), { multipass: true, plugins: [{ name: 'preset-default', params: { overrides: { convertColors: false } } }] }).data;
  const colors = [...new Set([...svg.matchAll(/fill="(#[0-9a-fA-F]+)"/g)].map((match) => match[1]))];
  // Image palette lives in one place per standalone asset, never scattered on paths.
  for (const [index, color] of colors.entries()) svg = svg.replaceAll(`fill="${color}"`, `fill="var(--dorito-${index})"`);
  const palette = colors.map((color, index) => `--dorito-${index}:${color}`).join(';');
  const dimensions = /width="([\d.]+)" height="([\d.]+)"/.exec(svg);
  if (!svg.includes('viewBox=') && dimensions) svg = svg.replace('<svg ', `<svg viewBox="0 0 ${dimensions[1]} ${dimensions[2]}" `);
  svg = svg.replace('<svg ', `<svg role="img" aria-label="Dorito ${pose.id}" style="${palette}" `);
  await writeFile(output, svg);
  manifest.push({ pose: pose.id, path: `/brand/dorito/${pose.id}.svg`, type: 'vector-paths', bytes: Buffer.byteLength(svg), colors: colors.length });
}
const photo = await sharp(at('ChatGPT Image 16 sept 2026, 23_27_44.png')).resize(720, 720).webp({ quality: 88 }).toBuffer();
await writeFile(at('public/brand/roman.webp'), photo);
await writeFile(at('public/brand/roman.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 720" role="img" aria-labelledby="title"><title id="title">Retrato de Román — fotografía raster embebida, no trazados vectoriales</title><image width="720" height="720" href="data:image/webp;base64,${photo.toString('base64')}"/></svg>`);
await writeFile(at('public/brand/assets.json'), JSON.stringify({ poses: manifest, portrait: { webp: '/brand/roman.webp', svg: '/brand/roman.svg', type: 'embedded-raster' } }, null, 2));
console.log(JSON.stringify(manifest, null, 2));
