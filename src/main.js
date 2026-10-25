// Punto de entrada: arranca Phaser con el mundo de fondo, la capa HTML y las pantallas del menú.
import Phaser from 'phaser'
import './style.css'
import Mundo from './scenes/Mundo.js'
import { iniciarUI, iniciarMando } from './ui.js'
import { iniciarPantallas } from './pantallas.js'
import { estado } from './estado.js'
import { empezarRegistro } from './registro.js'

document.documentElement.lang = estado.idioma

// Las fuentes de píxel tienen que estar cargadas antes de pintar textos en el canvas
await Promise.race([document.fonts.load('8px "Press Start 2P"'), new Promise((r) => setTimeout(r, 1500))])

const juego = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'juego',
  backgroundColor: '#0f1218',
  pixelArt: true,
  roundPixels: true,
  scale: { mode: Phaser.Scale.RESIZE, width: window.innerWidth, height: window.innerHeight },
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [Mundo],
})

window.__juego = juego // útil para depurar desde la consola

iniciarUI()
iniciarMando()
empezarRegistro()

juego.events.once('ready', () => {
  const mundo = juego.scene.getScene('Mundo')
  // botón del sol y la luna: salta al día o a la noche
  const hora = document.querySelector('#btn-hora')
  hora.onclick = () => mundo.cambiarHora()
  const ICONOS = {
    '☀': document.querySelector('#hora-icono').innerHTML,
    '☾': '<svg class="icono" viewBox="0 0 9 9" shape-rendering="crispEdges"><path fill="#cfe3ff" d="M3 0h3v1H4v1H3v5h1v1h2v1H3V8H2V7H1V2h1V1h1z"/></svg>',
  }
  mundo.events.on('hora', (icono) => { document.querySelector('#hora-icono').innerHTML = ICONOS[icono] })
  const listo = () => iniciarPantallas(mundo, () => mundo.empezar())
  if (mundo.sys.isActive()) listo()
  else mundo.events.once('create', listo)
})

// Secreto: código Konami ↑↑↓↓←→←→ B A
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
let pos = 0
document.addEventListener('keydown', (e) => {
  pos = e.key === KONAMI[pos] ? pos + 1 : (e.key === KONAMI[0] ? 1 : 0)
  if (pos === KONAMI.length) { document.body.classList.toggle('konami'); pos = 0 }
})
