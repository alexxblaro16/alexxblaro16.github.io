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

### 14. Música a elegir y recorrido más claro
- Cuatro estilos de música hechos con Web Audio: Aventura, Pueblo (un vals), Lo-fi y Arcade. Se eligen en Opciones o con el
  botón ♫ de la barra de arriba, y la elección se recuerda.
- En el recorrido, Alejandro presenta a su padre en la tienda («Y aquí está él, Pedro») y en casa al resto de la familia;
  en el MEDAC cuenta que conoció a Pablo, Héctor y Cristian, con los que hizo CHAP Games.
- Los bancos son sólidos enteros (la taza del mejor jefe del mundo ya no se atraviesa); la furgoneta, solo rojo, azul y blanco;
  Héctor, con el pelo más oscuro.

### 15. Móvil y tableta, y documento técnico
- Probado en móvil vertical (390 × 844), horizontal (844 × 390) y tableta (768 × 1024): la barra superior va en una fila que se
  desliza con el dedo, en horizontal el diálogo se coloca entre la cruceta y el botón, los recreativos caben en la altura y
  todo respeta la muesca y la barra de gestos. Se puede añadir a la pantalla de inicio como una app.
- `docs/Portfolio_lenguajes_y_tecnologias.pdf`: lenguajes, tecnologías y cómo se usa cada una (4 páginas).

### 16. Pantalla de accesos

Registro anónimo de visitas con un Cloudflare Worker y D1, y la página privada `/accesos/` con contraseña para
ver quién ha entrado: hora, país y ciudad aproximados, dispositivo, de dónde viene, el nombre de su personaje y
qué ha hecho dentro. Sin IP ni cookies; aviso en los créditos.

### 17. Interiores, día y noche, penaltis, guiños al anime y un modo clásico con vida

Antes de grabar el vídeo del portfolio, una revisión completa (jugador, reclutador y móvil) y una tanda de mejoras:

- **Interiores**: se entra en la casa de la familia (salón y mi cuarto), en Reblán, en el aula del MEDAC y en la UDIT (el tablón
  abre la trayectoria). Las salas viven debajo del mapa; al entrar, la cámara se centra en la sala y se sale por la puerta.
- **Día y noche**: un ciclo de 6 minutos con atardecer naranja, noche azul, farolas, focos y puertas encendidos y luciérnagas.
  El botón del sol o la luna de la barra salta de uno a otro (para el vídeo viene muy bien).
- **Penaltis** en el campo de la uni: se apunta, se carga la fuerza y, si se clava en la franja amarilla, sale un tiro relámpago.
  La valla del campo ahora es sólida y tiene puerta arriba y abajo.
- **Guiños a Dragon Ball e Inazuma Eleven**: siete esferas escondidas (dos dentro de edificios); con las siete se pide un deseo.
  Una nube amarilla a la que te subes para ir más rápido, un neumático para entrenar paradas y banderines con un rayo.
- **Colisiones**: ya no se atraviesa al guía, a DANTE P.W. ni a Jerry.
- **Música**: cada estilo va por su propio canal; al cambiar o apagar, el anterior se corta en vez de sonar encima.
- **Móvil**: palanca analógica que aparece donde apoyas el pulgar (en vez de la cruceta), botón de acción más grande,
  barra de arriba compacta con un menú ☰, pantalla completa al empezar a jugar y el mando se esconde en las recreativas.
- **Modo clásico**: fondo con manchas de color que se mueven, comentario que se escribe solo, el Alejandro del juego andando,
  cifras que cuentan, foto con un aro de color, cinta de tecnologías, tarjetas con foco, barras que se llenan al verlas y
  barra de progreso. Respeta «reducir movimiento». En el móvil, foto centrada y el botón «Jugar» en el menú.
- La pantalla de accesos cuenta también las salas, las esferas, el deseo, los penaltis y la pantalla completa (sin tocar el servidor).

