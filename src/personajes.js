// Personajes de 24 × 32 dibujados por partes (piernas, cuerpo, brazos, cabeza, cara, pelo y accesorios).
// Al final se les pone un contorno del color de cada parte y una sombra en el suelo.
import { lienzo, px, oscurecer, aclarar, mezclar, contorno } from './pixel.js'

export const ANCHO_PJ = 24
export const ALTO_PJ = 32

export const PALETAS = {
  pelo: ['#3b2a20', '#1d1a19', '#5e3c24', '#8a5a38', '#c49a5a', '#e8d29a', '#b0452f', '#9aa3ad', '#3d7be0', '#ff7fb0'],
  piel: ['#fbd9c0', '#f2c29b', '#e5a97f', '#d49a72', '#c98a5e', '#8d5a3b', '#5e3a26'],
  ropa: ['#2fbf71', '#3d7be0', '#1f2a44', '#a970ff', '#e05a5a', '#f2b33d', '#eef1f4', '#2b2f38', '#ff7fb0', '#8a6a4a'],
  pantalon: ['#34466e', '#8fa9cc', '#2b2f38', '#cfc6b0', '#6a6f78', '#5a6b45'],
  zapatillas: ['#f4f4f4', '#2a2d33', '#e05a5a', '#3d7be0'],
}

function colores(r) {
  const S = r.piel, H = r.colorPelo, T = r.ropa, P = r.pantalon || '#34466e', B = r.zapatillas || '#2a2d33'
  return {
    S, s: oscurecer(S, 0.86), m: mezclar(S, '#8a3a34', 0.45), rubor: mezclar(S, '#ff7a7a', 0.25), SL: aclarar(S, 0.4),
    H, L: aclarar(H, 0.26), h: oscurecer(H, 0.62), barba: mezclar(H, S, 0.3),
    T, t: oscurecer(T, 0.8), Tl: aclarar(T, 0.2), I: r.interior || '#d9dde2',
    P, p: oscurecer(P, 0.75), Pl: aclarar(P, 0.15),
    B, b: r.zapatillas ? oscurecer(B, 0.8) : '#e6e8ec', Bo: oscurecer(B, 0.78),
    E0: r.ojos || '#1d1820', E: r.ojos || '#4a3326', G: typeof r.gafas === 'string' ? r.gafas : '#3a3d46', A: '#3dd9ff', metal: '#8d98a5',
  }
}

// ---------------------------------------------------------------------------------------------- pelo
// Rellena una lista de rectángulos [x, y, w, h] con el color base y, si se pide, textura de rizos
function mechones(p, C, rects, rizos = false) {
  for (const [x, y, w, h] of rects) {
    p(x, y, w, h, C.H)
    if (!rizos) continue
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) {
      if ((xx * 3 + yy * 5) % 7 === 0) p(xx, yy, 1, 1, C.L)
      else if ((xx * 5 + yy * 3) % 6 === 0) p(xx, yy, 1, 1, C.h)
    }
  }
}

