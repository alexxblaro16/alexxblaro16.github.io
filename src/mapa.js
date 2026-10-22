// El mapa del mundo: de izquierda a derecha va la vida de Alejandro.
// Todas las medidas en casillas de 16 px. «arriba» = edificio encima del camino, «abajo» = debajo.

export const ANCHO = 172
export const ALTO = 34
export const CAMINO = 19 // fila del camino principal (ocupa 19 y 20)

// Edificios: x es el centro, «base» es la fila donde apoya. «vida» = diálogo de la historia; «zona» = abre un panel
export const EDIFICIOS = [
  { clave: 'reblan', x: 29, base: 18, letrero: 'REBLÁN ELECTRODOMÉSTICOS', vida: 'reblan' },
  { clave: 'soportales', x: 36, base: 13, letrero: 'PLAZA MAYOR' },
  { clave: 'piso', x: 45, base: 18, vida: 'casa' },
  { clave: 'instituto', x: 36, base: 29, letrero: 'IES TIERRA DE CAMPOS', vida: 'instituto' },
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
  { clave: 'puerta_villa', x: 19, base: 20.6, puerta: true, letrero: 'VILLALPANDO' },
  { clave: 'fuente', x: 32, base: 15.5, solido: true },
  { clave: 'furgoneta', x: 34.6, base: 18.4 },
  { clave: 'farola', x: 24.5, base: 17.6 }, { clave: 'farola', x: 41.5, base: 17.6 }, { clave: 'farola', x: 25, base: 24.5 },
  { clave: 'parada', x: 57, base: 18.4, vida: 'parada', letrero: 'MADRID · 2023' },
  { clave: 'cartel', x: 88, base: 23, zona: 'hola', letrero: 'HELLO, WORLD!' },
  { clave: 'campo', x: 104, base: 28, vida: 'futbol' },
  { clave: 'avion', x: 118, base: 25, vida: 'tallin', letrero: 'TALLIN' },
  { clave: 'bloque', x: 51, base: 31, vida: 'minecraft', secreto: true },
  { clave: 'cartel', x: 166, base: 18.4, vida: 'fin', letrero: 'FIN… POR AHORA' },
  { clave: 'cartel', x: 9, base: 18.4, vida: 'inicio', letrero: 'START' },
]

// Zonas con suelo especial
export const SUELOS = [
  { tipo: 'piedra', x0: 23, x1: 42, y0: 14, y1: 26 }, // Plaza Mayor
  { tipo: 'baldosa', x0: 100, x1: 130, y0: 21, y1: 21 },
  { tipo: 'asfalto', x0: 62, x1: 96, y0: CAMINO, y1: CAMINO + 1 }, // Madrid
  { tipo: 'agua', x0: 3, x1: 6, y0: 26, y1: 30 },
]
// Caminos verticales hacia los edificios de abajo
export const SENDAS = [
  { x: 36, y0: 21, y1: 29 }, { x: 88, y0: 21, y1: 23 }, { x: 104, y0: 21, y1: 24 }, { x: 118, y0: 21, y1: 25 }, { x: 51, y0: 21, y1: 31 },
]

// Personajes: la familia y los amigos (solo el nombre de pila, que se ve al pasar el ratón).
// Rasgos sacados de sus fotos: pelo, piel, gafas, barba y la ropa que más llevan.
const amigos = (lista, x0, y0) => lista.map(([nombre, pelo, ropa, extra = {}], i) => ({
  nombre, x: x0 + (i % 4) * 2.2 + (i > 3 ? 1 : 0), y: y0 + Math.floor(i / 4) * 2,
  rasgos: { pelo: 'corto', piel: '#f2c29b', colorPelo: pelo, ropa, ...extra },
}))

export const PERSONAJES = [
  { nombre: 'Pedro', x: 29, y: 19.2, rasgos: { pelo: 'calvo', colorPelo: '#6a5a50', piel: '#e8b48f', ropa: '#1f2430', pantalon: '#3a4a66' }, vida: 'pedro' },
  { nombre: 'Martha', x: 43.5, y: 19.2, rasgos: { pelo: 'largo', colorPelo: '#5a3a24', piel: '#d79d76', ropa: '#f2b8c6', tipo: 'chaqueta', interior: '#f1e3a8', pantalon: '#9fb4d0', anchos: true }, vida: 'marta' },
  { nombre: 'Dante', x: 46.5, y: 19.2, rasgos: { pelo: 'corto', colorPelo: '#6b4a2e', piel: '#f0c6a2', ropa: '#4a4448', pantalon: '#c9c3b5', anchos: true, zapatillas: '#f4f4f4' }, vida: 'dante' },
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
    ['Rodrigo', '#141212', '#eef1f4', { piel: '#f0c8a0' }],
    ['Andrea', '#141212', '#e8c8c0', { pelo: 'melena', gafas: true, piel: '#d9a07a' }],
    ['Gabriel', '#4a3020', '#1f2a44', { piel: '#ecb68f', logo: '#7fc8ff', zapatillas: '#f4f4f4' }],
  ], 100, 21.4),
]

// El recorrido guiado: adónde va Alejandro y qué cuenta (las frases están en historia.js)
export const RECORRIDO = [
  { x: 12, y: CAMINO + 0.5, historia: 'bienvenida' },
  { x: 19, y: CAMINO + 0.5, historia: 'pueblo' },
  { x: 29, y: CAMINO + 1.3, historia: 'reblan' },
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
