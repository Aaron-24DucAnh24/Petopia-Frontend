export function UserSkeleton() {
  return (
    <div className="container max-w-5xl mx-auto px-4 mt-8 pb-16">
      <div className="flex gap-5 items-start">
        {/* Sidebar skeleton */}
        <div className="w-52 flex-shrink-0 bg-white shadow-xl rounded-2xl py-4 px-2 animate-pulse">
          <div className="flex flex-col items-center px-2 pb-4 mb-2 border-b border-gray-100">
            <div className="h-16 w-16 rounded-full bg-gray-200 mb-2" />
            <div className="h-3 bg-gray-200 rounded-full w-28 mb-2" />
            <div className="h-2.5 bg-gray-200 rounded-full w-16" />
          </div>
          <div className="space-y-1 px-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 bg-gray-100 rounded-xl" />
            ))}
            <div className="my-2 border-t border-gray-100" />
            <div className="h-9 bg-gray-100 rounded-xl" />
            <div className="h-9 bg-gray-100 rounded-xl" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 min-w-0 bg-white shadow-xl rounded-2xl p-6 animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-24 w-24 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded-full w-48 mb-3" />
              <div className="h-4 bg-gray-200 rounded-full w-32" />
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 px-4 py-1 space-y-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-gray-200 flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full w-20 mb-2" />
                  <div className="h-3 bg-gray-200 rounded-full w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
