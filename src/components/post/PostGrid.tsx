'use client';
import { useState } from 'react';
import { IGetPostResponse } from '@/src/interfaces/post';
import { AxiosResponse } from 'axios';
import { UseQueryResult } from 'react-query';
import { IApiErrorResponse, IApiResponse } from '@/src/interfaces/common';
import { deletePost } from '@/src/services/post.api';
import { useMutation } from '@/src/utils/hooks';
import { Alert } from '../common/Alert';
import { PostCard } from './PostCard';
import { PostDetailModal } from './PostDetailModal';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { AddButton } from '../common/button/AddButton';

const PAGE_SIZE = 6;

export function PostGrid({
  posts,
  query,
  onAdd,
}: {
  posts: IGetPostResponse[];
  query: UseQueryResult<
    AxiosResponse<IApiResponse<IGetPostResponse[]>, any>,
    AxiosResponse<IApiErrorResponse, any>
  >;
  onAdd?: () => void;
}) {
  const [selectedPost, setSelectedPost] = useState<IGetPostResponse | null>(null);
  const [alertShow, setAlertShow] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState('');
  const [page, setPage] = useState(0);
  const [slideDir, setSlideDir] = useState<'right' | 'left' | null>(null);

  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(0, totalPages - 1));
  const visiblePosts = posts.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const deletePostMutation = useMutation<IApiResponse<boolean>, string>(deletePost, {
    onSuccess: () => {
      setSelectedPost(null);
      query.refetch();
    },
  });

  const handleDeleteRequest = (postId: string) => {
    setPendingDeleteId(postId);
    setAlertShow(true);
  };

  const goNext = () => {
    setSlideDir('left');
    setPage((p) => Math.min(p + 1, totalPages - 1));
  };

  const goPrev = () => {
    setSlideDir('right');
    setPage((p) => Math.max(p - 1, 0));
  };

  // h-44 image (176px) + stats bar ~36px + border = ~214px per row, gap-2 (8px) between rows
  const rows = Math.ceil(PAGE_SIZE / 3);
  const minGridHeight = rows * 214 + (rows - 1) * 8;

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-base font-semibold text-gray-700 uppercase tracking-widest">Bài đăng</h2>
        <div className="flex-1 h-px bg-gray-200" />
        {onAdd && <AddButton onClick={onAdd} title="Tạo bài đăng" />}
      </div>

      {/* Stable-height wrapper prevents layout shift during slide */}
      <div style={{ minHeight: minGridHeight }}>
        <div
          key={safePage}
          className={
            slideDir === 'left'
              ? 'animate-slide-in-right'
              : slideDir === 'right'
                ? 'animate-slide-in-left'
                : ''
          }
        >
          <div className="grid grid-cols-3 gap-2">
            {visiblePosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            onClick={goPrev}
            disabled={safePage === 0}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <IoChevronBack size={14} />
          </button>
          <span className="text-sm text-gray-500">
            {safePage + 1} / {totalPages}
          </span>
          <button
            onClick={goNext}
            disabled={safePage === totalPages - 1}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <IoChevronForward size={14} />
          </button>
        </div>
      )}

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onDelete={() => handleDeleteRequest(selectedPost.id)}
        />
      )}

      <Alert
        show={alertShow}
        setShow={setAlertShow}
        message="Bạn có chắc muốn xoá bài đăng này không?"
        failed={false}
        action={() => deletePostMutation.mutate(pendingDeleteId)}
      />
    </>
  );
}
