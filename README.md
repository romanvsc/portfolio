# Roman VSC — portfolio

Portfolio V3 de Román Vogel Corach, estudiante de Analista de Sistemas. Neobrutalismo editorial: crema, negro, naranja Dorito y acentos por proyecto. La base V3 fue publicada en GitHub; las iteraciones posteriores de capturas reales, hero con Rosehot y navegación visible están implementadas localmente y el deploy continúa pendiente.

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
- `src/tokens.json`: única fuente de colores de UI y escena. Genera `src/theme.css` con `@theme` y utilidades semánticas: `bg-brand`, `text-ink`, `border-line`, etc. La paleta predeterminada se desactiva. El desarrollo observa cambios de tokens y regenera el tema; las cajas usan `project-overlay` y `project-copy-plate`.
- `src/data.js`: contactos y contenido de los cuatro proyectos.
- `src/components/project-media.js`: identidad visual por capas —SVG de fondo, velo y placa tipográfica— y galería corta de capturas para las rutas internas.
- GSAP + ScrollTrigger: máscaras de entrada, separación tipográfica y parallax en hero; interpolación de color por capítulo, contador y pin de 220 px sólo en desktop ≥1100×720. Sin secuencias fijadas en móvil ni efectos GSAP con movimiento reducido.
- El retrato del hero vuelve a una fotografía rectangular, completamente opaca y sin máscaras. Dos bloques editoriales con tokens semánticos —marca y tinta— generan profundidad detrás de la foto, mientras `VOGEL.` permanece superpuesto por delante. La composición conserva reveal y parallax de GSAP.
- Three.js: la infraestructura y el GLB se conservan para una futura iteración, pero el bloque `04 / Un pequeño experimento` fue retirado de la home por decisión del usuario. No se carga Three en la ruta principal.
- Blender: modelo `public/models/portfolio-studio.glb` y fuente `blender/portfolio-studio.blend`; materiales basados en los mismos tokens. El cargador sincroniza además los colores por nombre de material.
- HTML semántico: la información y navegación no dependen del canvas.
- Fallback ilustrado si WebGL o el `.glb` no están disponibles. Manrope local (400/600) para cuerpo, DM Mono para metadata y Rosehot local para display, con Georgia/Times como fallback; no se agregaron dependencias ni fuentes remotas. La licencia oficial de Rosehot permite uso web personal autoalojado, pero prohíbe redistribuir el archivo de fuente; por eso esta versión permanece local hasta contar con una vía de distribución autorizada.
- Navegación principal siempre visible en el header: Inicio, Proyectos, Tecnologías, Sobre Mí y Contacto. Cada etiqueta incorpora su SVG ilustrado y conserva texto accesible. En mobile mantiene las cinco opciones debajo del wordmark, sin hamburger ni diálogo. Dorito mantiene un disclosure nativo operable por teclado/touch; el Stack usa piezas semánticas con alt y descripciones visibles.

## Módulos

- `src/main.js`: rutas y ciclo de vida.
- `src/sections/`: home, capítulos de proyectos y case studies con nueve secciones.
- `src/components/`: layout, Dorito, navegación y activación del escritorio.
- `src/animations/index.js`: GSAP, condiciones responsive y cleanup.
- `src/data.js`: selección de cuatro proyectos. IPAC se conserva; Registro Personal fue excluido explícitamente por el usuario.
- `src/sections/home.js`: Stack neobrutalista con cinco ilustraciones individuales: PHP, JavaScript, Vue.js, CSS y SQL.
- `scripts/prepare-assets.mjs`: además de las cuatro poses originales y cinco tecnologías, vectoriza los cuatro iconos de proyecto y los cinco iconos de navegación.

## Assets

Cuatro poses independientes en `public/brand/dorito/*.svg`: trazados vectoriales reales con paleta local, fondo conservado y sin títulos inferiores. La conversión simplifica textura. Cinco ilustraciones nuevas están en `public/brand/stack/{php,javascript,vue,css,sql}.svg`; cada una tiene su WebP optimizado correspondiente. La Stack utiliza los SVG para conservar el asset solicitado.

