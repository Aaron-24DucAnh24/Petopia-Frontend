'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import BlogCard from './BlogCard';
import Pagination from '../ui/Pagination';
import { getBlogs } from '@/src/services/blog.api';
import { useForm } from 'react-hook-form';
import { IApiResponse, IPaginationModel } from '@/src/interfaces/common';
import {
  BLOG_CATEGORIES,
  PAGE_SIZE,
  QUERY_KEYS,
  USER_ROLE,
} from '@/src/utils/constants';
import { ValueTextManager } from '@/src/utils/ValueTextManager';
import { IBlogCardResponse, IBlogResponse } from '@/src/interfaces/blog';
import { useQuery } from '@/src/utils/hooks';
import { QueryProvider } from '../providers/QueryProvider';
import CardSkeleton from '../ui/CardSkeleton';
import AdvertisementCarousel from './AdvertisementCarousel';
import { SortBlock } from '../ui/SortBlock';
import { useStores } from '@/src/stores';

const BlogSection = QueryProvider(observer(() => {
  const { userStore } = useStores();
  const canCreate =
    userStore.userContext?.role === USER_ROLE.SYSTEM_ADMIN ||
    userStore.userContext?.role === USER_ROLE.ORGANIZATION;
  const [selectedCategory, setSelectedCategory] = useState<
    BLOG_CATEGORIES | undefined
  >();
  const [blogs, setBlogs] = useState<IBlogCardResponse[]>([]);
  const [orderBy, setOrderBy] = useState<'newest' | 'popular'>('newest');

  const paginationForm = useForm<IPaginationModel>({
    defaultValues: {
      pageIndex: 1,
      pageNumber: 1,
    },
  });

  const getBlogsQuery = useQuery<IApiResponse<IBlogResponse[]>>(
    [
      QUERY_KEYS.GET_BLOGS,
      selectedCategory,
      paginationForm.getValues('pageIndex'),
      orderBy,
    ],
    () =>
      getBlogs({
        pageIndex: paginationForm.getValues('pageIndex'),
        pageSize: PAGE_SIZE,
        orderBy: orderBy,
        filter: {
          category: selectedCategory,
        },
      }),
    {
      onSuccess: (res) => {
        const { data, pageNumber } = res.data;
        setBlogs(data);
        pageNumber && paginationForm.setValue('pageNumber', pageNumber);
      },
      onError: () => {
        // Handle error
      },

      refetchOnWindowFocus: false,
    }
  );

  return (
    <section className="blog-section">
      {/* Horizontal Navigation Bar */}

      {/* Banner */}
      <div className="flex items-center justify-center relative mt-5">
        <AdvertisementCarousel />
      </div>

      {/* Blog Cards Grid */}
      <div className="container max-w-5xl mx-auto p-5 justify-center">
        {canCreate && (
          <div className="flex justify-end mb-2">
            <Link href="/blog/new">
              <button className="bg-yellow-300 hover:bg-yellow-500 text-black font-medium rounded-lg text-sm px-5 py-2.5">
                Tạo bài viết
              </button>
            </Link>
          </div>
        )}
        <nav className="flex justify-center my-5">
          {
            <ul className="flex">
              {[
                { label: 'Tất cả', value: undefined as BLOG_CATEGORIES | undefined },
                ...ValueTextManager.BlogCategory.GetValueTexts().map(vt => ({
                  label: vt.text,
                  value: Number(vt.value) as BLOG_CATEGORIES,
                })),
              ].map((category, index) => (
                <li
                  test-id={'blog-category-filter-option'}
                  key={index}
                  className={`mr-5 cursor-pointer ${selectedCategory === category.value ? 'underline' : ''}`}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </li>
              ))}
            </ul>
          }
        </nav>
        <SortBlock
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          disable={getBlogsQuery.isFetching}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
          {getBlogsQuery.isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          {!getBlogsQuery.isLoading &&
            blogs.map((blog, index) => (
              <BlogCard
                testId={`blog-card-${index}`}
                key={blog.id}
                id={blog.id}
                image={blog.image}
                category={blog.category}
                title={blog.title}
                excerpt={blog.excerpt}
              />
            ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Pagination
          paginationForm={paginationForm}
          disable={false}
          show={
            blogs.length !== 0 && paginationForm.getValues('pageNumber') != 1
          }
        />
      </div>
    </section>
  );
}));  // observer wraps the inner fn so it reacts to userStore changes

export default BlogSection;
