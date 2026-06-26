CREATE TABLE public.taxonomy_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (kind, value)
);

GRANT SELECT ON public.taxonomy_options TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.taxonomy_options TO authenticated;
GRANT ALL ON public.taxonomy_options TO service_role;

ALTER TABLE public.taxonomy_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view taxonomy options"
  ON public.taxonomy_options FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert taxonomy options"
  ON public.taxonomy_options FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update taxonomy options"
  ON public.taxonomy_options FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete taxonomy options"
  ON public.taxonomy_options FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_taxonomy_options_kind ON public.taxonomy_options(kind);