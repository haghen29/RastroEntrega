# Glosario — conceptos que aparecen en el código

Cada concepto tiene una explicación corta, un ejemplo **sacado de este proyecto** y el archivo donde se ve.

---

## 1. JavaScript / TypeScript

### `async` y `await`
Algunas operaciones **tardan**: consultar la base, leer cookies, subir una foto. JavaScript no se queda congelado esperando: esas funciones devuelven una **Promise** (ver abajo).

- **`async`** delante de una función significa "esta función hace cosas que tardan". Una función `async` siempre devuelve una Promise.
- **`await`** delante de una llamada significa "esperá a que termine y dame el resultado antes de seguir a la línea siguiente". Solo se puede usar dentro de una función `async`.

```ts
// ProductoServiceImpl.ts
async listarDecants(filtros) {
  const decants = await this.productoDAO.listarDecantsActivos() // espera a la base
  return decants.filter(...)                                     // recién acá sigue
}
```
Sin el `await`, `decants` sería la Promise (la "promesa" del resultado), no la lista de productos.

### `Promise`
Un objeto que representa **un resultado que va a llegar más adelante**. `Promise<ProductoConDetalle[]>` se lee "una promesa de una lista de productos". Se "abre" con `await`.

### `Promise.all([...])`
Lanza varias operaciones **a la vez** y espera a que terminen todas. Es más rápido que hacer un `await` después del otro.
```ts
// admin/productos/[id]/page.tsx
const [producto, categorias] = await Promise.all([
  productoServiceAdm.obtenerPorId(id),
  productoService.listarCategorias(),
])
```

### `try` / `catch`
Si algo falla dentro del `try`, en vez de romper todo se ejecuta el `catch`. Se usa al subir la foto, al guardar en la base y al leer el localStorage.
```ts
try {
  await productoServiceAdm.crearProducto(...)
} catch (error) {
  return fallar({ mensaje: 'No se pudo guardar.' })
}
```

### `throw new Error(...)`
Corta la ejecución con un error a propósito. Por ejemplo, [db/index.ts](src/db/index.ts) lo hace si falta `DATABASE_URL`: es mejor fallar con un mensaje claro que con un error raro más tarde.

### `import` / `export`
Cada archivo es un **módulo**. Lo que tiene `export` se puede usar desde otro archivo con `import`.
- `export function x` / `import { x } from '...'`: export con nombre.
- `export default function Pagina`: el export principal del archivo (Next lo usa para las páginas).
- `import type { ... }`: trae solo un tipo, no código.

### Alias `@/`
`@/lib/formato` es lo mismo que `src/lib/formato`. Está configurado en `tsconfig.json`. Evita los `../../../`.

### `const` y `let`
- `const`: no se puede reasignar.
- `let`: se puede reasignar. Ejemplo: `let items` en [pedido.ts](src/lib/pedido.ts), que cambia cada vez que se modifica el pedido.

### Funciones flecha `=>`
Una forma corta de escribir funciones. `(i) => i.cantidad` es lo mismo que `function (i) { return i.cantidad }`.

### Template literals `` `...${x}...` ``
Texto con valores adentro. `` `/producto/${p.slug}` `` da `/producto/decant-9pm`.

### Spread `...`
"Desparramar" el contenido de algo:
- En objetos: `{ ...i, cantidad: 3 }` copia todo `i` y cambia solo `cantidad`.
- En listas: `[...actual, item]` arma una lista nueva con lo anterior más `item`.
- En funciones: `Math.min(...precios)` pasa cada elemento como argumento suelto.

### Desestructuración
Sacar partes de un objeto o una lista en variables:
```ts
const [vence, firma] = token.split('.')            // de una lista
const { precio5, precio10, ...datos } = resultado.data  // de un objeto; "...datos" junta el resto
```

### Optional chaining `?.`
`producto.category?.name`: si `category` es null, da `undefined` en vez de romper con "cannot read property of null".

### Nullish `??` y "o" `||`
- `a ?? b`: usa `b` solo si `a` es `null` o `undefined`.
- `a || b`: usa `b` si `a` es "falso": `null`, `undefined`, `''`, `0` o `false`.
```ts
producto ?? null                 // undefined -> null
Number(texto('id')) || undefined // 0 (vacío) -> undefined
```

