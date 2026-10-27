'use client' // Next exige que las pantallas de error sean Client Components

import { useEffect } from 'react'

// HU-03 · caso borde: si Neon no responde, se ve esto en lugar de una pantalla rota.
// En Next 16 la función para reintentar se llama `retry` (antes era `reset`).
export default function ErrorDecants({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 text-center">
      <h1 className="text-xl font-bold">No pudimos cargar el catálogo</h1>
      <p className="mt-2 text-sm text-foreground/60">Probá de nuevo en unos segundos.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-6 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background"
      >
        Reintentar
      </button>
    </main>
  )
}
