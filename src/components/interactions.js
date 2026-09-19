export function initInteractions() {
  const controller = new AbortController();
  const { signal } = controller;
  document.querySelector('.header-nav')?.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || location.pathname !== '/') return;
    const destination = new URL(link.href);
    const target = document.getElementById(destination.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    history.pushState(null, '', destination.hash);
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, { signal });
  // One narrator at a time. Native details preserves keyboard and touch behavior.
  document.querySelectorAll('.dorito').forEach((item) => item.addEventListener('toggle', () => {
    if (item.open) document.querySelectorAll('.dorito').forEach((other) => { if (other !== item) other.open = false; });
  }, { signal }));
  return () => controller.abort();
}
