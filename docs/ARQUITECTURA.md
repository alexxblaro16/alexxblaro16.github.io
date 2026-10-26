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
- `RECORRIDO`: las paradas del guía, con puntos intermedios (`via`) para que no atraviese edificios. La parada del
  autobús lleva `bus: 'madrid'`: Alejandro se sube contigo al Monbus.
- `AUTOVIA`: las columnas (58 y 59) de la autovía que separa Villalpando de Madrid.
- Un objeto con `bus` es una estación (`'madrid'` sale del pueblo y `'pueblo'` sale de Madrid).

Cambiar algo de sitio o añadir un banco es editar una línea de este fichero.

## Colisiones y profundidad

- Cada edificio es sólido salvo una franja de 8 px arriba, para poder pasar por detrás sin chocar con el tejado.
- La Puerta de la Villa tiene dos sólidos, uno por torre: el arco del medio queda libre y su parte de abajo es
  transparente, así se ve (y se cruza) al otro lado.
- La profundidad de todo es su coordenada `y` (`setDepth(y)`): lo que está más abajo en pantalla se pinta delante.
  Es lo que permite pasar por detrás de un edificio o de un árbol.

## Personajes que pasean

Cada NPC guarda su sitio de origen y un radio: 54 px los amigos y 34 la familia. Cada pocos segundos elige un punto
al azar dentro de ese círculo, anda hasta él con su animación y espera. Si el jugador se acerca, se para y le mira,
para que se pueda hablar con él. El punto de interacción de los NPC con diálogo se calcula con *getters*, así sigue
al personaje allá donde vaya.

**Zona:** 36 px los amigos y 22 la familia. Si un NPC se ha alejado más de 1,3 veces su radio, su siguiente paseo
es volver a su sitio, y solo charla con alguien que esté dentro de su zona. Así no se encadenan y se alejan.

**El guía de paseo:** al acabar el recorrido, `pasearGuia()` monta una ruta: subir al camino, recorrerlo y bajar hasta
alguien de su lado de la autovía, elegido entre los seis más cercanos y sin contar a Gabriel, que está dentro del campo.
El último tramo apunta a donde está ese amigo en ese momento, el amigo le espera y al llegar charlan con `charlar()`.

**Charlas:** a veces, en vez de pasear, un NPC va hacia otro de su mismo grupo (residencia, MEDAC, uni) que esté
cerca y libre. Al llegar, `charlar()` los pone mirándose y les saca bocadillos por turnos («...», «jaja», «!?»,
«xD»…). Los bocadillos valen para los dos idiomas.

## Jerry y DANTE P.W. (`acompanantes`)

Los dos son «acompañantes», con su zona de origen y tres estados:
- **Sueltos:** pasean por su zona (120 px Jerry, 80 px DANTE P.W.) y chocan con los sólidos.
- **Siguiéndote:** van detrás a cierta distancia. Si se quedan muy atrás (más de 170 px), aparecen a tu lado.
  Entran contigo en las salas (`traerAcompanantes()`) y suben al autobús. Mientras te siguen no chocan contigo,
  gracias a un `processCallback` en el colisionador.
- **Volviendo:** al decirles «Vuelve a tu sitio» van andando a su zona. Si están lejos (otra sala, el otro lado de
  la autovía o más de 520 px) o se atascan, aparecen allí cuando no se les ve en pantalla.

Al hablarles, `hablarAcompanante()` pregunta con `elegir()`: Hablar / Sígueme (o Vuelve a tu sitio) / Adiós.

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
- `elegir(nombre, pregunta, opciones)` hace una pregunta con botones en la misma caja de diálogo. Se elige con las
  flechas o W/S y se confirma con E, espacio o Enter, o con un clic. Devuelve el número de la opción. Se usa para
  Jerry y DANTE P.W., el autobús, el armario y la reseña de Reblán.
- El botón **ROPA** de la barra llama a `pedirRopa()`, que abre el probador (ver el creador).
- Los paneles se generan a partir de `content.js` y desbloquean un logro la primera vez.
- El modo clásico es una página normal con la misma información, para reclutadores con prisa.
- En móvil aparece una cruceta táctil que escribe en `teclasTactiles`, que la escena lee igual que el teclado.

