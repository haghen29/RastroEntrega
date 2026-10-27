import Image from 'next/image'
import Link from 'next/link'

import { formatearPrecio } from '@/lib/formato'
import type { TarjetaDecant as Datos } from '@/services/ProductoService'

const FOTO_GENERICA = '/decant-generico.svg'

// 'masculino' → 'Masculino'; '' queda vacío y no se muestra
function etiquetaGenero(genero: string): string {
  return genero.charAt(0).toUpperCase() + genero.slice(1)
}

// HU-03 · CA-3 a CA-7, CA-9: una tarjeta del catálogo. Server Component: solo muestra datos.
export default function TarjetaDecant({ tarjeta }: { tarjeta: Datos }) {
  return (
    // CA-9: toda la tarjeta lleva a la ficha
    <Link
      href={`/producto/${tarjeta.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-foreground/10 bg-background"
    >
      <div className="relative aspect-square bg-stone-100">
        {/* CA-7: sin foto válida → imagen genérica */}
        <Image
          src={tarjeta.imageUrl ?? FOTO_GENERICA}
          alt={tarjeta.nombre}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform group-hover:scale-105"
        />
        {/* CA-6 */}
        {tarjeta.sinStock && (
          <span className="absolute left-2 top-2 rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white">
            Sin stock
          </span>
        )}
      </div>

      {/* CA-3 */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-xs uppercase tracking-wide text-foreground/50">
          {[tarjeta.origen, tarjeta.marca].filter(Boolean).join(' · ')}
        </p>
        <h2 className="text-sm font-semibold leading-tight">{tarjeta.nombre}</h2>
        <p className="text-xs text-foreground/60">
          {[tarjeta.concentracion, etiquetaGenero(tarjeta.genero)].filter(Boolean).join(' · ')}
        </p>
        {/* CA-4 y CA-5 */}
        <p className="mt-auto pt-2 text-sm font-semibold">
          {tarjeta.precioDesdeCentavos !== null
            ? `desde ${formatearPrecio(tarjeta.precioDesdeCentavos)}`
            : 'Consultar precio'}
        </p>
      </div>
    </Link>
  )
}
