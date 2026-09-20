import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import tokens from '../tokens.json';
import { projects } from '../data.js';

gsap.registerPlugin(ScrollTrigger);

let activeStoryNavigation = null;

export function navigateToStoryAnchor(id, options = {}) {
  return activeStoryNavigation?.(id, options) ?? false;
}

function initChapterProgress() {
  const chapters = [...document.querySelectorAll('[data-scroll-chapter]')];
  const links = [...document.querySelectorAll('[data-progress-link]')];
  if (!chapters.length || !links.length || !('IntersectionObserver' in window)) return () => {};
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting);
    if (!visible.length) return;
    const reference = window.innerHeight * .38;
    const current = visible.sort((a, b) => Math.abs(a.boundingClientRect.top - reference) - Math.abs(b.boundingClientRect.top - reference))[0];
    links.forEach((link) => {
      if (link.dataset.progressLink === current.target.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-34% 0px -56% 0px', threshold: 0 });
  chapters.forEach((chapter) => observer.observe(chapter));
  return () => observer.disconnect();
}

function setAvailable(element, available) {
  if (!element) return;
  if (available) {
    element.removeAttribute('aria-hidden');
    element.inert = false;
  } else {
    element.setAttribute('aria-hidden', 'true');
    element.inert = true;
  }
}

function pointWithin(element, bounds) {
  const elementRect = element.getBoundingClientRect();
  const boundsRect = bounds.getBoundingClientRect();
  const centerX = elementRect.left + elementRect.width / 2;
  const centerY = elementRect.top + elementRect.height / 2;
  const x = Math.min(99, Math.max(1, ((centerX - boundsRect.left) / Math.max(boundsRect.width, 1)) * 100));
  const y = Math.min(99, Math.max(1, ((centerY - boundsRect.top) / Math.max(boundsRect.height, 1)) * 100));
  return { x, y };
}

function openingMask(element, bounds) {
  const { x, y } = pointWithin(element, bounds);
  const left = Math.min(96, Math.max(0, x - 2));
  const right = Math.min(96, Math.max(0, 100 - x - 2));
  const top = Math.min(92, Math.max(0, y - 4));
  const bottom = Math.min(92, Math.max(0, 100 - y - 4));
  return `inset(${top}% ${right}% ${bottom}% ${left}%)`;
}

function focusOrigin(element, bounds) {
  const { x, y } = pointWithin(element, bounds);
  return `${x}% ${y}%`;
}

function focusElementFor(state) {
  if (state.technology) return state.root.querySelector('.stack-orbit-mascot');
  const marker = state.panel?.querySelector('[data-story-focus]') || state.root.querySelector('[data-story-focus]');
  if (!marker) return state.root;
  return marker.querySelector('.art-stage') || marker;
}

function enterSharedStory(stage, signal) {
  const scenes = [...stage.querySelectorAll(':scope > [data-story-scene]')];
  const projectScene = stage.querySelector('#proyectos');
  const projectSlides = [...stage.querySelectorAll('[data-story-project]')];
  const stackScene = stage.querySelector('#tecnologias');
  const stackMascot = stackScene?.querySelector('.stack-orbit-mascot');
  const techItems = [...(stackScene?.querySelectorAll('[data-tech-item]') || [])];
  const progressLinks = [...document.querySelectorAll('[data-progress-link]')];
  const projectCounter = projectScene?.querySelector('[data-project-counter]');
  if (scenes.length !== 5 || projectSlides.length !== 4 || techItems.length !== 5 || !projectScene || !stackMascot) return () => {};

  const projectStates = projectSlides.map((panel, index) => ({
    label: `project-${panel.dataset.storyProject}`,
    chapter: 'proyectos',
    root: projectScene,
    panel,
    projectNumber: String(index + 1).padStart(2, '0'),
  }));
  const technologyStates = techItems.map((item, index) => ({
    label: `technology-${item.dataset.techItem}`,
    chapter: 'tecnologias',
    root: stackScene,
    technology: item,
    techIndex: index,
  }));
  const states = [
    { label: 'inicio', chapter: 'inicio', root: stage.querySelector('#inicio') },
    ...projectStates,
    ...technologyStates,
    { label: 'sobre-mi', chapter: 'sobre-mi', root: stage.querySelector('#sobre-mi') },
    { label: 'contacto', chapter: 'contacto', root: stage.querySelector('#contacto') },
  ];
  if (states.some((state) => !state.root)) return () => {};

  const chapterIndices = { inicio: 0, proyectos: 1, tecnologias: 5, 'sobre-mi': 10, contacto: 11, contenido: 0 };
  let pendingFocusTimer;
  let pendingFocusHandler;
  let storyTrigger;
  let storyTimeline;
  let stateTimes = [];
  const majorTransition = .75;
  const technologyTransition = .55;
  const storyDistance = 7 * majorTransition + 4 * technologyTransition;

  const updateState = (stateIndex) => {
    const state = states[Math.max(0, Math.min(states.length - 1, stateIndex))];
    scenes.forEach((scene) => setAvailable(scene, scene === state.root));
    projectSlides.forEach((panel) => setAvailable(panel, state.root === projectScene && panel === state.panel));
    techItems.forEach((item, index) => {
      const revealed = state.techIndex !== undefined && index <= state.techIndex;
      const active = state.techIndex === index;
      const compact = state.techIndex !== undefined && index < state.techIndex;
      item.classList.toggle('is-revealed', revealed);
      item.classList.toggle('is-active', active);
      item.classList.toggle('is-compact', compact);
      item.setAttribute('aria-hidden', String(!revealed));
      item.inert = !revealed;
      const description = item.querySelector('p');
      if (description) description.setAttribute('aria-hidden', String(compact));
    });
    progressLinks.forEach((link) => {
      if (link.dataset.progressLink === state.chapter) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (projectCounter && state.projectNumber) projectCounter.textContent = state.projectNumber;
    stage.dataset.storyCurrent = state.label;
  };

  stage.classList.add('story-stage--depth');

  scenes.forEach((scene) => gsap.set(scene, {
    autoAlpha: 0,
    scale: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transformOrigin: '50% 50%',
    zIndex: 0,
  }));
  gsap.set(states[0].root, { autoAlpha: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', zIndex: 1 });
  projectSlides.forEach((panel) => gsap.set(panel, {
    autoAlpha: 0,
    scale: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transformOrigin: '50% 50%',
    zIndex: 0,
  }));
  gsap.set(projectSlides[0], { autoAlpha: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', zIndex: 1 });
  gsap.set(techItems, { autoAlpha: 0, scale: .84, y: 18, transformOrigin: '50% 50%' });
  storyTimeline = gsap.timeline({ paused: true });

  const appendTransition = (fromState, toState, start, duration) => {
    const isTechnologyReveal = fromState.techIndex !== undefined && toState.techIndex === fromState.techIndex + 1;
    if (isTechnologyReveal) {
      const previousItem = fromState.technology;
      const nextItem = toState.technology;
      storyTimeline.to(previousItem, { scale: .88, opacity: .82, duration, ease: 'none' }, start);
      storyTimeline.to(nextItem, { autoAlpha: 1, scale: 1, y: 0, duration, ease: 'none' }, start);
      return;
    }
    const staysInProjects = fromState.root === projectScene && toState.root === projectScene;
    const fromLayer = staysInProjects ? fromState.panel : fromState.root;
    const toLayer = staysInProjects ? toState.panel : toState.root;
    const sourceFocus = focusElementFor(fromState);
    const boundsFor = (layer) => layer.matches('[data-story-project]') ? layer.parentElement : stage;
    const originFrom = () => focusOrigin(sourceFocus, boundsFor(fromLayer));
    const originTo = () => focusOrigin(sourceFocus, boundsFor(toLayer));
    const mask = () => openingMask(sourceFocus, boundsFor(toLayer));

    storyTimeline.set(fromLayer, { zIndex: 1 }, start);
    storyTimeline.set(toLayer, { zIndex: 2 }, start);
    storyTimeline.fromTo(fromLayer,
      { scale: 1, autoAlpha: 1, transformOrigin: originFrom, clipPath: 'inset(0% 0% 0% 0%)' },
      { scale: 1.3, duration: duration * .2, ease: 'none', transformOrigin: originFrom, immediateRender: false },
      start,
    );
    storyTimeline.to(fromLayer, { scale: 1.8, duration: duration * .25, ease: 'none', transformOrigin: originFrom }, start + duration * .2);
    storyTimeline.to(fromLayer, { scale: 2.8, autoAlpha: 0, duration: duration * .55, ease: 'none', transformOrigin: originFrom }, start + duration * .45);
    storyTimeline.fromTo(toLayer,
      { scale: .65, autoAlpha: 0, clipPath: mask, transformOrigin: originTo },
      { scale: 1, autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration, ease: 'none', immediateRender: false, transformOrigin: originTo },
      start,
    );
    if (toState.techIndex === 0) {
      storyTimeline.to(techItems[0], { autoAlpha: 1, scale: 1, y: 0, duration, ease: 'none' }, start);
    }
    if (fromState.label === 'inicio') {
      storyTimeline.to(fromState.root.querySelector('.name-first'), { xPercent: -8, duration, ease: 'none' }, start);
      storyTimeline.to(fromState.root.querySelector('.name-last'), { xPercent: 7, duration, ease: 'none' }, start);
    }
  };

  let timelinePosition = 0;
  states.forEach((state, index) => {
    stateTimes[index] = timelinePosition;
    storyTimeline.addLabel(`state-${state.label}`, timelinePosition);
    if (index < states.length - 1) {
      const isTechnologyReveal = state.techIndex !== undefined && states[index + 1].techIndex === state.techIndex + 1;
      const duration = isTechnologyReveal ? technologyTransition : majorTransition;
      appendTransition(state, states[index + 1], timelinePosition, duration);
      timelinePosition += duration;
    }
  });

  const stateAtProgress = (progress) => {
    const time = progress * storyTimeline.duration();
    let index = 0;
    for (let candidate = 1; candidate < stateTimes.length; candidate += 1) {
      const boundary = (stateTimes[candidate - 1] + stateTimes[candidate]) / 2;
      if (time < boundary) break;
      index = candidate;
    }
    return index;
  };

  storyTrigger = ScrollTrigger.create({
    trigger: stage,
    animation: storyTimeline,
    start: 'top top',
    end: () => `+=${window.innerHeight * storyDistance}`,
    pin: true,
    pinSpacing: true,
    scrub: .55,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => updateState(stateAtProgress(self.progress)),
    onRefresh: (self) => updateState(stateAtProgress(self.progress)),
    onLeave: () => updateState(states.length - 1),
    onLeaveBack: () => updateState(0),
  });

  const stateByAnchor = (id) => {
    const index = chapterIndices[id];
    if (index === undefined) return null;
    return states[index];
  };

  const navigate = (id, { behavior = 'smooth', focus = true, updateHash = true } = {}) => {
    const state = stateByAnchor(id);
    if (!state || !storyTrigger) return false;
    const targetScroll = storyTrigger.labelToScroll(`state-${state.label}`);
    if (!Number.isFinite(targetScroll)) return false;
    if (updateHash && location.hash !== `#${id}`) history.pushState(null, '', `${location.pathname}${location.search}#${id}`);

    const focusAfterScroll = () => {
      if (!focus) return;
      const focusTarget = id === 'contenido' ? document.getElementById('contenido') : state.root;
      focusTarget?.focus({ preventScroll: true });
    };
    window.clearTimeout(pendingFocusTimer);
    window.removeEventListener('scrollend', pendingFocusHandler);
    pendingFocusHandler = undefined;
    if (Math.abs(window.scrollY - targetScroll) < 2) focusAfterScroll();
    else if (focus) {
      const finishFocus = () => {
        window.clearTimeout(pendingFocusTimer);
        window.removeEventListener('scrollend', finishFocus);
        pendingFocusHandler = undefined;
        focusAfterScroll();
      };
      pendingFocusHandler = finishFocus;
      window.addEventListener('scrollend', finishFocus, { once: true, signal });
      pendingFocusTimer = window.setTimeout(finishFocus, Math.min(1800, Math.max(350, Math.abs(targetScroll - window.scrollY) / 2)));
    }
    window.scrollTo({ top: targetScroll, behavior: behavior === 'smooth' ? 'smooth' : 'auto' });
    return true;
  };

  activeStoryNavigation = navigate;
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || !link.closest('.site-header, .story-menu, .scroll-link, .skip-link, .site-footer')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    const id = decodeURIComponent(url.hash.slice(1));
    if (!stateByAnchor(id)) return;
    event.preventDefault();
    navigate(id);
  }, { signal });
  window.addEventListener('portfolio:story-menu-change', () => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, { signal });
  window.addEventListener('popstate', () => {
    const id = location.hash.slice(1);
    if (stateByAnchor(id)) navigate(id, { behavior: 'auto', focus: false, updateHash: false });
  }, { signal });

  updateState(0);
  ScrollTrigger.refresh();
  return () => {
    window.clearTimeout(pendingFocusTimer);
    window.removeEventListener('scrollend', pendingFocusHandler);
    if (activeStoryNavigation === navigate) activeStoryNavigation = null;
    scenes.forEach((scene) => setAvailable(scene, true));
    projectSlides.forEach((panel) => setAvailable(panel, true));
    techItems.forEach((item) => {
      item.classList.remove('is-revealed', 'is-active', 'is-compact');
      item.removeAttribute('aria-hidden');
      item.inert = false;
      item.querySelector('p')?.removeAttribute('aria-hidden');
    });
    progressLinks.forEach((link) => link.removeAttribute('aria-current'));
    stage.classList.remove('story-stage--depth');
    stage.removeAttribute('data-story-current');
    ScrollTrigger.refresh();
  };
}

function initHeroEntrance() {
  if (!document.querySelector('.hero')) return;
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
}

function initHomeFlowMotion(conditions, signal) {
  initHeroEntrance();
  document.querySelectorAll('.project-section').forEach((section) => {
    const project = projects.find((item) => item.id === section.dataset.project);
    const counter = document.querySelector('[data-project-counter]');
    gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 85%', end: 'bottom 15%', scrub: .5,
      onEnter: () => { if (counter) counter.textContent = project.number; },
      onEnterBack: () => { if (counter) counter.textContent = project.number; },
    } })
      .fromTo(section, { backgroundColor: tokens.canvas, '--active-accent': tokens.muted }, { backgroundColor: tokens[`${project.theme}-soft`], '--active-accent': tokens[project.theme], duration: .2, ease: 'none' })
      .to(section, { backgroundColor: tokens[`${project.theme}-soft`], duration: .6 })
      .to(section, { backgroundColor: tokens.canvas, '--active-accent': tokens.muted, duration: .2, ease: 'none' });
    ScrollTrigger.create({ trigger: section, start: 'top 82%', end: 'bottom 18%', toggleClass: { targets: '.work-count', className: 'is-tracking' } });
    if (conditions.fine) {
      const art = section.querySelector('.art-stage');
      if (art) gsap.fromTo(art, { clipPath: 'inset(0 3% 0 3%)', scale: .97 }, {
        clipPath: 'inset(0)', scale: 1, ease: 'none', immediateRender: false,
        scrollTrigger: { trigger: art, start: 'top 82%', end: 'top 42%', scrub: .45 },
      });
    }
  });
  document.querySelectorAll('.section h2').forEach((heading) => gsap.from(heading, {
    clipPath: 'inset(0 0 100% 0)', y: 16, duration: .7, ease: 'power3.out', clearProps: 'all',
    immediateRender: false, scrollTrigger: { trigger: heading, start: 'top 94%', once: true },
  }));

}

export function initMotion() {
  const media = gsap.matchMedia();
  media.add({
    motion: '(prefers-reduced-motion: no-preference)',
    story: '(min-width: 1280px) and (min-height: 800px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    fine: '(hover: hover) and (pointer: fine)',
  }, ({ conditions }) => {
    const cleanup = new AbortController();
    const { signal } = cleanup;
    const stage = document.querySelector('[data-story-stage]');
    const useStoryStage = Boolean(stage && conditions.story);
    const progressCleanup = useStoryStage ? () => {} : initChapterProgress();
    let storyCleanup = () => {};

    if (conditions.motion) {
      if (useStoryStage) {
        initHeroEntrance();
        storyCleanup = enterSharedStory(stage, signal);
      } else initHomeFlowMotion(conditions, signal);
    }

    const casePage = document.querySelector('.case-page');
    if (conditions.motion && casePage) {
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
    if (conditions.motion && conditions.fine) {
      const follower = document.querySelector('.cursor-note');
      if (follower) {
        const x = gsap.quickTo(follower, 'x', { duration: .18 });
        const y = gsap.quickTo(follower, 'y', { duration: .18 });
        document.querySelectorAll('[data-cursor]').forEach((target) => {
          target.addEventListener('pointermove', (event) => { follower.textContent = target.dataset.cursor; follower.style.display = 'block'; x(event.clientX + 16); y(event.clientY + 16); }, { signal });
          target.addEventListener('pointerleave', () => { follower.style.display = 'none'; }, { signal });
        });
        document.addEventListener('scroll', () => { follower.style.display = 'none'; }, { passive: true, signal });
        document.addEventListener('click', () => { follower.style.display = 'none'; }, { signal });
      }
    }
    return () => {
      cleanup.abort();
      progressCleanup();
      storyCleanup();
      document.querySelector('.cursor-note')?.style.removeProperty('display');
      document.querySelector('.work-count')?.classList.remove('is-tracking');
    };
  });
  let active = true;
  document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh(); });
  return () => { active = false; activeStoryNavigation = null; media.revert(); };
}
