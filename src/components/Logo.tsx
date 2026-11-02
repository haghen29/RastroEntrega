// El logotipo es una imagen de la marca y no se dibuja (skill estilo-rastro).
// Hasta que esté public/marca/logotipo-sm.webp, se muestra este hueco neutro.
// Para usarlo: reemplazar el <span> por
//   <Image src="/marca/logotipo-sm.webp" alt="Rastro Perfumería" width={120} height={32} priority />

/** Lugar reservado para el logo en el header (por ahora, un recuadro con texto). */
export function Logo() {
  return (
    <span className="inline-flex h-8 items-center rounded bg-crema-2 px-3 text-xs text-tinta-suave">
      logo pendiente
    </span>
  )
}
