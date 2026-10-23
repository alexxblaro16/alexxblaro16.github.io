// El mapa del mundo: de izquierda a derecha va la vida de Alejandro.
// Todas las medidas en casillas de 16 px. «arriba» = edificio encima del camino, «abajo» = debajo.

export const ANCHO = 172
export const ALTO = 34
export const CAMINO = 19 // fila del camino principal (ocupa 19 y 20)
export const CAMINO_INICIO = 3 // el camino recorre el pueblo de punta a punta

// Edificios: x es el centro, «base» es la fila donde apoya. «vida» = diálogo de la historia; «zona» = abre un panel
export const EDIFICIOS = [
  // Villalpando: casas a lo largo del camino y una segunda fila detrás
  { clave: 'casa_pueblo', x: 5, base: 18 }, 
  { clave: 'casa_pueblo', x: 15, base: 12.5 },
  { clave: 'casa_pueblo_2', x: 44.5, base: 30.6 }, { clave: 'casa_pueblo', x: 26, base: 31.4 },
  // Plaza Mayor, toda rodeada de casas con soportales: arriba el ayuntamiento con el Bar Silvia a su izquierda
  // y Garibalde a su derecha, casas a los lados y enfrente los soportales del Bar Burgos
  { clave: 'soportales', x: 36, base: 13.5, letrero: 'PLAZA MAYOR' },
  { clave: 'casa_plaza_3', x: 21, base: 13.5 }, { clave: 'bar_silvia', x: 26.5, base: 13.5, vida: 'bar_silvia' },
  { clave: 'bar_garibalde', x: 45.5, base: 13.5, vida: 'bar_garibalde' }, { clave: 'casa_plaza_2', x: 50.5, base: 13.5 },
  { clave: 'soportal_lado', x: 22.8, base: 18.3 }, { clave: 'soportal_lado_2', x: 45.6, base: 18.3 },
  { clave: 'soportal_sur', x: 27.9, base: 26.4 }, { clave: 'bar_burgos', x: 36, base: 26.4, vida: 'bar_burgos' }, { clave: 'soportal_sur_2', x: 44.4, base: 26.4 },
  { clave: 'reblan', x: 10.4, base: 18, letrero: 'REBLÁN ELECTRODOMÉSTICOS', vida: 'reblan' },
  { clave: 'piso', x: 50.5, base: 18, vida: 'casa' },
  // El instituto, con su camino hasta la puerta
  { clave: 'instituto', x: 36, base: 31.6, vida: 'instituto' },
  // Madrid
  { clave: 'edificio_madrid_2', x: 61, base: 13 }, { clave: 'edificio_madrid_2', x: 75, base: 13 }, { clave: 'edificio_madrid', x: 90.2, base: 13 },
  { clave: 'edificio_madrid_2', x: 66, base: 31.4 }, { clave: 'edificio_madrid', x: 71, base: 31.4 }, { clave: 'edificio_madrid', x: 91, base: 31.4 }, { clave: 'edificio_madrid_2', x: 96, base: 30.6 },
  { clave: 'residencia', x: 67, base: 18, letrero: 'RESIDENCIA JOSÉ PÉREZ DE VARGAS', vida: 'residencia' },
  { clave: 'medac', x: 83, base: 18, letrero: 'MEDAC', vida: 'medac' },
  { clave: 'anexia', x: 93.5, base: 18, letrero: 'ANEXIA · ALQUILER SEGURO', vida: 'anexia' },
  // La uni y los proyectos
  { clave: 'edificio_madrid_2', x: 100.2, base: 18 }, { clave: 'edificio_madrid', x: 117, base: 13 },
  { clave: 'udit', x: 109, base: 18, letrero: 'UDIT', zona: 'trayectoria' },
  { clave: 'hackaton', x: 125, base: 18, letrero: 'HACKATONES', vida: 'hackaton' },
  { clave: 'laboratorio', x: 135, base: 18, letrero: 'LABORATORIO', zona: 'proyectos' },
  { clave: 'trofeos', x: 144, base: 18, letrero: 'SALA DE TROFEOS', zona: 'trofeos' },
  { clave: 'terminal', x: 152, base: 18, letrero: 'TERMINAL', zona: 'stack' },
  { clave: 'correos', x: 160, base: 18, letrero: 'CORREOS', zona: 'contacto' },
  { clave: 'casa_pueblo', x: 131, base: 13 }, { clave: 'casa_pueblo_2', x: 146, base: 13 },
  { clave: 'casa_pueblo_2', x: 124, base: 30.6 }, { clave: 'casa_pueblo', x: 128.5, base: 30.6 },
  { clave: 'casa_pueblo_2', x: 136, base: 30.6 }, { clave: 'casa_pueblo', x: 141.5, base: 30.6 }, { clave: 'casa_pueblo', x: 156, base: 30.6 },
]

