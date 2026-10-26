// Edificios y objetos grandes del decorado. Los de la vida de Alejandro están copiados de fotos reales:
// la Puerta de la Villa, Reblán y su furgoneta, la Plaza Mayor, el IES Tierra de Campos, MEDAC Albalá y la UDIT.
import { lienzo, px, oscurecer, aclarar, azar, texto, textoCentrado, anchoTexto } from './pixel.js'

const NEGRO = '#1b1f27'

// Texto de la fuente pequeña a doble tamaño (para el letrero de la UDIT)
function textoGrande(ctx, cadena, cx, y, color, escala = 2) {
  const [c, x2] = lienzo(anchoTexto(cadena), 5)
  texto(x2, cadena, 0, 0, color)
  ctx.drawImage(c, Math.round(cx - (c.width * escala) / 2), y, c.width * escala, 5 * escala)
}

// ---------------------------------------------------------------------------------------------- casa genérica
const p0 = (ctx, x, y, color, w, h) => px(ctx, x, y, color, w, h)

// Ventana con marco claro, cristal en dos tonos, un brillo en diagonal y alféizar
function ventana(ctx, x, y, o) {
  const cristal = o.cristal || '#9fd3ff'
  px(ctx, x, y, NEGRO, 8, 9)
  px(ctx, x + 1, y + 1, o.marco || '#f4f1ea', 6, 7)
  px(ctx, x + 2, y + 2, cristal, 4, 5)
  px(ctx, x + 2, y + 5, oscurecer(cristal, 0.82), 4, 2)
  px(ctx, x + 2, y + 2, aclarar(cristal, 0.55), 1, 2); px(ctx, x + 3, y + 2, aclarar(cristal, 0.55))
  if (o.codigo) { p0(ctx, x + 2, y + 2, '#0d1117', 4, 5); p0(ctx, x + 2, y + 3, '#2fbf71', 3, 1); p0(ctx, x + 3, y + 5, '#7ee2a8', 2, 1); p0(ctx, x + 2, y + 6, '#2fbf71', 1, 1) }
  if (o.cruz) { px(ctx, x + 4, y + 2, o.marco || '#f4f1ea', 1, 5); px(ctx, x + 2, y + 4, o.marco || '#f4f1ea', 4, 1) }
  px(ctx, x - 1, y + 9, NEGRO, 10, 1); px(ctx, x, y + 9, oscurecer(o.pared, 0.75), 8, 1)
  if (o.macetas) { px(ctx, x + 1, y + 8, '#b4553a', 6, 1); px(ctx, x + 1, y + 7, '#e05a5a'); px(ctx, x + 3, y + 7, '#f6e05e'); px(ctx, x + 5, y + 7, '#e05a5a') }
}

