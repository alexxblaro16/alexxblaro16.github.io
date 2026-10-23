// Registro anónimo de visitas: avisa al servidor (Cloudflare Worker de registro/) de que alguien ha entrado
// y de lo que hace dentro. No usa cookies ni guarda nada que identifique al visitante.
// Las visitas de Alejandro no cuentan: su página de accesos marca el navegador con NO_CONTAR.

export const URL_REGISTRO = import.meta.env.VITE_REGISTRO_URL || 'https://portfolio-registro.portfolio-registro.workers.dev'
export const NO_CONTAR = 'alexxblaro-no-contar'

let visita = null
let pendientes = []
let inicio = Date.now()
const yaContado = new Set()

function noContar() {
  try { if (localStorage.getItem(NO_CONTAR)) return true } catch { /* sin almacenamiento: se cuenta */ }
  return !URL_REGISTRO || navigator.webdriver || import.meta.env.DEV
}

function enviar(ruta, datos) {
  return fetch(URL_REGISTRO + ruta, { method: 'POST', body: JSON.stringify(datos), keepalive: true })
}

export async function empezarRegistro() {
  if (noContar()) return
  const params = new URLSearchParams(location.search)
  let origen = null
  try { origen = document.referrer ? new URL(document.referrer).hostname : null } catch { /* sin origen */ }
  if (origen === location.hostname) origen = null
  try {
    const r = await enviar('/visita', {
      idioma: navigator.language,
      pantalla: `${screen.width}x${screen.height}`,
      origen,
      campana: params.get('utm_source') || params.get('ref'),
    })
    visita = (await r.json()).id
  } catch { return }
  if (!visita) return
  pendientes.forEach((e) => enviar('/evento', { visita, ...e }).catch(() => {}))
  pendientes = []

  // Al salir o cambiar de pestaña se manda cuánto tiempo lleva dentro
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'hidden') return
    const datos = JSON.stringify({ visita, tipo: 'fin', dato: Math.round((Date.now() - inicio) / 1000) })
    navigator.sendBeacon?.(URL_REGISTRO + '/evento', datos)
  })

  // Descargas del CV y enlaces a otras webs, estén donde estén
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href]')
    if (!a) return
    const url = new URL(a.href, location.href)
    if (/\/cv\/.+\.pdf$/i.test(url.pathname)) registrar('cv', url.pathname.split('/').pop())
    else if (url.hostname !== location.hostname) registrar('enlace', url.hostname.replace(/^www\./, ''))
  }, true)
}

// Apunta algo que ha hecho el visitante. Con `unaVez`, solo la primera vez en esta visita.
export function registrar(tipo, dato = null, unaVez = false) {
  if (noContar()) return
  if (unaVez) {
    const clave = `${tipo}:${dato}`
    if (yaContado.has(clave)) return
    yaContado.add(clave)
  }
  if (!visita) { pendientes.push({ tipo, dato }); return }
  enviar('/evento', { visita, tipo, dato }).catch(() => {})
}
