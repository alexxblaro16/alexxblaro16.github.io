// Estado compartido de la partida: idioma, sonido, personaje del visitante y zonas visitadas.
// Se guarda en el navegador para que al volver se recuerde (si el navegador no deja, se juega igual).
import { TEXTOS } from './content.js'

const CLAVE = 'alexxblaro-partida'

function leer() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) || {} } catch { return {} }
}

const guardado = leer()
const idiomaNavegador = (navigator.language || 'es').startsWith('es') ? 'es' : 'en'

export const estado = {
  idioma: guardado.idioma || idiomaNavegador,
  sonido: false, // siempre apagado al entrar
  musica: guardado.musica || 'aventura', // estilo de música elegido
  personaje: guardado.personaje || null,
  visitados: new Set(guardado.visitados || []),
  recorridoHecho: !!guardado.recorridoHecho,
  oyentes: new Set(),
}

export function guardar() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({
      idioma: estado.idioma, personaje: estado.personaje, musica: estado.musica,
      visitados: [...estado.visitados], recorridoHecho: estado.recorridoHecho,
    }))
  } catch { /* modo privado: no pasa nada */ }
}

export const t = () => TEXTOS[estado.idioma]

export function cambiarIdioma() {
  estado.idioma = estado.idioma === 'es' ? 'en' : 'es'
  document.documentElement.lang = estado.idioma
  guardar()
  estado.oyentes.forEach((f) => f())
}

export function alCambiarIdioma(f) { estado.oyentes.add(f); return () => estado.oyentes.delete(f) }
