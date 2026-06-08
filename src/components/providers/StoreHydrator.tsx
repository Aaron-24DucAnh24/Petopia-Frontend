'use client';
import { useEffect } from 'react';
import { ICurrentUserCoreResponse } from '@/src/interfaces/user';
import { userStore } from '@/src/stores/user.store';

// Runs before first paint so MobX observer components have the correct user
// context during hydration without a visible flash.
export function StoreHydrator({ userContext }: { userContext: ICurrentUserCoreResponse | null }) {
  useEffect(() => {
    if (userContext) {
      userStore.setUserContext(userContext);
    } else {
      userStore.clearUserContext();
    }
  }, [userContext]);

  return null;
}
