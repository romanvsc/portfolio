# DESIGN.md — 「道 MICHI」 el camino hacia el bosque

## 1. Concepto
**ロマン (Roman):** en japonés, *roman* es la búsqueda de un ideal, el espíritu de aventura. El nombre de Román ya es un concepto.
El sitio es un **viaje hacia adentro**: no se baja por una página, se camina hacia el fondo de un bosque cruzando portales **torii** (como el túnel Senbon Torii de Fushimi Inari). Cada portal es un capítulo.
Tiene sentido con su trabajo: buena parte de sus clientes son forestales (Garuhapé, Forestal Paraguay, Indufor), así que el bosque no es un decorado, es su terreno.

**Tensión estética: tinta y concreto.** Lo orgánico del sumi-e (pincelada, enso, niebla, hojas) choca con bloques **neobrutalistas** (bordes gruesos, sombras duras, chips mono, grillas visibles). Ninguno de los dos domina: el pincel dibuja el paisaje y el concreto sostiene la información.

**La luz cuenta la historia.** Se entra al **amanecer** (washi claro, como la referencia del samurái), se avanza hacia el **bosque** (musgo) y se termina de **noche** (sumi con brillo wakaba). No hay toggle claro/oscuro: el modo es el viaje.

Referencia visual: ilustración plana tipo "samurái frente al sol" (sol grande, siluetas planas, montañas en capas, ramas en las esquinas, partículas). El sol rojo se vuelve un **enso jade**.

## 2. Capítulos (estaciones en Z)
| # | Kanji | Nombre | Mood | Qué pasa | React Bits |
|---|---|---|---|---|---|
| 0 | 序 | Jo, preludio | dawn | Loader: gota de tinta, ロマン se descifra en ROMÁN, se dibuja el enso | DecryptedText |
| 1 | 門 | Mon, portal | dawn | Hero: enso jade gigante con el retrato en **duotono verde suave** (horneado; hover revela la foto a color en un círculo), primer torii, montañas, bambú, hojas cayendo, nombre en display y sello hanko girando | CircularText, Magnet |
| 2 | 道 | Michi, camino | dawn | Sobre mí: manifiesto que se revela palabra por palabra con el avance (`RevealWords`), qué significa ロマン, tarjetas-dato a distintas profundidades | — (Reveal propio) |
| 3 | 技 | Waza, técnica | forest | Skills: muro de **ema** (tablillas votivas) colgando a distintas profundidades; bandas de tecnologías detrás | ScrollVelocity |
| 4 | 仕 | Shi (仕組み, sistema) | forest | **Sistemas**: un portal, 4 proyectos (壱…肆). Al scrollear, un **corte de katana** (pincelada de tinta diagonal) parte la placa en dos mitades que caen y aparece la siguiente; paginador de numerales; snap por proyecto. Click → caso de estudio desenrollado como makimono | — |
| 5 | 網 | Ami (red, web) | forest | **Webs**: igual que Sistemas, con 伍…捌 | — |
| 6 | 森 | Mori, bosque | forest | Bosque profundo: arboleda de bambú en 3 profundidades, el komorebi llega al máximo; números reales | LightRays, CountUp |
| 7 | 縁 | En, vínculo | night | Contacto: santuario de noche, curvas de nivel (SVG `Contours`), enso, torii brillante, gran CTA del mail, links, firma con hanko | Magnet, LightRays (luna) |

Siempre activos: LightRays (única capa WebGL de fondo; intensidad por estación, luna tenue en 縁), Noise (grano de washi), GradualBlur (profundidad de campo en bordes), Ribbons (rastro de tinta en el cursor, solo con puntero fino), StaggeredMenu (navegación por kanji) + barra de progreso de kanji a la derecha.
Descartados:
- PixelSnow: el pixel-art choca con el estilo.
- Topography: satura a blanco con el bloom aditivo; lo reemplaza `Contours` en SVG.
- ScrollReveal y Shuffle: dependen del scroll de la ventana; los reemplaza `Reveal.tsx`.
- LogoLoop, y Lanyard por presupuesto de rendimiento.
- Cursores múltiples.

## 3. Color
### Primitivos (solo dentro de `index.css`)
| Token | Hex | Uso |
|---|---|---|
| sumi-950 | `#070A08` | negro tinta |
| sumi-900 | `#0D120F` | superficies de noche |
| sumi-800 | `#16201A` | superficie elevada de noche |
| moss-700 | `#1E3B2B` | bosque profundo |
| jade-600 | `#1F7A55` | acento sobre claro |
| jade-500 | `#2E9E6E` | enso / sol |
| matcha-300 | `#A8D672` | acento suave |
| wakaba-200 | `#D4F28C` | hoja nueva, acento brillante de noche |
| washi-50 | `#F4F2EA` | papel |
| washi-100 | `#E8E5D8` | papel elevado |

### Semánticos (lo único que usan los componentes)
`surface` · `surface-raised` · `ink` · `ink-muted` · `line` · `shadow` · `accent` · `accent-bright` · `on-accent` · `sun` · `mist`

