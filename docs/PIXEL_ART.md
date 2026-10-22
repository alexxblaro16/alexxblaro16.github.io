# Pixel art con código

No hay imágenes en el proyecto: cada textura se dibuja en un `<canvas>` al arrancar y se registra en Phaser con
`textures.addCanvas`. Las piezas básicas están en `src/pixel.js`.

## Utilidades (`pixel.js`)

- `px(ctx, x, y, color, w, h)`: un rectángulo; con eso se dibuja casi todo.
- `oscurecer`, `aclarar` y `mezclar`: a partir de un color base salen la luz y la sombra, así cada personaje o edificio
  tiene sus tonos sin escribirlos a mano.
- `contorno(ctx, w, h)`: recorre la imagen y pinta un borde de 1 px alrededor de lo dibujado, del color de cada parte
  pero mucho más oscuro. Es el contorno «selectivo» de muchos juegos de pixel art: el pelo castaño tiene un borde castaño
  oscuro, la camiseta roja uno granate, y así queda menos duro que un negro uniforme.
- `texto()`: una fuente de 3 × 5 píxeles para escribir letreros dentro de los dibujos (REBLÁN, MEDAC, IES…).

## Personajes (`personajes.js`)

Cada personaje mide 24 × 32 y su hoja tiene 3 columnas (quieto y dos pasos) por 4 filas (abajo, izquierda,
derecha y arriba). La derecha es la izquierda en espejo.

Cada fotograma se pinta por capas, de atrás hacia delante:

1. Capucha (si lleva sudadera).
2. Piernas y zapatillas: los pasos levantan un pie; de lado, las piernas se abren y la de atrás va más oscura.
3. Cuerpo, según el tipo de ropa: `camiseta`, `polo`, `sudadera` o `chaqueta` (con la camiseta de dentro, que puede
   ser de rayas). `robusto` lo hace más ancho.
4. Brazos: manga corta con el brazo a la vista, o manga larga. De lado, el brazo se balancea al andar.
5. Cabeza con orejas, cuello y la sombra en el lado derecho (la luz viene de arriba a la izquierda).
6. Cara: ojos con brillo, cejas, nariz, boca y rubor. Opciones: `ojosFinos`, `sonrisa`.
7. Pelo: `corto`, `ondulado`, `rizado`, `flequillo`, `largo`, `media`, `melena`, `rapado` y `calvo`, cada uno
   dibujado de frente, de lado y de espaldas, con luces y sombras. Los rizos llevan una textura generada.
8. Accesorios: gafas de montura fina, barba completa o perilla, cadena, logo en el pecho y las piezas de robot
   de DANTE P.W.

Después se aplica el contorno y, por detrás de todo, una sombra en el suelo.

Los rasgos de la familia y los amigos se sacaron de fotos: color y forma del pelo, piel, gafas, barba y la ropa
que más llevan. A 24 × 32 no se ve una cara, pero sí lo que hace reconocible a cada uno.

## Edificios (`edificios.js`)

- Los edificios genéricos salen de una función `casa()` con opciones (pisos, ladrillo, tejado plano o a dos aguas,
  franja de color, toldo, macetas, farol…).
- Los de la vida de Alejandro están dibujados a mano a partir de fotos reales:
  - **Puerta de la Villa**: torres cilíndricas (el sombreado por columnas da el volumen), sillares con juntas y bloques
    de distinto tono, almenas, saeteras, ventana geminada y arco apuntado con el hueco transparente.
  - **Reblán**: fachada beige, tejado de teja árabe, letrero granate con su tilde, escaparates con toldo y la
    **furgoneta** blanca con el vinilo azul.
  - **Plaza Mayor**: soportales de arcos sobre pilares, balcones de hierro, el cuerpo central con reloj y las tres
    banderas, más casas con soportales alrededor.
  - **IES Tierra de Campos**, **MEDAC Albalá** y **UDIT**: los materiales y colores de cada fachada (ladrillo y revoco,
    paneles plateados y pancarta azul, cristal y terraza con pérgola).
- El decorado (bancos, farolas, coches, maceteros, el puesto de fruta, el aparcabicis…) son funciones pequeñas.
- Los guiños a Bob Esponja, Batman y Spider-Man son formas sencillas (una casa-piña, un murciélago en una veleta,
  una telaraña y una mochila roja y azul), homenajes y no copias de los personajes.

## Cómo añadir algo

1. Dibuja la función en `edificios.js` (o en `sprites.js` si es pequeño) y regístrala en `crearEdificios`.
2. Colócala en `mapa.js` con su `x` y su `base`.
3. Si necesita una colisión especial, añádela en `colocarEdificios()` de `Mundo.js`.
