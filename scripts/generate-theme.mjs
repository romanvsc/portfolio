import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
export async function generateTheme() {
const tokens = JSON.parse(await readFile(new URL('../src/tokens.json', import.meta.url), 'utf8'));
const output = `/* Generated from tokens.json. Edit the source, not this file. */\n@theme static {\n  --color-*: initial;\n${Object.entries(tokens).map(([key, value]) => `  --color-${key}: ${value};`).join('\n')}\n  --font-sans: 'Manrope', sans-serif;\n  --font-mono: 'DM Mono', monospace;\n}\n`;
await writeFile(new URL('../src/theme.css', import.meta.url), output);
console.log(`Theme: ${Object.keys(tokens).length} semantic tokens generated.`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await generateTheme();
