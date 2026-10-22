// Pixel art dibujado con código: suelos, árboles y Jerry. Los personajes están en personajes.js
// y los edificios en edificios.js; aquí se reexportan para que el resto del juego los pida a un solo sitio.
import { lienzo, px, azar } from './pixel.js'
export { crearPersonaje, PALETAS, ANCHO_PJ, ALTO_PJ } from './personajes.js'
export { crearEdificios } from './edificios.js'

export const T = 16 // tamaño de una casilla

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
      px(ctx, 0, 0, '#bdb6a6', 16, 16)
      const pieza = (x, y, w, h) => { px(ctx, x, y, '#e0dacb', w, h); px(ctx, x, y, '#ece7db', w, 1); px(ctx, x + w - 1, y + 1, '#cdc6b6', 1, h - 1) }
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

// ---------------------------------------------------------------------------------------------- decorado pequeño
// Campo de fútbol, avioneta del Erasmus, parada, bloque secreto, carteles y fuente
export function crearDecorado(scene) {
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
