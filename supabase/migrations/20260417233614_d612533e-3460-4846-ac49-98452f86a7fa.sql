ALTER TABLE public.banners
  ADD COLUMN IF NOT EXISTS destination_type TEXT NOT NULL DEFAULT 'link',
  ADD COLUMN IF NOT EXISTS destination_category TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS destination_min_discount INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS destination_id UUID;