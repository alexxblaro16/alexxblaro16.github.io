// Todo el pixel art se dibuja aquí con código: personajes, robots, suelos y edificios.
// Cada textura se pinta en un canvas y se registra en Phaser, así no hay imágenes que descargar.

export const T = 16 // tamaño de una casilla

// ---------------------------------------------------------------------------------------------- utilidades
function lienzo(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  ctx.imageSmoothingEnabled = false
  return [c, ctx]
}

function px(ctx, x, y, color, w = 1, h = 1) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
}

// Pinta una matriz de caracteres con su paleta ('.' es transparente)
function matriz(ctx, filas, paleta, ox = 0, oy = 0, espejo = false) {
  filas.forEach((fila, y) => {
    const f = fila.padEnd(16, '.').slice(0, 16)
    for (let x = 0; x < 16; x++) {
      const ch = espejo ? f[15 - x] : f[x]
      const color = paleta[ch]
      if (color) px(ctx, ox + x, oy + y, color)
    }
  })
}

// Ruido determinista para que la hierba no cambie cada vez que se carga
function azar(semilla) {
  let s = semilla
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280)
}

function oscurecer(hex, f = 0.7) {
  const n = parseInt(hex.slice(1), 16)
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * f))
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

// Aclara un color mezclándolo con blanco (sirve también para pelos casi negros)
function aclarar(hex, f = 0.25) {
  const n = parseInt(hex.slice(1), 16)
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (255 - v) * f))
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

// ---------------------------------------------------------------------------------------------- personajes
// Cada personaje mide 16 × 24 y se monta por capas: cabeza, pelo, cuerpo con piernas y accesorios.
// O contorno · S piel · s piel en sombra · m boca · E ojos · W brillo del ojo · G montura · g patilla de las gafas · A antena
// H pelo · L pelo con luz · h pelo en sombra · T camiseta · t camiseta en sombra · c cuello
// P pantalón · p pantalón en sombra · B zapatillas · b suela
export const ANCHO_PJ = 16
export const ALTO_PJ = 24

const CABEZA = {
  abajo: [
    '', '', '.....OOOOOO.....', '....OSSSSSSO....', '...OSSSSSSSSO...', '...OSSSSSSSSO...', '...OSSSSSSSSO...',
    '...OSEWSSEWSO...', '...OSEESSEESO...', '...OsSSSSSSsO...', '...OsSSmmSSsO...', '....OsSSSSsO....', '.....OOOOOO.....',
  ],
  izquierda: [
    '', '', '.....OOOOOO.....', '....OSSSSSSO....', '...OSSSSSSSSO...', '...OSSSSSSSSO...', '...OSSSSSSSSO...',
    '...OSEWSSSSSO...', '..OSSEESSSSSO...', '...OSSSSSSSsO...', '...OSmSSSSssO...', '....OsSSSSsO....', '.....OOOOOO.....',
  ],
  arriba: [
    '', '', '.....OOOOOO.....', '....OSSSSSSO....', '...OSSSSSSSSO...', '...OSSSSSSSSO...', '...OSSSSSSSSO...',
    '...OSSSSSSSSO...', '...OSSSSSSSSO...', '...OsSSSSSSsO...', '...OsSSSSSSsO...', '....OsSSSSsO....', '.....OOOOOO.....',
  ],
}

