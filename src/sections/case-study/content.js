const architectureByProject = {
  registro: [
    { label: 'INTERFAZ', value: 'Vue', note: 'Frontend' },
    { label: 'API', value: 'FastAPI', note: 'Backend' },
    { label: 'PERSISTENCIA', value: 'MySQL', note: 'Base de datos' },
  ],
  ipac: [
    { label: 'INTERFAZ', value: 'Vue + Vite', note: 'Frontend' },
    { label: 'API', value: 'Django + DRF', note: 'Backend' },
    { label: 'BASE DE DATOS', value: 'PostgreSQL', note: 'Previsto en la documentación' },
  ],
  gimnasio: [
    { label: 'INTERFAZ', value: 'Vue 3 + Vite', note: 'PWA frontend' },
    { label: 'SERVICIOS', value: 'Supabase', note: 'Servicios conectados' },
  ],
  mantenimiento: [
    { label: 'APLICACIÓN', value: 'PHP + CodeIgniter 4', note: 'Aplicación principal' },
    { label: 'INTERACCIÓN', value: 'Vue.js', note: 'Dashboard de lectura integrado con el modelo autorizado de CodeIgniter' },
    { label: 'PERSISTENCIA', value: 'MySQL / MariaDB', note: 'Base de datos' },
  ],
};

const architectureSupportByProject = {
  registro: [['HERRAMIENTA', 'Docker', 'Despliegue']],
  ipac: [['DESPLIEGUE', 'Docker Compose', 'Preparado en el repositorio']],
  gimnasio: [['ESTADO', 'Pinia', 'Estado de la aplicación']],
  mantenimiento: [],
};

const technologyIcons = {
  Vue: 'vue',
  'Vue 3': 'vue',
  'Vue.js': 'vue',
  PHP: 'php',
  Docker: 'docker',
  Supabase: 'supabase',
};

const technologyRoles = {
  registro: [
    ['FastAPI', 'API y lógica de backend'],
    ['Vue', 'Interfaz frontend'],
    ['MySQL', 'Persistencia'],
    ['Docker', 'Herramienta de despliegue'],
  ],
  ipac: [
    ['Django', 'Aplicación backend'],
    ['DRF', 'API REST'],
    ['Vue', 'Interfaz frontend'],
    ['Vite', 'Herramienta del frontend'],
  ],
  gimnasio: [
    ['Vue 3', 'Interfaz de la PWA'],
    ['Vite', 'Herramienta del frontend'],
    ['Pinia', 'Estado de la aplicación'],
    ['Supabase', 'Servicios conectados'],
  ],
  mantenimiento: [
    ['PHP', 'Lenguaje de la aplicación'],
    ['CodeIgniter 4', 'Framework principal'],
    ['Vue.js', 'Dashboard de lectura integrado con el modelo que entrega CodeIgniter'],
    ['MySQL / MariaDB', 'Persistencia'],
  ],
};

const featuresByProject = {
  registro: [
    { title: 'Análisis gerencial', description: 'Dashboard con filtros y evolución diaria de producción.' },
    { title: 'Carga de producción', description: 'Flujo guiado con contexto, operador, equipo y datos de producción.' },
    { title: 'Sincronización', description: 'Cola local de registros pendientes y estado de sincronización del dispositivo.' },
  ],
  ipac: [
    { title: 'Flujo administrativo inicial', description: 'Login, sucursales, alumnos, carreras o cursos y conceptos cobrables; es el primer flujo funcional documentado.' },
    { title: 'Caja diaria', description: 'Vista de tesorería, conciliación y movimientos de caja.' },
    { title: 'Importación de datos', description: 'Carga de alumnos, carreras, conceptos y saldos desde archivos.' },
  ],
  gimnasio: [
    { title: 'Gestión de socios', description: 'Alta, edición y detalle de socios.' },
    { title: 'Pagos y planes', description: 'Registro de pagos y administración de planes.' },
    { title: 'Control de acceso', description: 'Check-in basado en el estado de la cuota.' },
    { title: 'Reportes', description: 'Consultas y exportación a Excel o PDF.' },
    { title: 'Caja diaria', description: 'Registro y exportación de movimientos.' },
  ],
  mantenimiento: [
    { title: 'Equipos y lecturas', description: 'CRUD esencial, traslados, baja lógica y lecturas auditadas listos.', status: 'verified' },
    { title: 'Plan preventivo mínimo', description: 'El motor y el plan mínimo están listos; la etapa sigue en curso y las plantillas están pendientes.', status: 'in-progress' },
    { title: 'Avisos y órdenes preventivas', description: 'La versión mínima está lista; solicitudes y mantenimiento correctivo siguen en desarrollo.', status: 'in-progress' },
    { title: 'Asistente en interfaz', description: 'La captura muestra el chatbot con vencimientos y acciones rápidas.' },
  ],
};

export function caseStudyContent(project) {
  return {
    problem: {
      process: project.flowTitle,
      steps: project.steps,
      friction: project.challenge,
      need: project.caseTitle,
    },
    about: {
      description: project.description,
      facts: [
        ['DOMINIO', project.domain],
        ['ROL DECLARADO', project.role],
        ['FOCO', project.focus],
      ],
      architecture: project.architecture,
      layers: architectureByProject[project.id] ?? [],
      support: architectureSupportByProject[project.id] ?? [],
      principles: project.decisions.map(([title, description]) => ({ title, description })),
    },
    technologies: (technologyRoles[project.id] ?? []).map(([name, role]) => ({
      name,
      role,
      icon: technologyIcons[name] ?? null,
    })),
    features: featuresByProject[project.id] ?? [],
  };
}
