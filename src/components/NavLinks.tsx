'use client'
// Links de navegación del header. Se usan dos veces: en la barra de escritorio
// y dentro del menú de celular (con la prop `movil`).

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Las secciones del menú. Para agregar una, se suma acá.
const SECCIONES = [
  { href: '/decants', texto: 'Decants' },
  { href: '/#perfumes-100ml', texto: 'Perfumes 100 ml' },
]

/**
 * Marca la sección actual (US-02). Es cliente porque necesita la ruta.
 *
 * - `usePathname()` es un hook de Next que devuelve la ruta actual, ej. "/decants".
 * - `{ movil = false }`: valor por defecto si no se pasa la prop.
 * - `actual`: la sección está activa si la ruta empieza con su href.
 *   La de 100 ml se excluye porque es una sección de la home, no una página.
 * - `aria-current="page"` le avisa a los lectores de pantalla cuál es la página actual.
 * - Las clases se arman con una lista y `.join(' ')`: unas dependen de si es
 *   móvil y otras de si está activa.
 */
export function NavLinks({ movil = false }: { movil?: boolean }) {
  const ruta = usePathname()

  return SECCIONES.map(({ href, texto }) => {
    const actual = ruta.startsWith(href) && href !== '/#perfumes-100ml'
    return (
      <Link
        key={href}
        href={href}
        aria-current={actual ? 'page' : undefined}
        // en celular, cierra el menú al elegir una sección
        onClick={(e) => e.currentTarget.closest('details')?.removeAttribute('open')}
        className={[
          movil ? 'rounded px-3 py-2 hover:bg-crema-2' : 'hover:text-tinta',
          actual ? 'font-semibold text-tinta underline underline-offset-4' : 'text-tinta-suave',
        ].join(' ')}
      >
        {texto}
      </Link>
    )
  })
}
