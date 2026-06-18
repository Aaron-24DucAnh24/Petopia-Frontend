import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getCurrentUserCoreServer } from '@/src/services/user.server';
import { getBlogDetailServer } from '@/src/services/blog.server';
import { BlogEditForm } from '@/src/components/blog/BlogEditForm';

export const metadata: Metadata = {
  title: 'Chỉnh sửa bài viết - Petopia',
  description: 'Mạng xã hội dành cho thú cưng',
};

export default async function page({ params }: { params: { id: string } }) {
  const [userContext, blog] = await Promise.all([
    getCurrentUserCoreServer(),
    getBlogDetailServer(params.id).catch(() => null),
  ]);

  if (!userContext) {
    redirect('/login');
  }

  if (!blog || blog.userId !== userContext.id) {
    redirect(`/blog/${params.id}`);
  }

  return (
    <div className="container mx-auto my-10">
      <BlogEditForm blog={blog} />
    </div>
  );
}
