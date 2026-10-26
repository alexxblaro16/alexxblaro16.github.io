// Sonido chiptune generado al momento con Web Audio: sin ficheros de audio que descargar.
// Hay siete estilos de música para elegir y la elección se recuerda. En la peña El Pilón suena aparte la música
// de fiesta (canciones inventadas de seis géneros), que se elige en su equipo de música y se quita al salir.
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

// Ruido blanco filtrado: platillos, cajas y crujidos (un solo búfer que se reutiliza)
let bufRuido = null
function ruido(inicio, dur, vol = 0.05, corte = 6000) {
  const a = audio()
  if (!bufRuido) {
    bufRuido = a.createBuffer(1, Math.floor(a.sampleRate * 0.5), a.sampleRate)
    const d = bufRuido.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  const src = a.createBufferSource(); src.buffer = bufRuido
  const filtro = a.createBiquadFilter(); filtro.type = 'highpass'; filtro.frequency.value = corte
  const g = a.createGain()
  g.gain.setValueAtTime(vol, a.currentTime + inicio)
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + inicio + dur)
  src.connect(filtro).connect(g).connect(destino || a.destination)
  src.start(a.currentTime + inicio); src.stop(a.currentTime + inicio + dur + 0.02)
}

// Bombo: un seno que cae de tono muy deprisa
function bombo(inicio, vol = 0.14) {
  const a = audio()
  const osc = a.createOscillator(), g = a.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(150, a.currentTime + inicio)
  osc.frequency.exponentialRampToValueAtTime(42, a.currentTime + inicio + 0.14)
  g.gain.setValueAtTime(vol, a.currentTime + inicio)
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + inicio + 0.22)
  osc.connect(g).connect(destino || a.destination)
  osc.start(a.currentTime + inicio); osc.stop(a.currentTime + inicio + 0.25)
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
  // moneda: dos notas agudas, la segunda larga
  moneda: () => estado.sonido && (nota(988, 0, 0.08, 'square', 0.05), nota(1319, 0.08, 0.35, 'square', 0.05)),
  // comer a bocados, como en los juegos de bloques: crujidos cortos seguidos
  comer: (n = 5) => { if (estado.sonido) for (let i = 0; i < n; i++) { ruido(i * 0.2, 0.07, 0.07, 900 + (i % 3) * 400); nota(180 + (i % 2) * 40, i * 0.2, 0.05, 'square', 0.02) } },
  // y el eructo de después
  eructo: () => { if (!estado.sonido) return; const a = audio(), osc = a.createOscillator(), g = a.createGain(); osc.type = 'sawtooth'; osc.frequency.setValueAtTime(120, a.currentTime); osc.frequency.exponentialRampToValueAtTime(62, a.currentTime + 0.45); g.gain.setValueAtTime(0.06, a.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.5); osc.connect(g).connect(a.destination); osc.start(); osc.stop(a.currentTime + 0.52) },
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

// ---------------------------------------------------------------------------------------------- música de la peña
// La música de la peña: canciones inventadas al estilo de lo que suena de verdad, con artistas de broma
// (Good Tunny, Nepedo, Rosalio…). Cada canción se describe con su tempo, su ritmo de batería, el bajo y los acordes
// de cada compás y una melodía en semicorcheas; tema() la toca entera y devuelve lo que dura.
const GENEROS = [
  { id: 'regueton', nombre: { es: 'Reguetón', en: 'Reggaeton' } },
  { id: 'urbano', nombre: { es: 'Urbano', en: 'Urban' } },
  { id: 'electronica', nombre: { es: 'Electrónica', en: 'Electronic' } },
  { id: 'pop', nombre: { es: 'Pop', en: 'Pop' } },
  { id: 'rock', nombre: { es: 'Rock', en: 'Rock' } },
  { id: 'fiestas', nombre: { es: 'Fiestas', en: 'Village fiesta' } },
]

