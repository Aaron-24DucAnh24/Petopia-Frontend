import { Metadata } from 'next';
import { AdminPostsList } from '@/src/components/admin/AdminPostsList';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { getCurrentUserCoreServer } from '@/src/services/user.server';

export const metadata: Metadata = {
  title: 'Quản lý bài đăng - Petopia Admin',
};

export default async function AdminPostsPage() {
  const userContext = await getCurrentUserCoreServer();
  return (
    <div>
      <AdminHeader
        title="Quản lý bài đăng"
        subtitle="Kiểm duyệt và quản lý bài đăng của người dùng"
        userContext={userContext}
      />
      <AdminPostsList />
    </div>
  );
}
