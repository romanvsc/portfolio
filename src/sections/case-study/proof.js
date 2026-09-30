function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export function caseProof(project) {
  const image = project.media.featuredCapture;
  if (!image) return '';

  const facts = [
    ['DOMINIO', project.domain],
    ['ROL DECLARADO', project.role],
    ['FOCO', project.focus],
  ];
  const titleId = `case-proof-title-${project.id}`;

  return `<section class="case-proof" data-case-proof aria-labelledby="${titleId}"><div class="case-proof-heading"><div><p class="meta">CAPTURA REAL / ${project.number}</p><h2 id="${titleId}">El producto en pantalla</h2></div><span class="meta">${escapeHtml(image.label)}</span></div><div class="case-proof-layout"><figure class="case-proof-figure${image.orientation === 'portrait' ? ' is-portrait' : ''}"><div class="case-proof-frame"><img class="case-proof-image" data-case-proof-image src="${encodeURI(image.src)}" data-capture-reveal width="${image.width}" height="${image.height}" alt="${escapeHtml(image.alt)}" loading="lazy" decoding="async"></div><figcaption>${escapeHtml(image.caption)}</figcaption></figure><aside class="case-proof-summary" aria-label="Datos documentados del proyecto"><p class="meta">FICHA DEL PROYECTO</p><dl>${facts.map(([label, value]) => `<div><dt class="meta">${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl></aside></div></section>`;
}
