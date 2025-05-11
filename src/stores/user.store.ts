import { makeAutoObservable } from 'mobx';
import { ICurrentUserCoreResponse } from '@/src/interfaces/user';
import { getCurrentUserCore } from '../services/user.api';
import { IApiResponse } from '../interfaces/common';

export class UserStore {
  userContext: ICurrentUserCoreResponse | null = null;
  hydrated: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUserContext(user: ICurrentUserCoreResponse) {
    this.userContext = user;
  }

  clearUserContext() {
    this.userContext = null;
    localStorage.removeItem('user');
  }

  hydrateFromLocalStorage() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson) as ICurrentUserCoreResponse;
        this.setUserContext(user);
      } catch (error) {
        console.error('Failed to hydrate user from localStorage:', error);
      } finally {
        this.hydrated = true;
      }
    }
  }

  async fetchUserContext() {
    const userContextInformation = (await getCurrentUserCore()).data as IApiResponse<ICurrentUserCoreResponse>;
    userStore.setUserContext(userContextInformation.data);
    localStorage.setItem('user', JSON.stringify(userContextInformation.data));
  }
}

export const userStore = new UserStore();