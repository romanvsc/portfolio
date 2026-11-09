# CLAUDE.md — Portfolio v2 「SEÑAL」

Portfolio personal de **Román Vogel Corach**. La TV es la ventana: bisel fijo + panel de controles; dentro de la pantalla, un viaje en profundidad (eje Z) donde cada sección es un canal. Estética retro CRT + collage de papel + halftone, paleta triádica (fósforo/brasa/uva).
Antes de tocar diseño, leé **DESIGN.md**. Antes de tocar textos o proyectos, leé **CONTEXT.md**.

## Stack
- Vite 8 + React 19 + TypeScript 5.9 (strict)
- Tailwind CSS v4 (`@tailwindcss/vite`, sin `tailwind.config`; tokens en `src/styles/index.css` vía `@theme`)
- GSAP 3.15 (ticker del motor) · Lenis (smooth scroll) · `motion` (revelados + varios React Bits)
- Fuentes self-hosted (`@fontsource`, **sólo subset latin**): Anton (display), Space Grotesk (texto y `label-px`), Pixelify Sans (`osd`, sólo ≥ 1rem), Caveat Brush (mano)
- Vitest para la lógica pura

## Comandos
```bash
npm run dev       # http://localhost:5190
npm run build     # tsc --noEmit + vite build
npm run test      # vitest run
npm run images    # capturas + arte de imagenes-generadas/ → public/img (sharp, halftone horneado)
npm run images:art # sólo el arte (sin la carpeta de capturas)
npm run icons     # íconos pixel de la Guía → src/art/tech-icons.ts (simple-icons a 20×20)
npm run cv        # CV → public/cv/*.pdf (Chrome headless; CHROME_PATH si no está en la ruta de Windows)
```

## Arquitectura
```
src/
  styles/index.css   tokens semánticos (@theme) + dawn para el primer paint, utilidades brutal-*, display-shadow
  i18n/              es.ts / en.ts (en.ts tipado contra es) + LangContext (useLang, tr())
  content/           profile.ts (perfil + skills), projects.ts: datos reales, textos {es,en}
  world/             stations.ts (matemática pura + test), moods.ts (fuente de verdad de colores + test de contraste),
                     World.tsx (World = escenario + cámara + Lenis + snap · Station · Layer · useStation)
  scenes/            Senal(CH01 TV) Quien(02 collage) Guia(03) Canales(04 Sistemas / 05 Webs: ProjectGroupScene + zapping) Ajuste(06) Contacto(404); FlatStory = sin motion
  art/index.tsx      SVG propios: Star, Sparkle, Scribble, Arrow, ColorBars
  components/        ui.tsx (primitivas + ChannelLabel/DisplayTitle), Reveal.tsx (RevealWords/Rise atados al progreso),
                     TvFrame (bisel + panel/tira con los controles), Backdrop (vidrio: grano, scanlines, estática, OSD), Chrome (TvFrame + salto de #/p inválido), Loader (la tele se enciende en el hueco), CaseScroll (<dialog> + #/p/<id>)
scripts/             optimize-images.mjs + halftone.mjs (lógica pura + test)
imagenes-generadas/  fuentes del arte (set animado); no se sirven ni se versionan (55 MB, sólo locales: respaldarlas aparte)
  components/bits/   React Bits vendorizado y adaptado (código nuestro, se puede editar)
```
**Cómo funciona la profundidad:** un div espaciador alto da scroll nativo. En cada tick de GSAP, el scroll de Lenis → `u` (unidades de estación) → `cameraZ` → cada `Layer` recibe `translate3d(0,0,z)` + opacidad. Las capas son hijas **directas** del `<main>` con `preserve-3d`: cualquier wrapper intermedio (incluso `display:contents`) aplana el 3D. `depth` aleja la capa y se compensa su escala, así en reposo se ve al tamaño diseñado; `speed < 1` = parallax lento. Tipos de capa: `content` (interactiva), `scenery`, `gate` (visibles de lejos y se cruzan: el marco de la TV). Las escenas leen su progreso con `useStation()` / `useProgress()` (MotionValue, 0.5 = centrada), **nunca** el scroll de la ventana.

**Estaciones con peso:** `StationDef.stops` (grupos de proyectos = 4) da peso de scroll `1 + (stops−1)·0.6`. `normP` normaliza el progreso para que llegada/salida midan igual que en una estación normal y la meseta [.35,.65] se estire; el MotionValue de cada estación ya viene normalizado. `stopP`/`snapTarget` hacen snap a cada proyecto; `goTo(i, immediate, stop)`. `groupS` + `zap` dan proyecto actual y `cut` 0→1 del zapping (el CRT se cierra en una línea con `scaleY`, estática, se enciende el siguiente).

