export const arrow = '<span aria-hidden="true">↗</span>';
export const external = 'target="_blank" rel="noopener noreferrer"';
export function header() {
  const links = [['inicio', 'Inicio'], ['proyectos', 'Proyectos'], ['tecnologias', 'Tecnologías'], ['sobre-mi', 'Sobre Mí'], ['contacto', 'Contacto']];
  return `<a class="skip-link" href="#contenido">Saltar al contenido</a><header class="site-header"><div class="shell site-header-inner"><a class="wordmark" href="/#inicio" aria-label="Román Vogel, inicio">RV<span aria-hidden="true">.</span></a><span class="meta header-edition">PORTFOLIO / 2026</span><nav class="header-nav" aria-label="Principal">${links.map(([id, label]) => `<a href="/#${id}"><img class="header-nav-icon" src="/brand/header-icons/${id}.svg" width="28" height="28" alt="" aria-hidden="true"><span>${label}</span></a>`).join('')}</nav></div></header>`;
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
