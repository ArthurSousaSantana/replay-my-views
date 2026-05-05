import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import PublicLayout from "@/components/layouts/PublicLayout";
import HeroBanner from "@/components/HeroBanner";
import buildsHeroPc from "@/assets/builds-hero-pc.png";
import BuildCard from "@/components/BuildCard";
import Pagination from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL, formatDiscount } from "@/lib/format";
import { useSearch } from "@/contexts/SearchContext";
import type { Tables } from "@/integrations/supabase/types";
import { SlidersHorizontal, X } from "lucide-react";

const PAGE_SIZE = 9;

const CATEGORIES = ["Básico", "Intermediário", "Avançado", "Extremo"];

const DISCOUNT_OPTIONS = [
  { label: "Qualquer desconto", value: 0 },
  { label: "Mais de 10%", value: 10 },
  { label: "Mais de 30%", value: 30 },
  { label: "Mais de 50%", value: 50 },
];

const ListingBuilds = () => {
  const [searchParams] = useSearchParams();
  const { searchQuery, setSearchQuery } = useSearch();
  const [builds, setBuilds] = useState<Tables<"builds">[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  const [minDiscount, setMinDiscount] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pick up ?q=, ?categoria=, ?desconto= from URL on mount
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q !== searchQuery) {
      setSearchQuery(q);
    }
    const cat = searchParams.get("categoria");
    if (cat) setSelectedCategories([cat]);
    const desc = searchParams.get("desconto");
    if (desc) setMinDiscount(Number(desc) || 0);
  }, [searchParams]);

  const fetchBuilds = useCallback(async () => {
    setLoading(true);
    const from = (page - 1) * PAGE_SIZE;

    let query = supabase
      .from("builds")
      .select("*", { count: "exact" })
      .eq("status", "published");

    if (searchQuery) {
      query = query.ilike("name", `%${searchQuery}%`);
    }
    if (selectedCategories.length > 0) {
      query = query.in("category", selectedCategories);
    }
    if (appliedMinPrice !== null) {
      query = query.gte("final_price", appliedMinPrice);
    }
    if (appliedMaxPrice !== null) {
      query = query.lte("final_price", appliedMaxPrice);
    }
    if (minDiscount > 0) {
      query = query.gte("discount_percentage", minDiscount);
    }

    query = query
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    const { data, count } = await query;
    setBuilds(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [page, selectedCategories, appliedMinPrice, appliedMaxPrice, minDiscount, searchQuery]);

  useEffect(() => {
    fetchBuilds();
  }, [fetchBuilds]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setPage(1);
  };

  const applyPriceFilter = () => {
    setAppliedMinPrice(minPrice ? Number(minPrice) : null);
    setAppliedMaxPrice(maxPrice ? Number(maxPrice) : null);
    setPage(1);
  };

  const handleDiscountChange = (value: number) => {
    setMinDiscount(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
    setMinDiscount(0);
    setSearchQuery("");
    setPage(1);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    appliedMinPrice !== null ||
    appliedMaxPrice !== null ||
    minDiscount > 0 ||
    !!searchQuery;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const filtersContent = (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-foreground">Filtros</h3>

      <div className="border-b border-border pb-6">
        <h4 className="font-semibold text-sm text-foreground mb-3">Categorias</h4>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary bg-muted"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-b border-border pb-6">
        <h4 className="font-semibold text-sm text-foreground mb-3">Preço</h4>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring placeholder:text-muted-foreground"
          />
          <span className="text-muted-foreground text-sm">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring placeholder:text-muted-foreground"
          />
        </div>
        <button
          onClick={applyPriceFilter}
          className="w-full py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium text-foreground border border-border transition-colors"
        >
          Aplicar
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-sm text-foreground mb-3">Desconto</h4>
        <div className="space-y-2">
          {DISCOUNT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="discount-builds"
                checked={minDiscount === opt.value}
                onChange={() => handleDiscountChange(opt.value)}
                className="h-4 w-4 border-border text-primary focus:ring-primary bg-muted"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-sm font-medium text-destructive transition-colors"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );

  return (
    <PublicLayout>
      <HeroBanner size="md">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-6 md:gap-8 max-w-6xl mx-auto">
          <div className="text-center md:text-left flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-xl text-white mb-3 leading-tight">
              {searchQuery ? `Resultados para "${searchQuery}"` : "SEU SETUP DOS SONHOS, AGORA POSSÍVEL"}
            </h1>
            {!searchQuery && (
              <p className="text-sm sm:text-base md:text-lg text-blue-100 max-w-xl mx-auto md:mx-0 font-light drop-shadow-md">
                As melhores combinações de hardware com o selo de economia que você já conhece.
              </p>
            )}
          </div>
          <img
            src={buildsHeroPc}
            alt="PC gamer com iluminação RGB"
            className="w-32 sm:w-40 md:w-48 lg:w-56 h-auto object-contain drop-shadow-2xl flex-shrink-0"
          />
        </div>
      </HeroBanner>

      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden flex items-center gap-2 mb-4 px-4 py-2.5 rounded-lg border border-border bg-card text-sm font-medium text-foreground shadow-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {selectedCategories.length + (appliedMinPrice !== null || appliedMaxPrice !== null ? 1 : 0) + (minDiscount > 0 ? 1 : 0) + (searchQuery ? 1 : 0)}
            </span>
          )}
        </button>

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card p-6 overflow-y-auto shadow-2xl animate-in slide-in-from-left">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-lg text-foreground">Filtros</span>
                <button onClick={() => setShowMobileFilters(false)} className="p-1 text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {filtersContent}
            </div>
          </div>
        )}

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-card rounded-xl border border-border p-5 sticky top-24">
              {filtersContent}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground text-sm">
                Mostrando <span className="font-bold text-foreground">{builds.length}</span> de{" "}
                <span className="font-bold text-foreground">{total}</span> resultados
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-96 rounded-xl" />
                ))}
              </div>
            ) : builds.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-2">Nenhuma build encontrada.</p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                    Limpar filtros e tentar novamente
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {builds.map((b) => (
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

            {totalPages > 1 && (
              <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
            )}
          </div>
        </div>
      </main>
    </PublicLayout>
  );
};

export default ListingBuilds;
