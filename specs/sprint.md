# Sprint · MVP

Entrega: **lunes 2/11/2026**. Objetivo: ver un perfume → armar el pedido → mandarlo por WhatsApp, y un admin para gestionar productos.

Proceso: **SDD liviano** — por HU, spec + diseño + tareas en una sola propuesta y una aprobación; las tareas se implementan agrupadas. Nada de código sin aprobación.

| Día | HU | Qué se ve al terminar | Estado |
|---|---|---|---|
| Mar 27 – Mié 28 | HU-03 Listar decants | `/decants` con las 17 tarjetas | 🟡 Diseño + tareas para aprobar |
| Mar 27 – Mié 28 | HU-04 Filtrar por género y origen | `/decants?genero=masculino&categoria=arabes` | ⚪ |
| Jue 29 | HU-07 Ficha de producto | `/producto/decant-asad` | ⚪ |
| Jue 29 | HU-08 Tamaño y cantidad | 5 ml / 10 ml cambia el precio | ⚪ |
| Vie 30 | HU-09 Sumar al pedido + header mínimo | Logo · Decants · carrito con contador | ⚪ |
| Vie 30 | HU-12 Ver y editar el pedido | `/pedido`, guardado en el navegador | ⚪ |
| Vie 30 | HU-13 Enviar por WhatsApp | Abre wa.me con el detalle y el total | ⚪ |
| Sáb 31 | HU-22 Login de admin (un solo usuario) | `/admin` pide contraseña | ⚪ |
| Sáb 31 | HU-23 CRUD de productos | Crear, editar y desactivar perfumes | ⚪ |
| Dom 1/11 | HU-24 Variantes y precios | Cargar 5 ml / 10 ml desde `/admin` | ⚪ |
| Dom 1/11 | HU-25 Subir imágenes (Vercel Blob) | Subir la foto desde `/admin` | ⚪ |
| Dom 1/11 | HU-01 Home mínima (+ links de HU-17) | Ver decants / Ver perfumes · por género · por origen · catálogos de perfumes (Drive) | ⚪ |
| Lun 2/11 | Deploy en Vercel | 🚀 | ⚪ |

**Si un día se atrasa, se corta en este orden:** 1) HU-25 → fotos a mano desde el panel de Vercel · 2) HU-01 → `/` redirige a `/decants` · 3) HU-04 → post-MVP.

## Pedido para HU-01 (27/10, del usuario)

De arriba hacia abajo:
1. Dos botones: **Ver decants** (→ `/decants`) y **Ver perfumes** (baja a la sección 4 de la misma página).
2. **Decants según género:** Masculino · Femenino · Unisex → `/decants?genero=…` (necesita HU-04).
3. **Decants según origen:** Árabes · Diseñador → `/decants?categoria=…` (necesita HU-04).
4. **Catálogos de perfumes:** links a los Drive de Árabes y Diseñador (HU-17 reducida; sin página `/100ml`).

## Post-MVP

- Combos: HU-15, HU-16, HU-27 (la sección Combos no aparece en el menú).
- Pedidos en el admin: HU-14, HU-29 (los pedidos van solo por WhatsApp).
- Contenido informativo: HU-18, HU-19, HU-20, HU-21.
- HU-02 completa (drawer y footer), HU-05 Buscar, HU-06 Ordenar, HU-10 Consultar, HU-11 Relacionados, HU-17 completa (página `/100ml` y links editables desde admin), HU-26 Destacados, HU-28 Configuración (el número de WhatsApp va en `.env.local`).

## Hechas

—

## Notas

- 27/10: la entrega pasó del 9/11 al 2/11. El único admin es Santino.
- 27/10: se borró `ProductoServiceAdmImpl` (rompía el build) y `src/app/api/productos/routes.ts` (Next no lo reconocía).
- 27/10: se borró `my-app/` (copia vieja que rompía `tsc`); su `.env.local` se movió a la raíz.
- 27/10: orden de la raíz: `BDRastro.txt` → `sql/seed-decants.sql`, trampas de `readme.txt` → `docs/notas-tecnicas.md`.
- **Después de la entrega:** aplanar las carpetas de afuera (`rastro-perfumeria joji\Rastroentrega\RastroEntrega` → `Prog\rastro-entrega`).
