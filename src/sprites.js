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

// ---------------------------------------------------------------------------------------------- personajes
// O contorno · H pelo · S piel · E ojos · T camiseta · D camiseta oscura · P pantalón · B zapatos · G gafas · A antena
const CABEZA = {
  abajo: {
    corto: ['', '.....OOOOOO', '....OHHHHHHO', '...OHHHHHHHHO', '...OHHHHHHHHO', '...OHSSSSSSHO', '...OSESSSSESO', '...OSSSSSSSSO', '....OSSSSSSO'],
    largo: ['', '.....OOOOOO', '....OHHHHHHO', '...OHHHHHHHHO', '...OHHHHHHHHO', '..OHHSSSSSSHHO', '..OHSESSSSESHO', '..OHSSSSSSSSHO', '..OHHSSSSSSHHO'],
    rizado: ['....O.OO.O', '...OHOHHOHO', '..OHHHHHHHHO', '..OHHHHHHHHHO', '...OHHHHHHHHO', '...OHSSSSSSHO', '...OSESSSSESO', '...OSSSSSSSSO', '....OSSSSSSO'],
    rapado: ['', '', '.....OOOOOO', '....OHHHHHHO', '...OHSSSSSSHO', '...OSSSSSSSSO', '...OSESSSSESO', '...OSSSSSSSSO', '....OSSSSSSO'],
  },
  arriba: {
    corto: ['', '.....OOOOOO', '....OHHHHHHO', '...OHHHHHHHHO', '...OHHHHHHHHO', '...OHHHHHHHHO', '...OHHHHHHHHO', '...OHHHHHHHHO', '....OHHHHHHO'],
    largo: ['', '.....OOOOOO', '....OHHHHHHO', '...OHHHHHHHHO', '...OHHHHHHHHO', '..OHHHHHHHHHHO', '..OHHHHHHHHHHO', '..OHHHHHHHHHHO', '..OHHHHHHHHHHO'],
    rizado: ['....O.OO.O', '...OHOHHOHO', '..OHHHHHHHHO', '..OHHHHHHHHHO', '...OHHHHHHHHO', '...OHHHHHHHHO', '...OHHHHHHHHO', '...OHHHHHHHHO', '....OHHHHHHO'],
    rapado: ['', '', '.....OOOOOO', '....OHHHHHHO', '...OHHHHHHHHO', '...OHHHHHHHHO', '...OSSSSSSSSO', '...OSSSSSSSSO', '....OSSSSSSO'],
  },
  izquierda: {
    corto: ['', '.....OOOOOO', '....OHHHHHHO', '...OHHHHHHHHO', '...OHHHHHHHHO', '...OSSSSHHHHO', '...OESSSSHHHO', '...OSSSSSSHHO', '....OSSSSSSO'],
    largo: ['', '.....OOOOOO', '....OHHHHHHO', '...OHHHHHHHHO', '...OHHHHHHHHO', '...OSSSSHHHHHO', '...OESSSSHHHHO', '...OSSSSSSHHHO', '....OSSSSSHHHO'],
    rizado: ['....O.OO.O', '...OHOHHOHO', '..OHHHHHHHHO', '..OHHHHHHHHHO', '...OHHHHHHHHO', '...OSSSSHHHHO', '...OESSSSHHHO', '...OSSSSSSHHO', '....OSSSSSSO'],
    rapado: ['', '', '.....OOOOOO', '....OHHHHHHO', '...OSSSSSHHHO', '...OSSSSSSSSO', '...OESSSSSSSO', '...OSSSSSSSSO', '....OSSSSSSO'],
  },
}

const CUERPO = {
  abajo: ['...OTTTTTTTTO', '..OTTTTTTTTTTO', '..OSTTTTTTTTSO', '...OPPPPPPPPO'],
  arriba: ['...OTTTTTTTTO', '..OTTTTTTTTTTO', '..OSTTTTTTTTSO', '...OPPPPPPPPO'],
  izquierda: ['....OTTTTTTO', '....OTTTTTTO', '....OTTSSTTO', '....OPPPPPPO'],
}

