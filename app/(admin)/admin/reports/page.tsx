import { Metadata } from 'next';
import { AdminReportsList } from '@/src/components/admin/AdminReportsList';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { getCurrentUserCoreServer } from '@/src/services/user.server';

export const metadata: Metadata = {
  title: 'Quản lý báo cáo - Petopia Admin',
};

export default async function AdminReportsPage() {
  const userContext = await getCurrentUserCoreServer();
  return (
    <div>
      <AdminHeader
        title="Quản lý báo cáo"
        subtitle="Xem xét và giải quyết các báo cáo vi phạm"
        userContext={userContext}
      />
      <AdminReportsList />
    </div>
  );
}
