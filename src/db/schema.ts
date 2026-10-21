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
 */
export const products = pgTable('products', {
  id: serial('id').primaryKey(),

  // id del sistema viejo; puede no existir todavia para algunos decants
  externalId: bigint('external_id', { mode: 'number' }),

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

  kind: text('kind').notNull().default('decant'),

  // 'masculino' | 'femenino' | 'unisex' | ''
  // decide en cual de las 3 tarjetas de la home aparece; '' = en ninguna
  gender: text('gender').notNull().default(''),

  categoryId: integer('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),

  // foto principal, la que se sube desde /admin
  imageUrl: text('image_url'),
  imageId: text('image_id'),

  // stock por mililitros del frasco grande. null = no se controla stock
  mlStock: integer('ml_stock'),
  mlBottle: integer('ml_bottle'),

  active: boolean('active').notNull().default(true),
  featured: boolean('featured').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

/**
 * Cada medida vendible de un perfume: "5 ml" y "10 ml".
 * priceCents es un ENTERO EN CENTAVOS: $8.500 se guarda como 850000.
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
  active: boolean('active').notNull().default(true),
})

/**
 * Fotos extra de un producto, cargadas desde /admin.
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

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(variants),
  images: many(productImages),
}))

export const variantsRelations = relations(variants, ({ one }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
}))

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}))

// Tipos listos para usar en componentes, derivados del schema
export type Product = typeof products.$inferSelect
export type Variant = typeof variants.$inferSelect
export type Category = typeof categories.$inferSelect
