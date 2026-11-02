// PEDIDO ( /pedido ) — US-07.
// La página es un Server Component muy simple: pone el título y deja todo lo
// demás a VistaPedido, que es un Client Component porque el pedido vive en el
// localStorage del navegador (el servidor no lo puede ver).
import type { Metadata } from 'next'
import { VistaPedido } from '@/components/VistaPedido'

export const metadata: Metadata = { title: 'Tu pedido' }

/** Envoltorio de la vista del pedido. */
export default function PedidoPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold">Tu pedido</h1>
      <VistaPedido />
    </main>
  )
}
