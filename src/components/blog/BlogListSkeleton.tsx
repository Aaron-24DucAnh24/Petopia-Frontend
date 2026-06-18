import CardSkeleton from '../ui/CardSkeleton';
import { PAGE_SIZE } from '@/src/utils/constants';

export default function BlogListSkeleton() {
  return (
    <>
      <div className="flex gap-2 flex-wrap mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-full bg-gray-200 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
