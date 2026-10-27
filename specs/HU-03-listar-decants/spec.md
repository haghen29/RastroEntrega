# HU-03 · Listar decants — Spec

Estado: **aprobada** (27/10/2026)

## Historia

**Como** visitante, **quiero** ver todos los decants disponibles, **para** explorar opciones.

## Criterios de aceptación

- **CA-1** · **Dado** que hay decants activos, **cuando** entro a `/decants`, **entonces** veo una tarjeta por cada uno.
- **CA-2** · **Dado** un producto con `active = false`, o con `kind` distinto de `'decant'`, **cuando** entro a `/decants`, **entonces** no aparece.
- **CA-3** · **Dado** un decant listado, **entonces** su tarjeta muestra imagen, origen (nombre de la categoría: Árabes / Diseñador), marca, nombre, concentración (EDP/EDT) y género.
- **CA-4** · **Dado** un decant con variantes activas, **entonces** la tarjeta dice "desde $X", donde X es el precio de la variante activa más barata. Ej.: 5 ml = 850000 centavos y 10 ml = 1500000 centavos → "desde $8.500".
- **CA-5** · **Dado** un decant activo sin ninguna variante activa, **entonces** la tarjeta se muestra igual, pero en lugar de "desde $X" dice "Consultar precio".
- **CA-6** · **Dado** un decant con `mlStock` cargado y menor que la medida más chica (5 ml), **entonces** la tarjeta muestra la etiqueta "Sin stock". Si `mlStock` es `null`, el stock no se controla y no se muestra la etiqueta. El stock de cada variante (`variants.stock`) no se usa en esta HU.
- **CA-7** · **Dado** un decant sin foto (`imageUrl` vacío o `null`) o con una foto fuera de Vercel Blob (ej. un link viejo de Tiendanube), **entonces** la tarjeta muestra una imagen genérica.
- **CA-8** · **Dado** N decants listados, **entonces** arriba de las tarjetas se lee "N fragancias", o "1 fragancia" si hay uno solo.
- **CA-9** · **Cuando** toco una tarjeta, **entonces** se abre `/producto/[slug]` de ese decant.
- **CA-10** · **Dado** que no hay ningún decant activo, **cuando** entro a `/decants`, **entonces** veo el mensaje "Todavía no hay decants cargados".

## Casos borde

- Base caída o lenta: se muestra un mensaje de error amigable, no una pantalla rota.
- `mlStock = 0`: aparece "Sin stock", por CA-6.
- Producto sin categoría (`categoryId = null`): la tarjeta no muestra el origen y el resto se ve igual.
- Slug inexistente al tocar la tarjeta: no corresponde, porque las tarjetas salen de la base. Hasta HU-07, `/producto/[slug]` da 404 (es lo esperado).

## Fuera de alcance

- Filtros por género y origen (HU-04), búsqueda (HU-05), orden (HU-06).
- Ficha de producto (HU-07) y stock por variante (HU-08).
- Subir fotos desde `/admin` (HU-25). Acá solo se muestran; hasta HU-25 se cargan a mano en Vercel Blob.
- Header y menú (HU-02) y Home (HU-01).
- Catálogo de 100 ml (HU-17): vive en links a Drive, no en esta página.

## Preguntas abiertas

— (resueltas el 27/10: ruta `/decants`, sin stock por `mlStock`, sin variantes → "Consultar precio", sin foto → imagen genérica)
