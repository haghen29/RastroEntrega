// PROXY (en versiones viejas de Next se llamaba "middleware").
// Next lo ejecuta ANTES de mostrar cualquier página que coincida con `matcher`
// (abajo): acá, todas las rutas que empiezan con /admin.
// Es la primera barrera de seguridad del panel; la segunda es exigirAdmin().
import { NextResponse, type NextRequest } from 'next/server'
import { COOKIE_SESION, tokenValido } from '@/lib/sesion'

/**
 * US-11: sin sesión válida, /admin redirige a /admin/login.
 * - Si la ruta es el propio login, se deja pasar (si no, sería un bucle infinito de redirecciones).
 * - Si la cookie de sesión no es válida, se redirige al login.
 * - `NextResponse.next()` = "seguí normal, mostrá la página pedida".
 */
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/login') return NextResponse.next()

  if (!(await tokenValido(request.cookies.get(COOKIE_SESION)?.value))) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return NextResponse.next()
}

// `:path*` = cualquier cosa después de /admin (/admin, /admin/productos/5, etc.)
export const config = {
  matcher: ['/admin/:path*'],
}
