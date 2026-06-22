import { Metadata } from 'next';
import { AdminEmailTemplatesList } from '@/src/components/admin/AdminEmailTemplatesList';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { getCurrentUserCoreServer } from '@/src/services/user.server';

export const metadata: Metadata = {
  title: 'Quản lý mẫu email - Petopia Admin',
};

export default async function AdminEmailTemplatesPage() {
  const userContext = await getCurrentUserCoreServer();
  return (
    <div>
      <AdminHeader
        title="Quản lý mẫu email"
        subtitle="Chỉnh sửa nội dung và tiêu đề các mẫu email hệ thống"
        userContext={userContext}
      />
      <AdminEmailTemplatesList />
    </div>
  );
}
