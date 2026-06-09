import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getCurrentUserCoreServer } from '@/src/services/user.server';
import { USER_ROLE } from '@/src/utils/constants';
import { BlogCreateForm } from '@/src/components/blog/BlogCreateForm';

export const metadata: Metadata = {
  title: 'Tạo bài viết - Petopia',
  description: 'Mạng xã hội dành cho thú cưng',
};

export default async function page() {
  const userContext = await getCurrentUserCoreServer();

  if (!userContext) {
    redirect('/login');
  }

  if (
    userContext.role !== USER_ROLE.SYSTEM_ADMIN &&
    userContext.role !== USER_ROLE.ORGANIZATION
  ) {
    redirect('/blog');
  }

  return (
    <div className="container mx-auto my-10">
      <div className="mt-10">
        <BlogCreateForm />
      </div>
    </div>
  );
}
