import { PostListPage } from '@/src/components/post/PostListPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang chủ - Petopia',
  description: 'Mạng xã hội dành cho thứ cưng',
};

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row" data-testid="homepage-hero">
      <PostListPage />
    </div>
  );
}
