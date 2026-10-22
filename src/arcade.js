// Sala de recreativos: cuatro minijuegos sencillos en un canvas de 320 × 240 que se abre encima del mapa.
// Serpiente, una nave que destruye bugs, un rompe-ladrillos y un laberinto en el que se recogen commits.
// Se juegan con flechas/WASD + espacio, o con los botones táctiles. El récord de cada uno se guarda en el navegador.
import { estado } from './estado.js'

const W = 320, H = 240
const TEXTOS = {
  es: { record: 'RECORD', puntos: 'PUNTOS', fin: 'FIN DE LA PARTIDA', otra: 'ESPACIO o TOCA para jugar otra', salir: 'Salir', empezar: 'ESPACIO o TOCA para empezar', vidas: 'VIDAS' },
  en: { record: 'BEST', puntos: 'SCORE', fin: 'GAME OVER', otra: 'SPACE or TAP to play again', salir: 'Exit', empezar: 'SPACE or TAP to start', vidas: 'LIVES' },
}
const tx = () => TEXTOS[estado.idioma] || TEXTOS.es

let actual = null
export const enArcade = () => !!actual

// ---------------------------------------------------------------------------------------------- récords
function leerRecord(id) { try { return +(localStorage.getItem(`alexxblaro-record-${id}`) || 0) } catch { return 0 } }
function guardarRecord(id, v) { try { localStorage.setItem(`alexxblaro-record-${id}`, String(v)) } catch { /* sin almacenamiento */ } }

// ---------------------------------------------------------------------------------------------- entrada
const teclas = { izquierda: false, derecha: false, arriba: false, abajo: false, accion: false }
const MAPA = { ArrowLeft: 'izquierda', a: 'izquierda', A: 'izquierda', ArrowRight: 'derecha', d: 'derecha', D: 'derecha', ArrowUp: 'arriba', w: 'arriba', W: 'arriba', ArrowDown: 'abajo', s: 'abajo', S: 'abajo', ' ': 'accion', Enter: 'accion' }
function alPulsar(e) {
  if (!actual) return
  if (e.key === 'Escape') { cerrarArcade(); return }
  const k = MAPA[e.key]
  if (!k) return
  e.preventDefault(); e.stopPropagation()
  if (!teclas[k] && actual.juego.pulsar) actual.juego.pulsar(k)
  teclas[k] = true
}
function alSoltar(e) { const k = MAPA[e.key]; if (k) teclas[k] = false }

// ---------------------------------------------------------------------------------------------- dibujo
function texto(ctx, t, x, y, color = '#e6e9ef', tam = 8, centro = true) {
  ctx.fillStyle = color
  ctx.font = `${tam}px "Press Start 2P", monospace`
  ctx.textAlign = centro ? 'center' : 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(t, x, y)
}

// ---------------------------------------------------------------------------------------------- 1. serpiente
function serpiente() {
  const C = 16, CW = W / C, CH = (H - 16) / C
  let cuerpo, dir, siguiente, comida, reloj, puntos
  const nuevaComida = () => { do { comida = { x: (Math.random() * CW) | 0, y: (Math.random() * CH) | 0 } } while (cuerpo.some((c) => c.x === comida.x && c.y === comida.y)) }
  return {
    titulo: 'SNAKE',
    reiniciar() { cuerpo = [{ x: 6, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 7 }]; dir = siguiente = { x: 1, y: 0 }; reloj = 0; puntos = 0; nuevaComida() },
    pulsar(k) {
      const d = { izquierda: { x: -1, y: 0 }, derecha: { x: 1, y: 0 }, arriba: { x: 0, y: -1 }, abajo: { x: 0, y: 1 } }[k]
      if (d && (d.x !== -dir.x || d.y !== -dir.y)) siguiente = d
    },
    paso(dt) {
      reloj += dt
      const ritmo = Math.max(60, 120 - puntos * 2)
      if (reloj < ritmo) return
      reloj = 0; dir = siguiente
      const cabeza = { x: cuerpo[0].x + dir.x, y: cuerpo[0].y + dir.y }
      if (cabeza.x < 0 || cabeza.y < 0 || cabeza.x >= CW || cabeza.y >= CH || cuerpo.some((c) => c.x === cabeza.x && c.y === cabeza.y)) return puntos
      cuerpo.unshift(cabeza)
      if (cabeza.x === comida.x && cabeza.y === comida.y) { puntos++; nuevaComida() } else cuerpo.pop()
    },
    pintar(ctx) {
      ctx.fillStyle = '#0d1117'; ctx.fillRect(0, 16, W, H - 16)
      ctx.fillStyle = '#161b22'; for (let x = 0; x < CW; x++) for (let y = 0; y < CH; y++) if ((x + y) % 2) ctx.fillRect(x * C, 16 + y * C, C, C)
      ctx.fillStyle = '#f2c200'; ctx.fillRect(comida.x * C + 4, 16 + comida.y * C + 4, 8, 8)
      cuerpo.forEach((c, i) => { ctx.fillStyle = i ? '#2fbf71' : '#7ee2a8'; ctx.fillRect(c.x * C + 1, 16 + c.y * C + 1, C - 2, C - 2) })
      return puntos
    },
  }
}

