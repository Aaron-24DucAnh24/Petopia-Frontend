import React from 'react';
import { LoginForm } from '@/src/components/authentication/LoginForm';
import { Metadata } from 'next';
import { Background } from '@/src/components/common/Background';

export const metadata: Metadata = {
  title: 'Đăng nhập - Petopia',
  description: 'Mạng xã hội dành cho thú cưng',
};

export default function page() {
  return (
    <>
      <div className="absolute m-auto left-0 right-0 z-50">
        <LoginForm />
      </div>
      <Background />
    </>
  );
}
