export const arrow = '<span aria-hidden="true">↗</span>';
export const external = 'target="_blank" rel="noopener noreferrer"';
export function header(showStoryMenu = false) {
  const menuToggle = showStoryMenu
    ? '<button class="story-menu-toggle meta" type="button" data-story-menu-open aria-haspopup="dialog" aria-controls="story-menu" aria-expanded="false" aria-label="Abrir navegación del portfolio"><span class="story-menu-glyph" aria-hidden="true"><i></i><i></i></span><span class="story-menu-toggle-label" aria-hidden="true">MENÚ</span></button>'
    : '';
  const themeToggle = '<button class="theme-toggle" type="button" data-theme-toggle aria-label="Modo oscuro" aria-pressed="false" title="Activar el modo oscuro"><svg class="theme-toggle-icon theme-toggle-icon--moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.3 15.2A8.4 8.4 0 0 1 8.8 3.7 8.5 8.5 0 1 0 20.3 15.2Z" /></svg><svg class="theme-toggle-icon theme-toggle-icon--sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.6" /><path d="M12 2v2.2m0 15.6V22M4.93 4.93l1.55 1.55m11.04 11.04 1.55 1.55M2 12h2.2m15.6 0H22M4.93 19.07l1.55-1.55M17.52 6.48l1.55-1.55" /></svg><span class="sr-only">Alternar tema claro u oscuro</span></button>';
  return `<a class="skip-link" href="#contenido">Saltar al contenido</a><header class="site-header"><div class="site-controls"><a class="wordmark" href="/#inicio" aria-label="Román Vogel, inicio">RV<span aria-hidden="true">.</span></a>${menuToggle}${themeToggle}</div></header>`;
}
export function footer() {
  return `<footer class="shell site-footer meta"><span>© ${new Date().getFullYear()} ROMÁN VOGEL CORACH</span><span>SYSTEMS × DESIGN × CODE</span><a href="#contenido">VOLVER ARRIBA ↑</a></footer><div class="cursor-note meta" aria-hidden="true">VIEW ↗</div>`;
}
export function dorito(pose, message, id) {
  return `<details class="dorito" id="dorito-${id}"><summary aria-label="Un comentario de Dorito: ${message}"><img src="/brand/dorito/${pose}.webp" width="440" height="380" alt="Dorito ${pose}, mascota del portfolio" loading="lazy" decoding="async"><span class="meta">DORITO ＋</span></summary><p>${message}</p></details>`;
}
export function doritoCompanion() {
  const message = 'Hola, soy Dorito, la mascota de Román. Estoy en su portfolio porque lo acompaño en sus tardes de programación.';
  return `<details class="dorito dorito-companion" id="dorito-companion"><summary aria-label="Mostrar el mensaje de Dorito" aria-controls="dorito-companion-message"><span class="dorito-companion-art" aria-hidden="true"><img src="/brand/dorito/dorito-acostado.svg" width="440" height="440" alt="" decoding="async"></span></summary><p class="dorito-companion-message" id="dorito-companion-message" role="status">${message}</p></details>`;
}
