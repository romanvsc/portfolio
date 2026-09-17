import { arrow } from '../components/layout.js';
// Editorial diagrams deliberately do not impersonate application screenshots.
export function projectVisual(project) {
  const art = {
    registro: `<div class="timber-art" aria-hidden="true">${Array.from({length: 7}, (_, i) => `<span style="--i:${i}"></span>`).join('')}</div><div class="art-label">DEL CAMPO<br>AL REGISTRO.</div>`,
    ipac: `<div class="campus-art"><span>POSADAS</span><b aria-hidden="true">↔</b><span>ELDORADO</span></div><div class="art-label">DOS SEDES.<br>UN CONTEXTO.</div>`,
    gimnasio: `<div class="gym-art" aria-hidden="true"><span></span><span></span><span></span></div><div class="art-label">EN<br>MOVIMIENTO.</div>`,
    mantenimiento: `<div class="fleet-art" aria-hidden="true"><span></span><span></span><span></span><span></span></div><div class="art-label">SEGUIR.<br>PREVENIR.</div>`,
  };
  return `<figure class="project-visual visual-${project.id}"><div class="art-stage">${art[project.id]}</div><figcaption class="meta"><span>ILUSTRACIÓN CONCEPTUAL / NO ES UNA CAPTURA</span><span>${project.steps.join(' → ')}</span></figcaption></figure>`;
}
export function projectSection(project) {
  return `<article class="project-section theme-${project.id}" data-project="${project.id}" aria-labelledby="title-${project.id}"><div class="project-stage shell"><div class="project-meta meta"><span>${project.number} / ${project.domain}</span><span>SELECTED WORK</span></div><div class="project-heading"><h3 id="title-${project.id}">${project.displayTitle}</h3><p>${project.statement}</p></div><a class="project-art-link" data-cursor="EXPLORE ↗" href="/proyectos/${project.id}" aria-label="Explorar ${project.title}">${projectVisual(project)}</a><div class="project-bottom"><p class="meta">${project.stack.join(' / ')}</p><a class="text-link meta" href="/proyectos/${project.id}">EXPLORE PROJECT ${arrow}<span class="sr-only">: ${project.title}</span></a></div></div></article>`;
}
