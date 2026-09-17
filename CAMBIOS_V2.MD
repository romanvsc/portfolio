Quiero que analices completamente este repositorio:

https://github.com/romanvsc/portfolio

==================================================
OBJETIVO DEL REDISEÑO
==================================================

El portfolio actual funciona técnicamente, pero visualmente se siente demasiado genérico.

Quiero rediseñarlo hacia una estética:

NEOBRUTALISMO EDITORIAL

Debe sentirse:

- personal
- memorable
- profesional
- experimental
- directo
- con fuerte jerarquía tipográfica
- con personalidad propia

La identidad principal debe estar construida alrededor de:

ROMÁN VOGEL
+
DORITO, mi gato naranja, como mascota oficial del portfolio.

No quiero que parezca una plantilla típica de portfolio.

==================================================
PROYECTOS PRINCIPALES
==================================================

Los cuatro proyectos principales del portfolio son:

01. Registro de Producción
02. IPAC
03. Gestión de Gimnasio
04. Mantenimiento de Camiones

Estos cuatro proyectos deben ser los protagonistas del portfolio.

Cada uno debe tener identidad visual propia, pero todos deben convivir dentro del mismo sistema visual general.

==================================================
DIRECCIÓN VISUAL
==================================================

Quiero utilizar una estética neobrutalista controlada.

Base visual:

- fondo crema cálido
- negro casi puro
- naranja Dorito como accent principal
- colores secundarios únicamente cuando cada proyecto lo necesite
- bordes negros gruesos
- sombras duras sin blur
- poco border-radius
- bloques gráficos
- composiciones asimétricas
- tipografía de gran escala
- estructura editorial

Evitar un neobrutalismo infantil o excesivamente colorido.

La base debe sentirse profesional.

Paleta aproximada:

Background:
#F4F0E6

Ink:
#111111

Dorito Orange:
#FF8A24

Los colores exactos pueden ajustarse si mejora la coherencia.

==================================================
TIPOGRAFÍA
==================================================

Mantener DM Mono para:

- metadata
- números
- labels
- detalles técnicos

Reevaluar Manrope.

Para títulos utilizar una tipografía más fuerte y editorial.

Opciones posibles:

- Archivo Black
- Archivo
- Space Grotesk
- Bricolage Grotesque

El sistema tipográfico debería tener tres niveles:

DISPLAY
BODY
MONO

==================================================
HERO
==================================================

El hero actual debe rediseñarse completamente.

Eliminar:

- "Hola, soy Román"
- card inclinada tradicional de retrato
- badges/tags genéricos
- composición típica de portfolio
- decoraciones sin función

Nueva idea:

RV / PORTFOLIO 2026

ROMÁN
VOGEL.

SYSTEM ANALYST
& DEVELOPER

Construyo sistemas digitales
para problemas del mundo real.

La fotografía de Román debe integrarse editorialmente al layout.

No colocarla dentro de una card convencional.

Puede utilizar:

- máscaras
- clip-path
- superposición con texto
- bordes duros
- shadow block neobrutalista

ROMÁN VOGEL debe ser visualmente dominante.

==================================================
DORITO
==================================================

Dorito debe convertirse en una parte real del sistema visual.

Actualmente existen distintas ilustraciones/poses.

Quiero utilizarlo como:

- mascota
- narrador ocasional
- elemento contextual
- guía visual
- easter egg

Estados posibles:

saludando:
Hero

comentando:
Projects

trabajando:
Stack

feliz:
Contact

También existen ilustraciones de Dorito interactuando con:

- PHP
- JavaScript
- Vue
- CSS
- SQL

Estas deben aprovecharse en la sección de tecnologías.

IMPORTANTE:
Dorito no debe aparecer repetido sin propósito.

Cada aparición debe tener una función.

Evitar que el portfolio parezca infantil.

==================================================
PROYECTOS
==================================================

Eliminar la grilla clásica de cards en desktop.

Quiero que los proyectos sean grandes bloques editoriales.

Cada proyecto puede ocupar aproximadamente:

90vh–100vh

Estructura conceptual:

01 / PRODUCTION SYSTEM

REGISTRO
DE PRODUCCIÓN

[VISUAL GRANDE]

Vue / PHP / MySQL

[ VER PROYECTO ↗ ]

Cada proyecto debe tener:

- número
- categoría
- nombre
- descripción corta
- visual grande
- stack
- CTA
- color propio

Los proyectos deben sentirse como escenas, no como cards.

==================================================
IDENTIDAD POR PROYECTO
==================================================

Base del portfolio:

