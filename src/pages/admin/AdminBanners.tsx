import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layouts/AdminLayout";
import HeroBanner from "@/components/HeroBanner";
import { toast } from "sonner";
import ImageUpload from "@/components/shared/ImageUpload";
import AdminFormSection from "@/components/shared/AdminFormSection";
import {
  OFFER_CATEGORIES,
  OFFER_LISTING_CATEGORIES,
  BUILD_CATEGORIES,
  DISCOUNT_FILTER_OPTIONS,
  buildBannerHref,
  type DestinationType,
} from "@/lib/bannerDestination";
import heroBannerImg from "@/assets/admin-banners-hero.png";

interface Banner {
  id: string;
  title: string;
  link: string;
  image_desktop: string;
  image_tablet: string;
  image_mobile: string;
  sort_order: number;
  is_active: boolean;
  destination_type: string;
  destination_category: string | null;
  destination_listing_category: string | null;
  destination_min_discount: number | null;
  destination_id: string | null;
}

const emptyBanner = (): Omit<Banner, "id"> => ({
  title: "",
  link: "",
  image_desktop: "",
  image_tablet: "",
  image_mobile: "",
  sort_order: 0,
  is_active: true,
  destination_type: "offers",
  destination_category: "",
  destination_listing_category: "",
  destination_min_discount: 0,
  destination_id: null,
});

interface ProductOption { id: string; name: string; }

const AdminBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState<Omit<Banner, "id">>(emptyBanner());
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);

  const fetchBanners = async () => {
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });
    setBanners((data as any[] as Banner[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchBanners(); }, []);

  // Carrega opções de produto/build quando o tipo de destino é "item único"
  useEffect(() => {
    const loadOptions = async () => {
      if (form.destination_type === "offer") {
        const { data } = await supabase
          .from("offers")
          .select("id, name")
          .eq("is_active", true)
          .order("name", { ascending: true })
          .limit(500);
        setProductOptions(data ?? []);
      } else if (form.destination_type === "build") {
        const { data } = await supabase
          .from("builds")
          .select("id, name")
          .eq("status", "published")
          .order("name", { ascending: true })
          .limit(500);
        setProductOptions(data ?? []);
      } else {
        setProductOptions([]);
      }
    };
    loadOptions();
  }, [form.destination_type]);

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyBanner(), sort_order: banners.length });
    setShowForm(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({
      title: b.title,
      link: b.link,
      image_desktop: b.image_desktop,
      image_tablet: b.image_tablet,
      image_mobile: b.image_mobile,
      sort_order: b.sort_order,
      is_active: b.is_active,
      destination_type: b.destination_type || "link",
      destination_category: b.destination_category || "",
      destination_listing_category: b.destination_listing_category || "",
      destination_min_discount: b.destination_min_discount || 0,
      destination_id: b.destination_id || null,
    });
    setShowForm(true);
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `banners/${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.image_desktop && !form.image_tablet && !form.image_mobile) {
      toast.error("Adicione pelo menos uma imagem.");
      return;
    }
    if ((form.destination_type === "offer" || form.destination_type === "build") && !form.destination_id) {
      toast.error("Selecione o produto/build de destino.");
      return;
    }
    setSaving(true);
    try {
      const payload: any = { ...form };
      if (editing) {
        const { error } = await supabase.from("banners").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Banner atualizado!");
      } else {
        const { error } = await supabase.from("banners").insert(payload);
        if (error) throw error;
        toast.success("Banner criado!");
      }
      setShowForm(false);
      fetchBanners();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este banner?")) return;
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Banner excluído!"); fetchBanners(); }
  };

  const toggleActive = async (b: Banner) => {
    await supabase.from("banners").update({ is_active: !b.is_active }).eq("id", b.id);
    fetchBanners();
  };

  const isListType = form.destination_type === "offers" || form.destination_type === "builds";
  const isItemType = form.destination_type === "offer" || form.destination_type === "build";
  const categoryOptions = (form.destination_type === "builds") ? BUILD_CATEGORIES : OFFER_CATEGORIES;
  const previewHref = buildBannerHref(form);

  return (
    <AdminLayout>
      <header
        className="relative overflow-hidden text-white"
        style={{ backgroundColor: "#3D3D3D" }}
      >
        {/* Imagem de fundo centralizada com gradiente lateral para preencher telas largas */}
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-cover md:bg-contain"
          style={{
            backgroundImage: `url(${heroBannerImg})`,
          }}
          aria-hidden="true"
        />
        {/* Gradiente que preenche as laterais e suaviza a leitura do texto */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #3D3D3D 0%, rgba(61,61,61,0.85) 30%, rgba(61,61,61,0.55) 50%, rgba(61,61,61,0.85) 75%, #3D3D3D 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 container mx-auto px-4 py-6 md:py-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-xl">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-xl mb-1">Banners</h1>
            <p className="text-white/80 font-light drop-shadow-md text-xs sm:text-sm">
              Gerencie os banners do carrossel da home.
            </p>
          </div>
          <button
            onClick={openNew}
            className="self-start sm:self-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-5 rounded-lg flex items-center gap-2 shadow-lg text-sm"
          >
            <span className="material-symbols-outlined text-lg">add</span>Novo Banner
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 -mt-10 relative z-30 space-y-6">
        {showForm && (
          <AdminFormSection icon="image" iconColor="bg-purple-100 text-purple-600" title={editing ? "Editar Banner" : "Novo Banner"} highlighted>
            <div className="space-y-6">
              {/* Identificação */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Título (opcional)</label>
                  <input
                    className="w-full rounded-lg border border-border bg-card text-foreground text-sm px-3 py-2 focus:ring-primary focus:border-primary"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Nome identificador do banner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Ordem</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-border bg-card text-foreground text-sm px-3 py-2 focus:ring-primary focus:border-primary"
                    value={form.sort_order}
                    onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              {/* Destino */}
              <div className="border border-border rounded-lg p-4 bg-muted/30 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Destino do clique</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {([
                      { v: "offers", l: "Lista de ofertas" },
                      { v: "builds", l: "Lista de builds" },
                      { v: "offer", l: "Oferta única" },
                      { v: "build", l: "Build única" },
                      { v: "link", l: "Link manual" },
                    ] as { v: DestinationType; l: string }[]).map(opt => (
                      <button
                        type="button"
                        key={opt.v}
                        onClick={() => setForm(f => ({ ...f, destination_type: opt.v, destination_category: "", destination_listing_category: "", destination_min_discount: 0, destination_id: null }))}
                        className={`text-xs font-medium rounded-md py-2 px-2 border transition-colors ${
                          form.destination_type === opt.v
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-foreground border-border hover:bg-muted"
                        }`}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>

                {isListType && (
                  <div className="space-y-4">
                    {form.destination_type === "offers" && (
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">Categoria de listagem (opcional)</label>
                        <select
                          className="w-full rounded-lg border border-border bg-card text-foreground text-sm px-3 py-2 focus:ring-primary focus:border-primary"
                          value={form.destination_listing_category || ""}
                          onChange={e => setForm(f => ({ ...f, destination_listing_category: e.target.value }))}
                        >
                          <option value="">Todas as listagens</option>
                          {OFFER_LISTING_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <p className="text-[11px] text-muted-foreground mt-1">Agrupa várias categorias (ex: "Seleção de Portáteis" inclui notebooks, tablets, smartphones etc.).</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">Filtrar por categoria (opcional)</label>
                        <select
                          className="w-full rounded-lg border border-border bg-card text-foreground text-sm px-3 py-2 focus:ring-primary focus:border-primary"
                          value={form.destination_category || ""}
                          onChange={e => setForm(f => ({ ...f, destination_category: e.target.value }))}
                        >
                          <option value="">Todas as categorias</option>
                          {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">Desconto mínimo</label>
                        <select
                          className="w-full rounded-lg border border-border bg-card text-foreground text-sm px-3 py-2 focus:ring-primary focus:border-primary"
                          value={form.destination_min_discount || 0}
                          onChange={e => setForm(f => ({ ...f, destination_min_discount: Number(e.target.value) }))}
                        >
                          {DISCOUNT_FILTER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {isItemType && (
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Selecione {form.destination_type === "offer" ? "a oferta" : "a build"}
                    </label>
                    <select
                      className="w-full rounded-lg border border-border bg-card text-foreground text-sm px-3 py-2 focus:ring-primary focus:border-primary"
                      value={form.destination_id || ""}
                      onChange={e => setForm(f => ({ ...f, destination_id: e.target.value || null }))}
                    >
                      <option value="">— escolha —</option>
                      {productOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                )}

                {form.destination_type === "link" && (
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Link de destino</label>
                    <input
                      className="w-full rounded-lg border border-border bg-card text-foreground text-sm px-3 py-2 focus:ring-primary focus:border-primary"
                      value={form.link}
                      onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                      placeholder="/ofertas ou https://..."
                    />
                  </div>
                )}

                {previewHref && (
                  <div className="text-xs text-muted-foreground">
                    URL final: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">{previewHref}</code>
                  </div>
                )}
              </div>

              {/* Status */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="rounded" />
                <span className="text-sm text-foreground">Banner ativo</span>
              </label>

              <ImageUpload
                label="Imagem do Banner"
                hint="Recomendado: 1200×450px — PNG, JPG até 5MB"
                previewUrl={form.image_desktop || undefined}
                onFileSelect={async (file) => {
                  try {
                    const url = await uploadFile(file, "desktop");
                    setForm(f => ({ ...f, image_desktop: url, image_tablet: url, image_mobile: url }));
                  } catch (e: any) { toast.error(e.message); }
                }}
                onUrlSubmit={(url) => setForm(f => ({ ...f, image_desktop: url, image_tablet: url, image_mobile: url }))}
              />

              <div className="flex gap-3 justify-end pt-4 border-t border-border">
                <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors">
                  {saving ? "Salvando..." : editing ? "Salvar" : "Criar Banner"}
                </button>
              </div>
            </div>
          </AdminFormSection>
        )}

        {/* List */}
        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-lg font-bold text-foreground">Banners cadastrados</h3>
          </div>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Carregando...</div>
          ) : banners.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Nenhum banner cadastrado.</div>
          ) : (
            <div className="divide-y divide-border">
              {banners.map(b => {
                const href = buildBannerHref(b);
                return (
                <div key={b.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                  <div className="w-24 h-14 bg-muted rounded border border-border overflow-hidden flex-shrink-0">
                    {b.image_desktop ? (
                      <img src={b.image_desktop} className="w-full h-full object-cover" alt={b.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-muted-foreground">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">{b.title || "Banner sem título"}</h4>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className={`inline-block w-2 h-2 rounded-full ${b.is_active ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                      <span className="text-xs text-muted-foreground">{b.is_active ? "Ativo" : "Inativo"}</span>
                      <span className="text-xs text-muted-foreground">• Ordem: {b.sort_order}</span>
                      {href && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground truncate max-w-[260px]" title={href}>→ {href}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => toggleActive(b)} className="p-2 rounded-lg hover:bg-muted transition-colors" title={b.is_active ? "Desativar" : "Ativar"}>
                      <span className="material-symbols-outlined text-lg text-muted-foreground">{b.is_active ? "visibility" : "visibility_off"}</span>
                    </button>
                    <button onClick={() => openEdit(b)} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Editar">
                      <span className="material-symbols-outlined text-lg text-muted-foreground">edit</span>
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors" title="Excluir">
                      <span className="material-symbols-outlined text-lg text-destructive">delete</span>
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminBanners;
