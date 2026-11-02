// LOGIN DEL ADMIN ( /admin/login ) — US-11.
// Es la única ruta de /admin que proxy.ts deja pasar sin sesión.
import type { Metadata } from 'next'
import { FormLogin } from './FormLogin'

export const metadata: Metadata = { title: 'Ingresar', robots: { index: false } }

/**
 * Página de ingreso. Server Component que solo pone el título; el formulario
 * es un Client Component aparte (FormLogin) porque necesita estado (error, "Entrando…").
 */
export default function LoginPage() {
  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold">Panel de Rastro</h1>
      <FormLogin />
    </main>
  )
}