// ---------------------------------------------------------------------------------------------- 2. nave que destruye bugs
function nave() {
  let x, balas, bugs, reloj, cadencia, puntos, vidas, estrellas
  return {
    titulo: 'BUG SHOOTER',
    reiniciar() {
      x = W / 2; balas = []; bugs = []; reloj = 0; cadencia = 0; puntos = 0; vidas = 3
      estrellas = Array.from({ length: 40 }, () => ({ x: Math.random() * W, y: Math.random() * H, v: 10 + Math.random() * 30 }))
    },
    paso(dt) {
      const s = dt / 1000
      if (teclas.izquierda) x -= 160 * s
      if (teclas.derecha) x += 160 * s
      x = Math.max(10, Math.min(W - 10, x))
      cadencia -= dt
      if (cadencia <= 0) { balas.push({ x, y: H - 30 }); cadencia = 260 } // dispara solo
      balas.forEach((b) => { b.y -= 260 * s }); balas = balas.filter((b) => b.y > 16)
      reloj -= dt
      if (reloj <= 0) { bugs.push({ x: 12 + Math.random() * (W - 24), y: 16, v: 30 + Math.min(70, puntos * 2) + Math.random() * 20 }); reloj = Math.max(350, 1100 - puntos * 20) }
      bugs.forEach((b) => { b.y += b.v * s })
      for (const b of bugs) for (const bala of balas) if (Math.abs(b.x - bala.x) < 9 && Math.abs(b.y - bala.y) < 9) { b.muerto = bala.usada = true; puntos++ }
      for (const b of bugs) if (!b.muerto && (b.y > H - 14 || (Math.abs(b.x - x) < 12 && b.y > H - 34))) { b.muerto = true; vidas-- }
      bugs = bugs.filter((b) => !b.muerto); balas = balas.filter((b) => !b.usada)
      estrellas.forEach((e) => { e.y += e.v * s; if (e.y > H) e.y = 16 })
      if (vidas <= 0) return puntos
    },
    pintar(ctx) {
      ctx.fillStyle = '#05070d'; ctx.fillRect(0, 16, W, H - 16)
      ctx.fillStyle = '#5b6068'; estrellas.forEach((e) => ctx.fillRect(e.x, e.y, 1, 1))
      ctx.fillStyle = '#7ee2a8'; balas.forEach((b) => ctx.fillRect(b.x - 1, b.y - 4, 2, 6))
      for (const b of bugs) {
        // bug: cuerpo rojo con patas
        ctx.fillStyle = '#e05a5a'; ctx.fillRect(b.x - 5, b.y - 4, 10, 8)
        ctx.fillStyle = '#1b1f27'; ctx.fillRect(b.x - 1, b.y - 4, 2, 8); ctx.fillRect(b.x - 8, b.y - 2, 3, 1); ctx.fillRect(b.x + 5, b.y - 2, 3, 1); ctx.fillRect(b.x - 8, b.y + 2, 3, 1); ctx.fillRect(b.x + 5, b.y + 2, 3, 1)
      }
      ctx.fillStyle = '#3dd9ff'; ctx.fillRect(x - 2, H - 32, 4, 6); ctx.fillRect(x - 8, H - 26, 16, 6); ctx.fillRect(x - 11, H - 22, 22, 4)
      ctx.fillStyle = '#f2b33d'; ctx.fillRect(x - 3, H - 18, 6, 2)
      texto(ctx, `${tx().vidas} ${'♥'.repeat(Math.max(0, vidas))}`, W - 6, 4, '#e05a5a', 7, false)
      return puntos
    },
  }
}

