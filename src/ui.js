// Capa HTML encima del juego: barra superior, diálogos, paneles de cada zona, logros, nombres al pasar
// el ratón, mando táctil y modo clásico. En HTML para que los enlaces funcionen y se lea bien.
import { ENLACES, PROYECTOS, STACK } from './content.js'
import { estado, t, cambiarIdioma, alCambiarIdioma, guardar } from './estado.js'
import { registrar } from './registro.js'
import { sfx, alternarSonido, cambiarMusica, nombreMusica } from './sonido.js'

const $ = (s) => document.querySelector(s)
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

// ---------------------------------------------------------------------------------------------- barra superior
export function pintarHUD() {
  const x = t()
  $('#hud-titulo').textContent = x.titulo
  $('#btn-practicas').textContent = estado.idioma === 'es' ? 'Abierto a prácticas' : 'Open to internships'
  $('#btn-practicas').href = ENLACES.practicas
  $('#btn-cv').textContent = 'CV'
  $('#btn-cv').href = ENLACES.cv[estado.idioma]
  $('#btn-idioma').textContent = x.hud.idioma
  $('#btn-clasico').textContent = x.hud.clasico
  $('#btn-menu').textContent = estado.idioma === 'es' ? 'MENU' : 'MENU'
  $('#btn-ropa').textContent = estado.idioma === 'es' ? 'ROPA' : 'OUTFIT'
  $('#btn-sonido').textContent = estado.sonido ? '♪ ON' : '♪ OFF'
  $('#btn-musica').textContent = `♫ ${nombreMusica()}`
  $('#hud-zonas').textContent = `${x.hud.misiones} ${estado.visitados.size}/6`
  // contador de esferas: aparece al encontrar la primera
  $('#hud-esferas').hidden = !estado.esferas.size
  $('#hud-esferas').textContent = `● ${estado.esferas.size}/7`
  $('#btn-pantalla').hidden = !document.fullscreenEnabled
  $('#txt-hora').textContent = estado.idioma === 'es' ? 'DIA / NOCHE' : 'DAY / NIGHT'
  $('#txt-pantalla').textContent = estado.idioma === 'es' ? 'PANTALLA COMPLETA' : 'FULL SCREEN'
  $('#btn-pantalla').title = estado.idioma === 'es' ? 'Pantalla completa' : 'Full screen'
  $('#ayuda').textContent = x.hud.ayuda
  $('#btn-accion').textContent = x.accion
}

export function iniciarUI() {
  $('#btn-idioma').onclick = () => { cambiarIdioma(); pintarHUD() }
  $('#btn-sonido').onclick = () => { alternarSonido(); pintarHUD() }
  $('#btn-musica').onclick = () => { cambiarMusica(); pintarHUD() }
  $('#btn-clasico').onclick = () => { cerrarMenuHUD(); abrirClasico() }
  $('#btn-pantalla').onclick = () => pantallaCompleta(!document.fullscreenElement)
  $('#btn-menu').onclick = () => { cerrarMenuHUD(); alPedirMenu?.() }
  $('#btn-ropa').onclick = () => { cerrarMenuHUD(); alPedirRopa?.() }
  // en el móvil, el resto de botones van en un menú desplegable para no tapar el juego
  $('#btn-mas').onclick = () => { const abierto = $('#hud').classList.toggle('abierto'); $('#btn-mas').setAttribute('aria-expanded', abierto) }
  $('#clasico-volver').onclick = () => cerrarClasico()
  $('#panel-cerrar').onclick = () => cerrarPanel()
  $('#panel').addEventListener('click', (e) => { if (e.target.id === 'panel') cerrarPanel() })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { cerrarPanel(); cerrarClasico() }
  })
  alCambiarIdioma(() => { pintarHUD(); if (!$('#clasico').hidden) pintarClasico() })
  pintarHUD()
  if (new URLSearchParams(location.search).get('modo') === 'clasico') abrirClasico()
}

