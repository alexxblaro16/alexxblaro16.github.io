// Registro de visitas del portfolio. Recibe cada visita y lo que hace dentro del juego,
// y se lo enseña solo a Alejandro con su contraseña (secreto CLAVE_ACCESOS).
// País y ciudad los pone Cloudflare; la IP no se guarda en ningún sitio.
// También guarda el récord de cada minijuego (nombre del personaje y puntos), que ve todo el mundo,
// y las opiniones que dejan los visitantes, que le llegan a Alejandro al correo.

const ORIGENES = ['https://alexxblaro16.github.io', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5180']
const TIPOS = new Set(['personaje', 'nombre', 'vuelve', 'zona', 'recorrido', 'clasico', 'cv', 'arcade', 'enlace', 'fin'])
const MAX_EVENTOS = 300
// tope razonable de puntos de cada minijuego (lo que pase de ahí es trampa)
const JUEGOS = { serpiente: 300, nave: 5000, ladrillos: 500, laberinto: 1000, futbol: 1000, bits: 100000 }

const corta = (v, n) => (typeof v === 'string' ? v.slice(0, n) : null)

function cabeceras(request) {
  const origen = request.headers.get('Origin')
  return {
    'Access-Control-Allow-Origin': ORIGENES.includes(origen) ? origen : ORIGENES[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  }
}

const json = (request, datos, estado = 200) =>
  new Response(JSON.stringify(datos), { status: estado, headers: { 'Content-Type': 'application/json', ...cabeceras(request) } })

// Lee el cuerpo aunque llegue como texto (sendBeacon no deja poner Content-Type JSON)
async function cuerpo(request) {
  const texto = await request.text()
  if (texto.length > 4000) return null
  try { return JSON.parse(texto) } catch { return null }
}

// Las tabletas Android (Chrome en «versión de escritorio») se presentan como Linux y los iPad como Mac;
// si la pantalla es táctil, se trata como tableta
function leerAgente(ua = '', tactil = 0) {
  const disfrazada = tactil > 1 && !/Windows|Android|iPhone|iPad|CrOS/i.test(ua) && /Mac OS|Linux/i.test(ua)
  const dispositivo = disfrazada || /iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobi/i.test(ua)) ? 'Tableta'
    : /Mobi|Android|iPhone/i.test(ua) ? 'Móvil' : 'Ordenador'
  const sistema = /Windows/i.test(ua) ? 'Windows' : /iPad/i.test(ua) ? 'iPadOS' : /iPhone|iPod|iOS/i.test(ua) ? 'iOS' : /Android/i.test(ua) ? 'Android'
    : disfrazada ? (/Mac OS/i.test(ua) ? 'iPadOS' : 'Android')
    : /CrOS/.test(ua) ? 'ChromeOS' : /Mac OS/i.test(ua) ? 'macOS' : /Linux/i.test(ua) ? 'Linux' : 'Otro'
  // primero las apps que abren la web por dentro (Instagram, WhatsApp, LinkedIn…), luego los navegadores;
  // en iPhone, Chrome, Firefox y Edge se llaman CriOS, FxiOS y EdgiOS
  const app = [[/Instagram/, 'Instagram'], [/FBAN|FBAV|FB_IAB/, 'Facebook'], [/WhatsApp/i, 'WhatsApp'], [/LinkedInApp/i, 'LinkedIn'],
    [/musical_ly|BytedanceWebview|TikTok/i, 'TikTok'], [/Twitter/i, 'X'], [/Telegram/i, 'Telegram'], [/Snapchat/i, 'Snapchat'], [/GSA\//, 'Google']]
    .find(([re]) => re.test(ua))?.[1]
  const navegador = app ? `App de ${app}`
    : /Edg(e|A|iOS)?\//.test(ua) ? 'Edge' : /OPR\/|OPT\//.test(ua) ? 'Opera' : /SamsungBrowser/.test(ua) ? 'Samsung'
    : /Firefox\/|FxiOS/.test(ua) ? 'Firefox' : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Otro'
  return { dispositivo, sistema, navegador }
}

const esRobot = (ua = '') => /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|linkedinbot|whatsapp\/\d|telegrambot|skypeuripreview|discordbot/i.test(ua)
// Las visitas desde centros de datos (Google, Microsoft, Amazon, Meta…) son robots que abren el enlace con aspecto
// de navegador para hacer la vista previa o revisarlo: salían como gente de Council Bluffs, Boardman o Prineville
const CENTRO_DATOS = /google|microsoft|amazon|aws|facebook|meta platforms|digitalocean|ovh|hetzner|linode|akamai connected cloud|oracle|alibaba|tencent|contabo|scaleway|vultr|choopa|leaseweb/i
const esCentroDatos = (cf = {}) => CENTRO_DATOS.test(cf.asOrganization || '') && !/private relay/i.test(cf.asOrganization || '')

// Comparación que tarda lo mismo acierte o falle
function igual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false
  let d = 0
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return d === 0
}

async function nuevaVisita(request, env) {
  const ua = request.headers.get('User-Agent') || ''
  if (esRobot(ua)) return json(request, { id: null })
  const d = (await cuerpo(request)) || {}
  const cf = request.cf || {}
  if (esCentroDatos(cf)) return json(request, { id: null })
  const { dispositivo, sistema, navegador } = leerAgente(ua, Number(d.tactil) || 0)
  const id = crypto.randomUUID()
  const ahora = Date.now()
  await env.DB.prepare(`INSERT INTO visitas (id, inicio, ultima, pais, region, ciudad, red, dispositivo, sistema, navegador, idioma, pantalla, origen, campana)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, ahora, ahora, corta(cf.country, 4), corta(cf.region, 60), corta(cf.city, 60), corta(cf.asOrganization, 60), dispositivo, sistema, navegador,
      corta(d.idioma, 12), corta(d.pantalla, 20), corta(d.origen, 80), corta(d.campana, 80))
    .run()
  return json(request, { id })
}

async function nuevoEvento(request, env) {
  const d = await cuerpo(request)
  if (!d || typeof d.visita !== 'string' || !TIPOS.has(d.tipo)) return json(request, { ok: false }, 400)
  const visita = await env.DB.prepare('SELECT inicio, (SELECT COUNT(*) FROM eventos WHERE visita = ?1) AS n FROM visitas WHERE id = ?1')
    .bind(d.visita).first()
  if (!visita || visita.n >= MAX_EVENTOS) return json(request, { ok: false }, 404)
  const ahora = Date.now()
  const dato = corta(d.dato == null ? null : String(d.dato), 80)
  const pasos = [env.DB.prepare('UPDATE visitas SET ultima = ? WHERE id = ?').bind(ahora, d.visita)]
  if (d.tipo === 'fin') {
    // El tiempo que lleva dentro se manda al salir de la pestaña; nos quedamos con el mayor
    const segundos = Math.min(Math.max(parseInt(d.dato, 10) || 0, 0), 86400)
    pasos.push(env.DB.prepare('UPDATE visitas SET duracion = MAX(duracion, ?) WHERE id = ?').bind(segundos, d.visita))
  } else {
    pasos.push(env.DB.prepare('INSERT INTO eventos (visita, hora, tipo, dato) VALUES (?, ?, ?, ?)').bind(d.visita, ahora, d.tipo, dato))
    // 'vuelve' = un visitante que ya tenía personaje de otra vez y le dio a Continuar
    // 'nombre' = escribió su nombre pero aún no ha terminado el personaje: solo si no hay otro
    if (d.tipo === 'nombre') pasos.push(env.DB.prepare('UPDATE visitas SET personaje = COALESCE(personaje, ?) WHERE id = ?').bind(corta(dato, 24), d.visita))
    if (d.tipo === 'personaje' || d.tipo === 'vuelve') pasos.push(env.DB.prepare('UPDATE visitas SET personaje = ? WHERE id = ?').bind(corta(dato, 24), d.visita))
  }
  await env.DB.batch(pasos)
  return json(request, { ok: true })
}

async function verRecords(request, env) {
  const filas = (await env.DB.prepare('SELECT juego, nombre, puntos FROM records').all()).results
  return json(request, Object.fromEntries(filas.map((f) => [f.juego, { nombre: f.nombre, puntos: f.puntos }])))
}

// Solo se guarda si supera el récord que hay (la comparación la hace la propia base de datos)
async function nuevoRecord(request, env) {
  const d = await cuerpo(request)
  const tope = d && JUEGOS[d.juego]
  const puntos = d && Number.isInteger(d.puntos) ? d.puntos : -1
  const nombre = d && typeof d.nombre === 'string' ? d.nombre.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 12) : ''
  if (!tope || puntos <= 0 || puntos > tope || !nombre) return json(request, { ok: false }, 400)
  await env.DB.prepare(`INSERT INTO records (juego, nombre, puntos, fecha) VALUES (?, ?, ?, ?)
      ON CONFLICT(juego) DO UPDATE SET nombre = excluded.nombre, puntos = excluded.puntos, fecha = excluded.fecha
      WHERE excluded.puntos > records.puntos`).bind(d.juego, nombre, puntos, Date.now()).run()
  const r = await env.DB.prepare('SELECT nombre, puntos FROM records WHERE juego = ?').bind(d.juego).first()
  return json(request, { ok: true, record: r })
}

// Una opinión o sugerencia: se guarda y se le manda a Alejandro al correo (con FormSubmit, que reenvía sin
// necesitar un dominio propio). Tope de 5 por visita y de 40 a la hora en total, para que nadie llene el buzón.
async function nuevaOpinion(request, env, ctx) {
  const d = await cuerpo(request)
  const texto = d && typeof d.texto === 'string' ? d.texto.replace(/[\u0000-\u0008\u000b-\u001f]/g, '').trim().slice(0, 1000) : ''
  const nombre = d && typeof d.nombre === 'string' ? d.nombre.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 20) : null
  const donde = d?.donde === 'buzon' ? 'buzon' : 'alejandro'
  const visita = corta(d?.visita, 40)
  if (texto.length < 2) return json(request, { ok: false }, 400)
  const hora = Date.now()
  const [porVisita, total] = await env.DB.batch([
    env.DB.prepare('SELECT COUNT(*) AS n FROM opiniones WHERE visita = ?').bind(visita || ''),
    env.DB.prepare('SELECT COUNT(*) AS n FROM opiniones WHERE hora > ?').bind(hora - 3600000),
  ])
  if (porVisita.results[0].n >= 5 || total.results[0].n >= 40) return json(request, { ok: false }, 429)
  const pais = request.cf?.country || null
  await env.DB.prepare('INSERT INTO opiniones (hora, visita, nombre, donde, pais, texto) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(hora, visita, nombre, donde, pais, texto).run()
  if (env.CORREO) {
    ctx.waitUntil(fetch(`https://formsubmit.co/ajax/${env.CORREO}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Origin: ORIGENES[0], Referer: ORIGENES[0] + '/' },
      body: JSON.stringify({
        _subject: `Opinión en tu portfolio de ${nombre || 'alguien'}`,
        _template: 'table', _captcha: 'false',
        Personaje: nombre || '(sin nombre)', Donde: donde === 'buzon' ? 'Buzón junto al metro' : 'Hablando con Alejandro',
        Pais: pais || '?', Opinion: texto,
      }),
    }).catch(() => {}))
  }
  return json(request, { ok: true })
}

