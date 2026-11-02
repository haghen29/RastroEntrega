// 'server-only' hace que el build falle si algún componente del navegador
// importa este archivo: la verificación de sesión tiene que correr en el servidor.
import 'server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { COOKIE_SESION, tokenValido } from './sesion'

/**
 * Corta la ejecución y manda al login si quien hace el pedido no es el admin.
 *
 * proxy.ts protege las páginas, pero las Server Actions se pueden llamar
 * directo: cada acción del admin vuelve a chequear la sesión (RNF-05).
 * Por eso se llama al principio de cada página y de cada acción del admin.
 *
 * - `cookies()` lee las cookies del pedido actual. En Next 16 es async, por eso el `await`.
 * - `?.value`: si la cookie no existe, da undefined en vez de romper.
 * - `redirect()` corta la función en ese momento: lo que sigue no se ejecuta.
 */
export async function exigirAdmin(): Promise<void> {
  const token = (await cookies()).get(COOKIE_SESION)?.value
  if (!(await tokenValido(token))) redirect('/admin/login')
}
