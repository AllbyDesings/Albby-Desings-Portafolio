# Libro Embed

Esta carpeta contiene solo la version embebible del libro interactivo usado por el portafolio.

## Archivos importantes

- `embed.html`: visor del libro, estilos y configuracion de cada libro.
- `public/images/green-cover.jpg`: portada fallback del primer libro.
- `public/images/cover-back.jpg`: textura interior fallback.

## Donde editar cada libro

Abre `embed.html` y busca `bookLibrary`.

- `notes`: primer libro.
- `workspace`: segundo libro.
- `visual-chronicles`: tercer libro.

Cada libro puede usar:

- `cover`: portada exterior.
- `innerCover`: textura interior al abrir la portada.
- `backCover`: parte trasera.
- `pages`: contenido de paginas internas.

Las rutas `../images/archivo.webp` apuntan a archivos dentro de la carpeta `images`.