const PIERNAS = {
  abajo: [
    ['...OPPPOOPPPO', '...OPPPOOPPPO', '...OBBBOOBBBO'],
    ['...OPPPOOPPPO', '...OBBBOOPPPO', '........OBBBO'],
    ['...OPPPOOPPPO', '...OPPPOOBBBO', '...OBBBO'],
  ],
  izquierda: [
    ['.....OPPPPO', '.....OPPPPO', '.....OBBBBO'],
    ['....OPPOOPPO', '....OPPO.OPPO', '...OBBO...OBBO'],
    ['.....OPPPPO', '....OPPOOPPO', '....OBBOOBBO'],
  ],
}
PIERNAS.arriba = PIERNAS.abajo

// Gafas encima de los ojos (de frente y de lado)
function gafas(filas, dir) {
  const r = [...filas]
  if (dir === 'abajo') r[6] = r[6].replace('OSESSSSESO', 'OGEGGGGEGO').replace('HSESSSSESH', 'HGEGGGGEGH')
  if (dir === 'izquierda') r[6] = r[6].replace('OESSSS', 'OEGGSS')
  return r
}

function fotograma(dir, paso, rasgos) {
  const cabeza = (CABEZA[dir][rasgos.pelo] || CABEZA[dir].corto).map((f) => f || '')
  let filas = [...cabeza]
  while (filas.length < 9) filas.push('')
  filas = filas.slice(0, 9).concat(CUERPO[dir], PIERNAS[dir][paso])
  if (rasgos.gafas) filas = gafas(filas, dir)
  if (rasgos.antena) filas[0] = '.......AA'
  if (rasgos.barba && dir !== 'arriba') filas[8] = filas[8].replace(/S/g, 'H')
  return filas
}

export const PALETAS = {
  pelo: ['#3b2a20', '#1d1a19', '#7a4a26', '#d8a64a', '#b0452f', '#9aa3ad'],
  piel: ['#f2c29b', '#e5a97f', '#c98a5e', '#8d5a3b', '#5e3a26', '#fbd9c0'],
  ropa: ['#2fbf71', '#3d7be0', '#a970ff', '#e05a5a', '#f2b33d', '#eef1f4', '#2b2f38', '#ff7fb0'],
  pantalon: ['#2c3e66', '#3a3f48', '#5b4636', '#1f2a44'],
}

function oscurecer(hex, f = 0.7) {
  const n = parseInt(hex.slice(1), 16)
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * f))
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

// Hoja de 3 columnas (quieto, paso 1, paso 2) × 4 filas (abajo, izquierda, derecha, arriba)
export function crearPersonaje(scene, clave, rasgos) {
  if (scene.textures.exists(clave)) scene.textures.remove(clave)
  const [c, ctx] = lienzo(48, 64)
  const paleta = {
    O: '#1b1f27', H: rasgos.colorPelo, S: rasgos.piel, E: rasgos.ojos || '#1b1f27', T: rasgos.ropa,
    D: oscurecer(rasgos.ropa), P: rasgos.pantalon || '#2c3e66', B: rasgos.zapatillas || '#141414', G: '#1b1f27', A: '#3dd9ff',
  }
  const filas = [['abajo', false], ['izquierda', false], ['izquierda', true], ['arriba', false]]
  filas.forEach(([dir, espejo], fila) => {
    for (let paso = 0; paso < 3; paso++) matriz(ctx, fotograma(dir, paso, rasgos), paleta, paso * 16, fila * 16, espejo)
  })
  // Cadena plateada al cuello (de frente)
  if (rasgos.cadena) for (let paso = 0; paso < 3; paso++) { px(ctx, paso * 16 + 6, 9, '#c9d1d9', 4, 1); px(ctx, paso * 16 + 7, 10, '#c9d1d9', 2, 1) }
  // Portátil con pegatinas bajo el brazo (solo Alejandro)
  if (rasgos.portatil) {
    for (let paso = 0; paso < 3; paso++) {
      px(ctx, paso * 16 + 12, 10, '#9aa3ad', 3, 4)
      px(ctx, paso * 16 + 12, 10, '#f89820'); px(ctx, paso * 16 + 14, 11, '#3776ab'); px(ctx, paso * 16 + 13, 12, '#61dafb')
    }
  }
  const tex = scene.textures.addCanvas(clave, c)
  let i = 0
  for (let fila = 0; fila < 4; fila++) for (let col = 0; col < 3; col++) tex.add(i++, 0, col * 16, fila * 16, 16, 16)
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
    px(ctx, o + 4, 5, '#d9dde2', 8, 6)
    px(ctx, o + 5, 6, '#7ad37a', 6, 3) // pantalla
    px(ctx, o + 6, 7, '#1b1f27'); px(ctx, o + 9, 7, '#1b1f27')
    px(ctx, o + 7, 3, '#e05a5a', 2, 1) // sensor
    const r = f === 0 ? 0 : 1
    px(ctx, o + 1, 9 + r, '#1b1f27', 3, 5 - r); px(ctx, o + 12, 10 - r, '#1b1f27', 3, 4 + r) // ruedas
  }
  const tex = scene.textures.addCanvas('jerry', c)
  tex.add(0, 0, 0, 0, 16, 16); tex.add(1, 0, 16, 0, 16, 16)
  scene.anims.create({ key: 'jerry-andar', frames: [{ key: 'jerry', frame: 0 }, { key: 'jerry', frame: 1 }], frameRate: 4, repeat: -1 })
}

