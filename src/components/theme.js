import tokens from '../tokens.json';

const STORAGE_KEY = 'romanvsc-portfolio-color-mode';
const THEME_CHANGE_EVENT = 'portfolio:themechange';
const TRANSITION_CLEANUP_DELAY = 420;

export function initThemeToggle() {
  const root = document.documentElement;
  const buttons = [...document.querySelectorAll('[data-theme-toggle]')];
  if (!buttons.length) return () => {};

  const controller = new AbortController();
  const { signal } = controller;
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  let theme = root.dataset.theme === 'dark' ? 'dark' : 'light';
  let transitionTimer = null;

  const syncControls = () => {
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.title = theme === 'dark' ? 'Activar el modo claro' : 'Activar el modo oscuro';
    });
    if (themeColor) themeColor.content = theme === 'dark' ? tokens.dark.canvas : tokens.canvas;
  };

  const setTheme = (nextTheme, { animate = false, persist = false } = {}) => {
    if (nextTheme !== 'light' && nextTheme !== 'dark') return;
    if (transitionTimer !== null) {
      window.clearTimeout(transitionTimer);
      transitionTimer = null;
    }
    if (nextTheme === theme) {
      syncControls();
      return;
    }

    const shouldAnimate = animate && !motionPreference.matches;
    if (shouldAnimate) root.dataset.themeTransitioning = 'true';
    else root.removeAttribute('data-theme-transitioning');

    theme = nextTheme;
    root.dataset.theme = theme;
    if (persist) {
      try { window.localStorage.setItem(STORAGE_KEY, theme); }
      catch { /* The toggle still works for this page when storage is unavailable. */ }
    }
    syncControls();
    document.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme } }));

    if (shouldAnimate) {
      transitionTimer = window.setTimeout(() => {
        root.removeAttribute('data-theme-transitioning');
        transitionTimer = null;
      }, TRANSITION_CLEANUP_DELAY);
    }
  };

  syncControls();
  buttons.forEach((button) => button.addEventListener('click', () => {
    setTheme(theme === 'dark' ? 'light' : 'dark', { animate: true, persist: true });
  }, { signal }));
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) setTheme(event.newValue === 'dark' ? 'dark' : 'light', { animate: true });
  }, { signal });

  return () => {
    controller.abort();
    if (transitionTimer !== null) window.clearTimeout(transitionTimer);
    root.removeAttribute('data-theme-transitioning');
  };
}
