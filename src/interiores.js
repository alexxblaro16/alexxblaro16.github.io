// Interiores: salas a las que se entra desde la puerta de algunos edificios (la casa de la familia, Reblán,
// el MEDAC y la UDIT, que tiene dos: la entrada y la planta 3). Están dibujadas con código como el resto y viven
// en el mismo mundo, debajo del mapa: al entrar, la cámara y los límites del mundo pasan a la sala; al salir por
// la puerta, vuelven al pueblo. El ascensor de la UDIT lleva de una sala a otra. La ciénaga es una sala «exterior»
// (selva en vez de paredes) con la casa de ladrillo de la peña El Pilón dentro, que es otra sala.
import { lienzo, px, oscurecer, aclarar, textoCentrado } from './pixel.js'

const NEGRO = '#1b1f27'
const T = 16

// Medidas en casillas de 16 px. En los muebles, «base» es la fila donde apoyan; «pared» = colgado en la pared;
// «pisable» = se puede pisar (alfombras); «ir» = te lleva a otra sala (ascensor); «arcade» = abre una recreativa.
// «muros» son tabiques interiores [x, y, ancho, alto]; «cristales», mamparas bajas de cristal; «puerta», la x
// del centro de la puerta de abajo (null = sin puerta); «personas», gente que está dentro. «entrar» = puerta a otra
// sala; «salida» = al salir por la puerta de abajo se vuelve a otra sala y no al mapa; «colgado» = cuelga del techo
// (se dibuja por encima y no choca); «musica» = el equipo de música de la peña.
export const INTERIORES = {
  casa: {
    titulo: { es: 'CASA', en: 'HOME' }, ancho: 18, alto: 11, suelo: 'madera', pared: '#e8d9bd', ventanas: [2.2, 11.5], puerta: 15,
    muros: [[8.5, 0, 0.7, 5], [8.5, 7.2, 0.7, 3.8]], // tabique entre mi cuarto y el salón, con su puerta
    muebles: [
      // mi cuarto: la cama pegada a la pared de la izquierda y el escritorio a la misma altura a la derecha
      { clave: 'cama_madrid', x: 1.5, base: 6.4, vida: 'int_cama' },
      { clave: 'mesilla', x: 3.1, base: 3.7, vida: 'int_mesilla' },
      { clave: 'escritorio', x: 6.9, base: 4.6, vida: 'int_pc' },
      { clave: 'silla', x: 6.9, base: 5.6, pisable: true },
      { clave: 'estanteria_lego', x: 4.9, base: 9.9, vida: 'int_lego' },
      { clave: 'armario', x: 1.5, base: 10.2, ropa: true }, // el probador: te cambias de ropa
      { clave: 'poster_bloque', x: 5, base: 2.4, pared: true, vida: 'int_poster' },
      { clave: 'alfombra_cuarto', x: 4.6, base: 7.6, pisable: true },
      // el salón
      { clave: 'alfombra', x: 12.2, base: 8, pisable: true },
      { clave: 'sofa', x: 12.2, base: 5.4, vida: 'int_sofa' },
      { clave: 'mesa_baja', x: 12.2, base: 7, vida: 'int_mesa' },
      { clave: 'tele', x: 12.2, base: 9.4, vida: 'int_tele' },
      { clave: 'estanteria_lego', x: 16.4, base: 4.4, vida: 'int_lego_salon' },
      { clave: 'cuadro_familia', x: 15.2, base: 2.3, pared: true, vida: 'int_cuadro' },
      { clave: 'poster_raton', x: 10.3, base: 2.5, pared: true, vida: 'int_raton' }, // guiño a Mickey Mouse
      { clave: 'planta', x: 9.9, base: 4 },
    ],
  },
  reblan: {
    titulo: { es: 'REBLÁN', en: 'REBLÁN' }, ancho: 15, alto: 10, suelo: 'baldosa', pared: '#dfe5ec', ventanas: [], puerta: 7.5,
    muebles: [
      { clave: 'cartel_reblan', x: 5.5, base: 2.2, pared: true },
      // el mostrador, en la esquina de arriba a la derecha
      { clave: 'mostrador_esquina', x: 12.4, base: 4.6, vida: 'int_mostrador', resena: true },
      { clave: 'tele_tienda', x: 2.4, base: 3.9, vida: 'int_teles' }, { clave: 'tele_tienda', x: 5.4, base: 3.9, vida: 'int_teles' },
      // los electrodomésticos, en el centro de la tienda, con pasillos alrededor
      { clave: 'lavadora', x: 5.2, base: 6.2, vida: 'int_lavadora' }, { clave: 'lavadora', x: 6.5, base: 6.2, vida: 'int_lavadora' },
      { clave: 'lavadora', x: 7.8, base: 6.2, vida: 'int_lavadora' }, { clave: 'lavadora', x: 9.1, base: 6.2, vida: 'int_lavadora' },
      { clave: 'nevera', x: 3.4, base: 8.6, vida: 'int_nevera' }, { clave: 'nevera', x: 4.7, base: 8.6, vida: 'int_nevera' },
      { clave: 'nevera', x: 10.3, base: 8.6, vida: 'int_nevera' }, { clave: 'nevera', x: 11.6, base: 8.6, vida: 'int_nevera' },
      { clave: 'planta', x: 1.3, base: 9.2 },
    ],
  },
  medac: {
    titulo: { es: 'AULA DEL DAM', en: 'DAM CLASSROOM' }, ancho: 16, alto: 10, suelo: 'moqueta', pared: '#e6ebf2', ventanas: [1.5, 13.5], puerta: 8,
    muebles: [
      { clave: 'pizarra', x: 8, base: 2.5, pared: true, vida: 'int_pizarra' },
      ...[4, 8, 12].flatMap((x) => [{ clave: 'pupitre', x, base: 5.3, vida: 'int_pupitre' }, { clave: 'pupitre', x, base: 7.5, vida: 'int_pupitre' }]),
      { clave: 'planta', x: 1.4, base: 8.6 }, { clave: 'planta', x: 14.6, base: 8.6 },
    ],
  },
  // UDIT, planta baja: la entrada con los profes, los tornos, las máquinas y el ascensor
  udit: {
    titulo: { es: 'UDIT · ENTRADA', en: 'UDIT · ENTRANCE' }, ancho: 20, alto: 12, suelo: 'baldosa', pared: '#f2f2ef', ventanas: [1.2, 17.2], puerta: 10,
    cristales: [[0.5, 6.4, 8.34], [12.84, 6.4, 6.66]], // mamparas a los lados de los tornos
    muebles: [
      { clave: 'cartel_udit', x: 10, base: 1.6, pared: true },
      { clave: 'tablon', x: 6, base: 2.6, pared: true, zona: 'trayectoria' },
      { clave: 'ascensor', x: 15, base: 2.6, pared: true, ir: { sala: 'udit3', x: 3, y: 4.2 }, vida: 'int_ascensor_sube' },
      { clave: 'cafe', x: 1.5, base: 4.8, vida: 'int_cafe' },
      { clave: 'vending', x: 2.9, base: 4.8, vida: 'int_barritas' },
      { clave: 'sofa_udit', x: 10, base: 5.2, vida: 'int_sofa_udit' },
      { clave: 'planta', x: 18.6, base: 4.4 },
      { clave: 'tornos', x: 10.84, base: 7.2, tornos: true }, // uno de los dos pasos queda justo enfrente de la puerta
      { clave: 'planta', x: 1.3, base: 11.2 }, { clave: 'planta', x: 18.7, base: 11.2 },
    ],
    // los profes, a la entrada
    personas: [
      { nombre: 'Sandra', x: 4.6, y: 9.6, vida: 'profe_sandra', rasgos: { pelo: 'media', colorPelo: '#b8482a', piel: '#f6d3bb', chica: true, ropa: '#2f5a94', tipo: 'chaqueta', interior: '#f4f1ea', pantalon: '#2b2f38', zapatillas: '#2a2d33', sonrisa: true } },
      { nombre: 'Fernando', x: 6.8, y: 9.9, vida: 'profe_fernando', rasgos: { pelo: 'pincho', colorPelo: '#2a1d16', piel: '#e8b896', ropa: '#eef1f4', tipo: 'polo', pantalon: '#3a4a66', zapatillas: '#f4f4f4' } },
      { nombre: 'Siam', x: 14.6, y: 9.7, vida: 'profe_siam', rasgos: { pelo: 'rapado', colorPelo: '#1d1a19', piel: '#d9a07a', barba: 'completa', ropa: '#1f2430', tipo: 'sudadera', pantalon: '#3a3f48', zapatillas: '#2a2d33', sonrisa: true } },
      // compañeros, junto al sofá amarillo
      { nombre: 'Diego', x: 7.3, y: 5.7, vida: 'diego', rasgos: { pelo: 'larga', colorPelo: '#3b2a20', piel: '#f2c29b', gafas: true, barba: 'completa', robusto: true, ropa: '#c8302a', tipo: 'cuadros', pantalon: '#34466e', zapatillas: '#6b4527' } },
      { nombre: 'Arseny', x: 12.7, y: 5.7, vida: 'arseny', rasgos: { pelo: 'medio', colorPelo: '#141212', piel: '#f6d3bb', gafas: '#9aa3ad', ropa: '#2b2f38', dibujo: 'codigo', pantalon: '#3a3f48', zapatillas: '#f4f4f4' } },
    ],
  },
  // UDIT, planta 3: el pasillo con la recreativa y mis dos clases, iguales pero al revés
  udit3: {
    titulo: { es: 'UDIT · PLANTA 3', en: 'UDIT · 3RD FLOOR' }, ancho: 30, alto: 16, suelo: 'moqueta', pared: '#f2f2ef', ventanas: [9, 19], puerta: null,
    muros: [[0, 5.4, 10.6, 1.2], [12.8, 5.4, 4.4, 1.2], [19.4, 5.4, 10.6, 1.2], [14.7, 6.6, 0.6, 9.4]],
    muebles: [
      { clave: 'ascensor', x: 3, base: 2.6, pared: true, ir: { sala: 'udit', x: 15, y: 4.2 }, vida: 'int_ascensor_baja' },
      { clave: 'cartel_planta', x: 6.6, base: 2.1, pared: true },
      { clave: 'maquina_bits', x: 15, base: 5.3, arcade: 'bits' },
      { clave: 'planta', x: 27.6, base: 4.6 }, { clave: 'planta', x: 23.6, base: 4.6 },
      // clase A (izquierda)
      { clave: 'pizarra_blanca', x: 6, base: 6.6, pared: true, vida: 'int_pizarra_udit' },
      { clave: 'mesa_profe', x: 2.2, base: 8.4, vida: 'int_mesa_profe' },
      ...[4.6, 7, 9.4, 11.8].flatMap((x) => [9.8, 12, 14.2].map((base) => ({ clave: 'pupitre', x, base, vida: 'int_aula' }))),
      // clase B (derecha): la misma, en espejo
      { clave: 'pizarra_pull', x: 24, base: 6.6, pared: true, vida: 'int_pizarra_pull' },
      { clave: 'mesa_profe', x: 27.8, base: 8.4, vida: 'int_mesa_profe' },
      ...[25.4, 23, 20.6, 18.2].flatMap((x) => [9.8, 12, 14.2].map((base) => ({ clave: 'pupitre', x, base, vida: 'int_aula' }))),
    ],
    // compañeras de clase, delante de la pizarra de la clase B
    personas: [
      { nombre: 'Emma', x: 16.3, y: 11.4, vida: 'emma', rasgos: { pelo: 'largo', colorPelo: '#141212', piel: '#5e3a26', chica: true, ropa: '#eef1f4', tipo: 'camisa', pantalon: '#34466e', pitillo: true, zapatillas: '#f4f4f4', sonrisa: true } },
      { nombre: 'Claudia', x: 20.8, y: 8.1, vida: 'claudia', rasgos: { pelo: 'larga', colorPelo: '#141212', piel: '#f2c29b', chica: true, ropa: '#6a6f78', tipo: 'sudadera', pantalon: '#2b2f38', anchos: true, zapatillas: '#f4f4f4' } },
      { nombre: 'Alba', x: 22.9, y: 8.1, vida: 'alba', rasgos: { pelo: 'melena', colorPelo: '#ece6d6', piel: '#f6d3bb', ojos: '#3d7be0', chica: true, ropa: '#a970ff', pantalon: '#8fa9cc', zapatillas: '#f4f4f4' } },
      { nombre: 'Lucía', x: 25, y: 8.1, vida: 'lucia_m', rasgos: { pelo: 'largo', colorPelo: '#2e2622', piel: '#f6d3bb', ojos: '#3d7be0', chica: true, sonrisa: true, ropa: '#f2b33d', tipo: 'chaqueta', interior: '#eef1f4', pantalon: '#34466e', zapatillas: '#f4f4f4' } },
    ],
  },
  // La ciénaga: por dentro es selva, con charcas, juncos y la casa de ladrillo de la peña al fondo del camino de tierra
  cienaga: {
    titulo: { es: 'LA CIÉNAGA', en: 'THE SWAMP' }, ancho: 24, alto: 15, suelo: 'selva', exterior: true, ventanas: [], puerta: 12,
    muebles: [
      { clave: 'senda_tierra', x: 12, base: 15, pisable: true },
      { clave: 'casa_ladrillo', x: 12, base: 7.4, entrar: { sala: 'pena', x: 9, y: 9.6 }, vida: 'pena_puerta' },
      { clave: 'arbol_cienaga', x: 3.2, base: 6.4 }, { clave: 'arbol_cienaga', x: 20.8, base: 6.2 }, { clave: 'arbol_cienaga', x: 22, base: 13.6 },
      { clave: 'charca', x: 4.8, base: 12 }, { clave: 'charca', x: 18.4, base: 10.6 },
      { clave: 'tronco', x: 6.8, base: 8.4, vida: 'cienaga_tronco' },
      { clave: 'juncos', x: 1.6, base: 10 }, { clave: 'juncos', x: 8.4, base: 12.6 }, { clave: 'juncos', x: 15.6, base: 12.2 }, { clave: 'juncos', x: 21.4, base: 9.6 },
      { clave: 'setas', x: 16.4, base: 8.2, pisable: true }, { clave: 'setas', x: 2.6, base: 14, pisable: true },
      { clave: 'cartel_fuera', x: 9.4, base: 14, vida: 'cienaga_cartel' },
    ],
  },
  // La peña El Pilón por dentro: la barra, los frigos y el arcón del hielo al fondo; los sofás, la mesa y la bola de
  // discoteca en el centro, y el equipo de música en la esquina
  pena: {
    titulo: { es: 'LA PEÑA', en: 'THE CLUB' }, ancho: 18, alto: 11, suelo: 'cemento', pared: '#b8735a', ladrillo: true, ventanas: [2.4], puerta: 9,
    salida: { sala: 'cienaga', x: 12, y: 8.7 },
    muebles: [
      { clave: 'pancarta_pilon', x: 9.6, base: 2.3, pared: true, vida: 'pena_pancarta' },
      { clave: 'barra', x: 6, base: 4.9, vida: 'pena_barra' },
      { clave: 'frigo', x: 11.2, base: 4.6, vida: 'pena_frigo' }, { clave: 'frigo', x: 12.6, base: 4.6, vida: 'pena_frigo' },
      { clave: 'arcon', x: 15, base: 4.7, vida: 'pena_arcon' },
      { clave: 'mesa_baja', x: 9, base: 6.9 },
      { clave: 'sofa_pena', x: 6.6, base: 8.8, vida: 'pena_sofa' }, { clave: 'sofa_pena', x: 11.4, base: 8.8, vida: 'pena_sofa' },
      { clave: 'bola_disco', x: 9, base: 5.4, colgado: true },
      { clave: 'altavoz', x: 14.6, base: 10.3 },
      { clave: 'equipo', x: 16.4, base: 10.3, musica: true },
      { clave: 'altavoz', x: 1.4, base: 10.3 },
    ],
    personas: [
      { nombre: 'Iker', x: 3.2, y: 7.4, vida: 'iker', rasgos: { pelo: 'rapado', colorPelo: '#141212', piel: '#f2c29b', ojos: '#1d1820', ropa: '#15171c', tipo: 'pena', letras: '#f2c200', pantalon: '#34466e', zapatillas: '#f4f4f4' } },
    ],
  },
  // Los recreativos por dentro: moqueta de feria, neones, las cuatro máquinas al fondo, la de peluches, el air
  // hockey en el centro y el mostrador de premios
  arcade: {
    titulo: { es: 'RECREATIVOS', en: 'ARCADE' }, ancho: 18, alto: 11, suelo: 'arcade', pared: '#2a2045', neon: true, ventanas: [], puerta: 9,
    muebles: [
      { clave: 'cartel_neon_arcade', x: 9, base: 2.4, pared: true },
      { clave: 'maquina_serpiente', x: 2.2, base: 5, arcade: 'serpiente' }, { clave: 'maquina_nave', x: 4.2, base: 5, arcade: 'nave' },
      { clave: 'maquina_ladrillos', x: 13.8, base: 5, arcade: 'ladrillos' }, { clave: 'maquina_laberinto', x: 15.8, base: 5, arcade: 'laberinto' },
      { clave: 'grua', x: 6.8, base: 5.1, vida: 'arcade_grua' },
      { clave: 'cambio', x: 11.2, base: 4.9, vida: 'arcade_cambio' },
      { clave: 'air_hockey', x: 9, base: 7.6, vida: 'arcade_hockey' },
      { clave: 'premios', x: 15, base: 9.7, vida: 'arcade_premios' },
      { clave: 'puf', x: 2.4, base: 9.4, pisable: true }, { clave: 'puf', x: 4, base: 9.8, pisable: true },
    ],
  },
  // El Bar El Arte por dentro: la barra, la tele grande con el partido del Madrid, las bufandas y las mesas
  arte: {
    titulo: { es: 'BAR EL ARTE', en: 'BAR EL ARTE' }, ancho: 16, alto: 10, suelo: 'madera', pared: '#c9c4bb', ventanas: [2.2], puerta: 8,
    muebles: [
      { clave: 'tele_futbol', x: 11, base: 2.5, pared: true, vida: 'arte_tele' },
      { clave: 'bufandas', x: 6.4, base: 2.2, pared: true, vida: 'arte_bufandas' },
      { clave: 'barra', x: 4.6, base: 5, vida: 'arte_barra' },
      { clave: 'tragaperras', x: 14.7, base: 4.7, vida: 'arte_tragaperras' },
      { clave: 'mesa_redonda', x: 9.6, base: 7.2, vida: 'arte_mesa' }, { clave: 'mesa_redonda', x: 12.8, base: 7.2, vida: 'arte_mesa' },
      { clave: 'mesa_redonda', x: 4.2, base: 8.6, vida: 'arte_mesa' },
      { clave: 'planta', x: 15, base: 9.2 },
    ],
  },
}

