# Design QA — Rosehot, retrato rectangular e iconos del header

Fecha: 2026-09-18

## Evidencia

- Source visual truth: `conversation://current-turn/second-reference-image` — segunda imagen de referencia entregada por el usuario, 549×574 px. El cliente de chat no expone una ruta local para este adjunto.
- Contexto adicional: primera captura del mismo mensaje, 1863 px de ancho, utilizada para conservar la estructura editorial existente del hero.
- Implementación desktop: `design-qa-evidence/implementation-desktop-1863x764.png`.
- Implementación mobile: `design-qa-evidence/implementation-mobile-390x844.png`.
- Ruta revisada: `/`, hero en estado inicial después de completar la animación de entrada.
- Desktop: screenshot 1863×764 px, viewport CSS 1863×764, DPR 1; ancho útil 1848 px por scrollbar.
- Mobile: screenshot 390×844 px, viewport CSS 390×844, DPR 1; ancho útil 375 px por scrollbar.
- No fue necesario normalizar densidad: ambas capturas de implementación están a DPR 1. La referencia de 549×574 es un recorte compositivo, no una captura del mismo viewport; se comparó jerarquía, solapamiento y tratamiento de imagen, no correspondencia píxel a píxel del marco completo.

## Comparación final

### Full view

La implementación mantiene el hero editorial existente y adopta los rasgos seleccionados de la segunda referencia: fotografía rectangular opaca, bloque naranja detrás de la esquina superior izquierda, bloque oscuro detrás de la zona inferior izquierda y `VOGEL.` cruzando por delante. No quedan viñetas, feathering, halos ni máscaras de silueta.

El header conserva el wordmark y sus cinco opciones visibles. Los iconos casa, página, código, persona y sobre aparecen en el orden y enlace correctos, sin fondos rectangulares y sin aumentar excesivamente la densidad del encabezado.

### Focused regions

- Hero desktop: el rostro queda despejado, el recorte rectangular es intencional y los bloques no tapan facciones ni copy.
- Hero mobile: `ROMÁN`, `VOGEL.`, foto y bloques mantienen la misma jerarquía a 390 px y 320 px.
- Header desktop/mobile: los cinco SVG cargan con sus dimensiones naturales, paleta original y canvas transparente. En mobile cada enlace conserva 58 px de alto y entre 54 y 67 px de ancho útil.

## Superficies de fidelidad

- Fonts and typography: Rosehot se usa en el nombre, wordmark, títulos y etiquetas editoriales; Manrope continúa en cuerpo y DM Mono en navegación/metadata. Rosehot tiene un trazo más fino y elegante que Mileast, pero conserva el solapamiento de `VOGEL.` y no produce wrapping accidental.
- Spacing and layout rhythm: foto y bloques forman una unidad compacta en desktop, tablet y mobile. Se revisaron 1863×764, 1000×800, 390×844 y 320×720; no existe overflow horizontal.
- Colors and tokens: los bloques usan `--color-brand` y `--color-ink`; los valores computados coinciden con los tokens. No se incorporaron colores literales a componentes.
- Image quality and asset fidelity: `roman.webp` permanece sin alteraciones y se muestra como fotografía raster rectangular. Los cinco iconos son trazados SVG derivados del PNG entregado, sin raster embebido, rectángulos de fondo ni halos visibles.
- Copy and content: etiquetas de navegación y copy del hero permanecen sin cambios de contenido.
- Accessibility and behavior: los textos de los enlaces siguen visibles; los iconos son decorativos (`alt=""`, `aria-hidden="true"`); foco visible de 3 px comprobado; los cinco targets mobile superan 44×44 px; reduced motion conserva las reglas existentes.

## Interacciones y consola

- `Proyectos` actualiza el hash a `#proyectos` y deja el destino 5 px por debajo del header sticky.
- Navegación por Tab alcanza `Inicio` con foco visible.
- Los cinco SVG cargan completos y reportan dimensiones naturales válidas.
- Consola de Edge: sin errores ni advertencias.

## Historial de comparación

### Iteración 1

- [P2] Los bloques naranja y oscuro existían en CSS pero no eran visibles porque `clip-path: inset(0)` recortaba el overflow de `.hero-portrait`.
- Corrección: se retiró el clip persistente de CSS; GSAP conserva su clip temporal sólo durante el reveal y luego limpia la propiedad.
- Evidencia posterior: ambos bloques son visibles detrás de la foto en las capturas desktop y mobile, sin cubrir el rostro ni salir del hero.

### Iteración 2

- No quedan hallazgos P0, P1 ni P2.
- P3 aceptado: en desktop los iconos se presentan compactos para respetar la altura del header y la legibilidad de las etiquetas, en lugar de reproducir el tamaño promocional de la lámina fuente.

### Iteración 3 — Rosehot

- Cambio autorizado: reemplazar Mileast por Rosehot y retirar los archivos Mileast.
- Evidencia posterior: Rosehot carga desde `public/fonts/rosehot-free-version/Rosehot.ttf`; el hero conserva sus solapamientos, el wordmark y los títulos no desbordan a 390 ni 320 px, y la consola permanece limpia.
- No quedan hallazgos P0, P1 ni P2. La licencia oficial permite web personal autoalojada pero prohíbe redistribuir el `.ttf`; la validación visual está aprobada localmente y la publicación queda bloqueada por distribución del asset.

## Implementation checklist

- [x] Restaurar el retrato rectangular y retirar la máscara rechazada.
- [x] Añadir bloques editoriales con tokens semánticos.
- [x] Separar y vectorizar los cinco iconos con transparencia.
- [x] Mapear cada icono al enlace correspondiente sin reemplazar el texto.
- [x] Validar desktop, tablet, 390 px y 320 px.
- [x] Validar foco, targets táctiles, navegación, consola, build y checks.

final result: passed
