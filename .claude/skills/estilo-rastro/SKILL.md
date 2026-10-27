---
name: estilo-rastro
description: Estilo visual y de voz de Rastro Perfumería (colores, tipografía, formas, componentes, tono, layout de página y de publicaciones) y qué assets reales usar en vez de inventar formas.
---

# Estilo Rastro

Usá esta skill cada vez que diseñes o toques algo que se ve: una página o componente de la tienda (`src/app`, `src/components`), una tarjeta de producto, el header, el footer, un banner, una imagen para Instagram/WhatsApp o un texto de cara al cliente.

## Regla número uno: no inventar la marca

Rastro tiene logo, isotipo y textura propios. **Nunca los dibujes vos** (ni en SVG, ni con CSS, ni con emojis o íconos parecidos). Siempre:

1. Buscá el asset en `public/marca/` (ver la tabla "Assets" abajo).
2. Si está, usalo con `next/image` y su `alt`.
3. Si no está, dejá un **hueco neutro** (caja `bg-[--color-crema-2]` con el texto "logo pendiente", "foto pendiente") y avisale al usuario qué archivo falta y dónde va. No lo reemplaces con una forma "parecida".

Lo mismo para fotos de producto: si un decant no tiene foto, va `public/producto/decant-generico.webp` (foto real del frasco de decant de Rastro). Hasta que exista, se usa `public/decant-generico.svg`, que **es provisorio y lo dibujó Claude**: no copiar sus formas en otros lados.

## Fuentes de verdad (en este orden)

1. El documento **"estilorastro"** cuando esté en el repo (`docs/estilo-rastro.md` o `docs/estilo-rastro.pdf`). Si contradice esta skill, gana el documento y hay que actualizar la skill.
2. Los assets de `public/marca/`.
3. La v1 online, https://rastroperfumeria.vercel.app, como **referencia** de estructura y tono. No copiarla al 100%: la v2 puede mejorar el diseño.

Los valores marcados con ⚠️ están sin confirmar: no los presentes como oficiales.

## Colores

Definirlos como tokens en `src/app/globals.css`, bloque `@theme` (Tailwind v4, no hay `tailwind.config.ts`). En componentes se usan los tokens (`bg-crema`, `text-tinta`), nunca hex sueltos.

| Token | Valor | Uso | Estado |
|---|---|---|---|
| `--color-crema` | `#faf6f3` | Fondo general de la página | ✅ confirmado (theme-color de la v1) |
| `--color-crema-2` | `#f4f1ec` | Fondo de cajas de foto, chips, huecos | ⚠️ provisorio |
| `--color-arena` | `#e3dacd` | Bordes suaves, separadores | ⚠️ provisorio |
| `--color-tostado` | `#b9ab97` | Detalles, íconos secundarios | ⚠️ provisorio |
| `--color-tinta` | `#171717` | Texto principal, botón primario | ⚠️ provisorio |
| `--color-tinta-suave` | `#8a7b66` | Texto secundario (marca, origen, ml) | ⚠️ provisorio |
| `--color-acento` | ⚠️ a definir | Botón principal / precio, si el estilo lo pide | ⚠️ falta |
| `--color-whatsapp` | `#25d366` | Solo en botones de WhatsApp | ✅ estándar |

Reglas: la página es clara (`color-scheme: light`), sin modo oscuro por ahora. Fondo crema, no blanco puro. El contraste del texto sobre crema tiene que pasar AA (4.5:1).

## Tipografía

⚠️ Pendiente del documento "estilorastro". Mientras tanto:

- Una sola familia para la interfaz (hoy Geist vía `next/font`), cargada con `next/font`, nunca con `<link>` a Google Fonts.
- El logotipo **no se escribe con una fuente**: es imagen (`logotipo.webp`).
- Jerarquía mobile-first: H1 del hero 32–40 px, H2 de sección 22–26 px, nombre de producto 14–16 px semibold, metadatos (origen · marca) 12 px en mayúsculas con `tracking-wide`.

## Formas y componentes

- **Bordes**: redondeo suave (`rounded-lg` en tarjetas, `rounded-full` en chips y botones de píldora ⚠️ confirmar). Bordes de 1 px en `--color-arena`, sin sombras pesadas.
- **Textura**: el fondo del hero usa `marca/textura.webp`, no un gradiente inventado.
- **Íconos**: un solo set de líneas (ej. `lucide-react`, trazo 1.5), del color del texto. Carrito, WhatsApp, Instagram, menú. Nada de emojis en la interfaz.
- **Tarjeta de producto** (`TarjetaDecant`): foto cuadrada (`aspect-square`) sobre `--color-crema-2`; arriba "ORIGEN · MARCA" en chico y mayúsculas; nombre en semibold; "EDP · Masculino"; abajo "desde $8.500" o "Consultar precio". Badge "Sin stock" arriba a la izquierda sobre la foto. Toda la tarjeta es un link.
- **Badges**: género (Masculino / Femenino / Unisex), origen (Árabes / Diseñador), concentración (EDP / EDT / Parfum), "Lo más pedido". Texto corto, sin íconos.
- **Botones**: primario lleno (`--color-tinta` con texto crema), secundario con borde. Textos con verbo en voseo: "Ver decants", "Escribinos", "Sumar al pedido".
- **Grillas**: 2 columnas en mobile, 3 en tablet, 4 en desktop. Gutter lateral de 16 px en mobile.