### `&&` para mostrar condicionalmente
`{sumado && <div>Listo</div>}`: si `sumado` es true, muestra el div; si no, nada.

### Ternario `condición ? a : b`
Un if/else en una sola expresión: `activo ? 'bg-tinta' : 'border-arena'`.

### Métodos de listas
| Método | Qué hace | Ejemplo en el proyecto |
|---|---|---|
| `map` | Transforma cada elemento y devuelve una lista nueva | `decants.map((p) => <TarjetaDecant ... />)` |
| `filter` | Se queda con los que cumplen una condición | `decants.filter(...)` en el servicio |
| `find` | Devuelve el primero que cumple | `variantes.find((v) => v.id === elegida)` |
| `reduce` | Acumula un resultado recorriendo la lista | `totalPedido` suma precio × cantidad |
| `includes` | ¿Está este elemento o texto? | `texto.includes(q)` en la búsqueda |
| `join` | Une los elementos en un texto | `[...].join(' · ')` |
| `filter(Boolean)` | Saca los vacíos (`''`, `null`, `undefined`) | `[categoria, marca].filter(Boolean)` |

### Expresiones regulares `/.../`
Patrones para buscar o validar texto. `/^[a-z0-9]+(-[a-z0-9]+)*$/` = "solo minúsculas y números, separados por guiones" (la regla del slug). La `g` del final (`/x/g`) = reemplazar en todo el texto, no solo la primera vez.

---

## 2. Tipos de TypeScript

### `type` e `interface`
Describen **la forma** de los datos. TypeScript avisa antes de ejecutar si algo no encaja.
- `type FiltrosCatalogo = { genero?: string }`: el `?` significa opcional.
- `interface ProductoDAO { ... }`: un **contrato**, la lista de métodos que una clase promete tener.

### `implements`
`class ProductoDAOImpl implements ProductoDAO`: la clase se compromete a cumplir la interfaz. Si le falta un método, no compila.

### Uniones `|`
`string | null` = "un texto o null". `'' | 'envio' | 'retiro'` = solo uno de esos tres valores.

### Genéricos `<T>`
"Tipo que lleva otro tipo adentro": `Promise<number>` (promesa de un número), `Map<string, {...}>` (diccionario de texto a objeto).

### `Pick`, `Partial`, `Record`
- `Pick<Product, 'name' | 'slug'>`: de Product, solo esos campos.
- `Partial<X>`: todos los campos de X, pero opcionales.
- `Record<string, string>`: objeto con claves y valores de texto.

### `as const`
Marca valores como fijos. `[5, 10] as const` es exactamente `[5, 10]`, no "una lista de números cualquiera".

### `!` (non-null assertion)
`process.env.DATABASE_URL!` = "TypeScript, confiá en que esto no es undefined".

---

## 3. Clases y arquitectura

### `class`, `constructor`, `private readonly`
```ts
class ProductoServiceImpl {
  constructor(private readonly productoDAO: ProductoDAO) {}
}
```
- `class`: el molde para crear objetos con `new`.
- `constructor`: lo que se ejecuta al crear el objeto.
- `private readonly productoDAO`: atajo que crea el atributo `this.productoDAO`, lo hace privado (solo se usa dentro de la clase) y de solo lectura.

### Arquitectura en capas
```
Página (app/)  ->  Service  ->  DAO  ->  Drizzle  ->  Neon (PostgreSQL)
```
- **Service** ([services/](src/services/)): reglas del negocio. Ejemplo: cómo se filtra el catálogo.
- **DAO** ([persistence/dao/](src/persistence/dao/)): Data Access Object, el único que habla con la base.
- **Regla:** una página nunca habla directo con la base.

### Inyección de dependencias
El servicio **no crea** su DAO: se lo pasan por el constructor ([lib/services.ts](src/lib/services.ts)):
```ts
new ProductoServiceImpl(productoDao)
```
El servicio depende de la **interfaz**, no de la clase concreta. Se podría pasar un DAO falso para hacer tests, o cambiar de base, sin tocar el servicio.