Los cuatro iconos de proyecto están en `public/brand/project-icons/` como SVG de trazados transparentes: Registro de Producción, IPAC, Gestión de Gimnasio y Mantenimiento. Los PNG originales permanecen en `public/brand/capturas_apps/`. La interfaz carga únicamente tres capturas esenciales por proyecto; la captura principal de Mantenimiento es el Chatbot Asistente IA indicado por el usuario. En la home, cada icono funciona como fondo centrado con velo semitransparente y copy editorial por encima.

Los cinco iconos del header están en `public/brand/header-icons/` como SVG de trazados transparentes derivados de `public/brand/stack/Iconos-header.png`. El original permanece intacto y cada enlace conserva su etiqueta visible.

`public/brand/roman.webp` mantiene el retrato fotográfico original y se presenta como rectángulo editorial, sin máscara ni alteración de sus píxeles. `roman.svg` es un contenedor con raster embebido, **no** una vectorización de la cara. Ver `public/brand/README.md`.

Regeneración opcional, no necesaria para ejecutar el sitio:

```powershell
python -m venv .venv-assets
.\.venv-assets\Scripts\python.exe -m pip install vtracer==0.6.15
npm run assets
```

Los PNG originales permanecen sin modificaciones en el repositorio y no se copian al build. Las paletas de las ilustraciones y los píxeles de la fotografía son contenido gráfico, no colores de UI.

## Rutas y límites

- `/`, `/proyectos/registro`, `/proyectos/ipac`, `/proyectos/gimnasio`, `/proyectos/mantenimiento`.
- Vite resuelve las rutas en local. Al publicar, el hosting deberá servir `index.html` como fallback de las rutas de la SPA. No se configuró ni realizó un deploy.
- Las cajas de la home muestran únicamente el icono de identidad; las páginas internas muestran las capturas reales seleccionadas. La sanitización debe mantenerse como criterio antes de agregar nuevas pantallas. Los aportes individuales verificados y demos siguen pendientes. No se atribuye autoría exclusiva.
- CV no incluido porque no se proporcionó archivo.
- El bloque Three.js produce una advertencia de tamaño (>500 KB sin gzip) sólo si se vuelve a importar desde una ruta futura; no forma parte del bundle de la home actual.

## Verificación V3 — 2026-09-18

- Build y checks automatizados: rutas, contactos, nueve capítulos, capturas seleccionadas, cuatro SVG de proyecto transparentes, cinco SVG de header transparentes, nueve SVG de Dorito, GLB, Tailwind, Rosehot local, navegación visible, retrato rectangular y pares de contraste (≥4.5:1).
- QA local: navegación y hero en desktop, tablet y mobile, sin overflow horizontal. Las máscaras rechazadas fueron retiradas; el retrato conserva sus píxeles originales dentro de una composición rectangular deliberada.
- Reduced motion emulado: cero pin-spacers y ningún título oculto. Móvil: sin pin. Desktop amplio: cuatro pins breves.
- GLB cargado en movimiento reducido; bloqueo deliberado de su petición para probar fallback y posterior reintento exitoso. Sin errores de consola en navegación normal.
- Bundle observado: entrada ~140 KB (~54 KB gzip), CSS ~30 KB (~7 KB gzip), sin chunk Three en la home. El GLB existente continúa en el repositorio para una fase futura. No son métricas Core Web Vitals ni resultados Lighthouse.
- Pendientes: revisión estética del usuario, auditoría continua de sanitización, contribuciones/aprendizajes verificables, modelo Dorito, lector de pantalla y dispositivos físicos. Commit/push de esta fase: `9d62c72`; no se hizo deploy manual.

Referencias técnicas: [Tailwind + Vite](https://tailwindcss.com/docs/installation/using-vite), [tokens de Tailwind](https://tailwindcss.com/docs/theme), [VTracer](https://github.com/visioncortex/vtracer).

La dirección y el inventario de contenido están documentados en `RomanVault/Proyectos/Portfolio`.
