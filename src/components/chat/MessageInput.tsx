'use client';
import { useRef, useState, useEffect, KeyboardEvent } from 'react';
import dynamic from 'next/dynamic';
import type { EmojiClickData } from 'emoji-picker-react';
import { FaPaperPlane, FaXmark, FaFaceSmile } from 'react-icons/fa6';
import type { MessageResponse } from '@/src/interfaces/chat';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface Props {
  replyTo: MessageResponse | null;
  onCancelReply: () => void;
  onSend: (content: string) => Promise<void>;
  onTyping: () => void;
}

export function MessageInput({ replyTo, onCancelReply, onSend, onTyping }: Props) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiContainerRef.current && !emojiContainerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    const textarea = textareaRef.current;
    if (!textarea) {
      setText((prev) => prev + emoji);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = text.slice(0, start) + emoji + text.slice(end);
    setText(newText);
    requestAnimationFrame(() => {
      textarea.selectionStart = start + emoji.length;
      textarea.selectionEnd = start + emoji.length;
      textarea.focus();
    });
  };

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
        <div ref={emojiContainerRef} className="relative flex-shrink-0">
          <button
            onClick={() => setShowEmojiPicker((v) => !v)}
            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-yellow-500 transition-colors"
            title="Chọn emoji"
          >
            <FaFaceSmile size={18} />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-11 left-0 z-50 shadow-lg rounded-xl overflow-hidden">
              <EmojiPicker onEmojiClick={handleEmojiClick} height={380} width={320} />
            </div>
          )}
        </div>
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
