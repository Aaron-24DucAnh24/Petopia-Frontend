export function UpgradeRequestsSkeleton() {
  return (
    <div className="container max-w-3xl p-5 mx-auto shadow-2xl rounded-2xl mt-8 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-4 bg-gray-200 rounded-full w-48" />
        <div className="flex-1 h-px bg-gray-200" />
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
