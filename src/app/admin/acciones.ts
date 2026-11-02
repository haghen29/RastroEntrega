'use server'
// 'use server' = todas las funciones exportadas de este archivo son SERVER ACTIONS:
// corren en el servidor, pero un formulario del navegador las puede llamar
// directo (<form action={...}>). Next arma por detrás el pedido HTTP.
// Es el "backend" del panel: login, logout y guardar productos.
//
// Como cualquiera podría llamarlas, cada acción valida todo lo que recibe
// y chequea la sesión (exigirAdmin).

import { del, put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { exigirAdmin } from '@/lib/admin'
import { slugificar } from '@/lib/formato'
import { COOKIE_SESION, DURACION_SESION, crearToken, iguales } from '@/lib/sesion'
import { productoServiceAdm } from '@/lib/services'

// ---------------------------------------------------------------------------
// Login (US-11)
// ---------------------------------------------------------------------------

// Lo que la acción le devuelve al formulario: un mensaje de error, o nada si salió bien
export type EstadoLogin = { error?: string }

// Límite de intentos por IP. Vive en memoria: en Vercel cada instancia tiene
// el suyo, alcanza para frenar a alguien probando contraseñas a mano o con un script simple.
// `Map` = diccionario clave -> valor. Acá: IP -> { cuántos intentos, desde cuándo }.
const MAX_INTENTOS = 5
const BLOQUEO_MS = 15 * 60 * 1000
const intentos = new Map<string, { cantidad: number; desde: number }>()

/**
 * Inicia la sesión del admin.
 *
 * La usa FormLogin con `useActionState`. Por eso recibe dos parámetros: el estado
 * anterior (no se usa; el `_` adelante lo indica) y los datos del formulario.
 *
 * Pasos:
 * 1. Saca la IP de quien intenta entrar. Vercel la manda en el header x-forwarded-for.
 * 2. Si pasaron 15 minutos desde el primer intento, borra el contador.
 *    Si ya hay 5 intentos, frena.
 * 3. Compara la contraseña con ADMIN_PASSWORD, en tiempo constante (`iguales`).
 *    Si está mal, suma un intento y devuelve el error.
 * 4. Si está bien, borra el contador, guarda la cookie firmada y redirige a /admin.
 *
 * Opciones de la cookie:
 * - httpOnly: JavaScript del navegador no la puede leer (protege si hubiera un XSS).
 * - secure: en producción solo viaja por HTTPS.
 * - sameSite 'lax': no se manda en pedidos que vienen de otros sitios (protege de CSRF).
 * - maxAge: dura 7 días.
 */
export async function iniciarSesion(_previo: EstadoLogin, formData: FormData): Promise<EstadoLogin> {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0].trim() ?? 'local'
  const registro = intentos.get(ip)
  if (registro && Date.now() - registro.desde > BLOQUEO_MS) intentos.delete(ip)
  if ((intentos.get(ip)?.cantidad ?? 0) >= MAX_INTENTOS) {
    return { error: 'Demasiados intentos. Probá de nuevo en 15 minutos.' }
  }

  // En local (pnpm dev), sin ADMIN_PASSWORD la contraseña es "admin"
  const esperada = process.env.ADMIN_PASSWORD ?? (process.env.NODE_ENV !== 'production' ? 'admin' : undefined)
  if (!esperada) return { error: 'Falta configurar ADMIN_PASSWORD en el servidor.' }

  const password = formData.get('password')
  if (typeof password !== 'string' || !iguales(password, esperada)) {
    const actual = intentos.get(ip)
    intentos.set(ip, { cantidad: (actual?.cantidad ?? 0) + 1, desde: actual?.desde ?? Date.now() })
    return { error: 'Contraseña incorrecta.' }
  }

  intentos.delete(ip)
  // El `;` al principio evita que JavaScript pegue esta línea con la anterior
  ;(await cookies()).set(COOKIE_SESION, await crearToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DURACION_SESION,
  })
  redirect('/admin')
}

