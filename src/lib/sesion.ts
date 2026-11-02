// Sesión del admin: una cookie con "vencimiento.firma". La firma es un HMAC
// con SESSION_SECRET, así nadie puede fabricar una cookie válida.
// Usa Web Crypto para funcionar igual en proxy.ts y en las Server Actions.
//
// Ejemplo de cookie: "1762300000.Xk3f9...". El primer número es la fecha de
// vencimiento (en segundos desde 1970). Lo de después del punto es la firma.
// Si alguien cambia el vencimiento para alargar su sesión, la firma ya no
// coincide, porque para recalcularla hace falta el secreto, que solo tiene el servidor.

export const COOKIE_SESION = 'rastro_admin'
export const DURACION_SESION = 60 * 60 * 24 * 7 // 7 días, en segundos

/**
 * Calcula la firma HMAC-SHA256 de un texto usando SESSION_SECRET.
 *
 * Es `async` porque las funciones de `crypto.subtle` devuelven una Promise
 * (una "promesa" de un resultado que va a estar listo más adelante).
 * `await` espera ese resultado antes de seguir a la línea siguiente.
 *
 * No tiene `export`: solo se usa dentro de este archivo.
 */
async function firmar(texto: string): Promise<string> {
  // En local (pnpm dev) alcanza con uno fijo; en producción es obligatorio
  const secreto =
    process.env.SESSION_SECRET ??
    (process.env.NODE_ENV !== 'production' ? 'solo-desarrollo-no-usar-en-produccion-rastro' : undefined)
  // `throw` corta la función con un error: mejor fallar que firmar con un secreto débil
  if (!secreto || secreto.length < 32) {
    throw new Error('Falta SESSION_SECRET (mínimo 32 caracteres) en .env.local y en Vercel.')
  }
  // Convierte el secreto (texto) en una clave criptográfica que sirve para firmar
  const clave = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secreto),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const firma = await crypto.subtle.sign('HMAC', clave, new TextEncoder().encode(texto))
  // La firma son bytes: se pasa a base64 (btoa) y se reemplazan + / = para que
  // sea "base64url", un formato que se puede guardar en una cookie sin problemas.
  return btoa(String.fromCharCode(...new Uint8Array(firma)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Crea el valor de la cookie de sesión al hacer login: "vencimiento.firma".
 * `Date.now()` da milisegundos; se divide por 1000 para pasar a segundos.
 */
export async function crearToken(): Promise<string> {
  const vence = Math.floor(Date.now() / 1000) + DURACION_SESION
  return `${vence}.${await firmar(String(vence))}`
}

/**
 * ¿La cookie es válida? Devuelve true solo si:
 * 1. existe,
 * 2. tiene las dos partes separadas por un punto,
 * 3. no venció, y
 * 4. la firma coincide con la que calcularía el servidor.
 * La usan proxy.ts (antes de mostrar una página del admin) y exigirAdmin().
 */
export async function tokenValido(token: string | undefined): Promise<boolean> {
  if (!token) return false
  // "Desestructuración": separa el texto por el punto y guarda cada parte en una variable
  const [vence, firma] = token.split('.')
  if (!vence || !firma || Number(vence) < Date.now() / 1000) return false
  return iguales(firma, await firmar(vence))
}

/**
 * Compara dos textos en tiempo constante, para no filtrar la firma por timing.
 *
 * Un `a === b` común corta apenas encuentra la primera letra distinta, así que
 * tarda un poquito más cuantas más letras coinciden. Midiendo esos tiempos, un
 * atacante podría adivinar la firma letra por letra. Acá se recorren SIEMPRE
 * todas las letras: `^` (XOR) da 0 si dos letras son iguales, y `|=` acumula
 * cualquier diferencia. Al final, diferencia === 0 significa "son idénticos".
 * También se usa para comparar la contraseña del login.
 */
export function iguales(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diferencia = 0
  for (let i = 0; i < a.length; i++) diferencia |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diferencia === 0
}
