import { IBlogCardResponse } from '@/src/interfaces/blog';
import Image from 'next/image';
import { BLOG_CATEGORIES_OPTION } from '@/src/utils/constants';
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
  isEditable,
  onRefetch,
  testId,
}: IBlogCard) => {
  return (
    <div className="relative">
      <Link href={`/blog/${id}`}>
        <div
          className="max-w-xs p-2 h-full bg-white border border-gray-200 rounded-2xl shadow-lg"
          test-id={testId}
        >
          <div className="flex flex-col" key={id}>
            <div className="relative w-full pt-[100%]">
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-full top-0 left-0 object-cover rounded-2xl"
              />
              <div
                test-id="blog-category-tag"
                className="bg-yellow-400 text-black text-xs font-bold uppercase px-2 py-1 absolute top-0 left-0 rounded-br-lg"
              >
                {BLOG_CATEGORIES_OPTION[category + 1].label}
              </div>
            </div>
            <div className="p-2 md:p-4">
              <h2
                test-id={testId + '-title'}
                className="text-lg font-bold mb-2 line-clamp-2"
              >
                {title}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-3">{excerpt}</p>
            </div>
          </div>
        </div>
      </Link>

      {isEditable && <BlogCardActions id={id} onRefetch={onRefetch} />}
    </div>
  );
};

export default BlogCard;
