import { projects } from '../data.js';
import { arrow, external } from '../components/layout.js';
import { projectVisual } from './projects.js';

export const chapterTitles = ['Contexto', 'Problema', 'Solución', 'Arquitectura', 'Funcionalidades', 'Decisiones', 'Tecnologías', 'Capturas reales', 'Aprendizajes'];
export function caseStudy(project) {
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const content = [
    `<p>${project.description}</p>`,
    `<p>${project.challenge}</p>`,
    `<p>${project.caseTitle} ${project.statement}</p><p>El recorrido documentado conecta ${project.steps.join(', ').toLowerCase()}.</p>`,
    `<p>${project.architecture}</p>`,
    `<ul>${project.decisions.map(([title, text]) => `<li><strong>${title}.</strong> ${text}</li>`).join('')}</ul>`,
    `<p>El alcance documentado pone el foco en ${project.focus.toLowerCase()}.</p><p>Las decisiones individuales de implementación, sus alternativas y mi participación concreta están pendientes de documentar. El repositorio permite revisar el código y su historial sin atribuir autoría exclusiva.</p>`,
    `<p>${project.stack.join(' / ')}</p><a class="text-link meta" href="${project.repository}" ${external}>REVISAR EL REPOSITORIO ${arrow}</a>`,
    `<div class="screenshot-placeholder"><strong>CAPTURAS REALES / PENDIENTES</strong><p>Esta sección se completará con imágenes verificadas y sin datos personales. La pieza de apertura es una ilustración conceptual, no una captura de la aplicación.</p></div>`,
    `<p>Queda pendiente registrar los aprendizajes personales y vincularlos con cambios concretos del proyecto. No se presentan aquí resultados, métricas ni conclusiones que todavía no estén verificados.</p>`,
  ];
  return `<main id="contenido" tabindex="-1" class="case-page shell theme-${project.id}"><a class="text-link meta" href="/#proyectos">← VOLVER A PROYECTOS</a><div class="case-heading"><p class="meta">${project.number} / ${project.domain.toUpperCase()}</p><h1>${project.title}</h1><p>${project.statement}</p></div>${projectVisual(project)}<nav class="case-nav meta" aria-label="Capítulos del proyecto">${chapterTitles.map((title, i) => `<a href="#capitulo-${i + 1}">0${i + 1} ${title}</a>`).join('')}</nav>${chapterTitles.map((title, i) => `<section id="capitulo-${i + 1}" class="case-chapter" aria-labelledby="chapter-title-${i}"><h2 id="chapter-title-${i}"><span class="meta">0${i + 1}</span>${title}</h2><div>${content[i]}</div></section>`).join('')}<p class="case-disclosure">Presentación basada en el alcance documentado del repositorio. ${project.fork ? 'Este repositorio es un fork; los créditos y el historial están disponibles en GitHub. ' : ''}La inclusión en este portfolio no implica autoría exclusiva ni certifica un despliegue en producción.</p><a class="next-project" href="/proyectos/${next.id}"><span><span class="meta">SIGUIENTE PROYECTO / ${next.number}</span><strong>${next.title}</strong></span>${arrow}</a></main>`;
}
