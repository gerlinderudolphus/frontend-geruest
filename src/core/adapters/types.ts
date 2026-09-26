export type Unsubscribe = () => void;

export interface StreamAdapter<T> {
  readonly id: string;
  readonly kind: "websocket" | "rest" | "indexeddb" | "filesystem";
  connect(): Promise<void> | void;
  disconnect(): void;
  subscribe(listener: (value: T) => void): Unsubscribe;
}

export interface QueryAdapter<TQuery, TResult> {
  readonly id: string;
  readonly kind: "rest" | "indexeddb" | "filesystem";
  query(input: TQuery): Promise<TResult>;
}

export interface PersistAdapter<T> {
  readonly id: string;
  readonly kind: "indexeddb" | "filesystem";
  save(value: T): Promise<void>;
  load(): Promise<T | null>;
}