/** Cierra la sesión: borra la cookie y vuelve al login. La usa el botón "Cerrar sesión" de /admin. */
export async function cerrarSesion(): Promise<void> {
  ;(await cookies()).delete(COOKIE_SESION)
  redirect('/admin/login')
}

// ---------------------------------------------------------------------------
// Productos (US-12)
// ---------------------------------------------------------------------------

// Lo que la acción le devuelve al formulario si algo falla:
// - errores: lista de errores por campo, ej. { name: ['Poné el nombre'] }
// - mensaje: un error general (no se pudo subir la foto, se cayó la base...)
// - valores: lo que había escrito el admin, para que no se le borre el formulario
export type EstadoProducto = {
  errores?: Partial<Record<string, string[]>>
  mensaje?: string
  valores?: Record<string, string>
}

// VALIDACIÓN CON ZOD: se describe cómo tienen que ser los datos y Zod chequea
// que lo que llegó cumpla. Además los TRANSFORMA (texto -> número, etc.).
//
// Precio: "8.500" o "8500" -> 850000 centavos; vacío -> null (esa medida no se vende)
// `.transform` saca los puntos de miles y cambia la coma por punto.
// `.pipe` pasa el resultado a otra validación: número entero, positivo, con un máximo razonable.
const precio = z
  .string()
  .trim()
  .transform((v) => (v === '' ? null : Number(v.replace(/\./g, '').replace(',', '.'))))
  .pipe(z.number('Precio inválido').int('Sin centavos').positive('Tiene que ser mayor a 0').max(10_000_000).nullable())

// Regla reutilizable para los textos largos (descripción, notas...)
const textoLargo = z.string().trim().max(3000)

// El formulario completo. Cada campo con su regla y su mensaje de error en castellano.
// `z.enum([...])` = solo acepta uno de esos valores exactos.
// `.refine(...)` = una regla que mira varios campos juntos: un producto activo
// tiene que tener al menos un precio (si no, aparecería en la tienda sin precio).
const esquemaProducto = z
  .object({
    name: z.string().trim().min(1, 'Poné el nombre').max(120),
    slug: z
      .string()
      .max(120)
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Solo minúsculas, números y guiones (ej: decant-9pm)'),
    brand: z.string().trim().max(80),
    concentration: z.enum(['', 'EDP', 'EDT', 'Parfum', 'Extrait']),
    gender: z.enum(['', 'masculino', 'femenino', 'unisex']),
    categoryId: z
      .string()
      .transform((v) => (v ? Number(v) : null))
      .pipe(z.number().int().positive().nullable()),
    description: textoLargo,
    notes: textoLargo,
    occasions: textoLargo,
    presentation: textoLargo,
    searchTerms: z.string().trim().max(300),
    precio5: precio,
    precio10: precio,
    active: z.boolean(),
  })
  .refine((d) => !d.active || d.precio5 !== null || d.precio10 !== null, {
    message: 'Un producto activo necesita al menos un precio',
    path: ['precio5'],
  })

// Formatos de foto permitidos (tipo MIME -> extensión del archivo) y peso máximo: 4 MB
const TIPOS_FOTO: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
const MAX_FOTO = 4 * 1024 * 1024

/**
 * Crea o edita un producto (botón "Guardar" del formulario del admin).
 * Si el formulario trae un `id` es una edición; si no, es un alta.
 *
 * Pasos:
 * 1. exigirAdmin(): sin sesión, corta acá.
 * 2. Saca todos los campos del formulario como texto (`valores`).
 * 3. Valida con Zod. `safeParse` no tira error: devuelve { success, data | error }.
 *    Si falla, devuelve los errores por campo y los valores escritos.
 * 4. Chequea que el slug no lo use otro producto.
 * 5. Si se subió una foto: valida tipo y peso y la sube a Vercel Blob con `put`.
 *    `addRandomSuffix` agrega letras al azar al nombre para que no se pisen dos fotos.
 * 6. Guarda en la base (a través del servicio). Al editar con foto nueva,
 *    borra la vieja del Blob con `del`; si falla, no importa (`.catch(() => {})`).
 * 7. revalidatePath: le avisa a Next que las páginas cambiaron y no use versiones guardadas.
 * 8. redirect a /admin?guardado=1, que muestra "Cambios guardados".
 *
 * `try/catch`: si algo falla dentro del `try` (la base, el Blob), se ejecuta el
 * `catch` y se muestra un mensaje en vez de romper la página.
 */
