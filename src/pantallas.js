// Pantallas antes de jugar (en HTML, encima del mapa que se mueve de fondo):
// arranque con «Hello, World!», menú principal, opciones, créditos y creador de personaje.
import { ENLACES } from './content.js'
import { estado, t, cambiarIdioma, guardar } from './estado.js'
import { sfx, alternarSonido } from './sonido.js'
import { abrirClasico, pintarHUD } from './ui.js'
import { PALETAS, crearPersonaje } from './sprites.js'

const $ = (s) => document.querySelector(s)
const caja = () => $('#pantalla')

const TXT = {
  es: {
    nueva: 'NUEVA PARTIDA', continuar: 'CONTINUAR', clasico: 'MODO CLÁSICO', opciones: 'OPCIONES', creditos: 'CRÉDITOS',
    sonido: 'SONIDO', idioma: 'IDIOMA', volver: 'VOLVER', crea: 'CREA TU PERSONAJE', nombre: 'TU NOMBRE',
    pelo: 'PEINADO', colorPelo: 'COLOR DE PELO', piel: 'PIEL', ropa: 'COLOR', gafas: 'GAFAS', si: 'SÍ', no: 'NO', jugar: 'A JUGAR',
    estilos: { corto: 'CORTO', ondulado: 'ONDULADO', rizado: 'RIZADO', flequillo: 'FLEQUILLO', cortina: 'CORTINA', media: 'MEDIA MELENA', largo: 'LARGO', larga: 'LARGA LISA', melena: 'MELENA RIZADA', rapado: 'RAPADO', calvo: 'CALVO' },
    soy: 'SOY', generos: { '': 'CHICO', 1: 'CHICA' }, abajo: 'ABAJO', abajos: { pantalon: 'PANTALON', falda: 'FALDA', corto: 'CORTO' },
    pestanas: { cuerpo: 'CUERPO', ropa: 'ROPA', extras: 'EXTRAS' }, tipo: 'PRENDA', pantalon: 'PANTALON', anchos: 'CORTE', zapatillas: 'ZAPATILLAS',
    barba: 'BARBA', cadena: 'CADENA', sonrisa: 'SONRISA', aleatorio: 'ALEATORIO', girar: 'GIRAR',
    tipos: { camiseta: 'CAMISETA', polo: 'POLO', sudadera: 'SUDADERA', chaqueta: 'CHAQUETA' }, cortes: { '': 'RECTO', 1: 'ANCHO' },
    barbas: { '': 'NO', rala: 'POCA', perilla: 'PERILLA', completa: 'COMPLETA' }, visitante: 'Visitante',
    pulsa: 'PULSA ENTER O TOCA PARA EMPEZAR', subtitulo: 'Desarrollador Full Stack Junior · mi vida en píxeles',
    textoCreditos: 'Diseñado y programado por Alejandro Blanco Rodríguez con Phaser 3, Vite y mucho Java en el corazón. Todo el pixel art está dibujado con código.',
    rapido: '¿Tienes prisa?', practicas: 'Abierto a prácticas',
  },
  en: {
    nueva: 'NEW GAME', continuar: 'CONTINUE', clasico: 'CLASSIC MODE', opciones: 'OPTIONS', creditos: 'CREDITS',
    sonido: 'SOUND', idioma: 'LANGUAGE', volver: 'BACK', crea: 'CREATE YOUR CHARACTER', nombre: 'YOUR NAME',
    pelo: 'HAIRSTYLE', colorPelo: 'HAIR COLOUR', piel: 'SKIN', ropa: 'COLOUR', gafas: 'GLASSES', si: 'YES', no: 'NO', jugar: 'PLAY',
    estilos: { corto: 'SHORT', ondulado: 'WAVY', rizado: 'CURLY', flequillo: 'FRINGE', cortina: 'CURTAIN', media: 'BOB', largo: 'LONG', larga: 'STRAIGHT LONG', melena: 'CURLY LONG', rapado: 'BUZZED', calvo: 'BALD' },
    soy: 'I AM', generos: { '': 'BOY', 1: 'GIRL' }, abajo: 'BOTTOM', abajos: { pantalon: 'TROUSERS', falda: 'SKIRT', corto: 'SHORTS' },
    pestanas: { cuerpo: 'LOOK', ropa: 'CLOTHES', extras: 'EXTRAS' }, tipo: 'TOP', pantalon: 'TROUSERS', anchos: 'FIT', zapatillas: 'SNEAKERS',
    barba: 'BEARD', cadena: 'CHAIN', sonrisa: 'SMILE', aleatorio: 'RANDOM', girar: 'TURN',
    tipos: { camiseta: 'T-SHIRT', polo: 'POLO', sudadera: 'HOODIE', chaqueta: 'JACKET' }, cortes: { '': 'SLIM', 1: 'BAGGY' },
    barbas: { '': 'NO', rala: 'LIGHT', perilla: 'GOATEE', completa: 'FULL' }, visitante: 'Visitor',
    pulsa: 'PRESS ENTER OR TAP TO START', subtitulo: 'Junior Full Stack Developer · my life in pixels',
    textoCreditos: 'Designed and coded by Alejandro Blanco Rodríguez with Phaser 3, Vite and a lot of Java at heart. All the pixel art is drawn with code.',
    rapido: 'In a hurry?', practicas: 'Open to internships',
  },
}
// La fuente de píxel no tiene mayúsculas con tilde (salen mal): en los textos en mayúsculas se quitan
const sinTildes = (s) => (s === s.toUpperCase() ? s.normalize('NFD').replace(/[̀-ͯ]/g, '') : s)
const x = () => new Proxy(TXT[estado.idioma], { get: (o, k) => (typeof o[k] === 'string' ? sinTildes(o[k]) : o[k]) })

