# CONTEXT.md — Contenido real del portfolio

Fuente de verdad del contenido. **No inventar** nada que no esté acá: ni métricas, ni clientes, ni testimonios.

## Perfil
- **Nombre:** Román Vogel Corach
- **Edad:** 24
- **Formación:** **estudiante** de Analista de Sistemas (no egresado)
- **Rol:** desarrollador web y de sistemas a medida
- **Email:** romancorach@gmail.com
- **GitHub:** https://github.com/romanvsc
- **LinkedIn:** https://www.linkedin.com/in/roman-vogel-corach-2998bb31b/
- **Ciudad:** Puerto Rico, Misiones, Argentina (UTC−3). Trabaja con clientes de Misiones, Corrientes y Paraguay
- **WhatsApp:** 3743481391 → en el sitio sólo como botón `https://wa.me/5493743481391` (el número no se escribe en texto plano)
- **Foto:** `ChatGPT Image 16 sept 2026, 23_27_44.png` (retrato con fondo y remera negros). `npm run images` la optimiza a `public/img/roman.webp`
- **Manifiesto** (del portfolio anterior, se conserva): *"Primero entender. Después construir."* Antes de programar entiende los procesos, los datos y las personas
- **ロマン:** en japonés significa la búsqueda de un ideal, el espíritu de aventura. Es el hilo del sitio

## Skills (por uso real en los proyectos)
- **Frontend:** Vue 3, React, TypeScript, JavaScript, Tailwind CSS, GSAP, Lenis, Pinia, PWA (vite-plugin-pwa, Dexie/IndexedDB)
- **Backend:** Python (FastAPI, Django + DRF), PHP (CodeIgniter 4, PHP puro con JWT), Node (tooling)
- **Datos:** MySQL/MariaDB, PostgreSQL, Supabase (RLS), SQLite
- **Infra:** Docker, Docker Compose, Nginx, Coolify, Vercel, deploy por SSH y FTP, GitHub Actions
- **Web/marketing:** Eleventy, Next.js, SEO técnico, accesibilidad (axe), Playwright
- **Otros:** C++, arquitectura hexagonal / DDD (Registro de Producción)

## Proyectos: sistemas (4)
### 壱 IPAC: administración y cobranzas
- **Repo:** https://github.com/romanvsc/IPAC · **URL:** https://ipac.vogelconsultoria.com.ar
- **Rol de Román:** Todo el frontend
- **Qué es:** sistema de administración, tesorería y cobranzas para el instituto educativo IPAC, con dos sedes (Posadas y Eldorado). Reemplaza la administración local por una plataforma web central
- **Stack:** Django 6, DRF, PostgreSQL, Vue 3, Vite, Tailwind 4, Vitest, Docker Compose, Nginx
- **Features:** roles por sede; inscripciones y generación de cuotas con descuentos, recargos y pagos parciales; cuenta corriente del alumno; caja diaria por usuario y sede; recibos y reportes; importación CSV/XLSX sin duplicados
- **Capturas:** `../portfolio/public/brand/capturas_apps/IPAC/portfolio/*.png`

### 弐 Registro de Producción forestal
- **Repo:** https://github.com/romanvsc/registro_produccion · **URLs:** https://produccion.indufor.com.ar · https://produccion.servinlgsm.com.ar
- **Rol de Román:** Todo el frontend y consolidación del backend
- **Qué es:** app para registrar la producción forestal desde el campo. Los operadores de máquina y los supervisores cargan producción, combustible, caminos y tiempos no operativos; los administradores lo ven en dashboards. En uso para Indufor y FG
- **Stack:** FastAPI, SQLAlchemy, Pydantic, MySQL, JWT, arquitectura hexagonal/DDD; Vue 3, Pinia, Tailwind 4, PWA (vite-plugin-pwa + Dexie), Docker, Nginx, CI en GitHub
- **Features:** funciona offline (IndexedDB) y sincroniza al volver la conexión; carga por rol con cola de pendientes; formularios de producción, combustible y caminos; centro de administración con CRUD y dashboard; manuales con capturas integrados
- **Capturas:** `../portfolio/public/brand/capturas_apps/produccion/capturas/**` · `../registros_produccion/registro_produccion/docs/manuales/capturas/`

### 参 Mantenimiento de flota
- **Repo:** https://github.com/romanvsc/mantenimiento · **URL:** https://vogelconsultoria.com.ar/mantenimiento/
- **Rol de Román:** Todo el frontend y consolidación del backend
- **Qué es:** gestión de mantenimiento preventivo y correctivo para una flota mixta (camiones, tractores, acoplados, maquinaria). Multiempresa y multisucursal; las solicitudes van separadas de las órdenes de trabajo
- **Stack:** PHP 8.2, CodeIgniter 4.7, MySQL/MariaDB, Bootstrap 5, QR (endroid), Web Push, PhpSpreadsheet, PHPUnit, Docker/Coolify
- **Features:** ficha de equipo con odómetro y horómetro, traslados e historial auditado; motor preventivo (planes, alertas de vencimiento, OT y recálculo al cerrar); QR imprimible por unidad; bandeja "Mi trabajo" para técnicos; notificaciones push; PWA instalable; módulo de chatbot
- **Estado:** etapas 2 a 4 en curso
- **Capturas:** `../portfolio/public/brand/capturas_apps/mantenimiento/ui/*.png`

