// La escena principal: el mundo en píxeles, el personaje del visitante, Alejandro como guía y todos los NPC.
import Phaser from 'phaser'
import { T, crearPersonaje, crearAnimaciones, crearJerry, crearSuelos, crearEdificios, crearDecorado } from '../sprites.js'
import { ANCHO, ALTO, CAMINO, CAMINO_INICIO, EDIFICIOS, OBJETOS, SUELOS, SENDAS, PERSONAJES, RECORRIDO } from '../mapa.js'
import { HISTORIA } from '../historia.js'
import { estado, guardar } from '../estado.js'
import { decir, hayDialogo, avanzarDialogo, abrirPanel, hayPanel, etiqueta, teclasTactiles, mostrarHUD, pintarHUD } from '../ui.js'
import { sfx } from '../sonido.js'

const VELOCIDAD = 90
// Sacado de sus fotos: pelo oscuro ondulado, piel morena clara, camiseta blanca, cadena plateada,
// vaqueros anchos y zapatillas blancas, y el portátil con pegatinas
const ALEJANDRO = { pelo: 'ondulado', colorPelo: '#241812', piel: '#d99e78', ropa: '#f2f3f5', pantalon: '#4f6d9a', anchos: true, zapatillas: '#f4f4f4', cadena: true }
const DANTE_PW = { pelo: 'flequillo', colorPelo: '#9aa3ad', piel: '#b8c4d0', ojos: '#3dd9ff', ropa: '#3dd9ff', pantalon: '#5b6068', robot: true }

const frases = (clave) => HISTORIA[estado.idioma][clave] || []

export default class Mundo extends Phaser.Scene {
  constructor() { super('Mundo') }

  create() {
    this.modo = 'portada'
    this.prepararTexturas()
    this.solidos = this.physics.add.staticGroup()
    this.interactivos = []
    this.pintarSuelo()
    this.pintarArboles()
    this.colocarEdificios()
    this.colocarPersonajes()

    this.physics.world.setBounds(0, 0, ANCHO * T, ALTO * T)
    this.cameras.main.setBounds(0, 0, ANCHO * T, ALTO * T)
    this.ajustarZoom()
    this.scale.on('resize', () => this.ajustarZoom())

    this.teclas = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE,ENTER')
    this.aviso = this.add.text(0, 0, '!', { fontFamily: '"Press Start 2P"', fontSize: '8px', color: '#f2c200', resolution: 4 })
      .setOrigin(0.5, 1).setDepth(10000).setVisible(false)

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
    for (let y = 0; y < ALTO; y++) for (let x = 0; x < ANCHO; x++) ctx.drawImage(img(azar() > 0.93 ? 'hierba2' : 'hierba'), x * T, y * T)
    for (let x = CAMINO_INICIO; x < ANCHO - 2; x++) for (const y of [CAMINO, CAMINO + 1]) ctx.drawImage(img('camino'), x * T, y * T)
    for (const sd of SENDAS) for (let y = sd.y0; y <= sd.y1; y++) ctx.drawImage(img('camino'), sd.x * T, y * T)
    for (const z of SUELOS) for (let y = z.y0; y <= z.y1; y++) for (let x = z.x0; x <= z.x1; x++) ctx.drawImage(img(z.tipo), x * T, y * T)
    if (this.textures.exists('suelo')) this.textures.remove('suelo')
    this.textures.addCanvas('suelo', lienzo)
    this.add.image(0, 0, 'suelo').setOrigin(0).setDepth(-1000)
    // El agua no se pisa
    const agua = SUELOS.find((z) => z.tipo === 'agua')
    this.solido((agua.x0) * T, agua.y0 * T, (agua.x1 - agua.x0 + 1) * T, (agua.y1 - agua.y0 + 1) * T)
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
    return false
  }

