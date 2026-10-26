---
name: sdd-rastro
description: Guía Spec-Driven Development paso a paso para implementar una historia de usuario de RastroEntrega, explicando problema, operatoria y efecto de cada acción, e iterando hasta que el usuario elija.
---

# SDD en RastroEntrega (spec primero, código después)

Usá esta skill cuando el usuario quiera implementar, especificar o retomar una historia de usuario (HU-XX) de Rastro Perfumería, o diga "hagamos SDD", "arranquemos la HU", "siguiente paso".

El usuario está aprendiendo SDD con una fecha de entrega cercana. El objetivo es doble: que la HU quede bien hecha **y** que el usuario entienda cada decisión. Nunca hagas vibecoding: no se escribe una línea de código de la app hasta que la spec, el diseño y las tareas estén aprobados.

## Fuente de las historias

- Google Doc de HU: fileId `1fsB1XrpkhDiYXV-OrA6XOkqfBEPQaO7Ogqywni1fdHU` (leer con el conector de Google Drive). Si no hay acceso, pedile al usuario que pegue la HU.
- Las HU del doc son **referencia**: el usuario las adapta a su manera. Lo que vale es la spec aprobada en el repo.
- Orden sugerido MVP tienda: HU-03 → HU-04 → HU-07 → HU-08 → HU-09 → HU-12 → HU-13.

## Regla de oro de cada paso (formato obligatorio)

Cada paso que propongas lleva estas cuatro secciones, en este orden y en español simple:

1. **🧩 Problema** — qué necesidad del usuario final o del negocio resuelve este paso, en 2–4 líneas, sin jerga. Si un término técnico es inevitable, linkealo al glosario (ver abajo).
2. **⚙️ Operatoria** — cómo lo vamos a resolver: qué archivos, qué capa, qué datos fluyen. Para el flujo usá el camino real del proyecto: `page/route (src/app) → Service (src/services) → DAO (src/persistence/dao) → Drizzle (src/db) → Neon`.
3. **▶️ Qué pasa cuando se ejecuta** — el efecto concreto y observable: qué archivo se crea o cambia, qué comando corre, qué se ve en el navegador, qué fila cambia en la base, qué puede salir mal y cómo se notaría. Si la acción no se puede deshacer (migración, `db:push`, borrar datos), marcalo con ⚠️ y explicá cómo volver atrás.
4. **🔍 Revisión** — mostrá 2 o 3 opciones (A/B/C) cuando haya una decisión real, con pros y contras en una línea cada una y **tu recomendación**. Cerrá con una pregunta concreta: "¿Vamos con A, preferís B, o querés cambiar algo?".

Después de la revisión **esperá la elección del usuario**. Si sugiere cambios, aplicalos, mostrá solo lo que cambió y volvé a preguntar. Iterá hasta que elija explícitamente ("dale", "va A", "aprobado"). Nunca avances solo de fase.

## Archivos de apoyo (compartidos entre HU)

- `specs/glosario.md` — **glosario vivo**. Cada vez que aparece un término nuevo (DAO, Server Component, slug, hidratación, migración…) agregalo con una definición de 1–2 líneas y un ejemplo de Rastro. En las explicaciones, la primera vez que uses un término linkealo: `[DAO](../glosario.md#dao)`. No lo vuelvas a definir en el texto.
- `specs/nombres.md` — **diccionario de nombres español/inglés**. Convención del proyecto: lógica de negocio, métodos de Service y DAO en español (`obtenerTodos`, `obtenerPorSlug`); lo que impone el framework o la base queda en inglés (`page.tsx`, `route.ts`, columnas `image_url`). Antes de nombrar algo nuevo, revisá este archivo; si el nombre no está, proponelo en la Revisión y agregalo cuando se apruebe. Nunca mezcles `obtenerX` con `getX` para la misma cosa.
- `specs/sprint.md` — **estado de sprint** (ver Fase 0).

Si alguno no existe, crealo la primera vez que haga falta (con aprobación, como cualquier otro paso).

## Fases

Los artefactos de cada HU viven en el repo, en `specs/HU-XX-slug/`, para que queden versionados junto al código.

### Fase 0 · Elegir la HU y ubicarla en el sprint
- Abrí `specs/sprint.md`: muestra la semana actual, las HU que entran, las hechas y las pendientes, y cuántas semanas quedan hasta producción (9/11/2026). Si no está claro qué HU sigue, proponé las que entran esta semana según el orden sugerido y las dependencias, y preguntá.
- Leé la HU del doc, resumila en 3 líneas, listá dependencias con otras HU y qué existe ya en el repo (schema, DAO, servicios). Preguntá si la toma tal cual o la quiere cambiar.
- Al cerrar la HU (Fase 5), actualizá `specs/sprint.md`.

