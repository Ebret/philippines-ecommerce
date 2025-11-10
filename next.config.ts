import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration for Next.js 16
  turbopack: {
    resolveAlias: {
      "@": "./src",
    },
  },

  // Image Optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 375, 425, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Bundle Optimization (for webpack fallback)
  webpack: (config, { isServer }) => {
    // Tree shaking optimization
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    };

    // Code splitting optimization
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          // Vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
            reuseExistingChunk: true,
          },
          // React and related libraries
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-hook-form)[\\/]/,
            name: "react-vendors",
            priority: 20,
            reuseExistingChunk: true,
          },
          // UI libraries
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|tailwindcss)[\\/]/,
            name: "ui-vendors",
            priority: 15,
            reuseExistingChunk: true,
          },
          // Common chunks
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
            name: "common",
          },
        },
      };
    }

    return config;
  },

  // Compression
  compress: true,

  // Production source maps (disabled for smaller bundle)
  productionBrowserSourceMaps: false,

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "lucide-react",
    ],
  },

  // NOTE: i18n configuration removed - incompatible with App Router in Next.js 16
  // For internationalization with App Router, use next-intl library instead
  // See: https://nextjs.org/docs/app/building-your-application/routing/internationalization

  // Headers for caching
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirects for optimization
  async redirects() {
    return [];
  },

  // Rewrites for optimization
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
