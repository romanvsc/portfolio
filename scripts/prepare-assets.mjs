import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { optimize } from 'svgo';
import { generateTechnologyIcons } from './prepare-technology-icons.mjs';

const root = new URL('../', import.meta.url);
const at = (path) => fileURLToPath(new URL(path, root));
await mkdir(at('public/brand/dorito'), { recursive: true });
await mkdir(at('public/brand/project-icons'), { recursive: true });
await mkdir(at('public/brand/header-icons'), { recursive: true });
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
const stackSheet = at('a88e4a3b-2e87-4e39-b923-c4f67c33c8fb.png');
const stackScenes = [
  { id: 'php', left: 18, top: 74, width: 395, height: 524 },
  { id: 'javascript', left: 431, top: 74, width: 395, height: 524 },
  { id: 'vue', left: 842, top: 74, width: 395, height: 524 },
  { id: 'css', left: 19, top: 619, width: 599, height: 551 },
  { id: 'sql', left: 637, top: 619, width: 598, height: 551 },
];
const projectIcons = [
  { id: 'registro-produccion', source: 'public/brand/capturas_apps/produccion/capturas/icono_maquina_forestal.png', label: 'Ilustración de una máquina forestal para Registro de Producción' },
  { id: 'ipac', source: 'public/brand/capturas_apps/IPAC/portfolio/icono_sobrero_egresado.png', label: 'Ilustración de un birrete de egresado para IPAC' },
  { id: 'gestion-gimnasio', source: 'public/brand/capturas_apps/gimnasio/icono_mancuernas.png', label: 'Ilustración de mancuernas para Gestión de Gimnasio' },
  { id: 'mantenimiento', source: 'public/brand/capturas_apps/mantenimiento/icono_mantenimiento.png', label: 'Ilustración de un camión en mantenimiento' },
];
const headerIconSheet = at('public/brand/stack/Iconos-header.png');
const headerIcons = [
  { id: 'inicio', label: 'Inicio', left: 24, top: 309, width: 304, height: 290 },
  { id: 'proyectos', label: 'Proyectos', left: 368, top: 331, width: 292, height: 267 },
  { id: 'tecnologias', label: 'Tecnologías', left: 680, top: 333, width: 336, height: 268 },
  { id: 'sobre-mi', label: 'Sobre mí', left: 1034, top: 315, width: 259, height: 284 },
  { id: 'contacto', label: 'Contacto', left: 1333, top: 351, width: 300, height: 228 },
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
const companionBuffer = await sharp(at('public/brand/dorito/dorito_acostado.png')).resize({ width: 440 }).png().toBuffer();
const companionInput = at('.asset-cache/dorito-acostado.png');
const companionOutput = at('public/brand/dorito/dorito-acostado.svg');
await writeFile(companionInput, companionBuffer);
const companionPython = at('.venv-assets/Scripts/python.exe');
const companionResult = spawnSync(companionPython, [at('scripts/vectorize.py'), companionInput, companionOutput], { encoding: 'utf8' });
if (companionResult.status !== 0) throw new Error(companionResult.stderr || companionResult.stdout || 'Vector conversion failed: dorito-acostado');
let companionSvg = optimize(await readFile(companionOutput, 'utf8'), { multipass: true, plugins: [{ name: 'preset-default', params: { overrides: { convertColors: false } } }] }).data;
const companionColors = [...new Set([...companionSvg.matchAll(/fill="(#[0-9a-fA-F]+)"/g)].map((match) => match[1]))];
for (const [index, color] of companionColors.entries()) companionSvg = companionSvg.replaceAll(`fill="${color}"`, `fill="var(--dorito-${index})"`);
const companionPalette = companionColors.map((color, index) => `--dorito-${index}:${color}`).join(';');
const companionDimensions = /width="([\d.]+)" height="([\d.]+)"/.exec(companionSvg);
if (!companionSvg.includes('viewBox=') && companionDimensions) companionSvg = companionSvg.replace('<svg ', `<svg viewBox="0 0 ${companionDimensions[1]} ${companionDimensions[2]}" `);
companionSvg = companionSvg.replace('<svg ', `<svg role="img" aria-label="Dorito acostado" style="${companionPalette}" `);
await writeFile(companionOutput, companionSvg);
const companionManifest = { id: 'dorito-acostado', path: '/brand/dorito/dorito-acostado.svg', source: '/brand/dorito/dorito_acostado.png', type: 'vector-paths', bytes: Buffer.byteLength(companionSvg), colors: companionColors.length };
const stackManifest = [];
const stackMetadata = await sharp(stackSheet).metadata();
for (const scene of stackScenes) {
  const buffer = await sharp(stackSheet).extract(scene).resize({ width: 440 }).png().toBuffer();
  const input = at(`.asset-cache/stack-${scene.id}.png`);
  const output = at(`public/brand/stack/${scene.id}.svg`);
  await mkdir(at('public/brand/stack'), { recursive: true });
  await writeFile(input, buffer);
  await sharp(buffer).webp({ quality: 86 }).toFile(at(`public/brand/stack/${scene.id}.webp`));
  const python = at('.venv-assets/Scripts/python.exe');
  const result = spawnSync(python, [at('scripts/vectorize.py'), input, output], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `Vector conversion failed: ${scene.id}`);
  let svg = optimize(await readFile(output, 'utf8'), { multipass: true, plugins: [{ name: 'preset-default', params: { overrides: { convertColors: false } } }] }).data;
  const colors = [...new Set([...svg.matchAll(/fill="(#[0-9a-fA-F]+)"/g)].map((match) => match[1]))];
  for (const [index, color] of colors.entries()) svg = svg.replaceAll(`fill="${color}"`, `fill="var(--dorito-${index})"`);
  const palette = colors.map((color, index) => `--dorito-${index}:${color}`).join(';');
  const dimensions = /width="([\d.]+)" height="([\d.]+)"/.exec(svg);
  if (!svg.includes('viewBox=') && dimensions) svg = svg.replace('<svg ', `<svg viewBox="0 0 ${dimensions[1]} ${dimensions[2]}" `);
  svg = svg.replace('<svg ', `<svg role="img" aria-label="Dorito con ${scene.id.toUpperCase()}" style="${palette}" `);
  await writeFile(output, svg);
  stackManifest.push({ pose: scene.id, path: `/brand/stack/${scene.id}.svg`, webp: `/brand/stack/${scene.id}.webp`, type: 'vector-paths', bytes: Buffer.byteLength(svg), colors: colors.length, source: `${stackMetadata.width}x${stackMetadata.height}` });
}
const projectIconManifest = [];
for (const icon of projectIcons) {
  const source = at(icon.source);
  const buffer = await sharp(source).resize({ width: 640 }).png().toBuffer();
  const input = at(`.asset-cache/project-icon-${icon.id}.png`);
  const output = at(`public/brand/project-icons/${icon.id}.svg`);
  await writeFile(input, buffer);
  const python = at('.venv-assets/Scripts/python.exe');
  const result = spawnSync(python, [at('scripts/vectorize.py'), input, output], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `Vector conversion failed: ${icon.id}`);
  let svg = optimize(await readFile(output, 'utf8'), { multipass: true, plugins: [{ name: 'preset-default', params: { overrides: { convertColors: false } } }] }).data;
  // The source illustrations are RGB PNGs with a flat cream canvas. Remove
  // only the traced full-canvas rectangle so the standalone SVG stays transparent.
  svg = svg.replaceAll('M0 0h640v640H0z', '');
  svg = svg.replaceAll(/<path\b[^>]*\bd=""\s*\/>/g, '');
  const colors = [...new Set([...svg.matchAll(/fill="(#[0-9a-fA-F]+)"/g)].map((match) => match[1]))];
  for (const [index, color] of colors.entries()) svg = svg.replaceAll(`fill="${color}"`, `fill="var(--project-icon-${index})"`);
  const palette = colors.map((color, index) => `--project-icon-${index}:${color}`).join(';');
  const dimensions = /width="([\d.]+)" height="([\d.]+)"/.exec(svg);
  if (!svg.includes('viewBox=') && dimensions) svg = svg.replace('<svg ', `<svg viewBox="0 0 ${dimensions[1]} ${dimensions[2]}" `);
  svg = svg.replace('<svg ', `<svg role="img" aria-label="${icon.label}" style="${palette}" `);
  await writeFile(output, svg);
  projectIconManifest.push({ id: icon.id, path: `/brand/project-icons/${icon.id}.svg`, source: `/${icon.source.replace(/^public[\\/]/, '').replaceAll('\\', '/')}`, type: 'vector-paths', bytes: Buffer.byteLength(svg), colors: colors.length });
}
const headerIconManifest = [];
const headerIconMetadata = await sharp(headerIconSheet).metadata();
for (const icon of headerIcons) {
  const buffer = await sharp(headerIconSheet)
    .extract({ left: icon.left, top: icon.top, width: icon.width, height: icon.height })
    .resize({ height: 256 })
    .png()
    .toBuffer();
  const input = at(`.asset-cache/header-icon-${icon.id}.png`);
  const output = at(`public/brand/header-icons/${icon.id}.svg`);
  await writeFile(input, buffer);
  const python = at('.venv-assets/Scripts/python.exe');
  const result = spawnSync(python, [at('scripts/vectorize.py'), input, output], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `Vector conversion failed: ${icon.id}`);
  let svg = optimize(await readFile(output, 'utf8'), { multipass: true, plugins: [{ name: 'preset-default', params: { overrides: { convertColors: false } } }] }).data;
  const colors = [...new Set([...svg.matchAll(/fill="(#[0-9a-fA-F]+)"/g)].map((match) => match[1]))];
  for (const [index, color] of colors.entries()) svg = svg.replaceAll(`fill="${color}"`, `fill="var(--header-icon-${index})"`);
  const palette = colors.map((color, index) => `--header-icon-${index}:${color}`).join(';');
  const dimensions = /width="([\d.]+)" height="([\d.]+)"/.exec(svg);
  if (!svg.includes('viewBox=') && dimensions) svg = svg.replace('<svg ', `<svg viewBox="0 0 ${dimensions[1]} ${dimensions[2]}" `);
  svg = svg.replace('<svg ', `<svg role="img" aria-label="${icon.label}" style="${palette}" `);
  await writeFile(output, svg);
  headerIconManifest.push({
    id: icon.id,
    path: `/brand/header-icons/${icon.id}.svg`,
    source: '/brand/stack/Iconos-header.png',
    type: 'vector-paths',
    transparent: true,
    bytes: Buffer.byteLength(svg),
    colors: colors.length,
    sourceSheet: `${headerIconMetadata.width}x${headerIconMetadata.height}`,
  });
}
const photo = await sharp(at('ChatGPT Image 16 sept 2026, 23_27_44.png')).resize(720, 720).webp({ quality: 88 }).toBuffer();
await writeFile(at('public/brand/roman.webp'), photo);
await writeFile(at('public/brand/roman.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 720" role="img" aria-labelledby="title"><title id="title">Retrato de Román — fotografía raster embebida, no trazados vectoriales</title><image width="720" height="720" href="data:image/webp;base64,${photo.toString('base64')}"/></svg>`);
const technologyIconManifest = await generateTechnologyIcons();
await writeFile(at('public/brand/assets.json'), JSON.stringify({ poses: manifest, companion: companionManifest, stack: stackManifest, projectIcons: projectIconManifest, headerIcons: headerIconManifest, technologyIcons: technologyIconManifest, portrait: { webp: '/brand/roman.webp', svg: '/brand/roman.svg', type: 'embedded-raster' } }, null, 2));
console.log(JSON.stringify({ poses: manifest, companion: companionManifest, stack: stackManifest, projectIcons: projectIconManifest, headerIcons: headerIconManifest, technologyIcons: technologyIconManifest }, null, 2));
