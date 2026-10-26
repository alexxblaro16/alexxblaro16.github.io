// Utilidades de pixel art compartidas: lienzos, rectángulos, colores, contorno automático y una fuente diminuta.

export function lienzo(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  ctx.imageSmoothingEnabled = false
  return [c, ctx]
}

export function px(ctx, x, y, color, w = 1, h = 1) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
}

const rgb = (hex) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255] }
const hex = (c) => `#${c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`

export function oscurecer(color, f = 0.7) { return hex(rgb(color).map((v) => v * f)) }
// Aclara mezclando con blanco (sirve también para colores casi negros)
export function aclarar(color, f = 0.25) { return hex(rgb(color).map((v) => v + (255 - v) * f)) }
export function mezclar(a, b, f = 0.5) { const [x, y] = [rgb(a), rgb(b)]; return hex(x.map((v, i) => v + (y[i] - v) * f)) }

// Ruido determinista para que el decorado no cambie cada vez que se carga
export function azar(semilla) {
  let s = semilla
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280)
}

// Ruido suave en 2D (de 0 a 1) para repartir manchas de hierba o tipos de árbol por zonas, siempre igual
export function ruido2D(semilla) {
  const h = (x, y) => {
    let n = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(semilla, 1442695041)) | 0
    n = Math.imul(n ^ (n >>> 13), 1274126177)
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295
  }
  const suave = (t) => t * t * (3 - 2 * t)
  return (x, y, escala) => {
    const gx = x / escala, gy = y / escala, x0 = Math.floor(gx), y0 = Math.floor(gy)
    const u = suave(gx - x0), v = suave(gy - y0)
    const a = h(x0, y0), b = h(x0 + 1, y0), c = h(x0, y0 + 1), d = h(x0 + 1, y0 + 1)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
  }
}

// Contorno de 1 px alrededor de todo lo pintado, del color de lo que rodea pero mucho más oscuro
export function contorno(ctx, w, h, fuerza = 0.38) {
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  const salida = new Uint8ClampedArray(d)
  const opaco = (x, y) => x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 200
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      if (d[i + 3] > 0) continue
      const vecino = [[0, -1], [-1, 0], [1, 0], [0, 1]].find(([dx, dy]) => opaco(x + dx, y + dy))
      if (!vecino) continue
      const j = ((y + vecino[1]) * w + x + vecino[0]) * 4
      salida[i] = d[j] * fuerza + 22 * (1 - fuerza)
      salida[i + 1] = d[j + 1] * fuerza + 18 * (1 - fuerza)
      salida[i + 2] = d[j + 2] * fuerza + 30 * (1 - fuerza)
      salida[i + 3] = 255
    }
  }
  ctx.putImageData(new ImageData(salida, w, h), 0, 0)
}

// Fuente de 3 × 5 (la M, la N y la W ocupan 5) para escribir letreros dentro de los dibujos
const LETRAS = {
  A: ['.#.', '#.#', '###', '#.#', '#.#'], B: ['##.', '#.#', '##.', '#.#', '##.'], C: ['.##', '#..', '#..', '#..', '.##'],
  D: ['##.', '#.#', '#.#', '#.#', '##.'], E: ['###', '#..', '##.', '#..', '###'], F: ['###', '#..', '##.', '#..', '#..'],
  G: ['.##', '#..', '#.#', '#.#', '.##'], H: ['#.#', '#.#', '###', '#.#', '#.#'], I: ['###', '.#.', '.#.', '.#.', '###'],
  J: ['..#', '..#', '..#', '#.#', '.#.'], K: ['#.#', '#.#', '##.', '#.#', '#.#'], L: ['#..', '#..', '#..', '#..', '###'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'], N: ['#..#', '##.#', '#.##', '#..#', '#..#'], O: ['.#.', '#.#', '#.#', '#.#', '.#.'],
  P: ['##.', '#.#', '##.', '#..', '#..'], R: ['##.', '#.#', '##.', '#.#', '#.#'], S: ['.##', '#..', '.#.', '..#', '##.'],
  T: ['###', '.#.', '.#.', '.#.', '.#.'], U: ['#.#', '#.#', '#.#', '#.#', '###'], V: ['#.#', '#.#', '#.#', '#.#', '.#.'],
  W: ['#...#', '#...#', '#.#.#', '##.##', '#...#'], X: ['#.#', '#.#', '.#.', '#.#', '#.#'], Y: ['#.#', '#.#', '.#.', '.#.', '.#.'],
  Z: ['###', '..#', '.#.', '#..', '###'], ' ': ['..', '..', '..', '..', '..'], '.': ['.', '.', '.', '.', '#'],
  0: ['###', '#.#', '#.#', '#.#', '###'], 1: ['.#.', '##.', '.#.', '.#.', '###'], 2: ['##.', '..#', '.#.', '#..', '###'],
  3: ['##.', '..#', '.#.', '..#', '##.'], 4: ['#.#', '#.#', '###', '..#', '..#'], 5: ['###', '#..', '##.', '..#', '##.'],
  6: ['.##', '#..', '###', '#.#', '###'], 7: ['###', '..#', '.#.', '.#.', '.#.'], 8: ['###', '#.#', '###', '#.#', '###'],
  9: ['###', '#.#', '###', '..#', '##.'], '-': ['...', '...', '###', '...', '...'],
}

// Las letras con tilde y la Ñ se dibujan con su letra base y la marca encima (en las dos filas de arriba)
const base = (ch) => ch.normalize('NFD')[0]

export function anchoTexto(texto) {
  return [...texto.toUpperCase()].reduce((a, ch) => a + (LETRAS[base(ch)] || LETRAS[' '])[0].length + 1, -1)
}

export function texto(ctx, cadena, x, y, color) {
  let cx = x
  for (const ch of cadena.toUpperCase()) {
    const b = base(ch)
    const g = LETRAS[b] || LETRAS[' ']
    g.forEach((fila, fy) => [...fila].forEach((c, fx) => { if (c === '#') px(ctx, cx + fx, y + fy, color) }))
    if (ch === 'Ñ') { px(ctx, cx, y - 1, color); px(ctx, cx + 1, y - 2, color); px(ctx, cx + 2, y - 1, color); px(ctx, cx + 3, y - 2, color) }
    else if (ch !== b) { px(ctx, cx + 1, y - 1, color); px(ctx, cx + 2, y - 2, color) }
    cx += g[0].length + 1
  }
}

// Texto centrado en x
export function textoCentrado(ctx, cadena, cx, y, color) { texto(ctx, cadena, Math.round(cx - anchoTexto(cadena) / 2), y, color) }
