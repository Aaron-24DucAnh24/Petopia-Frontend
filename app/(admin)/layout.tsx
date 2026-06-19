import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getCurrentUserCoreServer } from '@/src/services/user.server';
import { USER_ROLE } from '@/src/utils/constants';
import { AdminSidebar } from '@/src/components/admin/AdminSidebar';
import { StoreHydrator } from '@/src/components/providers/StoreHydrator';

export const metadata: Metadata = {
  title: 'Quản trị - Petopia',
  description: 'Trang quản trị hệ thống Petopia',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const userContext = await getCurrentUserCoreServer();

  if (!userContext || userContext.role !== USER_ROLE.SYSTEM_ADMIN) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StoreHydrator userContext={userContext} />
      <AdminSidebar />
      <main className="ml-60 flex-1 p-8 min-w-0">
        {children}
      </main>
    </div>
  );
}
