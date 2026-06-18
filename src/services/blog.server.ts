import { serverGet, serverPost } from './server-http';
import { IApiResponse } from '@/src/interfaces/common';
import { IBlogCardResponse, IBlogResponse } from '@/src/interfaces/blog';
import { BLOG_CATEGORIES, PAGE_SIZE } from '@/src/utils/constants';

export const getBlogsByUserServer = (userId: string) =>
  serverPost<IApiResponse<IBlogCardResponse[]>>('/Blog/Get', {
    pageIndex: 1,
    pageSize: 6,
    filter: { userId },
  });

export const getBlogDetailServer = (id: string) =>
  serverGet<IBlogResponse>(`/Blog/${id}`);

export const getBlogsServer = (pageIndex: number, categories: BLOG_CATEGORIES[]) =>
  serverPost<IApiResponse<IBlogCardResponse[]>>('/Blog/Get', {
    pageIndex,
    pageSize: PAGE_SIZE,
    filter: categories.length > 0 ? { category: categories } : {},
  });
