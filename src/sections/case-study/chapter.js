import { caseGallery } from './gallery.js';
import { caseStudyContent } from './content.js';

const chapterKinds = ['problem', 'technologies', 'about', 'gallery', 'features'];

function architectureMarkup(content) {
  return `<div class="case-architecture" aria-label="Arquitectura documentada del proyecto"><div class="case-architecture-flow">${content.layers.map((layer, index) => `${index ? '<span class="case-architecture-arrow" data-case-line aria-hidden="true">→</span>' : ''}<article class="case-architecture-node" data-case-node><span class="meta">${layer.label}</span><strong>${layer.value}</strong><p>${layer.note}</p></article>`).join('')}</div>${content.support?.length ? `<aside class="case-architecture-support"><span class="meta">CAPAS DE SOPORTE</span>${content.support.map(([label, value, note]) => `<article class="case-support-node"><span class="meta">${label}</span><strong>${value}</strong><p>${note}</p></article>`).join('')}</aside>` : ''}<p class="case-caption">${content.architecture}</p></div>`;
}

function renderProblem(content) {
  const items = [['01 / CIRCUITO', content.process], ['02 / FRICCIÓN', content.friction], ['03 / NECESIDAD', content.need]];
  const flow = items.map(([label, text], index) => `${index ? '<span class="case-flow-arrow" aria-hidden="true">↓</span>' : ''}<article class="case-flow-block"><span class="meta">${label}</span><strong>${text}</strong></article>`).join('');
  const steps = content.steps.map((step, index) => `<li><span class="meta">0${index + 1}</span><strong>${step}</strong></li>`).join('');
  return `<div class="case-problem"><div class="case-flow">${flow}</div><div class="case-problem-route"><span class="meta">RECORRIDO DEL PROYECTO</span><ol>${steps}</ol></div></div>`;
}

function renderTechnologies(content) {
  return `<div class="case-technologies">${content.map((technology, index) => `<article class="case-technology${technology.icon ? ' has-icon' : ''}">${technology.icon ? `<img class="case-technology-icon" src="/brand/technology-icons/${technology.icon}.svg" width="64" height="64" alt="" aria-hidden="true" loading="lazy" decoding="async">` : ''}<span class="case-tech-number meta">0${index + 1} / STACK</span><h3>${technology.name}</h3><p>${technology.role}</p></article>`).join('')}</div>`;
}

function renderAbout(content) {
  const facts = content.facts.map(([label, value]) => `<div class="case-fact"><span class="meta">${label}</span><strong>${value}</strong></div>`).join('');
  const principles = content.principles.map(({ title, description }, index) => `<article class="case-principle"><span class="meta">0${index + 1} / EJE</span><h3>${title}</h3><p>${description}</p></article>`).join('');
  return `<div class="case-about"><div class="case-about-intro"><p class="case-lead">${content.description}</p><div class="case-facts">${facts}</div></div><div class="case-about-architecture"><div class="case-subheading"><span class="meta">SISTEMA / ARQUITECTURA</span><p>${content.architecture}</p></div>${architectureMarkup(content)}<div class="case-principles"><h3 class="meta">EJES DOCUMENTADOS</h3>${principles}</div></div></div>`;
}

function renderFeatures(content) {
  return `<div class="case-features">${content.map((feature, index) => {
    const status = feature.status === 'in-progress'
      ? '<span class="case-feature-status is-in-progress meta">EN DESARROLLO</span>'
      : feature.status === 'verified'
        ? '<span class="case-feature-status meta">LISTO</span>'
        : '';
    return `<article class="case-feature"><div class="case-feature-top"><span class="meta">0${index + 1} / FUNCIÓN</span>${status}</div><h3>${feature.title}</h3><p>${feature.description}</p></article>`;
  }).join('')}</div>`;
}

function chapterBody(project, kind) {
  const content = caseStudyContent(project);
  const renderers = {
    problem: () => renderProblem(content.problem),
    technologies: () => renderTechnologies(content.technologies),
    about: () => renderAbout(content.about),
    gallery: () => caseGallery(project),
    features: () => renderFeatures(content.features),
  };
  return renderers[kind]();
}

export function caseChapter(project, title, index) {
  const kind = chapterKinds[index];
  const headingId = `chapter-title-${project.id}-${index + 1}`;
  return `<section id="capitulo-${index + 1}" class="case-chapter case-chapter--${kind}" data-case-chapter="${index + 1}" aria-labelledby="${headingId}"><div class="case-chapter-heading"><h2 id="${headingId}"><span class="meta">0${index + 1}</span> ${title}</h2><span class="case-chapter-mark meta">${project.number} / ${project.domain.toUpperCase()}</span></div><div class="case-chapter-body" data-case-reveal>${chapterBody(project, kind)}</div></section>`;
}