// pantallas.js se apunta aquí para que el botón «Menú» de la barra vuelva al menú principal
let alPedirMenu = null
export function alVolverAlMenu(f) { alPedirMenu = f }
// y aquí, para que el botón «Ropa» (o el armario de su cuarto) abra el probador
let alPedirRopa = null
export function alCambiarRopa(f) { alPedirRopa = f }
export function pedirRopa() { alPedirRopa?.() }

function cerrarMenuHUD() { $('#hud').classList.remove('abierto'); $('#btn-mas').setAttribute('aria-expanded', 'false') }

// Pantalla completa (en móviles se pide al empezar a jugar). En iPhone Safari no existe: allí la web se puede
// añadir a la pantalla de inicio y entonces se abre sin barras.
export function pantallaCompleta(si = true) {
  try {
    if (si && !document.fullscreenElement && document.fullscreenEnabled) {
      document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => {})
      registrar('zona', 'pantalla-completa', true)
    } else if (!si && document.fullscreenElement) document.exitFullscreen().catch(() => {})
  } catch { /* el navegador no deja: se sigue jugando igual */ }
}
export const esTactil = () => matchMedia('(pointer: coarse)').matches

export function mostrarHUD(si) { $('#hud').classList.toggle('visible', si); $('#mando').classList.toggle('visible', si) }

// ---------------------------------------------------------------------------------------------- diálogos
let dialogo = null
export function hayDialogo() { return !!dialogo }

// Enseña frases una a una, con efecto de máquina de escribir. Devuelve una promesa al terminar.
export function decir(nombre, frases) {
  return new Promise((resolver) => {
    const caja = $('#dialogo')
    let i = 0
    let escribiendo = null
    let completo = false
    const mostrar = () => {
      const texto = frases[i].replaceAll('{nombre}', estado.personaje?.nombre || '')
      $('#dialogo-nombre').textContent = nombre
      const p = $('#dialogo-texto')
      p.textContent = ''
      completo = false
      let n = 0
      clearInterval(escribiendo)
      escribiendo = setInterval(() => {
        p.textContent = texto.slice(0, ++n)
        if (n % 2) sfx.letra()
        if (n >= texto.length) { clearInterval(escribiendo); completo = true }
      }, 22)
      dialogo.saltar = () => { clearInterval(escribiendo); p.textContent = texto; completo = true }
    }
    const avanzar = () => {
      if (!completo) return dialogo.saltar()
      i++
      if (i >= frases.length) {
        caja.hidden = true
        caja.onclick = null
        dialogo = null
        resolver()
      } else mostrar()
    }
    dialogo = { avanzar }
    caja.hidden = false
    caja.onclick = avanzar
    mostrar()
  })
}
export function avanzarDialogo() { dialogo?.avanzar() }

// Pregunta con varias respuestas en la caja de diálogo (Hablar / Sígueme, coger el bus…). Se elige con las
// flechas o W/S y se confirma con E, espacio, Enter o un clic. Devuelve el número de la opción elegida.
export function elegir(nombre, pregunta, opciones) {
  return new Promise((resolver) => {
    const caja = $('#dialogo')
    let sel = 0
    $('#dialogo-nombre').textContent = nombre
    $('#dialogo-texto').textContent = pregunta.replaceAll('{nombre}', estado.personaje?.nombre || '')
    const lista = document.createElement('div')
    lista.className = 'dialogo-opciones'
    const pintar = () => lista.querySelectorAll('button').forEach((b, i) => b.classList.toggle('sel', i === sel))
    const terminar = (i) => {
      document.removeEventListener('keydown', teclas)
      lista.remove()
      caja.classList.remove('con-opciones')
      caja.hidden = true
      caja.onclick = null
      dialogo = null
      sfx.aceptar?.()
      resolver(i)
    }
    opciones.forEach((texto, i) => {
      const b = document.createElement('button')
      b.textContent = texto
      b.onclick = (e) => { e.stopPropagation(); terminar(i) }
      b.onmouseenter = () => { sel = i; pintar() }
      lista.append(b)
    })
    const teclas = (e) => {
      const k = e.key.toLowerCase()
      if (['arrowup', 'w', 'arrowleft', 'a'].includes(k)) sel = (sel + opciones.length - 1) % opciones.length
      else if (['arrowdown', 's', 'arrowright', 'd'].includes(k)) sel = (sel + 1) % opciones.length
      else return
      sfx.mover?.(); pintar()
    }
    document.addEventListener('keydown', teclas)
    dialogo = { avanzar: () => terminar(sel) }
    caja.append(lista)
    caja.classList.add('con-opciones')
    caja.onclick = null
    caja.hidden = false
    pintar()
  })
}