## Creador de personaje (`pantallas.js`)

Los rasgos del personaje son un objeto plano (`pelo`, `colorPelo`, `piel`, `ropa`, `tipo`, `pantalon`, `anchos`,
`zapatillas`, `barba`, `gafas`, `cadena`, `sonrisa`) que se guarda tal cual en `localStorage` y que `crearPersonaje()`
convierte en una hoja de sprites. El creador tiene tres pestañas (cuerpo, ropa y extras) para no mostrar todas las
opciones a la vez, una vista previa de 144 × 192 que anda y se puede girar a las cuatro direcciones, y un botón que
elige todo al azar. Cada cambio vuelve a dibujar la hoja, así que lo que se ve es exactamente lo que saldrá en el juego.

**El probador** es el mismo creador en modo `creador(true)`. Se abre jugando, con el botón ROPA o con el armario de su
cuarto (`ropa: true` en `interiores.js`):
- Solo enseña las pestañas de ropa y extras, sin nombre ni cuerpo.
- El juego queda en pausa (`modo = 'ropa'`).
- Al ponértela, `volverDelProbador()` rehace la hoja `jugador` y se la cambia al sprite en el sitio, sin empezar
  otra partida.

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

## Interiores (`interiores.js`)

`INTERIORES` describe cada sala como datos (medidas, suelo, color de pared, ventanas y muebles con `vida`, `zona`, `pared` o
`pisable`) y `crearInteriores()` dibuja con código la sala y cada mueble. `Mundo.colocarInteriores()` las pone debajo del mapa,
una al lado de otra, con paredes y muebles sólidos. Un edificio con `interior` en `mapa.js` lleva a su sala: `entrar()` funde a
negro, mueve al jugador, cambia los límites del mundo y de la cámara y centra la sala si cabe en pantalla (si no, la cámara sigue
al jugador). Al pisar el felpudo de la puerta, `salir()` devuelve al jugador delante del edificio.

## La autovía, la cámara por lados y el Monbus

- **La autovía:** se pinta en el canvas del suelo (asfalto, líneas, biondas) y lleva un sólido invisible a todo lo alto.
  Por ella pasan coches (`coche_v0` a `coche_v4`) en los dos sentidos.
- **La cámara por lados:** `limitarCamara()` encierra la cámara en el lado de la autovía donde está el jugador, así
  desde Villalpando no se ve Madrid ni al revés. Se llama al empezar, al salir de una sala y al bajar del autobús.
  En la portada y el menú la cámara vuelve a recorrer el mapa entero.
- **El guía:** cuando pasea libre, se queda en su lado.
- **El viaje:** `preguntarBus()` pregunta con `elegir()` y `viajarBus()` hace el trayecto:
  1. Llega el autocar (`bus`, blanco con franjas azul y amarilla).
  2. Suben el jugador, el guía si va en el recorrido y los acompañantes que te sigan.
  3. Se va y la cámara funde a negro.
  4. `viaje.js` pinta a pantalla completa la escena de la meseta (lienzo de 320 × 180, kilómetros de 0 a 230).
  5. El autocar llega a la otra estación y bajáis.

## Día y noche

`cicloDia()` crea un velo azul, otro naranja para el atardecer, una luz (degradado en modo `ADD`) por farola, foco y puerta, y
luciérnagas. `noche()` calcula en qué momento del día estamos (`DURACION_DIA`, 6 minutos) y `actualizarLuz()` ajusta todo en cada
fotograma. Dentro de las salas siempre hay luz. `cambiarHora()` salta al día o a la noche (botón de la barra).

**La noche no tapa nada:** cada cosa se tiñe (`teñir()`). Las personas se tiñen menos y el jugador menos aún.
`ventanasNoche()` saca de cada edificio una capa con solo sus cristales encendidos, que va justo encima de su edificio.
En la casa-cabeza y en el marcador solo se encienden unos colores concretos (`soloVentanas`). El marcador del campo
también tiene su propia luz.

## Esferas, nube y penaltis