// Peinados: solo se pintan los caracteres que no son '.'
const PELO = {
  corto: {
    abajo: ['', '.....OOOOOO.....', '....OHLLHHHO....', '...OHLHHHHHHO...', '...OHHHhHHHhO...', '...Oh.h..h.hO...', '....h......h....'],
    izquierda: ['', '.....OOOOOO.....', '....OHLLHHHO....', '...OHLHHHHHHO...', '...OHHHHHHHhO...', '...OhH..hHHhO...', '....h...hHHhO...', '.........hhhO...', '..........hhO...'],
    arriba: ['', '.....OOOOOO.....', '....OHLLHHHO....', '...OHLHHHHHHO...', '...OHHHHHHHhO...', '...OHHHHHHHhO...', '...OHHHHHHHhO...', '...OhHHHHHHhO...', '...OhhHHHHhhO...', '....OhhhhhhO....'],
  },
  largo: {
    abajo: ['', '.....OOOOOO.....', '....OHLLHHHO....', '...OHLHHHHHHO...', '..OHHHHHHHHhhO..', '..OHh......hHO..', '..OHh......hHO..', '..OH........HO..', '..OH........HO..',
      '..OHh.......HO..', '..OHH......hHO..', '..OHHO....OHhO..', '..OhHO....OHhO..', '..OhhO....OhhO..', '...OO......OO...'],
    izquierda: ['', '.....OOOOOO.....', '....OHLLHHHO....', '...OHLHHHHHHO...', '...OHHHHHHHHhO..', '...OhH..HHHHhO..', '....h...HHHHhO..', '........hHHHhO..', '........hHHHhO..',
      '........hHHHhO..', '.........HHHhO..', '.........hHhhO..', '.........hhhO...', '.........OOO....'],
    arriba: ['', '.....OOOOOO.....', '....OHLLHHHO....', '...OHLHHHHHHO...', '..OHHHHHHHHHhO..', '..OHHHHHHHHHhO..', '..OHHLHHHHHHhO..', '..OHHHHHHHHHhO..', '..OHHHHHHHHHhO..',
      '..OhHHHHHHHHhO..', '..OhHHHHHHHHhO..', '..OhHHHHHHHhhO..', '..OhhHHHHHHhhO..', '..OhhhhhhhhhhO..', '...OOOOOOOOOO...'],
  },
  rizado: {
    abajo: ['.....O.OO.O.....', '....OHOLHOHO....', '...OHLHHLHHHO...', '..OHHHLHHHHHHO..', '..OHHHHHHHHHhO..', '..OhHh.hH.hHhO..', '...h........h...'],
    izquierda: ['.....O.OO.O.....', '....OHOLHOHO....', '...OHLHHLHHHO...', '..OHHHLHHHHHHO..', '..OHHHHHHHHHhO..', '..OhH..hHHHHhO..', '...h....hHHHhO..', '.........hHhhO..', '..........hhO...'],
    arriba: ['.....O.OO.O.....', '....OHOLHOHO....', '...OHLHHLHHHO...', '..OHHHLHHHHHHO..', '..OHHHHHHHHHhO..', '..OHhHHHhHHHhO..', '..OHHHhHHHhHhO..', '..OhHHHHHHHHhO..', '...OhHhHHhHhO...', '....OhhhhhhO....'],
  },
  // Melena rizada: rizos por arriba que caen hasta los hombros
  melena: {
    abajo: ['.....O.OO.O.....', '....OHOLHOHO....', '...OHLHHLHHHO...', '..OHHHLHHHHHHO..', '..OHHHHHHHHHhO..', '.OHhHh....hHhHO.', '.OHh........hHO.', '.OhH........HhO.', '.OHh........hHO.',
      '.OhH........HhO.', '.OHHh......hHHO.', '.OhHHO....OHHhO.', '.OHhHO....OHhHO.', '..OhO......OhO..', '...O........O...'],
    izquierda: ['.....O.OO.O.....', '....OHOLHOHO....', '...OHLHHLHHHO...', '..OHHHLHHHHHHO..', '..OHHHHHHHHHhHO.', '..OhH..HHhHHHhO.', '...h...hHHHhHHO.', '.......HhHHHHhO.', '.......hHHhHHHO.',
      '........HHHhHhO.', '........hHhHHHO.', '........OhHhHO..', '.........OhhO...', '..........OO....'],
    arriba: ['.....O.OO.O.....', '....OHOLHOHO....', '...OHLHHLHHHO...', '..OHHHLHHHHHHO..', '.OHHHHHHHHHHhHO.', '.OHhHHhHHhHHHhO.', '.OHHhHHHhHHhHHO.', '.OhHHHhHHHHHhHO.', '.OHHhHHHhHHHHhO.',
      '.OhHHHhHHHhHHHO.', '.OHHhHHHHHHhHhO.', '.OhHHhHHhHHHhHO.', '.OHhHHhHHhHHhHO.', '..OhhOhhhOhhhO..', '...OO.OOO.OOO...'],
  },
  rapado: {
    abajo: ['', '', '.....OOOOOO.....', '....OhHHHHhO....', '...OhLHHHHHhO...', '...O.h....h.O...'],
    izquierda: ['', '', '.....OOOOOO.....', '....OhHHHHhO....', '...OhLHHHHHhO...', '...O....hHHhO...', '........hHHhO...', '..........hhO...'],
    arriba: ['', '', '.....OOOOOO.....', '....OhHHHHhO....', '...OhLHHHHHhO...', '...OhHHHHHHhO...', '...OhHHHHHHhO...', '...OhHHHHHHhO...', '...OhhHHHHhhO...', '....OhhhhhhO....'],
  },
  // Calvo: un brillo en la coronilla y el pelo corto solo por los lados (Pedro)
  calvo: {
    abajo: ['', '', '.....OOOOOO.....', '....OSLLSSSO....', '...OSLSSSSSSO...', '...Oh......hO...', '...Oh......hO...'],
    izquierda: ['', '', '.....OOOOOO.....', '....OSLLSSSO....', '...OSLSSSSSSO...', '..........hhO...', '..........hhO...', '...........hO...'],
    arriba: ['', '', '.....OOOOOO.....', '....OSLLSSSO....', '...OSLSSSSSSO...', '...OSSSSSSSSO...', '...OSSSSSSSSO...', '...OhSSSSSShO...', '...OhHHHHHHhO...', '....OhhHHhhO....'],
  },
}

// Cuerpo y piernas (filas 13 a 23) para los tres pasos de andar: quieto, pie izquierdo y pie derecho
const CUERPO = {
  abajo: [
    ['....OTTccTTO....', '...OTTTTTTTTO...', '..OTOTTTTTTOTO..', '..OTOTTTTTTOTO..', '..OtOTTTTTTOtO..', '..OSOttttttOSO..', '...OOPPPPPPOO...', '....OPPOOPPO....', '....OPpOOpPO....', '...OBBBOOBBBO...', '...ObbbOObbbO...'],
    ['....OTTccTTO....', '...OTTTTTTTTO...', '..OTOTTTTTTOTO..', '..OtOTTTTTTOTO..', '..OSOTTTTTTOtO..', '...OOttttttOSO..', '...OOPPPPPPOO...', '....OPPOOPPO....', '...OBBBOOPpO....', '...ObbbOOBBBO...', '........ObbbO...'],
    ['....OTTccTTO....', '...OTTTTTTTTO...', '..OTOTTTTTTOTO..', '..OTOTTTTTTOtO..', '..OtOTTTTTTOSO..', '..OSOttttttOO...', '...OOPPPPPPOO...', '....OPPOOPPO....', '....OPpOOBBBO...', '...OBBBOObbbO...', '...ObbbO........'],
  ],
  izquierda: [
    ['.....OTTTTO.....', '....OTTTTTTO....', '....OTTtTTTO....', '....OTTtTTTO....', '....OTTtTTTO....', '....OttSttO.....', '.....OPPPPO.....', '.....OPPPPO.....', '.....OPpPPO.....', '....OBBBBBO.....', '....ObbbbbO.....'],
    ['.....OTTTTO.....', '....OTTTTTTO....', '....OtTTTTTO....', '....OtTTTTTO....', '...OSTTTTTTO....', '....OttttttO....', '.....OPPPPO.....', '....OPPOOPPO....', '...OPpO..OPpO...', '..OBBBO..OBBBO..', '..ObbbO..ObbbO..'],
    ['.....OTTTTO.....', '....OTTTTTTO....', '....OTTTTTtO....', '....OTTTTTtO....', '....OTTTTTTSO...', '....OttttttO....', '.....OPPPPO.....', '....OPPOOPPO....', '...OPpO..OPpO...', '..OBBBO..OBBBO..', '..ObbbO..ObbbO..'],
  ],
}
CUERPO.arriba = CUERPO.abajo.map((paso) => paso.map((f) => f.replace(/c/g, 'T')))