// ---------------------------------------------------------------------------------------------- logros
export function logro(texto) {
  const toast = document.createElement('div')
  toast.className = 'logro'
  toast.innerHTML = `<small>${esc(t().logro)}</small><b>${esc(texto)}</b>`
  $('#logros').append(toast)
  sfx.logro()
  setTimeout(() => toast.remove(), 3600)
}

// ---------------------------------------------------------------------------------------------- nombres al pasar
export function etiqueta(texto, x, y) {
  const e = $('#etiqueta')
  if (!texto) { e.hidden = true; return }
  e.textContent = texto
  e.style.left = `${x}px`
  e.style.top = `${y}px`
  e.hidden = false
}

// ---------------------------------------------------------------------------------------------- paneles
let panelAbierto = false
export function hayPanel() { return panelAbierto || !$('#clasico').hidden || document.body.classList.contains('en-arcade') }

function enlaces(p, x) {
  const b = []
  if (p.repo) b.push(`<a class="boton" href="${p.repo}" target="_blank" rel="noopener">${x.verCodigo} ↗</a>`)
  if (p.demo) b.push(`<a class="boton verde" href="${p.demo}" target="_blank" rel="noopener">${x.verDemo} ↗</a>`)
  if (!p.repo && !p.demo) b.push(`<span class="etiqueta-privado">${x.privado}</span>`)
  return b.join('')
}

// Cada medio con su enlace a la noticia si lo tenemos
const medio = (m) => (m.url ? `<li><a href="${m.url}" target="_blank" rel="noopener">${esc(m.nombre)} ↗</a></li>` : `<li>${esc(m.nombre)}</li>`)

export function htmlZona(zona) {
  const x = t()
  if (zona === 'trayectoria') {
    return `<ol class="linea">${x.trayectoria.map((h) => `<li><span class="fecha">${esc(h.fecha)}</span><b>${esc(h.titulo)}</b><em>${esc(h.lugar)}</em><p>${esc(h.texto)}</p></li>`).join('')}</ol>`
  }
  if (zona === 'proyectos') {
    return `<div class="tarjetas">${PROYECTOS.map((p) => `<article class="tarjeta${p.premio ? ' destacada' : ''}"><h3>${esc(p.nombre)}${p.premio ? ' <span class="premio">4.º OdiseIA4Good</span>' : ''}</h3><p>${esc(x.proyectosTexto[p.id])}</p><div class="chips">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div><div class="acciones">${enlaces(p, x)}</div></article>`).join('')}</div>`
  }
  if (zona === 'trofeos') {
    // Copa en píxeles (sin emojis)
    const copa = `<svg class="copa" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="#f2c200" d="M4 2h8v1h2v3h-1v1h-1v1h-1v1h-1v2h1v1h1v2H4v-2h1v-1h1V9H5V8H4V7H3V6H2V3h2zM3 4v1h1V4zm9 0v1h1V4z"/><path fill="#c9962b" d="M7 9h2v2H7zM5 13h6v1H5z"/></svg>`
    return `<div class="trofeo">${copa}<h3>${esc(x.trofeos.titulo)}</h3><p>${esc(x.trofeos.texto)}</p><ul class="medios">${x.trofeos.medios.map(medio).join('')}</ul></div>`
  }
  if (zona === 'sobre') {
    return `<p>${esc(x.sobreMi)}</p>`
  }
  if (zona === 'stack') {
    return `<div class="inventario">${STACK.map((g) => `<section><h3>${esc(x.grupos[g.grupo])}</h3>${g.items.map(([n, v]) => `<div class="item"><span>${esc(n)}</span><i style="--v:${v * 10}%"></i></div>`).join('')}</section>`).join('')}</div>`
  }
  if (zona === 'contacto') {
    const c = x.contacto
    const otro = estado.idioma === 'es' ? 'en' : 'es'
    return `<p class="intro-contacto">${esc(c.texto)}</p><div class="acciones grandes">
      <a class="boton verde" href="${ENLACES.practicas}">${esc(c.practicas)}</a>
      <a class="boton" href="mailto:${ENLACES.email}">${esc(c.email)} · ${ENLACES.email}</a>
      <a class="boton" href="${ENLACES.linkedin}" target="_blank" rel="noopener">${esc(c.linkedin)} ↗</a>
      <a class="boton" href="${ENLACES.github}" target="_blank" rel="noopener">${esc(c.github)} ↗</a>
      <a class="boton" href="${ENLACES.cv[estado.idioma]}" download>${esc(c.cv)} ⤓</a>
      <a class="boton" href="${ENLACES.cv[otro]}" download>${esc(c.cvOtro)} ⤓</a></div>`
  }
  if (zona === 'hola') return `<pre class="java">System.out.println("Hello, World!");</pre><p>${esc(x.hola)}</p>`
  return ''
}

