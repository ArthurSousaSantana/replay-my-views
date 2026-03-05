
-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS: users can read their own roles
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- RLS: only admins can manage roles
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update admin route RLS policies to use has_role
-- Offers: restrict write to admins
DROP POLICY IF EXISTS "Authenticated users can insert offers" ON public.offers;
DROP POLICY IF EXISTS "Authenticated users can update offers" ON public.offers;
DROP POLICY IF EXISTS "Authenticated users can delete offers" ON public.offers;

CREATE POLICY "Admins can insert offers" ON public.offers
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update offers" ON public.offers
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete offers" ON public.offers
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Builds: restrict write to admins
DROP POLICY IF EXISTS "Authenticated users can insert builds" ON public.builds;
DROP POLICY IF EXISTS "Authenticated users can update builds" ON public.builds;
DROP POLICY IF EXISTS "Authenticated users can delete builds" ON public.builds;

CREATE POLICY "Admins can insert builds" ON public.builds
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update builds" ON public.builds
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete builds" ON public.builds
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Build parts: restrict write to admins
DROP POLICY IF EXISTS "Authenticated users can manage build parts" ON public.build_parts;

CREATE POLICY "Admins can manage build parts" ON public.build_parts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Build performances: restrict write to admins
DROP POLICY IF EXISTS "Authenticated users can manage build performances" ON public.build_performances;

CREATE POLICY "Admins can manage build performances" ON public.build_performances
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Storage: restrict write to admins
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
