import { Product } from "@/db/schema";

export interface ProductoDAO {
    obtenerTodos(): Promise<Product[]>;
    obtenerPorId(id: number): Promise<Product | null>;
}

export interface ProductoDAOAdm {
    EliminarProducto(id: number): Promise<void>;
    EditarProducto(id: number, producto: Product): Promise<void>;
    CrearProducto(producto: Product): Promise<void>;
}