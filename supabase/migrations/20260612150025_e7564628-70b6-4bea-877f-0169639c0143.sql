
CREATE INDEX IF NOT EXISTS idx_offers_featured_home
  ON public.offers (is_featured, listing_category, created_at DESC)
  WHERE is_active = true AND is_visible = true;

CREATE INDEX IF NOT EXISTS idx_offers_created_at
  ON public.offers (created_at DESC)
  WHERE is_active = true AND is_visible = true;

CREATE INDEX IF NOT EXISTS idx_builds_featured_home
  ON public.builds (is_featured, created_at DESC)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_builds_created_at
  ON public.builds (created_at DESC)
  WHERE status = 'active';