### 18. Salas como las de verdad, noche más bonita, más música y botón de menú

Tras probar la versión 17, Alejandro pidió:

- **Casa**: mi cuarto con la cama pegada a la pared de la izquierda (sábanas del Real Madrid), el escritorio a la misma altura
  a la derecha, mesilla, armario y estanterías llenas de LEGO; el salón aparte, con su tabique y su puerta, el sofá y la tele
  donde veía muchísimo la tele. Sin mangas (no leo).
- **Reblán**: el mostrador en una esquina y los electrodomésticos en el centro, con pasillos.
- **UDIT**: en la entrada están mis profes Sandra (pelirroja, me dio Taller I), Fernando (pelo de punta, Representación de la
  Información) y Siam (poco pelo y barba, siempre dispuesto a ayudar); la máquina de café («está malísimo») y la de snacks
  (las barritas de almendras con yogur, buenísimas); hay que pasar los tornos, que se abren al acercarte, y subir en
  ascensor a la planta 3, donde están mis dos clases (iguales, en espejo) con más ordenadores que en el MEDAC.
- **Bit Drop**, una recreativa en el pasillo de la planta 3: juego propio de bloques que caen (parejas de bits de colores
  que se borran al juntar tres en línea). No es el Tetris: ese juego tiene dueño y no se copia.
- **Noche**: oscuridad que no lava los colores, ventanas encendidas en los edificios, una luz suave alrededor del jugador
  y la niebla de las esquinas en azul.
- **Música**: tres estilos más (Héroe, Verano y Noche): siete en total.
- **Botón «Menú»** en la barra para volver al menú principal sin recargar.
- Los muebles de dentro son sólidos enteros y la taza y la gelatina del banco ya no tapan al jugador.
- **Creador**: más ropa (camisa, camiseta de fútbol con el 10 a la espalda, kimono y abrigo), dibujos en el pecho (rayo,
  estrella, corazón, </> y píxeles), gorra, gorro de lana y cinta con su color, cascos y mochila, y cuatro colores más.
- **Guiño a Mickey Mouse**: un póster en blanco y negro en el salón, el ratón silbando al timón de un barco de vapor (1928).
- En la planta 3, una clase tiene **git push** en la pizarra y la otra **git pull**.
- **Noche nítida**: en vez de una capa oscura por encima, cada cosa se tiñe de azul (las personas menos y el jugador menos
  aún), y la luz de las farolas va en el suelo, así no borra a nadie.
- En el modo clásico, el Alejandro en píxeles se da la vuelta cuando anda hacia atrás.

- **Luces de noche bien colocadas**: las ventanas encendidas iban por encima de todo y tapaban al jugador; ahora van a la
  altura de su edificio (delante de él se te ve, detrás quedas oculto). La casa-cabeza de piedra ya no se enciende
  entera: solo sus dos ventanas.
- **Vídeo de 32 s**: suma tu casa, la entrada de la UDIT con los profes, la planta 3 (git push y git pull), Bit Drop,
  la nube y el deseo de las esferas.

### 19. Seis amigos más, el Monbus a Madrid, un campo de verdad, compañeros que te siguen y el probador

- **Seis personajes nuevos**. En la residencia, **Manu** (el pelo como Héctor, la cara como Iván y ropa de calle; con él
  voy a conciertos y a eventos como la Scrap World) y **Rodrigo** (de Cuenca, más rubio, de ojos claros, con polo y más
  grande). En la uni, **Gonzalo** (gafas, barba corta; vamos juntos a clase), **Lucía** (rizos castaños en moño, aros
  dorados y chándal; compartimos alguna clase) y los gemelos **Tort**: **Jorge** (conmigo en Ingeniería del Software,
  con PyKV) vestido de blanco y **Miguel** (compartimos alguna clase y nos llevamos genial) vestido al revés, de negro.
  Peinado nuevo «moño» y aros en el dibujo de los personajes.
