import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { optimize } from 'svgo';

const root = new URL('../', import.meta.url);
const at = (path) => fileURLToPath(new URL(path, root));
const sourceDirectory = 'public/brand/project-icons/tech_icons_separated_clean';
const symbols = [
  { id: 'codeigniter', technology: 'CodeIgniter' },
  { id: 'css', technology: 'CSS' },
  { id: 'docker', technology: 'Docker' },
  { id: 'javascript', technology: 'JavaScript' },
  { id: 'mysql', technology: 'MySQL' },
  { id: 'php', technology: 'PHP' },
  { id: 'python', technology: 'Python' },
  { id: 'supabase', technology: 'Supabase' },
  { id: 'tailwind', technology: 'Tailwind CSS' },
  { id: 'vue', technology: 'Vue.js' },
];

function escapeAttribute(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}

export async function generateTechnologyIcons() {
  const outputDir = at('public/brand/technology-icons');
  await mkdir(outputDir, { recursive: true });
  const manifest = [];

  for (const symbol of symbols) {
    const source = `${sourceDirectory}/${symbol.id}.png`;
    const input = at(source);
    const metadata = await sharp(input).metadata();
    if (metadata.format !== 'png' || !metadata.width || !metadata.height || metadata.hasAlpha !== true) {
      throw new Error(`Technology icon source must be an alpha PNG: ${source}`);
    }
    const output = at(`public/brand/technology-icons/${symbol.id}.svg`);

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
    const label = symbol.technology;
    svg = svg.replace('<svg ', `<svg role="img" aria-label="${escapeAttribute(label)}" style="${palette}" `);
    if (!svg.includes('<path') || /<image\b|<rect\b/i.test(svg)) throw new Error(`Technology icon must be transparent vector paths: ${symbol.id}`);
    await writeFile(output, svg);
    manifest.push({
      id: symbol.id,
      technology: symbol.technology,
      path: `/brand/technology-icons/${symbol.id}.svg`,
      source: `/${source.replace(/^public[\\/]/, '').replaceAll('\\', '/')}`,
      type: 'vector-paths',
      transparent: true,
      bytes: Buffer.byteLength(svg),
      colors: colors.length,
      sourceDimensions: `${metadata.width}x${metadata.height}`,
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