// Cosas sueltas del decorado (también se puede interactuar con varias)
export const OBJETOS = [
  // Entrada al pueblo: se cruza la Puerta de la Villa por el arco, entre dos trozos de muralla
  { clave: 'puerta_villa', x: 19, base: 27.5, puerta: true, letrero: 'VILLALPANDO' },
  { clave: 'muralla', x: 13, base: 27.5 }, { clave: 'muralla', x: 25, base: 27.5 },
  // Plaza Mayor
  { clave: 'fuente', x: 32, base: 15.5, solido: true },
  { clave: 'furgoneta', x: 15.8, base: 18.5 },
  { clave: 'farola', x: 25.3, base: 18.6 }, { clave: 'farola', x: 41.5, base: 17.6 }, { clave: 'farola', x: 30.2, base: 22.3 },
  { clave: 'banco', x: 36.2, base: 16.4 }, { clave: 'banco', x: 39.6, base: 16.4 }, { clave: 'banco', x: 25.2, base: 21.9 },
  { clave: 'papelera', x: 41.2, base: 16.4 }, { clave: 'macetero', x: 22.5, base: 24.3 },
  { clave: 'puesto', x: 41, base: 22.4 },
  { clave: 'mesa_bar', x: 34.4, base: 22.3 }, { clave: 'mesa_bar', x: 37.6, base: 22.3 },
  { clave: 'arbol_plaza', x: 21.6, base: 20.6 },
  // La casa de la familia, con las banderas de España y Colombia
  { clave: 'banderas', x: 53.6, base: 18.3, vida: 'banderas' },
  // Guiño a Bob Esponja junto al agua
  { clave: 'casa_cabeza', x: 4.5, base: 25, vida: 'cabeza' }, { clave: 'casa_pina', x: 8.5, base: 25, vida: 'pina' }, { clave: 'casa_roca', x: 9.2, base: 30.6, vida: 'roca' },
  { clave: 'laguna', x: 5, base: 29.5 }, { clave: 'muelle', x: 6.6, base: 28, vida: 'medusas' },
  { clave: 'palmera', x: 11, base: 23.5 }, { clave: 'palmera', x: 2.6, base: 31.5 },
  { clave: 'quiosco', x: 89, base: 18.2 },
  // Madrid: estaciones de BiciMAD, coches y un parque
  { clave: 'farola_moderna', x: 60.5, base: 18.2 }, { clave: 'farola_moderna', x: 77.2, base: 18.2 }, { clave: 'farola_moderna', x: 97, base: 18.2 },
  { clave: 'bicimad', x: 73.6, base: 18.4, vida: 'bicimad' }, { clave: 'coche_azul', x: 63.8, base: 23.6 }, { clave: 'coche_rojo', x: 74.5, base: 23.6 }, { clave: 'coche_blanco', x: 93, base: 23.6 },
  { clave: 'fuente', x: 80, base: 28.4, solido: true }, { clave: 'banco', x: 77, base: 28.6 }, { clave: 'banco', x: 83, base: 28.6 },
  { clave: 'arbol_plaza', x: 74.6, base: 29.4 }, { clave: 'arbol_plaza', x: 85.4, base: 29.4 }, { clave: 'farola_moderna', x: 80, base: 31.4 },
  // Zona de la uni y de los proyectos
  { clave: 'bicimad', x: 118.4, base: 18.4, vida: 'bicimad' }, { clave: 'banco', x: 122, base: 23.8 }, { clave: 'mochila_arana', x: 122.6, base: 23.85, vida: 'arana' },
  { clave: 'farola_moderna', x: 130, base: 18.2 }, { clave: 'veleta', x: 138.6, base: 18.3, vida: 'murcielago' },
  { clave: 'macetero', x: 148.2, base: 18.3 }, { clave: 'macetero', x: 156, base: 18.3 }, { clave: 'banco', x: 147, base: 23.4 },
  { clave: 'telarana', x: 151.25, base: 16.5, encima: true },
  { clave: 'parada', x: 57, base: 18.4, vida: 'parada', letrero: 'MADRID · 2023' },
  { clave: 'cartel', x: 88, base: 23, zona: 'hola', letrero: 'HELLO, WORLD!' },
  { clave: 'estadio', x: 104, base: 29, vida: 'futbol' }, { clave: 'grada', x: 104, base: 31.2 },
  { clave: 'foco', x: 99.4, base: 23.6 }, { clave: 'foco', x: 108.6, base: 23.6 }, { clave: 'foco', x: 99.4, base: 29.6 }, { clave: 'foco', x: 108.6, base: 29.6 },
  // huerto del pueblo con una berenjena gigante
  { clave: 'huerto', x: 9.5, base: 13.6 }, { clave: 'berenjena', x: 12.9, base: 13.8, vida: 'berenjena' },
  { clave: 'avion', x: 118.5, base: 26.6, vida: 'tallin', letrero: 'TALLIN' },
  { clave: 'bloque', x: 51, base: 31, vida: 'minecraft', secreto: true },
  { clave: 'cartel', x: 166, base: 18.4, vida: 'fin', letrero: 'FIN… POR AHORA' },
  { clave: 'cartel', x: 21.6, base: 31.6, vida: 'inicio', letrero: 'START' },
  // Señales de carretera: entrada y salida de Villalpando y entrada a Madrid
  { clave: 'senal_villalpando', x: 15.8, base: 29.8 }, { clave: 'senal_fin_villalpando', x: 54.2, base: 22.9 }, { clave: 'senal_madrid', x: 60.6, base: 23 },
  // Recreativos arriba del todo, con cuatro máquinas que se pueden jugar
  { clave: 'recreativos', x: 162.5, base: 11.2, letrero: 'RECREATIVOS' },
  { clave: 'maquina_serpiente', x: 158.4, base: 13, arcade: 'serpiente' }, { clave: 'maquina_nave', x: 160.6, base: 13, arcade: 'nave' },
  { clave: 'maquina_ladrillos', x: 164.4, base: 13, arcade: 'ladrillos' }, { clave: 'maquina_laberinto', x: 166.6, base: 13, arcade: 'laberinto' },
  // Guiños de programación
  { clave: 'pato', x: 5, base: 27.7, vida: 'pato' }, { clave: 'cartel404', x: 2.5, base: 19.9, vida: 'error404' },
  { clave: 'taza_java', x: 154.6, base: 18.5, vida: 'java' }, { clave: 'bicho', x: 131.6, base: 22, vida: 'bug' },
  // Guiños a The Office
  { clave: 'remolachas', x: 5.6, base: 13.6, vida: 'remolachas' }, { clave: 'gelatina', x: 147.3, base: 23, vida: 'gelatina' },
  { clave: 'taza_jefe', x: 25.6, base: 21.5, vida: 'taza' }, { clave: 'poste_scranton', x: 169, base: 17.6, vida: 'scranton' },
]