### 肆 Gestión de Gimnasio
- **Repo:** https://github.com/romanvsc/gestion_gimnasio · **URL:** https://gestion-gimnasio.vercel.app
- **Rol de Román:** Proyecto propio, todo hecho por Román
- **Qué es:** PWA a medida para el gimnasio del Club Social y Deportivo Yacyretá (Ituzaingó, Corrientes). La usan en recepción para cobrar y controlar el acceso, muchas veces en tablet en modo kiosco
- **Stack:** Vue 3, Pinia, Tailwind, reka-ui, Chart.js, Supabase (Postgres + RLS), jsPDF, Vercel
- **Features:** check-in que muestra al instante si se permite o se deniega el acceso según la cuota; fichas de socios y planes; historial de pagos que no se puede editar; caja diaria; banco de horas del personal; reportes en Excel y PDF
- **Capturas:** `../portfolio/public/brand/capturas_apps/gimnasio/portfolio/*.png`

## Proyectos: webs (4)
### 伍 Forestal Garuhapé
- **Repo:** https://github.com/romanvsc/web-forestal · **URL:** https://forestalgaruhape.com.ar
- **Rol de Román:** Proyecto para la forestal, todo hecho por Román
- **Qué es:** sitio de una empresa de servicios forestales fundada en 1993, que trabaja en Argentina y Paraguay. Seis servicios: cosecha, transporte, acopio, caminos, biomasa y consultoría
- **Stack:** Eleventy 2, Nunjucks, Tailwind, GSAP, Lenis, Lottie, formulario en PHP; rediseño en curso con React Router
- **Features:** contenido desde JSON con una página por servicio; SEO (sitemap, robots, llms.txt); manual de marca; formulario que funciona sin JavaScript
- **Imágenes:** `../web_forestal/docs/evidencia/v2-home/hero-1440.jpg`

### 陸 Forestal Paraguay
- **Repo:** https://github.com/romanvsc/web_fgpy · **URL:** https://forestalparaguay.com
- **Rol de Román:** Proyecto para la sucursal Paraguay de la forestal, todo hecho por Román
- **Qué es:** sitio de Forestal Paraguay: servicios forestales, empresa y canales de contacto
- **Stack:** Eleventy 3, Nunjucks, Tailwind, Swiper; rediseño en React 19 + TypeScript + Vite + GSAP + Lenis
- **Features:** guía de SEO con datos estructurados; galería y carruseles de servicios; rediseño oscuro y cinematográfico
- **Imágenes:** `../web_forestal_py/fgpy-site/public/img/og.jpg`

### 漆 Almada Neri & Asociados
- **Repo:** https://github.com/romanvsc/web_anasociados · **URL:** https://www.anasociados.com.ar
- **Rol de Román:** Página web hecha por Román
- **Qué es:** consultora de Misiones y Paraguay en salud, seguridad y ambiente laboral, sistemas de gestión integrados, forestación sustentable y capacitación
- **Stack:** Next.js (export estático), React, TypeScript, Tailwind 4, GSAP, Lenis, axe-core
- **Features:** home cinematográfica con scroll-expand y servicios como capítulos apilados; páginas de servicios, clientes y blog; tira de logos; acceso al portal de clientes
- **Imágenes:** `../web_ana_asociados/web_anasociados/public/assets/images/og-compartir.jpg`

### 捌 Vogel Consultoría
- **Repo:** https://github.com/romanvsc/vogel_consultoria · **URL:** https://vogelconsultoria.com.ar
- **Rol de Román:** Rediseño del frontend
- **Qué es:** consultora tecnológica para pymes argentinas: sistemas a medida, dashboards, automatización, IA y capacitación. Funciona además como portfolio de casos reales
- **Stack:** Vue 3, Vite, Tailwind, PrimeVue, GSAP, Lenis, Playwright, axe-core
- **Features:** landings por servicio (IA, automatización, WhatsApp, dashboards, mantenimiento, API de facturación ContaFlow); encuesta para contadores; medición de los clics de contacto; accesibilidad (skip link, ARIA, reduced motion)
- **Imágenes:** `../web_vogel_consultoria/public/og-image.png`

## Números reales que se pueden mostrar
- 8 proyectos destacados (4 sistemas + 4 webs)
- 2 países con clientes: Argentina y Paraguay
- 6 sistemas/sitios con URL pública (no se verificaron en vivo; revisarlo antes del deploy)

## Pendientes (a confirmar con Román)
- [x] Ciudad: Puerto Rico, Misiones
- [x] Rol en cada proyecto (ver cada proyecto)
- [ ] Relación con Vogel Consultoría (¿socio, empleado, fundador?)
- [ ] CV en PDF (el portfolio anterior no tenía)
- [x] WhatsApp (botón en contacto y menú)
- [ ] Dominio para el deploy
- [ ] Verificar que las URLs públicas respondan y qué versión está online (los rediseños de Forestal pueden no estar publicados)
- [ ] Forestal Garuhapé tiene fotos de equipo y ubicaciones sin verificar; Almada Neri tiene datos de equipo de ejemplo. No usarlos como prueba
