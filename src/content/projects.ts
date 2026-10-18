// Fuente: CONTEXT.md. No agregar nada que no esté verificado ahí.
import type { T } from '@/i18n/LangContext';
export type ProjectId = 'ipac' | 'produccion' | 'mantenimiento' | 'gimnasio' | 'forestal' | 'fgpy' | 'anasociados' | 'vogel';

export interface Project {
  id: ProjectId;
  numeral: string;
  path: 'system' | 'web';
  name: string;
  client: T;
  /** qué hizo Román en el proyecto (CONTEXT.md) */
  role: T;
  summary: T;
  problem: T;
  features: T[];
  stack: string[];
  url?: string;
  repo: string;
  status?: T;
  images: string[];
}

const img = (slug: string, n: number) => Array.from({ length: n }, (_, i) => `/img/projects/${slug}/${i + 1}.webp`);

export const PROJECTS: Project[] = [
  {
    id: 'ipac', numeral: '壱', path: 'system', name: 'IPAC',
    client: { es: 'Instituto educativo · Posadas y Eldorado', en: 'Educational institute · Posadas & Eldorado' },
    role: { es: 'Todo el frontend', en: 'Entire frontend' },
    summary: { es: 'Administración, tesorería y cobranzas para un instituto con dos sedes.', en: 'Administration, treasury and fee collection for a two-campus institute.' },
    problem: { es: 'Cada sede administraba por su cuenta, con herramientas locales. Hacía falta una sola plataforma web, con permisos por sede.', en: 'Each campus ran its own local admin tools. They needed one central web platform with per-campus permissions.' },
    features: [
      { es: 'Roles: cada usuario ve sólo su sede', en: 'Roles: each user only sees their campus' },
      { es: 'Cuotas con descuentos, recargos y pagos parciales', en: 'Fees with discounts, surcharges and partial payments' },
      { es: 'Cuenta corriente del alumno y caja diaria por usuario', en: 'Student account statements and a daily cash register per user' },
      { es: 'Importación CSV/XLSX sin duplicados', en: 'Duplicate-safe CSV/XLSX import' },
    ],
    stack: ['Django', 'DRF', 'PostgreSQL', 'Vue 3', 'Tailwind', 'Docker', 'Nginx'],
    url: 'https://ipac.vogelconsultoria.com.ar', repo: 'https://github.com/romanvsc/IPAC',
    images: img('ipac', 3),
  },
  {
    id: 'produccion', numeral: '弐', path: 'system', name: 'Registro de Producción',
    client: { es: 'Operaciones forestales · Indufor y FG', en: 'Forestry operations · Indufor & FG' },
    role: { es: 'Todo el frontend y consolidación del backend', en: 'Entire frontend and backend consolidation' },
    summary: { es: 'Registro de producción forestal desde el monte, aunque no haya señal.', en: 'Forestry production logging from the field, even without signal.' },
    problem: { es: 'Los operadores trabajan en el monte, sin conexión. Los datos de producción, combustible y caminos tenían que llegar igual a los dashboards de administración.', en: 'Operators work deep in the forest with no connection. Production, fuel and road data still had to reach the admin dashboards.' },
    features: [
      { es: 'Offline real: IndexedDB y sincronización al volver la señal', en: 'Truly offline: IndexedDB with sync when signal returns' },
      { es: 'Carga por rol (operador, encargado, admin) con cola de pendientes', en: 'Role-based entry (operator, supervisor, admin) with a pending queue' },
      { es: 'Producción, combustible, caminos y tiempos no operativos', en: 'Production, fuel, roads and non-operational time' },
      { es: 'Backend con arquitectura hexagonal', en: 'Hexagonal-architecture backend' },
    ],
    stack: ['FastAPI', 'SQLAlchemy', 'MySQL', 'Vue 3', 'Pinia', 'PWA', 'Dexie', 'Docker'],
    url: 'https://produccion.indufor.com.ar', repo: 'https://github.com/romanvsc/registro_produccion',
    images: img('produccion', 3),
  },
  {
    id: 'mantenimiento', numeral: '参', path: 'system', name: 'Mantenimiento',
    client: { es: 'Flota mixta · multiempresa', en: 'Mixed fleet · multi-company' },
    role: { es: 'Todo el frontend y consolidación del backend', en: 'Entire frontend and backend consolidation' },
    summary: { es: 'Mantenimiento preventivo y correctivo de camiones, tractores y maquinaria.', en: 'Preventive and corrective maintenance for trucks, tractors and machinery.' },
    problem: { es: 'Los vencimientos de servicio se perdían y las solicitudes se mezclaban con las órdenes de trabajo. Faltaba un historial confiable por equipo.', en: 'Service due dates were missed and requests got mixed up with work orders. There was no reliable history per unit.' },
    features: [
      { es: 'Motor preventivo: planes, alertas y órdenes de trabajo', en: 'Preventive engine: plans, alerts and work orders' },
      { es: 'QR imprimible por unidad', en: 'Printable QR code per unit' },
      { es: 'Bandeja "Mi trabajo" para técnicos y notificaciones push', en: '"My work" inbox for technicians and push notifications' },
      { es: 'Historial auditado de odómetro y horómetro', en: 'Audited odometer and engine-hour history' },
    ],
    stack: ['PHP 8.2', 'CodeIgniter 4', 'MySQL', 'Bootstrap 5', 'Web Push', 'PWA'],
    url: 'https://vogelconsultoria.com.ar/mantenimiento/', repo: 'https://github.com/romanvsc/mantenimiento',
    status: { es: 'En desarrollo: etapas 2 a 4', en: 'In development: stages 2 to 4' },
    images: img('mantenimiento', 3),
  },
  {
    id: 'gimnasio', numeral: '肆', path: 'system', name: 'Gestión Gimnasio',
    client: { es: 'Club Yacyretá · Ituzaingó, Corrientes', en: 'Club Yacyretá · Ituzaingó, Corrientes' },
    role: { es: 'Proyecto propio, de punta a punta', en: 'My own project, end to end' },
    summary: { es: 'Cobro de cuotas y control de acceso en recepción, en modo kiosco.', en: 'Fee collection and front-desk access control, in kiosk mode.' },
    problem: { es: 'En recepción había que saber al instante si un socio podía pasar, y llevar la caja sin errores.', en: 'The front desk needed to know instantly whether a member could come in, and keep the cash register right.' },
    features: [
      { es: 'Check-in con permitido o denegado según la cuota', en: 'Check-in showing allowed or denied based on the fee' },
      { es: 'Historial de pagos que no se puede editar', en: 'Payment history that cannot be edited' },
      { es: 'Caja diaria y banco de horas del personal', en: 'Daily cash register and staff hours bank' },
      { es: 'Reportes en Excel y PDF', en: 'Excel and PDF reports' },
    ],
    stack: ['Vue 3', 'Pinia', 'Supabase', 'Postgres RLS', 'Chart.js', 'Vercel'],
    url: 'https://gestion-gimnasio.vercel.app', repo: 'https://github.com/romanvsc/gestion_gimnasio',
    images: img('gimnasio', 3),
  },
  {
    id: 'forestal', numeral: '伍', path: 'web', name: 'Forestal Garuhapé',
    client: { es: 'Servicios forestales desde 1993 · AR y PY', en: 'Forestry services since 1993 · AR & PY' },
    role: { es: 'Sitio completo', en: 'Whole site' },
    summary: { es: 'Sitio corporativo: seis servicios, de la cosecha a la biomasa.', en: 'Corporate site: six services, from harvesting to biomass.' },
    problem: { es: 'Presentar seis líneas de servicio con claridad y convertir visitas en consultas comerciales.', en: 'Present six service lines clearly and turn visits into sales enquiries.' },
    features: [
      { es: 'Una página por servicio, generada desde JSON', en: 'One page per service, generated from JSON' },
      { es: 'SEO técnico: sitemap, robots y llms.txt', en: 'Technical SEO: sitemap, robots and llms.txt' },
      { es: 'Formulario que funciona sin JavaScript', en: 'Contact form that works without JavaScript' },
    ],
    stack: ['Eleventy', 'Nunjucks', 'Tailwind', 'GSAP', 'Lenis', 'PHP'],
    url: 'https://forestalgaruhape.com.ar', repo: 'https://github.com/romanvsc/web-forestal',
    images: img('forestal', 1),
  },
  {
    id: 'fgpy', numeral: '陸', path: 'web', name: 'Forestal Paraguay',
    client: { es: 'Servicios forestales · Paraguay', en: 'Forestry services · Paraguay' },
    role: { es: 'Sitio completo (sucursal Paraguay)', en: 'Whole site (Paraguay branch)' },
    summary: { es: 'Sitio de servicios forestales, con rediseño oscuro y cinematográfico.', en: 'Forestry services site, with a dark cinematic redesign.' },
    problem: { es: 'Darle presencia web propia a la operación en Paraguay.', en: 'Give the Paraguay operation its own web presence.' },
    features: [
      { es: 'SEO con datos estructurados', en: 'SEO with structured data' },
      { es: 'Galería y carruseles de servicios', en: 'Gallery and service carousels' },
      { es: 'Rediseño en React + GSAP', en: 'Redesign in React + GSAP' },
    ],
    stack: ['Eleventy', 'Tailwind', 'React', 'TypeScript', 'GSAP', 'Lenis'],
    url: 'https://forestalparaguay.com', repo: 'https://github.com/romanvsc/web_fgpy',
    images: img('fgpy', 1),
  },
  {
    id: 'anasociados', numeral: '漆', path: 'web', name: 'Almada Neri & Asociados',
    client: { es: 'Consultora HSE · Misiones y Paraguay', en: 'HSE consultancy · Misiones & Paraguay' },
    role: { es: 'Sitio completo', en: 'Whole site' },
    summary: { es: 'Seguridad, ambiente y forestación sustentable, contados en capítulos.', en: 'Safety, environment and sustainable forestry, told in chapters.' },
    problem: { es: 'Conseguir consultas calificadas de empresas forestales e industriales.', en: 'Bring in qualified enquiries from forestry and industrial companies.' },
    features: [
      { es: 'Home cinematográfica con scroll-expand', en: 'Cinematic home with scroll-expand' },
      { es: 'Servicios como capítulos apilados', en: 'Services as stacked chapters' },
      { es: 'Accesibilidad revisada con axe', en: 'Accessibility checked with axe' },
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind 4', 'GSAP', 'Lenis'],
    url: 'https://www.anasociados.com.ar', repo: 'https://github.com/romanvsc/web_anasociados',
    images: img('anasociados', 1),
  },
  {
    id: 'vogel', numeral: '捌', path: 'web', name: 'Vogel Consultoría',
    client: { es: 'Consultora tecnológica · pymes', en: 'Tech consultancy · SMEs' },
    role: { es: 'Rediseño del frontend', en: 'Frontend redesign' },
    summary: { es: 'Sistemas a medida, dashboards, automatización e IA para pymes.', en: 'Custom systems, dashboards, automation and AI for SMEs.' },
    problem: { es: 'Explicar servicios técnicos a pymes y llevarlas a agendar un diagnóstico.', en: 'Explain technical services to SMEs and get them to book a diagnostic session.' },
    features: [
      { es: 'Landings por servicio: IA, WhatsApp, dashboards, facturación', en: 'Per-service landings: AI, WhatsApp, dashboards, invoicing' },
      { es: 'Medición de cada clic de contacto', en: 'Tracking of every contact click' },
      { es: 'Skip link, ARIA y movimiento reducido', en: 'Skip link, ARIA and reduced motion' },
    ],
    stack: ['Vue 3', 'Vite', 'Tailwind', 'PrimeVue', 'GSAP', 'Playwright'],
    url: 'https://vogelconsultoria.com.ar', repo: 'https://github.com/romanvsc/vogel_consultoria',
    images: img('vogel', 1),
  },
];