// ---------------------------------------------------------------------------------------------- la sala
function sala(o) {
  if (o.exterior) return selva(o)
  const W = o.ancho * T, H = o.alto * T
  const [c, ctx] = lienzo(W, H)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  // suelo
  for (let y = 0; y < H; y += T) for (let x = 0; x < W; x += T) {
    if (o.suelo === 'madera') {
      p(x, y, T, T, '#b8834e')
      for (let k = 0; k < 4; k++) { p(x, y + k * 4, T, 1, '#9c6c3c'); p(x + ((k * 7 + y) % 16), y + k * 4, 1, 4, '#9c6c3c') }
      p(x + 3, y + 2, 4, 1, '#c99460'); p(x + 10, y + 10, 3, 1, '#c99460')
    } else if (o.suelo === 'arcade') {
      // moqueta de recreativos: oscura con garabatos de neón
      p(x, y, T, T, '#1b1636')
      const k = (x * 7 + y * 13) % 5
      if (k === 0) { p(x + 3, y + 4, 4, 1, '#ff3d7f'); p(x + 6, y + 5, 1, 2, '#ff3d7f') }
      if (k === 1) { p(x + 9, y + 9, 3, 3, '#3dd9ff'); p(x + 10, y + 10, 1, 1, '#1b1636') }
      if (k === 2) { p(x + 2, y + 11, 1, 1, '#f2c200'); p(x + 3, y + 10, 1, 1, '#f2c200'); p(x + 4, y + 11, 1, 1, '#f2c200'); p(x + 5, y + 10, 1, 1, '#f2c200') }
      if (k === 3) { p(x + 11, y + 2, 2, 2, '#a970ff') }
    } else if (o.suelo === 'cemento') {
      p(x, y, T, T, '#8f8a84'); p(x, y, T, 1, '#7c7771'); p(x, y, 1, T, '#7c7771')
      if ((x * 7 + y * 3) % 5 === 0) p(x + 5, y + 7, 3, 1, '#a39e98'); if ((x + y * 5) % 7 === 0) p(x + 10, y + 3, 1, 1, '#76716b')
    } else if (o.suelo === 'baldosa') {
      p(x, y, T, T, (x / T + y / T) % 2 ? '#e9ecef' : '#dde2e7'); p(x, y, T, 1, '#c3c9d0'); p(x, y, 1, T, '#c3c9d0'); p(x + 1, y + 1, 5, 1, '#f6f8fa')
    } else {
      p(x, y, T, T, '#56688a'); if ((x + y) % 32 === 0) p(x + 6, y + 6, 2, 2, '#62759a'); if ((x * 3 + y) % 48 === 0) p(x + 11, y + 3, 1, 1, '#4c5d7c')
    }
  }
  // luz que entra por las ventanas y cae en el suelo
  for (const vx of o.ventanas) {
    const x = Math.round(vx * T)
    for (let k = 0; k < 40; k++) p(x - 2 + Math.round(k * 0.35), 42 + k, 28 + Math.round(k * 0.3), 1, `rgba(255,250,225,${0.16 * (1 - k / 40)})`)
  }
  // pared del fondo: moldura arriba, zócalo de madera abajo y una línea de friso
  const fondo = Math.round(2.6 * T)
  p(0, 0, W, fondo, o.pared)
  for (let x = 8; x < W; x += 16) p(x, 8, 1, fondo - 26, oscurecer(o.pared, 0.95))
  p(0, 6, W, 2, aclarar(o.pared, 0.4)); p(0, 8, W, 1, oscurecer(o.pared, 0.85))
  // tiras de neón rosa y azul a lo largo de la pared (los recreativos)
  if (o.neon) { p(0, 12, W, 2, '#ff3d7f'); p(0, 11, W, 1, 'rgba(255,61,127,0.4)'); p(0, fondo - 18, W, 2, '#3dd9ff'); p(0, fondo - 16, W, 1, 'rgba(61,217,255,0.4)') }
  // pared de ladrillo visto (la peña)
  if (o.ladrillo) for (let y = 10; y < fondo - 16; y += 5) { p(0, y, W, 1, oscurecer(o.pared, 0.78)); for (let x = (y / 5) % 2 ? 4 : 10; x < W; x += 12) p(x, y + 1, 1, 4, oscurecer(o.pared, 0.78)) }
  p(0, fondo - 16, W, 10, oscurecer(o.pared, 0.9)); p(0, fondo - 16, W, 1, aclarar(o.pared, 0.3))
  p(0, fondo - 6, W, 6, oscurecer(o.pared, 0.68)); p(0, fondo - 6, W, 1, aclarar(o.pared, 0.25)); p(0, fondo, W, 3, 'rgba(0,0,0,0.22)')
  for (const vx of o.ventanas) {
    const x = Math.round(vx * T)
    p(x - 1, 9, 26, 20, NEGRO); p(x, 10, 24, 18, '#f4f1ea'); p(x + 2, 12, 20, 14, '#9fd3ff'); p(x + 2, 12, 20, 5, '#cfe8f7'); p(x + 11, 12, 2, 14, '#f4f1ea')
    p(x - 3, 28, 30, 2, '#cfc8b8')
  }
  // mamparas de cristal (las de los tornos)
  for (const [cx, cy, cw] of o.cristales || []) {
    const x = Math.round(cx * T), y = Math.round(cy * T), w = Math.round(cw * T)
    p(x, y, w, 14, 'rgba(160,210,240,0.35)'); p(x, y, w, 2, '#9aa3ad'); p(x, y + 12, w, 2, '#6a717c')
    for (let k = x; k < x + w; k += 24) p(k, y, 2, 14, '#8a919a')
    p(x + 4, y + 3, 6, 1, 'rgba(255,255,255,0.6)')
  }
  // sombra suave junto a las paredes
  const sombra = ctx.createLinearGradient(0, fondo, 0, fondo + 14); sombra.addColorStop(0, 'rgba(0,0,0,0.18)'); sombra.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = sombra; ctx.fillRect(0, fondo, W, 14)
  // tabiques interiores: si son más anchos que altos se ve su cara; si no, solo el canto desde arriba
  const muro = '#3a3f48', canto = '#5b6370'
  for (const [mx, my, mw, mh] of o.muros || []) {
    const x = Math.round(mx * T), y = Math.round(my * T), w = Math.round(mw * T), h = Math.round(mh * T)
    if (mw > mh) {
      p(x, y, w, 5, muro); p(x, y + 4, w, 1, canto)
      p(x, y + 5, w, h - 5, o.pared); p(x, y + h - 5, w, 5, oscurecer(o.pared, 0.68)); p(x, y + h - 5, w, 1, aclarar(o.pared, 0.25))
      p(x, y + h, w, 3, 'rgba(0,0,0,0.2)')
    } else {
      p(x, y, w, h, muro); p(x + 1, y, 1, h, canto); p(x + w, y, 2, h, 'rgba(0,0,0,0.18)')
    }
  }
  // muros vistos desde arriba: arriba, a los lados y abajo, con el hueco de la puerta
  p(0, 0, W, 5, muro); p(0, 4, W, 1, canto)
  p(0, 0, 8, H, muro); p(7, 5, 1, H - 5, canto)
  p(W - 8, 0, 8, H, muro); p(W - 8, 5, 1, H - 5, canto)
  if (o.puerta == null) { p(0, H - 8, W, 8, muro); p(0, H - 8, W, 1, canto) } else {
    const puerta = Math.round(o.puerta * T) - T
    p(0, H - 8, puerta, 8, muro); p(puerta + 2 * T, H - 8, W - puerta - 2 * T, 8, muro); p(0, H - 8, W, 1, canto)
    p(puerta + 4, H - 10, 2 * T - 8, 8, '#8a3a2a'); p(puerta + 6, H - 8, 2 * T - 12, 4, '#a84a30') // felpudo
  }
  // viñeta: las esquinas un poco más oscuras para dar profundidad
  const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75)
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(10,12,20,0.28)')
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H)
  return c
}

