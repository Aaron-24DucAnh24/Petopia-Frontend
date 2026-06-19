import { Metadata } from 'next';
import { AdminUpgradesList } from '@/src/components/admin/AdminUpgradesList';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { getCurrentUserCoreServer } from '@/src/services/user.server';

export const metadata: Metadata = {
  title: 'Yêu cầu xác minh - Petopia Admin',
};

export default async function AdminUpgradesPage() {
  const userContext = await getCurrentUserCoreServer();
  return (
    <div>
      <AdminHeader
        title="Yêu cầu xác minh tổ chức"
        subtitle="Xét duyệt và xử lý các yêu cầu nâng cấp tài khoản"
        userContext={userContext}
      />
      <AdminUpgradesList />
    </div>
  );
}
