// El viaje en Monbus entre Villalpando y Madrid: una escena corta a pantalla completa con el autocar por la
// carretera, la meseta pasando por detrás y los kilómetros que suben. Se dibuja en un lienzo de 320 × 180
// escalado sin suavizar, como el resto del juego.
import { estado } from './estado.js'
import { sonar } from './sonido.js'
import { textoCentrado } from './pixel.js'

const DURACION = 3400
const KM = 230 // Villalpando – Madrid por carretera, más o menos

export function animarViaje(imgBus, ida) {
  return new Promise((resolver) => {
    const capa = document.createElement('div')
    capa.id = 'viaje'
    const lienzo = document.createElement('canvas')
    lienzo.width = 320; lienzo.height = 180
    const en = estado.idioma === 'en'
    const [de, a] = ida ? ['VILLALPANDO', 'MADRID'] : ['MADRID', 'VILLALPANDO']
    capa.innerHTML = `<p class="viaje-ruta">${de} &rarr; ${a}</p><p class="viaje-km"></p><p class="viaje-sub">${ida ? (en ? 'Arriving at Estación Sur · Méndez Álvaro' : 'Llegada: Estación Sur · Méndez Álvaro') : (en ? 'Arriving in Villalpando' : 'Llegada: Villalpando')}</p>`
    capa.prepend(lienzo)
    document.body.append(capa)
    requestAnimationFrame(() => capa.classList.add('visible'))
    const ctx = lienzo.getContext('2d')
    ctx.imageSmoothingEnabled = false
    const km = capa.querySelector('.viaje-km')
    const r = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h) }
    const sentido = ida ? -1 : 1 // hacia dónde se va el paisaje
    const envolver = (v, m) => ((v % m) + m) % m
    const t0 = performance.now()
    // el motor: un zumbido grave a pulsos mientras dura el viaje
    for (let i = 0; i < 12; i++) sonar(70 + (i % 2) * 6, 0.22, 'sawtooth', 0.025, i * 0.25)
    const pintar = (ahora) => {
      const t = ahora - t0, k = Math.min(1, t / DURACION)
      const dx = t * 0.12 * sentido
      // cielo de la meseta, de azul arriba a casi blanco en el horizonte
      for (let y = 0; y < 96; y += 4) r(0, y, 320, 4, `rgb(${120 + y}, ${170 + y * 0.6}, ${235 - y * 0.2})`)
      r(250, 22, 14, 14, '#fff3b0'); r(252, 20, 10, 18, '#fff3b0'); r(248, 24, 18, 10, '#fff3b0')
      // nubes que pasan despacio
      for (let i = 0; i < 4; i++) { const x = envolver(i * 97 + dx * 0.15, 400) - 40; r(x, 18 + i * 9, 34, 6, '#ffffff'); r(x + 6, 14 + i * 9, 20, 4, '#ffffff') }
      // lomas lejanas y campos de cereal (la Tierra de Campos) y luego la sierra al acercarse a Madrid
      const sierra = ida ? k : 1 - k
      for (let x = 0; x < 320; x += 2) {
        const h = 10 + Math.sin((x - dx * 0.25) / 23) * 4 + Math.sin((x - dx * 0.25) / 9) * 2 + sierra * (14 + Math.sin((x - dx * 0.25) / 15) * 8)
        r(x, 96 - h, 2, h, sierra > 0.5 ? '#7d8fa8' : '#9aa88a')
      }
      r(0, 96, 320, 30, '#d8c27a')
      for (let y = 98; y < 126; y += 5) for (let x = envolver(dx * 0.5 + y * 3, 12) - 12; x < 320; x += 12) r(x, y, 6, 1, '#c4ab62')
      // chopos y postes de la luz junto a la carretera
      for (let i = 0; i < 6; i++) { const x = envolver(i * 61 + dx * 0.8, 380) - 30; r(x + 3, 104, 2, 20, '#6b4a2b'); r(x, 88, 8, 18, '#3f8a46'); r(x + 1, 86, 6, 2, '#4f9e4a') }
      for (let i = 0; i < 4; i++) { const x = envolver(i * 90 + dx, 360) - 20; r(x, 90, 2, 36, '#7a6a5a'); r(x - 5, 92, 12, 1, '#5b5048') }
      // carretera con la línea discontinua que corre
      r(0, 126, 320, 34, '#4a4e57'); r(0, 126, 320, 2, '#e9ecef'); r(0, 158, 320, 2, '#e9ecef')
      for (let x = envolver(dx * 1.6, 28) - 28; x < 320; x += 28) r(x, 142, 14, 2, '#f2f3f5')
      r(0, 160, 320, 20, '#c9b46c')
      // el autocar, con un botecito
      const bote = Math.floor(t / 120) % 2
      ctx.save()
      const bx = 118, by = 124 + bote
      if (ida) ctx.drawImage(imgBus, bx, by)
      else { ctx.translate(bx + imgBus.width, by); ctx.scale(-1, 1); ctx.drawImage(imgBus, 0, 0) }
      ctx.restore()
      km.textContent = `${Math.round(k * KM)} km`
      if (t < DURACION) requestAnimationFrame(pintar)
      else {
        capa.classList.remove('visible')
        setTimeout(() => { capa.remove(); resolver() }, 350)
      }
    }
    requestAnimationFrame(pintar)
  })
}