- **Natalia** ya no tiene la frase genérica de la residencia: vivimos juntos y pasamos muchísimo tiempo juntos.
- **Los NPC se mueven más** (unas tres casillas alrededor de su sitio) y **charlan entre ellos**: uno va hacia otro de su
  grupo, se miran y salen bocadillos («...», «jaja», «!?»). Gabriel está dentro del campo, con su equipación.
- **El Monbus**: entre Villalpando y Madrid hay ahora una autovía con coches en los dos sentidos que no se cruza andando.
  En la parada del pueblo se coge el autobús (blanco con las franjas azul y amarilla de Monbus): llega, subes, se va, sale
  una escena del viaje por la meseta con los kilómetros (unos 230) y te deja en la **Estación Sur (Méndez Álvaro)**, un
  edificio nuevo junto a la residencia. Desde allí se vuelve al pueblo igual. En el recorrido guiado, Alejandro se sube
  contigo después de contar lo de 2023.
- **Campo de la uni**: fuera la grada (es un campo universitario). Más grande, con las líneas más claras, porterías con
  red, valla con lona verde, banquillos dentro, un carro de balones, conos y el escudo de la UDIT colgado en la valla.
- **Jerry y DANTE P.W.** andan sueltos por su zona y, al hablarles, eliges: **Hablar**, **Sígueme** (o **Quédate aquí**)
  o **Adiós**. Si te siguen, entran contigo en los edificios y suben al autobús; si se quedan atrás, aparecen a tu lado.
  Los diálogos ya admiten preguntas con varias respuestas (flechas o W/S y E, o con el ratón).
- **Cambiarse de ropa** sin empezar otra partida: botón **ROPA** en la barra o el armario de su cuarto. Se abre el creador
  solo con la ropa y los extras, y al ponértela se rehace el personaje en el sitio.

### 20. Dos lados que no se ven, dos estaciones, récords para todos y el marcador del Raimon

- **Villalpando y Madrid ya no se ven el uno desde el otro**: la cámara solo enseña el lado de la autovía en el que estás
  (en el menú sigue recorriendo el mapa entero).
- **Dos estaciones**: en el pueblo, una estación de autobuses pequeña de ladrillo con tejado en lugar de la marquesina; en
  Madrid, la Estación Sur, ahora más separada de la residencia (la resi y el BiciMAD se han movido a la derecha).
- **Lucía** con el pelo negro.
- **Récords en las recreativas**: tu mejor puntuación se guarda en el navegador y cada máquina enseña **BEST SCORE: nombre
  y puntos**, el récord de todos los que han jugado. Lo guarda el servidor del registro (tabla `records` en la misma base
  D1) y solo cambia cuando alguien lo supera; el servidor rechaza puntuaciones imposibles.
- **Jerry y DANTE P.W. vuelven a su zona** cuando les dices que dejen de seguirte («Vuelve a tu sitio»): andando si están
  cerca y, si están lejos (dentro de un edificio o al otro lado de la autovía), aparecen allí sin que se vea.
- **Campo más grande** (13 × 8 casillas) y un **marcador UDIT 0 – RAIMON 8**, un guiño a Inazuma Eleven, que se ilumina
  de noche.

### 21. La reseña de Reblán, el tornado de fuego y el vídeo de 45 segundos

- **Reseña de Reblán**: la primera vez que entras en la tienda, Pedro te pregunta si has comprado alguna vez allí y te
  ofrece dejar una reseña en Google. El aviso deja claro que es una reseña **de verdad**, de la tienda real de
  Villalpando, no del juego. Se puede volver a pedir desde el mostrador. Google no deja meter su página de reseñas dentro
  de otra web (la bloquea), así que se abre en otra pestaña y el juego se queda donde estaba. No hay premio por dejarla:
  las reseñas tienen que ser de clientes reales.
