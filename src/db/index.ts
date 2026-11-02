// La conexión a la base de datos. La importa solo el DAO.
// 'server-only': si algún componente del navegador intentara importar este
// archivo, el build falla. Así la cadena de conexión nunca llega al cliente.
import 'server-only'

// `neon` = el driver de Neon. Habla con Postgres por HTTP, algo ideal para el
// serverless de Vercel, donde no se puede mantener una conexión abierta.
import { neon } from '@neondatabase/serverless'
// `drizzle` envuelve ese driver y agrega el ORM: consultas en TypeScript, con tipos.
import { drizzle } from 'drizzle-orm/neon-http'

// `import * as schema` trae todo lo que exporta schema.ts (tablas y relaciones) en un solo objeto
import * as schema from './schema'

// Si falta la variable de entorno, se corta con un mensaje claro en vez de un error raro después.
// `process.env` = las variables de entorno (en local vienen de .env.local, en Vercel del panel).
if (!process.env.DATABASE_URL) {
  throw new Error(
    'Falta DATABASE_URL. Copiala del dashboard de Neon a .env.local ' +
      '(y cargala tambien en las Environment Variables de Vercel).',
  )
}

const sql = neon(process.env.DATABASE_URL)

// `db` es el objeto con el que se hacen todas las consultas: db.select(), db.insert(), db.query...
// Se le pasa el schema para que `db.query.products.findMany({ with: ... })` sepa unir las tablas.
export const db = drizzle(sql, { schema })

// Re-exporta las tablas, así el DAO puede importar `db` y `products` del mismo lugar
export * from './schema'
