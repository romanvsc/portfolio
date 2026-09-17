import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-800.css';
import '@fontsource/dm-mono/latin-400.css';
import { projects, profile } from './data.js';
import tokens from './tokens.json';
import './style.css';

gsap.registerPlugin(ScrollTrigger);
const app = document.querySelector('#app');
const arrow = '<span aria-hidden="true">↗</span>';
const external = 'target="_blank" rel="noopener noreferrer"';
const mascot = (pose, className = '', eager = false) => `<img class="dorito ${className}" src="/brand/dorito/${pose}.svg" width="440" height="380" alt="Dorito, mi mascota, ${pose}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
const tag = (text) => `<span class="tag">${text}</span>`;
const navItems = [['inicio', 'Inicio'], ['proyectos', 'Proyectos'], ['tecnologias', 'Tecnologías'], ['sobre-mi', 'Sobre mí'], ['contacto', 'Contacto']];

function header() {
  return `<a href="#contenido" class="skip-link">Saltar al contenido</a><header class="site-header"><div class="shell header-inner">
    <a href="/" class="brand" aria-label="Román Vogel Corach, inicio"><span class="brand-symbol">rv.</span><span class="brand-name">ROMÁN VOGEL CORACH<small>desarrollo web & sistemas</small></span></a>
    <button class="menu-toggle" aria-controls="navigation" aria-expanded="false" aria-label="Abrir menú">Menú <span aria-hidden="true">＋</span></button>
    <nav id="navigation" aria-label="Principal">${navItems.map(([id, label]) => `<a href="/#${id}">${label}</a>`).join('')}</nav>
    <a class="header-github" href="${profile.github}" ${external} aria-label="GitHub de Román">GitHub ${arrow}</a>
  </div></header>`;
}
function footer() {
  return `<footer class="shell site-footer"><a class="brand-symbol" href="/" aria-label="Volver al inicio">rv.</a><p>© ${new Date().getFullYear()} Román Vogel Corach</p><span>Con código, criterio y un poco de Dorito.</span><a href="#contenido">Volver arriba ↑</a></footer>`;
}

// Conceptual flow diagrams, not screenshots or fabricated production metrics.
function projectVisual(project, detailed = false) {
  return `<div class="project-visual visual-${project.id} ${detailed ? 'project-visual--large' : ''}" aria-label="Esquema conceptual de ${project.title}">
    <span class="visual-caption">${project.domain}<span aria-hidden="true">/ ${project.number}</span></span>
    <div class="flow-sheet"><div class="flow-head"><span class="flow-logo" aria-hidden="true">${project.mark}</span><div><strong>${project.title}</strong><span>${project.subtitle}</span></div><span class="flow-dots" aria-hidden="true">•••</span></div>
    <div class="flow-body"><div class="flow-sidebar" aria-hidden="true"><span></span><span></span><span></span><span></span></div><div class="flow-content"><span class="flow-label">${project.flowTitle}</span><div class="flow-steps">${project.steps.map((step, i) => `<div><span class="step-number">0${i + 1}</span><strong>${step}</strong><span class="step-rule" aria-hidden="true"></span></div>`).join('')}</div><div class="flow-note"><span aria-hidden="true">↳</span> ${project.focus}</div></div></div></div>
    <span class="concept-label">Esquema conceptual · no es una captura del sistema</span></div>`;
}
function projectCard(project) {
  return `<article class="project-card" data-reveal><a href="/proyectos/${project.id}" class="project-image-link" tabindex="-1" aria-hidden="true">${projectVisual(project)}</a><div class="project-info"><div class="project-title"><h3><a href="/proyectos/${project.id}">${project.title}</a></h3><a href="/proyectos/${project.id}" class="project-arrow" aria-label="Ver proyecto ${project.title}">${arrow}</a></div><p>${project.statement}</p><div class="tags">${project.stack.map(tag).join('')}</div></div></article>`;
}
function home() {
  return `${header()}<main id="contenido">
    <section id="inicio" class="hero shell" aria-labelledby="hero-title"><div class="hero-copy" data-reveal>
      <p class="eyebrow"><span class="eyebrow-rule"></span> MI RINCÓN EN INTERNET</p><h1 id="hero-title">Hola, soy<br><span class="text-brand">Román<span class="hero-period">.</span></span></h1>
      <p class="hero-role">Estudiante de Analista de Sistemas</p><p class="hero-description">Me gusta entender cómo funcionan las cosas.<br class="desktop-break"> Y construir software que las haga funcionar mejor.</p>
      <div class="hero-tools" aria-label="Mis principales tecnologías"><span>PHP</span><span>JavaScript</span><span>Vue.js</span><span>CSS</span><span>SQL</span></div>
      <div class="hero-actions"><a class="button button-primary" href="#proyectos">Explorar proyectos <span aria-hidden="true">↓</span></a><a class="button button-secondary" href="mailto:${profile.email}">Hablemos ${arrow}</a></div>
      <div class="hero-note"><span class="note-line" aria-hidden="true"></span><p>Aprender. Construir. Volver a intentar.</p></div></div>
      <div class="hero-composition" data-reveal><span class="composition-orbit" aria-hidden="true"></span><span class="composition-spark" aria-hidden="true">✳</span><figure class="portrait-card"><img src="/brand/roman.webp" alt="Retrato de Román Vogel Corach" width="720" height="720" fetchpriority="high"><figcaption><span>Román Vogel Corach</span><span class="font-mono">&lt;dev /&gt;</span></figcaption></figure><div class="portrait-label"><span aria-hidden="true">{ }</span> Ideas que se convierten en código.</div><div class="dorito-welcome">${mascot('saludando', '', true)}<span>Él es Dorito.<br><strong>Mi compañero de código.</strong></span></div><span class="composition-note">personas detrás del software ↗</span></div>
    </section>
    <div class="intro-strip"><div class="shell"><span>SOFTWARE CON CONTEXTO</span><p>Producción <i>/</i> Educación <i>/</i> Gestión <i>/</i> Mantenimiento</p><span aria-hidden="true">✳</span></div></div>
    <section id="proyectos" class="section shell" aria-labelledby="projects-title"><div class="section-heading" data-reveal><div><p class="eyebrow">01 / TRABAJO SELECCIONADO</p><h2 id="projects-title">Del problema<br>a la <em>solución.</em></h2></div><p>Cuatro sistemas, distintos contextos.<br>Una mirada puesta en el trabajo de todos los días.</p></div><div class="projects-grid">${projects.map(projectCard).join('')}</div><div class="projects-footnote"><span>Una selección de proyectos de mi GitHub.</span><a class="text-link" href="${profile.github}?tab=repositories" ${external}>Ver repositorios ${arrow}</a></div></section>
    <section id="tecnologias" class="toolkit-section" aria-labelledby="toolkit-title"><div class="shell"><div class="toolkit-intro" data-reveal><div><p class="eyebrow">02 / MI CAJA DE HERRAMIENTAS</p><h2 id="toolkit-title">El código detrás<br>de las ideas.</h2><p>Estas son las tecnologías en las que me destaco<br class="desktop-break"> y con las que disfruto construir.</p></div><div class="dorito-toolkit">${mascot('trabajando')}<span>Dorito ya está en modo trabajo.</span></div></div>
      <div class="tools-grid" data-reveal>${[['php', 'PHP', 'Lógica del lado del servidor', '01'], ['JS', 'JavaScript', 'Interacción y comportamiento', '02'], ['V', 'Vue.js', 'Interfaces por componentes', '03'], ['{ }', 'CSS', 'Diseño que se adapta', '04'], ['SQL', 'SQL', 'Datos con estructura', '05']].map(([mark, name, description, n]) => `<article class="tool-card"><span class="tool-number">${n}</span><span class="tool-mark" aria-hidden="true">${mark}</span><h3>${name}</h3><p>${description}</p></article>`).join('')}</div></div></section>
    <section id="sobre-mi" class="section shell about-section" aria-labelledby="about-title"><div class="about-copy" data-reveal><p class="eyebrow">03 / UN POCO SOBRE MÍ</p><h2 id="about-title">Curiosidad como<br>punto de <em>partida.</em></h2><p>Soy Román, estudiante de Analista de Sistemas. Me interesa conectar lo que aprendo con problemas concretos: entender un proceso, ordenar sus datos y darle una interfaz clara.</p><p>En este espacio reúno proyectos de producción, educación, gimnasios y mantenimiento. Cada contexto es una oportunidad para seguir aprendiendo.</p><div class="about-dorito">${mascot('feliz')}<p>Y sí, este portfolio tiene mascota.<br><strong>Dorito pone su parte de alegría.</strong></p></div></div><div class="studio-card" data-reveal><div class="studio-heading"><span class="font-mono">EN MI ESCRITORIO</span><span aria-hidden="true">↙</span></div><div class="scene-frame"><canvas id="scene" aria-hidden="true"></canvas><div class="scene-fallback"><span aria-hidden="true">&lt; / &gt;</span><p>Una idea.<br>Un proyecto.<br>Algo nuevo que aprender.</p></div></div><div class="studio-caption"><span>Un pequeño espacio para construir.</span><span class="font-mono">Blender + Three.js</span></div></div></section>
    <section id="contacto" class="contact-section" aria-labelledby="contact-title"><div class="shell contact-inner"><div class="contact-copy" data-reveal><p class="eyebrow">04 / SIGAMOS LA CONVERSACIÓN</p><h2 id="contact-title">¿Tenés una idea?<br><em>Te leo.</em></h2><a class="contact-email" href="mailto:${profile.email}">${profile.email} ${arrow}</a><div class="contact-links"><a href="${profile.github}" ${external}>GitHub ${arrow}</a><a href="${profile.linkedin}" ${external}>LinkedIn ${arrow}</a></div></div><div class="dorito-contact" data-reveal>${mascot('comentando')}<span>Dorito también quiere escucharla.</span></div></div></section>
  </main>${footer()}`;
}
function caseStudy(project) {
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return `${header()}<main id="contenido" class="case-page shell"><a href="/#proyectos" class="text-link back-link">← Volver a proyectos</a><div class="case-heading"><p class="eyebrow">PROYECTO ${project.number} / ${project.domain}</p><h1>${project.title}</h1><p>${project.statement}</p><div class="tags">${project.stack.map(tag).join('')}</div></div>${projectVisual(project, true)}
    <div class="case-body"><section><p class="eyebrow">EL CONTEXTO</p><h2>${project.caseTitle}</h2><p>${project.description}</p><p>${project.challenge}</p></section><aside class="case-facts"><h2>Ficha del proyecto</h2><dl><div><dt>Contexto</dt><dd>${project.domain}</dd></div><div><dt>Foco</dt><dd>${project.focus}</dd></div><div><dt>Tecnologías</dt><dd>${project.stack.join(' · ')}</dd></div></dl><a class="button button-primary" href="${project.repository}" ${external}>Ver repositorio ${arrow}</a></aside></div>
    <section class="case-decisions"><p class="eyebrow">QUÉ RESUELVE</p><h2>Un recorrido con sentido.</h2><div class="decisions-grid">${project.decisions.map(([title, text], i) => `<article><span class="font-mono">0${i + 1}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div></section>
    <div class="case-disclosure"><strong>Acerca de esta presentación</strong><p>El esquema ilustra el flujo del producto; no es una captura de una aplicación en producción. La descripción resume su alcance documentado, no implica autoría exclusiva. ${project.fork ? 'El repositorio es un fork; los créditos e historial pueden consultarse en GitHub. ' : ''}Las capturas reales y el detalle de contribuciones personales se incorporarán una vez verificados.</p></div>
    <a class="next-project" href="/proyectos/${next.id}"><span><small>SIGUIENTE PROYECTO</small><strong>${next.title}</strong></span>${arrow}</a></main>${footer()}`;
}
const route = window.location.pathname.replace(/\/$/, '') || '/';
const selected = projects.find((project) => route === `/proyectos/${project.id}`);
if (route === '/') app.innerHTML = home();
else if (selected) {
  app.innerHTML = caseStudy(selected);
  document.title = `${selected.title} — Román Vogel Corach`;
  document.querySelector('meta[name="description"]').content = selected.statement;
} else {
  app.innerHTML = `${header()}<main id="contenido" class="shell not-found"><p class="eyebrow">404 / POR ACÁ NO ERA</p><h1>Esta página no existe.</h1><a class="button button-primary" href="/">Volver al inicio</a></main>${footer()}`;
  document.title = 'Página no encontrada — Román Vogel Corach';
}
const themeMeta = document.createElement('meta');
themeMeta.name = 'theme-color'; themeMeta.content = tokens.canvas; document.head.append(themeMeta);

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(returnFocus = false) {
  menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menú'); navigation.classList.remove('is-open');
  if (returnFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const opened = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(opened)); menu.setAttribute('aria-label', opened ? 'Cerrar menú' : 'Abrir menú'); navigation.classList.toggle('is-open', opened);
});
navigation.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true); });
document.addEventListener('click', (event) => { if (!event.target.closest('.header-inner')) closeMenu(); });
const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  const context = gsap.context(() => {
    if (document.querySelector('.hero-copy')) {
      gsap.from('.hero-copy', { y: 18, opacity: 0, duration: 0.7, clearProps: 'all' });
      gsap.from('.hero-composition', { y: 24, opacity: 0, duration: 0.8, delay: 0.12, clearProps: 'all' });
    }
    document.querySelectorAll('[data-reveal]:not(.hero-copy):not(.hero-composition)').forEach((element) => {
      gsap.from(element, { scrollTrigger: { trigger: element, start: 'top 95%', once: true }, y: 20, opacity: 0, duration: 0.6, clearProps: 'all' });
    });
  });
  return () => context.revert();
});
const canvas = document.querySelector('#scene');
let disposeScene;
if (canvas) {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    import('./scene.js').then(({ initScene }) => { disposeScene = initScene(canvas); }).catch(() => canvas.closest('.scene-frame').setAttribute('data-scene-error', 'true'));
  }, { rootMargin: '200px' });
  observer.observe(canvas);
  window.addEventListener('pagehide', () => { observer.disconnect(); disposeScene?.(); }, { once: true });
}
if (window.location.hash) requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' }));
