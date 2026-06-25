import { Http } from './http';
import type {
  ConversationCreate,
  ConversationListResponse,
  ConversationResponse,
  MessageCreate,
  MessageListResponse,
  MessageResponse,
} from '../interfaces/chat';

const chatHttp = new Http();
chatHttp.setUrlAPI(process.env.NEXT_PUBLIC_CHAT_API_ENDPOINT ?? 'http://127.0.0.1:8000');

export const listConversations = (cursor?: string) =>
  chatHttp.get<{ cursor?: string }, ConversationListResponse>(
    '/conversations',
    cursor ? { cursor } : undefined,
  );

export const createConversation = (data: ConversationCreate) =>
  chatHttp.post<ConversationCreate, ConversationResponse>('/conversations', data);

export const getConversation = (id: string) =>
  chatHttp.get<undefined, ConversationResponse>(`/conversations/${id}`);

export const listMessages = (conversationId: string, cursor?: string) =>
  chatHttp.get<{ cursor?: string }, MessageListResponse>(
    `/conversations/${conversationId}/messages`,
    cursor ? { cursor } : undefined,
  );

export const sendMessage = (conversationId: string, data: MessageCreate) =>
  chatHttp.post<MessageCreate, MessageResponse>(
    `/conversations/${conversationId}/messages`,
    data,
  );

export const markRead = (conversationId: string) =>
  chatHttp.post(`/conversations/${conversationId}/read`);

export const deleteMessage = (messageId: string) =>
  chatHttp.delete(`/messages/${messageId}`);

export const toggleReaction = (messageId: string, emoji: string) =>
  chatHttp.post<{ emoji: string }, MessageResponse>(`/messages/${messageId}/reactions`, { emoji });

