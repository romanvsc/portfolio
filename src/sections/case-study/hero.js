import { arrow, external } from '../../components/layout.js';
import { projectVisual } from '../../components/project-media.js';

export function caseHero(project) {
  return `<header class="case-hero"><div class="case-hero-copy"><div><p class="meta case-eyebrow">${project.number} / ${project.eyebrow}</p><h1>${project.title}</h1></div><p class="case-hero-statement">${project.statement}</p></div><div class="case-hero-visuals"><div class="case-identity-visual">${projectVisual(project)}</div></div><div class="case-hero-bottom"><span class="meta">${project.domain}</span><a class="text-link meta" href="${project.repository}" ${external}>REVISAR REPOSITORIO ${arrow}</a><span class="case-scroll meta">SCROLL <span aria-hidden="true">↓</span></span></div></header>`;
}
