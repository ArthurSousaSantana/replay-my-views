import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PublicLayout from "@/components/layouts/PublicLayout";
import HeroBanner from "@/components/HeroBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ShareButtons from "@/components/shared/ShareButtons";
import OfferCard from "@/components/OfferCard";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL, formatDiscount } from "@/lib/format";
import type { Tables } from "@/integrations/supabase/types";

const DetailsOffer = () => {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<Tables<"offers"> | null>(null);
  const [related, setRelated] = useState<Tables<"offers">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase.from("offers").select("*").eq("id", id).single();
      setOffer(data);
      if (data) {
        const listingCat = (data as any).listing_category as string | null;
        let query = supabase
          .from("offers")
          .select("*")
          .eq("is_active", true)
          .eq("is_visible", true)
          .neq("id", id);
        // Prefer grouping by listing_category (e.g. "Seleção de Portáteis", "Jogos")
        // so different sub-categories within the same rail still relate to each other.
        query = listingCat
          ? query.eq("listing_category", listingCat)
          : query.eq("category", data.category);
        const { data: rel } = await query
          .order("created_at", { ascending: false })
          .limit(4);
        // Fallback: if nothing matched by listing_category, try by category.
        if ((!rel || rel.length === 0) && listingCat) {
          const { data: rel2 } = await supabase
            .from("offers")
            .select("*")
            .eq("is_active", true)
            .eq("is_visible", true)
            .neq("id", id)
            .eq("category", data.category)
            .order("created_at", { ascending: false })
            .limit(4);
          setRelated(rel2 ?? []);
        } else {
          setRelated(rel ?? []);
        }
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const specs = (offer?.specs as Array<{ key: string; value: string }>) ?? [];
  const gallery = (offer?.gallery as string[]) ?? [];

  if (loading) {
    return (
      <PublicLayout>
        <HeroBanner size="sm"><Skeleton className="h-10 w-64 bg-white/20" /></HeroBanner>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-[500px] rounded-xl" />
        </div>
      </PublicLayout>
    );
  }

  if (!offer) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Oferta não encontrada</h1>
          <Link to="/ofertas" className="text-primary hover:underline">Voltar para ofertas</Link>
        </div>
      </PublicLayout>
    );
  }

  const discountText = formatDiscount(offer.discount_percentage);
  const savings = offer.old_price && offer.current_price ? offer.old_price - offer.current_price : 0;

  return (
    <PublicLayout>
      <HeroBanner size="sm" />

      <main className="container mx-auto px-4 -mt-10 relative z-30 pb-20">
        <div className="mb-3">
          <Breadcrumb variant="light" items={[{ label: "Home", to: "/" }, { label: offer.category, to: "/ofertas" }, { label: offer.name }]} />
        </div>
        <div className="bg-surface rounded-xl shadow-xl border border-border overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image */}
            <div className="lg:w-7/12 p-8 border-b lg:border-b-0 lg:border-r border-border flex flex-col items-center justify-center bg-card">
              <div className="relative w-full max-w-lg aspect-square mb-6 flex items-center justify-center">
                {offer.image_url ? (
                  <img alt={offer.name} loading="lazy" className="object-contain max-h-full max-w-full drop-shadow-lg" src={offer.image_url} />
                ) : (
                  <span className="material-symbols-outlined text-9xl text-muted-foreground">devices</span>
                )}
              </div>
              {gallery.length > 0 && (
                <div className="flex gap-4 overflow-x-auto py-2 w-full max-w-lg px-2">
                  {gallery.map((url, i) => (
                    <button key={i} className="w-20 h-20 flex-shrink-0 border border-border rounded-lg p-2 bg-card flex items-center justify-center hover:border-primary transition-colors">
                      <img alt={`Gallery ${i}`} loading="lazy" className="max-h-full max-w-full object-contain" src={url} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:w-5/12 p-8 flex flex-col">
              <div className="mb-4 flex flex-wrap gap-2">
                {offer.is_best_price && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide inline-flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">local_fire_department</span>Melhor Preço
                  </span>
                )}
                {offer.is_limited_offer && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase">Oferta Limitada</span>
                )}
                {offer.promo_badge && (
                  <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase">{offer.promo_badge}</span>
                )}
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2 leading-tight">{offer.name}</h2>
              {offer.short_description && <p className="text-muted-foreground text-sm mb-6">{offer.short_description}</p>}

              <div className="bg-muted rounded-lg p-6 mb-6 border border-border">
                {offer.old_price && (
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg text-muted-foreground line-through decoration-red-500/50 decoration-2">{formatBRL(offer.old_price)}</span>
                    {discountText && <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-md">{discountText}</span>}
                  </div>
                )}
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-extrabold text-foreground tracking-tight">{formatBRL(offer.current_price)}</span>
                </div>
                <p className="text-sm text-emerald-600 font-medium mb-4">à vista no Pix ou Boleto</p>
                {savings > 0 && <p className="text-sm text-muted-foreground">Economia de <span className="font-bold text-foreground">{formatBRL(savings)}</span></p>}
              </div>

              <div className="space-y-4 mb-8">
                {offer.external_url ? (
                  <a href={offer.external_url} target="_blank" rel="noopener noreferrer" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    Ir para a oferta <span className="material-symbols-outlined">open_in_new</span>
                  </a>
                ) : (
                  <button disabled className="w-full bg-muted text-muted-foreground font-bold text-lg py-4 px-6 rounded-lg cursor-not-allowed">Link não disponível</button>
                )}
                <ShareButtons variant="compact" />
              </div>
            </div>
          </div>
        </div>

        {/* Description & Specs */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {offer.long_description && (
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-surface rounded-xl shadow-sm border border-border p-8">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">description</span>Descrição do Produto
                </h3>
                <div className="prose max-w-none text-muted-foreground whitespace-pre-line">{offer.long_description}</div>
              </div>
            </div>
          )}

          {specs.length > 0 && (
            <div className={offer.long_description ? "lg:col-span-1" : "lg:col-span-3"}>
              <div className="bg-surface rounded-xl shadow-sm border border-border p-6 sticky top-24">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">settings_suggest</span>Especificações Técnicas
                </h3>
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="min-w-full divide-y divide-border text-sm">
                    <tbody className="divide-y divide-border">
                      {specs.map((spec, i) => (
                        <tr key={spec.key} className={i % 2 === 0 ? "bg-muted" : "bg-surface"}>
                          <td className="px-4 py-3 font-medium text-foreground w-1/3">{spec.key}</td>
                          <td className="px-4 py-3 text-muted-foreground">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Ofertas Relacionadas</h2>
            {/* Mobile: horizontal scroll carousel */}
            <div className="flex sm:hidden gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 scrollbar-hide">
              {related.map(o => (
                <div key={o.id} className="snap-start shrink-0 w-[40vw] max-w-[170px]">
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
            </div>
            {/* Desktop: grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(o => (
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
          </section>
        )}
      </main>
    </PublicLayout>
  );
};

export default DetailsOffer;
