import { Metadata } from 'next';
import { UpgradeRequestsPage } from '@/src/components/user/UpgradeRequestsPage';

export const metadata: Metadata = {
  title: 'Đơn xác minh tổ chức - Petopia',
  description: 'Mạng xã hội dành cho thú cưng',
};

export default function Page() {
  return <UpgradeRequestsPage />;
}
