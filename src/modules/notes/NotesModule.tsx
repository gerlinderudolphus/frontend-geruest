import { useEffect, useState } from "react";
import { IndexedDbAdapter } from "@/core/adapters/indexed-db";

const notesDb = new IndexedDbAdapter<string>("module-notes", "ops-notes");

export function NotesModule() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("Lokal in IndexedDB");

  useEffect(() => {
    notesDb.load().then((value) => {
      if (value) setText(value);
    });
  }, []);

  return (
    <div className="stack">
      <textarea
        className="touch-input"
        rows={5}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Notizen bleiben auf diesem Gerät."
      />
      <button
        type="button"
        className="touch-btn"
        onClick={async () => {
          await notesDb.save(text);
          setStatus("Gespeichert");
        }}
      >
        Speichern
      </button>
      <p className="hint">{status}</p>
    </div>
  );
}
