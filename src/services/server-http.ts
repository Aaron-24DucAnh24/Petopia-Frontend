import axios from 'axios';
import https from 'https';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIES_NAME } from '@/src/utils/constants';
import { ILoginResponse } from '@/src/interfaces/authentication';

const UNAUTHORIZED = 401;

const serverAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    'ngrok-skip-browser-warning': true,
  },
  // Allow self-signed certs in non-production environments (dev backend on 127.0.0.1)
  httpsAgent: process.env.NODE_ENV !== 'production'
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined,
});

async function refreshServerToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await serverAxios.get('/Authentication/Refresh', {
      params: { refreshToken },
    });
    const data = response.data.data as ILoginResponse;
    return data.accessToken;
  } catch {
    return null;
  }
}

export async function serverGet<T>(path: string): Promise<T> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIES_NAME.ACCESS_TOKEN_SERVER)?.value;
  try {
    const res = await serverAxios.get(path, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data.data as T;
  } catch (error: any) {
    if (error?.response?.status === UNAUTHORIZED) {
      const refreshToken = cookieStore.get(COOKIES_NAME.REFRESH_TOKEN_SERVER)?.value;
      if (refreshToken) {
        const newToken = await refreshServerToken(refreshToken);
        if (newToken) {
          try {
            const res = await serverAxios.get(path, {
              headers: { Authorization: `Bearer ${newToken}` },
            });
            return res.data.data as T;
          } catch (retryError: any) {
            if (retryError?.response?.status !== UNAUTHORIZED) throw retryError;
          }
        }
      }
      redirect('/login');
    }
    throw error;
  }
}

export async function serverPost<T>(path: string, body: unknown): Promise<T> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIES_NAME.ACCESS_TOKEN_SERVER)?.value;
  try {
    const res = await serverAxios.post(path, body, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data as T;
  } catch (error: any) {
    if (error?.response?.status === UNAUTHORIZED) {
      const refreshToken = cookieStore.get(COOKIES_NAME.REFRESH_TOKEN_SERVER)?.value;
      if (refreshToken) {
        const newToken = await refreshServerToken(refreshToken);
        if (newToken) {
          try {
            const res = await serverAxios.post(path, body, {
              headers: { Authorization: `Bearer ${newToken}` },
            });
            return res.data as T;
          } catch (retryError: any) {
            if (retryError?.response?.status !== UNAUTHORIZED) throw retryError;
          }
        }
      }
      redirect('/login');
    }
    throw error;
  }
}

// Like serverGet but returns null instead of redirecting on 401 or any error.
// Safe to call from layouts that serve both authenticated and unauthenticated users.
export async function serverGetOptional<T>(path: string): Promise<T | null> {
  const token = cookies().get(COOKIES_NAME.ACCESS_TOKEN_SERVER)?.value;
  if (!token) return null;
  try {
    const res = await serverAxios.get(path, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data as T;
  } catch {
    return null;
  }
}
