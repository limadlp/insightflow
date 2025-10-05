import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get current user from cookie or session
  const currentUserCookie = request.cookies.get("insightflow_current_user")

  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/registrar")

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/meu-dashboard") ||
    request.nextUrl.pathname.startsWith("/praticas") ||
    request.nextUrl.pathname.startsWith("/alunos") ||
    request.nextUrl.pathname.startsWith("/relatorios") ||
    request.nextUrl.pathname.startsWith("/convites") ||
    request.nextUrl.pathname.startsWith("/configuracoes")

  // If not authenticated and trying to access protected route, redirect to login
  if (!currentUserCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If authenticated and trying to access auth pages, redirect to appropriate dashboard
  if (currentUserCookie && isAuthPage) {
    try {
      const user = JSON.parse(currentUserCookie.value)
      const dashboardUrl = user.role === "teacher" ? "/dashboard" : "/meu-dashboard"
      return NextResponse.redirect(new URL(dashboardUrl, request.url))
    } catch {
      // Invalid cookie, continue to auth page
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/meu-dashboard/:path*",
    "/praticas/:path*",
    "/alunos/:path*",
    "/relatorios/:path*",
    "/convites/:path*",
    "/configuracoes/:path*",
    "/login",
    "/registrar",
  ],
}