// Melodía escrita como texto: notas MIDI separadas por espacios y «.» para los silencios
const mel = (s) => s.trim().split(/\s+/).map((n) => (n === '.' ? null : +n))

// Patrones de batería en 16 pasos: b = bombo, c = caja o palmas, h = charles
const RITMOS = {
  dembow: { b: [0, 4, 8, 12], c: [3, 6, 11, 14], h: [0, 2, 4, 6, 8, 10, 12, 14], bajo: [0, 6, 8, 14] },
  trap: { b: [0, 7, 10], c: [8], h: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], bajo: [0, 7, 10], largo: true },
  cuatro: { b: [0, 4, 8, 12], c: [4, 12], h: [2, 6, 10, 14], bajo: [2, 6, 10, 14] },
  pop: { b: [0, 6, 8], c: [4, 12], h: [0, 2, 4, 6, 8, 10, 12, 14], bajo: [0, 3, 6, 8, 11, 14] },
  rumba: { b: [0, 8], c: [3, 6, 10, 12, 14], h: [], bajo: [0, 3, 8, 11], rasgueo: [0, 3, 6, 8, 11, 14] },
  rock: { b: [0, 8, 10], c: [4, 12], h: [0, 2, 4, 6, 8, 10, 12, 14], bajo: [0, 2, 4, 6, 8, 10, 12, 14] },
  pasodoble: { b: [0, 8], c: [4, 12], h: [], bajo: [0, 8], contra: [4, 12] },
  pachanga: { b: [0, 4, 8, 12], c: [2, 6, 10, 14], h: [], bajo: [0, 8], contra: [2, 6, 10, 14] },
}

function tema(c) {
  const paso = 60 / c.bpm / 4, r = RITMOS[c.ritmo], compases = c.acordes.length
  for (let i = 0; i < compases * 16; i++) {
    const t = i * paso, s = i % 16, acorde = c.acordes[Math.floor(i / 16)]
    if (r.b.includes(s)) bombo(t, c.bombo || 0.15)
    if (r.c.includes(s)) ruido(t, 0.1, c.ritmo === 'rumba' ? 0.05 : 0.06, c.ritmo === 'rumba' ? 2500 : 1600)
    if (r.h.includes(s)) ruido(t, c.ritmo === 'trap' && s % 4 === 3 ? 0.02 : 0.03, 0.014, 8000)
    if (r.bajo.includes(s)) nota(hz(acorde[0] - 12), t, paso * (r.largo ? 5 : 1.7), c.ritmo === 'trap' ? 'sine' : 'triangle', r.largo ? 0.12 : 0.08)
    // rasgueo de guitarra (rumba), o el «chunda» de la charanga a contratiempo
    if (r.rasgueo?.includes(s)) acorde.forEach((n, k) => nota(hz(n + 12), t + k * 0.012, paso * 1.4, 'sawtooth', 0.01))
    if (r.contra?.includes(s)) acorde.forEach((n) => nota(hz(n + 12), t, paso * 1.2, 'square', 0.009))
    // acordes de fondo, largos, al empezar cada compás
    if (s === 0 && c.pad) acorde.forEach((n) => nota(hz(n + 12), t, paso * 15, c.pad, 0.012))
    // power chords en el rock
    if (c.ritmo === 'rock' && s % 2 === 0) [0, 7, 12].forEach((k) => nota(hz(acorde[0] + k), t, paso * 0.9, 'sawtooth', 0.012))
  }
  const m = c.melodia, total = compases * 16
  for (let i = 0; i < total; i++) {
    const n = m[i % m.length]
    if (n) nota(hz(n), i * paso, paso * (c.legato || 0.9), c.lead || 'square', c.vol || 0.02)
  }
  return total * paso
}

