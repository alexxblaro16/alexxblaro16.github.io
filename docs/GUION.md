# Guion del portfolio-juego

El visitante crea su personaje y Alejandro le guía por su vida, de izquierda a derecha por el mapa.
En cualquier momento puede saltarse el recorrido («Explorar libre») o abrir el modo clásico.
Los amigos son personajes de fondo: su nombre de pila solo aparece al pasar el ratón (o tocar) por encima.

## 0. Creación del personaje
Elige pelo, color de piel, camiseta y nombre. Aparece en un cruce de caminos.

## 1. Bienvenida
**Alejandro** (con su portátil lleno de pegatinas: Java, Python, JS, CSS, React, Git, GitHub, Android):
> ¡Ey, {nombre}! Soy Alejandro, desarrollador full stack. Bienvenido a mi vida en píxeles.
> Sígueme, que te la enseño desde el principio.

## 2. Villalpando
El juego empieza al sur del pueblo: se cruza la **Puerta de la Villa de San Andrés** por el arco y se llega a la **Plaza Mayor**.
> Esta es mi historia. Nací en Zamora en 2005 y viví en Villalpando 18 años. Este es mi pueblo.

- **Reblán Electrodomésticos**, la tienda de su padre. **Pedro** en la puerta.
  > Esta es la tienda de mi padre. Aquí he trabajado todos los veranos, atendiendo y echando una mano con las averías.
  Dentro, la primera vez, Pedro pregunta:
  > ¿Has comprado alguna vez en Reblán? Puedes dejarnos una reseña en Google. Ojo: es una reseña de verdad, de la tienda real de Villalpando, no del juego.
  Opciones: «Abrir las reseñas de Google» (se abren en otra pestaña) o «Ahora no».
- **Su casa** (un bloque de pisos, sin dirección). **Martha**, su madre, y **Dante**, su hermano.
  > Aquí vive mi familia. Mi hermano Dante tiene 15 años… y luego te presento a alguien que se parece mucho a él.
- **Supermercado Lupa**, encima de la plaza, con su aparcamiento delante. Es parada del recorrido, después del instituto:
  > Este es el Lupa del pueblo. Un verano trabajé aquí. Reponía estanterías, echaba una mano en la caja y ayudaba a la gente mayor a llevar la compra al coche. […] Venga, que nos vamos a la estación.
- **IES Tierra de Campos**:
  > En el instituto hice mis primeras cosas con Scratch y un Arduino, en 3.º de la ESO, y me encantó.
  > Desde pequeño soy fan de Minecraft: me pasaba horas pensando cómo estaría hecho por dentro. Ahí empezó todo.
- Secreto: un bloque de tierra y hierba en una esquina («Minecraft me trajo hasta aquí»).

## 3. Rumbo a Madrid
Entre el pueblo y Madrid hay una autovía que no se cruza andando, y desde un lado no se ve el otro. En la **estación de
autobuses de Villalpando**:
> 2023. Con 18 años me subí a este autobús y me fui yo solo a Madrid. […] Venga, súbete conmigo al Monbus: nos deja en la Estación Sur.

Llega el Monbus y subís los dos. Sale la escena del viaje por la meseta (Villalpando → Madrid, 0 a 230 km) y bajáis en la
**Estación Sur (Méndez Álvaro)**. Jugando libre, cada estación pregunta «¿Subes?» y se puede ir y volver.

## 4. Residencia José Pérez de Vargas
Personajes de fondo: **Beatriz, Natalia, Andrea, Hugo, Jorge, Manu y Rodrigo**. Charlan entre ellos.
- **Natalia**: «Nos conocimos en la resi y ahora vivimos juntos. Pasamos tanto tiempo juntos que ya nos lo sabemos todo el uno del otro.»
- **Manu** (pelo como Héctor, cara como Iván, ropa de calle): conciertos y eventos como la Scrap World.
- **Rodrigo** (de Cuenca, rubio, ojos claros, polo): «Coincidí con Alejandro en la resi de Madrid y de ahí salió una amistad de las buenas.»
> Mi primera casa en Madrid. Aquí conocí a gente de muchos sitios y viví un montón de experiencias.

## 5. MEDAC Albalá
Personajes de fondo: **Pablo y Héctor**.
> En el MEDAC hice el DAM. Aquí escribí mi primer System.out.println("Hello, World!") en Java,
> y mi primer formulario en HTML. Java fue mi primer lenguaje.
- **Oficina de Anexia** al lado:
  > Hice las prácticas en Anexia: rehicimos la web del departamento de tecnología con Astro, aprendiendo desde cero.

## 6. UDIT, la uni
Personajes de fondo: **Manuel, Carlos, Gonzalo, Hugo, Iván, Pablo, Rodrigo, Andrea y Gabriel** (este, con la equipación
dentro del campo), y además **Gonzalo** (gafas y barba; van juntos a clase), **Lucía** (pelo negro rizado en moño, aros;
comparten alguna clase) y los gemelos **Jorge** (de blanco; Ingeniería del Software, PyKV) y **Miguel** (de negro;
«compartimos alguna clase y nos llevamos genial»).
> Y ahora estoy en 3.º de Desarrollo de Software Full Stack en UDIT.
- **Campo de fútbol** (sin gradas, es universitario): > Juego en el equipo de fútbol de la uni. […] sale el tornado de fuego y no lo para nadie.
  Al lado, el marcador **UDIT 0 – RAIMON 8**, que de noche se enciende.
- **Avión a Tallin**: > Me fui de Erasmus a Tallin, a un programa intensivo, con amigos de la uni.
- **Sala de hackatones**: > IndesIAhack con CityScan y OdiseIA4Good con MedScan.
- **Robot Jerry** paseando por su zona. Al hablarle: Hablar (cómo lo programaste: siguelíneas, sumo y mando web) / Sígueme / Adiós.
- **DANTE P.W.**: un robot con la cara de Dante.
  > Hice esta IA para estar siempre con mi hermano, por eso se llama como él. Háblale: te cuenta cosas o se viene contigo.
  Igual que Jerry: Hablar / Sígueme / Adiós. Si le dices «Vuelve a tu sitio», vuelve a su zona.
- **Laboratorio → Proyectos** · **Sala de trofeos → MedScan** · **Terminal → Stack** · **Correos → Contacto y CV**

## 7. Final
> Y hasta aquí mi historia… por ahora. Ahora pasea por donde quieras.
> Si te encajo para unas prácticas, en Correos tienes mi email y mi CV.

Al terminar el recorrido se puede explorar libremente. Al visitar todas las zonas: «¡Has visto toda mi vida en píxeles!».

## Secretos
- Código Konami (↑↑↓↓←→←→ B A): todo pasa a verde de terminal.
- Jerry y DANTE P.W. te siguen a todas partes si se lo pides (también dentro de los edificios y en el autobús).
- El armario de su cuarto o el botón ROPA: te cambias de ropa sin empezar otra partida.
- Récords de todos en las recreativas: «BEST SCORE: nombre puntos».
- Rincón de arena junto al agua con la casa-piña, la casa-roca y la casa-cabeza de piedra (guiños a Bob Esponja), murciélago en la veleta (Batman) y mochila con una araña (Spider-Man).
- Bloque de tierra en Villalpando.
