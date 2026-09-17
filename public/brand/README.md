# Identidad y assets

Originales conservados en la raíz. Los archivos de esta carpeta se generan con `npm run assets`.

| Archivo | Tipo | Uso |
| --- | --- | --- |
| dorito/saludando.svg | Trazados vectoriales | Bienvenida |
| dorito/trabajando.svg | Trazados vectoriales | Tecnologías |
| dorito/feliz.svg | Trazados vectoriales | Sobre mí |
| dorito/comentando.svg | Trazados vectoriales | Contacto |
| stack/php.svg | Trazados vectoriales | Stack / PHP |
| stack/javascript.svg | Trazados vectoriales | Stack / JavaScript |
| stack/vue.svg | Trazados vectoriales | Stack / Vue.js |
| stack/css.svg | Trazados vectoriales | Stack / CSS |
| stack/sql.svg | Trazados vectoriales | Stack / SQL |
| roman.webp | Fotografía optimizada | Retrato principal |
| roman.svg | Contenedor SVG con WebP embebido | Compatibilidad; NO es un retrato vectorial |

Las cuatro poses están separadas sin las bandas de títulos inferiores, con el fondo original de cada escena. No son siluetas transparentes. La vectorización simplifica textura y detalles; las versiones WebP conservan la apariencia raster.

Las cinco ilustraciones del Stack provienen de `a88e4a3b-2e87-4e39-b923-c4f67c33c8fb.png`, una hoja de 1254×1254 con tres paneles superiores y dos inferiores. También conservan su fondo y no son siluetas transparentes. `public/brand/assets.json` registra sus crops y pesos.

Cada SVG de Dorito es autónomo, tiene `viewBox`, texto accesible y una paleta local de variables `--dorito-N`. Para usarlo basta `<img src="/brand/dorito/saludando.svg" alt="Dorito saludando">`. Para editar trazados, abrir en un editor vectorial. Las variables CSS del documento no atraviesan un `<img>`; editar la paleta dentro del SVG o integrarlo inline si se necesita recolorear.

Los colores de la ilustración/fotografía no se sustituyen por los tokens de la interfaz. La UI, Tailwind y Blender comparten `src/tokens.json`.