const CANCIONES = [
  // Reguetón
  { id: 'pueblo_bonito', genero: 'regueton', artista: 'Good Tunny', titulo: 'Pueblo bonito',
    tocar: () => tema({ bpm: 92, ritmo: 'dembow', acordes: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], pad: 'triangle', lead: 'square',
      melodia: mel('76 . 76 74 . 72 . 74 76 . . 72 . 69 . . 72 . 72 74 . 72 . 69 67 . . 69 . . . . 76 . 76 77 . 76 . 74 72 . . 74 . 76 . . 81 . 79 . 77 76 . 74 . 72 . 69 . . . .') }) },
  { id: 'gasolinera', genero: 'regueton', artista: 'Daddy Yonki', titulo: 'Gasolinera',
    tocar: () => tema({ bpm: 96, ritmo: 'dembow', acordes: [[50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55]], lead: 'sawtooth', vol: 0.016,
      melodia: mel('74 74 . 74 77 . 74 . 72 72 . 72 74 . . . 74 74 . 74 77 . 79 . 77 . 74 . 72 . . . 69 69 . 69 72 . 69 . 67 . 69 . 72 . . . 74 . 72 . 70 . 69 . 67 . . . . . . .') }) },
  // Urbano
  { id: 'colombina', genero: 'urbano', artista: 'Nepedo', titulo: 'Colombina',
    tocar: () => tema({ bpm: 98, ritmo: 'dembow', acordes: [[52, 55, 59], [48, 52, 55], [55, 59, 62], [50, 54, 57]], pad: 'sine', lead: 'triangle', vol: 0.04, legato: 1.6,
      melodia: mel('71 . . 71 . 69 . 67 . . 67 . 69 . 71 . 74 . . 71 . 69 . 67 . . 64 . . . . . 71 . . 71 . 69 . 67 . . 67 . 69 . 71 . 72 . . 71 . 69 . 71 . . 67 . . . . .') }) },
  { id: 'dejaste_quedar', genero: 'urbano', artista: 'C. Mandarina', titulo: 'Tú me dejaste de quedar',
    tocar: () => tema({ bpm: 140, ritmo: 'trap', acordes: [[45, 48, 52], [41, 45, 48], [43, 47, 50], [40, 44, 47]], pad: 'sine', lead: 'square', vol: 0.016,
      melodia: mel('76 . . . 72 . . . 74 . 72 . 69 . . . 76 . . . 77 . . . 76 . 74 . 72 . . . 72 . . . 71 . . . 69 . 71 . 72 . . . 68 . . . 69 . . . . . . . . . . .') }) },
  // Electrónica
  { id: 'arenisca', genero: 'electronica', artista: 'Daruda', titulo: 'Arenisca',
    tocar: () => tema({ bpm: 136, ritmo: 'cuatro', acordes: [[57, 60, 64], [57, 60, 64], [53, 57, 60], [55, 59, 62]], lead: 'sawtooth', vol: 0.018, legato: 0.7,
      melodia: mel('69 69 69 69 69 . 69 69 69 69 69 69 69 . 74 74 74 74 74 74 74 . 72 72 72 72 72 72 72 . 67 67 69 69 69 69 69 . 69 69 69 69 69 69 69 . 74 74 74 74 74 74 74 . 76 76 76 76 76 . . . . .') }) },
  { id: 'titanito', genero: 'electronica', artista: 'David Ghetto', titulo: 'Titanito',
    tocar: () => tema({ bpm: 126, ritmo: 'cuatro', acordes: [[48, 52, 55], [55, 59, 62], [57, 60, 64], [53, 57, 60]], pad: 'square', lead: 'triangle', vol: 0.04, legato: 1.3,
      melodia: mel('72 . . 74 . . 76 . . 79 . . 76 . 74 . 74 . . 76 . . 79 . . 81 . . 79 . 76 . 76 . . 79 . . 81 . . 84 . . 81 . 79 . 77 . . 76 . . 74 . . 72 . . . . . .') }) },
  // Pop
  { id: 'bailandito', genero: 'pop', artista: 'Enrique Iglesitas', titulo: 'Bailandito',
    tocar: () => tema({ bpm: 96, ritmo: 'pop', acordes: [[50, 53, 57], [46, 50, 53], [48, 52, 55], [45, 49, 52]], pad: 'triangle', lead: 'square', vol: 0.02,
      melodia: mel('74 . 74 . 72 . 74 . 77 . . 76 . 74 . . . 72 . 72 . 70 . 72 . 76 . . 74 . 72 . . . 70 . 70 . 69 . 70 . 74 . . 72 . 70 . . . 69 . 70 . 72 . 73 . 74 . . . .') }) },
  { id: 'motopapi', genero: 'pop', artista: 'Rosalio', titulo: 'Motopapi',
    tocar: () => tema({ bpm: 110, ritmo: 'rumba', acordes: [[52, 56, 59], [53, 57, 60], [52, 56, 59], [50, 53, 57]], lead: 'triangle', vol: 0.045, legato: 1.1,
      melodia: mel('76 . 77 76 . 74 . 72 . 71 . 72 74 . 72 71 . . 69 . 71 . 72 . 71 . 69 . 68 . . . 76 . 77 76 . 74 . 72 . 71 . 72 74 . 76 77 . . 76 . 74 . 72 . 71 . 69 . 68 . . .') }) },
  // Rock
  { id: 'como_calamar', genero: 'rock', artista: 'Estapo', titulo: 'Como calamar',
    tocar: () => tema({ bpm: 118, ritmo: 'rumba', acordes: [[45, 48, 52], [43, 47, 50], [41, 45, 48], [40, 44, 47]], lead: 'sawtooth', vol: 0.016,
      melodia: mel('69 . 69 . 72 . 71 . 69 . 67 . 69 . . . 67 . 67 . 71 . 69 . 67 . 65 . 67 . . . 65 . 65 . 69 . 67 . 65 . 64 . 65 . . . 64 . 65 . 67 . 68 . 69 . . . . . . .') }) },
  { id: 'so_pallaso', genero: 'rock', artista: 'Extremoblando', titulo: 'So pallaso',
    tocar: () => tema({ bpm: 140, ritmo: 'rock', acordes: [[40, 44, 47], [40, 44, 47], [43, 47, 50], [45, 48, 52]], lead: 'square', vol: 0.016,
      melodia: mel('64 . 67 . 69 . 67 . 64 . 62 . 64 . . . 64 . 67 . 69 . 71 . 72 . 71 . 69 . . . 67 . 69 . 71 . 69 . 67 . 64 . 62 . . . 64 . 64 . 62 . 64 . 67 . . . . . . .') }) },
  // Fiestas
  { id: 'san_roque', genero: 'fiestas', artista: 'Charanga El Pilón', titulo: 'Pasodoble de San Roque',
    tocar: () => tema({ bpm: 116, ritmo: 'pasodoble', acordes: [[50, 54, 57], [50, 54, 57], [45, 49, 52], [50, 54, 57]], lead: 'sawtooth', vol: 0.022, bombo: 0.11,
      melodia: mel('74 . 74 76 78 . 79 . 78 . 76 . 74 . . . 71 . 74 76 78 . 76 . 74 . 73 . 76 . . . 76 . 76 78 79 . 81 . 79 . 78 . 76 . . . 74 . 73 . 76 . 73 . 74 . . . . . . .') }) },
  { id: 'verbena', genero: 'fiestas', artista: 'Orquesta Tierra de Campos', titulo: 'Verbena en la plaza',
    tocar: () => tema({ bpm: 128, ritmo: 'pachanga', acordes: [[48, 52, 55], [55, 59, 62], [55, 59, 62], [48, 52, 55]], lead: 'square', vol: 0.02,
      melodia: mel('72 74 76 . 76 . 76 . 77 76 74 . 74 . 74 . 71 72 74 . 74 . 74 . 76 74 72 . 72 . . . 72 74 76 . 76 . 79 . 77 76 74 . 74 . 71 . 72 . 76 . 74 . 71 . 72 . . . . . . .') }) },
  // El himno de la peña, a lo punk de carretera (melodía propia; los artistas, de broma como los demás)
  { id: 'bares_frutas', genero: 'fiestas', artista: 'Los Lamentitos', titulo: 'Bares de frutas',
    tocar: () => tema({ bpm: 168, ritmo: 'rock', acordes: [[45, 49, 52], [43, 47, 50], [38, 42, 45], [40, 44, 47]], lead: 'square', vol: 0.018, bombo: 0.14,
      melodia: mel('69 . 69 . 69 . 71 . 72 . 71 . 69 . . . 67 . 67 . 67 . 69 . 71 . 69 . 67 . . . 74 . 74 . 72 . 71 . 69 . 71 . 72 . 71 . 69 . 69 . 67 . 69 . 71 . 69 . . . . .') }) },
]

