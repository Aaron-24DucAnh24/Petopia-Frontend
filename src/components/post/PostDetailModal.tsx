'use client';
import Image from 'next/image';
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';
import { FaRegComment } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { IoSend, IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { ICommentPost, ICommentResponse, IGetPostResponse } from '@/src/interfaces/post';
import { getTimeAgo } from '@/src/helpers/getTimeAgo';
import { useMutation } from '@/src/utils/hooks';
import { IApiResponse } from '@/src/interfaces/common';
import { getCommentsPost, likePost, sendCommentPost } from '@/src/services/post.api';
import CommentCard from './CommentCard';
import CommentSkeleton from '../common/CommentSkeleton';
import { useStores } from '@/src/stores';

export function PostDetailModal({
  post,
  onClose,
  onDelete,
}: {
  post: IGetPostResponse;
  onClose: () => void;
  onDelete: () => void;
}) {
  const { userStore } = useStores();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.like);
  const [isAnimating, setIsAnimating] = useState(false);
  const [comments, setComments] = useState<ICommentResponse[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [commentCount, setCommentCount] = useState(post.commentCount);

  const likeMutation = useMutation<IApiResponse<number>, string>(likePost, {
    onSuccess: (res) => setLikeCount(res.data.data),
  });

  const getCommentMutation = useMutation<IApiResponse<ICommentResponse[]>, string>(
    getCommentsPost,
    { onSuccess: (res) => setComments(res.data.data) }
  );

  const sendCommentMutation = useMutation<IApiResponse<ICommentResponse>, ICommentPost>(
    sendCommentPost,
    {
      onSuccess: (res) => {
        setComments((prev) => [res.data.data, ...prev]);
        setCommentCount((n) => n + 1);
      },
    }
  );

  useEffect(() => {
    getCommentMutation.mutate(post.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id]);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    if (!isLiked) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 800);
    }
    likeMutation.mutate(post.id);
  };

  const handleSendComment = (e: FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    sendCommentMutation.mutate({ postId: post.id, content: commentContent });
    setCommentContent('');
  };

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < post.images.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col md:flex-row overflow-hidden">

        {/* Left: image viewer */}
        <div className="md:w-[55%] bg-black flex items-center justify-center relative min-h-[260px] md:min-h-0">
          {post.images.length > 0 ? (
            <>
              <div className="relative w-full h-64 md:h-full">
                <Image
                  src={post.images[currentIndex]}
                  alt="post image"
                  fill
                  className="object-contain"
                />
              </div>

              {post.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentIndex((i) => i - 1)}
                    disabled={!canGoBack}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center disabled:opacity-20 hover:bg-white transition-colors shadow"
                  >
                    <IoChevronBack size={18} />
                  </button>
                  <button
                    onClick={() => setCurrentIndex((i) => i + 1)}
                    disabled={!canGoForward}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center disabled:opacity-20 hover:bg-white transition-colors shadow"
                  >
                    <IoChevronForward size={18} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {post.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-white' : 'bg-white/40'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-gray-400 text-sm">Không có ảnh</div>
          )}
        </div>

        {/* Right: user info + content + comments */}
        <div className="md:w-[45%] flex flex-col overflow-hidden border-l border-gray-200">

          {/* Header: user info + close */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <a href={`/user/${post.userId}`} className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={post.userImage}
                  alt="avatar"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{post.userName}</div>
                <div className="text-xs text-gray-400">{getTimeAgo(post.isCreatedAt)}</div>
              </div>
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
            >
              <IoClose size={18} />
            </button>
          </div>

          {/* Post content */}
          {post.content && (
            <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
              <div
                className="text-sm text-gray-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          )}

          {/* Action bar */}
          <div className="px-2 py-1.5 border-b border-gray-200 flex items-center gap-4 flex-shrink-0 bg-gray-50">
            <button
              onClick={handleLike}
              className={`heart ${isAnimating ? 'is_animating' : ''} ${isLiked ? 'liked' : ''}`}
            />
            <span className="font-medium -ml-4 text-gray-500 text-sm">{likeCount}</span>
            <div className="flex items-center gap-1.5 text-gray-500">
              <FaRegComment size={16} />
              <span className="text-sm">{commentCount}</span>
            </div>
            {userStore.userContext?.id === post.userId && (
              <button onClick={onDelete} className="ml-auto">
                <MdDelete
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  size={20}
                />
              </button>
            )}
          </div>

          {/* Comments section header */}
          <div className="px-4 pt-3 pb-1 flex-shrink-0">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Bình luận
            </span>
          </div>

          {/* Scrollable comments */}
          <div className="flex-1 overflow-y-auto px-4 pb-3 space-y-2.5 min-h-0">
            {getCommentMutation.isLoading ? (
              <CommentSkeleton />
            ) : comments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Chưa có bình luận nào</p>
            ) : (
              comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  creatorId={post.userId}
                  getCommentsMutation={() => getCommentMutation.mutate(post.id)}
                  setCommentCount={setCommentCount as Dispatch<SetStateAction<number>>}
                  onUpdate={(updated) =>
                    setComments((prev) =>
                      prev.map((c) => (c.id === updated.id ? updated : c))
                    )
                  }
                />
              ))
            )}
          </div>

          {/* Comment input */}
          <div className="border-t border-gray-200 px-4 py-3 flex gap-2 items-center flex-shrink-0">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image
                src={userStore.userContext?.image || '/img/no-avatar.png'}
                alt="avatar"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <form onSubmit={handleSendComment} className="flex-1 relative">
              <input
                type="text"
                className="w-full py-2 px-4 text-sm border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:border-blue-300"
                placeholder="Thêm bình luận..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <button
                type="submit"
                disabled={!commentContent.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 disabled:opacity-30"
              >
                <IoSend size={14} className="text-blue-500" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