let alTerminar = null
let escena = null
let teclado = null

function quitarTeclado() { if (teclado) document.removeEventListener('keydown', teclado); teclado = null }

// Menús navegables con flechas + Enter o con el ratón
function menu(opciones) {
  let sel = 0
  const pintar = () => {
    const lista = caja().querySelector('.menu')
    lista.innerHTML = opciones.map((o, i) => `<li><button class="${i === sel ? 'sel' : ''}" data-i="${i}">${i === sel ? '▶ ' : ''}${o.texto()}</button></li>`).join('')
    lista.querySelectorAll('button').forEach((b) => {
      b.onmouseenter = () => { if (sel !== +b.dataset.i) { sel = +b.dataset.i; sfx.mover(); pintar() } }
      b.onclick = () => { sfx.aceptar(); opciones[+b.dataset.i].accion() }
    })
  }
  quitarTeclado()
  teclado = (e) => {
    if (e.key === 'ArrowDown' || e.key === 's') { sel = (sel + 1) % opciones.length; sfx.mover(); pintar() }
    if (e.key === 'ArrowUp' || e.key === 'w') { sel = (sel - 1 + opciones.length) % opciones.length; sfx.mover(); pintar() }
    if (e.key === 'Enter') { sfx.aceptar(); opciones[sel].accion() }
  }
  document.addEventListener('keydown', teclado)
  pintar()
}

// ---------------------------------------------------------------------------------------------- 1. arranque
function arranque() {
  caja().className = 'pantalla terminal'
  caja().innerHTML = `<pre id="consola"></pre><p class="parpadea" hidden>${x().pulsa}</p>`
  const lineas = ['> javac HelloWorld.java', '> java AlejandroBlanco', 'Hello, World!']
  const pre = $('#consola')
  let l = 0, c = 0
  const escribir = () => {
    if (!pre.isConnected) return // ya se ha pasado al menú
    if (l >= lineas.length) { caja().querySelector('.parpadea').hidden = false; return }
    pre.textContent += lineas[l][c++] ?? ''
    if (c > lineas[l].length) { pre.textContent += '\n'; l++; c = 0; setTimeout(escribir, 350) } else setTimeout(escribir, 45)
  }
  setTimeout(escribir, 300)
  const seguir = () => { quitarTeclado(); caja().onclick = null; principal() }
  quitarTeclado()
  teclado = (e) => { if (e.key === 'Enter' || e.key === ' ') seguir() }
  document.addEventListener('keydown', teclado)
  caja().onclick = seguir
}

// ---------------------------------------------------------------------------------------------- 2. menú principal
function principal() {
  caja().className = 'pantalla portada'
  caja().innerHTML = `
    <div class="logo"><span class="pestana">HelloWorld.java</span><h1><b>alejandro</b>.blanco<i>()</i></h1><p>${x().subtitulo}</p></div>
    <ul class="menu"></ul>
    <div class="atajos"><span>${x().rapido}</span>
      <a class="boton verde" href="${ENLACES.practicas}">${x().practicas}</a>
      <a class="boton" href="${ENLACES.cv[estado.idioma]}" download>CV</a>
      <a class="boton" href="${ENLACES.github}" target="_blank" rel="noopener">GitHub</a>
      <a class="boton" href="${ENLACES.linkedin}" target="_blank" rel="noopener">LinkedIn</a></div>`
  const ops = []
  if (estado.personaje) ops.push({ texto: () => x().continuar, accion: () => jugar() })
  ops.push(
    { texto: () => x().nueva, accion: () => creador() },
    { texto: () => x().clasico, accion: () => abrirClasico() },
    { texto: () => x().opciones, accion: () => opciones() },
    { texto: () => x().creditos, accion: () => creditos() },
  )
  menu(ops)
}

