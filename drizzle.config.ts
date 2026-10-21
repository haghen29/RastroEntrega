import { defineConfig } from 'drizzle-kit'

// drizzle-kit corre como script suelto de Node, FUERA de Next.js,
// asi que Next no le carga .env.local: hay que leerlo a mano.
process.loadEnvFile?.('.env.local')

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})
