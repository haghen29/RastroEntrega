// Acá se "arma" la capa de servicios: cada servicio recibe su DAO por el
// constructor. Esto se llama INYECCIÓN DE DEPENDENCIAS: el servicio no crea
// su DAO, se lo pasan desde afuera. Así el servicio depende de la interfaz y
// se le podría pasar un DAO falso para hacer tests.
//
// Las páginas importan `productoService` o `productoServiceAdm` de este archivo
// y nunca tocan el DAO ni la base directamente.
import { ProductoServiceAdmImpl, ProductoServiceImpl } from "@/services/impl/ProductoServiceImpl";
import { ProductoService, ProductoServiceAdm } from "@/services/ProductoService";
import { productoDao, productoDaoAdm } from "./daos";

// Servicio de la tienda (catálogo, ficha, categorías)
export const productoService: ProductoService = new ProductoServiceImpl(productoDao);
// Servicio del admin (listar todo, crear, editar)
export const productoServiceAdm: ProductoServiceAdm = new ProductoServiceAdmImpl(productoDaoAdm);
