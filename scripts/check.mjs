import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { projects, profile } from '../src/data.js';
import { home } from '../src/sections/home.js';
import { caseStudy, chapterTitles } from '../src/sections/case-study.js';
import { sceneConfig } from '../src/scene-config.js';
const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const tokens = JSON.parse(await read('src/tokens.json'));
let checks = 0;
const verify = (condition, message) => { assert.ok(condition, message); checks++; };
verify(projects.length === 4 && new Set(projects.map((p) => p.id)).size === 4, 'Four unique project routes');
verify(profile.email === 'romancorach@gmail.com', 'Confirmed email');
verify(profile.github === 'https://github.com/romanvsc', 'Confirmed GitHub');
verify(profile.linkedin === 'https://www.linkedin.com/in/roman-vogel-corach-2998bb31b/', 'Confirmed LinkedIn');
for (const project of projects) verify(project.steps.length === 3 && project.decisions.length === 3, `${project.id}: case content`);
const sourceFiles = (await readdir(new URL('src/', root), { recursive: true })).filter((name) => /\.(js|css)$/.test(name) && name !== 'theme.css').map((name) => `src/${name}`);
for (const file of [...sourceFiles, 'index.html', 'blender/generate-portfolio-core.py']) {
  const content = await read(file);
  verify(!/(?:#[0-9a-f]{3,8}\b|0x[0-9a-f]{6}\b|(?:rgb|hsl|oklch)a?\(\s*[\d.])/i.test(content), `${file}: no literal UI colors`);
  verify(!/(?:color|background|fill|stroke)\s*:\s*(?:white|black|red|green|blue)\b/i.test(content), `${file}: no named UI colors`);
}
const css = await read('src/style.css');
for (const [, token] of css.matchAll(/var\(--color-([a-z-]+)\)/g)) verify(token in tokens, `Token exists: ${token}`);
const theme = await read('src/theme.css');
for (const [name, value] of Object.entries(tokens)) verify(theme.includes(`--color-${name}: ${value};`), `Theme synchronized: ${name}`);
const manifest = JSON.parse(await read('public/brand/assets.json'));
for (const pose of manifest.poses) {
  const svg = await read(`public${pose.path}`);
  verify(svg.includes('<path') && !svg.includes('<image'), `${pose.pose}: true vector, no embedded raster`);
  verify(svg.includes('viewBox='), `${pose.pose}: scalable viewBox`);
  verify(!/<script|onload=|https?:\/\/(?!www.w3.org)/i.test(svg), `${pose.pose}: no executable or remote content`);
  verify(svg.includes('fill="var(--dorito-'), `${pose.pose}: asset palette tokens`);
}
verify(Array.isArray(manifest.stack) && manifest.stack.map((item) => item.pose).join(',') === 'php,javascript,vue,css,sql', 'Five technology illustrations manifest');
for (const scene of manifest.stack) {
  const svg = await read(`public${scene.path}`);
  verify(svg.includes('<path') && !svg.includes('<image'), `${scene.pose}: stack vector, no embedded raster`);
  verify(svg.includes('viewBox='), `${scene.pose}: stack scalable viewBox`);
  verify(!/<script|onload=|https?:\/\/(?!www.w3.org)/i.test(svg), `${scene.pose}: stack safe SVG`);
  verify(svg.includes('fill="var(--dorito-'), `${scene.pose}: stack palette tokens`);
  verify(scene.bytes < 500000, `${scene.pose}: stack SVG bounded`);
}
verify((await read('public/brand/roman.svg')).includes('data:image/webp;base64,'), 'Portrait wrapper clearly remains raster');
const glb = await readFile(new URL('public/models/portfolio-studio.glb', root));
verify(glb.readUInt32LE(0) === 0x46546c67, 'Studio GLB header');
const files = await readdir(new URL('dist/assets/', root));
const builtCss = await read(`dist/assets/${files.find((name) => name.endsWith('.css'))}`);
verify(!builtCss.includes('@apply') && !builtCss.includes('@theme'), 'Tailwind compiled, no raw directives');
verify(builtCss.includes('.text-link') && builtCss.includes('--color-brand'), 'Semantic interactive styles built');
verify(projects.map((p) => p.id).join(',') === 'registro,ipac,gimnasio,mantenimiento', 'Approved four routes, IPAC retained');
verify(chapterTitles.length === 9, 'Nine case chapters');
for (const project of projects) {
  const html = caseStudy(project);
  verify((html.match(/class="case-chapter"/g) || []).length === 9, `${project.id}: all chapters rendered`);
  verify(html.includes('CAPTURAS REALES / PENDIENTES'), `${project.id}: honest screenshot placeholder`);
  verify(project.theme in tokens && `${project.theme}-soft` in tokens, `${project.id}: theme tokens`);
  verify(Boolean(project.architecture), `${project.id}: documented architecture`);
}
const homepage = home();
verify(homepage.includes('ESTUDIANTE DE') && homepage.includes('ANALISTA DE SISTEMAS'), 'Student profile remains explicit');
verify(!homepage.includes('Registro Personal'), 'Excluded project absent');
verify((homepage.match(/data-project=/g) || []).length === 4, 'Four editorial project sections');
verify((homepage.match(/data-stack-item=/g) || []).length === 5, 'Five irregular stack modules');
verify(!homepage.includes('activate-scene') && !homepage.includes('studio-section'), '3D experiment removed from home');
verify((await read('src/components/studio.js')).includes("import('../scene.js')"), 'Three remains a lazy chunk');
verify(sceneConfig.pixelRatioLimit <= 1.5, 'DPR capped');
verify((await read('src/components/layout.js')).includes('<dialog'), 'Native modal menu');
verify((await read('src/animations/index.js')).includes('if (!conditions.motion) return'), 'Reduced motion excludes GSAP effects');
function luminance(hex) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((n) => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}
const contrastPairs = [['ink', 'canvas'], ['muted', 'canvas'], ['on-brand', 'brand'], ['accent-ink', 'accent'], ['muted', 'surface'], ['focus', 'canvas'], ['maintenance-signal', 'canvas']];
for (const project of projects) contrastPairs.push([project.theme, `${project.theme}-soft`], ['ink', `${project.theme}-soft`], ['muted', `${project.theme}-soft`]);
for (const [foreground, background] of contrastPairs) {
  const values = [luminance(tokens[foreground]), luminance(tokens[background])].sort((a, b) => b - a);
  const contrast = (values[0] + .05) / (values[1] + .05);
  verify(contrast >= 4.5, `Contrast ${foreground}/${background}: ${contrast.toFixed(2)}`);
  console.log(`Contrast ${foreground}/${background}: ${contrast.toFixed(2)}:1`);
}
console.log(`${checks} assertions passed: tokens, assets, project data, contacts, GLB and compiled CSS.`);
