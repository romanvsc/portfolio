function sourceUrl(source) {
  return encodeURI(source);
}

export function imageMarkup(image, loading = 'lazy', className = '') {
  const alt = image.alt ?? image.caption ?? image.label ?? '';
  return `<img class="${className}" src="${sourceUrl(image.src)}" width="${image.width}" height="${image.height}" alt="${alt}" loading="${loading}" decoding="async">`;
}

export function projectVisual(project) {
  const media = project.media;
  const visualLabels = {
    registro: 'DEL CAMPO<br>AL REGISTRO.',
    ipac: 'DOS SEDES.<br>UN CONTEXTO.',
    gimnasio: 'EN<br>MOVIMIENTO.',
    mantenimiento: 'SEGUIR.<br>PREVENIR.',
  };
  return `<figure class="project-visual visual-${project.id}"><div class="art-stage"><div class="project-icon-background" aria-hidden="true">${imageMarkup({ src: media.icon, width: 640, height: 640, alt: '' }, 'lazy', 'project-icon')}</div><div class="project-art-overlay" aria-hidden="true"></div><div class="art-copy"><div class="art-copy-plate"><span class="project-identity-label meta">IDENTIDAD / ${project.number}</span><div class="art-label"><span class="meta">${project.domain.toUpperCase()}</span>${visualLabels[project.id]}</div><span class="project-icon-label meta">ICONO DEL PROYECTO</span></div></div></div><figcaption><span>IDENTIDAD VISUAL / NO ES UNA CAPTURA</span><span>${project.steps.join(' → ')}</span></figcaption></figure>`;
}

function screenshotFigure(image, index, loading = 'lazy', className = '') {
  return `<figure class="screenshot-card${image.orientation === 'portrait' ? ' is-portrait' : ''}${className ? ` ${className}` : ''}"><div class="screenshot-card-frame"><div class="screenshot-card-heading"><span class="meta">0${index + 1} / CAPTURA REAL</span><span class="meta">${image.label}</span></div>${imageMarkup(image, loading, 'screenshot-card-image')}</div><figcaption>${image.caption}</figcaption></figure>`;
}

export function featuredScreenshot(project) {
  const image = project.media.gallery[0];
  if (!image) return '<p class="case-pending">CAPTURA REAL PENDIENTE</p>';
  return screenshotFigure(image, 0, 'eager', 'case-featured-capture');
}

export function screenshotGallery(project, { startIndex = 0 } = {}) {
  const gallery = project.media.gallery.slice(startIndex);
  if (!gallery.length) return '<p class="case-pending">CAPTURA REAL PENDIENTE</p>';
  return `<div class="screenshot-gallery" aria-label="Capturas reales seleccionadas de ${project.title}">${gallery.map((image, index) => screenshotFigure(image, startIndex + index)).join('')}</div>`;
}
