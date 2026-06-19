import { Metadata } from 'next';
import { AdminStats } from '@/src/components/admin/AdminStats';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { getCurrentUserCoreServer } from '@/src/services/user.server';
import { getAdminStatisticsServer } from '@/src/services/admin.server';
import { IAdminStatistics } from '@/src/interfaces/admin';

export const metadata: Metadata = {
  title: 'Tổng quan - Petopia Admin',
};

export default async function AdminDashboardPage() {
  const [userContext, stats] = await Promise.all([
    getCurrentUserCoreServer(),
    getAdminStatisticsServer().catch((): IAdminStatistics | null => null),
  ]);

  return (
    <div>
      <AdminHeader
        title="Tổng quan"
        subtitle="Thống kê hoạt động hệ thống Petopia"
        userContext={userContext}
      />
      <AdminStats stats={stats} />
    </div>
  );
}
