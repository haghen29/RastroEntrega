import { describe, expect, it } from 'vitest'
import { formatearPrecio, textoCantidad } from './formato'

describe('formatearPrecio', () => {
  it.each([
    [850000, '$8.500'],
    [1500000, '$15.000'],
    [3800000, '$38.000'],
    [0, '$0'],
  ])('HU-03 · CA-4: %s centavos → %s', (centavos, esperado) => {
    expect(formatearPrecio(centavos)).toBe(esperado)
  })
})

describe('textoCantidad', () => {
  it.each([
    [0, '0 fragancias'],
    [1, '1 fragancia'],
    [17, '17 fragancias'],
  ])('HU-03 · CA-8: %s → %s', (n, esperado) => {
    expect(textoCantidad(n)).toBe(esperado)
  })
})
