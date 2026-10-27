import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // HU-03 · CA-7: las fotos de los perfumes viven en Vercel Blob (ver specs/HU-03-listar-decants/design.md, D4)
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