**Rendimiento:** las estaciones se montan al quedar a ±2 de la cámara (`MOUNT_RANGE`) y **no se desmontan** (volver atrás no reinicia nada; lo que tenga que correr siempre, como el salto de `#/p` inválido, va en `Chrome`); el frame no hace nada si la cámara no se movió; sin WebGL; FuzzyText sólo anima con su canal activo; el halftone/duotono está **horneado** (`npm run images`): un filtro en vivo se recalcula en cada repintado; la estática es un SVG rasterizado como fondo y se oculta (`visibility`) fuera del zapping.

**Gotchas 3D:** el `<main>` preserve-3d lleva `pointer-events-none` (su caja en z=0 tapaba los clics a capas con z<0); dentro de una capa nunca usar `visibility: visible` explícito (pisa el hidden de capas lejanas), usar `inherit`; el contenido que pasa la cámara se apaga entre z 40→240 para que al retroceder no aparezca gigante.
**Sin movimiento:** `prefers-reduced-motion` o `?motion=off` → `FlatStory` (todas las escenas en flujo vertical, todo el contenido en el DOM). Hay skip link y enlace en el footer.
**La TV es la ventana:** `.tv-screen` (fijo, en el hueco del bisel) es el contenedor 3D del `World`, el vidrio de `Backdrop` y el `Loader`. `cut(i, stop)` del `World` = salto instantáneo + suma `cuts`, que es la key del destello y del OSD; los controles, CTAs y paginador usan `cut`, el foco por teclado usa `goTo` (suave). El hero (`SenalContent`) es una `@container` que ocupa la capa, con tamaños `min(cqw, cqh)`.
**Debug (sólo dev):** `window.__goTo(i, true, stop)` salta a la estación i (parada `stop`); `window.__lenis` es la instancia de Lenis (`.stop()` congela el snap para inspeccionar un cuadro).

## Reglas
1. **Solo tokens semánticos** en componentes (`bg-surface`, `text-ink`, `border-line`, `text-accent`, `text-glow`, `bg-paper`…). Los primitivos (`P` en `moods.ts`) solo se usan en `moods.ts`, `index.css` y `scripts/`. Nada de hex sueltos en TSX, salvo props de color de componentes WebGL, que se leen con `cssVar()` desde los tokens.
2. **No inventar datos:** ni métricas, ni clientes, ni testimonios, ni demos. Si falta un dato, va a "Pendientes" en CONTEXT.md.
3. Román es **estudiante** de Analista de Sistemas. Nunca presentarlo como egresado: "Analista de Sistemas" siempre con "estudiante" o "en formación".
4. Todo texto visible pasa por `i18n` o por `content/*` con `{ es, en }`. Sin strings sueltos en las escenas.
5. **Versiones exactas** en package.json (sin `^` ni `latest`).
6. Cada efecto respeta `prefers-reduced-motion`: el `App` monta `FlatStory` en vez del `Stage`.
7. Sin WebGL por ahora (como máximo uno, lazy). Los canvas animados (FuzzyText) sólo corren con su canal activo. Lo pesado va lazy o en idle.
8. Accesibilidad: el contenido real está en el DOM (no en canvas). El foco dentro de una estación mueve la cámara hasta ella. Los botones son `<button>` o `<a>` y el nombre accesible contiene el texto visible.
9. Texto corrido sobre arte → `brutal-panel`; títulos display → `DisplayTitle` (Anton inclinado + `glow-text`). Display sólo para textos cortos.

## Agregar un componente de React Bits
```bash
# lo baja del registro oficial y lo escribe en src/components/bits/
curl -s https://reactbits.dev/r/<Name>-TS-TW.json   # leé files[].content y dependencies
```
(`npx shadcn@latest add https://reactbits.dev/r/<Name>-TS-TW.json` también funciona con el `components.json` del repo.) Instalá sus dependencias con versión exacta. Si usa ScrollTrigger o `useScroll` sobre su propio elemento, no funciona dentro del mundo 3D: adaptalo para que reciba `progress`/`active` de la estación (ver `Reveal.tsx`). Si usa colores hex, pasale tokens (`var(--color-*)` o `MOODS`).

En uso: CircularText, CountUp, DecryptedText, FuzzyText, GlitchText (raíz `<span>` para ir en `<h1>`), Magnet y ScrollVelocity.

## Verificación antes de dar algo por terminado
`npm run build` sin errores y `npm run test` en verde. Revisión en el navegador a 1440×900 y 390×844 con la consola limpia (si la ventana no se achica, sirve un iframe de 390px). `?motion=off` tiene que leerse completo. Lighthouse mobile sobre `npm run preview` (`npx -y lighthouse@13.5.0 http://localhost:4173/ --form-factor=mobile`); estado al 2026-11-08: performance 90 (FCP 2.0 s, LCP 3.2 s = la tira mobile; el bisel y el fondo de la tira van estáticos en `index.html` para no esperar al JS, no moverlos a React), accesibilidad 100, buenas prácticas 100, SEO 100. Para verificar botones: `elementFromPoint` en el centro de cada botón visible de la estación activa.
