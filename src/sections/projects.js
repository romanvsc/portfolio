import { arrow } from '../components/layout.js';
import { projectVisual } from '../components/project-media.js';
export { projectVisual } from '../components/project-media.js';
export function projectSection(project) {
  return `<article class="project-section theme-${project.id}" data-project="${project.id}" aria-labelledby="title-${project.id}"><div class="project-stage shell"><div class="project-meta meta"><span>${project.number} / ${project.domain}</span><span>SELECTED WORK</span></div><div class="project-heading"><h3 id="title-${project.id}">${project.displayTitle}</h3><p>${project.statement}</p></div><a class="project-art-link" data-cursor="EXPLORE ↗" href="/proyectos/${project.id}" aria-label="Explorar ${project.title}">${projectVisual(project)}</a><div class="project-bottom"><p class="meta">${project.stack.join(' / ')}</p><a class="text-link meta" href="/proyectos/${project.id}">EXPLORE PROJECT ${arrow}<span class="sr-only">: ${project.title}</span></a></div></div></article>`;
}