// La ciénaga por dentro: suelo de hierba húmeda y barro, la espesura de árboles alrededor (arriba y a los lados) y
// el hueco de abajo por donde se sale al pueblo
function selva(o) {
  const W = o.ancho * T, H = o.alto * T
  const [c, ctx] = lienzo(W, H)
  const p = (x, y, w, h, col) => px(ctx, x, y, col, w, h)
  let s = 17
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  p(0, 0, W, H, '#3f4d26')
  for (let i = 0; i < W * H / 40; i++) p(Math.floor(r() * W), Math.floor(r() * H), 2 + Math.floor(r() * 3), 1, ['#4a5a2c', '#36421f', '#55652f', '#4b3f24', '#5e7034'][i % 5])
  for (let i = 0; i < 40; i++) { const x = Math.floor(r() * W), y = 50 + Math.floor(r() * (H - 60)); p(x, y, 1, 3, '#5a7a2a'); p(x + 2, y + 1, 1, 2, '#6b8a35') }
  // la espesura de arriba: copas oscuras pegadas unas a otras, con musgo colgando
  const copa = (cx, cy, rc) => {
    for (let k = -rc; k <= rc; k++) {
      const w = Math.round(Math.sqrt(rc * rc - k * k) * 1.25)
      p(cx - w - 1, cy + k, 2 * w + 2, 1, '#18240f'); p(cx - w, cy + k, 2 * w, 1, k < -rc / 3 ? '#3b5426' : '#2a3d1c')
    }
    for (let k = -rc + 2; k < rc - 2; k += 4) p(cx + k, cy + rc - 1, 1, 3 + ((k + rc) % 4), '#6b7a3a')
  }
  for (let x = 0; x < W + 20; x += 22) copa(x, 14 + (x % 3) * 4, 16)
  // a los lados, troncos y matorrales
  for (let y = 30; y < H; y += 18) { copa(4, y, 9); copa(W - 4, y + 9, 9) }
  // abajo, matorral con el hueco del camino de salida
  const puerta = Math.round(o.puerta * T)
  for (let x = 0; x < W; x += 12) if (Math.abs(x + 6 - puerta) > 22) copa(x + 6, H - 3, 7)
  // niebla y luciérnagas pintadas
  for (const [x, y, w] of [[30, 120, 90], [200, 90, 110], [120, 170, 80]]) { p(x, y, w, 3, 'rgba(220,235,210,0.12)'); p(x + 8, y + 3, w - 16, 2, 'rgba(220,235,210,0.08)') }
  const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.7)
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(5,12,5,0.4)')
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H)
  return c
}

