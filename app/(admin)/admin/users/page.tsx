import { Metadata } from 'next';
import { AdminUsersList } from '@/src/components/admin/AdminUsersList';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { getCurrentUserCoreServer } from '@/src/services/user.server';

export const metadata: Metadata = {
  title: 'Quản lý người dùng - Petopia Admin',
};

export default async function AdminUsersPage() {
  const userContext = await getCurrentUserCoreServer();
  return (
    <div>
      <AdminHeader
        title="Quản lý người dùng"
        subtitle="Tìm kiếm, xem và quản lý trạng thái người dùng"
        userContext={userContext}
      />
      <AdminUsersList />
    </div>
  );
}
