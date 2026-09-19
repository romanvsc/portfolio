# Portfolio de Román

## Flujo obligatorio

Antes de desarrollar una nueva dirección o cambio de alcance:

1. Leer el índice y las notas relacionadas en `C:\Users\roman\Desktop\Desarrollo\VaultObsidian\RomanVault\Proyectos\Portfolio`.
2. Documentar la propuesta en ese Vault, distinguiendo evidencia, decisiones y pendientes.
3. Esperar confirmación explícita del usuario antes de modificar código, dependencias o assets de esa propuesta.
4. Implementar y validar lo autorizado; registrar los resultados en el Vault.

La V2 con Dorito, retrato, perfil de estudiante, contactos y tokens verdes fue aprobada en la nota 06. No pedir de nuevo esa misma aprobación para terminarla. Nuevas direcciones requieren un nuevo acuerdo. Publicar, hacer commit/push o modificar los repositorios fuente requiere autorización específica.

## Identidad y contenido

- V3 neobrutalista autorizada mediante CAMBIOS.MD/CAMBIOS_V2.MD y documentada en notas 09–32 del Vault. Cuatro proyectos con IPAC, sin Registro Personal. La sección visible `04 / Un pequeño experimento` fue retirada; Three/Blender quedan sin renderizar. La home conserva cajas largas con iconos SVG transparentes usados como fondo centrado, velo semitransparente y placa tipográfica legible. El header es opaco/full-width, muestra siempre Inicio, Proyectos, Tecnologías, Sobre Mí y Contacto —sin menú fullscreen— y cada enlace incorpora el SVG correspondiente derivado de `Iconos-header.png`. Los pins de GSAP respetan la altura del header. El retrato conserva `roman.webp` sin alteraciones y vuelve a un rectángulo opaco con bloques editoriales detrás; no usar máscaras ni recortes generativos que cambien rasgos. Las capturas reales sólo aparecen dentro de los casos y Mantenimiento incluye obligatoriamente su chatbot. La base V3 tiene commit/push `9d62c72`; las iteraciones posteriores quedan pendientes de publicación y no hay deploy manual.

- Román Vogel Corach es **estudiante de Analista de Sistemas**, no presentar como graduado.
- Fortalezas: PHP, JavaScript, Vue.js, CSS y SQL.
- Contactos confirmados en `src/data.js`.
- Dorito es la mascota naranja provista por el usuario. Conservar originales.
- No inventar métricas, disponibilidad laboral, autoría exclusiva, screenshots ni demos. Las capturas reales deben conservar su carácter verificable y los iconos ilustrados no deben presentarse como pantallas del sistema.

## Sistema visual

- Colores de UI/escena únicamente en `src/tokens.json`. El tema CSS es generado.
- Usar tokens semánticos de Tailwind, no paletas por nombre de color ni valores literales en componentes.
- Las ilustraciones vectorizadas tienen sus paletas internas; los píxeles de las fotografías no son tokens de UI.
- `roman.svg` contiene fotografía raster: nunca describirlo como trazados vectoriales.
- Rosehot Serif es la display local del hero y los títulos. La licencia oficial permite uso web personal autoalojado, pero prohíbe redistribuir el archivo; mantener el `.ttf` fuera de commits públicos y deploys hasta contar con una licencia o vía autorizada de distribución.
- Respetar movimiento reducido, navegación por teclado, reflow y fallback de la escena 3D.

## Comprobación

`npm run build` y `npm run check`. La comprobación automatizada no reemplaza revisión visual, prueba manual de accesibilidad ni auditoría de rendimiento. El servidor de este portfolio usa 5178; no interferir con las otras aplicaciones locales en 5173.
