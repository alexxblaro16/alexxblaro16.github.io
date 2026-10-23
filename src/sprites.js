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
    scene.anims.create({ key: nombre, frames: [base + 1, base, base + 2, base].map((f) => ({ key: clave, frame: f })), frameRate: 10, repeat: -1 })
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
    hierba_osc: (ctx, r) => {
      px(ctx, 0, 0, '#4f9a46', 16, 16)
      for (let i = 0; i < 18; i++) px(ctx, (r() * 16) | 0, (r() * 16) | 0, r() > 0.5 ? '#58a34d' : '#468c3e')
      for (let i = 0; i < 2; i++) mata(ctx, 1 + ((r() * 12) | 0), 2 + ((r() * 12) | 0), '#66b45a', '#3a7d35')
    },
    hierba_clara: (ctx, r) => {
      px(ctx, 0, 0, '#64b257', 16, 16)
      for (let i = 0; i < 18; i++) px(ctx, (r() * 16) | 0, (r() * 16) | 0, r() > 0.5 ? '#70bd62' : '#5aa84f')
      for (let i = 0; i < 2; i++) mata(ctx, 1 + ((r() * 12) | 0), 2 + ((r() * 12) | 0), '#86d276', '#4a9443')
    },
    // matas de hierba alta, con briznas de tres tonos
    hierba_alta: (ctx, r) => {
      tipos.hierba(ctx, r)
      for (let k = 0; k < 4; k++) {
        const x = 1 + ((r() * 12) | 0), y = 4 + ((r() * 8) | 0)
        px(ctx, x, y, '#3a7d35', 1, 4); px(ctx, x + 1, y - 2, '#4f9e4a', 1, 6); px(ctx, x + 2, y - 1, '#76c768', 1, 5); px(ctx, x + 3, y + 1, '#3f8a3a', 1, 3)
      }
    },
    acera: (ctx) => {
      px(ctx, 0, 0, '#c9ced4', 16, 16)
      for (const [x, y] of [[0, 0], [8, 0], [0, 8], [8, 8]]) { px(ctx, x + 1, y + 1, '#d6dade', 7, 7); px(ctx, x + 1, y + 1, '#e2e5e8', 7, 1) }
      px(ctx, 0, 7, '#aab1b9', 16, 1); px(ctx, 7, 0, '#aab1b9', 1, 16); px(ctx, 0, 15, '#aab1b9', 16, 1); px(ctx, 15, 0, '#aab1b9', 1, 16)
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
    asfalto: (ctx, r) => {
      px(ctx, 0, 0, '#575c64', 16, 16)
      for (let i = 0; i < 22; i++) px(ctx, (r() * 16) | 0, (r() * 16) | 0, r() > 0.5 ? '#636871' : '#4e535a')
      if (r() > 0.7) { const x = (r() * 10) | 0, y = (r() * 12) | 0; px(ctx, x, y, '#45494f', 3, 1); px(ctx, x + 2, y + 1, '#45494f', 2, 1) } // grieta
    },
    agua: (ctx) => {
      px(ctx, 0, 0, '#3576d6', 16, 16); px(ctx, 0, 0, '#3d82e6', 16, 8)
      px(ctx, 2, 4, '#9cc6ff', 4, 1); px(ctx, 3, 3, '#cfe3ff', 2, 1); px(ctx, 9, 11, '#9cc6ff', 4, 1); px(ctx, 10, 10, '#cfe3ff', 2, 1)
    },
    arena: (ctx, r) => {
      px(ctx, 0, 0, '#ecd9a0', 16, 16)
      for (let i = 0; i < 14; i++) px(ctx, (r() * 16) | 0, (r() * 16) | 0, r() > 0.5 ? '#f6e7bd' : '#d9c184')
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

  // Pino (20 × 38): pisos de ramas oscuras con algo de luz a la izquierda
  {
    const [c, ctx] = lienzo(20, 38)
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(10, 36, 7, 2, 0, 0, Math.PI * 2); ctx.fill()
    px(ctx, 8, 28, '#1b1f27', 4, 9); px(ctx, 9, 28, '#6b4a2b', 2, 8)
    for (const [y, mitad] of [[1, 2], [4, 3], [7, 5], [11, 6], [15, 7], [19, 8], [23, 9]]) {
      for (let i = 0; i < 5; i++) {
        const w = Math.max(1, Math.round((mitad * (i + 2)) / 6))
        px(ctx, 10 - w - 1, y + i, '#14261a', w * 2 + 2, 1); px(ctx, 10 - w, y + i, i > 2 ? '#1f5a2c' : '#2a7535', w * 2, 1)
        px(ctx, 10 - w, y + i, '#3c9a47', Math.max(1, Math.round(w * 0.6)), 1)
      }
    }
    scene.textures.addCanvas('pino', c)
  }
  // Chopo (16 × 40): alto y estrecho, verde claro, con el tronco blanquecino; el árbol típico de Castilla
  {
    const [c, ctx] = lienzo(16, 40)
    ctx.fillStyle = 'rgba(0,0,0,0.16)'; ctx.beginPath(); ctx.ellipse(8, 38, 5, 1.6, 0, 0, Math.PI * 2); ctx.fill()
    px(ctx, 7, 26, '#1b1f27', 3, 13); px(ctx, 7, 27, '#d9d4c8', 2, 11); px(ctx, 8, 30, '#6a6458', 1, 1); px(ctx, 7, 34, '#6a6458', 1, 1)
    for (let y = 0; y < 30; y++) {
      const mitad = Math.round(Math.sin(((y + 2) / 32) * Math.PI) * 6)
      if (mitad < 1) continue
      px(ctx, 8 - mitad - 1, y, '#1d3a1f', mitad * 2 + 2, 1); px(ctx, 8 - mitad, y, y % 4 < 2 ? '#6fae4a' : '#5f9e40', mitad * 2, 1)
      px(ctx, 8 - mitad, y, '#9ccc5a', Math.max(1, Math.round(mitad * 0.5)), 1)
      if (y % 5 === 2) px(ctx, 8 + Math.round(mitad * 0.3), y, '#4a8434', 2, 1)
    }
    scene.textures.addCanvas('chopo', c)
  }
  // Mariposas (dos colores, dos fotogramas: alas abiertas y cerradas)
  for (const [nombre, ala, punto] of [['mariposa_a', '#f6f0d0', '#f2c200'], ['mariposa_b', '#ff9a3c', '#3a2a20']]) {
    const [c, ctx] = lienzo(12, 6)
    px(ctx, 2, 1, '#2b2f38', 1, 4); px(ctx, 0, 0, ala, 2, 3); px(ctx, 3, 0, ala, 2, 3); px(ctx, 1, 3, ala, 1, 2); px(ctx, 3, 3, ala, 1, 2); px(ctx, 0, 1, punto); px(ctx, 4, 1, punto)
    px(ctx, 8, 1, '#2b2f38', 1, 4); px(ctx, 7, 1, ala, 1, 3); px(ctx, 9, 1, ala, 1, 3)
    const tex = scene.textures.addCanvas(nombre, c)
    tex.add(0, 0, 0, 0, 6, 6); tex.add(1, 0, 6, 0, 6, 6)
  }
  // Pájaro en vuelo (alas arriba y abajo)
  {
    const [c, ctx] = lienzo(18, 6)
    const ave = '#2b2f38'
    px(ctx, 0, 0, ave, 2, 1); px(ctx, 2, 1, ave, 2, 1); px(ctx, 4, 2, ave, 1, 1); px(ctx, 5, 1, ave, 2, 1); px(ctx, 7, 0, ave, 2, 1)
    px(ctx, 9, 3, ave, 2, 1); px(ctx, 11, 2, ave, 2, 1); px(ctx, 13, 2, ave, 1, 2); px(ctx, 14, 2, ave, 2, 1); px(ctx, 16, 3, ave, 2, 1)
    const tex = scene.textures.addCanvas('pajaro', c)
    tex.add(0, 0, 0, 0, 9, 6); tex.add(1, 0, 9, 0, 9, 6)
  }
  // Sombra de nube: mancha oscura muy suave, con tramado en el borde para que no tenga corte
  {
    const [c, ctx] = lienzo(200, 104)
    for (let y = 0; y < 104; y++) for (let x = 0; x < 200; x++) {
      const dx = (x - 100) / 96, dy = (y - 52) / 48
      const bulto = 0.12 * Math.sin(x / 13) + 0.1 * Math.cos(y / 9)
      const d = dx * dx + dy * dy - bulto
      if (d < 0.7) px(ctx, x, y, 'rgba(20,32,48,0.10)')
      else if (d < 1 && (x + y) % 2 === 0) px(ctx, x, y, 'rgba(20,32,48,0.07)')
    }
    scene.textures.addCanvas('sombra_nube', c)
  }
}

// ---------------------------------------------------------------------------------------------- decorado pequeño
// Campo de fútbol, avioneta del Erasmus, parada, bloque secreto, carteles y fuente
export function crearDecorado(scene) {
  // Campo de fútbol: césped segado a franjas, líneas completas, áreas, puntos de penalti, córners,
  // porterías con red, banderines y un balón
  {
    const [c, ctx] = lienzo(112, 64)
    const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
    p(0, 0, 112, 64, '#3c984b')
    for (let x = 0; x < 112; x += 14) p(x, 0, 7, 64, '#45a654')
    const L = '#f4f6f2'
    p(4, 3, 104, 1, L); p(4, 60, 104, 1, L); p(4, 3, 1, 58, L); p(107, 3, 1, 58, L); p(56, 3, 1, 58, L)
    for (let a = 0; a < 360; a += 5) p(56 + Math.round(Math.cos((a * Math.PI) / 180) * 9), 32 + Math.round(Math.sin((a * Math.PI) / 180) * 9), 1, 1, L)
    p(55, 31, 3, 3, L)
    for (const [x0, s] of [[4, 1], [107, -1]]) {
      // área grande, área pequeña, punto de penalti y la media luna
      p(s > 0 ? x0 : x0 - 16, 16, 17, 1, L); p(s > 0 ? x0 : x0 - 16, 47, 17, 1, L); p(x0 + s * 16, 16, 1, 32, L)
      p(s > 0 ? x0 : x0 - 6, 24, 7, 1, L); p(s > 0 ? x0 : x0 - 6, 39, 7, 1, L); p(x0 + s * 6, 24, 1, 16, L)
      p(x0 + s * 11 - (s < 0 ? 1 : 0), 31, 2, 2, L)
      for (let a = -50; a <= 50; a += 8) { const xx = x0 + s * 11 + s * Math.round(Math.cos((a * Math.PI) / 180) * 9); if ((xx - (x0 + s * 16)) * s > 0) p(xx, 32 + Math.round(Math.sin((a * Math.PI) / 180) * 9), 1, 1, L) }
      // portería con red
      const gx = s > 0 ? 0 : 108
      p(gx, 25, 4, 14, '#d9dee4')
      for (let y = 26; y < 38; y += 2) p(gx, y, 4, 1, '#9aa3ad')
      for (let x = gx; x < gx + 4; x += 2) p(x, 25, 1, 14, '#b9c0c8')
      p(s > 0 ? 3 : 108, 25, 1, 14, '#ffffff'); p(gx, 25, 4, 1, '#ffffff'); p(gx, 38, 4, 1, '#ffffff')
    }
    // córners y banderines
    for (const [x, y] of [[4, 3], [107, 3], [4, 60], [107, 60]]) {
      p(x + (x < 50 ? 1 : -1), y + (y < 30 ? 1 : -1), 1, 1, L)
      p(x, y - 3, 1, 4, '#ffffff'); p(x + (x < 50 ? 1 : -2), y - 3, 2, 2, '#e05a5a')
    }
    // balón
    p(70, 37, 3, 3, '#ffffff'); p(71, 38, 1, 1, '#1b1f27'); p(70, 40, 3, 1, 'rgba(0,0,0,0.25)')
    scene.textures.addCanvas('campo', c)

    // Estadio (144 × 92): pista roja con calles, banquillos a un lado y el campo en el centro
    const [e, ex] = lienzo(144, 92)
    const q = (x, y, w, h, col) => px(ex, x, y, col, w, h)
    q(0, 0, 144, 92, '#1b1f27'); q(1, 1, 142, 90, '#b5523b')
    for (const d of [4, 8]) { q(d, d, 144 - d * 2, 1, '#e8c1b0'); q(d, 91 - d, 144 - d * 2, 1, '#e8c1b0'); q(d, d, 1, 92 - d * 2, '#e8c1b0'); q(143 - d, d, 1, 92 - d * 2, '#e8c1b0') }
    q(12, 12, 120, 68, '#2f7a3c')
    ex.drawImage(c, 16, 14)
    for (const x of [40, 88]) { q(x, 82, 16, 7, '#1b1f27'); q(x + 1, 83, 14, 3, '#8fc4e8'); q(x + 1, 86, 14, 2, '#2f5fb0') } // banquillos
    scene.textures.addCanvas('estadio', e)
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
