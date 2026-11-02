// PÁGINA 404 de la ficha. Next la muestra cuando page.tsx llama a `notFound()`:
// el slug no existe o el producto está inactivo. También devuelve el código HTTP 404.
import Link from 'next/link'

/** Mensaje amable con un botón para volver al catálogo. */
export default function ProductoNoEncontrado() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">No encontramos esa fragancia</h1>
      <p className="mt-2 text-tinta-suave">Puede que ya no esté disponible.</p>
      <Link href="/decants" className="mt-6 inline-block rounded-full bg-tinta px-5 py-2 text-sm font-semibold text-crema">
        Ver todos los decants
      </Link>
    </main>
  )
}