## Layout de la página (home)

Referencia de la v1, de arriba hacia abajo:

1. **Barra superior** fina: "Envíos a todo el país · 2 a 5 días hábiles · 100% originales".
2. **Header**: `isotipo` + `logotipo-sm`, links Decants · Combos · Perfumes · Nosotros (en mobile, menú hamburguesa), carrito con contador.
3. **Hero**: fondo `textura.webp`, `logotipo.webp`, título "Dejá tu marca.", botones "Ver decants" y "No sé cuál elegir".
4. **Franja de confianza** (4 ítems): 100% originales · Del frasco original · Envíos a todo el país · Efectivo y transferencia.
5. **Para quién**: 3 tarjetas con foto (Para él / Para ella / Para cualquiera).
6. **Origen**: 2 tarjetas con foto (Árabes / Diseñador).
7. **Frasco completo**: perfumes de 100 ml, links a los catálogos de Drive.
8. **¿Qué es un decant?**: 3 pasos numerados.
9. **Lo más pedido**: 8 tarjetas + "Ver el catálogo completo".
10. **Escribinos al DM**: WhatsApp e Instagram, "Conocé a Dani y Santi".
11. **Footer**: `logotipo-claro` sobre fondo oscuro, navegación, teléfono, Instagram (@rastroperfumeria), Berazategui.

En páginas internas (catálogo, ficha, carrito) solo van header y footer: el hero no se repite.

## Ficha de producto (`/producto/[slug]`)

Foto grande arriba en mobile (izquierda en desktop), luego origen · marca, nombre, concentración y género, selector de medida (5 ml / 10 ml) con el precio de cada una, botón "Sumar al pedido", y debajo notas olfativas si existen. Las medidas se eligen con botones tipo píldora, no con un `<select>`.

## Publicaciones (Instagram / WhatsApp)

- Formatos: post 1080×1350 (4:5), historia 1080×1920 (9:16), portada de catálogo 1080×1080.
- Fondo crema o `textura.webp`; el frasco recortado (`producto/<slug>.webp` con fondo transparente) al centro; `isotipo` o `logotipo` chico en una esquina, siempre el mismo lugar.
- Texto: nombre del perfume grande, "Decant 5 ml · 10 ml", precio "desde $X". Como máximo una frase de voz (ver Tono).
- Nunca usar fotos de stock ni frascos de otra marca que no sean el producto real.

## Tono de voz

Cercano, directo, rioplatense con voseo. Frases cortas que hablan de identidad.

- Sí: "Dejá tu marca." · "Encontrá el aroma que realmente va con vos, con asesoramiento de verdad." · "No trabajamos con réplicas." · "Escribinos al DM."
- No: tuteo neutro ("descubre", "tu compra"), mayúsculas gritonas, "¡¡OFERTA!!", promesas que el negocio no cumple.
- Errores y estados vacíos también en voseo y con salida: "No pudimos cargar el catálogo. Reintentá."
- Formato de precio: `$8.500` (punto de miles, sin decimales). Medidas: `5 ml`, con espacio.

## Assets: dónde va cada uno

| Archivo | Formato y tamaño | Uso |
|---|---|---|
| `public/marca/isotipo.svg` (o `.png`) | SVG ideal; si no, PNG/WebP transparente 1024×1024 | Header, favicon, publicaciones |
| `public/marca/isotipo-claro.svg` | Igual, versión clara | Footer y fondos oscuros |
| `public/marca/logotipo.svg` (o `.webp` 1200 px ancho) | SVG o WebP transparente | Hero |
| `public/marca/logotipo-sm.svg` (o `.webp` 400 px ancho) | Igual | Header |
| `public/marca/logotipo-claro.svg` | Igual, versión clara | Footer |
| `public/marca/textura.webp` | WebP 2400×1600, < 300 KB | Fondo del hero y publicaciones |
| `src/app/icon.png` + `src/app/apple-icon.png` | PNG 512×512 y 180×180 | Favicon (convención de Next) |
| `src/app/opengraph-image.png` | PNG 1200×630 | Vista previa al compartir el link |
| `public/home/para-el.webp`, `para-ella.webp`, `unisex.webp` | WebP 1200×1500 (4:5) | Sección "Para quién" |
| `public/home/arabes.webp`, `disenador.webp` | WebP 1200×1500 (4:5) | Sección "Origen" |
| `public/home/frasco-completo.webp` | WebP 1600×900 | Sección 100 ml |
| `public/home/dani-y-santi.webp` | WebP 1200×1200 | "Conocé a Dani y Santi" |
| `public/producto/decant-generico.webp` | WebP 1200×1200, fondo crema | Producto sin foto |
| Fotos de cada decant | WebP 1200×1200, fondo uniforme | Vercel Blob → `image_url` (no en el repo) |
| `docs/estilo-rastro.md` (o `.pdf`) | El documento "estilorastro" | Fuente de verdad de esta skill |

Antes de diseñar, corré `ls public/marca public/home public/producto` para ver qué hay. Lo que falte se reporta, no se inventa.
