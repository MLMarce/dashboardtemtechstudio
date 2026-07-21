import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Private routes that require authentication
const PRIVATE_ROUTES = [
  '/dashboard',
  '/leads',
  '/clientes',
  '/proyectos',
  '/tareas',
  '/presupuestos',
  '/archivos',
  '/configuracion',
]

// ─────────────────────────────────────────────────────────────────────────────
// Next.js 16 Proxy Convention
// When Supabase is ready, replace the mock auth check with:
//
// import { createServerClient } from '@supabase/ssr'
// const supabase = createServerClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//   { cookies: { ... } }
// )
// const { data: { user } } = await supabase.auth.getUser()
// if (!user) return NextResponse.redirect(new URL('/login', request.url))
// ─────────────────────────────────────────────────────────────────────────────

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPrivateRoute = PRIVATE_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  if (!isPrivateRoute) {
    return NextResponse.next()
  }

  // Mock auth: check for a session cookie
  const sessionCookie = request.cookies.get('temtech-session')

  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
