---
name: recortar-codigo-basura
description: Detecta y recorta código basura en RastroEntrega (archivos, exports, imports y dependencias sin uso, código comentado, duplicados, restos de plantilla), explicando cada borrado y pidiendo aprobación.
---

# Recortar código basura en RastroEntrega

Usá esta skill cuando el usuario pida limpiar el código, "sacar lo que sobra", reducir líneas, o al cerrar una HU antes del commit final.

El objetivo es menos código para entender, no código "más lindo". Cada cosa que se borra tiene que estar justificada y aprobada.

## 1 · Relevar (sin tocar nada)

Corré, en este orden, y juntá los resultados:

```bash
pnpm exec tsc --noEmit          # errores de tipos y archivos rotos
pnpm lint                       # imports/variables sin uso
pnpm dlx knip                   # archivos, exports y dependencias sin uso
```

Además revisá a mano:
- Código comentado, `console.log`, `TODO` viejos.
- Restos de la plantilla de Create Next App (`public/*.svg` sin referencias, estilos de ejemplo en `globals.css`, contenido demo en `page.tsx`).
- Funciones duplicadas entre capas (ej. la misma consulta en dos DAO).
- Interfaces o clases declaradas que nadie instancia (ver `src/lib/daos.ts` y `src/lib/services.ts`).
- Archivos que Next.js no reconoce por nombre (ej. un route handler tiene que llamarse `route.ts`; confirmalo en `node_modules/next/dist/docs/`).
- Dependencias de `package.json` que no se importan en ningún lado.
- Documentación duplicada o desactualizada (dos README que dicen cosas distintas).

## 2 · Clasificar

Presentá una tabla con tres grupos:

| Grupo | Significa |
|---|---|
| 🟢 Seguro de borrar | Nadie lo referencia y no lo pide ninguna HU |
| 🟡 Revisar | Parece sin uso pero puede servir para una HU próxima (citala) |
| 🔴 Mantener | Lo usa Next.js por convención, una HU aprobada o la arquitectura |

Para cada ítem: archivo/línea, qué es, por qué cae en ese grupo, y cuántas líneas se ahorran.

## 3 · Explicar y pedir aprobación

Por cada grupo de cambios usá el mismo formato que la skill de SDD:
- **🧩 Problema**: por qué molesta este código (confunde, rompe el build, suma peso).
- **⚙️ Operatoria**: qué se borra o se fusiona.
- **▶️ Qué pasa al ejecutarlo**: qué deja de existir, qué podría romperse y cómo lo vamos a notar.
- **🔍 Revisión**: "¿Borro todo el grupo 🟢, elegís ítems, o lo dejamos?". Esperá la elección e iterá.

Nunca borres un 🟡 o 🔴 sin que el usuario lo pida explícitamente.

## 4 · Recortar en pasos chicos

- Un commit por grupo lógico (ej. "Quita assets de la plantilla sin uso"), así se puede revertir con `git revert`.
- Después de cada commit: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`. Si algo falla, revertí ese commit y explicá por qué.
- Si una dependencia se quita, usá `pnpm remove <paquete>` para que el lockfile quede consistente.

## 5 · Cerrar

Resumí: líneas y archivos eliminados, dependencias quitadas, qué quedó en 🟡 para revisar más adelante.

## Reglas

- No toques `specs/`, migraciones ya aplicadas, `.env*` ni `AGENTS.md`/`CLAUDE.md`.
- No reescribas lógica que funciona para "simplificarla": eso es otra tarea, se hace con la skill de SDD.
- Ante la duda, va a 🟡.
