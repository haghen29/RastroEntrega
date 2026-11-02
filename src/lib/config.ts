// Datos de contacto de la tienda. Mientras la configuración editable (US-13)
// sea post-MVP, se cambian acá y se hace deploy.
//
// `export const` = una constante que otros archivos pueden importar con
// `import { WHATSAPP } from '@/lib/config'`.

// Número en formato internacional, sin "+" ni espacios (54 9 11 ...), como lo pide wa.me
export const WHATSAPP = '5491162847444'
export const INSTAGRAM = 'rastroperfumeria'

// Links a los PDF de Drive con los perfumes de 100 ml (US-09). Se usan en la home.
export const CATALOGOS_100ML = {
  arabes: 'https://drive.google.com/file/d/1xMKxtUgtC99omwyLnDBi9p9CP787hPvc/view',
  disenador: 'https://drive.google.com/file/d/13QlejldX6CuQQY-wytV8-wva1GKEPXZl/view',
}

/**
 * Arma el link que abre WhatsApp con un mensaje ya escrito.
 *
 * `encodeURIComponent` pasa el texto a un formato seguro para una URL:
 * los espacios quedan como %20, los saltos de línea como %0A, etc. Sin esto,
 * un "&" o un "?" dentro del mensaje rompería el link.
 *
 * Ejemplo: linkWhatsApp('Hola') -> 'https://wa.me/5491162847444?text=Hola'
 */
export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`
}

// Las comillas invertidas (`...`) son "template literals": ${...} mete un valor dentro del texto.
export const LINK_INSTAGRAM = `https://instagram.com/${INSTAGRAM}`
