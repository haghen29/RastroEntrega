// Tarjeta de un producto en la grilla del catálogo.
import Image from 'next/image'
import Link from 'next/link'
import type { ProductoConDetalle } from '@/persistence/dao/ProductoDAO'
import { etiquetaGenero, formatearPrecio, urlFoto } from '@/lib/formato'

/**
 * Muestra foto, origen y marca, nombre, concentración y género, y el precio
 * "desde" (el de la medida más barata). Toda la tarjeta es un link a la ficha.
 *
 * - `Math.min(...precios)`: los `...` "despliegan" la lista como argumentos sueltos.
 * - Si no hay precios, muestra "Consultar precio".
 * - `group` + `group-hover:scale-105`: al pasar el mouse por la tarjeta, la foto se agranda un poco.
 * - `sizes`: le dice al navegador qué ancho ocupa la foto según la pantalla,
 *   así Next manda una imagen del tamaño justo (más liviana en celular).
 */
export function TarjetaDecant({ producto, href }: { producto: ProductoConDetalle; href: string }) {
  const precios = producto.variants.map((v) => v.priceCents)
  const desde = precios.length ? Math.min(...precios) : null
  const meta = [producto.category?.name, producto.brand].filter(Boolean).join(' · ')
  const detalle = [producto.concentration, etiquetaGenero(producto.gender)].filter(Boolean).join(' · ')

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-crema-2">
        <Image
          src={urlFoto(producto.imageUrl)}
          alt={producto.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="mt-2 space-y-0.5">
        {meta && <p className="text-[11px] uppercase tracking-wide text-tinta-suave">{meta}</p>}
        <h3 className="text-sm font-semibold sm:text-base">{producto.name}</h3>
        {detalle && <p className="text-xs text-tinta-suave">{detalle}</p>}
        <p className="pt-1 text-sm">
          {desde !== null ? `desde ${formatearPrecio(desde)}` : 'Consultar precio'}
        </p>
      </div>
    </Link>
  )
}
