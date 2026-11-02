// FICHA DEL PRODUCTO ( /producto/decant-9pm ) — US-04, US-05, US-06.
// La carpeta se llama [slug] con corchetes: eso la vuelve una RUTA DINÁMICA.
// Lo que vaya en esa parte de la URL llega en `params.slug`.
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { SelectorCompra } from '@/components/SelectorCompra'
import { linkWhatsApp } from '@/lib/config'
import { leerFiltros, queryFiltros } from '@/lib/filtros'
import { etiquetaGenero, urlFoto } from '@/lib/formato'
import { productoService } from '@/lib/services'

// Siempre consulta la base (los cambios de precio del admin se ven al instante)
export const dynamic = 'force-dynamic'

// generateMetadata y la página piden el mismo producto: cache() hace una sola consulta
// (`cache` de React recuerda el resultado durante el mismo pedido al servidor)
const buscar = cache((slug: string) => productoService.obtenerPorSlug(slug))

/**
 * Arma el <title>, la descripción y la imagen de vista previa de la ficha.
 * Next la llama sola antes de dibujar la página (por el nombre `generateMetadata`).
 * La imagen Open Graph es la que muestra WhatsApp cuando alguien comparte el link.
 * La descripción se corta a 160 caracteres, lo que muestra Google.
 */
export async function generateMetadata({ params }: PageProps<'/producto/[slug]'>): Promise<Metadata> {
  const producto = await buscar((await params).slug)
  if (!producto) return {}
  const foto = urlFoto(producto.imageUrl)
  return {
    title: producto.name,
    description: producto.description.slice(0, 160) || `${producto.name} de ${producto.brand}, decant 5 ml y 10 ml.`,
    // vista previa al compartir el link por WhatsApp (RNF-02)
    openGraph: foto.endsWith('.svg') ? undefined : { images: [foto] },
  }
}

/**
 * Un bloque de texto de la ficha (Descripción, Notas, etc.).
 * Si el texto está vacío devuelve `null`: en React eso significa "no dibujar nada".
 * `whitespace-pre-line` respeta los saltos de línea que cargó el admin.
 */
function Seccion({ titulo, texto }: { titulo: string; texto: string }) {
  if (!texto) return null
  return (
    <section className="border-t border-arena pt-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide">{titulo}</h2>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-tinta-suave">{texto}</p>
    </section>
  )
}

/**
 * La ficha. Es un Server Component: busca el producto en el servidor.
 * La parte interactiva (elegir medida y cantidad) es SelectorCompra, un Client Component.
 *
 * - Si el producto no existe o está inactivo, `notFound()` corta y muestra not-found.tsx.
 * - `volver`: rearma el link al catálogo con los filtros que traía (?desde=...).
 * - `meta` y `detalle`: `.filter(Boolean)` saca los datos vacíos y `.join(' · ')`
 *   los une; así no quedan separadores sueltos si falta la marca o el género.
 * - A SelectorCompra se le pasan solo los datos que necesita, ya simplificados.
 */
export default async function ProductoPage({ params, searchParams }: PageProps<'/producto/[slug]'>) {
  const producto = await buscar((await params).slug)
  if (!producto) notFound()

  // vuelve al catálogo con los mismos filtros con los que llegó
  const desde = (await searchParams).desde
  const volver = `/decants${queryFiltros(leerFiltros(new URLSearchParams(typeof desde === 'string' ? desde : '')))}`
  const foto = urlFoto(producto.imageUrl)
  const meta = [producto.category?.name, producto.brand].filter(Boolean).join(' · ')
  const detalle = [producto.concentration, etiquetaGenero(producto.gender)].filter(Boolean).join(' · ')

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Link href={volver} className="text-sm text-tinta-suave hover:text-tinta">← Decants</Link>

      {/* En celular va una columna (foto arriba); desde "md" son dos columnas */}
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        {/* `fill` = la imagen ocupa todo el cuadro; `priority` = se carga primero porque se ve de entrada */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-crema-2">
          <Image src={foto} alt={producto.name} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>

        <div className="space-y-5">
          <div>
            {meta && <p className="text-xs uppercase tracking-wide text-tinta-suave">{meta}</p>}
            <h1 className="mt-1 text-3xl font-bold">{producto.name}</h1>
            {detalle && <p className="mt-1 text-sm text-tinta-suave">{detalle}</p>}
          </div>

          {/* US-05: medida, cantidad y "Sumar al pedido" */}
          <SelectorCompra
            producto={{
              slug: producto.slug,
              nombre: producto.name,
              marca: producto.brand,
              imagen: foto,
              variantes: producto.variants.map((v) => ({ id: v.id, medida: v.label, precioCentavos: v.priceCents })),
            }}
          />

          {/* US-06: consulta por WhatsApp con el nombre del perfume ya escrito */}
          <a
            href={linkWhatsApp(`¡Hola Rastro! Quería consultar por ${producto.name}${producto.brand ? ` de ${producto.brand}` : ''}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-full border border-tinta px-5 py-3 text-center text-sm font-semibold hover:bg-crema-2"
          >
            Consultar por esta fragancia
          </a>

          <Seccion titulo="Descripción" texto={producto.description} />
          <Seccion titulo="Notas" texto={producto.notes} />
          <Seccion titulo="Cuándo usarlo" texto={producto.occasions} />
          <Seccion titulo="Cómo lo preparamos" texto={producto.presentation} />
        </div>
      </div>
    </main>
  )
}
