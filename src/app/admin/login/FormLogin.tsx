'use client'
// Formulario de contraseña. Es Client Component porque muestra el error y el
// estado "Entrando…" sin recargar la página.

import { useActionState } from 'react'
import { iniciarSesion } from '../acciones'

/**
 * `useActionState(accion, estadoInicial)` es un hook de React 19 que conecta
 * un formulario con una Server Action. Devuelve tres cosas:
 * - `estado`: lo último que devolvió la acción (acá, `{ error?: string }`).
 * - `accion`: la función que se pone en <form action={...}>.
 * - `enviando`: true mientras la acción está corriendo en el servidor.
 *
 * Al tocar "Entrar", el navegador manda los campos (por su `name`) a
 * iniciarSesion en el servidor. Si la contraseña está mal, vuelve `{ error }`
 * y se muestra. Si está bien, la acción redirige a /admin.
 */
export function FormLogin() {
  const [estado, accion, enviando] = useActionState(iniciarSesion, {})

  return (
    <form action={accion} className="mt-6 space-y-3">
      <label htmlFor="password" className="block text-sm font-semibold">Contraseña</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className="w-full rounded-lg border border-arena bg-white px-3 py-2 outline-none focus:border-tinta"
      />
      {/* role="alert" hace que los lectores de pantalla lean el error apenas aparece */}
      {estado.error && <p role="alert" className="text-sm text-red-700">{estado.error}</p>}
      {/* El botón se desactiva mientras se envía, así no se manda dos veces */}
      <button disabled={enviando} className="w-full rounded-full bg-tinta px-5 py-2.5 font-semibold text-crema disabled:opacity-50">
        {enviando ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
