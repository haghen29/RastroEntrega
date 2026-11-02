'use client'
// Bloque de compra de la ficha: precio, botones de medida, cantidad y "Sumar al pedido".
// Es Client Component porque reacciona a los clics (useState) y escribe en localStorage.

import Link from 'next/link'
import { useState } from 'react'
import { formatearPrecio } from '@/lib/formato'
import { sumarAlPedido } from '@/lib/pedido'

// Datos que le pasa la ficha (solo lo necesario, ya simplificado)
type Props = {
  producto: {
    slug: string
    nombre: string
    marca: string
    imagen: string
    variantes: { id: number; medida: string; precioCentavos: number }[]
  }
}

/**
 * US-05: elegir medida y cantidad y sumar al pedido.
 *
 * `useState(valorInicial)` devuelve [valor, función para cambiarlo]. Cuando se
 * llama a la función (ej. setCantidad(2)), React vuelve a dibujar el componente
 * con el valor nuevo. Acá hay tres estados:
 * - `elegida`: el id de la medida seleccionada (arranca en la primera, la más chica).
 * - `cantidad`: cuántas unidades (arranca en 1; entre 1 y 20).
 * - `sumado`: si se muestra el aviso "Listo, lo sumamos".
 *
 * Si el producto no tiene ninguna medida activa, muestra "Consultar precio".
 */
export function SelectorCompra({ producto }: Props) {
  const [elegida, setElegida] = useState(producto.variantes[0]?.id)
  const [cantidad, setCantidad] = useState(1)
  const [sumado, setSumado] = useState(false)
  const variante = producto.variantes.find((v) => v.id === elegida)

  if (!variante) {
    return <p className="text-lg">Consultar precio</p>
  }

  // Al tocar "Sumar al pedido": guarda la línea en el pedido, muestra el aviso
  // y vuelve la cantidad a 1 para la próxima vez.
  function sumar() {
    if (!variante) return
    sumarAlPedido({
      variantId: variante.id,
      slug: producto.slug,
      nombre: producto.nombre,
      marca: producto.marca,
      medida: variante.medida,
      precioCentavos: variante.precioCentavos,
      imagen: producto.imagen,
      cantidad,
    })
    setSumado(true)
    setCantidad(1)
  }

  return (
    <div className="space-y-4">
      {/* Precio total según la medida y la cantidad elegidas */}
      <p className="text-2xl font-semibold">{formatearPrecio(variante.precioCentavos * cantidad)}</p>

      {/* Botones de medida. role="radiogroup"/"radio" + aria-checked: los lectores de pantalla los anuncian como opciones */}
      <div role="radiogroup" aria-label="Medida" className="flex gap-2">
        {producto.variantes.map((v) => (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={v.id === elegida}
            onClick={() => {
              setElegida(v.id)
              setSumado(false)
            }}
            className={`rounded-full border px-4 py-2 text-sm ${v.id === elegida ? 'border-tinta bg-tinta text-crema' : 'border-arena hover:border-tostado'}`}
          >
            {v.medida} · {formatearPrecio(v.precioCentavos)}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {/* Selector de cantidad. `(c) => ...` recibe el valor anterior: es la forma segura de actualizar a partir de él */}
        <div className="flex items-center rounded-full border border-arena">
          <button
            type="button"
            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
            disabled={cantidad <= 1}
            className="size-10 disabled:opacity-30"
            aria-label="Restar uno"
          >
            −
          </button>
          <span className="w-8 text-center" aria-live="polite">{cantidad}</span>
          <button
            type="button"
            onClick={() => setCantidad((c) => Math.min(20, c + 1))}
            className="size-10"
            aria-label="Sumar uno"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={sumar}
          className="flex-1 rounded-full bg-tinta px-5 py-3 text-sm font-semibold text-crema hover:opacity-90"
        >
          Sumar al pedido
        </button>
      </div>

      {/* Aviso de confirmación con atajo al pedido */}
      {sumado && (
        <div role="status" className="flex items-center justify-between rounded-lg bg-crema-2 px-4 py-3 text-sm">
          <span>Listo, lo sumamos a tu pedido.</span>
          <Link href="/pedido" className="font-semibold underline underline-offset-4">Ir al pedido</Link>
        </div>
      )}
    </div>
  )
}
