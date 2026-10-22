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
// Ventana con marco claro, cristal en dos tonos, un brillo en diagonal y alféizar
function ventana(ctx, x, y, o) {
  const cristal = o.cristal || '#9fd3ff'
  px(ctx, x, y, NEGRO, 8, 9)
  px(ctx, x + 1, y + 1, o.marco || '#f4f1ea', 6, 7)
  px(ctx, x + 2, y + 2, cristal, 4, 5)
  px(ctx, x + 2, y + 5, oscurecer(cristal, 0.82), 4, 2)
  px(ctx, x + 2, y + 2, aclarar(cristal, 0.55), 1, 2); px(ctx, x + 3, y + 2, aclarar(cristal, 0.55))
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

const GENERICOS = {
  piso: [48, 64, { pared: '#e3cfa6', tejado: '#9b4a35', pisos: 3, plano: true, cruz: true, macetas: true }],
  residencia: [96, 72, { pared: '#c96b4f', tejado: '#5b2f25', pisos: 4, ladrillo: true, plano: true, puertaAncha: true, macetas: true }],
  anexia: [48, 48, { pared: '#2b2f38', tejado: '#3d7be0', pisos: 2, plano: true, cristal: '#7fc8ff', marco: '#4a5160' }],
  laboratorio: [64, 56, { pared: '#dfe6ee', tejado: '#2fbf71', pisos: 2, plano: true, franja: '#2fbf71', puertaAncha: true }],
  trofeos: [64, 56, { pared: '#f6e7b4', tejado: '#c9962b', pisos: 2, puertaAncha: true, marco: '#c9962b', farol: true }],
  terminal: [48, 48, { pared: '#1b1f27', tejado: '#2fbf71', plano: true, cristal: '#2fbf71', pisos: 2, marco: '#2b2f38' }],
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
    if (mitad > 0) p(64 - mitad, y, mitad * 2, 1, y > 84 ? '#c9ae80' : y > 78 ? '#5e4a33' : '#2b2119')
  }
  for (let y = 56; y < 100; y += 5) { p(48, y, 3, 1, sombra); p(77, y, 3, 1, sombra) }
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
  for (const x of [58, 68]) { p(x, 13, 4, 6, '#2f3f52'); p(x - 1, 14, 6, 4, '#2f3f52'); p(x, 14, 1, 1, '#8fb0c8') }
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
  p(13, 54, 7, 9, '#e9ecef'); p(15, 52, 3, 3, '#e5a97f'); p(14, 64, 5, 1, '#ffffff'); p(14, 67, 5, 1, '#ffffff'); p(14, 70, 3, 1, '#ffffff')
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
  for (let y = 70; y < 88; y += 4) for (let x = 128; x < 176; x += 4) p(x, y, 4, 4, ((x + y) / 4) % 2 ? '#f4f4f4' : '#2b2f38')
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

export function crearEdificios(scene) {
  for (const [nombre, [w, h, o]] of Object.entries(GENERICOS)) {
    const [c, ctx] = lienzo(w, h)
    casa(ctx, w, h, o)
    scene.textures.addCanvas(nombre, c)
  }
  const especiales = { puerta_villa: puertaVilla, reblan, furgoneta, soportales: plazaMayor, instituto, medac, udit, farola }
  for (const [nombre, dibujar] of Object.entries(especiales)) scene.textures.addCanvas(nombre, dibujar())
}
