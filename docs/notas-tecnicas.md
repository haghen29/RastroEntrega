# Notas técnicas · cosas que hay que saber

Trampas y decisiones del proyecto. Antes estaban en `readme.txt` (28/08/2026); se actualizaron el 27/10/2026.

## Herramientas

1. **Siempre pnpm, nunca npm.** `package.json` declara `packageManager: pnpm@11.24.0`. Si corrés `npm install` se crea un `package-lock.json` y quedan dos lockfiles; Vercel puede elegir el equivocado y romper el deploy. Si aparece un `package-lock.json`, borralo.
2. **Dependencias nuevas:** si se usa en producción va a `dependencies`; si es herramienta de desarrollo (linters, tipos, tests) va a `devDependencies` (`pnpm add -D ...`).
3. **No dejar copias del proyecto adentro del proyecto.** `tsconfig.json` revisa todo `**/*.ts`, así que cualquier carpeta con código viejo (como pasó con `my-app/`) rompe `tsc` y `pnpm build`.

## Next.js y estilos

4. **Next 16 cambió APIs.** Antes de usar algo de Next, leé la guía en `node_modules/next/dist/docs/` (lo pide `AGENTS.md`).
5. **`LayoutProps` / `PageProps` "no existen" hasta que Next los genera.** Si `tsc` dice `Cannot find name 'LayoutProps'`, corré `pnpm exec next typegen` (o `pnpm dev` / `pnpm build`) y después `tsc` de nuevo. Pasa al clonar el repo o al borrar `.next`.
6. **`AGENTS.md` lo reescribe `next dev`.** No borres su bloque `nextjs-agent-rules`; se vuelve a crear solo. `CLAUDE.md` solo importa `AGENTS.md`.
7. **Las rutas de API se llaman `route.ts`** (no `routes.ts`): Next ignora cualquier otro nombre.
8. **Tailwind v4 no usa `tailwind.config.ts`.** La configuración (colores, fuentes) vive en `src/app/globals.css`, bloque `@theme`.
9. **Mobile-first siempre:** las clases de Tailwind se escriben primero para celular y después se agregan `md:` / `lg:`. Nunca al revés.
10. **Radix: solo Primitives** (`@radix-ui/react-dialog`, etc.), sin estilos propios, pintados con Tailwind. No usar `@radix-ui/themes`.
11. **El alias `@/` apunta a `src/`:** `import { productoService } from "@/lib/services"` → `src/lib/services.ts`.

## Base de datos

12. **Arquitectura en capas:** page/route → Service → DAO → Drizzle → Neon. Solo los DAO importan `@/db`. Detalle en `.claude/skills/arquitectura-capas/SKILL.md`.
13. **Precios en centavos, enteros:** $8.500 se guarda como `850000`. Se divide por 100 recién al mostrar.
14. **Los `.env` no se suben a git** (`.gitignore` ignora `.env*`). `DATABASE_URL` va en `.env.local` en la raíz, y además hay que cargarla a mano en Vercel (Settings → Environment Variables).
15. **Usar la connection string "pooled" de Neon** (la que tiene `-pooler`): es la que corresponde al serverless de Vercel.
16. **drizzle-kit no lee `.env.local` solo:** corre por fuera de Next. Por eso `drizzle.config.ts` lo carga con `process.loadEnvFile('.env.local')`.
17. **`db:push` sirve mientras no haya datos reales.** Cuando haya pedidos o productos cargados en producción, pasar a migraciones versionadas (`pnpm db:generate` + `pnpm db:migrate`) para no borrar datos sin poder volver atrás.
18. **Cargar el catálogo:** `sql/seed-decants.sql` se pega entero en el SQL Editor de Neon. Se puede correr varias veces (actualiza por slug) y no toca las fotos. Tiene que terminar diciendo 17 decants, 34 medidas, 2 familias.
