// Íconos pixel de las tecnologías (Guía). Logos de simple-icons (CC0) rasterizados a 20×20.
// Uso: npm run icons → escribe src/art/tech-icons.ts (generado, se commitea).
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import * as si from 'simple-icons';
import { SKILLS } from '../src/content/profile.ts';
import { bitmap, pixelPath } from './pixel-path.mjs';

const SIZE = 20;
const SLUG = {
  'Vue 3': 'vuedotjs', React: 'react', TypeScript: 'typescript', Tailwind: 'tailwindcss', GSAP: 'gsap', PWA: 'pwa',
  FastAPI: 'fastapi', Django: 'django', 'PHP · CodeIgniter': 'codeigniter', Node: 'nodedotjs',
  PostgreSQL: 'postgresql', Supabase: 'supabase',
  Docker: 'docker', Nginx: 'nginx', Vercel: 'vercel', 'GitHub Actions': 'githubactions',
};
// IndexedDB no tiene logo y el de MySQL es un logotipo ilegible a 20 px: cilindro de base de datos a mano
const DB = bitmap([
  '....................', '.....##########.....', '...##..........##...', '..#..............#..',
  '..#..............#..', '...##..........##...', '..#.###########..#..', '..#..............#..',
  '..##............##..', '..#.###########..#..', '..#..............#..', '..##............##..',
  '..#.###########..#..', '..#..............#..', '..#..............#..', '...##..........##...',
  '.....##########.....', '....................', '....................', '....................',
]);

async function rasterize(path) {
  // a 10× y bajando con promedio: el umbral decide qué píxel queda encendido
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.5 -1.5 27 27" width="${SIZE * 10}" height="${SIZE * 10}"><path d="${path}"/></svg>`;
  return sharp(Buffer.from(svg)).resize(SIZE, SIZE, { kernel: 'cubic' }).ensureAlpha().extractChannel(3).raw().toBuffer();
}

const out = {};
for (const label of Object.values(SKILLS).flat()) {
  const slug = SLUG[label];
  const icon = slug && si[`si${slug[0].toUpperCase()}${slug.slice(1)}`];
  out[label] = icon ? pixelPath(await rasterize(icon.path), SIZE) : pixelPath(DB, SIZE);
  console.log(icon ? '✓' : '◇', label);
}

const file = `// Generado por scripts/pixel-icons.mjs (npm run icons). No editar a mano.
// Logos: simple-icons (CC0), rasterizados a ${SIZE}×${SIZE}.
export const ICON_SIZE = ${SIZE};
export const TECH_ICONS: Record<string, string> = ${JSON.stringify(out, null, 2)};
`;
await writeFile(resolve(import.meta.dirname, '../src/art/tech-icons.ts'), file);