const PELO = {
  corto: {
    frente(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 4], [6, 8, 3, 1], [10, 8, 2, 1], [14, 8, 4, 1], [6, 9, 1, 2], [17, 9, 1, 2]])
      p(9, 3, 3, 1, C.L); p(8, 4, 2, 1, C.L); p(12, 4, 1, 1, C.L)
      p(15, 5, 3, 3, C.h); p(16, 8, 2, 1, C.h); p(17, 9, 1, 2, C.h); p(7, 7, 1, 1, C.h); p(11, 8, 1, 1, C.h)
    },
    lado(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 4], [6, 8, 3, 1], [12, 8, 1, 2], [13, 8, 5, 6], [14, 14, 3, 1]])
      p(8, 3, 3, 1, C.L); p(7, 4, 2, 1, C.L)
      p(15, 5, 3, 9, C.h); p(13, 12, 2, 2, C.h)
    },
    espalda(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 10], [7, 14, 10, 1]])
      p(9, 3, 3, 1, C.L); p(8, 4, 2, 2, C.L)
      p(15, 5, 3, 9, C.h); p(8, 13, 2, 1, C.h); p(12, 13, 2, 1, C.h)
    },
  },
  // Ondulado con volumen y mechones que caen sobre la frente (Alejandro)
  ondulado: {
    frente(p, C) {
      mechones(p, C, [[9, 1, 2, 1], [13, 1, 3, 1], [7, 2, 10, 1], [6, 3, 12, 1], [5, 4, 14, 4], [5, 8, 3, 1], [9, 8, 4, 1], [15, 8, 4, 1], [5, 9, 2, 1], [10, 9, 2, 1], [17, 9, 2, 1], [5, 10, 1, 2], [18, 10, 1, 2]])
      p(8, 2, 2, 1, C.L); p(10, 3, 2, 1, C.L); p(12, 4, 2, 1, C.L); p(14, 2, 2, 1, C.L); p(7, 5, 2, 1, C.L); p(9, 6, 2, 1, C.L)
      p(16, 5, 3, 3, C.h); p(17, 8, 2, 1, C.h); p(18, 9, 1, 3, C.h); p(11, 9, 1, 1, C.h); p(6, 8, 1, 1, C.h); p(13, 7, 2, 1, C.h); p(5, 7, 1, 1, C.h)
    },
    lado(p, C) {
      mechones(p, C, [[9, 1, 5, 1], [7, 2, 10, 1], [5, 3, 13, 1], [5, 4, 14, 4], [4, 7, 4, 2], [5, 9, 2, 1], [12, 8, 1, 2], [13, 8, 6, 6], [14, 14, 4, 1]])
      p(8, 2, 3, 1, C.L); p(6, 4, 3, 1, C.L); p(9, 5, 2, 1, C.L); p(5, 7, 2, 1, C.L)
      p(15, 4, 4, 10, C.h); p(13, 11, 2, 3, C.h); p(6, 9, 1, 1, C.h)
    },
    espalda(p, C) {
      mechones(p, C, [[9, 1, 2, 1], [13, 1, 3, 1], [7, 2, 10, 1], [6, 3, 12, 1], [5, 4, 14, 9], [6, 13, 3, 2], [10, 13, 4, 2], [15, 13, 3, 1]])
      p(8, 2, 2, 1, C.L); p(10, 3, 2, 1, C.L); p(7, 5, 3, 1, C.L); p(11, 7, 3, 1, C.L); p(8, 9, 2, 1, C.L)
      p(15, 4, 4, 9, C.h); p(7, 12, 2, 1, C.h); p(12, 12, 2, 1, C.h)
    },
  },
  // Rizado cerrado con textura de rizos
  rizado: {
    frente(p, C) {
      mechones(p, C, [[7, 1, 2, 1], [11, 1, 2, 1], [15, 1, 2, 1], [6, 2, 12, 1], [5, 3, 14, 5], [5, 8, 4, 1], [10, 8, 4, 1], [15, 8, 4, 1], [5, 9, 2, 1], [17, 9, 2, 1], [5, 10, 1, 1], [18, 10, 1, 1]], true)
      p(16, 4, 3, 4, C.h)
    },
    lado(p, C) {
      mechones(p, C, [[7, 1, 2, 1], [11, 1, 2, 1], [15, 1, 2, 1], [6, 2, 12, 1], [5, 3, 14, 5], [4, 8, 4, 1], [5, 9, 2, 1], [12, 8, 7, 6], [14, 14, 4, 1]], true)
      p(16, 4, 3, 10, C.h)
    },
    espalda(p, C) {
      mechones(p, C, [[7, 1, 2, 1], [11, 1, 2, 1], [15, 1, 2, 1], [6, 2, 12, 1], [5, 3, 14, 11], [6, 14, 3, 1], [10, 14, 4, 1], [15, 14, 3, 1]], true)
      p(16, 4, 3, 9, C.h)
    },
  },
  largo: {
    frente(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 4], [6, 8, 5, 1], [13, 8, 5, 1], [4, 8, 3, 13], [17, 8, 3, 13], [5, 21, 2, 1], [17, 21, 2, 1]])
      p(9, 3, 3, 1, C.L); p(8, 4, 2, 1, C.L); p(5, 10, 1, 6, C.L)
      p(11, 4, 2, 4, C.h); p(6, 9, 1, 12, C.h); p(17, 9, 1, 12, C.h); p(18, 10, 2, 11, C.h)
    },
    lado(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 4], [6, 8, 3, 1], [12, 8, 7, 13], [13, 21, 5, 1]])
      p(8, 3, 3, 1, C.L); p(7, 4, 2, 1, C.L); p(13, 10, 1, 9, C.L)
      p(16, 5, 3, 16, C.h)
    },
    espalda(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 4], [4, 8, 16, 13], [5, 21, 14, 1]])
      p(9, 3, 3, 1, C.L); p(8, 4, 2, 1, C.L); p(7, 9, 2, 10, C.L)
      p(11, 4, 2, 17, C.h); p(16, 8, 4, 13, C.h)
    },
  },
  // Melena rizada hasta los hombros
  melena: {
    frente(p, C) {
      mechones(p, C, [[7, 1, 2, 1], [11, 1, 2, 1], [15, 1, 2, 1], [6, 2, 12, 1], [5, 3, 14, 5], [5, 8, 4, 1], [15, 8, 4, 1], [3, 8, 4, 12], [17, 8, 4, 12], [4, 20, 3, 1], [17, 20, 3, 1], [2, 11, 1, 6], [21, 11, 1, 6]], true)
      p(6, 9, 1, 11, C.h); p(17, 9, 1, 11, C.h)
    },
    lado(p, C) {
      mechones(p, C, [[7, 1, 2, 1], [11, 1, 2, 1], [15, 1, 2, 1], [6, 2, 12, 1], [5, 3, 14, 5], [4, 8, 4, 1], [11, 8, 9, 12], [12, 20, 7, 1], [20, 11, 1, 6]], true)
      p(17, 5, 3, 15, C.h)
    },
    espalda(p, C) {
      mechones(p, C, [[7, 1, 2, 1], [11, 1, 2, 1], [15, 1, 2, 1], [6, 2, 12, 1], [5, 3, 14, 5], [3, 8, 18, 12], [4, 20, 16, 1], [2, 11, 1, 6], [21, 11, 1, 6]], true)
      p(17, 6, 4, 14, C.h)
    },
  },
  // Melena por los hombros con flequillo de lado y las puntas más claras (Martha)
  media: {
    frente(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 4], [6, 8, 8, 1], [6, 9, 4, 1], [6, 10, 2, 1], [15, 8, 3, 1], [4, 8, 3, 9], [17, 8, 3, 9], [5, 17, 2, 1], [17, 17, 3, 1]])
      p(9, 3, 4, 1, C.L); p(8, 4, 2, 1, C.L); p(11, 5, 2, 1, C.L)
      p(13, 4, 1, 3, C.h); p(6, 11, 1, 6, C.h); p(17, 9, 1, 8, C.h); p(19, 10, 1, 7, C.h)
      p(4, 16, 3, 1, C.L); p(17, 16, 3, 1, C.L); p(5, 17, 2, 1, C.L); p(17, 17, 3, 1, C.L)
    },
    lado(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 4], [5, 8, 6, 1], [5, 9, 3, 1], [12, 8, 7, 9], [13, 17, 5, 1]])
      p(8, 3, 3, 1, C.L); p(7, 4, 2, 1, C.L); p(13, 16, 5, 1, C.L); p(13, 17, 5, 1, C.L)
      p(17, 6, 2, 8, C.h)
    },
    espalda(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 4], [4, 8, 16, 9], [5, 17, 14, 1]])
      p(9, 3, 3, 1, C.L); p(8, 4, 2, 1, C.L); p(5, 16, 14, 2, C.L)
      p(16, 8, 3, 6, C.h)
    },
  },
  // Flequillo recto y desfilado con mechones claros (Dante)
  flequillo: {
    frente(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 5], [6, 9, 2, 1], [9, 9, 2, 1], [13, 9, 3, 1], [16, 9, 2, 1], [5, 6, 1, 5], [18, 6, 1, 5]])
      p(8, 3, 3, 1, C.L); p(7, 5, 1, 3, C.L); p(10, 5, 1, 3, C.L); p(13, 4, 1, 4, C.L); p(15, 6, 1, 2, C.L)
      p(16, 4, 2, 4, C.h); p(9, 8, 1, 1, C.h); p(12, 8, 1, 1, C.h); p(15, 8, 1, 1, C.h); p(18, 8, 1, 3, C.h)
    },
    lado(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 4], [5, 8, 4, 1], [5, 9, 2, 1], [12, 8, 6, 5], [13, 13, 4, 1]])
      p(8, 3, 3, 1, C.L); p(7, 5, 1, 2, C.L); p(10, 5, 1, 3, C.L)
      p(15, 4, 3, 9, C.h)
    },
    espalda(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 10], [7, 14, 10, 1]])
      p(8, 4, 1, 5, C.L); p(11, 3, 1, 6, C.L); p(14, 4, 1, 5, C.L)
      p(15, 5, 3, 8, C.h); p(7, 13, 10, 1, C.h)
    },
  },
  // Liso con raya al medio y flequillo de cortina (Rodrigo)
  cortina: {
    frente(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 3], [6, 7, 5, 1], [6, 8, 4, 1], [6, 9, 3, 1], [6, 10, 2, 1], [13, 7, 5, 1], [14, 8, 4, 1], [15, 9, 3, 1], [16, 10, 2, 1], [5, 6, 1, 8], [18, 6, 1, 8]])
      p(8, 3, 3, 1, C.L); p(7, 4, 2, 1, C.L); p(14, 4, 2, 1, C.L); p(7, 8, 1, 2, C.L)
      p(11, 4, 1, 3, C.h); p(16, 5, 2, 3, C.h); p(18, 9, 1, 5, C.h)
    },
    lado(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 3], [5, 7, 4, 1], [5, 8, 3, 1], [5, 9, 2, 1], [12, 7, 6, 7], [13, 14, 4, 1]])
      p(8, 3, 3, 1, C.L); p(7, 4, 2, 1, C.L)
      p(15, 4, 3, 10, C.h)
    },
    espalda(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 10], [7, 14, 10, 1]])
      p(9, 3, 3, 1, C.L); p(8, 4, 2, 2, C.L)
      p(15, 5, 3, 9, C.h); p(11, 3, 1, 2, C.h)
    },
  },
  // Melena lisa con raya al medio hasta los hombros
  larga: {
    frente(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 3], [6, 7, 5, 1], [6, 8, 3, 1], [13, 7, 5, 1], [15, 8, 3, 1], [4, 6, 3, 12], [17, 6, 3, 12], [5, 18, 2, 1], [17, 18, 2, 1]])
      p(8, 3, 3, 1, C.L); p(7, 4, 2, 1, C.L); p(14, 4, 2, 1, C.L); p(5, 9, 1, 7, C.L)
      p(11, 3, 1, 4, C.h); p(6, 9, 1, 9, C.h); p(17, 9, 1, 9, C.h); p(19, 8, 1, 10, C.h)
    },
    lado(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 3], [5, 7, 4, 1], [5, 8, 2, 1], [12, 7, 7, 11], [13, 18, 5, 1]])
      p(8, 3, 3, 1, C.L); p(13, 9, 1, 8, C.L)
      p(16, 4, 3, 14, C.h)
    },
    espalda(p, C) {
      mechones(p, C, [[8, 2, 8, 1], [7, 3, 10, 1], [6, 4, 12, 4], [4, 7, 16, 11], [5, 18, 14, 1]])
      p(9, 3, 3, 1, C.L); p(7, 8, 2, 9, C.L)
      p(11, 3, 2, 15, C.h); p(17, 7, 3, 11, C.h)
    },
  },
  // Despeinado: pelo de punta arriba y mechones sueltos sobre la frente (Gabriel)
  despeinado: {
    frente(p, C) {
      mechones(p, C, [[7, 0, 1, 2], [10, 0, 2, 2], [14, 0, 1, 2], [16, 1, 1, 2], [6, 1, 12, 2], [5, 3, 14, 5], [5, 8, 3, 1], [9, 8, 2, 2], [12, 8, 3, 1], [16, 8, 3, 1], [5, 9, 1, 2], [18, 9, 1, 2]])
      p(8, 1, 2, 2, C.L); p(11, 2, 2, 2, C.L); p(7, 4, 2, 2, C.L); p(13, 4, 1, 3, C.L)
      p(15, 3, 4, 4, C.h); p(10, 7, 1, 2, C.h); p(14, 7, 1, 1, C.h); p(17, 7, 2, 2, C.h)
    },
    lado(p, C) {
      mechones(p, C, [[8, 0, 1, 2], [11, 0, 2, 2], [15, 1, 1, 2], [6, 1, 12, 2], [5, 3, 14, 5], [4, 7, 3, 2], [5, 9, 1, 1], [12, 8, 6, 5], [13, 13, 4, 1]])
      p(8, 1, 3, 2, C.L); p(6, 4, 2, 2, C.L)
      p(15, 3, 4, 10, C.h)
    },
    espalda(p, C) {
      mechones(p, C, [[7, 0, 1, 2], [10, 0, 2, 2], [14, 0, 1, 2], [6, 1, 12, 2], [5, 3, 14, 10], [7, 13, 10, 1]])
      p(8, 2, 2, 2, C.L); p(11, 3, 2, 3, C.L)
      p(15, 3, 4, 10, C.h); p(7, 12, 10, 1, C.h)
    },
  },
  // Degradado: volumen arriba y los lados muy cortos (Iván)
  degradado: {
    frente(p, C) {
      mechones(p, C, [[8, 1, 8, 1], [7, 2, 10, 1], [6, 3, 12, 4], [6, 7, 4, 1], [11, 7, 3, 1], [15, 7, 3, 1]])
      p(8, 2, 4, 1, C.L); p(7, 3, 3, 1, C.L); p(13, 3, 2, 1, C.L)
      p(15, 4, 3, 3, C.h); p(10, 7, 1, 1, C.h)
      const lado = mezclar(C.h, C.S, 0.55)
      p(6, 8, 1, 3, lado); p(17, 8, 1, 3, lado)
    },
    lado(p, C) {
      mechones(p, C, [[8, 1, 8, 1], [7, 2, 10, 1], [6, 3, 12, 4], [5, 7, 4, 1]])
      p(8, 2, 3, 1, C.L); p(7, 3, 2, 1, C.L)
      p(15, 3, 3, 4, C.h)
      const lado = mezclar(C.h, C.S, 0.55)
      p(12, 7, 6, 5, lado); p(14, 12, 3, 1, lado)
    },
    espalda(p, C) {
      mechones(p, C, [[8, 1, 8, 1], [7, 2, 10, 1], [6, 3, 12, 5]])
      p(8, 2, 4, 1, C.L); p(15, 3, 3, 5, C.h)
      const lado = mezclar(C.h, C.S, 0.55)
      p(6, 8, 12, 5, lado); p(7, 13, 10, 1, lado)
    },
  },
  rapado: {
    frente(p, C) {
      mechones(p, C, [[8, 3, 8, 1], [6, 4, 12, 3], [6, 7, 1, 2], [17, 7, 1, 2]], true)
    },
    lado(p, C) {
      mechones(p, C, [[8, 3, 8, 1], [6, 4, 12, 3], [13, 7, 5, 5]], true)
    },
    espalda(p, C) {
      mechones(p, C, [[8, 3, 8, 1], [6, 4, 12, 10]], true)
    },
  },
  // Calvo: brillo en la coronilla y pelo corto solo por los lados (Pedro)
  calvo: {
    frente(p, C) { p(9, 5, 2, 1, C.SL); p(8, 6, 1, 1, C.SL); p(6, 8, 1, 4, C.H); p(17, 8, 1, 4, C.h) },
    lado(p, C) { p(8, 5, 3, 1, C.SL); p(7, 6, 1, 1, C.SL); p(14, 10, 3, 2, C.H); p(16, 10, 1, 2, C.h) },
    espalda(p, C) { p(9, 5, 3, 1, C.SL); p(6, 10, 12, 3, C.H); p(6, 12, 12, 1, C.h) },
  },
}

