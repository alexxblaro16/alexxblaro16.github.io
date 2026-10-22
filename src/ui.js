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
export function hayPanel() { return panelAbierto || !$('#clasico').hidden }

function enlaces(p, x) {
  const b = []
  if (p.repo) b.push(`<a class="boton" href="${p.repo}" target="_blank" rel="noopener">${x.verCodigo} ↗</a>`)
  if (p.demo) b.push(`<a class="boton verde" href="${p.demo}" target="_blank" rel="noopener">${x.verDemo} ↗</a>`)
  if (!p.repo && !p.demo) b.push(`<span class="etiqueta-privado">${x.privado}</span>`)
  return b.join('')
}

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
    return `<div class="trofeo">${copa}<h3>${esc(x.trofeos.titulo)}</h3><p>${esc(x.trofeos.texto)}</p><ul class="medios">${x.trofeos.medios.map((m) => `<li>${esc(m)}</li>`).join('')}</ul></div>`
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
  $('#clasico-volver').textContent = c.volver
  $('#clasico-cuerpo').innerHTML = `
    <header class="clasico-cab"><h1>Alejandro Blanco Rodríguez</h1><p>${esc(x.titulo)}</p></header>
    <section><h2>${esc(c.sobre)}</h2><p>${esc(x.sobreMi)}</p></section>
    <section><h2>${esc(c.contacto)}</h2>${htmlZona('contacto')}</section>
    <section><h2>${esc(c.proyectos)}</h2>${htmlZona('proyectos')}</section>
    <section><h2>${esc(c.trayectoria)}</h2>${htmlZona('trayectoria')}</section>
    <section><h2>${esc(c.stack)}</h2>${htmlZona('stack')}</section>`
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
