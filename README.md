# Rastro Perfumería · v2

E-commerce a medida para **Rastro Perfumería**, mi emprendimiento de decants y perfumes árabes y de diseñador. Esta es la segunda versión de la tienda, reescrita desde cero.

> **Estado:** en desarrollo. La versión anterior está online en [rastroperfumeria.vercel.app](https://rastroperfumeria.vercel.app).

## Por qué una v2

La primera versión resolvió el negocio: catálogo, carrito, pedidos confirmados por WhatsApp y panel de administración. Esta versión la reescribe con dos objetivos:

- **Desarrollo guiado por especificaciones:** cada funcionalidad se define antes de escribir código.
- **Arquitectura en capas:** la lógica de negocio queda separada del acceso a datos, para que el código sea más fácil de probar y de cambiar.

## Arquitectura

```
src/
├── app/                     Rutas de Next.js (páginas y Server Actions del admin)
├── components/              Componentes de UI (header, tarjetas, pedido)
├── services/                Capa de negocio
│   ├── ProductoService.ts   Contrato (interfaces)
│   └── impl/                Implementación
├── persistence/dao/         Capa de acceso a datos (DAO)
│   └── impl/                Implementación con Drizzle
├── db/
│   ├── schema.ts            Tablas: categorías, productos, medidas, fotos
│   └── index.ts             Conexión a PostgreSQL (Neon)
├── lib/                     Instancias de servicios y DAO, pedido, sesión, helpers
└── proxy.ts                 Protege /admin: sin sesión redirige al login
```

Una ruta nunca habla directo con la base: pide los datos al servicio, y el servicio se los pide al DAO.

En el esquema, el precio no vive en el producto sino en cada medida (3 ml, 5 ml, 10 ml…), y el stock se controla por mililitros del frasco original.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4, íconos de lucide-react |
| Base de datos | PostgreSQL serverless en Neon |
| ORM | Drizzle ORM |
| Validación | Zod (formularios del admin) |
| Fotos | Vercel Blob |
| Deploy | Vercel |
| Paquetes | pnpm |

El diseño es **mobile-first**: casi todo el público entra desde el celular.

## Correr el proyecto

```bash
pnpm install
# .env.local con: DATABASE_URL (Neon), ADMIN_PASSWORD,
# SESSION_SECRET (mínimo 32 caracteres) y BLOB_READ_WRITE_TOKEN
pnpm db:push                 # crea las tablas
# cargar los datos: pegar BDRastro.txt en el SQL Editor de Neon
pnpm dev                     # http://localhost:3000
```

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm lint` | ESLint |
| `pnpm db:push` | Sincroniza el esquema con la base |
| `pnpm db:studio` | Interfaz para ver los datos |

## Autor

**Santino Borio** · [Portfolio](https://haghen29.github.io) · [LinkedIn](https://www.linkedin.com/in/santinoborio)