// ---------------------------------------------------------------------------------------------- partes del cuerpo
function cabeza(p, C, dir) {
  p(8, 4, 8, 1, C.S); p(7, 5, 10, 1, C.S); p(6, 6, 12, 8, C.S); p(7, 14, 10, 1, C.S); p(8, 15, 8, 1, C.S)
  p(10, 16, 4, 1, C.s) // cuello
  if (dir === 'lado') {
    p(15, 6, 3, 8, C.s); p(14, 14, 3, 1, C.s)
    p(5, 11, 1, 2, C.S) // nariz
    p(12, 10, 2, 2, C.s); p(12, 10, 1, 1, C.S) // oreja
    return
  }
  p(16, 6, 2, 8, C.s); p(15, 14, 2, 1, C.s); p(14, 15, 2, 1, C.s)
  p(5, 10, 1, 2, C.S); p(18, 10, 1, 2, C.s) // orejas
}

function cara(p, C, dir, r) {
  if (dir === 'espalda') return
  const ojos = r.robot ? C.A : C.E
  if (r.ojosFinos) {
    if (dir === 'lado') { p(7, 11, 2, 1, C.E0); p(7, 10, 1, 1, C.s); p(7, 9, 2, 1, C.h); p(9, 12, 1, 1, C.rubor); p(7, 14, 2, 1, C.m); return }
    p(8, 11, 2, 1, C.E0); p(14, 11, 2, 1, C.E0); p(8, 10, 2, 1, C.s); p(14, 10, 2, 1, C.s); p(9, 12, 1, 1, C.s); p(14, 12, 1, 1, C.s)
    p(8, 9, 2, 1, C.h); p(14, 9, 2, 1, C.h); p(12, 12, 1, 1, C.s); p(11, 14, 2, 1, C.m); p(7, 12, 1, 1, C.rubor); p(16, 12, 1, 1, C.rubor)
    return
  }
  if (dir === 'lado') {
    if (r.robot) { p(7, 10, 1, 3, C.A); p(8, 10, 1, 1, '#ffffff'); p(8, 11, 1, 2, ojos) }
    else { p(7, 10, 2, 1, C.E0); p(7, 11, 1, 1, ojos); p(8, 11, 1, 1, '#ffffff'); p(7, 12, 2, 1, ojos); p(8, 12, 1, 1, C.E0) }
    p(7, 9, 2, 1, C.h); p(9, 12, 1, 1, C.rubor); p(7, 14, 2, 1, C.m)
    return
  }
  if (r.robot) {
    p(8, 10, 1, 3, C.A); p(9, 10, 1, 1, '#ffffff'); p(9, 11, 1, 2, ojos)
    p(15, 10, 1, 3, C.A); p(14, 10, 1, 1, '#ffffff'); p(14, 11, 1, 2, ojos)
  } else {
    // párpado, iris con brillo y el borde de abajo un poco más oscuro
    p(8, 10, 2, 1, C.E0); p(8, 11, 1, 1, ojos); p(9, 11, 1, 1, '#ffffff'); p(8, 12, 2, 1, ojos); p(9, 12, 1, 1, C.E0)
    p(14, 10, 2, 1, C.E0); p(14, 11, 1, 1, '#ffffff'); p(15, 11, 1, 1, ojos); p(14, 12, 2, 1, ojos); p(14, 12, 1, 1, C.E0)
  }
  p(8, 9, 2, 1, C.h); p(14, 9, 2, 1, C.h) // cejas
  p(12, 12, 1, 1, C.s); p(11, 12, 1, 1, C.SL) // nariz con su luz
  p(10, 15, 4, 1, C.s) // sombra de la barbilla
  if (r.sonrisa) { p(10, 14, 4, 1, r.labios || C.m); p(11, 14, 2, 1, '#ffffff'); p(10, 13, 1, 1, C.s); p(13, 13, 1, 1, C.s) }
  else p(11, 14, 2, 1, C.m) // boca
  p(7, 12, 1, 1, C.rubor); p(16, 12, 1, 1, C.rubor)
}

