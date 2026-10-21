import { ProductoServiceImpl } from "@/services/impl/ProductoServiceImpl";
import { ProductoService } from "@/services/ProductoService";
import { productoDao } from "./daos";


export const productoService: ProductoService = new ProductoServiceImpl(productoDao);