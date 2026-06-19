import { Metadata } from 'next';
import { AdminBlogsList } from '@/src/components/admin/AdminBlogsList';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { getCurrentUserCoreServer } from '@/src/services/user.server';

export const metadata: Metadata = {
  title: 'Quản lý blog - Petopia Admin',
};

export default async function AdminBlogsPage() {
  const userContext = await getCurrentUserCoreServer();
  return (
    <div>
      <AdminHeader
        title="Quản lý blog"
        subtitle="Kiểm duyệt và quản lý nội dung blog"
        userContext={userContext}
      />
      <AdminBlogsList />
    </div>
  );
}
