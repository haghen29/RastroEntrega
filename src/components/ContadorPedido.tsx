'use client'
// Ícono de la bolsa en el header, con la cantidad de productos del pedido.
// Es Client Component porque lee el pedido del localStorage (con usePedido).

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { usePedido } from '@/lib/pedido'

/**
 * Suma las cantidades de todas las líneas del pedido (2 de 9pm + 1 de Khamra = 3).
 * Como usa `usePedido()`, se actualiza solo cada vez que se suma algo, incluso
 * desde otra pestaña.
 * - `sr-only`: texto invisible que solo leen los lectores de pantalla (accesibilidad).
 * - `aria-hidden`: el ícono y el globito no se leen, porque ya lo dice el texto sr-only.
 */
export function ContadorPedido() {
  const cantidad = usePedido().reduce((suma, i) => suma + i.cantidad, 0)

  return (
    <Link
      href="/pedido"
      className="relative flex size-10 items-center justify-center rounded-full hover:bg-crema-2"
    >
      <ShoppingBag size={22} strokeWidth={1.5} aria-hidden />
      <span className="sr-only">Ver pedido ({cantidad} productos)</span>
      {/* El globito con el número solo aparece si hay algo en el pedido */}
      {cantidad > 0 && (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-tinta px-1 text-[11px] font-semibold text-crema"
        >
          {cantidad}
        </span>
      )}
    </Link>
  )
}
