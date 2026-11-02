// CAPA DE NEGOCIO: implementación de los servicios de productos.
import type {
    DatosProducto,
    PreciosPorMedida,
    ProductoConDetalle,
    ProductoDAO,
    ProductoDAOAdm,
} from "@/persistence/dao/ProductoDAO";
import { normalizar } from "@/lib/formato";
import type { FiltrosCatalogo, ProductoService, ProductoServiceAdm } from "../ProductoService";

export class ProductoServiceImpl implements ProductoService {
    // INYECCIÓN DE DEPENDENCIAS: el DAO llega por el constructor (ver lib/services.ts).
    // `private readonly productoDAO` es un atajo de TypeScript: declara el atributo,
    // lo guarda en `this.productoDAO` y lo hace de solo lectura, todo en una línea.
    // El tipo es la INTERFAZ ProductoDAO: el servicio no sabe qué base hay detrás.
    constructor(private readonly productoDAO: ProductoDAO) {}

    // Son pocos decants: se filtran en memoria, así la búsqueda ignora
    // mayúsculas y tildes sin depender de extensiones de Postgres.
    //
    // 1. `await` espera a que el DAO traiga todos los decants activos.
    // 2. `filter` se queda solo con los que pasan todas las condiciones;
    //    cada `return false` descarta el producto.
    // 3. La búsqueda mira nombre + marca + palabras de búsqueda, todo normalizado,
    //    así "diseñador", "DISENADOR" y "disenador" encuentran lo mismo.
    async listarDecants(filtros: FiltrosCatalogo): Promise<ProductoConDetalle[]> {
        const decants = await this.productoDAO.listarDecantsActivos();
        const q = normalizar(filtros.q ?? "");

        return decants.filter((p) => {
            if (filtros.genero && p.gender !== filtros.genero) return false;
            if (filtros.categoria && p.category?.slug !== filtros.categoria) return false;
            if (q) {
                const texto = normalizar(`${p.name} ${p.brand} ${p.searchTerms}`);
                if (!texto.includes(q)) return false;
            }
            return true;
        });
    }

    // Los métodos que siguen solo "pasan" el pedido al DAO. Igual se mantienen
    // en el servicio para respetar la regla: la página nunca habla con el DAO.
    // Si mañana hace falta una regla de negocio, se agrega acá sin tocar las páginas.

    /** Producto para la ficha. */
    async obtenerPorSlug(slug: string): Promise<ProductoConDetalle | null> {
        return this.productoDAO.obtenerPorSlug(slug);
    }

    /** Categorías ordenadas. */
    async listarCategorias() {
        return this.productoDAO.listarCategorias();
    }
}

// Servicio del admin: recibe el DAO del admin, que ve también los productos inactivos.
export class ProductoServiceAdmImpl implements ProductoServiceAdm {
    constructor(private readonly productoDAO: ProductoDAOAdm) {}

    /** Lista completa para la tabla de /admin. */
    async listarTodos(): Promise<ProductoConDetalle[]> {
        return this.productoDAO.listarTodos();
    }

    /** Producto a editar. */
    async obtenerPorId(id: number): Promise<ProductoConDetalle | null> {
        return this.productoDAO.obtenerPorId(id);
    }

    /** Valida que el slug no se repita antes de guardar. */
    async existeSlug(slug: string, exceptoId?: number): Promise<boolean> {
        return this.productoDAO.existeSlug(slug, exceptoId);
    }

    /** Alta de un producto nuevo; devuelve su id. */
    async crearProducto(datos: DatosProducto, precios: PreciosPorMedida): Promise<number> {
        return this.productoDAO.crearProducto(datos, precios);
    }

    /** Modificación de un producto existente. */
    async editarProducto(id: number, datos: DatosProducto, precios: PreciosPorMedida): Promise<void> {
        await this.productoDAO.editarProducto(id, datos, precios);
    }
}
