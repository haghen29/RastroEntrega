import { db, products, type Product } from '../../../db';
import { eq } from 'drizzle-orm';
import { ProductoDAO, ProductoDAOAdm } from '../ProductoDAO';

export class ProductoDAOImpl implements ProductoDAO {
   async obtenerTodos(): Promise<Product[]> {
      return db.select().from(products);
   }

   async obtenerPorId(id: number): Promise<Product | null> {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0] ?? null;
   }
}

export class ProductoDAOImplAdm implements ProductoDAOAdm {
    async EliminarProducto(id: number): Promise<void> {
        await db.delete(products).where(eq(products.id, id));
    }

      async EditarProducto(id: number, producto: Product): Promise<void> {
         await db.update(products).set(producto).where(eq(products.id, id));
      }

      async CrearProducto(producto: Product): Promise<void> {
         await db.insert(products).values(producto);
      }
   }