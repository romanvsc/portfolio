// CV en PDF (ES + EN): HTML A4 armado con los datos del sitio → Chrome headless imprime public/cv/*.pdf.
// Uso: npm run cv. Sin dependencias nuevas: sharp para la foto y el Chrome instalado.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { P } from '../src/world/moods.ts';
import { PROFILE, SKILLS } from '../src/content/profile.ts';
import { PROJECTS } from '../src/content/projects.ts';
import { CV, CV_PROJECTS } from '../src/content/cv.ts';
import { es } from '../src/i18n/es.ts';
import { en } from '../src/i18n/en.ts';

const root = resolve(import.meta.dirname, '..');
const build = resolve(root, 'cv/.build');
const out = resolve(root, 'public/cv');
mkdirSync(build, { recursive: true });
mkdirSync(out, { recursive: true });

// shortcut: ruta de Chrome de Windows por defecto; en otro sistema, pasar CHROME_PATH
const chrome = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
assert.ok(existsSync(chrome), `No encuentro Chrome en ${chrome}: definí CHROME_PATH`);

const photo = resolve(build, 'photo.jpg');
await sharp(resolve(root, 'ChatGPT Image 16 sept 2026, 23_27_44.png'))
  .resize(900, 900).greyscale().normalise().jpeg({ quality: 82 }).toFile(photo);

const font = (pkg, file) => pathToFileURL(resolve(root, 'node_modules/@fontsource', pkg, 'files', file)).href;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const host = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const phone = '+54 9 3743 48-1391';

function html(lang) {
  const c = CV[lang];
  const groups = (lang === 'es' ? es : en).guia.groups;
  const projects = CV_PROJECTS.map((id) => PROJECTS.find((p) => p.id === id));
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>CV · ${esc(PROFILE.name)}</title><style>
@font-face{font-family:Anton;src:url(${font('anton', 'anton-latin-400-normal.woff2')})}
@font-face{font-family:Grotesk;font-weight:400;src:url(${font('space-grotesk', 'space-grotesk-latin-400-normal.woff2')})}
@font-face{font-family:Grotesk;font-weight:700;src:url(${font('space-grotesk', 'space-grotesk-latin-700-normal.woff2')})}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{width:210mm;height:297mm;overflow:hidden;font:400 8.6pt/1.45 Grotesk,sans-serif;color:${P.tinta};background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
a{color:inherit;text-decoration:none}
.page{position:relative;display:grid;grid-template-columns:96mm 1fr;height:297mm}
.dark{background:${P.tinta};color:${P.papel50};margin-left:7mm;padding:118mm 9mm 0 9mm;display:flex;flex-direction:column;gap:7mm}
.photo{position:absolute;left:0;top:0;width:103mm;height:112mm;object-fit:cover;object-position:50% 30%;clip-path:polygon(0 16%,100% 0,100% 74%,0 100%)}
.light{padding:15mm 12mm 0 11mm;display:flex;flex-direction:column;gap:7mm}
h2{font:400 12.5pt Anton,sans-serif;letter-spacing:.32em;text-transform:uppercase;padding-bottom:1.6mm;margin-bottom:2.6mm;border-bottom:.6mm solid}
.dark h2{border-color:${P.fosforo300}}.light h2{border-color:${P.fosforo800}}
.kicker{font-style:italic;text-align:right;font-size:11pt}
.name{font-family:Anton,sans-serif;text-transform:uppercase;text-align:right;line-height:.95;padding-top:6mm}
.name .first{display:block;font-size:84pt}.name .last{display:block;font-size:40pt;letter-spacing:.02em}
.role{text-align:right;font-size:10.5pt;margin-top:3mm}.role span{display:block}
.date{font-weight:700;color:${P.fosforo800};font-size:8pt;letter-spacing:.04em}
.dark .date{color:${P.fosforo300}}
.item{margin-bottom:3.2mm}.item b{display:block;font-size:9.6pt}
.muted{opacity:.8}
.contact div{margin-bottom:1.2mm}
.stack{display:grid;grid-template-columns:auto 1fr;gap:1.2mm 4mm}.stack dt{font-weight:700}
</style></head><body><div class="page">
<img class="photo" src="${pathToFileURL(photo).href}" alt="">
<aside class="dark">
  <section><h2>${c.labels.profile}</h2><p>${esc(c.profile)}</p></section>
  <section><h2>${c.labels.projects}</h2>${projects.map((p) => `<div class="item"><b>${esc(p.name)}</b><span class="date">${esc(p.role[lang])}</span><br><span class="muted">${esc(p.summary[lang])}</span></div>`).join('')}</section>
</aside>
<main class="light">
  <header><p class="kicker">${c.kicker}</p><h1 class="name"><span class="first">${esc(PROFILE.first)}</span><span class="last">${esc(PROFILE.last)}</span></h1><p class="role">${c.role.split(' · ').map((r) => `<span>${esc(r)}</span>`).join('')}</p></header>
  <section class="contact"><h2>${c.labels.contact}</h2>
    <div>${phone}</div><div><a href="mailto:${PROFILE.email}">${PROFILE.email}</a></div>
    <div><a href="${PROFILE.linkedin}">${host(PROFILE.linkedin)}</a></div><div><a href="${PROFILE.github}">${host(PROFILE.github)}</a></div>
    <div class="muted">${esc(c.place)}</div></section>
  <section><h2>${c.labels.experience}</h2>${c.experience.map((x) => `<div class="item"><span class="date">${x.years}</span><b>${esc(x.role)}</b><span>${esc(x.org)}</span>${x.task ? `<p class="muted">${esc(x.task)}</p>` : ''}</div>`).join('')}</section>
  <section><h2>${c.labels.education}</h2><div class="item"><span class="date">${c.education.years}</span><b>${esc(c.education.title)}</b><span class="muted">${esc(c.education.org)}</span></div></section>
  <section><h2>${c.labels.stack}</h2><dl class="stack">${Object.entries(SKILLS).map(([g, list]) => `<dt>${groups[g]}</dt><dd>${list.join(' · ')}</dd>`).join('')}</dl></section>
</main></div></body></html>`;
}

for (const lang of ['es', 'en']) {
  const page = html(lang);
  // regla 3 del repo: nunca presentarlo como egresado
  assert.match(page, lang === 'es' ? /en formación/ : /student/);
  const file = resolve(build, `cv-${lang}.html`);
  writeFileSync(file, page);
  const pdf = resolve(out, `roman-vogel-corach-cv-${lang}.pdf`);
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--user-data-dir=${resolve(build, 'chrome')}`,
    '--run-all-compositor-stages-before-draw', '--virtual-time-budget=4000', `--print-to-pdf=${pdf}`, pathToFileURL(file).href], { stdio: 'ignore' });
  assert.ok(existsSync(pdf) && statSync(pdf).size > 0, `No se generó ${pdf}`);
  console.log(`✓ ${pdf} (${Math.round(statSync(pdf).size / 1024)} KB)`);
}
