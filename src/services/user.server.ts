import { serverGet } from './server-http';
import { IUserInfoResponse } from '@/src/interfaces/user';

export const getOtherUserServer = (userId: string) =>
  serverGet<IUserInfoResponse>(`/User/OtherUser?userId=${userId}`);