let fiesta = null
// La música solo suena jugando: empieza al darle a jugar y se para en el menú y en el modo clásico.
// Si el visitante apaga el sonido a mano, se respeta y no se vuelve a encender sola.
let jugando = false, enPausa = false, apagadoAMano = false
const suena = () => estado.sonido && jugando && !enPausa
export const musicaSonando = () => !!canal
export { GENEROS, CANCIONES }
export const cancion = (id) => CANCIONES.find((c) => c.id === id)

// Pone la música de la peña (si el sonido está apagado, lo enciende: has elegido tú poner música) o, con null,
// vuelve a la música de siempre. Devuelve si ha cambiado el sonido, para repintar el botón de la barra.
export function musicaFiesta(clave) {
  if (clave === fiesta) return false
  fiesta = clave
  let encendido = false
  if (clave && !estado.sonido) { estado.sonido = true; encendido = true; audio().resume() }
  if (suena()) { cortarMusica(); musica = setTimeout(tocarMusica, 200) }
  return encendido
}
export const hayFiesta = () => fiesta

export const nombreMusica = () => (ESTILOS[estado.musica] || ESTILOS.aventura).nombre[estado.idioma]

function tocarMusica() {
  clearTimeout(musica)
  const a = audio()
  if (!canal) { canal = a.createGain(); canal.connect(a.destination) }
  const estilo = (fiesta && cancion(fiesta)) || ESTILOS[estado.musica] || ESTILOS.aventura
  destino = canal
  const dura = estilo.tocar()
  destino = null
  musica = setTimeout(() => suena() && tocarMusica(), dura * 1000)
}

