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
    pelo: 'PELO', colorPelo: 'COLOR DE PELO', piel: 'PIEL', ropa: 'CAMISETA', gafas: 'GAFAS', si: 'SÍ', no: 'NO', jugar: 'A JUGAR',
    estilos: { corto: 'CORTO', largo: 'LARGO', rizado: 'RIZADO', melena: 'MELENA', rapado: 'RAPADO' }, visitante: 'Visitante',
    pulsa: 'PULSA ENTER O TOCA PARA EMPEZAR', subtitulo: 'Desarrollador Full Stack Junior · mi vida en píxeles',
    textoCreditos: 'Diseñado y programado por Alejandro Blanco Rodríguez con Phaser 3, Vite y mucho Java en el corazón. Todo el pixel art está dibujado con código.',
    rapido: '¿Tienes prisa?', practicas: 'Abierto a prácticas',
  },
  en: {
    nueva: 'NEW GAME', continuar: 'CONTINUE', clasico: 'CLASSIC MODE', opciones: 'OPTIONS', creditos: 'CREDITS',
    sonido: 'SOUND', idioma: 'LANGUAGE', volver: 'BACK', crea: 'CREATE YOUR CHARACTER', nombre: 'YOUR NAME',
    pelo: 'HAIR', colorPelo: 'HAIR COLOUR', piel: 'SKIN', ropa: 'T-SHIRT', gafas: 'GLASSES', si: 'YES', no: 'NO', jugar: 'PLAY',
    estilos: { corto: 'SHORT', largo: 'LONG', rizado: 'CURLY', melena: 'CURLY LONG', rapado: 'BUZZED' }, visitante: 'Visitor',
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
function creador() {
  quitarTeclado()
  const p = estado.personaje?.rasgos || { pelo: 'corto', colorPelo: PALETAS.pelo[0], piel: PALETAS.piel[0], ropa: PALETAS.ropa[1], pantalon: PALETAS.pantalon[0], gafas: false }
  let nombre = estado.personaje?.nombre || ''
  const estilos = ['corto', 'largo', 'rizado', 'melena', 'rapado']
  caja().className = 'pantalla portada'
  const fila = (clave, contenido) => `<div class="fila-creador"><span>${x()[clave]}</span><div>${contenido}</div></div>`
  const colores = (clave, lista) => lista.map((c) => `<button class="color ${p[clave] === c ? 'sel' : ''}" style="background:${c}" data-k="${clave}" data-v="${c}" aria-label="${c}"></button>`).join('')
  const pintar = () => {
    caja().innerHTML = `<div class="cuadro creador"><h2>${x().crea}</h2>
      <canvas id="vista" width="64" height="96"></canvas>
      ${fila('nombre', `<input id="nombre" maxlength="12" value="${nombre.replace(/"/g, '')}" placeholder="${x().visitante}">`)}
      ${fila('pelo', estilos.map((s) => `<button class="opcion ${p.pelo === s ? 'sel' : ''}" data-k="pelo" data-v="${s}">${x().estilos[s]}</button>`).join(''))}
      ${fila('colorPelo', colores('colorPelo', PALETAS.pelo))}
      ${fila('piel', colores('piel', PALETAS.piel))}
      ${fila('ropa', colores('ropa', PALETAS.ropa))}
      ${fila('gafas', `<button class="opcion ${p.gafas ? 'sel' : ''}" data-k="gafas" data-v="1">${x().si}</button><button class="opcion ${!p.gafas ? 'sel' : ''}" data-k="gafas" data-v="">${x().no}</button>`)}
      <div class="botones"><button class="boton" id="volver">${x().volver}</button><button class="boton verde" id="jugar">${x().jugar} ▶</button></div></div>`
    caja().querySelectorAll('[data-k]').forEach((b) => b.onclick = () => {
      p[b.dataset.k] = b.dataset.k === 'gafas' ? !!b.dataset.v : b.dataset.v
      sfx.mover(); nombre = $('#nombre').value; pintar()
    })
    $('#nombre').oninput = (e) => { nombre = e.target.value }
    $('#nombre').onkeydown = (e) => { if (e.key === 'Enter') confirmar() }
    $('#volver').onclick = () => principal()
    $('#jugar').onclick = () => confirmar()
    vista()
  }
  // Vista previa animada del personaje
  let marco = 0
  const vista = () => {
    crearPersonaje(escena, 'vista-previa', p)
    const img = escena.textures.get('vista-previa').getSourceImage()
    const lienzo = $('#vista')
    if (!lienzo) return
    const ctx = lienzo.getContext('2d')
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, 64, 96)
    const [col, fil] = [[1, 0], [0, 0], [2, 0], [0, 0]][marco % 4]
    ctx.drawImage(img, col * 16, fil * 24, 16, 24, 0, 0, 64, 96)
  }
  clearInterval(creador.reloj)
  creador.reloj = setInterval(() => { marco++; vista() }, 220)
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
