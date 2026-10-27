import type { Product } from "@/db/schema";

// HU-03: lo que necesita una tarjeta del catálogo, con las reglas de negocio ya aplicadas
export type TarjetaDecant = {
    slug: string;
    nombre: string;
    marca: string;
    concentracion: string;
    genero: string;
    origen: string | null;              // null si el producto no tiene categoría
    imageUrl: string | null;            // null → imagen genérica (CA-7)
    precioDesdeCentavos: number | null; // null → "Consultar precio" (CA-5)
    sinStock: boolean;                  // CA-6
};

export interface ProductoService {
    obtenerTodos(): Promise<Product[]>;
    obtenerPorId(id: number): Promise<Product | null>;
    // HU-03 · CA-1 a CA-7
    obtenerCatalogoDecants(): Promise<TarjetaDecant[]>;
}

export interface ProductoServiceAdm {
    EliminarProducto(id: number): Promise<void>;
    EditarProducto(id: number, producto: Product): Promise<void>;
    CrearProducto(producto: Product): Promise<void>;
}