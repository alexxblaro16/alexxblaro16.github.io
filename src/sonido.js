// Sonido chiptune generado al momento con Web Audio: sin ficheros de audio que descargar.
import { estado } from './estado.js'

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

export const sfx = {
  letra: () => estado.sonido && nota(880, 0, 0.03, 'square', 0.015),
  aceptar: () => estado.sonido && (nota(660, 0, 0.08), nota(990, 0.08, 0.1)),
  mover: () => estado.sonido && nota(440, 0, 0.05, 'square', 0.03),
  logro: () => estado.sonido && [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.09, 0.15, 'square', 0.05)),
  puerta: () => estado.sonido && (nota(330, 0, 0.08, 'triangle', 0.08), nota(494, 0.07, 0.12, 'triangle', 0.08)),
}

// Melodía corta en bucle (do mayor, tranquila) mientras el sonido está activado
const MELODIA = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047, 988, 784, 659, 587]
function tocarMelodia() {
  const paso = 0.28
  MELODIA.forEach((f, i) => { nota(f, i * paso, 0.22, 'square', 0.018); if (i % 4 === 0) nota(f / 4, i * paso, paso * 3.5, 'triangle', 0.03) })
  musica = setTimeout(() => estado.sonido && tocarMelodia(), MELODIA.length * paso * 1000)
}

export function alternarSonido() {
  estado.sonido = !estado.sonido
  if (estado.sonido) { audio().resume(); tocarMelodia() } else clearTimeout(musica)
  return estado.sonido
}
