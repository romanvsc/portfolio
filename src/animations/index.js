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
        .from('#dorito-hero', { y: 16, rotation: -6, duration: .48, clearProps: 'transform' }, .58)
        .from('.scroll-link', { clipPath: 'inset(0 0 100% 0)', y: -8, duration: .4, clearProps: 'clipPath,transform' }, .62);
      if (conditions.desktop) {
        gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } })
          .to('.name-first', { xPercent: -8, ease: 'none' }, 0)
          .to('.name-last', { xPercent: 7, ease: 'none' }, 0)
          .to('.hero-portrait', { xPercent: -7, yPercent: 5, scale: 1.04, ease: 'none' }, 0)
          .to('.hero-portrait img', { scale: 1.1, yPercent: 6, ease: 'none' }, 0)
          .to('.portrait-index', { yPercent: -30, opacity: .25, ease: 'none' }, 0)
          .to('#dorito-hero', { yPercent: 45, autoAlpha: 0, ease: 'none' }, 0)
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
    document.querySelectorAll('.stack-card').forEach((card, index) => gsap.from(card, {
      clipPath: 'inset(0 0 100% 0)', y: 24, rotation: index % 2 ? 3 : -3, duration: .55, delay: index * .04, ease: 'power3.out', clearProps: 'clipPath,transform',
      immediateRender: false, scrollTrigger: { trigger: card, start: 'top 92%', once: true },
    }));
    document.querySelectorAll('.dorito summary').forEach((item) => {
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
