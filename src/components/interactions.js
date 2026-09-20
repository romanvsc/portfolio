export function initInteractions() {
  const controller = new AbortController();
  const { signal } = controller;
  const storyMenu = document.querySelector('[data-story-menu]');
  const storyMenuToggle = document.querySelector('[data-story-menu-open]');
  const storyMenuClose = document.querySelector('[data-story-menu-close]');
  const homePage = document.querySelector('.home-page');
  if (storyMenu && storyMenuToggle && storyMenuClose && homePage) {
    let returnFocus = null;
    const announceMenuChange = (open) => window.dispatchEvent(new CustomEvent('portfolio:story-menu-change', { detail: { open } }));
    storyMenuToggle.addEventListener('click', () => {
      if (storyMenu.open) return;
      returnFocus = storyMenuToggle;
      storyMenu.showModal();
      storyMenuToggle.setAttribute('aria-expanded', 'true');
      homePage.setAttribute('data-story-menu-open', 'true');
      storyMenuClose.focus();
      announceMenuChange(true);
    }, { signal });
    const closeStoryMenu = () => {
      if (storyMenu.open) storyMenu.close();
    };
    storyMenuClose.addEventListener('click', closeStoryMenu, { signal });
    storyMenu.querySelectorAll('[data-story-nav-link]').forEach((link) => link.addEventListener('click', closeStoryMenu, { signal }));
    storyMenu.addEventListener('click', (event) => { if (event.target === storyMenu) closeStoryMenu(); }, { signal });
    storyMenu.addEventListener('close', () => {
      storyMenuToggle.setAttribute('aria-expanded', 'false');
      homePage.removeAttribute('data-story-menu-open');
      announceMenuChange(false);
      returnFocus?.focus({ preventScroll: true });
      returnFocus = null;
    }, { signal });
  }

  // One narrator at a time. Native details preserves keyboard and touch behavior.
  document.querySelectorAll('.dorito').forEach((item) => item.addEventListener('toggle', () => {
    if (item.open) document.querySelectorAll('.dorito').forEach((other) => { if (other !== item) other.open = false; });
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
    }, { signal });
    gallery.querySelector('[data-gallery-close]').addEventListener('click', () => dialog.close(), { signal });
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }, { signal });
    dialog.addEventListener('close', () => {
      returnFocus?.focus({ preventScroll: true });
      returnFocus = null;
    }, { signal });
  }
  return () => controller.abort();
}
