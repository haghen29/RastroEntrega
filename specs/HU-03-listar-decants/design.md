# HU-03 · Listar decants — Diseño

Estado: **aprobado** (27/10/2026)
Spec: [spec.md](spec.md)

## Decisiones

| # | Decisión | Elegido (27/10) |
|---|---|---|
| D1 | Cuándo se arma la página | `force-dynamic`: en cada visita |
| D2 | Nombres | `obtenerDecantsActivos`, `obtenerCatalogoDecants`, `TarjetaDecant`, `armarTarjeta`, `formatearPrecio`, `textoCantidad` |
| D3 | Tests | Vitest para `armarTarjeta` y `formato` |
| D4 | Dónde viven las fotos | **Vercel Blob**. Hasta HU-25 se suben a mano desde el panel de Vercel y la URL se pega en `image_url`. Originales respaldados en Drive. |
| D5 | Fotos de otro dominio (ej. Tiendanube) | `armarTarjeta` las trata como "sin foto" → imagen genérica (CA-7). Así un link viejo nunca rompe la página. |

## 1. Cambios de datos

Ninguno. `src/db/schema.ts` ya tiene todo lo necesario:

| Necesidad | Columna |
|---|---|
| Activo / tipo | `products.active`, `products.kind` |
| Datos de la tarjeta | `name`, `brand`, `concentration`, `gender`, `imageUrl`, `slug` |
| Origen | `categories.name` vía `products.categoryId` |
| "desde $X" | `variants.priceCents` + `variants.active` |
| Sin stock | `products.mlStock` |

## 2. Contratos (firmas antes de implementar)

### DAO · `src/persistence/dao/ProductoDAO.ts`

```ts
// Producto con su categoría y solo sus variantes activas
export type ProductoConVariantes = Product & {
  category: Category | null
  variants: Variant[]
}

export interface ProductoDAO {
  obtenerTodos(): Promise<Product[]>
  obtenerPorId(id: number): Promise<Product | null>
  // HU-03 · CA-1, CA-2: kind = 'decant' y active = true, ordenados por sortOrder
  obtenerDecantsActivos(): Promise<ProductoConVariantes[]>
}
```

### Service · `src/services/ProductoService.ts`

```ts
// Lo que necesita una tarjeta del catálogo, ya con las reglas de negocio aplicadas
export type TarjetaDecant = {
  slug: string
  nombre: string
  marca: string
  concentracion: string
  genero: string
  origen: string | null            // null si no tiene categoría
  imageUrl: string | null          // null → imagen genérica (CA-7)
  precioDesdeCentavos: number | null  // null → "Consultar precio" (CA-5)
  sinStock: boolean                // CA-6
}

export interface ProductoService {
  obtenerTodos(): Promise<Product[]>
  obtenerPorId(id: number): Promise<Product | null>
  // HU-03 · CA-1 a CA-7
  obtenerCatalogoDecants(): Promise<TarjetaDecant[]>
}
```

Las reglas de CA-4, CA-5 y CA-6 viven en una función pura dentro del Service, `armarTarjeta(producto)`, exportada para poder testearla sin base:

- `precioDesdeCentavos` = el menor `priceCents` de las variantes activas; `null` si no hay ninguna. El DAO ya trae solo las activas, pero `armarTarjeta` vuelve a filtrar para que la regla de CA-4 se pueda testear sola.
- `sinStock` = `mlStock !== null && mlStock < 5`.

### Formato · `src/lib/formato.ts`

```ts
formatearPrecio(centavos: number): string     // 850000 → "$8.500"
textoCantidad(n: number): string               // 1 → "1 fragancia", 16 → "16 fragancias"
```

## 3. Rutas y componentes

| Archivo | Tipo | Por qué |
|---|---|---|
| `src/app/decants/page.tsx` | Server Component | Consulta datos en el servidor; el celular recibe HTML ya armado (RNF-03). Sin interactividad. |
| `src/app/decants/error.tsx` | Client Component (`'use client'`) | Next lo exige: es la pantalla de "algo salió mal" con botón Reintentar (prop `retry` en Next 16). |
| `src/components/TarjetaDecant.tsx` | Server Component | Solo muestra datos y un `<Link>`; no necesita estado. HU-01 y HU-04 la reusan. |
| `public/decant-generico.svg` | Archivo estático | Imagen genérica de CA-7. |

**Renderizado:** `export const dynamic = 'force-dynamic'` en `page.tsx` (ver decisión D1).
**Imágenes:** `next/image`. En `next.config.ts` se habilita un solo dominio externo, el de Vercel Blob:

```ts
images: {
  remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
}
```

`armarTarjeta` solo deja pasar `imageUrl` que empiece con `https://` y termine en ese dominio, o que sea local (`/...`); cualquier otra cosa → `null` → imagen genérica (D5).

## 4. Mapa del flujo

```
navegador GET /decants
  → src/app/decants/page.tsx                    (Server Component, force-dynamic)
  → productoService.obtenerCatalogoDecants()    src/services/impl/ProductoServiceImpl.ts
      → productoDao.obtenerDecantsActivos()     src/persistence/dao/impl/ProductoDAOImpl.ts
          → db.query.products.findMany({ where kind='decant' AND active,
               with: { category, variants (active) }, orderBy sortOrder })
                                                src/db/schema.ts → Neon
          ← ProductoConVariantes[]
      → armarTarjeta() por cada uno             (CA-4, CA-5, CA-6)
  ← TarjetaDecant[]
  → textoCantidad(n)  → "17 fragancias"         src/lib/formato.ts      (CA-8)
  → si n = 0 → "Todavía no hay decants cargados"                          (CA-10)
  → <TarjetaDecant> × n                         src/components/TarjetaDecant.tsx
      → <Link href="/producto/[slug]">          (CA-9)
      → <Image> foto o /decant-generico.svg     (CA-3, CA-7)
      → formatearPrecio() → "desde $8.500" | "Consultar precio" | "Sin stock"
si Neon falla → src/app/decants/error.tsx       ("No pudimos cargar el catálogo" + Reintentar)
```

## 5. Tests

| CA | Cómo se verifica | Dónde |
|---|---|---|
| CA-4, CA-5, CA-6, CA-7 | Test automático de `armarTarjeta` | `src/services/impl/ProductoServiceImpl.test.ts` |
| CA-4, CA-8 | Test automático de `formatearPrecio` y `textoCantidad` | `src/lib/formato.test.ts` |
| CA-1, CA-2, CA-3, CA-9, CA-10 | Prueba manual ("Probalo vos") contra Neon con el seed | — |

Requiere instalar Vitest (decisión D3).

## 6. Fuera de este diseño

- `src/app/page.tsx` consulta `db` directo (salta capas). Es la página descartable: se reemplaza en HU-01.
- `obtenerTodos` / `obtenerPorId` quedan como están; HU-07 decide si `obtenerPorId` se reemplaza por `obtenerPorSlug`.
