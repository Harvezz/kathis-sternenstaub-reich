// Simple IndexedDB store for user-uploaded media (images/videos).
const DB_NAME = "kathi-media";
const STORE = "items";

export interface MediaItem {
  id: string;
  type: "image" | "video";
  mime: string;
  name: string;
  caption?: string;
  createdAt: number;
  blob: Blob;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function listMedia(): Promise<MediaItem[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve((req.result as MediaItem[]).sort((a, b) => b.createdAt - a.createdAt));
    req.onerror = () => reject(req.error);
  });
}

export async function addMedia(file: File, caption?: string): Promise<MediaItem> {
  const db = await openDB();
  const item: MediaItem = {
    id: crypto.randomUUID(),
    type: file.type.startsWith("video") ? "video" : "image",
    mime: file.type || "application/octet-stream",
    name: file.name,
    caption,
    createdAt: Date.now(),
    blob: file,
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add(item);
    tx.oncomplete = () => resolve(item);
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteMedia(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
