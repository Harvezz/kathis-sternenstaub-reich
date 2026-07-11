import { supabase } from "@/integrations/supabase/client";

export interface GalleryRow {
  id: string;
  storage_path: string;
  type: "image" | "video";
  mime: string;
  name: string;
  caption: string | null;
  created_at: string;
}

export interface GalleryEntry extends GalleryRow {
  url: string;
}

const BUCKET = "gallery";

async function signedUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function listGallery(): Promise<GalleryEntry[]> {
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as GalleryRow[];
  return Promise.all(
    rows.map(async (r) => ({ ...r, url: await signedUrl(r.storage_path) })),
  );
}

export async function uploadGallery(file: File, caption?: string): Promise<void> {
  const isVideo = file.type.startsWith("video");
  const ext = file.name.includes(".") ? file.name.split(".").pop() : isVideo ? "mp4" : "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (upErr) throw upErr;
  const { error: insErr } = await supabase.from("gallery_items").insert({
    storage_path: path,
    type: isVideo ? "video" : "image",
    mime: file.type || "application/octet-stream",
    name: file.name,
    caption: caption ?? null,
  });
  if (insErr) throw insErr;
}

export async function removeGallery(id: string, storage_path: string): Promise<void> {
  await supabase.storage.from(BUCKET).remove([storage_path]);
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) throw error;
}