// ---------------------------------------------------------------------------------------------- el metro
// Viaje en metro entre dos paradas de la línea: el tren por el túnel, las luces que pasan, cada estación de azulejo
// blanco que se cruza (con su nombre) y abajo el plano de la línea con el punto que avanza de parada en parada
const POR_TRAMO = 1900 // milisegundos entre dos paradas seguidas

export function animarMetro(paradas, desde, hasta) {
  return new Promise((resolver) => {
    const capa = document.createElement('div')
    capa.id = 'viaje'
    const lienzo = document.createElement('canvas')
    lienzo.width = 320; lienzo.height = 180
    capa.innerHTML = `<p class="viaje-ruta">METRO · ${paradas[desde].nombre.toUpperCase()} &rarr; ${paradas[hasta].nombre.toUpperCase()}</p><p class="viaje-km"></p>`
    capa.prepend(lienzo)
    document.body.append(capa)
    requestAnimationFrame(() => capa.classList.add('visible'))
    const ctx = lienzo.getContext('2d')
    ctx.imageSmoothingEnabled = false
    const aviso = capa.querySelector('.viaje-km')
    const r = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h) }
    const tramos = Math.abs(hasta - desde), sentido = Math.sign(hasta - desde)
    const DURACION = tramos * POR_TRAMO + 600
    const suave = (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2)
    const t0 = performance.now()
    // el pitido de cierre de puertas y el traqueteo
    ;[0, 0.14, 0.28, 0.42].forEach((d) => sonar(1480, 0.08, 'square', 0.03, d))
    for (let i = 0; i < Math.ceil(DURACION / 260); i++) sonar(55 + (i % 3) * 8, 0.16, 'sawtooth', 0.022, 0.6 + i * 0.26)
    const pintar = (ahora) => {
      const t = ahora - t0, k = Math.min(1, t / DURACION)
      const pos = desde + (hasta - desde) * suave(k) // por dónde va el tren, en paradas (puede ser 0,5…)
      const dx = pos * 1400 * sentido
      // túnel: pared oscura con cables y luces que pasan
      r(0, 0, 320, 180, '#14161c')
      r(0, 30, 320, 2, '#2b2f38'); r(0, 36, 320, 1, '#3a3f48'); r(0, 40, 320, 1, '#2b2f38')
      for (let x = ((-dx * 0.9) % 70 + 70) % 70 - 70; x < 320; x += 70) { r(x, 46, 6, 3, '#f2d27a'); r(x - 2, 45, 10, 5, 'rgba(242,210,122,0.18)') }
      // las estaciones: un andén de azulejo blanco con el cartel azul de la parada, que pasa con el túnel
      paradas.forEach((pa, i) => {
        const cx = 160 - (pos - i) * 1400 * sentido
        if (cx < -260 || cx > 580) return
        const x0 = cx - 210
        r(x0, 34, 420, 96, '#e9edf0')
        for (let y = 36; y < 128; y += 6) for (let x = x0 + ((y / 6) % 2) * 5; x < x0 + 420; x += 10) r(x, y, 9, 5, '#f8fafb')
        r(x0, 34, 420, 3, '#9aa3ad'); r(x0, 126, 420, 4, '#c8302a')
        for (const sx of [x0 + 40, x0 + 300]) { r(sx, 46, 80, 14, '#1f4e9b'); r(sx + 1, 47, 78, 1, '#4f7fc8'); textoMetro(ctx, pa.nombre.toUpperCase(), sx + 40, 51, '#ffffff') }
        // el rombo del metro en la pared
        r(cx - 4, 44, 8, 2, '#c8302a'); r(cx - 6, 46, 12, 4, '#1f4e9b'); r(cx - 4, 50, 8, 2, '#c8302a')
      })
      // vía
      r(0, 150, 320, 30, '#2b2f38'); for (let x = ((-dx) % 16 + 16) % 16 - 16; x < 320; x += 16) r(x, 156, 10, 3, '#4a3a2a'); r(0, 154, 320, 1, '#8a919a'); r(0, 160, 320, 1, '#8a919a')
      // el tren: tres coches blancos con la franja azul y roja, ventanas iluminadas con gente dentro
      const bote = Math.floor(t / 90) % 2 && k > 0.05 && k < 0.95 ? 1 : 0
      for (let cch = 0; cch < 3; cch++) {
        const x = 34 + cch * 86, y = 92 + bote
        r(x, y, 82, 52, '#1b1f27'); r(x + 1, y + 1, 80, 50, '#eef1f4'); r(x + 1, y + 1, 80, 3, '#ffffff')
        r(x + 1, y + 30, 80, 4, '#1f4e9b'); r(x + 1, y + 34, 80, 2, '#c8302a')
        for (let w = 0; w < 4; w++) {
          const wx = x + 5 + w * 19
          r(wx, y + 8, 15, 16, '#1b1f27'); r(wx + 1, y + 9, 13, 14, '#f6e7b4')
          if ((w + cch) % 3 !== 1) { r(wx + 4, y + 14, 5, 9, '#3a3f48'); r(wx + 5, y + 11, 3, 3, '#3a3f48') }
        }
        r(x + 1, y + 40, 80, 11, '#cfd5db'); r(x + 10, y + 51, 10, 3, '#15171c'); r(x + 62, y + 51, 10, 3, '#15171c')
      }
      // morro del tren, hacia donde va
      const mx = sentido > 0 ? 292 : 20
      r(mx, 94 + bote, 8, 48, '#eef1f4'); r(mx + (sentido > 0 ? 6 : 0), 100 + bote, 2, 10, '#f6e7b4')
      // el plano de la línea abajo, con el nombre de cada parada y la flecha roja de dónde va el tren
      r(0, 162, 320, 18, '#1b1f27')
      r(40, 166, 240, 3, '#3dd9ff')
      paradas.forEach((pa, i) => {
        const x = 40 + i * (240 / (paradas.length - 1))
        r(x - 3, 164, 7, 7, '#1b1f27'); r(x - 2, 165, 5, 5, i === hasta ? '#f2c200' : '#ffffff')
        textoCentrado(ctx, pa.nombre.toUpperCase(), x, 173, i === hasta ? '#f2c200' : '#9aa3ad')
      })
      const mxl = 40 + pos * (240 / (paradas.length - 1))
      r(mxl - 2, 160, 5, 3, '#c8302a')
      const cerca = Math.round(pos)
      aviso.textContent = Math.abs(pos - cerca) < 0.12 ? paradas[cerca].nombre : ''
      if (t < DURACION) requestAnimationFrame(pintar)
      else {
        ;[0, 0.14].forEach((d) => sonar(988, 0.1, 'square', 0.03, d))
        capa.classList.remove('visible')
        setTimeout(() => { capa.remove(); resolver() }, 350)
      }
    }
    requestAnimationFrame(pintar)
  })
}

// Nombre de la parada con la fuente de píxel, centrado
function textoMetro(ctx, cadena, cx, y, color) {
  ctx.save(); ctx.fillStyle = color
  textoCentrado(ctx, cadena, cx, y, color)
  ctx.restore()
}
