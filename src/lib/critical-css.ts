// Critical CSS for above-the-fold content
// This CSS is inlined in the HTML head for faster rendering

export const criticalCSS = `
  /* Reset and base styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #ffffff;
    color: #1f2937;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
  }

  p {
    line-height: 1.6;
  }

  /* Links */
  a {
    color: #3b82f6;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Buttons */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    border-radius: 0.375rem;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  button:hover {
    opacity: 0.9;
  }

  button:active {
    transform: scale(0.98);
  }

  /* Forms */
  input, textarea, select {
    font-family: inherit;
    font-size: 1rem;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  /* Layout */
  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .gap-4 {
    gap: 1rem;
  }

  /* Grid */
  .grid {
    display: grid;
  }

  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  @media (min-width: 640px) {
    .sm\\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 1024px) {
    .lg\\:grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  /* Responsive */
  @media (max-width: 640px) {
    h1 {
      font-size: 1.5rem;
    }

    h2 {
      font-size: 1.25rem;
    }

    h3 {
      font-size: 1rem;
    }

    .container {
      padding: 0 0.75rem;
    }
  }

  /* Loading states */
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Accessibility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Focus visible for keyboard navigation */
  *:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

// Utility function to inject critical CSS
export function injectCriticalCSS(): void {
  if (typeof document === "undefined") return;

  const style = document.createElement("style");
  style.textContent = criticalCSS;
  style.setAttribute("data-critical", "true");
  document.head.insertBefore(style, document.head.firstChild);
}

// Utility function to defer non-critical CSS
export function deferNonCriticalCSS(href: string): void {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.media = "print";
  link.onload = function () {
    (this as any).media = "all";
  };
  document.head.appendChild(link);
}

// Utility function to preload fonts
export function preloadFont(
  href: string,
  fontFamily: string,
  fontWeight?: string
): void {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "font";
  link.href = href;
  link.type = "font/woff2";
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

// Utility function to get critical CSS for specific route
export function getCriticalCSSForRoute(route: string): string {
  const routeSpecificCSS: Record<string, string> = {
    "/": `
      /* Homepage specific critical CSS */
      .hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .hero-content {
        text-align: center;
        max-width: 600px;
      }

      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }
    `,
    "/products": `
      /* Products page specific critical CSS */
      .product-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .product-card {
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        overflow: hidden;
        transition: box-shadow 0.2s ease;
      }

      .product-card:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }
    `,
    "/cart": `
      /* Cart page specific critical CSS */
      .cart-container {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 2rem;
      }

      .cart-items {
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
      }

      .cart-summary {
        position: sticky;
        top: 1rem;
      }

      @media (max-width: 768px) {
        .cart-container {
          grid-template-columns: 1fr;
        }

        .cart-summary {
          position: static;
        }
      }
    `,
  };

  return routeSpecificCSS[route] || "";
}

// Utility function to generate critical CSS inline script
export function generateCriticalCSSScript(): string {
  return `
    <script>
      (function() {
        const criticalCSS = \`${criticalCSS}\`;
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        style.setAttribute('data-critical', 'true');
        document.head.insertBefore(style, document.head.firstChild);
      })();
    </script>
  `;
}

// Utility function to optimize CSS delivery
export function optimizeCSSDelivery(): void {
  if (typeof document === "undefined") return;

  // Inject critical CSS
  injectCriticalCSS();

  // Defer non-critical stylesheets
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  stylesheets.forEach((link) => {
    if (!link.hasAttribute("data-critical")) {
      const href = link.getAttribute("href");
      if (href) {
        deferNonCriticalCSS(href);
        link.remove();
      }
    }
  });
}

// Utility function to measure CSS performance
export function measureCSSPerformance(): {
  criticalCSSSize: number;
  totalCSSSize: number;
  cssLoadTime: number;
} {
  if (typeof performance === "undefined" || typeof document === "undefined") {
    return {
      criticalCSSSize: criticalCSS.length,
      totalCSSSize: criticalCSS.length,
      cssLoadTime: 0,
    };
  }

  const criticalCSSSize = criticalCSS.length;
  let totalCSSSize = criticalCSSSize;

  try {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach((link) => {
      const href = link.getAttribute("href");
      if (href) {
        totalCSSSize += href.length;
      }
    });
  } catch (e) {
    // In Node.js environment, document is not available
  }

  let cssLoadTime = 0;
  try {
    const paintEntries = performance.getEntriesByType("paint");
    const firstPaint = paintEntries.find((entry) => entry.name === "first-paint");
    cssLoadTime = firstPaint ? firstPaint.startTime : 0;
  } catch (e) {
    // In Node.js environment, performance API may not be available
  }

  return {
    criticalCSSSize,
    totalCSSSize,
    cssLoadTime,
  };
}

// Utility function to generate CSS report
export function generateCSSReport(): {
  criticalCSSSize: number;
  totalCSSSize: number;
  cssLoadTime: number;
  optimization: string;
} {
  const metrics = measureCSSPerformance();
  const optimization =
    metrics.cssLoadTime < 1000
      ? "Excellent"
      : metrics.cssLoadTime < 2000
        ? "Good"
        : "Needs Improvement";

  return {
    ...metrics,
    optimization,
  };
}