export async function guardarProducto(
  _previo: EstadoProducto,
  formData: FormData,
): Promise<EstadoProducto> {
  await exigirAdmin()

  // Lee un campo del formulario como texto (si no viene o es un archivo, devuelve '')
  const texto = (clave: string) => {
    const v = formData.get(clave)
    return typeof v === 'string' ? v : ''
  }
  // Arma { name: '...', slug: '...', ... } con todos los campos de texto
  const valores = Object.fromEntries(
    ['name', 'slug', 'brand', 'concentration', 'gender', 'categoryId', 'description', 'notes', 'occasions', 'presentation', 'searchTerms', 'precio5', 'precio10'].map((k) => [k, texto(k)]),
  )
  // Un checkbox tildado llega como 'on'; destildado no llega
  valores.active = formData.get('active') === 'on' ? 'on' : ''
  // `|| undefined`: si el id está vacío (alta), Number('') da 0 y queda undefined
  const id = Number(texto('id')) || undefined
  // Atajo para devolver un error junto con lo que el admin había escrito
  const fallar = (estado: EstadoProducto): EstadoProducto => ({ ...estado, valores })

  // Si el slug viene vacío se arma a partir del nombre
  const resultado = esquemaProducto.safeParse({
    ...valores,
    slug: slugificar(valores.slug || valores.name),
    active: valores.active === 'on',
  })
  if (!resultado.success) {
    return fallar({ errores: z.flattenError(resultado.error).fieldErrors })
  }
  // Separa los precios del resto de los datos (los precios van a otra tabla)
  const { precio5, precio10, ...datos } = resultado.data

  if (await productoServiceAdm.existeSlug(datos.slug, id)) {
    return fallar({ errores: { slug: ['Ya hay otro producto con este slug'] } })
  }

  const foto = formData.get('foto')
  let imageUrl: string | undefined
  // `foto.size > 0`: si no se eligió archivo, el navegador manda uno vacío
  if (foto instanceof File && foto.size > 0) {
    const extension = TIPOS_FOTO[foto.type]
    if (!extension) return fallar({ errores: { foto: ['La foto tiene que ser JPG, PNG o WebP'] } })
    if (foto.size > MAX_FOTO) return fallar({ errores: { foto: ['La foto no puede pesar más de 4 MB'] } })
    try {
      const subida = await put(`productos/${datos.slug}.${extension}`, foto, {
        access: 'public',
        addRandomSuffix: true,
        contentType: foto.type,
      })
      imageUrl = subida.url
    } catch (error) {
      console.error('Error subiendo la foto', error)
      return fallar({ mensaje: 'No se pudo subir la foto. Revisá BLOB_READ_WRITE_TOKEN y probá de nuevo.' })
    }
  }

  try {
    const anterior = id ? await productoServiceAdm.obtenerPorId(id) : null
    const precios = { 5: precio5, 10: precio10 }
    // Si no se subió foto nueva, no se manda imageUrl y queda la que estaba
    const datosConFoto = imageUrl ? { ...datos, imageUrl } : datos

    if (id) {
      if (!anterior) return fallar({ mensaje: 'El producto ya no existe.' })
      await productoServiceAdm.editarProducto(id, datosConFoto, precios)
      // la foto vieja ya no se usa: se borra del Blob (si falla, no importa)
      if (imageUrl && anterior.imageUrl?.includes('.blob.vercel-storage.com')) {
        await del(anterior.imageUrl).catch(() => {})
      }
    } else {
      await productoServiceAdm.crearProducto(datosConFoto, precios)
    }
  } catch (error) {
    console.error('Error guardando el producto', error)
    return fallar({ mensaje: 'No se pudo guardar. Probá de nuevo en un rato.' })
  }

  revalidatePath('/', 'layout')
  redirect('/admin?guardado=1')
}
