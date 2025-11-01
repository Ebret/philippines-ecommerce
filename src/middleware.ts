import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

// Define protected routes and their required roles
const protectedRoutes: Record<string, string[]> = {
  "/vendor": ["SELLER", "ADMIN", "SUPER_ADMIN"],
  "/admin": ["ADMIN", "SUPER_ADMIN"],
  "/orders": ["BUYER", "SELLER", "ADMIN", "SUPER_ADMIN"],
  "/cart": ["BUYER", "SELLER", "ADMIN", "SUPER_ADMIN"],
  "/checkout": ["BUYER", "SELLER", "ADMIN", "SUPER_ADMIN"],
  "/profile": ["BUYER", "SELLER", "ADMIN", "SUPER_ADMIN"],
};

export default withAuth(
  function middleware(request: NextRequest) {
    const token = request.nextauth.token;
    const pathname = request.nextUrl.pathname;

    // Check if route is protected
    for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
      if (pathname.startsWith(route)) {
        // Check if user has required role
        if (token && !allowedRoles.includes(token.role as string)) {
          return NextResponse.redirect(new URL("/auth/unauthorized", request.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Allow public routes
        if (
          pathname.startsWith("/auth") ||
          pathname.startsWith("/api/auth") ||
          pathname === "/" ||
          pathname.startsWith("/products")
        ) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};

