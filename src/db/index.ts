import 'server-only'

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error(
    'Falta DATABASE_URL. Copiala del dashboard de Neon a .env.local ' +
      '(y cargala tambien en las Environment Variables de Vercel).',
  )
}

const sql = neon(process.env.DATABASE_URL)

export const db = drizzle(sql, { schema })

export * from './schema'
