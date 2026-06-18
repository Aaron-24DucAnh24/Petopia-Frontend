'use client';
import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { IBlogCardResponse } from '@/src/interfaces/blog';
import { IApiResponse, IPaginationModel } from '@/src/interfaces/common';
import { getBlogs } from '@/src/services/blog.api';
import { useQuery } from '@/src/utils/hooks';
import { BLOG_CATEGORIES, PAGE_SIZE, QUERY_KEYS } from '@/src/utils/constants';
import { ValueTextManager } from '@/src/utils/ValueTextManager';
import BlogCard from './BlogCard';
import { QueryProvider } from '../providers/QueryProvider';
import Pagination from '../ui/Pagination';
import CardSkeleton from '../ui/CardSkeleton';
import { NoResultBackground } from '../ui/NoResultBackground';

const ALL_CATEGORIES = [
  BLOG_CATEGORIES.HEALTH,
  BLOG_CATEGORIES.TRAINING,
  BLOG_CATEGORIES.PRODUCT,
  BLOG_CATEGORIES.ART,
];

// Pure utility — no closure over component state
function buildParams(nextCategories: BLOG_CATEGORIES[], page: number): URLSearchParams {
  const p = new URLSearchParams();
  nextCategories.forEach(c => p.append('category', String(c)));
  if (page > 1) p.set('page', String(page));
  return p;
}

interface IBlogListSectionProps {
  initialData: IApiResponse<IBlogCardResponse[]>;
}

export const BlogListSection = QueryProvider(({ initialData }: IBlogListSectionProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categories = searchParams.getAll('category').map(Number) as BLOG_CATEGORIES[];
  const urlPage = Number(searchParams.get('page') || '1');

  const paginationForm = useForm<IPaginationModel>({
    defaultValues: { pageIndex: urlPage, pageNumber: initialData.pageNumber ?? 1 },
  });

  // Once any navigation occurs, stop skipping fetches — including returns to the initial URL.
  const hasNavigatedRef = useRef(false);
  const initialParamsRef = useRef(searchParams.toString());
  if (!hasNavigatedRef.current && searchParams.toString() !== initialParamsRef.current) {
    hasNavigatedRef.current = true;
  }

  const categoriesRef = useRef(categories);
  categoriesRef.current = categories;

  const toggleCategory = (category: BLOG_CATEGORIES) => {
    const next = categories.includes(category)
      ? categories.filter(c => c !== category)
      : [...categories, category];
    router.replace(`${pathname}?${buildParams(next, 1).toString()}`);
  };

  // Sync URL page → form (browser back/forward)
  useEffect(() => {
    paginationForm.setValue('pageIndex', urlPage);
  }, [urlPage, paginationForm]);

  // Sync form page → URL (Pagination component)
  const formPageIndex = paginationForm.watch('pageIndex');
  useEffect(() => {
    if (formPageIndex === urlPage) return;
    router.replace(`${pathname}?${buildParams(categoriesRef.current, formPageIndex).toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formPageIndex]);

  const getBlogsQuery = useQuery<IApiResponse<IBlogCardResponse[]>>(
    [QUERY_KEYS.GET_BLOGS, searchParams.toString()],
    () =>
      getBlogs({
        pageIndex: urlPage,
        pageSize: PAGE_SIZE,
        filter: categories.length > 0 ? { category: categories } : undefined,
      }),
    {
      // Skip the initial fetch when the server already provided data for this URL.
      // hasNavigatedRef ensures returning to the initial URL re-fetches (not permanently disabled).
      enabled: hasNavigatedRef.current,
      onSuccess: (res) => {
        if (res.data.pageNumber !== undefined) {
          paginationForm.setValue('pageNumber', res.data.pageNumber);
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  // Derive blogs directly from query data to stay in sync on cache hits.
  // Falls back to SSR data while query is disabled or pending.
  const blogs: IBlogCardResponse[] = getBlogsQuery.data?.data.data ?? initialData.data ?? [];

  return (
    <div>
      {/* Category filter pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          type="button"
          onClick={() => router.replace(pathname)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${categories.length === 0
            ? 'bg-amber-400 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Tất cả
        </button>
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => toggleCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${categories.includes(cat)
              ? 'bg-amber-400 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {ValueTextManager.BlogCategory.GetText(String(cat))}
          </button>
        ))}
      </div>

      {/* Blog grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {getBlogsQuery.isFetching &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => <CardSkeleton key={i} />)}
        {!getBlogsQuery.isFetching &&
          blogs.map((blog, i) => (
            <BlogCard key={blog.id} {...blog} testId={`blog-card-${i}`} />
          ))}
      </div>

      <NoResultBackground show={!getBlogsQuery.isFetching && blogs.length === 0} />

      <div className="flex justify-center mt-6">
        <Pagination
          paginationForm={paginationForm}
          disable={getBlogsQuery.isFetching}
          show={blogs.length !== 0 && paginationForm.getValues('pageNumber') !== 1}
        />
      </div>
    </div>
  );
});
