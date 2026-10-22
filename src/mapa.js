// El mapa del mundo: de izquierda a derecha va la vida de Alejandro.
// Todas las medidas en casillas de 16 px. «arriba» = edificio encima del camino, «abajo» = debajo.

export const ANCHO = 172
export const ALTO = 34
export const CAMINO = 19 // fila del camino principal (ocupa 19 y 20)
export const CAMINO_INICIO = 3 // el camino recorre el pueblo de punta a punta

// Edificios: x es el centro, «base» es la fila donde apoya. «vida» = diálogo de la historia; «zona» = abre un panel
export const EDIFICIOS = [
  { clave: 'casa_pueblo', x: 5, base: 18 }, { clave: 'casa_pueblo_2', x: 10, base: 18 }, { clave: 'casa_pueblo', x: 15.5, base: 18 },
  { clave: 'edificio_madrid', x: 53, base: 18 }, { clave: 'edificio_madrid_2', x: 100.2, base: 18 },
  { clave: 'reblan', x: 29, base: 18, letrero: 'REBLÁN ELECTRODOMÉSTICOS', vida: 'reblan' },
  { clave: 'soportales', x: 36, base: 13.5, letrero: 'PLAZA MAYOR' },
  { clave: 'casa_plaza_3', x: 21, base: 13.5 }, { clave: 'casa_plaza_1', x: 26.5, base: 13.5 }, { clave: 'casa_plaza_2', x: 46.5, base: 13.5 },
  { clave: 'piso', x: 45, base: 18, vida: 'casa' },
  { clave: 'instituto', x: 36, base: 29, vida: 'instituto' },
  { clave: 'residencia', x: 67, base: 18, letrero: 'RESIDENCIA JOSÉ PÉREZ DE VARGAS', vida: 'residencia' },
  { clave: 'medac', x: 83, base: 18, letrero: 'MEDAC', vida: 'medac' },
  { clave: 'anexia', x: 93, base: 18, letrero: 'ANEXIA', vida: 'anexia' },
  { clave: 'udit', x: 109, base: 18, letrero: 'UDIT', zona: 'trayectoria' },
  { clave: 'hackaton', x: 125, base: 18, letrero: 'HACKATONES', vida: 'hackaton' },
  { clave: 'laboratorio', x: 135, base: 18, zona: 'proyectos' },
  { clave: 'trofeos', x: 144, base: 18, zona: 'trofeos' },
  { clave: 'terminal', x: 152, base: 18, zona: 'stack' },
  { clave: 'correos', x: 160, base: 18, zona: 'contacto' },
]

