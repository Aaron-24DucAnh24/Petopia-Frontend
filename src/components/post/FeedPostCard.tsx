'use client';
import Image from 'next/image';
import { IGetPostResponse } from '@/src/interfaces/post';
import { getTimeAgo } from '@/src/helpers/getTimeAgo';
import { PostImageCarousel } from './PostImageCarousel';
import { PostLikeButton } from './PostLikeButton';

export function FeedPostCard({
  post,
  onClick,
  priority = false,
}: {
  post: IGetPostResponse;
  onClick: () => void;
  priority?: boolean;
}) {
  const hasLongContent = post.content.length > 200;

  return (
    <article test-id="feed-post-card" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <a href={`/user/${post.userId}`} className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden">
            <Image src={post.userImage} alt="avatar" fill sizes="40px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 text-sm truncate">{post.userName}</div>
            <div className="text-xs text-gray-400">{getTimeAgo(post.isCreatedAt)}</div>
          </div>
        </a>
      </div>

      {/* Image carousel island */}
      <PostImageCarousel images={post.images} onClick={onClick} priority={priority} />

      {/* Like / comment action bar island */}
      <PostLikeButton
        postId={post.id}
        initialLikeCount={post.like}
        initialIsLiked={post.isLiked}
        commentCount={post.commentCount}
        onCommentClick={onClick}
      />

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
