export default function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm animate-pulse">
      <div className="w-full pt-[100%] bg-gray-200" />
      <div className="p-3">
        <div className="h-4 bg-gray-200 rounded-full mb-1.5 w-3/4" />
        <div className="h-3 bg-gray-200 rounded-full mb-3 w-1/2" />
        <div className="flex gap-1.5">
          <div className="h-5 w-14 bg-gray-200 rounded-full" />
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
