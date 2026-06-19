import { Metadata } from 'next';
import { AdminPaymentsList } from '@/src/components/admin/AdminPaymentsList';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { getCurrentUserCoreServer } from '@/src/services/user.server';

export const metadata: Metadata = {
  title: 'Quản lý thanh toán - Petopia Admin',
};

export default async function AdminPaymentsPage() {
  const userContext = await getCurrentUserCoreServer();
  return (
    <div>
      <AdminHeader
        title="Quản lý thanh toán"
        subtitle="Xem lịch sử giao dịch trong hệ thống"
        userContext={userContext}
      />
      <AdminPaymentsList />
    </div>
  );
}
