# Arquitectura

El juego es una sola escena de Phaser (`Mundo`) con una capa de HTML por encima para todo lo que es texto
(HUD, diálogos, paneles, menús y modo clásico). Así el texto se lee nítido en cualquier pantalla, se puede
seleccionar y es accesible, y Phaser solo se ocupa del mundo en píxeles.

## Flujo al arrancar

1. `main.js` espera a que cargue la fuente Press Start 2P (si no, los primeros textos salen con otra fuente) y crea
   el juego con `pixelArt: true` y escalado `RESIZE`.
2. `Mundo.create()` dibuja todas las texturas (`prepararTexturas`), pinta el suelo en un único canvas, coloca árboles,
   edificios, objetos y personajes, y deja la cámara paseando por el mapa en modo `portada`.
3. `pantallas.js` muestra encima la intro de terminal, el menú y el creador de personaje.
4. Al pulsar «A jugar», `Mundo.empezar()` crea al jugador al sur de la Puerta de la Villa, la cámara le sigue
   y arranca el recorrido guiado.

## El mapa (`mapa.js`)

Todo lo que hay en el mundo está descrito como datos, en casillas de 16 px:

- `EDIFICIOS`: textura, centro `x`, fila `base` donde apoya y, opcionalmente, `letrero`, `vida` (un diálogo) o
  `zona` (abre un panel).
- `OBJETOS`: igual, para el decorado (farolas, bancos, coches, la furgoneta, los guiños…).
- `SUELOS` y `SENDAS`: zonas de plaza, asfalto, baldosa o agua, y caminos verticales.
- `PERSONAJES`: familia y amigos con sus rasgos.
- `RECORRIDO`: las paradas del guía, con puntos intermedios (`via`) para que no atraviese edificios.

Cambiar algo de sitio o añadir un banco es editar una línea de este fichero.

## Colisiones y profundidad

- Cada edificio es sólido salvo una franja de 8 px arriba, para poder pasar por detrás sin chocar con el tejado.
- La Puerta de la Villa tiene dos sólidos, uno por torre: el arco del medio queda libre y su parte de abajo es
  transparente, así se ve (y se cruza) al otro lado.
- La profundidad de todo es su coordenada `y` (`setDepth(y)`): lo que está más abajo en pantalla se pinta delante.
  Es lo que permite pasar por detrás de un edificio o de un árbol.

## Personajes que pasean

Cada NPC guarda su sitio de origen y un radio. Cada pocos segundos elige un punto al azar dentro de ese círculo,
anda hasta él con su animación y espera. Si el jugador se acerca, se para y le mira, para que se pueda hablar con él.
El punto de interacción de los NPC con diálogo se calcula con *getters*, así sigue al personaje allá donde vaya.

## Tecla «E»

`cercano()` devuelve lo más próximo con lo que se puede interactuar, con la misma prioridad que `interactuar()`
(Jerry, DANTE P.W., el guía y después edificios, objetos y NPC). Encima aparece una tecla dibujada en píxeles
(«E», o «A» en pantallas táctiles) que flota; se oculta durante los diálogos y cuando el guía ya muestra su «!».

## Recorrido guiado

El guía (Alejandro) espera con un «!» encima en cada parada. Cuando el jugador se acerca, cuenta su parte
(`historia.js`) con el efecto de máquina de escribir y avanza a la siguiente parada con una interpolación (*tween*)
por los puntos `via`. El progreso se guarda en `localStorage`, así que al volver se puede continuar.

## Interfaz (`ui.js` y `pantallas.js`)

- `decir()` devuelve una promesa que se resuelve al cerrar el diálogo, lo que permite encadenar frases con `await`.
- Los paneles se generan a partir de `content.js` y desbloquean un logro la primera vez.
- El modo clásico es una página normal con la misma información, para reclutadores con prisa.
- En móvil aparece una cruceta táctil que escribe en `teclasTactiles`, que la escena lee igual que el teclado.

## Creador de personaje (`pantallas.js`)

Los rasgos del personaje son un objeto plano (`pelo`, `colorPelo`, `piel`, `ropa`, `tipo`, `pantalon`, `anchos`,
`zapatillas`, `barba`, `gafas`, `cadena`, `sonrisa`) que se guarda tal cual en `localStorage` y que `crearPersonaje()`
convierte en una hoja de sprites. El creador tiene tres pestañas (cuerpo, ropa y extras) para no mostrar todas las
opciones a la vez, una vista previa de 144 × 192 que anda y se puede girar a las cuatro direcciones, y un botón que
elige todo al azar. Cada cambio vuelve a dibujar la hoja, así que lo que se ve es exactamente lo que saldrá en el juego.

## Ambiente

- **Suelo**: `pintarSuelo()` guarda en una cuadrícula qué hay en cada casilla y dibuja cada borde según el vecino
  (mordiscos de hierba en el camino, bordillo en la plaza y en la acera, arena irregular). Luego oscurece o aclara la
  hierba píxel a píxel con `ruido2D` y una matriz de Bayer, para que las manchas no sigan la forma de las casillas.
- **Árboles**: tres especies elegidas con ruido por zonas (`pintarArboles`).
- **Ambiente** (`ambiente()`): mariposas con tweens encadenados, bandadas de pájaros cada pocos segundos y sombras de nube.
- **Sombras**: un rectángulo semitransparente bajo cada edificio y objeto grande, por encima del suelo y por debajo de todo lo demás.
- **Bordes del camino**: una línea más oscura y matas de hierba que se meten un poco, pintadas en el mismo canvas del suelo.
- **Vida**: palomas que picotean (dos fotogramas) y se desplazan a saltos, medusas en la laguna, banderas que ondean y olas animadas.
- **Niebla**: un `div` fijo (`#niebla`) con cuatro degradados radiales en las esquinas que respira despacio con CSS.
  Va por encima del canvas y por debajo de la interfaz, no captura el ratón y se queda quieta con `prefers-reduced-motion`.

## Idiomas y estado

`estado.js` guarda idioma, sonido, personaje, zonas visitadas y si el recorrido está hecho. Todos los textos
salen de `content.js` y `historia.js`, que tienen la misma estructura en `es` y `en`.

## Registro de visitas (`registro.js`, `registro/` y `/accesos/`)

`registro.js` avisa al servidor de `registro/` (un Cloudflare Worker con una base de datos D1) cuando alguien
entra y de lo que hace: el personaje que crea, las zonas, si termina o se salta el recorrido, el modo clásico,
el CV, las recreativas y los enlaces a otras webs. País y ciudad aproximados los añade Cloudflare; la IP no se
guarda y no hay cookies. No cuenta en desarrollo, ni a los robots, ni el navegador de Alejandro.

`/accesos/` es una segunda página de Vite (`accesos/index.html` y `accesos.js`) que pide la contraseña
(secreto `CLAVE_ACCESOS` del Worker) y muestra las últimas 150 visitas, con un resumen de hoy, la semana y los
países. Se actualiza cada 30 s y, al entrar, marca ese navegador para que no cuente como visita.

Para cambiar el servidor: `cd registro`, `npx wrangler deploy`. Para cambiar la contraseña:
`npx wrangler secret put CLAVE_ACCESOS`.

## Publicación

`vite.config.js` usa `BASE` para la ruta de publicación. El flujo de GitHub Actions compila con Node 20 y publica
`dist/` en GitHub Pages: en la raíz si el repositorio es `alexxblaro16.github.io` y en `/nombre-del-repo/` si no.