crema + negro + naranja Dorito

Pero cada proyecto debe introducir su propia identidad visual.

REGISTRO DE PRODUCCIÓN

Dirección:
- verde oliva
- tonos forestales
- sensación de producción
- datos
- operación
- control
- estructura

Puede utilizar aproximadamente:

#374128
#64764C
#8F9A7C

sin necesidad de limitarse exactamente a esos valores.

--------------------------------------------------

IPAC

Dirección:
- azul grisáceo
- petróleo
- tonos fríos y técnicos
- educación
- organización
- gestión académica
- información estructurada

Debe sentirse:

- técnico
- ordenado
- académico
- moderno

Evitar una estética escolar infantil.

--------------------------------------------------

GESTIÓN DE GIMNASIO

Dirección:
- naranja
- negro
- crema
- energía
- movimiento
- actividad

Debe conservar relación con la identidad visual propia del sistema.

--------------------------------------------------

MANTENIMIENTO DE CAMIONES

Dirección:

- azul profundo
- azul eléctrico
- amarillo
- blanco

Puede tomar como referencia:

#031A3E
#F1A000
#0862C6
#FEFEFE

Debe sentirse:

- industrial
- mecánico
- técnico
- robusto

--------------------------------------------------

Utilizar GSAP para transicionar suavemente entre las distintas identidades al hacer scroll.

Ejemplo conceptual:

Portfolio neutro
↓
Registro Producción
↓
verde oliva

scroll

verde
↓
neutro
↓
azul petróleo IPAC

scroll

IPAC
↓
naranja Gimnasio

scroll

Gimnasio
↓
azul + amarillo Camiones

Las transiciones deben sentirse progresivas.

==================================================
GSAP
==================================================

Actualmente GSAP se usa principalmente para:

opacity
+
translateY

Quiero aprovecharlo mucho mejor.

Proponer y documentar:

- ScrollTrigger
- pinned sections
- timelines
- clip-path reveals
- stagger
- text transitions
- image scaling
- background color transitions
- parallax
- números 01 → 02 → 03 → 04
- title movement
- project transitions
- menú fullscreen
- Dorito entrando/saliendo contextualmente

Las animaciones deben ser:

- rápidas
- gráficas
- con intención
- acordes al neobrutalismo

Evitar movimientos excesivamente suaves o flotantes.

Quiero sensación de:

SNAP
BLOCK
SLIDE
CUT
REVEAL

más que:

FLOAT
FADE
GLOW

No hacer scroll hijacking.

==================================================
MICROINTERACCIONES NEOBRUTALISTAS
==================================================

BOTONES

Estado normal:

border: 2px solid black
box-shadow: 5px 5px 0 black

Hover:

translate(2px, 2px)
box-shadow: 3px 3px 0 black

Active:

translate(5px, 5px)
box-shadow: none

--------------------------------------------------

LINKS

Utilizar:

- underline animado
- desplazamiento de flecha
- inversión de colores
- bloques de fondo

--------------------------------------------------

BLOQUES

Pueden reaccionar mediante:

- desplazamiento
- shadow shift
- pequeñas rotaciones
- cambios secos de color

Evitar:

transform: scale(1.05)

como comportamiento repetido en toda la página.

==================================================
STACK
==================================================

Eliminar una simple cuadrícula de tecnologías iguales.

Utilizar las ilustraciones de Dorito con:

PHP
JS
VUE
CSS
SQL

Diseñar una composición neobrutalista irregular.

Ejemplo conceptual:

PHP:
Dorito sosteniendo PHP

JS:
Dorito intentando atrapar JS

Vue:
Dorito mostrando Vue

CSS:
Dorito sosteniendo CSS

SQL:
Dorito interactuando con SQL

Cada módulo puede tener:

- tamaño diferente
- posición diferente
- pequeñas rotaciones
- fondos distintos
- bordes negros
- sombras duras

No convertir todo nuevamente en cards idénticas.

La sección puede tener un título grande:

MY
STACK.

o:

BUILD
WITH.

==================================================
THREE.JS
==================================================

Actualmente existe una escena 3D.

Evaluar si sigue teniendo sentido.

Dirección preferida:

"El escritorio de Dorito"

Una pequeña escena estilizada:

- escritorio
- monitor
- teclado
- taza de café
- Dorito
- pequeños objetos
- referencias a programación

Post-its posibles:

SHIP IT.

CTRL + S

El monitor puede mostrar:

- código
- una interfaz
- algún proyecto

El estilo puede ser:

- low poly
- estilizado
- coherente con las ilustraciones de Dorito