// Cosas sueltas del decorado (también se puede interactuar con varias)
export const OBJETOS = [
  // Entrada al pueblo: se cruza la Puerta de la Villa por el arco, entre dos trozos de muralla
  { clave: 'puerta_villa', x: 19, base: 27.5, puerta: true, letrero: 'VILLALPANDO' },
  { clave: 'muralla', x: 13, base: 27.5 }, { clave: 'muralla', x: 25, base: 27.5 },
  // Plaza Mayor
  { clave: 'fuente', x: 32, base: 15.5, solido: true },
  { clave: 'banderas', x: 49.4, base: 18.3, vida: 'banderas' },
  { clave: 'furgoneta', x: 34.6, base: 18.4 },
  { clave: 'farola', x: 24.5, base: 17.6 }, { clave: 'farola', x: 41.5, base: 17.6 }, { clave: 'farola', x: 28, base: 24.2 },
  { clave: 'banco', x: 36.2, base: 16.4 }, { clave: 'banco', x: 39.6, base: 16.4 }, { clave: 'banco', x: 30.5, base: 23.4 },
  { clave: 'papelera', x: 41.2, base: 16.4 }, { clave: 'macetero', x: 22.5, base: 18.2 }, { clave: 'macetero', x: 22.5, base: 24.3 }, { clave: 'macetero', x: 44.5, base: 24 },
  { clave: 'puesto', x: 41.5, base: 23.6 },
  // Guiño a Bob Esponja junto al agua
  { clave: 'casa_cabeza', x: 4.5, base: 25, vida: 'cabeza' }, { clave: 'casa_pina', x: 8.5, base: 25, vida: 'pina' }, { clave: 'casa_roca', x: 9.2, base: 30.6, vida: 'roca' },
  { clave: 'laguna', x: 5, base: 29.5 }, { clave: 'muelle', x: 6.6, base: 28, vida: 'medusas' },
  { clave: 'palmera', x: 11, base: 23.5 }, { clave: 'palmera', x: 2.6, base: 31.5 },
  { clave: 'quiosco', x: 89, base: 18.2 },
  // Madrid
  { clave: 'farola_moderna', x: 60.5, base: 18.2 }, { clave: 'farola_moderna', x: 77.2, base: 18.2 }, { clave: 'farola_moderna', x: 97, base: 18.2 },
  { clave: 'aparcabicis', x: 74, base: 18.3 }, { clave: 'coche_azul', x: 59, base: 23.6 }, { clave: 'coche_rojo', x: 74.5, base: 23.6 }, { clave: 'coche_blanco', x: 93, base: 23.6 },
  // Zona de la uni y de los proyectos
  { clave: 'aparcabicis', x: 117, base: 18.3 }, { clave: 'banco', x: 122, base: 23.8 }, { clave: 'mochila_arana', x: 122.6, base: 23.85, vida: 'arana' },
  { clave: 'farola_moderna', x: 130, base: 18.2 }, { clave: 'veleta', x: 138.6, base: 18.3, vida: 'murcielago' },
  { clave: 'macetero', x: 148.2, base: 18.3 }, { clave: 'macetero', x: 156, base: 18.3 }, { clave: 'banco', x: 147, base: 23.4 },
  { clave: 'telarana', x: 151.25, base: 16.5, encima: true },
  { clave: 'parada', x: 57, base: 18.4, vida: 'parada', letrero: 'MADRID · 2023' },
  { clave: 'cartel', x: 88, base: 23, zona: 'hola', letrero: 'HELLO, WORLD!' },
  { clave: 'campo', x: 104, base: 28, vida: 'futbol' },
  { clave: 'avion', x: 118, base: 25, vida: 'tallin', letrero: 'TALLIN' },
  { clave: 'bloque', x: 51, base: 31, vida: 'minecraft', secreto: true },
  { clave: 'cartel', x: 166, base: 18.4, vida: 'fin', letrero: 'FIN… POR AHORA' },
  { clave: 'cartel', x: 21.6, base: 31.6, vida: 'inicio', letrero: 'START' },
]

// Zonas con suelo especial
export const SUELOS = [
  { tipo: 'piedra', x0: 20, x1: 47, y0: 13, y1: 20 }, { tipo: 'piedra', x0: 24, x1: 47, y0: 21, y1: 26 }, // Plaza Mayor
  { tipo: 'baldosa', x0: 100, x1: 130, y0: 21, y1: 21 },
  { tipo: 'asfalto', x0: 62, x1: 96, y0: CAMINO, y1: CAMINO + 1 }, // Madrid
  { tipo: 'arena', x0: 2, x1: 11, y0: 21, y1: 31 }, // rincón de la piña
]
// Caminos verticales hacia los edificios de abajo
export const SENDAS = [
  { x: 18, y0: 21, y1: 32 }, { x: 19, y0: 21, y1: 32 }, { x: 36, y0: 21, y1: 29 }, { x: 88, y0: 21, y1: 23 }, { x: 104, y0: 21, y1: 24 }, { x: 118, y0: 21, y1: 25 }, { x: 51, y0: 21, y1: 31 },
]

// Personajes: la familia y los amigos (solo el nombre de pila, que se ve al pasar el ratón).
// Rasgos sacados de sus fotos: pelo, piel, gafas, barba y la ropa que más llevan.
const amigos = (lista, x0, y0) => lista.map(([nombre, pelo, ropa, extra = {}], i) => ({
  nombre, x: x0 + (i % 4) * 2.2 + (i > 3 ? 1 : 0), y: y0 + Math.floor(i / 4) * 2,
  rasgos: { pelo: 'corto', piel: '#f2c29b', colorPelo: pelo, ropa, ...extra },
}))