---

## 4. React

### Componente
Una función que devuelve **JSX** (HTML dentro de JavaScript). Su nombre empieza con mayúscula: `TarjetaDecant`, `Header`.

### JSX
- Se usa `className` en vez de `class`.
- `{...}` mete JavaScript dentro del HTML: `{producto.name}`.
- Los comentarios se escriben `{/* así */}`.

### Props
Los "parámetros" de un componente: `<TarjetaDecant producto={p} href="..." />`.
- `children`: lo que va entre la etiqueta de apertura y la de cierre (`<Chip>Todos</Chip>`).

### `key`
Cuando se usa `.map()` para dibujar una lista, cada elemento necesita una `key` única para que React sepa cuál es cuál al actualizar.

### Hooks
Funciones especiales de React. Empiezan con `use` y solo se usan en Client Components.
| Hook | Qué hace | Dónde |
|---|---|---|
| `useState` | Guarda un valor que, al cambiar, redibuja el componente | [SelectorCompra.tsx](src/components/SelectorCompra.tsx): medida, cantidad |
| `useActionState` | Conecta un formulario con una Server Action: estado, acción y "enviando" | [FormLogin.tsx](src/app/admin/login/FormLogin.tsx), [FormProducto.tsx](src/app/admin/productos/FormProducto.tsx) |
| `useSyncExternalStore` | Conecta React con datos externos (localStorage) | [pedido.ts](src/lib/pedido.ts) |
| `usePathname` (de Next) | Devuelve la ruta actual | [NavLinks.tsx](src/components/NavLinks.tsx) |
| `usePedido` (propio) | Devuelve el pedido y se actualiza solo | [pedido.ts](src/lib/pedido.ts) |

### Input controlado vs. no controlado
- **No controlado** (`defaultValue`): el navegador maneja el valor. React solo pone el inicial.
- **Controlado** (`value` + `onChange`): React decide qué se muestra en cada momento. Se usa en el slug y en los datos del cliente.

### `cache()` de React
Recuerda el resultado de una función durante el mismo pedido al servidor. En la ficha, `generateMetadata` y la página piden el mismo producto, pero se consulta la base una sola vez.

---

## 5. Next.js

### Rutas por carpetas (App Router)
Cada carpeta de `src/app/` es una URL y su `page.tsx` es la página.
| Archivo especial | Para qué |
|---|---|
| `page.tsx` | La página |
| `layout.tsx` | El marco común (header y footer) |
| `error.tsx` | Qué mostrar si la página falla |
| `not-found.tsx` | Qué mostrar si se llama a `notFound()` (404) |
| `[slug]` / `[id]` | **Ruta dinámica**: el valor de la URL llega en `params` |

### Server Component (por defecto)
Se ejecuta **en el servidor**: puede consultar la base y llega al navegador como HTML listo. No puede usar `useState` ni `onClick`. Ejemplos: las páginas, `Header`, `TarjetaDecant`.

### `'use client'` (Client Component)
Primera línea del archivo. El componente **también corre en el navegador** y puede tener estado, clics y localStorage. Ejemplos: `SelectorCompra`, `VistaPedido`, `NavLinks`.
**Regla del proyecto:** todo es Server Component salvo lo que necesita interactividad.

### `'use server'` (Server Actions)
Primera línea de [acciones.ts](src/app/admin/acciones.ts). Sus funciones corren en el servidor, pero un formulario las llama directo: `<form action={cerrarSesion}>`. No hace falta escribir una API ni un `fetch`.
**Ojo:** cualquiera puede llamarlas, por eso cada una valida los datos y chequea la sesión.

### `params` y `searchParams`
- `params`: la parte dinámica de la ruta (`/producto/decant-9pm` -> `{ slug: 'decant-9pm' }`).
- `searchParams`: lo que va después del `?` (`?genero=masculino`).
- En Next 16 los dos llegan como Promise, por eso se usa `await params`.

### `metadata` y `generateMetadata`
El `<title>` y la descripción para Google y para WhatsApp. `metadata` es fija; `generateMetadata` se calcula según el producto.