export function abrirPanel(zona) {
  const x = t()
  $('#panel-titulo').textContent = x.zonas[zona].titulo
  $('#panel-cuerpo').innerHTML = htmlZona(zona)
  $('#panel').hidden = false
  panelAbierto = true
  sfx.puerta()
  registrar('zona', zona, true)
  if (!estado.visitados.has(zona)) {
    estado.visitados.add(zona)
    guardar()
    logro(x.zonas[zona].logro)
    if (estado.visitados.size === 6) setTimeout(() => logro(x.todas), 1200)
  }
  pintarHUD()
}

export function cerrarPanel() { $('#panel').hidden = true; panelAbierto = false }

// ---------------------------------------------------------------------------------------------- modo clásico
// La versión para quien tiene prisa: una web normal, pero con vida. Fondo con manchas de color que se mueven,
// el comentario del editor que se escribe solo, un Alejandro en píxeles que anda (el mismo del juego), cifras
// que cuentan, tarjetas con un foco que sigue al ratón, barras que se llenan al verlas y una cinta de tecnologías.
// Con «reducir movimiento» activado en el sistema, todo aparece quieto.
const TECNOLOGIAS = ['Java', 'React', 'Laravel', 'Python', 'JavaScript', 'Astro', 'Electron', 'Docker', 'MySQL', 'MongoDB', 'Redis', 'FastAPI', 'Tailwind', 'Git', 'Phaser', 'Vite', 'C++', 'Spring Boot']
let limpiarClasico = null

