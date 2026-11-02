// Pie de página. Aparece en todas las páginas porque lo incluye layout.tsx.
import Link from 'next/link'
import { INSTAGRAM, LINK_INSTAGRAM, linkWhatsApp } from '@/lib/config'

/**
 * Tres columnas (en celular se apilan): nombre de la tienda, links internos y contacto.
 * Server Component: no tiene interactividad, así que no manda JavaScript al navegador.
 */
export function Footer() {
  return (
    <footer className="mt-16 bg-tinta text-crema">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-semibold">Rastro Perfumería</p>
          <p className="mt-2 text-sm text-arena">Decants de perfumes originales. Berazategui.</p>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/decants" className="hover:underline">Decants</Link>
          {/* /#perfumes-100ml lleva a la home y baja hasta la sección con ese id */}
          <Link href="/#perfumes-100ml" className="hover:underline">Perfumes 100 ml</Link>
          <Link href="/pedido" className="hover:underline">Mi pedido</Link>
        </nav>

        <div className="flex flex-col gap-2 text-sm">
          <a href={linkWhatsApp('¡Hola Rastro!')} target="_blank" rel="noopener noreferrer" className="hover:underline">
            WhatsApp: 11 6284-7444
          </a>
          <a href={LINK_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="hover:underline">
            Instagram: @{INSTAGRAM}
          </a>
        </div>
      </div>
    </footer>
  )
}
