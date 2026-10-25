// La escena principal: el mundo en píxeles, el personaje del visitante, Alejandro como guía y todos los NPC.
import Phaser from 'phaser'
import { T, crearPersonaje, crearAnimaciones, crearJerry, crearSuelos, crearEdificios, crearDecorado } from '../sprites.js'
import { ANCHO, ALTO, CAMINO, CAMINO_INICIO, EDIFICIOS, OBJETOS, SUELOS, SENDAS, PERSONAJES, RECORRIDO, ESFERAS } from '../mapa.js'
import { INTERIORES, crearInteriores } from '../interiores.js'
import { HISTORIA } from '../historia.js'
import { estado, guardar } from '../estado.js'
import { registrar } from '../registro.js'
import { decir, hayDialogo, avanzarDialogo, abrirPanel, hayPanel, etiqueta, teclasTactiles, mostrarHUD, pintarHUD, logro } from '../ui.js'
import { sfx, sonar } from '../sonido.js'
import { abrirArcade } from '../arcade.js'
import { lienzo, px, texto, ruido2D } from '../pixel.js'

const VELOCIDAD = 90
const DURACION_DIA = 6 * 60 * 1000 // un día entero del juego, en milisegundos
// Sacado de sus fotos: pelo oscuro ondulado, piel morena clara, camiseta blanca, cadena plateada,
// vaqueros anchos y zapatillas blancas, y el portátil con pegatinas
const ALEJANDRO = { pelo: 'ondulado', colorPelo: '#241812', piel: '#e6b28e', ropa: '#f2f3f5', pantalon: '#4f6d9a', anchos: true, zapatillas: '#f4f4f4', cadena: true }
const DANTE_PW = { pelo: 'flequillo', colorPelo: '#9aa3ad', piel: '#b8c4d0', ojos: '#3dd9ff', ropa: '#3dd9ff', pantalon: '#5b6068', robot: true }

const frases = (clave) => HISTORIA[estado.idioma][clave] || []
// Lo que dice cada amigo: su frase propia si la tiene y, si no, de qué conoce a Alejandro
const fraseAmigo = (p) => {
  const propia = p.frases?.[estado.idioma]
  if (propia) return propia
  return [HISTORIA[estado.idioma][`amigo_${p.grupo}`].replace('{nombre}', p.nombre)]
}

export default class Mundo extends Phaser.Scene {
  constructor() { super('Mundo') }

  create() {
    this.modo = 'portada'
    this.prepararTexturas()
    this.solidos = this.physics.add.staticGroup()
    this.interactivos = []
    this.pintarSuelo()
    this.cicloDia()
    this.pintarArboles()
    this.colocarEdificios()
    this.ventanasNoche()
    this.colocarInteriores()
    this.colocarEsferas()
    this.colocarPersonajes()
    this.ambiente()

    this.physics.world.setBounds(0, 0, ANCHO * T, ALTO * T)
    this.cameras.main.setBounds(0, 0, ANCHO * T, ALTO * T)
    this.ajustarZoom()
    this.scale.on('resize', () => { this.ajustarZoom(); this.encuadrarSala() })

    // sin «capturar» las teclas: si no, el navegador no deja escribir la A, la E, la S, la D, la W ni espacios
    // en el nombre del personaje (Phaser cancelaría esas pulsaciones en toda la página)
    this.teclas = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE,ENTER', false)
    this.aviso = this.add.text(0, 0, '!', { fontFamily: '"Press Start 2P"', fontSize: '8px', color: '#f2c200', resolution: 4 })
      .setOrigin(0.5, 1).setDepth(10000).setVisible(false)
    // Tecla «E» (o «A» en el móvil) encima de lo que tienes cerca y puedes usar
    for (const letra of ['E', 'A']) {
      if (this.textures.exists(`tecla_${letra}`)) continue
      const [c, ctx] = lienzo(11, 12)
      px(ctx, 0, 0, '#1b1f27', 11, 12); px(ctx, 1, 1, '#f4f4f0', 9, 8); px(ctx, 1, 9, '#aeb6c0', 9, 2)
      texto(ctx, letra, 4, 3, '#1b1f27')
      this.textures.addCanvas(`tecla_${letra}`, c)
    }
    const tactil = this.sys.game.device.input.touch && !this.sys.game.device.os.desktop
    this.tecla = this.add.image(0, 0, tactil ? 'tecla_A' : 'tecla_E').setOrigin(0.5, 1).setDepth(10001).setVisible(false)

    // En la portada la cámara recorre el mapa despacio, de fondo del menú
    this.cameras.main.scrollX = 0
    this.cameras.main.centerOn(20 * T, CAMINO * T)
  }

  ajustarZoom() {
    const { width, height } = this.scale
    this.cameras.main.setZoom(Math.max(2, Math.round(Math.min(width / 300, height / 210))))
  }

  // ------------------------------------------------------------------------------------------ texturas
  prepararTexturas() {
    if (!this.textures.exists('hierba')) {
      crearSuelos(this)
      crearEdificios(this)
      crearDecorado(this)
      crearJerry(this)
      crearInteriores(this)
    }
    crearPersonaje(this, 'alejandro', ALEJANDRO); crearAnimaciones(this, 'alejandro')
    crearPersonaje(this, 'dante_pw', DANTE_PW); crearAnimaciones(this, 'dante_pw')
  }

