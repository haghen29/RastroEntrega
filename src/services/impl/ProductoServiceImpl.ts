import { ProductoDAO } from "@/persistence/dao/ProductoDAO";
import { ProductoService } from "../ProductoService";
import { Product } from "@/db";

export class ProductoServiceImpl implements ProductoService {
    constructor(private readonly productoDAO: ProductoDAO) {}

    async obtenerTodos(): Promise<Product[]> {
        return await this.productoDAO.obtenerTodos();
    }

    async obtenerPorId(id: number): Promise<Product | null> {
        return await this.productoDAO.obtenerPorId(id);
    }
}
Export class ProductoServiceAdmImpl implements ProductoServiceAdm {
    constructor(private readonly productoDAO: ProductoDAO) {}

    async EliminarProducto(id: number): Promise<void> {
        await this.productoDAO.EliminarProducto(id);
    }
    async EditarProducto(id: number, producto: Product): Promise<void> {
        await this.productoDAO.EditarProducto(id, producto);
    }

    async CrearProducto(producto: Product): Promise<void> {
        await this.productoDAO.CrearProducto(producto);
    }
}