// Pasa al siguiente estilo y, si está sonando, corta el anterior y empieza el nuevo
export function cambiarMusica() {
  const lista = Object.keys(ESTILOS)
  estado.musica = lista[(lista.indexOf(estado.musica) + 1) % lista.length]
  guardar()
  if (suena()) { cortarMusica(); musica = setTimeout(tocarMusica, 250) }
  return nombreMusica()
}

export function alternarSonido() {
  estado.sonido = !estado.sonido
  apagadoAMano = !estado.sonido
  if (estado.sonido) audio().resume()
  cortarMusica()
  if (suena()) tocarMusica()
  return estado.sonido
}

// Al empezar a jugar (true) o al volver al menú (false)
export function musicaDeJuego(si) {
  jugando = si
  enPausa = false
  cortarMusica()
  if (!si) return
  if (!estado.sonido && !apagadoAMano) { estado.sonido = true; audio().resume() }
  if (suena()) tocarMusica()
}

// El modo clásico la para y, al cerrarlo, vuelve si se estaba jugando
export function pausarMusica(si) {
  enPausa = si
  cortarMusica()
  if (suena()) tocarMusica()
}

// Efectos sueltos para los minijuegos y las esferas (solo suenan con el sonido activado)
export function sonar(freq, dur = 0.1, tipo = 'square', vol = 0.05, inicio = 0) { if (estado.sonido) nota(freq, inicio, dur, tipo, vol) }
