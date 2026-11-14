# DESIGN.md — 「SEÑAL」 la TV es la ventana

## 1. Concepto
Román es un canal. **La TV es la ventana**: el bisel enmarca el navegador, el panel de la derecha (tira abajo en mobile) tiene los controles y el contenido vive en la pantalla. El scroll viaja en Z por los canales; los controles cambian de canal con un **corte** (salto instantáneo + estática + OSD), no con scroll. Cierra con "SEÑAL PERDIDA", que es el contacto.
Todo se lee como un sistema que transmite (versión `ver.2026.11`, OSD `CANAL 03`, guía de programación, carta de ajuste), porque Román es analista de sistemas **en formación**: nunca "Analista de Sistemas" sin "estudiante" o "en formación".

Referencias: `ref1.jpg` (TV, título condensado inclinado, stickers, avatar en halftone asomando), `ref2.jpg` (404 pixel con glow naranja, personaje cayendo), `ref4.jpg` (collage de papel violeta, borde rasgado, anteojos que reflejan texto, doodles).

**Tensión estética: pantalla y papel.** La pantalla (fósforo, scanlines, pixel, glow) muestra; el papel (collage, halftone, cinta, stickers, doodles a mano) cuenta.

## 2. Canales (estaciones en Z)
| # | CH | id | Mood | Qué pasa | React Bits |
|---|---|---|---|---|---|
| 0 | — | loader | fosforo | Encendido del CRT: línea → cuadro, estática, ROMÁN se descifra, "Sintonizando…" | DecryptedText |
| 1 | 01 | senal | fosforo | Hero: la pantalla de la TV con stickers, nombre, avatar en halftone, pitch + CTAs (cortan de canal), barra con versión y redes | GlitchText (hover del nombre) |
| 2 | 02 | quien | uva | Collage: manifiesto (RevealWords), "desde Misiones" a mano, datos con cinta, tira rasgada con los ojos y "Sistemas"/"Web" en las lentes | — |
| 3 | 03 | guia | fosforo | Stack como guía de programación (grilla), banda de tecnologías detrás | ScrollVelocity |
| 4 | 04 | sistemas | fosforo | 4 emisiones con snap. Captura en mini CRT + ficha (Rol/Stack/Estado). Cambio = **zapping**: el CRT se cierra en una línea, estática, se enciende el siguiente | — |
| 5 | 05 | webs | brasa | Igual, con los 4 sitios | — |
| 6 | 06 | ajuste | uva | Carta de ajuste: barras en la tríada + números reales | CountUp |
| 7 | 404 | contacto | brasa | Señal perdida: avatar cayendo, HABLEMOS en pixel con glow, mail, redes, footer. También recibe `#/p/<id>` inexistentes | FuzzyText, Magnet |

Siempre activos: TvFrame (bisel 9-slice, placa ROMÁN, panel con perilla de canal + marcas 01…404, CH▲/CH▼, perilla de idioma y sticker giratorio sobre el parlante; en mobile tira con CH▼/display/CH▲/idioma), y en el vidrio (`Backdrop`): Noise, scanlines 20%, viñeta, estática en cada cambio de canal y OSD que aparece 2.4 s.
Descartados: StaggeredMenu y el selector lateral (los reemplazan los controles de la TV), GradualBlur (ensuciaba la barra del hero), LightRays y Ribbons (otro concepto), PixelTransition (es por hover; el zapping va atado al scroll), Topography, ScrollReveal/Shuffle (dependen del scroll de la ventana).

## 3. Color: tríada 150° / 30° / 270°
Reparto 60/30/10: **uva** (violeta) de base, **fósforo** (verde) como marca, **brasa** (naranja) como señal.

### Primitivos (sólo en `moods.ts` → `P` e `index.css`)
| Familia | 950 | 900/800 | 500 | 300 |
|---|---|---|---|---|
| fósforo | `#04140E` | `#0E3B2A` | `#1FC27A` | `#7CF0B4` |
| brasa | `#2A0E04` | `#4A1A08` / `#B33A0B` | `#FF6A1F` | `#FFB27A` |
| uva | `#120A22` | `#2A1C4A` | `#7B5CF5` | `#B9A7FF` |
| neutros | tinta `#0B0812` | papel-200 `#E6D8BF` | | papel-50 `#F5ECDC` |

`uva-500` no va como texto (≈4.3:1 sobre oscuro).

### Semánticos (lo único que usan los componentes)
`surface` · `surface-raised` · `ink` · `ink-muted` · `line` · `shadow` · `accent` · `accent-alt` · `pop` · `on-accent` · `glow` · `paper` · `on-paper`

