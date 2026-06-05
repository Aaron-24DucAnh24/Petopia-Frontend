import axios from 'axios';
import https from 'https';
import { cookies } from 'next/headers';
import { COOKIES_NAME } from '@/src/utils/constants';

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

export async function serverGet<T>(path: string): Promise<T> {
  const token = cookies().get(COOKIES_NAME.ACCESS_TOKEN_SERVER)?.value;
  const res = await serverAxios.get(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data.data as T;
}
