================================================================
RASTRO PERFUMERIA JOJI  ―  README / GUIA DEL PROYECTO
Estado al 28/08/2026
================================================================

QUE ES
------
E-commerce de perfumeria a medida. Next.js (App Router) + PostgreSQL
en Neon + Drizzle como ORM + Tailwind v4 con Radix Primitives para
la UI. Se va a desplegar en Vercel.

REGLA IMPORTANTE: el proyecto ENTERO vive dentro de my-app/.
La carpeta de arriba ("Rastro Borio") no contiene nada mas.
El repositorio git tambien arranca en my-app/, no afuera.


STACK ELEGIDO
--------------
  Next.js 16.3.3      App Router + Turbopack
  React 19.2.8
  TypeScript 5.9
  Tailwind CSS v4     estilos (mobile-first)
  Radix Primitives    componentes accesibles SIN estilos propios
  Drizzle ORM 0.45    ORM
  Neon (PostgreSQL)   base de datos serverless
  pnpm 11.24          gestor de paquetes (NO usar npm)
  Vercel              deploy


DECISIONES YA TOMADAS
----------------------
- Base de datos: PostgreSQL en Neon. (Se descarto SQLite: no funciona
  en el serverless de Vercel sin un servicio aparte.)
- UI: Radix PRIMITIVES (sin estilos) + Tailwind v4.
  NO se usa @radix-ui/themes aunque este instalado.
- Gestor de paquetes: pnpm. Un solo lockfile: pnpm-lock.yaml.
- Estructura: todo el codigo vive bajo src/.
- El proyecto entero vive dentro de my-app/, incluido el repo git.
- Mobile-first: el e-commerce debe priorizar verse bien en celulares
  por sobre computadoras.


----------------------------------------------------------------
ESTADO ACTUAL  (importante: leer antes de buscar algo)
----------------------------------------------------------------
TODO ESTA INSTALADO. CASI NADA ESTA ESCRITO.

Hecho:
  [x] Proyecto Next creado y compilando
  [x] Tailwind v4 andando (ya se usa en page.tsx)
  [x] Todas las dependencias instaladas y declaradas en package.json
  [x] Estructura src/ armada
  [x] Un solo lockfile (pnpm-lock.yaml)

Falta:
  [ ] src/db/schema.ts        definicion de tablas
  [ ] src/db/index.ts         conexion a Neon
  [ ] drizzle.config.ts       config de Drizzle (va en la RAIZ, no en src)
  [ ] .env.local              con DATABASE_URL de Neon
  [ ] src/components/         no existe todavia
  [ ] src/lib/                no existe todavia
  [ ] Rutas productos/ y carrito/
  [ ] Repo remoto en GitHub (hace falta para deployar en Vercel)

La pagina de inicio sigue siendo la plantilla de create-next-app
(el logo de Next). Todavia no hay nada de perfumeria.

ESTADO DE GIT: Repo iniciado en my-app/. Un solo commit: "Initial
commit from Create Next App". SIN remote todavia: falta crear el
repo en GitHub y conectarlo, y despues enlazar Vercel a ese repo.


ARBOL REAL (lo que hay HOY)
---------------------------
my-app/
├── src/
│   ├── app/                  ← rutas. TODO lo que sea pagina va aca
│   │   ├── layout.tsx        ← layout raiz. Fuentes Geist y <html>/<body>
│   │   ├── page.tsx          ← la home. HOY es la plantilla de Next
│   │   ├── globals.css       ← @import "tailwindcss" + variables de tema
│   │   └── favicon.ico
│   └── db/                   ← VACIA. Aca va schema.ts e index.ts
│
├── public/                   ← imagenes estaticas servidas tal cual
│   └── file.svg globe.svg next.svg vercel.svg window.svg
│                               (son los del template, se pueden borrar)
│
├── package.json              ← dependencias y scripts
├── pnpm-lock.yaml            ← UNICO lockfile. No agregar package-lock.json
├── pnpm-workspace.yaml       ← permisos de build scripts (esbuild/sharp/etc)
├── tsconfig.json             ← TypeScript. Aca vive el alias "@/"
├── next.config.ts            ← config de Next. Hoy esta vacia
├── postcss.config.mjs        ← engancha Tailwind v4 via @tailwindcss/postcss
├── eslint.config.mjs         ← reglas de lint
├── next-env.d.ts             ← generado por Next. NO tocar
├── .gitignore
├── README.md                 ← el generico de create-next-app
├── README.txt                ← este archivo
├── AGENTS.md / CLAUDE.md     ← generados solos por "next dev". NO tocar
├── .next/                    ← build. Ignorado por git
└── node_modules/             ← dependencias. Ignorado por git


