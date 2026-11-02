// Funciones chicas de formato que se usan en toda la tienda. Son funciones
// "puras": reciben un valor y devuelven otro, sin tocar la base ni la pantalla.
// Por eso se pueden usar tanto en el servidor como en el navegador.

/**
 * Convierte centavos a un precio legible: 850000 -> "$8.500".
 *
 * Los precios se guardan en centavos (enteros) para evitar errores de redondeo
 * de los decimales (en JavaScript 0.1 + 0.2 da 0.30000000000000004).
 * - `centavos / 100` pasa a pesos.
 * - `Math.round` redondea al peso entero.
 * - `toLocaleString('es-AR')` agrega el punto de miles al estilo argentino.
 */
export function formatearPrecio(centavos: number): string {
  return `$${Math.round(centavos / 100).toLocaleString('es-AR')}`
}

/**
 * Deja un texto listo para comparar sin importar mayúsculas ni tildes:
 * "Diseñador" -> "disenador". Lo usa el buscador del catálogo.
 * - `normalize('NFD')` separa cada letra de su tilde ("é" pasa a "e" + "´").
 * - `replace(/[...]/g, '')` borra esas tildes sueltas (la `g` = en todo el texto).
 * - `toLowerCase()` pasa a minúsculas y `trim()` saca espacios de los bordes.
 */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Arma un "slug": la parte de la URL que identifica a un producto.
 * "Decant Honor & Glory" -> "decant-honor-glory" (queda /producto/decant-honor-glory).
 * - Primero normaliza (sin tildes, en minúsculas).
 * - `/[^a-z0-9]+/g` = todo lo que NO sea letra o número se cambia por un guion.
 * - `/^-+|-+$/g` = saca los guiones que queden al principio o al final.
 */
export function slugificar(texto: string): string {
  return normalizar(texto)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Los géneros válidos: la clave es lo que se guarda en la base y en la URL,
// el valor es lo que se muestra. `as const` le dice a TypeScript que estos
// valores son fijos, así puede avisar si alguien escribe un género que no existe.
export const GENEROS = {
  masculino: 'Masculino',
  femenino: 'Femenino',
  unisex: 'Unisex',
} as const

// Tipo derivado: `keyof typeof GENEROS` = "las claves de GENEROS",
// o sea 'masculino' | 'femenino' | 'unisex'. Si se agrega un género arriba, este tipo se actualiza solo.
export type Genero = keyof typeof GENEROS

/**
 * Devuelve el texto lindo de un género: 'femenino' -> 'Femenino'.
 * Si el género viene vacío o es desconocido, devuelve '' (el operador `??`
 * usa el valor de la derecha cuando el de la izquierda es null o undefined).
 */
export function etiquetaGenero(genero: string): string {
  return GENEROS[genero as Genero] ?? ''
}

/**
 * Decide qué foto mostrar de un producto.
 * Solo se muestran fotos subidas a Vercel Blob; links viejos (Tiendanube)
 * o vacíos caen en la imagen genérica de public/decant-generico.svg.
 * El `.test(url)` chequea con una expresión regular que la URL empiece con
 * el dominio de Vercel Blob. Además, <Image> de Next solo acepta ese dominio (ver next.config.ts).
 */
export function urlFoto(url: string | null): string {
  if (url && /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//.test(url)) {
    return url
  }
  return '/decant-generico.svg'
}
