module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/20251031/philippines-ecommerce/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = /*TURBOPACK member replacement*/ __turbopack_context__.g;
const prisma = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        "query",
        "error",
        "warn"
    ] : "TURBOPACK unreachable",
    errorFormat: "pretty"
});
// Cache Prisma client in both development and production
globalForPrisma.prisma = prisma;
// Handle graceful shutdown
if ("TURBOPACK compile-time truthy", 1) {
    process.on("SIGINT", async ()=>{
        await prisma.$disconnect();
        process.exit(0);
    });
    process.on("SIGTERM", async ()=>{
        await prisma.$disconnect();
        process.exit(0);
    });
}
}),
"[project]/20251031/philippines-ecommerce/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authOptions",
    ()=>authOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2d$auth$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/node_modules/next-auth/providers/google.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2d$auth$2f$providers$2f$facebook$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/node_modules/next-auth/providers/facebook.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f40$next$2d$auth$2f$prisma$2d$adapter$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/node_modules/@next-auth/prisma-adapter/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
;
;
;
;
;
;
const authOptions = {
    adapter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f40$next$2d$auth$2f$prisma$2d$adapter$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PrismaAdapter"])(__TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"]),
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "user@example.com"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize (credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Invalid credentials");
                    }
                    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                        where: {
                            email: credentials.email
                        },
                        include: {
                            profile: true
                        }
                    });
                    if (!user || !user.passwordHash) {
                        throw new Error("Invalid credentials");
                    }
                    // Check if user is active
                    if (user.status !== "ACTIVE") {
                        throw new Error("User account is not active");
                    }
                    // Verify password
                    const isPasswordValid = await __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(credentials.password, user.passwordHash);
                    if (!isPasswordValid) {
                        throw new Error("Invalid credentials");
                    }
                    // Check if email is verified
                    if (!user.emailVerified) {
                        throw new Error("Please verify your email address");
                    }
                    // Update last login
                    await __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            lastLogin: new Date()
                        }
                    });
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName || ""}` : user.email,
                        image: user.profile?.avatarUrl,
                        role: user.role
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    throw error;
                }
            }
        }),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2d$auth$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            allowDangerousEmailAccountLinking: false
        }),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2d$auth$2f$providers$2f$facebook$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            clientId: process.env.FACEBOOK_APP_ID || "",
            clientSecret: process.env.FACEBOOK_APP_SECRET || "",
            allowDangerousEmailAccountLinking: false
        })
    ],
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
        verifyRequest: "/auth/verify-request"
    },
    callbacks: {
        async jwt ({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = user.role || __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["UserRole"].BUYER;
                token.emailVerified = user.emailVerified;
            }
            // Handle OAuth account linking
            if (account) {
                token.provider = account.provider;
            }
            return token;
        },
        async session ({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.emailVerified = token.emailVerified;
            }
            return session;
        },
        async signIn ({ user, account, profile }) {
            try {
                // For OAuth providers, verify email is provided
                if (account?.provider !== "credentials") {
                    if (!user.email) {
                        return false;
                    }
                    // OAuth users are automatically verified by their provider
                    return true;
                }
                // For credentials, check if user exists and is verified
                if (user.email) {
                    const dbUser = await __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                        where: {
                            email: user.email
                        }
                    });
                    if (!dbUser) {
                        return false;
                    }
                    if (dbUser.status !== "ACTIVE") {
                        return false;
                    }
                    if (!dbUser.emailVerified) {
                        return false;
                    }
                }
                return true;
            } catch (error) {
                console.error("SignIn callback error:", error);
                return false;
            }
        },
        async redirect ({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        }
    },
    events: {
        async signIn ({ user, account }) {
            try {
                if (account?.provider !== "credentials") {
                    // Update last login for OAuth users
                    await __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            lastLogin: new Date()
                        }
                    });
                }
            } catch (error) {
                console.error("SignIn event error:", error);
            // Don't throw - just log the error
            }
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
};
}),
"[project]/20251031/philippines-ecommerce/src/lib/validations/product.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CategorySchema",
    ()=>CategorySchema,
    "CategoryTranslationSchema",
    ()=>CategoryTranslationSchema,
    "CategoryUpdateSchema",
    ()=>CategoryUpdateSchema,
    "ProductConditionEnum",
    ()=>ProductConditionEnum,
    "ProductImageSchema",
    ()=>ProductImageSchema,
    "ProductImageUpdateSchema",
    ()=>ProductImageUpdateSchema,
    "ProductSchema",
    ()=>ProductSchema,
    "ProductSearchSchema",
    ()=>ProductSearchSchema,
    "ProductStatusEnum",
    ()=>ProductStatusEnum,
    "ProductTranslationSchema",
    ()=>ProductTranslationSchema,
    "ProductUpdateSchema",
    ()=>ProductUpdateSchema,
    "ProductVariantSchema",
    ()=>ProductVariantSchema,
    "ProductVariantUpdateSchema",
    ()=>ProductVariantUpdateSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
const ProductStatusEnum = __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    "DRAFT",
    "ACTIVE",
    "INACTIVE",
    "OUT_OF_STOCK"
]);
const ProductConditionEnum = __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    "NEW",
    "USED",
    "REFURBISHED"
]);
const CategorySchema = __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(255),
    slug: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(255),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    imageUrl: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional(),
    parentId: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    sortOrder: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().default(0),
    isActive: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(true)
});
const CategoryUpdateSchema = CategorySchema.partial();
const ProductSchema = __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(255),
    slug: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(255),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    shortDescription: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional(),
    categoryId: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    status: ProductStatusEnum.default("DRAFT"),
    isFeatured: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    isDigital: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    weight: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive().optional(),
    dimensions: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).optional(),
    brand: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(255).optional(),
    model: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(255).optional(),
    condition: ProductConditionEnum.default("NEW"),
    warrantyPeriod: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive().optional(),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).default([]),
    seoTitle: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(255).optional(),
    seoDescription: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional()
});
const ProductUpdateSchema = ProductSchema.partial();
const ProductVariantSchema = __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    sku: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(255),
    barcode: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(255).optional(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(255).optional(),
    price: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive(),
    comparePrice: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive().optional(),
    costPrice: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive().optional(),
    stockQuantity: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().nonnegative().default(0),
    lowStockThreshold: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().nonnegative().default(10),
    weight: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive().optional(),
    attributes: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).optional(),
    isActive: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(true)
});
const ProductVariantUpdateSchema = ProductVariantSchema.partial();
const ProductImageSchema = __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    url: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url(),
    altText: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(255).optional(),
    sortOrder: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().default(0),
    isPrimary: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    variantId: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const ProductImageUpdateSchema = ProductImageSchema.partial();
const ProductTranslationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    language: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().length(2),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(255),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    shortDescription: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional()
});
const CategoryTranslationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    language: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().length(2),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(255),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const ProductSearchSchema = __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    query: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    categoryId: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    vendorId: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    minPrice: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().nonnegative().optional(),
    maxPrice: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().nonnegative().optional(),
    minRating: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0).max(5).optional(),
    condition: ProductConditionEnum.optional(),
    isFeatured: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    status: ProductStatusEnum.optional(),
    sortBy: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "newest",
        "price_asc",
        "price_desc",
        "rating",
        "sales"
    ]).default("newest"),
    page: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive().default(1),
    limit: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive().max(100).default(20)
});
}),
"[project]/20251031/philippines-ecommerce/src/lib/product-utils.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildProductSearchQuery",
    ()=>buildProductSearchQuery,
    "calculateProductStats",
    ()=>calculateProductStats,
    "generateSlug",
    ()=>generateSlug,
    "getCategoryWithHierarchy",
    ()=>getCategoryWithHierarchy,
    "getFeaturedProducts",
    ()=>getFeaturedProducts,
    "getLowStockProducts",
    ()=>getLowStockProducts,
    "getProductWithRelations",
    ()=>getProductWithRelations,
    "isCategorySlugUnique",
    ()=>isCategorySlugUnique,
    "isSkuUnique",
    ()=>isSkuUnique,
    "isSlugUnique",
    ()=>isSlugUnique,
    "updateProductStatus",
    ()=>updateProductStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/src/lib/prisma.ts [app-route] (ecmascript)");
;
function generateSlug(name) {
    return name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}
async function isSlugUnique(slug, excludeId) {
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findFirst({
        where: {
            slug,
            ...excludeId && {
                NOT: {
                    id: excludeId
                }
            }
        }
    });
    return !existing;
}
async function isCategorySlugUnique(slug, excludeId) {
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].category.findFirst({
        where: {
            slug,
            ...excludeId && {
                NOT: {
                    id: excludeId
                }
            }
        }
    });
    return !existing;
}
async function isSkuUnique(sku, excludeId) {
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].productVariant.findFirst({
        where: {
            sku,
            ...excludeId && {
                NOT: {
                    id: excludeId
                }
            }
        }
    });
    return !existing;
}
async function getProductWithRelations(productId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
        where: {
            id: productId
        },
        include: {
            vendor: {
                select: {
                    id: true,
                    storeName: true,
                    storeSlug: true,
                    rating: true,
                    reviewCount: true
                }
            },
            category: true,
            variants: {
                include: {
                    images: true
                }
            },
            images: {
                orderBy: {
                    sortOrder: "asc"
                }
            },
            translations: true,
            reviews: {
                take: 5,
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    });
}
async function getCategoryWithHierarchy(categoryId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].category.findUnique({
        where: {
            id: categoryId
        },
        include: {
            parent: true,
            children: true,
            translations: true,
            products: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                },
                take: 5
            }
        }
    });
}
function buildProductSearchQuery(filters) {
    const where = {
        status: filters.status || "ACTIVE"
    };
    if (filters.query) {
        where.OR = [
            {
                name: {
                    contains: filters.query,
                    mode: "insensitive"
                }
            },
            {
                description: {
                    contains: filters.query,
                    mode: "insensitive"
                }
            },
            {
                tags: {
                    hasSome: [
                        filters.query
                    ]
                }
            }
        ];
    }
    if (filters.categoryId) {
        where.categoryId = filters.categoryId;
    }
    if (filters.vendorId) {
        where.vendorId = filters.vendorId;
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.variants = {
            some: {
                price: {
                    ...filters.minPrice !== undefined && {
                        gte: filters.minPrice
                    },
                    ...filters.maxPrice !== undefined && {
                        lte: filters.maxPrice
                    }
                }
            }
        };
    }
    if (filters.minRating !== undefined) {
        where.rating = {
            gte: filters.minRating
        };
    }
    if (filters.condition) {
        where.condition = filters.condition;
    }
    if (filters.isFeatured !== undefined) {
        where.isFeatured = filters.isFeatured;
    }
    return {
        where
    };
}
async function calculateProductStats(productId) {
    const [totalSales, reviewCount, avgRating] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].orderItem.count({
            where: {
                productId
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].review.count({
            where: {
                productId
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].review.aggregate({
            where: {
                productId
            },
            _avg: {
                rating: true
            }
        })
    ]);
    return {
        totalSales,
        reviewCount,
        avgRating: avgRating._avg.rating || 0
    };
}
async function updateProductStatus(productId) {
    const variants = await __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].productVariant.findMany({
        where: {
            productId
        },
        select: {
            stockQuantity: true
        }
    });
    const totalStock = variants.reduce((sum, v)=>sum + v.stockQuantity, 0);
    const newStatus = totalStock === 0 ? "OUT_OF_STOCK" : "ACTIVE";
    return __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.update({
        where: {
            id: productId
        },
        data: {
            status: newStatus
        }
    });
}
async function getLowStockProducts(vendorId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].productVariant.findMany({
        where: {
            product: {
                vendorId
            },
            stockQuantity: {
                lte: __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].productVariant.fields.lowStockThreshold
            }
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            }
        }
    });
}
async function getFeaturedProducts(limit = 10) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where: {
            isFeatured: true,
            status: "ACTIVE"
        },
        include: {
            vendor: {
                select: {
                    storeName: true,
                    storeSlug: true
                }
            },
            images: {
                where: {
                    isPrimary: true
                },
                take: 1
            },
            variants: {
                select: {
                    price: true
                },
                take: 1
            }
        },
        take: limit,
        orderBy: {
            createdAt: "desc"
        }
    });
}
}),
"[project]/20251031/philippines-ecommerce/src/app/api/categories/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$validations$2f$product$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/src/lib/validations/product.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/20251031/philippines-ecommerce/src/lib/product-utils.ts [app-route] (ecmascript)");
;
;
;
;
;
;
async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const parentId = searchParams.get("parentId");
        const isActive = searchParams.get("isActive");
        const categories = await __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].category.findMany({
            where: {
                ...parentId && {
                    parentId
                },
                ...isActive !== null && {
                    isActive: isActive === "true"
                }
            },
            include: {
                children: true,
                translations: true,
                _count: {
                    select: {
                        products: true
                    }
                }
            },
            orderBy: {
                sortOrder: "asc"
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch categories"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session || ![
            "ADMIN",
            "SUPER_ADMIN"
        ].includes(session.user.role)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const body = await request.json();
        const validatedData = __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$validations$2f$product$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CategorySchema"].parse(body);
        // Check slug uniqueness
        const slug = validatedData.slug || (0, __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateSlug"])(validatedData.name);
        const isUnique = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isCategorySlugUnique"])(slug);
        if (!isUnique) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Category slug already exists"
            }, {
                status: 400
            });
        }
        // Verify parent category exists if provided
        if (validatedData.parentId) {
            const parent = await __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].category.findUnique({
                where: {
                    id: validatedData.parentId
                }
            });
            if (!parent) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Parent category not found"
                }, {
                    status: 404
                });
            }
        }
        const category = await __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].category.create({
            data: {
                ...validatedData,
                slug
            },
            include: {
                children: true,
                translations: true
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(category, {
            status: 201
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes("validation")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid category data"
            }, {
                status: 400
            });
        }
        console.error("Error creating category:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$20251031$2f$philippines$2d$ecommerce$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create category"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5f7bcef1._.js.map