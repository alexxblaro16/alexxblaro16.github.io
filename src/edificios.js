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
  anexia: [48, 48, { pared: '#2b2f38', tejado: '#3d7be0', pisos: 2, plano: true, cristal: '#7fc8ff', marco: '#4a5160' }],
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
  const [c, ctx] = lienzo(60, 34)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  const blanco = '#f2f4f6', azul = '#1f3c9a'
  p(4, 31, 52, 3, 'rgba(0,0,0,0.2)')
  // carrocería
  p(2, 7, 44, 1, NEGRO); p(1, 8, 1, 20, NEGRO); p(2, 8, 44, 20, blanco); p(2, 8, 44, 1, '#ffffff')
  p(44, 11, 12, 17, blanco); p(44, 10, 9, 1, NEGRO); p(53, 11, 2, 1, NEGRO); p(55, 12, 1, 3, NEGRO); p(56, 15, 1, 13, NEGRO)
  // cristales
  p(46, 11, 7, 7, '#33476b'); p(53, 12, 2, 6, '#33476b'); p(47, 12, 2, 3, '#7f9fcf')
  p(37, 11, 7, 6, '#33476b'); p(38, 12, 2, 2, '#7f9fcf')
  // vinilo azul con la onda blanca y el nombre
  p(2, 15, 34, 12, azul)
  for (let x = 2; x < 36; x++) { const y = 19 + Math.round(2.5 * Math.sin(x / 5)); p(x, y, 1, 2, '#ffffff') }
  textoCentrado(ctx, 'REBLAN', 19, 9, '#c8202a')
  p(36, 9, 1, 19, '#c9ced5'); p(39, 19, 3, 1, '#9aa3ad')
  // faro, parachoques y bajos
  p(54, 18, 2, 2, '#ffe58a'); p(53, 25, 4, 3, '#9aa3ad'); p(2, 26, 54, 2, '#c9ced5'); p(2, 28, 54, 1, NEGRO)
  // ruedas
  for (const cx of [12, 46]) {
    p(cx - 4, 24, 8, 9, NEGRO); p(cx - 5, 26, 10, 5, NEGRO)
    p(cx - 2, 26, 4, 4, '#9aa3ad'); p(cx - 1, 27, 2, 2, '#5b6068')
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
  const [c, ctx] = lienzo(176, 88)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  const blanco = '#eef1f4'
  // edificio principal
  p(0, 0, 128, 4, '#cfd5db'); p(0, 0, 128, 1, NEGRO)
  p(0, 4, 128, 84, blanco); p(0, 4, 2, 84, '#ffffff'); p(125, 4, 3, 84, '#c9d0d7')
  textoGrande(ctx, 'UDIT', 64, 5, '#15171c', 2)
  for (let y = 18; y < 70; y += 9) {
    for (let x = 6; x < 122; x += 8) {
      p(x, y, 7, 8, ((x + y) / 8) % 2 < 1 ? '#9fc4dd' : '#8db6d3')
      if ((x * 7 + y) % 5 === 0) p(x + 1, y + 1, 2, 1, '#d6ecfa')
    }
    p(6, y + 8, 116, 1, '#2b2f38')
  }
  for (let x = 5; x < 123; x += 8) p(x, 18, 1, 52, '#2b2f38')
  p(5, 17, 118, 1, '#2b2f38')
  p(60, 14, 5, 74, '#15171c') // aleta negra
  // planta baja
  p(4, 72, 120, 14, '#3d4c5c'); p(4, 72, 120, 1, '#15171c')
  for (let x = 6; x < 122; x += 10) { p(x, 74, 8, 12, '#5c7389'); p(x + 1, 75, 2, 4, '#9fc4dd') }
  p(66, 72, 16, 16, '#15171c'); p(68, 74, 12, 14, '#33475e'); p(73, 74, 1, 14, '#15171c')
  p(0, 86, 128, 2, '#9aa3ad')
  // terraza con pérgola blanca, suelo de damero y sillas de colores
  for (let y = 70; y < 88; y += 4) for (let x = 128; x < 176; x += 4) p(x, y, 4, 4, ((x - 128) / 4 + (y - 70) / 4) % 2 ? '#f4f4f4' : '#2b2f38')
  for (const x of [131, 151, 172]) p(x, 46, 1, 30, '#2b2f38')
  p(128, 40, 48, 7, '#f4f6f8'); p(128, 46, 48, 1, '#9aa3ad'); p(128, 40, 48, 1, '#ffffff')
  for (let y = 41; y < 46; y += 2) for (let x = 129 + (y % 4); x < 176; x += 4) p(x, y, 1, 1, '#c3cbd3')
  const silla = (x, col) => { p(x, 74, 3, 1, col); p(x, 71, 1, 4, col); p(x, 75, 1, 3, col); p(x + 2, 75, 1, 3, col) }
  silla(134, '#e05a5a'); silla(142, '#2fb8a8'); silla(156, '#ff8fb0'); silla(164, '#e05a5a')
  for (const x of [138, 160]) { p(x, 75, 5, 1, '#e9ecef'); p(x + 2, 76, 1, 3, '#9aa3ad') }
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

// Avión del Erasmus a Tallin visto desde arriba: fuselaje con ventanillas, alas en flecha con motores,
// cola con los colores de la bandera de Estonia y la escalerilla puesta
function avion() {
  const [c, ctx] = lienzo(96, 64)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(50, 58, 40, 5, 0, 0, Math.PI * 2); ctx.fill()
  // alas en flecha
  const ala = (y0, sentido) => {
    // ala en flecha: cada fila algo más atrás y más estrecha, con borde oscuro y el canto de ataque claro
    for (let i = 0; i < 20; i++) {
      const y = y0 + i * sentido, x = 42 - Math.round(i * 0.9), w = 18 - Math.round(i * 0.45)
      p(x - 1, y, w + 2, 1, '#1b1f27'); p(x, y, w, 1, '#d3d9e0'); p(x + w - 2, y, 2, 1, '#f4f6f8')
    }
    p(42 - 18, y0 + 20 * sentido, 10, 1, '#1b1f27')
    p(34, y0 + 9 * sentido - 2, 10, 5, '#1b1f27'); p(35, y0 + 9 * sentido - 1, 8, 3, '#6a717c'); p(42, y0 + 9 * sentido - 1, 1, 3, '#2b2f38') // motor
  }
  ala(24, -1); ala(39, 1)
  // fuselaje
  p(10, 25, 76, 14, '#1b1f27'); p(11, 26, 74, 12, '#f4f6f8'); p(11, 26, 74, 3, '#ffffff'); p(11, 35, 74, 3, '#d9dee4')
  p(85, 27, 4, 10, '#1b1f27'); p(85, 28, 5, 8, '#f4f6f8'); p(89, 29, 3, 6, '#1b1f27'); p(89, 30, 2, 4, '#e9ecef') // morro
  p(86, 29, 3, 3, '#33476b') // cabina
  p(11, 32, 74, 1, '#2f5fb0') // franja azul
  for (let x = 20; x < 82; x += 5) p(x, 29, 2, 2, '#4a6a9a')
  p(64, 27, 3, 8, '#9aa3ad') // puerta
  // cola con la bandera de Estonia (azul, negro y blanco)
  p(4, 18, 12, 28, '#1b1f27'); p(5, 19, 10, 26, '#f4f6f8')
  p(5, 19, 10, 3, '#0072ce'); p(5, 22, 10, 3, '#15171c'); p(5, 25, 10, 2, '#ffffff')
  p(5, 37, 10, 3, '#0072ce'); p(5, 40, 10, 3, '#15171c')
  p(2, 30, 14, 4, '#1b1f27'); p(3, 31, 12, 2, '#d9dee4')
  // escalerilla
  p(63, 39, 5, 14, '#1b1f27'); p(64, 40, 3, 12, '#f2c200'); for (let y = 42; y < 52; y += 2) p(64, y, 3, 1, '#8a6d00')
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
    farola_moderna: farolaModerna, aparcabicis, arbusto, casa_pina: casaPina, casa_roca: casaRoca, casa_cabeza: casaCabeza, palmera, quiosco, laguna: laguna(0), laguna_1: laguna(1), laguna_2: laguna(2), medusa, muelle, banderas: banderas(0), banderas_1: banderas(1), avion, flores, arbol_plaza: arbolPlaza, huerto, berenjena, grada, banquillo, recreativos, foco, marcador, remolachas, gelatina, taza_jefe: tazaJefe,
    poste_scranton: posteScranton, pato, cartel404, taza_java: tazaJava, bicho,
    senal_villalpando: senal('VILLALPANDO', false), senal_fin_villalpando: senal('VILLALPANDO', true), senal_madrid: senal('MADRID', false),
    maquina_serpiente: maquina('#1f7a46', 'SNAKE', (p) => { p(1, 2, 6, 1, '#2fbf71'); p(6, 2, 1, 4, '#2fbf71'); p(6, 5, 4, 1, '#2fbf71'); p(10, 6, 1, 1, '#f2c200') }),
    maquina_nave: maquina('#1f3c9a', 'SHOOT', (p) => { p(5, 6, 2, 2, '#3dd9ff'); p(4, 7, 4, 1, '#3dd9ff'); p(2, 1, 2, 2, '#e05a5a'); p(8, 2, 2, 2, '#e05a5a'); p(6, 3, 1, 2, '#7ee2a8') }),
    maquina_ladrillos: maquina('#a83a2a', 'BRICK', (p) => { for (let x = 0; x < 12; x += 3) { p(x, 0, 2, 1, '#f2b33d'); p(x + 1, 2, 2, 1, '#2fbf71') } p(5, 7, 3, 1, '#ffffff'); p(6, 5, 1, 1, '#f2c200') }),
    maquina_laberinto: maquina('#5a3ab0', 'MAZE', (p) => { p(0, 0, 12, 1, '#2f5fb0'); p(0, 8, 12, 1, '#2f5fb0'); p(5, 2, 1, 5, '#2f5fb0'); for (let x = 1; x < 11; x += 2) p(x, 4, 1, 1, '#2fbf71'); p(2, 6, 2, 2, '#f2c200'); p(8, 2, 2, 2, '#e05a5a') }), veleta, telarana, mochila_arana: mochilaArana,
  }
  for (const [nombre, dibujar] of Object.entries(especiales)) scene.textures.addCanvas(nombre, dibujar())
  // las palomas tienen dos fotogramas: con la cabeza arriba y picoteando
  const tex = scene.textures.addCanvas('paloma', paloma())
  tex.add(0, 0, 0, 0, 8, 8); tex.add(1, 0, 8, 0, 8, 8)
}
