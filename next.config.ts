// Configuración de Next.js. Next la lee al arrancar (pnpm dev / pnpm build).
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // <Image> de Next optimiza las fotos (las achica y convierte a formatos livianos),
  // pero solo acepta imágenes de dominios que se autoricen acá, por seguridad.
  images: {
    // fotos de producto subidas desde /admin a Vercel Blob
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    serverActions: {
      // la foto puede pesar hasta 4 MB (Vercel corta los pedidos de más de 4.5 MB)
      // Por defecto una Server Action acepta solo 1 MB.
      bodySizeLimit: "4.5mb",
    },
  },
};

export default nextConfig;
