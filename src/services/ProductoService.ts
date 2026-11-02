// CAPA DE NEGOCIO: contrato (interfaces) del servicio de productos.
//
// Las páginas hablan SOLO con el servicio. El servicio aplica las reglas del
// negocio (por ejemplo, cómo se filtra el catálogo) y le pide los datos al DAO.
//   Página -> Service -> DAO -> Drizzle -> Neon
import type { Category } from "@/db/schema";
import type { DatosProducto, PreciosPorMedida, ProductoConDetalle } from "@/persistence/dao/ProductoDAO";

// Los filtros del catálogo. El `?` = cada uno es opcional (sin filtro = se muestran todos).
export type FiltrosCatalogo = {
    genero?: string;
    categoria?: string;
    q?: string;
};

/** Lo que puede pedir la tienda pública. */
export interface ProductoService {
    // Decants activos que cumplen los filtros (género, origen y texto de búsqueda)
    listarDecants(filtros: FiltrosCatalogo): Promise<ProductoConDetalle[]>;
    // Un producto para la ficha, o null si no existe o está inactivo
    obtenerPorSlug(slug: string): Promise<ProductoConDetalle | null>;
    // Las categorías (las usa el formulario del admin para el desplegable de origen)
    listarCategorias(): Promise<Category[]>;
}

/** Lo que puede pedir el panel de administración. */
export interface ProductoServiceAdm {
    listarTodos(): Promise<ProductoConDetalle[]>;
    obtenerPorId(id: number): Promise<ProductoConDetalle | null>;
    existeSlug(slug: string, exceptoId?: number): Promise<boolean>;
    crearProducto(datos: DatosProducto, precios: PreciosPorMedida): Promise<number>;
    editarProducto(id: number, datos: DatosProducto, precios: PreciosPorMedida): Promise<void>;
}