ESTRUCTURA OBJETIVO (a donde se quiere llegar)
------------------------------------------------
my-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              ← home del catalogo
│   │   ├── globals.css
│   │   ├── productos/
│   │   │   ├── page.tsx          ← listado completo de productos
│   │   │   └── [id]/
│   │   │       └── page.tsx      ← detalle de un producto
│   │   └── carrito/
│   │       └── page.tsx          ← (cuando llegue esa etapa)
│   │
│   ├── components/               ← componentes reutilizables de UI
│   │   ├── ui/                   ← wrappers de Radix + estilos Tailwind
│   │   │   ├── Dialog.tsx
│   │   │   ├── DropdownMenu.tsx
│   │   │   └── Tooltip.tsx
│   │   ├── ProductCard.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   ├── db/
│   │   ├── schema.ts             ← definicion de tablas
│   │   └── index.ts              ← conexion a Neon
│   │
│   └── lib/
│       └── utils.ts              ← helpers (ej: formatear precios)
│
├── drizzle.config.ts             ← config de Drizzle (raiz de my-app)
├── drizzle/                      ← migraciones (se crea sola)
├── public/
├── package.json
├── tsconfig.json
└── next.config.ts


DEPENDENCIAS INSTALADAS
-------------------------
dependencies
  next 16.3.3                        ← funcionando
  react 19.2.8 / react-dom 19.2.8    ← funcionando
  @neondatabase/serverless 1.1.0     ← instalado, sin usar
  drizzle-orm 0.45.2                 ← instalado, sin usar
  @radix-ui/react-dialog 1.1.23      ← instalado, sin usar
  @radix-ui/react-dropdown-menu 2.1.24
  @radix-ui/react-slot 1.3.3
  @radix-ui/react-tooltip 1.2.16
  @radix-ui/themes 3.3.0             ← instalado pero NO se va a usar
  postcss 8.5.26

devDependencies
  drizzle-kit 0.31.10                ← instalado, sin config todavia
  tailwindcss 4.3.3 + @tailwindcss/postcss 4.3.3
  typescript 5.9.3, eslint 9, eslint-config-next 16.3.3
  @types/node, @types/react, @types/react-dom


DONDE BUSCO CADA COSA
-----------------------
Quiero...                          Voy a...
-----------------------------------------------------------------
Crear una pagina nueva             src/app/<nombre>/page.tsx
Pagina de detalle de un producto   src/app/productos/[id]/page.tsx
Listado completo de productos      src/app/productos/page.tsx
Cambiar header/footer global       src/app/layout.tsx
Cambiar colores o fuentes          src/app/globals.css (bloque @theme)
Un componente reutilizable         src/components/  (falta crearla)
Envolver un Radix con estilos      src/components/ui/
Helpers (formatear precios, etc)   src/lib/utils.ts  (falta crearla)
Definir o cambiar tablas           src/db/schema.ts  (falta crearlo)
Conectarme a la base                src/db/index.ts   (falta crearlo)
Config de migraciones              drizzle.config.ts (falta, va en la
                                    raiz de my-app, NO dentro de src/)
Migraciones generadas              drizzle/ (la crea drizzle-kit sola)
Poner una imagen o el logo         public/
Agregar una dependencia            pnpm add <paquete>
La cadena de conexion de Neon      .env.local (falta crearlo)


