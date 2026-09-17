# Portfolio de Román

## Flujo obligatorio

Antes de desarrollar una nueva dirección o cambio de alcance:

1. Leer el índice y las notas relacionadas en `C:\Users\roman\Desktop\Desarrollo\VaultObsidian\RomanVault\Proyectos\Portfolio`.
2. Documentar la propuesta en ese Vault, distinguiendo evidencia, decisiones y pendientes.
3. Esperar confirmación explícita del usuario antes de modificar código, dependencias o assets de esa propuesta.
4. Implementar y validar lo autorizado; registrar los resultados en el Vault.

La V2 con Dorito, retrato, perfil de estudiante, contactos y tokens verdes fue aprobada en la nota 06. No pedir de nuevo esa misma aprobación para terminarla. Nuevas direcciones requieren un nuevo acuerdo. Publicar, hacer commit/push o modificar los repositorios fuente requiere autorización específica.

## Identidad y contenido

- V3 neobrutalista autorizada mediante CAMBIOS.MD/CAMBIOS_V2.MD y documentada en notas 09–12 del Vault. Cuatro proyectos con IPAC, sin Registro Personal. La sección visible `04 / Un pequeño experimento` fue retirada; Three/Blender quedan sin renderizar. No commit/push/deploy sin pedido nuevo.

- Román Vogel Corach es **estudiante de Analista de Sistemas**, no presentar como graduado.
- Fortalezas: PHP, JavaScript, Vue.js, CSS y SQL.
- Contactos confirmados en `src/data.js`.
- Dorito es la mascota naranja provista por el usuario. Conservar originales.
- No inventar métricas, disponibilidad laboral, autoría exclusiva, screenshots ni demos. Los visuales conceptuales deben identificarse como tales.

## Sistema visual

- Colores de UI/escena únicamente en `src/tokens.json`. El tema CSS es generado.
- Usar tokens semánticos de Tailwind, no paletas por nombre de color ni valores literales en componentes.
- Las ilustraciones vectorizadas tienen sus paletas internas; los píxeles de las fotografías no son tokens de UI.
- `roman.svg` contiene fotografía raster: nunca describirlo como trazados vectoriales.
- Respetar movimiento reducido, navegación por teclado, reflow y fallback de la escena 3D.

## Comprobación

`npm run build` y `npm run check`. La comprobación automatizada no reemplaza revisión visual, prueba manual de accesibilidad ni auditoría de rendimiento. El servidor de este portfolio usa 5178; no interferir con las otras aplicaciones locales en 5173.
