// Encabezado de todas las páginas (lo incluye layout.tsx) — US-02.
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { ContadorPedido } from './ContadorPedido'
import { Logo } from './Logo'
import { NavLinks } from './NavLinks'

/**
 * Barra superior: franja de anuncio, logo, navegación y bolsa del pedido.
 *
 * Es un Server Component que adentro usa dos Client Components (ContadorPedido
 * y NavLinks). Así solo se manda al navegador el JavaScript de las partes
 * que lo necesitan.
 *
 * Mobile-first:
 * - En celular se ve el botón de menú (`sm:hidden` lo oculta desde pantallas sm).
 * - En pantallas más grandes se ven los links (`hidden ... sm:flex`).
 * - `sticky top-0`: el header queda fijo arriba al hacer scroll.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-arena bg-crema/95 backdrop-blur">
      <p className="bg-tinta px-4 py-1.5 text-center text-xs text-crema">
        Envíos a todo el país · 100% originales
      </p>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label="Rastro Perfumería, inicio">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 text-sm sm:flex">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2">
          <ContadorPedido />

          {/* Menú de celular: <details> abre y cierra sin JavaScript */}
          <details className="relative sm:hidden">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full hover:bg-crema-2 [&::-webkit-details-marker]:hidden">
              <Menu size={22} strokeWidth={1.5} aria-hidden />
              <span className="sr-only">Abrir menú</span>
            </summary>
            <nav className="absolute right-0 mt-2 flex w-56 flex-col gap-1 rounded-lg border border-arena bg-crema p-2 text-sm shadow-sm">
              <NavLinks movil />
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
