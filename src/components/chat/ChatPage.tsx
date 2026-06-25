'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AxiosResponse } from 'axios';
import type { ICurrentUserCoreResponse, IUserInfoResponse } from '@/src/interfaces/user';
import type { ConversationListResponse, ConversationResponse, MessageResponse, WsEvent } from '@/src/interfaces/chat';
import { listConversations } from '@/src/services/chat.api';
import { chatWs } from '@/src/services/chat.ws';
import { getOtherUserInfo } from '@/src/services/user.api';
import { QUERY_KEYS, STATIC_URLS } from '@/src/utils/constants';
import { useQuery } from '@/src/utils/hooks';
import { QueryProvider } from '../providers/QueryProvider';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { NewConversationModal } from './NewConversationModal';

interface Props {
  userContext: ICurrentUserCoreResponse;
  initialConversationId?: string;
}

export const ChatPage = QueryProvider(({ userContext, initialConversationId }: Props) => {
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<ConversationResponse | null>(null);
  const [showMobileList, setShowMobileList] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);

  // Derived from conversations[].unread_count — single source of truth seeded from MongoDB
  const unreadConversationIds = useMemo(
    () => new Set(conversations.filter((c) => (c.unread_count ?? 0) > 0).map((c) => c.id)),
    [conversations],
  );

  // User info cache: userId → { name, image }
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [userAvatars, setUserAvatars] = useState<Record<string, string>>({});
  const pendingLookups = useRef<Set<string>>(new Set());
  const selectedConversationIdRef = useRef<string | null>(null);

  // ------------------------------------------------------------------
  // Conversations — initial load
  // ------------------------------------------------------------------
  const { isLoading: loadingConversations, refetch: refetchConversations } =
    useQuery<ConversationListResponse>(
      [QUERY_KEYS.GET_CONVERSATIONS],
      () => listConversations(),
      {
        onSuccess: (res: AxiosResponse<ConversationListResponse>) => {
          // Items already carry unread_count from MongoDB aggregation
          setConversations(res.data.items);
          setNextCursor(res.data.next_cursor);

          res.data.items.forEach((conversation) => {
            if (conversation.type === 'direct') {
              const otherId = conversation.participants.find((p) => p !== userContext.id);
              if (otherId) lookupUser(otherId);
            }
          });
          if (initialConversationId) {
            const found = res.data.items.find((c) => c.id === initialConversationId);
            if (found) {
              selectedConversationIdRef.current = found.id;
              setSelectedConversation(found);
              chatWs.send({ type: 'conversation_opened', payload: { conversation_id: found.id } });
            }
          }
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      },
    );

  const handleLoadMoreConversations = async () => {
    if (!nextCursor) return;
    try {
      const res = await listConversations(nextCursor);
      setConversations((prev) => [...prev, ...res.data.items]);
      setNextCursor(res.data.next_cursor);
    } catch { /* non-critical */ }
  };

  // ------------------------------------------------------------------
  // User info cache (name + avatar + email for modal suggestions)
  // ------------------------------------------------------------------
  const lookupUser = useCallback(
    async (userId: string) => {
      if (
        userId === userContext.id ||
        userNames[userId] !== undefined ||
        pendingLookups.current.has(userId)
      )
        return;
      pendingLookups.current.add(userId);
      try {
        const res = await getOtherUserInfo({ userId });
        const data = (res.data as { data: IUserInfoResponse }).data;
        const attrs = data.attributes;
        const name = attrs?.organizationName ||
          `${attrs?.firstName || ''} ${attrs?.lastName || ''}`.trim() ||
          `Người dùng ${userId.slice(-6)}`;
        setUserNames((prev) => ({ ...prev, [userId]: name }));
        setUserAvatars((prev) => ({ ...prev, [userId]: data.image || STATIC_URLS.NO_AVATAR }));
      } catch {
        setUserNames((prev) => ({ ...prev, [userId]: `Người dùng ${userId.slice(-6)}` }));
      } finally {
        pendingLookups.current.delete(userId);
      }
    },
    [userContext.id, userNames],
  );

  // ------------------------------------------------------------------
  // WebSocket — lifecycle is managed by NavChatBlock; ChatPage only subscribes
  // ------------------------------------------------------------------
  const handleWsNewMessage = useCallback(
    (event: WsEvent) => {
      const msg = event.payload as unknown as MessageResponse;
      const isUnread =
        msg.sender_id !== userContext.id &&
        selectedConversationIdRef.current !== msg.conversation_id;

      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === msg.conversation_id);
        if (idx === -1) {
          refetchConversations();
          return prev;
        }
        const updated: ConversationResponse = {
          ...prev[idx],
          updated_at: msg.sent_at,
          last_message_preview: {
            content: msg.content,
            sender_id: msg.sender_id,
            sent_at: msg.sent_at,
            message_type: msg.message_type,
          },
          unread_count: isUnread ? (prev[idx].unread_count ?? 0) + 1 : prev[idx].unread_count,
        };
        return [updated, ...prev.filter((_, i) => i !== idx)];
      });
    },
    [refetchConversations, userContext.id],
  );

  useEffect(() => {
    chatWs.on('new_message', handleWsNewMessage);
    return () => chatWs.off('new_message', handleWsNewMessage);
  }, [handleWsNewMessage]);

  // ------------------------------------------------------------------
  // Conversation selection helpers
  // ------------------------------------------------------------------
  const handleSelectConversation = (conversation: ConversationResponse) => {
    if (selectedConversationIdRef.current && selectedConversationIdRef.current !== conversation.id) {
      chatWs.send({ type: 'conversation_closed', payload: { conversation_id: selectedConversationIdRef.current } });
    }
    selectedConversationIdRef.current = conversation.id;
    chatWs.send({ type: 'conversation_opened', payload: { conversation_id: conversation.id } });
    setSelectedConversation(conversation);
    setShowMobileList(false);

    // Clear unread in conversations array (drives the highlight and badge via useMemo)
    setConversations((prev) =>
      prev.map((c) => (c.id === conversation.id ? { ...c, unread_count: 0 } : c)),
    );

    // Let NavChatBlock remove this conversation from its badge
    window.dispatchEvent(
      new CustomEvent('conversation-opened', { detail: { conversationId: conversation.id } }),
    );

    if (conversation.type === 'direct') {
      const otherId = conversation.participants.find((p) => p !== userContext.id);
      if (otherId) lookupUser(otherId);
    }
  };

  const handleNewConversationCreated = (conversation: ConversationResponse) => {
    setConversations((prev) => {
      if (prev.some((c) => c.id === conversation.id)) return prev;
      return [conversation, ...prev];
    });
    handleSelectConversation(conversation);
  };

  const getDisplayName = (conversation: ConversationResponse): string => {
    if (conversation.name) return conversation.name;
    if (conversation.type === 'direct') {
      const otherId = conversation.participants.find((p) => p !== userContext.id) ?? '';
      return userNames[otherId] ?? `Người dùng ${otherId.slice(-6)}`;
    }
    return `Nhóm (${conversation.participants.length})`;
  };

  const getAvatarUrl = (conversation: ConversationResponse): string => {
    if (conversation.avatar_url) return conversation.avatar_url;
    if (conversation.type === 'direct') {
      const otherId = conversation.participants.find((p) => p !== userContext.id) ?? '';
      return userAvatars[otherId] ?? STATIC_URLS.NO_AVATAR;
    }
    return STATIC_URLS.NO_AVATAR;
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div className="flex h-[calc(100vh-5rem)] bg-white">
      <div className={`${showMobileList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-72 lg:w-80 flex-shrink-0`}>
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversation?.id ?? null}
          currentUserId={userContext.id}
          userNames={userNames}
          userAvatars={userAvatars}
          unreadConversationIds={unreadConversationIds}
          loading={loadingConversations}
          hasMore={!!nextCursor}
          onSelect={handleSelectConversation}
          onLoadMore={handleLoadMoreConversations}
          onNewChat={() => setShowNewModal(true)}
        />
      </div>

      <div className={`${showMobileList ? 'hidden' : 'flex'} md:flex flex-col flex-1 min-w-0`}>
        {selectedConversation ? (
          <ChatWindow
            key={selectedConversation.id}
            conversation={selectedConversation}
            currentUserId={userContext.id}
            displayName={getDisplayName(selectedConversation)}
            avatarUrl={getAvatarUrl(selectedConversation)}
            onBack={() => {
              if (selectedConversationIdRef.current) {
                chatWs.send({ type: 'conversation_closed', payload: { conversation_id: selectedConversationIdRef.current } });
                selectedConversationIdRef.current = null;
              }
              setShowMobileList(true);
            }}
            onConversationListUpdate={handleWsNewMessage}
          />
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-gray-600 font-medium">Chọn cuộc trò chuyện</p>
            <p className="text-sm text-gray-400 mt-1">
              Hoặc{' '}
              <button onClick={() => setShowNewModal(true)} className="text-yellow-600 hover:underline">
                bắt đầu cuộc trò chuyện mới
              </button>
            </p>
          </div>
        )}
      </div>

      {showNewModal && (
        <NewConversationModal
          currentUserId={userContext.id}
          onCreated={handleNewConversationCreated}
          onClose={() => setShowNewModal(false)}
        />
      )}
    </div>
  );
});
