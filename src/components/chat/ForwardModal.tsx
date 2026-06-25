'use client';
import { useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import type { ConversationResponse, MessageResponse } from '@/src/interfaces/chat';
import { forwardMessage } from '@/src/services/chat.api';
import { useMutation } from '@/src/utils/hooks';

interface Props {
  message: MessageResponse;
  conversations: ConversationResponse[];
  currentConversationId: string;
  onClose: () => void;
}

export function ForwardModal({ message, conversations, currentConversationId, onClose }: Props) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const forwardMutation = useMutation(
    () => forwardMessage(message.id, selectedConversationId!),
    {
      onSuccess: () => {
        setDone(true);
        setTimeout(onClose, 1000);
      },
    },
  );

  const targetConversations = conversations.filter((c) => c.id !== currentConversationId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-80 max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="font-semibold text-sm">Chuyển tiếp tin nhắn</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaXmark size={16} />
          </button>
        </div>

        {done ? (
          <div className="flex items-center justify-center py-10 text-sm text-green-600">
            Đã chuyển tiếp!
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {targetConversations.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  Không có cuộc trò chuyện nào khác
                </p>
              ) : (
                targetConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                      selectedConversationId === conversation.id ? 'bg-yellow-50 font-medium' : ''
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        selectedConversationId === conversation.id
                          ? 'border-yellow-400 bg-yellow-400'
                          : 'border-gray-300'
                      }`}
                    />
                    {conversation.name ?? `Cuộc trò chuyện ${conversation.id.slice(-6)}`}
                  </button>
                ))
              )}
            </div>

            <div className="px-4 py-3 border-t border-gray-100">
              <button
                onClick={() => forwardMutation.mutate(undefined)}
                disabled={!selectedConversationId || forwardMutation.isLoading}
                className="w-full py-2 rounded-xl bg-yellow-300 hover:bg-yellow-400 disabled:opacity-40 text-sm font-medium transition-colors"
              >
                {forwardMutation.isLoading ? 'Đang gửi...' : 'Chuyển tiếp'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
