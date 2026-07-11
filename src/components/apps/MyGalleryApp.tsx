import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Upload, Trash2, X, ImagePlus } from "lucide-react";
import { addMedia, deleteMedia, listMedia, type MediaItem } from "@/lib/media-store";

interface Entry extends MediaItem {
  url: string;
}

export function MyGalleryApp() {
  const [items, setItems] = useState<Entry[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    const list = await listMedia();
    setItems(list.map((m) => ({ ...m, url: URL.createObjectURL(m.blob) })));
  };

  useEffect(() => {
    refresh().catch((e) => setError(String(e)));
    return () => {
      // Revoke on unmount
      items.forEach((i) => URL.revokeObjectURL(i.url));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      for (const f of Array.from(files)) {
        if (!f.type.startsWith("image") && !f.type.startsWith("video")) continue;
        await addMedia(f);
      }
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  };

  const removeItem = async (id: string) => {
    await deleteMedia(id);
    await refresh();
  };

  const total = items.length;
  const empty = useMemo(() => total === 0, [total]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-hand text-4xl text-primary">Meine Galerie</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Lade eigene Bilder & Videos hoch. Alles wird lokal in diesem Browser gespeichert – privat und nur für dich.
          </p>
        </div>
        <label className="glass-strong inline-flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition hover:scale-[1.03]">
          <Upload className="h-4 w-4" />
          {busy ? "Lädt…" : "Hochladen"}
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {empty ? (
        <label className="mt-8 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border p-14 text-center transition hover:bg-accent/20">
          <ImagePlus className="h-10 w-10 text-primary" />
          <span className="font-hand text-2xl text-primary">Ziehe Dateien hier hin oder klicke</span>
          <span className="text-xs text-muted-foreground">Bilder (JPG, PNG, WebP) und Videos (MP4, WebM)</span>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative overflow-hidden rounded-2xl bg-[oklch(0.14_0.02_300)] shadow-lg"
            >
              <button onClick={() => setActive(i)} className="block w-full">
                {it.type === "image" ? (
                  <img src={it.url} alt={it.name} className="aspect-square w-full object-cover" />
                ) : (
                  <video src={it.url} className="aspect-square w-full object-cover" muted playsInline />
                )}
              </button>
              <button
                onClick={() => removeItem(it.id)}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[oklch(0.15_0.02_300/70%)] text-foreground/80 opacity-0 backdrop-blur-md transition group-hover:opacity-100 hover:text-destructive"
                aria-label="Löschen"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {it.type === "video" && (
                <span className="absolute bottom-2 left-2 rounded-full bg-[oklch(0.1_0.02_300/70%)] px-2 py-0.5 text-[10px] font-medium text-foreground/80">
                  VIDEO
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {active !== null && items[active] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0.05_0.02_300/85%)] p-6 backdrop-blur-xl"
            onClick={() => setActive(null)}
          >
            <button className="absolute top-6 right-6 text-foreground/70 hover:text-foreground" aria-label="Schließen">
              <X className="h-7 w-7" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-h-[85vh] max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {items[active].type === "image" ? (
                <img
                  src={items[active].url}
                  alt={items[active].name}
                  className="max-h-[85vh] rounded-2xl object-contain shadow-2xl"
                />
              ) : (
                <video
                  src={items[active].url}
                  controls
                  autoPlay
                  className="max-h-[85vh] rounded-2xl shadow-2xl"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