// Sofá de dos plazas del color que se pida
function sofaColor(base, luz, sombra, cojines) {
  const [c, x] = lienzo(52, 26); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
  p(0, 4, 52, 20, NEGRO); p(1, 5, 50, 8, luz); p(1, 5, 50, 2, aclarar(luz, 0.25)); p(1, 13, 50, 10, base); p(0, 10, 6, 14, sombra); p(46, 10, 6, 14, sombra)
  p(8, 13, 17, 8, luz); p(27, 13, 17, 8, luz); p(10, 14, 6, 3, cojines[0]); p(30, 14, 6, 3, cojines[1]); p(1, 24, 50, 2, 'rgba(0,0,0,.2)'); return c
}

// ---------------------------------------------------------------------------------------------- muebles
const M = {
  alfombra: () => { const [c, x] = lienzo(80, 44); px(x, 0, 0, '#7a2f3a', 80, 44); px(x, 3, 3, '#b8495a', 74, 38); px(x, 8, 8, '#e0c58a', 64, 28); px(x, 12, 12, '#b8495a', 56, 20); return c },
  alfombra_cuarto: () => { const [c, x] = lienzo(48, 30); px(x, 0, 0, '#2f5a94', 48, 30); px(x, 3, 3, '#3d6fb0', 42, 24); for (let k = 6; k < 42; k += 8) px(x, k, 6, '#f4f1ea', 3, 18); return c },
  sofa: () => {
    const [c, x] = lienzo(52, 26); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 4, 52, 20, NEGRO); p(1, 5, 50, 8, '#3d6fb0'); p(1, 5, 50, 2, '#5a8ed0'); p(1, 13, 50, 10, '#2f5a94'); p(0, 10, 6, 14, '#24487a'); p(46, 10, 6, 14, '#24487a')
    p(8, 13, 17, 8, '#3d6fb0'); p(27, 13, 17, 8, '#3d6fb0'); p(10, 14, 6, 3, '#f2c200'); p(30, 14, 6, 3, '#e05a5a'); p(1, 24, 50, 2, 'rgba(0,0,0,.2)'); return c
  },
  sofa_udit: () => {
    const [c, x] = lienzo(40, 22); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 2, 40, 18, NEGRO); p(1, 3, 38, 7, '#f2c200'); p(1, 10, 38, 9, '#c99a00'); p(0, 8, 4, 12, '#a88000'); p(36, 8, 4, 12, '#a88000'); p(1, 20, 38, 2, 'rgba(0,0,0,.2)'); return c
  },
  mesa_baja: () => {
    const [c, x] = lienzo(30, 14); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 30, 10, NEGRO); p(1, 1, 28, 7, '#8a6040'); p(1, 1, 28, 1, '#b07a44'); p(2, 10, 2, 4, NEGRO); p(26, 10, 2, 4, NEGRO)
    p(5, 2, 6, 3, '#2b2f38'); p(18, 3, 4, 3, '#f4f1ea'); p(19, 2, 2, 1, '#e05a5a'); return c // el mando de la tele y una taza
  },
  tele: () => {
    const [c, x] = lienzo(40, 24); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(2, 12, 36, 12, '#6b4a2b'); p(2, 12, 36, 2, '#8a6040'); p(6, 16, 10, 6, '#5a3c22'); p(24, 16, 10, 6, '#5a3c22')
    p(6, 0, 28, 13, NEGRO); p(7, 1, 26, 10, '#3c984b'); for (let k = 7; k < 33; k += 6) p(k, 1, 3, 10, '#45a654'); p(19, 5, 2, 2, '#ffffff'); p(18, 12, 4, 1, NEGRO); return c
  },
  cuadro_familia: () => {
    const [c, x] = lienzo(26, 18); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 26, 18, '#6b4a2b'); p(2, 2, 22, 14, '#cfe8f7'); p(2, 11, 22, 5, '#7ad37a')
    for (const [cx, pel, rop] of [[6, '#5e3c24', '#f4b6c8'], [11, '#9a8a80', '#1f2430'], [16, '#241812', '#f2f3f5'], [20, '#8a5a38', '#4a3f3a']]) { p(cx, 6, 3, 2, pel); p(cx, 8, 3, 2, '#ebbd99'); p(cx, 10, 3, 4, rop) }
    return c
  },
  planta: () => {
    const [c, x] = lienzo(16, 24); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(3, 15, 10, 9, NEGRO); p(4, 16, 8, 7, '#c26a3a'); p(4, 16, 8, 2, '#d98a5a')
    p(2, 4, 12, 12, '#1b2a1e'); p(3, 3, 10, 12, '#3c9a47'); p(5, 1, 6, 4, '#3c9a47'); p(4, 5, 3, 3, '#5cbf5f'); p(9, 8, 3, 3, '#2a7535'); return c
  },
  // mi cama, con las sábanas del Real Madrid: blancas con el ribete morado y un escudo redondo dorado
  cama_madrid: () => {
    const [c, x] = lienzo(30, 46); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 30, 46, NEGRO); p(1, 1, 28, 6, '#6b4a2b'); p(1, 1, 28, 1, '#8a6040'); p(2, 7, 26, 37, '#f4f1ea'); p(4, 9, 22, 8, '#ffffff'); p(4, 15, 22, 2, '#d9dee4')
    p(2, 20, 26, 24, '#ffffff'); p(2, 20, 26, 2, '#e6e9ef'); p(2, 24, 26, 2, '#5b2a8a'); p(2, 26, 26, 1, '#f2c200')
    p(12, 31, 6, 6, '#f2c200'); p(13, 32, 4, 4, '#ffffff'); p(14, 30, 2, 1, '#f2c200'); p(14, 33, 2, 2, '#1f3c9a')
    p(2, 41, 26, 1, '#d9dee4'); return c
  },
  mesilla: () => {
    const [c, x] = lienzo(16, 16); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 4, 16, 12, NEGRO); p(1, 5, 14, 10, '#8a6040'); p(1, 5, 14, 1, '#b07a44'); p(2, 10, 12, 1, '#5a3c22'); p(7, 12, 2, 1, '#f2c200')
    p(5, 0, 6, 5, '#f6e7b4'); p(7, 0, 2, 1, '#ffffff'); return c // una lamparita
  },
  armario: () => {
    const [c, x] = lienzo(30, 40); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 30, 40, NEGRO); p(1, 1, 28, 38, '#c99a6a'); p(1, 1, 28, 2, '#ddb489'); p(15, 2, 1, 36, '#8a6040')
    p(12, 18, 2, 4, '#5a3c22'); p(17, 18, 2, 4, '#5a3c22'); p(1, 37, 28, 2, '#8a6040'); return c
  },
  escritorio: () => {
    const [c, x] = lienzo(44, 30); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 12, 44, 8, NEGRO); p(1, 13, 42, 5, '#8a6040'); p(1, 13, 42, 1, '#b07a44'); p(2, 20, 3, 10, NEGRO); p(39, 20, 3, 10, NEGRO)
    p(10, 0, 24, 14, NEGRO); p(11, 1, 22, 10, '#0d1117'); p(12, 3, 8, 1, '#2fbf71'); p(14, 5, 10, 1, '#7ee2a8'); p(12, 7, 6, 1, '#3dd9ff'); p(20, 11, 4, 2, '#5b6068')
    p(14, 15, 14, 2, '#2b2f38'); p(32, 15, 4, 3, '#2b2f38'); p(36, 6, 6, 8, '#2b2f38'); p(37, 7, 4, 2, '#3dd9ff'); return c
  },
  silla: () => { const [c, x] = lienzo(14, 12); px(x, 0, 0, NEGRO, 14, 12); px(x, 1, 1, '#2b2f38', 12, 10); px(x, 2, 2, '#3a3f48', 10, 3); return c },
  // estantería llena de LEGO: cajas, piezas de colores, una nave montada y un robot
  estanteria_lego: () => {
    const [c, x] = lienzo(36, 38); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 36, 38, NEGRO); p(1, 1, 34, 36, '#7a5232')
    const col = ['#e05a5a', '#f2c200', '#3d7be0', '#2fbf71', '#f28c28', '#eef1f4', '#a970ff']
    for (const [y, k0] of [[2, 0], [14, 2], [26, 4]]) {
      p(1, y + 10, 34, 2, '#5a3c22')
      for (let k = 0; k < 4; k++) {
        const cx = 3 + k * 8, cc = col[(k + k0) % 7]
        p(cx, y + 3, 6, 7, cc); p(cx, y + 2, 2, 1, cc); p(cx + 4, y + 2, 2, 1, cc); p(cx, y + 3, 6, 1, aclarar(cc, 0.35))
      }
    }
    p(4, 27, 10, 3, '#9aa3ad'); p(7, 25, 4, 2, '#3dd9ff') // una nave montada
    p(22, 26, 8, 8, '#e9ecef'); p(23, 27, 6, 3, '#7ad37a'); p(24, 31, 1, 3, NEGRO); p(27, 31, 1, 3, NEGRO) // y un robot
    return c
  },
  poster_bloque: () => {
    const [c, x] = lienzo(20, 24); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 20, 24, '#f4f1ea'); p(2, 2, 16, 16, '#8a5a32'); p(2, 2, 16, 5, '#5cb356'); p(4, 7, 3, 3, '#5cb356'); p(12, 9, 3, 3, '#6e4626'); textoCentrado(x, 'MINE', 10, 19, '#1b1f27'); return c
  },
  cartel_reblan: () => { const [c, x] = lienzo(64, 12); px(x, 0, 0, NEGRO, 64, 12); px(x, 1, 1, '#8a1f2a', 62, 10); textoCentrado(x, 'REBLAN', 32, 3, '#ffffff'); return c },
  // mostrador en L para la esquina, con la caja registradora y una caja de herramientas
  mostrador_esquina: () => {
    const [c, x] = lienzo(56, 34); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 14, 56, 20, NEGRO); p(1, 15, 54, 5, '#e9ecef'); p(1, 20, 54, 13, '#8a1f2a'); p(1, 20, 54, 1, '#b8336a')
    p(0, 0, 14, 34, NEGRO); p(1, 1, 12, 14, '#e9ecef'); p(1, 1, 12, 1, '#ffffff')
    p(20, 9, 12, 7, '#2b2f38'); p(21, 10, 10, 3, '#7ad37a'); p(40, 10, 12, 5, '#f2c200'); p(42, 11, 8, 1, '#c99a00'); p(3, 4, 8, 5, '#5b6068')
    return c
  },
  lavadora: () => {
    const [c, x] = lienzo(20, 24); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 20, 24, NEGRO); p(1, 1, 18, 22, '#f4f6f8'); p(1, 1, 18, 4, '#d9dee4'); p(13, 2, 4, 2, '#3dd9ff')
    p(4, 8, 12, 12, '#5b6068'); p(5, 9, 10, 10, '#9fd3ff'); p(6, 10, 4, 3, '#cfe8f7'); p(13, 18, 4, 3, '#f2c200'); return c // con su etiqueta de precio
  },
  nevera: () => {
    const [c, x] = lienzo(20, 36); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 20, 36, NEGRO); p(1, 1, 18, 34, '#e9ecef'); p(1, 13, 18, 1, NEGRO); p(15, 4, 2, 6, '#9aa3ad'); p(15, 17, 2, 10, '#9aa3ad'); p(1, 1, 3, 34, '#ffffff'); p(3, 28, 5, 3, '#f2c200'); return c
  },
  tele_tienda: () => {
    const [c, x] = lienzo(36, 26); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 14, 36, 12, '#5b6068'); p(0, 14, 36, 2, '#8a919a')
    p(2, 0, 32, 16, NEGRO); p(3, 1, 30, 13, '#3c9a4b'); for (let k = 3; k < 33; k += 6) p(k, 1, 3, 13, '#45a654'); p(17, 6, 3, 3, '#ffffff')
    return c
  },
  pizarra: () => {
    const [c, x] = lienzo(72, 30); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 72, 28, '#8a6040'); p(2, 2, 68, 24, '#2f4a3a')
    textoCentrado(x, 'SYSTEM.OUT', 36, 6, '#e8f0e8'); textoCentrado(x, 'HELLO WORLD', 36, 14, '#f6e05e'); p(2, 26, 68, 2, '#6b4a2b'); p(50, 25, 6, 2, '#ffffff'); return c
  },
  // las pizarras de mis dos clases: en una, git push; en la otra, git pull
  pizarra_blanca: () => pizarraBlanca('GIT PUSH', '#2f5fb0'),
  pizarra_pull: () => pizarraBlanca('GIT PULL', '#c8302a'),
  // póster en blanco y negro de un ratón silbando al timón de un barco de vapor (1928): guiño a Mickey Mouse
  poster_raton: () => {
    const [c, x] = lienzo(22, 28); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 22, 28, NEGRO); p(1, 1, 20, 26, '#e8e4da'); p(2, 2, 18, 18, '#cfcabd')
    // timón
    p(10, 10, 9, 9, '#5a5650'); p(11, 11, 7, 7, '#cfcabd'); p(14, 8, 1, 13, '#5a5650'); p(8, 14, 13, 1, '#5a5650'); p(13, 13, 3, 3, '#3a3733')
    // el ratón: cabeza redonda, dos orejas redondas y la cara clara
    p(3, 3, 4, 4, '#15171c'); p(11, 3, 4, 4, '#15171c'); p(5, 6, 8, 7, '#15171c'); p(6, 9, 6, 4, '#f4f1ea'); p(7, 9, 1, 2, '#15171c'); p(10, 9, 1, 2, '#15171c'); p(8, 12, 2, 1, '#15171c')
    p(6, 13, 6, 5, '#15171c'); p(4, 14, 2, 2, '#f4f1ea'); p(12, 13, 2, 2, '#f4f1ea') // cuerpo y guantes
    p(14, 4, 1, 1, '#5a5650'); p(15, 3, 1, 1, '#5a5650'); p(16, 4, 1, 1, '#5a5650') // las notas del silbido
    textoCentrado(x, '1928', 11, 21, '#15171c')
    return c
  },
  pupitre: () => {
    const [c, x] = lienzo(30, 26); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 8, 30, 7, NEGRO); p(1, 9, 28, 4, '#d9dee4'); p(2, 15, 2, 8, NEGRO); p(26, 15, 2, 8, NEGRO)
    p(8, 0, 14, 10, NEGRO); p(9, 1, 12, 7, '#0d1117'); p(10, 3, 6, 1, '#2fbf71'); p(10, 5, 8, 1, '#3dd9ff')
    p(10, 18, 10, 6, '#2f5fb0'); p(10, 18, 10, 2, '#3d7be0'); return c
  },
  mesa_profe: () => {
    const [c, x] = lienzo(40, 22); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 6, 40, 10, NEGRO); p(1, 7, 38, 7, '#8a6040'); p(1, 7, 38, 1, '#b07a44'); p(2, 16, 3, 6, NEGRO); p(35, 16, 3, 6, NEGRO)
    p(6, 0, 16, 9, NEGRO); p(7, 1, 14, 6, '#cfe8f7'); p(26, 3, 8, 5, '#f4f1ea'); p(27, 4, 6, 1, '#9aa3ad'); return c
  },
  cartel_udit: () => { const [c, x] = lienzo(48, 12); px(x, 0, 0, NEGRO, 48, 12); px(x, 1, 1, '#15171c', 46, 10); textoCentrado(x, 'UDIT', 24, 3, '#f2c200'); return c },
  cartel_planta: () => { const [c, x] = lienzo(44, 12); px(x, 0, 0, NEGRO, 44, 12); px(x, 1, 1, '#2f5fb0', 42, 10); textoCentrado(x, 'PLANTA 3', 22, 3, '#ffffff'); return c },
  tablon: () => {
    const [c, x] = lienzo(56, 26); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 56, 26, '#6b4a2b'); p(2, 2, 52, 22, '#c99a6a')
    for (const [a, b, w, h, col] of [[5, 4, 12, 9, '#ffffff'], [20, 5, 10, 12, '#f6e05e'], [33, 4, 16, 8, '#cfe8f7'], [8, 15, 14, 7, '#ffd1e8'], [34, 14, 12, 8, '#ffffff']]) { p(a, b, w, h, col); p(a + 2, b + 2, w - 4, 1, '#9aa3ad'); p(a + w / 2, b, 1, 1, '#e05a5a') }
    return c
  },
  // ascensor con sus puertas de acero, la flecha y el número de la planta
  ascensor: () => {
    const [c, x] = lienzo(34, 38); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 4, 34, 34, NEGRO); p(1, 5, 32, 33, '#6a717c'); p(3, 8, 28, 30, '#aab1b9'); p(3, 8, 14, 30, '#c3cbd3'); p(16, 8, 2, 30, '#5b6068')
    p(5, 10, 2, 26, '#e0e5ea'); p(19, 10, 2, 26, '#d0d6dc')
    p(10, 0, 14, 5, NEGRO); p(11, 1, 12, 3, '#15171c'); p(13, 1, 3, 2, '#2fbf71'); p(18, 1, 3, 2, '#f2c200')
    return c
  },
  cafe: () => {
    const [c, x] = lienzo(18, 34); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 18, 34, NEGRO); p(1, 1, 16, 32, '#2b2f38'); p(3, 3, 12, 8, '#3dd9ff'); p(4, 4, 6, 1, '#cfe8f7')
    p(5, 18, 8, 8, '#15171c'); p(7, 22, 4, 4, '#ffffff'); p(12, 13, 3, 2, '#f2c200'); return c
  },
  // máquina de snacks con cristal y filas de barritas
  vending: () => {
    const [c, x] = lienzo(20, 36); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 20, 36, NEGRO); p(1, 1, 18, 34, '#c8202a'); p(3, 3, 11, 24, '#1b2440'); p(15, 5, 2, 6, '#2b2f38'); p(15, 13, 2, 2, '#f2c200')
    for (let y = 5; y < 26; y += 5) for (let k = 4; k < 13; k += 3) p(k, y, 2, 3, ['#f2b33d', '#e9d6a8', '#7ad37a', '#a970ff'][((y + k) / 3 | 0) % 4])
    p(3, 29, 11, 4, '#15171c'); return c
  },
  // tornos de la entrada: tres postes y dos brazos que se abren al pasar
  tornos: () => tornos(false),
  tornos_abierto: () => tornos(true),
  // ---- la ciénaga
  senda_tierra: () => {
    const [c, x] = lienzo(34, 124); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    for (let y = 0; y < 124; y++) {
      const d = Math.round(Math.sin(y / 11) * 2), w = 26 + (y > 100 ? 4 : 0)
      p(17 - w / 2 + d, y, w, 1, '#7a5c3a'); p(17 - w / 2 + d, y, 1, 1, '#5e4429'); p(16 + w / 2 + d, y, 1, 1, '#5e4429')
      if (y % 6 === 0) p(10 + (y % 13), y, 2, 1, '#8f6e48'); if (y % 9 === 4) p(20 - (y % 7), y, 1, 1, '#5e4429')
    }
    return c
  },
  // casa de ladrillo con tejado de chapa, la puerta en el centro, una ventana a cada lado y el cartel de la peña
  casa_ladrillo: () => {
    const [c, x] = lienzo(112, 82); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(4, 16, 104, 64, NEGRO); p(5, 17, 102, 62, '#b8634a')
    for (let y = 19; y < 78; y += 4) { p(5, y, 102, 1, '#8f4a36'); for (let k = (y / 4) % 2 ? 6 : 12; k < 106; k += 12) p(k, y + 1, 1, 3, '#8f4a36') }
    p(5, 17, 3, 62, '#c97a5e'); p(104, 17, 3, 62, '#9a5240')
    // tejado de chapa ondulada
    p(0, 4, 112, 14, NEGRO); p(1, 5, 110, 11, '#7c8590'); for (let k = 2; k < 110; k += 4) p(k, 5, 1, 11, '#5f6873'); p(1, 5, 110, 1, '#a9b1ba'); p(1, 15, 110, 1, '#4a525c')
    p(84, 0, 6, 6, '#5f6873'); p(85, 0, 4, 1, '#a9b1ba') // chimenea
    // cartel «PEÑA EL PILÓN» y su lema
    p(26, 21, 60, 13, NEGRO); p(27, 22, 58, 11, '#15171c'); textoCentrado(x, 'EL PILÓN', 56, 26, '#f2c200')
    // ventanas con luz de colores dentro
    for (const vx of [14, 82]) { p(vx, 40, 16, 14, NEGRO); p(vx + 1, 41, 14, 12, '#2b2f38'); p(vx + 2, 42, 5, 5, '#a970ff'); p(vx + 8, 46, 5, 5, '#3dd9ff'); p(vx + 1, 47, 14, 1, NEGRO); p(vx + 7, 41, 1, 12, NEGRO); p(vx - 1, 54, 18, 2, '#8a8f96') }
    // puerta metálica
    p(44, 46, 24, 34, NEGRO); p(45, 47, 22, 33, '#3a5a7a'); p(45, 47, 22, 2, '#5b7fa3'); for (let y = 52; y < 78; y += 6) p(46, y, 20, 1, '#2b4560'); p(62, 62, 3, 2, '#d6c070')
    p(40, 79, 32, 3, '#8a8f96')
    return c
  },
  arbol_cienaga: () => {
    const [c, x] = lienzo(44, 56); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(19, 26, 6, 28, '#3a2a18'); p(19, 26, 2, 28, '#4f3a22'); p(14, 50, 16, 5, '#3a2a18'); p(12, 52, 4, 3, '#3a2a18'); p(28, 52, 4, 3, '#3a2a18')
    for (let k = -18; k <= 18; k++) { const w = Math.round(Math.sqrt(324 - k * k) * 1.15); p(22 - w - 1, 20 + k, 2 * w + 2, 1, '#18240f'); p(22 - w, 20 + k, 2 * w, 1, k < -6 ? '#3b5426' : '#2a3d1c') }
    for (let k = 4; k < 40; k += 4) p(k, 34 + (k % 3), 1, 4 + (k % 5), '#6b7a3a')
    p(12, 8, 5, 3, '#4f6b30'); return c
  },
  charca: () => {
    const [c, x] = lienzo(64, 34); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    for (let y = -16; y <= 16; y++) { const w = Math.round(31 * Math.sqrt(1 - (y * y) / 256)); p(32 - w - 1, 17 + y, 2 * w + 2, 1, '#2a3418'); p(32 - w, 17 + y, 2 * w, 1, y < -8 ? '#6b8a4a' : '#557a3c') }
    p(10, 14, 8, 1, '#89a866'); p(36, 20, 6, 1, '#89a866')
    for (const [a, b] of [[16, 18], [40, 10], [46, 22]]) { p(a, b, 6, 3, '#2f7a3a'); p(a + 2, b, 1, 1, '#1f5a2a'); p(a + 4, b - 1, 2, 1, '#ff9fc4') }
    p(28, 12, 1, 1, '#a9c98a'); p(30, 9, 1, 1, '#a9c98a'); return c
  },
  tronco: () => {
    const [c, x] = lienzo(44, 16); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 3, 44, 12, NEGRO); p(1, 4, 42, 10, '#5e4429'); p(1, 4, 42, 2, '#7a5c3a'); p(1, 12, 42, 2, '#4a3520')
    p(36, 4, 7, 10, '#a8854f'); p(38, 6, 3, 6, '#7a5c3a'); p(39, 8, 1, 2, '#5e4429') // los anillos del corte
    p(8, 2, 3, 2, '#6b7a3a'); p(20, 2, 5, 2, '#6b7a3a'); p(14, 5, 2, 1, '#c8302a'); return c
  },
  juncos: () => {
    const [c, x] = lienzo(16, 20); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    for (const [a, h] of [[2, 14], [5, 18], [8, 12], [11, 16], [13, 10]]) { p(a, 20 - h, 1, h, '#5a7a2a'); p(a, 20 - h - 3, 1, 4, '#6b4a2b') }
    return c
  },
  setas: () => {
    const [c, x] = lienzo(14, 9); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    for (const [a, b] of [[2, 3], [8, 4]]) { p(a + 1, b + 2, 1, 3, '#e9e4d8'); p(a, b, 3, 2, '#c8302a'); p(a + 1, b, 1, 1, '#ffffff') }
    return c
  },
  cartel_fuera: () => {
    const [c, x] = lienzo(34, 30); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(15, 18, 3, 12, '#4a3520'); p(0, 1, 34, 18, NEGRO); p(1, 2, 32, 16, '#a8854f'); p(1, 2, 32, 1, '#c8a36a')
    textoCentrado(x, 'LA', 17, 4, '#3a2a18'); textoCentrado(x, 'CIÉNAGA', 17, 11, '#3a2a18'); return c
  },
  // ---- la peña
  pancarta_pilon: () => {
    const [c, x] = lienzo(110, 19); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 110, 19, NEGRO); p(1, 1, 108, 17, '#15171c'); p(1, 1, 108, 1, '#2b2f38')
    textoCentrado(x, 'PEÑA EL PILÓN', 55, 3, '#f2c200'); textoCentrado(x, 'ALEGRÍA DE VIVIR', 55, 11, '#f4f1ea')
    p(1, 18, 3, 1, '#f2c200'); p(106, 18, 3, 1, '#f2c200'); return c
  },
  // barra de bar con la encimera, los taburetes y botellas detrás
  barra: () => {
    const [c, x] = lienzo(88, 34); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    for (let k = 4; k < 84; k += 9) { p(k, 0, 3, 8, ['#2f7a3a', '#8a1f2a', '#f2b33d', '#3d7be0'][k % 4]); p(k + 1, 0, 1, 2, '#cfd5db') } // botellas en la balda
    p(0, 8, 88, 2, '#5a3c22')
    p(0, 12, 88, 20, NEGRO); p(1, 13, 86, 4, '#8a6040'); p(1, 13, 86, 1, '#b07a44'); p(1, 17, 86, 14, '#5a3c22')
    for (let k = 4; k < 86; k += 10) p(k, 18, 1, 13, '#4a3020')
    p(12, 10, 4, 3, '#f4f1ea'); p(13, 9, 2, 1, '#f2c200'); p(40, 9, 5, 4, '#2b2f38'); p(66, 10, 3, 3, '#f4f1ea') // vasos y un barril de cerveza
    p(1, 31, 86, 2, 'rgba(0,0,0,.25)'); return c
  },
  frigo: () => {
    const [c, x] = lienzo(22, 38); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 22, 38, NEGRO); p(1, 1, 20, 36, '#c8302a'); p(1, 1, 20, 2, '#e05a5a'); p(3, 5, 16, 24, '#1b2440'); p(4, 6, 14, 22, '#2b3a5a')
    for (let y = 8; y < 28; y += 6) { p(4, y + 4, 14, 1, '#8a919a'); for (let k = 5; k < 18; k += 3) p(k, y, 2, 4, ['#f2b33d', '#3dd9ff', '#2fbf71', '#e9e4d8'][(k + y) % 4]) }
    p(4, 6, 2, 22, 'rgba(255,255,255,0.18)'); p(3, 31, 16, 4, '#15171c'); p(6, 32, 10, 2, '#f4f1ea'); return c
  },
  // arcón congelador blanco: aquí se guarda el hielo
  arcon: () => {
    const [c, x] = lienzo(36, 24); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 2, 36, 22, NEGRO); p(1, 3, 34, 6, '#f4f6f8'); p(1, 3, 34, 1, '#ffffff'); p(1, 9, 34, 14, '#dfe3e8'); p(1, 9, 34, 1, '#9aa3ad')
    p(15, 7, 6, 2, '#8a919a'); p(28, 12, 4, 3, '#3dd9ff'); p(5, 13, 10, 5, '#ffffff'); textoCentrado(x, 'HIELO', 18, 15, '#5b7fa3')
    p(1, 23, 34, 1, 'rgba(0,0,0,.25)'); return c
  },
  sofa_pena: () => sofaColor('#3a3f48', '#4a515c', '#2b2f38', ['#f2c200', '#f2c200']),
  // bola de discoteca colgada del techo por un cable
  bola_disco: () => {
    const [c, x] = lienzo(16, 30); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(7, 0, 1, 16, '#5b6068')
    p(4, 16, 8, 12, '#9aa3ad'); p(2, 18, 12, 8, '#9aa3ad')
    for (let a = 2; a < 14; a += 2) for (let b = 16; b < 28; b += 2) p(a, b, 1, 1, (a + b) % 4 ? '#e9ecef' : '#5b6068')
    p(4, 18, 2, 2, '#ffffff'); return c
  },
  // equipo de música: mesa de DJ con dos platos y una pantalla
  equipo: () => {
    const [c, x] = lienzo(30, 30); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 10, 30, 20, NEGRO); p(1, 11, 28, 5, '#2b2f38'); p(1, 16, 28, 13, '#15171c')
    for (const a of [3, 18]) { p(a, 11, 9, 5, '#3a3f48'); p(a + 2, 12, 5, 3, '#5b6068'); p(a + 4, 13, 1, 1, '#e05a5a') }
    p(12, 12, 6, 3, '#3dd9ff'); p(13, 13, 1, 1, '#2fbf71'); p(15, 13, 2, 1, '#a970ff')
    p(8, 0, 14, 11, NEGRO); p(9, 1, 12, 8, '#0d1117'); for (let k = 10; k < 20; k += 2) p(k, 8 - (k % 5), 1, 1 + (k % 5), '#2fbf71')
    p(4, 19, 22, 1, '#3a3f48'); p(4, 22, 22, 1, '#3a3f48'); return c
  },
  altavoz: () => {
    const [c, x] = lienzo(16, 30); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 16, 30, NEGRO); p(1, 1, 14, 28, '#2b2f38'); p(4, 4, 8, 8, '#15171c'); p(6, 6, 4, 4, '#5b6068'); p(3, 15, 10, 10, '#15171c'); p(5, 17, 6, 6, '#3a3f48'); p(7, 19, 2, 2, '#8a919a')
    return c
  },
  // ---- los recreativos
  cartel_neon_arcade: () => {
    const [c, x] = lienzo(84, 20); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 84, 20, '#100c1f'); p(1, 1, 82, 18, 'rgba(255,61,127,0.18)')
    p(2, 2, 80, 1, '#ff3d7f'); p(2, 17, 80, 1, '#ff3d7f'); p(2, 2, 1, 16, '#ff3d7f'); p(81, 2, 1, 16, '#ff3d7f')
    textoCentrado(x, 'INSERT COIN', 42, 5, '#3dd9ff'); textoCentrado(x, 'ARCADE', 42, 11, '#f2c200'); return c
  },
  // máquina de peluches con la urna de cristal y la pinza
  grua: () => {
    const [c, x] = lienzo(26, 40); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(1, 38, 24, 2, 'rgba(0,0,0,0.3)')
    p(1, 0, 24, 39, NEGRO); p(2, 1, 22, 4, '#ff3d7f'); textoCentrado(x, 'TOY', 13, 1, '#ffffff')
    p(2, 5, 22, 20, '#9fd3ff'); p(2, 5, 22, 20, 'rgba(255,255,255,0.15)'); p(3, 6, 1, 18, '#ffffff')
    p(12, 5, 1, 7, '#c9ced5'); p(10, 12, 5, 2, '#c9ced5'); p(10, 14, 1, 2, '#c9ced5'); p(14, 14, 1, 2, '#c9ced5')
    for (const [a, b, col] of [[4, 19, '#f2c200'], [9, 20, '#ff7fb0'], [15, 19, '#2fbf71'], [19, 20, '#a970ff'], [6, 22, '#e05a5a'], [13, 22, '#3dd9ff'], [18, 23, '#f28c28']]) { p(a, b, 4, 3, col); p(a + 1, b - 1, 2, 1, col) }
    p(2, 25, 22, 13, '#5b2a8a'); p(6, 28, 6, 4, '#2b2f38'); p(8, 27, 2, 2, '#e05a5a'); p(16, 29, 5, 4, NEGRO); p(17, 30, 3, 2, '#f2c200')
    return c
  },
  cambio: () => {
    const [c, x] = lienzo(20, 34); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 20, 34, NEGRO); p(1, 1, 18, 32, '#c9ced5'); p(1, 1, 18, 2, '#ffffff'); p(4, 5, 12, 6, '#2b2f38'); textoCentrado(x, '1E', 10, 6, '#2fbf71')
    p(6, 14, 8, 3, NEGRO); p(5, 22, 10, 6, '#8a919a'); p(6, 23, 8, 4, '#f2c200'); return c
  },
  // mesa de air hockey vista desde arriba, con las dos porterías, el disco y los mazos
  air_hockey: () => {
    const [c, x] = lienzo(64, 36); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 4, 64, 28, NEGRO); p(2, 6, 60, 24, '#2b2f38'); p(4, 8, 56, 20, '#eef4f8')
    for (let a = 6; a < 60; a += 4) for (let b = 10; b < 28; b += 4) p(a, b, 1, 1, '#c9d3dc')
    p(31, 8, 2, 20, '#e05a5a'); p(4, 14, 2, 8, '#3d7be0'); p(58, 14, 2, 8, '#3d7be0')
    p(28, 15, 8, 6, '#e05a5a'); p(29, 16, 6, 4, '#ff7a7a'); p(30, 17, 4, 2, '#e05a5a') // el círculo del centro
    p(18, 16, 4, 4, NEGRO); p(12, 15, 5, 5, '#3d7be0'); p(46, 15, 5, 5, '#e05a5a') // disco y mazos
    p(4, 32, 4, 4, NEGRO); p(56, 32, 4, 4, NEGRO); return c
  },
  // mostrador de premios con peluches y tiras de tickets
  premios: () => {
    const [c, x] = lienzo(44, 40); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    for (const [a, b, col] of [[3, 0, '#ff7fb0'], [11, 2, '#f2c200'], [19, 0, '#3dd9ff'], [27, 2, '#2fbf71'], [35, 0, '#a970ff']]) { p(a, b + 4, 6, 6, col); p(a + 1, b + 2, 2, 2, col); p(a + 3, b + 2, 2, 2, col); p(a + 2, b + 6, 1, 1, NEGRO); p(a + 4, b + 6, 1, 1, NEGRO) }
    p(0, 14, 44, 2, '#5a3c22')
    p(0, 18, 44, 20, NEGRO); p(1, 19, 42, 5, '#a970ff'); p(1, 24, 42, 13, '#5b2a8a'); textoCentrado(x, 'PREMIOS', 22, 27, '#f2c200')
    for (let a = 4; a < 40; a += 6) p(a, 16, 3, 3, '#f28c28')
    p(1, 37, 42, 2, 'rgba(0,0,0,0.3)'); return c
  },
  puf: () => {
    const [c, x] = lienzo(18, 14); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(1, 3, 16, 10, NEGRO); p(2, 4, 14, 8, '#ff3d7f'); p(3, 4, 8, 2, '#ff7fb0'); return c
  },
  // ---- el Bar El Arte
  tele_futbol: () => {
    const [c, x] = lienzo(64, 38); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 64, 38, NEGRO); p(2, 2, 60, 32, '#2f8a3f')
    for (let a = 2; a < 62; a += 10) p(a, 2, 5, 32, '#36994a')
    p(2, 17, 60, 1, '#e8f0e8'); p(31, 2, 1, 32, '#e8f0e8'); p(26, 13, 11, 9, '#e8f0e8'); p(27, 14, 9, 7, '#36994a'); p(2, 12, 6, 12, '#e8f0e8'); p(3, 13, 4, 10, '#2f8a3f')
    // los jugadores: de blanco el Madrid y de rojo el rival, y el balón
    for (const [a, b] of [[14, 10], [20, 22], [40, 14], [46, 24], [34, 8]]) { p(a, b, 3, 4, '#ffffff'); p(a, b - 2, 3, 2, '#e8b896') }
    for (const [a, b] of [[10, 20], [24, 6], [52, 12]]) { p(a, b, 3, 4, '#c8302a'); p(a, b - 2, 3, 2, '#e8b896') }
    p(43, 19, 2, 2, '#ffffff')
    p(3, 3, 30, 8, '#15171c'); textoCentrado(x, 'RMA 3-0', 18, 5, '#ffffff')
    p(28, 34, 8, 4, '#3a3f48'); return c
  },
  // dos bufandas colgadas: blancas con los bordes morados
  bufandas: () => {
    const [c, x] = lienzo(62, 26); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 1, 62, 2, '#6b4a2b')
    for (const [a, txt] of [[1, 'HALA'], [32, 'MADRID']]) {
      p(a, 3, 29, 9, '#ffffff'); p(a, 3, 29, 1, '#5b2a8a'); p(a, 11, 29, 1, '#5b2a8a'); textoCentrado(x, txt, a + 14.5, 5, '#5b2a8a')
      for (let k = 0; k < 3; k++) { p(a + 3 + k * 10, 12, 3, 8, '#ffffff'); p(a + 3 + k * 10, 18, 3, 1, '#5b2a8a'); p(a + 3 + k * 10, 20, 1, 3, '#f2c200'); p(a + 5 + k * 10, 20, 1, 3, '#f2c200') }
    }
    return c
  },
  // máquina tragaperras de bar
  tragaperras: () => {
    const [c, x] = lienzo(22, 38); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(0, 0, 22, 38, NEGRO); p(1, 1, 20, 36, '#c8302a'); p(1, 1, 20, 3, '#f2c200'); p(3, 6, 16, 10, '#15171c')
    for (const [a, col] of [[4, '#e05a5a'], [9, '#f2c200'], [14, '#2fbf71']]) { p(a, 8, 4, 6, '#ffffff'); p(a + 1, 10, 2, 2, col) }
    p(3, 19, 16, 4, '#3dd9ff'); p(5, 26, 4, 3, '#f2c200'); p(12, 26, 5, 3, '#ffffff'); p(4, 32, 14, 3, '#5b2a1a'); return c
  },
  // mesa redonda alta con dos taburetes y un par de cañas
  mesa_redonda: () => {
    const [c, x] = lienzo(36, 24); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(1, 12, 8, 6, NEGRO); p(2, 13, 6, 4, '#8a6040'); p(27, 12, 8, 6, NEGRO); p(28, 13, 6, 4, '#8a6040') // taburetes
    p(9, 2, 18, 12, NEGRO); p(10, 3, 16, 10, '#b07a44'); p(10, 3, 16, 2, '#c99460'); p(17, 14, 2, 8, NEGRO); p(13, 21, 10, 2, NEGRO)
    p(12, 5, 3, 4, '#f2b33d'); p(12, 5, 3, 1, '#ffffff'); p(20, 6, 3, 4, '#f2b33d'); p(20, 6, 3, 1, '#ffffff'); return c
  },
  maquina_bits: () => {
    const [c, x] = lienzo(26, 38); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(1, 36, 24, 2, 'rgba(0,0,0,0.25)')
    p(2, 0, 22, 37, NEGRO); p(3, 1, 20, 35, '#1f5a94'); p(3, 1, 2, 35, '#3d7be0'); p(21, 1, 2, 35, '#163f6a')
    p(3, 2, 20, 7, '#15101f'); textoCentrado(x, 'BITS', 13, 3, '#ffffff')
    p(6, 10, 14, 11, NEGRO); p(7, 11, 12, 9, '#0d1117')
    for (const [a, b, col] of [[8, 17, '#2fbf71'], [10, 17, '#3dd9ff'], [12, 17, '#2fbf71'], [14, 15, '#a970ff'], [14, 17, '#a970ff'], [10, 12, '#f2c200'], [10, 14, '#f2c200']]) p(a, b, 2, 2, col)
    p(3, 22, 20, 5, '#163f6a'); p(8, 23, 1, 3, '#2b2f38'); p(7, 22, 3, 1, '#e05a5a'); p(14, 24, 2, 2, '#f2c200'); p(18, 24, 2, 2, '#3dd9ff')
    p(8, 29, 10, 3, NEGRO); p(9, 30, 3, 1, '#f2c200'); p(14, 30, 3, 1, '#f2c200')
    return c
  },
}

