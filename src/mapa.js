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

// Personajes: la familia y los amigos (solo el nombre de pila, que se ve al pasar el ratón)
const amigos = (lista, x0, y0, colores) => lista.map(([nombre, pelo, ropa, extra = {}], i) => ({
  nombre, x: x0 + (i % 4) * 2.2 + (i > 3 ? 1 : 0), y: y0 + Math.floor(i / 4) * 2,
  rasgos: { pelo: extra.pelo || 'corto', colorPelo: pelo, piel: extra.piel || '#f2c29b', ropa, gafas: extra.gafas },
  ...colores,
}))

export const PERSONAJES = [
  { nombre: 'Pedro', x: 29, y: 19.2, rasgos: { pelo: 'rapado', colorPelo: '#5a4a40', piel: '#e5a97f', ropa: '#2b5ea8', gafas: true }, vida: 'pedro' },
  { nombre: 'Marta', x: 43.5, y: 19.2, rasgos: { pelo: 'largo', colorPelo: '#1d1a19', piel: '#c98a5e', ropa: '#e05a5a' }, vida: 'marta' },
  { nombre: 'Dante', x: 46.5, y: 19.2, rasgos: { pelo: 'corto', colorPelo: '#3b2a20', piel: '#f2c29b', ropa: '#3d7be0' }, vida: 'dante' },
  ...amigos([
    ['Beatriz', '#7a4a26', '#ff7fb0', { pelo: 'largo' }], ['Natalia', '#1d1a19', '#a970ff', { pelo: 'largo' }],
    ['Andrea', '#d8a64a', '#2fbf71', { pelo: 'largo' }], ['Hugo', '#3b2a20', '#f2b33d'], ['Jorge', '#1d1a19', '#e05a5a'],
  ], 62, 21.5),
  ...amigos([['Pablo', '#3b2a20', '#3d7be0'], ['Héctor', '#1d1a19', '#2b2f38']], 80, 21.5),
  ...amigos([
    ['Manuel', '#1d1a19', '#e05a5a'], ['Carlos', '#3b2a20', '#3d7be0'], ['Gonzalo', '#7a4a26', '#2fbf71'], ['Hugo', '#3b2a20', '#f2b33d'],
    ['Iván', '#1d1a19', '#f2b33d', { piel: '#e5a97f' }], ['Pablo', '#7a4a26', '#2b2f38'], ['Rodrigo', '#1d1a19', '#a970ff'],
    ['Andrea', '#3b2a20', '#ff7fb0', { pelo: 'largo' }], ['Gabriel', '#3b2a20', '#eef1f4'],
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
