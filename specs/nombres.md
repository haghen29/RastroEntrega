# Diccionario de nombres

Regla: lógica de negocio, métodos de Service y DAO, tipos propios y sus campos → **español, camelCase**. Lo que impone el framework o la base → **inglés** (`page.tsx`, `route.ts`, `error.tsx`, columnas `image_url`, campos del schema `priceCents`).

Antes de nombrar algo nuevo, buscalo acá. Nunca mezclar `obtenerX` con `getX` para la misma cosa.

## Verbos

| Uso | Nombre | No usar |
|---|---|---|
| Leer una lista | `obtenerTodos`, `obtener<Algo>` | `get…`, `listar…`, `fetch…` |
| Leer uno | `obtenerPorId`, `obtenerPorSlug` | `getById`, `buscar…` |
| Convertir datos en otra forma | `armar<Algo>` | `map…`, `build…` |
| Dar formato para mostrar | `formatear<Algo>`, `texto<Algo>` | `format…` |

## Nombres en uso

| Nombre | Qué es | Dónde | HU |
|---|---|---|---|
| `ProductoDAO` / `ProductoDAOImpl` | DAO de productos | `src/persistence/dao/` | — |
| `ProductoService` / `ProductoServiceImpl` | Service de productos | `src/services/` | — |
| `productoDao`, `productoService` | Instancias listas para usar | `src/lib/daos.ts`, `src/lib/services.ts` | — |
| `ProductoConVariantes` | Producto + categoría + variantes activas | `ProductoDAO.ts` | HU-03 |
| `obtenerDecantsActivos` | DAO: decants activos con relaciones | `ProductoDAO.ts` | HU-03 |
| `TarjetaDecant` (tipo) | Datos listos para una tarjeta | `ProductoService.ts` | HU-03 |
| `obtenerCatalogoDecants` | Service: lista de tarjetas | `ProductoService.ts` | HU-03 |
| `armarTarjeta` | Producto → tarjeta (reglas CA-4 a CA-7) | `ProductoServiceImpl.ts` | HU-03 |
| `precioDesdeCentavos`, `sinStock`, `origen` | Campos de `TarjetaDecant` | `ProductoService.ts` | HU-03 |
| `formatearPrecio` | 850000 → "$8.500" | `src/lib/formato.ts` | HU-03 |
| `textoCantidad` | 17 → "17 fragancias" | `src/lib/formato.ts` | HU-03 |
| `TarjetaDecant` (componente) | Tarjeta del catálogo | `src/components/TarjetaDecant.tsx` | HU-03 |

## Pendientes de ordenar

- `ProductoDAOAdm` / `ProductoServiceAdm` usan `EliminarProducto`, `EditarProducto`, `CrearProducto` (con mayúscula). Se renombran a `eliminar`, `editar`, `crear` en HU-23.
