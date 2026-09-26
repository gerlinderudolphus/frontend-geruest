import type { PersistAdapter } from "./types";

export class IndexedDbAdapter<T> implements PersistAdapter<T> {
  readonly kind = "indexeddb" as const;

  constructor(
    readonly id: string,
    private readonly dbName: string,
    private readonly storeName = "records",
    private readonly key = "latest",
  ) {}

  private open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(this.storeName);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async save(value: T): Promise<void> {
    const db = await this.open();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readwrite");
      tx.objectStore(this.storeName).put(value, this.key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }

  async load(): Promise<T | null> {
    const db = await this.open();
    const value = await new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readonly");
      const request = tx.objectStore(this.storeName).get(this.key);
      request.onsuccess = () => resolve((request.result as T | undefined) ?? null);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return value;
  }
}