- **Tornado de fuego**: el tiro especial de los penaltis ya no es un relámpago. Ahora es un tornado de fuego (otro guiño a
  Inazuma Eleven), con un remolino de llamas alrededor del balón, una estela de fuego, un destello naranja y un sonido grave.
- **Vídeo de 45 s** (`public/video/portfolio.mp4` y el GIF del README). Una cuarta toma (`grabar4.mjs`) suma:
  - la reseña de Reblán;
  - el Monbus con el viaje y la llegada a la Estación Sur;
  - los amigos charlando;
  - Jerry siguiéndote;
  - el probador;
  - el tornado de fuego;
  - la pantalla del récord («BEST SCORE»);
  - el marcador del Raimon encendido de noche.

### 22. El Lupa del pueblo

- Encima de la Plaza Mayor, a la izquierda, está el **supermercado Lupa** de Villalpando. Se dibujó a partir de fotos
  reales de la cadena: fachada de paneles gris claro, el logo («lu» en azul y «pa» en naranja dentro de un cuadro azul),
  el carrito naranja, una franja naranja y la cristalera con estanterías y puertas automáticas.
- Delante tiene su **aparcamiento**, con plazas pintadas, dos coches, una fila de carros y la señal de la P. Desde la
  plaza se sube por un camino entre las casas.
- Al hablar con él: «Aquí trabajé un verano». Cuenta que reponía estanterías, echaba una mano en la caja y ayudaba a la
  gente mayor a llevar la compra al coche. Cierra con que un lineal bien ordenado se parece a un código bien escrito, y
  con que en un pueblo, si vas al súper, sales sabiendo todo lo que ha pasado esa semana. El carro dice que siempre hay
  uno que tira hacia un lado, como un bug que nadie arregla.
- De noche se encienden sus cristales, como los de los demás edificios.
- Alejandro pidió no volver a grabar el vídeo: el de 45 s se queda como está.

### 23. Cada uno en su sitio, Alejandro de corrillo en corrillo, el Lupa en el recorrido y la nube que se queda donde la dejas

- **Los personajes ya no se van lejos.** Antes, al ir a charlar con otro, se alejaban de su sitio y se encadenaba (uno
  seguía al otro hasta acabar lejísimos). Ahora:
  - Su zona es más pequeña: 36 px los amigos y 22 la familia.
  - Solo charlan con alguien que esté dentro de su zona.
  - Si se han alejado (por ejemplo, porque los han empujado), vuelven a su sitio.
  - Medido durante 90 s: el que más se alejó lo hizo 42 px, unas dos casillas y media.
- **Alejandro, el guía, va de corrillo en corrillo** al acabar el recorrido. Elige a alguien de su lado de la autovía
  (entre los seis más cercanos), sube al camino, lo recorre y baja hasta él. El amigo le espera y charlan con bocadillos.
  Si te acercas, se para y te mira, como antes.
- **El Lupa entra en el recorrido.** Después del instituto, Alejandro te lleva al Lupa: sube por la plaza y pasa por
  delante del Bar Silvia. Allí te cuenta el verano que trabajó en él y luego te lleva a la estación de autobuses.
- **La nube:** al cogerla desaparece del suelo y va bajo tus pies durante 10 segundos. Cuando se acaba se queda flotando
  donde estés, con su animación, hasta que la vuelvas a coger. La historia de la nube solo sale la primera vez.

### 24. El nombre primero, mucha más ropa, la ciénaga con la peña El Pilón, el metro y más amigos

- **El nombre es obligatorio.** Antes de abrir el creador sale una pantalla que solo pide el nombre, y sin él no se
  sigue. Si se borra dentro del creador, «A jugar» no deja empezar hasta que se escriba otra vez.
- **Creador más completo:**
  - Diez peinados más: canario, degradado, de punta, despeinado, cresta, medio, coleta, trenzas, recogido y afro.
  - Seis prendas nuevas: cuadros, chándal, tirantes, traje con corbata, vestido y el polo de la peña El Pilón.
  - Color de ojos, pantalón pitillo, bufanda, reloj y pendientes, boina y gorro de pescador, cuatro dibujos más
    (calavera, flor, balón y nota) y más colores de pelo, ropa, pantalón y zapatillas.
