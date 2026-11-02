// LAYOUT RAÍZ: el "marco" que envuelve TODAS las páginas del sitio.
// Next lo detecta por el nombre del archivo (layout.tsx en la carpeta app/).
// Lo que cambia entre páginas se dibuja donde está {children}; el Header y el
// Footer quedan fijos y no se vuelven a cargar al navegar.
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

// next/font descarga la fuente en el build y la sirve desde el propio sitio
// (no le pide nada a Google en cada visita). La deja en la variable CSS --font-geist-sans.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// METADATA: el <title> y la descripción para Google y para la vista previa al compartir.
// `template`: cada página pone su título y Next le agrega " · Rastro Perfumería".
// Por ejemplo, la página de decants queda "Decants · Rastro Perfumería".
export const metadata: Metadata = {
  title: {
    default: "Rastro Perfumería · Decants de perfumes originales",
    template: "%s · Rastro Perfumería",
  },
  description:
    "Decants de 5 ml y 10 ml de perfumes árabes y de diseñador. 100% originales, del frasco original. Envíos a todo el país.",
};

/**
 * Componente del layout. Recibe `children` = la página que se está visitando.
 * `export default` = lo que Next toma de este archivo.
 * `LayoutProps<"/">` es un tipo que genera Next para las props del layout.
 * Lo que devuelve es JSX: HTML escrito dentro de JavaScript.
 * En JSX se usa `className` en vez de `class`.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
