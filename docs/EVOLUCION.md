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

### 9. El portfolio serio, chicas y chicos, fútbol y berenjena
- **Modo clásico rehecho como una web profesional**: barra de navegación con secciones e idioma, cabecera estilo editor
  (`HelloWorld.java`) con la foto del CV, resumen, «Abierto a prácticas» y botones (prácticas, CV, GitHub, LinkedIn),
  cuatro datos destacados, proyectos en tarjetas con su stack y enlaces (MedScan destacado), trayectoria en línea de
  tiempo, stack con barras de nivel, medios y contacto. Letra Inter y JetBrains Mono, como el CV; se adapta al móvil.
- **Chico o chica** en el creador: con chica, cintura más estrecha, pestañas y labios; y abajo pantalón, falda o
  pantalón corto. El aleatorio también elige.
- **Campo de fútbol** completo: áreas, puntos de penalti, media luna, córners con banderines, porterías con red, un
  balón, banquillo y una grada con público.
- **Huerto** en el pueblo con una berenjena gigante (y berenjenas en el puesto de fruta de la plaza).

### 10. Recreativos, estadio y guiños
- **Recreativos** arriba a la derecha del mapa, con cuatro máquinas que se juegan de verdad (`src/arcade.js`):
  serpiente, una nave que destruye bugs, un rompe-ladrillos y «Commit Hunt», un laberinto propio en el que se recogen
  commits mientras te persiguen dos conflictos de merge (no es una copia de ningún juego). Récord guardado por juego.
- **Estadio**: pista de atletismo alrededor del campo, cuatro torres de focos, marcador «UDIT 3 - 0 RIVAL», banquillos y grada.
- **Señales de carretera**: entrada a Villalpando, fin de Villalpando tachado al salir y entrada a Madrid.
- **Guiños de programación**: patito de goma en la laguna, cartel 404 al final del camino, café Java y una mariquita (un bug).
- **Guiños a The Office**: campo de remolachas, grapadora en gelatina, la taza del mejor jefe del mundo y un poste hacia Scranton.
- **Ropa más real**: estampados en las camisetas, sudaderas con puños, bolsillo y cordones, chaquetas con cremallera
  y bolsillos, polos con botones, vaqueros con costuras y bajo vuelto, zapatillas con franja.
- **Mapa más lleno**: más casas en el pueblo y en la zona de proyectos, bloques y un parque con fuente en Madrid.
- En el modo clásico, «+10 proyectos».

### 11. La Plaza Mayor de verdad
- La plaza queda **toda rodeada de casas con soportales**: arriba el ayuntamiento con el **Bar Silvia** a su izquierda
  y **Garibalde** a su derecha, casas a los lados y, enfrente, los soportales del **Bar Burgos** con su terraza.
  Cada bar tiene su rótulo y luz dentro de los arcos.
- El piso de la familia sale de la plaza, con las banderas al lado.
- **Instituto accesible**: se baja por un camino a la izquierda hasta la puerta, y Alejandro se para delante de ella.
- **UDIT** más alargada, con dos alas a los lados y sin la terraza.
- **Estaciones de BiciMAD** en Madrid y junto a la uni («la cojo mucho para ir a clase»).
- Las referencias ya no se atraviesan (huerto, remolachas, café Java, cartel 404) y los árboles no se plantan encima de caminos.
- Al andar, los brazos se balancean al contrario que las piernas y la animación va algo más rápida.
- Más casas en el pueblo, en Madrid y en la zona de proyectos.

### 12. Prensa enlazada y amigos que hablan
- En MedScan (panel de trofeos y modo clásico) cada medio enlaza a su noticia: UDIT, RNE, Za49, Hipertextual, IT User,
  Revista Byte y Zona Movilidad; y después Antena 3, El Español, El Periódico de España y El Día de Zamora (enlaces de Alejandro).
- La tecla E vuelve a salir siempre: durante el recorrido se escondía en todo el mapa y ahora solo encima del guía cuando muestra su «!».
- Todos los amigos tienen frase al pulsar E (de qué conocen a Alejandro), con hueco para una frase propia de cada uno.
- Campo de fútbol universitario normal: sin pista de atletismo, césped artificial alrededor, valla metálica y banquillos; sin marcador.
- Furgoneta de Reblán redibujada (cabina, puerta corredera, retrovisor, pasos de rueda, rótulo con borde) y la tienda fuera
  de la plaza, a la entrada del pueblo junto a la Puerta de la Villa.

- Frases propias: Martha («Quiero muchísimo a mi hijo»), Dante (el fútbol y su hermano), Hugo y Jorge (el pádel en el Margot),
  y frases para el resto según lo que hemos hecho juntos (MedScan, los hackatones, Front End II, VirtualpH, PyKV, el piso).
- Al pulsar E se habla con lo más cercano, no con lo primero de la lista (junto al campo salía la frase del campo en vez de la del amigo).

### 13. Alejandro pasea y más detalles
- Al empezar, Alejandro te saluda solo otra vez (estaba un poco lejos para arrancar la presentación). Al terminar el recorrido, no se queda quieto: va andando por el camino de un sitio a otro, se para un rato
  y sigue; si te acercas, se para y te mira para que puedas hablarle.
- Letreros en los edificios de proyectos: Laboratorio, Sala de trofeos, Terminal y Correos.
- La parada del autobús cuenta el viaje: «2023. Con 18 años me subí a este autobús y me fui yo solo a Madrid».
- Anexia (de Alquiler Seguro) con sus colores, naranja y blanco, en un edificio de dos plantas más grande.
- Pablo (castaño), Héctor (castaño tirando a rubio) y Cristian, «Valdi» (nuevo: castaño claro, sudadera gris y vaqueros claros) hablan de CHAP Games, el proyecto final que hicieron con Alejandro en el MEDAC; Héctor, además, de las prácticas.

- Créditos: agradecimiento a los profesores del MEDAC y de la UDIT y a mis padres, Pedro y Martha, y dedicado a mi hermano Dante.

## Ideas para más adelante

- Interiores: entrar en algunos edificios.
- Ciclo de día y noche.
- Un minijuego en el campo de fútbol.
- Dominio propio.