No convertir Three.js en protagonista de toda la web.

Debe ser un único momento especial.

Mantener:

- lazy loading
- render bajo demanda
- reduced motion
- fallback
- optimización mobile
- devicePixelRatio controlado

Si el modelo actual no sirve para conseguir esta escena:

NO fabricar un modelo 3D mediocre.

Documentar qué debería modificarse posteriormente en Blender.

==================================================
NAVBAR / MENU
==================================================

Eliminar sensación de navbar SaaS.

Proponer algo simple:

[ RV ]                          [ MENU + ]

Al abrir:

01 WORK
02 ABOUT
03 STACK
04 CONTACT
05 GITHUB
06 LINKEDIN

Puede ser un menú fullscreen.

Dirección:

- fondo naranja Dorito
- borde negro
- tipografía enorme
- números DM Mono
- animaciones rápidas con GSAP

==================================================
ABOUT
==================================================

Evitar texto genérico del estilo:

"Soy un apasionado desarrollador..."

Comunicar específicamente:

- estudiante de Analista de Sistemas
- trabajo con sistemas reales
- interés en comprender procesos
- análisis de datos
- organización de información
- diseño de interfaces
- desarrollo de soluciones
- conexión entre análisis + desarrollo + producto

Utilizar una composición editorial.

No una clásica card "About Me".

==================================================
CONTACT
==================================================

Cerrar el portfolio con una sección muy visual.

Ejemplo:

¿TENÉS
UNA IDEA?

HABLEMOS.

[email]

[ GitHub ]
[ LinkedIn ]

Dorito feliz puede acompañar la sección.

El CTA debe ser fuerte, simple y directo.

==================================================
CASE STUDIES
==================================================

Mantener páginas individuales.

Proyectos:

Registro de Producción
IPAC
Gestión de Gimnasio
Mantenimiento de Camiones

Cada case study debería tener:

01 Contexto

02 Problema

03 Solución

04 Arquitectura

05 Funcionalidades

06 Decisiones

07 Tecnologías

08 Capturas

09 Aprendizajes

Utilizar la identidad visual correspondiente a cada proyecto.

No inventar datos.

No inventar métricas.

No inventar usuarios.

No inventar resultados.

No inventar responsabilidades.

No presentar mockups conceptuales como screenshots reales.

Si no existe una captura real:

mostrar placeholder claramente identificado.

==================================================
RESPONSIVE
==================================================

El diseño debe adaptarse realmente.

DESKTOP

- experiencia editorial grande
- layouts asimétricos
- proyectos fullscreen
- GSAP completo
- Three.js

TABLET

- reorganizar layouts
- reducir desplazamientos
- mantener identidad

MOBILE

- simplificar animaciones
- evitar pinned sections excesivamente largas
- evitar problemas de altura dinámica
- mantener jerarquía tipográfica
- mantener Dorito
- mantener estética neobrutalista
- Three.js simplificado o fallback cuando sea necesario

No quiero simplemente reducir proporcionalmente el desktop.

==================================================
ACCESIBILIDAD
==================================================

Mantener o mejorar:

- focus-visible
- contraste
- navegación por teclado
- prefers-reduced-motion
- semántica
- aria
- alt
- skip-link
- orden lógico
- botones reales
- links reales

Las animaciones nunca deben impedir acceder al contenido.

==================================================
PERFORMANCE
==================================================

Revisar:

- bundle
- Three.js
- imágenes
- SVG
- GSAP
- lazy loading
- listeners
- requestAnimationFrame
- assets
- WebP
- AVIF cuando corresponda
- GPU mobile
- GLB
- fuentes

Evitar assets innecesariamente pesados.

==================================================
COSAS QUE NO QUIERO
==================================================

NO utilizar:

- glassmorphism
- gradientes neón
- terminal hacker
- Matrix
- partículas gratuitas
- esfera 3D
- planeta 3D
- tarjetas para absolutamente todo
- bento grid generalizado
- skill percentages
- barras de progreso de conocimiento
- "passionate developer"
- navbar SaaS
- exceso de border-radius
- sombras suaves
- animaciones fade-up en toda la web
- diseño infantil
- veinte colores diferentes
- efectos sin función
- scroll horizontal obligatorio
- animaciones que retrasen la navegación

==================================================
PRINCIPIOS DEL DISEÑO
==================================================

Cada elemento visual debe responder al menos una de estas preguntas:

¿Cuenta algo sobre Román?

¿Ayuda a entender un proyecto?

¿Mejora la navegación?