function piernas(p0, C, dir, paso, r) {
  // con pantalón corto, por debajo de la fila 26 se ve la rodilla y luego los calcetines
  const p = (x, y, w, h, col) => {
    if (!r.corto || (col !== C.P && col !== C.p && col !== C.Pl)) return p0(x, y, w, h, col)
    for (let yy = y; yy < y + h; yy++) p0(x, yy, w, 1, yy < 26 ? col : yy === 26 ? C.S : (r.calcetines || '#f4f4f4'))
  }
  if (dir === 'lado') {
    const ancho = r.anchos ? 1 : 0
    if (paso === 0) {
      p(9, 24, 6, 5, C.P); p(13, 24, 2, 5, C.p); p(9, 24, 1, 5, C.Pl)
      if (ancho) p(8, 27, 8, 2, C.P)
      p(7, 29, 8, 2, C.B); p(7, 30, 8, 1, C.b)
      return
    }
    // la pierna de atrás va más oscura
    const atras = paso === 1 ? [[12, 24, 3, 1], [13, 25, 3, 1], [14, 26, 3 + ancho, 3]] : [[9, 24, 3, 1], [8, 25, 3, 1], [6 - ancho, 26, 3 + ancho, 3]]
    const delante = paso === 1 ? [[9, 24, 4, 1], [8, 25, 4, 1], [7, 26, 4, 1], [6 - ancho, 27, 4 + ancho, 2]] : [[11, 24, 4, 1], [12, 25, 4, 1], [13, 26, 4 + ancho, 3]]
    atras.forEach(([x, y, w, h]) => p(x, y, w, h, C.p))
    p(...(paso === 1 ? [14, 29, 5, 2] : [4, 29, 5, 2]), C.Bo)
    delante.forEach(([x, y, w, h]) => p(x, y, w, h, C.P))
    p(...(paso === 1 ? [4, 29, 6, 2] : [13, 29, 6, 2]), C.B); p(...(paso === 1 ? [4, 30, 6, 1] : [13, 30, 6, 1]), C.b)
    return
  }
  const izq = paso === 1 ? 4 : 5, der = paso === 2 ? 4 : 5
  p(8, 24, 4, izq, C.P); p(8, 24, 1, izq, C.Pl); p(11, 25, 1, izq - 1, C.p)
  p(12, 24, 4, der, C.P); p(15, 24, 1, der, C.p); p(12, 25, 1, der - 1, C.p)
  if (r.anchos) { p(7, 26, 5, izq - 2, C.P); p(12, 26, 5, der - 2, C.P); p(16, 26, 1, der - 2, C.p); p(7, 26, 1, izq - 2, C.Pl) }
  p(7, 24 + izq, 5, 2, C.B); p(7, 25 + izq, 5, 1, C.b); p(8, 24 + izq, 2, 1, aclarar(C.B, 0.35))
  p(12, 24 + der, 5, 2, C.B); p(12, 25 + der, 5, 1, C.b); p(13, 24 + der, 2, 1, aclarar(C.B, 0.35))
  if (dir === 'frente' && !r.corto) {
    p(8, 24, 8, 1, C.p); p(11, 24, 2, 1, '#c9b37a') // cinturón con hebilla
    p(8, 25, 1, 1, C.Pl); p(15, 25, 1, 1, C.p) // bolsillos
    if (izq === 5) p(9, 27, 1, 1, C.Pl); if (der === 5) p(14, 27, 1, 1, C.Pl) // rodillas
  }
}

