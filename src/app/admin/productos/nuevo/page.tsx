// ALTA DE PRODUCTO ( /admin/productos/nuevo ) — US-12.
import type { Metadata } from 'next'
import { exigirAdmin } from '@/lib/admin'
import { productoService } from '@/lib/services'
import { FormProducto } from '../FormProducto'

export const metadata: Metadata = { title: 'Nuevo producto', robots: { index: false } }

// Valores iniciales del formulario: todo vacío, sin id (= alta) y activo tildado
const VACIO = {
  id: '', imageUrl: '', name: '', slug: '', brand: '', concentration: '', gender: '', categoryId: '',
  description: '', notes: '', occasions: '', presentation: '', searchTerms: '', precio5: '', precio10: '',
  active: 'on',
}

/**
 * Chequea la sesión, trae las categorías para el desplegable de "Origen" y
 * muestra el formulario vacío.
 */
export default async function NuevoProductoPage() {
  await exigirAdmin()
  const categorias = await productoService.listarCategorias()

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">Nuevo producto</h1>
      <FormProducto inicial={VACIO} categorias={categorias} />
    </main>
  )
}
