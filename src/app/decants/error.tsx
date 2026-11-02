'use client'
// ERROR BOUNDARY del catálogo. Next lo reconoce por el nombre del archivo (error.tsx):
// si algo falla al armar /decants (por ejemplo, la base no responde), en vez
// de una pantalla rota se muestra este componente.
// Tiene que ser 'use client' porque el botón "Reintentá" necesita un onClick.

/**
 * Si la base está caída o tarda demasiado, se muestra esto en vez de una pantalla rota.
 * Next le pasa dos props: `error` (qué pasó; no se muestra al cliente) y
 * `retry` (una función que vuelve a intentar armar la página).
 */
export default function ErrorCatalogo({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 text-center">
      <p className="text-lg">No pudimos cargar el catálogo.</p>
      <button onClick={() => retry()} className="mt-4 rounded-full bg-tinta px-5 py-2 text-sm font-semibold text-crema">
        Reintentá
      </button>
    </main>
  )
}