  pintarArboles() {
    let s = 5
    const azar = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
    for (let y = 1; y < ALTO; y += 2) {
      for (let x = 1; x < ANCHO - 1; x += 2) {
        const borde = y < 4 || y > ALTO - 3 || x < 2 || x > ANCHO - 3
        if ((borde && azar() > 0.15) || (!borde && azar() > 0.9)) {
          const ax = x + (azar() - 0.5)
          if (!borde && this.ocupado(ax, y)) continue
          this.add.image(ax * T, y * T, 'arbol').setOrigin(0.5, 1).setDepth(y * T)
          this.solido(ax * T - 4, y * T - 6, 8, 6)
        } else if (!borde && azar() > 0.82) {
          const bx = x + (azar() - 0.5) * 1.5
          if (!this.ocupado(bx, y)) this.add.image(bx * T, y * T, 'arbusto').setOrigin(0.5, 1).setDepth(y * T)
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
      this.solido(e.x * T - w / 2, e.base * T - h + 8, w, h - 8)
      if (e.letrero) this.letrero(e.letrero, e.x * T, e.base * T - h - 1)
      if (e.zona || e.vida) this.interactivos.push({ x: e.x * T, y: e.base * T + 6, radio: 20, zona: e.zona, vida: e.vida, nombre: 'Alejandro' })
    }
    for (const o of OBJETOS) {
      const img = this.add.image(o.x * T, o.base * T, o.clave).setOrigin(0.5, 1).setDepth(o.base * T)
      if (o.puerta) {
        // Las torres son sólidas; por el arco del medio se pasa y se ve al otro lado
        this.solido(o.x * T - 64, o.base * T - 28, 51, 26)
        this.solido(o.x * T + 13, o.base * T - 28, 51, 26)
      } else if (o.clave === 'campo') {
        img.setDepth(-500)
      } else if (o.encima) {
        img.setDepth(o.base * T + 40) // pegado a la pared de un edificio
      } else if (o.clave === 'arbusto') {
        // se puede pisar
      } else if (['farola', 'farola_moderna', 'veleta', 'papelera'].includes(o.clave)) {
        this.solido(o.x * T - 3, o.base * T - 5, 6, 5)
      } else if (o.clave !== 'cartel' && o.clave !== 'bloque') {
        this.solido(o.x * T - img.width / 2 + 2, o.base * T - img.height / 2, img.width - 4, img.height / 2)
      } else {
        this.solido(o.x * T - 4, o.base * T - 6, 8, 6)
      }
      if (o.letrero) this.letrero(o.letrero, o.x * T, o.base * T - img.height - 1, o.zona ? '#2fbf71' : '#ffffff')
      if (o.zona || o.vida) this.interactivos.push({ x: o.x * T, y: o.base * T + (o.clave === 'campo' ? -32 : 4), radio: o.clave === 'campo' ? 40 : 20, zona: o.zona, vida: o.vida, nombre: 'Alejandro' })
    }
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
    })

    // Alejandro, el guía
    this.guia = this.physics.add.sprite(12 * T, (CAMINO + 0.5) * T, 'alejandro', 0).setOrigin(0.5, 1)
    this.guia.body.setSize(10, 6).setOffset(7, 25)
    this.guia.setInteractive({ useHandCursor: true })
    this.guia.on('pointerover', (ptr) => etiqueta('Alejandro', ptr.x, ptr.y))
    this.guia.on('pointerout', () => etiqueta(null))

    // Jerry da vueltas por la zona de la uni
    this.jerry = this.physics.add.sprite(112 * T, 22.6 * T, 'jerry', 0).setOrigin(0.5, 1).play('jerry-andar')
    this.tweens.add({ targets: this.jerry, x: 128 * T, duration: 9000, yoyo: true, repeat: -1, onYoyo: () => this.jerry.setFlipX(true), onRepeat: () => this.jerry.setFlipX(false) })
    this.jerry.setInteractive({ useHandCursor: true }).on('pointerover', (ptr) => etiqueta('Jerry', ptr.x, ptr.y)).on('pointerout', () => etiqueta(null))

    // DANTE P.W., la IA con cara de robot de Dante
    this.dantePW = this.physics.add.sprite(140 * T, (CAMINO + 2.6) * T, 'dante_pw', 0).setOrigin(0.5, 1)
    this.dantePW.body.setSize(10, 6).setOffset(7, 25)
    this.dantePW.setInteractive({ useHandCursor: true }).on('pointerover', (ptr) => etiqueta('DANTE P.W.', ptr.x, ptr.y)).on('pointerout', () => etiqueta(null))
    this.dantePWsigue = false
  }

  // ------------------------------------------------------------------------------------------ empezar a jugar
  empezar() {
    const p = estado.personaje
    crearPersonaje(this, 'jugador', p.rasgos)
    crearAnimaciones(this, 'jugador')
    // Se empieza al sur del pueblo, delante de la Puerta de la Villa
    this.jugador = this.physics.add.sprite(19 * T, 31.8 * T, 'jugador', 9).setOrigin(0.5, 1)
    this.mirando = 'arriba'
    this.jugador.body.setSize(10, 6).setOffset(7, 25)
    this.jugador.setCollideWorldBounds(true)
    this.physics.add.collider(this.jugador, this.solidos)
    this.physics.add.collider(this.jugador, this.npcs)
    this.physics.add.collider(this.npcs, this.solidos)
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
    if (this.paso >= RECORRIDO.length) { estado.recorridoHecho = true; guardar() }
    this.contando = false
    this.siguientePaso()
  }

  saltarRecorrido() {
    this.tweens.killTweensOf(this.guia)
    this.paso = RECORRIDO.length
    estado.recorridoHecho = true
    guardar()
    this.guia.setPosition(148 * T, (CAMINO + 0.5) * T)
  }

  // ------------------------------------------------------------------------------------------ interacción
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
    const cosa = this.interactivos.find((o) => cerca(o, o.radio))
    if (!cosa) return
    if (cosa.zona) return abrirPanel(cosa.zona)
    if (cosa.vida) return decir(cosa.nombre, frases(cosa.vida))
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
    if (!pausado) {
      if (k.A.isDown || k.LEFT.isDown || tt.izquierda) vx = -1
      else if (k.D.isDown || k.RIGHT.isDown || tt.derecha) vx = 1
      if (k.W.isDown || k.UP.isDown || tt.arriba) vy = -1
      else if (k.S.isDown || k.DOWN.isDown || tt.abajo) vy = 1
    }
    const v = new Phaser.Math.Vector2(vx, vy).normalize().scale(VELOCIDAD)
    j.setVelocity(v.x, v.y)
    if (vx || vy) {
      const dir = vx < 0 ? 'izquierda' : vx > 0 ? 'derecha' : vy < 0 ? 'arriba' : 'abajo'
      j.play(`jugador-${dir}`, true)
      this.mirando = dir
    } else {
      j.anims.stop()
      j.setFrame({ abajo: 0, izquierda: 3, derecha: 6, arriba: 9 }[this.mirando || 'abajo'])
    }
    j.setDepth(j.y)
    this.guia.setDepth(this.guia.y)
    this.npcs.forEach((n) => { this.pasear(n, pausado); n.setDepth(n.y) })
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
  }
}