function ponerEncima(base, capa) {
  const r = [...base]
  capa.forEach((fila, y) => {
    if (!fila) return
    const b = (r[y] || '').padEnd(16, '.').split('')
    for (let x = 0; x < 16; x++) if (fila[x] && fila[x] !== '.') b[x] = fila[x]
    r[y] = b.join('')
  })
  return r
}

// Cambia los caracteres de unas casillas concretas: [[x, y, carácter], ...]
function marcar(filas, puntos) {
  const r = [...filas]
  for (const [x, y, ch] of puntos) {
    const b = r[y].split('')
    b[x] = ch
    r[y] = b.join('')
  }
  return r
}

function fotograma(dir, paso, rasgos) {
  let filas = CABEZA[dir].map((f) => f.padEnd(16, '.')).concat(CUERPO[dir][paso].map((f) => f.padEnd(16, '.')))
  filas = ponerEncima(filas, (PELO[rasgos.pelo] || PELO.corto)[dir])
  if (rasgos.barba && dir === 'abajo') filas = marcar(filas, [[4, 9, 'h'], [11, 9, 'h'], [4, 10, 'h'], [5, 10, 'h'], [6, 10, 'h'], [9, 10, 'h'], [10, 10, 'h'], [11, 10, 'h'], [5, 11, 'h'], [6, 11, 'h'], [7, 11, 'h'], [8, 11, 'h'], [9, 11, 'h'], [10, 11, 'h']])
  if (rasgos.barba && dir === 'izquierda') filas = marcar(filas, [[4, 10, 'h'], [6, 10, 'h'], [7, 10, 'h'], [8, 9, 'h'], [8, 10, 'h'], [5, 11, 'h'], [6, 11, 'h'], [7, 11, 'h'], [8, 11, 'h']])
  // Gafas de montura fina alrededor de los ojos
  if (rasgos.gafas && dir === 'abajo') filas = marcar(filas, [[5, 6, 'G'], [6, 6, 'G'], [9, 6, 'G'], [10, 6, 'G'], [4, 7, 'g'], [7, 7, 'G'], [8, 7, 'G'], [11, 7, 'g']])
  if (rasgos.gafas && dir === 'izquierda') filas = marcar(filas, [[4, 6, 'G'], [5, 6, 'G'], [6, 6, 'G'], [3, 7, 'g'], [7, 7, 'g'], [8, 7, 'g'], [9, 7, 'g']])
  if (rasgos.antena) filas = marcar(filas, [[8, 0, 'A'], [8, 1, 'O']])
  return filas
}

export const PALETAS = {
  pelo: ['#3b2a20', '#1d1a19', '#7a4a26', '#d8a64a', '#b0452f', '#9aa3ad'],
  piel: ['#f2c29b', '#e5a97f', '#c98a5e', '#8d5a3b', '#5e3a26', '#fbd9c0'],
  ropa: ['#2fbf71', '#3d7be0', '#a970ff', '#e05a5a', '#f2b33d', '#eef1f4', '#2b2f38', '#ff7fb0'],
  pantalon: ['#2c3e66', '#3a3f48', '#5b4636', '#1f2a44'],
}

// Hoja de 3 columnas (quieto, paso 1, paso 2) × 4 filas (abajo, izquierda, derecha, arriba)
export function crearPersonaje(scene, clave, rasgos) {
  if (scene.textures.exists(clave)) scene.textures.remove(clave)
  const W = ANCHO_PJ, A = ALTO_PJ
  const [c, ctx] = lienzo(W * 3, A * 4)
  const zapas = rasgos.zapatillas || '#2a2d33'
  const pantalon = rasgos.pantalon || '#2c3e66'
  const paleta = {
    O: '#1b1a22', S: rasgos.piel, s: oscurecer(rasgos.piel, 0.86), m: oscurecer(rasgos.piel, 0.66),
    E: rasgos.ojos || '#1b1a22', W: '#ffffff',
    H: rasgos.colorPelo, L: aclarar(rasgos.colorPelo, 0.28), h: oscurecer(rasgos.colorPelo, 0.68),
    T: rasgos.ropa, t: oscurecer(rasgos.ropa, 0.8), c: oscurecer(rasgos.ropa, 0.68),
    P: pantalon, p: oscurecer(pantalon, 0.75),
    B: zapas, b: rasgos.zapatillas ? oscurecer(zapas, 0.78) : '#e6e8ec', G: '#1b1a22', g: '#4a4f5a', A: '#3dd9ff',
  }
  const filas = [['abajo', false], ['izquierda', false], ['izquierda', true], ['arriba', false]]
  filas.forEach(([dir, espejo], fila) => {
    for (let paso = 0; paso < 3; paso++) {
      const ox = paso * W, oy = fila * A
      matriz(ctx, fotograma(dir, paso, rasgos), paleta, ox, oy, espejo)
      const lado = (x) => (espejo ? ox + W - 1 - x : ox + x)
      // Cadena plateada al cuello
      if (rasgos.cadena && dir === 'abajo') { px(ctx, ox + 6, oy + 13, '#d6dce3', 4, 1); px(ctx, ox + 7, oy + 14, '#aab3bd', 2, 1) }
      if (rasgos.cadena && dir === 'izquierda') px(ctx, lado(6), oy + 13, '#d6dce3')
      // Panel de robot en DANTE P.W.: tornillos en las mejillas y una luz en el pecho
      if (rasgos.antena && dir === 'abajo') { px(ctx, ox + 4, oy + 9, '#8d98a5'); px(ctx, ox + 11, oy + 9, '#8d98a5'); px(ctx, ox + 6, oy + 15, '#1b1a22', 4, 2); px(ctx, ox + 7, oy + 15, '#ffffff', 2, 1) }
      // Portátil con pegatinas bajo el brazo (solo Alejandro)
      if (rasgos.portatil && dir === 'abajo') {
        px(ctx, ox + 12, oy + 15, '#1b1a22', 4, 6); px(ctx, ox + 13, oy + 16, '#aeb6c0', 2, 4)
        px(ctx, ox + 13, oy + 16, '#f89820'); px(ctx, ox + 14, oy + 18, '#61dafb'); px(ctx, ox + 13, oy + 19, '#3776ab')
      }
      if (rasgos.portatil && dir === 'izquierda') {
        for (let x = 5; x <= 9; x++) px(ctx, lado(x), oy + 16, '#1b1a22')
        px(ctx, lado(6), oy + 17, '#aeb6c0'); px(ctx, lado(7), oy + 17, '#f89820'); px(ctx, lado(8), oy + 17, '#61dafb')
      }
    }
  })
  const tex = scene.textures.addCanvas(clave, c)
  let i = 0
  for (let fila = 0; fila < 4; fila++) for (let col = 0; col < 3; col++) tex.add(i++, 0, col * W, fila * A, W, A)
  return clave
}