// ---------------------------------------------------------------------------------------------- suelos
export function crearSuelos(scene) {
  const tipos = {
    hierba: (ctx, r) => { px(ctx, 0, 0, '#4f9e4a', 16, 16); for (let i = 0; i < 14; i++) px(ctx, (r() * 16) | 0, (r() * 16) | 0, r() > 0.5 ? '#5cb356' : '#458c41') },
    hierba2: (ctx, r) => { tipos.hierba(ctx, r); px(ctx, 6, 7, '#f6e05e'); px(ctx, 5, 8, '#f6e05e'); px(ctx, 7, 8, '#f6e05e'); px(ctx, 6, 9, '#f6e05e'); px(ctx, 6, 8, '#e05a5a') },
    camino: (ctx, r) => { px(ctx, 0, 0, '#d9b97a', 16, 16); for (let i = 0; i < 10; i++) px(ctx, (r() * 16) | 0, (r() * 16) | 0, '#c9a865') },
    piedra: (ctx) => { px(ctx, 0, 0, '#b9b2a3', 16, 16); px(ctx, 0, 7, '#a39c8d', 16, 1); px(ctx, 0, 15, '#a39c8d', 16, 1); px(ctx, 7, 0, '#a39c8d', 1, 7); px(ctx, 12, 8, '#a39c8d', 1, 7) },
    asfalto: (ctx, r) => { px(ctx, 0, 0, '#5b6068', 16, 16); for (let i = 0; i < 8; i++) px(ctx, (r() * 16) | 0, (r() * 16) | 0, '#666b74') },
    agua: (ctx) => { px(ctx, 0, 0, '#3d7be0', 16, 16); px(ctx, 2, 4, '#7fb2ff', 4, 1); px(ctx, 9, 10, '#7fb2ff', 4, 1) },
    cesped: (ctx) => { px(ctx, 0, 0, '#3f9e4f', 16, 16); px(ctx, 0, 0, '#46a957', 16, 8) },
    baldosa: (ctx) => { px(ctx, 0, 0, '#d8dde3', 16, 16); px(ctx, 0, 0, '#c6ccd3', 16, 1); px(ctx, 0, 0, '#c6ccd3', 1, 16) },
  }
  let semilla = 7
  for (const [nombre, pintar] of Object.entries(tipos)) {
    const [c, ctx] = lienzo(16, 16)
    pintar(ctx, azar(semilla++ * 97))
    scene.textures.addCanvas(nombre, c)
  }
  // Árbol (16 × 24)
  const [c, ctx] = lienzo(16, 24)
  px(ctx, 6, 16, '#6b4a2b', 4, 8)
  px(ctx, 2, 3, '#1b1f27', 12, 14); px(ctx, 3, 4, '#2f7d3a', 10, 12); px(ctx, 4, 5, '#3c9a47', 6, 5); px(ctx, 1, 6, '#1b1f27', 1, 8); px(ctx, 14, 6, '#1b1f27', 1, 8)
  scene.textures.addCanvas('arbol', c)
}