function pintarClasico() {
  const x = t()
  const c = x.clasico
  const otro = estado.idioma === 'es' ? 'en' : 'es'
  const fuera = 'target="_blank" rel="noopener"'
  const enlacesProyecto = (p) => [
    p.repo && `<a href="${p.repo}" ${fuera}>${esc(x.verCodigo)} ↗</a>`,
    p.demo && `<a href="${p.demo}" ${fuera}>${esc(x.verDemo)} ↗</a>`,
    !p.repo && !p.demo && `<span class="privado">${esc(x.privado)}</span>`,
  ].filter(Boolean).join('')
  const cinta = [...TECNOLOGIAS, ...TECNOLOGIAS].map((n) => `<span>${esc(n)}</span>`).join('<i>◆</i>')
  $('#clasico-volver').textContent = c.volver
  $('#clasico-cuerpo').innerHTML = `
    <div class="cl-fondo" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="cl-progreso" aria-hidden="true"></div>
    <nav class="cl-nav"><span class="cl-marca"><b>alejandro</b>.blanco()</span>
      <div>${['sobre', 'proyectos', 'trayectoria', 'stack', 'contacto'].map((k) => `<a href="#cl-${k}" data-seccion="cl-${k}">${esc(c[k])}</a>`).join('')}
      <button class="cl-idioma" id="cl-idioma">${otro.toUpperCase()}</button>
      <button class="cl-jugar" id="cl-jugar">▶ ${esc(c.jugar)}</button></div></nav>
    <header class="cl-hero" id="cl-sobre">
      <div class="cl-editor cl-revela">
        <div class="cl-pestana"><i></i><i></i><i></i><span>HelloWorld.java</span><canvas class="cl-mini" width="24" height="32" aria-hidden="true"></canvas></div>
        <p class="cl-comentario"><span class="cl-escribe" data-texto="// ${esc(c.comentario)}"></span><b class="cl-cursor">▋</b></p>
        <h1 class="cl-nombre">Alejandro Blanco Rodríguez</h1>
        <p class="cl-titulo">${esc(x.titulo)}</p>
        <p class="cl-resumen">${esc(x.sobreMi)}</p>
        <p class="cl-estado"><span class="cl-punto"></span>${esc(c.disponible)} · Madrid</p>
        <div class="cl-acciones">
          <a class="cl-btn principal" href="${ENLACES.practicas}">${esc(x.contacto.practicas)}</a>
          <a class="cl-btn" href="${ENLACES.cv[estado.idioma]}" download>${esc(x.contacto.cv)}</a>
          <a class="cl-btn" href="${ENLACES.github}" ${fuera}>GitHub</a>
          <a class="cl-btn" href="${ENLACES.linkedin}" ${fuera}>LinkedIn</a>
        </div>
      </div>
      <figure class="cl-foto cl-revela"><div class="cl-aro"><img src="img/alejandro.jpg" alt="Alejandro Blanco Rodríguez" width="400" height="600"></div></figure>
    </header>
    <section class="cl-datos">${c.datos.map(([n, d], i) => `<div class="cl-revela" style="--i:${i}"><b data-cuenta="${esc(n)}">${esc(n)}</b><span>${esc(d)}</span></div>`).join('')}</section>
    <div class="cl-cinta" aria-hidden="true"><div>${cinta}</div></div>
    <section id="cl-proyectos"><h2 class="cl-revela">${esc(c.proyectos)}</h2><div class="cl-proyectos">${PROYECTOS.map((p, i) => `
      <article class="cl-revela ${p.premio ? 'destacado' : ''}" style="--i:${i % 3}"><header><h3>${esc(p.nombre)}</h3>${p.premio ? `<span class="cl-premio">${esc(c.premio)}</span>` : ''}</header>
      <p>${esc(x.proyectosTexto[p.id])}</p><div class="cl-chips">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
      <div class="cl-enlaces">${enlacesProyecto(p)}</div></article>`).join('')}</div></section>
    <section id="cl-trayectoria"><h2 class="cl-revela">${esc(c.trayectoria)}</h2><ol class="cl-linea">${x.trayectoria.slice().reverse().map((h) => `
      <li class="cl-revela"><time>${esc(h.fecha)}</time><div><h3>${esc(h.titulo)}</h3><em>${esc(h.lugar)}</em><p>${esc(h.texto)}</p></div></li>`).join('')}</ol></section>
    <section id="cl-stack"><h2 class="cl-revela">${esc(c.stack)}</h2><div class="cl-stack">${STACK.map((g, i) => `
      <div class="cl-revela" style="--i:${i}"><h3>${esc(x.grupos[g.grupo])}</h3>${g.items.map(([n, v]) => `<div class="cl-nivel"><span>${esc(n)}</span><i style="--v:${v * 10}%"></i></div>`).join('')}</div>`).join('')}</div></section>
    <section class="cl-revela"><h2>${esc(c.prensa)}</h2><div class="cl-prensa"><p><b>${esc(x.trofeos.titulo)}</b>. ${esc(x.trofeos.texto)}</p>
      <ul>${x.trofeos.medios.map(medio).join('')}</ul></div></section>
    <section id="cl-contacto" class="cl-contacto cl-revela"><h2>${esc(c.contacto)}</h2><p>${esc(x.contacto.texto)}</p>
      <div class="cl-acciones">
        <a class="cl-btn principal" href="${ENLACES.practicas}">${esc(x.contacto.practicas)}</a>
        <a class="cl-btn" href="mailto:${ENLACES.email}">${ENLACES.email}</a>
        <a class="cl-btn" href="${ENLACES.cv[estado.idioma]}" download>${esc(x.contacto.cv)}</a>
        <a class="cl-btn" href="${ENLACES.cv[otro]}" download>${esc(x.contacto.cvOtro)}</a>
      </div></section>
    <footer class="cl-pie">${esc(c.pie)}</footer>`
  $('#cl-idioma').onclick = () => { cambiarIdioma(); pintarClasico(); pintarHUD() }
  $('#cl-jugar').onclick = () => cerrarClasico()
  animarClasico()
}

