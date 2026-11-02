// Configuración de drizzle-kit, la herramienta de línea de comandos de Drizzle.
// La usan los scripts `pnpm db:push` (crea o actualiza las tablas en Neon a
// partir de schema.ts) y `pnpm db:studio` (interfaz para ver los datos).
// La app en sí NO usa este archivo: se conecta con src/db/index.ts.
import { defineConfig } from 'drizzle-kit'

// drizzle-kit corre como script suelto de Node, FUERA de Next.js,
// asi que Next no le carga .env.local: hay que leerlo a mano.
process.loadEnvFile?.('.env.local')

export default defineConfig({
  // qué base es (PostgreSQL)
  dialect: 'postgresql',
  // dónde están definidas las tablas
  schema: './src/db/schema.ts',
  // dónde guardaría los archivos de migración (db:generate)
  out: './drizzle',
  dbCredentials: {
    // el `!` le dice a TypeScript "confiá, esta variable existe"
    url: process.env.DATABASE_URL!,
  },
  // muestra el SQL que va a ejecutar, y pide confirmación antes de cambios peligrosos
  verbose: true,
  strict: true,
})
