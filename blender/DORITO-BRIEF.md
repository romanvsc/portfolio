# El escritorio de Dorito — siguiente GLB

La V3 conserva `portfolio-studio.glb` como estudio preliminar, no como escena terminada de Dorito. No se modificaron los originales Blender ni los PNG.

## Dirección aprobada

- Dorito naranja estilizado, fiel a las cuatro poses de `public/brand/dorito/`.
- Sentado trabajando, expresión reconocible, monitor, teclado y café.
- Post-its discretos: SHIP IT. / CTRL + S. Integrar una interfaz conceptual sin información privada.
- Revisar silueta y proporciones en Blender antes de exportar; no sustituir al gato por primitivas genéricas.
- Conservar materiales semánticos cuyos nombres correspondan a `src/tokens.json` y reutilizar geometrías. Texturas pequeñas sólo si aportan identidad.
- Objetivo orientativo: no superar el GLB actual (~884 KB); verificar carga y memoria en dispositivo real. No es una medición de rendimiento.

## Integración lista

Cambiar `modelUrl` en `src/scene-config.js`. Ajustar cámara si la composición lo exige. Revisar glTF, normales, nombres de materiales, fallback, móvil, reduced motion y pérdida de contexto. Actualizar texto preliminar únicamente cuando el nuevo modelo esté revisado.

El componente carga tras activación del visitante. Mantiene DPR ≤ 1.5, render bajo demanda, pausa fuera de viewport y limpieza de geometrías/materiales/texturas. No anuncia DRAG porque la escena actual responde al puntero, no implementa arrastre.
