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

export async function refreshServerToken(refreshToken: string): Promise<ILoginResponse | null> {
  try {
    const response = await serverAxios.get('/Authentication/Refresh', {
      params: { refreshToken },
    });
    return response.data.data as ILoginResponse;
  } catch {
    return null;
  }
}

export async function serverGet<T>(path: string): Promise<T> {
  const token = cookies().get(COOKIES_NAME.ACCESS_TOKEN_SERVER)?.value;
  try {
    const res = await serverAxios.get(path, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data.data as T;
  } catch (error: any) {
    if (error?.response?.status === UNAUTHORIZED) redirect('/login');
    throw error;
  }
}

export async function serverPost<T>(path: string, body: unknown): Promise<T> {
  const token = cookies().get(COOKIES_NAME.ACCESS_TOKEN_SERVER)?.value;
  try {
    const res = await serverAxios.post(path, body, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data as T;
  } catch (error: any) {
    if (error?.response?.status === UNAUTHORIZED) redirect('/login');
    throw error;
  }
}

// Returns null instead of redirecting on auth failure — safe for layouts serving
// both authenticated and unauthenticated users. Token refresh is handled by
// middleware before the Server Component runs, so no refresh logic is needed here.
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
