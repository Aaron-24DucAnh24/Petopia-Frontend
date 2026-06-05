'use client';
import { useState } from 'react';
import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa';
import { IApiResponse } from '@/src/interfaces/common';
import { likePost } from '@/src/services/post.api';
import { useMutation } from '@/src/utils/hooks';

interface PostLikeButtonProps {
  postId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  commentCount: number;
  onCommentClick: () => void;
}

export function PostLikeButton({
  postId,
  initialLikeCount,
  initialIsLiked,
  commentCount,
  onCommentClick,
}: PostLikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
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
    likeMutation.mutate(postId);
  };

  return (
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
        onClick={onCommentClick}
        className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <FaRegComment size={18} />
        <span className="text-sm font-medium">{commentCount}</span>
      </button>
    </div>
  );
}