COMANDOS
--------
pnpm dev      ← levanta el server de desarrollo (localhost:3000)
pnpm build    ← build de produccion. Corre TypeScript, avisa si algo rompe
pnpm start    ← sirve el build de produccion
pnpm lint     ← eslint

Todavia NO existen scripts de base de datos. Cuando se agregue Drizzle
van a hacer falta en package.json:
   db:generate  ← genera el SQL de migracion desde el schema
   db:migrate   ← aplica las migraciones a Neon
   db:push      ← empuja el schema directo (comodo en desarrollo)
   db:studio    ← abre la UI para ver los datos


COSAS QUE HAY QUE SABER (trampas)
------------------------------------
1) SIEMPRE pnpm, nunca npm.
   package.json declara packageManager: pnpm@11.24.0. Si corres
   "npm install" se crea un package-lock.json y quedan DOS lockfiles;
   Vercel puede elegir el equivocado y romper el deploy.
   Si aparece un package-lock.json, borralo.

2) Tailwind v4 NO usa tailwind.config.ts.
   La config vive dentro de src/app/globals.css, en el bloque
   @theme inline. Ahi se definen colores, fuentes, etc.
   No busques un archivo de config de Tailwind: no existe y no hace falta.

3) El alias "@/" apunta a src/.
   En tsconfig.json esta puesto "@/*": ["./src/*"].
   Entonces:  import { db } from "@/db"     -> src/db/index.ts
              import Header from "@/components/Header" -> src/components/...

4) @radix-ui/themes esta instalado pero NO lo vamos a usar.
   Es el "Radix normal" que trae sus propios estilos y choca con Tailwind.
   Lo que se usa son los Primitives (@radix-ui/react-dialog, etc), que
   vienen sin estilo y se pintan con clases de Tailwind.
   Se puede desinstalar:  pnpm remove @radix-ui/themes

5) Los .env NO se suben a git.
   .gitignore ignora .env* entero. La DATABASE_URL de Neon va en
   .env.local localmente, y ademas hay que cargarla a mano en el panel
   de Vercel (Settings > Environment Variables).

6) drizzle-kit no lee .env.local solo.
   Next si lo lee, pero drizzle-kit corre por fuera de Next. En
   drizzle.config.ts hay que cargarlo explicito con dotenv apuntando
   a ".env.local".

7) Usar la connection string "pooled" de Neon.
   Vercel corre serverless; la variante -pooler es la que corresponde.

8) AGENTS.md y CLAUDE.md los reescribe "next dev" solo.
   No los edites, se regeneran.

9) Guardar precios en centavos (enteros), no decimales.
   Evita errores de redondeo de punto flotante en los totales.

10) Dependencias nuevas: si se usa en produccion (runtime) va a
    dependencies. Si es herramienta de desarrollo/build (linters,
    tipos, bundlers, etc.) va a devDependencies. No mezclar.

11) drizzle-kit push sirve para esta etapa (sin datos reales). Una
    vez que haya productos/pedidos cargados en produccion, pasar a
    migraciones versionadas: drizzle-kit generate + drizzle-kit
    migrate, para no arriesgar borrar datos sin poder revertir.

12) Mobile-first siempre: escribir las clases de Tailwind primero
    para celular, y recien despues agregar los modificadores md:/lg:
    para pantallas mas grandes. Nunca al reves.

. LINKS A LA DOC DE NEXT.js

    This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



PROXIMOS PASOS SUGERIDOS
---------------------------
1. Crear cuenta/proyecto en Neon y copiar la connection string pooled.
2. Crear .env.local con DATABASE_URL.
3. Crear drizzle.config.ts en la raiz de my-app.
4. Crear src/db/schema.ts con las tablas del e-commerce
   (marcas, categorias, productos, variantes por ml, clientes,
   pedidos, items de pedido).
5. Crear src/db/index.ts con la conexion Neon + Drizzle.
6. Agregar los scripts db:* a package.json y correr db:push.
7. Reemplazar src/app/page.tsx por el catalogo real.
8. Crear src/components/ui/ con los wrappers de Radix.
9. Conectar el repo a GitHub y despues a Vercel.

================================================================