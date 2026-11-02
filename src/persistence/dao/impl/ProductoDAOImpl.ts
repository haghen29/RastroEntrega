// CAPA DE PERSISTENCIA: implementación del DAO con Drizzle ORM.
// Es el ÚNICO archivo del proyecto con consultas a la base.
//
// Operadores de Drizzle que aparecen acá (se traducen a SQL):
//   eq(a, b)   -> a = b
//   ne(a, b)   -> a <> b (distinto)
//   and(x, y)  -> x AND y
//   asc(col)   -> ORDER BY col ASC (de menor a mayor)
import { and, asc, eq, ne } from 'drizzle-orm';
import { categories, db, products, variants } from '../../../db';
import type {
   DatosProducto,
   PreciosPorMedida,
   ProductoConDetalle,
   ProductoDAO,
   ProductoDAOAdm,
} from '../ProductoDAO';

// Las medidas fijas del MVP
const MEDIDAS = [5, 10] as const;

// `implements ProductoDAO` = esta clase se compromete a tener todos los métodos
// de la interfaz. Si falta uno, TypeScript no compila.
export class ProductoDAOImpl implements ProductoDAO {
   /**
    * Catálogo público: decants activos, con sus medidas activas (de menor a
    * mayor ml) y su categoría, ordenados por sortOrder y después por nombre.
    * `db.query...findMany` es la API "relacional" de Drizzle: `with` trae las
    * tablas relacionadas sin escribir el JOIN a mano.
    */
   async listarDecantsActivos(): Promise<ProductoConDetalle[]> {
      return db.query.products.findMany({
         where: and(eq(products.active, true), eq(products.kind, 'decant')),
         with: {
            category: true,
            variants: { where: eq(variants.active, true), orderBy: asc(variants.ml) },
         },
         orderBy: [asc(products.sortOrder), asc(products.name)],
      });
   }

   /**
    * Ficha del producto: busca por slug, y solo si está activo.
    * `findFirst` devuelve el producto o `undefined`; con `?? null` se
    * normaliza a null, que es lo que promete la interfaz.
    */
   async obtenerPorSlug(slug: string): Promise<ProductoConDetalle | null> {
      const producto = await db.query.products.findFirst({
         where: and(eq(products.slug, slug), eq(products.active, true)),
         with: {
            category: true,
            variants: { where: eq(variants.active, true), orderBy: asc(variants.ml) },
         },
      });
      return producto ?? null;
   }

   /** Categorías en el orden definido (sort_order). Equivale a: SELECT * FROM categories ORDER BY sort_order */
   async listarCategorias() {
      return db.select().from(categories).orderBy(asc(categories.sortOrder));
   }
}

// DAO del admin: igual que el de arriba, pero sin filtrar por `active` (ve todo) y con escritura.
export class ProductoDAOImplAdm implements ProductoDAOAdm {
   /** Todos los productos (activos e inactivos) con todas sus medidas, por nombre. */
   async listarTodos(): Promise<ProductoConDetalle[]> {
      return db.query.products.findMany({
         with: { category: true, variants: { orderBy: asc(variants.ml) } },
         orderBy: [asc(products.name)],
      });
   }

   /** Un producto por id (para precargar el formulario de edición). */
   async obtenerPorId(id: number): Promise<ProductoConDetalle | null> {
      const producto = await db.query.products.findFirst({
         where: eq(products.id, id),
         with: { category: true, variants: { orderBy: asc(variants.ml) } },
      });
      return producto ?? null;
   }

   /**
    * ¿El slug ya lo usa otro producto? Los slugs tienen que ser únicos porque
    * forman la URL. Al editar se pasa `exceptoId` para no compararse con uno mismo.
    * Pide una sola fila (`limit(1)`) y solo el id: alcanza con saber si existe.
    */
   async existeSlug(slug: string, exceptoId?: number): Promise<boolean> {
      const filas = await db
         .select({ id: products.id })
         .from(products)
         .where(exceptoId ? and(eq(products.slug, slug), ne(products.id, exceptoId)) : eq(products.slug, slug))
         .limit(1);
      return filas.length > 0;
   }

   /**
    * Inserta el producto y después sus precios.
    * `.returning({ id })` le pide a Postgres que devuelva el id que generó.
    * `const [nuevo] = ...` toma el primer (y único) elemento de la lista que devuelve.
    */
   async crearProducto(datos: DatosProducto, precios: PreciosPorMedida): Promise<number> {
      const [nuevo] = await db
         .insert(products)
         .values({ ...datos, kind: 'decant' })
         .returning({ id: products.id });
      await this.guardarPrecios(nuevo.id, precios);
      return nuevo.id;
   }

   /** UPDATE products SET ... WHERE id = ?, y después actualiza los precios. */
   async editarProducto(id: number, datos: DatosProducto, precios: PreciosPorMedida): Promise<void> {
      await db.update(products).set(datos).where(eq(products.id, id));
      await this.guardarPrecios(id, precios);
   }

   // Las medidas sin precio se desactivan en vez de borrarse
   // `private` = solo se puede llamar desde adentro de esta clase.
   // Para cada medida (5 y 10 ml):
   //   - si ya existe y tiene precio: se actualiza el precio y se activa;
   //   - si ya existe y NO tiene precio: se desactiva (deja de verse en la tienda);
   //   - si no existe y tiene precio: se crea;
   //   - si no existe y no tiene precio: no se hace nada.
   private async guardarPrecios(productId: number, precios: PreciosPorMedida): Promise<void> {
      const actuales = await db.select().from(variants).where(eq(variants.productId, productId));

      // `entries()` da pares [posición, valor]: [0, 5] y [1, 10]. La posición se usa como orden.
      for (const [orden, ml] of MEDIDAS.entries()) {
         const precio = precios[ml];
         const existente = actuales.find((v) => v.ml === ml);

         if (existente) {
            await db
               .update(variants)
               .set(precio === null ? { active: false } : { active: true, priceCents: precio })
               .where(eq(variants.id, existente.id));
         } else if (precio !== null) {
            await db.insert(variants).values({
               productId,
               ml,
               label: `${ml} ml`,
               priceCents: precio,
               sortOrder: orden,
            });
         }
      }
   }
}