// Zonas con suelo especial
export const SUELOS = [
  { tipo: 'piedra', x0: 20, x1: 47, y0: 13, y1: 20 }, { tipo: 'piedra', x0: 24, x1: 47, y0: 21, y1: 26 }, // Plaza Mayor
  { tipo: 'camino', x0: 30, x1: 42, y0: 32, y1: 32 }, // delante del instituto
  { tipo: 'baldosa', x0: 100, x1: 130, y0: 21, y1: 21 },
  { tipo: 'asfalto', x0: 62, x1: 96, y0: CAMINO, y1: CAMINO + 1 }, // Madrid
  { tipo: 'acera', x0: 60, x1: 98, y0: CAMINO - 1, y1: CAMINO - 1 }, { tipo: 'acera', x0: 60, x1: 98, y0: CAMINO + 2, y1: CAMINO + 2 },
  { tipo: 'arena', x0: 2, x1: 11, y0: 21, y1: 31 }, // rincón de la piña
]
// Caminos verticales hacia los edificios de abajo
export const SENDAS = [
  { x: 18, y0: 21, y1: 32 }, { x: 19, y0: 21, y1: 32 }, { x: 31, y0: 21, y1: 32 }, { x: 88, y0: 21, y1: 23 }, { x: 104, y0: 21, y1: 24 }, { x: 118, y0: 21, y1: 25 }, { x: 51, y0: 21, y1: 31 }, { x: 165, y0: 13, y1: 18 },
]

// Personajes: la familia y los amigos (solo el nombre de pila, que se ve al pasar el ratón).
// Rasgos sacados de sus fotos: pelo, piel, gafas, barba y la ropa que más llevan.
const amigos = (lista, x0, y0, grupo) => lista.map(([nombre, pelo, ropa, { frases, ...extra } = {}], i) => ({
  nombre, grupo, frases, x: x0 + (i % 4) * 2.2 + (i > 3 ? 1 : 0), y: y0 + Math.floor(i / 4) * 2,
  rasgos: { pelo: 'corto', piel: '#f2c29b', colorPelo: pelo, ropa, ...extra },
}))

