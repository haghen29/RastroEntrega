---
name: arquitectura-capas
description: Regla de arquitectura en capas de RastroEntrega (page/route → Service → DAO → Drizzle → Neon). Usar siempre que se escriba, mueva o revise código que lee o escribe datos, se cree una página o ruta en src/app, o se agregue un método a un Service o DAO.
---

# Arquitectura en capas de RastroEntrega

Todo dato que viaja entre la pantalla y la base pasa por estas capas, siempre en este orden y sin saltear ninguna:

```
src/app (page.tsx / route.ts)        ← muestra o responde
  → src/services (interfaz + impl)   ← reglas de negocio
    → src/persistence/dao (interfaz + impl) ← consultas
      → src/db (schema + db de Drizzle)     ← tablas
        → Neon (Postgres)
```

## Reglas

1. **Una capa solo llama a la de abajo.** Una página usa un Service, nunca un DAO ni `db`. Un Service usa un DAO, nunca `db`. Solo el DAO importa `db` y las tablas del schema.
2. **Interfaz primero.** Cada Service y DAO tiene su interfaz (`ProductoService`, `ProductoDAO`) y su implementación en `impl/`. Las capas de arriba dependen de la interfaz, no de la clase.
3. **Las instancias se arman en `src/lib`.** `src/lib/daos.ts` crea los DAO y `src/lib/services.ts` crea los Services y les pasa el DAO. Las páginas importan de `@/lib/services`.
4. **Cada capa hace lo suyo:**
   - DAO: consultas (filtrar `active`, unir variantes). Nada de formato ni de reglas de negocio.
   - Service: reglas de negocio (ej. "desde $X" = la variante activa más barata, la regla de "Sin stock").
   - Página: formato y UI (pasar centavos a `$8.500`, armar tarjetas).
5. **Nombres:** los métodos de Service y DAO van en español y en camelCase (`obtenerActivos`, `obtenerPorSlug`). Revisá `specs/nombres.md` antes de inventar un nombre.

## Antes de escribir o aprobar código

- Buscá imports de `@/db` fuera de `src/persistence/dao/impl` y de `src/db`. Si hay alguno, es una violación: proponé moverlo al DAO.
- Si una tarea necesita un dato nuevo, el orden es: firma en la interfaz del DAO → impl del DAO → firma en la interfaz del Service → impl del Service → página.
- Si encontrás código que se saltea una capa (ej. una página que consulta `db` directo), no lo copies: avisale al usuario y proponé arreglarlo.
