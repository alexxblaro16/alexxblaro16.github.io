// Pantalla privada de accesos (/accesos/): pide la contraseña y enseña las últimas visitas al portfolio
// con lo que ha hecho cada una. Al entrar, este navegador deja de contar como visita.
import './accesos.css'
import { URL_REGISTRO, NO_CONTAR } from './registro.js'
import { TEXTOS } from './content.js'

const CLAVE = 'alexxblaro-accesos'
const $ = (s) => document.querySelector(s)
const raiz = $('#accesos')
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const paises = new Intl.DisplayNames(['es'], { type: 'region' })
const nombrePais = (c) => { try { return c ? paises.of(c) : 'País desconocido' } catch { return c } }
const ARCADE = { serpiente: 'Serpiente', nave: 'Nave', ladrillos: 'Ladrillos', laberinto: 'Commit Hunt', futbol: 'los penaltis del campo', bits: 'Bit Drop (planta 3 de la UDIT)' }
const SALAS = { casa: 'la casa de la familia', reblan: 'Reblán', medac: 'el aula del MEDAC', udit: 'la UDIT', udit3: 'la planta 3 de la UDIT' }
// Las «zonas» nuevas (salas, esferas, deseo, pantalla completa) van por el mismo tipo para no tocar el servidor
function zona(d) {
  if (d.startsWith('interior-')) return ['', `Entró en ${SALAS[d.slice(9)] || d.slice(9)}`]
  if (d.startsWith('esfera-')) return ['', `Encontró una esfera (${d.slice(7)}/7)`]
  if (d === 'deseo') return ['oro', 'Reunió las 7 esferas y pidió el deseo']
  if (d === 'pantalla-completa') return ['', 'Jugó a pantalla completa']
  return ['', `Entró en ${TEXTOS.es.zonas[d]?.titulo || d}`]
}

const leer = () => { try { return localStorage.getItem(CLAVE) } catch { return null } }
const escribir = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v) } catch { /* sin almacenamiento */ } }

function hace(ms) {
  const s = Math.round((Date.now() - ms) / 1000)
  if (s < 60) return 'ahora mismo'
  if (s < 3600) return `hace ${Math.floor(s / 60)} min`
  if (s < 86400) return `hace ${Math.floor(s / 3600)} h`
  if (s < 7 * 86400) return `hace ${Math.floor(s / 86400)} d`
  return new Date(ms).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}
const hora = (ms) => new Date(ms).toLocaleString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const duracion = (s) => (!s ? '—' : s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${s % 60} s`)

// Cómo se cuenta cada cosa que hace un visitante
function evento(e) {
  const d = e.dato
  switch (e.tipo) {
    case 'personaje': return ['verde', `Creó a «${d}»`]
    case 'vuelve': return ['verde', `«${d}» entró de nuevo`]
    case 'zona': return zona(d || '')
    case 'recorrido': return d === 'completo' ? ['verde', 'Terminó el recorrido'] : ['', `Se saltó el recorrido (${d.replace('saltado en el ', '')})`]
    case 'clasico': return ['', 'Abrió el modo clásico']
    case 'cv': return ['oro', `Descargó el CV ${/EN/.test(d) ? '(EN)' : '(ES)'}`]
    case 'arcade': return ['', `Jugó a ${ARCADE[d] || d}`]
    case 'enlace': return ['oro', `Fue a ${d}`]
    default: return ['', e.tipo]
  }
}

function pintarEntrada(error = '') {
  raiz.innerHTML = `<form class="entrada">
      <h1>ACCESOS</h1>
      <p>Solo para Alejandro.</p>
      <input id="clave" type="password" placeholder="Contraseña" autocomplete="current-password" required>
      <button class="boton verde">Entrar</button>
      ${error ? `<p class="error">${esc(error)}</p>` : ''}
    </form>`
  $('.entrada').onsubmit = (e) => { e.preventDefault(); cargar($('#clave').value) }
  $('#clave').focus()
}

function tarjeta(v) {
  const lugar = [v.ciudad, v.region !== v.ciudad ? v.region : null, nombrePais(v.pais)].filter(Boolean).join(', ')
  const de = [v.origen, v.campana && v.origen ? `(${v.campana})` : v.campana].filter(Boolean).join(' ')
  const origen = de ? `Viene de ${esc(de)}` : 'Entró directo'
  const cosas = v.eventos.map(evento)
  const cv = v.eventos.some((e) => e.tipo === 'cv')
  // si no creó personaje en esta visita pero volvió con el de otra vez, se dice en la cabecera
  const vuelve = !v.eventos.some((e) => e.tipo === 'personaje') && v.eventos.some((e) => e.tipo === 'vuelve')
  return `<article class="visita${cv ? ' cv' : ''}">
      <header>
        <h2>${v.personaje ? esc(v.personaje) : '<span class="sin">Sin personaje</span>'}${vuelve ? ' <span class="sin">· entró de nuevo</span>' : ''}</h2>
        <time title="${esc(hora(v.inicio))}">${esc(hace(v.inicio))}</time>
      </header>
      <p class="lugar">${esc(lugar)}</p>
      <p class="datos">${esc(v.dispositivo)} · ${esc(v.sistema)} · ${esc(v.navegador)} · ${esc(v.idioma || '')} · ${origen} · ${esc(duracion(v.duracion))}</p>
      ${cosas.length ? `<ul class="chips">${cosas.map(([c, txt]) => `<li class="${c}">${esc(txt)}</li>`).join('')}</ul>` : '<p class="nada">Solo miró la portada.</p>'}
    </article>`
}

function pintar({ resumen, visitas }) {
  const r = resumen
  raiz.innerHTML = `
    <header class="cabecera">
      <h1>ACCESOS</h1>
      <div class="acciones">
        <button id="recargar" class="boton">Recargar</button>
        <button id="salir" class="boton">Salir</button>
      </div>
    </header>
    <section class="cifras">
      <div><b>${r.hoy || 0}</b><span>hoy</span></div>
      <div><b>${r.semana || 0}</b><span>últimos 7 días</span></div>
      <div><b>${r.total || 0}</b><span>en total</span></div>
      <div><b>${r.conPersonaje || 0}</b><span>con personaje</span></div>
    </section>
    ${r.paises.length ? `<p class="paises">${r.paises.map((p) => `<span>${esc(nombrePais(p.pais))} <b>${p.n}</b></span>`).join('')}</p>` : ''}
    <p class="aviso">Este navegador ya no cuenta como visita. Se actualiza solo cada 30 s.</p>
    <section class="lista">${visitas.length ? visitas.map(tarjeta).join('') : '<p class="nada">Todavía no ha entrado nadie.</p>'}</section>`
  $('#recargar').onclick = () => cargar(leer())
  $('#salir').onclick = () => { escribir(CLAVE, null); pintarEntrada() }
}

let reloj
async function cargar(clave) {
  if (!clave) return pintarEntrada()
  if (!URL_REGISTRO) return pintarEntrada('Falta configurar el servidor de registro.')
  try {
    const r = await fetch(`${URL_REGISTRO}/accesos?limite=150`, { headers: { Authorization: `Bearer ${clave}` } })
    if (r.status === 401) { escribir(CLAVE, null); return pintarEntrada('Contraseña incorrecta.') }
    if (!r.ok) throw new Error()
    escribir(CLAVE, clave)
    escribir(NO_CONTAR, '1')
    pintar(await r.json())
    clearTimeout(reloj)
    reloj = setTimeout(() => cargar(leer()), 30000)
  } catch {
    pintarEntrada('No se ha podido conectar con el servidor.')
  }
}

cargar(leer())
