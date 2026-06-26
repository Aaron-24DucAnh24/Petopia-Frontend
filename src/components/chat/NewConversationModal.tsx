'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AxiosResponse } from 'axios';
import { FaXmark } from 'react-icons/fa6';
import type { ConversationResponse } from '@/src/interfaces/chat';
import type { IUserInfoResponse } from '@/src/interfaces/user';
import { createConversation } from '@/src/services/chat.api';
import { searchUsersByEmail } from '@/src/services/user.api';
import { useMutation } from '@/src/utils/hooks';
import { STATIC_URLS } from '@/src/utils/constants';

interface SearchUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Props {
  currentUserId: string;
  onCreated: (conversation: ConversationResponse) => void;
  onClose: () => void;
}

export function NewConversationModal({ currentUserId, onCreated, onClose }: Props) {
  const [emailInput, setEmailInput] = useState('');
  const [results, setResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!emailInput.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await searchUsersByEmail(emailInput.trim());
        const data = ((res.data as unknown) as { data: IUserInfoResponse[] }).data;
        setResults(
          data
            .filter((u) => u.id !== currentUserId)
            .map((u) => {
              const attrs = u.attributes;
              const name =
                attrs?.organizationName ||
                `${attrs?.firstName || ''} ${attrs?.lastName || ''}`.trim() ||
                u.email;
              return { id: u.id, name, email: u.email, avatar: u.image || STATIC_URLS.NO_AVATAR };
            }),
        );
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [emailInput, currentUserId]);

  const createMutation = useMutation<ConversationResponse, string>(
    (targetUserId: string) =>
      createConversation({ type: 'direct', participants: [currentUserId, targetUserId] }),
    {
      onSuccess: (res: AxiosResponse<ConversationResponse>) => {
        onCreated(res.data);
        onClose();
      },
    },
  );

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
            <label className="text-xs text-gray-500 mb-1 block">Email người dùng</label>
            <input
              type="text"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Nhập email..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              autoFocus
            />
          </div>

          {searching && <p className="text-xs text-gray-400">Đang tìm kiếm...</p>}

          {!searching && results.length === 0 && emailInput.trim() && (
            <p className="text-xs text-gray-400">Không tìm thấy người dùng.</p>
          )}

          {results.length > 0 && (
            <div className="border border-gray-100 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
              {results.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => createMutation.mutate(user.id)}
                  disabled={createMutation.isLoading}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left disabled:opacity-40"
                >
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      sizes="32px"
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {createMutation.isError && (
            <p className="text-xs text-red-500">Có lỗi xảy ra khi tạo cuộc trò chuyện.</p>
          )}
        </div>
      </div>
    </div>
  );
}
