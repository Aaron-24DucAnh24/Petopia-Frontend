import { Metadata } from 'next';
import { Suspense } from 'react';
import { BLOG_CATEGORIES } from '@/src/utils/constants';
import { getBlogsServer } from '@/src/services/blog.server';
import { BlogListSection } from '@/src/components/blog/BlogListSection';
import BlogListSkeleton from '@/src/components/blog/BlogListSkeleton';

export const metadata: Metadata = {
  title: 'Tin tức - Petopia',
  description: 'Mạng xã hội dành cho thú cưng',
};

export default async function page({
  searchParams,
}: {
  searchParams: { category?: string | string[]; page?: string };
}) {
  const categories = (
    Array.isArray(searchParams.category)
      ? searchParams.category
      : searchParams.category
      ? [searchParams.category]
      : []
  ).map(Number) as BLOG_CATEGORIES[];

  const pageIndex = Number(searchParams.page || '1');
  const initialData = await getBlogsServer(pageIndex, categories);

  return (
    <div className="container mx-auto my-10">
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogListSection initialData={initialData} />
      </Suspense>
    </div>
  );
}
