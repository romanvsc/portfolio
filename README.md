# Roman VSC — portfolio

Portfolio V2 de Román Vogel Corach, estudiante de Analista de Sistemas. Identidad verde, retrato personal y Dorito como mascota. Implementación local; no publicada.

## Desarrollo

```powershell
npm install
npm run dev
```

Preview local: `http://127.0.0.1:5178/`.

## Build

```powershell
npm run build
npm run check
```

## Decisiones

- Tailwind 4 mediante el plugin de Vite; no hace falta `tailwind.config.js` en este enfoque CSS-first.
- `src/tokens.json`: única fuente de colores de UI y escena. Genera `src/theme.css` con `@theme` y utilidades semánticas: `bg-brand`, `text-ink`, `border-line`, etc. La paleta predeterminada se desactiva. El desarrollo observa cambios de tokens y regenera el tema.
- `src/data.js`: contactos y contenido de los cuatro proyectos.
- GSAP + ScrollTrigger: entradas breves y revelado por scroll, con movimiento reducido.
- Three.js: escritorio secundario con carga diferida y render bajo demanda, pausado fuera de vista.
- Blender: modelo `public/models/portfolio-studio.glb` y fuente `blender/portfolio-studio.blend`; materiales basados en los mismos tokens. El cargador sincroniza además los colores por nombre de material.
- HTML semántico: la información y navegación no dependen del canvas.
- Fallback HTML si WebGL o el `.glb` no están disponibles. Fuentes locales, sin Google Fonts remoto.

## Assets

Cuatro poses independientes en `public/brand/dorito/*.svg`: trazados vectoriales reales con paleta local, fondo conservado y sin títulos inferiores. La conversión simplifica textura. Versiones WebP incluidas como referencia.

`public/brand/roman.webp` mantiene el retrato fotográfico. `roman.svg` es un contenedor con raster embebido, **no** una vectorización de la cara. Ver `public/brand/README.md`.

Regeneración opcional, no necesaria para ejecutar el sitio:

```powershell
python -m venv .venv-assets
.\.venv-assets\Scripts\python.exe -m pip install vtracer==0.6.15
npm run assets
```

Los PNG originales permanecen sin modificaciones en la raíz y no se copian al build. Las paletas de las ilustraciones y los píxeles de la fotografía son contenido gráfico, no colores de UI.

## Rutas y límites

- `/`, `/proyectos/registro`, `/proyectos/ipac`, `/proyectos/gimnasio`, `/proyectos/mantenimiento`.
- Vite resuelve las rutas en local. Al publicar, el hosting deberá servir `index.html` como fallback de las rutas de la SPA. No se configuró ni realizó un deploy.
- Los visuales de proyecto son esquemas conceptuales identificados; aún faltan capturas sanitizadas, aportes individuales verificados y demos. No se atribuye autoría exclusiva.
- CV no incluido porque no se proporcionó archivo.
- El bloque Three.js produce una advertencia de tamaño (>500 KB sin gzip); se importa sólo al acercarse a la escena. Esto no equivale a una auditoría de rendimiento.

Referencias técnicas: [Tailwind + Vite](https://tailwindcss.com/docs/installation/using-vite), [tokens de Tailwind](https://tailwindcss.com/docs/theme), [VTracer](https://github.com/visioncortex/vtracer).

La dirección y el inventario de contenido están documentados en `RomanVault/Proyectos/Portfolio`.
