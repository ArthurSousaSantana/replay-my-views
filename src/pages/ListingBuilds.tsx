import { useEffect, useState } from "react";
import PublicLayout from "@/components/layouts/PublicLayout";
import HeroBanner from "@/components/HeroBanner";
import BuildCard from "@/components/BuildCard";
import Pagination from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL, formatDiscount } from "@/lib/format";
import type { Tables } from "@/integrations/supabase/types";

const PAGE_SIZE = 9;

const ListingBuilds = () => {
  const [builds, setBuilds] = useState<Tables<"builds">[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const from = (page - 1) * PAGE_SIZE;
      const { data, count } = await supabase
        .from("builds")
        .select("*", { count: "exact" })
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .range(from, from + PAGE_SIZE - 1);
      setBuilds(data ?? []);
      setTotal(count ?? 0);
      setLoading(false);
    };
    fetch();
  }, [page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <PublicLayout>
      <HeroBanner size="md">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-xl text-white">
            Builds de PC Recomendadas
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto font-light drop-shadow-md">
            Escolha sua performance. De configurações básicas a máquinas extremas para 4K, tudo testado e aprovado.
          </p>
        </div>
      </HeroBanner>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground text-sm">
            Mostrando <span className="font-bold text-foreground">{builds.length}</span> de <span className="font-bold text-foreground">{total}</span> resultados
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1,2,3].map(i => <Skeleton key={i} className="h-96 rounded-xl" />)}
          </div>
        ) : builds.length === 0 ? (
          <p className="text-muted-foreground text-center py-16">Nenhuma build disponível no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {builds.map(b => (
              <BuildCard
                key={b.id}
                title={b.name}
                image={b.image_url || ""}
                badgeText={b.badge || b.category}
                badgeColor="bg-emerald-900/80 text-emerald-400 border border-emerald-500/30"
                oldPrice={b.total_price ? formatBRL(b.total_price) : ""}
                newPrice={b.final_price ? formatBRL(b.final_price) : formatBRL(b.total_price)}
                discount={formatDiscount(b.discount_percentage)}
                description={b.subtitle || b.description || ""}
                link={`/builds/${b.id}`}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />}
      </main>
    </PublicLayout>
  );
};

export default ListingBuilds;