- **Amigos nuevos:**
  - En el instituto, los de toda la vida: Manuel, Iván y Jorge.
  - En la plaza, Jandro, que te ofrece cerezas de los cerezos del pueblo de su madre. Si dices que sí: moneda, los
    bocados con la barra de muslitos que se llena y el eructo (guiño a los juegos de bloques), un corazón, el logro
    «Cerezas de Jandro» y 15 segundos corriendo más. Si dices que no: «Pues tú te lo pierdes, chati».
  - Detrás del Lupa, Salva, de la peña El Pilón.
  - En la calle de la UDIT, Lucas (de Brasil, fue a Estonia con Alejandro) y Marcos.
  - Junto al sofá amarillo de la entrada de la UDIT, Diego (el 3D del proyecto del CSIC) y Arseny (de Rusia, fan de
    Linux).
  - En una clase de la planta 3, Emma, Claudia, Alba y Lucía (Jerry y Estonia).
- **La ciénaga**, arriba a la izquierda: se entra por la cancela y por dentro es selva, con charcas, juncos y un
  camino de tierra. Al subirlo sale «PEÑA EL PILON · Alegría de vivir». Al fondo, la casa de ladrillo de la peña.
- **La peña por dentro:** la barra, dos frigos y el arcón del hielo al fondo; sofás, mesa y bola de discoteca en el
  centro, e Iker con el polo de la peña. En la esquina, el equipo de música: reguetón, techno o charanga (se puede
  cambiar o apagar). Mientras suena, luces de colores por el suelo. Al salir de la peña vuelve tu música.
- **El metro:** una boca en la residencia, otra en el MEDAC y otra en la UDIT, de la misma línea. Eliges parada y sale el
  viaje: el tren por el túnel, las estaciones de azulejo blanco con su nombre y el plano de la línea abajo.
- Los letreros pintados con la fuente de píxel ya llevan Ñ y tildes.

### 25. Recreativos por dentro, cuarta parada de metro, chalets, el Bar El Arte y la música de la peña con artistas de broma

- **Música de la peña:** doce canciones inventadas en seis géneros (reguetón, urbano, electrónica, pop, rock y fiestas),
  de artistas de broma: Good Tunny, Daddy Yonki, Nepedo, C. Mandarina, Daruda, David Ghetto, Enrique Iglesitas, Rosalio,
  Estapo, Extremoblando, la Charanga El Pilón y la Orquesta Tierra de Campos. Las melodías son nuestras, no copias. Se
  elige género y canción en el equipo, y un cartel dice qué suena.
- **Recreativos por dentro:** las cuatro máquinas pasan dentro, con moqueta de neón, el cartel «INSERT COIN», máquina de
  peluches, máquina de cambio, air hockey, mostrador de premios, pufs y luces de colores.
- **Metro:** bocas más reales (granito, escalera que baja, barandilla de acero, placa azul con el nombre y el rombo de
  METRO) y una cuarta parada en los recreativos. Un neón en la esquina de Scranton señala el camino.
- **Bar El Arte**, arriba a la derecha del pueblo: fachada gris, letras granates y terraza. Por dentro, la barra, la tele
  con el partido del Madrid, las bufandas «HALA MADRID», la tragaperras y las mesas. Al entrar, Alejandro cuenta que allí
  pasa los fines de semana y ha visto muchas victorias del Madrid.
- **Chalets** entre los árboles, encima de Madrid.
- Retoques: Arseny con gafas grises y media melena negra, Alba rubia platino, Emma con la piel más oscura y Jandro con
  el pelo corto.

## Ideas para más adelante

- Dominio propio.
- Más salas (laboratorio, recreativos por dentro).
- Que los NPC también tengan rutina de día y de noche.
