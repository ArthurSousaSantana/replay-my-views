CREATE OR REPLACE FUNCTION public.recalc_build_prices(_build_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _subtotal numeric;
  _disc numeric;
BEGIN
  SELECT COALESCE(SUM(COALESCE(o.current_price, 0) * COALESCE(bp.quantity, 1)), 0)
    INTO _subtotal
  FROM public.build_parts bp
  JOIN public.offers o ON o.id = bp.offer_id
  WHERE bp.build_id = _build_id;

  SELECT COALESCE(discount_percentage, 0) INTO _disc FROM public.builds WHERE id = _build_id;

  UPDATE public.builds
     SET total_price = _subtotal,
         final_price = _subtotal - (_subtotal * _disc / 100),
         updated_at = now()
   WHERE id = _build_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.recalc_build_prices(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.recalc_build_prices(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.trg_offer_price_recalc()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r record;
BEGIN
  IF NEW.current_price IS DISTINCT FROM OLD.current_price THEN
    FOR r IN SELECT DISTINCT build_id FROM public.build_parts WHERE offer_id = NEW.id LOOP
      PERFORM public.recalc_build_prices(r.build_id);
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS offers_price_recalc_builds ON public.offers;
CREATE TRIGGER offers_price_recalc_builds
AFTER UPDATE ON public.offers
FOR EACH ROW EXECUTE FUNCTION public.trg_offer_price_recalc();

CREATE OR REPLACE FUNCTION public.trg_build_parts_recalc()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recalc_build_prices(OLD.build_id);
    RETURN OLD;
  END IF;
  PERFORM public.recalc_build_prices(NEW.build_id);
  IF TG_OP = 'UPDATE' AND OLD.build_id IS DISTINCT FROM NEW.build_id THEN
    PERFORM public.recalc_build_prices(OLD.build_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS build_parts_recalc ON public.build_parts;
CREATE TRIGGER build_parts_recalc
AFTER INSERT OR UPDATE OR DELETE ON public.build_parts
FOR EACH ROW EXECUTE FUNCTION public.trg_build_parts_recalc();

DO $$
DECLARE b record;
BEGIN
  FOR b IN SELECT id FROM public.builds LOOP
    PERFORM public.recalc_build_prices(b.id);
  END LOOP;
END $$;