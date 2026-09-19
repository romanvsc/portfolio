import { projects } from '../data.js';
import { arrow } from '../components/layout.js';
import { caseChapter } from './case-study/chapter.js';
import { caseHero } from './case-study/hero.js';
import { chapterTitles, caseNavigation } from './case-study/navigation.js';

export { chapterTitles };

function nextProjectLink(project) {
  return `<a class="next-project theme-${project.id}" href="/proyectos/${project.id}"><div><span class="meta">NEXT / ${project.number}</span><strong>${project.title}</strong><span class="next-project-domain meta">${project.domain}</span></div><img src="${encodeURI(project.media.icon)}" alt="" aria-hidden="true" class="next-project-icon"><span class="next-project-arrow" aria-hidden="true">${arrow}</span></a>`;
}

export function caseStudy(project) {
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return `<main id="contenido" tabindex="-1" class="case-page shell theme-${project.id}"><a class="text-link meta case-back" href="/#proyectos">← VOLVER A PROYECTOS</a>${caseHero(project)}${caseNavigation()}<div class="case-chapters">${chapterTitles.map((title, index) => caseChapter(project, title, index)).join('')}</div><p class="case-disclosure">Presentación basada en el alcance documentado del repositorio. ${project.fork ? 'Este repositorio es un fork; los créditos y el historial están disponibles en GitHub. ' : ''}La inclusión en este portfolio no implica autoría exclusiva ni certifica un despliegue en producción.</p>${nextProjectLink(next)}</main>`;
}
