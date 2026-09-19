function escapeAttribute(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function imageSource(image) {
  return encodeURI(image.src);
}

function thumbnail(image, index) {
  return `<button class="case-gallery-thumb${index === 0 ? ' is-active' : ''}" type="button" data-gallery-item data-gallery-index="${index}" data-gallery-src="${escapeAttribute(imageSource(image))}" data-gallery-alt="${escapeAttribute(image.alt)}" data-gallery-caption="${escapeAttribute(image.caption)}" data-gallery-label="${escapeAttribute(image.label)}" data-gallery-width="${image.width}" data-gallery-height="${image.height}" aria-pressed="${index === 0}"><img src="${imageSource(image)}" width="${image.width}" height="${image.height}" alt="" loading="lazy" decoding="async"><span class="meta">0${index + 1} / ${escapeAttribute(image.label)}</span></button>`;
}

export function caseGallery(project) {
  const images = project.media.gallery;
  if (!images.length) return '<p class="case-pending">CAPTURAS REALES PENDIENTES</p>';
  const first = images[0];
  const dialogTitle = `gallery-dialog-${project.id}`;
  return `<div class="case-gallery-intro"><p class="case-lead">Capturas reales del proyecto, seleccionadas para mostrar sus flujos principales.</p><p class="case-gallery-count meta" data-gallery-status aria-live="polite">01 / 0${images.length} · ${escapeAttribute(first.label)}</p></div><div class="case-gallery" data-case-gallery><div class="case-gallery-viewer"><figure class="case-gallery-figure${first.orientation === 'portrait' ? ' is-portrait' : ''}"><div class="case-gallery-screen"><img class="case-gallery-image" data-gallery-image src="${imageSource(first)}" width="${first.width}" height="${first.height}" alt="${escapeAttribute(first.alt)}" loading="lazy" decoding="async"><button class="case-gallery-open" type="button" data-gallery-open aria-label="Ampliar captura: ${escapeAttribute(first.label)}">AMPLIAR <span aria-hidden="true">↗</span></button></div><figcaption data-gallery-caption>${escapeAttribute(first.caption)}</figcaption></figure><div class="case-gallery-controls"><button type="button" class="case-gallery-step" data-gallery-prev aria-label="Mostrar captura anterior" disabled>← ANTERIOR</button><button type="button" class="case-gallery-step" data-gallery-next aria-label="Mostrar captura siguiente">SIGUIENTE →</button></div></div><div class="case-gallery-thumbnails" role="group" aria-label="Seleccionar captura del proyecto">${images.map(thumbnail).join('')}</div><dialog class="case-gallery-dialog" data-gallery-dialog aria-labelledby="${dialogTitle}"><div class="case-gallery-dialog-top"><span class="meta" id="${dialogTitle}">CAPTURA AMPLIADA / ${project.number}</span><button class="case-gallery-close" type="button" data-gallery-close aria-label="Cerrar captura ampliada">CERRAR ×</button></div><figure><img class="case-gallery-dialog-image" data-gallery-dialog-image src="${imageSource(first)}" width="${first.width}" height="${first.height}" alt="${escapeAttribute(first.alt)}" decoding="async"><figcaption data-gallery-dialog-caption>${escapeAttribute(first.caption)}</figcaption></figure></dialog></div>`;
}
