import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import tokens from '../tokens.json';
import { projects } from '../data.js';
gsap.registerPlugin(ScrollTrigger);

export function initMotion() {
  const media = gsap.matchMedia();
  media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 1100px) and (min-height: 720px)', fine: '(hover: hover) and (pointer: fine)' }, ({ conditions }) => {
    if (!conditions.motion) return;
    const cleanup = new AbortController();
    const { signal } = cleanup;
    if (document.querySelector('.hero')) {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-topline > span', { y: -10, opacity: 0, duration: .35, stagger: .07, clearProps: 'transform,opacity' }, 0)
        .from('.name-first', { clipPath: 'inset(100% 0 0 0)', y: 38, duration: .8, clearProps: 'clipPath,transform' }, .05)
        .from('.name-last', { clipPath: 'inset(0 100% 0 0)', x: 52, duration: .88, clearProps: 'clipPath,transform' }, .14)
        .from('.hero-portrait', { clipPath: 'inset(0 0 100% 0)', x: 22, duration: .95, clearProps: 'clipPath,transform' }, .12)
        .from('.portrait-index', { clipPath: 'inset(0 100% 0 0)', x: 12, duration: .45, clearProps: 'clipPath,transform' }, .42)
        .from('.hero-role', { clipPath: 'inset(0 100% 0 0)', x: -12, duration: .5, clearProps: 'clipPath,transform' }, .46)
        .from('.hero-claim', { clipPath: 'inset(0 0 100% 0)', y: 16, duration: .5, clearProps: 'clipPath,transform' }, .5)
        .from('#dorito-companion', { y: 16, rotation: -2, duration: .48, clearProps: 'transform' }, .58)
        .from('.scroll-link', { clipPath: 'inset(0 0 100% 0)', y: -8, duration: .4, clearProps: 'clipPath,transform' }, .62);
      if (conditions.desktop) {
        gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } })
          .to('.name-first', { xPercent: -8, ease: 'none' }, 0)
          .to('.name-last', { xPercent: 7, ease: 'none' }, 0)
          .to('.hero-portrait', { xPercent: -7, yPercent: 5, scale: 1.04, ease: 'none' }, 0)
          .to('.hero-portrait img', { scale: 1.1, yPercent: 6, ease: 'none' }, 0)
          .to('.portrait-index', { yPercent: -30, opacity: .25, ease: 'none' }, 0)
          .to('#dorito-companion', { yPercent: 45, autoAlpha: 0, ease: 'none' }, 0)
          .to('.hero-editorial', { clipPath: 'inset(0 0 20% 0)', ease: 'none' }, 0);
      }
    }
    document.querySelectorAll('.project-section').forEach((section) => {
      const project = projects.find((item) => item.id === section.dataset.project);
      const stage = section.querySelector('.project-stage');
      const counter = document.querySelector('[data-project-counter]');
      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
      gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 85%', end: 'bottom 15%', scrub: .5,
        onEnter: () => { if (counter) counter.textContent = project.number; },
        onEnterBack: () => { if (counter) counter.textContent = project.number; },
      } })
        .fromTo(section, { backgroundColor: tokens.canvas, '--active-accent': tokens.muted }, { backgroundColor: tokens[`${project.theme}-soft`], '--active-accent': tokens[project.theme], duration: .2, ease: 'none' })
        .to(section, { backgroundColor: tokens[`${project.theme}-soft`], duration: .6 })
        .to(section, { backgroundColor: tokens.canvas, '--active-accent': tokens.muted, duration: .2, ease: 'none' });
      if (conditions.desktop) {
        gsap.timeline({ scrollTrigger: { trigger: stage, start: `top ${headerHeight}px`, end: '+=220', pin: true, scrub: .6, invalidateOnRefresh: true } })
          .fromTo(section.querySelector('.art-stage'), { clipPath: 'inset(0 3% 0 3%)', scale: .97 }, { clipPath: 'inset(0 0% 0 0%)', scale: 1, ease: 'none' }, 0)
          .to(section.querySelector('h3'), { x: 20, ease: 'none' }, 0)
          .to(section.querySelector('.art-copy-plate'), { x: -12, ease: 'none' }, 0);
      }
    });
    if (conditions.desktop && document.querySelector('.work-count')) {
      ScrollTrigger.create({ trigger: '#proyectos', start: 'top top', end: 'bottom bottom', toggleClass: { targets: '.work-count', className: 'is-tracking' } });
    }
    document.querySelectorAll('.section h2').forEach((heading) => gsap.from(heading, {
      clipPath: 'inset(0 0 100% 0)', y: 16, duration: .7, ease: 'power3.out', clearProps: 'all',
      immediateRender: false, scrollTrigger: { trigger: heading, start: 'top 94%', once: true },
    }));
    const stackGestures = {
      php: { x: -120, clipPath: 'inset(0 100% 0 0)', duration: .72, ease: 'power3.out' },
      javascript: { y: -90, rotation: 5, clipPath: 'inset(0 0 100% 0)', duration: .62, ease: 'power3.out' },
      vue: { y: 22, clipPath: 'inset(100% 0 0 0)', duration: .78, ease: 'power3.out' },
      css: { x: 72, rotation: 8, clipPath: 'inset(0 0 0 100%)', duration: .66, ease: 'back.out(1.1)' },
      sql: { x: -100, clipPath: 'inset(0 100% 0 0)', duration: .7, ease: 'power3.out' },
    };
    document.querySelectorAll('.stack-piece').forEach((piece) => {
      const gesture = stackGestures[piece.dataset.stackItem];
      const surface = piece.querySelector('.stack-piece-surface');
      const media = piece.querySelector('.stack-piece-media');
      if (gesture && surface) gsap.from(surface, {
        ...gesture, clearProps: 'clipPath,transform', immediateRender: false,
        scrollTrigger: { trigger: piece, start: 'top 88%', once: true },
      });
      if (media) {
        const nudge = gsap.quickTo(media, 'x', { duration: .24, ease: 'power2.out' });
        piece.addEventListener('focusin', () => nudge(6), { signal });
        piece.addEventListener('focusout', () => nudge(0), { signal });
        if (conditions.fine) {
          piece.addEventListener('pointerenter', () => nudge(6), { signal });
          piece.addEventListener('pointerleave', () => nudge(0), { signal });
        }
      }
    });
    const casePage = document.querySelector('.case-page');
    if (casePage) {
      const caseProject = projects.find((project) => casePage.classList.contains(`theme-${project.id}`));
      const caseAccent = tokens[caseProject?.theme || 'production'];
      const chapters = [...casePage.querySelectorAll('[data-case-chapter]')];
      const navLinks = [...casePage.querySelectorAll('[data-case-nav]')];
      const caseGestures = {
        problem: { x: -32, clipPath: 'inset(0 100% 0 0)' },
        technologies: { y: 24, clipPath: 'inset(100% 0 0 0)' },
        about: { y: 24, clipPath: 'inset(0 0 100% 0)' },
        gallery: { x: 36, clipPath: 'inset(0 0 0 100%)' },
        features: { x: 28, clipPath: 'inset(0 100% 0 0)' },
      };
      const setActiveChapter = (number) => {
        navLinks.forEach((link) => {
          const active = link.dataset.caseNav === number;
          if (active) link.setAttribute('aria-current', 'step');
          else link.removeAttribute('aria-current');
        });
      };
      chapters.forEach((chapter) => {
        const kind = chapter.className.match(/case-chapter--([a-z]+)/)?.[1];
        const body = chapter.querySelector('[data-case-reveal]');
        const gesture = caseGestures[kind];
        if (body && gesture) gsap.from(body, {
          ...gesture, duration: .72, ease: 'power3.out', clearProps: 'clipPath,transform', immediateRender: false,
          scrollTrigger: { trigger: chapter, start: 'top 84%', once: true },
        });
        gsap.from(chapter.querySelector('.case-chapter-heading h2'), {
          clipPath: 'inset(0 0 100% 0)', y: 18, duration: .58, ease: 'power3.out', clearProps: 'clipPath,transform', immediateRender: false,
          scrollTrigger: { trigger: chapter, start: 'top 90%', once: true },
        });
        gsap.fromTo(chapter, { borderBottomColor: tokens.ink }, { borderBottomColor: caseAccent, duration: .45, ease: 'none', immediateRender: false, scrollTrigger: { trigger: chapter, start: 'top 72%', end: 'top 45%', scrub: .35 } });
        ScrollTrigger.create({
          trigger: chapter,
          start: 'top 80%',
          end: 'bottom 25%',
          onEnter: () => setActiveChapter(chapter.dataset.caseChapter),
          onEnterBack: () => setActiveChapter(chapter.dataset.caseChapter),
        });
      });
      casePage.querySelectorAll('[data-case-line]').forEach((line) => gsap.from(line, {
        scaleX: 0, transformOrigin: 'left center', duration: .45, ease: 'power2.out', clearProps: 'transform', immediateRender: false,
        scrollTrigger: { trigger: line.closest('.case-chapter'), start: 'top 72%', once: true },
      }));
      navLinks.forEach((link) => link.addEventListener('click', () => setActiveChapter(link.dataset.caseNav), { signal }));
    }
    document.querySelectorAll('.dorito:not(.dorito-companion) summary').forEach((item) => {
      const tilt = gsap.quickTo(item, 'rotation', { duration: .3 });
      item.addEventListener('pointerenter', () => tilt(-4), { signal });
      item.addEventListener('pointerleave', () => tilt(0), { signal });
    });
    if (conditions.fine) {
      const follower = document.querySelector('.cursor-note');
      const x = gsap.quickTo(follower, 'x', { duration: .18 });
      const y = gsap.quickTo(follower, 'y', { duration: .18 });
      document.querySelectorAll('[data-cursor]').forEach((target) => {
        target.addEventListener('pointermove', (event) => { follower.textContent = target.dataset.cursor; follower.style.display = 'block'; x(event.clientX + 16); y(event.clientY + 16); }, { signal });
        target.addEventListener('pointerleave', () => { follower.style.display = 'none'; }, { signal });
      });
      document.addEventListener('scroll', () => { follower.style.display = 'none'; }, { passive: true, signal });
      document.addEventListener('click', () => { follower.style.display = 'none'; }, { signal });
    }
    return () => { cleanup.abort(); document.querySelector('.cursor-note')?.style.removeProperty('display'); document.querySelector('.work-count')?.classList.remove('is-tracking'); };
  });
  let active = true;
  document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh(); });
  return () => { active = false; media.revert(); };
}