### `dynamic = 'force-dynamic'`
"Armá esta página en cada visita." Así un cambio de precio del admin se ve al instante.

### `redirect()`, `notFound()`, `revalidatePath()`
- `redirect('/admin')`: manda a otra página y corta la función.
- `notFound()`: muestra la 404.
- `revalidatePath('/', 'layout')`: le avisa a Next que los datos cambiaron, para que no muestre páginas guardadas viejas.

### `proxy.ts`
Antes se llamaba "middleware". Se ejecuta **antes** de cada página que coincide con `matcher` (`/admin/:path*`) y puede redirigir. Es la primera barrera del admin.

### `<Link>`, `<Image>`, `<Form>`
- `<Link>`: navega sin recargar toda la página.
- `<Image>`: optimiza las fotos (tamaño justo, formato liviano, carga diferida).
- `<Form>` (`next/form`): un formulario de búsqueda que navega a `?q=...` sin recarga completa.

---

## 6. Base de datos (Drizzle + Neon)

| Concepto | Qué es |
|---|---|
| **ORM** | Escribir consultas en TypeScript en vez de SQL a mano, con tipos |
| `pgTable` | Define una tabla ([schema.ts](src/db/schema.ts)) |
| `primaryKey` | El identificador único de cada fila (`id`) |
| `references` | **Clave foránea**: esta columna apunta a otra tabla |
| `onDelete: 'cascade'` | Si se borra el producto, se borran sus variantes |
| `relations` | Le explica a Drizzle cómo se unen las tablas, para usar `with` |
| `findMany({ with })` | Trae un producto junto con sus variantes y su categoría (como un JOIN) |
| `eq`, `and`, `ne`, `asc` | `=`, `AND`, `<>`, `ORDER BY ... ASC` |
| `.returning()` | Pide que el INSERT devuelva el id generado |
| `pnpm db:push` | Crea o actualiza las tablas en Neon a partir de schema.ts |

**Precios en centavos:** `$8.500` se guarda como `850000`, un entero. Con decimales, `0.1 + 0.2` da `0.30000000000000004`.

---

## 7. Seguridad

| Concepto | Dónde | Para qué |
|---|---|---|
| **Cookie `httpOnly`** | acciones.ts | El JavaScript del navegador no la puede leer |
| **`sameSite: 'lax'`** | acciones.ts | La cookie no viaja en pedidos que vienen de otros sitios (CSRF) |
| **HMAC-SHA256** | sesion.ts | Firma la cookie con un secreto: nadie puede fabricar una válida |
| **Comparación en tiempo constante** | sesion.ts (`iguales`) | No dar pistas por el tiempo que tarda en comparar |
| **Límite de intentos** | acciones.ts | 5 intentos por IP; después, 15 minutos de espera |
| **Validación con Zod** | acciones.ts | Rechazar datos mal formados antes de tocar la base |
| **`server-only`** | db/index.ts, lib/admin.ts | Que la conexión a la base nunca llegue al navegador |
| **Variables de entorno** | .env.local | Contraseñas y claves fuera del código (no se suben a git) |
| **Doble chequeo** | proxy.ts + exigirAdmin | Las páginas y también las acciones verifican la sesión |

---

## 8. Navegador

### `localStorage`
Un espacio del navegador para guardar texto que **sobrevive** al cerrar la pestaña. Ahí vive el pedido (`rastro-pedido`). Solo guarda texto, por eso se usa `JSON.stringify` para guardar y `JSON.parse` para leer.

### Evento `storage`
El navegador lo dispara en las **otras** pestañas cuando cambia el localStorage. Así el contador del carrito se sincroniza entre pestañas.

### `encodeURIComponent`
Pasa un texto a un formato seguro para una URL (los espacios quedan como `%20`). Se usa en el link de WhatsApp.

### Accesibilidad (`aria-*`, `sr-only`, `role`)
Atributos para lectores de pantalla: `sr-only` es texto invisible que sí se lee, `aria-current` marca la página actual y `role="alert"` lee el error apenas aparece.
