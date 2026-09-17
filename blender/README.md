# Blender asset

`portfolio-studio.blend` es el archivo fuente del escritorio de la V2: monitor, teclado, taza, libreta y planta. El export es `public/models/portfolio-studio.glb`, cargado de forma diferida por Three.js en Sobre mí.

Los materiales toman sus valores de `src/tokens.json` y se identifican por nombre semántico. La conversión a espacio lineal se realiza al generar el asset. El cargador web vuelve a sincronizar los materiales con los tokens, de modo que los cambios de paleta también se reflejen sin reconstruir la geometría.

Para regenerarlo en Windows:

```powershell
& "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" --background --python .\blender\generate-portfolio-core.py
```

El nombre histórico del script se conserva. Los archivos `portfolio-core.*` pertenecen a la V1, se conservan como material previo y no son cargados por la V2.

Si WebGL o el `.glb` no están disponibles, la tarjeta mantiene un fallback HTML. La escena no contiene datos esenciales ni enlaces exclusivos del canvas.