function capucha(p, C, dir) {
  if (dir === 'lado') p(14, 14, 3, 4, C.t)
  else p(8, 15, 8, 3, C.t)
}

function cuerpo(p, C, dir, r) {
  const tipo = r.tipo || 'camiseta'
  if (dir === 'lado') {
    p(8, 17, 8, 7, C.T); if (r.robusto) p(7, 17, 10, 7, C.T)
    p(14, 17, r.robusto ? 3 : 2, 7, C.t); p(8, 23, 8, 1, C.t); p(8, 18, 1, 3, C.Tl)
    if (r.rayasV) for (const x of [9, 12]) p(x, 17, 1, 7, r.rayasV)
    if (r.franja) p(8, 19, 8, 2, r.franja)
    if (tipo === 'chaqueta') { p(8, 17, 2, 7, C.I); p(10, 17, 1, 7, C.t) }
    if (tipo === 'polo') p(9, 17, 3, 1, C.Tl)
    if (tipo === 'sudadera') p(8, 21, 4, 2, C.t)
    return
  }
  p(8, 17, 8, 1, C.T); p(7, 18, 10, 6, C.T)
  if (r.robusto) { p(7, 17, 10, 1, C.T); p(6, 18, 12, 6, C.T); p(16, 18, 2, 6, C.t); p(6, 23, 12, 1, C.t); p(7, 18, 1, 3, C.Tl) }
  else { p(15, 18, 2, 6, C.t); p(7, 23, 10, 1, C.t); p(8, 18, 1, 3, C.Tl) }
  // pliegues: dos trazos en diagonal y el dobladillo de abajo con algo de luz
  p(9, 21, 1, 1, C.t); p(10, 22, 1, 1, C.t); p(14, 20, 1, 2, C.t); p(8, 23, 7, 1, oscurecer(C.T, 0.7))
  if (r.rayasV) for (const x of [8, 11, 14]) p(x, 18, 1, 6, r.rayasV)
  if (r.franja) p(r.robusto ? 6 : 7, 19, r.robusto ? 12 : 10, 2, r.franja)
  if (dir === 'espalda') return
  if (tipo === 'camiseta') { p(10, 17, 4, 1, C.s); p(9, 17, 1, 1, C.t); p(14, 17, 1, 1, C.t) }
  if (tipo === 'polo') { p(10, 17, 4, 1, C.s); p(9, 17, 1, 1, C.Tl); p(14, 17, 1, 1, C.Tl); p(11, 18, 2, 2, C.t) }
  if (tipo === 'sudadera') { p(10, 18, 1, 3, C.Tl); p(13, 18, 1, 3, C.Tl); p(9, 21, 6, 2, C.t) }
  if (tipo === 'chaqueta') {
    p(10, 17, 4, 7, C.I)
    if (r.rayas) for (let y = 18; y < 24; y += 2) p(10, y, 4, 1, r.rayas)
    p(10, 17, 1, 7, C.t); p(13, 17, 1, 7, C.t); p(9, 17, 1, 5, C.Tl); p(14, 17, 1, 5, C.Tl)
  }
}

