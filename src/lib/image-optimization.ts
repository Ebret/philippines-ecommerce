import Image from "next/image";
import React from "react";

// Image optimization configuration for Philippines market
export const imageOptimizationConfig = {
  // Device sizes for responsive images
  deviceSizes: {
    mobile: 320,
    mobileLandscape: 568,
    tablet: 768,
    desktop: 1024,
    desktopLarge: 1280,
    desktopXL: 1536,
  },

  // Image sizes for different contexts
  imageSizes: {
    thumbnail: 64,
    small: 128,
    medium: 256,
    large: 384,
    xlarge: 512,
    xxlarge: 768,
  },

  // Quality settings for different network speeds
  qualitySettings: {
    "2g": 60, // Slow 2G connection
    "3g": 75, // 3G connection
    "4g": 85, // 4G connection
    "5g": 95, // 5G connection
  },

  // Format preferences
  formats: ["image/avif", "image/webp", "image/jpeg"],

  // Cache settings
  cache: {
    ttl: 60 * 60 * 24 * 365, // 1 year
    staleWhileRevalidate: 60 * 60 * 24 * 7, // 7 days
  },
};

// Responsive image sizes for different breakpoints
export const responsiveImageSizes = {
  hero: {
    mobile: "100vw",
    tablet: "100vw",
    desktop: "100vw",
  },
  productCard: {
    mobile: "calc(50vw - 8px)",
    tablet: "calc(33.333vw - 8px)",
    desktop: "calc(25vw - 8px)",
  },
  thumbnail: {
    mobile: "64px",
    tablet: "96px",
    desktop: "128px",
  },
  avatar: {
    mobile: "40px",
    tablet: "48px",
    desktop: "56px",
  },
};

// Utility function to get responsive image srcset
export function getResponsiveImageSrcset(
  basePath: string,
  sizes: number[]
): string {
  return sizes
    .map((size) => `${basePath}?w=${size} ${size}w`)
    .join(", ");
}

// Utility function to get image quality based on network speed
export function getImageQuality(networkSpeed?: "2g" | "3g" | "4g" | "5g"): number {
  if (!networkSpeed) return 85; // Default to 4G quality
  return imageOptimizationConfig.qualitySettings[networkSpeed];
}

// Utility function to detect network speed
export function detectNetworkSpeed(): "2g" | "3g" | "4g" | "5g" | undefined {
  if (typeof navigator === "undefined") return undefined;

  const connection = (navigator as any).connection;
  if (!connection) return undefined;

  const effectiveType = connection.effectiveType;
  return effectiveType as "2g" | "3g" | "4g" | "5g";
}

// Utility function to get optimal image size for device
export function getOptimalImageSize(
  context: "hero" | "productCard" | "thumbnail" | "avatar"
): string {
  const sizes = responsiveImageSizes[context];
  return `(max-width: 640px) ${sizes.mobile}, (max-width: 1024px) ${sizes.tablet}, ${sizes.desktop}`;
}

// Utility function to generate image srcset for responsive images
export function generateImageSrcset(
  basePath: string,
  widths: number[] = [320, 640, 1024, 1280, 1536]
): string {
  return widths
    .map((width) => `${basePath}?w=${width}&q=75 ${width}w`)
    .join(", ");
}

// Utility function to generate image srcset with quality adjustment
export function generateImageSrcsetWithQuality(
  basePath: string,
  widths: number[] = [320, 640, 1024, 1280, 1536],
  networkSpeed?: "2g" | "3g" | "4g" | "5g"
): string {
  const quality = getImageQuality(networkSpeed);
  return widths
    .map((width) => `${basePath}?w=${width}&q=${quality} ${width}w`)
    .join(", ");
}

// Utility function to get image placeholder
export function getImagePlaceholder(
  width: number,
  height: number,
  color: string = "e5e7eb"
): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect fill='%23${color}' width='${width}' height='${height}'/%3E%3C/svg%3E`;
}

// Utility function to optimize image URL
export function optimizeImageUrl(
  url: string,
  width?: number,
  height?: number,
  quality?: number
): string {
  const params = new URLSearchParams();

  if (width) params.append("w", width.toString());
  if (height) params.append("h", height.toString());
  if (quality) params.append("q", quality.toString());

  const separator = url.includes("?") ? "&" : "?";
  return params.toString() ? `${url}${separator}${params.toString()}` : url;
}

// Utility function to preload images
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Utility function to prefetch images
export function prefetchImage(src: string): void {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "image";
  link.href = src;
  document.head.appendChild(link);
}

// Utility function to preload critical images
export function preloadCriticalImages(images: string[]): void {
  images.forEach((src) => {
    if (typeof document === "undefined") return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  });
}

// React hook for lazy loading images
export function useLazyLoadImage(
  ref: React.RefObject<HTMLImageElement>,
  src: string,
  placeholder?: string
) {
  const [imageSrc, setImageSrc] = React.useState(placeholder || "");
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = src;
        img.onload = () => setIsLoaded(true);
        observer.unobserve(img);
      }
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, src]);

  return { imageSrc, isLoaded };
}

// React hook for responsive images
export function useResponsiveImage(
  src: string,
  context: "hero" | "productCard" | "thumbnail" | "avatar" = "productCard"
) {
  const sizes = getOptimalImageSize(context);
  const srcSet = generateImageSrcset(src);

  return {
    src,
    srcSet,
    sizes,
  };
}

// React hook for network-aware image optimization
export function useNetworkAwareImage(src: string) {
  const [quality, setQuality] = React.useState(85);

  React.useEffect(() => {
    const networkSpeed = detectNetworkSpeed();
    const optimalQuality = getImageQuality(networkSpeed);
    setQuality(optimalQuality);
  }, []);

  const optimizedSrc = optimizeImageUrl(src, undefined, undefined, quality);
  const srcSet = generateImageSrcsetWithQuality(src, undefined, detectNetworkSpeed());

  return {
    src: optimizedSrc,
    srcSet,
    quality,
  };
}

// Utility function to get image dimensions
export async function getImageDimensions(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = src;
  });
}

// Utility function to calculate aspect ratio
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}/${height / divisor}`;
}

// Utility function to generate image srcset for art direction
export function generateArtDirectionSrcset(
  images: Array<{ src: string; media: string }>
): string {
  return images
    .map(({ src, media }) => `${src} ${media}`)
    .join(", ");
}

// Utility function to optimize image for mobile
export function optimizeImageForMobile(
  src: string,
  maxWidth: number = 640
): string {
  return optimizeImageUrl(src, maxWidth, undefined, 75);
}

// Utility function to optimize image for tablet
export function optimizeImageForTablet(
  src: string,
  maxWidth: number = 1024
): string {
  return optimizeImageUrl(src, maxWidth, undefined, 85);
}

// Utility function to optimize image for desktop
export function optimizeImageForDesktop(
  src: string,
  maxWidth: number = 1536
): string {
  return optimizeImageUrl(src, maxWidth, undefined, 95);
}