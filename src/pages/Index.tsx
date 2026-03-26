import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";
import HeroCarousel from "@/components/HeroCarousel";
import OfferCard from "@/components/OfferCard";
import BuildCard from "@/components/BuildCard";
import SectionHeader from "@/components/shared/SectionHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL, formatDiscount } from "@/lib/format";
import { useSearch } from "@/contexts/SearchContext";
import type { Tables } from "@/integrations/supabase/types";

const OFFERS_LIMIT = 8;
const BUILDS_LIMIT = 6;

const ScrollableRow = ({
  children,
  itemCount,
}: {
  children: React.ReactNode;
  itemCount: number;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, itemCount]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative group">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card/90 border border-border rounded-full p-2 shadow-lg hover:bg-card transition-colors -ml-3"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
      >
        {children}
      </div>
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card/90 border border-border rounded-full p-2 shadow-lg hover:bg-card transition-colors -mr-3"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      )}
    </div>
  );
};

const Index = () => {
  const { searchQuery } = useSearch();
  const [offers, setOffers] = useState<Tables<"offers">[]>([]);
  const [builds, setBuilds] = useState<Tables<"builds">[]>([]);
  const [totalOffers, setTotalOffers] = useState(0);
  const [totalBuilds, setTotalBuilds] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (searchQuery) {
        // Search mode
        const searchPattern = `%${searchQuery}%`;
        const [offersRes, buildsRes] = await Promise.all([
          supabase
            .from("offers")
            .select("*", { count: "exact" })
            .eq("is_active", true)
            .eq("is_visible", true)
            .ilike("name", searchPattern)
            .order("created_at", { ascending: false })
            .limit(OFFERS_LIMIT),
          supabase
            .from("builds")
            .select("*", { count: "exact" })
            .eq("status", "published")
            .ilike("name", searchPattern)
            .order("created_at", { ascending: false })
            .limit(BUILDS_LIMIT),
        ]);
        setOffers(offersRes.data ?? []);
        setTotalOffers(offersRes.count ?? 0);
        setBuilds(buildsRes.data ?? []);
        setTotalBuilds(buildsRes.count ?? 0);
      } else {
        // Default featured mode
        const [offersRes, buildsRes] = await Promise.all([
          supabase
            .from("offers")
            .select("*")
            .eq("is_active", true)
            .eq("is_visible", true)
            .eq("is_featured", true)
            .order("created_at", { ascending: false })
            .limit(OFFERS_LIMIT),
          supabase
            .from("builds")
            .select("*")
            .eq("status", "published")
            .eq("is_featured", true)
            .order("created_at", { ascending: false })
            .limit(BUILDS_LIMIT),
        ]);
        setOffers(offersRes.data ?? []);
        setTotalOffers(0);
        setBuilds(buildsRes.data ?? []);
        setTotalBuilds(0);
      }

      setLoading(false);
    };
    fetchData();
  }, [searchQuery]);

  const buildCardProps = (b: Tables<"builds">) => ({
    key: b.id,
    title: b.name,
    image: b.image_url || "",
    badgeText: b.badge || b.category,
    badgeColor: "bg-emerald-900/80 text-emerald-400 border border-emerald-500/30",
    oldPrice: b.total_price ? formatBRL(b.total_price) : "",
    newPrice: b.final_price ? formatBRL(b.final_price) : formatBRL(b.total_price),
    discount: formatDiscount(b.discount_percentage),
    description: b.subtitle || b.description || "",
    link: `/builds/${b.id}`,
  });

  const isSearching = !!searchQuery;

  return (
    <PublicLayout>
      {!isSearching && <HeroCarousel />}

      {isSearching && (
        <div className="container mx-auto px-4 pt-8">
          <p className="text-muted-foreground text-sm">
            Resultados para: <span className="font-semibold text-foreground">"{searchQuery}"</span>
          </p>
        </div>
      )}

      {/* Builds */}
      <section className="container mx-auto px-4 py-6 md:py-12 relative z-30">
        <SectionHeader
          title={isSearching ? `Builds encontradas (${totalBuilds})` : "Builds de PC"}
          subtitle={isSearching ? undefined : "Configurações otimizadas para jogos e desempenho."}
          linkTo={isSearching ? `/builds?q=${encodeURIComponent(searchQuery)}` : "/builds"}
          linkLabel={isSearching && totalBuilds > BUILDS_LIMIT ? "Ver tudo" : (!isSearching ? "Ver builds" : undefined)}
        />
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 rounded-xl" />
            ))}
          </div>
        ) : builds.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            {isSearching ? "Nenhuma build encontrada para esta busca." : "Nenhuma build em destaque no momento."}
          </p>
        ) : (
          <>
            {/* Mobile: horizontal scroll carousel */}
            <div className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
              {builds.map((b) => (
                <div key={b.id} className="snap-start shrink-0 w-[75vw] max-w-[300px]">
                  <BuildCard {...buildCardProps(b)} compact />
                </div>
              ))}
            </div>
          {/* Desktop: always scrollable carousel */}
            <div className="hidden md:block">
              <ScrollableRow itemCount={builds.length}>
                {builds.map((b) => (
                  <div key={b.id} className="snap-start shrink-0 w-[calc(33.333%-11px)]">
                    <BuildCard {...buildCardProps(b)} />
                  </div>
                ))}
              </ScrollableRow>
            </div>
          </>
        )}
      </section>

      {/* Offers */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeader
          title={isSearching ? `Ofertas encontradas (${totalOffers})` : "Ofertas Tech em Destaque"}
          subtitle={isSearching ? undefined : "As melhores promoções além do mundo dos PCs."}
          linkTo={isSearching ? `/ofertas?q=${encodeURIComponent(searchQuery)}` : "/ofertas"}
          linkLabel={isSearching && totalOffers > OFFERS_LIMIT ? "Ver tudo" : (!isSearching ? "Ver todas as ofertas" : undefined)}
        />
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            {isSearching ? "Nenhuma oferta encontrada para esta busca." : "Nenhuma oferta em destaque no momento."}
          </p>
        ) : (
          <>
            {/* Mobile: compact cards stacked */}
            <div className="flex flex-col gap-3 sm:hidden">
              {offers.map((o) => (
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
                  compact
                />
              ))}
            </div>
            {/* Desktop: always scrollable carousel */}
            <div className="hidden sm:block">
              <ScrollableRow itemCount={offers.length}>
                {offers.map((o) => (
                  <div key={o.id} className="snap-start shrink-0 w-[calc(25%-12px)]">
                    <OfferCard
                      title={o.name}
                      image={o.image_url || undefined}
                      category={o.category}
                      badge={o.promo_badge || formatDiscount(o.discount_percentage) || undefined}
                      oldPrice={o.old_price ? formatBRL(o.old_price) : ""}
                      newPrice={formatBRL(o.current_price)}
                      discount={formatDiscount(o.discount_percentage)}
                      link={`/ofertas/${o.id}`}
                    />
                  </div>
                ))}
              </ScrollableRow>
            </div>
          </>
        )}
      </section>
    </PublicLayout>
  );
};

export default Index;
