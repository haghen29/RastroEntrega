'use client'
// Contenido de /pedido: la lista del pedido, el total, los datos del cliente y
// el botón para mandarlo por WhatsApp. Es Client Component porque el pedido
// está en el localStorage del navegador.

import Image from 'next/image'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { linkWhatsApp } from '@/lib/config'
import { formatearPrecio } from '@/lib/formato'
import {
  cambiarCantidad,
  mensajePedido,
  quitarDelPedido,
  totalPedido,
  usePedido,
  type DatosCliente,
} from '@/lib/pedido'

const CAMPO = 'w-full rounded-lg border border-arena bg-white px-3 py-2 text-sm outline-none focus:border-tinta'

/**
 * US-07: revisar, editar y mandar el pedido por WhatsApp.
 *
 * - `usePedido()` trae las líneas y redibuja cuando cambian.
 * - `useState` guarda los datos del cliente (nombre, localidad, entrega).
 *   Cada input es "controlado": muestra `cliente.x` y al escribir llama a
 *   `setCliente({ ...cliente, x: nuevo })` (copia todo y cambia un solo campo).
 * - Si el pedido está vacío, muestra un mensaje con un link al catálogo.
 * - El botón final es un link a wa.me con el mensaje armado por `mensajePedido`.
 *   No hay pago online: se coordina por chat.
 */
export function VistaPedido() {
  const items = usePedido()
  const [cliente, setCliente] = useState<DatosCliente>({ nombre: '', localidad: '', entrega: '' })

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-arena p-10 text-center">
        <p>Tu pedido está vacío.</p>
        <Link href="/decants" className="mt-4 inline-block rounded-full bg-tinta px-5 py-2 text-sm font-semibold text-crema">
          Ver decants
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-8">
      {/* Una fila por línea del pedido: foto, nombre, medida, precio, − / + y Quitar */}
      <ul className="divide-y divide-arena border-y border-arena">
        {items.map((i) => (
          <li key={i.variantId} className="flex gap-4 py-4">
            <Link href={`/producto/${i.slug}`} className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-crema-2">
              <Image src={i.imagen} alt={i.nombre} fill sizes="80px" className="object-cover" />
            </Link>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex justify-between gap-2">
                <div>
                  <p className="font-semibold">{i.nombre}</p>
                  <p className="text-xs text-tinta-suave">
                    {[i.marca, i.medida].filter(Boolean).join(' · ')} · {formatearPrecio(i.precioCentavos)} c/u
                  </p>
                </div>
                <p className="font-semibold">{formatearPrecio(i.precioCentavos * i.cantidad)}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border border-arena text-sm">
                  <button
                    type="button"
                    onClick={() => cambiarCantidad(i.variantId, i.cantidad - 1)}
                    disabled={i.cantidad <= 1}
                    className="size-8 disabled:opacity-30"
                    aria-label={`Restar uno de ${i.nombre}`}
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{i.cantidad}</span>
                  <button
                    type="button"
                    onClick={() => cambiarCantidad(i.variantId, i.cantidad + 1)}
                    className="size-8"
                    aria-label={`Sumar uno de ${i.nombre}`}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => quitarDelPedido(i.variantId)}
                  className="flex items-center gap-1 text-xs text-tinta-suave hover:text-tinta"
                >
                  <Trash2 size={14} strokeWidth={1.5} aria-hidden /> Quitar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>{formatearPrecio(totalPedido(items))}</span>
      </p>

      {/* Datos opcionales del cliente; se agregan al mensaje de WhatsApp si se completan */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">Tus datos (opcional)</legend>
        <input
          aria-label="Nombre"
          placeholder="Nombre"
          maxLength={60}
          value={cliente.nombre}
          onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
          className={CAMPO}
        />
        <input
          aria-label="Localidad"
          placeholder="Localidad"
          maxLength={60}
          value={cliente.localidad}
          onChange={(e) => setCliente({ ...cliente, localidad: e.target.value })}
          className={CAMPO}
        />
        <div className="flex gap-4 text-sm">
          {(['envio', 'retiro'] as const).map((opcion) => (
            <label key={opcion} className="flex items-center gap-2">
              <input
                type="radio"
                name="entrega"
                checked={cliente.entrega === opcion}
                onChange={() => setCliente({ ...cliente, entrega: opcion })}
              />
              {opcion === 'envio' ? 'Envío' : 'Retiro'}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <a
          href={linkWhatsApp(mensajePedido(items, cliente))}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-full bg-whatsapp px-5 py-3 text-center font-semibold text-tinta hover:opacity-90"
        >
          Enviar pedido por WhatsApp
        </a>
        <p className="text-center text-xs text-tinta-suave">
          El pago es en efectivo o transferencia y lo coordinamos por chat.
        </p>
      </div>
    </div>
  )
}
