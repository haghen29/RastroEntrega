// HOME ( / ) — US-01. Es un Server Component: se arma en el servidor y llega
// como HTML listo. No consulta la base: todo su contenido es fijo.
import Link from 'next/link'
import { CATALOGOS_100ML, linkWhatsApp } from '@/lib/config'

// Los textos de la home se definen como listas de datos y después se recorren
// con .map(). Así, para agregar una tarjeta, se suma un elemento acá y no se toca el HTML.

// Los sellos de confianza debajo del título
const CONFIANZA = ['100% originales', 'Del frasco original', 'Envíos a todo el país', 'Efectivo y transferencia']

// Accesos por género: cada uno lleva al catálogo con el filtro ya puesto en la URL
const PARA_QUIEN = [
  { titulo: 'Para él', href: '/decants?genero=masculino' },
  { titulo: 'Para ella', href: '/decants?genero=femenino' },
  { titulo: 'Para cualquiera', href: '/decants?genero=unisex' },
]

// Accesos por origen
const ORIGEN = [
  { titulo: 'Árabes', texto: 'Intensos, dulces y con mucha estela.', href: '/decants?categoria=arabes' },
  { titulo: 'Diseñador', texto: 'Las casas clásicas que ya conocés.', href: '/decants?categoria=disenador' },
]

/**
 * Página de inicio. Secciones: portada con botón al catálogo, sellos de
 * confianza, "¿Para quién?", "Elegí por origen" y el bloque de perfumes de 100 ml.
 *
 * - `<Link>` de Next navega sin recargar toda la página (más rápido que un <a>).
 * - Los links externos (Drive, WhatsApp) usan <a> con target="_blank" (pestaña
 *   nueva) y rel="noopener noreferrer" (la página nueva no puede controlar la nuestra).
 * - En `.map()`, cada elemento necesita una `key` única para que React lo identifique.
 */
export default function Home() {
  return (
    <main>
      {/* Portada */}
      <section className="bg-crema-2">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <h1 className="text-4xl font-bold sm:text-5xl">Dejá tu marca.</h1>
          <p className="mt-4 max-w-xl text-lg text-tinta-suave">
            Decants de 5 ml y 10 ml de perfumes originales, preparados del frasco original. Probá
            el aroma que va con vos antes de comprar el frasco completo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/decants" className="rounded-full bg-tinta px-6 py-3 text-sm font-semibold text-crema hover:opacity-90">
              Ver decants
            </Link>
          </div>
        </div>
      </section>

      {/* Sellos de confianza: 2 columnas en celular, 4 desde pantallas "sm" (mobile-first) */}
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 text-center text-sm sm:grid-cols-4">
        {CONFIANZA.map((item) => (
          <li key={item} className="rounded-lg border border-arena px-3 py-4">{item}</li>
        ))}
      </ul>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-2xl font-semibold">¿Para quién?</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {PARA_QUIEN.map((c) => (
            <Link key={c.href} href={c.href} className="rounded-lg border border-arena bg-crema-2 px-6 py-10 text-lg font-semibold hover:border-tostado">
              {c.titulo} →
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-2xl font-semibold">Elegí por origen</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {ORIGEN.map((c) => (
            <Link key={c.href} href={c.href} className="rounded-lg border border-arena bg-crema-2 px-6 py-10 hover:border-tostado">
              <span className="text-lg font-semibold">{c.titulo} →</span>
              <span className="mt-1 block text-sm text-tinta-suave">{c.texto}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* US-09: catálogos de 100 ml en Drive. El id lo usa el link del header. */}
      <section id="perfumes-100ml" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-8">
        <div className="rounded-lg border border-arena p-6 sm:p-10">
          <h2 className="text-2xl font-semibold">Frasco completo: perfumes de 100 ml</h2>
          <p className="mt-2 text-tinta-suave">
            Mirá los catálogos y reservá el tuyo por WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={CATALOGOS_100ML.arabes} target="_blank" rel="noopener noreferrer" className="rounded-full border border-tinta px-5 py-2.5 text-sm font-semibold hover:bg-crema-2">
              Catálogo Árabes
            </a>
            <a href={CATALOGOS_100ML.disenador} target="_blank" rel="noopener noreferrer" className="rounded-full border border-tinta px-5 py-2.5 text-sm font-semibold hover:bg-crema-2">
              Catálogo Diseñador
            </a>
            <a
              href={linkWhatsApp('¡Hola Rastro! Quiero reservar un perfume de 100 ml: ')}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-whatsapp px-5 py-2.5 text-sm font-semibold text-tinta hover:opacity-90"
            >
              Reservar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
