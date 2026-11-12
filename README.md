# Pasteles de mamá

Sitio estático de una sola página: un collage en 2D (recortes, papel rasgado) que se mueve con el scroll.
Sin dependencias ni compilación: HTML, CSS y un archivo de JavaScript.

## Publicar en GitHub Pages

1. Sube el contenido de esta carpeta a la raíz de un repositorio.
2. En el repositorio: Settings → Pages → Source: `Deploy from a branch`, rama `main`, carpeta `/ (root)`.

## Probar en tu computadora

Los módulos de JavaScript no cargan con doble clic (`file://`). Levanta un servidor:

```
python -m http.server 8000
```

y abre http://localhost:8000

## Qué cambiar

| Qué | Dónde |
| --- | --- |
| Número de WhatsApp | `index.html`, atributo `data-whatsapp` del `<body>` (con lada de país, solo dígitos) |
| Nombre del negocio | `index.html`: `<title>`, `.barra__marca` y el pie |
| Recortes del pastel y las fresas | `img/*.webp` (WebP o PNG con fondo transparente; `roseta-entera`, `roseta-resto` y `roseta-rebanada` deben medir lo mismo y estar alineadas) |
| Textos, postres y precios | `index.html`, sección `#postres` |
| Fotos de las polaroids | guarda la imagen en `img/` y cambia el `src` del `<img>` dentro de `.polaroid` |
| Colores y tipografías | variables al inicio de `styles.css` |
| Movimiento de las piezas | `PISTAS`, `CORTE` y `DISPERSION` en `main.js` (un cuadro por sección) |
| Papel rasgado | agrega `data-rasgar="N"` a cualquier elemento (N = px de rasgado) |

## Estructura

```
index.html   contenido
styles.css   estilos
main.js      animación por scroll, papel rasgado, polaroids arrastrables
fonts/       Fraunces, Special Elite, Caveat (licencia OFL)
img/         recortes y textura de papel
```
