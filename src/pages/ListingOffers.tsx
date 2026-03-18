import { useEffect, useState, useCallback } from "react";
import PublicLayout from "@/components/layouts/PublicLayout";
import HeroBanner from "@/components/HeroBanner";
import OfferCard from "@/components/OfferCard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Pagination from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL, formatDiscount } from "@/lib/format";
import type { Tables } from "@/integrations/supabase/types";
import { Search, SlidersHorizontal, X } from "lucide-react";

const PAGE_SIZE = 12;

const CATEGORIES = [
  "Todas",
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
];

const SORT_OPTIONS = [
  { label: "Mais recentes", value: "recent" },
  { label: "Menor preço", value: "price_asc" },
  { label: "Maior preço", value: "price_desc" },
  { label: "Maior desconto", value: "discount" },
];

const ListingOffers = () => {
  const [offers, setOffers] = useState<Tables<"offers">[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sort, setSort] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    const from = (page - 1) * PAGE_SIZE;

    let query = supabase
      .from("offers")
      .select("*", { count: "exact" })
      .eq("is_active", true)
      .eq("is_visible", true);

    if (search.trim()) {
      query = query.ilike("name", `%${search.trim()}%`);
    }
    if (category !== "Todas") {
      query = query.eq("category", category);
    }

    if (sort === "price_asc") {
      query = query.order("current_price", { ascending: true });
    } else if (sort === "price_desc") {
      query = query.order("current_price", { ascending: false });
    } else if (sort === "discount") {
      query = query.order("discount_percentage", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    query = query.range(from, from + PAGE_SIZE - 1);

    const { data, count } = await query;
    setOffers(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [page, search, category, sort]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategory = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleSort = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("Todas");
    setSort("recent");
    setPage(1);
  };

  const hasActiveFilters = search.trim() !== "" || category !== "Todas" || sort !== "recent";
  const totalPages = Math.ceil(total / PAGE_SIZE);

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

        <main>
          {/* Search & Filters Bar */}
          <div className="bg-card rounded-xl border border-border p-4 mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar ofertas..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 bg-muted/50"
                />
              </div>

              {/* Sort (desktop) */}
              <select
                value={sort}
                onChange={(e) => handleSort(e.target.value)}
                className="hidden sm:block bg-muted/50 border border-border rounded-md text-sm px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring min-w-[160px]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* Filter toggle (mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-border bg-muted/50 text-sm font-medium text-foreground"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
              </button>
            </div>

            {/* Category pills (desktop) + expanded filters (mobile) */}
            <div className={`${showFilters ? "block" : "hidden"} sm:block space-y-3 sm:space-y-0`}>
              {/* Sort (mobile only) */}
              <select
                value={sort}
                onChange={(e) => handleSort(e.target.value)}
                className="sm:hidden w-full bg-muted/50 border border-border rounded-md text-sm px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      category === cat
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Active filters indicator */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground">Filtros ativos:</span>
                {search.trim() && (
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                    "{search}"
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleSearch("")} />
                  </span>
                )}
                {category !== "Todas" && (
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                    {category}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleCategory("Todas")} />
                  </span>
                )}
                <button onClick={clearFilters} className="text-xs text-destructive hover:underline ml-auto">
                  Limpar tudo
                </button>
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-muted-foreground">
              Mostrando <strong>{offers.length}</strong> de <strong>{total}</strong> resultados
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </PublicLayout>
  );
};

export default ListingOffers;