### Moods
| Semántico | dawn (amanecer) | forest (bosque) | night (noche) |
|---|---|---|---|
| surface | washi-50 | moss-700 | sumi-950 |
| surface-raised | washi-100 | `#25483A` | sumi-800 |
| ink | sumi-950 | washi-50 | washi-50 |
| ink-muted | `#3A4A40` | `#C9D4C4` | `#A9B5AC` |
| line | sumi-950 | sumi-950 | wakaba-200 |
| shadow | sumi-950 | sumi-950 | jade-500 |
| accent | jade-600 | matcha-300 | wakaba-200 |
| accent-bright | jade-500 | wakaba-200 | wakaba-200 |
| on-accent | washi-50 | sumi-950 | sumi-950 |
| sun | jade-500 | jade-500 | jade-600 |
| mist | washi-100 | `#2B5240` | sumi-800 |

Fuente de verdad: `src/world/moods.ts`. El mood activo se interpola con un tween de GSAP sobre las variables de `:root` cuando cambia la estación. En secciones sueltas (FlatStory) se aplica con `moodVars()`, que emite también `--color-*`, porque Tailwind las resuelve en `:root`. Todos los pares texto/fondo cumplen WCAG AA en los tres moods. `ink-muted` sobre `surface` está pensado para ≥ 4.5:1.

## 4. Tipografía
| Rol | Fuente | Notas |
|---|---|---|
| Display | **Dela Gothic One** | Pesada, con glifos latinos y japoneses; nombre, títulos de capítulo, numerales. Mayúsculas, tracking −0.02em |
| Texto | **Zen Kaku Gothic New** | Párrafos y UI, 400/700 |
| Pincel | **Yuji Syuku** | Solo kanji y kana decorativos, `aria-hidden`. El archivo está recortado a los glifos usados: si agregás uno nuevo, regenerá el subset (ver comentario en `index.css`) |
| Etiquetas | **JetBrains Mono** | Chips, metadatos, numeración. Mayúscula y tracking +0.08em |

Escala fluida con `clamp()`: display-xl `clamp(3.5rem, 11vw, 11rem)`, display-l `clamp(2.5rem, 6vw, 5.5rem)`, h3 `clamp(1.5rem, 2.4vw, 2.25rem)`, cuerpo `1.0625rem/1.65`.

## 5. Neobrutalismo
- Borde: `3px solid var(--color-line)` (`.brutal-border`)
- Sombra dura: `6px 6px 0 var(--color-shadow)`, sin blur (`.brutal-shadow`)
- Radios: **cero**. Las únicas excepciones son los círculos (enso, sello, botones redondos)
- Hover interactivo: `translate(-2px,-2px)` con sombra `8px 8px`. Active: `translate(4px,4px)` con sombra `2px` (se hunde)
- Chips: mono, mayúscula, borde de 2px, fondo `surface-raised`
- Paneles: fondo `surface-raised`, borde y sombra, encabezado con banda `accent` donde va el numeral kanji
- Grilla visible en las placas (líneas de 1px de `line` al 15%) que evoca madera o concreto
- `brutal-panel`: todo texto corrido que cae sobre arte va en un bloque con fondo `surface`, borde y sombra
- `display-shadow`: los títulos display llevan una sombra dura en `accent` para separarse de la tinta negra de los torii

## 6. Arte (SVG propios en `src/art/`)
Formas planas, sin degradados, siluetas como la referencia:
- **Torii:** dos pilares, kasagi curvo y nuki. Color `ink` con detalle `accent`
- **Montañas:** 3 o 4 capas de polígonos con niebla (`mist`) entre ellas
- **Bambú:** tallos verticales con nudos y hojas lanceoladas, en los bordes
- **Enso:** círculo de pincel abierto (`feTurbulence` + `feDisplacementMap` para el borde roto), en `sun`
- **Hanko:** sello circular o cuadrado con ロマン vertical
- **Hojas:** 6 a 10 hojas de bambú cayendo con CSS (rotación y deriva), desactivadas con reduced-motion
- **Seigaiha:** patrón de olas de fondo al 6–10% de opacidad (paneles, caso de estudio)
- **Contours:** curvas de nivel concéntricas e irregulares (montaña vista desde arriba), fondo de 縁
- **Branch:** ramas de tinta fractales en las esquinas superiores del hero (como en la referencia)

## 7. Movimiento
- El scroll manda: casi todo es *scrub*, nada de autoplay largo
- Entradas: `power3.out`. Cruce de portal: `expo.inOut`. Snap a estaciones: 0.6 s
- Profundidad: la opacidad y la escala dependen de la distancia a la cámara. Lo que pasa detrás de la cámara se desvanece en 300 unidades
- Loader ≤ 2.2 s y se puede saltar (click, tecla o scroll)
- `prefers-reduced-motion`: `FlatStory` muestra las mismas escenas en flujo vertical, sin WebGL, sin cursor y sin hojas

## 8. Layout por estación
- Contenedor de contenido: máximo 1200px, con 16px de margen en mobile
- El kanji de capítulo va enorme (Yuji Syuku, 30–40vh) al 8% de opacidad detrás del contenido
- Las etiquetas de capítulo usan la forma `門 · 01 / MON`
- Mobile (<768px): menos capas por estación, placas a ancho completo, sin Ribbons, LightRays con `maxDevicePixelRatio: 1`
