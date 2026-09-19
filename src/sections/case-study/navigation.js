export const chapterTitles = ['Problema', 'Tecnologías utilizadas', 'Sobre el proyecto', 'Galería del proyecto', 'Características'];

export function caseNavigation() {
  return `<nav class="case-nav meta" aria-label="Secciones del proyecto"><div class="case-nav-label">CONTENIDO / 01—05</div><div class="case-nav-links">${chapterTitles.map((title, index) => `<a href="#capitulo-${index + 1}" data-case-nav="${index + 1}"${index === 0 ? ' aria-current="step"' : ''}>0${index + 1} ${title}</a>`).join('')}</div></nav>`;
}