export const PERSONAJES = [
  { nombre: 'Pedro', x: 10.4, y: 19.3, rasgos: { pelo: 'calvo', colorPelo: '#9a8a80', piel: '#ebb995', ropa: '#1f2430', pantalon: '#3a4a66', robusto: true, sonrisa: true, zapatillas: '#e9ecef' }, vida: 'pedro' },
  { nombre: 'Martha', x: 48.8, y: 19.3, rasgos: { pelo: 'media', colorPelo: '#5e3c24', piel: '#ebbd99', ropa: '#f4b6c8', tipo: 'chaqueta', interior: '#f6f0d8', rayas: '#e8c45a', pantalon: '#a9bfdc', anchos: true, sonrisa: true, labios: '#c4505a', chica: true, bolso: '#6b4a2b', zapatillas: '#f4f4f4' }, vida: 'marta' },
  { nombre: 'Dante', x: 52.4, y: 19.3, rasgos: { pelo: 'flequillo', colorPelo: '#8a5a38', piel: '#f2cba8', ropa: '#4a3f3a', pantalon: '#d6cfbf', anchos: true, zapatillas: '#f4f4f4', estampado: '#e8e2d6', raya: '#9aa3ad' }, vida: 'dante' },
  ...amigos([
    ['Beatriz', '#6b4527', '#a98bd6', { pelo: 'largo', gafas: true, tipo: 'sudadera', pantalon: '#8fa3bf', anchos: true, chica: true , frases: { es: ['De la residencia a compartir piso con Alejandro. Canela, mi perra, también se apunta.'], en: ['From the halls of residence to sharing a flat with Alejandro. Canela, my dog, is in too.'] } }],
    ['Natalia', '#c49a5a', '#eef1f4', { pelo: 'melena', tipo: 'sudadera', chica: true, zapatillas: '#f4f4f4' }],
    ['Andrea', '#3b2418', '#2b2f38', { pelo: 'largo', chica: true, estampado: '#ff7fb0', zapatillas: '#f4f4f4' , frases: { es: ['Empezamos en la misma residencia y ahora compartimos piso. Y seguimos aguantándonos.'], en: ['We started out in the same halls and now we share a flat. And we still put up with each other.'] } }],
    ['Hugo', '#1d1a19', '#24324f', { pelo: 'rizado', piel: '#d9a07a', tipo: 'sudadera' , frases: { es: ['¿Vamos a jugar un pádel?'], en: ['Fancy a game of padel?'] } }],
    ['Jorge', '#141212', '#eef1f4', { pelo: 'rizado', zapatillas: '#f4f4f4', estampado: '#e05a5a', raya: '#9aa3ad' , frases: { es: ['Si vienes tú, ya somos cuatro para el pádel: Hugo, Alejandro, tú y yo. Esta noche, en el Margot.'], en: ['If you come, that makes four for padel: Hugo, Alejandro, you and me. Tonight, at the Margot.'] } }],
  ], 62, 21.5, 'residencia'),
  ...amigos([
    ['Pablo', '#4a3020', '#1f2430', { pelo: 'ondulado', tipo: 'chaqueta', interior: '#9aa1aa', cadena: true, pantalon: '#3a3f48', anchos: true, frases: { es: ['Soy integrante, junto a Héctor y Alejandro, de CHAP Games: un proyecto ambicioso que presentamos como trabajo final.'], en: ["Together with Héctor and Alejandro, I'm part of CHAP Games: an ambitious project we presented as our final assignment."] } }],
    ['Héctor', '#4a3020', '#22304d', { pelo: 'ondulado', piel: '#dca27c', tipo: 'polo', pantalon: '#2b2f38', zapatillas: '#f4f4f4', frases: { es: ['Soy integrante, junto a Pablo y Alejandro, de CHAP Games: un proyecto ambicioso que presentamos como trabajo final. Además, hice las prácticas con Alejandro.'], en: ["Together with Pablo and Alejandro, I'm part of CHAP Games: an ambitious project we presented as our final assignment. I also did my internship with Alejandro."] } }],
  ], 80, 21.5, 'medac'),
  ...amigos([
    ['Manuel', '#5a4030', '#1f2430', { tipo: 'polo', pantalon: '#cfc6b0', gafas: '#9a8560' , frases: { es: ['Hicimos MedScan juntos y seguimos en el mismo equipo para los hackatones.'], en: ["We built MedScan together and we're still on the same hackathon team."] } }],
    ['Carlos', '#1d1a19', '#2b2f38', { piel: '#e5a97f', estampado: '#f2b33d', zapatillas: '#2a2d33' , frases: { es: ['En el equipo de los hackatones yo hago de Product Owner. Alejandro, del front.'], en: ["On our hackathon team I'm the Product Owner. Alejandro takes the front end."] } }],
    ['Gonzalo', '#2a1d16', '#3d7be0', { pelo: 'ondulado', piel: '#e0a984', barba: true, tipo: 'sudadera' , frases: { es: ['MedScan empezó como un hackatón y acabamos saliendo en la tele.'], en: ['MedScan started as a hackathon and we ended up on TV.'] } }],
    ['Hugo', '#2a1d16', '#eef1f4', { pelo: 'rizado', gafas: true, barba: 'perilla' , frases: { es: ['Yo me encargo del back y Alejandro del front. Así nos entendemos.'], en: ["I handle the back end and Alejandro the front end. That's how we get along."] } }],
    ['Iván', '#7a5a3e', '#1f2124', { pelo: 'degradado', piel: '#ecbf9c', franja: '#8a9099', pantalon: '#3a3f48', zapatillas: '#f4f4f4' , frases: { es: ['Soy de Lanzarote. En Front End II hicimos juntos toda la parte de cuentas.'], en: ["I'm from Lanzarote. In Front End II we built the whole accounts module together."] } }],
    ['Pablo', '#141212', '#2b2f38', { pelo: 'larga', barba: 'rala', piel: '#e8b896' , frases: { es: ['Soy el lead de VirtualpH, el proyecto con el CSIC. Las pull requests de Alejandro las reviso yo.'], en: ["I'm the lead on VirtualpH, our project with CSIC. I'm the one who reviews Alejandro's pull requests."] } }],
    ['Rodrigo', '#141212', '#eef1f4', { pelo: 'cortina', piel: '#f3d2ae', ojosFinos: true, zapatillas: '#f4f4f4', estampado: '#3a7bd5', raya: '#3a7bd5' }],
    ['Andrea', '#141212', '#e8c8c0', { pelo: 'melena', gafas: true, piel: '#d9a07a', chica: true, zapatillas: '#f4f4f4' , frases: { es: ['¡Hola! Soy Andrea y soy de México. Vamos juntos a la uni, a la UDIT.'], en: ["Hi! I'm Andrea and I'm from Mexico. We're at uni together, at UDIT."] } }],
    ['Gabriel', '#3a2618', '#1f2a44', { pelo: 'despeinado', piel: '#ecb68f', rayasV: '#6fb6ff', corto: true, pantalon: '#15171c', calcetines: '#f4f4f4', zapatillas: '#f4f4f4' , frases: { es: ['PyKV, el equipo de fútbol de la uni… Alejandro y yo coincidimos en todo.'], en: ['PyKV, the uni football team… Alejandro and I end up together in everything.'] } }],
  ], 100, 21.4, 'uni'),
]

