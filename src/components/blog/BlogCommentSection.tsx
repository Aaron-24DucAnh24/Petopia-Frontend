'use client';
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import { IoSend } from 'react-icons/io5';
import { ICommentResponse } from '@/src/interfaces/post';
import { ICommentBlog } from '@/src/interfaces/blog';
import { IApiResponse } from '@/src/interfaces/common';
import { useMutation } from '@/src/utils/hooks';
import { QueryProvider } from '../providers/QueryProvider';
import { useStores } from '@/src/stores';
import { getCommentsBlog, sendCommentBlog } from '@/src/services/blog.api';
import CommentCard from '../post/CommentCard';

interface Props {
  blogId: string;
  blogUserId: string;
  initialComments: ICommentResponse[];
}

const BlogCommentSection = QueryProvider(({ blogId, blogUserId, initialComments }: Props) => {
  const { userStore } = useStores();
  const [mounted, setMounted] = useState(false);
  const [comments, setComments] = useState<ICommentResponse[]>(initialComments);
  const [commentContent, setCommentContent] = useState('');
  const [commentCount, setCommentCount] = useState(initialComments.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getCommentsMutation = useMutation<IApiResponse<ICommentResponse[]>, string>(
    getCommentsBlog,
    {
      onSuccess: (res) => {
        setComments(res.data.data);
        setCommentCount(res.data.data.length);
      },
    }
  );

  const sendCommentMutation = useMutation<IApiResponse<ICommentResponse>, ICommentBlog>(
    sendCommentBlog,
    {
      onSuccess: (res) => {
        setComments((prev) => [res.data.data, ...prev]);
        setCommentCount((n) => n + 1);
      },
    }
  );

  const handleSendComment = (e: FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    sendCommentMutation.mutate({ blogId, content: commentContent });
    setCommentContent('');
  };

  return (
    <div className="mt-12 border-t border-gray-100 pt-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-5">
        Bình luận ({commentCount})
      </h2>

      {mounted && userStore.userContext && (
        <div className="flex gap-3 items-center mb-6">
          <div className="relative w-9 h-9 flex-shrink-0">
            <Image
              src={userStore.userContext.image || '/img/no-avatar.png'}
              alt="avatar"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <form onSubmit={handleSendComment} className="flex-1 relative">
            <input
              type="text"
              className="w-full py-2.5 px-4 text-sm border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:border-blue-300"
              placeholder="Thêm bình luận..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <button
              type="submit"
              disabled={!commentContent.trim() || sendCommentMutation.isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 disabled:opacity-30"
            >
              <IoSend size={14} className="text-blue-500" />
            </button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Chưa có bình luận nào</p>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              creatorId={blogUserId}
              getCommentsMutation={() => getCommentsMutation.mutate(blogId)}
              setCommentCount={setCommentCount as Dispatch<SetStateAction<number>>}
              onUpdate={(updated) =>
                setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
              }
            />
          ))
        )}
      </div>
    </div>
  );
});

export default BlogCommentSection;
