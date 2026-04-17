ALTER TABLE public.banners
  ADD COLUMN IF NOT EXISTS destination_listing_category TEXT DEFAULT '';