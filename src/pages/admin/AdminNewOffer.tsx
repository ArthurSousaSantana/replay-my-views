import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminLayout from "@/components/layouts/AdminLayout";
import HeroBanner from "@/components/HeroBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import AdminFormSection from "@/components/shared/AdminFormSection";
import FormField from "@/components/shared/FormField";
import ImageUpload from "@/components/shared/ImageUpload";

const CATEGORIES = ["Hardware", "Smartphones", "Periféricos", "Mobiliário", "Acessórios", "Gadgets", "Notebooks", "Áudio", "Monitores", "Redes", "Armazenamento", "Games", "Iluminação", "Escritório", "Ergonomia", "Componentes", "Conectividade", "Tablets", "Wearables", "Suportes"];
const LISTING_CATEGORIES = ["Ofertas Tech", "Seleção de Portáteis"];
const BADGES = ["Nenhuma", "Frete Grátis", "Lançamento", "Black Friday", "Menor Preço", "Cupom Ativo", "Seleção do Editor", "Estoque Baixo", "Preço de Bug", "Cashback", "Exclusivo Prime", "Kit Completo", "Relíquia", "Estoque no Brasil"];

interface SpecRow {
  id: number;
  key: string;
  value: string;
}

const AdminNewOffer = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [listingCategory, setListingCategory] = useState(LISTING_CATEGORIES[0]);
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [specs, setSpecs] = useState<SpecRow[]>([{ id: 1, key: "", value: "" }, { id: 2, key: "", value: "" }]);
  const [isActive, setIsActive] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isReusable, setIsReusable] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [oldPrice, setOldPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [promoBadge, setPromoBadge] = useState(BADGES[0]);
  const [isLimited, setIsLimited] = useState(false);
  const [isBestPrice, setIsBestPrice] = useState(true);
  const [externalUrl, setExternalUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const discountPercentage = oldPrice && currentPrice && Number(oldPrice) > 0
    ? Math.round(((Number(oldPrice) - Number(currentPrice)) / Number(oldPrice)) * 100)
    : 0;

  // Load existing offer for editing
  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.from("offers").select("*").eq("id", id).maybeSingle();
      if (error || !data) {
        toast.error("Oferta não encontrada.");
        navigate("/admin/produtos");
        return;
      }
      setName(data.name);
      setCategory(data.category || CATEGORIES[0]);
      setListingCategory(data.listing_category || LISTING_CATEGORIES[0]);
      setShortDescription(data.short_description || "");
      setLongDescription(data.long_description || "");
      const specsData = (data.specs as { key: string; value: string }[] | null) || [];
      setSpecs(specsData.length > 0 ? specsData.map((s, i) => ({ id: i, key: s.key, value: s.value })) : [{ id: 1, key: "", value: "" }]);
      setIsActive(data.is_active);
      setIsVisible(data.is_visible);
      setIsReusable(data.is_reusable_in_builds);
      setIsFeatured(data.is_featured);
      setOldPrice(data.old_price?.toString() || "");
      setCurrentPrice(data.current_price?.toString() || "");
      setPromoBadge(data.promo_badge || BADGES[0]);
      setIsLimited(data.is_limited_offer);
      setIsBestPrice(data.is_best_price);
      setExternalUrl(data.external_url || "");
      setImagePreview(data.image_url || "");
      setLoadingData(false);
    })();
  }, [id, navigate]);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUrl = (url: string) => {
    setImageFile(null);
    setImagePreview(url);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imagePreview || null;
    const ext = imageFile.name.split(".").pop();
    const path = `offers/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, imageFile);
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (asDraft: boolean) => {
    if (!name.trim()) {
      toast.error("O nome do produto é obrigatório.");
      return;
    }
    setLoading(true);
    try {
      const imageUrl = await uploadImage();
      const specsJson = specs.filter(s => s.key.trim()).map(s => ({ key: s.key, value: s.value }));

      const payload = {
        name: name.trim(),
        category,
        listing_category: listingCategory,
        short_description: shortDescription,
        long_description: longDescription,
        specs: specsJson,
        is_active: asDraft ? false : isActive,
        is_visible: asDraft ? false : isVisible,
        is_reusable_in_builds: isReusable,
        is_featured: isFeatured,
        old_price: oldPrice ? Number(oldPrice) : null,
        current_price: currentPrice ? Number(currentPrice) : null,
        discount_percentage: discountPercentage || null,
        promo_badge: promoBadge === "Nenhuma" ? null : promoBadge,
        is_limited_offer: isLimited,
        is_best_price: isBestPrice,
        external_url: externalUrl,
        image_url: imageUrl,
      };

      if (isEditing) {
        const { error } = await supabase.from("offers").update(payload).eq("id", id);
        if (error) throw error;
        toast.success("Oferta atualizada com sucesso!");
      } else {
        const { error } = await supabase.from("offers").insert(payload);
        if (error) throw error;
        toast.success(asDraft ? "Rascunho salvo!" : "Oferta publicada com sucesso!");
      }
      navigate("/admin/produtos");
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar oferta.");
    } finally {
      setLoading(false);
    }
  };

  const updateSpec = (specId: number, field: "key" | "value", val: string) => {
    setSpecs(specs.map(s => s.id === specId ? { ...s, [field]: val } : s));
  };

  if (loadingData) {
    return (
      <AdminLayout hideFooter>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout hideFooter>
      <HeroBanner size="sm">
        <div className="mb-2">
          <Breadcrumb variant="light" items={[{ label: "Painel", to: "/admin" }, { label: "Ofertas", to: "/admin/produtos" }, { label: isEditing ? "Editar Oferta" : "Nova Oferta" }]} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl">{isEditing ? "edit" : "add_circle"}</span>
          {isEditing ? "Editar Oferta" : "Cadastrar Oferta"}
        </h1>
      </HeroBanner>

      <main className="container mx-auto px-4 py-8 -mt-8 relative z-30 space-y-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AdminFormSection icon="feed" title="Informações Básicas">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField className="md:col-span-2" type="text" label="Nome do Produto" placeholder="Ex: iPhone 15 128GB Preto" value={name} onChange={setName} />
                <FormField type="select" label="Categoria" options={CATEGORIES} value={category} onChange={setCategory} />
              </div>
            </AdminFormSection>

            <AdminFormSection icon="description" title="Descrição e Conteúdo">
              <div className="space-y-6">
                <FormField type="textarea" label="Descrição Curta (SEO & Cards)" rows={2} hint="Máximo 160 caracteres." value={shortDescription} onChange={setShortDescription} />
                <FormField type="textarea" label="Descrição Longa" rows={6} mono hint="Suporta Markdown simples." value={longDescription} onChange={setLongDescription} />
                <div className="border-t border-border pt-6">
                  <label className="block text-sm font-medium text-foreground mb-4">Especificações Técnicas (Key/Value)</label>
                  <div className="space-y-3">
                    {specs.map((spec) => (
                      <div key={spec.id} className="flex gap-4">
                        <input className="flex-1 rounded-lg border border-border bg-card text-sm px-3 py-2" placeholder="Característica (ex: Tela)" value={spec.key} onChange={(e) => updateSpec(spec.id, "key", e.target.value)} />
                        <input className="flex-1 rounded-lg border border-border bg-card text-sm px-3 py-2" placeholder="Valor (ex: 6.1 OLED)" value={spec.value} onChange={(e) => updateSpec(spec.id, "value", e.target.value)} />
                        <button type="button" onClick={() => setSpecs(specs.filter((s) => s.id !== spec.id))} className="text-destructive hover:text-destructive/80">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setSpecs([...specs, { id: Date.now(), key: "", value: "" }])} className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                      <span className="material-symbols-outlined text-base">add</span> Adicionar Linha
                    </button>
                  </div>
                </div>
              </div>
            </AdminFormSection>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <AdminFormSection icon="visibility" title="Status e Visibilidade">
              <div className="space-y-4">
                {[
                  { label: "Ativo", checked: isActive, set: setIsActive },
                  { label: "Visível em Ofertas", checked: isVisible, set: setIsVisible },
                  { label: "Reutilizável em Builds", checked: isReusable, set: setIsReusable },
                  { label: "Destaque na Home", checked: isFeatured, set: setIsFeatured },
                ].map(({ label, checked, set }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{label}</span>
                    <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)} className="rounded border-border text-primary focus:ring-primary h-5 w-5" />
                  </div>
                ))}
              </div>
            </AdminFormSection>

            <AdminFormSection icon="payments" title="Preço e Oferta">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField type="number" label="Preço Antigo" prefix="R$" labelSize="xs" value={oldPrice} onChange={setOldPrice} />
                  <FormField type="number" label="Preço Atual" prefix="R$" labelSize="xs" value={currentPrice} onChange={setCurrentPrice} />
                </div>
                <FormField type="text" label="% Desconto (Auto)" disabled value={discountPercentage ? `${discountPercentage}%` : "0%"} labelSize="xs" />
                <FormField type="select" label="Badge Promocional" options={BADGES} labelSize="xs" value={promoBadge} onChange={setPromoBadge} />
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input className="rounded border-border text-primary focus:ring-primary" type="checkbox" checked={isLimited} onChange={(e) => setIsLimited(e.target.checked)} />
                    Oferta Limitada
                  </label>
                  <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input className="rounded border-border text-primary focus:ring-primary" type="checkbox" checked={isBestPrice} onChange={(e) => setIsBestPrice(e.target.checked)} />
                    Melhor Preço
                  </label>
                </div>
              </div>
            </AdminFormSection>

            <AdminFormSection icon="image" title="Link e Mídia">
              <div className="space-y-4">
                <FormField type="url" label="URL Externa (Afiliado)" prefix="🔗" labelSize="xs" value={externalUrl} onChange={setExternalUrl} />
                <ImageUpload label="Imagem Principal" compact previewUrl={imagePreview} onFileSelect={handleImageSelect} onUrlSubmit={handleImageUrl} />
              </div>
            </AdminFormSection>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSubmit(false)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 text-base disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
                ) : (
                  <>
                    <span className="material-symbols-outlined">publish</span>
                    {isEditing ? "Atualizar Oferta" : "Publicar Oferta"}
                  </>
                )}
              </button>
              {!isEditing && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSubmit(true)}
                  className="w-full bg-muted hover:opacity-80 text-foreground font-medium py-3 rounded-xl transition-colors border border-border flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">draft</span>Salvar Rascunho
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminNewOffer;
