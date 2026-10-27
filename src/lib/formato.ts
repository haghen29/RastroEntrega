// "always": sin esto, el español no pone punto en números de 4 cifras (8500 en vez de 8.500)
const pesos = new Intl.NumberFormat('es-AR', {
  maximumFractionDigits: 0,
  useGrouping: 'always',
})

// HU-03 · CA-4: los precios viven en centavos; se dividen recién al mostrar
export function formatearPrecio(centavos: number): string {
  return `$${pesos.format(centavos / 100)}`
}

// HU-03 · CA-8
export function textoCantidad(n: number): string {
  return n === 1 ? '1 fragancia' : `${n} fragancias`
}