// ---------------------------------------------------------------------------------------------- 3. rompe-ladrillos
function ladrillos() {
  let pala, bola, filas, puntos, vidas, lanzada
  const COLORES = ['#e05a5a', '#f2b33d', '#2fbf71', '#3d7be0', '#a970ff']
  const montar = () => { filas = []; for (let f = 0; f < 5; f++) for (let c = 0; c < 10; c++) filas.push({ x: 8 + c * 30.4, y: 34 + f * 12, vivo: true, color: COLORES[f] }) }
  return {
    titulo: 'MERGE BREAKER',
    reiniciar() { pala = W / 2; bola = { x: W / 2, y: H - 30, vx: 90, vy: -150 }; puntos = 0; vidas = 3; lanzada = false; montar() },
    pulsar(k) { if (k === 'accion') lanzada = true },
    paso(dt) {
      const s = dt / 1000
      if (teclas.izquierda) pala -= 200 * s
      if (teclas.derecha) pala += 200 * s
      pala = Math.max(24, Math.min(W - 24, pala))
      if (!lanzada) { bola.x = pala; bola.y = H - 30; if (teclas.arriba) lanzada = true; return }
      bola.x += bola.vx * s; bola.y += bola.vy * s
      if (bola.x < 4 || bola.x > W - 4) bola.vx *= -1
      if (bola.y < 20) bola.vy = Math.abs(bola.vy)
      if (bola.y > H - 24 && bola.y < H - 16 && Math.abs(bola.x - pala) < 26 && bola.vy > 0) { bola.vy = -Math.abs(bola.vy) * 1.02; bola.vx = (bola.x - pala) * 5 }
      for (const l of filas) if (l.vivo && bola.x > l.x && bola.x < l.x + 28 && bola.y > l.y && bola.y < l.y + 9) { l.vivo = false; bola.vy *= -1; puntos++; break }
      if (filas.every((l) => !l.vivo)) { montar(); bola.vy *= 1.1 }
      if (bola.y > H) { vidas--; lanzada = false; bola.vx = 90; bola.vy = -150; if (vidas <= 0) return puntos }
    },
    pintar(ctx) {
      ctx.fillStyle = '#0d1117'; ctx.fillRect(0, 16, W, H - 16)
      for (const l of filas) if (l.vivo) { ctx.fillStyle = l.color; ctx.fillRect(l.x, l.y, 28, 9); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(l.x, l.y, 28, 2) }
      ctx.fillStyle = '#e6e9ef'; ctx.fillRect(pala - 24, H - 22, 48, 5)
      ctx.fillStyle = '#f2c200'; ctx.fillRect(bola.x - 3, bola.y - 3, 6, 6)
      texto(ctx, `${tx().vidas} ${'♥'.repeat(Math.max(0, vidas))}`, W - 6, 4, '#e05a5a', 7, false)
      return puntos
    },
  }
}