function opciones() {
  caja().innerHTML = `<div class="cuadro"><h2>${x().opciones}</h2><ul class="menu"></ul></div>`
  menu([
    { texto: () => `${x().sonido}: ${estado.sonido ? 'ON' : 'OFF'}`, accion: () => { alternarSonido(); opciones() } },
    { texto: () => `${x().idioma}: ${estado.idioma.toUpperCase()}`, accion: () => { cambiarIdioma(); pintarHUD(); opciones() } },
    { texto: () => x().volver, accion: () => principal() },
  ])
}

function creditos() {
  caja().innerHTML = `<div class="cuadro"><h2>${x().creditos}</h2><p>${x().textoCreditos}</p><ul class="menu"></ul></div>`
  menu([{ texto: () => x().volver, accion: () => principal() }])
}

// ---------------------------------------------------------------------------------------------- 3. creador
// Vista grande que anda y se puede girar, tres pestañas de opciones y un botón para un personaje al azar
const ESTILOS = ['corto', 'ondulado', 'rizado', 'flequillo', 'cortina', 'media', 'largo', 'larga', 'melena', 'rapado', 'calvo']
const TIPOS = ['camiseta', 'polo', 'sudadera', 'chaqueta']
const BARBAS = ['', 'rala', 'perilla', 'completa']
const BOOLEANOS = ['gafas', 'cadena', 'anchos', 'sonrisa', 'chica']
const ABAJOS = ['pantalon', 'falda', 'corto']
const CORTOS = ['corto', 'rapado', 'calvo', 'degradado', 'despeinado']
const azarDe = (lista) => lista[Math.floor(Math.random() * lista.length)]