function brazos(p, C, dir, paso, r) {
  const corta = !['sudadera', 'chaqueta'].includes(r.tipo)
  if (dir === 'lado') {
    // el brazo de este lado se balancea al andar
    const [x, mano] = paso === 1 ? [8, [7, 22]] : paso === 2 ? [12, [14, 22]] : [10, [11, 22]]
    p(x, 18, 3, corta ? 2 : 4, C.T); if (corta) p(x, 20, 3, 2, C.S)
    p(x + 2, 18, 1, corta ? 2 : 4, C.t)
    p(mano[0], mano[1], 2, 2, C.S); p(mano[0] + 1, mano[1] + 1, 1, 1, C.s)
    return
  }
  for (const [x, sombra] of r.robusto ? [[3, 3], [19, 20]] : [[4, 4], [18, 19]]) {
    p(x, 18, 2, corta ? 2 : 5, C.T); p(sombra, 18, 1, corta ? 2 : 5, C.t)
    if (corta) { p(x, 19, 2, 1, C.t); p(x, 20, 2, 3, C.S); p(sombra, 20, 1, 3, C.s) }
    else p(x, 22, 2, 1, C.t) // puño de la manga larga
    p(x, 23, 2, 1, C.S); p(sombra, 23, 1, 1, C.s)
  }
}

