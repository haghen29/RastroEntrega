import { describe, expect, it } from "vitest";
import type { ProductoConVariantes } from "@/persistence/dao/ProductoDAO";
import type { Variant } from "@/db/schema";
import { armarTarjeta } from "./ProductoServiceImpl";

// Un decant de ejemplo (Asad, 5 ml y 10 ml); cada test cambia solo lo que prueba
function variante(cambios: Partial<Variant>): Variant {
    return { id: 1, productId: 1, label: "5 ml", ml: 5, priceCents: 850000, stock: null, sortOrder: 0, active: true, ...cambios };
}

function decant(cambios: Partial<ProductoConVariantes> = {}): ProductoConVariantes {
    return {
        id: 1, externalId: null, slug: "decant-asad", name: "Decant Asad", brand: "Lattafa",
        concentration: "EDP", description: "", occasions: "", notes: "", presentation: "",
        searchTerms: "", kind: "decant", gender: "masculino", categoryId: 1,
        imageUrl: null, imageId: null, mlStock: null, mlBottle: null,
        active: true, featured: false, sortOrder: 0, createdAt: new Date(),
        category: { id: 1, name: "Árabes", slug: "arabes", sortOrder: 1, active: true },
        variants: [
            variante({ id: 1, label: "5 ml", ml: 5, priceCents: 850000 }),
            variante({ id: 2, label: "10 ml", ml: 10, priceCents: 1500000 }),
        ],
        ...cambios,
    };
}

describe("armarTarjeta", () => {
    it("HU-03 · CA-3: copia los datos de la tarjeta y usa la categoría como origen", () => {
        expect(armarTarjeta(decant())).toMatchObject({
            slug: "decant-asad", nombre: "Decant Asad", marca: "Lattafa",
            concentracion: "EDP", genero: "masculino", origen: "Árabes",
        });
    });

    it("HU-03 · CA-3: sin categoría, el origen queda vacío", () => {
        expect(armarTarjeta(decant({ category: null })).origen).toBeNull();
    });

    it("HU-03 · CA-4: usa el precio de la variante activa más barata", () => {
        const tarjeta = armarTarjeta(decant({
            variants: [
                variante({ priceCents: 1500000 }),
                variante({ priceCents: 850000 }),
                variante({ priceCents: 100, active: false }),
            ],
        }));
        expect(tarjeta.precioDesdeCentavos).toBe(850000);
    });

    it("HU-03 · CA-5: sin variantes activas no hay precio (Consultar precio)", () => {
        expect(armarTarjeta(decant({ variants: [] })).precioDesdeCentavos).toBeNull();
        expect(armarTarjeta(decant({ variants: [variante({ active: false })] })).precioDesdeCentavos).toBeNull();
    });

    it.each([
        [null, false],
        [100, false],
        [5, false],
        [4, true],
        [0, true],
    ])("HU-03 · CA-6: mlStock %s → sinStock %s", (mlStock, esperado) => {
        expect(armarTarjeta(decant({ mlStock })).sinStock).toBe(esperado);
    });

    it.each([
        [null, null],
        ["", null],
        ["https://acdn.mitiendanube.com/stores/foto.webp", null],
        ["http://abc.public.blob.vercel-storage.com/asad.webp", null],
        ["//otro-sitio.com/asad.webp", null],
        ["https://abc.public.blob.vercel-storage.com/asad.webp", "https://abc.public.blob.vercel-storage.com/asad.webp"],
        ["/decants/asad.webp", "/decants/asad.webp"],
    ])("HU-03 · CA-7: foto %s → %s", (imageUrl, esperado) => {
        expect(armarTarjeta(decant({ imageUrl })).imageUrl).toBe(esperado);
    });
});
