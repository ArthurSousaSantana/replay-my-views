import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import AdminLayout from "@/components/layouts/AdminLayout";
import HeroBanner from "@/components/HeroBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import AdminFormSection from "@/components/shared/AdminFormSection";
import FormField from "@/components/shared/FormField";
import ImageUpload from "@/components/shared/ImageUpload";
import { formatBRL } from "@/lib/format";

interface PerformanceRow {
  id: string;
  game: string;
  quality: string;
  fps: number;
}

interface SelectedPart {
  id: string;
  name: string;
  short_description: string;
  current_price: number | null;
}

const AdminNewBuild = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SelectedPart[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("Gamer Entry-Level");
  const [badge, setBadge] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState("draft");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState(5);

  const [performances, setPerformances] = useState<PerformanceRow[]>([]);
  const [selectedParts, setSelectedParts] = useState<SelectedPart[]>([]);

  // Load build data when editing
  useEffect(() => {
    if (isEditing) {
      loadBuildData();
    }
  }, [id]);

  // Search offers when query changes
  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchOffers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadBuildData = async () => {
    try {
      setLoading(true);
      const { data: build, error: buildError } = await supabase
        .from("builds")
        .select("*")
        .eq("id", id)
        .single();

      if (buildError) throw buildError;

      setName(build.name);
      setSubtitle(build.subtitle || "");
      setCategory(build.category);
      setBadge(build.badge || "");
      setDescription(build.description || "");
      setIsFeatured(build.is_featured);
      setStatus(build.status);
      setImagePreview(build.image_url || "");
      setDiscountPercentage(build.discount_percentage || 5);

      // Load parts
      const { data: parts, error: partsError } = await supabase
        .from("build_parts")
        .select("offer_id, offers(*)")
        .eq("build_id", id)
        .order("sort_order");

      if (partsError) throw partsError;

      const loadedParts = parts.map((p: any) => ({
        id: p.offers.id,
        name: p.offers.name,
        short_description: p.offers.short_description || "",
        current_price: p.offers.current_price,
      }));
      setSelectedParts(loadedParts);

      // Load performances
      const { data: perfs, error: perfsError } = await supabase
        .from("build_performances")
        .select("*")
        .eq("build_id", id)
        .order("sort_order");

      if (perfsError) throw perfsError;

      setPerformances(perfs || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar build",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchOffers = async () => {
    try {
      setSearchLoading(true);
      const { data, error } = await supabase
        .from("offers")
        .select("id, name, short_description, current_price")
        .ilike("name", `%${searchQuery}%`)
        .eq("is_reusable_in_builds", true)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error: any) {
      console.error("Error searching offers:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const addPerformance = () => {
    setPerformances([...performances, { 
      id: crypto.randomUUID(), 
      game: "", 
      quality: "1080p Ultra", 
      fps: 60 
    }]);
  };

  const updatePerformance = (id: string, field: keyof PerformanceRow, value: any) => {
    setPerformances(performances.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePerformance = (id: string) => {
    setPerformances(performances.filter((p) => p.id !== id));
  };

  const addPart = (part: SelectedPart) => {
    if (!selectedParts.find(p => p.id === part.id)) {
      setSelectedParts([...selectedParts, part]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const removePart = (id: string) => {
    setSelectedParts(selectedParts.filter((p) => p.id !== id));
  };

  const calculatePrices = () => {
    const subtotal = selectedParts.reduce((sum, part) => sum + (part.current_price || 0), 0);
    const discount = subtotal * (discountPercentage / 100);
    const final = subtotal - discount;
    return { subtotal, discount, final };
  };

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, preencha o nome da build.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const { subtotal, final } = calculatePrices();
      
      let imageUrl = imagePreview;

      // Upload image if new file selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const buildData = {
        name,
        subtitle,
        category,
        badge: badge || null,
        description,
        is_featured: isFeatured,
        status,
        image_url: imageUrl,
        total_price: subtotal,
        discount_percentage: discountPercentage,
        final_price: final,
      };

      let buildId = id;

      if (isEditing) {
        const { error: updateError } = await supabase
          .from("builds")
          .update(buildData)
          .eq("id", id);

        if (updateError) throw updateError;
      } else {
        const { data: newBuild, error: insertError } = await supabase
          .from("builds")
          .insert(buildData)
          .select()
          .single();

        if (insertError) throw insertError;
        buildId = newBuild.id;
      }

      // Delete existing parts and performances
      await supabase.from("build_parts").delete().eq("build_id", buildId);
      await supabase.from("build_performances").delete().eq("build_id", buildId);

      // Insert new parts
      if (selectedParts.length > 0) {
        const partsData = selectedParts.map((part, index) => ({
          build_id: buildId,
          offer_id: part.id,
          sort_order: index,
        }));

        const { error: partsError } = await supabase
          .from("build_parts")
          .insert(partsData);

        if (partsError) throw partsError;
      }

      // Insert new performances
      if (performances.length > 0) {
        const perfsData = performances.map((perf, index) => ({
          build_id: buildId,
          game: perf.game,
          quality: perf.quality,
          fps: perf.fps,
          sort_order: index,
        }));

        const { error: perfsError } = await supabase
          .from("build_performances")
          .insert(perfsData);

        if (perfsError) throw perfsError;
      }

      toast({
        title: isEditing ? "Build atualizada!" : "Build criada!",
        description: "As alterações foram salvas com sucesso.",
      });

      navigate("/admin/produtos");
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const prices = calculatePrices();

  if (loading) {
    return (
      <AdminLayout hideFooter>
        <HeroBanner size="sm">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-10 w-96" />
        </HeroBanner>
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </main>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout hideFooter>
      <HeroBanner size="sm">
        <div className="mb-2">
          <Breadcrumb variant="light" items={[{ label: "Admin", to: "/admin" }, { label: "Builds" }, { label: isEditing ? "Editar Build" : "Nova Build" }]} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-xl">
          {isEditing ? "Editar Build" : "Cadastrar Nova Build"}
        </h1>
        <p className="text-blue-100 mt-2 max-w-2xl font-light">
          {isEditing ? "Atualize a configuração do PC." : "Crie uma nova configuração de PC para oferecer aos clientes."}
        </p>
      </HeroBanner>

      <main className="container mx-auto px-4 py-8 -mt-8 z-30 relative pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <AdminFormSection icon="description" title="Informações Básicas" headerRight={
              <label className="flex items-center cursor-pointer gap-3">
                <span className="text-sm font-medium text-muted-foreground">Destaque</span>
                <input 
                  type="checkbox" 
                  className="rounded border-border text-primary focus:ring-primary" 
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
              </label>
            }>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField 
                    type="text" 
                    label="Nome da Build" 
                    placeholder="Ex: The 4K Monster"
                    value={name}
                    onChange={setName}
                  />
                  <FormField 
                    type="text" 
                    label="Subtítulo Promocional" 
                    placeholder="Ex: Performance extrema para criadores"
                    value={subtitle}
                    onChange={setSubtitle}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField 
                    type="select" 
                    label="Categoria" 
                    options={["Gamer Entry-Level", "Gamer Mid-Range", "Gamer High-End", "Workstation", "Office"]}
                    value={category}
                    onChange={setCategory}
                  />
                  <FormField 
                    type="select" 
                    label="Badges / Tags" 
                    options={["", "Lançamento", "Oferta Limitada", "RGB Pro", "Silent Build"]}
                    value={badge}
                    onChange={setBadge}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField 
                    type="select" 
                    label="Status" 
                    options={["draft", "published"]}
                    value={status}
                    onChange={setStatus}
                  />
                  <FormField 
                    type="number" 
                    label="Desconto do Bundle (%)" 
                    placeholder="5"
                    value={discountPercentage}
                    onChange={(v) => setDiscountPercentage(Number(v))}
                    suffix="%"
                  />
                </div>
                <FormField 
                  type="textarea" 
                  label="Descrição Longa" 
                  placeholder="Descreva os principais benefícios e casos de uso desta build..." 
                  rows={4}
                  value={description}
                  onChange={setDescription}
                />
                <ImageUpload 
                  label="Imagem Principal" 
                  previewUrl={imagePreview}
                  onFileSelect={handleImageSelect}
                />
              </div>
            </AdminFormSection>

            {/* Performance */}
            <AdminFormSection icon="speed" iconColor="bg-purple-100 text-purple-600" title="Performance Estimada" headerRight={
              <button onClick={addPerformance} className="text-primary hover:underline text-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">add_circle</span> Adicionar Performance
              </button>
            }>
              <div className="space-y-4">
                <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  <div className="col-span-5">Jogo / Aplicação</div>
                  <div className="col-span-4">Qualidade / Resolução</div>
                  <div className="col-span-2">FPS Médio</div>
                  <div className="col-span-1 text-center">Ações</div>
                </div>
                {performances.map((perf) => (
                  <div key={perf.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-muted/50 p-3 rounded-lg border border-border">
                    <div className="col-span-12 md:col-span-5">
                      <input 
                        className="w-full text-sm rounded border border-border bg-card text-foreground px-3 py-2" 
                        placeholder="Nome do Jogo" 
                        value={perf.game}
                        onChange={(e) => updatePerformance(perf.id, 'game', e.target.value)}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <select 
                        className="w-full text-sm rounded border border-border bg-card text-foreground px-3 py-2" 
                        value={perf.quality}
                        onChange={(e) => updatePerformance(perf.id, 'quality', e.target.value)}
                      >
                        <option>4K Ultra / DLSS On</option>
                        <option>1440p High</option>
                        <option>1440p Competitive</option>
                        <option>1080p Ultra</option>
                      </select>
                    </div>
                    <div className="col-span-12 md:col-span-2">
                      <div className="relative">
                        <input 
                          className="w-full text-sm rounded border border-border bg-card text-foreground px-3 py-2 pr-10" 
                          type="number" 
                          value={perf.fps}
                          onChange={(e) => updatePerformance(perf.id, 'fps', Number(e.target.value))}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">FPS</span>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-1 text-center flex justify-end md:justify-center">
                      <button type="button" onClick={() => removePerformance(perf.id)} className="text-destructive hover:text-destructive/80 p-1 rounded hover:bg-destructive/10">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </AdminFormSection>

            {/* PC Composition */}
            <AdminFormSection icon="memory" iconColor="bg-emerald-100 text-emerald-600" title="Composição do PC">
              <div className="space-y-5">
                {/* Search bar */}
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-muted-foreground text-xl">search</span>
                    <input
                      className="w-full pl-10 rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary text-sm px-3 py-2.5"
                      placeholder="Buscar peça pelo nome..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    )}
                    {searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                        {searchResults.map((result) => (
                          <button
                            key={result.id}
                            type="button"
                            onClick={() => addPart(result)}
                            className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-b-0"
                          >
                            <p className="text-sm font-semibold text-foreground">{result.name}</p>
                            <p className="text-xs text-muted-foreground">{result.short_description}</p>
                            <p className="text-xs text-primary font-medium mt-1">{formatBRL(result.current_price)}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/ofertas/nova")}
                    className="px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium transition-colors border border-border flex items-center gap-2 whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Cadastrar Nova Peça
                  </button>
                </div>

                {/* Selected parts list */}
                {selectedParts.length === 0 ? (
                  <div className="border border-dashed border-border rounded-lg p-6 flex items-center justify-center text-muted-foreground text-sm">
                    Nenhuma peça adicionada. Busque e selecione peças acima.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-muted-foreground uppercase">Peças selecionadas ({selectedParts.length})</label>
                    {selectedParts.map((part) => (
                      <div key={part.id} className="bg-muted/50 border border-border rounded-lg p-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-card rounded border border-border flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-muted-foreground">memory</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{part.name}</p>
                            <p className="text-xs text-muted-foreground">{part.short_description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-sm font-semibold text-foreground">{formatBRL(part.current_price)}</span>
                          <button type="button" onClick={() => removePart(part.id)} className="text-destructive hover:text-destructive/80 p-1 rounded hover:bg-destructive/10">
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AdminFormSection>
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1">
            <section className="bg-card rounded-xl shadow-lg border border-border sticky top-24">
              <div className="p-6 border-b border-border bg-muted/50">
                <h2 className="text-lg font-bold text-foreground">Resumo da Build</h2>
                <p className="text-xs text-muted-foreground mt-1">Visão geral de preços e itens selecionados.</p>
              </div>
              <div className="p-6">
                {selectedParts.length > 0 ? (
                  <ul className="space-y-4 text-sm mb-6">
                    {selectedParts.map((part, index) => (
                      <li key={part.id} className="flex justify-between items-center text-muted-foreground">
                        <span className="truncate w-40">{part.name}</span>
                        <span>{formatBRL(part.current_price)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground mb-6 italic">Nenhuma peça selecionada</p>
                )}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between items-center text-muted-foreground text-sm">
                    <span>Subtotal</span>
                    <span>{formatBRL(prices.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-600 text-sm font-medium">
                    <span>Desconto do Bundle ({discountPercentage}%)</span>
                    <span>- {formatBRL(prices.discount)}</span>
                  </div>
                  <div className="flex justify-between items-end mt-4 pt-2 border-t border-border">
                    <div>
                      <span className="block text-xs text-muted-foreground">Preço Final</span>
                      <span className="text-2xl font-bold text-foreground">{formatBRL(prices.final)}</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">
                      Economia: {formatBRL(prices.discount)}
                    </span>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-3 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">save</span>
                        {isEditing ? "Atualizar Build" : "Salvar Build"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminNewBuild;
