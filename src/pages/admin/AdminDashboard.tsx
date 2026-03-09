import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import HeroBanner from "@/components/HeroBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL } from "@/lib/format";
import type { Tables } from "@/integrations/supabase/types";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalOffers: 0, activeOffers: 0, totalBuilds: 0, publishedBuilds: 0 });
  const [recentOffers, setRecentOffers] = useState<Tables<"offers">[]>([]);
  const [recentBuilds, setRecentBuilds] = useState<Tables<"builds">[]>([]);
  const [categories, setCategories] = useState<{ label: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [allOffers, activeOffers, allBuilds, pubBuilds, latestOffers, latestBuilds] = await Promise.all([
        supabase.from("offers").select("*", { count: "exact", head: true }),
        supabase.from("offers").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("builds").select("*", { count: "exact", head: true }),
        supabase.from("builds").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("offers").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("builds").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        totalOffers: allOffers.count ?? 0,
        activeOffers: activeOffers.count ?? 0,
        totalBuilds: allBuilds.count ?? 0,
        publishedBuilds: pubBuilds.count ?? 0,
      });
      setRecentOffers(latestOffers.data ?? []);
      setRecentBuilds(latestBuilds.data ?? []);

      // category distribution
      const offers = (await supabase.from("offers").select("category")).data ?? [];
      const catMap: Record<string, number> = {};
      offers.forEach(o => { catMap[o.category] = (catMap[o.category] || 0) + 1; });
      setCategories(Object.entries(catMap).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count));

      setLoading(false);
    };
    fetch();
  }, []);

  const statsCards = [
    { label: "Total Ofertas", value: stats.totalOffers, icon: "inventory_2", color: "bg-blue-100 text-blue-600" },
    { label: "Ofertas Ativas", value: stats.activeOffers, icon: "local_offer", color: "bg-emerald-100 text-emerald-600" },
    { label: "Total Builds", value: stats.totalBuilds, icon: "memory", color: "bg-purple-100 text-purple-600" },
    { label: "Builds Publicadas", value: stats.publishedBuilds, icon: "check_circle", color: "bg-orange-100 text-orange-600" },
  ];

  const totalCat = categories.reduce((s, c) => s + c.count, 0);
  const catColors = ["bg-blue-600", "bg-emerald-500", "bg-amber-500", "bg-red-500", "bg-pink-500"];

  return (
    <AdminLayout>
      <HeroBanner size="md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-xl mb-2">Painel de Administração</h1>
            <p className="text-blue-100 font-light drop-shadow-md">Visão geral do desempenho e gerenciamento da plataforma.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/ofertas/nova" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-6 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 border border-blue-400/30 ring-1 ring-blue-400/20 text-sm">
              <span className="material-symbols-outlined text-lg">add_box</span>Novo Produto
            </Link>
            <Link to="/admin/builds/nova" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold py-2.5 px-6 rounded-lg flex items-center gap-2 shadow-lg transition-all hover:border-white/40 text-sm">
              <span className="material-symbols-outlined text-lg">computer</span>Nova Build
            </Link>
          </div>
        </div>
      </HeroBanner>

      <main className="container mx-auto px-4 py-8 -mt-16 relative z-30">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map(stat => (
            <div key={stat.label} className="bg-card rounded-xl p-5 shadow-lg border border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-foreground">{loading ? "—" : stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category chart */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-card rounded-xl shadow-lg border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">pie_chart</span>Ofertas por Categoria
              </h3>
              {loading ? <Skeleton className="h-40 w-40 rounded-full mx-auto" /> : categories.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 text-sm">Sem dados</p>
              ) : (
                <div className="w-full space-y-3">
                  {categories.slice(0, 5).map((cat, i) => (
                    <div key={cat.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${catColors[i % catColors.length]}`} />
                        <span className="text-muted-foreground">{cat.label || "Sem categoria"}</span>
                      </div>
                      <span className="font-semibold text-foreground">{totalCat ? Math.round((cat.count / totalCat) * 100) : 0}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tables */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-bold text-foreground">Últimas Ofertas</h3>
                <Link to="/admin/produtos" className="text-sm text-primary hover:underline font-medium">Ver todos</Link>
              </div>
              {loading ? (
                <div className="p-4 space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-14" />)}</div>
              ) : (
                <div className="divide-y divide-border">
                  {recentOffers.map(o => (
                    <Link to={`/admin/ofertas/${o.id}/editar`} key={o.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                      <div className="w-12 h-12 bg-card rounded border border-border flex items-center justify-center overflow-hidden">
                        {o.image_url ? <img src={o.image_url} className="w-full h-full object-contain" /> : <span className="material-symbols-outlined text-2xl text-muted-foreground">devices</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate">{o.name}</h4>
                        <p className="text-xs text-muted-foreground">{o.category} • {o.is_active ? "Ativo" : "Inativo"}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="block text-sm font-bold text-foreground">{formatBRL(o.current_price)}</span>
                        <span className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-bold text-foreground">Últimas Builds</h3>
                <Link to="/admin/produtos?tab=builds" className="text-sm text-primary hover:underline font-medium">Ver todos</Link>
              </div>
              {loading ? (
                <div className="p-4 space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-14" />)}</div>
              ) : recentBuilds.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 text-sm">Nenhuma build criada</p>
              ) : (
                <div className="divide-y divide-border">
                  {recentBuilds.map(b => (
                    <div key={b.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                      <div className="w-16 h-12 bg-muted rounded border border-border overflow-hidden flex items-center justify-center">
                        {b.image_url ? <img src={b.image_url} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-muted-foreground">computer</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-foreground truncate">{b.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                            {b.status === "published" ? "ATIVO" : "DRAFT"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{b.category}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="block text-xs font-medium text-muted-foreground">Atualizado</span>
                        <span className="text-xs text-muted-foreground">{new Date(b.updated_at).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminDashboard;