function accesorios(p, C, dir, r) {
  if (r.barba && dir !== 'espalda') {
    // barba poco poblada: puntos sueltos por la mandíbula y un bigote fino
    const rala = mezclar(C.barba, C.S, 0.35)
    if (r.barba === 'rala' && dir === 'lado') { for (const [x, y] of [[7, 13], [9, 13], [8, 14], [10, 14], [12, 13], [11, 12], [8, 15], [10, 15], [12, 15]]) p(x, y, 1, 1, rala) }
    else if (r.barba === 'rala') { for (const [x, y] of [[6, 12], [17, 12], [7, 13], [16, 13], [8, 14], [15, 14], [9, 15], [14, 15], [11, 15], [12, 15], [10, 13], [13, 13]]) p(x, y, 1, 1, rala) }
    else if (dir === 'lado') { p(7, 13, 6, 2, C.barba); p(8, 15, 5, 1, C.barba); p(11, 11, 2, 2, C.barba) }
    else if (r.barba === 'perilla') { p(10, 13, 4, 1, C.barba); p(10, 15, 4, 1, C.barba); p(11, 14, 2, 1, C.barba) }
    else { p(6, 12, 1, 2, C.barba); p(17, 12, 1, 2, C.barba); p(7, 13, 10, 2, C.barba); p(8, 15, 8, 1, C.barba) }
    if (dir === 'lado') p(7, 14, 2, 1, C.m); else p(11, 14, 2, 1, C.m)
  }
  if (r.gafas && dir === 'frente') {
    for (const x of [7, 13]) { p(x, 9, 4, 1, C.G); p(x, 13, 4, 1, C.G); p(x, 10, 1, 3, C.G); p(x + 3, 10, 1, 3, C.G) }
    p(11, 10, 2, 1, C.G)
  }
  if (r.gafas && dir === 'lado') { p(6, 9, 4, 1, C.G); p(6, 13, 4, 1, C.G); p(9, 10, 1, 3, C.G); p(10, 10, 3, 1, C.G) }
  // la cadena se oscurece un poco sobre camisetas claras para que se vea
  const plata = r.ropa && parseInt(r.ropa.slice(1), 16) > 0xcccccc ? ['#8e98a3', '#5f6873'] : ['#d6dce3', '#aab3bd']
  if (r.cadena && dir === 'frente') { p(9, 17, 1, 1, plata[0]); p(14, 17, 1, 1, plata[0]); p(10, 18, 1, 1, plata[0]); p(13, 18, 1, 1, plata[0]); p(11, 19, 2, 1, plata[1]) }
  if (r.cadena && dir === 'lado') { p(8, 17, 1, 1, plata[0]); p(9, 18, 1, 1, plata[1]) }
  if (r.logo && dir === 'frente') p(13, 19, 2, 1, r.logo)
  // bolso cruzado: correa en diagonal y el bolso a la altura de la cadera
  if (r.bolso && dir === 'frente') { for (let i = 0; i < 6; i++) p(9 + i, 17 + i, 1, 1, '#3a2a20'); p(14, 22, 4, 3, r.bolso); p(14, 22, 4, 1, aclarar(r.bolso, 0.25)); p(16, 23, 1, 1, '#d6c070') }
  if (r.bolso && dir === 'lado') { p(10, 17, 1, 4, '#3a2a20'); p(12, 21, 4, 3, r.bolso); p(12, 21, 4, 1, aclarar(r.bolso, 0.25)) }
  if (r.bolso && dir === 'espalda') for (let i = 0; i < 6; i++) p(14 - i, 17 + i, 1, 1, '#3a2a20')
  if (r.robot) {
    p(11, 1, 2, 3, C.metal); p(11, 0, 2, 1, C.A)
    if (dir === 'frente') { p(7, 13, 1, 1, '#5b6470'); p(16, 13, 1, 1, '#5b6470'); p(10, 14, 4, 1, '#2b2f38'); p(11, 14, 2, 1, C.A); p(11, 19, 2, 2, '#ffffff'); p(10, 19, 1, 2, '#1d6f86'); p(13, 19, 1, 2, '#1d6f86') }
    if (dir === 'lado') { p(12, 10, 2, 2, '#5b6470'); p(7, 14, 2, 1, '#2b2f38') }
  }
  if (r.portatil) {
    // portátil con pegatinas de Java, React y Python
    if (dir === 'frente') { p(19, 19, 4, 6, '#2b2f38'); p(20, 20, 2, 4, '#aeb6c0'); p(20, 20, 1, 1, '#f89820'); p(21, 22, 1, 1, '#61dafb'); p(20, 23, 1, 1, '#3776ab') }
    if (dir === 'espalda') p(1, 19, 4, 6, '#2b2f38')
  }
}

