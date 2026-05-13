'use client';
import { ICommentResponse, IUpdateComment } from '@/src/interfaces/post';
import Image from 'next/image';
import { getTimeAgo } from '@/src/helpers/getTimeAgo';
import { IoIosMore } from 'react-icons/io';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { useStores } from '@/src/stores';
import { useMutation } from '@/src/utils/hooks';
import { IApiResponse } from '@/src/interfaces/common';
import { deleteComment, updateComment } from '@/src/services/post.api';

export default function CommentCard({
  comment,
  creatorId,
  getCommentsMutation,
  setCommentCount,
  onUpdate,
}: {
  comment: ICommentResponse;
  creatorId: string;
  getCommentsMutation: () => void;
  setCommentCount: Dispatch<SetStateAction<number>>;
  onUpdate?: (updated: ICommentResponse) => void;
}) {
  const { userStore } = useStores();
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const canEdit = userStore.userContext?.id === comment.userId;
  const canDelete =
    userStore.userContext?.id === comment.userId ||
    userStore.userContext?.id === creatorId;

  const deleteCommentMutation = useMutation<IApiResponse<boolean>, string>(deleteComment, {
    onSuccess: () => {
      getCommentsMutation();
      setCommentCount((prev) => prev - 1);
    },
  });

  const updateCommentMutation = useMutation<IApiResponse<ICommentResponse>, IUpdateComment>(
    updateComment,
    {
      onSuccess: (res) => {
        if (onUpdate) {
          onUpdate(res.data.data);
        } else {
          getCommentsMutation();
        }
        setIsEditing(false);
      },
    }
  );

  const handleDelete = () => {
    setShowDropdown(false);
    deleteCommentMutation.mutate(comment.id);
  };

  const handleStartEdit = () => {
    setShowDropdown(false);
    setEditContent(comment.content);
    setIsEditing(true);
  };

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    if (editContent === comment.content) {
      setIsEditing(false);
      return;
    }
    updateCommentMutation.mutate({ id: comment.id, content: editContent });
  };

  return (
    <div
      className="flex flex-row items-start gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowDropdown(false);
      }}
    >
      {/* Avatar */}
      <div className="relative w-9 h-9 rounded-full flex-shrink-0 mt-0.5">
        <Image
          src={comment.userImage}
          alt="user avatar"
          fill
          className="rounded-full object-cover"
        />
      </div>

      {/* Bubble */}
      <div className="flex-1 relative bg-gray-100 rounded-2xl px-3 py-2">
        {/* More button — absolutely positioned, zero layout impact */}
        {isHovered && (canEdit || canDelete) && !isEditing && (
          <div className="absolute top-1/2 -translate-y-1/2 right-2 z-10">
            <button
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm border border-gray-200 transition-colors"
              onClick={() => setShowDropdown((v) => !v)}
            >
              <IoIosMore size={16} className="text-gray-600" />
            </button>

            {showDropdown && (
              <div className="absolute top-8 right-0 bg-white shadow-lg rounded-xl py-1 z-50 min-w-[148px] border border-gray-100">
                {canEdit && (
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                    onClick={handleStartEdit}
                  >
                    Sửa bình luận
                  </button>
                )}
                {canDelete && (
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors"
                    onClick={handleDelete}
                  >
                    Xoá bình luận
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Name + time row */}
        <div className="flex items-baseline gap-1.5 flex-wrap min-w-0">
          <span className="font-semibold text-sm leading-tight">{comment.userName}</span>
          <span className="text-gray-400 text-xs">{getTimeAgo(comment.isCreatedAt)}</span>
        </div>

        {/* Content or inline edit */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="mt-1.5">
            <input
              autoFocus
              type="text"
              className="w-full text-sm bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-300"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex gap-3 mt-1.5 justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Huỷ
              </button>
              <button
                type="submit"
                disabled={!editContent.trim() || updateCommentMutation.isLoading}
                className="text-xs text-blue-500 font-semibold hover:text-blue-600 disabled:opacity-40"
              >
                Lưu
              </button>
            </div>
          </form>
        ) : (
          <div className="text-sm mt-0.5 text-gray-800 break-words">{comment.content}</div>
        )}
      </div>
    </div>
  );
}
