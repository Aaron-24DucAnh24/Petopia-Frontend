import { Suspense } from 'react';
import { IBlogResponse } from '@/src/interfaces/blog';
import { getBlogDetailServer, getCommentsBlogServer } from '@/src/services/blog.server';
import BlogPage from '@/src/components/blog/BlogPage';
import BlogDetailSkeleton from '@/src/components/blog/BlogDetailSkeleton';
import { NoResultBackground } from '@/src/components/ui/NoResultBackground';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<BlogDetailSkeleton />}>
      <BlogDetailContent blogId={params.id} />
    </Suspense>
  );
}

async function BlogDetailContent({ blogId }: { blogId: string }) {
  let blog: IBlogResponse;
  try {
    blog = await getBlogDetailServer(blogId);
  } catch {
    return <NoResultBackground className="h-fit-screen w-full items-center mt-10" />;
  }

  const initialComments = await getCommentsBlogServer(blogId);

  return <BlogPage blog={blog} initialComments={initialComments} />;
}