async function verAccesos(request, env) {
  const clave = (request.headers.get('Authorization') || '').replace(/^Bearer /, '')
  if (!env.CLAVE_ACCESOS || !igual(clave, env.CLAVE_ACCESOS)) return json(request, { error: 'Contraseña incorrecta' }, 401)
  const url = new URL(request.url)
  const limite = Math.min(Math.max(parseInt(url.searchParams.get('limite'), 10) || 100, 1), 500)
  const hoy = new Date(); hoy.setUTCHours(0, 0, 0, 0)
  const semana = Date.now() - 7 * 86400000
  const [visitas, totales, paises, opiniones] = await env.DB.batch([
    env.DB.prepare('SELECT * FROM visitas ORDER BY inicio DESC LIMIT ?').bind(limite),
    env.DB.prepare(`SELECT COUNT(*) AS total, SUM(inicio >= ?) AS hoy, SUM(inicio >= ?) AS semana,
        SUM(personaje IS NOT NULL) AS conPersonaje FROM visitas`).bind(hoy.getTime(), semana),
    env.DB.prepare('SELECT pais, COUNT(*) AS n FROM visitas WHERE pais IS NOT NULL GROUP BY pais ORDER BY n DESC LIMIT 6'),
    env.DB.prepare('SELECT hora, nombre, donde, pais, texto FROM opiniones ORDER BY hora DESC LIMIT 100'),
  ])
  const ids = visitas.results.map((v) => v.id)
  let eventos = []
  if (ids.length) {
    const huecos = ids.map(() => '?').join(',')
    eventos = (await env.DB.prepare(`SELECT visita, hora, tipo, dato FROM eventos WHERE visita IN (${huecos}) ORDER BY hora`).bind(...ids).all()).results
  }
  const porVisita = {}
  for (const e of eventos) (porVisita[e.visita] ||= []).push(e)
  return json(request, {
    resumen: { ...totales.results[0], paises: paises.results },
    visitas: visitas.results.map((v) => ({ ...v, eventos: porVisita[v.id] || [] })),
    opiniones: opiniones.results,
  })
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cabeceras(request) })
    const { pathname } = new URL(request.url)
    try {
      if (request.method === 'POST' && pathname === '/visita') return await nuevaVisita(request, env)
      if (request.method === 'POST' && pathname === '/evento') return await nuevoEvento(request, env)
      if (request.method === 'GET' && pathname === '/accesos') return await verAccesos(request, env)
      if (request.method === 'GET' && pathname === '/records') return await verRecords(request, env)
      if (request.method === 'POST' && pathname === '/record') return await nuevoRecord(request, env)
      if (request.method === 'POST' && pathname === '/opinion') return await nuevaOpinion(request, env, ctx)
      return json(request, { error: 'No existe' }, 404)
    } catch {
      return json(request, { error: 'Error del servidor' }, 500)
    }
  },
}
