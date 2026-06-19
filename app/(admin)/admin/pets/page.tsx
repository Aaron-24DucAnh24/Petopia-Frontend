import { Metadata } from 'next';
import { AdminPetsList } from '@/src/components/admin/AdminPetsList';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { getCurrentUserCoreServer } from '@/src/services/user.server';

export const metadata: Metadata = {
  title: 'Quản lý thú cưng - Petopia Admin',
};

export default async function AdminPetsPage() {
  const userContext = await getCurrentUserCoreServer();
  return (
    <div>
      <AdminHeader
        title="Quản lý thú cưng"
        subtitle="Tìm kiếm và quản lý hồ sơ thú cưng trong hệ thống"
        userContext={userContext}
      />
      <AdminPetsList />
    </div>
  );
}
