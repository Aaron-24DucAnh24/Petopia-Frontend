export type MessageType = 'text' | 'image' | 'file';
export type ConversationType = 'direct' | 'group';
export type WsEventType =
  | 'new_message'
  | 'message_deleted'
  | 'reaction_updated'
  | 'user_typing'
  | 'messages_read'
  | 'conversation_opened'
  | 'conversation_closed';

export interface ReplyPreview {
  message_id: string;
  sender_id: string;
  content_preview: string;
}

export interface MessageResponse {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  message_type: MessageType;
  media_url: string | null;
  sent_at: string;
  read_by: string[];
  reply_to: ReplyPreview | null;
  is_forwarded: boolean;
  forwarded_from_message_id: string | null;
  reactions: Record<string, string[]>;
  is_deleted: boolean;
}

export interface LastMessagePreview {
  content: string | null;
  sender_id: string;
  sent_at: string;
  message_type: MessageType;
}

export interface ConversationResponse {
  id: string;
  type: ConversationType;
  participants: string[];
  name: string | null;
  avatar_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message_preview: LastMessagePreview | null;
  unread_count?: number;
}

export interface ConversationListResponse {
  items: ConversationResponse[];
  next_cursor: string | null;
}

export interface MessageListResponse {
  items: MessageResponse[];
  next_cursor: string | null;
}

export interface MessageCreate {
  content?: string;
  message_type?: MessageType;
  media_url?: string;
  reply_to_id?: string;
}

export interface ConversationCreate {
  type: ConversationType;
  participants: string[];
  name?: string;
  avatar_url?: string;
}

export interface WsEvent {
  type: WsEventType;
  payload: Record<string, unknown>;
}
