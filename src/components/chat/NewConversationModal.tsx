'use client';
import { useState } from 'react';
import { AxiosResponse } from 'axios';
import { FaXmark } from 'react-icons/fa6';
import type { ConversationResponse } from '@/src/interfaces/chat';
import { createConversation } from '@/src/services/chat.api';
import { useMutation } from '@/src/utils/hooks';

interface Props {
  currentUserId: string;
  onCreated: (conversation: ConversationResponse) => void;
  onClose: () => void;
}

export function NewConversationModal({ currentUserId, onCreated, onClose }: Props) {
  const [userId, setUserId] = useState('');

  const createMutation = useMutation<ConversationResponse, string>(
    (targetUserId: string) =>
      createConversation({
        type: 'direct',
        participants: [currentUserId, targetUserId],
      }),
    {
      onSuccess: (res: AxiosResponse<ConversationResponse>) => {
        onCreated(res.data);
        onClose();
      },
    },
  );

  const handleCreate = () => {
    const target = userId.trim();
    if (!target || target === currentUserId) return;
    createMutation.mutate(target);
  };

  const isSelf = userId.trim() === currentUserId;
  const errorMessage = createMutation.isError
    ? 'Không tìm thấy người dùng hoặc đã có lỗi xảy ra.'
    : isSelf
      ? 'Không thể tự nhắn tin cho chính mình.'
      : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-80">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="font-semibold text-sm">Tin nhắn mới</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaXmark size={16} />
          </button>
        </div>

        <div className="px-4 py-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">ID người dùng</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="Nhập ID người dùng..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              autoFocus
            />
          </div>

          {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}

          <button
            onClick={handleCreate}
            disabled={!userId.trim() || isSelf || createMutation.isLoading}
            className="w-full py-2 rounded-xl bg-yellow-300 hover:bg-yellow-400 disabled:opacity-40 text-sm font-medium transition-colors"
          >
            {createMutation.isLoading ? 'Đang tạo...' : 'Bắt đầu trò chuyện'}
          </button>
        </div>
      </div>
    </div>
  );
}
