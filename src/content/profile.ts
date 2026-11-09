export const PROFILE = {
  name: 'Román Vogel Corach',
  first: 'Román',
  last: 'Vogel Corach',
  email: 'romancorach@gmail.com',
  github: 'https://github.com/romanvsc',
  linkedin: 'https://www.linkedin.com/in/roman-vogel-corach-2998bb31b/',
  whatsapp: 'https://wa.me/5493743481391',
};

/** Skills por uso real en los proyectos (CONTEXT.md). Agrupados para la guía de programación. */
export const SKILLS = {
  front: ['Vue 3', 'React', 'TypeScript', 'Tailwind', 'GSAP', 'PWA'],
  back: ['FastAPI', 'Django', 'PHP · CodeIgniter', 'Node'],
  data: ['MySQL', 'PostgreSQL', 'Supabase', 'IndexedDB'],
  infra: ['Docker', 'Nginx', 'Vercel', 'GitHub Actions'],
} as const;

export const STACK_BAND = [
  'Vue', 'React', 'TypeScript', 'Python', 'FastAPI', 'Django', 'PHP', 'CodeIgniter', 'MySQL',
  'PostgreSQL', 'Supabase', 'Docker', 'Nginx', 'Tailwind', 'GSAP', 'Eleventy', 'Next.js',
];

/** Arte de SEÑAL horneado por npm run images (imagenes-generadas/ → public/img/senal). */
export const ART = {
  panel: '/img/senal/panel.webp',
  dial: '/img/senal/dial.webp',
  knob: '/img/senal/knob.webp',
  peek: '/img/senal/peek.webp',
  peekSmall: '/img/senal/peek-700.webp',
  eyes: '/img/senal/eyes.webp',
  falling: '/img/senal/falling.webp',
  sticker: '/img/senal/sticker.webp',
  tape: '/img/senal/tape.webp',
};
