import dynamic from "next/dynamic";
import React from "react";

// Loading component for dynamic imports
export const DynamicLoadingComponent = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-pulse">
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Error component for failed dynamic imports
export const DynamicErrorComponent = ({ error }: { error: Error }) => (
  <div className="flex items-center justify-center p-4 text-red-600">
    <p>Failed to load component: {error.message}</p>
  </div>
);

// Dynamic import options
const dynamicOptions = {
  loading: () => <DynamicLoadingComponent />,
  ssr: true,
};

const dynamicOptionsNoSSR = {
  loading: () => <DynamicLoadingComponent />,
  ssr: false,
};

// Auth Components - Route-based code splitting
export const DynamicLoginForm = dynamic(
  () => import("@/components/auth/LoginForm"),
  dynamicOptions
);

export const DynamicRegisterForm = dynamic(
  () => import("@/components/auth/RegisterForm"),
  dynamicOptions
);

export const DynamicForgotPasswordForm = dynamic(
  () => import("@/components/auth/ForgotPasswordForm"),
  dynamicOptions
);

export const DynamicResetPasswordForm = dynamic(
  () => import("@/components/auth/ResetPasswordForm"),
  dynamicOptions
);

// UI Components - Lazy loaded
export const DynamicButton = dynamic(
  () => import("@/components/ui/button").then((mod) => ({ default: mod.Button })),
  dynamicOptions
);

export const DynamicInput = dynamic(
  () => import("@/components/ui/input").then((mod) => ({ default: mod.Input })),
  dynamicOptions
);

export const DynamicLabel = dynamic(
  () => import("@/components/ui/label").then((mod) => ({ default: mod.Label })),
  dynamicOptions
);

export const DynamicSelect = dynamic(
  () => import("@/components/ui/select").then((mod) => ({ default: mod.Select })),
  dynamicOptions
);

// Utility function for creating dynamic imports with custom options
export function createDynamicImport<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    ssr?: boolean;
    loading?: React.ComponentType;
  }
) {
  return dynamic(importFn, {
    loading: options?.loading || (() => <DynamicLoadingComponent />),
    ssr: options?.ssr !== false,
  });
}

// Utility function for lazy loading components on demand
export function lazyLoadComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return React.lazy(importFn);
}

// Utility function for prefetching dynamic imports
export async function prefetchDynamicImport(
  importFn: () => Promise<{ default: any }>
) {
  try {
    await importFn();
  } catch (error) {
    console.error("Failed to prefetch dynamic import:", error);
  }
}

// Route-based code splitting configuration
export const routeBasedCodeSplitting = {
  // Auth routes
  auth: {
    login: () => import("@/components/auth/LoginForm"),
    register: () => import("@/components/auth/RegisterForm"),
    forgotPassword: () => import("@/components/auth/ForgotPasswordForm"),
    resetPassword: () => import("@/components/auth/ResetPasswordForm"),
  },

  // UI components
  ui: {
    button: () => import("@/components/ui/button"),
    input: () => import("@/components/ui/input"),
    label: () => import("@/components/ui/label"),
    select: () => import("@/components/ui/select"),
  },
};

// Prefetch strategy for common routes
export const prefetchStrategy = {
  // Prefetch on route change
  onRouteChange: [
    "auth/login",
    "auth/register",
    "products",
    "cart",
  ],

  // Prefetch on hover
  onHover: [
    "products",
    "vendors",
    "orders",
  ],

  // Prefetch on idle
  onIdle: [
    "admin",
    "analytics",
    "settings",
  ],
};

// Utility function to prefetch routes
export function prefetchRoute(route: string) {
  if (typeof window !== "undefined") {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = route;
    document.head.appendChild(link);
  }
}

// Utility function to preload routes
export function preloadRoute(route: string) {
  if (typeof window !== "undefined") {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = route;
    link.as = "fetch";
    document.head.appendChild(link);
  }
}

// Utility function for intersection observer-based lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  options?: IntersectionObserverInit
) {
  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(entry.target);
      }
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, callback, options]);
}

// Utility function for viewport-based lazy loading
export function useViewportLazyLoad(
  ref: React.RefObject<HTMLElement>,
  threshold: number = 0.1
) {
  const [isVisible, setIsVisible] = React.useState(false);

  useIntersectionObserver(
    ref,
    () => setIsVisible(true),
    { threshold }
  );

  return isVisible;
}

// Utility function for image lazy loading
export function useImageLazyLoad(
  ref: React.RefObject<HTMLImageElement>,
  src: string
) {
  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = src;
        observer.unobserve(img);
      }
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, src]);
}

// Utility function for component prefetching on route hover
export function usePrefetchOnHover(route: string) {
  const handleMouseEnter = () => {
    prefetchRoute(route);
  };

  return { onMouseEnter: handleMouseEnter };
}

// Utility function for component preloading on route focus
export function usePreloadOnFocus(route: string) {
  const handleFocus = () => {
    preloadRoute(route);
  };

  return { onFocus: handleFocus };
}

