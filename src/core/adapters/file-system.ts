import type { PersistAdapter } from "./types";

type FilePickerWindow = Window & {
  showOpenFilePicker?: (options?: unknown) => Promise<FileSystemFileHandle[]>;
  showSaveFilePicker?: (options?: unknown) => Promise<FileSystemFileHandle>;
};

export class FileSystemAdapter<T> implements PersistAdapter<T> {
  readonly kind = "filesystem" as const;
  private handle: FileSystemFileHandle | null = null;

  constructor(readonly id: string) {}

  async save(value: T): Promise<void> {
    const picker = window as FilePickerWindow;
    if (!picker.showSaveFilePicker) {
      this.downloadFallback(value);
      return;
    }

    this.handle = await picker.showSaveFilePicker({
      suggestedName: "export.json",
      types: [
        {
          description: "JSON",
          accept: { "application/json": [".json"] },
        },
      ],
    });
    const writable = await this.handle.createWritable();
    await writable.write(JSON.stringify(value, null, 2));
    await writable.close();
  }

  async load(): Promise<T | null> {
    const picker = window as FilePickerWindow;
    if (!picker.showOpenFilePicker) {
      return this.inputFallback();
    }

    const [handle] = await picker.showOpenFilePicker({
      types: [
        {
          description: "JSON",
          accept: { "application/json": [".json"] },
        },
      ],
    });
    this.handle = handle;
    const file = await handle.getFile();
    return JSON.parse(await file.text()) as T;
  }

  private downloadFallback(value: T): void {
    const blob = new Blob([JSON.stringify(value, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "export.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  private inputFallback(): Promise<T | null> {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) {
          resolve(null);
          return;
        }
        resolve(JSON.parse(await file.text()) as T);
      };
      input.click();
    });
  }
}
