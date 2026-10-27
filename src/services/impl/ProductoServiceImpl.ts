import type { ProductoConVariantes, ProductoDAO } from "@/persistence/dao/ProductoDAO";
import type { ProductoService, TarjetaDecant } from "../ProductoService";
import type { Product } from "@/db/schema";

// La medida más chica que se vende: con menos ml en el frasco no se arma ni un decant
const MEDIDA_MINIMA_ML = 5;
const DOMINIO_FOTOS = ".public.blob.vercel-storage.com";

// HU-03 · CA-7: solo fotos de Vercel Blob o locales; cualquier otra → imagen genérica
function fotoPermitida(url: string | null): string | null {
    if (!url) return null;
    if (url.startsWith("/") && !url.startsWith("//")) return url;
    try {
        const { protocol, hostname } = new URL(url);
        return protocol === "https:" && hostname.endsWith(DOMINIO_FOTOS) ? url : null;
    } catch {
        return null;
    }
}

// HU-03 · CA-3 a CA-7: convierte un producto de la base en lo que muestra la tarjeta
export function armarTarjeta(producto: ProductoConVariantes): TarjetaDecant {
    const precios = producto.variants.filter((v) => v.active).map((v) => v.priceCents);

    return {
        slug: producto.slug,
        nombre: producto.name,
        marca: producto.brand,
        concentracion: producto.concentration,
        genero: producto.gender,
        origen: producto.category?.name ?? null,
        imageUrl: fotoPermitida(producto.imageUrl),
        // CA-4 y CA-5
        precioDesdeCentavos: precios.length > 0 ? Math.min(...precios) : null,
        // CA-6: null = no se controla stock
        sinStock: producto.mlStock !== null && producto.mlStock < MEDIDA_MINIMA_ML,
    };
}

export class ProductoServiceImpl implements ProductoService {
    constructor(private readonly productoDAO: ProductoDAO) {}

    async obtenerTodos(): Promise<Product[]> {
        return await this.productoDAO.obtenerTodos();
    }

    async obtenerPorId(id: number): Promise<Product | null> {
        return await this.productoDAO.obtenerPorId(id);
    }

    // HU-03 · CA-1 a CA-7
    async obtenerCatalogoDecants(): Promise<TarjetaDecant[]> {
        const productos = await this.productoDAO.obtenerDecantsActivos();
        return productos.map(armarTarjeta);
    }
}
