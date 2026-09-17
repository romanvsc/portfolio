import { profile } from '../data.js';
export const arrow = '<span aria-hidden="true">↗</span>';
export const external = 'target="_blank" rel="noopener noreferrer"';
export function header() {
  const links = [['proyectos', 'Work'], ['sobre-mi', 'About'], ['tecnologias', 'Stack'], ['contacto', 'Contact']];
  return `<a class="skip-link" href="#contenido">Saltar al contenido</a><header class="site-header shell"><a class="wordmark" href="/" aria-label="Román Vogel, inicio">RV<span aria-hidden="true">.</span></a><span class="meta header-edition">PORTFOLIO / 2026</span><button class="menu-toggle meta" aria-haspopup="dialog" aria-controls="menu-dialog" aria-expanded="false">MENU <span aria-hidden="true">＋</span></button></header><dialog id="menu-dialog" aria-labelledby="menu-title"><div class="shell menu-inner"><div class="menu-top"><h2 class="meta" id="menu-title">EXPLORAR / RV</h2><button class="menu-close meta" autofocus>CERRAR ×</button></div><nav aria-label="Principal">${links.map(([id, label], i) => `<a href="/#${id}"><span class="meta">0${i + 1}</span>${label}${arrow}</a>`).join('')}</nav><div class="menu-social"><a href="${profile.github}" ${external}>GitHub ${arrow}</a><a href="${profile.linkedin}" ${external}>LinkedIn ${arrow}</a></div></div></dialog>`;
}
export function footer() {
  return `<footer class="shell site-footer meta"><span>© ${new Date().getFullYear()} ROMÁN VOGEL CORACH</span><span>SYSTEMS × DESIGN × CODE</span><a href="#contenido">VOLVER ARRIBA ↑</a></footer><div class="cursor-note meta" aria-hidden="true">VIEW ↗</div>`;
}
export function dorito(pose, message, id) {
  return `<details class="dorito" id="dorito-${id}"><summary aria-label="Un comentario de Dorito: ${message}"><img src="/brand/dorito/${pose}.webp" width="440" height="380" alt="Dorito ${pose}, mascota del portfolio" loading="lazy" decoding="async"><span class="meta">DORITO ＋</span></summary><p>${message}</p></details>`;
}
