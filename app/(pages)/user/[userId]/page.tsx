import { OtherUserPage } from '@/src/components/user/OtherUserPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hồ sơ người dùng - Petopia',
  description: 'Mạng xã hội dành cho thú cưng',
};

export default function page({ params }: { params: { userId: string } }) {
  return (
    <div>
      <OtherUserPage userId={params.userId} />
    </div>
  );
}
