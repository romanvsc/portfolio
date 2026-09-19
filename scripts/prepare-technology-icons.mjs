import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { optimize } from 'svgo';

const root = new URL('../', import.meta.url);
const at = (path) => fileURLToPath(new URL(path, root));
const source = 'public/brand/project-icons/tecnologias_icon.png';
const symbols = [
  { id: 'vue', technology: 'Vue.js', row: 0, column: 0 },
  { id: 'php', technology: 'PHP', row: 0, column: 1 },
  { id: 'source-03', technology: null, row: 0, column: 2 },
  { id: 'javascript', technology: 'JavaScript', row: 0, column: 3 },
  { id: 'python', technology: 'Python', row: 0, column: 4 },
  { id: 'source-06', technology: null, row: 1, column: 0 },
  { id: 'supabase', technology: 'Supabase', row: 1, column: 1 },
  { id: 'docker', technology: 'Docker', row: 1, column: 2 },
  { id: 'laravel', technology: 'Laravel', row: 1, column: 3 },
  { id: 'source-10', technology: null, row: 1, column: 4 },
];

function removeEdgeConnectedBlack(data, width, height) {
  const rgba = Buffer.alloc(width * height * 4);
  for (let pixel = 0; pixel < width * height; pixel++) {
    const sourceOffset = pixel * 3;
    const targetOffset = pixel * 4;
    rgba[targetOffset] = data[sourceOffset];
    rgba[targetOffset + 1] = data[sourceOffset + 1];
    rgba[targetOffset + 2] = data[sourceOffset + 2];
    rgba[targetOffset + 3] = 255;
  }

  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  const enqueueBackground = (pixel) => {
    if (visited[pixel]) return;
    const offset = pixel * 3;
    if (Math.max(data[offset], data[offset + 1], data[offset + 2]) > 10) return;
    visited[pixel] = 1;
    queue[tail++] = pixel;
  };

  for (let x = 0; x < width; x++) {
    enqueueBackground(x);
    enqueueBackground((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    enqueueBackground(y * width);
    enqueueBackground(y * width + width - 1);
  }

  while (head < tail) {
    const pixel = queue[head++];
    rgba[pixel * 4 + 3] = 0;
    const x = pixel % width;
    if (x > 0) enqueueBackground(pixel - 1);
    if (x + 1 < width) enqueueBackground(pixel + 1);
    if (pixel >= width) enqueueBackground(pixel - width);
    if (pixel + width < width * height) enqueueBackground(pixel + width);
  }
  return rgba;
}

function escapeAttribute(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}

export async function generateTechnologyIcons() {
  const image = sharp(at(source));
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height || metadata.hasAlpha !== false) {
    throw new Error('Technology icon sheet metadata is incomplete');
  }

  const columns = 5;
  const rows = 2;
  const cellWidth = metadata.width / columns;
  const cellHeight = metadata.height / rows;
  const outputDir = at('public/brand/technology-icons');
  await mkdir(outputDir, { recursive: true });
  await mkdir(at('.asset-cache'), { recursive: true });
  const manifest = [];

  for (const symbol of symbols) {
    const left = Math.floor(symbol.column * cellWidth);
    const top = Math.floor(symbol.row * cellHeight);
    const width = Math.floor((symbol.column + 1) * cellWidth) - left;
    const height = Math.floor((symbol.row + 1) * cellHeight) - top;
    const crop = await sharp(at(source))
      .extract({ left, top, width, height })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const rgba = removeEdgeConnectedBlack(crop.data, width, height);
    const transparentCrop = await sharp(rgba, { raw: { width, height, channels: 4 } })
      .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
      .resize({ width: 440, withoutEnlargement: true })
      .png()
      .toBuffer();
    const cacheName = `.asset-cache/technology-${symbol.id}.png`;
    const input = at(cacheName);
    const output = at(`public/brand/technology-icons/${symbol.id}.svg`);
    await writeFile(input, transparentCrop);

    const python = at('.venv-assets/Scripts/python.exe');
    const result = spawnSync(python, [at('scripts/vectorize.py'), input, output], { encoding: 'utf8' });
    if (result.status !== 0) throw new Error(result.stderr || result.stdout || `Vector conversion failed: ${symbol.id}`);

    let svg = optimize(await readFile(output, 'utf8'), {
      multipass: true,
      plugins: [{ name: 'preset-default', params: { overrides: { convertColors: false } } }],
    }).data;
    const colors = [...new Set([...svg.matchAll(/fill="(#[0-9a-fA-F]+)"/g)].map((match) => match[1]))];
    for (const [index, color] of colors.entries()) svg = svg.replaceAll(`fill="${color}"`, `fill="var(--technology-icon-${index})"`);
    const palette = colors.map((color, index) => `--technology-icon-${index}:${color}`).join(';');
    const dimensions = /width="([\d.]+)" height="([\d.]+)"/.exec(svg);
    if (!svg.includes('viewBox=') && dimensions) svg = svg.replace('<svg ', `<svg viewBox="0 0 ${dimensions[1]} ${dimensions[2]}" `);
    const label = symbol.technology || `Símbolo tecnológico sin identificar ${String(symbol.row * columns + symbol.column + 1).padStart(2, '0')}`;
    svg = svg.replace('<svg ', `<svg role="img" aria-label="${escapeAttribute(label)}" style="${palette}" `);
    await writeFile(output, svg);
    manifest.push({
      id: symbol.id,
      technology: symbol.technology,
      path: `/brand/technology-icons/${symbol.id}.svg`,
      source: `/${source.replace(/^public[\\/]/, '').replaceAll('\\', '/')}`,
      sourcePosition: symbol.row * columns + symbol.column + 1,
      type: 'vector-paths',
      transparent: true,
      bytes: Buffer.byteLength(svg),
      colors: colors.length,
    });
  }
  return manifest;
}

const calledDirectly = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase() === resolve(process.argv[1]).toLowerCase();
if (calledDirectly) {
  const technologyIcons = await generateTechnologyIcons();
  const manifestPath = at('public/brand/assets.json');
  const assets = JSON.parse(await readFile(manifestPath, 'utf8'));
  assets.technologyIcons = technologyIcons;
  await writeFile(manifestPath, `${JSON.stringify(assets, null, 2)}\n`);
  console.log(JSON.stringify(technologyIcons, null, 2));
}
