import gsap from 'gsap';
import { navigateToStoryAnchor } from '../animations/index.js';

const PROJECT_ORIGIN_KEY = 'portfolio-project-origin';
const PROJECT_TRANSITION_KEY = 'portfolio-project-transition';

function motionAllowed() {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function canAnimateFromTo(source, target) {
  if (!motionAllowed() || !source || !target || !source.isConnected || !target.isConnected) return null;
  const images = [source, target].filter((element) => element instanceof HTMLImageElement);
  if (images.some((image) => !image.complete || !image.naturalWidth || !image.naturalHeight)) return null;
  const sourceRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  if (sourceRect.width < 2 || sourceRect.height < 2 || targetRect.width < 2 || targetRect.height < 2) return null;
  const scale = Math.min(sourceRect.width / targetRect.width, sourceRect.height / targetRect.height);
  return {
    x: sourceRect.left + sourceRect.width / 2 - targetRect.left - targetRect.width / 2,
    y: sourceRect.top + sourceRect.height / 2 - targetRect.top - targetRect.height / 2,
    scale,
  };
}

export function initInteractions() {
  const controller = new AbortController();
  const { signal } = controller;
  const storyMenu = document.querySelector('[data-story-menu]');
  const storyMenuToggle = document.querySelector('[data-story-menu-open]');
  const storyMenuClose = document.querySelector('[data-story-menu-close]');
  const homePage = document.querySelector('.home-page');
  if (storyMenu && storyMenuToggle && storyMenuClose && homePage) {
    let returnFocus = null;
    let menuTimeline = null;
    let closing = false;
    const menuWash = storyMenu.querySelector('.story-menu-wash');
    const menuSurface = storyMenu.querySelector('.story-menu-inner');
    const menuLinks = [...storyMenu.querySelectorAll('.story-menu-links li a')];
    const menuBrand = storyMenu.querySelector('.story-menu-brand');
    const clearMenuStyles = () => gsap.set([menuWash, menuSurface, ...menuLinks, menuBrand].filter(Boolean), { clearProps: 'clipPath,transform,opacity' });
    const animateMenuOpen = () => {
      closing = false;
      menuTimeline?.kill();
      if (!motionAllowed()) { clearMenuStyles(); return; }
      gsap.set(menuWash, { clipPath: 'inset(0 100% 0 0)' });
      gsap.set(menuSurface, { clipPath: 'inset(0 0 0 100%)' });
      gsap.set([...menuLinks, menuBrand].filter(Boolean), { clipPath: 'inset(0 100% 0 0)' });
      menuTimeline = gsap.timeline({ onComplete: clearMenuStyles });
      menuTimeline.to(menuWash, { clipPath: 'inset(0)', duration: .4, ease: 'power2.inOut' }, 0)
        .to(menuSurface, { clipPath: 'inset(0)', duration: .45, ease: 'power2.out' }, .08)
        .to(menuLinks, { clipPath: 'inset(0)', duration: .26, stagger: .06, ease: 'power2.out' }, .15)
        .to(menuBrand, { clipPath: 'inset(0)', duration: .28, ease: 'power2.out' }, .18);
    };
    storyMenuToggle.addEventListener('click', () => {
      if (storyMenu.open) return;
      returnFocus = storyMenuToggle;
      storyMenu.showModal();
      storyMenuToggle.setAttribute('aria-expanded', 'true');
      homePage.setAttribute('data-story-menu-open', 'true');
      storyMenuClose.focus();
      animateMenuOpen();
    }, { signal });
    const closeStoryMenu = () => {
      if (!storyMenu.open || closing) return;
      closing = true;
      menuTimeline?.kill();
      if (!motionAllowed()) { storyMenu.close(); return; }
      menuTimeline = gsap.to(menuSurface, {
        clipPath: 'inset(0 100% 0 0)', duration: .25, ease: 'power2.in',
        onComplete: () => { if (storyMenu.open) storyMenu.close(); },
      });
    };
    storyMenuClose.addEventListener('click', closeStoryMenu, { signal });
    storyMenu.querySelectorAll('[data-story-nav-link]').forEach((link) => link.addEventListener('click', (event) => {
      const url = new URL(link.href, location.href);
      const id = decodeURIComponent(url.hash.slice(1));
      if (url.origin === location.origin && url.pathname === location.pathname && url.hash && navigateToStoryAnchor(id)) event.preventDefault();
      closeStoryMenu();
    }, { signal }));
    storyMenu.addEventListener('cancel', (event) => { event.preventDefault(); closeStoryMenu(); }, { signal });
    storyMenu.addEventListener('click', (event) => { if (event.target === storyMenu) closeStoryMenu(); }, { signal });
    storyMenu.addEventListener('close', () => {
      menuTimeline?.kill();
      menuTimeline = null;
      closing = false;
      clearMenuStyles();
      storyMenuToggle.setAttribute('aria-expanded', 'false');
      homePage.removeAttribute('data-story-menu-open');
      returnFocus?.focus({ preventScroll: true });
      returnFocus = null;
    }, { signal });
  }

  // One narrator at a time. Native details preserves keyboard and touch behavior.
  document.querySelectorAll('.dorito').forEach((item) => item.addEventListener('toggle', () => {
    if (item.open) document.querySelectorAll('.dorito').forEach((other) => { if (other !== item) other.open = false; });
  }, { signal }));

  document.querySelectorAll('[data-project-link]').forEach((link) => link.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
    const projectId = link.dataset.projectLink;
    const href = new URL(link.href, location.href);
    if (!projectId || href.origin !== location.origin || href.pathname !== `/proyectos/${projectId}`) return;
    try {
      sessionStorage.setItem(PROJECT_TRANSITION_KEY, projectId);
      if (homePage) sessionStorage.setItem(PROJECT_ORIGIN_KEY, projectId);
    } catch { /* Storage can be disabled; ordinary navigation remains available. */ }
    if (!motionAllowed()) return;
    const source = [...document.querySelectorAll('[data-project-transition]')]
      .find((element) => element.dataset.projectTransition === projectId);
    if (source) source.style.viewTransitionName = `project-art-${projectId}`;
  }, { signal }));

  const gallery = document.querySelector('[data-case-gallery]');
  if (gallery) {
    const items = [...gallery.querySelectorAll('[data-gallery-item]')];
    const image = gallery.querySelector('[data-gallery-image]');
    const caption = gallery.querySelector('[data-gallery-caption]');
    const status = gallery.parentElement?.querySelector('[data-gallery-status]');
    const previous = gallery.querySelector('[data-gallery-prev]');
    const next = gallery.querySelector('[data-gallery-next]');
    const openButton = gallery.querySelector('[data-gallery-open]');
    const dialog = gallery.querySelector('[data-gallery-dialog]');
    const dialogImage = gallery.querySelector('[data-gallery-dialog-image]');
    const dialogCaption = gallery.querySelector('[data-gallery-dialog-caption]');
    let currentIndex = 0;
    let returnFocus = null;
    let galleryTween = null;
    const reducedMotion = () => !motionAllowed();

    const selectImage = (index, moveFocus = false) => {
      if (index < 0 || index >= items.length) return;
      currentIndex = index;
      const item = items[index];
      const { gallerySrc, galleryAlt, galleryCaption, galleryLabel, galleryWidth, galleryHeight } = item.dataset;
      image.src = gallerySrc;
      image.alt = galleryAlt;
      image.width = Number(galleryWidth);
      image.height = Number(galleryHeight);
      caption.textContent = galleryCaption;
      openButton.setAttribute('aria-label', `Ampliar captura: ${galleryLabel}`);
      if (status) status.textContent = `0${index + 1} / 0${items.length} · ${galleryLabel}`;
      previous.disabled = index === 0;
      next.disabled = index === items.length - 1;
      gallery.querySelector('.case-gallery-figure').classList.toggle('is-portrait', galleryHeight > galleryWidth);

      items.forEach((button, itemIndex) => {
        const active = itemIndex === index;
        button.setAttribute('aria-pressed', String(active));
        button.classList.toggle('is-active', active);
      });

      if (dialog.open) {
        dialogImage.src = gallerySrc;
        dialogImage.alt = galleryAlt;
        dialogImage.width = Number(galleryWidth);
        dialogImage.height = Number(galleryHeight);
        dialogCaption.textContent = galleryCaption;
      }
      if (moveFocus) items[index].focus();
    };

    items.forEach((item, index) => item.addEventListener('click', () => selectImage(index), { signal }));
    previous.addEventListener('click', () => selectImage(currentIndex - 1), { signal });
    next.addEventListener('click', () => selectImage(currentIndex + 1), { signal });
    gallery.addEventListener('keydown', (event) => {
      if (dialog.open || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const destination = currentIndex + direction;
      if (destination < 0 || destination >= items.length) return;
      event.preventDefault();
      selectImage(destination, true);
    }, { signal });
    const resetDialogImage = () => gsap.set(dialogImage, { clearProps: 'transform' });
    const closeGallery = () => {
      if (!dialog.open) return;
      galleryTween?.kill();
      galleryTween = null;
      if (reducedMotion()) { dialog.close(); return; }
      resetDialogImage();
      const start = canAnimateFromTo(dialogImage, image);
      if (!start) { dialog.close(); return; }
      galleryTween = gsap.to(dialogImage, {
        x: start.x, y: start.y, scale: start.scale, transformOrigin: 'center center', duration: .32, ease: 'power2.inOut',
        onComplete: () => { resetDialogImage(); if (dialog.open) dialog.close(); },
      });
    };
    openButton.addEventListener('click', () => {
      returnFocus = openButton;
      const { gallerySrc, galleryAlt, galleryCaption, galleryWidth, galleryHeight } = items[currentIndex].dataset;
      dialogImage.src = gallerySrc;
      dialogImage.alt = galleryAlt;
      dialogImage.width = Number(galleryWidth);
      dialogImage.height = Number(galleryHeight);
      dialogCaption.textContent = galleryCaption;
      dialog.showModal();
      gallery.querySelector('[data-gallery-close]').focus();
      if (reducedMotion()) return;
      Promise.resolve(dialogImage.decode ? dialogImage.decode().catch(() => {}) : undefined).then(() => requestAnimationFrame(() => {
        if (!dialog.open || reducedMotion()) return;
        const start = canAnimateFromTo(image, dialogImage);
        if (!start) return;
        galleryTween?.kill();
        galleryTween = gsap.fromTo(dialogImage,
          { ...start, transformOrigin: 'center center' },
          { x: 0, y: 0, scale: 1, duration: .42, ease: 'power2.out', clearProps: 'transform', onComplete: () => { galleryTween = null; } },
        );
      }));
    }, { signal });
    gallery.querySelector('[data-gallery-close]').addEventListener('click', closeGallery, { signal });
    dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeGallery(); }, { signal });
    dialog.addEventListener('click', (event) => { if (event.target === dialog) closeGallery(); }, { signal });
    dialog.addEventListener('close', () => {
      galleryTween?.kill();
      galleryTween = null;
      resetDialogImage();
      returnFocus?.focus({ preventScroll: true });
      returnFocus = null;
    }, { signal });
  }
  return () => controller.abort();
}
