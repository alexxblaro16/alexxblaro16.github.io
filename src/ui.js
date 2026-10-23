// Capa HTML encima del juego: barra superior, diálogos, paneles de cada zona, logros, nombres al pasar
// el ratón, mando táctil y modo clásico. En HTML para que los enlaces funcionen y se lea bien.
import { ENLACES, PROYECTOS, STACK } from './content.js'
import { estado, t, cambiarIdioma, alCambiarIdioma, guardar } from './estado.js'
import { sfx, alternarSonido } from './sonido.js'

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
  $('#btn-sonido').textContent = estado.sonido ? '♪ ON' : '♪ OFF'
  $('#hud-zonas').textContent = `${x.hud.misiones} ${estado.visitados.size}/6`
  $('#ayuda').textContent = x.hud.ayuda
  $('#btn-accion').textContent = x.accion
}

export function iniciarUI() {
  $('#btn-idioma').onclick = () => { cambiarIdioma(); pintarHUD() }
  $('#btn-sonido').onclick = () => { alternarSonido(); pintarHUD() }
  $('#btn-clasico').onclick = () => abrirClasico()
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
  $('#clasico-volver').textContent = c.volver
  $('#clasico-cuerpo').innerHTML = `
    <nav class="cl-nav"><span class="cl-marca"><b>alejandro</b>.blanco()</span>
      <div>${['sobre', 'proyectos', 'trayectoria', 'stack', 'contacto'].map((k) => `<a href="#cl-${k}">${esc(c[k])}</a>`).join('')}
      <button class="cl-idioma" id="cl-idioma">${otro.toUpperCase()}</button></div></nav>
    <header class="cl-hero" id="cl-sobre">
      <div class="cl-editor">
        <div class="cl-pestana"><i></i><i></i><i></i><span>HelloWorld.java</span></div>
        <p class="cl-comentario">// ${esc(c.comentario)}</p>
        <h1>Alejandro Blanco Rodríguez</h1>
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
      <figure class="cl-foto"><img src="img/alejandro.jpg" alt="Alejandro Blanco Rodríguez" width="400" height="600"></figure>
    </header>
    <section class="cl-datos">${c.datos.map(([n, d]) => `<div><b>${esc(n)}</b><span>${esc(d)}</span></div>`).join('')}</section>
    <section id="cl-proyectos"><h2>${esc(c.proyectos)}</h2><div class="cl-proyectos">${PROYECTOS.map((p) => `
      <article class="${p.premio ? 'destacado' : ''}"><header><h3>${esc(p.nombre)}</h3>${p.premio ? `<span class="cl-premio">${esc(c.premio)}</span>` : ''}</header>
      <p>${esc(x.proyectosTexto[p.id])}</p><div class="cl-chips">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
      <div class="cl-enlaces">${enlacesProyecto(p)}</div></article>`).join('')}</div></section>
    <section id="cl-trayectoria"><h2>${esc(c.trayectoria)}</h2><ol class="cl-linea">${x.trayectoria.slice().reverse().map((h) => `
      <li><time>${esc(h.fecha)}</time><div><h3>${esc(h.titulo)}</h3><em>${esc(h.lugar)}</em><p>${esc(h.texto)}</p></div></li>`).join('')}</ol></section>
    <section id="cl-stack"><h2>${esc(c.stack)}</h2><div class="cl-stack">${STACK.map((g) => `
      <div><h3>${esc(x.grupos[g.grupo])}</h3>${g.items.map(([n, v]) => `<div class="cl-nivel"><span>${esc(n)}</span><i style="--v:${v * 10}%"></i></div>`).join('')}</div>`).join('')}</div></section>
    <section><h2>${esc(c.prensa)}</h2><div class="cl-prensa"><p><b>${esc(x.trofeos.titulo)}</b>. ${esc(x.trofeos.texto)}</p>
      <ul>${x.trofeos.medios.map(medio).join('')}</ul></div></section>
    <section id="cl-contacto" class="cl-contacto"><h2>${esc(c.contacto)}</h2><p>${esc(x.contacto.texto)}</p>
      <div class="cl-acciones">
        <a class="cl-btn principal" href="${ENLACES.practicas}">${esc(x.contacto.practicas)}</a>
        <a class="cl-btn" href="mailto:${ENLACES.email}">${ENLACES.email}</a>
        <a class="cl-btn" href="${ENLACES.cv[estado.idioma]}" download>${esc(x.contacto.cv)}</a>
        <a class="cl-btn" href="${ENLACES.cv[otro]}" download>${esc(x.contacto.cvOtro)}</a>
      </div></section>
    <footer class="cl-pie">${esc(c.pie)}</footer>`
  $('#cl-idioma').onclick = () => { cambiarIdioma(); pintarClasico(); pintarHUD() }
}
export function abrirClasico() { pintarClasico(); $('#clasico').hidden = false; document.body.classList.add('en-clasico') }
export function cerrarClasico() { $('#clasico').hidden = true; document.body.classList.remove('en-clasico') }

// ---------------------------------------------------------------------------------------------- mando táctil
export const teclasTactiles = { arriba: false, abajo: false, izquierda: false, derecha: false, accion: false }
export function iniciarMando() {
  document.querySelectorAll('[data-dir]').forEach((b) => {
    const dir = b.dataset.dir
    const on = (e) => { e.preventDefault(); teclasTactiles[dir] = true }
    const off = (e) => { e.preventDefault(); teclasTactiles[dir] = false }
    b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off)
    b.addEventListener('pointerleave', off); b.addEventListener('pointercancel', off)
  })
  $('#btn-accion').addEventListener('pointerdown', (e) => { e.preventDefault(); teclasTactiles.accion = true })
}
