import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminLayout from "@/components/layouts/AdminLayout";
import HeroBanner from "@/components/HeroBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Pagination from "@/components/shared/Pagination";
import type { Tables } from "@/integrations/supabase/types";

type Offer = Tables<"offers">;
type Build = Tables<"builds">;

const PAGE_SIZE = 10;

const AdminProducts = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"offers" | "builds">("offers");
  
  // Offers state
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [offersTotal, setOffersTotal] = useState(0);
  const [offersPage, setOffersPage] = useState(1);
  const [offersSearch, setOffersSearch] = useState("");
  const [offersCategoryFilter, setOffersCategoryFilter] = useState("Todas");
  const [offersStatusFilter, setOffersStatusFilter] = useState("Todos");
  const [deletingOffer, setDeletingOffer] = useState<string | null>(null);

  // Builds state
  const [builds, setBuilds] = useState<Build[]>([]);
  const [buildsLoading, setBuildsLoading] = useState(true);
  const [buildsTotal, setBuildsTotal] = useState(0);
  const [buildsPage, setBuildsPage] = useState(1);
  const [buildsSearch, setBuildsSearch] = useState("");
  const [buildsCategoryFilter, setBuildsCategoryFilter] = useState("Todas");
  const [buildsStatusFilter, setBuildsStatusFilter] = useState("Todos");
  const [deletingBuild, setDeletingBuild] = useState<string | null>(null);

  const fetchOffers = async () => {
    setOffersLoading(true);
    let query = supabase.from("offers").select("*", { count: "exact" });

    if (offersSearch.trim()) {
      query = query.ilike("name", `%${offersSearch.trim()}%`);
    }
    if (offersCategoryFilter !== "Todas") {
      query = query.eq("category", offersCategoryFilter);
    }
    if (offersStatusFilter === "Ativo") {
      query = query.eq("is_active", true);
    } else if (offersStatusFilter === "Inativo") {
      query = query.eq("is_active", false);
    }

    query = query.order("created_at", { ascending: false })
      .range((offersPage - 1) * PAGE_SIZE, offersPage * PAGE_SIZE - 1);

    const { data, error, count } = await query;
    if (error) {
      toast.error("Erro ao carregar ofertas.");
    } else {
      setOffers(data || []);
      setOffersTotal(count || 0);
    }
    setOffersLoading(false);
  };

  const fetchBuilds = async () => {
    setBuildsLoading(true);
    let query = supabase.from("builds").select("*", { count: "exact" });

    if (buildsSearch.trim()) {
      query = query.ilike("name", `%${buildsSearch.trim()}%`);
    }
    if (buildsCategoryFilter !== "Todas") {
      query = query.eq("category", buildsCategoryFilter);
    }
    if (buildsStatusFilter === "Publicado") {
      query = query.eq("status", "published");
    } else if (buildsStatusFilter === "Rascunho") {
      query = query.eq("status", "draft");
    }

    query = query.order("created_at", { ascending: false })
      .range((buildsPage - 1) * PAGE_SIZE, buildsPage * PAGE_SIZE - 1);

    const { data, error, count } = await query;
    if (error) {
      toast.error("Erro ao carregar builds.");
    } else {
      setBuilds(data || []);
      setBuildsTotal(count || 0);
    }
    setBuildsLoading(false);
  };

  useEffect(() => {
    if (activeTab === "offers") {
      fetchOffers();
    }
  }, [offersPage, offersSearch, offersCategoryFilter, offersStatusFilter]);

  useEffect(() => {
    if (activeTab === "builds") {
      fetchBuilds();
    }
  }, [buildsPage, buildsSearch, buildsCategoryFilter, buildsStatusFilter]);

  useEffect(() => {
    if (activeTab === "builds" && builds.length === 0 && !buildsLoading) {
      fetchBuilds();
    }
  }, [activeTab]);

  const handleDeleteOffer = async (offer: Offer) => {
    if (!confirm(`Excluir "${offer.name}"? Esta ação não pode ser desfeita.`)) return;
    setDeletingOffer(offer.id);
    const { error } = await supabase.from("offers").delete().eq("id", offer.id);
    if (error) {
      toast.error("Erro ao excluir oferta.");
    } else {
      toast.success("Oferta excluída.");
      fetchOffers();
    }
    setDeletingOffer(null);
  };

  const handleDeleteBuild = async (build: Build) => {
    if (!confirm(`Excluir "${build.name}"? Esta ação não pode ser desfeita.`)) return;
    setDeletingBuild(build.id);
    
    // Delete related data first
    await supabase.from("build_parts").delete().eq("build_id", build.id);
    await supabase.from("build_performances").delete().eq("build_id", build.id);
    
    const { error } = await supabase.from("builds").delete().eq("id", build.id);
    if (error) {
      toast.error("Erro ao excluir build.");
    } else {
      toast.success("Build excluída.");
      fetchBuilds();
    }
    setDeletingBuild(null);
  };

  const toggleOfferActive = async (offer: Offer) => {
    const { error } = await supabase.from("offers").update({ is_active: !offer.is_active }).eq("id", offer.id);
    if (error) {
      toast.error("Erro ao alterar status.");
    } else {
      toast.success(offer.is_active ? "Oferta desativada." : "Oferta ativada.");
      fetchOffers();
    }
  };

  const toggleBuildStatus = async (build: Build) => {
    const newStatus = build.status === "published" ? "draft" : "published";
    const { error } = await supabase.from("builds").update({ status: newStatus }).eq("id", build.id);
    if (error) {
      toast.error("Erro ao alterar status.");
    } else {
      toast.success(build.status === "published" ? "Build despublicada." : "Build publicada.");
      fetchBuilds();
    }
  };

  const formatPrice = (val: number | null) => {
    if (val === null || val === undefined) return "—";
    return `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  };

  const offersTotalPages = Math.ceil(offersTotal / PAGE_SIZE);
  const buildsTotalPages = Math.ceil(buildsTotal / PAGE_SIZE);

  return (
    <AdminLayout>
      <HeroBanner size="md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="mb-3">
              <Breadcrumb variant="light" items={[{ label: "Admin", to: "/admin" }, { label: "Dashboard", to: "/admin" }, { label: "Produtos" }]} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Gerenciamento de Produtos</h1>
            <p className="text-blue-100/80 mt-2 font-light">Ofertas individuais e builds completas.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/ofertas/nova" className="bg-white text-primary hover:bg-blue-50 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all transform hover:scale-[1.02] active:scale-95">
              <span className="material-symbols-outlined">add_circle</span>Nova Oferta
            </Link>
            <Link to="/admin/builds/nova" className="bg-white text-primary hover:bg-blue-50 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all transform hover:scale-[1.02] active:scale-95">
              <span className="material-symbols-outlined">add_circle</span>Nova Build
            </Link>
          </div>
        </div>
      </HeroBanner>

      <main className="container mx-auto px-4 -mt-12 relative z-20 pb-20">
        {/* Tabs */}
        <div className="bg-card rounded-2xl shadow-xl border border-border mb-8 overflow-hidden">
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("offers")}
              className={`flex-1 px-6 py-4 font-bold text-sm transition-colors ${
                activeTab === "offers"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              Ofertas ({offersTotal})
            </button>
            <button
              onClick={() => setActiveTab("builds")}
              className={`flex-1 px-6 py-4 font-bold text-sm transition-colors ${
                activeTab === "builds"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              Builds ({buildsTotal})
            </button>
          </div>
        </div>

        {activeTab === "offers" ? (
          <>
            {/* Offers Filters */}
            <div className="bg-card rounded-2xl shadow-xl border border-border p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Buscar</label>
                  <div className="relative">
                    <input
                      className="w-full bg-muted border border-border rounded-lg text-sm focus:ring-primary focus:border-primary px-3 py-2"
                      placeholder="Nome do produto..."
                      value={offersSearch}
                      onChange={(e) => { setOffersSearch(e.target.value); setOffersPage(1); }}
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">search</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Categoria</label>
                  <select className="w-full bg-muted border border-border rounded-lg text-sm focus:ring-primary focus:border-primary px-3 py-2" value={offersCategoryFilter} onChange={(e) => { setOffersCategoryFilter(e.target.value); setOffersPage(1); }}>
                    <option>Todas</option>
                    {["Hardware", "Smartphones", "Periféricos", "Mobiliário", "Acessórios", "Gadgets", "Notebooks", "Áudio", "Monitores", "Redes", "Armazenamento", "Games"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Status</label>
                  <select className="w-full bg-muted border border-border rounded-lg text-sm focus:ring-primary focus:border-primary px-3 py-2" value={offersStatusFilter} onChange={(e) => { setOffersStatusFilter(e.target.value); setOffersPage(1); }}>
                    {["Todos", "Ativo", "Inativo"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Offers Table */}
            <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      {["Produto", "Categoria", "Preço", "Status", "Ações"].map((h, i) => (
                        <th key={h} className={`px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider ${i === 4 ? "text-right" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {offersLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i}>
                          <td colSpan={5} className="px-6 py-6">
                            <div className="h-5 bg-muted rounded animate-pulse" />
                          </td>
                        </tr>
                      ))
                    ) : offers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                          Nenhuma oferta encontrada.
                        </td>
                      </tr>
                    ) : (
                      offers.map((offer) => (
                        <tr key={offer.id} className={`hover:bg-muted/50 transition-colors ${!offer.is_active ? "opacity-75" : ""}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 p-1 border border-border flex items-center justify-center overflow-hidden">
                                {offer.image_url ? (
                                  <img src={offer.image_url} alt={offer.name} className="w-full h-full object-contain" />
                                ) : (
                                  <span className="material-symbols-outlined text-3xl text-muted-foreground">image</span>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-foreground leading-snug">{offer.name}</p>
                                {offer.promo_badge && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase text-primary bg-primary/10">{offer.promo_badge}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-muted-foreground">{offer.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-foreground">{formatPrice(offer.current_price)}</span>
                              {offer.discount_percentage && offer.discount_percentage > 0 && (
                                <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded w-fit mt-1">-{offer.discount_percentage}% OFF</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => toggleOfferActive(offer)} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${offer.is_active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${offer.is_active ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                              {offer.is_active ? "Ativo" : "Inativo"}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => navigate(`/admin/ofertas/${offer.id}/editar`)} className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Editar">
                                <span className="material-symbols-outlined text-xl">edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteOffer(offer)}
                                disabled={deletingOffer === offer.id}
                                className="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                                title="Excluir"
                              >
                                <span className="material-symbols-outlined text-xl">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {offersTotalPages > 0 && (
                <Pagination
                  showInfo
                  infoText={`Exibindo <span class="font-bold">${(offersPage - 1) * PAGE_SIZE + 1}-${Math.min(offersPage * PAGE_SIZE, offersTotal)}</span> de <span class="font-bold">${offersTotal}</span> produtos`}
                  totalPages={offersTotalPages}
                  currentPage={offersPage}
                  onPageChange={setOffersPage}
                />
              )}
            </div>
          </>
        ) : (
          <>
            {/* Builds Filters */}
            <div className="bg-card rounded-2xl shadow-xl border border-border p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Buscar</label>
                  <div className="relative">
                    <input
                      className="w-full bg-muted border border-border rounded-lg text-sm focus:ring-primary focus:border-primary px-3 py-2"
                      placeholder="Nome da build..."
                      value={buildsSearch}
                      onChange={(e) => { setBuildsSearch(e.target.value); setBuildsPage(1); }}
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">search</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Categoria</label>
                  <select className="w-full bg-muted border border-border rounded-lg text-sm focus:ring-primary focus:border-primary px-3 py-2" value={buildsCategoryFilter} onChange={(e) => { setBuildsCategoryFilter(e.target.value); setBuildsPage(1); }}>
                    <option>Todas</option>
                    {["Gamer Entry-Level", "Gamer Mid-Range", "Gamer High-End", "Workstation", "Office"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Status</label>
                  <select className="w-full bg-muted border border-border rounded-lg text-sm focus:ring-primary focus:border-primary px-3 py-2" value={buildsStatusFilter} onChange={(e) => { setBuildsStatusFilter(e.target.value); setBuildsPage(1); }}>
                    {["Todos", "Publicado", "Rascunho"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Builds Table */}
            <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      {["Build", "Categoria", "Preço Final", "Status", "Ações"].map((h, i) => (
                        <th key={h} className={`px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider ${i === 4 ? "text-right" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {buildsLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i}>
                          <td colSpan={5} className="px-6 py-6">
                            <div className="h-5 bg-muted rounded animate-pulse" />
                          </td>
                        </tr>
                      ))
                    ) : builds.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                          Nenhuma build encontrada.
                        </td>
                      </tr>
                    ) : (
                      builds.map((build) => (
                        <tr key={build.id} className={`hover:bg-muted/50 transition-colors ${build.status === "draft" ? "opacity-75" : ""}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 p-1 border border-border flex items-center justify-center overflow-hidden">
                                {build.image_url ? (
                                  <img src={build.image_url} alt={build.name} className="w-full h-full object-contain" />
                                ) : (
                                  <span className="material-symbols-outlined text-3xl text-muted-foreground">computer</span>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-foreground leading-snug">{build.name}</p>
                                {build.badge && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase text-primary bg-primary/10">{build.badge}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-muted-foreground">{build.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-foreground">{formatPrice(build.final_price)}</span>
                              {build.discount_percentage && build.discount_percentage > 0 && (
                                <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded w-fit mt-1">-{build.discount_percentage}% Bundle</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => toggleBuildStatus(build)} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${build.status === "published" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${build.status === "published" ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                              {build.status === "published" ? "Publicado" : "Rascunho"}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => navigate(`/admin/builds/${build.id}/editar`)} className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Editar">
                                <span className="material-symbols-outlined text-xl">edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteBuild(build)}
                                disabled={deletingBuild === build.id}
                                className="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                                title="Excluir"
                              >
                                <span className="material-symbols-outlined text-xl">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {buildsTotalPages > 0 && (
                <Pagination
                  showInfo
                  infoText={`Exibindo <span class="font-bold">${(buildsPage - 1) * PAGE_SIZE + 1}-${Math.min(buildsPage * PAGE_SIZE, buildsTotal)}</span> de <span class="font-bold">${buildsTotal}</span> builds`}
                  totalPages={buildsTotalPages}
                  currentPage={buildsPage}
                  onPageChange={setBuildsPage}
                />
              )}
            </div>
          </>
        )}
      </main>
    </AdminLayout>
  );
};

export default AdminProducts;
