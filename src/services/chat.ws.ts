import { getCookie } from 'cookies-next';
import { COOKIES_NAME } from '../utils/constants';
import type { WsEvent, WsEventType } from '../interfaces/chat';

type WsEventHandler = (event: WsEvent) => void;

function getChatWsBase(): string {
  const endpoint = process.env.NEXT_PUBLIC_CHAT_API_ENDPOINT ?? 'http://127.0.0.1:8000';
  return endpoint.replace(/^http/, 'ws');
}

class ChatWebSocket {
  private ws: WebSocket | null = null;
  private handlers: Map<WsEventType, Set<WsEventHandler>> = new Map();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = false;

  connect(): void {
    const token = getCookie(COOKIES_NAME.ACCESS_TOKEN_SERVER) as string | undefined;
    if (!token) return;
    this.shouldReconnect = true;
    this._open(token);
  }

  private _open(token: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(`${getChatWsBase()}/ws?token=${token}`);

    this.ws.onmessage = (e: MessageEvent) => {
      try {
        const event: WsEvent = JSON.parse(e.data as string);
        this.handlers.get(event.type)?.forEach((h) => h(event));
      } catch {
        // ignore malformed frames
      }
    };

    this.ws.onclose = () => {
      if (!this.shouldReconnect) return;
      this.reconnectTimer = setTimeout(() => {
        const t = getCookie(COOKIES_NAME.ACCESS_TOKEN_SERVER) as string | undefined;
        if (t) this._open(t);
      }, 3000);
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }

  send(event: { type: WsEventType; payload: Record<string, unknown> }): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event));
    }
  }

  on(type: WsEventType, handler: WsEventHandler): void {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type)!.add(handler);
  }

  off(type: WsEventType, handler: WsEventHandler): void {
    this.handlers.get(type)?.delete(handler);
  }

  isOpen(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const chatWs = new ChatWebSocket();