function casa(ctx, w, h, o) {
  const techo = o.techo || 10
  px(ctx, 0, techo, NEGRO, w, h - techo)
  px(ctx, 1, techo, o.pared, w - 2, h - techo - 1)
  px(ctx, 1, techo, aclarar(o.pared, 0.18), 2, h - techo - 1)
  px(ctx, w - 4, techo, oscurecer(o.pared, 0.88), 3, h - techo - 1)
  if (o.ladrillo) for (let y = techo + 3; y < h - 4; y += 3) for (let x = (y % 6 ? 2 : 5); x < w - 3; x += 6) px(ctx, x, y, oscurecer(o.pared, 0.86), 4, 1)
  px(ctx, 1, h - 4, oscurecer(o.pared, 0.72), w - 2, 3)
  px(ctx, 1, h - 4, oscurecer(o.pared, 0.62), w - 2, 1)
  if (o.plano) {
    px(ctx, 0, techo - 5, NEGRO, w, 6)
    px(ctx, 1, techo - 4, o.tejado, w - 2, 4)
    px(ctx, 1, techo - 4, aclarar(o.tejado, 0.3), w - 2, 1)
    px(ctx, 1, techo - 1, oscurecer(o.tejado, 0.7), w - 2, 1)
    px(ctx, 1, techo, oscurecer(o.pared, 0.7), w - 2, 1)
  } else {
    for (let y = 0; y < techo; y++) {
      const mitad = Math.round(((y + 1) / techo) * (w / 2))
      px(ctx, w / 2 - mitad, y, NEGRO, mitad * 2, 1)
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
  const pisos = o.pisos || 1
  const pw = o.puertaAncha ? 14 : 10
  for (let p = 0; p < pisos; p++) {
    const y = techo + (o.franja ? 7 : 5) + p * 12
    if (y + 10 > h - 22) break
    for (let x = 5; x < w - 9; x += 12) ventana(ctx, x, y, o)
  }
  const yb = h - 18
  for (let x = 5; x < w - 9; x += 12) if (x + 9 < w / 2 - pw / 2 - 1 || x > w / 2 + pw / 2 + 1) ventana(ctx, x, yb - 1, o)
  const x0 = Math.round(w / 2 - pw / 2)
  px(ctx, x0 - 1, h - 21, NEGRO, pw + 2, 20)
  px(ctx, x0, h - 20, oscurecer(o.pared, 0.6), pw, 19)
  const madera = o.puerta || '#7a5232'
  px(ctx, x0 + 1, h - 19, madera, pw - 2, 17)
  px(ctx, x0 + 1, h - 19, aclarar(madera, 0.15), pw - 2, 1)
  if (o.puertaAncha) {
    const cr = o.cristal || '#9fd3ff'
    px(ctx, x0 + 2, h - 17, cr, pw / 2 - 3, 12); px(ctx, x0 + pw / 2 + 1, h - 17, cr, pw / 2 - 3, 12)
    px(ctx, x0 + 2, h - 17, aclarar(cr, 0.5), 1, 5); px(ctx, x0 + pw / 2 + 1, h - 17, aclarar(cr, 0.5), 1, 5)
    px(ctx, x0 + pw / 2, h - 19, NEGRO, 1, 17)
  } else {
    px(ctx, x0 + 2, h - 17, oscurecer(madera, 0.8), pw - 4, 5); px(ctx, x0 + 2, h - 10, oscurecer(madera, 0.8), pw - 4, 6)
    px(ctx, x0 + pw - 3, h - 11, '#f2c200')
  }
  px(ctx, x0 - 2, h - 2, '#9a9a9a', pw + 4, 1); px(ctx, x0 - 2, h - 1, '#6f6f6f', pw + 4, 1)
  if (o.farol) { px(ctx, x0 - 4, h - 17, NEGRO, 2, 3); px(ctx, x0 - 4, h - 16, '#ffe58a', 2, 1) }
}

// Detalles propios de cada edificio genérico, encima de la casa base
const EXTRAS = {
  // placas solares en la azotea del laboratorio de proyectos
  laboratorio(ctx, w) {
    for (let x = 4; x < w - 12; x += 14) { px(ctx, x, 0, NEGRO, 12, 5); px(ctx, x + 1, 1, '#1d3d7a', 10, 3); for (let i = x + 3; i < x + 11; i += 3) px(ctx, i, 1, '#5f86c8', 1, 3) }
  },
  // copa dorada sobre la puerta de los trofeos
  trofeos(ctx, w, h) {
    const x = w / 2 - 4, y = h - 29
    px(ctx, x, y, NEGRO, 9, 7); px(ctx, x + 1, y + 1, '#f2c200', 7, 3); px(ctx, x + 3, y + 4, '#f2c200', 3, 1); px(ctx, x + 2, y + 5, '#c9962b', 5, 1); px(ctx, x + 2, y + 1, '#fff3a0', 1, 2)
  },
  // antena parabólica en la terminal del stack
  terminal(ctx, w) { px(ctx, w - 12, 0, '#9aa3ad', 7, 4); px(ctx, w - 11, 1, '#cfd5db', 5, 2); px(ctx, w - 9, 4, '#5b6068', 1, 2) },
  // neón </> sobre la puerta de los hackatones
  hackaton(ctx, w, h) {
    const x = w / 2 - 8, y = h - 28, c = '#e0c9ff'
    px(ctx, x - 1, y - 1, '#2a2045', 18, 7)
    px(ctx, x + 2, y + 2, c); px(ctx, x + 1, y + 1, c); px(ctx, x + 1, y + 3, c); px(ctx, x, y + 2, c)
    px(ctx, x + 8, y, c); px(ctx, x + 7, y + 2, c); px(ctx, x + 6, y + 4, c)
    px(ctx, x + 13, y + 2, c); px(ctx, x + 14, y + 1, c); px(ctx, x + 14, y + 3, c); px(ctx, x + 15, y + 2, c)
  },
  // aparatos de aire acondicionado en la fachada de la residencia
  residencia(ctx) { for (const [x, y] of [[14, 22], [62, 34], [38, 46], [86, 22]]) { px(ctx, x, y, NEGRO, 7, 5); px(ctx, x + 1, y + 1, '#d9dee4', 5, 3); px(ctx, x + 2, y + 2, '#9aa3ad', 3, 1) } },
  // buzón amarillo junto a la puerta de contacto
  correos(ctx, w, h) { const x = w / 2 + 10; px(ctx, x, h - 14, NEGRO, 7, 11); px(ctx, x + 1, h - 13, '#f6d01a', 5, 6); px(ctx, x + 2, h - 11, NEGRO, 3, 1); px(ctx, x + 3, h - 7, '#3a3f48', 1, 4) },
}

const GENERICOS = {
  casa_pueblo: [48, 48, { pared: '#ecdcba', tejado: '#b4553a', pisos: 2, cruz: true, macetas: true, farol: true }],
  casa_pueblo_2: [48, 48, { pared: '#f2efe6', tejado: '#9b4a35', pisos: 2, cruz: true, marco: '#3c7a4a', macetas: true }],
  edificio_madrid: [48, 64, { pared: '#b8735a', tejado: '#5b2f25', pisos: 3, ladrillo: true, plano: true, macetas: true }],
  edificio_madrid_2: [48, 64, { pared: '#d9d2c4', tejado: '#6a6f78', pisos: 3, plano: true, cristal: '#9fd3ff' }],
  piso: [48, 64, { pared: '#e3cfa6', tejado: '#9b4a35', pisos: 3, plano: true, cruz: true, macetas: true }],
  residencia: [96, 72, { pared: '#c96b4f', tejado: '#5b2f25', pisos: 4, ladrillo: true, plano: true, puertaAncha: true, macetas: true }],
  laboratorio: [64, 56, { pared: '#dfe6ee', tejado: '#2fbf71', pisos: 2, plano: true, franja: '#2fbf71', puertaAncha: true }],
  trofeos: [64, 56, { pared: '#f6e7b4', tejado: '#c9962b', pisos: 2, puertaAncha: true, marco: '#c9962b', farol: true }],
  terminal: [48, 48, { pared: '#1b1f27', tejado: '#2fbf71', plano: true, cristal: '#2fbf71', pisos: 2, marco: '#2b2f38', codigo: true }],
  correos: [64, 48, { pared: '#f2c200', tejado: '#1f4e9b', plano: true, franja: '#1f4e9b', puertaAncha: true }],
  hackaton: [64, 56, { pared: '#3a2f5c', tejado: '#a970ff', plano: true, cristal: '#e0c9ff', pisos: 2, puertaAncha: true, marco: '#5a4a8a' }],
}

// ---------------------------------------------------------------------------------------------- tejado de teja árabe
function tejado(ctx, x, y, w, h, color) {
  px(ctx, x, y, color, w, h)
  for (let xx = x; xx < x + w; xx += 3) { px(ctx, xx, y, oscurecer(color, 0.8), 1, h); px(ctx, xx + 1, y, aclarar(color, 0.12), 1, h) }
  for (let yy = y + 3; yy < y + h; yy += 4) px(ctx, x, yy, oscurecer(color, 0.72), w, 1)
  px(ctx, x, y, oscurecer(color, 0.6), w, 1)
  px(ctx, x, y + h, oscurecer(color, 0.45), w, 2) // sombra del alero
}

// ---------------------------------------------------------------------------------------------- Puerta de la Villa
function puertaVilla() {
  const [c, ctx] = lienzo(128, 104)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  const base = '#cfa565', luz = '#e8c587', sombra = '#a77f45', oscuro = '#7c5c30'
  const r = azar(31)
  // sillares: juntas y algún bloque más claro u oscuro
  const sillares = (x0, y0, w, h, desfase) => {
    for (let y = y0; y < y0 + h; y += 6) {
      p(x0, y, w, 1, 'rgba(70,45,15,0.35)')
      for (let x = x0 + (((y - y0) / 6 + desfase) % 2 ? 4 : 0); x < x0 + w; x += 9) {
        p(x, y, 1, 6, 'rgba(70,45,15,0.3)')
        const v = r()
        if (v > 0.8) p(x + 1, y + 1, 8, 5, 'rgba(255,240,200,0.12)')
        else if (v < 0.18) p(x + 1, y + 1, 8, 5, 'rgba(60,35,10,0.12)')
      }
    }
  }
  // cuerpo central, detrás de las torres
  p(38, 30, 52, 74, base); p(38, 30, 52, 2, luz)
  sillares(38, 32, 52, 72, 1)
  for (let x = 40; x < 88; x += 8) { p(x, 22, 5, 8, base); p(x, 22, 5, 1, luz); p(x + 4, 23, 1, 7, sombra) }
  // ventana geminada
  p(58, 40, 12, 14, oscuro); p(59, 42, 4, 11, '#2b2119'); p(65, 42, 4, 11, '#2b2119'); p(59, 41, 4, 1, '#2b2119'); p(65, 41, 4, 1, '#2b2119')
  // arco apuntado con dovelas claras y la calle al fondo
  for (let y = 52; y < 104; y++) {
    const t = Math.max(0, (66 - y) / 14)
    const mitad = y >= 66 ? 13 : Math.round(13 * (1 - Math.pow(t, 1.5)))
    p(64 - mitad - 3, y, 3, 1, luz); p(64 + mitad, y, 3, 1, luz)
    if (mitad > 0) { if (y < 64) p(64 - mitad, y, mitad * 2, 1, '#2b2119'); else ctx.clearRect(64 - mitad, y, mitad * 2, 1) }
  }
  for (let y = 56; y < 100; y += 5) { p(48, y, 3, 1, sombra); p(77, y, 3, 1, sombra) }
  p(51, 64, 26, 2, 'rgba(20,12,5,0.45)') // sombra de la bóveda
  // torres cilíndricas: luz a la izquierda y sombra a la derecha
  const torre = (x0) => {
    const w = 44
    for (let x = 0; x < w; x++) {
      const t = x / (w - 1)
      const col = t < 0.07 ? sombra : t < 0.38 ? luz : t < 0.68 ? base : t < 0.9 ? sombra : oscuro
      p(x0 + x, 16, 1, 82, col)
      // matacanes: una franja algo más ancha bajo las almenas
      p(x0 + x, 12, 1, 4, oscurecer(col, 0.92))
    }
    p(x0 - 1, 12, 1, 4, oscuro); p(x0 + w, 12, 1, 4, oscuro); p(x0, 16, w, 1, 'rgba(40,25,10,0.5)')
    sillares(x0 + 1, 17, w - 2, 80, x0 ? 0 : 1)
    // almenas
    for (let i = 0; i < 5; i++) {
      const mx = x0 + 1 + i * 9
      const col = i === 0 ? sombra : i < 2 ? luz : i < 4 ? base : sombra
      p(mx, 2, 6, 10, col); p(mx, 2, 6, 1, aclarar(col, 0.2)); p(mx + 5, 3, 1, 9, oscurecer(col, 0.85))
    }
    // saeteras
    p(x0 + 18, 44, 2, 12, '#2b2119'); p(x0 + 17, 49, 4, 1, '#2b2119')
    p(x0 + 24, 70, 2, 8, '#2b2119')
    // zócalo
    p(x0 - 1, 96, w + 2, 8, oscurecer(base, 0.82)); p(x0 - 1, 96, w + 2, 1, luz)
  }
  torre(0); torre(84)
  return c
}

// ---------------------------------------------------------------------------------------------- Reblán y su furgoneta
function reblan() {
  const [c, ctx] = lienzo(96, 64)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  const pared = '#dcbb88'
  // chimenea y antena
  p(70, 0, 8, 8, '#b0684a'); p(70, 3, 8, 1, '#8a4a32'); p(69, 0, 10, 2, '#6e3a28')
  p(84, 0, 1, 6, '#5b6068'); p(80, 1, 9, 1, '#5b6068'); p(81, 3, 7, 1, '#5b6068')
  tejado(ctx, 0, 5, 96, 14, '#9a4e34')
  // fachada
  p(0, 21, 96, 43, pared); p(0, 21, 96, 2, oscurecer(pared, 0.8)); p(0, 23, 2, 33, aclarar(pared, 0.2)); p(93, 23, 3, 33, oscurecer(pared, 0.9))
  p(0, 56, 96, 8, '#bdb3a2'); p(0, 56, 96, 1, '#d6cdbd'); p(0, 63, 96, 1, '#8f8778')
  // letrero REBLÁN en granate con la tilde
  textoCentrado(ctx, 'REBLAN', 48, 25, '#8a1f2c')
  const xa = Math.round(48 - anchoTexto('REBLAN') / 2) + anchoTexto('REBL') + 2
  p(xa + 1, 23, 1, 1, '#8a1f2c')
  p(30, 32, 36, 1, '#7a6a58'); p(34, 34, 28, 1, '#9a8a76')
  // escaparates con toldo oscuro
  for (const x of [6, 60]) {
    p(x - 2, 36, 34, 3, '#3a3d44'); p(x - 2, 39, 34, 1, '#22252c')
    p(x, 40, 30, 16, '#f4f4f0'); p(x + 2, 42, 26, 12, '#2e3a46'); p(x + 2, 42, 26, 4, '#3d4c5c')
    p(x + 4, 43, 3, 1, '#6f8296'); p(x + 3, 44, 2, 1, '#6f8296')
    p(x + 15, 42, 1, 12, '#f4f4f0'); p(x - 1, 56, 32, 1, '#cfc9bc')
  }
  // puerta
  p(41, 36, 14, 28, '#3a2a20'); p(43, 38, 10, 12, '#2e3a46'); p(44, 39, 2, 4, '#6f8296'); p(43, 51, 10, 12, '#5a3a28'); p(51, 50, 1, 2, '#d6c070')
  p(39, 62, 18, 2, '#9a9a9a')
  p(94, 21, 1, 35, '#cfd2d6') // bajante
  return c
}

function furgoneta() {
  // Furgoneta de reparto vista de lado: cabina blanca, caja con el vinilo azul y la onda blanca, y REBLÁN en rojo
  const [c, ctx] = lienzo(66, 36)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  const blanco = '#f4f6f8', sombra = '#d6dbe1', azul = '#1f3c9a', azulOsc = '#152a6e'
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(33, 33, 31, 3, 0, 0, Math.PI * 2); ctx.fill()
  // caja de carga
  p(2, 4, 44, 1, NEGRO); p(1, 5, 1, 23, NEGRO); p(2, 5, 44, 23, blanco); p(2, 5, 44, 2, '#ffffff'); p(2, 24, 44, 4, sombra)
  // vinilo azul con la onda
  p(2, 13, 42, 11, azul); p(2, 21, 42, 3, azulOsc)
  for (let x = 2; x < 44; x++) { const y = 15 + Math.round(2.5 * Math.sin(x / 6)); p(x, y, 1, 2, '#ffffff'); p(x, y + 2, 1, 1, '#8fb0e8') }
  // rótulo REBLÁN en rojo sobre la parte blanca
  textoCentrado(ctx, 'REBLAN', 22, 6, '#c8202a')
  p(26, 4, 1, 1, '#c8202a')
  // puerta corredera y su tirador
  p(31, 6, 1, 21, '#b9c0c8'); p(33, 15, 3, 1, '#5b6068')
  // cabina con morro inclinado
  p(46, 8, 12, 20, blanco); p(46, 7, 8, 1, NEGRO); p(54, 8, 2, 1, NEGRO); p(56, 9, 2, 2, NEGRO); p(58, 11, 1, 4, NEGRO); p(59, 15, 1, 13, NEGRO)
  p(56, 11, 2, 4, blanco); p(58, 15, 1, 13, blanco); p(46, 24, 13, 4, sombra)
  p(47, 9, 7, 7, '#2e4466'); p(48, 10, 2, 3, '#7f9fcf'); p(54, 10, 3, 6, '#2e4466'); p(55, 11, 1, 2, '#7f9fcf') // ventanillas y parabrisas
  p(45, 11, 2, 3, NEGRO) // retrovisor
  p(51, 17, 3, 1, '#5b6068') // tirador de la puerta
  p(58, 18, 2, 3, '#ffe58a'); p(57, 25, 4, 3, '#9aa3ad'); p(1, 25, 2, 3, '#e05a5a') // faro, parachoques y piloto
  p(2, 28, 57, 1, NEGRO)
  // ruedas con su paso de rueda
  for (const cx of [13, 50]) {
    p(cx - 6, 23, 12, 4, '#2b2f38')
    p(cx - 4, 25, 8, 10, NEGRO); p(cx - 5, 27, 10, 6, NEGRO)
    p(cx - 2, 27, 4, 4, '#b9c0c8'); p(cx - 1, 28, 2, 2, '#5b6068')
  }
  return c
}

// ---------------------------------------------------------------------------------------------- Plaza Mayor
function plazaMayor() {
  const [c, ctx] = lienzo(176, 88)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  const crema = '#ecdcb0', cremaL = '#f6ebcd', cremaS = '#cbb683'
  // alas laterales
  tejado(ctx, 0, 18, 176, 10, '#a84a30')
  p(0, 30, 176, 58, crema); p(0, 30, 176, 2, cremaS)
  // cuerpo central más alto con reloj
  tejado(ctx, 62, 2, 52, 8, '#a84a30')
  p(62, 12, 52, 20, crema); p(62, 12, 2, 20, cremaL); p(111, 12, 3, 20, cremaS)
  p(84, 14, 8, 8, '#f4f4f0'); p(83, 15, 10, 6, '#f4f4f0'); p(84, 14, 8, 1, NEGRO); p(84, 21, 8, 1, NEGRO); p(83, 15, 1, 6, NEGRO); p(92, 15, 1, 6, NEGRO)
  p(87, 15, 1, 3, NEGRO); p(88, 18, 2, 1, NEGRO)
  for (const x of [68, 100]) { p(x, 16, 6, 10, '#2a3440'); p(x, 16, 6, 1, cremaS) }
  // primera planta: ventanas con balcón de hierro
  for (let x = 6; x < 172; x += 16) {
    p(x, 36, 8, 14, '#f4f1ea'); p(x + 1, 37, 6, 12, '#2a3440'); p(x + 1, 37, 6, 3, '#3d4c5c'); p(x + 4, 37, 1, 12, '#f4f1ea')
    p(x - 2, 50, 12, 1, '#bfb5a0'); p(x - 2, 46, 12, 1, NEGRO)
    for (let b = x - 2; b < x + 10; b += 2) p(b, 47, 1, 3, NEGRO)
  }
  // banderas en el balcón central: España, Europa y Castilla y León
  for (const [x, colores] of [[78, ['#c8202a', '#f2c200', '#c8202a']], [86, ['#1f3c9a']], [94, ['#7a1f4a']]]) {
    p(x, 26, 1, 14, '#d6dce3')
    if (colores.length === 3) { p(x + 1, 27, 6, 2, colores[0]); p(x + 1, 29, 6, 2, colores[1]); p(x + 1, 31, 6, 2, colores[2]) }
    else { p(x + 1, 27, 6, 6, colores[0]); if (colores[0] === '#1f3c9a') { p(x + 3, 28, 1, 1, '#f2c200'); p(x + 5, 30, 1, 1, '#f2c200'); p(x + 2, 31, 1, 1, '#f2c200') } }
  }
  // cornisa
  p(0, 55, 176, 1, cremaL); p(0, 56, 176, 2, cremaS)
  // soportales: arcos de medio punto sobre pilares
  for (let x = 0; x < 176; x += 16) {
    const ox = x + 4
    p(ox, 64, 12, 24, '#6b5843'); p(ox + 1, 62, 10, 2, '#6b5843'); p(ox + 3, 61, 6, 1, '#6b5843')
    p(ox, 64, 12, 6, '#4a3c2e'); p(ox + 1, 62, 10, 2, '#4a3c2e'); p(ox, 84, 12, 4, '#8a7a62')
    p(ox + 3, 60, 6, 1, cremaS); p(ox + 1, 61, 2, 1, cremaS); p(ox + 9, 61, 2, 1, cremaS)
    p(x, 58, 4, 30, crema); p(x, 58, 1, 30, cremaL); p(x + 3, 58, 1, 30, cremaS)
  }
  p(0, 86, 176, 2, '#b9ae96')
  return c
}

// ---------------------------------------------------------------------------------------------- IES Tierra de Campos
function instituto() {
  const [c, ctx] = lienzo(128, 72)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  const crema = '#e9dec0', ladrillo = '#b5543a'
  p(0, 4, 128, 6, '#d6cba9'); p(0, 4, 128, 1, NEGRO); p(0, 9, 128, 1, '#b8ad8c')
  p(0, 10, 128, 34, crema); p(0, 10, 2, 34, aclarar(crema, 0.3)); p(125, 10, 3, 34, oscurecer(crema, 0.9))
  p(0, 44, 128, 28, ladrillo)
  for (let y = 46; y < 71; y += 3) for (let x = (y % 6 ? 1 : 4); x < 128; x += 6) p(x, y, 4, 1, oscurecer(ladrillo, 0.82))
  p(0, 44, 128, 1, '#8a3b2b')
  // cuerpo central algo adelantado
  p(48, 8, 32, 37, aclarar(crema, 0.15)); p(48, 8, 32, 1, NEGRO); p(48, 8, 1, 37, '#c8bd9c'); p(79, 8, 1, 37, '#b8ad8c')
  for (const x of [58, 68]) { p(x, 14, 3, 5, '#f4f4f0'); p(x - 1, 15, 5, 3, '#f4f4f0'); p(x, 15, 3, 3, '#8fb0c8'); p(x, 15, 1, 1, '#cfe0ec') }
  const ventanita = (x, y) => {
    p(x, y, 11, 9, '#f4f4f0'); p(x + 1, y + 1, 9, 7, '#8fb0c8'); p(x + 1, y + 1, 9, 3, '#e8e4da'); p(x + 5, y + 1, 1, 7, '#f4f4f0')
  }
  for (let x = 4; x < 124; x += 14) {
    if (x > 40 && x < 82) continue
    ventanita(x, 13); ventanita(x, 31); ventanita(x, 52)
  }
  // nombre del instituto
  p(2, 24, 124, 5, crema)
  textoCentrado(ctx, 'IES TIERRA DE CAMPOS', 64, 24, '#5a4a3a')
  ventanita(52, 31); ventanita(65, 31)
  // entrada con marquesina, columnas y escalones
  p(46, 46, 36, 3, '#efe7cf'); p(46, 49, 36, 1, '#8a7a5a')
  p(51, 50, 3, 18, '#f4f4f0'); p(74, 50, 3, 18, '#f4f4f0'); p(53, 50, 1, 18, '#cfc9bc'); p(76, 50, 1, 18, '#cfc9bc')
  p(56, 51, 16, 17, '#3a2f28'); p(57, 52, 7, 15, '#33475e'); p(65, 52, 6, 15, '#33475e'); p(58, 53, 2, 4, '#7f9fbf')
  p(48, 68, 32, 2, '#c4c4c4'); p(46, 70, 36, 2, '#a3a3a3')
  return c
}

// ---------------------------------------------------------------------------------------------- MEDAC Albalá
function medac() {
  const [c, ctx] = lienzo(112, 88)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  const panel = '#c9ced4', azul = '#1d3d7a'
  p(0, 0, 112, 4, '#9aa1aa'); p(0, 0, 112, 1, NEGRO)
  p(0, 4, 112, 84, panel); p(0, 4, 2, 84, '#dde1e6'); p(109, 4, 3, 84, '#a9afb7')
  for (let i = 0; i < 5; i++) {
    const y = 8 + i * 13
    p(4, y, 104, 7, '#2f3a48'); p(4, y, 104, 1, '#1d242d')
    for (let x = 4; x < 108; x += 7) { p(x, y, 1, 7, '#1d242d'); if ((x + i) % 3 === 0) p(x + 2, y + 2, 2, 1, '#5d7590') }
    p(4, y + 8, 104, 1, '#dde1e6'); p(4, y + 11, 104, 1, '#a9afb7')
  }
  // pancarta vertical azul con el nombre
  p(10, 6, 13, 72, azul); p(10, 6, 1, 72, '#2f57a3'); p(22, 6, 1, 72, '#142c5a')
  ;['M', 'E', 'D', 'A', 'C'].forEach((l, i) => textoCentrado(ctx, l, 16 + (l === 'M' ? 1 : 0), 10 + i * 8, '#ffffff'))
  p(13, 56, 7, 1, '#ffffff'); p(13, 60, 7, 1, '#7fa8e0'); p(13, 64, 5, 1, '#ffffff')
  // logotipo en la fachada
  p(56, 16, 52, 7, panel)
  p(60, 17, 4, 5, azul); p(61, 18, 2, 1, '#ffffff')
  texto(ctx, 'MEDAC', 67, 17, azul)
  // entrada
  p(34, 74, 52, 14, '#2a323c'); p(34, 74, 52, 1, NEGRO)
  for (let x = 36; x < 86; x += 10) { p(x, 76, 8, 12, '#3d4c5c'); p(x + 1, 77, 2, 4, '#6f8aa6') }
  p(90, 74, 7, 12, azul); p(92, 78, 3, 1, '#ffffff'); p(92, 78, 1, 2, '#ffffff')
  return c
}

// ---------------------------------------------------------------------------------------------- UDIT
function udit() {
  // Cuerpo central con el letrero y dos alas más bajas a los lados: más alargada, sin la terraza
  const [c, ctx] = lienzo(208, 88)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  const blanco = '#eef1f4'
  const cristal = (x0, y0, w, h) => {
    for (let y = y0; y < y0 + h; y += 9) {
      for (let x = x0; x < x0 + w; x += 8) {
        p(x, y, 7, 8, ((x + y) / 8) % 2 < 1 ? '#9fc4dd' : '#8db6d3')
        if ((x * 7 + y) % 5 === 0) p(x + 1, y + 1, 2, 1, '#d6ecfa')
      }
      p(x0, y + 8, w, 1, '#2b2f38')
    }
    for (let x = x0 - 1; x < x0 + w; x += 8) p(x, y0, 1, h, '#2b2f38')
    p(x0 - 1, y0 - 1, w + 1, 1, '#2b2f38')
  }
  const plantaBaja = (x0, w) => {
    p(x0, 72, w, 14, '#3d4c5c'); p(x0, 72, w, 1, '#15171c')
    for (let x = x0 + 2; x < x0 + w - 8; x += 10) { p(x, 74, 8, 12, '#5c7389'); p(x + 1, 75, 2, 4, '#9fc4dd') }
  }
  for (const x0 of [0, 168]) {
    p(x0, 16, 40, 72, NEGRO); p(x0 + 1, 17, 38, 71, blanco); p(x0 + 1, 17, 38, 3, '#cfd5db')
    cristal(x0 + 5, 24, 30, 45)
    plantaBaja(x0 + 3, 34)
  }
  p(40, 0, 128, 4, '#cfd5db'); p(40, 0, 128, 1, NEGRO)
  p(40, 4, 128, 84, blanco); p(40, 4, 2, 84, '#ffffff'); p(165, 4, 3, 84, '#c9d0d7')
  textoGrande(ctx, 'UDIT', 104, 5, '#15171c', 2)
  cristal(46, 18, 116, 52)
  p(100, 14, 5, 74, '#15171c') // aleta negra
  plantaBaja(44, 120)
  p(106, 72, 16, 16, '#15171c'); p(108, 74, 12, 14, '#33475e'); p(113, 74, 1, 14, '#15171c')
  p(0, 86, 208, 2, '#9aa3ad')
  return c
}

// ---------------------------------------------------------------------------------------------- farola fernandina
function farola() {
  const [c, ctx] = lienzo(12, 40)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(5, 0, 2, 2, NEGRO); p(1, 2, 10, 2, NEGRO)
  p(2, 4, 8, 8, NEGRO); p(3, 5, 6, 6, '#ffe58a'); p(3, 5, 2, 6, '#fff3c4'); p(5, 5, 1, 6, NEGRO)
  p(3, 12, 6, 2, NEGRO); p(5, 14, 2, 22, '#22252c'); p(5, 14, 1, 22, '#4a4f5a'); p(4, 22, 4, 2, '#22252c')
  p(3, 36, 6, 4, NEGRO); p(4, 36, 1, 4, '#4a4f5a')
  return c
}

// ---------------------------------------------------------------------------------------------- muralla junto a la puerta
function muralla() {
  const [c, ctx] = lienzo(48, 40)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  const base = '#cfa565', luz = '#e8c587', sombra = '#a77f45'
  p(0, 10, 48, 30, base); p(0, 10, 48, 1, luz); p(0, 36, 48, 4, oscurecer(base, 0.82))
  for (let y = 12; y < 36; y += 6) { p(0, y, 48, 1, 'rgba(70,45,15,0.3)'); for (let x = (y / 6) % 2 ? 4 : 0; x < 48; x += 9) p(x, y, 1, 6, 'rgba(70,45,15,0.28)') }
  for (let x = 1; x < 48; x += 8) { p(x, 2, 5, 8, base); p(x, 2, 5, 1, luz); p(x + 4, 3, 1, 7, sombra) }
  p(20, 18, 2, 8, '#2b2119')
  return c
}

// ---------------------------------------------------------------------------------------------- casas de la plaza
// Dos plantas con balcones y soportales abajo, como las de la Plaza Mayor de Villalpando
function casaPlaza(pared) {
  return () => {
    const [c, ctx] = lienzo(48, 64)
    const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
    tejado(ctx, 0, 4, 48, 10, '#a84a30')
    p(0, 16, 48, 48, pared); p(0, 16, 48, 2, oscurecer(pared, 0.8)); p(0, 18, 2, 46, aclarar(pared, 0.2)); p(45, 18, 3, 46, oscurecer(pared, 0.88))
    for (const x of [7, 29]) {
      p(x, 22, 12, 16, '#f4f1ea'); p(x + 1, 23, 10, 14, '#2a3440'); p(x + 1, 23, 10, 4, '#3d4c5c'); p(x + 6, 23, 1, 14, '#f4f1ea')
      p(x - 2, 38, 16, 1, '#bfb5a0'); p(x - 2, 34, 16, 1, NEGRO)
      for (let b = x - 2; b < x + 14; b += 2) p(b, 35, 1, 3, NEGRO)
      p(x + 1, 33, 3, 1, '#e05a5a'); p(x + 8, 33, 3, 1, '#f6e05e')
    }
    p(0, 41, 48, 1, aclarar(pared, 0.3)); p(0, 42, 48, 1, oscurecer(pared, 0.78))
    for (const x of [0, 24]) {
      const ox = x + 4
      p(ox, 48, 16, 16, '#6b5843'); p(ox + 1, 46, 14, 2, '#6b5843'); p(ox + 3, 45, 10, 1, '#6b5843')
      p(ox, 48, 16, 5, '#4a3c2e'); p(ox + 1, 46, 14, 2, '#4a3c2e'); p(ox, 60, 16, 4, '#8a7a62')
      p(ox + 6, 50, 4, 10, '#7a5232'); p(ox + 9, 55, 1, 1, '#f2c200')
      p(x, 43, 4, 21, pared); p(x, 43, 1, 21, aclarar(pared, 0.25)); p(x + 3, 43, 1, 21, oscurecer(pared, 0.82))
    }
    p(44, 43, 4, 21, pared); p(47, 43, 1, 21, oscurecer(pared, 0.82))
    return c
  }
}

// ---------------------------------------------------------------------------------------------- mobiliario urbano
function banco() {
  const [c, ctx] = lienzo(24, 14)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(1, 0, 22, 5, NEGRO); p(2, 1, 20, 1, '#b07a44'); p(2, 3, 20, 1, '#b07a44')
  p(0, 6, 24, 4, NEGRO); p(1, 7, 22, 2, '#c58a50'); p(1, 7, 22, 1, '#dba56a')
  p(2, 10, 2, 4, NEGRO); p(20, 10, 2, 4, NEGRO)
  return c
}

function papelera() {
  const [c, ctx] = lienzo(8, 12)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(0, 0, 8, 12, NEGRO); p(1, 1, 6, 10, '#2f7d4a'); p(1, 1, 6, 1, '#4fa56a'); p(2, 3, 1, 7, '#3c9a5a'); p(1, 1, 6, 2, '#22252c')
  return c
}

function macetero() {
  const [c, ctx] = lienzo(16, 20)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(1, 11, 14, 9, NEGRO); p(2, 12, 12, 7, '#d6d0c2'); p(2, 12, 12, 1, '#ece7db'); p(2, 17, 12, 2, '#b3ac9d')
  p(1, 2, 14, 10, '#2a7535'); p(2, 1, 12, 10, '#3c9a47'); p(3, 0, 10, 2, '#3c9a47'); p(4, 2, 4, 3, '#5cbf5f')
  for (const [x, y, col] of [[4, 5, '#e05a5a'], [9, 3, '#f6e05e'], [11, 7, '#ff8fb0'], [6, 8, '#ffffff']]) p(x, y, 2, 2, col)
  return c
}

function puesto() {
  const [c, ctx] = lienzo(40, 36)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  for (let x = 0; x < 40; x += 5) { p(x, 2, 5, 7, (x / 5) % 2 ? '#ffffff' : '#d9352a'); p(x + 1, 9, 3, 1, (x / 5) % 2 ? '#ffffff' : '#d9352a') }
  p(0, 1, 40, 1, NEGRO)
  p(2, 10, 2, 22, '#6b4a2b'); p(36, 10, 2, 22, '#6b4a2b')
  p(0, 22, 40, 10, '#8a5a32'); p(0, 22, 40, 2, '#b07a44'); p(0, 32, 40, 1, NEGRO)
  for (let x = 3; x < 37; x += 4) { const col = ['#e05a5a', '#f2b33d', '#5b2a6e', '#7ad37a', '#f6e05e'][((x - 3) / 4) % 5]; p(x, 19, 3, 3, col); p(x, 19, 1, 1, '#ffffff') }
  return c
}

function coche(color) {
  return () => {
    const [c, ctx] = lienzo(40, 24)
    const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
    p(3, 21, 34, 3, 'rgba(0,0,0,0.2)')
    p(1, 9, 38, 11, NEGRO); p(2, 10, 36, 9, color); p(2, 10, 36, 2, aclarar(color, 0.25)); p(2, 16, 36, 3, oscurecer(color, 0.8))
    p(8, 2, 22, 8, NEGRO); p(9, 3, 20, 7, color); p(10, 4, 8, 5, '#33476b'); p(20, 4, 8, 5, '#33476b'); p(11, 5, 2, 2, '#7f9fcf')
    p(37, 12, 2, 2, '#ffe58a'); p(1, 12, 2, 2, '#e05a5a'); p(19, 11, 1, 6, oscurecer(color, 0.7))
    for (const cx of [9, 30]) { p(cx - 3, 16, 7, 7, NEGRO); p(cx - 1, 18, 3, 3, '#9aa3ad') }
    return c
  }
}

function farolaModerna() {
  const [c, ctx] = lienzo(12, 40)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(5, 4, 2, 34, '#5b6068'); p(5, 4, 1, 34, '#8a919a'); p(5, 2, 7, 2, '#5b6068'); p(8, 4, 4, 2, '#e9ecef'); p(8, 6, 4, 1, '#fff3c4')
  p(3, 37, 6, 3, '#3a3f48')
  return c
}

function aparcabicis() {
  const [c, ctx] = lienzo(32, 18)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  const rueda = (x, y, col) => { p(x + 1, y, 4, 1, col); p(x, y + 1, 1, 4, col); p(x + 5, y + 1, 1, 4, col); p(x + 1, y + 5, 4, 1, col) }
  for (const [x, col] of [[2, '#e05a5a'], [17, '#3d7be0']]) {
    rueda(x, 10, NEGRO); rueda(x + 7, 10, NEGRO)
    p(x + 3, 9, 8, 1, col); p(x + 5, 6, 1, 4, col); p(x + 4, 5, 3, 1, NEGRO); p(x + 10, 6, 1, 4, col); p(x + 9, 5, 3, 1, '#9aa3ad')
  }
  p(0, 16, 32, 2, '#9aa3ad')
  return c
}

function arbusto() {
  const [c, ctx] = lienzo(16, 12)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(1, 4, 14, 8, '#1b2a1e'); p(3, 2, 10, 2, '#1b2a1e'); p(2, 4, 12, 7, '#2a7535'); p(3, 3, 10, 6, '#3c9a47'); p(4, 3, 4, 2, '#5cbf5f')
  p(10, 6, 1, 1, '#f6e05e'); p(5, 7, 1, 1, '#ff8fb0')
  return c
}

// ---------------------------------------------------------------------------------------------- guiños a sus favoritos
// Son homenajes con formas sencillas (una casa-piña, un murciélago, una telaraña), no copias de los personajes.
// Casa con forma de piña junto al agua: guiño a Bob Esponja (Alejandro hizo un juego suyo en Unity)
function casaPina() {
  const [c, ctx] = lienzo(32, 44)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  // hojas
  for (const [x, y, w, h] of [[14, 0, 4, 10], [9, 3, 4, 9], [19, 3, 4, 9], [5, 7, 4, 7], [23, 7, 4, 7]]) { p(x, y, w, h, '#2f8a3a'); p(x, y, 1, h, '#5cbf5f') }
  // cuerpo de la piña
  p(5, 13, 22, 31, '#1b1f27'); p(6, 14, 20, 29, '#f2a71b'); p(4, 18, 24, 22, '#1b1f27'); p(5, 19, 22, 20, '#f2a71b')
  for (let y = 16; y < 42; y += 4) for (let x = 6 + ((y / 4) % 2) * 2; x < 26; x += 4) { p(x, y, 2, 1, '#c7801a'); p(x + 1, y + 1, 1, 1, '#c7801a') }
  p(6, 14, 3, 26, '#f7c35a')
  // puerta y ventanas redondas
  p(12, 32, 8, 12, '#1b1f27'); p(13, 33, 6, 11, '#7f8fa6'); p(13, 33, 6, 1, '#a9b6c8')
  for (const [x, y] of [[8, 22], [20, 20]]) { p(x, y, 5, 5, '#1b1f27'); p(x + 1, y + 1, 3, 3, '#7fc8ff'); p(x + 1, y + 1, 1, 1, '#d6ecfa') }
  return c
}

// Veleta con un murciélago encima: guiño a Batman (la W de DANTE P.W. es de Bruce Wayne)
function veleta() {
  const [c, ctx] = lienzo(20, 40)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(9, 10, 2, 28, '#3a3f48'); p(9, 10, 1, 28, '#6a717c'); p(6, 37, 8, 3, '#2b2f38')
  // murciélago
  const negro = '#15171c'
  p(8, 2, 4, 5, negro); p(7, 1, 1, 2, negro); p(12, 1, 1, 2, negro)
  p(2, 3, 6, 3, negro); p(12, 3, 6, 3, negro); p(0, 2, 2, 3, negro); p(18, 2, 2, 3, negro)
  p(3, 6, 2, 1, negro); p(15, 6, 2, 1, negro); p(6, 6, 2, 1, negro); p(12, 6, 2, 1, negro)
  p(9, 4, 1, 1, '#f2c200'); p(10, 4, 1, 1, '#f2c200')
  return c
}

// Telaraña en una esquina y una mochila roja y azul: guiño a Spider-Man (la P de DANTE P.W. es de Peter Parker)
function telarana() {
  const [c, ctx] = lienzo(24, 24)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  const hilo = 'rgba(240,244,248,0.85)'
  for (let i = 0; i < 24; i++) { p(i, 0, 1, 1, hilo); p(0, i, 1, 1, hilo); p(i, i, 1, 1, hilo); if (i < 12) { p(i * 2, i, 1, 1, hilo); p(i, i * 2, 1, 1, hilo) } }
  for (const r of [6, 12, 18]) for (let a = 0; a <= 90; a += 6) { const rad = (a * Math.PI) / 180; p(Math.round(Math.cos(rad) * r), Math.round(Math.sin(rad) * r), 1, 1, hilo) }
  p(13, 15, 3, 3, '#15171c'); p(12, 14, 1, 1, '#15171c'); p(16, 14, 1, 1, '#15171c'); p(12, 18, 1, 1, '#15171c'); p(16, 18, 1, 1, '#15171c')
  return c
}

function mochilaArana() {
  const [c, ctx] = lienzo(14, 16)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(1, 2, 12, 14, '#1b1f27'); p(2, 3, 10, 12, '#d6302a'); p(2, 10, 10, 5, '#2a4fb0'); p(4, 0, 6, 3, '#1b1f27'); p(5, 1, 4, 1, '#d6302a')
  for (const x of [4, 7, 10]) p(x, 3, 1, 7, '#a32420')
  p(3, 6, 8, 1, '#a32420'); p(6, 6, 2, 2, '#15171c')
  return c
}

// Casa-roca con una veleta (guiño a la casa de Patricio)
function casaRoca() {
  const [c, ctx] = lienzo(40, 30)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(19, 0, 1, 9, '#5b6068'); p(15, 2, 9, 1, '#5b6068'); p(14, 1, 2, 3, '#8a919a'); p(23, 1, 2, 3, '#8a919a')
  const filas = [[14, 26], [10, 30], [7, 33], [5, 35], [3, 37], [2, 38], [1, 39], [1, 39], [0, 40], [0, 40], [0, 40], [0, 40], [0, 40], [0, 40], [0, 40], [0, 40], [0, 40], [0, 40], [0, 40], [0, 40]]
  filas.forEach(([a, b], i) => {
    const y = 9 + i
    p(a, y, b - a, 1, '#1b1f27'); if (b - a > 2) p(a + 1, y, b - a - 2, 1, '#9a6a44')
    if (i > 1 && b - a > 6) { p(a + 2, y, 4, 1, '#b8875c'); p(b - 6, y, 4, 1, '#7a5034') }
  })
  p(9, 13, 6, 3, '#b8875c'); p(26, 20, 5, 2, '#7a5034'); p(14, 22, 3, 2, '#7a5034')
  p(0, 28, 40, 2, 'rgba(0,0,0,0.18)')
  return c
}

// Casa con forma de cabeza de piedra (guiño a la casa de Calamardo)
function casaCabeza() {
  const [c, ctx] = lienzo(30, 46)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  const piedra = '#7f90a6', luz = '#a3b2c4', sombra = '#5e6d82'
  p(5, 0, 20, 46, '#1b1f27'); p(4, 3, 22, 43, '#1b1f27'); p(6, 1, 18, 44, piedra); p(5, 4, 20, 41, piedra)
  p(5, 4, 3, 41, luz); p(22, 4, 3, 41, sombra)
  p(1, 14, 4, 12, '#1b1f27'); p(2, 15, 3, 10, piedra); p(25, 14, 4, 12, '#1b1f27'); p(25, 15, 3, 10, sombra) // orejas
  p(6, 11, 18, 2, sombra) // ceja
  for (const x of [8, 17]) { p(x, 14, 6, 6, '#1b1f27'); p(x + 1, 15, 4, 4, '#7fc8ff'); p(x + 1, 15, 1, 1, '#d6ecfa') }
  p(13, 14, 4, 16, sombra); p(14, 14, 2, 15, luz) // nariz larga
  p(11, 34, 8, 12, '#1b1f27'); p(12, 35, 6, 11, '#6b4a2b'); p(16, 40, 1, 1, '#f2c200')
  return c
}

function palmera() {
  const [c, ctx] = lienzo(28, 44)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(6, 42, 16, 2, 'rgba(0,0,0,0.18)')
  for (let y = 12; y < 43; y++) { const x = 12 + Math.round(Math.sin(y / 9) * 2); p(x, y, 4, 1, (y % 4 < 2) ? '#9a6a3a' : '#7a5232'); p(x - 1, y, 1, 1, '#1b1f27'); p(x + 4, y, 1, 1, '#1b1f27') }
  const hoja = (pts) => pts.forEach(([x, y]) => { p(x, y, 3, 2, '#2f8a3a'); p(x, y, 3, 1, '#5cbf5f') })
  hoja([[13, 10], [10, 9], [7, 9], [4, 10], [2, 12], [1, 14]])
  hoja([[14, 10], [17, 9], [20, 9], [23, 10], [25, 12], [26, 14]])
  hoja([[13, 9], [12, 6], [11, 3], [9, 1]]); hoja([[14, 9], [16, 6], [18, 4], [20, 3]])
  hoja([[12, 11], [9, 13], [7, 16]]); hoja([[15, 11], [18, 13], [20, 16]])
  p(12, 10, 4, 3, '#6b4a2b'); p(12, 12, 2, 2, '#4a3220')
  return c
}

function quiosco() {
  const [c, ctx] = lienzo(32, 34)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(1, 0, 30, 6, '#1b1f27'); p(2, 1, 28, 4, '#2f7d4a'); p(2, 1, 28, 1, '#4fa56a')
  p(3, 6, 26, 26, '#1b1f27'); p(4, 6, 24, 26, '#3c9a5a'); p(4, 6, 2, 26, '#4fa56a')
  p(6, 9, 20, 10, '#f4f1ea')
  for (let x = 7; x < 25; x += 4) { p(x, 10, 3, 4, ['#e05a5a', '#3d7be0', '#f2b33d', '#a970ff', '#2fbf71'][((x - 7) / 4) % 5]); p(x, 15, 3, 3, '#cfd5db') }
  p(6, 21, 20, 2, '#2b2f38'); p(8, 24, 16, 8, '#2f6f45'); p(0, 32, 32, 2, 'rgba(0,0,0,0.18)')
  return c
}

// ---------------------------------------------------------------------------------------------- laguna, medusas y muelle
// Laguna de 80 × 64 con forma redondeada: arena mojada, espuma, agua somera y agua profunda.
// Se dibujan tres fotogramas con las olas desplazadas para animarla.
function laguna(fotograma) {
  return () => {
    const [c, ctx] = lienzo(80, 64)
    const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
    const cx = 40, cy = 32
    const dentro = (x, y, rx, ry) => Math.pow(Math.abs(x - cx) / rx, 2.4) + Math.pow(Math.abs(y - cy) / ry, 2.4) <= 1
    for (let y = 0; y < 64; y++) for (let x = 0; x < 80; x++) {
      // un poco de irregularidad en la orilla
      const ondula = Math.sin(x / 5) * 1.2 + Math.cos(y / 4) * 1.2
      if (dentro(x, y, 30 + ondula * 0.6, 24 + ondula * 0.5)) p(x, y, 1, 1, '#2f6fd0')
      else if (dentro(x, y, 35 + ondula * 0.6, 28 + ondula * 0.5)) p(x, y, 1, 1, '#4a8fe8')
      else if (dentro(x, y, 37 + ondula * 0.6, 30 + ondula * 0.5)) p(x, y, 1, 1, '#e8f4ff')
      else if (dentro(x, y, 39.5 + ondula * 0.6, 31.8 + ondula * 0.5)) p(x, y, 1, 1, '#d2bd86')
    }
    // fondo con arena clara en la parte somera y olas que se mueven en cada fotograma
    const desfase = fotograma * 3
    for (let y = 10; y < 56; y += 7) for (let x = 10 + ((y / 7) % 2) * 6; x < 70; x += 13) {
      const xx = x + desfase
      if (dentro(xx, y, 28, 22)) { p(xx, y, 4, 1, '#7fb6f5'); p(xx + 1, y - 1, 2, 1, '#cfe3ff') }
    }
    p(30, 22, 3, 1, '#9fc8ff'); p(48, 38, 2, 1, '#9fc8ff')
    return c
  }
}

function medusa() {
  const [c, ctx] = lienzo(10, 12)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(2, 0, 6, 1, '#ff8fc8'); p(1, 1, 8, 3, '#ff8fc8'); p(0, 3, 10, 2, '#ff8fc8')
  p(2, 1, 3, 1, '#ffd1e8'); p(3, 2, 1, 1, '#ffffff'); p(6, 2, 2, 1, '#e25aa0'); p(2, 4, 2, 1, '#e25aa0'); p(7, 4, 1, 1, '#e25aa0')
  for (const x of [1, 3, 6, 8]) { p(x, 5, 1, 3, 'rgba(255,143,200,0.85)'); p(x + (x % 2 ? 1 : -1), 8, 1, 3, 'rgba(255,143,200,0.6)') }
  return c
}

// Muelle de tablones con postes, que entra en el agua desde la orilla de la derecha
function muelle() {
  const [c, ctx] = lienzo(40, 16)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  for (const x of [1, 13, 25]) { p(x, 9, 3, 7, '#4a3220'); p(x, 14, 3, 2, 'rgba(20,40,80,0.35)') }
  p(0, 2, 40, 9, '#1b1f27')
  for (let x = 1; x < 39; x += 4) { p(x, 3, 3, 7, '#b07a44'); p(x, 3, 3, 1, '#d29a5e'); p(x, 9, 3, 1, '#8a5a32') }
  p(0, 0, 2, 4, '#4a3220'); p(0, 0, 2, 1, '#6b4a2b')
  return c
}

// Banderas de España y Colombia (la madre de Alejandro es colombiana). Dos fotogramas para que ondeen.
function banderas(fotograma) {
  return () => {
    const [c, ctx] = lienzo(40, 34)
    const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
    const bandera = (x0, franjas) => {
      p(x0, 2, 1, 30, '#cfd5db'); p(x0 + 1, 2, 1, 30, '#8a919a'); p(x0, 0, 2, 2, '#f2c200'); p(x0 - 1, 31, 4, 3, '#5b6068')
      for (let x = 0; x < 15; x++) {
        const onda = Math.round(Math.sin((x + fotograma * 3) / 2.4) * 1.2)
        let y = 3 + onda
        for (const [alto, color] of franjas) { p(x0 + 2 + x, y, 1, alto, onda > 0 ? oscurecer(color, 0.86) : color); y += alto }
        p(x0 + 2 + x, y, 1, 1, 'rgba(0,0,0,0.15)')
      }
    }
    bandera(1, [[3, '#c8202a'], [6, '#f2c200'], [3, '#c8202a']]) // España
    bandera(20, [[6, '#f6d01a'], [3, '#1f3c9a'], [3, '#c8202a']]) // Colombia
    return c
  }
}

// Avión del Erasmus a Tallin visto desde arriba, aparcado: se dibuja por capas sobre una rejilla (alas, timones,
// motores, fuselaje) y cada capa lleva su contorno, así quedan separadas. Aletas azules, la bandera de Estonia
// junto a la cola, la sombra desplazada y la escalerilla bajada en la puerta. El morro mira a la derecha.
export const AVION = { ancho: 128, alto: 84, eje: 40 }
function avion() {
  const { ancho: W, alto: H, eje: cy } = AVION
  const [c, ctx] = lienzo(W, H)
  const rej = Array.from({ length: H }, () => Array(W).fill(null))
  const dentro = (x, y) => x >= 0 && y >= 0 && x < W && y < H
  // pinta una capa: primero su contorno (lo que la rodea) y después ella, con el color que diga pinta(x, y)
  const capa = (forma, pinta) => {
    const m = new Set()
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (forma(x, y)) m.add(y * W + x)
    for (const k of m) {
      const x = k % W, y = (k - x) / W
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (dentro(x + dx, y + dy) && !m.has((y + dy) * W + x + dx)) rej[y + dy][x + dx] = '#1b1f27'
    }
    for (const k of m) { const x = k % W, y = (k - x) / W; rej[y][x] = pinta(x, y) }
  }
  // media altura del fuselaje: cola afilada, cuerpo recto y morro redondo
  const media = (x) => x < 8 || x > 121 ? 0 : x < 24 ? 2 + (6 * (x - 8)) / 16 : x <= 104 ? 8 : 8 * Math.sqrt(Math.max(0, 1 - ((x - 104) / 18) ** 2))
  const fuselaje = (x, y) => Math.abs(y + 0.5 - cy) < media(x)
  // ala en flecha: cada fila hacia la punta va más atrás y es más estrecha
  const ala = (x, y) => {
    const t = Math.abs(y + 0.5 - cy) - 8
    if (t < 0 || t > 26) return false
    const borde = 84 - t, cuerda = 22 - t * 0.55
    return x <= borde && x >= borde - cuerda
  }
  const timon = (x, y) => {
    const t = Math.abs(y + 0.5 - cy) - 5
    if (t < 0 || t > 13) return false
    const borde = 25 - t * 0.7, cuerda = 12 - t * 0.45
    return x <= borde && x >= borde - cuerda
  }
  const motor = (x, y) => [cy - 18, cy + 17].some((my) => {
    const dx = (x + 0.5 - 69) / 9, dy = (y + 0.5 - my - 0.5) / 3.6
    return dx * dx * (dx > 0 ? 0.6 : 1) + dy * dy <= 1
  })
  // sombra: la silueta entera corrida hacia abajo y a la derecha
  const silueta = (x, y) => fuselaje(x, y) || ala(x, y) || timon(x, y)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (silueta(x - 5, y - 8)) px(ctx, x, y, 'rgba(0,0,0,0.2)')
  capa(ala, (x, y) => {
    const t = Math.abs(y + 0.5 - cy) - 8, borde = 84 - t
    if (t >= 24) return '#0072ce' // aleta azul en la punta
    if (x >= borde - 1) return '#f4f6f8' // borde de ataque
    if (x <= borde - (22 - t * 0.55) + 2) return '#aab3bd' // flaps
    return t > 4 && (x + y) % 9 === 0 ? '#c3cbd4' : '#d3d9e0'
  })
  capa(timon, (x, y) => (Math.abs(y + 0.5 - cy) - 5 >= 11 ? '#0072ce' : x >= 25 - (Math.abs(y + 0.5 - cy) - 5) * 0.7 - 1 ? '#f4f6f8' : '#d3d9e0'))
  capa(motor, (x, y) => {
    const my = y < cy ? cy - 18 : cy + 17
    if (x >= 77) return '#2b2f38' // toma de aire
    if (x >= 75) return '#eef1f4'
    return y < my ? '#b9c0c8' : y > my + 1 ? '#6a717c' : '#8a929c'
  })
  capa(fuselaje, (x, y) => {
    const dy = y - cy
    if (x >= 114 && x <= 117 && Math.abs(dy + 0.5) < 5 && dy !== -1 && dy !== 0) return x === 114 ? '#6fa0d8' : '#33476b' // parabrisas de la cabina
    if (dy <= -6) return '#ffffff'
    if (dy >= 5) return '#cfd6de'
    if (dy === 2) return '#0072ce' // franja azul
    if (dy === 3) return '#15171c'
    return '#f4f6f8'
  })
  // ventanillas a los dos lados, la bandera de Estonia (azul, negro y blanco) y la puerta
  const r = (x, y, w, h, col) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (dentro(x + i, y + j)) rej[y + j][x + i] = col }
  for (let x = 30; x < 102; x += 4) { r(x, cy - 5, 2, 2, '#4a6a9a'); r(x, cy + 4, 2, 1, '#4a6a9a') }
  r(30, cy - 5, 9, 2, '#0072ce'); r(30, cy - 3, 9, 2, '#15171c'); r(30, cy - 1, 9, 2, '#ffffff'); r(29, cy - 6, 11, 1, '#1b1f27'); r(29, cy + 1, 11, 1, '#1b1f27'); r(29, cy - 6, 1, 8, '#1b1f27'); r(39, cy - 6, 1, 8, '#1b1f27')
  r(98, cy + 4, 5, 4, '#9aa3ad'); r(98, cy + 7, 5, 1, '#1b1f27')
  // deriva vista desde arriba: una línea fina sobre la cola
  r(6, cy - 1, 18, 2, '#1b1f27'); r(7, cy - 1, 16, 1, '#0072ce')
  // escalerilla amarilla bajando de la puerta
  r(97, cy + 8, 7, 15, '#1b1f27'); r(98, cy + 8, 5, 14, '#f2c200')
  for (let y = cy + 10; y < cy + 22; y += 2) r(98, y, 5, 1, '#8a6d00')
  r(96, cy + 21, 9, 2, '#1b1f27')
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (rej[y][x]) px(ctx, x, y, rej[y][x])
  return c
}

function paloma() {
  const [c, ctx] = lienzo(16, 8)
  for (let f = 0; f < 2; f++) {
    const o = f * 8, p = (x, y, w, h, col) => px(ctx, o + x, y, col, w, h)
    const pico = f ? 4 : 3
    p(1, 3, 5, 3, '#8a919a'); p(2, 2, 3, 1, '#a9b0b8'); p(4, pico - 2, 2, 2, '#6a717c'); p(6, pico - 1, 1, 1, '#e8a33a')
    p(2, 4, 2, 1, '#6fa58a'); p(1, 6, 1, 2, '#e8a33a'); p(4, 6, 1, 2, '#e8a33a'); p(0, 4, 1, 1, '#5b6068')
  }
  return c
}

function flores() {
  const [c, ctx] = lienzo(16, 10)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  for (const [x, y, col] of [[2, 4, '#f6e05e'], [6, 2, '#ffffff'], [10, 5, '#ff8fb0'], [13, 2, '#a970ff'], [5, 7, '#e05a5a'], [12, 8, '#f6e05e']]) {
    p(x, y + 1, 1, 2, '#3f8a3a'); p(x - 1, y, 3, 1, col); p(x, y - 1, 1, 3, col); p(x, y, 1, 1, '#f2b33d')
  }
  return c
}

// Árbol de plaza en un alcorque redondo de piedra
function arbolPlaza() {
  const [c, ctx] = lienzo(24, 34)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(4, 29, 16, 5, '#1b1f27'); p(5, 30, 14, 3, '#b3ac9d'); p(7, 30, 10, 2, '#6b4a2b')
  p(10, 16, 4, 14, '#1b1f27'); p(11, 16, 2, 14, '#7a5532')
  p(3, 2, 18, 15, '#1b2a1e'); p(2, 5, 20, 9, '#1b2a1e'); p(4, 3, 16, 13, '#3c9a47'); p(3, 6, 18, 7, '#3c9a47')
  p(6, 4, 5, 4, '#5cbf5f'); p(14, 6, 4, 3, '#5cbf5f'); p(13, 11, 6, 4, '#2a7535'); p(4, 11, 5, 3, '#2a7535')
  return c
}

// Huerto del pueblo: surcos de tierra, lechugas y tomateras
function huerto() {
  const [c, ctx] = lienzo(56, 30)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(0, 4, 56, 26, '#1b1f27'); p(1, 5, 54, 24, '#7a5232')
  for (let y = 7; y < 29; y += 5) { p(1, y, 54, 2, '#5e3c24'); p(1, y + 2, 54, 1, '#94673f') }
  for (let x = 4; x < 40; x += 7) { p(x, 6, 5, 4, '#3c9a47'); p(x + 1, 6, 3, 2, '#7ad37a'); p(x + 1, 11, 4, 4, '#3c9a47'); p(x + 2, 11, 2, 2, '#9ce68c') }
  for (let x = 4; x < 40; x += 9) { p(x + 2, 17, 1, 9, '#2a7535'); p(x, 18, 5, 6, '#3c9a47'); p(x, 19, 2, 2, '#e05a5a'); p(x + 3, 21, 2, 2, '#e05a5a'); p(x + 1, 23, 2, 2, '#c8302a') }
  for (let x = 0; x < 56; x += 8) { p(x, 0, 2, 6, '#6b4a2b'); p(x, 0, 2, 1, '#8a6040') } // valla
  p(0, 2, 56, 1, '#8a6040')
  return c
}

// Una berenjena enorme y brillante
function berenjena() {
  const [c, ctx] = lienzo(14, 18)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(4, 4, 6, 1, '#1b1f27'); p(3, 5, 8, 11, '#1b1f27'); p(4, 16, 6, 2, '#1b1f27')
  p(4, 5, 6, 11, '#5b2a6e'); p(5, 16, 4, 1, '#5b2a6e'); p(4, 6, 2, 8, '#8a4aa0'); p(5, 7, 1, 2, '#e8d6f0'); p(8, 9, 2, 6, '#3f1c4d')
  p(4, 2, 6, 3, '#2f8a3a'); p(3, 3, 2, 2, '#2f8a3a'); p(9, 3, 2, 2, '#2f8a3a'); p(6, 0, 2, 3, '#5a7a2a')
  return c
}

// Grada pequeña de hormigón con asientos azules y blancos, con algo de público
function grada() {
  const [c, ctx] = lienzo(80, 24)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  for (let i = 0; i < 3; i++) {
    const y = 4 + i * 6
    p(0, y, 80, 7, '#1b1f27'); p(1, y + 1, 78, 5, '#b9c0c8'); p(1, y + 1, 78, 1, '#d9dee4')
    for (let x = 3; x < 77; x += 5) { p(x, y + 2, 3, 3, (x / 5 + i) % 2 < 1 ? '#2f5fb0' : '#eef1f4'); if ((x * 7 + i * 3) % 11 === 0) { p(x, y - 1, 3, 3, '#e5a97f'); p(x, y - 2, 3, 1, '#3b2a20'); p(x, y + 2, 3, 3, ['#e05a5a', '#1f2a44', '#f2b33d'][i]) } }
  }
  p(0, 22, 80, 2, 'rgba(0,0,0,0.2)')
  return c
}

// Banquillo con techo de metacrilato
function banquillo() {
  const [c, ctx] = lienzo(34, 20)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(0, 0, 34, 4, '#1b1f27'); p(1, 1, 32, 2, '#8fc4e8'); p(1, 1, 32, 1, '#cfe8f7')
  p(1, 4, 2, 14, '#5b6068'); p(31, 4, 2, 14, '#5b6068'); p(3, 4, 28, 8, 'rgba(160,210,240,0.35)')
  p(3, 12, 28, 4, '#1b1f27'); p(4, 12, 26, 2, '#2f5fb0'); p(4, 12, 26, 1, '#5f86c8')
  p(0, 18, 34, 2, 'rgba(0,0,0,0.2)')
  return c
}

// ---------------------------------------------------------------------------------------------- recreativos
function recreativos() {
  const [c, ctx] = lienzo(80, 60)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(0, 8, 80, 52, NEGRO); p(1, 9, 78, 50, '#2a2045'); p(1, 9, 2, 50, '#3a2f5c'); p(76, 9, 3, 50, '#1e1733')
  p(0, 4, 80, 6, NEGRO); p(1, 5, 78, 4, '#a970ff'); p(1, 5, 78, 1, '#d6c4ff')
  // letrero de neón
  p(14, 12, 52, 11, '#15101f'); textoCentrado(ctx, 'ARCADE', 40, 15, '#ff7fd6'); p(14, 12, 52, 1, '#ff7fd6'); p(14, 22, 52, 1, '#3dd9ff')
  // escaparate con máquinas dentro
  p(6, 28, 26, 18, NEGRO); p(7, 29, 24, 16, '#1b2440')
  for (const [x, col] of [[9, '#2fbf71'], [16, '#f2c200'], [23, '#3dd9ff']]) { p(x, 32, 5, 12, '#0d1117'); p(x + 1, 33, 3, 3, col) }
  p(48, 28, 26, 18, NEGRO); p(49, 29, 24, 16, '#1b2440'); p(51, 31, 20, 1, '#ff7fd6'); p(51, 41, 20, 1, '#3dd9ff')
  // puerta de cristal
  p(33, 38, 14, 22, NEGRO); p(34, 39, 12, 21, '#3d4c5c'); p(35, 40, 3, 6, '#6f8aa6'); p(40, 39, 1, 21, NEGRO)
  p(31, 58, 18, 2, '#9a9a9a')
  return c
}

// Máquina recreativa con su pantalla y el nombre del juego arriba
function maquina(color, nombre, pantalla) {
  return () => {
    const [c, ctx] = lienzo(26, 38)
    const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
    p(1, 36, 24, 2, 'rgba(0,0,0,0.25)')
    p(2, 0, 22, 37, NEGRO); p(3, 1, 20, 35, color); p(3, 1, 2, 35, aclarar(color, 0.25)); p(21, 1, 2, 35, oscurecer(color, 0.75))
    p(3, 2, 20, 7, '#15101f'); textoCentrado(ctx, nombre, 13, 3, '#ffffff')
    p(6, 10, 14, 11, NEGRO); p(7, 11, 12, 9, '#0d1117')
    pantalla((x, y, w, h, col) => p(7 + x, 11 + y, w, h, col))
    p(3, 22, 20, 5, oscurecer(color, 0.6)); p(8, 23, 1, 3, '#2b2f38'); p(7, 22, 3, 1, '#e05a5a'); p(14, 24, 2, 2, '#f2c200'); p(18, 24, 2, 2, '#3dd9ff')
    p(8, 29, 10, 3, NEGRO); p(9, 30, 3, 1, '#f2c200'); p(14, 30, 3, 1, '#f2c200') // ranura de monedas
    return c
  }
}

// ---------------------------------------------------------------------------------------------- señales de carretera
function senal(nombre, tachada) {
  return () => {
    const ancho = anchoTexto(nombre) + 10
    const [c, ctx] = lienzo(ancho + 2, 30)
    const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
    p(4, 13, 2, 17, '#6a717c'); p(ancho - 4, 13, 2, 17, '#6a717c')
    p(0, 0, ancho + 2, 15, NEGRO); p(1, 1, ancho, 13, '#ffffff'); p(2, 2, ancho - 2, 11, '#c8202a'); p(3, 3, ancho - 4, 9, '#ffffff')
    textoCentrado(ctx, nombre, ancho / 2 + 1, 5, '#15171c')
    if (tachada) for (let i = 0; i < ancho - 4; i++) p(3 + i, 11 - Math.round((i / (ancho - 4)) * 8), 2, 1, '#c8202a')
    return c
  }
}

// ---------------------------------------------------------------------------------------------- el Lupa del pueblo
// Supermercado de una planta como los Lupa de verdad: fachada de paneles gris claro con el logo («lu» en azul y «pa» en
// naranja dentro de un cuadro azul) y el carrito naranja, franja naranja y la cristalera con las puertas automáticas
function lupa() {
  const [c, ctx] = lienzo(96, 56)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(0, 2, 96, 54, NEGRO); p(1, 3, 94, 52, '#dfe2e6'); p(1, 3, 94, 1, '#f2f4f6'); p(92, 4, 3, 24, '#c6cbd1')
  p(0, 0, 96, 3, NEGRO); p(1, 1, 94, 1, '#c25f0c') // remate del tejado
  for (let x = 12; x < 94; x += 12) p(x, 4, 1, 20, '#cdd2d8') // juntas de los paneles
  // logo: carrito naranja, «LU» en azul y un cuadro azul con «PA» en naranja
  p(22, 9, 9, 1, '#f07d1a'); p(23, 10, 1, 5, '#f07d1a'); p(23, 14, 7, 1, '#f07d1a'); p(29, 10, 1, 5, '#f07d1a'); p(20, 7, 3, 1, '#f07d1a'); p(24, 16, 2, 2, '#f07d1a'); p(28, 16, 2, 2, '#f07d1a')
  // «lu» en minúscula, en azul
  const B = '#1f5fc8', O = '#f5a623'
  p(35, 6, 2, 11, B); p(39, 10, 2, 6, B); p(43, 10, 2, 7, B); p(39, 15, 6, 2, B)
  // cuadro azul con «pa» en naranja (la «p» baja por debajo de la línea)
  p(48, 5, 25, 16, B); p(48, 5, 25, 1, '#4f86e0')
  p(52, 9, 2, 10, O); p(52, 9, 6, 2, O); p(56, 9, 2, 6, O); p(52, 13, 6, 2, O)
  p(61, 9, 6, 2, O); p(61, 9, 2, 6, O); p(61, 13, 6, 2, O); p(65, 9, 2, 6, O); p(67, 14, 1, 1, O)
  // franja naranja
  p(1, 23, 94, 6, '#f07d1a'); p(1, 23, 94, 1, '#ffad5c'); p(1, 28, 94, 1, '#c25f0c')
  // cristalera con montantes oscuros y el marco naranja a los lados
  p(1, 29, 4, 26, '#f07d1a'); p(91, 29, 4, 26, '#f07d1a')
  p(5, 29, 86, 26, '#2b3a40'); p(6, 30, 84, 24, '#4f8f97'); p(6, 30, 84, 4, '#7db3ba')
  for (let x = 16; x < 90; x += 10) p(x, 30, 1, 24, '#2b3a40')
  // dentro se ven baldas de colores
  for (let x = 8; x < 88; x += 10) if (x < 38 || x > 56) { p(x, 40, 7, 1, '#3a4a50'); p(x + 1, 37, 2, 3, '#f2b33d'); p(x + 4, 37, 2, 3, '#e05a5a'); p(x + 2, 43, 2, 3, '#3d7be0'); p(x + 5, 43, 2, 3, '#2fbf71') }
  // puertas automáticas, con un cartel de ofertas al lado
  p(40, 32, 16, 23, NEGRO); p(41, 33, 14, 22, '#8fc0c6'); p(47, 33, 2, 22, NEGRO)
  p(60, 34, 6, 8, '#ffffff'); p(61, 36, 4, 1, '#c8302a'); p(61, 38, 4, 2, '#f07d1a')
  p(38, 54, 20, 2, '#3a3f48')
  return c
}

// ---------------------------------------------------------------------------------------------- la ciénaga
// Una ciénaga en la esquina del pueblo: árboles oscuros con musgo colgando, charcas verdes con nenúfares, juncos,
// setas, una valla de troncos con su cancela y un camino de tierra que se mete en la espesura
function cienaga() {
  const W = 160, H = 112
  const [c, ctx] = lienzo(W, H)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  const r = azar(41)
  // suelo de barro y hierba húmeda, con manchas
  p(0, 30, W, H - 30, '#3f4d26')
  for (let i = 0; i < 260; i++) p(Math.floor(r() * W), 30 + Math.floor(r() * (H - 30)), 2 + Math.floor(r() * 3), 1, ['#4a5a2c', '#36421f', '#55652f', '#4b3f24'][i % 4])
  // el camino de tierra, desde la cancela hasta la espesura
  for (let y = 44; y < H; y++) {
    const ancho = 14 + Math.round((y - 44) * 0.12), x = 80 - ancho / 2 + Math.round(Math.sin(y / 9) * 3)
    p(x, y, ancho, 1, '#7a5c3a'); p(x, y, 1, 1, '#5e4429'); p(x + ancho - 1, y, 1, 1, '#5e4429')
    if (y % 5 === 0) p(x + 3 + (y % 7), y, 2, 1, '#8f6e48')
  }
  // charcas con nenúfares, burbujas y un tronco medio hundido
  const charca = (cx, cy, rx, ry) => {
    for (let y = -ry; y <= ry; y++) {
      const w = Math.round(rx * Math.sqrt(1 - (y * y) / (ry * ry)))
      p(cx - w - 1, cy + y, 2 * w + 2, 1, '#2a3418')
      p(cx - w, cy + y, 2 * w, 1, y < -ry / 2 ? '#6b8a4a' : '#557a3c')
    }
    p(cx - rx + 4, cy - 1, 6, 1, '#89a866'); p(cx + 2, cy + 2, 4, 1, '#89a866')
    for (const [dx, dy] of [[-Math.round(rx / 2), 0], [Math.round(rx / 3), -Math.round(ry / 3)]]) { p(cx + dx, cy + dy, 4, 2, '#2f7a3a'); p(cx + dx + 1, cy + dy, 1, 1, '#1f5a2a'); p(cx + dx + 3, cy + dy - 1, 1, 1, '#ff9fc4') }
    const b = Math.round(rx / 2); p(cx + b, cy - 2, 1, 1, '#a9c98a'); p(cx + b + 2, cy - 4, 1, 1, '#a9c98a')
  }
  charca(30, 70, 22, 10); charca(128, 64, 20, 9); charca(118, 92, 12, 6)
  p(14, 66, 20, 4, '#4a3520'); p(14, 66, 20, 1, '#6b4a2b'); p(33, 66, 2, 4, '#7a5c3a')
  // juncos con su espiga marrón
  for (const [x, y] of [[8, 80], [12, 78], [52, 74], [56, 76], [104, 70], [150, 70], [146, 74], [100, 96], [136, 96], [20, 92]]) {
    p(x, y - 9, 1, 9, '#5a7a2a'); p(x + 2, y - 7, 1, 7, '#6b8a35'); p(x, y - 12, 1, 3, '#6b4a2b'); p(x + 2, y - 9, 1, 2, '#6b4a2b')
  }
  // setas
  for (const [x, y] of [[44, 92], [62, 100], [96, 82], [146, 100]]) { p(x, y - 2, 1, 2, '#e9e4d8'); p(x - 1, y - 4, 3, 2, '#c8302a'); p(x, y - 4, 1, 1, '#ffffff') }
  // árboles del fondo: copas oscuras con musgo que cuelga y troncos retorcidos
  const arbol = (x, y, rc) => {
    p(x - 2, y + rc - 2, 5, 22, '#3a2a18'); p(x - 2, y + rc - 2, 1, 22, '#4f3a22'); p(x - 5, y + rc + 16, 11, 3, '#3a2a18')
    for (let k = -rc; k <= rc; k++) {
      const w = Math.round(Math.sqrt(rc * rc - k * k) * 1.3)
      p(x - w - 1, y + k, 2 * w + 2, 1, '#18240f')
      p(x - w, y + k, 2 * w, 1, k < -rc / 3 ? '#3b5426' : '#2a3d1c')
    }
    p(x - Math.round(rc / 2), y - Math.round(rc / 2), 4, 2, '#4f6b30')
    for (let k = -rc; k < rc; k += 4) p(x + k, y + rc - 1, 1, 4 + ((k + rc) % 5), '#6b7a3a') // musgo colgando
  }
  for (const [x, y, rc] of [[12, 16, 14], [40, 10, 13], [66, 18, 12], [96, 18, 12], [122, 10, 13], [148, 16, 14], [26, 30, 10], [138, 32, 10]]) arbol(x, y, rc)
  // la entrada de la espesura: oscura, con dos ojillos amarillos que miran
  p(70, 34, 20, 12, '#141c0c'); p(72, 32, 16, 2, '#141c0c'); p(76, 38, 1, 1, '#f2c200'); p(81, 38, 1, 1, '#f2c200')
  // niebla baja
  for (const [x, y, w] of [[6, 84, 40], [96, 78, 50], [40, 58, 30]]) { p(x, y, w, 2, 'rgba(220,235,210,0.18)'); p(x + 4, y + 2, w - 8, 1, 'rgba(220,235,210,0.12)') }
  // valla de troncos con la cancela abierta en el centro y el cartel de «LA CIÉNAGA»
  for (let x = 2; x < W - 2; x += 8) {
    if (x > 62 && x < 94) continue
    p(x, 98, 3, 13, '#4a3520'); p(x, 98, 3, 1, '#6b4a2b'); p(x + 1, 99, 1, 12, '#5e4429')
  }
  p(0, 102, 64, 2, '#6b4a2b'); p(96, 102, 64, 2, '#6b4a2b'); p(0, 107, 64, 2, '#5e4429'); p(96, 107, 64, 2, '#5e4429')
  p(62, 90, 4, 22, '#3a2a18'); p(94, 90, 4, 22, '#3a2a18'); p(60, 88, 40, 4, '#4a3520'); p(60, 88, 40, 1, '#6b4a2b')
  p(26, 78, 34, 18, NEGRO); p(27, 79, 32, 16, '#a8854f'); p(27, 79, 32, 1, '#c8a36a')
  textoCentrado(ctx, 'LA', 43, 81, '#3a2a18'); textoCentrado(ctx, 'CIÉNAGA', 43, 89, '#3a2a18'); p(42, 96, 2, 6, '#4a3520')
  return c
}

// Boca de metro de Madrid vista desde arriba: el suelo de granito, la escalera que baja con su pared a cada lado,
// el pretil con la barandilla de acero, la placa azul con el nombre de la parada y el poste con el rombo rojo y la
// franja azul de «METRO»
function bocaMetro(nombre) {
  return () => {
    const W = 64, H = 50
    const [c, ctx] = lienzo(W, H)
    const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
    // granito alrededor, con sus juntas
    p(0, 14, W, H - 14, '#b3afa7')
    for (let y = 14; y < H; y += 8) p(0, y, W, 1, '#9b978f')
    for (let x = 0; x < W; x += 12) p(x, 14, 1, H - 14, '#9b978f')
    // hueco de la escalera: los escalones se oscurecen según bajan (hacia el fondo)
    p(9, 17, 34, H - 17, NEGRO)
    for (let k = 0; k < 11; k++) {
      const y = H - 3 - k * 3, v = 196 - k * 14
      p(12, y, 28, 3, `rgb(${v}, ${v + 2}, ${v + 6})`); p(12, y, 28, 1, `rgb(${v + 22}, ${v + 24}, ${v + 28})`)
    }
    p(12, 17, 28, 3, '#1b1f27')
    // paredes de la escalera
    p(10, 17, 2, H - 17, '#7d7a73'); p(40, 17, 2, H - 17, '#6b6862')
    // pretil de granito con la barandilla de acero encima (a los lados y al fondo)
    p(6, 14, 4, H - 14, '#8f8b83'); p(42, 14, 4, H - 14, '#8f8b83'); p(6, 14, 40, 3, '#8f8b83')
    p(7, 12, 2, H - 12, '#d9dee4'); p(43, 12, 2, H - 12, '#d9dee4'); p(7, 12, 38, 2, '#d9dee4'); p(7, 12, 38, 1, '#ffffff')
    for (let y = 18; y < H; y += 7) { p(7, y, 2, 1, '#8a919a'); p(43, y, 2, 1, '#8a919a') }
    // placa azul con el nombre de la parada, en el pretil del fondo
    p(3, 1, 44, 10, NEGRO); p(4, 2, 42, 8, '#1f4e9b'); p(4, 2, 42, 1, '#4f7fc8'); textoCentrado(ctx, nombre, 25, 4, '#ffffff')
    p(10, 11, 1, 2, '#5b6068'); p(40, 11, 1, 2, '#5b6068')
    // el poste con el rombo: rojo por fuera, blanco dentro y la franja azul con METRO cruzándolo
    const cx = 54, cy = 13 // el rombo va más bajo que la placa para no taparla
    p(cx - 1, cy + 9, 2, H - cy - 11, '#5b6068'); p(cx - 1, cy + 9, 1, H - cy - 11, '#8a919a'); p(cx - 3, H - 3, 6, 2, '#3a3f48')
    for (let k = 0; k <= 8; k++) { const w = k * 2 + 1; p(cx - k, cy - 8 + k, w, 1, '#c8302a'); p(cx - k, cy + 9 - k, w, 1, '#c8302a') }
    for (let k = 3; k <= 8; k++) { const w = (k - 2) * 2 + 1; p(cx - k + 2, cy - 8 + k, w, 1, '#ffffff'); p(cx - k + 2, cy + 9 - k, w, 1, '#ffffff') }
    p(42, cy - 2, 22, 7, '#1f4e9b'); p(42, cy - 2, 22, 1, '#4f7fc8'); textoCentrado(ctx, 'METRO', 53, cy - 1, '#ffffff')
    return c
  }
}

// Neón de la esquina de Scranton: un cartel oscuro sobre dos patas con «ARCADE» en rosa y una flecha azul que
// señala arriba a la izquierda, hacia los recreativos. Dos fotogramas: la flecha se enciende por tramos
function neonArcade(f) {
  return () => {
    const [c, ctx] = lienzo(46, 34)
    const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
    p(8, 20, 2, 14, '#3a3f48'); p(36, 20, 2, 14, '#3a3f48')
    p(0, 0, 46, 22, NEGRO); p(1, 1, 44, 20, '#100c1f')
    p(2, 2, 42, 1, '#ff3d7f'); p(2, 19, 42, 1, '#ff3d7f'); p(2, 2, 1, 18, '#ff3d7f'); p(43, 2, 1, 18, '#ff3d7f')
    textoCentrado(ctx, 'ARCADE', 28, 13, f ? '#ff7fb0' : '#ff3d7f')
    // flecha en diagonal hacia arriba a la izquierda
    const azul = '#3dd9ff', apagado = '#1d4a5a'
    for (let k = 0; k < 7; k++) p(17 - k, 11 - k, 2, 1, f || k > 3 ? azul : apagado)
    p(5, 4, 5, 1, azul); p(5, 4, 1, 5, azul)
    p(4, 22, 38, 1, 'rgba(255,61,127,0.35)')
    return c
  }
}

// El buzón de opiniones junto al metro de los recreativos: tablón en dos postes y un buzón rojo delante
function buzonOpiniones() {
  const [c, ctx] = lienzo(52, 42)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(6, 18, 3, 24, '#4a3520'); p(43, 18, 3, 24, '#4a3520')
  p(0, 0, 52, 20, NEGRO); p(1, 1, 50, 18, '#f2ede2'); p(1, 1, 50, 2, '#2fbf71')
  textoCentrado(ctx, 'OPINIONES Y', 26, 5, '#1b1f27'); textoCentrado(ctx, 'SUGERENCIAS', 26, 12, '#1b1f27')
  // el buzón con su ranura y la bandera levantada
  p(18, 24, 16, 14, NEGRO); p(19, 25, 14, 12, '#c8302a'); p(19, 25, 14, 2, '#e05a5a'); p(21, 29, 10, 2, NEGRO)
  p(34, 22, 2, 8, '#3a3f48'); p(36, 22, 4, 3, '#f2c200'); p(25, 38, 2, 4, '#3a3f48')
  return c
}

// La Estación Sur de autobuses de Méndez Álvaro: edificio largo de dos alturas, la planta de arriba forrada de
// paneles gris azulado con las letras grandes, una franja de ventanas y la marquesina blanca que vuela sobre
// la planta baja, que es toda de cristal con los pilares de hormigón y las puertas en el centro
function estacionSur() {
  const W = 104, H = 72
  const [c, ctx] = lienzo(W, H)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  // planta de arriba: paneles con sus juntas
  p(0, 0, W, 31, NEGRO); p(1, 1, W - 2, 3, '#d9dde2'); p(1, 4, W - 2, 26, '#2f4a63')
  for (let x = 7; x < W - 2; x += 8) p(x, 4, 1, 26, '#3a5775')
  p(1, 4, W - 2, 1, '#46698a')
  p(6, 6, W - 12, 13, '#24394d'); textoGrande(ctx, 'ESTACION SUR', W / 2, 8, '#ffffff')
  textoCentrado(ctx, 'AUTOBUSES', W / 2, 21, '#9fc4e6')
  for (let x = 4; x < W - 6; x += 10) { p(x, 27, 8, 3, '#7fb0d8'); p(x, 27, 8, 1, '#c3def2') }
  // la marquesina blanca
  p(-1, 30, W + 2, 5, NEGRO); p(0, 31, W, 3, '#eef1f4'); p(0, 34, W, 1, '#8a919a')
  // planta baja de cristal, con reflejos en diagonal y pilares
  p(2, 35, W - 4, 35, NEGRO); p(3, 35, W - 6, 34, '#5f8fb8')
  for (let x = 3; x < W - 3; x += 8) p(x, 35, 1, 34, '#2a3b4d')
  for (let k = 0; k < 6; k++) for (let d = 0; d < 10; d++) p(8 + k * 17 + d, 60 - d * 2, 1, 2, 'rgba(220,238,252,0.35)')
  p(3, 36, W - 6, 2, '#8fb8de')
  for (const x of [10, 30, 70, 90]) { p(x, 35, 4, 35, '#c9ced5'); p(x, 35, 1, 35, '#e3e7ec'); p(x + 3, 35, 1, 35, '#9aa1aa') }
  // puertas de entrada
  p(40, 46, 24, 24, NEGRO); p(41, 47, 22, 23, '#36597a'); p(41, 47, 22, 2, '#6f9cc8'); p(51, 47, 2, 23, NEGRO)
  p(48, 58, 1, 4, '#d9dde2'); p(55, 58, 1, 4, '#d9dde2')
  p(42, 40, 20, 5, NEGRO); p(43, 41, 18, 3, '#c8302a'); textoCentrado(ctx, 'BUS', 52, 40, '#ffffff')
  // zócalo
  p(0, 69, W, 3, '#8a919a'); p(0, 69, W, 1, '#b4bac2')
  return c
}

// La parada del Monbus delante de la Estación Sur: marquesina con el techo azul, el cristal y su banco
function paradaSur() {
  const [c, ctx] = lienzo(34, 30)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(2, 6, 2, 24, '#5b6068'); p(30, 6, 2, 24, '#5b6068')
  p(4, 8, 26, 16, 'rgba(160,200,230,0.45)'); p(4, 8, 26, 1, '#c3def2')
  p(0, 2, 34, 5, NEGRO); p(1, 3, 32, 3, '#1f4fa0'); textoCentrado(ctx, 'BUS', 17, 1, '#ffffff')
  p(7, 21, 20, 3, NEGRO); p(8, 21, 18, 2, '#a8854f'); p(9, 24, 2, 4, '#5b6068'); p(23, 24, 2, 4, '#5b6068')
  p(22, 10, 7, 9, NEGRO); p(23, 11, 5, 7, '#f2c200'); p(24, 13, 3, 1, NEGRO); p(24, 15, 3, 1, NEGRO)
  return c
}

// Chalet de una urbanización: casa baja con tejado, garaje y su jardín con seto
function chalet(pared, tejado) {
  return () => {
    const W = 64, H = 58
    const [c, ctx] = lienzo(W, H)
    const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
    // jardín con el césped y el seto alrededor (abierto delante, en la entrada)
    p(0, 34, W, 24, '#4f9a45'); for (let k = 0; k < 40; k++) p((k * 23) % W, 36 + (k * 7) % 20, 2, 1, '#5cad50')
    p(0, 32, 4, 26, '#2f6b30'); p(W - 4, 32, 4, 26, '#2f6b30'); p(0, H - 4, 26, 4, '#2f6b30'); p(38, H - 4, 26, 4, '#2f6b30')
    p(0, 32, 4, 1, '#3f8a3a'); p(0, H - 4, 26, 1, '#3f8a3a'); p(38, H - 4, 26, 1, '#3f8a3a')
    p(26, 34, 12, 24, '#c9c3b5'); for (let y = 36; y < H; y += 4) p(26, y, 12, 1, '#b5ae9f') // caminito de baldosas
    // la casa
    const [cc, cctx] = lienzo(56, 40)
    casa(cctx, 56, 40, { pared, tejado, cruz: true, macetas: true })
    ctx.drawImage(cc, 4, 0)
    // garaje a la derecha
    p(42, 20, 16, 16, NEGRO); p(43, 21, 14, 15, '#d9dee4'); for (let y = 23; y < 36; y += 3) p(43, y, 14, 1, '#b8bfc7')
    // farolillo y un árbol pequeño en el jardín
    p(8, 40, 6, 6, '#2f6b30'); p(9, 39, 4, 2, '#3f8a3a'); p(10, 46, 2, 4, '#6b4a2b')
    return c
  }
}

// El Bar El Arte: fachada gris de dos plantas, el nombre en letras granates, la cristalera del bar con luz dentro,
// una bufanda del Madrid en la ventana y la puerta de madera
function barArte() {
  const W = 104, H = 72
  const [c, ctx] = lienzo(W, H)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  const gris = '#9ea2a8', grisL = '#b9bcc1', grisO = '#80848a', granate = '#7a1f2a'
  // tejado
  for (let y = 0; y < 10; y++) { p(2 - Math.min(2, y), y, W - 4 + Math.min(2, y) * 2, 1, y % 3 === 2 ? '#7a3a28' : '#9b4a35') }
  p(0, 9, W, 2, NEGRO)
  // fachada
  p(0, 11, W, H - 11, NEGRO); p(1, 11, W - 2, H - 12, gris); p(1, 11, 3, H - 12, grisL); p(W - 4, 11, 3, H - 12, grisO)
  for (let y = 14; y < H - 4; y += 6) p(1, y, W - 2, 1, '#969aa0')
  // planta de arriba: tres ventanas con balcón
  for (const vx of [12, 46, 80]) {
    p(vx, 15, 12, 13, NEGRO); p(vx + 1, 16, 10, 11, '#9fd3ff'); p(vx + 1, 21, 10, 6, '#7fb2d8'); p(vx + 6, 16, 1, 11, '#f4f1ea')
    p(vx - 2, 28, 16, 2, '#3a3f48'); for (let k = vx - 2; k < vx + 14; k += 3) p(k, 26, 1, 2, '#3a3f48')
  }
  // el nombre en letras granates sobre la fachada
  p(6, 31, W - 12, 13, grisL); textoGrande(ctx, 'EL ARTE', W / 2, 33, granate, 2); p(6, 31, W - 12, 1, grisO); p(6, 43, W - 12, 1, grisO)
  // planta baja: cristaleras con luz cálida, una bufanda blanca y morada, y la puerta de madera en el centro
  for (const vx of [6, 66]) {
    p(vx, 47, 32, 20, NEGRO); p(vx + 1, 48, 30, 18, '#f3d590'); p(vx + 1, 48, 30, 4, '#f8e6b4'); p(vx + 15, 48, 2, 18, NEGRO)
    p(vx + 3, 58, 4, 7, '#5b4a3a'); p(vx + 20, 57, 4, 8, '#5b4a3a') // gente dentro
  }
  p(10, 49, 20, 3, '#ffffff'); p(10, 49, 2, 3, '#5b2a8a'); p(28, 49, 2, 3, '#5b2a8a') // la bufanda en la cristalera
  p(42, 46, 20, 25, NEGRO); p(43, 47, 18, 24, '#6b4a2b'); p(43, 47, 18, 2, '#8a6040'); p(51, 47, 2, 24, '#5a3c22'); p(48, 58, 2, 2, '#d6c070'); p(54, 58, 2, 2, '#d6c070')
  p(40, H - 2, 24, 2, '#8a8f96')
  return c
}

// Fila de carros de la compra encajados unos en otros
function carritos() {
  const [c, ctx] = lienzo(26, 14)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  for (let i = 0; i < 3; i++) {
    const x = i * 6
    p(x, 2, 12, 8, '#8a919a'); p(x + 1, 3, 10, 6, '#c9ced5'); for (let k = 2; k < 11; k += 3) p(x + k, 3, 1, 6, '#8a919a')
    p(x, 1, 2, 2, '#f07d1a') // asa naranja
    p(x + 1, 11, 2, 2, NEGRO); p(x + 9, 11, 2, 2, NEGRO)
  }
  return c
}

// Señal de aparcamiento
function senalP() {
  const [c, ctx] = lienzo(12, 26)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(5, 10, 2, 16, '#6a717c')
  p(0, 0, 12, 12, NEGRO); p(1, 1, 10, 10, '#1f5fb0'); textoCentrado(ctx, 'P', 6, 4, '#ffffff')
  return c
}

// ---------------------------------------------------------------------------------------------- estadio
function foco() {
  const [c, ctx] = lienzo(16, 60)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(7, 10, 2, 50, '#5b6068'); p(7, 10, 1, 50, '#8a919a'); p(5, 57, 6, 3, '#3a3f48')
  p(0, 0, 16, 11, NEGRO); p(1, 1, 14, 9, '#3a3f48')
  for (let y = 2; y < 9; y += 3) for (let x = 2; x < 14; x += 3) p(x, y, 2, 2, '#fff3c4')
  return c
}

function marcador() {
  const [c, ctx] = lienzo(46, 30)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(6, 18, 2, 12, '#5b6068'); p(38, 18, 2, 12, '#5b6068')
  p(0, 0, 46, 20, NEGRO); p(1, 1, 44, 18, '#15171c'); p(1, 1, 44, 1, '#3a3f48')
  textoCentrado(ctx, 'UDIT', 12, 4, '#f2c200'); textoCentrado(ctx, 'RIVAL', 34, 4, '#f2c200')
  textoCentrado(ctx, '3', 12, 12, '#ff7a3c'); textoCentrado(ctx, '0', 34, 12, '#ff7a3c'); p(22, 13, 2, 1, '#ff7a3c')
  return c
}

// ---------------------------------------------------------------------------------------------- guiños a The Office
// Remolachas, como en la granja de Dwight
function remolachas() {
  const [c, ctx] = lienzo(40, 22)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(0, 4, 40, 18, NEGRO); p(1, 5, 38, 16, '#6b4a2b')
  for (let y = 7; y < 20; y += 5) p(1, y + 2, 38, 1, '#4a3220')
  for (let y = 6; y < 20; y += 5) for (let x = 3; x < 36; x += 6) { p(x + 1, y + 2, 4, 3, '#8a1f4a'); p(x + 2, y + 2, 2, 1, '#b8336a'); p(x + 1, y - 1, 1, 3, '#2f8a3a'); p(x + 3, y - 2, 1, 4, '#3c9a47'); p(x + 4, y - 1, 1, 2, '#2f8a3a') }
  p(0, 0, 2, 6, '#6b4a2b'); p(38, 0, 2, 6, '#6b4a2b'); p(0, 1, 40, 1, '#8a6040')
  return c
}

// Grapadora metida en un molde de gelatina amarilla
function gelatina() {
  const [c, ctx] = lienzo(12, 9)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(0, 1, 12, 8, '#c9a400'); p(1, 1, 10, 7, 'rgba(255,214,40,0.85)'); p(1, 1, 10, 1, '#fff3a0')
  p(3, 3, 6, 2, '#5b6068'); p(3, 3, 6, 1, '#8a919a'); p(3, 5, 6, 1, '#2b2f38')
  return c
}

// Taza de «El mejor jefe del mundo»
function tazaJefe() {
  const [c, ctx] = lienzo(9, 9)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(0, 1, 7, 8, NEGRO); p(1, 2, 5, 6, '#ffffff'); p(7, 3, 2, 4, NEGRO); p(7, 4, 1, 2, '#ffffff')
  p(2, 3, 3, 1, '#15171c'); p(2, 5, 3, 1, '#15171c'); p(1, 2, 5, 1, '#e8e8e8')
  return c
}

function posteScranton() {
  const [c, ctx] = lienzo(40, 32)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(19, 4, 3, 28, '#6b4a2b'); p(19, 4, 1, 28, '#8a6040')
  p(4, 6, 34, 9, NEGRO); p(5, 7, 32, 7, '#e0c58a'); p(37, 8, 2, 5, NEGRO); textoCentrado(ctx, 'SCRANTON', 20, 8, '#3a2a20')
  p(2, 17, 30, 9, NEGRO); p(3, 18, 28, 7, '#e0c58a'); p(1, 19, 2, 5, NEGRO); textoCentrado(ctx, 'PA 1', 17, 19, '#3a2a20')
  return c
}

// ---------------------------------------------------------------------------------------------- guiños de programación
// Patito de goma para explicarle los bugs
function pato() {
  const [c, ctx] = lienzo(12, 10)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(1, 4, 10, 5, '#f2c200'); p(0, 5, 1, 3, '#f2c200'); p(6, 0, 5, 5, '#f2c200'); p(10, 2, 2, 2, '#ff8a00'); p(8, 1, 1, 1, '#15171c')
  p(2, 5, 4, 1, '#fff3a0'); p(1, 8, 10, 1, '#c99a00'); p(0, 9, 12, 1, 'rgba(255,255,255,0.6)')
  return c
}

function cartel404() {
  const [c, ctx] = lienzo(26, 22)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(12, 10, 2, 12, '#6b4a2b')
  p(0, 0, 26, 12, NEGRO); p(1, 1, 24, 10, '#1b1f27'); textoCentrado(ctx, '404', 13, 4, '#e05a5a')
  return c
}

// Café recién hecho: Java, claro
function tazaJava() {
  const [c, ctx] = lienzo(10, 14)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(2, 0, 1, 2, 'rgba(255,255,255,0.6)'); p(4, 1, 1, 3, 'rgba(255,255,255,0.6)'); p(6, 0, 1, 2, 'rgba(255,255,255,0.6)')
  p(0, 5, 8, 9, NEGRO); p(1, 6, 6, 7, '#e05a5a'); p(1, 6, 6, 1, '#5a3a20'); p(8, 7, 2, 4, NEGRO); p(8, 8, 1, 2, '#e05a5a'); p(2, 9, 4, 2, '#ffffff')
  return c
}

// Un bug de verdad: una mariquita
function bicho() {
  const [c, ctx] = lienzo(8, 7)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(2, 0, 4, 2, '#15171c'); p(1, 2, 6, 5, '#d6302a'); p(4, 2, 1, 5, '#15171c'); p(2, 3, 1, 1, '#15171c'); p(5, 5, 1, 1, '#15171c'); p(2, 2, 1, 1, '#ff8a80')
  return c
}

// ---------------------------------------------------------------------------------------------- casas con soportales y bares
// Dos plantas con balcones, soportales abajo y, si es un bar, su rótulo encima de los arcos y luz dentro
function casaBar(pared, nombre, ancho = 48) {
  return () => {
    const [c, ctx] = lienzo(ancho, 60)
    const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
    tejado(ctx, 0, 2, ancho, 9, '#a84a30')
    p(0, 13, ancho, 47, pared); p(0, 13, ancho, 2, oscurecer(pared, 0.8)); p(0, 15, 2, 45, aclarar(pared, 0.2)); p(ancho - 3, 15, 3, 45, oscurecer(pared, 0.88))
    for (let x = 6; x < ancho - 10; x += 16) {
      p(x, 17, 10, 14, '#f4f1ea'); p(x + 1, 18, 8, 12, '#2a3440'); p(x + 1, 18, 8, 4, '#3d4c5c'); p(x + 5, 18, 1, 12, '#f4f1ea')
      p(x - 2, 31, 14, 1, '#bfb5a0'); p(x - 2, 28, 14, 1, NEGRO)
      for (let b = x - 2; b < x + 12; b += 2) p(b, 29, 1, 2, NEGRO)
      p(x + 1, 27, 2, 1, '#e05a5a'); p(x + 6, 27, 2, 1, '#f6e05e')
    }
    if (nombre) {
      const w = anchoTexto(nombre) + 8, x0 = Math.round(ancho / 2 - w / 2)
      p(x0, 33, w, 9, NEGRO); p(x0 + 1, 34, w - 2, 7, '#24334f'); textoCentrado(ctx, nombre, ancho / 2, 35, '#f6e05e')
    }
    p(0, 43, ancho, 1, aclarar(pared, 0.3)); p(0, 44, ancho, 1, oscurecer(pared, 0.78))
    for (let x = 0; x < ancho; x += 16) {
      const ox = x + 4
      p(ox, 49, 12, 11, '#6b5843'); p(ox + 1, 47, 10, 2, '#6b5843'); p(ox + 3, 46, 6, 1, '#6b5843')
      p(ox, 49, 12, 3, '#4a3c2e'); p(ox + 1, 47, 10, 2, '#4a3c2e')
      if (nombre) { p(ox + 2, 52, 8, 6, '#c9a26a'); p(ox + 3, 53, 2, 3, '#7a5232'); p(ox + 7, 53, 2, 3, '#3d7be0') } // luz y botellas
      p(x, 45, 4, 15, pared); p(x, 45, 1, 15, aclarar(pared, 0.25)); p(x + 3, 45, 1, 15, oscurecer(pared, 0.82))
    }
    p(ancho - 4, 45, 4, 15, pared); p(ancho - 1, 45, 1, 15, oscurecer(pared, 0.82))
    return c
  }
}

// Mesa de terraza con su sombrilla
function mesaBar() {
  const [c, ctx] = lienzo(18, 20)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(1, 0, 16, 4, NEGRO); for (let x = 2; x < 16; x += 4) p(x, 1, 2, 2, '#e05a5a'); for (let x = 4; x < 16; x += 4) p(x, 1, 2, 2, '#f4f4f0')
  p(8, 4, 2, 9, '#5b6068')
  p(3, 12, 12, 3, NEGRO); p(4, 12, 10, 2, '#e9ecef'); p(8, 15, 2, 4, '#5b6068')
  p(0, 13, 3, 6, '#7a5232'); p(15, 13, 3, 6, '#7a5232')
  p(2, 18, 14, 2, 'rgba(0,0,0,0.18)')
  return c
}

// Estación de BiciMAD: tótem con pantalla y tres bicis ancladas
function bicimad() {
  const [c, ctx] = lienzo(48, 28)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(0, 25, 48, 3, '#9aa3ad'); p(0, 25, 48, 1, '#c3cbd3')
  p(2, 2, 9, 23, NEGRO); p(3, 3, 7, 21, '#eef1f4'); p(4, 5, 5, 6, '#3d7be0'); p(5, 6, 3, 1, '#9fc4f0'); p(4, 14, 5, 2, '#c8202a'); p(3, 3, 7, 1, '#ffffff')
  const rueda = (x, y) => { p(x + 1, y, 4, 1, NEGRO); p(x, y + 1, 1, 4, NEGRO); p(x + 5, y + 1, 1, 4, NEGRO); p(x + 1, y + 5, 4, 1, NEGRO) }
  for (const x of [14, 25, 36]) {
    p(x + 4, 12, 2, 13, '#6a717c') // anclaje
    rueda(x, 18); rueda(x + 7, 18)
    p(x + 3, 17, 8, 2, '#eef1f4'); p(x + 3, 18, 8, 1, '#3d7be0'); p(x + 5, 14, 1, 4, '#eef1f4'); p(x + 4, 13, 3, 1, NEGRO); p(x + 10, 14, 1, 4, '#eef1f4'); p(x + 9, 13, 3, 1, '#9aa3ad')
    p(x + 2, 16, 3, 2, '#c8202a') // cesta
  }
  return c
}

// Anexia (Alquiler Seguro): fachada blanca con naranja, dos plantas, ventanal corrido arriba y cristaleras abajo
function anexia() {
  const [c, ctx] = lienzo(80, 56)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  const naranja = '#f28c28', naranjaO = '#c96a12', blanco = '#f6f7f8'
  p(0, 0, 80, 6, NEGRO); p(1, 1, 78, 4, naranja); p(1, 1, 78, 1, '#ffb066'); p(1, 4, 78, 1, naranjaO)
  p(0, 6, 80, 50, NEGRO); p(1, 6, 78, 49, blanco); p(1, 6, 2, 49, '#ffffff'); p(76, 6, 3, 49, '#d9dde2')
  // primera planta: ventanal corrido
  p(5, 10, 70, 14, NEGRO); p(6, 11, 68, 12, '#9fd3ff'); p(6, 11, 68, 3, '#cfe8f7')
  for (let x = 6; x < 74; x += 11) p(x, 11, 1, 12, '#2b2f38')
  for (let x = 9; x < 70; x += 22) { p(x, 15, 2, 1, '#ffffff'); p(x + 1, 16, 2, 1, '#ffffff') }
  // franja naranja entre plantas con el nombre
  p(1, 27, 78, 7, naranja); p(1, 33, 78, 1, naranjaO); textoCentrado(ctx, 'ANEXIA', 40, 28, '#ffffff')
  // planta baja: dos cristaleras y la puerta
  for (const x of [5, 53]) { p(x, 37, 22, 14, NEGRO); p(x + 1, 38, 20, 12, '#9fd3ff'); p(x + 1, 38, 20, 3, '#cfe8f7'); p(x + 11, 38, 1, 12, '#2b2f38') }
  p(32, 36, 16, 19, NEGRO); p(33, 37, 14, 18, '#3d4c5c'); p(40, 37, 1, 18, NEGRO); p(34, 38, 3, 6, '#7f9fbf'); p(42, 38, 3, 6, '#7f9fbf')
  p(1, 52, 78, 3, naranjaO); p(30, 54, 20, 2, '#9a9a9a')
  return c
}

// ---------------------------------------------------------------------------------------------- guiños al anime
// Como el resto de guiños, formas sencillas y propias: nada copiado de las series.
// Una nubecita amarilla que flota (Dragon Ball): si te subes, vas más rápido un rato
function nube() {
  const [c, ctx] = lienzo(28, 14)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  for (const [x, y, w, h] of [[3, 5, 22, 7], [6, 2, 8, 6], [13, 1, 9, 6], [1, 7, 4, 4], [23, 6, 4, 5]]) p(x - 1, y - 1, w + 2, h + 2, '#c9962b')
  for (const [x, y, w, h] of [[3, 5, 22, 7], [6, 2, 8, 6], [13, 1, 9, 6], [1, 7, 4, 4], [23, 6, 4, 5]]) p(x, y, w, h, '#ffd93a')
  p(7, 3, 4, 2, '#fff3a0'); p(14, 2, 5, 2, '#fff3a0'); p(4, 10, 20, 1, '#f2b33d')
  return c
}

// Neumático colgado de un pórtico de madera, para entrenar paradas (Inazuma Eleven)
function neumatico() {
  const [c, ctx] = lienzo(30, 40)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(1, 2, 3, 38, '#6b4a2b'); p(26, 2, 3, 38, '#6b4a2b'); p(0, 0, 30, 4, '#5a3c22'); p(0, 0, 30, 1, '#8a6040')
  p(14, 4, 2, 14, '#c9b48a')
  p(8, 17, 14, 16, NEGRO); p(9, 18, 12, 14, '#2b2f38'); p(12, 21, 6, 8, '#5aa84f'); p(9, 18, 12, 2, '#4a4f5a')
  p(4, 38, 22, 2, 'rgba(0,0,0,0.2)')
  return c
}

// Banderín con un rayo, junto al campo de fútbol
function banderinRayo() {
  const [c, ctx] = lienzo(18, 36)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  p(2, 0, 2, 36, '#8a919a'); p(4, 2, 13, 12, NEGRO); p(5, 3, 11, 10, '#1f3c9a')
  p(11, 4, 2, 2, '#f2c200'); p(9, 6, 3, 2, '#f2c200'); p(8, 8, 5, 1, '#f2c200'); p(9, 9, 2, 2, '#f2c200'); p(8, 11, 1, 1, '#f2c200')
  p(0, 34, 6, 2, '#5b6068')
  return c
}

export function crearEdificios(scene) {
  for (const [nombre, [w, h, o]] of Object.entries(GENERICOS)) {
    const [c, ctx] = lienzo(w, h)
    casa(ctx, w, h, o)
    EXTRAS[nombre]?.(ctx, w, h)
    scene.textures.addCanvas(nombre, c)
  }
  const especiales = {
    puerta_villa: puertaVilla, muralla, reblan, furgoneta, soportales: plazaMayor, instituto, medac, udit, farola,
    casa_plaza_1: casaPlaza('#e3b98a'), casa_plaza_2: casaPlaza('#d9a184'), casa_plaza_3: casaPlaza('#ecdcb0'),
    banco, papelera, macetero, puesto, coche_rojo: coche('#c8302a'), coche_azul: coche('#2f5fb0'), coche_blanco: coche('#e9ecef'),
    farola_moderna: farolaModerna, aparcabicis, arbusto, casa_pina: casaPina, casa_roca: casaRoca, casa_cabeza: casaCabeza, palmera, quiosco, laguna: laguna(0), laguna_1: laguna(1), laguna_2: laguna(2), medusa, muelle, banderas: banderas(0), banderas_1: banderas(1), avion, flores, arbol_plaza: arbolPlaza, huerto, berenjena, grada, banquillo, recreativos, foco, marcador, anexia, mesa_bar: mesaBar, bicimad,
    bar_silvia: casaBar('#e8c99a', 'BAR SILVIA'), bar_garibalde: casaBar('#ecdcb0', 'GARIBALDE'), bar_burgos: casaBar('#e3b98a', 'BAR BURGOS', 96),
    soportal_lado: casaBar('#d9a184', null), soportal_lado_2: casaBar('#ecdcb0', null), soportal_sur: casaBar('#ecdcb0', null), soportal_sur_2: casaBar('#d9a184', null), remolachas, gelatina, taza_jefe: tazaJefe,
    poste_scranton: posteScranton, pato, cartel404, taza_java: tazaJava, bicho,
    senal_villalpando: senal('VILLALPANDO', false), senal_fin_villalpando: senal('VILLALPANDO', true), senal_madrid: senal('MADRID', false),
    maquina_serpiente: maquina('#1f7a46', 'SNAKE', (p) => { p(1, 2, 6, 1, '#2fbf71'); p(6, 2, 1, 4, '#2fbf71'); p(6, 5, 4, 1, '#2fbf71'); p(10, 6, 1, 1, '#f2c200') }),
    maquina_nave: maquina('#1f3c9a', 'SHOOT', (p) => { p(5, 6, 2, 2, '#3dd9ff'); p(4, 7, 4, 1, '#3dd9ff'); p(2, 1, 2, 2, '#e05a5a'); p(8, 2, 2, 2, '#e05a5a'); p(6, 3, 1, 2, '#7ee2a8') }),
    maquina_ladrillos: maquina('#a83a2a', 'BRICK', (p) => { for (let x = 0; x < 12; x += 3) { p(x, 0, 2, 1, '#f2b33d'); p(x + 1, 2, 2, 1, '#2fbf71') } p(5, 7, 3, 1, '#ffffff'); p(6, 5, 1, 1, '#f2c200') }),
    maquina_laberinto: maquina('#5a3ab0', 'MAZE', (p) => { p(0, 0, 12, 1, '#2f5fb0'); p(0, 8, 12, 1, '#2f5fb0'); p(5, 2, 1, 5, '#2f5fb0'); for (let x = 1; x < 11; x += 2) p(x, 4, 1, 1, '#2fbf71'); p(2, 6, 2, 2, '#f2c200'); p(8, 2, 2, 2, '#e05a5a') }), veleta, telarana, mochila_arana: mochilaArana,
    nube, neumatico, banderin_rayo: banderinRayo, lupa, carritos, senal_p: senalP, cienaga,
    boca_metro_residencia: bocaMetro('RESIDENCIA'), boca_metro_medac: bocaMetro('MEDAC'), boca_metro_udit: bocaMetro('UDIT'), boca_metro_arcade: bocaMetro('ARCADE'),
    neon_arcade: neonArcade(0), neon_arcade_1: neonArcade(1), chalet: chalet('#f2ede2', '#b4553a'), chalet_2: chalet('#dfe3e6', '#4a525c'), bar_arte: barArte, buzon_opiniones: buzonOpiniones, estacion_sur: estacionSur, parada_sur: paradaSur,
  }
  for (const [nombre, dibujar] of Object.entries(especiales)) scene.textures.addCanvas(nombre, dibujar())
  // las palomas tienen dos fotogramas: con la cabeza arriba y picoteando
  const tex = scene.textures.addCanvas('paloma', paloma())
  tex.add(0, 0, 0, 0, 8, 8); tex.add(1, 0, 8, 0, 8, 8)
}
