import CardSkeleton from './CardSkeleton';

export default function PetDetailSkeleton() {
  return (
    <div className="py-6 space-y-5 animate-pulse">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
          {/* Left: image + thumbnail strip */}
          <div className="flex flex-col gap-3">
            <div className="w-full relative pt-[100%] bg-gray-200 rounded-2xl" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-1 aspect-square bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Right: info */}
          <div className="flex flex-col gap-4">
            {/* Availability badge + name */}
            <div>
              <div className="h-5 w-24 bg-gray-200 rounded-full mb-2" />
              <div className="h-8 w-48 bg-gray-200 rounded-lg" />
            </div>

            {/* Attribute chips */}
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-7 w-16 bg-gray-200 rounded-full" />
              ))}
            </div>

            {/* Breed + Color mini-cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-100 rounded-xl p-3 h-14" />
              <div className="bg-gray-100 rounded-xl p-3 h-14" />
            </div>

            {/* Location + date */}
            <div className="flex flex-col gap-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
              <div className="h-4 w-1/2 bg-gray-200 rounded-full" />
            </div>

            {/* Health status cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-100 rounded-xl p-3 h-16" />
              <div className="bg-gray-100 rounded-xl p-3 h-16" />
            </div>

            {/* Owner link button */}
            <div className="h-12 bg-gray-200 rounded-full" />

            {/* Report button */}
            <div className="flex justify-end">
              <div className="h-8 w-24 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>

        {/* Description section */}
        <div className="mt-8 p-5 bg-gray-100 rounded-2xl">
          <div className="h-5 w-40 bg-gray-200 rounded-full mb-3" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded-full" />
            <div className="h-4 w-5/6 bg-gray-200 rounded-full" />
            <div className="h-4 w-4/6 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>

      {/* See more */}
      <div className="container max-w-5xl mx-auto px-4 py-5 shadow-2xl rounded-2xl">
        <div className="h-6 w-40 bg-gray-200 rounded-full mb-5" />
        <div className="grid md:grid-cols-4 grid-cols-1 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
