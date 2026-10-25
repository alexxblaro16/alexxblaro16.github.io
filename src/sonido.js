// Sonido chiptune generado al momento con Web Audio: sin ficheros de audio que descargar.
// Hay siete estilos de música para elegir y la elección se recuerda.
import { estado, guardar } from './estado.js'

let ctx = null
let musica = null
// La música va por su propio canal: al cambiar de estilo o apagar el sonido se baja y se corta ese canal,
// así las notas que ya estaban programadas no se quedan sonando encima de la canción nueva
let canal = null
let destino = null // adónde van las notas que se programan ahora (null = efectos, directos a la salida)

function audio() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

function nota(freq, inicio, dur, tipo = 'square', vol = 0.05) {
  const a = audio()
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = tipo
  osc.frequency.value = freq
  g.gain.setValueAtTime(vol, a.currentTime + inicio)
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + inicio + dur)
  osc.connect(g).connect(destino || a.destination)
  osc.start(a.currentTime + inicio)
  osc.stop(a.currentTime + inicio + dur + 0.02)
}

// Baja el canal de la música en un momento y lo desconecta: corta lo que quedase por sonar
function cortarMusica() {
  clearTimeout(musica)
  if (!canal) return
  const viejo = canal
  canal = null
  const a = audio()
  viejo.gain.cancelScheduledValues(a.currentTime)
  viejo.gain.setValueAtTime(viejo.gain.value, a.currentTime)
  viejo.gain.linearRampToValueAtTime(0, a.currentTime + 0.12)
  setTimeout(() => viejo.disconnect(), 200)
}

// Nota MIDI (60 = do central) a frecuencia
const hz = (n) => 440 * Math.pow(2, (n - 69) / 12)

export const sfx = {
  letra: () => estado.sonido && nota(880, 0, 0.03, 'square', 0.015),
  aceptar: () => estado.sonido && (nota(660, 0, 0.08), nota(990, 0.08, 0.1)),
  mover: () => estado.sonido && nota(440, 0, 0.05, 'square', 0.03),
  logro: () => estado.sonido && [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.09, 0.15, 'square', 0.05)),
  puerta: () => estado.sonido && (nota(330, 0, 0.08, 'triangle', 0.08), nota(494, 0.07, 0.12, 'triangle', 0.08)),
}