function animarClasico() {
  limpiarClasico?.()
  const raiz = $('#clasico')
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches
  const relojes = []
  // aparecer al hacer scroll (y contar las cifras y llenar las barras cuando se ven)
  const contar = (b) => {
    const m = b.dataset.cuenta.match(/\d+/)
    if (!m || quieto) return
    const fin = +m[0], plantilla = b.dataset.cuenta
    const t0 = performance.now()
    const paso = (ahora) => {
      const k = Math.min(1, (ahora - t0) / 900)
      b.textContent = plantilla.replace(m[0], Math.round(fin * (1 - Math.pow(1 - k, 3))))
      if (k < 1) requestAnimationFrame(paso)
    }
    requestAnimationFrame(paso)
  }
  const visto = new IntersectionObserver((entradas) => entradas.forEach((e) => {
    if (!e.isIntersecting) return
    e.target.classList.add('visto')
    e.target.querySelectorAll('[data-cuenta]').forEach(contar)
    visto.unobserve(e.target)
  }), { root: raiz, threshold: 0.12 })
  raiz.querySelectorAll('.cl-revela').forEach((el) => { if (quieto) el.classList.add('visto'); else visto.observe(el) })

  // sección activa en el menú y barra de progreso de lectura
  const enlacesNav = [...raiz.querySelectorAll('[data-seccion]')]
  const alScroll = () => {
    const max = raiz.scrollHeight - raiz.clientHeight
    raiz.querySelector('.cl-progreso').style.transform = `scaleX(${max > 0 ? raiz.scrollTop / max : 0})`
    let activa = null
    for (const a of enlacesNav) { const s = raiz.querySelector('#' + a.dataset.seccion); if (s && s.offsetTop - 120 <= raiz.scrollTop) activa = a }
    enlacesNav.forEach((a) => a.classList.toggle('activa', a === activa))
  }
  raiz.addEventListener('scroll', alScroll, { passive: true })
  alScroll()

  // el comentario del editor se escribe solo
  const escribe = raiz.querySelector('.cl-escribe')
  const frase = escribe.dataset.texto
  if (quieto) escribe.textContent = frase
  else {
    let n = 0
    const reloj = setInterval(() => { escribe.textContent = frase.slice(0, ++n); if (n >= frase.length) clearInterval(reloj) }, 45)
    relojes.push(reloj)
  }

  // el Alejandro del juego anda en la pestaña del editor
  const mini = raiz.querySelector('.cl-mini')
  const hoja = window.__juego?.textures?.exists('alejandro') && window.__juego.textures.get('alejandro').getSourceImage()
  if (hoja && mini) {
    const ctx = mini.getContext('2d')
    ctx.imageSmoothingEnabled = false
    let f = 0, haciaDerecha = true
    // fila 2 de la hoja = mirando a la derecha, fila 1 = a la izquierda
    const pinta = () => { ctx.clearRect(0, 0, 24, 32); ctx.drawImage(hoja, [1, 0, 2, 0][f % 4] * 24, haciaDerecha ? 64 : 32, 24, 32, 0, 0, 24, 32); f++ }
    pinta()
    // la animación va y vuelve: en cada vuelta cambia de sentido y se gira
    mini.addEventListener('animationiteration', () => { haciaDerecha = !haciaDerecha; pinta() })
    if (!quieto) relojes.push(setInterval(pinta, 160))
  } else mini?.remove()

  // foco que sigue al ratón en las tarjetas de proyectos y una ligera inclinación
  if (!quieto) raiz.querySelectorAll('.cl-proyectos article').forEach((a) => {
    a.addEventListener('pointermove', (e) => {
      const r = a.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
      a.style.setProperty('--mx', `${px * 100}%`); a.style.setProperty('--my', `${py * 100}%`)
      a.style.transform = `perspective(700px) rotateX(${(0.5 - py) * 5}deg) rotateY(${(px - 0.5) * 6}deg) translateY(-3px)`
    })
    a.addEventListener('pointerleave', () => { a.style.transform = '' })
  })

  limpiarClasico = () => { visto.disconnect(); raiz.removeEventListener('scroll', alScroll); relojes.forEach(clearInterval); limpiarClasico = null }
}