// ---------------------------------------------------------------------------------------------- edificios
// Un edificio genérico: pared, techo, ventanas, puerta y, si se quiere, toldo o letrero
function casa(ctx, w, h, o) {
  const techo = o.techo || 10
  px(ctx, 0, techo, '#1b1f27', w, h - techo)
  px(ctx, 1, techo, o.pared, w - 2, h - techo - 1)
  if (o.ladrillo) for (let y = techo + 2; y < h - 2; y += 4) for (let x = (y % 8 ? 2 : 5); x < w - 2; x += 7) px(ctx, x, y, oscurecer(o.pared, 0.85), 3, 1)
  // tejado
  if (o.plano) { px(ctx, 0, techo - 4, '#1b1f27', w, 5); px(ctx, 1, techo - 3, o.tejado, w - 2, 3) }
  else {
    // tejado a dos aguas: cada fila es un poco más ancha que la anterior
    for (let y = 0; y < techo; y++) {
      const mitad = Math.round(((y + 1) / techo) * (w / 2))
      px(ctx, w / 2 - mitad, y, '#1b1f27', mitad * 2, 1)
      if (mitad > 1) px(ctx, w / 2 - mitad + 1, y, y % 3 === 2 ? oscurecer(o.tejado, 0.85) : o.tejado, mitad * 2 - 2, 1)
    }
  }
  // ventanas
  const filasV = o.pisos || 1
  for (let p = 0; p < filasV; p++) {
    const y = techo + 4 + p * 12
    if (y + 7 > h - 12) break
    for (let x = 5; x < w - 8; x += 12) { px(ctx, x, y, '#1b1f27', 7, 7); px(ctx, x + 1, y + 1, o.cristal || '#9fd3ff', 5, 5) }
  }
  // puerta
  const pw = o.puertaAncha ? 12 : 8
  px(ctx, w / 2 - pw / 2, h - 12, '#1b1f27', pw, 12)
  px(ctx, w / 2 - pw / 2 + 1, h - 11, o.puerta || '#6b4a2b', pw - 2, 11)
  if (o.toldo) for (let x = 2; x < w - 2; x += 4) px(ctx, x, techo + 1, x % 8 === 2 ? o.toldo : '#ffffff', 4, 3)
  if (o.franja) px(ctx, 1, techo + 1, o.franja, w - 2, 2)
}

const EDIFICIOS = {
  casa_pueblo: [48, 48, { pared: '#e8d7b5', tejado: '#b4553a', pisos: 2 }],
  piso: [48, 64, { pared: '#e3cfa6', tejado: '#9b4a35', pisos: 3, plano: true }],
  reblan: [64, 48, { pared: '#eef1f4', tejado: '#2b5ea8', toldo: '#2b5ea8', plano: true, puertaAncha: true, cristal: '#bfe3ff' }],
  instituto: [80, 56, { pared: '#d98a5a', tejado: '#8a3b2b', pisos: 2, ladrillo: true, plano: true, puertaAncha: true }],
  soportales: [96, 48, { pared: '#d9c89c', tejado: '#a2533a', pisos: 1 }],
  residencia: [96, 72, { pared: '#c96b4f', tejado: '#5b2f25', pisos: 4, ladrillo: true, plano: true, puertaAncha: true }],
  medac: [96, 64, { pared: '#eef1f4', tejado: '#b3203a', pisos: 3, plano: true, franja: '#b3203a', cristal: '#7fc8ff', puertaAncha: true }],
  anexia: [48, 48, { pared: '#2b2f38', tejado: '#3d7be0', pisos: 2, plano: true, cristal: '#7fc8ff' }],
  udit: [128, 72, { pared: '#2b2f38', tejado: '#f2c200', pisos: 4, plano: true, franja: '#f2c200', cristal: '#bfe3ff', puertaAncha: true }],
  laboratorio: [64, 56, { pared: '#dfe6ee', tejado: '#2fbf71', pisos: 2, plano: true, franja: '#2fbf71', puertaAncha: true }],
  trofeos: [64, 56, { pared: '#f6e7b4', tejado: '#c9962b', pisos: 2, puertaAncha: true }],
  terminal: [48, 48, { pared: '#1b1f27', tejado: '#2fbf71', plano: true, cristal: '#2fbf71', pisos: 2 }],
  correos: [64, 48, { pared: '#f2c200', tejado: '#1f4e9b', plano: true, franja: '#1f4e9b', puertaAncha: true }],
  hackaton: [64, 56, { pared: '#3a2f5c', tejado: '#a970ff', plano: true, cristal: '#e0c9ff', pisos: 2, puertaAncha: true }],
}

