import { UserSection } from '@/src/components/user/UserSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hồ sơ người dùng - Petopia',
  description: 'Nền tảng nhận nuôi thú cưng trực tuyến',
};

export default function page() {
  return (
    <div>
      <UserSection />
    </div>
  );
}
