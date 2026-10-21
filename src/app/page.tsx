import { db } from '@/db'

// Pagina descartable: solo sirve para comprobar que la cadena
// schema -> Neon -> app funciona. Despues la reemplaza la home real.
//
// Es un Server Component (no tiene 'use client'), por eso puede ser async y
// consultar la base directo. El navegador recibe HTML ya armado; la consulta
// nunca sale del servidor.
export default async function Home() {
  const rows = await db.query.products.findMany({
    with: { variants: true, category: true },
    orderBy: (p, { asc }) => [asc(p.sortOrder)],
  })

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-xl font-bold">{rows.length} decants en la base</h1>
      <ul className="space-y-2 text-sm">
        {rows.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong> — {p.brand} ({p.category?.name}){' · '}
            {p.variants
              .map(
                // Los precios se guardan en centavos: se dividen recien al mostrar.
                (v) => `${v.label} $${(v.priceCents / 100).toLocaleString('es-AR')}`,
              )
              .join(' / ')}
          </li>
        ))}
      </ul>
    </main>
  )
}