¿Aporta personalidad?

¿Demuestra una capacidad técnica?

¿Fortalece la identidad Román + Dorito?

Si la respuesta a todas es NO:

probablemente ese elemento no debería existir.

==================================================
ESTRUCTURA DEL ARCHIVO cambios.md
==================================================

Quiero que el archivo cambios.md tenga exactamente una estructura similar a esta:

# Portfolio V3 — Rediseño Neobrutalista

## 1. Diagnóstico actual

Analizar:

- qué funciona
- qué parece genérico
- problemas de composición
- problemas de identidad
- oportunidades de mejora
- uso actual de GSAP
- uso actual de Three.js
- uso actual de Dorito

## 2. Objetivo visual

Definir:

Neobrutalismo Editorial
+
Román Vogel
+
Dorito
+
Systems × Design × Code

## 3. Elementos a conservar

Lista concreta basada en el proyecto real.

## 4. Elementos a eliminar

Lista concreta.

## 5. Nueva paleta

Tabla:

Token
Color
Uso

Incluir:

base
Dorito
Registro Producción
IPAC
Gimnasio
Camiones

## 6. Tipografía

Tabla:

Uso
Fuente
Peso
Notas

## 7. Hero

Describir detalladamente la nueva composición.

## 8. Navegación

Describir:

header
menu
fullscreen menu
mobile menu

## 9. Dorito

Definir:

- poses
- secciones
- diálogos
- animaciones
- usos permitidos
- usos que evitar

## 10. Proyectos

Explicar cómo reemplazar la grilla actual por escenas editoriales.

Crear subsecciones para:

10.1 Registro de Producción

10.2 IPAC

10.3 Gestión de Gimnasio

10.4 Mantenimiento de Camiones

## 11. Stack

Explicar cómo utilizar los Doritos:

PHP
JS
Vue
CSS
SQL

## 12. About

Nueva dirección.

## 13. Three.js

Analizar escena actual.

Explicar:

qué conservar

qué eliminar

qué modificar

qué necesita nuevo modelado

## 14. Contact

Nueva propuesta.

## 15. GSAP

Crear lista detallada de animaciones.

Separar:

Hero

Projects

Stack

About

Menu

Dorito

Contact

## 16. Microinteracciones

Documentar:

buttons

links

images

menu

project CTA

cursor

Dorito

## 17. Responsive

Separar:

Desktop

Tablet

Mobile

## 18. Accesibilidad

Checklist.

## 19. Performance

Checklist.

## 20. Arquitectura

Analizar los archivos actuales.

Como mínimo revisar:

src/main.js

src/style.css

src/theme.css

src/tokens.json

src/data.js

src/scene.js

Determinar si conviene dividir responsabilidades.

Posibles módulos:

src/animations/
src/components/
src/sections/
src/utils/

NO crear carpetas solo por crear arquitectura.

## 21. Archivos afectados

Crear una tabla:

Archivo
Cambio
Motivo
Prioridad

## 22. Plan de implementación

Dividir en fases.

FASE 1
Sistema visual + tokens + tipografía

FASE 2
Hero

FASE 3
Navigation

FASE 4
Project experience

FASE 5
Dorito

FASE 6
Stack

FASE 7
GSAP avanzado

FASE 8
Three.js

FASE 9
Case Studies

FASE 10
Responsive

FASE 11
Accessibility

FASE 12
Performance + Cleanup

## 23. Prioridad

Crear tabla:

Cambio
Impacto
Complejidad
Prioridad

Valores:

ALTA
MEDIA
BAJA

## 24. Riesgos técnicos

Analizar posibles riesgos:

GSAP + ScrollTrigger

Three.js

mobile GPU

layout shift

fonts

large images

GLB

scroll performance

responsive

## 25. Definition of Done

Definir cuándo podemos considerar terminado Portfolio V3.

==================================================
IMPORTANTE
==================================================

El archivo cambios.md debe ser:

- técnico
- específico
- accionable
- fácil de seguir
- basado en el código REAL del repositorio

No quiero recomendaciones genéricas.

Analiza primero el código actual.

Cuando propongas una modificación:

indicar qué archivo afecta.

No modificar todavía el proyecto.

NO implementar todavía el rediseño.


El propósito de cambios_V2.md es convertirse en la fuente de verdad para desarrollar posteriormente el Portfolio V3.

Antes de terminar:

revisa que todas las recomendaciones sean coherentes entre sí y que los cuatro proyectos principales sean:

Registro de Producción
IPAC
Gestión de Gimnasio
Mantenimiento de Camiones