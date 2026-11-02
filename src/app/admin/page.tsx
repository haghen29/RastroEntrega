// PANEL DEL ADMIN ( /admin ) — US-12. Tabla con todos los productos.
import type { Metadata } from 'next'
import Link from 'next/link'
import { exigirAdmin } from '@/lib/admin'
import { formatearPrecio } from '@/lib/formato'
import { productoServiceAdm } from '@/lib/services'
import { cerrarSesion } from './acciones'

// robots index: false = le pide a Google que no muestre esta página en los resultados
export const metadata: Metadata = { title: 'Productos', robots: { index: false } }

/**
 * Lista de productos (activos e inactivos) con su origen, precios, estado y un link para editar.
 *
 * - `await exigirAdmin()`: si no hay sesión, redirige al login antes de leer nada.
 * - `?guardado=1` en la URL (lo pone guardarProducto) muestra "Cambios guardados".
 * - El botón "Cerrar sesión" es un <form> cuya `action` es directamente la
 *   Server Action `cerrarSesion`: no hace falta escribir un fetch ni una API.
 * - Precios: se muestran solo las medidas activas, ej. "5 ml $8.500 · 10 ml $15.000".
 */
export default async function AdminPage({ searchParams }: PageProps<'/admin'>) {
  await exigirAdmin()
  const productos = await productoServiceAdm.listarTodos()
  const { guardado } = await searchParams

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Productos ({productos.length})</h1>
        <div className="flex gap-2">
          <Link href="/admin/productos/nuevo" className="rounded-full bg-tinta px-4 py-2 text-sm font-semibold text-crema">
            Nuevo producto
          </Link>
          <form action={cerrarSesion}>
            <button className="rounded-full border border-arena px-4 py-2 text-sm">Cerrar sesión</button>
          </form>
        </div>
      </div>

      {guardado && <p role="status" className="mt-4 rounded-lg bg-crema-2 px-4 py-2 text-sm">Cambios guardados.</p>}

      {/* overflow-x-auto: en celular la tabla se desliza de costado en vez de desbordar la pantalla */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-arena text-xs uppercase tracking-wide text-tinta-suave">
            <tr>
              <th className="py-2 pr-4">Producto</th>
              <th className="py-2 pr-4">Origen</th>
              <th className="py-2 pr-4">Precios</th>
              <th className="py-2 pr-4">Estado</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-arena">
            {productos.map((p) => (
              <tr key={p.id}>
                <td className="py-3 pr-4">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-tinta-suave">{p.brand}</p>
                </td>
                <td className="py-3 pr-4">{p.category?.name ?? '—'}</td>
                <td className="py-3 pr-4">
                  {p.variants.filter((v) => v.active).map((v) => `${v.label} ${formatearPrecio(v.priceCents)}`).join(' · ') || '—'}
                </td>
                <td className="py-3 pr-4">{p.active ? 'Activo' : <span className="text-tinta-suave">Inactivo</span>}</td>
                <td className="py-3 text-right">
                  <Link href={`/admin/productos/${p.id}`} className="underline underline-offset-4">Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
