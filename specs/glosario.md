# Glosario

Términos que aparecen en las specs y el código, con un ejemplo de Rastro.

## DAO
*Data Access Object.* La única capa que habla con la base. Solo consulta y guarda; no decide reglas de negocio.
Ej.: `productoDao.obtenerDecantsActivos()` trae los 17 decants activos de Neon.

## Service
Capa de reglas de negocio. Le pide datos al DAO y los transforma en lo que la pantalla necesita.
Ej.: `armarTarjeta()` decide que Asad sale "desde $8.500" y si está "Sin stock".

## Server Component
Componente de React que corre en el servidor. Puede consultar datos y el navegador recibe HTML ya armado. Es el modo por defecto en `src/app`.
Ej.: `src/app/decants/page.tsx`.

## Client Component
Componente que corre en el navegador, necesario cuando hay interacción (clics, estado). Se marca con `'use client'` en la primera línea.
Ej.: `src/app/decants/error.tsx` (su botón Reintentar).

## Slug
Versión del nombre apta para una URL: minúsculas, sin espacios ni tildes. Es único por producto.
Ej.: "Decant Asad Bourbon" → `decant-asad-bourbon` → `/producto/decant-asad-bourbon`.

## Variante
Cada medida vendible de un perfume, con su propio precio. Tabla `variants`.
Ej.: Asad tiene dos variantes: 5 ml (850000) y 10 ml (1500000).

## Centavos
Los precios se guardan como enteros en centavos para no tener errores de redondeo. Se dividen por 100 recién al mostrar.
Ej.: `850000` → "$8.500".

## Renderizado dinámico
La página se arma de nuevo en cada visita, con datos frescos. Se activa con `export const dynamic = 'force-dynamic'`.
Ej.: si cambiás un precio en Neon, `/decants` lo muestra en la siguiente visita.

## Error boundary
Archivo `error.tsx` que Next muestra cuando algo falla dentro de esa carpeta, en lugar de una pantalla rota.
Ej.: si Neon no responde, `/decants` muestra "No pudimos cargar el catálogo".

## Función pura
Función que, con los mismos datos de entrada, siempre devuelve lo mismo y no toca nada externo (base, red). Es fácil de testear.
Ej.: `armarTarjeta(producto)` y `formatearPrecio(850000)`.

## Test unitario
Código que prueba una función chica de forma automática y dice si pasa o falla.
Ej.: `it("HU-03 · CA-4: usa el precio de la variante más barata", …)`.

## Vitest
Herramienta que corre los tests unitarios: `pnpm exec vitest run`.

## Vercel Blob
Almacenamiento de archivos de Vercel donde viven las fotos de los perfumes. En la base solo se guarda la URL.
Ej.: `https://xxxx.public.blob.vercel-storage.com/decant-asad.webp`.

## remotePatterns
Lista en `next.config.ts` de dominios externos desde los que `next/image` acepta fotos. Un dominio que no está ahí da error.

## Seed
Script con datos iniciales para cargar la base. Ej.: `sql/seed-decants.sql` carga los 17 decants.

## typegen
`pnpm exec next typegen`: genera los tipos de Next (`LayoutProps`, `PageProps`) a partir de las carpetas de `src/app`.