export function crearEdificios(scene) {
  for (const [nombre, [w, h, o]] of Object.entries(EDIFICIOS)) {
    const [c, ctx] = lienzo(w, h)
    casa(ctx, w, h, o)
    scene.textures.addCanvas(nombre, c)
  }

  // Puerta de la Villa (San Andrés): dos torres con almenas y el arco en medio
  {
    const [c, ctx] = lienzo(96, 72)
    const piedra = '#c9b48a', sombra = '#a8936a'
    const torre = (x) => {
      px(ctx, x, 8, '#1b1f27', 30, 64); px(ctx, x + 1, 9, piedra, 28, 62)
      for (let i = 0; i < 4; i++) { px(ctx, x + i * 8, 0, '#1b1f27', 6, 9); px(ctx, x + i * 8 + 1, 1, piedra, 4, 8) }
      for (let y = 14; y < 70; y += 6) px(ctx, x + 1, y, sombra, 28, 1)
      px(ctx, x + 12, 22, '#1b1f27', 5, 9)
    }
    torre(0); torre(66)
    px(ctx, 28, 18, '#1b1f27', 40, 54); px(ctx, 29, 19, piedra, 38, 53)
    for (let i = 0; i < 5; i++) { px(ctx, 29 + i * 8, 12, '#1b1f27', 6, 7); px(ctx, 30 + i * 8, 13, piedra, 4, 6) }
    // arco de medio punto
    px(ctx, 38, 40, '#1b1f27', 20, 32); px(ctx, 40, 36, '#1b1f27', 16, 4); px(ctx, 43, 33, '#1b1f27', 10, 3)
    px(ctx, 40, 42, '#2a2420', 16, 30); px(ctx, 42, 38, '#2a2420', 12, 4)
    px(ctx, 44, 24, '#8a6d3b', 8, 6) // escudo
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
    px(ctx, 0, 24, '#eeeeee', 3, 16); px(ctx, 109, 24, '#eeeeee', 3, 16)
    scene.textures.addCanvas('campo', c)
  }

  // Avioneta para el Erasmus
  {
    const [c, ctx] = lienzo(48, 24)
    px(ctx, 4, 9, '#1b1f27', 40, 8); px(ctx, 5, 10, '#eef1f4', 38, 6)
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
    px(ctx, 2, 4, '#1b1f27', 28, 4); px(ctx, 3, 5, '#2fbf71', 26, 2)
    px(ctx, 4, 8, '#1b1f27', 2, 24); px(ctx, 26, 8, '#1b1f27', 2, 24)
    px(ctx, 8, 14, '#1b1f27', 16, 10); px(ctx, 9, 15, '#eef1f4', 14, 8)
    px(ctx, 10, 17, '#1b1f27', 10, 1); px(ctx, 10, 20, '#1b1f27', 8, 1)
    scene.textures.addCanvas('parada', c)
  }
  {
    const [c, ctx] = lienzo(16, 16)
    px(ctx, 0, 0, '#1b1f27', 16, 16); px(ctx, 1, 1, '#8a5a32', 14, 14); px(ctx, 1, 1, '#5cb356', 14, 4)
    px(ctx, 3, 5, '#5cb356', 2, 2); px(ctx, 9, 5, '#5cb356', 2, 3); px(ctx, 5, 9, '#6e4626', 2, 2); px(ctx, 11, 11, '#6e4626', 2, 2)
    scene.textures.addCanvas('bloque', c)
  }
  // Cartel de madera
  {
    const [c, ctx] = lienzo(16, 16)
    px(ctx, 7, 8, '#6b4a2b', 2, 8); px(ctx, 1, 2, '#1b1f27', 14, 8); px(ctx, 2, 3, '#c9a865', 12, 6)
    scene.textures.addCanvas('cartel', c)
  }
  // Fuente de la plaza
  {
    const [c, ctx] = lienzo(32, 32)
    px(ctx, 2, 12, '#1b1f27', 28, 18); px(ctx, 3, 13, '#b9b2a3', 26, 16); px(ctx, 5, 15, '#3d7be0', 22, 12)
    px(ctx, 14, 4, '#1b1f27', 4, 14); px(ctx, 15, 5, '#b9b2a3', 2, 12); px(ctx, 12, 2, '#7fb2ff', 8, 3)
    scene.textures.addCanvas('fuente', c)
  }
}