// ---------------------------------------------------------------------------------------------- 4. laberinto: caza de commits
// Un juego de persecución en laberinto propio: eres un cursor que recoge commits mientras dos conflictos de merge te buscan
function laberinto() {
  const PLANO = [
    '###################',
    '#........#........#',
    '#.##.###.#.###.##.#',
    '#.................#',
    '#.##.#.#####.#.##.#',
    '#....#...#...#....#',
    '####.###.#.###.####',
    '#.......   .......#',
    '#.##.#.#####.#.##.#',
    '#....#.......#....#',
    '#.##.#.##.##.#.##.#',
    '#.................#',
    '###################',
  ]
  const C = 16, OX = 8, OY = 20
  let mapa, yo, malos, puntos, reloj, quedan
  const libre = (x, y) => PLANO[y] && PLANO[y][x] && PLANO[y][x] !== '#'
  const DIRS = { izquierda: [-1, 0], derecha: [1, 0], arriba: [0, -1], abajo: [0, 1] }
  return {
    titulo: 'COMMIT HUNT',
    reiniciar() {
      mapa = PLANO.map((f) => [...f])
      quedan = mapa.flat().filter((c) => c === '.').length
      yo = { x: 9, y: 11, dir: [0, 0], quiere: [0, 0] }
      malos = [{ x: 9, y: 7, color: '#e05a5a' }, { x: 10, y: 7, color: '#a970ff' }]
      puntos = 0; reloj = 0
    },
    pulsar(k) { if (DIRS[k]) yo.quiere = DIRS[k] },
    paso(dt) {
      reloj += dt
      if (reloj < 150) return
      reloj = 0
      if (libre(yo.x + yo.quiere[0], yo.y + yo.quiere[1])) yo.dir = yo.quiere
      if (libre(yo.x + yo.dir[0], yo.y + yo.dir[1])) { yo.x += yo.dir[0]; yo.y += yo.dir[1] }
      if (mapa[yo.y][yo.x] === '.') { mapa[yo.y][yo.x] = ' '; puntos++; quedan-- }
      if (quedan === 0) { mapa = PLANO.map((f) => [...f]); quedan = mapa.flat().filter((c) => c === '.').length }
      // los conflictos van un poco más lentos que el jugador: se mueven dos de cada tres pasos
      actual.turno = (actual.turno || 0) + 1
      if (actual.turno % 3 === 0) return
      for (const m of malos) {
        // cada conflicto elige la casilla libre que más le acerca al jugador (con algo de azar)
        const opciones = Object.values(DIRS).filter(([dx, dy]) => libre(m.x + dx, m.y + dy))
        opciones.sort((a, b) => Math.hypot(m.x + a[0] - yo.x, m.y + a[1] - yo.y) - Math.hypot(m.x + b[0] - yo.x, m.y + b[1] - yo.y))
        const [dx, dy] = Math.random() < 0.75 ? opciones[0] : opciones[(Math.random() * opciones.length) | 0]
        m.x += dx; m.y += dy
        if (m.x === yo.x && m.y === yo.y) return puntos
      }
    },
    pintar(ctx) {
      ctx.fillStyle = '#0d1117'; ctx.fillRect(0, 16, W, H - 16)
      mapa.forEach((fila, y) => fila.forEach((c, x) => {
        if (c === '#') { ctx.fillStyle = '#1f3c9a'; ctx.fillRect(OX + x * C, OY + y * C, C, C); ctx.fillStyle = '#2f5fb0'; ctx.fillRect(OX + x * C + 2, OY + y * C + 2, C - 4, C - 4) }
        if (c === '.') { ctx.fillStyle = '#2fbf71'; ctx.fillRect(OX + x * C + 6, OY + y * C + 6, 4, 4) }
      }))
      // cursor de texto parpadeante
      ctx.fillStyle = '#f2c200'; ctx.fillRect(OX + yo.x * C + 4, OY + yo.y * C + 2, 8, 12)
      ctx.fillStyle = '#0d1117'; ctx.fillRect(OX + yo.x * C + 6, OY + yo.y * C + 4, 2, 8)
      for (const m of malos) { ctx.fillStyle = m.color; ctx.fillRect(OX + m.x * C + 2, OY + m.y * C + 3, 12, 11); ctx.fillStyle = '#fff'; ctx.fillRect(OX + m.x * C + 4, OY + m.y * C + 6, 3, 3); ctx.fillRect(OX + m.x * C + 9, OY + m.y * C + 6, 3, 3) }
      return puntos
    },
  }
}

const JUEGOS = { serpiente, nave, ladrillos, laberinto }

