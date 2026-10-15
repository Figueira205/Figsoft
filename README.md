# Figsoft

Sitio web corporativo de **Figsoft**, consultora informática de Madrid especializada en desarrollo web, automatización de procesos, inteligencia artificial y software a medida.

**Web:** https://figueira205.github.io/Figsoft/

![Portada](docs/preview.jpg)

## Qué hay en la página

| Sección | Contenido |
|---|---|
| **Portada** | Titular animado por líneas, cifras que se cuentan solas y el isotipo de Figsoft en 3D con una red de nodos que sigue al ratón y al scroll |
| **Sectores** | Banda continua con los 16 sectores atendidos (se detiene al pasar el cursor) |
| **Servicios** | Seis tarjetas con inclinación 3D y foco de luz que sigue al cursor: automatización, IA, web y e-commerce, software a medida, Odoo y ERP, consultoría |
| **Método** | Cuatro fases con una línea de progreso que se rellena al bajar |
| **Casos de uso** | Cinco escenarios de aplicación: legal, logística, administración pública, farma y fintech |
| **Tecnología** | Herramientas que se usan en los proyectos |
| **Equipo** | Fundador y CEO, y Chief Visionary Officer |
| **Contacto** | Datos de contacto y formulario que abre el correo con el mensaje preparado |

Está en **español e inglés**: el botón ES/EN cambia todos los textos y recuerda la elección.

## Cómo funciona

- **Sin compilación.** HTML, CSS y JavaScript puros, publicados con GitHub Pages. No hay `npm install` ni paso de build.
- **Escena 3D (`scene.js`).** Usa [three.js](https://threejs.org) 0.170 cargado desde jsDelivr. El isotipo se construye con seis piezas hexagonales extruidas, una por lado, con los colores del logotipo (azul, verde y azul marino). Alrededor hay 30 cubos conectados por líneas y 900 partículas. El ratón gira el isotipo y mueve la cámara; el scroll lo desplaza, lo aleja y atenúa el lienzo para que no compita con el texto.
- **Si falla el 3D.** Si el navegador no tiene WebGL o la CDN no responde, la escena se omite y la web sigue funcionando con el fondo en degradado.
- **Interfaz (`main.js`).** Idioma, menú móvil, barra de navegación con cristal, entrada de bloques al hacer scroll, contadores, línea de progreso del método, botones magnéticos, inclinación de tarjetas y validación del formulario.
- **Estilos (`styles.css`).** Tokens de color tomados del logotipo, tipografías Outfit, Figtree y JetBrains Mono, y adaptación a móvil.
- **Movimiento reducido.** Con `prefers-reduced-motion` se apagan las animaciones y la escena 3D se dibuja una sola vez, sin bucle.
- **Accesibilidad.** Enlace de salto, foco visible, menú con `aria-expanded` y contraste sobre fondo oscuro.

## Estructura

| Archivo | Función |
|---|---|
| `index.html` | Contenido y metadatos (Open Graph y datos estructurados) |
| `styles.css` | Sistema de diseño y componentes |
| `main.js` | Interfaz, idioma y formulario |
| `scene.js` | Escena 3D con three.js |
| `assets/` | Logotipos (claro y oscuro), isotipo e iconos |
| `docs/preview.jpg` | Captura usada en este README y al compartir el enlace |

## Ejecutar en local

```bash
git clone https://github.com/Figueira205/Figsoft.git
cd Figsoft
python -m http.server 8000
```

Abre http://localhost:8000. Hace falta servirlo por HTTP porque los módulos de JavaScript no cargan desde `file://`.

## Qué cambió respecto a la versión anterior

La versión anterior era un proyecto Angular sin compilar, por lo que GitHub Pages mostraba una página en blanco. Se sustituyó por esta web estática. También se quitaron las noticias, que usaban imágenes de relleno, y el chatbot, que necesitaba una clave de API de Gemini en el navegador (cualquier visitante podría haberla leído).
