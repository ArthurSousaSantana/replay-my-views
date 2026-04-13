import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL, formatDiscount } from "@/lib/format";
import type { Tables } from "@/integrations/supabase/types";

interface SearchSuggestionsProps {
  query: string;
  onSelect: () => void;
  className?: string;
}

const DEBOUNCE_MS = 300;
const MAX_RESULTS = 5;

const SearchSuggestions = ({ query, onSelect, className = "" }: SearchSuggestionsProps) => {
  type SuggestionOffer = Pick<Tables<"offers">, "id" | "name" | "image_url" | "current_price" | "old_price" | "discount_percentage" | "category">;
  type SuggestionBuild = Pick<Tables<"builds">, "id" | "name" | "image_url" | "final_price" | "total_price" | "discount_percentage" | "category">;
  const [offers, setOffers] = useState<SuggestionOffer[]>([]);
  const [builds, setBuilds] = useState<SuggestionBuild[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setOffers([]);
      setBuilds([]);
      return;
    }

    setLoading(true);
    timerRef.current = setTimeout(async () => {
      const pattern = `%${trimmed}%`;
      const [offersRes, buildsRes] = await Promise.all([
        supabase
          .from("offers")
          .select("id, name, image_url, current_price, old_price, discount_percentage, category")
          .eq("is_active", true)
          .eq("is_visible", true)
          .ilike("name", pattern)
          .order("created_at", { ascending: false })
          .limit(MAX_RESULTS),
        supabase
          .from("builds")
          .select("id, name, image_url, final_price, total_price, discount_percentage, category")
          .eq("status", "published")
          .ilike("name", pattern)
          .order("created_at", { ascending: false })
          .limit(3),
      ]);
      setOffers(offersRes.data ?? []);
      setBuilds(buildsRes.data ?? []);
      setLoading(false);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const trimmed = query.trim();
  if (trimmed.length < 2) return null;

  const hasResults = offers.length > 0 || builds.length > 0;

  return (
    <div className={`absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-xl z-50 max-h-[70vh] overflow-y-auto ${className}`}>
      {loading && !hasResults && (
        <div className="px-4 py-3 text-sm text-muted-foreground">Buscando...</div>
      )}

      {!loading && !hasResults && (
        <div className="px-4 py-3 text-sm text-muted-foreground">Nenhum resultado encontrado.</div>
      )}

      {offers.length > 0 && (
        <div>
          <div className="px-4 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ofertas</div>
          {offers.map((o) => (
            <Link
              key={o.id}
              to={`/ofertas/${o.id}`}
              onClick={onSelect}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition-colors"
            >
              {o.image_url && (
                <img src={o.image_url} alt="" className="w-10 h-10 rounded-lg object-contain bg-muted flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{o.name}</p>
                <div className="flex items-center gap-2 text-xs">
                  {o.old_price && (
                    <span className="text-muted-foreground line-through">{formatBRL(o.old_price)}</span>
                  )}
                  {o.current_price && (
                    <span className="text-primary font-semibold">{formatBRL(o.current_price)}</span>
                  )}
                  {o.discount_percentage && (
                    <span className="text-emerald-400 font-medium">{formatDiscount(o.discount_percentage)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {builds.length > 0 && (
        <div>
          <div className="px-4 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Builds</div>
          {builds.map((b) => (
            <Link
              key={b.id}
              to={`/builds/${b.id}`}
              onClick={onSelect}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition-colors"
            >
              {b.image_url && (
                <img src={b.image_url} alt="" className="w-10 h-10 rounded-lg object-contain bg-muted flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{b.name}</p>
                <div className="flex items-center gap-2 text-xs">
                  {b.total_price && (
                    <span className="text-muted-foreground line-through">{formatBRL(b.total_price)}</span>
                  )}
                  {b.final_price && (
                    <span className="text-primary font-semibold">{formatBRL(b.final_price)}</span>
                  )}
                  {b.discount_percentage && (
                    <span className="text-emerald-400 font-medium">{formatDiscount(b.discount_percentage)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
