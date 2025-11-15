export function StreamCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden animate-pulse">
      <div className="relative bg-gray-200 dark:bg-gray-700 h-40" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
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
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex justify-between items-center animate-pulse"
        >
          <div className="flex-1">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-full" />
            <div className="flex gap-6">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20" />
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