export const PERSONAJES = [
  { nombre: 'Pedro', x: 29, y: 19.2, rasgos: { pelo: 'calvo', colorPelo: '#9a8a80', piel: '#ebb995', ropa: '#1f2430', pantalon: '#3a4a66', robusto: true, sonrisa: true, zapatillas: '#e9ecef' }, vida: 'pedro' },
  { nombre: 'Martha', x: 43.5, y: 19.2, rasgos: { pelo: 'media', colorPelo: '#5e3c24', piel: '#d49a72', ropa: '#f4b6c8', tipo: 'chaqueta', interior: '#f6f0d8', rayas: '#e8c45a', pantalon: '#a9bfdc', anchos: true, sonrisa: true, labios: '#c4505a', bolso: '#6b4a2b', zapatillas: '#f4f4f4' }, vida: 'marta' },
  { nombre: 'Dante', x: 46.5, y: 19.2, rasgos: { pelo: 'flequillo', colorPelo: '#8a5a38', piel: '#f2cba8', ropa: '#4a3f3a', pantalon: '#d6cfbf', anchos: true, zapatillas: '#f4f4f4', logo: '#e8e2d6' }, vida: 'dante' },
  ...amigos([
    ['Beatriz', '#6b4527', '#a98bd6', { pelo: 'largo', gafas: true, tipo: 'sudadera', pantalon: '#8fa3bf', anchos: true }],
    ['Natalia', '#c49a5a', '#eef1f4', { pelo: 'melena', tipo: 'sudadera' }],
    ['Andrea', '#3b2418', '#2b2f38', { pelo: 'largo' }],
    ['Hugo', '#1d1a19', '#24324f', { pelo: 'rizado', piel: '#d9a07a', tipo: 'sudadera' }],
    ['Jorge', '#141212', '#eef1f4', { pelo: 'rizado', zapatillas: '#f4f4f4' }],
  ], 62, 21.5),
  ...amigos([
    ['Pablo', '#4a3020', '#1f2430', { pelo: 'ondulado', tipo: 'chaqueta', interior: '#9aa1aa', cadena: true, pantalon: '#3a3f48', anchos: true }],
    ['Héctor', '#3b2a20', '#24324f', { pelo: 'ondulado', piel: '#d9a07a', tipo: 'polo' }],
  ], 80, 21.5),
  ...amigos([
    ['Manuel', '#5a4030', '#1f2430', { tipo: 'polo', pantalon: '#cfc6b0' }],
    ['Carlos', '#1d1a19', '#2b2f38', { piel: '#e5a97f' }],
    ['Gonzalo', '#2a1d16', '#3d7be0', { pelo: 'ondulado', piel: '#e0a984', barba: true, tipo: 'sudadera' }],
    ['Hugo', '#2a1d16', '#eef1f4', { pelo: 'rizado', gafas: true, barba: 'perilla' }],
    ['Iván', '#5a4030', '#eef1f4', { piel: '#ecb68f', zapatillas: '#f4f4f4' }],
    ['Pablo', '#7a4a26', '#2b2f38'],
    ['Rodrigo', '#141212', '#eef1f4', { pelo: 'cortina', piel: '#f3d2ae', ojosFinos: true, zapatillas: '#f4f4f4', logo: '#3a7bd5' }],
    ['Andrea', '#141212', '#e8c8c0', { pelo: 'melena', gafas: true, piel: '#d9a07a' }],
    ['Gabriel', '#4a3020', '#1f2a44', { piel: '#ecb68f', logo: '#7fc8ff', zapatillas: '#f4f4f4' }],
  ], 100, 21.4),
]

// El recorrido guiado: adónde va Alejandro y qué cuenta (las frases están en historia.js)
export const RECORRIDO = [
  { x: 20.6, y: 30.6, historia: 'bienvenida' },
  { x: 20.9, y: 29.2, historia: 'pueblo' },
  { x: 29, y: CAMINO + 1.3, historia: 'reblan', via: [[19, 29.2], [19, CAMINO + 0.5]] },
  { x: 45, y: CAMINO + 1.3, historia: 'casa' },
  { x: 36, y: 25, historia: 'instituto', via: [[36, CAMINO + 0.5]] },
  { x: 57, y: CAMINO + 0.5, historia: 'parada', via: [[36, CAMINO + 0.5]] },
  { x: 67, y: CAMINO + 0.5, historia: 'residencia' },
  { x: 83, y: CAMINO + 0.5, historia: 'medac' },
  { x: 93, y: CAMINO + 0.5, historia: 'anexia' },
  { x: 109, y: CAMINO + 0.5, historia: 'udit' },
  { x: 104, y: 23.5, historia: 'futbol' },
  { x: 118, y: 23.5, historia: 'tallin', via: [[104, CAMINO + 0.5], [118, CAMINO + 0.5]] },
  { x: 125, y: CAMINO + 0.5, historia: 'hackaton' },
  { x: 140, y: CAMINO + 1.5, historia: 'dante_pw' },
  { x: 148, y: CAMINO + 0.5, historia: 'final' },
]
