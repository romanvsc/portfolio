# CLAUDE.md — Portfolio v2 「道 MICHI」

Portfolio personal de **Román Vogel Corach**. Un viaje en profundidad (eje Z) hacia un bosque, cruzando portales torii. Estética oriental + neobrutalismo.
Antes de tocar diseño, leé **DESIGN.md**. Antes de tocar textos o proyectos, leé **CONTEXT.md**.

## Stack
- Vite 8 + React 19 + TypeScript 5.9 (strict)
- Tailwind CSS v4 (`@tailwindcss/vite`, sin `tailwind.config`; tokens en `src/styles/index.css` vía `@theme`)
- GSAP 3.15 (ticker del motor, StaggeredMenu) · Lenis (smooth scroll) · `motion` (revelados + varios React Bits)
- Fuentes self-hosted: Dela Gothic One, Zen Kaku Gothic New y JetBrains Mono (`@fontsource`, **sólo subset latin**) + Yuji Syuku recortada a los glifos usados (`src/assets/fonts/yuji-syuku-subset.woff2`)
- Vitest para la lógica pura

## Comandos
```bash
npm run dev       # http://localhost:5190
npm run build     # tsc --noEmit + vite build
npm run test      # vitest run
npm run images    # optimiza capturas/retrato a public/img (sharp)
```

## Arquitectura
```
src/
  styles/index.css   tokens semánticos (@theme) + dawn para el primer paint, utilidades brutal-*, display-shadow
  i18n/              es.ts / en.ts (en.ts tipado contra es) + LangContext (useLang, tr())
  content/           profile.ts (perfil + skills), projects.ts: datos reales, textos {es,en}
  world/             stations.ts (matemática pura + test), moods.ts (fuente de verdad de colores),
                     World.tsx (World = escenario + cámara + Lenis + snap · Station · Layer · useStation)
  scenes/            Gate(門) Path(道) Dojo(技) ToriiTunnel(仕 Sistemas / 網 Webs: ProjectGroupScene + KatanaDeck) Forest(森) Shrine(縁); FlatStory = sin motion
  art/index.tsx      SVG propios: Torii, Mountains, Bamboo, Enso, Hanko, Branch, Leaves, Contours, Seigaiha
  components/        ui.tsx (primitivas brutal), Reveal.tsx (RevealWords/Rise atados al progreso),
                     Backdrop, Chrome (menú + idioma + barra de kanji), Loader, CaseScroll (<dialog> + #/p/<id>)
  components/bits/   React Bits vendorizado y adaptado (código nuestro, se puede editar)
```
**Cómo funciona la profundidad:** un div espaciador alto da scroll nativo. En cada tick de GSAP, el scroll de Lenis → `u` (unidades de estación) → `cameraZ` → cada `Layer` recibe `translate3d(0,0,z)` + opacidad. Las capas son hijas **directas** del `<main>` con `preserve-3d`: cualquier wrapper intermedio (incluso `display:contents`) aplana el 3D. `depth` aleja la capa y se compensa su escala, así en reposo se ve al tamaño diseñado; `speed < 1` = parallax lento. Tipos de capa: `content` (interactiva), `scenery`, `gate` (torii, visibles de lejos → túnel). Las escenas leen su progreso con `useStation()` / `useProgress()` (MotionValue, 0.5 = centrada), **nunca** el scroll de la ventana.

**Estaciones con peso:** `StationDef.stops` (grupos de proyectos = 4) da peso de scroll `1 + (stops−1)·0.6`. `normP` normaliza el progreso para que llegada/salida midan igual que en una estación normal y la meseta [.35,.65] se estire; el MotionValue de cada estación ya viene normalizado. `stopP`/`snapTarget` hacen snap a cada proyecto; `goTo(i, immediate, stop)`. `groupS` + `slash` dan proyecto actual y `cut` 0→1 del corte de katana (dos copias de la placa con clip-path complementario + pincelada SVG).

