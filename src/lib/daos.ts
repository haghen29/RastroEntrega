import { ProductoDAO } from "@/persistence/dao/ProductoDAO";
import { ProductoDAOImpl } from "@/persistence/dao/impl/ProductoDAOImpl";

export const productoDao: ProductoDAO = new ProductoDAOImpl();