import BlogListSkeleton from '@/src/components/blog/BlogListSkeleton';

export default function loading() {
  return (
    <div className="container mx-auto my-10">
      <BlogListSkeleton />
    </div>
  );
}
