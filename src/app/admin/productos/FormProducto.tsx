'use client'
// Formulario para crear y editar productos. Lo usan las dos páginas
// (nuevo y [id]): la diferencia son los valores con los que arranca (`inicial`).

import Image from 'next/image'
import Link from 'next/link'
import { useActionState, useState, type ReactNode } from 'react'
import { slugificar, urlFoto } from '@/lib/formato'
import { guardarProducto, type EstadoProducto } from '../acciones'

// Todos los valores del formulario como texto (así llegan de un <input>), más id e imageUrl
export type ValoresProducto = Record<string, string> & { id: string; imageUrl: string }

// Las props que recibe el componente
type Props = {
  inicial: ValoresProducto
  categorias: { id: number; name: string }[]
}

// Clases de Tailwind repetidas en todos los campos, en una constante para no copiarlas
const CAMPO = 'w-full rounded-lg border border-arena bg-white px-3 py-2 text-sm outline-none focus:border-tinta'

/**
 * Un campo del formulario: etiqueta + el input (que llega como `children`) +
 * un texto de ayuda opcional + los errores de validación de ese campo.
 * `htmlFor` conecta la etiqueta con el input: al tocar la etiqueta se enfoca el input.
 */
function Campo({ nombre, etiqueta, ayuda, errores, children }: {
  nombre: string
  etiqueta: string
  ayuda?: string
  errores?: string[]
  children: ReactNode
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={nombre} className="block text-sm font-semibold">{etiqueta}</label>
      {children}
      {ayuda && <p className="text-xs text-tinta-suave">{ayuda}</p>}
      {errores?.map((e) => <p key={e} className="text-xs text-red-700">{e}</p>)}
    </div>
  )
}

/**
 * El formulario completo del producto.
 *
 * - `useActionState` lo conecta con la Server Action `guardarProducto`
 *   (ver FormLogin.tsx). `guardando` desactiva el botón mientras se guarda.
 * - `v` = valores a mostrar: los iniciales, pisados por lo que devolvió la acción
 *   si hubo error (así no se borra lo que se había escrito).
 * - `err` = errores por campo que devolvió Zod.
 * - `useState` guarda el slug y si el admin lo tocó a mano. Mientras no lo toque,
 *   el slug se genera solo al escribir el nombre.
 *
 * Inputs: con `defaultValue`, el navegador maneja el valor ("no controlado").
 * El slug usa `value` + `onChange` ("controlado"): React decide qué se muestra,
 * porque hay que poder cambiarlo desde el campo del nombre.
 */
