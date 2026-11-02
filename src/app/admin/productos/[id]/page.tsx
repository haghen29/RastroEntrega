// EDICIÓN DE PRODUCTO ( /admin/productos/5 ) — US-12.
// [id] es una ruta dinámica: el número de la URL llega en `params.id`.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { exigirAdmin } from '@/lib/admin'
import { productoService, productoServiceAdm } from '@/lib/services'
import { FormProducto } from '../FormProducto'

export const metadata: Metadata = { title: 'Editar producto', robots: { index: false } }

/**
 * centavos -> pesos para mostrar en el form; medida inactiva -> vacío
 * Ejemplo: 850000 -> "8500". Si la medida no existe (undefined) devuelve ''.
 */
function precioEnPesos(centavos: number | undefined): string {
  return centavos === undefined ? '' : String(Math.round(centavos / 100))
}

/**
 * Busca el producto y lo muestra en el formulario, ya precargado.
 *
 * - `Number(...)` convierte el texto de la URL a número. Si alguien pone /admin/productos/abc,
 *   da NaN, `Number.isInteger` da false y no se consulta la base.
 * - `Promise.all([...])` lanza las dos consultas A LA VEZ y espera a que
 *   terminen las dos. Es más rápido que hacer un `await` después del otro.
 * - Si no existe el producto, `notFound()` muestra la página 404.
 * - `precio(ml)` busca el precio de una medida activa (5 o 10 ml).
 * - Todo se pasa como texto, porque es lo que maneja un <input>.
 */
export default async function EditarProductoPage({ params }: PageProps<'/admin/productos/[id]'>) {
  await exigirAdmin()
  const id = Number((await params).id)
  const [producto, categorias] = await Promise.all([
    Number.isInteger(id) ? productoServiceAdm.obtenerPorId(id) : null,
    productoService.listarCategorias(),
  ])
  if (!producto) notFound()

  const precio = (ml: number) => producto.variants.find((v) => v.ml === ml && v.active)?.priceCents

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">Editar: {producto.name}</h1>
      <FormProducto
        categorias={categorias}
        inicial={{
          id: String(producto.id),
          imageUrl: producto.imageUrl ?? '',
          name: producto.name,
          slug: producto.slug,
          brand: producto.brand,
          concentration: producto.concentration,
          gender: producto.gender,
          categoryId: producto.categoryId ? String(producto.categoryId) : '',
          description: producto.description,
          notes: producto.notes,
          occasions: producto.occasions,
          presentation: producto.presentation,
          searchTerms: producto.searchTerms,
          precio5: precioEnPesos(precio(5)),
          precio10: precioEnPesos(precio(10)),
          active: producto.active ? 'on' : '',
        }}
      />
    </main>
  )
}