// ---------------------------------------------------------------------------------------------- estilos de música
// Cada estilo toca una vuelta y devuelve cuántos segundos dura, para volver a empezar al acabar
const ESTILOS = {
  // La de siempre: chiptune tranquilo en do mayor
  aventura: {
    nombre: { es: 'AVENTURA', en: 'ADVENTURE' },
    tocar() {
      const paso = 0.28, melodia = [72, 76, 79, 76, 74, 77, 81, 77, 72, 76, 79, 84, 83, 79, 76, 74]
      melodia.forEach((n, i) => { nota(hz(n), i * paso, 0.22, 'square', 0.018); if (i % 4 === 0) nota(hz(n - 24), i * paso, paso * 3.5, 'triangle', 0.03) })
      return melodia.length * paso
    },
  },
  // Vals de pueblo en re mayor: bajo en el primer tiempo y acorde en los otros dos
  pueblo: {
    nombre: { es: 'PUEBLO', en: 'VILLAGE' },
    tocar() {
      const paso = 0.3
      const melodia = [74, 78, 81, 79, 78, 76, 74, 76, 78, 76, 74, 73, 71, 74, 78, 76, 74, 73, 74, null, null, 78, 76, 74]
      const acordes = [[50, 62, 66], [55, 62, 67], [50, 62, 66], [57, 61, 64], [59, 62, 66], [55, 59, 62], [50, 62, 66], [57, 61, 67]]
      melodia.forEach((n, i) => { if (n) nota(hz(n), i * paso, 0.26, 'triangle', 0.045) })
      acordes.forEach(([bajo, a, b], c) => {
        nota(hz(bajo), c * 3 * paso, paso * 0.9, 'triangle', 0.05)
        for (const k of [1, 2]) { nota(hz(a), (c * 3 + k) * paso, paso * 0.5, 'square', 0.008); nota(hz(b), (c * 3 + k) * paso, paso * 0.5, 'square', 0.008) }
      })
      return melodia.length * paso
    },
  },
  // Lo-fi: lento, con acordes largos y una melodía suelta por encima
  lofi: {
    nombre: { es: 'LO-FI', en: 'LO-FI' },
    tocar() {
      const paso = 0.42
      const melodia = [69, null, 72, null, 76, null, 74, 72, null, null, 69, null, 67, null, 64, null, 65, null, 69, null, 72, null, 71, 69, null, null, 67, null, 64, null, null, null]
      const acordes = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 55, 59, 64], [55, 59, 62, 67]]
      melodia.forEach((n, i) => { if (n) nota(hz(n), i * paso + (i % 2 ? 0.05 : 0), 0.5, 'sine', 0.05) })
      acordes.forEach((acorde, c) => acorde.forEach((n) => nota(hz(n), c * 8 * paso, 8 * paso * 0.95, 'triangle', 0.012)))
      for (let i = 0; i < 32; i += 2) nota(2400, i * paso, 0.02, 'square', 0.004) // un tic suave a modo de percusión
      return melodia.length * paso
    },
  },
  // Arcade: rápida, con arpegios y bajo saltarín
  arcade: {
    nombre: { es: 'ARCADE', en: 'ARCADE' },
    tocar() {
      const paso = 0.14
      const melodia = [76, 79, 84, 79, 76, 79, 84, 88, 74, 77, 81, 77, 74, 77, 81, 86, 72, 76, 79, 76, 72, 76, 79, 84, 71, 74, 79, 74, 71, 74, 79, 83]
      const raices = [52, 50, 48, 47]
      melodia.forEach((n, i) => {
        nota(hz(n), i * paso, 0.11, 'square', 0.016)
        if (i % 2 === 0) nota(hz(raices[Math.floor(i / 8)] + (i % 4 === 2 ? 12 : 0)), i * paso, 0.12, 'square', 0.014)
      })
      return melodia.length * paso
    },
  },
  // Héroe: épica y con prisa, como la entrada de una serie de dibujos (la menor, bajo galopando)
  heroe: {
    nombre: { es: 'HEROE', en: 'HERO' }, // sin tilde: la fuente de píxel no tiene mayúsculas acentuadas
    tocar() {
      const paso = 0.16
      const melodia = [69, null, 72, 76, 74, null, 72, 71, 72, null, 69, 67, 69, null, null, null, 65, null, 69, 72, 71, null, 69, 67, 69, 71, 72, 74, 76, null, null, null]
      const raices = [45, 41, 43, 40]
      melodia.forEach((n, i) => { if (n) nota(hz(n), i * paso, 0.15, 'square', 0.02) })
      for (let i = 0; i < 32; i++) {
        const r = raices[Math.floor(i / 8)]
        nota(hz(r + (i % 2 ? 12 : 0)), i * paso, 0.1, 'triangle', 0.05)
        if (i % 4 === 0) nota(80, i * paso, 0.08, 'sine', 0.08) // bombo
        if (i % 4 === 2) nota(2000 + Math.random() * 400, i * paso, 0.03, 'square', 0.006) // caja
      }
      return melodia.length * paso
    },
  },
  // Verano: ritmo de playa a contratiempo en fa mayor
  verano: {
    nombre: { es: 'VERANO', en: 'SUMMER' },
    tocar() {
      const paso = 0.2
      const melodia = [77, null, 76, 77, null, 72, null, 74, 76, null, 74, 72, null, 69, null, null, 70, null, 72, 74, null, 72, null, 70, 69, null, 67, 65, null, null, null, null]
      const acordes = [[53, 57, 60], [58, 62, 65], [48, 55, 60], [53, 57, 60]]
      melodia.forEach((n, i) => { if (n) nota(hz(n), i * paso, 0.18, 'triangle', 0.045) })
      acordes.forEach(([b, a, c], k) => {
        nota(hz(b - 12), k * 8 * paso, paso * 2, 'triangle', 0.05); nota(hz(b - 12), (k * 8 + 3) * paso, paso, 'triangle', 0.04)
        for (const s of [1, 3, 5, 7]) { nota(hz(a), (k * 8 + s) * paso, 0.08, 'square', 0.008); nota(hz(c), (k * 8 + s) * paso, 0.08, 'square', 0.008) }
      })
      return melodia.length * paso
    },
  },
  // Noche: tranquila, arpegios lentos en re menor (va muy bien con el modo noche)
  noche: {
    nombre: { es: 'NOCHE', en: 'NIGHT' },
    tocar() {
      const paso = 0.36
      const acordes = [[50, 57, 62, 65], [46, 53, 58, 62], [48, 55, 60, 64], [45, 52, 57, 61]]
      const melodia = [74, null, null, 72, null, 69, null, null, 70, null, null, 69, null, 65, null, null, 67, null, null, 69, null, 72, null, null, 69, null, null, null, 68, null, 69, null]
      acordes.forEach((ac, k) => ac.forEach((n, i) => { nota(hz(n), (k * 8 + i * 2) * paso, paso * 3, 'sine', 0.035); nota(hz(n + 12), (k * 8 + i * 2 + 1) * paso, paso * 2, 'sine', 0.015) }))
      melodia.forEach((n, i) => { if (n) nota(hz(n), i * paso, 0.7, 'triangle', 0.03) })
      return melodia.length * paso
    },
  },
}

export const nombreMusica = () => (ESTILOS[estado.musica] || ESTILOS.aventura).nombre[estado.idioma]

function tocarMusica() {
  clearTimeout(musica)
  const a = audio()
  if (!canal) { canal = a.createGain(); canal.connect(a.destination) }
  const estilo = ESTILOS[estado.musica] || ESTILOS.aventura
  destino = canal
  const dura = estilo.tocar()
  destino = null
  musica = setTimeout(() => estado.sonido && tocarMusica(), dura * 1000)
}

// Pasa al siguiente estilo y, si está sonando, corta el anterior y empieza el nuevo
export function cambiarMusica() {
  const lista = Object.keys(ESTILOS)
  estado.musica = lista[(lista.indexOf(estado.musica) + 1) % lista.length]
  guardar()
  if (estado.sonido) { cortarMusica(); musica = setTimeout(tocarMusica, 250) }
  return nombreMusica()
}

export function alternarSonido() {
  estado.sonido = !estado.sonido
  if (estado.sonido) { audio().resume(); cortarMusica(); tocarMusica() } else cortarMusica()
  return estado.sonido
}

// Efectos sueltos para los minijuegos y las esferas (solo suenan con el sonido activado)
export function sonar(freq, dur = 0.1, tipo = 'square', vol = 0.05, inicio = 0) { if (estado.sonido) nota(freq, inicio, dur, tipo, vol) }
