import React from 'react';
import { LoginForm } from '@/src/components/authentication/LoginForm';
import { Metadata } from 'next';
import { Background } from '@/src/components/ui/Background';
import { getGoogleAuthClientIdServer } from '@/src/services/authentication.server';

export const metadata: Metadata = {
  title: 'Đăng nhập - Petopia',
  description: 'Mạng xã hội dành cho thú cưng',
};

export default async function page() {
  let clientId = '';
  try {
    clientId = await getGoogleAuthClientIdServer();
  } catch {}

  return (
    <>
      <div className="absolute m-auto left-0 right-0 z-50">
        <LoginForm clientId={clientId} />
      </div>
      <Background />
    </>
  );
}
