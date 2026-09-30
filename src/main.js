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
import { initThemeToggle } from './components/theme.js';
import { initMotion, navigateToStoryAnchor } from './animations/index.js';

const path = location.pathname.replace(/\/$/, '') || '/';
const selected = projects.find((project) => path === `/proyectos/${project.id}`);
const PROJECT_ORIGIN_KEY = 'portfolio-project-origin';
const PROJECT_TRANSITION_KEY = 'portfolio-project-transition';
let projectOrigin = null;
let pendingProjectTransition = null;
try {
  projectOrigin = path === '/' ? sessionStorage.getItem(PROJECT_ORIGIN_KEY) : null;
  pendingProjectTransition = sessionStorage.getItem(PROJECT_TRANSITION_KEY);
  if (path === '/') sessionStorage.removeItem(PROJECT_ORIGIN_KEY);
  if (path === '/' || (selected && pendingProjectTransition !== selected.id)) sessionStorage.removeItem(PROJECT_TRANSITION_KEY);
  else if (selected && pendingProjectTransition === selected.id) sessionStorage.removeItem(PROJECT_TRANSITION_KEY);
} catch { /* Private browsing may disable storage; links still work normally. */ }
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasViewTransitionSupport = Boolean(CSS.supports?.('view-transition-name: none') && 'onpagereveal' in window);
if (projectOrigin && path === '/') document.documentElement.dataset.storyProjectOrigin = projectOrigin;
if (selected && pendingProjectTransition === selected.id && !reducedMotion && !hasViewTransitionSupport) {
  document.documentElement.dataset.projectTransitionIn = selected.id;
}
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
document.querySelector('#app').innerHTML = header(path === '/') + content + footer();
if (selected && pendingProjectTransition === selected.id && !reducedMotion && hasViewTransitionSupport) {
  const transitionVisual = [...document.querySelectorAll('[data-project-transition]')]
    .find((element) => element.dataset.projectTransition === selected.id);
  if (transitionVisual) transitionVisual.style.viewTransitionName = `project-art-${selected.id}`;
}
let meta = document.querySelector('meta[name="theme-color"]');
if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.append(meta); }
meta.content = document.documentElement.dataset.theme === 'dark' ? tokens.dark.canvas : tokens.canvas;
const cleanups = [initThemeToggle(), initInteractions(), initMotion()];
let disposed = false;
function dispose() {
  if (disposed) return;
  disposed = true;
  cleanups.reverse().forEach((cleanup) => cleanup());
  window.removeEventListener('pagehide', pageHide);
}
function pageHide(event) { if (!event.persisted) dispose(); }
window.addEventListener('pagehide', pageHide);
window.addEventListener('pageshow', (event) => {
  if (!event.persisted || path !== '/') return;
  try { sessionStorage.removeItem(PROJECT_ORIGIN_KEY); } catch { /* Storage is optional. */ }
});
if (import.meta.hot) import.meta.hot.dispose(dispose);
const initialStoryAnchor = path === '/' && projectOrigin ? 'proyectos' : location.hash.slice(1);
if (initialStoryAnchor) document.fonts.ready.then(() => {
  if (disposed) return;
  const projectId = initialStoryAnchor === 'proyectos' ? projectOrigin : undefined;
  const returnProject = projectId
    ? [...document.querySelectorAll('[data-project]')].find((project) => project.dataset.project === projectId)
    : null;
  if (!navigateToStoryAnchor(initialStoryAnchor, { behavior: 'auto', focus: false, updateHash: false, projectId })) {
    (returnProject || document.getElementById(initialStoryAnchor))?.scrollIntoView({ behavior: 'instant' });
  }
});