  pintarSuelo() {
    const lienzo = document.createElement('canvas')
    lienzo.width = ANCHO * T
    lienzo.height = ALTO * T
    const ctx = lienzo.getContext('2d')
    const img = (k) => this.textures.get(k).getSourceImage()
    let s = 11
    const azar = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
    const ruido = ruido2D(7)
    const rect = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h) }

    // Qué hay en cada casilla: hierba, camino o el tipo de suelo de cada zona
    const tipo = Array.from({ length: ALTO }, () => Array(ANCHO).fill('hierba'))
    for (let x = CAMINO_INICIO; x < ANCHO - 2; x++) tipo[CAMINO][x] = tipo[CAMINO + 1][x] = 'camino'
    for (const sd of SENDAS) for (let y = sd.y0; y <= sd.y1; y++) tipo[y][sd.x] = 'camino'
    for (const z of SUELOS) for (let y = z.y0; y <= z.y1; y++) for (let x = z.x0; x <= z.x1; x++) tipo[y][x] = z.tipo
    const es = (x, y, t) => y >= 0 && y < ALTO && x >= 0 && x < ANCHO && tipo[y][x] === t

    // Hierba en tres tonos que cambian por zonas (ruido suave), con matas altas y alguna flor
    for (let y = 0; y < ALTO; y++) for (let x = 0; x < ANCHO; x++) {
      if (tipo[y][x] !== 'hierba') { ctx.drawImage(img(tipo[y][x]), x * T, y * T); continue }
      const r = azar()
      ctx.drawImage(img(r > 0.955 ? 'hierba2' : r > 0.9 && ruido(x, y, 6) > 0.42 ? 'hierba_alta' : 'hierba'), x * T, y * T)
    }

    // Manchas de luz y sombra en la hierba, píxel a píxel y con tramado (matriz de Bayer) en las juntas:
    // así no se notan los cuadrados de las casillas
    const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
    const datos = ctx.getImageData(0, 0, ANCHO * T, ALTO * T)
    const d = datos.data
    for (let py = 0; py < ALTO * T; py++) {
      const fila = tipo[Math.floor(py / T)]
      for (let pxl = 0; pxl < ANCHO * T; pxl++) {
        if (fila[Math.floor(pxl / T)] !== 'hierba') continue
        const v = ruido(pxl, py, 88) * 0.8 + ruido(pxl + 999, py + 999, 30) * 0.2 + (bayer[(py & 3) * 4 + (pxl & 3)] / 16 - 0.5) * 0.09
        const i = (py * ANCHO * T + pxl) * 4
        if (v < 0.4) { d[i] *= 0.86; d[i + 1] *= 0.9; d[i + 2] *= 0.86 }
        else if (v > 0.62) { d[i] = d[i] * 1.06 + 6; d[i + 1] = d[i + 1] * 1.05 + 6; d[i + 2] = d[i + 2] * 1.02 }
      }
    }
    ctx.putImageData(datos, 0, 0)

    // Bordes de cada casilla según lo que tenga al lado
    for (let y = 0; y < ALTO; y++) for (let x = 0; x < ANCHO; x++) {
      const t = tipo[y][x], X = x * T, Y = y * T
      const lados = [[0, -1], [0, 1], [-1, 0], [1, 0]].filter(([dx, dy]) => !es(x + dx, y + dy, t))
      for (const [dx, dy] of lados) {
        const vecino = (y + dy >= 0 && y + dy < ALTO && x + dx >= 0 && x + dx < ANCHO) ? tipo[y + dy][x + dx] : 'hierba'
        for (let i = 0; i < T; i++) {
          // (bx, by) recorre el lado de la casilla; (ix, iy) apunta hacia dentro
          const bx = dx === 0 ? X + i : dx < 0 ? X : X + T - 1
          const by = dy === 0 ? Y + i : dy < 0 ? Y : Y + T - 1
          const ix = -dx, iy = -dy
          if (t === 'camino' && vecino === 'hierba') {
            // la hierba se come el borde del camino a mordiscos y el borde queda algo más oscuro
            const prof = azar() < 0.5 ? 0 : 1 + Math.floor(azar() * 3)
            for (let k = 0; k < prof; k++) rect(bx + ix * k, by + iy * k, 1, 1, azar() < 0.5 ? '#4f9e4a' : '#5aa84f')
            rect(bx + ix * prof, by + iy * prof, 1, 1, '#c2a468')
          } else if (t === 'piedra') {
            // bordillo de la plaza: canto claro por dentro y sombra por fuera
            rect(bx, by, 1, 1, '#9e9686'); rect(bx + ix, by + iy, 1, 1, '#f2eee4')
          } else if (t === 'arena' && vecino !== 'arena') {
            // la arena se mete en la hierba de forma irregular
            const prof = Math.floor(azar() * 3)
            for (let k = 1; k <= prof; k++) rect(bx - ix * k, by - iy * k, 1, 1, azar() < 0.6 ? '#e3cd8e' : '#ecd9a0')
            if (azar() < 0.15) rect(bx + ix, by + iy, 1, 1, '#5aa84f')
          } else if (t === 'acera') {
            if (vecino === 'asfalto') { rect(bx, by, 1, 1, '#8a9099'); rect(bx + ix, by + iy, 1, 1, '#eef1f4') } // bordillo
            else rect(bx, by, 1, 1, '#aab1b9')
          }
        }
      }
    }

    // Carretera: línea discontinua y dos pasos de cebra
    const cebras = [71, 88]
    for (let x = 62 * T; x < 97 * T; x += 12) if (!cebras.some((c) => x >= c * T - 4 && x < (c + 2) * T + 4)) rect(x, (CAMINO + 1) * T - 1, 7, 2, '#e9ecef')
    for (const c of cebras) for (let y = CAMINO * T + 2; y < (CAMINO + 2) * T - 2; y += 4) rect(c * T + 2, y, 2 * T - 4, 2, '#eef1f4')

    if (this.textures.exists('suelo')) this.textures.remove('suelo')
    this.textures.addCanvas('suelo', lienzo)
    this.add.image(0, 0, 'suelo').setOrigin(0).setDepth(-1000)
  }

  solido(x, y, w, h) {
    const r = this.add.rectangle(x + w / 2, y + h / 2, w, h).setVisible(false)
    this.physics.add.existing(r, true)
    this.solidos.add(r)
    return r
  }

  ocupado(x, y) {
    if (y >= CAMINO - 1 && y <= CAMINO + 2) return true
    if (SENDAS.some((sd) => Math.abs(sd.x - x) < 2 && y >= sd.y0 - 1 && y <= sd.y1 + 1)) return true
    if (SUELOS.some((z) => x >= z.x0 - 1 && x <= z.x1 + 1 && y >= z.y0 - 1 && y <= z.y1 + 1)) return true
    const cosas = [...EDIFICIOS.map((e) => ({ x: e.x, base: e.base, w: this.textures.get(e.clave).getSourceImage().width / T, h: this.textures.get(e.clave).getSourceImage().height / T })),
      ...OBJETOS.map((o) => ({ x: o.x, base: o.base, w: this.textures.get(o.clave).getSourceImage().width / T, h: this.textures.get(o.clave).getSourceImage().height / T }))]
    if (cosas.some((c) => x >= c.x - c.w / 2 - 1.5 && x <= c.x + c.w / 2 + 1.5 && y >= c.base - c.h - 1 && y <= c.base + 2)) return true
    if (PERSONAJES.some((p) => Math.abs(p.x - x) < 2 && Math.abs(p.y - y) < 2)) return true
    if (ESFERAS.some((e) => !e.dentro && Math.abs(e.x - x) < 1.5 && Math.abs(e.y - y) < 1.5)) return true
    return false
  }

  pintarArboles() {
    const ruidoArboles = ruido2D(23)
    let s = 5
    const azar = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
    for (let y = 1; y < ALTO; y += 2) {
      for (let x = 1; x < ANCHO - 1; x += 2) {
        const borde = y < 4 || y > ALTO - 3 || x < 2 || x > ANCHO - 3
        if ((borde && azar() > 0.15) || (!borde && azar() > 0.9)) {
          const ax = x + (azar() - 0.5)
          if (this.ocupado(ax, y)) continue
          const n = ruidoArboles(x, y, 5)
          const especie = x < 50 ? (n < 0.45 ? 'chopo' : n < 0.75 ? 'arbol' : 'pino') : borde ? (n < 0.5 ? 'pino' : n < 0.8 ? 'arbol' : 'chopo') : (n < 0.6 ? 'arbol' : n < 0.8 ? 'pino' : 'chopo')
          this.add.image(ax * T, y * T, especie).setOrigin(0.5, 1).setDepth(y * T)
          this.solido(ax * T - 4, y * T - 6, 8, 6)
        } else if (!borde && azar() > 0.82) {
          const bx = x + (azar() - 0.5) * 1.5
          if (!this.ocupado(bx, y)) this.add.image(bx * T, y * T, azar() > 0.5 ? 'arbusto' : 'flores').setOrigin(0.5, 1).setDepth(y * T)
        }
      }
    }
  }

  // ------------------------------------------------------------------------------------------ edificios
  letrero(texto, x, y, color = '#ffffff') {
    // La fuente de píxel no tiene mayúsculas con tilde: se quitan para que no salgan raras
    texto = texto.normalize('NFD').replace(/[̀-ͯ]/g, '')
    return this.add.text(x, y, texto, { fontFamily: '"Press Start 2P"', fontSize: '5px', color, backgroundColor: '#1b1f27cc', padding: { x: 2, y: 2 }, resolution: 6 })
      .setOrigin(0.5, 1).setDepth(9000)
  }

  colocarEdificios() {
    for (const e of EDIFICIOS) {
      const img = this.add.image(e.x * T, e.base * T, e.clave).setOrigin(0.5, 1).setDepth(e.base * T)
      const w = img.width, h = img.height
      this.add.rectangle(e.x * T + 3, e.base * T - 2, w, 5, 0x000000, 0.16).setOrigin(0.5, 0).setDepth(-450)
      this.solido(e.x * T - w / 2, e.base * T - h + 8, w, h - 8)
      if (e.letrero) this.letrero(e.letrero, e.x * T, e.base * T - h - 1)
      if (e.zona || e.vida || e.interior) this.interactivos.push({ x: e.x * T, y: e.base * T + 6, radio: 20, zona: e.zona, vida: e.vida, interior: e.interior, nombre: 'Alejandro' })
    }
    for (const o of OBJETOS) {
      const img = this.add.image(o.x * T, o.base * T, o.clave).setOrigin(0.5, 1).setDepth(o.base * T)
      if (img.width >= 30 && !['campo', 'estadio', 'laguna', 'muelle', 'telarana', 'avion', 'banderas', 'puesto'].includes(o.clave)) this.add.rectangle(o.x * T + 2, o.base * T - 2, img.width - 4, 4, 0x000000, 0.14).setOrigin(0.5, 0).setDepth(-450)
      if (o.puerta) {
        // Las torres son sólidas; por el arco del medio se pasa y se ve al otro lado
        this.solido(o.x * T - 64, o.base * T - 28, 51, 26)
        this.solido(o.x * T + 13, o.base * T - 28, 51, 26)
      } else if (o.clave === 'campo' || o.clave === 'estadio') {
        img.setDepth(-500)
        if (o.clave === 'estadio') {
          // la valla es sólida y solo se entra por las dos puertas, la de arriba y la de abajo
          const x0 = o.x * T - img.width / 2, y0 = o.base * T - img.height
          for (const y of [y0, y0 + img.height - 3]) { this.solido(x0, y, 66, 3); this.solido(x0 + 78, y, img.width - 78, 3) }
          this.solido(x0, y0, 3, img.height); this.solido(x0 + img.width - 3, y0, 3, img.height)
        }
      } else if (o.clave === 'pato') {
        img.setDepth(-460) // flota en la laguna
        this.tweens.add({ targets: img, y: img.y - 1.5, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' })
      } else if (o.clave === 'bicho') {
        this.tweens.add({ targets: img, x: img.x + 14, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.inOut', onYoyo: () => img.toggleFlipX(), onRepeat: () => img.toggleFlipX() })
      } else if (o.clave === 'banco') {
        // el banco entero es sólido, así no se atraviesa lo que hay encima (la taza, la gelatina…)
        this.solido(o.x * T - img.width / 2 + 1, o.base * T - img.height + 2, img.width - 2, img.height - 2)
      } else if (['gelatina', 'taza_jefe'].includes(o.clave)) {
        // encima del banco: se dibujan justo por delante de él, pero detrás de quien pase por delante
        const banco = OBJETOS.find((b) => b.clave === 'banco' && Math.abs(b.x - o.x) < 1.5 && Math.abs(b.base - o.base) < 1.5)
        img.setDepth((banco ? banco.base : o.base) * T + 0.5)
      } else if (['taza_java', 'cartel404'].includes(o.clave)) {
        this.solido(o.x * T - 4, o.base * T - 5, 8, 5)
        // objetos pequeños: sin colisión
      } else if (o.nube) {
        // la nube flota y no choca: es para subirse
        img.setDepth(o.base * T + 2)
        this.tweens.add({ targets: img, y: img.y - 3, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' })
        this.nubeImg = img
      } else if (o.clave.startsWith('senal_') || o.clave === 'foco' || o.clave === 'poste_scranton' || o.clave === 'banderin_rayo') {
        this.solido(o.x * T - 3, o.base * T - 4, 6, 4)
      } else if (o.clave === 'huerto' || o.clave === 'remolachas') {
        this.solido(o.x * T - img.width / 2 + 1, o.base * T - img.height + 4, img.width - 2, img.height - 6)
      } else if (o.clave === 'laguna') {
        this.laguna(img, o)
      } else if (o.clave === 'banderas') {
        let f = 0
        this.time.addEvent({ delay: 400, loop: true, callback: () => { f = 1 - f; img.setTexture(f ? 'banderas_1' : 'banderas') } })
        this.solido(o.x * T - 18, o.base * T - 4, 36, 4)
      } else if (o.clave === 'muelle') {
        img.setDepth(-480) // se anda por encima
      } else if (o.encima) {
        img.setDepth(o.base * T + 40) // pegado a la pared de un edificio
      } else if (o.clave === 'arbusto' || o.clave === 'flores') {
        // se puede pisar
      } else if (['farola', 'farola_moderna', 'veleta', 'papelera', 'palmera', 'arbol_plaza', 'mesa_bar'].includes(o.clave)) {
        this.solido(o.x * T - 3, o.base * T - 5, 6, 5)
      } else if (o.clave !== 'cartel' && o.clave !== 'bloque') {
        this.solido(o.x * T - img.width / 2 + 2, o.base * T - img.height / 2, img.width - 4, img.height / 2)
      } else {
        this.solido(o.x * T - 4, o.base * T - 6, 8, 6)
      }
      if (o.letrero) this.letrero(o.letrero, o.x * T, o.base * T - img.height - 1, o.zona ? '#2fbf71' : '#ffffff')
      const grande = o.clave === 'campo' || o.clave === 'estadio'
      if (o.zona || o.vida || o.arcade) this.interactivos.push({ x: o.x * T, y: o.base * T + (grande ? -40 : 4), radio: grande ? 44 : 20, zona: o.zona, vida: o.vida, arcade: o.arcade, nube: o.nube, nombre: 'Alejandro' })
    }
  }

  // La laguna: olas animadas, medusas flotando y agua que no se pisa salvo por el muelle
  laguna(img, o) {
    img.setDepth(-490)
    let f = 0
    this.time.addEvent({ delay: 500, loop: true, callback: () => { f = (f + 1) % 3; img.setTexture(['laguna', 'laguna_1', 'laguna_2'][f]) } })
    const x0 = o.x * T - 40, y0 = o.base * T - 64
    // el muelle entra por la derecha a la altura de la fila 27-28: ahí queda un pasillo sin colisión
    this.solido(x0 + 6, y0 + 6, 68, 20)
    this.solido(x0 + 6, y0 + 41, 68, 18)
    this.solido(x0 + 6, y0 + 26, 40, 15)
    for (let i = 0; i < 5; i++) {
      const m = this.add.image(x0 + 18 + (i * 11) % 44, y0 + 16 + (i * 17) % 34, 'medusa').setDepth(-470).setAlpha(0.92)
      this.tweens.add({ targets: m, y: m.y - 3, duration: 900 + i * 170, yoyo: true, repeat: -1, ease: 'Sine.inOut' })
      this.tweens.add({ targets: m, x: m.x + (i % 2 ? 6 : -6), duration: 4000 + i * 600, yoyo: true, repeat: -1, ease: 'Sine.inOut' })
      m.setInteractive({ useHandCursor: true }).on('pointerover', (ptr) => etiqueta(estado.idioma === 'en' ? 'Jellyfish' : 'Medusa', ptr.x, ptr.y)).on('pointerout', () => etiqueta(null))
    }
  }

  // ------------------------------------------------------------------------------------------ interiores
  // Cada sala se coloca debajo del mapa, una al lado de otra. Paredes, tabiques y muebles son sólidos; los muebles
  // con «vida» o «zona» se pueden usar con E igual que los objetos de fuera, y el ascensor lleva de una sala a otra.
  colocarInteriores() {
    this.salas = {}
    this.gente = [] // la gente que está dentro de las salas (los profes de la UDIT)
    let x = 2 * T
    Object.entries(INTERIORES).forEach(([id, o]) => {
      const x0 = x, y0 = (ALTO + 16) * T, W = o.ancho * T, H = o.alto * T
      x += W + 12 * T
      this.add.image(x0, y0, `int_${id}`).setOrigin(0).setDepth(-900)
      // paredes: la del fondo, los lados y la de abajo con el hueco de la puerta (si tiene)
      this.solido(x0, y0, W, Math.round(2.6 * T) + 2)
      this.solido(x0, y0, 8, H); this.solido(x0 + W - 8, y0, 8, H)
      const puertaX = o.puerta == null ? null : x0 + o.puerta * T
      if (puertaX == null) this.solido(x0, y0 + H - 6, W, 6)
      else { this.solido(x0, y0 + H - 6, puertaX - T - x0, 6); this.solido(puertaX + T, y0 + H - 6, x0 + W - puertaX - T, 6) }
      // tabiques y mamparas
      for (const [mx, my, mw, mh] of o.muros || []) this.solido(x0 + mx * T, y0 + my * T, mw * T, mh * T - (mw > mh ? 4 : 0))
      for (const [cx, cy, cw] of o.cristales || []) this.solido(x0 + cx * T, y0 + cy * T + 4, cw * T, 10)
      this.letrero(o.titulo[estado.idioma], x0 + W / 2, y0 - 2)
      for (const m of o.muebles) {
        const img = this.add.image(x0 + m.x * T, y0 + m.base * T, m.clave).setOrigin(0.5, 1)
        img.setDepth(m.pared ? -880 : m.pisable ? -890 : y0 + m.base * T)
        if (m.tornos) {
          // solo los postes son sólidos; por los dos brazos se pasa y se abren al acercarse
          for (const px0 of [0, 27, 54]) this.solido(img.x - 32 + px0, img.y - 10, 10, 8)
          this.tornos = { img, x: img.x, y: img.y - 4 }
        } else if (!m.pared && !m.pisable) {
          // el mueble entero es sólido (salvo una franja arriba para no chocar con lo que asoma por detrás)
          const alto = Math.max(6, img.height - (img.height > 30 ? 10 : 3))
          this.solido(img.x - img.width / 2 + 1, img.y - alto, img.width - 2, alto)
          this.add.rectangle(img.x + 2, img.y - 1, img.width - 2, 4, 0x000000, 0.14).setOrigin(0.5, 0).setDepth(-885)
        }
        if (m.vida || m.zona || m.ir || m.arcade) {
          this.interactivos.push({ x: img.x, y: y0 + (m.pared ? 3.3 : m.base + 0.4) * T, radio: m.pared ? 26 : 20, vida: m.vida, zona: m.zona, ir: m.ir, arcade: m.arcade, nombre: 'Alejandro' })
        }
      }
      for (const [i, g] of (o.personas || []).entries()) {
        const clave = `gente-${id}-${i}`
        crearPersonaje(this, clave, g.rasgos)
        crearAnimaciones(this, clave)
        const s = this.physics.add.sprite(x0 + g.x * T, y0 + g.y * T, clave, 0).setOrigin(0.5, 1).setImmovable(true).setDepth(y0 + g.y * T)
        s.body.setSize(10, 6).setOffset(7, 25)
        s.setInteractive({ useHandCursor: true }).on('pointerover', (ptr) => etiqueta(g.nombre, ptr.x, ptr.y)).on('pointerout', () => etiqueta(null))
        this.gente.push(s)
        this.interactivos.push({ x: s.x, y: s.y, radio: 20, vida: g.vida, nombre: g.nombre, persona: true })
      }
      this.salas[id] = { x0, y0, W, H, puertaX, salidaY: y0 + H - 3 }
    })
  }

  // Lleva al jugador a una sala: desde la puerta de un edificio o desde el ascensor
  irASala(id, x = null, y = null) {
    const sala = this.salas[id], cam = this.cameras.main
    this.cambiandoSala = true
    sfx.puerta()
    registrar('zona', `interior-${id}`, true)
    cam.fadeOut(180, 0, 0, 0)
    cam.once('camerafadeoutcomplete', () => {
      this.dentro = id
      const px0 = x == null ? sala.puertaX : sala.x0 + x * T
      const py0 = y == null ? sala.salidaY - 20 : sala.y0 + y * T
      this.jugador.setPosition(px0, py0)
      this.mirando = y == null ? 'arriba' : 'abajo'
      if (this.dantePWsigue) this.dantePW.setPosition(px0 + 14, py0 + 6)
      this.physics.world.setBounds(sala.x0, sala.y0, sala.W, sala.H)
      // la cámara se centra en la sala (con margen alrededor, que es negro) y sigue al jugador si la sala no cabe
      cam.setBounds(sala.x0 - 240, sala.y0 - 200, sala.W + 480, sala.H + 400)
      this.encuadrarSala()
      cam.fadeIn(220)
      this.cambiandoSala = false
    })
  }

  entrar(id) {
    const edificio = EDIFICIOS.find((e) => e.interior === id)
    this.vuelta = { x: edificio.x * T, y: edificio.base * T + 12 }
    this.irASala(id)
  }

  // El ascensor: un aviso corto con la planta y a la otra sala
  async usarAscensor(cosa) {
    if (cosa.vida) await decir('Alejandro', frases(cosa.vida))
    ;[523, 659, 784].forEach((f, i) => sonar(f, 0.12, 'triangle', 0.05, i * 0.12))
    this.irASala(cosa.ir.sala, cosa.ir.x, cosa.ir.y)
  }

  // Si la sala cabe entera en pantalla, la cámara se queda quieta en el centro; si no (móvil), sigue al jugador
  encuadrarSala() {
    if (!this.dentro) return
    const sala = this.salas[this.dentro], cam = this.cameras.main
    // dentro se aleja la cámara lo justo (sin bajar de 2 ni salir de los píxeles enteros) para ver la sala entera
    this.ajustarZoom()
    const zoom = Math.max(2, Math.min(cam.zoom, Math.floor((cam.width - 20) / sala.W), Math.floor((cam.height - 100) / sala.H)))
    cam.setZoom(zoom)
    const cabe = sala.W * cam.zoom < cam.width - 20 && sala.H * cam.zoom < cam.height - 90
    if (cabe) { cam.stopFollow(); cam.centerOn(sala.x0 + sala.W / 2, sala.y0 + sala.H / 2 - 18) }
    else cam.startFollow(this.jugador, true, 0.12, 0.12)
  }

  salir() {
    const cam = this.cameras.main
    this.cambiandoSala = true
    sfx.puerta()
    cam.fadeOut(180, 0, 0, 0)
    cam.once('camerafadeoutcomplete', () => {
      this.dentro = null
      this.jugador.setPosition(this.vuelta.x, this.vuelta.y)
      this.mirando = 'abajo'
      if (this.dantePWsigue) this.dantePW.setPosition(this.vuelta.x + 16, this.vuelta.y + 6)
      this.physics.world.setBounds(0, 0, ANCHO * T, ALTO * T)
      cam.setBounds(0, 0, ANCHO * T, ALTO * T)
      this.ajustarZoom()
      cam.startFollow(this.jugador, true, 0.12, 0.12)
      cam.fadeIn(220)
      this.cambiandoSala = false
    })
  }

  // Dentro de las salas: los tornos se abren al acercarte y los profes te miran
  vidaSalas() {
    const j = this.jugador
    if (this.tornos) {
      const cerca = this.dentro === 'udit' && Math.abs(j.x - this.tornos.x) < 34 && Math.abs(j.y - this.tornos.y) < 18
      if (cerca !== this.tornosAbiertos) {
        this.tornosAbiertos = cerca
        this.tornos.img.setTexture(cerca ? 'tornos_abierto' : 'tornos')
        if (cerca) { sonar(1320, 0.06, 'square', 0.04); sonar(1760, 0.08, 'square', 0.04, 0.07) }
      }
    }
    for (const g of this.gente) {
      if (Phaser.Math.Distance.Between(g.x, g.y, j.x, j.y) > 44) continue
      const dx = j.x - g.x, dy = j.y - g.y
      g.setFrame(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 6 : 3) : (dy > 0 ? 0 : 9))
    }
  }

  // ------------------------------------------------------------------------------------------ las siete esferas
  colocarEsferas() {
    this.esferas = []
    for (const e of ESFERAS) {
      if (estado.esferas.has(e.n)) continue
      const sala = e.dentro && this.salas[e.dentro]
      const x = sala ? sala.x0 + e.x * T : e.x * T
      const y = sala ? sala.y0 + e.y * T : e.y * T
      const brillo = this.add.image(x, y - 5, 'luz').setScale(0.35).setBlendMode(Phaser.BlendModes.ADD).setDepth(y - 1).setAlpha(0.7)
      const img = this.add.image(x, y, `esfera_${e.n}`).setOrigin(0.5, 1).setDepth(y)
      this.tweens.add({ targets: img, y: y - 2, duration: 700 + e.n * 40, yoyo: true, repeat: -1, ease: 'Sine.inOut' })
      this.tweens.add({ targets: brillo, alpha: 0.25, duration: 900, yoyo: true, repeat: -1 })
      const cosa = { x, y: y + 2, radio: 16, esfera: e.n, img, brillo, nombre: 'Alejandro' }
      this.interactivos.push(cosa)
      img.setInteractive({ useHandCursor: true }).on('pointerover', (ptr) => etiqueta(estado.idioma === 'en' ? 'An orange ball' : 'Una bola naranja', ptr.x, ptr.y)).on('pointerout', () => etiqueta(null))
    }
  }

  async recogerEsfera(cosa) {
    this.interactivos.splice(this.interactivos.indexOf(cosa), 1)
    this.tweens.killTweensOf([cosa.img, cosa.brillo])
    this.tweens.add({ targets: [cosa.img, cosa.brillo], y: '-=18', alpha: 0, duration: 450, onComplete: () => { cosa.img.destroy(); cosa.brillo.destroy() } })
    ;[880, 1175, 1568].forEach((f, i) => sonar(f, 0.12, 'square', 0.05, i * 0.07))
    estado.esferas.add(cosa.esfera)
    guardar()
    pintarHUD()
    const n = estado.esferas.size
    registrar('zona', `esfera-${n}`, true)
    const en = estado.idioma === 'en'
    logro(en ? `${cosa.esfera}-star ball (${n}/7)` : `Esfera de ${cosa.esfera} ${cosa.esfera === 1 ? 'estrella' : 'estrellas'} (${n}/7)`)
    if (n === 1) await decir('Alejandro', frases('esfera_primera'))
    if (n === 7) this.pedirDeseo()
  }

  // Con las siete: el cielo se oscurece, las esferas giran alrededor del jugador y se pide el deseo
  async pedirDeseo() {
    const j = this.jugador, cam = this.cameras.main
    this.tweens.addCounter({ from: 0, to: 1, duration: 1800, onUpdate: (t) => { this.deseo = t.getValue() } })
    cam.shake(1600, 0.004)
    ;[392, 494, 587, 784, 988].forEach((f, i) => sonar(f, 0.5, 'triangle', 0.06, i * 0.22))
    const bolas = [1, 2, 3, 4, 5, 6, 7].map((n) => this.add.image(j.x, j.y, `esfera_${n}`).setDepth(9800))
    const brillo = this.add.image(j.x, j.y - 14, 'luz').setScale(2.4).setBlendMode(Phaser.BlendModes.ADD).setDepth(9790).setAlpha(0)
    this.tweens.add({ targets: brillo, alpha: 0.9, duration: 1500 })
    const giro = this.time.addEvent({ delay: 16, loop: true, callback: () => bolas.forEach((b, i) => {
      const a = this.time.now / 500 + (i * Math.PI * 2) / 7
      b.setPosition(j.x + Math.cos(a) * 26, j.y - 14 + Math.sin(a) * 12)
    }) })
    await new Promise((r) => this.time.delayedCall(1900, r))
    await decir('???', frases('deseo'))
    giro.remove()
    this.tweens.add({ targets: bolas, y: '-=120', alpha: 0, duration: 900, onComplete: () => bolas.forEach((b) => b.destroy()) })
    this.tweens.add({ targets: brillo, alpha: 0, duration: 900, onComplete: () => brillo.destroy() })
    this.tweens.addCounter({ from: 1, to: 0, duration: 1500, onUpdate: (t) => { this.deseo = t.getValue() } })
    logro(estado.idioma === 'en' ? 'Wish granted' : 'Deseo concedido')
    registrar('zona', 'deseo', true)
  }

  // La nube amarilla: te subes y durante 20 segundos vas mucho más rápido
  async subirNube() {
    await decir('Alejandro', frases('nube'))
    this.turbo = this.time.now + 20000
    if (!this.nubeJugador) this.nubeJugador = this.add.image(0, 0, 'nube').setOrigin(0.5, 0.5)
    this.nubeJugador.setVisible(true)
    ;[523, 784, 1047].forEach((f, i) => sonar(f, 0.1, 'triangle', 0.05, i * 0.06))
  }

  // Vida en el mapa: mariposas que revolotean, pájaros que cruzan con su sombra y sombras de nubes que pasan
  ambiente() {
    const aleatorio = (a, b) => a + Math.random() * (b - a)
    const sitios = [[14, 16], [26, 30], [55, 24], [66, 26], [98, 27], [127, 25], [150, 27], [9, 18], [42, 30], [112, 29], [158, 24], [78, 26]]
    this.mariposas = sitios.map(([x, y], i) => {
      const m = this.add.sprite(x * T, y * T, i % 2 ? 'mariposa_a' : 'mariposa_b', 0).setDepth(9200)
      this.time.addEvent({ delay: 130 + i * 9, loop: true, callback: () => m.setFrame(m.frame.name == 0 ? 1 : 0) })
      const vuela = () => this.tweens.add({ targets: m, x: x * T + aleatorio(-30, 30), y: y * T + aleatorio(-18, 18), duration: aleatorio(1200, 2600), ease: 'Sine.inOut', onComplete: vuela })
      vuela()
      return m
    })
    this.nubes = [0, 1, 2, 3, 4].map((i) => this.add.image(aleatorio(0, ANCHO * T), aleatorio(4, ALTO - 4) * T, 'sombra_nube').setDepth(9300).setScale(i % 2 ? 1.4 : 1))
    this.time.addEvent({ delay: 50, loop: true, callback: () => this.nubes.forEach((n, i) => { n.x += 0.35 + i * 0.05; if (n.x > ANCHO * T + 160) n.x = -160 }) })
    this.time.addEvent({ delay: 6500, loop: true, callback: () => {
      if (this.dentro) return // dentro de las salas no pasan pájaros
      const vista = this.cameras.main.worldView
      const y = vista.y + aleatorio(30, vista.height * 0.6)
      for (let k = 0; k < (Math.random() < 0.5 ? 1 : 3); k++) {
        const ave = this.add.sprite(vista.x - 20 - k * 14, y + k * 8, 'pajaro', 0).setDepth(9600)
        const sombra = this.add.ellipse(ave.x, ave.y + 56, 7, 3, 0x000000, 0.16).setDepth(-440)
        const aleteo = this.time.addEvent({ delay: 160, loop: true, callback: () => ave.setFrame(ave.frame.name == 0 ? 1 : 0) })
        this.tweens.add({ targets: [ave, sombra], x: `+=${vista.width + 80}`, duration: 7000, onComplete: () => { aleteo.remove(); ave.destroy(); sombra.destroy() } })
      }
    } })
  }

  // ------------------------------------------------------------------------------------------ día y noche
  // Un ciclo completo dura DURACION_DIA: día, atardecer naranja, noche azul con farolas, focos y puertas
  // encendidos y luciérnagas, y amanecer. El botón del sol/la luna de la barra salta al día o a la noche.
  cicloDia() {
    if (!this.textures.exists('luz')) {
      const [c, ctx] = lienzo(64, 64)
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, 'rgba(255,226,150,0.95)'); g.addColorStop(0.35, 'rgba(255,200,110,0.45)'); g.addColorStop(1, 'rgba(255,190,90,0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64)
      this.textures.addCanvas('luz', c)
      const [l, lx] = lienzo(3, 3)
      px(lx, 1, 0, '#fff7a8'); px(lx, 0, 1, '#fff7a8', 3, 1); px(lx, 1, 2, '#fff7a8'); px(lx, 1, 1, '#ffffff')
      this.textures.addCanvas('luciernaga', l)
    }
    const W = ANCHO * T, H = ALTO * T
    // el velo cubre también las salas de debajo del mapa (de noche dentro hay luz, pero el deseo oscurece todo)
    this.velo = this.add.rectangle(0, 0, W, H + 40 * T, 0x1c2a5e, 1).setOrigin(0).setDepth(9700).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY)
    this.sombraNoche = this.add.rectangle(0, 0, W, H + 40 * T, 0x060a18, 1).setOrigin(0).setDepth(9701).setAlpha(0)
    this.atardecer = this.add.rectangle(0, 0, W, H, 0xff7a2a, 1).setOrigin(0).setDepth(9701).setAlpha(0)
    // luces: farolas, focos del campo y la puerta de cada edificio
    // cada luz tiene dos partes: el charco de luz en el suelo (por debajo de las personas, así no las borra)
    // y un brillo pequeño en la bombilla, por encima de todo
    const luces = []
    for (const o of OBJETOS) {
      const x = o.x * T + (o.clave === 'farola_moderna' ? 4 : 0)
      if (o.clave === 'farola' || o.clave === 'farola_moderna') luces.push([x, o.base * T - 6, 1.5, o.base * T - 32, 0.45])
      if (o.clave === 'foco') luces.push([o.x * T, o.base * T + 10, 2.2, o.base * T - 54, 0.7])
    }
    for (const e of EDIFICIOS) luces.push([e.x * T, e.base * T + 4, 0.8, null, 0])
    this.luces = luces.flatMap(([x, y, s, yb, sb]) => [
      this.add.image(x, y, 'luz').setScale(s, s * 0.6).setDepth(-430).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0),
      ...(yb == null ? [] : [this.add.image(x, yb, 'luz').setScale(sb).setDepth(9750).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0)]),
    ])
    this.luciernagas = Array.from({ length: 26 }, (_, i) => {
      const x = ((i * 397) % (W - 200)) + 100, y = ((i * 211) % (H - 160)) + 80
      const l = this.add.image(x, y, 'luciernaga').setDepth(9760).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0)
      const vuela = () => this.tweens.add({ targets: l, x: x + Phaser.Math.Between(-40, 40), y: y + Phaser.Math.Between(-24, 24), duration: Phaser.Math.Between(2000, 4000), ease: 'Sine.inOut', onComplete: vuela })
      vuela()
      return l
    })
    // de noche, una luz suave alrededor del jugador para que siempre se le vea
    this.luzJugador = this.add.image(0, 0, 'luz').setScale(1.5).setDepth(9755).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0).setTint(0xbfd4ff)
    this.horaBase = this.time.now - DURACION_DIA * 0.05 // se empieza de día
  }

  // Para cada edificio se saca una capa con solo sus cristales pintados de luz cálida (no todas las ventanas:
  // unas tres de cada cuatro, como en un pueblo de noche). Va por encima del velo y se enciende al anochecer.
  ventanasNoche() {
    this.ventanas = []
    const claves = new Set([...EDIFICIOS.map((e) => e.clave), 'recreativos', 'quiosco', 'casa_pina', 'casa_cabeza'])
    // casas cuya piedra o pared se confunde con cristal: solo se encienden los colores de sus ventanas
    const soloVentanas = { casa_cabeza: ['127,200,255', '214,236,250'] }
    for (const clave of claves) {
      const nombre = `${clave}_luces`
      if (!this.textures.exists(nombre)) {
        const img = this.textures.get(clave).getSourceImage()
        const [c, ctx] = lienzo(img.width, img.height)
        ctx.drawImage(img, 0, 0)
        const datos = ctx.getImageData(0, 0, img.width, img.height), d = datos.data
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2], x = (i / 4) % img.width, y = Math.floor(i / 4 / img.width)
          const cristal = soloVentanas[clave] ? d[i + 3] > 200 && soloVentanas[clave].includes(`${r},${g},${b}`) : d[i + 3] > 200 && ((b - r > 30 && b > 120 && g > r) || (b - r > 10 && b - r < 36 && b > 55 && b < 110 && g >= r - 4))
          const encendida = ((Math.floor(x / 9) * 7 + Math.floor(y / 11) * 13 + clave.length) % 4) !== 0
          if (cristal && encendida) { const k = (r + g + b) / 765; d[i] = 255; d[i + 1] = 200 + k * 40; d[i + 2] = 110 + k * 60; d[i + 3] = 255 } else d[i + 3] = 0
        }
        ctx.putImageData(datos, 0, 0)
        this.textures.addCanvas(nombre, c)
      }
    }
    // la capa de luces va justo encima de su edificio (no de todo): así el jugador que pasa por delante la tapa
    // y el que pasa por detrás queda oculto, como con el propio edificio
    const capa = (x, base, clave) => { const v = this.add.image(x * T, base * T, `${clave}_luces`).setOrigin(0.5, 1).setDepth(base * T + 0.5).setAlpha(0); v.esLuz = true; this.ventanas.push(v) }
    for (const e of EDIFICIOS) capa(e.x, e.base, e.clave)
    for (const o of OBJETOS) if (claves.has(o.clave)) capa(o.x, o.base, o.clave)
  }

  // Momento del día de 0 a 1 y cuánto es de noche (0 = pleno día, 1 = noche cerrada)
  noche() {
    const p = (((this.time.now - this.horaBase) / DURACION_DIA) % 1 + 1) % 1
    const suave = (a, b, v) => Phaser.Math.Clamp((v - a) / (b - a), 0, 1)
    if (p < 0.42) return { p, n: 0, tarde: 0 }
    if (p < 0.5) { const k = suave(0.42, 0.5, p); return { p, n: k, tarde: Math.sin(k * Math.PI) } }
    if (p < 0.92) return { p, n: 1, tarde: 0 }
    const k = suave(0.92, 1, p)
    return { p, n: 1 - k, tarde: Math.sin(k * Math.PI) * 0.6 }
  }

  // Salta a la noche si es de día y al día si es de noche (botón de la barra de arriba)
  cambiarHora() {
    const { n } = this.noche()
    this.horaBase = this.time.now - DURACION_DIA * (n > 0.5 ? 0.02 : 0.55)
    return n <= 0.5
  }
  esDeNoche() { return this.noche().n > 0.5 }

  // Color por el que se multiplica cada cosa: blanco de día, azul de noche y anaranjado al atardecer
  teñir(n, tarde) {
    const clave = `${Math.round(n * 40)}_${Math.round(tarde * 40)}`
    if (clave === this.tinteActual && this.time.now < (this.tinteHasta || 0)) return
    this.tinteActual = clave
    this.tinteHasta = this.time.now + 600 // de vez en cuando se repasa, por lo que aparece nuevo (pájaros…)
    const mezcla = (k) => {
      const noche = [74, 90, 160], naranja = [255, 196, 150]
      const c = [255, 255, 255].map((v, i) => v + (noche[i] - v) * k).map((v, i) => v * (1 - tarde * 0.35 * (1 - k)) + naranja[i] * tarde * 0.35 * (1 - k))
      return (Math.round(c[0]) << 16) | (Math.round(c[1]) << 8) | Math.round(c[2])
    }
    const mundo = mezcla(n), gente = mezcla(n * 0.55), yo = mezcla(n * 0.25)
    const personas = new Set([this.guia, this.dantePW, this.jerry, ...this.npcs, ...(this.gente || [])])
    for (const o of this.children.list) {
      if (!o.setTint || o.esLuz || o.blendMode !== Phaser.BlendModes.NORMAL || o.depth >= 9740) continue
      o.setTint(o === this.jugador || o === this.nubeJugador ? yo : personas.has(o) ? gente : mundo)
    }
  }

  actualizarLuz() {
    if (!this.velo) return
    let { n, tarde } = this.noche()
    if (this.dentro) { n = 0; tarde = 0 } // dentro de los edificios siempre hay luz
    if (this.deseo) n = Math.max(n, this.deseo) // el cielo se oscurece al pedir el deseo
    const fuera = !this.dentro || this.deseo
    // la noche ya no es una capa por encima de todo: se tiñe cada cosa del mapa (así se respeta qué va delante de qué)
    // y las personas se tiñen menos, sobre todo el jugador, para que se vean nítidas
    this.velo.setAlpha(0)
    this.sombraNoche.setAlpha(0)
    this.atardecer.setAlpha(0)
    this.teñir(fuera ? n : 0, fuera ? tarde : 0)
    const encendido = Phaser.Math.Clamp((n - 0.25) / 0.6, 0, 1)
    const parpadeo = 0.92 + Math.sin(this.time.now / 260) * 0.04
    this.luces.forEach((l) => l.setAlpha(encendido * parpadeo * 0.75))
    this.ventanas?.forEach((v, i) => v.setAlpha(encendido * (0.85 + Math.sin(this.time.now / 900 + i) * 0.08)))
    if (this.jugador) this.luzJugador.setPosition(this.jugador.x, this.jugador.y - 12).setAlpha(this.dentro ? 0 : encendido * 0.14)
    document.body.classList.toggle('noche', encendido > 0.5 && !this.dentro)
    this.luciernagas.forEach((l, i) => l.setAlpha(encendido * (0.5 + 0.5 * Math.sin(this.time.now / 300 + i))))
    // las mariposas se van a dormir
    this.mariposas?.forEach((m) => m.setAlpha(1 - encendido))
    const icono = n > 0.5 ? '☾' : '☀'
    if (icono !== this.iconoHora) { this.iconoHora = icono; this.events.emit('hora', icono) }
  }

  // ------------------------------------------------------------------------------------------ personajes
  colocarPersonajes() {
    this.npcs = []
    PERSONAJES.forEach((p, i) => {
      const clave = `npc-${i}`
      crearPersonaje(this, clave, p.rasgos)
      crearAnimaciones(this, clave)
      const s = this.physics.add.sprite(p.x * T, p.y * T, clave, 0).setOrigin(0.5, 1).setImmovable(true)
      s.body.setSize(10, 6).setOffset(7, 25)
      s.setData('paseo', { clave, casaX: p.x * T, casaY: p.y * T, radio: p.vida ? 18 : 22, destino: null, espera: 1000 + (i * 977) % 3000 })
      s.setInteractive({ useHandCursor: true })
      s.on('pointerover', (ptr) => etiqueta(p.nombre, ptr.x, ptr.y))
      s.on('pointermove', (ptr) => etiqueta(p.nombre, ptr.x, ptr.y))
      s.on('pointerout', () => etiqueta(null))
      s.on('pointerdown', (ptr) => { etiqueta(p.nombre, ptr.x, ptr.y); setTimeout(() => etiqueta(null), 1500) })
      this.npcs.push(s)
      // el punto para hablar con ellos se mueve con ellos
      if (p.vida) this.interactivos.push({ get x() { return s.x }, get y() { return s.y }, radio: 18, vida: p.vida, nombre: p.nombre })
      else if (p.grupo) this.interactivos.push({ get x() { return s.x }, get y() { return s.y }, radio: 18, frase: () => fraseAmigo(p), nombre: p.nombre })
    })

    // Palomas que picotean y dan saltitos por la plaza y la terraza de la uni
    for (const [x0, y0, n] of [[27.5, 21.3, 3], [38, 17.2, 3], [124, 22.4, 2]]) {
      for (let i = 0; i < n; i++) {
        const pal = this.add.sprite((x0 + i * 1.3) * T, (y0 + (i % 2) * 0.6) * T, 'paloma', 0).setOrigin(0.5, 1).setDepth(y0 * T)
        if (i % 2) pal.setFlipX(true)
        this.time.addEvent({ delay: 600 + i * 230, loop: true, callback: () => pal.setFrame(Math.random() < 0.5 ? 1 : 0) })
        this.tweens.add({ targets: pal, x: pal.x + (i % 2 ? -10 : 10), duration: 3000 + i * 500, yoyo: true, repeat: -1, ease: 'Stepped', easeParams: [6], onYoyo: () => pal.toggleFlipX(), onRepeat: () => pal.toggleFlipX() })
      }
    }

    // Alejandro, el guía
    this.guia = this.physics.add.sprite(12 * T, (CAMINO + 0.5) * T, 'alejandro', 0).setOrigin(0.5, 1)
    this.guia.body.setSize(10, 6).setOffset(7, 25)
    this.guia.setImmovable(true)
    this.guia.setInteractive({ useHandCursor: true })
    this.guia.on('pointerover', (ptr) => etiqueta('Alejandro', ptr.x, ptr.y))
    this.guia.on('pointerout', () => etiqueta(null))

    // Jerry da vueltas por la zona de la uni
    this.jerry = this.physics.add.sprite(112 * T, 22.6 * T, 'jerry', 0).setOrigin(0.5, 1).setImmovable(true).play('jerry-andar')
    this.jerry.body.setSize(12, 6).setOffset(2, 10)
    this.tweens.add({ targets: this.jerry, x: 128 * T, duration: 9000, yoyo: true, repeat: -1, onYoyo: () => this.jerry.setFlipX(true), onRepeat: () => this.jerry.setFlipX(false) })
    this.jerry.setInteractive({ useHandCursor: true }).on('pointerover', (ptr) => etiqueta('Jerry', ptr.x, ptr.y)).on('pointerout', () => etiqueta(null))

    // DANTE P.W., la IA con cara de robot de Dante
    this.dantePW = this.physics.add.sprite(140 * T, (CAMINO + 2.6) * T, 'dante_pw', 0).setOrigin(0.5, 1)
    this.dantePW.body.setSize(10, 6).setOffset(7, 25)
    this.dantePW.setImmovable(true)
    this.dantePW.setInteractive({ useHandCursor: true }).on('pointerover', (ptr) => etiqueta('DANTE P.W.', ptr.x, ptr.y)).on('pointerout', () => etiqueta(null))
    this.dantePWsigue = false
  }

  // ------------------------------------------------------------------------------------------ empezar a jugar
  // Al volver al menú desde la barra: se sale de la sala si estás dentro y la cámara vuelve a pasear por el mapa
  pausarParaMenu() {
    const cam = this.cameras.main
    if (this.dentro) { this.dentro = null; this.physics.world.setBounds(0, 0, ANCHO * T, ALTO * T); cam.setBounds(0, 0, ANCHO * T, ALTO * T); this.ajustarZoom() }
    this.jugador?.setVelocity(0)
    cam.stopFollow()
    this.modo = 'portada'
  }

  empezar() {
    // si ya se estaba jugando (se vuelve desde el menú), se quita el personaje anterior y sus colisiones
    if (this.jugador) {
      this.colisiones.forEach((c) => c.destroy())
      this.jugador.destroy()
      this.tweens.killTweensOf(this.guia)
      this.paseoGuia = null
      this.turbo = 0
    }
    const p = estado.personaje
    crearPersonaje(this, 'jugador', p.rasgos)
    crearAnimaciones(this, 'jugador')
    // Se empieza al sur del pueblo, delante de la Puerta de la Villa
    this.jugador = this.physics.add.sprite(19 * T, 31.8 * T, 'jugador', 9).setOrigin(0.5, 1)
    this.mirando = 'arriba'
    this.jugador.body.setSize(10, 6).setOffset(7, 25)
    this.jugador.setCollideWorldBounds(true)
    this.colisiones = [
      this.physics.add.collider(this.jugador, this.solidos),
      this.physics.add.collider(this.jugador, this.npcs),
      // Alejandro, DANTE P.W., Jerry y los profes también son sólidos: no se les atraviesa
      this.physics.add.collider(this.jugador, [this.guia, this.dantePW, this.jerry, ...this.gente]),
    ]
    if (!this.npcsChocan) { this.physics.add.collider(this.npcs, this.solidos); this.npcsChocan = true }
    this.jugador.setInteractive().on('pointerover', (ptr) => etiqueta(p.nombre, ptr.x, ptr.y)).on('pointerout', () => etiqueta(null))
    this.cameras.main.startFollow(this.jugador, true, 0.12, 0.12)
    // El jugador va algo por debajo del centro para que se vean enteros los edificios altos bajo la barra de arriba
    this.cameras.main.setFollowOffset(0, 36)
    this.modo = 'juego'
    this.paso = estado.recorridoHecho ? RECORRIDO.length : 0
    if (estado.recorridoHecho) this.guia.setPosition(148 * T, (CAMINO + 0.5) * T)
    mostrarHUD(true)
    pintarHUD()
    this.guiaEnMarcha = false
    this.contando = false
    if (!estado.recorridoHecho) this.siguientePaso(true)
  }

  // Mueve a Alejandro hasta la siguiente parada del recorrido (pasando por los puntos intermedios)
  siguientePaso(primero = false) {
    if (this.paso >= RECORRIDO.length) return
    const destino = RECORRIDO[this.paso]
    const puntos = [...(destino.via || []), [destino.x, destino.y]]
    if (primero) { this.guia.setPosition(destino.x * T, destino.y * T); return }
    this.guiaEnMarcha = true
    const andar = () => {
      if (!puntos.length) { this.guiaEnMarcha = false; this.guia.anims.stop(); this.guia.setFrame(0); return }
      const [px, py] = puntos.shift()
      const dx = px * T - this.guia.x, dy = py * T - this.guia.y
      const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'derecha' : 'izquierda') : (dy > 0 ? 'abajo' : 'arriba')
      this.guia.play(`alejandro-${dir}`, true)
      this.tweens.add({ targets: this.guia, x: px * T, y: py * T, duration: (Math.hypot(dx, dy) / 70) * 1000, onComplete: andar })
    }
    andar()
  }

  async contarPaso() {
    this.contando = true
    const paso = RECORRIDO[this.paso]
    this.guia.setFrame(this.guia.x > this.jugador.x ? 3 : 6)
    await decir('Alejandro', frases(paso.historia))
    this.paso++
    if (this.paso >= RECORRIDO.length) { estado.recorridoHecho = true; guardar(); registrar('recorrido', 'completo', true) }
    this.contando = false
    this.siguientePaso()
  }

  saltarRecorrido() {
    this.tweens.killTweensOf(this.guia)
    this.paseoGuia = null
    if (this.paso < RECORRIDO.length) registrar('recorrido', `saltado en el paso ${this.paso + 1}`, true)
    this.paso = RECORRIDO.length
    estado.recorridoHecho = true
    guardar()
    this.guia.setPosition(148 * T, (CAMINO + 0.5) * T)
  }

  // ------------------------------------------------------------------------------------------ interacción
  // Lo más cercano con lo que se puede interactuar (mismo orden de prioridad que interactuar)
  cercano() {
    const j = this.jugador
    const cerca = (o, r) => Phaser.Math.Distance.Between(j.x, j.y, o.x, o.y) < r
    if (cerca(this.jerry, 24)) return { x: this.jerry.x, y: this.jerry.y - 18 }
    if (cerca(this.dantePW, 22)) return { x: this.dantePW.x, y: this.dantePW.y - 34 }
    if (cerca(this.guia, 24) && !this.guiaEnMarcha) return { x: this.guia.x, y: this.guia.y - 34, guia: true }
    const cosa = this.interactivos.filter((o) => cerca(o, o.radio)).sort((a, b) => Phaser.Math.Distance.Between(j.x, j.y, a.x, a.y) - Phaser.Math.Distance.Between(j.x, j.y, b.x, b.y))[0] // lo más cercano, no lo primero de la lista
    if (!cosa) return null
    // los NPC tienen getters (se mueven); los edificios y objetos, un punto fijo junto a la puerta
    return { x: cosa.x, y: cosa.y - (Object.getOwnPropertyDescriptor(cosa, 'x')?.get ? 34 : 26) }
  }

  async interactuar() {
    const j = this.jugador
    const cerca = (o, r = 22) => Phaser.Math.Distance.Between(j.x, j.y, o.x, o.y) < r
    if (cerca(this.jerry, 24)) return decir('Jerry', frases('jerry'))
    if (cerca(this.dantePW, 22)) {
      this.dantePWsigue = !this.dantePWsigue
      return decir('DANTE P.W.', frases(this.dantePWsigue ? 'dante_pw_hablar' : 'dante_pw_parar'))
    }
    if (cerca(this.guia, 24) && !this.guiaEnMarcha) {
      if (this.paso < RECORRIDO.length) return this.contarPaso()
      return decir('Alejandro', frases('final').slice(1))
    }
    const cosa = this.interactivos.filter((o) => cerca(o, o.radio)).sort((a, b) => Phaser.Math.Distance.Between(j.x, j.y, a.x, a.y) - Phaser.Math.Distance.Between(j.x, j.y, b.x, b.y))[0] // lo más cercano, no lo primero de la lista
    if (!cosa) return
    if (cosa.esfera) return this.recogerEsfera(cosa)
    if (cosa.interior) return this.entrar(cosa.interior)
    if (cosa.ir) return this.usarAscensor(cosa)
    if (cosa.nube) return this.subirNube()
    if (cosa.arcade) return abrirArcade(cosa.arcade)
    if (cosa.zona) return abrirPanel(cosa.zona)
    if (cosa.frase) return decir(cosa.nombre, cosa.frase())
    if (cosa.vida) return decir(cosa.nombre, frases(cosa.vida))
  }

  // Al acabar el recorrido, Alejandro no se queda quieto: va andando por el camino de un sitio a otro,
  // se para un rato y sigue. Si te acercas, se para y te mira para que puedas hablar con él.
  pasearGuia(pausado) {
    if (this.paso < RECORRIDO.length || this.contando) return
    const g = this.guia, j = this.jugador
    const cerca = Phaser.Math.Distance.Between(g.x, g.y, j.x, j.y) < 40
    if (pausado || cerca) {
      if (this.paseoGuia?.isPlaying()) this.paseoGuia.pause()
      g.anims.stop()
      if (cerca) { const dx = j.x - g.x, dy = j.y - g.y; g.setFrame(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 6 : 3) : (dy > 0 ? 0 : 9)) }
      return
    }
    if (this.paseoGuia?.isPaused()) { this.paseoGuia.resume(); g.play(this.animGuia, true); return }
    if (this.paseoGuia || this.time.now < (this.esperaGuia || 0)) return
    // otro punto del camino principal, ni muy cerca ni muy lejos de donde está
    const destino = Phaser.Math.Clamp(g.x / T + Phaser.Math.Between(-14, 14), CAMINO_INICIO + 2, ANCHO - 6) * T
    const y = (CAMINO + Phaser.Math.FloatBetween(0.3, 1.6)) * T
    const dx = destino - g.x, dy = y - g.y
    this.animGuia = `alejandro-${Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'derecha' : 'izquierda') : (dy > 0 ? 'abajo' : 'arriba')}`
    g.play(this.animGuia, true)
    this.paseoGuia = this.tweens.add({
      targets: g, x: destino, y, duration: (Math.hypot(dx, dy) / 45) * 1000,
      onComplete: () => { g.anims.stop(); g.setFrame([0, 3, 6][Phaser.Math.Between(0, 2)]); this.esperaGuia = this.time.now + Phaser.Math.Between(2000, 5000); this.paseoGuia = null },
    })
  }

  // Cada NPC da paseos cortos alrededor de su sitio; si el jugador se acerca, se para y le mira
  pasear(n, pausado) {
    const m = n.getData('paseo')
    const ahora = this.time.now
    const j = this.jugador
    const cerca = Phaser.Math.Distance.Between(n.x, n.y, j.x, j.y) < 34
    if (pausado || cerca) {
      n.setVelocity(0); n.anims.stop(); m.destino = null; m.espera = ahora + 1500
      if (cerca) { const dx = j.x - n.x, dy = j.y - n.y; n.setFrame(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 6 : 3) : (dy > 0 ? 0 : 9)) }
      return
    }
    if (!m.destino) {
      if (ahora < m.espera) return
      const a = Math.random() * Math.PI * 2, r = Math.random() * m.radio
      m.destino = { x: m.casaX + Math.cos(a) * r, y: m.casaY + Math.sin(a) * r, hasta: ahora + 3500 }
    }
    const dx = m.destino.x - n.x, dy = m.destino.y - n.y
    if (Math.hypot(dx, dy) < 2 || ahora > m.destino.hasta) {
      n.setVelocity(0); n.anims.stop(); n.setFrame(Math.random() < 0.5 ? 0 : [3, 6, 9][Math.floor(Math.random() * 3)])
      m.destino = null; m.espera = ahora + 1500 + Math.random() * 3500
      return
    }
    const v = new Phaser.Math.Vector2(dx, dy).normalize().scale(26)
    n.setVelocity(v.x, v.y)
    n.play(`${m.clave}-${Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'derecha' : 'izquierda') : (dy > 0 ? 'abajo' : 'arriba')}`, true)
  }

  update() {
    this.actualizarLuz()
    if (this.modo === 'portada') {
      // Barrido lento de cámara por el mapa
      const cam = this.cameras.main
      cam.scrollX += 0.25
      if (cam.scrollX > ANCHO * T - cam.width / cam.zoom) cam.scrollX = 0
      return
    }
    const j = this.jugador
    const k = this.teclas
    const tt = teclasTactiles
    const pausado = hayPanel() || hayDialogo()
    const accion = Phaser.Input.Keyboard.JustDown(k.E) || Phaser.Input.Keyboard.JustDown(k.SPACE) || Phaser.Input.Keyboard.JustDown(k.ENTER) || tt.accion
    tt.accion = false
    if (accion) { if (hayDialogo()) avanzarDialogo(); else if (!hayPanel()) this.interactuar() }

    let vx = 0, vy = 0
    const quieto = pausado || this.cambiandoSala
    if (!quieto) {
      if (k.A.isDown || k.LEFT.isDown || tt.izquierda) vx = -1
      else if (k.D.isDown || k.RIGHT.isDown || tt.derecha) vx = 1
      if (k.W.isDown || k.UP.isDown || tt.arriba) vy = -1
      else if (k.S.isDown || k.DOWN.isDown || tt.abajo) vy = 1
    }
    // con la palanca del móvil se anda en cualquier dirección y más o menos deprisa según cuánto se empuje
    const analogico = !quieto && (tt.vx || tt.vy)
    const turbo = this.turbo > this.time.now
    const rapidez = VELOCIDAD * (turbo ? 1.8 : 1)
    const v = analogico ? new Phaser.Math.Vector2(tt.vx, tt.vy).scale(rapidez) : new Phaser.Math.Vector2(vx, vy).normalize().scale(rapidez)
    if (analogico) { vx = tt.vx; vy = tt.vy }
    j.setVelocity(v.x, v.y)
    if (this.nubeJugador) {
      this.nubeJugador.setVisible(turbo).setPosition(j.x, j.y - 1 + Math.sin(this.time.now / 150)).setDepth(j.y - 1)
    }
    if (vx || vy) {
      const dir = Math.abs(vx) > Math.abs(vy) ? (vx < 0 ? 'izquierda' : 'derecha') : (vy < 0 ? 'arriba' : 'abajo')
      j.play(`jugador-${dir}`, true)
      this.mirando = dir
    } else {
      j.anims.stop()
      j.setFrame({ abajo: 0, izquierda: 3, derecha: 6, arriba: 9 }[this.mirando || 'abajo'])
    }
    j.setDepth(j.y)
    this.guia.setDepth(this.guia.y)
    this.npcs.forEach((n) => { this.pasear(n, pausado); n.setDepth(n.y) })
    this.pasearGuia(pausado)
    this.jerry.setDepth(this.jerry.y)

    // DANTE P.W. sigue al jugador si se lo pides
    const d = this.dantePW
    if (this.dantePWsigue) {
      const dist = Phaser.Math.Distance.Between(d.x, d.y, j.x, j.y)
      if (dist > 24) {
        this.physics.moveToObject(d, j, VELOCIDAD * 0.9)
        const dx = j.x - d.x, dy = j.y - d.y
        d.play(`dante_pw-${Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'derecha' : 'izquierda') : (dy > 0 ? 'abajo' : 'arriba')}`, true)
      } else { d.setVelocity(0); d.anims.stop() }
    }
    d.setDepth(d.y)

    // «!» encima de Alejandro cuando te está esperando para contarte algo
    const esperando = this.paso < RECORRIDO.length && !this.guiaEnMarcha && !this.contando
    this.aviso.setVisible(esperando).setPosition(this.guia.x, this.guia.y - 34 + Math.sin(this.time.now / 150) * 1.5)
    if (esperando && !pausado && Phaser.Math.Distance.Between(j.x, j.y, this.guia.x, this.guia.y) < 30) this.contarPaso()

    // salir de una sala por la puerta de abajo
    if (this.dentro && !this.cambiandoSala) {
      const sala = this.salas[this.dentro]
      if (sala.puertaX != null && j.y >= sala.salidaY && Math.abs(j.x - sala.puertaX) < T + 2) this.salir()
      this.vidaSalas()
    }

    const objetivo = pausado ? null : this.cercano()
    this.tecla.setVisible(!!objetivo && !(esperando && objetivo.guia))
    if (objetivo) this.tecla.setPosition(Math.round(objetivo.x), Math.round(objetivo.y + Math.sin(this.time.now / 180) * 1.5))
  }
}
