import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PublicLayout from "@/components/layouts/PublicLayout";
import HeroCarousel from "@/components/HeroCarousel";
import OfferCard from "@/components/OfferCard";
import BuildCard from "@/components/BuildCard";
import SectionHeader from "@/components/shared/SectionHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL, formatDiscount } from "@/lib/format";
import type { Tables } from "@/integrations/supabase/types";

const Index = () => {
  const [offers, setOffers] = useState<Tables<"offers">[]>([]);
  const [builds, setBuilds] = useState<Tables<"builds">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [offersRes, buildsRes] = await Promise.all([
        supabase.from("offers").select("*").eq("is_active", true).eq("is_visible", true).eq("is_featured", true).order("created_at", { ascending: false }).limit(8),
        supabase.from("builds").select("*").eq("status", "published").eq("is_featured", true).order("created_at", { ascending: false }).limit(3),
      ]);
      setOffers(offersRes.data ?? []);
      setBuilds(buildsRes.data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <PublicLayout>
      <HeroCarousel />

      {/* Builds */}
      <section className="container mx-auto px-4 py-12 relative z-30">
        <SectionHeader title="Builds de PC" subtitle="Configurações otimizadas para jogos e desempenho." linkTo="/builds" linkLabel="Ver builds" />
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <Skeleton key={i} className="h-96 rounded-xl" />)}
          </div>
        ) : builds.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">Nenhuma build em destaque no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </section>

      {/* Offers */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeader title="Ofertas Tech em Destaque" subtitle="As melhores promoções além do mundo dos PCs." linkTo="/ofertas" linkLabel="Ver todas as ofertas" />
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-80 rounded-xl" />)}
          </div>
        ) : offers.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">Nenhuma oferta em destaque no momento.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </section>
    </PublicLayout>
  );
};

export default Index;
