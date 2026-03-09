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

const DetailsBuild = () => {
  const { id } = useParams<{ id: string }>();
  const [build, setBuild] = useState<Tables<"builds"> | null>(null);
  const [parts, setParts] = useState<(Tables<"build_parts"> & { offer: Tables<"offers"> | null })[]>([]);
  const [performances, setPerformances] = useState<Tables<"build_performances">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      const [buildRes, partsRes, perfRes] = await Promise.all([
        supabase.from("builds").select("*").eq("id", id).single(),
        supabase.from("build_parts").select("*, offer:offers(*)").eq("build_id", id).order("sort_order"),
        supabase.from("build_performances").select("*").eq("build_id", id).order("sort_order"),
      ]);
      setBuild(buildRes.data);
      setParts((partsRes.data as any) ?? []);
      setPerformances(perfRes.data ?? []);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <PublicLayout>
        <HeroBanner size="md"><Skeleton className="h-12 w-72 bg-white/20" /></HeroBanner>
        <div className="container mx-auto px-4 py-8"><Skeleton className="h-[600px] rounded-xl" /></div>
      </PublicLayout>
    );
  }

  if (!build) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Build não encontrada</h1>
          <Link to="/builds" className="text-primary hover:underline">Voltar para builds</Link>
        </div>
      </PublicLayout>
    );
  }

  const savings = build.total_price && build.final_price ? build.total_price - build.final_price : 0;

  return (
    <PublicLayout>
      <HeroBanner size="md">
        <div className="mb-4">
          <Breadcrumb variant="light" items={[{ label: "Home", to: "/" }, { label: "Builds de PC", to: "/builds" }, { label: build.name }]} />
        </div>
      </HeroBanner>

      <main className="container mx-auto px-4 -mt-10 relative z-30 pb-20">
        <div className="bg-surface rounded-xl shadow-xl overflow-hidden border border-border">
          <div className="flex flex-col lg:flex-row">
            {/* Image */}
            <div className="lg:w-1/2 bg-white relative min-h-[400px] lg:min-h-[600px] flex items-center justify-center p-8 group border-r border-border">
              {build.image_url ? (
                <img alt={build.name} className="max-w-full max-h-full object-contain drop-shadow-2xl transform transition-transform duration-700 group-hover:scale-105" src={build.image_url} />
              ) : (
                <span className="material-symbols-outlined text-9xl text-muted-foreground/30">computer</span>
              )}
            </div>

            {/* Info */}
            <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col">
              {/* Title & Subtitle */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">{build.name}</h1>
              {build.subtitle && <p className="text-base text-muted-foreground mb-4">{build.subtitle}</p>}

              <div className="flex items-center gap-3 mb-6">
                {build.badge && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">verified</span> {build.badge}
                  </span>
                )}
                <span className="bg-muted text-muted-foreground text-xs font-bold px-3 py-1 rounded-full">{build.category}</span>
              </div>

              {/* Performance */}
              {performances.length > 0 && (
                <>
                  <h2 className="text-xl font-bold text-foreground mb-4">Performance Estimada</h2>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {performances.slice(0, 3).map(p => (
                      <div key={p.id} className="bg-muted rounded-lg p-3 text-center border border-border">
                        <div className="text-xs text-muted-foreground mb-1">{p.game} ({p.quality})</div>
                        <div className="text-xl font-bold text-primary">{p.fps}+ <span className="text-sm text-muted-foreground font-normal">FPS</span></div>
                      </div>
                    ))}
                  </div>
                  <div className="h-px bg-border w-full mb-6" />
                </>
              )}

              {/* Price */}
              <div className="mt-auto">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-4xl font-extrabold text-foreground tracking-tight">{formatBRL(build.final_price ?? build.total_price)}</span>
                  {build.total_price && build.final_price && build.total_price !== build.final_price && (
                    <span className="text-lg text-muted-foreground line-through mb-1.5">{formatBRL(build.total_price)}</span>
                  )}
                </div>
                {savings > 0 && (
                  <div className="flex items-center gap-2 mb-6">
                    <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-3 py-1 rounded-md border border-emerald-200">
                      Economize {formatBRL(savings)} ({Math.round((savings / build.total_price!) * 100)}% OFF)
                    </span>
                    <span className="text-sm text-muted-foreground">à vista no PIX</span>
                  </div>
                )}
                <ShareButtons variant="full" />
              </div>
            </div>
          </div>
        </div>

        {/* Description - Above Components */}
        {build.description && (
          <div className="mt-12">
            <div className="bg-surface rounded-xl shadow-sm border border-border p-8">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">description</span>Sobre esta Build
              </h3>
              <div className="prose max-w-none text-muted-foreground whitespace-pre-line">{build.description}</div>
            </div>
          </div>
        )}

        {/* Components List */}
        {parts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <span className="bg-blue-100 p-2 rounded-lg text-primary">
                <span className="material-symbols-outlined">memory</span>
              </span>
              Lista de Componentes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {parts.map(p => {
                const o = p.offer;
                if (!o) return null;
                return (
                  <OfferCard
                    key={p.id}
                    title={o.name}
                    image={o.image_url || undefined}
                    category={o.category}
                    badge={formatDiscount(o.discount_percentage) || undefined}
                    badgeColor="bg-red-500 text-white"
                    oldPrice={o.old_price ? formatBRL(o.old_price) : ""}
                    newPrice={formatBRL(o.current_price)}
                    discount={formatDiscount(o.discount_percentage)}
                    link={`/ofertas/${o.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </PublicLayout>
  );
};

export default DetailsBuild;