function pizarraBlanca(texto, color) {
  const [c, x] = lienzo(76, 16); const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
  p(0, 0, 76, 15, '#9aa3ad'); p(1, 1, 74, 12, '#ffffff')
  textoCentrado(x, texto, 38, 3, color); p(6, 10, 20, 1, '#e05a5a'); p(50, 10, 18, 1, '#2fbf71'); p(2, 13, 72, 2, '#6a717c')
  return c
}

function tornos(abierto) {
  const [c, x] = lienzo(64, 22)
  const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
  for (const cx of [0, 27, 54]) {
    p(cx, 4, 10, 18, NEGRO); p(cx + 1, 5, 8, 16, '#aab1b9'); p(cx + 1, 5, 8, 2, '#d9dee4'); p(cx + 3, 8, 4, 3, abierto ? '#2fbf71' : '#e05a5a')
  }
  for (const cx of [10, 37]) {
    if (abierto) { p(cx, 4, 2, 10, '#5b6068'); p(cx + 15, 4, 2, 10, '#5b6068') } // los brazos, girados
    else { p(cx, 9, 17, 2, '#5b6068'); p(cx, 9, 17, 1, '#8a919a') }
  }
  p(0, 20, 64, 2, 'rgba(0,0,0,0.2)')
  return c
}

