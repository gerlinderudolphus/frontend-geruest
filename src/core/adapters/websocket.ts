import type { StreamAdapter, Unsubscribe } from "./types";

type SocketParser<T> = (raw: string) => T;

export class WebSocketAdapter<T> implements StreamAdapter<T> {
  readonly kind = "websocket" as const;
  private socket: WebSocket | null = null;
  private listeners = new Set<(value: T) => void>();
  private reconnectTimer: number | null = null;

  constructor(
    readonly id: string,
    private readonly url: string,
    private readonly parse: SocketParser<T>,
  ) {}

  connect(): void {
    if (!this.url || this.socket) return;

    const socket = new WebSocket(this.url);
    this.socket = socket;

    socket.addEventListener("message", (event) => {
      if (typeof event.data !== "string") return;
      try {
        const value = this.parse(event.data);
        this.listeners.forEach((listener) => listener(value));
      } catch (error) {
        console.error(`[${this.id}] GeoJSON-Nachricht ungültig`, error);
      }
    });

    socket.addEventListener("close", () => {
      this.socket = null;
      this.reconnectTimer = window.setTimeout(() => this.connect(), 2000);
    });
  }

  disconnect(): void {
    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.socket?.close();
    this.socket = null;
  }

  subscribe(listener: (value: T) => void): Unsubscribe {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
