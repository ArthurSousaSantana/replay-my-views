import { useEffect, useState, useCallback } from "react";
import PublicLayout from "@/components/layouts/PublicLayout";
import HeroBanner from "@/components/HeroBanner";
import OfferCard from "@/components/OfferCard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Pagination from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL, formatDiscount } from "@/lib/format";
import type { Tables } from "@/integrations/supabase/types";
import { SlidersHorizontal, X } from "lucide-react";

const PAGE_SIZE = 12;

const CATEGORIES = [
  "Hardware",
  "Smartphones",
  "Periféricos",
  "Mobiliário",
  "Acessórios",
  "Gadgets",
  "Notebooks",
  "Áudio",
  "Monitores",
  "Redes",
  "Armazenamento",
  "Games",
  "Iluminação",
  "Escritório",
  "Ergonomia",
  "Componentes",
  "Conectividade",
  "Tablets",
  "Wearables",
  "Suportes",
];

const DISCOUNT_OPTIONS = [
  { label: "Qualquer desconto", value: 0 },
  { label: "Mais de 10%", value: 10 },
  { label: "Mais de 30%", value: 30 },
  { label: "Mais de 50%", value: 50 },
];

const ListingOffers = () => {
  const [offers, setOffers] = useState<Tables<"offers">[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  const [minDiscount, setMinDiscount] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    const from = (page - 1) * PAGE_SIZE;

    let query = supabase
      .from("offers")
      .select("*", { count: "exact" })
      .eq("is_active", true)
      .eq("is_visible", true);

    if (selectedCategories.length > 0) {
      query = query.in("category", selectedCategories);
    }
    if (appliedMinPrice !== null) {
      query = query.gte("current_price", appliedMinPrice);
    }
    if (appliedMaxPrice !== null) {
      query = query.lte("current_price", appliedMaxPrice);
    }
    if (minDiscount > 0) {
      query = query.gte("discount_percentage", minDiscount);
    }

    query = query
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    const { data, count } = await query;
    setOffers(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [page, selectedCategories, appliedMinPrice, appliedMaxPrice, minDiscount]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

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
    setPage(1);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    appliedMinPrice !== null ||
    appliedMaxPrice !== null ||
    minDiscount > 0;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const filtersContent = (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-foreground">Filtros</h3>

      {/* Categories */}
      <div className="border-b border-border pb-6">
        <h4 className="font-semibold text-sm text-foreground mb-3">Categorias</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
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

      {/* Price range */}
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

      {/* Discount */}
      <div>
        <h4 className="font-semibold text-sm text-foreground mb-3">Desconto</h4>
        <div className="space-y-2">
          {DISCOUNT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="discount"
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

      {/* Clear filters */}
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
      <HeroBanner size="sm">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
          Ofertas Tech em Destaque
        </h1>
      </HeroBanner>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Ofertas Tech em Destaque" }]} />
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden flex items-center gap-2 mb-4 px-4 py-2.5 rounded-lg border border-border bg-card text-sm font-medium text-foreground shadow-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {selectedCategories.length + (appliedMinPrice !== null || appliedMaxPrice !== null ? 1 : 0) + (minDiscount > 0 ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Mobile filters drawer */}
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
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-card rounded-xl border border-border p-5 sticky top-24">
              <FiltersContent />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-muted-foreground">
                Mostrando <strong>{offers.length}</strong> de <strong>{total}</strong> resultados
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-xl" />
                ))}
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-2">Nenhuma oferta encontrada.</p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                    Limpar filtros e tentar novamente
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
            )}
          </main>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ListingOffers;
