import { useEffect, useState } from "react";
import PublicLayout from "@/components/layouts/PublicLayout";
import HeroBanner from "@/components/HeroBanner";
import OfferCard from "@/components/OfferCard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Pagination from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL, formatDiscount } from "@/lib/format";
import type { Tables } from "@/integrations/supabase/types";

const PAGE_SIZE = 12;

const ListingOffers = () => {
  const [offers, setOffers] = useState<Tables<"offers">[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const from = (page - 1) * PAGE_SIZE;
      const { data, count } = await supabase
        .from("offers")
        .select("*", { count: "exact" })
        .eq("is_active", true)
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .range(from, from + PAGE_SIZE - 1);
      setOffers(data ?? []);
      setTotal(count ?? 0);
      setLoading(false);
    };
    fetch();
  }, [page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <PublicLayout>
      <HeroBanner size="sm">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">Ofertas Tech em Destaque</h1>
      </HeroBanner>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Ofertas Tech em Destaque" }]} />
        </div>

        <main>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-muted-foreground">
              Mostrando <strong>{offers.length}</strong> de <strong>{total}</strong> resultados
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
            </div>
          ) : offers.length === 0 ? (
            <p className="text-muted-foreground text-center py-16">Nenhuma oferta disponível no momento.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offers.map(o => (
                <OfferCard
                  key={o.id}
                  title={o.name}
                  image={o.image_url || undefined}
                  category={o.category}
                  badge={o.promo_badge || formatDiscount(o.discount_percentage) || undefined}
                  oldPrice={o.old_price ? formatBRL(o.old_price) : ""}
                  newPrice={formatBRL(o.current_price)}
                  discount={formatDiscount(o.discount_percentage)}
                  link={`/ofertas/${o.id}`}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />}
        </main>
      </div>
    </PublicLayout>
  );
};

export default ListingOffers;
