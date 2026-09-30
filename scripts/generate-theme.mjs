import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
export async function generateTheme() {
const tokens = JSON.parse(await readFile(new URL('../src/tokens.json', import.meta.url), 'utf8'));
const lightTokens = Object.fromEntries(Object.entries(tokens).filter(([, value]) => typeof value === 'string'));
const darkTokens = tokens.dark;
const requiredDarkTokens = Object.keys(lightTokens).filter((key) => !key.startsWith('scene-'));
if (!darkTokens || requiredDarkTokens.some((key) => typeof darkTokens[key] !== 'string')) {
  throw new Error('The dark palette must define every semantic UI token.');
}
if (Object.keys(darkTokens).some((key) => typeof lightTokens[key] !== 'string')) {
  throw new Error('The dark palette contains a token without a light counterpart.');
}
const declarations = (palette) => Object.entries(palette).map(([key, value]) => `  --color-${key}: ${value};`).join('\n');
const output = `/* Generated from tokens.json. Edit the source, not this file. */\n@theme static {\n  --color-*: initial;\n${declarations(lightTokens)}\n  --font-sans: 'Manrope', sans-serif;\n  --font-mono: 'DM Mono', monospace;\n}\n\n:root[data-theme="dark"] {\n  color-scheme: dark;\n${declarations(darkTokens)}\n}\n`;
await writeFile(new URL('../src/theme.css', import.meta.url), output);
console.log(`Theme: ${Object.keys(lightTokens).length} light and ${Object.keys(darkTokens).length} dark semantic tokens generated.`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await generateTheme();
