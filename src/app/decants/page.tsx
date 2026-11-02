// CATÁLOGO ( /decants ) — US-03. Server Component asíncrono: consulta la base
// en el servidor y manda el HTML ya armado con los productos.
import type { Metadata } from 'next'
import Form from 'next/form'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { TarjetaDecant } from '@/components/TarjetaDecant'
import { productoService } from '@/lib/services'
import { leerFiltros, queryFiltros } from '@/lib/filtros'
import { GENEROS } from '@/lib/formato'
import type { FiltrosCatalogo } from '@/services/ProductoService'

export const metadata: Metadata = { title: 'Decants' }

// Lee la base en cada visita, así los cambios del admin se ven al toque
// (sin esto, Next podría guardar la página armada y mostrar datos viejos).
export const dynamic = 'force-dynamic'

// Opciones de los chips de filtro. `valor: undefined` = "Todos" (sin filtro).
// `Object.entries(GENEROS)` convierte el objeto en pares [clave, texto] para armar las opciones.
const OPCIONES_GENERO = [{ valor: undefined, texto: 'Todos' }, ...Object.entries(GENEROS).map(([valor, texto]) => ({ valor, texto }))]
const OPCIONES_ORIGEN = [
  { valor: undefined, texto: 'Todos' },
  { valor: 'arabes', texto: 'Árabes' },
  { valor: 'disenador', texto: 'Diseñador' },
]

/**
 * Un "chip" de filtro: un link con forma de botón redondeado.
 * Es un componente interno (sin export): solo se usa en esta página.
 * - `children` = lo que va entre <Chip> y </Chip> (el texto).
 * - `scroll={false}` = al cambiar de filtro, la página no salta arriba.
 * - `aria-current` avisa a los lectores de pantalla cuál está elegido.
 * - La clase cambia según `activo`: oscuro si está elegido, borde claro si no.
 */
function Chip({ activo, href, children }: { activo: boolean; href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={activo ? 'true' : undefined}
      className={`rounded-full border px-3 py-1.5 text-sm ${activo ? 'border-tinta bg-tinta text-crema' : 'border-arena hover:border-tostado'}`}
    >
      {children}
    </Link>
  )
}

/**
 * La página del catálogo.
 *
 * Es `async` porque tiene que ESPERAR (`await`) dos cosas:
 * 1. `searchParams`: los parámetros de la URL (en Next 16 llegan como Promise).
 * 2. La consulta al servicio, que va a la base de datos.
 *
 * Paso a paso:
 * - Lee y valida los filtros de la URL.
 * - Le pide al servicio los decants que cumplen esos filtros.
 * - `conFiltro` arma el link de cada chip: conserva los filtros actuales y cambia uno.
 * - `desde` se pasa a la ficha para que "← Decants" vuelva a este mismo resultado.
 */
export default async function DecantsPage({ searchParams }: PageProps<'/decants'>) {
  const filtros = leerFiltros(await searchParams)
  const decants = await productoService.listarDecants(filtros)
  const hayFiltros = Boolean(filtros.genero || filtros.categoria || filtros.q)
  const conFiltro = (cambio: Partial<FiltrosCatalogo>) => `/decants${queryFiltros({ ...filtros, ...cambio })}`
  // La ficha recibe los filtros para que "← Decants" vuelva al mismo resultado
  const desde = queryFiltros(filtros)

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Decants</h1>

      <div className="mt-6 space-y-3">
        {/* Buscador. <Form> de Next: al enviarlo navega a /decants?q=... sin recargar toda la página. */}
        {/* Los inputs ocultos conservan los filtros de género y origen que ya estaban elegidos. */}
        <Form action="/decants" className="flex gap-2">
          {filtros.genero && <input type="hidden" name="genero" value={filtros.genero} />}
          {filtros.categoria && <input type="hidden" name="categoria" value={filtros.categoria} />}
          <label htmlFor="q" className="sr-only">Buscar por nombre o marca</label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={filtros.q}
            placeholder="Buscá por nombre o marca"
            className="w-full max-w-md rounded-full border border-arena bg-white px-4 py-2 text-sm outline-none focus:border-tinta"
          />
          <button className="rounded-full bg-tinta px-4 py-2 text-sm font-semibold text-crema">Buscar</button>
        </Form>

        {/* Chips de género */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-16 text-xs uppercase tracking-wide text-tinta-suave">Género</span>
          {OPCIONES_GENERO.map((o) => (
            <Chip key={o.texto} activo={filtros.genero === o.valor} href={conFiltro({ genero: o.valor })}>
              {o.texto}
            </Chip>
          ))}
        </div>
        {/* Chips de origen */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-16 text-xs uppercase tracking-wide text-tinta-suave">Origen</span>
          {OPCIONES_ORIGEN.map((o) => (
            <Chip key={o.texto} activo={filtros.categoria === o.valor} href={conFiltro({ categoria: o.valor })}>
              {o.texto}
            </Chip>
          ))}
        </div>
      </div>

      {/* Cantidad de resultados ("1 fragancia" o "N fragancias") */}
      <p className="mt-6 text-sm text-tinta-suave">
        {decants.length === 1 ? '1 fragancia' : `${decants.length} fragancias`}
      </p>

      {/* Si hay resultados, la grilla de tarjetas; si no, un mensaje (distinto si hay filtros o no). */}
      {decants.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {decants.map((p) => (
            <TarjetaDecant
              key={p.id}
              producto={p}
              href={`/producto/${p.slug}${desde ? `?desde=${encodeURIComponent(desde.slice(1))}` : ''}`}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-lg border border-arena p-10 text-center">
          <p>{hayFiltros ? 'No encontramos fragancias con esos filtros.' : 'Todavía no hay decants cargados.'}</p>
          {hayFiltros && (
            <Link href="/decants" className="mt-4 inline-block rounded-full bg-tinta px-5 py-2 text-sm font-semibold text-crema">
              Limpiar filtros
            </Link>
          )}
        </div>
      )}
    </main>
  )
}