`ESFERAS` (en `mapa.js`) dice dónde está cada una de las siete, fuera o dentro de una sala. Las encontradas se guardan en
`estado.esferas`; con las siete, `pedirDeseo()` oscurece el cielo y hace girar las esferas alrededor del jugador. La nube amarilla
va bajo tus pies 10 s, con turbo (`subirNube()`), y desaparece del suelo. Al acabarse, `posarNube()` la deja
flotando donde estés, y el punto para cogerla la sigue (con *getters*). Los penaltis son el quinto juego de `arcade.js` y se abren desde el campo de fútbol.
Si cargas el tiro en la franja naranja sale el **tornado de fuego**, que no para el portero.

El campo mide 208 × 128. Sus medidas (valla, puertas y banquillos) están en `ESTADIO` (`sprites.js`) y sirven tanto
para dibujarlo como para sus colisiones. Al lado está el marcador `marcador_raimon` (UDIT 0 – RAIMON 8).

## Récords de las recreativas

Cada máquina enseña dos récords:
- **TU RECORD:** tu mejor puntuación, guardada en el navegador.
- **BEST SCORE: nombre puntos:** el récord de todos. Se pide al Worker al abrir la máquina (`GET /records`).

Si lo superas, se manda con el nombre de tu personaje (`POST /record`). El servidor solo lo guarda si es mayor que
el que hay (lo compara la propia base de datos) y rechaza puntuaciones por encima de un tope para cada juego.
En desarrollo solo se lee: no se manda nada.

## La reseña de Reblán

Al entrar por primera vez en la tienda (y desde el mostrador, `resena: true`), `pedirResena()` pregunta si has
comprado alguna vez allí y ofrece abrir las reseñas de Google de la tienda real (`ENLACES.resenaReblan`):
- Se abre en otra pestaña, porque Google no deja incrustar su página en otra web.
- El texto deja claro que es una reseña de verdad, de la tienda real, no del juego.
- No hay premio, porque las reseñas tienen que ser de clientes reales.

## Mando táctil

En pantallas táctiles, la mitad izquierda de abajo es una palanca flotante: aparece donde apoyas el dedo y escribe `vx` y `vy`
(de -1 a 1) en `teclasTactiles`, así que se anda en cualquier dirección y más o menos deprisa. `Mundo.update()` usa esos valores
si existen y, si no, el teclado. Al empezar a jugar en el móvil se pide la pantalla completa (`pantallaCompleta()` en `ui.js`).

## Idiomas y estado

`estado.js` guarda idioma, sonido, personaje, zonas visitadas, esferas encontradas y si el recorrido está hecho. Todos los textos
salen de `content.js` y `historia.js`, que tienen la misma estructura en `es` y `en`.

## Registro de visitas (`registro.js`, `registro/` y `/accesos/`)

`registro.js` avisa al servidor de `registro/` (un Cloudflare Worker con una base de datos D1) cuando alguien
entra y de lo que hace: el personaje que crea, las zonas, si termina o se salta el recorrido, el modo clásico,
el CV, las recreativas y los enlaces a otras webs. País y ciudad aproximados los añade Cloudflare; la IP no se
guarda y no hay cookies. No cuenta en desarrollo, ni a los robots, ni el navegador de Alejandro.

`/accesos/` es una segunda página de Vite (`accesos/index.html` y `accesos.js`) que pide la contraseña
(secreto `CLAVE_ACCESOS` del Worker) y muestra las últimas 150 visitas, con un resumen de hoy, la semana y los
países. Se actualiza cada 30 s y, al entrar, marca ese navegador para que no cuente como visita.

El mismo Worker guarda los récords de las recreativas en la tabla `records` (`esquema.sql`), con las rutas
`GET /records` y `POST /record`.

Para cambiar el servidor: `cd registro`, `npx wrangler deploy`. Para cambiar la contraseña:
`npx wrangler secret put CLAVE_ACCESOS`.

## Publicación

`vite.config.js` usa `BASE` para la ruta de publicación. El flujo de GitHub Actions compila con Node 20 y publica
`dist/` en GitHub Pages: en la raíz si el repositorio es `alexxblaro16.github.io` y en `/nombre-del-repo/` si no.
