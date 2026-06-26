'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AxiosResponse } from 'axios';
import Image from 'next/image';
import { FaArrowLeft } from 'react-icons/fa6';
import type { ConversationResponse, MessageListResponse, MessageResponse, WsEvent } from '@/src/interfaces/chat';
import { listMessages, markRead, sendMessage } from '@/src/services/chat.api';
import { chatWs } from '@/src/services/chat.ws';
import { QUERY_KEYS, STATIC_URLS } from '@/src/utils/constants';
import { useMutation, useQuery } from '@/src/utils/hooks';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';

interface Props {
  conversation: ConversationResponse;
  currentUserId: string;
  displayName: string;
  avatarUrl: string;
  onBack: () => void;
  onConversationListUpdate: (event: WsEvent) => void;
}

export function ChatWindow({
  conversation,
  currentUserId,
  displayName,
  avatarUrl,
  onBack,
  onConversationListUpdate,
}: Props) {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [replyTo, setReplyTo] = useState<MessageResponse | null>(null);
  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasScrolledInitialRef = useRef(false);

  // Messages — initial load
  const { isLoading, data: queryData } = useQuery<MessageListResponse>(
    [QUERY_KEYS.GET_MESSAGES, conversation.id],
    () => listMessages(conversation.id),
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  );

  // onSuccess is not called for cache hits in react-query v3, so we use an effect on queryData to handle both fresh fetches and cache-served responses.
  useEffect(() => {
    if (!queryData) return;

    hasScrolledInitialRef.current = false;
    setMessages(queryData.data.items.slice().reverse());
    setNextCursor(queryData.data.next_cursor);
    markRead(conversation.id).catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryData]);

  const scrollToBottom = (smooth = false) => {
    const container = containerRef.current;
    if (!container) return;

    if (smooth) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    } else {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    if (messages.length === 0) return;

    if (!hasScrolledInitialRef.current) {
      hasScrolledInitialRef.current = true;
      scrollToBottom();
      return;
    }

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender_id === currentUserId) {
      scrollToBottom(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, currentUserId]);

  // Send message
  const sendMutation = useMutation<MessageResponse, { content: string; replyToId?: string }>(
    ({ content, replyToId }: { content: string; replyToId?: string }) =>
      sendMessage(conversation.id, {
        content,
        message_type: 'text',
        reply_to_id: replyToId,
      }),
    {
      onSuccess: (res: AxiosResponse<MessageResponse>) => {
        const message = res.data;
        setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
        setReplyTo(null);
        onConversationListUpdate({ type: 'new_message', payload: message as unknown as Record<string, unknown> });
      },
    },
  );

  const handleSend = async (content: string) => {
    await sendMutation.mutateAsync({ content, replyToId: replyTo?.id });
  };

  // Load older messages
  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;

    setLoadingMore(true);
    try {
      const res = await listMessages(conversation.id, nextCursor);
      const scrollHeight = containerRef.current?.scrollHeight ?? 0;
      setMessages((existing) => [...res.data.items.slice().reverse(), ...existing]);
      setNextCursor(res.data.next_cursor);
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight - scrollHeight;
        }
      });
    } catch { /* non-critical */ } finally {
      setLoadingMore(false);
    }
  };

  // WebSocket event handlers
  const handleNewMessage = useCallback(
    (event: WsEvent) => {
      const msg = event.payload as unknown as MessageResponse;
      if (msg.conversation_id !== conversation.id) return;

      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
      if (msg.sender_id !== currentUserId) {
        markRead(conversation.id).catch(() => { });
      }
    },
    [conversation.id, currentUserId],
  );

  const handleMessageDeleted = useCallback(
    (event: WsEvent) => {
      const { message_id, conversation_id } = event.payload as { message_id: string; conversation_id: string };
      if (conversation_id !== conversation.id) return;

      setMessages((prev) =>
        prev.map((m) => (m.id === message_id ? { ...m, is_deleted: true, content: null } : m)),
      );
    },
    [conversation.id],
  );

  const handleReactionUpdated = useCallback(
    (event: WsEvent) => {
      const message = event.payload as unknown as MessageResponse;
      if (message.conversation_id !== conversation.id) return;

      setMessages((prev) => prev.map((m) => (m.id === message.id ? message : m)));
    },
    [conversation.id],
  );

  const handleTyping = useCallback(
    (event: WsEvent) => {
      const { conversation_id, user_id } = event.payload as { conversation_id: string; user_id: string };
      if (conversation_id !== conversation.id || user_id === currentUserId) return;

      setTypingUserIds((prev) => (prev.includes(user_id) ? prev : [...prev, user_id]));
      setTimeout(() => setTypingUserIds((prev) => prev.filter((id) => id !== user_id)), 3000);
    },
    [conversation.id, currentUserId],
  );

  useEffect(() => {
    chatWs.on('new_message', handleNewMessage);
    chatWs.on('message_deleted', handleMessageDeleted);
    chatWs.on('reaction_updated', handleReactionUpdated);
    chatWs.on('user_typing', handleTyping);

    return () => {
      chatWs.off('new_message', handleNewMessage);
      chatWs.off('message_deleted', handleMessageDeleted);
      chatWs.off('reaction_updated', handleReactionUpdated);
      chatWs.off('user_typing', handleTyping);
    };
  }, [handleNewMessage, handleMessageDeleted, handleReactionUpdated, handleTyping]);

  const handleTypingSignal = () => {
    if (typingTimerRef.current) return;

    chatWs.send({ type: 'user_typing', payload: { conversation_id: conversation.id } });
    typingTimerRef.current = setTimeout(() => { typingTimerRef.current = null; }, 2000);
  };

  // Render
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
        <button
          onClick={onBack}
          className="md:hidden p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <FaArrowLeft size={14} />
        </button>
        <div className="relative w-9 h-9 flex-shrink-0">
          <Image
            src={avatarUrl || STATIC_URLS.NO_AVATAR}
            alt={displayName}
            fill
            sizes="36px"
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{displayName}</p>
          {typingUserIds.length > 0 && (
            <p className="text-xs text-gray-400">đang nhập...</p>
          )}
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50">
        {nextCursor && (
          <div className="text-center mb-3">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="text-xs text-yellow-600 hover:underline disabled:text-gray-400"
            >
              {loadingMore ? 'Đang tải...' : 'Tải tin nhắn cũ hơn'}
            </button>
          </div>
        )}

        {isLoading && messages.length === 0 && (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400">
            Đang tải...
          </div>
        )}

        {!isLoading && !nextCursor && (
          <div className="flex flex-col items-center py-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-xs text-gray-400">Đây là phần bắt đầu của cuộc trò chuyện</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender_id === currentUserId}
            onDeleted={(id) =>
              setMessages((prev) =>
                prev.map((m) => (m.id === id ? { ...m, is_deleted: true, content: null } : m)),
              )
            }
            onUpdated={(updated) =>
              setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
            }
            onReply={setReplyTo}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        onSend={handleSend}
        onTyping={handleTypingSignal}
      />
    </div>
  );
}
