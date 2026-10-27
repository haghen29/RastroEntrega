import type { Category, Product, Variant } from "@/db/schema";

// HU-03: producto con su categoría y solo sus variantes activas
export type ProductoConVariantes = Product & {
    category: Category | null;
    variants: Variant[];
};

export interface ProductoDAO {
    obtenerTodos(): Promise<Product[]>;
    obtenerPorId(id: number): Promise<Product | null>;
    // HU-03 · CA-1, CA-2: solo kind = 'decant' y active = true, ordenados por sortOrder
    obtenerDecantsActivos(): Promise<ProductoConVariantes[]>;
}

export interface ProductoDAOAdm {
    EliminarProducto(id: number): Promise<void>;
    EditarProducto(id: number, producto: Product): Promise<void>;
    CrearProducto(producto: Product): Promise<void>;
}