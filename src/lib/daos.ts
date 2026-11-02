// Acá se crean los objetos DAO (Data Access Object), la capa que habla con la base.
// Se crean UNA sola vez y se comparten en toda la app.
//
// Fijate el tipo de cada variable: es la INTERFAZ (ProductoDAO), no la clase
// (ProductoDAOImpl). El resto del código solo sabe "qué se puede pedir", no
// "cómo se hace". Si mañana se cambia la base, se cambia la clase de este archivo
// y nada más.
import { ProductoDAO, ProductoDAOAdm } from "@/persistence/dao/ProductoDAO";
import { ProductoDAOImpl, ProductoDAOImplAdm } from "@/persistence/dao/impl/ProductoDAOImpl";

// DAO de la tienda pública: solo lectura de productos activos
export const productoDao: ProductoDAO = new ProductoDAOImpl();
// DAO del admin: ve todos los productos y puede crear o editar
export const productoDaoAdm: ProductoDAOAdm = new ProductoDAOImplAdm();
