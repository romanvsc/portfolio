import type { es } from './es';

export const en: typeof es = {
  meta: {
    title: 'Román Vogel Corach · ロマン · Systems & web',
    skip: 'Skip to content',
  },
  loader: { enter: 'Enter', hint: 'scroll · click · key' },
  nav: {
    menu: 'Menu', close: 'Close', lang: 'ES', socials: 'Elsewhere',
    langLabel: 'Cambiar a español',
    chapters: { mon: 'Gate', michi: 'Path', waza: 'Craft', sistemas: 'Systems', webs: 'Websites', mori: 'Forest', en: 'Bond' },
  },
  mon: {
    kicker: 'Portfolio · 2026',
    role: 'Custom systems & web',
    student: 'Systems Analyst student',
    age: '24 years old',
    where: 'Puerto Rico, Misiones · AR',
    scroll: 'Scroll to enter',
    seal: 'ロマン • ROMÁN • VOGEL • CORACH • ',
    portraitAlt: 'Halftone portrait of Román Vogel Corach; hover to reveal the photo',
  },
  michi: {
    label: 'About',
    title: 'First understand.\nThen build.',
    body: 'Before writing a line of code I learn the process, the data and the people who will use it: the operator out in the forest, the gym front desk, the institute treasury. Only then do I build.',
    romanTitle: 'ロマン · roman',
    roman: 'In Japanese, roman is the pursuit of an ideal: the spirit of adventure. My name was already a plan.',
    facts: [
      { k: 'Studies', v: 'Systems Analyst (in progress)' },
      { k: 'Focus', v: 'Management systems people use every day' },
      { k: 'Field', v: 'Forestry, education, fleets, sports' },
    ],
  },
  waza: {
    label: 'Craft',
    title: 'Tools of\nthe trade',
    groups: { front: 'Frontend', back: 'Backend', data: 'Data', infra: 'Infra' },
  },
  saku: {
    label: 'Work',
    systemsLead: 'Four systems people use to get their work done.',
    websLead: 'Four websites that represent their companies.',
    hint: 'Scroll · next cut',
    pager: 'Go to project',
    systems: 'Systems', webs: 'Websites',
    open: 'View case', live: 'Live site', repo: 'Code',
    role: 'My role', problem: 'The problem', features: 'What it does', stack: 'Stack', close: 'Close case', gallery: 'Screens',
    status: 'Status',
  },
  mori: {
    label: 'Forest',
    title: 'Built for\nthe real field',
    stats: [
      { n: 8, s: '', k: 'featured projects' },
      { n: 2, s: '', k: 'countries with clients: Argentina and Paraguay' },
      { n: 4, s: '', k: 'custom management systems' },
    ],
    note: 'No inflated metrics: everything here can be checked.',
  },
  en: {
    label: 'Bond',
    title: 'Shall we build\nsomething?',
    body: 'If you have a process that lives in spreadsheets, on paper or in someone’s head, let’s talk.',
    copy: 'Copy email', copied: 'Copied!',
    write: 'Write to me',
    footer: 'Designed and built by Román Vogel Corach',
    flat: 'Animation-free version',
  },
  flat: { note: 'Animation-free version.', back: 'See the full journey' },
};