**Rendimiento:** las estaciones se montan al quedar a ±2 de la cámara (`MOUNT_RANGE`) y **no se desmontan** (volver atrás no reinicia nada); el frame no hace nada si la cámara no se movió; LightRays se crea 900 ms después del primer render; el retrato en duotono está **horneado** (`npm run images` → `roman-duo.webp`): un filtro SVG en vivo se recalculaba en cada repintado.

**Gotchas 3D:** el `<main>` preserve-3d lleva `pointer-events-none` (su caja en z=0 tapaba los clics a capas con z<0); dentro de una capa nunca usar `visibility: visible` explícito (pisa el hidden de capas lejanas), usar `inherit`; el contenido que pasa la cámara se apaga entre z 40→240 para que al retroceder no aparezca gigante.
**Sin movimiento:** `prefers-reduced-motion` o `?motion=off` → `FlatStory` (todas las escenas en flujo vertical, todo el contenido en el DOM). Hay skip link y enlace en el footer.
**Debug (sólo dev):** `window.__goTo(i, true, stop)` salta a la estación i (parada `stop`); `window.__lenis` es la instancia de Lenis (`.stop()` congela el snap para inspeccionar un cuadro).

## Reglas
1. **Solo tokens semánticos** en componentes (`bg-surface`, `text-ink`, `border-line`, `text-accent`…). Los primitivos (`sumi-*`, `jade-*`…) solo se usan dentro de `index.css`. Nada de hex sueltos en TSX, salvo props de color de componentes WebGL, que se leen con `cssVar()` desde los tokens.
2. **No inventar datos:** ni métricas, ni clientes, ni testimonios, ni demos. Si falta un dato, va a "Pendientes" en CONTEXT.md.
3. Román es **estudiante** de Analista de Sistemas. Nunca presentarlo como egresado.
4. Todo texto visible pasa por `i18n` o por `content/*` con `{ es, en }`. Sin strings sueltos en las escenas.
5. **Versiones exactas** en package.json (sin `^` ni `latest`).
6. Cada efecto respeta `prefers-reduced-motion`: el `App` monta `FlatStory` en vez del `Stage`.
7. Un solo canvas WebGL de fondo (LightRays: komorebi de día, luna de noche). Lo pesado va lazy o en idle. Topography se probó y se descartó (satura a blanco).
8. Accesibilidad: el contenido real está en el DOM (no en canvas). El foco dentro de una estación mueve la cámara hasta ella. Los botones son `<button>` o `<a>` y el nombre accesible contiene el texto visible.
9. Texto corrido sobre arte → `brutal-panel`; títulos display → `display-shadow` (si no, se funden con la tinta negra de los torii).

## Agregar un componente de React Bits
```bash
# lo baja del registro oficial y lo escribe en src/components/bits/
curl -s https://reactbits.dev/r/<Name>-TS-TW.json   # leé files[].content y dependencies
```
(`npx shadcn@latest add https://reactbits.dev/r/<Name>-TS-TW.json` también funciona con el `components.json` del repo.) Instalá sus dependencias con versión exacta. Si usa ScrollTrigger o `useScroll` sobre su propio elemento, no funciona dentro del mundo 3D: adaptalo para que reciba `progress`/`active` de la estación (ver `Reveal.tsx`). Si usa colores hex, pasale tokens (`var(--color-*)` o `MOODS`).

En uso: CircularText, CountUp, DecryptedText, GradualBlur, LightRays, Magnet, Noise, Ribbons, ScrollVelocity y StaggeredMenu (adaptado: i18n, `onItemClick`, logo como nodo, colores semánticos).

## Verificación antes de dar algo por terminado
`npm run build` sin errores y `npm run test` en verde. Revisión en el navegador a 1440×900 y 390×844 con la consola limpia (si la ventana no se achica, sirve un iframe de 390px). `?motion=off` tiene que leerse completo. Lighthouse mobile sobre `npm run preview`; estado al 2026-10-17: performance ~70 (LCP 3.2 s; el resto es el render inicial + WebGL por software del Lighthouse headless), accesibilidad 100, buenas prácticas 100, SEO 100. Para verificar botones: `elementFromPoint` en el centro de cada botón visible de la estación activa.
