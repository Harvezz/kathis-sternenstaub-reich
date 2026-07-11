
CREATE TABLE public.gallery_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_path text NOT NULL,
  type text NOT NULL CHECK (type IN ('image','video')),
  mime text NOT NULL,
  name text NOT NULL,
  caption text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO anon, authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery_items readable by all" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "gallery_items insertable by all" ON public.gallery_items FOR INSERT WITH CHECK (true);
CREATE POLICY "gallery_items deletable by all" ON public.gallery_items FOR DELETE USING (true);

-- Storage policies for the public 'gallery' bucket
CREATE POLICY "gallery bucket read all" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "gallery bucket insert all" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "gallery bucket delete all" ON storage.objects FOR DELETE USING (bucket_id = 'gallery');
