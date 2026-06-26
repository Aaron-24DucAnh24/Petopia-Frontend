'use client';
import Image from 'next/image';
import { FaPlus } from 'react-icons/fa6';
import type { ConversationResponse } from '@/src/interfaces/chat';
import { STATIC_URLS } from '@/src/utils/constants';
import { getTimeAgo } from '@/src/helpers/getTimeAgo';

interface Props {
  conversations: ConversationResponse[];
  selectedId: string | null;
  currentUserId: string;
  userNames: Record<string, string>;
  userAvatars: Record<string, string>;
  unreadConversationIds: Set<string>;
  loading: boolean;
  hasMore: boolean;
  onSelect: (conversation: ConversationResponse) => void;
  onLoadMore: () => void;
  onNewChat: () => void;
}

function getConversationDisplayName(
  conversation: ConversationResponse,
  currentUserId: string,
  userNames: Record<string, string>,
): string {
  if (conversation.name) return conversation.name;

  if (conversation.type === 'direct') {
    const otherId = conversation.participants.find((p) => p !== currentUserId) ?? '';
    return userNames[otherId] ?? `Người dùng ${otherId.slice(-6)}`;
  }

  return `Nhóm (${conversation.participants.length})`;
}

function getConversationAvatarUrl(
  conversation: ConversationResponse,
  currentUserId: string,
  userAvatars: Record<string, string>,
): string {
  if (conversation.avatar_url) return conversation.avatar_url;

  if (conversation.type === 'direct') {
    const otherId = conversation.participants.find((p) => p !== currentUserId) ?? '';
    return userAvatars[otherId] ?? STATIC_URLS.NO_AVATAR;
  }

  return STATIC_URLS.NO_AVATAR;
}

function getLastMessageText(conversation: ConversationResponse): string {
  const lastMessage = conversation.last_message_preview;
  if (!lastMessage) return 'Chưa có tin nhắn';

  if (lastMessage.message_type === 'image') return '📷 Hình ảnh';

  if (lastMessage.message_type === 'file') return '📎 Tệp đính kèm';

  return lastMessage.content ?? '';
}

export function ConversationList({
  conversations,
  selectedId,
  currentUserId,
  userNames,
  userAvatars,
  unreadConversationIds,
  loading,
  hasMore,
  onSelect,
  onLoadMore,
  onNewChat,
}: Props) {
  return (
    <div className="flex flex-col h-full border-r border-gray-100">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-semibold text-gray-800">Tin nhắn</span>
        <button
          onClick={onNewChat}
          className="w-8 h-8 rounded-full bg-yellow-300 hover:bg-yellow-400 flex items-center justify-center transition-colors"
          title="Tạo cuộc trò chuyện mới"
        >
          <FaPlus size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && conversations.length === 0 ? (
          <div className="flex flex-col gap-2 p-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            <p className="text-sm text-gray-400">Chưa có cuộc trò chuyện nào</p>
            <button onClick={onNewChat} className="mt-3 text-sm text-yellow-600 hover:underline">
              Bắt đầu trò chuyện
            </button>
          </div>
        ) : (
          <>
            {conversations.map((conversation) => {
              const name = getConversationDisplayName(conversation, currentUserId, userNames);
              const avatar = getConversationAvatarUrl(conversation, currentUserId, userAvatars);
              const lastMessageText = getLastMessageText(conversation);
              const time = conversation.last_message_preview?.sent_at
                ? getTimeAgo(conversation.last_message_preview.sent_at)
                : '';
              const isSelected = conversation.id === selectedId;
              const isUnread = unreadConversationIds.has(conversation.id);

              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelect(conversation)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left
                    ${isSelected ? 'bg-yellow-50 border-r-2 border-yellow-400' : isUnread ? 'bg-blue-50' : ''}
                  `}
                >
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={avatar}
                      alt={name}
                      fill
                      sizes="40px"
                      className="rounded-full object-cover"
                    />
                    {isUnread && !isSelected && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm truncate ${isUnread && !isSelected ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>
                        {name}
                      </span>
                      {time && (
                        <span className={`text-[10px] flex-shrink-0 ml-1 ${isUnread && !isSelected ? 'text-blue-500 font-medium' : 'text-gray-400'}`}>
                          {time}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${isUnread && !isSelected ? 'text-gray-600 font-medium' : 'text-gray-400'}`}>
                      {lastMessageText}
                    </p>
                  </div>
                </button>
              );
            })}

            {hasMore && (
              <button
                onClick={onLoadMore}
                disabled={loading}
                className="w-full py-2 text-xs text-yellow-600 hover:text-yellow-700 disabled:text-gray-400"
              >
                {loading ? 'Đang tải...' : 'Tải thêm'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
