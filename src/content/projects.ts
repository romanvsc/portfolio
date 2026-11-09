// Fuente: CONTEXT.md. No agregar nada que no esté verificado ahí.
// solution/decisions/outcome: borrador del 2026-10-19, revisar con Román.
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
  /** cómo se encaró, en 1-2 frases */
  solution: T;
  features: T[];
  /** decisiones técnicas con su porqué */
  decisions: T[];
  /** sólo hechos verificables; sin dato, no se muestra */
  outcome?: T;
  stack: string[];
  url?: string;
  repo: string;
  status?: T;
  images: string[];
}

const img = (slug: string, n: number) => Array.from({ length: n }, (_, i) => `/img/projects/${slug}/${i + 1}.webp`);

export const PROJECTS: Project[] = [
  {
    id: 'ipac', numeral: '01', path: 'system', name: 'IPAC',
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
    solution: { es: 'Una plataforma web central para las dos sedes: cada una opera lo suyo, pero con los mismos datos y las mismas reglas de cobro.', en: 'One central web platform for both campuses: each runs its own operations, on the same data and the same billing rules.' },
    decisions: [
      { es: 'API en Django + DRF separada del frontend en Vue 3: la lógica de cobro vive en un solo lugar', en: 'Django + DRF API separate from the Vue 3 frontend: billing logic lives in one place' },
      { es: 'Permisos por sede desde el modelo de roles, no como un filtro de pantalla', en: 'Per-campus permissions built into the role model, not as a screen filter' },
      { es: 'Importación CSV/XLSX que detecta duplicados, para migrar lo que ya existía sin ensuciar la base', en: 'CSV/XLSX import that detects duplicates, to migrate existing records without polluting the database' },
    ],
    outcome: { es: 'Las dos sedes dejaron sus herramientas locales y administran desde una sola plataforma web.', en: 'Both campuses left their local tools behind and now run administration from a single web platform.' },
    stack: ['Django', 'DRF', 'PostgreSQL', 'Vue 3', 'Tailwind', 'Docker', 'Nginx'],
    url: 'https://ipac.vogelconsultoria.com.ar', repo: 'https://github.com/romanvsc/IPAC',
    images: img('ipac', 3),
  },
  {
    id: 'produccion', numeral: '02', path: 'system', name: 'Registro de Producción',
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
    solution: { es: 'Una PWA que se instala en el celular del operador, carga todo sin señal y sincroniza sola cuando vuelve la conexión.', en: 'A PWA installed on the operator’s phone that records everything offline and syncs on its own once the connection returns.' },
    decisions: [
      { es: 'Offline-first con Dexie sobre IndexedDB: el formulario nunca depende de la red', en: 'Offline-first with Dexie on IndexedDB: forms never depend on the network' },
      { es: 'Cola de pendientes visible por rol, para que nadie dude si un registro ya se envió', en: 'A pending queue visible per role, so nobody wonders whether a record was sent' },
      { es: 'Backend en FastAPI con arquitectura hexagonal / DDD, para sumar clientes y formularios sin reescribir el núcleo', en: 'FastAPI backend with hexagonal architecture / DDD, to add clients and forms without rewriting the core' },
    ],
    outcome: { es: 'En uso en operaciones forestales de Indufor y FG.', en: 'In use in Indufor and FG forestry operations.' },
    stack: ['FastAPI', 'SQLAlchemy', 'MySQL', 'Vue 3', 'Pinia', 'PWA', 'Dexie', 'Docker'],
    url: 'https://produccion.indufor.com.ar', repo: 'https://github.com/romanvsc/registro_produccion',
    images: img('produccion', 3),
  },
  {
    id: 'mantenimiento', numeral: '03', path: 'system', name: 'Mantenimiento',
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
    solution: { es: 'Una ficha por equipo con su historial, planes preventivos que avisan antes del vencimiento y un circuito claro de la solicitud a la orden de trabajo.', en: 'A record per unit with its history, preventive plans that warn before services are due, and a clear flow from request to work order.' },
    decisions: [
      { es: 'Solicitudes separadas de las órdenes de trabajo, para que un pedido no se mezcle con un trabajo en curso', en: 'Requests kept separate from work orders, so a request never gets mixed up with a job in progress' },
      { es: 'El plan preventivo se recalcula al cerrar cada orden, sobre lecturas de odómetro y horómetro auditadas', en: 'The preventive plan is recalculated when each order closes, from audited odometer and engine-hour readings' },
      { es: 'PWA instalable con notificaciones push y QR por unidad, para el técnico que trabaja en el taller', en: 'Installable PWA with push notifications and a QR per unit, for technicians working in the workshop' },
    ],
    stack: ['PHP 8.2', 'CodeIgniter 4', 'MySQL', 'Bootstrap 5', 'Web Push', 'PWA'],
    url: 'https://vogelconsultoria.com.ar/mantenimiento/', repo: 'https://github.com/romanvsc/mantenimiento',
    status: { es: 'En desarrollo: etapas 2 a 4', en: 'In development: stages 2 to 4' },
    images: img('mantenimiento', 3),
  },
  {
    id: 'gimnasio', numeral: '04', path: 'system', name: 'Gestión Gimnasio',
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
    solution: { es: 'Una PWA pensada para la tablet de recepción, en modo kiosco: buscar al socio, ver si puede pasar y cobrar, en pocos toques.', en: 'A PWA designed for the front-desk tablet in kiosk mode: find the member, see if they can come in, and take payment in a few taps.' },
    decisions: [
      { es: 'Supabase con Row Level Security en lugar de un backend propio: los permisos viven en la base', en: 'Supabase with Row Level Security instead of a custom backend: permissions live in the database' },
      { es: 'Historial de pagos que no se puede editar, para que la caja siempre cierre', en: 'A payment history that cannot be edited, so the cash register always balances' },
      { es: 'Check-in con respuesta inmediata de permitido o denegado según el estado de la cuota', en: 'Check-in that answers allowed or denied instantly, based on the fee status' },
    ],
    outcome: { es: 'La usan en la recepción del gimnasio para cobrar y controlar el acceso.', en: 'Used at the gym’s front desk to take payments and control access.' },
    stack: ['Vue 3', 'Pinia', 'Supabase', 'Postgres RLS', 'Chart.js', 'Vercel'],
    url: 'https://gestion-gimnasio.vercel.app', repo: 'https://github.com/romanvsc/gestion_gimnasio',
    images: img('gimnasio', 3),
  },
  {
    id: 'forestal', numeral: '05', path: 'web', name: 'Forestal Garuhapé',
    client: { es: 'Servicios forestales desde 1993 · AR y PY', en: 'Forestry services since 1993 · AR & PY' },
    role: { es: 'Sitio completo', en: 'Whole site' },
    summary: { es: 'Sitio corporativo: seis servicios, de la cosecha a la biomasa.', en: 'Corporate site: six services, from harvesting to biomass.' },
    problem: { es: 'Presentar seis líneas de servicio con claridad y convertir visitas en consultas comerciales.', en: 'Present six service lines clearly and turn visits into sales enquiries.' },
    features: [
      { es: 'Una página por servicio, generada desde JSON', en: 'One page per service, generated from JSON' },
      { es: 'SEO técnico: sitemap, robots y llms.txt', en: 'Technical SEO: sitemap, robots and llms.txt' },
      { es: 'Formulario que funciona sin JavaScript', en: 'Contact form that works without JavaScript' },
    ],
    solution: { es: 'Un sitio estático con una página propia para cada uno de los seis servicios, pensado para que cada consulta llegue al servicio correcto.', en: 'A static site with a dedicated page for each of the six services, so every enquiry lands on the right service.' },
    decisions: [
      { es: 'Eleventy con el contenido en JSON: sumar o editar un servicio no requiere tocar plantillas', en: 'Eleventy with content in JSON: adding or editing a service does not touch templates' },
      { es: 'Formulario en PHP que funciona sin JavaScript, para no perder consultas', en: 'PHP form that works without JavaScript, so no enquiry is lost' },
      { es: 'SEO técnico desde el inicio: sitemap, robots y llms.txt', en: 'Technical SEO from day one: sitemap, robots and llms.txt' },
    ],
    stack: ['Eleventy', 'Nunjucks', 'Tailwind', 'GSAP', 'Lenis', 'PHP'],
    url: 'https://forestalgaruhape.com.ar', repo: 'https://github.com/romanvsc/web-forestal',
    images: img('forestal', 1),
  },
  {
    id: 'fgpy', numeral: '06', path: 'web', name: 'Forestal Paraguay',
    client: { es: 'Servicios forestales · Paraguay', en: 'Forestry services · Paraguay' },
    role: { es: 'Sitio completo (sucursal Paraguay)', en: 'Whole site (Paraguay branch)' },
    summary: { es: 'Sitio de servicios forestales, con rediseño oscuro y cinematográfico.', en: 'Forestry services site, with a dark cinematic redesign.' },
    problem: { es: 'Darle presencia web propia a la operación en Paraguay.', en: 'Give the Paraguay operation its own web presence.' },
    features: [
      { es: 'SEO con datos estructurados', en: 'SEO with structured data' },
      { es: 'Galería y carruseles de servicios', en: 'Gallery and service carousels' },
      { es: 'Rediseño en React + GSAP', en: 'Redesign in React + GSAP' },
    ],
    solution: { es: 'Un sitio propio para la sucursal, con servicios, empresa y canales de contacto, y después un rediseño oscuro y cinematográfico.', en: 'A dedicated site for the branch, with services, company and contact channels, followed by a dark cinematic redesign.' },
    decisions: [
      { es: 'Datos estructurados para que los buscadores entiendan la empresa y sus servicios', en: 'Structured data so search engines understand the company and its services' },
      { es: 'Primera versión en Eleventy; el rediseño pasó a React + TypeScript con GSAP y Lenis', en: 'First version in Eleventy; the redesign moved to React + TypeScript with GSAP and Lenis' },
    ],
    stack: ['Eleventy', 'Tailwind', 'React', 'TypeScript', 'GSAP', 'Lenis'],
    url: 'https://forestalparaguay.com', repo: 'https://github.com/romanvsc/web_fgpy',
    images: img('fgpy', 1),
  },
  {
    id: 'anasociados', numeral: '07', path: 'web', name: 'Almada Neri & Asociados',
    client: { es: 'Consultora HSE · Misiones y Paraguay', en: 'HSE consultancy · Misiones & Paraguay' },
    role: { es: 'Sitio completo', en: 'Whole site' },
    summary: { es: 'Seguridad, ambiente y forestación sustentable, contados en capítulos.', en: 'Safety, environment and sustainable forestry, told in chapters.' },
    problem: { es: 'Conseguir consultas calificadas de empresas forestales e industriales.', en: 'Bring in qualified enquiries from forestry and industrial companies.' },
    features: [
      { es: 'Home cinematográfica con scroll-expand', en: 'Cinematic home with scroll-expand' },
      { es: 'Servicios como capítulos apilados', en: 'Services as stacked chapters' },
      { es: 'Accesibilidad revisada con axe', en: 'Accessibility checked with axe' },
    ],
    solution: { es: 'Una home que cuenta la consultora en capítulos, con páginas de servicios, clientes y blog, y acceso al portal de clientes.', en: 'A home that tells the consultancy’s story in chapters, with services, clients and blog pages, plus access to the client portal.' },
    decisions: [
      { es: 'Next.js con export estático: rápido de servir y sin servidor que mantener', en: 'Next.js static export: fast to serve, with no server to maintain' },
      { es: 'Servicios como capítulos apilados, para recorrer una oferta amplia sin perderse', en: 'Services as stacked chapters, to browse a broad offering without getting lost' },
      { es: 'Accesibilidad revisada con axe-core aunque la home sea cinematográfica', en: 'Accessibility checked with axe-core even with a cinematic home' },
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind 4', 'GSAP', 'Lenis'],
    url: 'https://www.anasociados.com.ar', repo: 'https://github.com/romanvsc/web_anasociados',
    images: img('anasociados', 1),
  },
  {
    id: 'vogel', numeral: '08', path: 'web', name: 'Vogel Consultoría',
    client: { es: 'Consultora tecnológica · pymes', en: 'Tech consultancy · SMEs' },
    role: { es: 'Rediseño del frontend', en: 'Frontend redesign' },
    summary: { es: 'Sistemas a medida, dashboards, automatización e IA para pymes.', en: 'Custom systems, dashboards, automation and AI for SMEs.' },
    problem: { es: 'Explicar servicios técnicos a pymes y llevarlas a agendar un diagnóstico.', en: 'Explain technical services to SMEs and get them to book a diagnostic session.' },
    features: [
      { es: 'Landings por servicio: IA, WhatsApp, dashboards, facturación', en: 'Per-service landings: AI, WhatsApp, dashboards, invoicing' },
      { es: 'Medición de cada clic de contacto', en: 'Tracking of every contact click' },
      { es: 'Skip link, ARIA y movimiento reducido', en: 'Skip link, ARIA and reduced motion' },
    ],
    solution: { es: 'Una landing por servicio, cada una con un camino directo al contacto. El sitio también muestra los casos reales de la consultora.', en: 'One landing page per service, each with a direct path to contact. The site also shows the consultancy’s real cases.' },
    decisions: [
      { es: 'Medición de cada clic de contacto, para saber qué servicio genera consultas', en: 'Tracking of every contact click, to know which service brings in enquiries' },
      { es: 'Pruebas con Playwright y axe-core para no romper la accesibilidad en cada cambio', en: 'Playwright and axe-core tests so accessibility does not break with each change' },
    ],
    stack: ['Vue 3', 'Vite', 'Tailwind', 'PrimeVue', 'GSAP', 'Playwright'],
    url: 'https://vogelconsultoria.com.ar', repo: 'https://github.com/romanvsc/vogel_consultoria',
    images: img('vogel', 1),
  },
];
