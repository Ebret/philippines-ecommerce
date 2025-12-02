export function StreamCardSkeleton() {
  return (
    <div className="bg-card rounded-lg shadow hover:shadow-lg transition overflow-hidden animate-pulse border border-border">
      <div className="relative bg-muted h-40" />
      <div className="p-4">
        <div className="h-4 bg-muted rounded mb-2 w-3/4" />
        <div className="h-3 bg-muted rounded mb-3 w-full" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
    </div>
  );
}

export function StreamListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-lg shadow p-6 flex justify-between items-center animate-pulse border border-border"
        >
          <div className="flex-1">
            <div className="h-5 bg-muted rounded mb-2 w-1/3" />
            <div className="h-4 bg-muted rounded mb-3 w-full" />
            <div className="flex gap-6">
              <div className="h-3 bg-muted rounded w-20" />
              <div className="h-3 bg-muted rounded w-20" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-muted rounded w-20" />
            <div className="h-10 bg-muted rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <StreamCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-lg shadow overflow-hidden animate-pulse border border-border">
      {/* Image placeholder */}
      <div className="relative h-48 sm:h-56 bg-muted" />
      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        {/* Vendor */}
        <div className="h-3 bg-muted rounded w-1/4" />
        {/* Title */}
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-5 bg-muted rounded w-1/2" />
        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-muted rounded" />
          ))}
          <div className="h-3 bg-muted rounded w-12 ml-2" />
        </div>
        {/* Price */}
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <div className="h-8 bg-muted rounded w-24" />
          <div className="h-6 bg-muted rounded w-16" />
        </div>
        {/* Button */}
        <div className="h-10 bg-muted rounded-full w-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border animate-pulse">
      <div className="h-12 w-12 bg-muted rounded" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
      <div className="h-4 bg-muted rounded w-20" />
      <div className="h-8 bg-muted rounded w-24" />
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="bg-card rounded-xl shadow-sm p-6 border border-border animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-muted rounded w-24" />
        <div className="h-10 w-10 bg-muted rounded-full" />
      </div>
      <div className="h-8 bg-muted rounded w-32 mb-2" />
      <div className="h-3 bg-muted rounded w-20" />
    </div>
  );
}