// Animaciones de andar para una hoja de personaje
export function crearAnimaciones(scene, clave) {
  const dirs = { abajo: 0, izquierda: 3, derecha: 6, arriba: 9 }
  for (const [dir, base] of Object.entries(dirs)) {
    const nombre = `${clave}-${dir}`
    if (scene.anims.exists(nombre)) scene.anims.remove(nombre)
    scene.anims.create({ key: nombre, frames: [base + 1, base, base + 2, base].map((f) => ({ key: clave, frame: f })), frameRate: 8, repeat: -1 })
  }
}

// ---------------------------------------------------------------------------------------------- Jerry (robot EV3)
export function crearJerry(scene) {
  const [c, ctx] = lienzo(32, 16)
  for (let f = 0; f < 2; f++) {
    const o = f * 16
    px(ctx, o + 3, 4, '#1b1f27', 10, 9)
    px(ctx, o + 4, 5, '#e9ecef', 8, 6); px(ctx, o + 4, 10, '#b9bfc6', 8, 1)
    px(ctx, o + 5, 6, '#7ad37a', 6, 3) // pantalla
    px(ctx, o + 5, 6, '#a6f0a6', 6, 1)
    px(ctx, o + 6, 7, '#1b1f27'); px(ctx, o + 9, 7, '#1b1f27')
    px(ctx, o + 7, 2, '#1b1f27', 2, 2); px(ctx, o + 7, 3, '#e05a5a', 2, 1) // sensor
    const r = f === 0 ? 0 : 1
    px(ctx, o + 1, 9 + r, '#1b1f27', 3, 5 - r); px(ctx, o + 12, 10 - r, '#1b1f27', 3, 4 + r) // ruedas
    px(ctx, o + 2, 10 + r, '#5b6068'); px(ctx, o + 13, 11 - r, '#5b6068')
  }
  const tex = scene.textures.addCanvas('jerry', c)
  tex.add(0, 0, 0, 0, 16, 16); tex.add(1, 0, 16, 0, 16, 16)
  scene.anims.create({ key: 'jerry-andar', frames: [{ key: 'jerry', frame: 0 }, { key: 'jerry', frame: 1 }], frameRate: 4, repeat: -1 })
}

// ---------------------------------------------------------------------------------------------- suelos
// Mata de hierba en forma de «v» para que el césped tenga relieve
function mata(ctx, x, y, claro, oscuro) {
  px(ctx, x, y, oscuro); px(ctx, x + 2, y, oscuro); px(ctx, x + 1, y + 1, oscuro); px(ctx, x, y - 1, claro); px(ctx, x + 2, y - 1, claro)
}

