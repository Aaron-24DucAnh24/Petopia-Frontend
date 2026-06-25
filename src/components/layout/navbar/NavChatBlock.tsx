'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { FaMessage } from 'react-icons/fa6';
import { chatWs } from '@/src/services/chat.ws';
import { listConversations } from '@/src/services/chat.api';
import type { MessageResponse, WsEvent } from '@/src/interfaces/chat';

interface Props {
  currentUserId: string;
}

export const NavChatBlock = ({ currentUserId }: Props) => {
  const [unreadConversations, setUnreadConversations] = useState<string[]>([]);

  // Connect WS and seed initial unread count from the API (survives page reloads)
  useEffect(() => {
    chatWs.connect();
    listConversations()
      .then((res) => {
        const ids = res.data.items
          .filter((c) => (c.unread_count ?? 0) > 0)
          .map((c) => c.id);
        setUnreadConversations(ids);
      })
      .catch(() => {});
    return () => chatWs.disconnect();
  }, []);

  const handleNewMessage = useCallback(
    (event: WsEvent) => {
      const msg = event.payload as unknown as MessageResponse;
      if (msg.sender_id !== currentUserId) {
        setUnreadConversations((prev) =>
          prev.includes(msg.conversation_id) ? prev : [...prev, msg.conversation_id],
        );
      }
    },
    [currentUserId],
  );

  useEffect(() => {
    chatWs.on('new_message', handleNewMessage);
    return () => chatWs.off('new_message', handleNewMessage);
  }, [handleNewMessage]);

  const unreadCount = unreadConversations.length;

  return (
    <Link
      href="/chat"
      onClick={() => setUnreadConversations([])}
      className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      title="Tin nhắn"
    >
      <FaMessage className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
};
