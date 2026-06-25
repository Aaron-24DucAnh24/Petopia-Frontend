'use client';
import { useRef, useState, KeyboardEvent } from 'react';
import { FaPaperPlane, FaXmark } from 'react-icons/fa6';
import type { MessageResponse, ReplyPreview } from '@/src/interfaces/chat';

interface Props {
  replyTo: MessageResponse | null;
  onCancelReply: () => void;
  onSend: (content: string) => Promise<void>;
  onTyping: () => void;
}

export function MessageInput({ replyTo, onCancelReply, onSend, onTyping }: Props) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    try {
      await onSend(trimmed);
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onTyping();
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-3">
      {replyTo && (
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5 mb-2 border-l-2 border-yellow-400">
          <span className="text-xs text-gray-500 truncate">
            Trả lời: {replyTo.content ?? '[media]'}
          </span>
          <button onClick={onCancelReply} className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0">
            <FaXmark size={12} />
          </button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn... (Enter để gửi)"
          rows={1}
          className="flex-1 resize-none rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 max-h-[120px] overflow-y-auto"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-yellow-300 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        >
          <FaPaperPlane size={14} />
        </button>
      </div>
    </div>
  );
}
