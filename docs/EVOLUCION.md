# Evolución

Cómo ha ido cambiando el portfolio, qué se decidió y por qué.

## El punto de partida

El portfolio anterior era una plantilla de clase (Vite, Tailwind y GSAP). Funcionaba, pero se parecía a cualquier otro.
La idea nueva: que el portfolio fuera un juego de mi vida en píxeles, al estilo de los Pokémon de vista desde arriba,
donde el visitante crea su personaje y yo le hago de guía.

Decisiones de entrada:

- **Que no estorbe a quien tiene prisa.** Nombre, CV, «Abierto a prácticas» y contacto siempre visibles, y un modo
  clásico con todo en una página. Un reclutador dedica unos segundos; el juego es para quien quiera más.
- **Sonido apagado por defecto** y controles táctiles en el móvil.
- **Sin imágenes**: todo el pixel art se dibuja con código. La web carga rápido y es fácil de retocar.
- **Privacidad**: de mi familia y mis amigos solo sale el nombre de pila, de mi fecha de nacimiento solo el año,
  y mi casa se dibuja sin dirección. Tampoco digo qué día voy al fútbol, solo que juego en el equipo de la uni.

## Versiones

### 1. Primera versión jugable
Intro `javac HelloWorld.java` → `Hello, World!` (Java fue mi primer lenguaje), menú, creador de personaje, el mapa de
izquierda a derecha con las etapas de mi vida, el recorrido guiado, los paneles, los logros, el modo clásico,
español e inglés, sonido chiptune y los secretos (Jerry, el bloque de Minecraft, DANTE P.W. y el código Konami).

### 2. Mi personaje y el de mi familia y amigos, desde fotos
Con fotos de cada uno se ajustaron pelo, piel, gafas, barba y ropa. Mi madre se escribe Martha.

### 3. Más detalle (personajes de 16 × 24)
Personajes más altos con sombras, ojos con brillo y suelas; edificios con ventanas con marco, tejas y escalones;
árboles más grandes y una plaza de adoquines.

### 4. Personajes de 24 × 32 y sitios reales
Los personajes pasan a dibujarse por partes con un contorno del color de cada pieza. Los sitios se redibujan a partir
de fotos: la Puerta de la Villa con sus torres redondas, Reblán y la furgoneta, la Plaza Mayor, el IES Tierra de
Campos, MEDAC Albalá y la UDIT con su terraza.

### 5. Un mundo con vida
- La **Puerta de la Villa se cruza por el arco**: el juego empieza al sur del pueblo y se entra por ella, entre dos
  trozos de muralla.
- La **Plaza Mayor** tiene casas con soportales alrededor, bancos, maceteros, papeleras, farolas y un puesto de fruta.
- Más decorado por todo el mapa: coches, farolas modernas, aparcabicis y arbustos.
- Los **NPC pasean por su zona** y se paran a mirarte cuando te acercas.
- Mi familia se parece más (mi padre calvo y sonriente, mi madre con su melena y su chaqueta rosa, mi hermano con su
  flequillo) y DANTE P.W. lleva el flequillo de mi hermano.
- **Guiños** a Bob Esponja (en el DAM hice un juego suyo en Unity), Batman y Spider-Man (la W y la P de DANTE P.W.).

### 6. El rincón de arena y más pueblo
- Un rincón de arena junto al agua con tres casas de guiño a Bob Esponja: la piña, la roca con veleta y la cabeza
  de piedra, con palmeras, y una laguna redondeada con olas animadas, medusas flotando y un muelle de madera por el
  que se puede andar (sustituye al estanque cuadrado del principio).
- Más casas en el pueblo a lo largo del camino y edificios nuevos en Madrid, con un quiosco.
- El CV (en sus seis versiones) y el perfil de GitHub enlazan ya a esta web.
- Las banderas de España y Colombia ondean junto a la casa de mi familia (mi madre es colombiana). Mi madre lleva
  flequillo de lado, puntas más claras, labios pintados y bolso cruzado; Dante, flequillo desfilado con mechones claros;
  Rodrigo, pelo liso con raya al medio y flequillo de cortina.
- Cuando te acercas a algo con lo que se puede interactuar (personas, edificios, objetos, Jerry, DANTE P.W.) aparece
  encima una tecla «E» que flota; en el móvil sale «A», el botón táctil.
- Pablo (UDIT) con melena lisa negra con raya al medio y barba poco poblada; Manuel con gafas finas de montura dorada.

### 7. Creador nuevo y mapa más pulido
- **Creador de personaje** con vista grande que anda y se puede girar, botón de personaje aleatorio y tres pestañas:
  cuerpo (piel, once peinados, color de pelo y barba), ropa (prenda, color, pantalón, corte y zapatillas) y extras
  (gafas, cadena y sonrisa).
- Iván con degradado y la franja de su camiseta; Gabriel despeinado y con la equipación de fútbol de la UDIT (rayas,
  pantalón corto y medias blancas); Héctor con su pelo ondulado y polo; mi madre con la piel más clara y yo menos moreno.
- Avión de Tallin nuevo, visto desde arriba, con alas en flecha, motores, la cola con la bandera de Estonia y la escalerilla.
- Mapa: sombras bajo los edificios, bordes en el camino, árboles en alcorques en la plaza, palomas que picotean,
  flores por la hierba y una niebla suave en las esquinas de la pantalla.

### 8. Un mapa trabajado como un juego
- **Personajes**: ojos con párpado y brillo, nariz con luz, sombra en la barbilla, pliegues en la camiseta, dobladillo
  y puños, cinturón con hebilla, bolsillos y rodillas en el pantalón, brillo en las zapatillas, y el cuerpo baja un píxel
  en cada paso para que se note el peso al andar.
- **Suelo**: manchas de luz y sombra en la hierba calculadas píxel a píxel con ruido suave y tramado de Bayer (sin
  cuadrados de casilla), matas altas, bordes del camino irregulares, bordillo en la plaza y arena que se mete en la hierba.
- **Madrid**: aceras con bordillo, línea discontinua y dos pasos de cebra.
- **Árboles**: encinas, pinos y chopos (más chopos en el pueblo, como en Castilla).
- **Vida**: mariposas, bandadas de pájaros con su sombra y sombras de nubes que cruzan el mapa despacio.
- **Edificios**: placas solares en el laboratorio, copa en los trofeos, código en las ventanas y antena en la terminal,
  neón `</>` en los hackatones, aires acondicionados en la residencia y buzón en contacto.

## Ideas para más adelante

- Interiores: entrar en algunos edificios.
- Ciclo de día y noche.
- Un minijuego en el campo de fútbol.
- Dominio propio.