export function crearSuelos(scene) {
  const tipos = {
    hierba: (ctx, r) => {
      px(ctx, 0, 0, '#5aa84f', 16, 16)
      for (let i = 0; i < 18; i++) px(ctx, (r() * 16) | 0, (r() * 16) | 0, r() > 0.5 ? '#63b457' : '#519a47')
      for (let i = 0; i < 2; i++) mata(ctx, 1 + ((r() * 12) | 0), 2 + ((r() * 12) | 0), '#76c768', '#3f8a3a')
    },
    hierba2: (ctx, r) => {
      tipos.hierba(ctx, r)
      const flor = r() > 0.5 ? '#f6e05e' : '#ffffff'
      px(ctx, 6, 7, flor); px(ctx, 5, 8, flor); px(ctx, 7, 8, flor); px(ctx, 6, 9, flor); px(ctx, 6, 8, '#e05a5a')
      px(ctx, 11, 12, '#a970ff'); px(ctx, 10, 13, '#3f8a3a')
    },
    camino: (ctx, r) => {
      px(ctx, 0, 0, '#dcbf85', 16, 16)
      for (let i = 0; i < 12; i++) px(ctx, (r() * 16) | 0, (r() * 16) | 0, '#c9a865')
      for (let i = 0; i < 3; i++) { const x = (r() * 14) | 0, y = (r() * 14) | 0; px(ctx, x, y, '#b8975a', 2, 1); px(ctx, x, y - 1, '#ecd6a6', 2, 1) }
    },
    piedra: (ctx) => {
      // Adoquines de la plaza: piezas con luz arriba y sombra abajo
      px(ctx, 0, 0, '#a39c8d', 16, 16)
      const pieza = (x, y, w, h) => { px(ctx, x, y, '#c4bdae', w, h); px(ctx, x, y, '#d3cdbf', w, 1); px(ctx, x + w - 1, y + 1, '#b3ac9d', 1, h - 1) }
      for (let fila = 0; fila < 4; fila++) {
        const y = fila * 4, d = fila % 2 ? 2 : 0
        for (let x = -d; x < 16; x += 4) pieza(Math.max(0, x), y, Math.min(16, x + 3) - Math.max(0, x), 3)
      }
    },
    asfalto: (ctx, r) => { px(ctx, 0, 0, '#5b6068', 16, 16); for (let i = 0; i < 12; i++) px(ctx, (r() * 16) | 0, (r() * 16) | 0, r() > 0.5 ? '#666b74' : '#52575e') },
    agua: (ctx) => {
      px(ctx, 0, 0, '#3576d6', 16, 16); px(ctx, 0, 0, '#3d82e6', 16, 8)
      px(ctx, 2, 4, '#9cc6ff', 4, 1); px(ctx, 3, 3, '#cfe3ff', 2, 1); px(ctx, 9, 11, '#9cc6ff', 4, 1); px(ctx, 10, 10, '#cfe3ff', 2, 1)
    },
    cesped: (ctx) => { px(ctx, 0, 0, '#3f9e4f', 16, 16); px(ctx, 0, 0, '#46a957', 16, 8) },
    baldosa: (ctx) => { px(ctx, 0, 0, '#d8dde3', 16, 16); px(ctx, 1, 1, '#e4e8ed', 14, 6); px(ctx, 0, 0, '#bfc6ce', 16, 1); px(ctx, 0, 0, '#bfc6ce', 1, 16); px(ctx, 8, 0, '#bfc6ce', 1, 16) },
  }
  let semilla = 7
  for (const [nombre, pintar] of Object.entries(tipos)) {
    const [c, ctx] = lienzo(16, 16)
    pintar(ctx, azar(semilla++ * 97))
    scene.textures.addCanvas(nombre, c)
  }
  // Árbol (24 × 32): copa redonda con tres tonos de verde, tronco y sombra en el suelo
  const [c, ctx] = lienzo(24, 32)
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(12, 30, 9, 2, 0, 0, Math.PI * 2); ctx.fill()
  px(ctx, 10, 20, '#1b1f27', 5, 11); px(ctx, 11, 20, '#7a5532', 3, 10); px(ctx, 11, 20, '#946a40', 1, 10)
  const copa = [
    '.......OOOOOOOO.........', '.....OOMMMMMMMMOO.......', '....OMMLLMMMMMMMMO......', '...OMMLLLLMMMMMMMDO.....', '..OMMMLLLMMMMMMMMMDO....',
    '..OMMMMMMMMMMLLMMMDO....', '.OMMMMMMMMMMLLLLMMDDO...', '.OMMLLMMMMMMMLLMMMDDO...', '.OMLLLLMMMMMMMMMMDDDO...', '.OMMLLMMMMMMMMMMMDDDO...',
    '.OMMMMMMMMMLLMMMDDDDO...', '..OMMMMMMMLLLLMDDDDO....', '..ODMMMMMMMLLMDDDDDO....', '...ODDMMMMMMMDDDDDO.....', '....ODDDDDDDDDDDDO......',
    '.....OODDDDDDDDOO.......', '.......OOOOOOOO.........',
  ]
  const verdes = { O: '#1b2a1e', M: '#3c9a47', L: '#5cbf5f', D: '#2a7535' }
  copa.forEach((fila, y) => [...fila].forEach((ch, x) => { if (verdes[ch]) px(ctx, x + 2, y + 2, verdes[ch]) }))
  scene.textures.addCanvas('arbol', c)
}

// ---------------------------------------------------------------------------------------------- edificios
// Ventana con marco claro, cristal en dos tonos, un brillo en diagonal y alféizar
function ventana(ctx, x, y, o) {
  const cristal = o.cristal || '#9fd3ff'
  px(ctx, x, y, '#1b1f27', 8, 9)
  px(ctx, x + 1, y + 1, o.marco || '#f4f1ea', 6, 7)
  px(ctx, x + 2, y + 2, cristal, 4, 5)
  px(ctx, x + 2, y + 5, oscurecer(cristal, 0.82), 4, 2)
  px(ctx, x + 2, y + 2, aclarar(cristal, 0.55), 1, 2); px(ctx, x + 3, y + 2, aclarar(cristal, 0.55))
  if (o.cruz) { px(ctx, x + 4, y + 2, o.marco || '#f4f1ea', 1, 5); px(ctx, x + 2, y + 4, o.marco || '#f4f1ea', 4, 1) }
  px(ctx, x - 1, y + 9, '#1b1f27', 10, 1); px(ctx, x, y + 9, oscurecer(o.pared, 0.75), 8, 1)
  if (o.macetas) { px(ctx, x + 1, y + 8, '#b4553a', 6, 1); px(ctx, x + 1, y + 7, '#e05a5a'); px(ctx, x + 3, y + 7, '#f6e05e'); px(ctx, x + 5, y + 7, '#e05a5a') }
}

