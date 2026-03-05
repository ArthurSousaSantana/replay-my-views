
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =============================================
-- OFFERS table (based on AdminNewOffer form)
-- =============================================
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  short_description TEXT DEFAULT '',
  long_description TEXT DEFAULT '',
  specs JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_reusable_in_builds BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  old_price NUMERIC(10,2),
  current_price NUMERIC(10,2),
  discount_percentage NUMERIC(5,2),
  promo_badge TEXT DEFAULT '',
  is_limited_offer BOOLEAN NOT NULL DEFAULT false,
  is_best_price BOOLEAN NOT NULL DEFAULT true,
  external_url TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  gallery JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Offers are publicly readable" ON public.offers
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert offers" ON public.offers
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update offers" ON public.offers
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete offers" ON public.offers
  FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- BUILDS table (based on AdminNewBuild form)
-- =============================================
CREATE TABLE public.builds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  badge TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  total_price NUMERIC(10,2),
  discount_percentage NUMERIC(5,2),
  final_price NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.builds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Builds are publicly readable" ON public.builds
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert builds" ON public.builds
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update builds" ON public.builds
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete builds" ON public.builds
  FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_builds_updated_at
  BEFORE UPDATE ON public.builds
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- BUILD_PERFORMANCES table (nested performance rows)
-- =============================================
CREATE TABLE public.build_performances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  build_id UUID NOT NULL REFERENCES public.builds(id) ON DELETE CASCADE,
  game TEXT NOT NULL DEFAULT '',
  quality TEXT NOT NULL DEFAULT '',
  fps INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.build_performances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Build performances are publicly readable" ON public.build_performances
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage build performances" ON public.build_performances
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX idx_build_performances_build_id ON public.build_performances(build_id);

-- =============================================
-- BUILD_PARTS table (junction: builds <-> offers)
-- =============================================
CREATE TABLE public.build_parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  build_id UUID NOT NULL REFERENCES public.builds(id) ON DELETE CASCADE,
  offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(build_id, offer_id)
);

ALTER TABLE public.build_parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Build parts are publicly readable" ON public.build_parts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage build parts" ON public.build_parts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX idx_build_parts_build_id ON public.build_parts(build_id);
CREATE INDEX idx_build_parts_offer_id ON public.build_parts(offer_id);

-- =============================================
-- STORAGE bucket for product images
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

CREATE POLICY "Product images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'product-images');
