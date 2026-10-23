// Sonido chiptune generado al momento con Web Audio: sin ficheros de audio que descargar.
// Hay cuatro estilos de música para elegir y la elección se recuerda.
import { estado, guardar } from './estado.js'

let ctx = null
let musica = null

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
  osc.connect(g).connect(a.destination)
  osc.start(a.currentTime + inicio)
  osc.stop(a.currentTime + inicio + dur + 0.02)
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
}

export const nombreMusica = () => (ESTILOS[estado.musica] || ESTILOS.aventura).nombre[estado.idioma]

function tocarMusica() {
  clearTimeout(musica)
  const estilo = ESTILOS[estado.musica] || ESTILOS.aventura
  const dura = estilo.tocar()
  musica = setTimeout(() => estado.sonido && tocarMusica(), dura * 1000)
}

// Pasa al siguiente estilo y, si está sonando, cambia a ese (deja terminar las notas ya programadas)
export function cambiarMusica() {
  const lista = Object.keys(ESTILOS)
  estado.musica = lista[(lista.indexOf(estado.musica) + 1) % lista.length]
  guardar()
  if (estado.sonido) { clearTimeout(musica); musica = setTimeout(tocarMusica, 400) }
  return nombreMusica()
}

export function alternarSonido() {
  estado.sonido = !estado.sonido
  if (estado.sonido) { audio().resume(); tocarMusica() } else clearTimeout(musica)
  return estado.sonido
}
