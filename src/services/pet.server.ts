import { serverGet } from './server-http';
import { IPetDetailResponse } from '@/src/interfaces/pet';

export const getPetDetailServer = (id: string) =>
  serverGet<IPetDetailResponse>(`/Pet/${id}/Details`);