// Un edificio genérico: pared con luces y sombras, tejado, ventanas con marco, puerta con picaporte y escalón
function casa(ctx, w, h, o) {
  const techo = o.techo || 10
  // pared
  px(ctx, 0, techo, '#1b1f27', w, h - techo)
  px(ctx, 1, techo, o.pared, w - 2, h - techo - 1)
  px(ctx, 1, techo, aclarar(o.pared, 0.18), 2, h - techo - 1)
  px(ctx, w - 4, techo, oscurecer(o.pared, 0.88), 3, h - techo - 1)
  if (o.ladrillo) for (let y = techo + 3; y < h - 4; y += 3) for (let x = (y % 6 ? 2 : 5); x < w - 3; x += 6) px(ctx, x, y, oscurecer(o.pared, 0.86), 4, 1)
  // zócalo
  px(ctx, 1, h - 4, oscurecer(o.pared, 0.72), w - 2, 3)
  px(ctx, 1, h - 4, oscurecer(o.pared, 0.62), w - 2, 1)
  // tejado
  if (o.plano) {
    px(ctx, 0, techo - 5, '#1b1f27', w, 6)
    px(ctx, 1, techo - 4, o.tejado, w - 2, 4)
    px(ctx, 1, techo - 4, aclarar(o.tejado, 0.3), w - 2, 1)
    px(ctx, 1, techo - 1, oscurecer(o.tejado, 0.7), w - 2, 1)
    px(ctx, 1, techo, oscurecer(o.pared, 0.7), w - 2, 1) // sombra bajo la cornisa
  } else {
    // tejado a dos aguas con filas de tejas y la cumbrera más clara
    for (let y = 0; y < techo; y++) {
      const mitad = Math.round(((y + 1) / techo) * (w / 2))
      px(ctx, w / 2 - mitad, y, '#1b1f27', mitad * 2, 1)
      if (mitad > 1) {
        const color = y % 3 === 2 ? oscurecer(o.tejado, 0.78) : y % 3 === 0 ? aclarar(o.tejado, 0.12) : o.tejado
        px(ctx, w / 2 - mitad + 1, y, color, mitad * 2 - 2, 1)
        if (y % 3 !== 2) for (let x = w / 2 - mitad + 2 + (y % 2) * 2; x < w / 2 + mitad - 2; x += 4) px(ctx, x, y, oscurecer(o.tejado, 0.85))
      }
    }
    px(ctx, w / 2 - 1, 0, aclarar(o.tejado, 0.35), 2, 2)
    px(ctx, 1, techo, oscurecer(o.pared, 0.7), w - 2, 1)
  }
  if (o.franja) { px(ctx, 1, techo + 1, o.franja, w - 2, 3); px(ctx, 1, techo + 3, oscurecer(o.franja, 0.75), w - 2, 1) }
  // ventanas
  const pisos = o.pisos || 1
  const pw = o.puertaAncha ? 14 : 10
  for (let p = 0; p < pisos; p++) {
    const y = techo + (o.franja ? 7 : 5) + p * 12
    if (y + 10 > h - 22) break
    for (let x = 5; x < w - 9; x += 12) ventana(ctx, x, y, o)
  }
  // fila de abajo: ventanas a los lados de la puerta si caben
  const yb = h - 18
  for (let x = 5; x < w - 9; x += 12) if (x + 9 < w / 2 - pw / 2 - 1 || x > w / 2 + pw / 2 + 1) ventana(ctx, x, yb - 1, o)
  // toldo a rayas con el borde ondulado
  if (o.toldo) {
    const yt = yb - 5
    for (let x = 1; x < w - 1; x += 4) {
      const col = (x - 1) % 8 === 0 ? o.toldo : '#ffffff'
      px(ctx, x, yt, col, 4, 3); px(ctx, x + 1, yt + 3, col, 2, 1)
    }
    px(ctx, 1, yt - 1, '#1b1f27', w - 2, 1)
  }
  // puerta con marco, cuarterones, picaporte y escalón
  const x0 = Math.round(w / 2 - pw / 2)
  px(ctx, x0 - 1, h - 21, '#1b1f27', pw + 2, 20)
  px(ctx, x0, h - 20, oscurecer(o.pared, 0.6), pw, 19)
  const madera = o.puerta || '#7a5232'
  px(ctx, x0 + 1, h - 19, madera, pw - 2, 17)
  px(ctx, x0 + 1, h - 19, aclarar(madera, 0.15), pw - 2, 1)
  if (o.puertaAncha) {
    // puerta doble de cristal
    px(ctx, x0 + 2, h - 17, o.cristal || '#9fd3ff', pw / 2 - 3, 12); px(ctx, x0 + pw / 2 + 1, h - 17, o.cristal || '#9fd3ff', pw / 2 - 3, 12)
    px(ctx, x0 + 2, h - 17, aclarar(o.cristal || '#9fd3ff', 0.5), 1, 5); px(ctx, x0 + pw / 2 + 1, h - 17, aclarar(o.cristal || '#9fd3ff', 0.5), 1, 5)
    px(ctx, x0 + pw / 2, h - 19, '#1b1f27', 1, 17)
  } else {
    px(ctx, x0 + 2, h - 17, oscurecer(madera, 0.8), pw - 4, 5); px(ctx, x0 + 2, h - 10, oscurecer(madera, 0.8), pw - 4, 6)
    px(ctx, x0 + pw - 3, h - 11, '#f2c200')
  }
  px(ctx, x0 - 2, h - 2, '#9a9a9a', pw + 4, 1); px(ctx, x0 - 2, h - 1, '#6f6f6f', pw + 4, 1)
  // farolillo junto a la puerta
  if (o.farol) { px(ctx, x0 - 4, h - 17, '#1b1f27', 2, 3); px(ctx, x0 - 4, h - 16, '#ffe58a', 2, 1) }
}