### Fase 1 · Spec (`spec.md`) — el QUÉ
- Historia en formato Como / Quiero / Para.
- Criterios de aceptación reescritos como escenarios verificables y numerados (`CA-1`, `CA-2`…): **Dado** … **Cuando** … **Entonces** … El número es el que se usa en todo lo demás (tareas, comentarios, tests).
- Casos borde (vacío, sin stock, slug inexistente, error de base).
- Fuera de alcance: lo que esta HU **no** hace (evita que crezca).
- Preguntas abiertas: lo que el doc deja ambiguo (ej. "definir regla" de sin stock). No las inventes: preguntalas.

### Fase 2 · Diseño (`design.md`) — el CÓMO
- Cambios de datos: tablas/columnas de `src/db/schema.ts` que se tocan (o "ninguno").
- Contratos: firmas nuevas en las interfaces de DAO y Service **antes** de implementarlas.
- Rutas/páginas de `src/app` y si son Server o Client Components y por qué.
- **Mapa del flujo**: diagrama en texto con los archivos reales, quién llama a quién y qué dato viaja. Ejemplo:
  ```
  navegador GET /decants
    → src/app/decants/page.tsx            (Server Component)
    → productoService.obtenerActivos()    src/services/impl/ProductoServiceImpl.ts
    → productoDao.obtenerActivos()        src/persistence/dao/impl/ProductoDAOImpl.ts
    → db.select().from(products)          src/db/schema.ts → Neon
    ← Product[] → tarjetas con "desde $X"
  ```
  Al terminar la HU, el mapa tiene que coincidir con el código; si cambió, actualizalo.
- **Tests**: qué escenarios `CA-n` se prueban con test automático y dónde. Si Vitest todavía no está instalado, la primera HU que lo necesite propone instalarlo (`pnpm add -D vitest`) como una decisión más, con su ▶️ Qué pasa cuando se ejecuta.
- Antes de proponer APIs de Next.js, leé la guía relevante en `node_modules/next/dist/docs/` (este Next tiene cambios que rompen; ver AGENTS.md).

### Fase 3 · Tareas (`tasks.md`)
Lista numerada de tareas chicas (≤ 30 min cada una), en orden de capas de abajo hacia arriba: schema → DAO → Service → ruta/página → UI. Cada tarea dice qué `CA-n` cubre e incluye su test cuando corresponde (primero el test que falla, después el código que lo hace pasar).

### Fase 4 · Implementar, una tarea por vez
Para cada tarea: aplicá el formato de la regla de oro, mostrá el diff propuesto, esperá OK, aplicalo, y marcá la tarea como hecha en `tasks.md`. El usuario trabaja desde VS Code: indicá la ruta del archivo y el comando exacto para probar (`pnpm dev`, `pnpm lint`, `pnpm build`, `pnpm exec vitest run`).

**Trazabilidad en el código**: cada función, componente o test que implementa un criterio lleva arriba un comentario corto con la HU y el criterio:
```ts
// HU-03 · CA-2: los productos inactivos no aparecen
async obtenerActivos(): Promise<Product[]> { … }
```
Y los tests se nombran igual: `it("HU-03 · CA-2: no lista productos inactivos", …)`. Así, buscando `HU-03` en VS Code (Ctrl+Shift+F) se ve todo lo que toca esa historia.

**Probalo vos**: al final de cada tarea, cerrá con 3 pasos concretos para verla funcionar, por ejemplo:
1. Corré `pnpm dev`.
2. Abrí http://localhost:3000/decants en el celular o con DevTools en 360 px.
3. Tenés que ver 16 tarjetas y ninguna de un producto con `active = false`.
Si el resultado es otro, el usuario lo cuenta y se diagnostica antes de seguir.

### Fase 5 · Verificar contra la spec
Corré los tests (`pnpm exec vitest run`) y recorré cada escenario `CA-n`: decí si lo cubre un test o una prueba manual ("Probalo vos"), y si pasa. Si algo no se cumple, volvé a la tarea correspondiente. Revisá que el mapa del flujo y el glosario estén al día y actualizá `specs/sprint.md`. Cerrá con un resumen de 5 líneas: qué se hizo, qué quedó fuera, qué aprendimos.

## Reglas

- Una HU por vez. Si aparece trabajo de otra HU, anotalo en "Fuera de alcance" y seguí.
- Si el código y la spec no coinciden, la spec manda: o se corrige el código, o se actualiza la spec con aprobación del usuario.
- Respetá la arquitectura en capas: una ruta nunca habla directo con la base.
- Explicá como a alguien que está aprendiendo: frases cortas, un concepto por vez, ejemplos con datos de Rastro (decants, 5 ml / 10 ml, precios en centavos).
- Si el usuario pide ir más rápido, podés agrupar pasos de la Fase 4, pero nunca saltear la aprobación de la spec.
