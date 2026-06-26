'use client';
import { useState } from 'react';
import { AxiosResponse } from 'axios';
import dynamic from 'next/dynamic';
import type { EmojiClickData } from 'emoji-picker-react';
import { FaReply, FaTrash, FaFaceSmile } from 'react-icons/fa6';
import type { MessageResponse } from '@/src/interfaces/chat';
import { deleteMessage, toggleReaction } from '@/src/services/chat.api';
import { useMutation } from '@/src/utils/hooks';
import Image from 'next/image';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface Props {
  message: MessageResponse;
  isOwn: boolean;
  onDeleted: (messageId: string) => void;
  onUpdated: (message: MessageResponse) => void;
  onReply: (message: MessageResponse) => void;
}

export function MessageBubble({ message, isOwn, onDeleted, onUpdated, onReply }: Props) {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const deleteMutation = useMutation(
    () => deleteMessage(message.id),
    { onSuccess: () => onDeleted(message.id) },
  );

  const reactionMutation = useMutation<MessageResponse, string>(
    (emoji: string) => toggleReaction(message.id, emoji),
    {
      onSuccess: (res: AxiosResponse<MessageResponse>) => {
        onUpdated(res.data);
        setShowEmojiPicker(false);
        setShowActions(false);
      },
    },
  );

  const handleReactionEmojiClick = (emojiData: EmojiClickData) => {
    reactionMutation.mutate(emojiData.emoji);
  };

  const reactionEntries = Object.entries(message.reactions).filter(([, users]) => users.length > 0);

  if (message.is_deleted) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
        <span className="text-xs text-gray-400 italic px-3 py-1.5 bg-gray-100 rounded-2xl">
          Tin nhắn đã bị xóa
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1 group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={(e) => {
        const related = e.relatedTarget as Node | null;
        const picker = e.currentTarget.querySelector('.EmojiPickerReact');
        if (picker && related && picker.contains(related)) return;

        setShowActions(false);
        setShowEmojiPicker(false);
      }}
    >
      <div className={`flex flex-col max-w-[70%] min-w-0 ${isOwn ? 'items-end' : 'items-start'}`}>
        {message.reply_to && (
          <div className="text-xs text-gray-500 bg-gray-100 rounded-lg px-2 py-1 mb-0.5 border-l-2 border-yellow-400 max-w-full truncate">
            {message.reply_to.content_preview}
          </div>
        )}

        {/* Bubble with floating action bar */}
        <div className="relative">
          {/* Action bar — absolutely positioned to avoid affecting bubble layout */}
          <div
            className={`absolute top-0 bottom-0 flex items-center gap-0.5 transition-opacity z-10
              ${showActions ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${isOwn ? 'right-full pr-1' : 'left-full pl-1'}`}
          >
            <button
              onClick={() => onReply(message)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Trả lời"
            >
              <FaReply size={12} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                title="Thêm cảm xúc"
              >
                <FaFaceSmile size={12} />
              </button>
              {showEmojiPicker && (
                <div
                  className={`absolute bottom-8 ${isOwn ? 'right-0' : 'left-0'} z-50 shadow-lg rounded-xl overflow-hidden`}
                  onMouseEnter={() => setShowActions(true)}
                >
                  <EmojiPicker
                    onEmojiClick={handleReactionEmojiClick}
                    height={340}
                    width={300}
                  />
                </div>
              )}
            </div>
            {isOwn && (
              <button
                onClick={() => deleteMutation.mutate(undefined)}
                disabled={deleteMutation.isLoading}
                className="p-1 text-gray-400 hover:text-red-500 rounded disabled:opacity-40"
                title="Xóa"
              >
                <FaTrash size={12} />
              </button>
            )}
          </div>

          {/* Bubble */}
          <div
            className={`px-3 py-2 rounded-2xl text-sm ${isOwn
              ? 'bg-yellow-300 text-gray-900 rounded-br-sm'
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
              }`}
          >
            {message.message_type === 'image' && message.media_url ? (
              <Image src={message.media_url} alt="ảnh" className="max-w-xs rounded-lg" />
            ) : (
              <span className="whitespace-pre-wrap break-all">{message.content}</span>
            )}
          </div>
        </div>

        {/* Reactions */}
        {reactionEntries.length > 0 && (
          <div className="flex gap-1 mt-0.5 flex-wrap">
            {reactionEntries.map(([emoji, users]) => (
              <button
                key={emoji}
                onClick={() => reactionMutation.mutate(emoji)}
                className="flex items-center gap-0.5 text-xs bg-white border border-gray-200 rounded-full px-1.5 py-0.5 hover:bg-gray-50"
              >
                <span>{emoji}</span>
                <span className="text-gray-500">{users.length}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
