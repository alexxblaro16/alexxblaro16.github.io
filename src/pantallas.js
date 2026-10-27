// Pantallas antes de jugar (en HTML, encima del mapa que se mueve de fondo):
// arranque con «Hello, World!», menú principal, opciones, créditos y creador de personaje.
import { ENLACES } from './content.js'
import { estado, t, cambiarIdioma, guardar } from './estado.js'
import { registrar } from './registro.js'
import { sfx, alternarSonido, cambiarMusica, nombreMusica, musicaDeJuego } from './sonido.js'
import { abrirClasico, pintarHUD, pantallaCompleta, esTactil, alVolverAlMenu, alCambiarRopa, mostrarHUD, hayDialogo } from './ui.js'
import { PALETAS, crearPersonaje, retrato } from './sprites.js'

const $ = (s) => document.querySelector(s)
const caja = () => $('#pantalla')

const TXT = {
  es: {
    nueva: 'NUEVA PARTIDA', continuar: 'CONTINUAR', clasico: 'MODO CLÁSICO', opciones: 'OPCIONES', creditos: 'CRÉDITOS',
    sonido: 'SONIDO', musica: 'MÚSICA', idioma: 'IDIOMA', volver: 'VOLVER', crea: 'CREA TU PERSONAJE', nombre: 'TU NOMBRE',
    pelo: 'PEINADO', colorPelo: 'COLOR DE PELO', piel: 'PIEL', ropa: 'COLOR', gafas: 'GAFAS', si: 'SÍ', no: 'NO', jugar: 'A JUGAR',
    estilos: { corto: 'CORTO', ondulado: 'ONDULADO', rizado: 'RIZADO', flequillo: 'FLEQUILLO', cortina: 'CORTINA', canario: 'CANARIO', degradado: 'DEGRADADO', pincho: 'DE PUNTA', despeinado: 'DESPEINADO', cresta: 'CRESTA', medio: 'MEDIO', media: 'MEDIA MELENA', largo: 'LARGO', larga: 'LARGA LISA', melena: 'MELENA RIZADA', coleta: 'COLETA', trenzas: 'TRENZAS', moño: 'RECOGIDO', afro: 'AFRO', rapado: 'RAPADO', calvo: 'CALVO' },
    soy: 'SOY', generos: { '': 'CHICO', 1: 'CHICA' }, abajo: 'ABAJO', abajos: { pantalon: 'PANTALON', falda: 'FALDA', corto: 'CORTO' },
    pestanas: { cuerpo: 'CUERPO', ropa: 'ROPA', extras: 'EXTRAS' }, tipo: 'PRENDA', pantalon: 'PANTALON', corte: 'CORTE', zapatillas: 'ZAPATILLAS',
    barba: 'BARBA', cadena: 'CADENA', sonrisa: 'SONRISA', aleatorio: 'ALEATORIO', girar: 'GIRAR', ojos: 'OJOS',
    tipos: { camiseta: 'CAMISETA', polo: 'POLO', sudadera: 'SUDADERA', chaqueta: 'CHAQUETA', camisa: 'CAMISA', cuadros: 'CUADROS', chandal: 'CHANDAL', tirantes: 'TIRANTES', futbol: 'FUTBOL', traje: 'TRAJE', vestido: 'VESTIDO', kimono: 'KIMONO', abrigo: 'ABRIGO', pena: 'EL PILON' },
    cortes: { pitillo: 'PITILLO', recto: 'RECTO', ancho: 'ANCHO' },
    dibujo: 'DIBUJO', dibujos: { '': 'NINGUNO', rayo: 'RAYO', estrella: 'ESTRELLA', corazon: 'CORAZON', codigo: '</>', pixel: 'PIXEL', calavera: 'CALAVERA', flor: 'FLOR', balon: 'BALON', nota: 'NOTA' },
    sombrero: 'CABEZA', sombreros: { '': 'NADA', gorra: 'GORRA', gorro: 'GORRO', boina: 'BOINA', pescador: 'PESCADOR', cinta: 'CINTA' }, colorExtra: 'COLOR', auriculares: 'CASCOS', mochila: 'MOCHILA',
    bufanda: 'BUFANDA', reloj: 'RELOJ', aros: 'PENDIENTES', complementos: 'COMPLEMENTOS',
    pideNombre: 'ESCRIBE TU NOMBRE', ayudaNombre: 'Hace falta para empezar: es como te llamará Alejandro en el juego.', faltaNombre: 'Escribe un nombre para seguir.', siguiente: 'SIGUIENTE',
    barbas: { '': 'NO', rala: 'POCA', perilla: 'PERILLA', completa: 'COMPLETA' }, visitante: 'Visitante',
    pulsa: 'PULSA ENTER O TOCA PARA EMPEZAR', subtitulo: 'Desarrollador Full Stack Junior · mi vida en píxeles',
    privacidad: 'Esta web cuenta las visitas de forma anónima (país, dispositivo y qué partes se visitan) para que yo sepa si le interesa a alguien. No usa cookies ni guarda tu IP.',
    textoCreditos: 'Diseñado y programado por Alejandro Blanco Rodríguez con Phaser 3, Vite y mucho Java en el corazón. Todo el pixel art está dibujado con código.',
    rapido: '¿Tienes prisa?', practicas: 'Abierto a prácticas',
    gracias: 'Gracias a mis profesores del MEDAC y de la UDIT, por enseñarme a programar y a no rendirme. Y a mis padres, Pedro y Martha, por apoyarme en todo.',
    dedicatoria: 'Dedicado a mi hermano Dante.',
  },
  en: {
    nueva: 'NEW GAME', continuar: 'CONTINUE', clasico: 'CLASSIC MODE', opciones: 'OPTIONS', creditos: 'CREDITS',
    sonido: 'SOUND', musica: 'MUSIC', idioma: 'LANGUAGE', volver: 'BACK', crea: 'CREATE YOUR CHARACTER', nombre: 'YOUR NAME',
    pelo: 'HAIRSTYLE', colorPelo: 'HAIR COLOUR', piel: 'SKIN', ropa: 'COLOUR', gafas: 'GLASSES', si: 'YES', no: 'NO', jugar: 'PLAY',
    estilos: { corto: 'SHORT', ondulado: 'WAVY', rizado: 'CURLY', flequillo: 'FRINGE', cortina: 'CURTAIN', canario: 'TEXTURED', degradado: 'FADE', pincho: 'SPIKY', despeinado: 'MESSY', cresta: 'MOHAWK', medio: 'MEDIUM', media: 'BOB', largo: 'LONG', larga: 'STRAIGHT LONG', melena: 'CURLY LONG', coleta: 'PONYTAIL', trenzas: 'BRAIDS', moño: 'BUN', afro: 'AFRO', rapado: 'BUZZED', calvo: 'BALD' },
    soy: 'I AM', generos: { '': 'BOY', 1: 'GIRL' }, abajo: 'BOTTOM', abajos: { pantalon: 'TROUSERS', falda: 'SKIRT', corto: 'SHORTS' },
    pestanas: { cuerpo: 'LOOK', ropa: 'CLOTHES', extras: 'EXTRAS' }, tipo: 'TOP', pantalon: 'TROUSERS', corte: 'FIT', zapatillas: 'SNEAKERS',
    barba: 'BEARD', cadena: 'CHAIN', sonrisa: 'SMILE', aleatorio: 'RANDOM', girar: 'TURN', ojos: 'EYES',
    tipos: { camiseta: 'T-SHIRT', polo: 'POLO', sudadera: 'HOODIE', chaqueta: 'JACKET', camisa: 'SHIRT', cuadros: 'FLANNEL', chandal: 'TRACKSUIT', tirantes: 'TANK TOP', futbol: 'FOOTBALL', traje: 'SUIT', vestido: 'DRESS', kimono: 'GI', abrigo: 'COAT', pena: 'EL PILON' },
    cortes: { pitillo: 'SKINNY', recto: 'STRAIGHT', ancho: 'BAGGY' },
    dibujo: 'PRINT', dibujos: { '': 'NONE', rayo: 'BOLT', estrella: 'STAR', corazon: 'HEART', codigo: '</>', pixel: 'PIXEL', calavera: 'SKULL', flor: 'FLOWER', balon: 'BALL', nota: 'NOTE' },
    sombrero: 'HEAD', sombreros: { '': 'NONE', gorra: 'CAP', gorro: 'BEANIE', boina: 'BERET', pescador: 'BUCKET', cinta: 'BAND' }, colorExtra: 'COLOUR', auriculares: 'HEADPHONES', mochila: 'BACKPACK',
    bufanda: 'SCARF', reloj: 'WATCH', aros: 'EARRINGS', complementos: 'ACCESSORIES',
    pideNombre: 'TYPE YOUR NAME', ayudaNombre: 'You need one to start: it is what Alejandro will call you in the game.', faltaNombre: 'Type a name to continue.', siguiente: 'NEXT',
    barbas: { '': 'NO', rala: 'LIGHT', perilla: 'GOATEE', completa: 'FULL' }, visitante: 'Visitor',
    pulsa: 'PRESS ENTER OR TAP TO START', subtitulo: 'Junior Full Stack Developer · my life in pixels',
    privacidad: 'This site counts visits anonymously (country, device and which parts are visited) so I know if anyone finds it useful. It uses no cookies and does not store your IP.',
    textoCreditos: 'Designed and coded by Alejandro Blanco Rodríguez with Phaser 3, Vite and a lot of Java at heart. All the pixel art is drawn with code.',
    rapido: 'In a hurry?', practicas: 'Open to internships',
    gracias: 'Thanks to my teachers at MEDAC and UDIT, for teaching me to code and to never give up. And to my parents, Pedro and Martha, for supporting me in everything.',
    dedicatoria: 'Dedicated to my brother Dante.',
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
    lista.innerHTML = opciones.map((o, i) => `<li><button class="${i === sel ? 'sel' : ''} ${o.verde ? 'verde' : ''}" data-i="${i}">${i === sel ? '▶ ' : ''}${o.texto()}</button></li>`).join('')
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
  if (estado.personaje) ops.push({ texto: () => x().continuar, accion: () => { registrar('vuelve', estado.personaje.nombre, true); jugar() } })
  ops.push(
    { texto: () => x().nueva, accion: () => creador() },
    { texto: () => x().clasico, accion: () => abrirClasico(), verde: true },
    { texto: () => x().opciones, accion: () => opciones() },
    { texto: () => x().creditos, accion: () => creditos() },
  )
  menu(ops)
}

function opciones() {
  caja().innerHTML = `<div class="cuadro"><h2>${x().opciones}</h2><ul class="menu"></ul></div>`
  menu([
    { texto: () => `${x().sonido}: ${estado.sonido ? 'ON' : 'OFF'}`, accion: () => { alternarSonido(); opciones() } },
    { texto: () => `${x().musica}: ${nombreMusica()}`, accion: () => { cambiarMusica(); opciones() } },
    { texto: () => `${x().idioma}: ${estado.idioma.toUpperCase()}`, accion: () => { cambiarIdioma(); pintarHUD(); opciones() } },
    { texto: () => x().volver, accion: () => principal() },
  ])
}

function creditos() {
  caja().innerHTML = `<div class="cuadro"><h2>${x().creditos}</h2><p>${x().textoCreditos}</p><p>${x().gracias}</p><p class="dedicatoria">${x().dedicatoria}</p><p class="privacidad">${x().privacidad}</p><ul class="menu"></ul></div>`
  menu([{ texto: () => x().volver, accion: () => principal() }])
}

// ---------------------------------------------------------------------------------------------- 3. creador
// Vista grande que anda y se puede girar, tres pestañas de opciones y un botón para un personaje al azar
const ESTILOS = ['corto', 'ondulado', 'rizado', 'flequillo', 'cortina', 'canario', 'degradado', 'pincho', 'despeinado', 'cresta', 'medio', 'media', 'largo', 'larga', 'melena', 'coleta', 'trenzas', 'moño', 'afro', 'rapado', 'calvo']
const TIPOS = ['camiseta', 'polo', 'sudadera', 'chaqueta', 'camisa', 'cuadros', 'chandal', 'tirantes', 'futbol', 'traje', 'vestido', 'kimono', 'abrigo', 'pena']
const DIBUJOS = ['', 'rayo', 'estrella', 'corazon', 'codigo', 'pixel', 'calavera', 'flor', 'balon', 'nota']
const SOMBREROS = ['', 'gorra', 'gorro', 'boina', 'pescador', 'cinta']
const BARBAS = ['', 'rala', 'perilla', 'completa']
const BOOLEANOS = ['gafas', 'cadena', 'sonrisa', 'chica', 'auriculares', 'mochila', 'bufanda', 'reloj', 'aros']
const ABAJOS = ['pantalon', 'falda', 'corto']
const CORTES = ['pitillo', 'recto', 'ancho']
const CORTOS = ['corto', 'rapado', 'calvo', 'degradado', 'despeinado', 'canario', 'pincho', 'cresta']
// el corte del pantalón se guarda en dos rasgos: anchos (vaqueros anchos) y pitillo (pegados)
const corteDe = (p) => (p.anchos ? 'ancho' : p.pitillo ? 'pitillo' : 'recto')
const azarDe = (lista) => lista[Math.floor(Math.random() * lista.length)]

// soloRopa: el probador que se abre jugando (botón «Ropa» o el armario): solo ropa y extras, y se sigue jugando
function creador(soloRopa = false) {
  quitarTeclado()
  const p = { pelo: 'corto', colorPelo: PALETAS.pelo[0], piel: PALETAS.piel[0], ojos: '', ropa: PALETAS.ropa[1], pantalon: PALETAS.pantalon[0], tipo: 'camiseta', zapatillas: PALETAS.zapatillas[0], barba: '', chica: false, abajo: 'pantalon', gafas: false, cadena: false, anchos: false, pitillo: false, sonrisa: false, dibujo: '', sombrero: '', colorExtra: PALETAS.ropa[4], auriculares: false, mochila: false, bufanda: false, reloj: false, aros: false, ...(estado.personaje?.rasgos || {}) }
  let nombre = estado.personaje?.nombre || ''
  // lo primero es el nombre: sin él no se abre el creador (en el probador ya lo tienes)
  let conNombre = soloRopa
  let pestana = soloRopa ? 'ropa' : 'cuerpo'
  let direccion = 0 // 0 abajo, 1 izquierda, 2 derecha, 3 arriba
  let pestanaPintada = null // para saber si al repintar hay que conservar el scroll
  caja().className = 'pantalla portada'
  // cada fila: su nombre (con lo elegido al lado si es una lista) y sus opciones
  const fila = (clave, contenido, elegido = '') => `<div class="fila-creador"><span>${x()[clave]}${elegido ? `<em>${elegido}</em>` : ''}</span><div>${contenido}</div></div>`
  // Miniaturas: cada opción se enseña puesta en tu muñeco, recortando la parte que cambia (cabeza, torso o piernas)
  const ZONAS = { cabeza: [3, 0, 18, 17], torso: [2, 11, 20, 14], piernas: [3, 18, 18, 14] }
  const ZONA_DE = { pelo: 'cabeza', barba: 'cabeza', sombrero: 'cabeza', tipo: 'torso', dibujo: 'torso', abajo: 'piernas', corte: 'piernas',
    gafas: 'cabeza', auriculares: 'cabeza', aros: 'cabeza', sonrisa: 'cabeza', bufanda: 'torso', cadena: 'torso', reloj: 'torso', mochila: 'torso' }
  const cacheMinis = new Map()
  const conValor = (clave, v) => {
    const q = { ...p }
    if (clave === 'corte') { q.anchos = v === 'ancho'; q.pitillo = v === 'pitillo' } else q[clave] = BOOLEANOS.includes(clave) ? !!v : clave === 'barba' ? (v || false) : v
    // el corte se ve en el pantalón, aunque lleve falda
    if (clave === 'corte' && q.abajo === 'falda') q.abajo = 'pantalon'
    return q
  }
  const mini = (clave, v) => {
    const q = conValor(clave, v), llave = clave + '|' + JSON.stringify(q)
    if (!cacheMinis.has(llave)) {
      const [zx, zy, zw, zh] = ZONAS[ZONA_DE[clave]]
      const c = document.createElement('canvas'); c.width = zw; c.height = zh
      c.getContext('2d').drawImage(retrato(q), zx, zy, zw, zh, 0, 0, zw, zh)
      cacheMinis.set(llave, c.toDataURL())
    }
    return cacheMinis.get(llave)
  }
  const actualDe = (clave) => (clave === 'corte' ? corteDe(p) : BOOLEANOS.includes(clave) ? (p[clave] ? '1' : '') : String(p[clave] || ''))
  // fichas con miniatura (peinados, prendas, dibujos, gorros...)
  const fichas = (clave, lista, textos) => lista.map((v) =>
    `<button class="ficha ${actualDe(clave) === String(v) ? 'sel' : ''}" data-k="${clave}" data-v="${v}" title="${textos[v]}"><img src="${mini(clave, v)}" alt=""><span>${textos[v]}</span></button>`).join('')
  // complementos: se ponen y se quitan con un toque, cada uno con su miniatura y una marca si lo llevas
  const complementos = (lista) => lista.map((k) =>
    `<button class="ficha interruptor ${p[k] ? 'sel' : ''}" data-k="${k}" data-v="${p[k] ? '' : 1}" aria-pressed="${!!p[k]}"><img src="${mini(k, 1)}" alt=""><span>${x()[k]}</span></button>`).join('')
  // el color vacío de los ojos es el de siempre: se pinta marrón oscuro
  const colores = (clave, lista) => lista.map((c) => `<button class="color ${(p[clave] || '') === c ? 'sel' : ''}" style="background:${c || '#4a3326'}" data-k="${clave}" data-v="${c}" aria-label="${c || 'normal'}"></button>`).join('')
  const opciones = (clave, lista, textos) => lista.map((v) => {
    const actual = clave === 'corte' ? corteDe(p) : BOOLEANOS.includes(clave) ? (p[clave] ? '1' : '') : (p[clave] || '')
    return `<button class="opcion ${actual === String(v) ? 'sel' : ''}" data-k="${clave}" data-v="${v}">${textos[v]}</button>`
  }).join('')
  const contenido = () => ({
    cuerpo: fila('soy', opciones('chica', ['', 1], x().generos)) + fila('piel', colores('piel', PALETAS.piel)) + fila('ojos', colores('ojos', PALETAS.ojos)) + fila('pelo', fichas('pelo', ESTILOS, x().estilos), x().estilos[p.pelo]) + fila('colorPelo', colores('colorPelo', PALETAS.pelo)) + (p.chica ? '' : fila('barba', fichas('barba', BARBAS, x().barbas), x().barbas[p.barba || ''])),
    ropa: fila('tipo', fichas('tipo', TIPOS, x().tipos), x().tipos[p.tipo]) + fila('ropa', colores('ropa', PALETAS.ropa)) + fila('dibujo', fichas('dibujo', DIBUJOS, x().dibujos), x().dibujos[p.dibujo || '']) + fila('abajo', fichas('abajo', ABAJOS, x().abajos), x().abajos[p.abajo]) + fila('pantalon', colores('pantalon', PALETAS.pantalon)) + fila('corte', fichas('corte', CORTES, x().cortes), x().cortes[corteDe(p)]) + fila('zapatillas', colores('zapatillas', PALETAS.zapatillas)),
    extras: fila('sombrero', fichas('sombrero', SOMBREROS, x().sombreros), x().sombreros[p.sombrero || '']) + fila('colorExtra', colores('colorExtra', PALETAS.ropa)) + fila('complementos', complementos(['gafas', 'auriculares', 'aros', 'sonrisa', 'bufanda', 'cadena', 'reloj', 'mochila'])),
  })[pestana]
  const pintarNombre = (error = false) => {
    clearInterval(creador.reloj)
    caja().innerHTML = `<div class="cuadro pedir-nombre"><h2>${x().pideNombre}</h2>
      <p>${x().ayudaNombre}</p>
      <input id="nombre" maxlength="12" autocomplete="off" value="${nombre.replace(/"/g, '')}" placeholder="${x().visitante}" aria-label="${x().nombre}">
      <p class="error-nombre" role="alert">${error ? x().faltaNombre : ''}</p>
      <div class="botones"><button class="boton" id="volver">${x().volver}</button><button class="boton verde" id="seguir">${x().siguiente} ▶</button></div></div>`
    const campo = $('#nombre')
    const seguir = () => {
      nombre = campo.value.trim()
      if (!nombre) { sfx.mover(); pintarNombre(true); return }
      sfx.aceptar(); conNombre = true; registrar('nombre', nombre, true); pintar()
    }
    campo.oninput = () => { nombre = campo.value; $('.error-nombre').textContent = '' }
    campo.onkeydown = (e) => { if (e.key === 'Enter') seguir() }
    $('#seguir').onclick = seguir
    $('#volver').onclick = () => principal()
    campo.focus()
  }
  const pintar = () => {
    if (!conNombre) return pintarNombre()
    const titulo = soloRopa ? (estado.idioma === 'en' ? 'Change outfit' : 'Cambia de ropa') : x().crea
    const pestanas = Object.entries(x().pestanas).filter(([k]) => !soloRopa || k !== 'cuerpo')
    // se guarda dónde estaba el scroll de las opciones: al elegir algo se repinta todo y si no volvía arriba
    const scroll = [$('.creador-opciones')?.scrollTop || 0, $('.creador')?.scrollTop || 0, [...document.querySelectorAll('.fila-creador > div')].map((d) => d.scrollLeft)]
    const mismaPestana = pestanaPintada === pestana && !!$('.creador-opciones')
    pestanaPintada = pestana
    caja().innerHTML = `<div class="cuadro creador"><h2>${titulo}</h2>
      <div class="creador-cuerpo">
        <div class="creador-vista">
          <div class="escenario"><canvas id="vista" width="144" height="192"></canvas>${nombre && !soloRopa ? `<span class="placa">${nombre.replace(/[<>&"]/g, '')}</span>` : ''}</div>
          <div class="botones-vista"><button class="opcion" id="girar-izq" aria-label="${x().girar}">&lt;</button><span>${x().girar}</span><button class="opcion" id="girar-der" aria-label="${x().girar}">&gt;</button></div>
          <button class="opcion" id="aleatorio"><svg class="icono" viewBox="0 0 9 9" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M1 0h7v1h1v7H8v1H1V8H0V1h1zM2 2v1h1V2zM6 2v1h1V2zM4 4v1h1V4zM2 6v1h1V6zM6 6v1h1V6z"/></svg> ${x().aleatorio}</button>
        </div>
        <div class="creador-opciones">
          ${soloRopa ? '' : fila('nombre', `<input id="nombre" maxlength="12" value="${nombre.replace(/"/g, '')}" placeholder="${x().visitante}">`)}
          <div class="pestanas">${pestanas.map(([k, t]) => `<button class="opcion ${pestana === k ? 'sel' : ''}" data-pestana="${k}">${t}</button>`).join('')}</div>
          ${contenido()}
        </div>
      </div>
      <div class="botones"><button class="boton" id="volver">${x().volver}</button><button class="boton verde" id="jugar">${soloRopa ? (estado.idioma === 'en' ? 'Put it on' : 'Ponérmelo') : x().jugar} ▶</button></div></div>`
    caja().querySelectorAll('[data-k]').forEach((b) => b.onclick = () => {
      const k = b.dataset.k, v = b.dataset.v
      if (k === 'corte') { p.anchos = v === 'ancho'; p.pitillo = v === 'pitillo' }
      else p[k] = BOOLEANOS.includes(k) ? !!v : k === 'barba' ? (v || false) : v
      if (k === 'mochila' && p.mochila) p.mochila = true
      // al pasar a chica, si llevaba un pelo muy corto se le pone media melena; al pasar a chico, sin falda ni barba no se toca
      if (k === 'chica' && p.chica && CORTOS.includes(p.pelo)) p.pelo = 'media'
      if (k === 'chica' && p.chica) p.barba = false
      if (k === 'chica' && !p.chica && p.abajo === 'falda') p.abajo = 'pantalon'
      sfx.mover(); nombre = $('#nombre')?.value ?? nombre; pintar()
      // el muñeco da un saltito al cambiar algo
      const v2 = $('#vista'); v2?.classList.remove('salto'); void v2?.offsetWidth; v2?.classList.add('salto')
    })
    if (mismaPestana) {
      if ($('.creador-opciones')) $('.creador-opciones').scrollTop = scroll[0]
      if ($('.creador')) $('.creador').scrollTop = scroll[1]
      document.querySelectorAll('.fila-creador > div').forEach((d, i) => { d.scrollLeft = scroll[2][i] || 0 })
    }
    caja().querySelectorAll('[data-pestana]').forEach((b) => b.onclick = () => { pestana = b.dataset.pestana; sfx.mover(); nombre = $('#nombre')?.value ?? nombre; pintar() })
    // girar como en una peana: con «>» mira a la derecha de la pantalla, luego de espaldas, luego a la izquierda y
    // vuelve de frente; con «<», al revés. Las filas de la hoja van abajo, izquierda, derecha, arriba, por eso
    // no basta con sumar 1 (saltaba de un lado al otro sin ponerse de espaldas)
    const GIRO = [0, 2, 3, 1]
    const girar = (paso) => { direccion = GIRO[(GIRO.indexOf(direccion) + paso + 4) % 4]; sfx.mover(); vista() }
    $('#girar-izq').onclick = () => girar(-1)
    $('#girar-der').onclick = () => girar(1)
    $('#aleatorio').onclick = () => {
      if (soloRopa) {
        // en el probador, al azar solo la ropa: el cuerpo se queda como está
        const corte = azarDe(CORTES)
        Object.assign(p, { ropa: azarDe(PALETAS.ropa), pantalon: azarDe(PALETAS.pantalon), tipo: azarDe(TIPOS), zapatillas: azarDe(PALETAS.zapatillas), anchos: corte === 'ancho', pitillo: corte === 'pitillo',
          dibujo: Math.random() < 0.5 ? azarDe(DIBUJOS) : '', sombrero: Math.random() < 0.4 ? azarDe(SOMBREROS) : '', colorExtra: azarDe(PALETAS.ropa), auriculares: Math.random() < 0.2, mochila: Math.random() < 0.3, cadena: Math.random() < 0.3,
          bufanda: Math.random() < 0.15, reloj: Math.random() < 0.3 })
        sfx.aceptar(); pintar(); return
      }
      const chica = Math.random() < 0.5
      const corte = azarDe(CORTES)
      Object.assign(p, {
        chica, abajo: chica ? azarDe(ABAJOS) : azarDe(['pantalon', 'corto']),
        pelo: chica ? azarDe(ESTILOS.filter((e) => !CORTOS.includes(e))) : azarDe(ESTILOS), colorPelo: azarDe(PALETAS.pelo), piel: azarDe(PALETAS.piel), ropa: azarDe(PALETAS.ropa), pantalon: azarDe(PALETAS.pantalon),
        tipo: azarDe(chica ? TIPOS : TIPOS.filter((t) => t !== 'vestido')), zapatillas: azarDe(PALETAS.zapatillas), barba: chica ? false : azarDe(BARBAS) || false, gafas: Math.random() < 0.3, cadena: Math.random() < 0.3, anchos: corte === 'ancho', pitillo: corte === 'pitillo', sonrisa: Math.random() < 0.5,
        dibujo: Math.random() < 0.5 ? azarDe(DIBUJOS) : '', sombrero: Math.random() < 0.4 ? azarDe(SOMBREROS) : '', colorExtra: azarDe(PALETAS.ropa), auriculares: Math.random() < 0.2, mochila: Math.random() < 0.3,
        ojos: azarDe(PALETAS.ojos), bufanda: Math.random() < 0.15, reloj: Math.random() < 0.3, aros: Math.random() < (chica ? 0.5 : 0.15),
      })
      sfx.aceptar(); nombre = $('#nombre').value; pintar()
    }
    if (!soloRopa) {
      $('#nombre').oninput = (e) => { nombre = e.target.value }
      $('#nombre').onkeydown = (e) => { if (e.key === 'Enter') confirmar() }
    }
    $('#volver').onclick = () => soloRopa ? cerrarProbador() : principal()
    $('#jugar').onclick = () => confirmar()
    crearPersonaje(escena, 'vista-previa', p)
    vista()
    // el muñeco anda solo: la pantalla del nombre para el reloj, así que se vuelve a poner al pintar el creador
    // (antes no se ponía y el muñeco se quedaba quieto y las flechas no hacían nada hasta tocar otra opción)
    clearInterval(creador.reloj)
    creador.reloj = setInterval(() => { marco++; vista() }, 200)
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
    if (soloRopa) {
      estado.personaje.rasgos = { ...p }
      guardar()
      registrar('zona', 'cambio-de-ropa', true)
      sfx.aceptar()
      cerrarProbador(true)
      return
    }
    const elegido = ($('#nombre')?.value ?? nombre).trim()
    if (!elegido) {
      // si lo ha borrado en el creador, se queda ahí con el aviso hasta que escriba uno
      const campo = $('#nombre')
      campo.classList.add('falta'); campo.placeholder = x().faltaNombre; campo.focus()
      creador.reloj = setInterval(() => { marco++; vista() }, 200)
      sfx.mover()
      return
    }
    estado.personaje = { nombre: elegido, rasgos: { ...p } }
    estado.recorridoHecho = false
    estado.visitados.clear()
    guardar()
    registrar('personaje', estado.personaje.nombre)
    sfx.aceptar()
    jugar()
  }
  pintar()
}

function jugar() {
  // en el móvil el juego se abre a pantalla completa
  if (esTactil()) pantallaCompleta()
  quitarTeclado()
  clearInterval(creador.reloj)
  caja().hidden = true
  musicaDeJuego(true)
  alTerminar?.()
}

// El probador: se abre jugando, el juego se queda en pausa detrás y al ponerse la ropa se rehace el personaje
function abrirProbador() {
  if (hayDialogo() || !estado.personaje || escena.modo !== 'juego') return
  escena.modo = 'ropa'
  escena.jugador?.setVelocity(0)
  caja().hidden = false
  creador(true)
}
function cerrarProbador(cambiada = false) {
  clearInterval(creador.reloj)
  caja().hidden = true
  escena.volverDelProbador(cambiada)
}

// Botón «Menú» de la barra: el juego se queda de fondo (la cámara vuelve a pasear) y sale el menú principal
function volverAlMenu() {
  if (hayDialogo()) return
  escena.pausarParaMenu()
  musicaDeJuego(false)
  mostrarHUD(false)
  caja().hidden = false
  principal()
}

export function iniciarPantallas(scene, empezar) {
  escena = scene
  alTerminar = empezar
  alVolverAlMenu(volverAlMenu)
  alCambiarRopa(abrirProbador)
  caja().hidden = false
  arranque()
}
