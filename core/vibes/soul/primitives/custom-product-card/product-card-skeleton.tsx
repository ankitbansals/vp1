// Skeleton loader for product cards
export function ProductCardSkeleton() {
  return (
    <div className="w-full max-w-[280px] animate-pulse rounded border border-gray-200 bg-white">
      {/* Skeleton Image */}
      <div className="h-[200px] w-full bg-gray-200"></div>

      {/* Skeleton Content */}
      <div className="p-4">
        {/* Skeleton Rating */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-4 rounded-full bg-gray-200"></div>
            ))}
          </div>
          <div className="h-4 w-16 rounded bg-gray-200"></div>
        </div>

        {/* Skeleton Brand */}
        <div className="mb-1 h-4 w-1/3 rounded bg-gray-200"></div>

        {/* Skeleton Title */}
        <div className="mb-2 h-5 w-full rounded bg-gray-200"></div>
        <div className="mb-2 h-5 w-2/3 rounded bg-gray-200"></div>

        {/* Skeleton Colors */}
        <div className="mb-2 flex items-center space-x-1">
          <div className="h-4 w-4 rounded-full bg-gray-200"></div>
          <div className="h-4 w-4 rounded-full bg-gray-200"></div>
          <div className="h-4 w-4 rounded-full bg-gray-200"></div>
        </div>
      </div>

      {/* Skeleton Price */}
      <div className="bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-24 rounded bg-gray-200"></div>
          <div className="h-10 w-10 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}