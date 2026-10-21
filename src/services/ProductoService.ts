import type { Product } from "@/db/schema";

export interface ProductoService {
    obtenerTodos(): Promise<Product[]>;
    obtenerPorId(id: number): Promise<Product | null>;

}

export interface ProductoServiceAdm {
    EliminarProducto(id: number): Promise<void>;
    EditarProducto(id: number, producto: Product): Promise<void>;
    CrearProducto(producto: Product): Promise<void>;
}