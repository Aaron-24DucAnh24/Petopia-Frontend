import CardSkeleton from './CardSkeleton';

const DETAIL_ROWS = 12;

export default function PetDetailSkeleton() {
  return (
    <div>
      <div className="container max-w-5xl animate-pulse mx-auto p-5 shadow-2xl rounded-2xl">
        <div className="grid md:grid-cols-2 grid-cols-1">
          {/* Left: main image + thumbnail strip */}
          <div>
            <div className="w-full relative pt-[100%] bg-gray-200 rounded-lg" />
            <div className="p-5 flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Right: name, link button, detail rows, report button */}
          <div className="md:pl-10 md:mt-0 mt-5">
            <div className="h-8 bg-gray-200 rounded-full w-48 mb-4 mt-5 md:mt-0" />
            <div className="h-10 w-44 bg-gray-200 rounded-full mb-5" />

            <div className="flex flex-col divide-y">
              {Array.from({ length: DETAIL_ROWS }).map((_, i) => (
                <div key={i} className="flex flex-row py-2 gap-2">
                  <div className="w-1/3 h-4 bg-gray-200 rounded-full" />
                  <div className="w-2/3 h-4 bg-gray-200 rounded-full" />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-5 shadow-2xl rounded-2xl my-5">
        <div className="h-4 bg-gray-200 rounded-full w-48 mb-4" />
        <div className="grid md:grid-cols-4 grid-cols-1 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