// Esfera naranja con estrellas rojas: hay siete repartidas por el mundo
function esfera(n) {
  return () => {
    const [c, x] = lienzo(10, 10)
    const p = (a, b, w, h, col) => px(x, a, b, col, w, h)
    p(3, 0, 4, 10, '#a85a0a'); p(0, 3, 10, 4, '#a85a0a'); p(1, 1, 8, 8, '#a85a0a')
    p(3, 1, 4, 8, '#f2a71b'); p(1, 3, 8, 4, '#f2a71b'); p(2, 2, 6, 6, '#f2a71b')
    p(2, 2, 2, 2, '#ffe2a0'); p(3, 2, 1, 1, '#ffffff')
    const sitios = [[5, 5], [3, 5], [6, 3], [4, 7], [7, 6], [5, 3], [3, 4]]
    for (let i = 0; i < n; i++) p(sitios[i][0], sitios[i][1], 1, 1, '#c8202a')
    return c
  }
}

export function crearInteriores(scene) {
  if (scene.textures.exists('int_casa')) return
  for (const [id, o] of Object.entries(INTERIORES)) scene.textures.addCanvas(`int_${id}`, sala(o))
  for (const [clave, pintar] of Object.entries(M)) scene.textures.addCanvas(clave, pintar())
  for (let n = 1; n <= 7; n++) scene.textures.addCanvas(`esfera_${n}`, esfera(n)())
}
