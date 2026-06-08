import { makeAutoObservable } from 'mobx';
import { ICurrentUserCoreResponse } from '@/src/interfaces/user';
import { getCurrentUserCore } from '../services/user.api';
import { IApiResponse } from '../interfaces/common';

export class UserStore {
  userContext: ICurrentUserCoreResponse | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUserContext(user: ICurrentUserCoreResponse) {
    this.userContext = user;
  }

  clearUserContext() {
    this.userContext = null;
  }

  async fetchUserContext() {
    const res = (await getCurrentUserCore()).data as IApiResponse<ICurrentUserCoreResponse>;
    this.setUserContext(res.data);
  }
}

export const userStore = new UserStore();
