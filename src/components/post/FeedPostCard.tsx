'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { IGetPostResponse } from '@/src/interfaces/post';
import { IApiResponse } from '@/src/interfaces/common';
import { likePost } from '@/src/services/post.api';
import { useMutation } from '@/src/utils/hooks';
import { getTimeAgo } from '@/src/helpers/getTimeAgo';

export function FeedPostCard({
  post,
  onClick,
}: {
  post: IGetPostResponse;
  onClick: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.like);
  const [isAnimating, setIsAnimating] = useState(false);

  const likeMutation = useMutation<IApiResponse<number>, string>(likePost, {
    onSuccess: (res) => setLikeCount(res.data.data),
  });

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    if (!isLiked) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
    }
    likeMutation.mutate(post.id);
  };

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < post.images.length - 1;
  const hasLongContent = post.content.length > 200;

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <a href={`/user/${post.userId}`} className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden">
            <Image src={post.userImage} alt="avatar" fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 text-sm truncate">{post.userName}</div>
            <div className="text-xs text-gray-400">{getTimeAgo(post.isCreatedAt)}</div>
          </div>
        </a>
      </div>

      {/* Image area */}
      <div
        className="relative w-full aspect-square bg-gray-100 cursor-pointer border-b border-gray-100"
        onClick={onClick}
      >
        {post.images.length > 0 ? (
          <>
            <Image src={post.images[currentIndex]} alt="post" fill className="object-cover" />

            {post.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => i - 1); }}
                  disabled={!canGoBack}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center disabled:opacity-20 hover:bg-white transition-colors shadow"
                >
                  <IoChevronBack size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => i + 1); }}
                  disabled={!canGoForward}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center disabled:opacity-20 hover:bg-white transition-colors shadow"
                >
                  <IoChevronForward size={18} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {post.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                      className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Không có ảnh
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 justify-center ${isAnimating ? 'heart-pop' : ''}`}
        >
          {isLiked
            ? <FaHeart size={20} className="text-red-500" />
            : <FaRegHeart size={20} className="text-gray-400" />
          }
          <span className="text-sm font-medium text-gray-500">{likeCount}</span>
        </button>
        <button
          onClick={onClick}
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaRegComment size={18} />
          <span className="text-sm font-medium">{post.commentCount}</span>
        </button>
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-4 py-3">
          <div
            className={`text-sm text-gray-700 prose prose-sm max-w-none ${hasLongContent ? 'line-clamp-4' : ''}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {hasLongContent && (
            <button
              onClick={onClick}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors mt-1"
            >
              Xem thêm
            </button>
          )}
        </div>
      )}
    </article>
  );
}
