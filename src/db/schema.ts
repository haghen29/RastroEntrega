// El ESQUEMA de la base: cada `pgTable` es una tabla de PostgreSQL definida en
// TypeScript. `pnpm db:push` lee este archivo y crea o actualiza las tablas en Neon.
//
// Cómo leer una columna, por ejemplo `name: text('name').notNull()`:
// - `name` es el nombre en el código; 'name' es el nombre de la columna en la base.
// - `text` es el tipo de dato. También aparecen integer, boolean, serial y timestamp.
// - Modificadores: `.notNull()` (obligatorio), `.default(x)` (valor si no se manda),
//   `.unique()` (no se puede repetir), `.primaryKey()` (identificador de la fila).
import { relations } from 'drizzle-orm'
import {
  bigint,
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

/**
 * Las dos familias del catalogo: "Arabes" y "Disenador".
 * `serial` = número entero que la base autoincrementa sola (1, 2, 3...).
 */
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  sortOrder: integer('sort_order').notNull().default(0),
  active: boolean('active').notNull().default(true),
})

/**
 * Un perfume. El precio NO vive aca: vive en cada medida (ver variants).
 * Algunas columnas (externalId, imageId, mlStock, mlBottle, featured) existen
 * para cosas que quedaron fuera del MVP (stock, destacados) y hoy no se usan.
 */
export const products = pgTable('products', {
  id: serial('id').primaryKey(),

  // id del sistema viejo; puede no existir todavia para algunos decants
  externalId: bigint('external_id', { mode: 'number' }),

  // el slug es la parte de la URL: /producto/decant-9pm. Es único.
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  brand: text('brand').notNull().default(''),
  concentration: text('concentration').notNull().default(''),

  description: text('description').notNull().default(''),
  occasions: text('occasions').notNull().default(''),
  notes: text('notes').notNull().default(''),
  presentation: text('presentation').notNull().default(''),

  // palabras mal escritas que igual tienen que encontrar el producto
  searchTerms: text('search_terms').notNull().default(''),

  // tipo de producto; hoy todo es 'decant'
  kind: text('kind').notNull().default('decant'),

  // 'masculino' | 'femenino' | 'unisex' | ''
  // decide en cual de las 3 tarjetas de la home aparece; '' = en ninguna
  gender: text('gender').notNull().default(''),

  // CLAVE FORÁNEA: apunta al id de una categoría.
  // onDelete 'set null' = si se borra la categoría, el producto queda sin categoría (no se borra).
  categoryId: integer('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),

  // foto principal, la que se sube desde /admin
  imageUrl: text('image_url'),
  imageId: text('image_id'),

  // stock por mililitros del frasco grande. null = no se controla stock
  mlStock: integer('ml_stock'),
  mlBottle: integer('ml_bottle'),

  // active = false oculta el producto de la tienda sin borrarlo
  active: boolean('active').notNull().default(true),
  featured: boolean('featured').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),

  // fecha de alta; defaultNow() la completa la base sola
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

/**
 * Cada medida vendible de un perfume: "5 ml" y "10 ml".
 * priceCents es un ENTERO EN CENTAVOS: $8.500 se guarda como 850000.
 * Relación: un producto tiene MUCHAS variantes (1 a N).
 * onDelete 'cascade' = si se borra el producto, se borran sus variantes.
 */
export const variants = pgTable('variants', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  ml: integer('ml').notNull(),
  priceCents: integer('price_cents').notNull(),
  stock: integer('stock'), // null = sin control de stock en esta medida
  sortOrder: integer('sort_order').notNull().default(0),
  // una medida sin precio se desactiva en vez de borrarse (ver ProductoDAOImpl)
  active: boolean('active').notNull().default(true),
})

/**
 * Fotos extra de un producto, cargadas desde /admin.
 * (Quedó preparada para más adelante: en el MVP se usa una sola foto, products.imageUrl.)
 */
export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  imageId: text('image_id'),
  sortOrder: integer('sort_order').notNull().default(0),
})

// --- Relaciones: le enseñan a db.query como unir las tablas solo ---
// No crean nada en la base (eso ya lo hacen las claves foráneas de arriba).
// Le sirven a Drizzle para entender pedidos como
// `findMany({ with: { variants: true, category: true } })`: trae el producto
// con sus variantes y su categoría en una sola consulta (como un JOIN).
// `one` = "tiene uno" y `many` = "tiene muchos".

// Una categoría tiene muchos productos
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

// Un producto pertenece a una categoría y tiene muchas variantes y fotos
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(variants),
  images: many(productImages),
}))

// Una variante pertenece a un producto
export const variantsRelations = relations(variants, ({ one }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
}))

// Una foto pertenece a un producto
export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}))

// Tipos listos para usar en componentes, derivados del schema
// `$inferSelect` = "el tipo de una fila tal como sale de un SELECT". Si se agrega
// una columna arriba, estos tipos se actualizan solos y TypeScript avisa dónde falta usarla.
export type Product = typeof products.$inferSelect
export type Variant = typeof variants.$inferSelect
export type Category = typeof categories.$inferSelect
