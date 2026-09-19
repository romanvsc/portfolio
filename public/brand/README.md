# Identidad y assets

Originales conservados en la raíz. Los archivos de esta carpeta se generan con `npm run assets`.

| Archivo | Tipo | Uso |
| --- | --- | --- |
| dorito/saludando.svg | Trazados vectoriales | Bienvenida |
| dorito/trabajando.svg | Trazados vectoriales | Tecnologías |
| dorito/feliz.svg | Trazados vectoriales | Sobre mí |
| dorito/comentando.svg | Trazados vectoriales | Contacto |
| dorito/dorito-acostado.svg | Trazados vectoriales | Companion interactivo del hero |
| stack/php.svg | Trazados vectoriales | Stack / PHP |
| stack/javascript.svg | Trazados vectoriales | Stack / JavaScript |
| stack/vue.svg | Trazados vectoriales | Stack / Vue.js |
| stack/css.svg | Trazados vectoriales | Stack / CSS |
| stack/sql.svg | Trazados vectoriales | Stack / SQL |
| project-icons/registro-produccion.svg | Trazados vectoriales | Presentación / Registro de Producción |
| project-icons/ipac.svg | Trazados vectoriales | Presentación / IPAC |
| project-icons/gestion-gimnasio.svg | Trazados vectoriales | Presentación / Gestión de Gimnasio |
| project-icons/mantenimiento.svg | Trazados vectoriales | Presentación / Mantenimiento |
| header-icons/inicio.svg | Trazados vectoriales transparentes | Header / Inicio |
| header-icons/proyectos.svg | Trazados vectoriales transparentes | Header / Proyectos |
| header-icons/tecnologias.svg | Trazados vectoriales transparentes | Header / Tecnologías |
| header-icons/sobre-mi.svg | Trazados vectoriales transparentes | Header / Sobre Mí |
| header-icons/contacto.svg | Trazados vectoriales transparentes | Header / Contacto |
| technology-icons/vue.svg | Trazados vectoriales transparentes | Case Studies / Vue.js |
| technology-icons/php.svg | Trazados vectoriales transparentes | Case Studies / PHP |
| technology-icons/source-03.svg | Trazados vectoriales transparentes | Símbolo de la fuente sin identificar |
| technology-icons/javascript.svg | Trazados vectoriales transparentes | Case Studies / JavaScript |
| technology-icons/python.svg | Trazados vectoriales transparentes | Case Studies / Python |
| technology-icons/source-06.svg | Trazados vectoriales transparentes | Símbolo de la fuente sin identificar |
| technology-icons/supabase.svg | Trazados vectoriales transparentes | Case Studies / Supabase |
| technology-icons/docker.svg | Trazados vectoriales transparentes | Case Studies / Docker |
| technology-icons/laravel.svg | Trazados vectoriales transparentes | Case Studies / Laravel |
| technology-icons/source-10.svg | Trazados vectoriales transparentes | Símbolo de la fuente sin identificar |
| roman.webp | Fotografía optimizada | Retrato principal |
| roman.svg | Contenedor SVG con WebP embebido | Compatibilidad; NO es un retrato vectorial |

Las cuatro poses están separadas sin las bandas de títulos inferiores, con el fondo original de cada escena. No son siluetas transparentes. La vectorización simplifica textura y detalles; las versiones WebP conservan la apariencia raster.

Las cinco ilustraciones del Stack provienen de `a88e4a3b-2e87-4e39-b923-c4f67c33c8fb.png`, una hoja de 1254×1254 con tres paneles superiores y dos inferiores. También conservan su fondo y no son siluetas transparentes. `public/brand/assets.json` registra sus crops y pesos.

Los cuatro iconos de proyecto provienen de `public/brand/capturas_apps/` y se vectorizan a 640 px de trabajo. Se elimina el rectángulo de canvas de cada fuente para conservar transparencia real; sus trazados internos mantienen la paleta ilustrada. Las capturas reales de interfaz permanecen en `capturas_apps`; `src/data.js` selecciona tres por proyecto para evitar cargar la colección completa.

Los cinco iconos del header provienen de `stack/Iconos-header.png`. El original se preserva; cada símbolo se recorta y vectoriza por separado sobre un canvas transparente, sin raster embebido ni rectángulo de fondo.

Los diez símbolos tecnológicos provienen de `project-icons/tecnologias_icon.png` (conservado intacto). `npm run assets:technologies` toma la hoja 5×2, elimina sólo el fondo negro conectado a los bordes mediante flood fill, mantiene las regiones oscuras interiores y produce SVG transparentes sin `<image>` raster. `assets.json` conserva el número de posición en la hoja y las etiquetas; `source-03`, `source-06` y `source-10` son intencionalmente anónimos porque su identidad no se pudo confirmar. Los iconos se muestran junto a tecnologías asociadas con seguridad dentro de los Case Studies, no en las tarjetas de la Home.

Los Case Studies presentan cinco secciones y reservan las tres capturas reales de cada proyecto para una galería interactiva. La ampliación usa un `<dialog>` nativo, controles con foco visible y cierre por Escape. La captura de mantenimiento `Captura de pantalla 2026-09-17 214602.png` (chatbot) es la primera de su galería.

Cada SVG de Dorito es autónomo, tiene `viewBox`, texto accesible y una paleta local de variables `--dorito-N`. Para usarlo basta `<img src="/brand/dorito/saludando.svg" alt="Dorito saludando">`. Para editar trazados, abrir en un editor vectorial. Las variables CSS del documento no atraviesan un `<img>`; editar la paleta dentro del SVG o integrarlo inline si se necesita recolorear.

Los colores de la ilustración/fotografía no se sustituyen por los tokens de la interfaz. La UI, Tailwind y Blender comparten `src/tokens.json`.
