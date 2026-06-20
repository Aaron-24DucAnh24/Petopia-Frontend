'use client';
import { useEffect } from 'react';
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { getCookie } from 'cookies-next';
import { COOKIES_NAME } from '@/src/utils/constants';
import { ICurrentUserCoreResponse } from '@/src/interfaces/user';
import { refreshAccessToken } from '@/src/services/http';

const BASE_URL = (process.env.NEXT_PUBLIC_API_ENDPOINT ?? '').replace(
  '/api',
  ''
);

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now() + 30000;
  } catch {
    return true;
  }
}

async function getValidAccessToken(): Promise<string> {
  const token = getCookie(COOKIES_NAME.ACCESS_TOKEN_SERVER)?.toString() ?? '';
  if (!token || isTokenExpired(token)) {
    try {
      return await refreshAccessToken();
    } catch {
      return '';
    }
  }
  return token;
}

let globalConnection: ReturnType<typeof HubConnectionBuilder.prototype.build> | null = null;

export function getGlobalConnection() {
  return globalConnection;
}

export function RealTimeProvider({
  userContext,
}: {
  userContext: ICurrentUserCoreResponse | null;
}) {
  useEffect(() => {
    if (!userContext) return;

    if (!globalConnection) {
      globalConnection = new HubConnectionBuilder()
        .withUrl(`${BASE_URL}/hubs/realtime`, {
          accessTokenFactory: getValidAccessToken,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(LogLevel.Warning)
        .build();
    }

    if (globalConnection.state === HubConnectionState.Disconnected) {
      globalConnection.start().catch(console.error);
    }

    return () => {
      if (globalConnection) {
        globalConnection.stop();
        globalConnection = null;
      }
    };
  }, [userContext]);

  return null;
}
