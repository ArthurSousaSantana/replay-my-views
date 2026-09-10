REVOKE EXECUTE ON FUNCTION public.recalc_build_prices(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.trg_offer_price_recalc() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.trg_build_parts_recalc() FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.recalc_build_prices(uuid) TO service_role;