// ---------------------------------------------------------------------------------------------- ventana del juego
export function abrirArcade(id) {
  if (actual || !JUEGOS[id]) return
  const caja = document.createElement('div')
  caja.id = 'arcade'
  caja.innerHTML = `<div class="arcade-maquina">
      <canvas width="${W}" height="${H}"></canvas>
      <div class="arcade-tactil">
        <button data-t="izquierda" aria-label="izquierda">◀</button><button data-t="arriba" aria-label="arriba">▲</button>
        <button data-t="abajo" aria-label="abajo">▼</button><button data-t="derecha" aria-label="derecha">▶</button>
        <button data-t="accion" class="arcade-a" aria-label="acción">A</button>
      </div>
      <button class="boton" id="arcade-salir">${tx().salir} (Esc)</button>
    </div>`
  document.body.appendChild(caja)
  document.body.classList.add('en-arcade')
  const lienzo = caja.querySelector('canvas')
  const ctx = lienzo.getContext('2d')
  ctx.imageSmoothingEnabled = false
  const juego = JUEGOS[id]()
  juego.reiniciar()
  actual = { id, juego, caja, estado: 'listo', record: leerRecord(id), ultimo: performance.now(), final: 0 }
  Object.keys(teclas).forEach((k) => { teclas[k] = false })

  const empezarOtra = () => {
    if (actual.estado === 'jugando') return
    juego.reiniciar(); actual.estado = 'jugando'
  }
  caja.querySelector('#arcade-salir').onclick = cerrarArcade
  lienzo.addEventListener('pointerdown', empezarOtra)
  caja.querySelectorAll('[data-t]').forEach((b) => {
    const k = b.dataset.t
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); if (k === 'accion') empezarOtra(); if (juego.pulsar) juego.pulsar(k); teclas[k] = true })
    const soltar = (e) => { e.preventDefault(); teclas[k] = false }
    b.addEventListener('pointerup', soltar); b.addEventListener('pointerleave', soltar)
  })
  window.addEventListener('keydown', alPulsar, true)
  window.addEventListener('keyup', alSoltar, true)
  actual.pulsarAccion = (e) => { if (e.key === ' ' || e.key === 'Enter') empezarOtra() }
  window.addEventListener('keydown', actual.pulsarAccion, true)

  const bucle = (ahora) => {
    if (!actual) return
    const dt = Math.min(50, ahora - actual.ultimo)
    actual.ultimo = ahora
    ctx.fillStyle = '#0d1117'; ctx.fillRect(0, 0, W, H)
    if (actual.estado === 'jugando') {
      const fin = juego.paso(dt)
      if (fin !== undefined) {
        actual.estado = 'fin'; actual.final = fin
        if (fin > actual.record) { actual.record = fin; guardarRecord(id, fin) }
      }
    }
    const puntos = juego.pintar(ctx)
    ctx.fillStyle = '#1b1f27'; ctx.fillRect(0, 0, W, 16)
    texto(ctx, juego.titulo, 6, 4, '#2fbf71', 7, false)
    texto(ctx, `${tx().puntos} ${puntos}  ${tx().record} ${actual.record}`, W / 2 + 40, 4, '#e6e9ef', 7)
    if (actual.estado !== 'jugando') {
      ctx.fillStyle = 'rgba(5,7,13,.78)'; ctx.fillRect(0, 16, W, H - 16)
      if (actual.estado === 'fin') { texto(ctx, tx().fin, W / 2, 92, '#e05a5a', 10); texto(ctx, `${tx().puntos} ${actual.final}`, W / 2, 114) }
      else texto(ctx, juego.titulo, W / 2, 96, '#2fbf71', 12)
      texto(ctx, actual.estado === 'fin' ? tx().otra : tx().empezar, W / 2, 140, '#f2c200', 7)
    }
    requestAnimationFrame(bucle)
  }
  requestAnimationFrame(bucle)
}

export function cerrarArcade() {
  if (!actual) return
  window.removeEventListener('keydown', alPulsar, true)
  window.removeEventListener('keyup', alSoltar, true)
  window.removeEventListener('keydown', actual.pulsarAccion, true)
  actual.caja.remove()
  document.body.classList.remove('en-arcade')
  actual = null
}