const EDIFICIOS = {
  casa_pueblo: [48, 48, { pared: '#ecdcba', tejado: '#b4553a', pisos: 2, cruz: true, macetas: true, farol: true }],
  piso: [48, 64, { pared: '#e3cfa6', tejado: '#9b4a35', pisos: 3, plano: true, cruz: true, macetas: true }],
  reblan: [64, 48, { pared: '#eef1f4', tejado: '#2b5ea8', toldo: '#2b5ea8', plano: true, puertaAncha: true, cristal: '#bfe3ff', marco: '#2b5ea8' }],
  instituto: [80, 56, { pared: '#d98a5a', tejado: '#8a3b2b', pisos: 2, ladrillo: true, plano: true, puertaAncha: true }],
  soportales: [96, 48, { pared: '#dccb9f', tejado: '#a2533a', pisos: 1, cruz: true, macetas: true, farol: true }],
  residencia: [96, 72, { pared: '#c96b4f', tejado: '#5b2f25', pisos: 4, ladrillo: true, plano: true, puertaAncha: true, macetas: true }],
  medac: [96, 64, { pared: '#eef1f4', tejado: '#b3203a', pisos: 3, plano: true, franja: '#b3203a', cristal: '#7fc8ff', puertaAncha: true, marco: '#d9dee4' }],
  anexia: [48, 48, { pared: '#2b2f38', tejado: '#3d7be0', pisos: 2, plano: true, cristal: '#7fc8ff', marco: '#4a5160' }],
  udit: [128, 72, { pared: '#2b2f38', tejado: '#f2c200', pisos: 4, plano: true, franja: '#f2c200', cristal: '#bfe3ff', puertaAncha: true, marco: '#4a5160' }],
  laboratorio: [64, 56, { pared: '#dfe6ee', tejado: '#2fbf71', pisos: 2, plano: true, franja: '#2fbf71', puertaAncha: true }],
  trofeos: [64, 56, { pared: '#f6e7b4', tejado: '#c9962b', pisos: 2, puertaAncha: true, marco: '#c9962b', farol: true }],
  terminal: [48, 48, { pared: '#1b1f27', tejado: '#2fbf71', plano: true, cristal: '#2fbf71', pisos: 2, marco: '#2b2f38' }],
  correos: [64, 48, { pared: '#f2c200', tejado: '#1f4e9b', plano: true, franja: '#1f4e9b', puertaAncha: true }],
  hackaton: [64, 56, { pared: '#3a2f5c', tejado: '#a970ff', plano: true, cristal: '#e0c9ff', pisos: 2, puertaAncha: true, marco: '#5a4a8a' }],
}

