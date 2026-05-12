import { UserPage } from '@/src/components/user/UserPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hồ sơ người dùng - Petopia',
  description: 'Mạng xã hội dành cho thú cưng',
};

export default function page() {
  return (
    <UserPage />
  );
}
