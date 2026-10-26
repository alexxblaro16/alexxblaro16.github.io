// El viaje en Monbus entre Villalpando y Madrid: una escena corta a pantalla completa con el autocar por la
// carretera, la meseta pasando por detrás y los kilómetros que suben. Se dibuja en un lienzo de 320 × 180
// escalado sin suavizar, como el resto del juego.
import { estado } from './estado.js'
import { sonar } from './sonido.js'

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
