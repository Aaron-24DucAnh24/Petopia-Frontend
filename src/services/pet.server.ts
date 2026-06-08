import { serverGet, serverPost } from './server-http';
import { IApiResponse } from '@/src/interfaces/common';
import { IPetDetailResponse, IPetResponse } from '@/src/interfaces/pet';

export const getPetDetailServer = (id: string) =>
  serverGet<IPetDetailResponse>(`/Pet/${id}/Details`);

export const getPetsByUserServer = (userId: string) =>
  serverPost<IApiResponse<IPetResponse[]>>('/Pet/User', {
    pageIndex: 1,
    pageSize: 6,
    filter: userId,
  });