export function crearEdificios(scene) {
  for (const [nombre, [w, h, o]] of Object.entries(EDIFICIOS)) {
    const [c, ctx] = lienzo(w, h)
    casa(ctx, w, h, o)
    scene.textures.addCanvas(nombre, c)
  }

  // Puerta de la Villa (San Andrés): dos torres con almenas, sillares de piedra y el arco en medio
  {
    const [c, ctx] = lienzo(96, 72)
    const piedra = '#cdb88e', luz = '#e0cfaa', sombra = '#a8936a', junta = '#94805a'
    const sillares = (x, y, w, h) => {
      for (let yy = y; yy < y + h; yy += 5) {
        px(ctx, x, yy, junta, w, 1)
        for (let xx = x + ((yy / 5) % 2 ? 3 : 0); xx < x + w; xx += 7) px(ctx, xx, yy, junta, 1, 5)
        px(ctx, x, yy + 1, luz, w, 1)
      }
    }
    const torre = (x) => {
      px(ctx, x, 8, '#1b1f27', 30, 64); px(ctx, x + 1, 9, piedra, 28, 62)
      sillares(x + 1, 10, 28, 60)
      px(ctx, x + 24, 9, sombra, 5, 62) // lado en sombra
      for (let i = 0; i < 4; i++) { px(ctx, x + i * 8, 0, '#1b1f27', 6, 9); px(ctx, x + i * 8 + 1, 1, piedra, 4, 8); px(ctx, x + i * 8 + 1, 1, luz, 4, 1) }
      px(ctx, x, 8, '#1b1f27', 30, 1)
      // saetera
      px(ctx, x + 12, 22, '#1b1f27', 5, 11); px(ctx, x + 13, 23, '#2a2420', 3, 9); px(ctx, x + 14, 21, '#1b1f27', 1, 1)
    }
    torre(0); torre(66)
    px(ctx, 28, 18, '#1b1f27', 40, 54); px(ctx, 29, 19, piedra, 38, 53)
    sillares(29, 20, 38, 52)
    for (let i = 0; i < 5; i++) { px(ctx, 29 + i * 8, 12, '#1b1f27', 6, 7); px(ctx, 30 + i * 8, 13, piedra, 4, 6); px(ctx, 30 + i * 8, 13, luz, 4, 1) }
    // arco de medio punto con dovelas claras
    px(ctx, 36, 38, '#1b1f27', 24, 34); px(ctx, 38, 34, '#1b1f27', 20, 4); px(ctx, 41, 31, '#1b1f27', 14, 3)
    px(ctx, 37, 39, luz, 22, 1); px(ctx, 39, 35, luz, 18, 1); px(ctx, 42, 32, luz, 12, 1)
    px(ctx, 39, 42, '#2a2420', 18, 30); px(ctx, 41, 38, '#2a2420', 14, 4); px(ctx, 44, 35, '#2a2420', 8, 3)
    px(ctx, 39, 60, '#3a332c', 18, 12) // luz del otro lado del arco
    // escudo
    px(ctx, 43, 22, '#1b1f27', 10, 9); px(ctx, 44, 23, '#b0452f', 4, 7); px(ctx, 48, 23, '#f2c200', 4, 7); px(ctx, 45, 30, '#1b1f27', 6, 1)
    scene.textures.addCanvas('puerta_villa', c)
  }

  // Campo de fútbol
  {
    const [c, ctx] = lienzo(112, 64)
    px(ctx, 0, 0, '#3f9e4f', 112, 64)
    for (let x = 0; x < 112; x += 16) px(ctx, x, 0, '#46a957', 8, 64)
    px(ctx, 2, 2, '#ffffff', 108, 1); px(ctx, 2, 61, '#ffffff', 108, 1); px(ctx, 2, 2, '#ffffff', 1, 60); px(ctx, 109, 2, '#ffffff', 1, 60)
    px(ctx, 56, 2, '#ffffff', 1, 60)
    for (let a = 0; a < 360; a += 6) px(ctx, 56 + Math.round(Math.cos(a * Math.PI / 180) * 10), 32 + Math.round(Math.sin(a * Math.PI / 180) * 10), '#ffffff')
    // áreas
    px(ctx, 2, 18, '#ffffff', 14, 1); px(ctx, 2, 45, '#ffffff', 14, 1); px(ctx, 16, 18, '#ffffff', 1, 28)
    px(ctx, 96, 18, '#ffffff', 14, 1); px(ctx, 96, 45, '#ffffff', 14, 1); px(ctx, 95, 18, '#ffffff', 1, 28)
    px(ctx, 0, 24, '#eeeeee', 3, 16); px(ctx, 109, 24, '#eeeeee', 3, 16)
    px(ctx, 0, 24, '#9aa3ad', 1, 16); px(ctx, 111, 24, '#9aa3ad', 1, 16)
    scene.textures.addCanvas('campo', c)
  }

  // Avioneta para el Erasmus
  {
    const [c, ctx] = lienzo(48, 24)
    px(ctx, 4, 9, '#1b1f27', 40, 8); px(ctx, 5, 10, '#eef1f4', 38, 6); px(ctx, 5, 14, '#c9ced5', 38, 2)
    px(ctx, 5, 12, '#3d7be0', 38, 1)
    px(ctx, 40, 11, '#3d7be0', 3, 2)
    for (let x = 10; x < 38; x += 5) px(ctx, x, 11, '#7fc8ff', 3, 2)
    px(ctx, 18, 2, '#1b1f27', 10, 8); px(ctx, 19, 3, '#d9dde2', 8, 6)
    px(ctx, 18, 16, '#1b1f27', 10, 7); px(ctx, 19, 16, '#d9dde2', 8, 6)
    px(ctx, 2, 4, '#1b1f27', 6, 6); px(ctx, 3, 5, '#2fbf71', 4, 4)
    scene.textures.addCanvas('avion', c)
  }

  // Parada de autobús y bloque de tierra (secreto)
  {
    const [c, ctx] = lienzo(32, 32)
    px(ctx, 2, 4, '#1b1f27', 28, 4); px(ctx, 3, 5, '#2fbf71', 26, 2); px(ctx, 3, 5, '#6fe0a2', 26, 1)
    px(ctx, 4, 8, '#1b1f27', 2, 24); px(ctx, 26, 8, '#1b1f27', 2, 24)
    px(ctx, 6, 8, 'rgba(160,210,255,0.35)', 20, 16)
    px(ctx, 8, 14, '#1b1f27', 16, 10); px(ctx, 9, 15, '#eef1f4', 14, 8)
    px(ctx, 10, 17, '#1b1f27', 10, 1); px(ctx, 10, 20, '#1b1f27', 8, 1)
    px(ctx, 7, 26, '#1b1f27', 18, 3); px(ctx, 8, 26, '#8a6d3b', 16, 2)
    scene.textures.addCanvas('parada', c)
  }
  {
    const [c, ctx] = lienzo(16, 16)
    px(ctx, 0, 0, '#1b1f27', 16, 16); px(ctx, 1, 1, '#8a5a32', 14, 14); px(ctx, 1, 1, '#5cb356', 14, 4)
    px(ctx, 3, 5, '#5cb356', 2, 2); px(ctx, 9, 5, '#5cb356', 2, 3); px(ctx, 5, 9, '#6e4626', 2, 2); px(ctx, 11, 11, '#6e4626', 2, 2)
    px(ctx, 1, 1, '#76c768', 14, 1)
    scene.textures.addCanvas('bloque', c)
  }
  // Cartel de madera
  {
    const [c, ctx] = lienzo(16, 16)
    px(ctx, 7, 8, '#1b1f27', 2, 8); px(ctx, 7, 8, '#7a5232', 1, 8)
    px(ctx, 1, 2, '#1b1f27', 14, 8); px(ctx, 2, 3, '#c9a865', 12, 6); px(ctx, 2, 3, '#e0c58a', 12, 1); px(ctx, 2, 8, '#a8894f', 12, 1)
    px(ctx, 4, 5, '#7a5232', 8, 1)
    scene.textures.addCanvas('cartel', c)
  }
  // Fuente de la plaza
  {
    const [c, ctx] = lienzo(32, 32)
    px(ctx, 2, 12, '#1b1f27', 28, 18); px(ctx, 3, 13, '#c4bdae', 26, 16); px(ctx, 3, 13, '#d6d0c2', 26, 1); px(ctx, 3, 27, '#a7a091', 26, 2)
    px(ctx, 5, 15, '#3d7be0', 22, 11); px(ctx, 5, 15, '#5a96ef', 22, 4); px(ctx, 8, 17, '#cfe3ff', 3, 1); px(ctx, 20, 21, '#cfe3ff', 3, 1)
    px(ctx, 14, 4, '#1b1f27', 4, 14); px(ctx, 15, 5, '#c4bdae', 2, 12); px(ctx, 15, 5, '#d6d0c2', 1, 12)
    px(ctx, 12, 2, '#7fb2ff', 8, 3); px(ctx, 11, 4, '#7fb2ff', 1, 4); px(ctx, 20, 4, '#7fb2ff', 1, 4); px(ctx, 14, 1, '#cfe3ff', 4, 1)
    scene.textures.addCanvas('fuente', c)
  }
}
