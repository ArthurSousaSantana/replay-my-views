-- Add quantity column to build_parts
ALTER TABLE public.build_parts ADD COLUMN quantity integer NOT NULL DEFAULT 1;

-- Remove the unique constraint on (build_id, offer_id) since quantity now handles multiple units
ALTER TABLE public.build_parts DROP CONSTRAINT IF EXISTS build_parts_build_id_offer_id_key;