| Semántico | fosforo | uva | brasa |
|---|---|---|---|
| surface / raised | fósforo-950 / 800 | uva-950 / 800 | brasa-950 / 900 |
| ink / ink-muted | papel-50 / `#A8D9C2` | papel-50 / `#C9BEE6` | papel-50 / `#F2C3A3` |
| accent | fósforo-500 | fósforo-500 | brasa-500 |
| accent-alt | brasa-500 | uva-300 | fósforo-300 |
| pop | uva-300 | brasa-500 | uva-300 |
| glow | fósforo-300 | uva-300 | brasa-300 |
| line / shadow | tinta / tinta | tinta / tinta | tinta / brasa-800 |
| on-accent, paper, on-paper | tinta, papel-50, tinta | ← | ← |

Fuente de verdad: `src/world/moods.ts`. `moods.test.ts` valida WCAG AA de todos los pares texto/fondo en los tres moods. El mood activo se tweenea con GSAP sobre `:root`; en FlatStory se aplica con `moodVars()`.

## 4. Tipografía
| Rol | Fuente | Notas |
|---|---|---|
| Display | **Anton** | Mayúsculas, `-skew-x-6` como ref1. Sólo textos cortos (ver vault: `Errores/tipografia-display-en-texto-largo.md`) |
| Texto | **Space Grotesk** | 400/700 |
| Pixel | **Pixelify Sans** | utilidad `osd`, **sólo ≥ 1rem**: OSD, números de canal, "CH 0X", HABLEMOS. Las etiquetas chicas (`label-px`) van en Space Grotesk 700 mayúscula: el pixel chico no se leía |
| Mano | **Caveat Brush** | Anotaciones del collage |

Display-xl `clamp(3.6rem, 12.5vw, 12rem)`, display-l `clamp(2.4rem, 7vw, 6.5rem)`. Dentro de la TV los tamaños van en `cqw/cqh` (la pantalla es `@container`).

## 5. Bloques
- `brutal-border` 3px `line`, `brutal-shadow` 6px sin blur, `brutal-press` (hover sube, active se hunde), `brutal-panel` (texto sobre arte)
- `sticker`: papel, borde, radio 0.6rem, girado. Radios: sólo stickers, CRT y botones de canal
- `glow-text`: brillo de fósforo en títulos de pantalla
- `hatch` (rayado diagonal), `scanlines`, `crt-vignette`, `static-noise` (estática SVG rasterizada, no filtro en vivo), `paper-bg` (papel gris teñido por el mood), `torn-down`/`torn-up` (máscaras de papel rasgado, toman `currentColor`)

## 6. Arte
- Avatar ilustrado de Román, **set animado** en `imagenes-generadas/`. `npm run images` hornea halftone + duotono con la rampa del mood (`scripts/halftone.mjs`, testeado) a `public/img/senal/`: `peek` (fósforo), `eyes` (uva), `falling` (brasa); `sticker`, `tv`, `paper`, `torn-*`, `tape`, favicon y `og.jpg`
- Hueco de la pantalla en `tv.webp` (medido sobre el alfa): 8% izq, 21.1% der, 10.9% arriba, 13.7% abajo
- SVG propios (`src/art`): Star, Sparkle, Scribble, ColorBars. Colores por `currentColor`
- **Marco** (`TvFrame`, `.tv-bezel/.tv-panel/.tv-strip/.tv-screen` en `index.css`): `tv-bezel.png` exportado a 1800×1200, `border-image` con slices 300/315/360/315 (más grandes que el bisel para que los arcos de las esquinas queden enteros). `--bz` = bisel visible a los lados; hueco arriba 0.83·bz, abajo 1.37·bz. Desktop: panel `clamp(150px, 15vw, 240px)`; mobile: bz 10px y tira `100vw/6.15`. Perilla: arco de 270°, la marca de `knob-dial` está a ~40° de las 12
- **Íconos de la Guía:** logos de simple-icons rasterizados a 20×20 (`npm run icons` → `src/art/tech-icons.ts`); MySQL e IndexedDB usan un cilindro dibujado a mano

## 7. Movimiento
- El scroll manda (scrub). Snap a canales 0.7 s; zapping atado al progreso del grupo
- Cambio de canal: destello de estática 0.45 s que termina (no queda repintando)
- Loader: la tele se enciende dentro del hueco (línea → cuadro, estática, ROMÁN se descifra), ≤ 2.4 s, se salta con click, tecla o scroll
- Entrada del hero: `.enter` + `--d/--from-y/--from-r` (stagger), espera a que el Loader quite `data-loading` de `<html>`; fill `backwards` para no pisar el hover
- Papel en hover: stickers y tarjetas con cinta se enderezan y suben 2 px; `brutal-press` también en `:focus-visible`
- `prefers-reduced-motion` / `?motion=off` → `FlatStory`

## 8. Layout
- Contenido máx. 1200–1300px, 16px de margen en mobile
- Hero mobile (pantalla vertical): stickers arriba, nombre, pitch en el medio y avatar abajo; la barra sólo en desktop. Contacto mobile sin el párrafo
- Tira de ojos: `--w` 170vw en mobile, 100vw en desktop; alto `min(0.2·w, 36vh)`
