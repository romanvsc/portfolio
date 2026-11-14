// Textos propios del CV (scripts/cv.mjs → public/cv/*.pdf). Perfil, proyectos y stack salen de profile.ts / projects.ts.
// Datos laborales y de formación confirmados por Román el 2026-11-08 (CONTEXT.md).
import type { ProjectId } from './projects';

export const CV_PROJECTS: ProjectId[] = ['ipac', 'produccion', 'gimnasio', 'forestal'];

export const CV = {
  es: {
    kicker: 'curriculum vitae',
    role: 'Analista de Sistemas en formación · Sistemas a medida y web',
    labels: { profile: 'Perfil', education: 'Formación', projects: 'Proyectos', contact: 'Contacto', experience: 'Experiencia', stack: 'Stack' },
    profile: 'Estudiante de Analista de Sistemas. Hago sistemas de gestión a medida y sitios web para empresas de Argentina y Paraguay. Antes de escribir código entiendo cómo trabaja la gente que va a usar el sistema y qué datos maneja.',
    place: 'Puerto Rico, Misiones, Argentina · 24 años',
    experience: [
      { role: 'Auxiliar técnico', org: 'Cooperativa Luz y Fuerza de Libertador General San Martín Ltda.', years: '2025 – actualidad' },
      { role: 'Auxiliar administrativo', org: 'Forestal Garuhapé', years: '2023 – 2025', task: 'Gestión de mantenimiento y control de combustible.' },
    ],
    education: { title: 'Analista de Sistemas (en curso)', org: 'Instituto iAes Fundación Lapacho · Puerto Rico, Misiones', years: '2023 – en curso' },
  },
  en: {
    kicker: 'curriculum vitae',
    role: 'Systems Analyst student · Custom systems & web',
    labels: { profile: 'Profile', education: 'Education', projects: 'Projects', contact: 'Contact', experience: 'Experience', stack: 'Stack' },
    profile: 'Systems Analyst student. I build custom management systems and websites for companies in Argentina and Paraguay. Before writing code I learn how the people who will use the system work and what data they handle.',
    place: 'Puerto Rico, Misiones, Argentina · 24 years old',
    experience: [
      { role: 'Technical assistant', org: 'Cooperativa Luz y Fuerza de Libertador General San Martín Ltda. (electric cooperative)', years: '2025 – present' },
      { role: 'Administrative assistant', org: 'Forestal Garuhapé', years: '2023 – 2025', task: 'Maintenance management and fuel control.' },
    ],
    education: { title: 'Systems Analyst (in progress)', org: 'Instituto iAes Fundación Lapacho · Puerto Rico, Misiones', years: '2023 – present' },
  },
};
