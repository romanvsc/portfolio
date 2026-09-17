# Roman VSC — portfolio

Portfolio V3 de Román Vogel Corach, estudiante de Analista de Sistemas. Neobrutalismo editorial: crema, negro, naranja Dorito y acentos por proyecto. Rediseño local autorizado en CAMBIOS.MD/CAMBIOS_V2.MD; estos cambios no fueron publicados.

## Desarrollo

```powershell
npm install
npm run dev
```

Preview local: `http://127.0.0.1:5178/`.

## Build

```powershell
npm run build
npm run check
```

## Decisiones

- Tailwind 4 mediante el plugin de Vite; no hace falta `tailwind.config.js` en este enfoque CSS-first.
- `src/tokens.json`: única fuente de colores de UI y escena. Genera `src/theme.css` con `@theme` y utilidades semánticas: `bg-brand`, `text-ink`, `border-line`, etc. La paleta predeterminada se desactiva. El desarrollo observa cambios de tokens y regenera el tema.
- `src/data.js`: contactos y contenido de los cuatro proyectos.
- GSAP + ScrollTrigger: máscaras de entrada, separación tipográfica y parallax en hero; interpolación de color por capítulo, contador y pin de 220 px sólo en desktop ≥1100×720. Sin secuencias fijadas en móvil ni efectos GSAP con movimiento reducido.
- Three.js: la infraestructura y el GLB se conservan para una futura iteración, pero el bloque `04 / Un pequeño experimento` fue retirado de la home por decisión del usuario. No se carga Three en la ruta principal.
- Blender: modelo `public/models/portfolio-studio.glb` y fuente `blender/portfolio-studio.blend`; materiales basados en los mismos tokens. El cargador sincroniza además los colores por nombre de material.
- HTML semántico: la información y navegación no dependen del canvas.
- Fallback ilustrado si WebGL o el `.glb` no están disponibles. Manrope local (400/600) para cuerpo, DM Mono para metadata y Arial/Helvetica de sistema para display; no se agregaron dependencias ni fuentes remotas.
- Menú fullscreen con dialog nativo, cierre con Escape y contención/retorno del foco. Dorito conserva un disclosure nativo operable por teclado/touch; el Stack usa piezas semánticas con alt y descripciones visibles. El cursor contextual complementa al nativo sólo con puntero fino y movimiento habilitado.

## Módulos

- `src/main.js`: rutas y ciclo de vida.
- `src/sections/`: home, capítulos de proyectos y case studies con nueve secciones.
- `src/components/`: layout, Dorito, navegación y activación del escritorio.
- `src/animations/index.js`: GSAP, condiciones responsive y cleanup.
- `src/data.js`: selección de cuatro proyectos. IPAC se conserva; Registro Personal fue excluido explícitamente por el usuario.
- `src/sections/home.js`: Stack neobrutalista con cinco ilustraciones individuales: PHP, JavaScript, Vue.js, CSS y SQL.
- `scripts/prepare-assets.mjs`: además de las cuatro poses originales, recorta y vectoriza el nuevo sheet de cinco tecnologías.

## Assets

Cuatro poses independientes en `public/brand/dorito/*.svg`: trazados vectoriales reales con paleta local, fondo conservado y sin títulos inferiores. La conversión simplifica textura. Cinco ilustraciones nuevas están en `public/brand/stack/{php,javascript,vue,css,sql}.svg`; cada una tiene su WebP optimizado correspondiente. La Stack utiliza los SVG para conservar el asset solicitado.

`public/brand/roman.webp` mantiene el retrato fotográfico. `roman.svg` es un contenedor con raster embebido, **no** una vectorización de la cara. Ver `public/brand/README.md`.

Regeneración opcional, no necesaria para ejecutar el sitio:

```powershell
python -m venv .venv-assets
.\.venv-assets\Scripts\python.exe -m pip install vtracer==0.6.15
npm run assets
```

Los PNG originales permanecen sin modificaciones en la raíz y no se copian al build. Las paletas de las ilustraciones y los píxeles de la fotografía son contenido gráfico, no colores de UI.

## Rutas y límites

- `/`, `/proyectos/registro`, `/proyectos/ipac`, `/proyectos/gimnasio`, `/proyectos/mantenimiento`.
- Vite resuelve las rutas en local. Al publicar, el hosting deberá servir `index.html` como fallback de las rutas de la SPA. No se configuró ni realizó un deploy.
- Los visuales de proyecto son esquemas conceptuales identificados; aún faltan capturas sanitizadas, aportes individuales verificados y demos. No se atribuye autoría exclusiva.
- CV no incluido porque no se proporcionó archivo.
- El bloque Three.js produce una advertencia de tamaño (>500 KB sin gzip) sólo si se vuelve a importar desde una ruta futura; no forma parte del bundle de la home actual.

## Verificación V3 — 2026-09-17

- Build y 267 assertions: rutas, contactos, nueve capítulos, honestidad de placeholders, tokens de todos los módulos, nueve SVG de Dorito, GLB, Tailwind y pares de contraste (≥4.5:1).
- QA en Edge local: desktop, 390×844, 320×740, tablet 768×1024; cuatro cases sin overflow a 320 y desktop. Menú, Escape, Tab/Shift+Tab, anclas, Dorito y foco comprobados.
- Reduced motion emulado: cero pin-spacers y ningún título oculto. Móvil: sin pin. Desktop amplio: cuatro pins breves.
- GLB cargado en movimiento reducido; bloqueo deliberado de su petición para probar fallback y posterior reintento exitoso. Sin errores de consola en navegación normal.
- Bundle observado: entrada ~136 KB (~54 KB gzip), CSS ~29 KB (~7 KB gzip), sin chunk Three en la home. El GLB existente continúa en el repositorio para una fase futura. No son métricas Core Web Vitals ni resultados Lighthouse.
- Pendientes: revisión estética del usuario, capturas sanitizadas, contribuciones/aprendizajes verificables, modelo Dorito, lector de pantalla y dispositivos físicos. No se hizo commit, push ni deploy de V3.

Referencias técnicas: [Tailwind + Vite](https://tailwindcss.com/docs/installation/using-vite), [tokens de Tailwind](https://tailwindcss.com/docs/theme), [VTracer](https://github.com/visioncortex/vtracer).

La dirección y el inventario de contenido están documentados en `RomanVault/Proyectos/Portfolio`.
