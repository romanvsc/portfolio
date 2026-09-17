import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/dm-mono/latin-400.css';
import './style.css';
import { projects } from './data.js';
import tokens from './tokens.json';
import { header, footer } from './components/layout.js';
import { home } from './sections/home.js';
import { caseStudy } from './sections/case-study.js';
import { initInteractions } from './components/interactions.js';
import { initMotion } from './animations/index.js';

const path = location.pathname.replace(/\/$/, '') || '/';
const selected = projects.find((project) => path === `/proyectos/${project.id}`);
let content;
if (path === '/') content = home();
else if (selected) {
  content = caseStudy(selected);
  document.title = `${selected.title} — Román Vogel`;
  document.querySelector('meta[name="description"]').content = selected.statement;
} else {
  document.title = 'Página no encontrada — Román Vogel';
  content = '<main id="contenido" tabindex="-1" class="not-found shell"><p class="meta">404 / POR ACÁ NO ERA</p><h1>Esta página no existe.</h1><a href="/" class="text-link">Volver al inicio ↗</a></main>';
}
document.querySelector('#app').innerHTML = header() + content + footer();
let meta = document.querySelector('meta[name="theme-color"]');
if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.append(meta); }
meta.content = tokens.canvas;
const cleanups = [initInteractions(), initMotion()];
let disposed = false;
function dispose() {
  if (disposed) return;
  disposed = true;
  cleanups.reverse().forEach((cleanup) => cleanup());
  window.removeEventListener('pagehide', pageHide);
}
function pageHide(event) { if (!event.persisted) dispose(); }
window.addEventListener('pagehide', pageHide);
if (import.meta.hot) import.meta.hot.dispose(dispose);
if (location.hash) document.fonts.ready.then(() => {
  if (!disposed) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
});
