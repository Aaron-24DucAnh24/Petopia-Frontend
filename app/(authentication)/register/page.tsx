import React from 'react';
import RegisterForm from '@/src/components/authentication/RegisterForm';
import { Metadata } from 'next';
import { Background } from '@/src/components/common/general/Background';

export const metadata: Metadata = {
  title: 'Đăng ký - Petopia',
  description: 'Nền tảng nhận nuôi thú cưng trực tuyến',
};

export default function page() {
  return (
    <>
      <div className="absolute m-auto left-0 right-0 z-50 h-screen">
        <RegisterForm />
      </div>
      <Background />
    </>
  );
}
