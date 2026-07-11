import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Upload, Trash2, X, ImagePlus, Users } from "lucide-react";
import {
  listGallery,
  uploadGallery,
  removeGallery,
  type GalleryEntry,
} from "@/lib/gallery-store";
import { supabase } from "@/integrations/supabase/client";

export function MyGalleryApp() {
  const [items, setItems] = useState<GalleryEntry[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const list = await listGallery();
      setItems(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const channel = supabase
      .channel("gallery-items")
      .on("postgres_changes", { event: "*", schema: "public", table: "gallery_items" }, () => refresh())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
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
        await uploadGallery(f);
      }
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  };

  const removeItem = async (it: GalleryEntry) => {
    if (!confirm("Wirklich löschen?")) return;
    try {
      await removeGallery(it.id, it.storage_path);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const empty = items.length === 0 && !loading;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-hand text-4xl text-primary">Unsere Galerie</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> Gemeinsam. Alle können Bilder und Videos hochladen und löschen.
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
            disabled={busy}
          />
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {loading ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">Lädt Erinnerungen…</p>
      ) : empty ? (
        <label className="mt-8 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border p-14 text-center transition hover:bg-accent/20">
          <ImagePlus className="h-10 w-10 text-primary" />
          <span className="font-hand text-2xl text-primary">Der erste Moment beginnt bei dir</span>
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
                onClick={() => removeItem(it)}
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
