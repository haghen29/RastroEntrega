// Los filtros del catálogo viven en la URL: /decants?genero=masculino&categoria=arabes&q=9pm
// Este archivo tiene las dos funciones que pasan de la URL a un objeto y del objeto a la URL.
// Tenerlos en la URL permite compartir el link, usar el botón "atrás" y volver
// desde la ficha al mismo resultado.

import { GENEROS } from './formato'
// `import type` trae solo el tipo (para que TypeScript chequee), no código.
import type { FiltrosCatalogo } from '@/services/ProductoService'

// Así llegan los parámetros de la URL en una página de Next: un objeto donde
// cada clave puede ser un texto, una lista de textos (si se repite) o no estar.
type Params = Record<string, string | string[] | undefined>

const CATEGORIAS = ['arabes', 'disenador']

/**
 * Lee los filtros de la URL y descarta valores desconocidos.
 *
 * Es una defensa: si alguien escribe a mano ?genero=cualquiera, el filtro se
 * ignora en vez de romper la página. La búsqueda (`q`) se corta a 60 caracteres.
 *
 * Acepta dos formatos: el objeto `searchParams` de Next, o un `URLSearchParams`
 * (lo usa la ficha del producto para leer el parámetro `desde`).
 */
export function leerFiltros(params: Params | URLSearchParams): FiltrosCatalogo {
  // Función interna que saca un valor limpio de cualquiera de los dos formatos.
  // - Si viene una lista, se queda con el primero.
  // - `?.` (optional chaining): si el valor no existe, no llama a .trim() y da undefined.
  // - `|| undefined`: un texto vacío también cuenta como "sin filtro".
  const valor = (clave: string) => {
    const v = params instanceof URLSearchParams ? params.get(clave) : params[clave]
    return (Array.isArray(v) ? v[0] : v)?.trim() || undefined
  }
  const genero = valor('genero')
  const categoria = valor('categoria')
  return {
    // `genero in GENEROS` = ¿existe esa clave en el objeto GENEROS?
    genero: genero && genero in GENEROS ? genero : undefined,
    categoria: categoria && CATEGORIAS.includes(categoria) ? categoria : undefined,
    q: valor('q')?.slice(0, 60),
  }
}

/**
 * El camino inverso: arma el texto "?genero=...&q=..." a partir de los filtros.
 * Si no hay ningún filtro devuelve '' (así la URL queda limpia: /decants).
 * `URLSearchParams` se encarga de escapar los caracteres especiales.
 */
export function queryFiltros(filtros: FiltrosCatalogo): string {
  const qs = new URLSearchParams()
  if (filtros.genero) qs.set('genero', filtros.genero)
  if (filtros.categoria) qs.set('categoria', filtros.categoria)
  if (filtros.q) qs.set('q', filtros.q)
  const texto = qs.toString()
  return texto ? `?${texto}` : ''
}
