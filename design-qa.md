# Design QA — Scroll narrativo y Stack Flip

## Resultado

final result: blocked

La implementación funcional está terminada y las comprobaciones del repositorio pasan. La aceptación visual formal queda bloqueada porque no fue posible crear el artefacto combinado de referencia + implementación que exige esta revisión: el navegador rechazó la URL local `data:` usada para componer la comparación. No se intentó otro mecanismo después del rechazo.

## Referencias revisadas

- Dirección visual seleccionada (opción 1): `C:\Users\roman\.codex\generated_images\01a0acff-e590-73f2-b4af-0376405b8195\exec-4f86f334-fa9b-4707-8c2e-6290b4deba22.png`.
- Implementación local: `http://127.0.0.1:5178/#inicio` y `http://127.0.0.1:5178/#tecnologias`.
- La referencia y las capturas de la implementación se inspeccionaron por separado. Las capturas de CUA se devolvieron inline y no quedaron guardadas en una ruta local; por eso no se declara una comparación superpuesta ni un diff de imágenes.

## Cobertura observada

- Desktop: 1912 px de ancho; se revisaron hero, índice de capítulos, secuencia de giro, liberación del pin y navegación al siguiente capítulo.
- Tablet: 1024 × 768; las tarjetas usan composición compacta sin pin y mantienen el control manual.
- Mobile: 390 × 844; Stack vertical, giro por tap y teclado, foco conservado y sin overflow horizontal.
- Movimiento reducido: sin pin ni giro ligado al scroll, controles innecesarios ocultos y descripciones disponibles.
- Navegación: anchors y progreso actualizaron el capítulo activo; no se detectó bloqueo del scroll nativo.
- Automatizado: `npm run check` (678 aserciones), `npm run build` y `git diff --check` finalizaron correctamente.

## Hallazgo pendiente

- **QA visual comparativo no concluido:** falta revisar referencia e implementación en una misma composición y conservar evidencia visual con una ruta persistida. La restricción de URL del navegador impidió esa composición en esta sesión. La revisión visual directa por viewport sí se realizó, pero no sustituye esa comparación formal.

## Incidencias de consola

Durante el arranque de Vite se observaron dos errores de conexión HMR WebSocket. No se observaron errores de runtime de la aplicación durante las interacciones finales; `npm run build` y `npm run check` pasan. No se presenta la consola como completamente limpia.
