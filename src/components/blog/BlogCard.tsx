import { IBlogCardResponse } from '@/src/interfaces/blog';
import Image from 'next/image';
import { ValueTextManager } from '@/src/utils/ValueTextManager';
import Link from 'next/link';
import { BlogCardActions } from './BlogCardActions';

interface IBlogCard extends IBlogCardResponse {
  isEditable?: boolean;
  onRefetch?: () => void;
  testId?: string;
}

const BlogCard = ({
  id,
  image,
  category,
  title,
  excerpt,
  isAdvertised,
  isEditable,
  onRefetch,
  testId,
}: IBlogCard) => {
  return (
    <div className="relative group h-full">
      <Link href={`/blog/${id}`} className="block h-full">
        <div
          test-id={testId}
          className={`aspect-[4/5] rounded-2xl overflow-hidden bg-white border shadow-sm hover:shadow-md transition-shadow flex flex-col ${isAdvertised ? 'border-yellow-400 shadow-yellow-100' : 'border-gray-100'}`}
        >
          <div className="relative flex-1 min-h-[40%]">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
            <div
              test-id="blog-category-tag"
              className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-black text-xs font-bold uppercase px-2.5 py-1 rounded-full shadow-sm"
            >
              {ValueTextManager.BlogCategory.GetText(category.toString())}
            </div>
            {isAdvertised && (
              <div className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold uppercase px-2.5 py-1 rounded-full shadow-sm">
                Quảng cáo
              </div>
            )}
          </div>
          <div className="p-3 min-h-0">
            <h2
              test-id={testId + '-title'}
              className="font-bold text-gray-900 text-base line-clamp-2 mb-1"
            >
              {title}
            </h2>
            <p className="text-sm text-gray-400 line-clamp-4">{excerpt}</p>
          </div>
        </div>
      </Link>

      {isEditable && <BlogCardActions id={id} onRefetch={onRefetch} />}
    </div>
  );
};

export default BlogCard;
