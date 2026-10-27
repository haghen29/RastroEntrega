# HU-03 · Listar decants — Tareas

Estado: **aprobado** (27/10/2026) · ✍️ = escrito, falta correr los tests
Spec: [spec.md](spec.md) · Diseño: [design.md](design.md)

Orden de abajo hacia arriba. 🧪 = primero el test que falla, después el código que lo hace pasar. 👤 = lo corrés vos.

## Bloque 1 · Base para trabajar

- [x] **T1** · Crear `specs/glosario.md` y `specs/nombres.md` con los términos y nombres de esta HU.
- [x] **T2** · 👤 Instalar Vitest (`pnpm add -D vitest`) y crear `vitest.config.mts` con el alias `@/` → `src/`.

## Bloque 2 · Datos (DAO) — CA-1, CA-2

- [x] **T3** · Tipo `ProductoConVariantes` y firma `obtenerDecantsActivos()` en `src/persistence/dao/ProductoDAO.ts`.
- [x] **T4** · Implementar `obtenerDecantsActivos()` en `ProductoDAOImpl.ts`: `kind = 'decant'`, `active = true`, con categoría y variantes activas, ordenado por `sortOrder`.

## Bloque 3 · Reglas de negocio (Service) — CA-4, CA-5, CA-6, CA-7

- [x] **T5** · 🧪 `ProductoServiceImpl.test.ts`: tests de `armarTarjeta` (desde $ más barato, sin variantes → `null`, `mlStock` 4 → sin stock, 5 → con stock, `null` → con stock, foto de Tiendanube → `null`, foto de Blob → se mantiene).
- [x] **T6** · Tipo `TarjetaDecant`, `armarTarjeta()` y `obtenerCatalogoDecants()` en el Service. Los tests de T5 pasan.

## Bloque 4 · Formato — CA-4, CA-8

- [x] **T7** · 🧪 `src/lib/formato.test.ts` + `src/lib/formato.ts`: `formatearPrecio(850000)` → `"$8.500"`, `textoCantidad(1)` → `"1 fragancia"`, `textoCantidad(17)` → `"17 fragancias"`.

## Bloque 5 · Pantalla — CA-1, CA-3, CA-5, CA-6, CA-7, CA-8, CA-9, CA-10

- [ ] **T8** · `next.config.ts`: habilitar `*.public.blob.vercel-storage.com`. Crear `public/decant-generico.svg`. ✍️
- [ ] **T9** · Componente `src/components/TarjetaDecant.tsx`: foto, origen, marca, nombre, concentración, género, "desde $X" / "Consultar precio", etiqueta "Sin stock", link a `/producto/[slug]`. Mobile-first. ✍️
- [ ] **T10** · Página `src/app/decants/page.tsx` (`force-dynamic`): contador, grilla de tarjetas, estado vacío. ✍️
- [ ] **T11** · `src/app/decants/error.tsx`: "No pudimos cargar el catálogo" + botón Reintentar (`retry`). ✍️

## Bloque 6 · Verificar (Fase 5)

- [ ] **T12** · 👤 `pnpm exec vitest run`, `pnpm exec tsc --noEmit`, `pnpm lint` y "Probalo vos" en 360 px. Recorrer CA-1 a CA-10 y actualizar el mapa del flujo y `sprint.md`.
