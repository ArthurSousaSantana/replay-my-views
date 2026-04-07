import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layouts/AdminLayout";
import HeroBanner from "@/components/HeroBanner";
import { toast } from "sonner";
import ImageUpload from "@/components/shared/ImageUpload";
import AdminFormSection from "@/components/shared/AdminFormSection";

interface Banner {
  id: string;
  title: string;
  link: string;
  image_desktop: string;
  image_tablet: string;
  image_mobile: string;
  sort_order: number;
  is_active: boolean;
}

const emptyBanner = (): Omit<Banner, "id"> => ({
  title: "",
  link: "",
  image_desktop: "",
  image_tablet: "",
  image_mobile: "",
  sort_order: 0,
  is_active: true,
});

const AdminBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState<Omit<Banner, "id">>(emptyBanner());
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchBanners = async () => {
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });
    setBanners((data as Banner[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchBanners(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyBanner(), sort_order: banners.length });
    setShowForm(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({ title: b.title, link: b.link, image_desktop: b.image_desktop, image_tablet: b.image_tablet, image_mobile: b.image_mobile, sort_order: b.sort_order, is_active: b.is_active });
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
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase.from("banners").update(form).eq("id", editing.id);
        if (error) throw error;
        toast.success("Banner atualizado!");
      } else {
        const { error } = await supabase.from("banners").insert(form);
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

  return (
    <AdminLayout>
      <HeroBanner size="sm">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-xl mb-1">Banners</h1>
            <p className="text-blue-100 font-light drop-shadow-md text-sm">Gerencie os banners do carrossel da home.</p>
          </div>
          <button onClick={openNew} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 shadow-lg text-sm">
            <span className="material-symbols-outlined text-lg">add</span>Novo Banner
          </button>
        </div>
      </HeroBanner>

      <main className="container mx-auto px-4 py-8 -mt-10 relative z-30 space-y-6">
        {/* Form */}
        {showForm && (
          <AdminFormSection icon="image" iconColor="bg-purple-100 text-purple-600" title={editing ? "Editar Banner" : "Novo Banner"} highlighted>
            <div className="space-y-6">
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
                  <label className="block text-sm font-medium text-foreground mb-1">Link de destino</label>
                  <input
                    className="w-full rounded-lg border border-border bg-card text-foreground text-sm px-3 py-2 focus:ring-primary focus:border-primary"
                    value={form.link}
                    onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                    placeholder="/ofertas ou https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Ordem</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-border bg-card text-foreground text-sm px-3 py-2 focus:ring-primary focus:border-primary"
                    value={form.sort_order}
                    onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="rounded" />
                    <span className="text-sm text-foreground">Banner ativo</span>
                  </label>
                </div>
              </div>

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
              {banners.map(b => (
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
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`inline-block w-2 h-2 rounded-full ${b.is_active ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                      <span className="text-xs text-muted-foreground">{b.is_active ? "Ativo" : "Inativo"}</span>
                      <span className="text-xs text-muted-foreground">• Ordem: {b.sort_order}</span>
                      {b.image_desktop && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">Desktop</span>}
                      {b.image_tablet && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">Tablet</span>}
                      {b.image_mobile && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">Mobile</span>}
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
              ))}
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminBanners;
