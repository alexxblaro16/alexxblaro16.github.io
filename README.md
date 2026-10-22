# alejandro.blanco()

Portfolio de **Alejandro Blanco Rodríguez**, desarrollador full stack junior, hecho como un videojuego de pixel art:
creas tu personaje, entras en Villalpando por la Puerta de la Villa y Alejandro te enseña su vida, sus proyectos y su
stack. Para quien tenga prisa hay un **modo clásico** con todo en una página, y el CV y el contacto están siempre a mano.

> `javac HelloWorld.java` → `java AlejandroBlanco` → `Hello, World!`
> Java fue el primer lenguaje que aprendí, así que el juego empieza ahí.

## Qué tiene

- **Intro de terminal**, menú (continuar, nueva partida, modo clásico, opciones y créditos) y **creador de personaje**
  (nombre, seis peinados, color de pelo, piel, camiseta y gafas), con vista previa animada.
- **Recorrido guiado**: Alejandro va delante y cuenta cada etapa (Villalpando, el instituto, la residencia en Madrid,
  MEDAC, las prácticas en Anexia, la UDIT, el Erasmus, los hackatones y DANTE P.W.). Se puede saltar en cualquier momento.
- **Mapa de su vida en píxeles**, con sitios dibujados a partir de fotos reales: la Puerta de la Villa (que se cruza
  por el arco), la Plaza Mayor con sus soportales, Reblán y su furgoneta, el IES Tierra de Campos, MEDAC Albalá y la UDIT.
- **Personajes que pasean por su zona**: familia y amigos, con su nombre de pila al pasar el ratón.
- **Paneles** de trayectoria, proyectos (con repositorio y demo), trofeos, stack y contacto, y **logros** al visitarlos.
- **Secretos**: el robot Jerry, un bloque de Minecraft, DANTE P.W. (que te sigue si se lo pides), el código Konami
  y algún guiño a Bob Esponja, Batman y Spider-Man.
- **Español e inglés**, sonido chiptune (apagado por defecto), controles táctiles en el móvil y la partida guardada
  en el navegador.

## Controles

| Acción | Teclado | Móvil |
| --- | --- | --- |
| Moverse | WASD o flechas | cruceta |
| Hablar / entrar | E, espacio o Enter | botón A |
| Menús | flechas + Enter o ratón | toque |

## Stack

- **Phaser 3.80** (física arcade, escalado a pantalla completa, `pixelArt`).
- **Vite 5** para el desarrollo y la compilación.
- **JavaScript** sin frameworks para la interfaz (HUD, diálogos, paneles y modo clásico en HTML y CSS).
- **Web Audio** para el sonido. **Press Start 2P** y **VT323** de Google Fonts.

No hay ni una imagen: **todo el pixel art se dibuja con código** en canvas al arrancar (personajes, edificios, suelos y
objetos). Así la web pesa poco y cualquier cambio de color o de diseño es una línea de código.

## Ejecutarlo

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # genera dist/
npm run preview   # sirve dist/ en http://localhost:4173
```

Para publicarlo en una subcarpeta (por ejemplo, en GitHub Pages de un repositorio de proyecto) se compila con
`BASE=/nombre-del-repo/ npm run build`. El flujo de `.github/workflows/deploy.yml` lo hace solo en cada push a `main`.

## Estructura

```
index.html            HUD, diálogo, paneles, mando táctil y modo clásico (HTML)
src/main.js           arranque de Phaser, espera a la fuente y código Konami
src/scenes/Mundo.js   la escena: mapa, colisiones, cámara, recorrido, NPC e interacción
src/mapa.js           qué hay en el mapa y dónde: edificios, objetos, suelos, personajes y recorrido
src/personajes.js     personajes de 24 × 32 dibujados por partes
src/edificios.js      edificios y objetos grandes (los reales, copiados de fotos)
src/sprites.js        suelos, árboles, Jerry y decorado pequeño
src/pixel.js          utilidades de dibujo: colores, contorno automático y una fuente de 3 × 5
src/pantallas.js      intro, menú, opciones, créditos y creador de personaje
src/ui.js             HUD, diálogos, paneles, logros, etiquetas y modo clásico
src/content.js        textos de la web en español e inglés (proyectos, stack, trayectoria)
src/historia.js       diálogos del recorrido en español e inglés
src/estado.js         idioma, sonido, personaje y progreso (localStorage)
src/sonido.js         efectos y música chiptune con Web Audio
docs/                 documentación del proyecto
```

## Documentación

- [Arquitectura](docs/ARQUITECTURA.md): cómo está montado el juego por dentro.
- [Pixel art con código](docs/PIXEL_ART.md): cómo se dibujan los personajes y los edificios.
- [Guion](docs/GUION.md): qué cuenta cada parada del recorrido.
- [Evolución](docs/EVOLUCION.md): cómo ha ido cambiando el proyecto y por qué.

## Contacto

- GitHub: [alexxblaro16](https://github.com/alexxblaro16)
- LinkedIn: [Alejandro Blanco Rodríguez](https://www.linkedin.com/in/alejandro-blanco-rodr%C3%ADguez-13977530b/)
- Correo: alexxblaro@gmail.com
- El CV en español y en inglés está en `public/cv/` y se descarga desde la propia web.

Diseñado y programado por Alejandro Blanco Rodríguez.