// El recorrido guiado: adónde va Alejandro y qué cuenta (las frases están en historia.js)
export const RECORRIDO = [
  { x: 20.6, y: 30.6, historia: 'bienvenida' },
  { x: 20.9, y: 29.2, historia: 'pueblo' },
  { x: 12.4, y: CAMINO + 1.3, historia: 'reblan', via: [[19, 29.2], [19, CAMINO + 0.5]] },
  { x: 50.5, y: CAMINO + 1.3, historia: 'casa' },
  // al instituto se baja por el camino de la izquierda hasta la puerta
  { x: 36, y: 32.3, historia: 'instituto', via: [[31, CAMINO + 0.5], [31, 32.3]] },
  { x: 57, y: CAMINO + 0.5, historia: 'parada', via: [[31, 32.3], [31, CAMINO + 0.5]] },
  { x: 67, y: CAMINO + 0.5, historia: 'residencia' },
  { x: 83, y: CAMINO + 0.5, historia: 'medac' },
  { x: 93, y: CAMINO + 0.5, historia: 'anexia' },
  { x: 109, y: CAMINO + 0.5, historia: 'udit' },
  { x: 104, y: 22.9, historia: 'futbol' },
  { x: 118, y: 23.5, historia: 'tallin', via: [[104, CAMINO + 0.5], [118, CAMINO + 0.5]] },
  { x: 125, y: CAMINO + 0.5, historia: 'hackaton' },
  { x: 140, y: CAMINO + 1.5, historia: 'dante_pw' },
  { x: 148, y: CAMINO + 0.5, historia: 'final' },
]