function creador() {
  quitarTeclado()
  const p = { pelo: 'corto', colorPelo: PALETAS.pelo[0], piel: PALETAS.piel[0], ropa: PALETAS.ropa[1], pantalon: PALETAS.pantalon[0], tipo: 'camiseta', zapatillas: PALETAS.zapatillas[0], barba: '', chica: false, abajo: 'pantalon', gafas: false, cadena: false, anchos: false, sonrisa: false, ...(estado.personaje?.rasgos || {}) }
  let nombre = estado.personaje?.nombre || ''
  let pestana = 'cuerpo'
  let direccion = 0 // 0 abajo, 1 izquierda, 2 derecha, 3 arriba
  caja().className = 'pantalla portada'
  const fila = (clave, contenido) => `<div class="fila-creador"><span>${x()[clave]}</span><div>${contenido}</div></div>`
  const colores = (clave, lista) => lista.map((c) => `<button class="color ${p[clave] === c ? 'sel' : ''}" style="background:${c}" data-k="${clave}" data-v="${c}" aria-label="${c}"></button>`).join('')
  const opciones = (clave, lista, textos) => lista.map((v) => {
    const actual = BOOLEANOS.includes(clave) ? (p[clave] ? '1' : '') : (p[clave] || '')
    return `<button class="opcion ${actual === String(v) ? 'sel' : ''}" data-k="${clave}" data-v="${v}">${textos[v]}</button>`
  }).join('')
  const siNo = { 1: x().si, '': x().no }
  const contenido = () => ({
    cuerpo: fila('soy', opciones('chica', ['', 1], x().generos)) + fila('piel', colores('piel', PALETAS.piel)) + fila('pelo', opciones('pelo', ESTILOS, x().estilos)) + fila('colorPelo', colores('colorPelo', PALETAS.pelo)) + fila('barba', opciones('barba', BARBAS, x().barbas)),
    ropa: fila('tipo', opciones('tipo', TIPOS, x().tipos)) + fila('ropa', colores('ropa', PALETAS.ropa)) + fila('abajo', opciones('abajo', ABAJOS, x().abajos)) + fila('pantalon', colores('pantalon', PALETAS.pantalon)) + fila('anchos', opciones('anchos', [1, ''], x().cortes)) + fila('zapatillas', colores('zapatillas', PALETAS.zapatillas)),
    extras: fila('gafas', opciones('gafas', [1, ''], siNo)) + fila('cadena', opciones('cadena', [1, ''], siNo)) + fila('sonrisa', opciones('sonrisa', [1, ''], siNo)),
  })[pestana]
  const pintar = () => {
    caja().innerHTML = `<div class="cuadro creador"><h2>${x().crea}</h2>
      <div class="creador-cuerpo">
        <div class="creador-vista">
          <canvas id="vista" width="144" height="192"></canvas>
          <div class="botones-vista"><button class="opcion" id="girar-izq" aria-label="${x().girar}">&lt;</button><span>${x().girar}</span><button class="opcion" id="girar-der" aria-label="${x().girar}">&gt;</button></div>
          <button class="opcion" id="aleatorio">${x().aleatorio}</button>
        </div>
        <div class="creador-opciones">
          ${fila('nombre', `<input id="nombre" maxlength="12" value="${nombre.replace(/"/g, '')}" placeholder="${x().visitante}">`)}
          <div class="pestanas">${Object.entries(x().pestanas).map(([k, t]) => `<button class="opcion ${pestana === k ? 'sel' : ''}" data-pestana="${k}">${t}</button>`).join('')}</div>
          ${contenido()}
        </div>
      </div>
      <div class="botones"><button class="boton" id="volver">${x().volver}</button><button class="boton verde" id="jugar">${x().jugar} ▶</button></div></div>`
    caja().querySelectorAll('[data-k]').forEach((b) => b.onclick = () => {
      const k = b.dataset.k, v = b.dataset.v
      p[k] = BOOLEANOS.includes(k) ? !!v : k === 'barba' ? (v || false) : v
      // al pasar a chica, si llevaba un pelo muy corto se le pone media melena; al pasar a chico, sin falda ni barba no se toca
      if (k === 'chica' && p.chica && CORTOS.includes(p.pelo)) p.pelo = 'media'
      if (k === 'chica' && p.chica) p.barba = false
      if (k === 'chica' && !p.chica && p.abajo === 'falda') p.abajo = 'pantalon'
      sfx.mover(); nombre = $('#nombre').value; pintar()
    })
    caja().querySelectorAll('[data-pestana]').forEach((b) => b.onclick = () => { pestana = b.dataset.pestana; sfx.mover(); nombre = $('#nombre').value; pintar() })
    $('#girar-izq').onclick = () => { direccion = (direccion + 3) % 4; sfx.mover() }
    $('#girar-der').onclick = () => { direccion = (direccion + 1) % 4; sfx.mover() }
    $('#aleatorio').onclick = () => {
      const chica = Math.random() < 0.5
      Object.assign(p, {
        chica, abajo: chica ? azarDe(ABAJOS) : azarDe(['pantalon', 'corto']),
        pelo: chica ? azarDe(ESTILOS.filter((e) => !CORTOS.includes(e))) : azarDe(ESTILOS), colorPelo: azarDe(PALETAS.pelo), piel: azarDe(PALETAS.piel), ropa: azarDe(PALETAS.ropa), pantalon: azarDe(PALETAS.pantalon),
        tipo: azarDe(TIPOS), zapatillas: azarDe(PALETAS.zapatillas), barba: chica ? false : azarDe(BARBAS) || false, gafas: Math.random() < 0.3, cadena: Math.random() < 0.3, anchos: Math.random() < 0.5, sonrisa: Math.random() < 0.5,
      })
      sfx.aceptar(); nombre = $('#nombre').value; pintar()
    }
    $('#nombre').oninput = (e) => { nombre = e.target.value }
    $('#nombre').onkeydown = (e) => { if (e.key === 'Enter') confirmar() }
    $('#volver').onclick = () => principal()
    $('#jugar').onclick = () => confirmar()
    crearPersonaje(escena, 'vista-previa', p)
    vista()
  }
  // Vista previa: anda en la dirección elegida sobre un trozo de hierba
  let marco = 0
  const vista = () => {
    const lienzo = $('#vista')
    if (!lienzo || !escena.textures.exists('vista-previa')) return
    const img = escena.textures.get('vista-previa').getSourceImage()
    const ctx = lienzo.getContext('2d')
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = '#5aa84f'; ctx.fillRect(0, 0, 144, 192)
    for (let i = 0; i < 40; i++) { ctx.fillStyle = i % 2 ? '#63b457' : '#519a47'; ctx.fillRect((i * 37) % 144, (i * 53) % 192, 6, 6) }
    const col = [1, 0, 2, 0][marco % 4]
    ctx.drawImage(img, col * 24, direccion * 32, 24, 32, 0, 0, 144, 192)
  }
  clearInterval(creador.reloj)
  creador.reloj = setInterval(() => { marco++; vista() }, 200)
  const confirmar = () => {
    clearInterval(creador.reloj)
    estado.personaje = { nombre: ($('#nombre')?.value || nombre).trim() || x().visitante, rasgos: { ...p } }
    estado.recorridoHecho = false
    estado.visitados.clear()
    guardar()
    sfx.aceptar()
    jugar()
  }
  pintar()
}

function jugar() {
  quitarTeclado()
  clearInterval(creador.reloj)
  caja().hidden = true
  alTerminar?.()
}

export function iniciarPantallas(scene, empezar) {
  escena = scene
  alTerminar = empezar
  caja().hidden = false
  arranque()
}
