'use client';

import { useEffect, useState } from 'react';

/**
 * ClientOnly Component
 * 
 * Prevents hydration mismatches by only rendering children on the client side.
 * Useful for components that use browser APIs or have client-specific state.
 * 
 * @example
 * <ClientOnly fallback={<LoadingSpinner />}>
 *   <ComponentWithBrowserAPIs />
 * </ClientOnly>
 */

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default ClientOnly;

