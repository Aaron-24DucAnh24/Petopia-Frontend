import { serverGet, serverPost } from './server-http';
import { IApiResponse } from '@/src/interfaces/common';
import { IBlogCardResponse, IBlogResponse } from '@/src/interfaces/blog';

export const getBlogsByUserServer = (userId: string) =>
  serverPost<IApiResponse<IBlogCardResponse[]>>('/Blog/Get', {
    pageIndex: 1,
    pageSize: 6,
    filter: { userId },
  });

export const getBlogDetailServer = (id: string) =>
  serverGet<IBlogResponse>(`/Blog/${id}`);