export function abrirClasico() { registrar('clasico', null, true); pintarClasico(); $('#clasico').hidden = false; $('#clasico').scrollTop = 0; document.body.classList.add('en-clasico') }
export function cerrarClasico() { limpiarClasico?.(); $('#clasico').hidden = true; document.body.classList.remove('en-clasico') }

// ---------------------------------------------------------------------------------------------- mando táctil
// vx y vy van de -1 a 1: la palanca es analógica (cuanto más la empujas, más rápido andas)
export const teclasTactiles = { arriba: false, abajo: false, izquierda: false, derecha: false, accion: false, vx: 0, vy: 0 }
export function iniciarMando() {
  // Palanca flotante: aparece donde apoyas el pulgar en la mitad izquierda y sigue al dedo
  const zona = $('#palanca'), base = zona.querySelector('.palanca-base'), bola = zona.querySelector('.palanca-bola')
  const RADIO = 42
  let dedo = null, cx = 0, cy = 0
  const soltar = (e) => {
    if (e.pointerId !== dedo) return
    dedo = null; teclasTactiles.vx = teclasTactiles.vy = 0
    zona.classList.remove('activa'); bola.style.transform = ''
  }
  zona.addEventListener('pointerdown', (e) => {
    if (dedo !== null) return
    e.preventDefault()
    dedo = e.pointerId; zona.setPointerCapture(dedo)
    const r = zona.getBoundingClientRect()
    cx = e.clientX; cy = e.clientY
    base.style.left = `${cx - r.left}px`; base.style.top = `${cy - r.top}px`
    zona.classList.add('activa')
    cerrarMenuHUD()
  })
  zona.addEventListener('pointermove', (e) => {
    if (e.pointerId !== dedo) return
    let dx = e.clientX - cx, dy = e.clientY - cy
    const d = Math.hypot(dx, dy)
    if (d > RADIO) { dx = (dx / d) * RADIO; dy = (dy / d) * RADIO }
    bola.style.transform = `translate(${dx}px, ${dy}px)`
    // zona muerta pequeña para que no se mueva solo con apoyar el dedo
    const f = d < 8 ? 0 : Math.min(1, d / RADIO)
    const a = Math.atan2(dy, dx)
    teclasTactiles.vx = f ? Math.cos(a) * Math.max(0.45, f) : 0
    teclasTactiles.vy = f ? Math.sin(a) * Math.max(0.45, f) : 0
  })
  zona.addEventListener('pointerup', soltar); zona.addEventListener('pointercancel', soltar)
  $('#btn-accion').addEventListener('pointerdown', (e) => { e.preventDefault(); teclasTactiles.accion = true; navigator.vibrate?.(12) })
}
