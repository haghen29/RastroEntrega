// CAPA DE PERSISTENCIA: contrato (interfaces) del DAO de productos.
//
// Un DAO (Data Access Object) es el único que sabe cómo leer y escribir en la base.
// Este archivo dice QUÉ operaciones existen, no CÓMO se hacen: eso está en
// impl/ProductoDAOImpl.ts. El servicio depende de estas interfaces, nunca de la clase.
//
// Todos los métodos devuelven `Promise<...>` porque hablar con la base tarda:
// quien los llama tiene que usar `await` para esperar el resultado.

import type { Category, Product, Variant } from "@/db/schema";

// Un producto con sus medidas y su categoría ya unidos.
// El `&` combina tipos: "todo lo de Product, más estos dos campos".
export type ProductoConDetalle = Product & {
    variants: Variant[];
    category: Category | null;
};

// Lo que el admin carga en el formulario (sin id, fechas ni campos post-MVP)
// `Pick<Product, ...>` = "de Product, quedate solo con estos campos".
// `imageUrl?` con signo de pregunta = opcional (si no se sube foto, no se manda).
export type DatosProducto = Pick<
    Product,
    | "slug"
    | "name"
    | "brand"
    | "concentration"
    | "description"
    | "notes"
    | "occasions"
    | "presentation"
    | "searchTerms"
    | "gender"
    | "categoryId"
    | "active"
> & { imageUrl?: string | null };

// Precio en centavos por medida; null = esa medida no se vende
export type PreciosPorMedida = { 5: number | null; 10: number | null };

/** Operaciones de lectura para la tienda pública (solo productos activos). */
export interface ProductoDAO {
    // Todos los decants activos, con sus medidas activas y su categoría
    listarDecantsActivos(): Promise<ProductoConDetalle[]>;
    // Un producto activo por su slug, o null si no existe
    obtenerPorSlug(slug: string): Promise<ProductoConDetalle | null>;
    // Las categorías (Árabes, Diseñador), ordenadas
    listarCategorias(): Promise<Category[]>;
}

/** Operaciones del panel de administración (ve también los inactivos y puede escribir). */
export interface ProductoDAOAdm {
    // Todos los productos, activos e inactivos
    listarTodos(): Promise<ProductoConDetalle[]>;
    // Un producto por su id numérico (para la pantalla de edición)
    obtenerPorId(id: number): Promise<ProductoConDetalle | null>;
    // ¿Ya hay otro producto con ese slug? `exceptoId?` es opcional: al editar se excluye el propio
    existeSlug(slug: string, exceptoId?: number): Promise<boolean>;
    // Crea el producto y sus precios; devuelve el id nuevo
    crearProducto(datos: DatosProducto, precios: PreciosPorMedida): Promise<number>;
    // Actualiza el producto y sus precios. `Promise<void>` = no devuelve nada, solo hay que esperar que termine
    editarProducto(id: number, datos: DatosProducto, precios: PreciosPorMedida): Promise<void>;
}
