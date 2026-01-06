(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__2f3ce91b._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/20251031/philippines-ecommerce/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2d$auth$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/node_modules/next-auth/middleware.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
;
// Define protected routes and their required roles
const protectedRoutes = {
    "/vendor": [
        "SELLER",
        "ADMIN",
        "SUPER_ADMIN"
    ],
    "/admin": [
        "ADMIN",
        "SUPER_ADMIN"
    ],
    "/orders": [
        "BUYER",
        "SELLER",
        "ADMIN",
        "SUPER_ADMIN"
    ],
    "/cart": [
        "BUYER",
        "SELLER",
        "ADMIN",
        "SUPER_ADMIN"
    ],
    "/checkout": [
        "BUYER",
        "SELLER",
        "ADMIN",
        "SUPER_ADMIN"
    ],
    "/profile": [
        "BUYER",
        "SELLER",
        "ADMIN",
        "SUPER_ADMIN"
    ]
};
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2d$auth$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["withAuth"])(function middleware(request) {
    const token = request.nextauth?.token;
    const pathname = request.nextUrl.pathname;
    // Check if route is protected
    for (const [route, allowedRoles] of Object.entries(protectedRoutes)){
        if (pathname.startsWith(route)) {
            // Check if user has required role
            if (token && !allowedRoles.includes(token.role)) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/auth/unauthorized", request.url));
            }
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}, {
    callbacks: {
        authorized: ({ token, req })=>{
            const pathname = req.nextUrl.pathname;
            // Allow public routes
            if (pathname.startsWith("/auth") || pathname.startsWith("/api/auth") || pathname === "/" || pathname.startsWith("/products") || pathname.startsWith("/api/testimonials")) {
                return true;
            }
            // Require authentication for protected routes
            return !!token;
        }
    }
});
const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api (API routes)
     */ "/((?!_next/static|_next/image|favicon.ico|public|api).*)"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__2f3ce91b._.js.map