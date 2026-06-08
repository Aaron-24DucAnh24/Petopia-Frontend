import { serverGet, serverGetOptional } from './server-http';
import { ICurrentUserCoreResponse, IUserInfoResponse } from '@/src/interfaces/user';

export const getOtherUserServer = (userId: string) =>
  serverGet<IUserInfoResponse>(`/User/OtherUser?userId=${userId}`);

export const getCurrentUserServer = () =>
  serverGet<IUserInfoResponse>('/User/CurrentUser');

// Returns null instead of redirecting — safe to call from public layouts.
export const getCurrentUserCoreServer = () =>
  serverGetOptional<ICurrentUserCoreResponse>('/User/CurrentUserCore');
