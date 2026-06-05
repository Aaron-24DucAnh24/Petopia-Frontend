'use client';
import { useState, useEffect, useRef } from 'react';
import { IGetPostResponse } from '@/src/interfaces/post';
import { IApiResponse } from '@/src/interfaces/common';
import { getUserPosts } from '@/src/services/post.api';
import { useQuery } from '@/src/utils/hooks';
import { QUERY_KEYS } from '@/src/utils/constants';
import { FeedPostCard } from './FeedPostCard';
import { PostDetailModal } from './PostDetailModal';
import { QueryProvider } from '../providers/QueryProvider';

const PAGE_SIZE = 20;

export const PostListPage = QueryProvider(() => {
  const [posts, setPosts] = useState<IGetPostResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPost, setSelectedPost] = useState<IGetPostResponse | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const query = useQuery<IApiResponse<IGetPostResponse[]>>(
    [QUERY_KEYS.GET_ALL_POSTS, currentPage],
    () => getUserPosts({ pageIndex: currentPage, pageSize: PAGE_SIZE, filter: { userId: undefined } }),
    {
      onSuccess: (res) => {
        const newPosts = res.data.data ?? [];
        setPosts((prev) => (currentPage === 1 ? newPosts : [...prev, ...newPosts]));
        setHasMore(currentPage < (res.data.pageNumber ?? 1));
      },
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (!hasMore || query.isFetching) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, query.isFetching]);

  return (
    <div className="w-1/3 mx-auto px-4 py-6 flex flex-col gap-4">
      {posts.map((post) => (
        <FeedPostCard
          key={post.id}
          post={post}
          onClick={() => setSelectedPost(post)}
        />
      ))}

      <div ref={sentinelRef} />

      {query.isFetching && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-orange-400 rounded-full animate-spin" />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-gray-400 text-sm py-4">Bạn đã xem hết bài đăng</p>
      )}

      {!hasMore && posts.length === 0 && !query.isFetching && (
        <p className="text-center text-gray-400 text-sm py-4">Chưa có bài đăng nào</p>
      )}

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
});