function dibujar(ctx, dir, paso, r, C) {
  const p = (x, y, w, h, c) => px(ctx, x, y, c, w, h)
  // en cada paso el cuerpo baja un píxel y las piernas se quedan: así se nota el peso al andar
  const baja = paso ? 1 : 0
  const q = (x, y, w, h, c) => px(ctx, x, y + baja, c, w, h)
  const pelo = PELO[r.pelo] || PELO.corto
  piernas(p, C, dir, paso, r)
  if (r.tipo === 'sudadera') capucha(q, C, dir)
  cuerpo(q, C, dir, r)
  brazos(q, C, dir, paso, r)
  cabeza(q, C, dir)
  cara(q, C, dir, r)
  pelo[dir](q, C)
  accesorios(q, C, dir, r)
}

// Hoja de 3 columnas (quieto, paso 1, paso 2) × 4 filas (abajo, izquierda, derecha, arriba)
export function crearPersonaje(scene, clave, rasgos) {
  if (scene.textures.exists(clave)) scene.textures.remove(clave)
  const W = ANCHO_PJ, A = ALTO_PJ
  const r = { ...rasgos, barba: rasgos.barba === true ? 'completa' : rasgos.barba, robot: rasgos.robot || rasgos.antena }
  const C = colores(r)
  const [hoja, hctx] = lienzo(W * 3, A * 4)
  const filas = [['frente', false], ['lado', false], ['lado', true], ['espalda', false]]
  filas.forEach(([dir, espejo], fila) => {
    for (let paso = 0; paso < 3; paso++) {
      const [c, ctx] = lienzo(W, A)
      dibujar(ctx, dir, paso, r, C)
      contorno(ctx, W, A)
      // sombra en el suelo, por detrás de todo
      ctx.globalCompositeOperation = 'destination-over'
      px(ctx, 7, 30, 'rgba(0,0,0,0.22)', 10, 1); px(ctx, 8, 31, 'rgba(0,0,0,0.22)', 8, 1)
      hctx.save()
      if (espejo) { hctx.translate(paso * W + W, fila * A); hctx.scale(-1, 1); hctx.drawImage(c, 0, 0) }
      else hctx.drawImage(c, paso * W, fila * A)
      hctx.restore()
    }
  })
  const tex = scene.textures.addCanvas(clave, hoja)
  let i = 0
  for (let fila = 0; fila < 4; fila++) for (let col = 0; col < 3; col++) tex.add(i++, 0, col * W, fila * A, W, A)
  return clave
}
