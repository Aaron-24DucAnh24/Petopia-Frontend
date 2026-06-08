import { serverPost } from './server-http';
import { IApiResponse } from '@/src/interfaces/common';
import { IGetPostResponse } from '@/src/interfaces/post';

export const getUserPostsServer = (userId: string) =>
  serverPost<IApiResponse<IGetPostResponse[]>>('/Post/Get', {
    pageIndex: 1,
    pageSize: 6,
    filter: { userId },
  });
