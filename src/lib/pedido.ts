'use client'
// 'use client' = este código corre en el NAVEGADOR del cliente, no en el servidor.
// Hace falta porque usa localStorage y window, que solo existen en el navegador.
//
// El pedido (carrito) se guarda en el localStorage del navegador: no hay tabla
// de pedidos ni cuentas de usuario. Si el cliente cierra la pestaña y vuelve,
// el pedido sigue ahí. Al final se manda por WhatsApp.
//
// Este archivo es un "store" chico: guarda el estado en una variable, avisa a
// los componentes cuando cambia, y React los vuelve a dibujar.

import { useSyncExternalStore } from 'react'
import { formatearPrecio } from './formato'

// Una línea del pedido. Se guarda una copia del nombre y el precio para
// poder mostrar el pedido sin volver a consultar la base.
export type ItemPedido = {
  variantId: number
  slug: string
  nombre: string
  marca: string
  medida: string
  precioCentavos: number
  imagen: string
  cantidad: number
}

// Datos opcionales que el cliente completa en /pedido.
// `'' | 'envio' | 'retiro'` = solo puede valer uno de esos tres textos.
export type DatosCliente = {
  nombre: string
  localidad: string
  entrega: '' | 'envio' | 'retiro'
}

// Nombre con el que se guarda el pedido en localStorage
const CLAVE = 'rastro-pedido'
// Una única lista vacía compartida. React compara por referencia: si devolviéramos
// un [] nuevo cada vez, creería que el pedido cambió y redibujaría sin parar.
const VACIO: ItemPedido[] = []

// Estado del módulo: la lista actual en memoria, si ya se leyó del localStorage
// y la lista de "oyentes" (funciones de React a las que hay que avisar cuando cambia).
let items: ItemPedido[] = VACIO
let cargado = false
const oyentes = new Set<() => void>()

/**
 * Devuelve el pedido actual. La primera vez lo lee del localStorage; después
 * usa la copia en memoria (más rápido).
 * `try/catch`: si el JSON guardado está roto (o el navegador bloquea el
 * almacenamiento), en vez de romper la página arranca con el pedido vacío.
 */
function leer(): ItemPedido[] {
  if (!cargado) {
    cargado = true
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE) ?? '[]')
      items = Array.isArray(guardado) ? guardado : VACIO
    } catch {
      items = VACIO
    }
  }
  return items
}

/**
 * Reemplaza el pedido por uno nuevo, lo guarda en localStorage (como texto JSON)
 * y avisa a todos los oyentes para que React redibuje el contador y la página del pedido.
 */
function escribir(nuevos: ItemPedido[]) {
  items = nuevos
  try {
    localStorage.setItem(CLAVE, JSON.stringify(nuevos))
  } catch {
    // modo privado o almacenamiento bloqueado: el pedido vive solo en memoria
  }
  oyentes.forEach((avisar) => avisar())
}

/**
 * React llama a esta función cuando un componente empieza a usar el pedido.
 * Recibe `avisar`, que hay que llamar cada vez que el pedido cambie.
 * Devuelve otra función: React la llama cuando el componente desaparece,
 * para dejar de escuchar (si no, se acumularían oyentes viejos).
 */
function suscribir(avisar: () => void) {
  oyentes.add(avisar)
  // si el pedido cambia en otra pestaña, se vuelve a leer
  // (el evento 'storage' lo dispara el navegador en las OTRAS pestañas del sitio)
  const alCambiarEnOtraPestana = (e: StorageEvent) => {
    if (e.key === CLAVE) {
      cargado = false
      avisar()
    }
  }
  window.addEventListener('storage', alCambiarEnOtraPestana)
  return () => {
    oyentes.delete(avisar)
    window.removeEventListener('storage', alCambiarEnOtraPestana)
  }
}

/**
 * Suma un producto al pedido (botón "Sumar al pedido" de la ficha).
 * Si esa misma medida ya estaba, suma las cantidades en vez de duplicar la línea.
 * - `find` busca el primer ítem que cumpla la condición.
 * - `map` arma una lista nueva cambiando solo el ítem que coincide.
 * - `{ ...i, cantidad: ... }` copia el ítem y pisa solo la cantidad.
 * - `[...actual, item]` = una lista nueva con todo lo anterior más el ítem nuevo.
 * Nunca se modifica la lista vieja: siempre se arma una nueva (así React detecta el cambio).
 */
export function sumarAlPedido(item: ItemPedido) {
  const actual = leer()
  const existente = actual.find((i) => i.variantId === item.variantId)
  escribir(
    existente
      ? actual.map((i) =>
          i.variantId === item.variantId ? { ...i, cantidad: i.cantidad + item.cantidad } : i,
        )
      : [...actual, item],
  )
}

/** Cambia la cantidad de una línea (botones − y + de /pedido). Nunca baja de 1. */
export function cambiarCantidad(variantId: number, cantidad: number) {
  if (cantidad < 1) return
  escribir(leer().map((i) => (i.variantId === variantId ? { ...i, cantidad } : i)))
}

/** Saca una línea del pedido. `filter` se queda con todos los ítems menos ese. */
export function quitarDelPedido(variantId: number) {
  escribir(leer().filter((i) => i.variantId !== variantId))
}

/**
 * Hook propio: un componente lo usa así: `const items = usePedido()`.
 * Cada vez que el pedido cambia (acá o en otra pestaña), el componente se redibuja.
 *
 * `useSyncExternalStore` es el hook de React para conectarse con datos que
 * viven FUERA de React (acá, localStorage). Recibe:
 * 1. cómo suscribirse a los cambios,
 * 2. cómo leer el valor actual, y
 * 3. qué valor usar en el servidor, donde no hay localStorage: la lista vacía.
 */
export function usePedido(): ItemPedido[] {
  return useSyncExternalStore(suscribir, leer, () => VACIO)
}

/**
 * Total del pedido en centavos.
 * `reduce` recorre la lista acumulando un resultado: arranca en 0 y a cada
 * vuelta suma precio × cantidad del ítem.
 */
export function totalPedido(lista: ItemPedido[]): number {
  return lista.reduce((suma, i) => suma + i.precioCentavos * i.cantidad, 0)
}

/**
 * Arma el texto que se manda por WhatsApp, por ejemplo:
 *   ¡Hola Rastro! Quiero hacer este pedido:
 *
 *   • Decant 9pm (Afnan) — 5 ml x2 — $17.000
 *
 *   Total: $17.000
 *
 *   Nombre: Juan
 * Los datos del cliente son opcionales: `.filter(Boolean)` saca los que están
 * vacíos. `.join('\n')` une todas las líneas con saltos de línea.
 */
export function mensajePedido(lista: ItemPedido[], cliente: DatosCliente): string {
  const lineas = lista.map(
    (i) =>
      `• ${i.nombre}${i.marca ? ` (${i.marca})` : ''} — ${i.medida} x${i.cantidad} — ${formatearPrecio(i.precioCentavos * i.cantidad)}`,
  )
  // `a && b`: si `a` está vacío da '' (y después se descarta); si no, da el texto `b`
  const datos = [
    cliente.nombre && `Nombre: ${cliente.nombre}`,
    cliente.localidad && `Localidad: ${cliente.localidad}`,
    cliente.entrega && `Entrega: ${cliente.entrega === 'envio' ? 'Envío' : 'Retiro'}`,
  ].filter(Boolean)

  return [
    '¡Hola Rastro! Quiero hacer este pedido:',
    '',
    ...lineas,
    '',
    `Total: ${formatearPrecio(totalPedido(lista))}`,
    ...(datos.length ? ['', ...datos] : []),
  ].join('\n')
}