export function FormProducto({ inicial, categorias }: Props) {
  const [estado, accion, guardando] = useActionState<EstadoProducto, FormData>(guardarProducto, {})
  // si el guardado falla, el form vuelve con lo que se había escrito
  const v = { ...inicial, ...estado.valores }
  const err = estado.errores ?? {}

  // el slug se arma solo a partir del nombre hasta que lo edites a mano
  const [slugTocado, setSlugTocado] = useState(Boolean(inicial.slug))
  const [slug, setSlug] = useState(inicial.slug)

  return (
    <form action={accion} className="mt-6 space-y-5">
      {/* Campo oculto: con id es edición, vacío es alta */}
      <input type="hidden" name="id" value={inicial.id} />

      <Campo nombre="name" etiqueta="Nombre" errores={err.name}>
        <input
          id="name"
          name="name"
          required
          defaultValue={v.name}
          onChange={(e) => !slugTocado && setSlug(slugificar(e.target.value))}
          className={CAMPO}
        />
      </Campo>

      <Campo nombre="slug" etiqueta="Slug (URL)" ayuda={`Se ve en /producto/${slug || '…'}`} errores={err.slug}>
        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTocado(true)
            setSlug(e.target.value)
          }}
          className={CAMPO}
        />
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo nombre="brand" etiqueta="Marca" errores={err.brand}>
          <input id="brand" name="brand" defaultValue={v.brand} className={CAMPO} />
        </Campo>
        {/* Las categorías vienen de la base (las carga la página) */}
        <Campo nombre="categoryId" etiqueta="Origen" errores={err.categoryId}>
          <select id="categoryId" name="categoryId" defaultValue={v.categoryId} className={CAMPO}>
            <option value="">Sin origen</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Campo>
        <Campo nombre="gender" etiqueta="Género" errores={err.gender}>
          <select id="gender" name="gender" defaultValue={v.gender} className={CAMPO}>
            <option value="">Sin género</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="unisex">Unisex</option>
          </select>
        </Campo>
        <Campo nombre="concentration" etiqueta="Concentración" errores={err.concentration}>
          <select id="concentration" name="concentration" defaultValue={v.concentration} className={CAMPO}>
            <option value="">—</option>
            <option value="EDP">EDP</option>
            <option value="EDT">EDT</option>
            <option value="Parfum">Parfum</option>
            <option value="Extrait">Extrait</option>
          </select>
        </Campo>
      </div>

      {/* Precios en pesos; la Server Action los convierte a centavos */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo nombre="precio5" etiqueta="Precio 5 ml ($)" ayuda="Vacío = no se vende en 5 ml" errores={err.precio5}>
          <input id="precio5" name="precio5" inputMode="numeric" placeholder="8500" defaultValue={v.precio5} className={CAMPO} />
        </Campo>
        <Campo nombre="precio10" etiqueta="Precio 10 ml ($)" ayuda="Vacío = no se vende en 10 ml" errores={err.precio10}>
          <input id="precio10" name="precio10" inputMode="numeric" placeholder="15000" defaultValue={v.precio10} className={CAMPO} />
        </Campo>
      </div>

      {/* Foto actual (o la genérica) y el selector de archivo. `accept` filtra los formatos en el navegador */}
      <Campo nombre="foto" etiqueta="Foto" ayuda="JPG, PNG o WebP, hasta 4 MB. Si no subís una, queda la actual." errores={err.foto}>
        <div className="flex items-center gap-4">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-crema-2">
            <Image src={urlFoto(inicial.imageUrl || null)} alt="" fill sizes="80px" className="object-cover" />
          </div>
          <input id="foto" name="foto" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" />
        </div>
      </Campo>

      {/* Los 4 textos largos se arman recorriendo una lista de [nombre, etiqueta] */}
      {(
        [
          ['description', 'Descripción'],
          ['notes', 'Notas (salida, corazón, fondo)'],
          ['occasions', 'Ocasiones de uso'],
          ['presentation', 'Cómo lo preparamos'],
        ] as const
      ).map(([nombre, etiqueta]) => (
        <Campo key={nombre} nombre={nombre} etiqueta={etiqueta} errores={err[nombre]}>
          <textarea id={nombre} name={nombre} rows={3} defaultValue={v[nombre]} className={CAMPO} />
        </Campo>
      ))}

      <Campo nombre="searchTerms" etiqueta="Palabras de búsqueda" ayuda="Formas en que la gente lo escribe mal, separadas por espacios" errores={err.searchTerms}>
        <input id="searchTerms" name="searchTerms" defaultValue={v.searchTerms} className={CAMPO} />
      </Campo>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={v.active === 'on'} />
        Activo (si lo destildás, se oculta de la tienda sin borrarse)
      </label>

      {/* Error general y aviso de que hay campos con error */}
      {estado.mensaje && <p role="alert" className="text-sm text-red-700">{estado.mensaje}</p>}
      {Object.keys(err).length > 0 && <p role="alert" className="text-sm text-red-700">Revisá los campos marcados.</p>}

      <div className="flex gap-3">
        <button disabled={guardando} className="rounded-full bg-tinta px-6 py-2.5 text-sm font-semibold text-crema disabled:opacity-50">
          {guardando ? 'Guardando…' : 'Guardar'}
        </button>
        <Link href="/admin" className="rounded-full border border-arena px-6 py-2.5 text-sm">Cancelar</Link>
      </div>
    </form>
  )
}
