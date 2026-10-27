import type { Metadata } from 'next'

import TarjetaDecant from '@/components/TarjetaDecant'
import { textoCantidad } from '@/lib/formato'
import { productoService } from '@/lib/services'

// HU-03 · D1: se arma en cada visita, así un cambio de precio se ve al instante
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Decants · Rastro Perfumería',
  description: 'Decants de 5 ml y 10 ml de perfumes árabes y de diseñador, del frasco original.',
}

// HU-03: catálogo de decants. Server Component: la consulta nunca sale del servidor.
export default async function DecantsPage() {
  const tarjetas = await productoService.obtenerCatalogoDecants()

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold">Decants</h1>

      {tarjetas.length === 0 ? (
        // CA-10
        <p className="mt-6 text-foreground/60">Todavía no hay decants cargados.</p>
      ) : (
        <>
          {/* CA-8 */}
          <p className="mt-1 text-sm text-foreground/60">{textoCantidad(tarjetas.length)}</p>

          {/* CA-1: mobile-first, 2 columnas en celular */}
          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {tarjetas.map((tarjeta) => (
              <li key={tarjeta.slug}>
                <TarjetaDecant tarjeta={tarjeta} />
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}
