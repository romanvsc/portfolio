export function initInteractions() {
  const controller = new AbortController();
  const { signal } = controller;
  const dialog = document.querySelector('#menu-dialog');
  const opener = document.querySelector('.menu-toggle');
  opener.addEventListener('click', () => {
    dialog.showModal(); document.body.classList.add('menu-open'); opener.setAttribute('aria-expanded', 'true'); document.dispatchEvent(new CustomEvent('portfolio:menu-open'));
  }, { signal });
  dialog.querySelector('.menu-close').addEventListener('click', () => dialog.close(), { signal });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('menu-open'); opener.setAttribute('aria-expanded', 'false');
  }, { signal });
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const items = [...dialog.querySelectorAll('button, a[href]')];
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }, { signal });
  dialog.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    const destination = new URL(link.href);
    if (destination.pathname === location.pathname && destination.hash) {
      event.preventDefault();
      const target = document.getElementById(destination.hash.slice(1));
      dialog.close();
      if (target) requestAnimationFrame(() => {
        if (signal.aborted) return;
        history.pushState(null, '', destination.hash);
        target.tabIndex = -1; target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
    } else {
      dialog.close();
    }
  }, { signal });
  // One narrator at a time. Native details preserves keyboard and touch behavior.
  document.querySelectorAll('.dorito').forEach((item) => item.addEventListener('toggle', () => {
    if (item.open) document.querySelectorAll('.dorito').forEach((other) => { if (other !== item) other.open = false; });
  }, { signal }));
  return () => { controller.abort(); dialog.close(); document.body.classList.remove('menu-open'); };
}
