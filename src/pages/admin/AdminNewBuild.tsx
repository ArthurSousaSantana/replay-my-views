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
  const [performances, setPerformances] = useState<PerformanceRow[]>([
    { id: 1, game: "Cyberpunk 2077", quality: "4K Ultra / DLSS On", fps: 85 },
    { id: 2, game: "Call of Duty: Warzone", quality: "1440p Competitive", fps: 165 },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParts, setSelectedParts] = useState<SelectedPart[]>([
    { id: 1, name: "Intel Core i9-13900K", description: "24 Cores / 32 Threads - 5.8GHz", price: "R$ 3.899,00" },
    { id: 2, name: "NVIDIA GeForce RTX 4090 24GB", description: "ASUS ROG Strix OC Edition", price: "R$ 11.499,00" },
  ]);

  const addPerformance = () => {
    setPerformances([...performances, { id: Date.now(), game: "", quality: "1080p Ultra", fps: 60 }]);
  };

  const removePerformance = (id: number) => {
    setPerformances(performances.filter((p) => p.id !== id));
  };

  const removePart = (id: number) => {
    setSelectedParts(selectedParts.filter((p) => p.id !== id));
  };

  return (
    <AdminLayout hideFooter>
      <HeroBanner size="sm">
        <div className="mb-2">
          <Breadcrumb variant="light" items={[{ label: "Admin", to: "/admin" }, { label: "Builds" }, { label: "Nova Build" }]} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-xl">Cadastrar Nova Build</h1>
        <p className="text-blue-100 mt-2 max-w-2xl font-light">Crie uma nova configuração de PC para oferecer aos clientes.</p>
      </HeroBanner>

      <main className="container mx-auto px-4 py-8 -mt-8 z-30 relative pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <AdminFormSection icon="description" title="Informações Básicas" headerRight={
              <label className="flex items-center cursor-pointer gap-3">
                <span className="text-sm font-medium text-muted-foreground">Destaque</span>
                <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
              </label>
            }>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField type="text" label="Nome da Build" placeholder="Ex: The 4K Monster" />
                  <FormField type="text" label="Subtítulo Promocional" placeholder="Ex: Performance extrema para criadores" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField type="select" label="Categoria" options={["Selecionar Categoria...", "Gamer Entry-Level", "Gamer Mid-Range", "Gamer High-End", "Workstation", "Office"]} />
                  <FormField type="select" label="Badges / Tags" options={["Selecionar Tag...", "Lançamento", "Oferta Limitada", "RGB Pro", "Silent Build"]} />
                </div>
                <FormField type="textarea" label="Descrição Longa" placeholder="Descreva os principais benefícios e casos de uso desta build..." rows={4} />
                <ImageUpload label="Imagem Principal" />
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
                      <input className="w-full text-sm rounded border border-border bg-card text-foreground px-3 py-2" placeholder="Nome do Jogo" defaultValue={perf.game} />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <select className="w-full text-sm rounded border border-border bg-card text-foreground px-3 py-2" defaultValue={perf.quality}>
                        <option>4K Ultra / DLSS On</option>
                        <option>1440p High</option>
                        <option>1440p Competitive</option>
                        <option>1080p Ultra</option>
                      </select>
                    </div>
                    <div className="col-span-12 md:col-span-2">
                      <div className="relative">
                        <input className="w-full text-sm rounded border border-border bg-card text-foreground px-3 py-2 pr-10" type="number" defaultValue={perf.fps} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">FPS</span>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-1 text-center flex justify-end md:justify-center">
                      <button onClick={() => removePerformance(perf.id)} className="text-destructive hover:text-destructive/80 p-1 rounded hover:bg-destructive/10">
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
                            <p className="text-xs text-muted-foreground">{part.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-sm font-semibold text-foreground">{part.price}</span>
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
                <ul className="space-y-4 text-sm mb-6">
                  <li className="flex justify-between items-center text-muted-foreground">
                    <span className="truncate w-40">CPU: Intel Core i9</span>
                    <span>R$ 3.899,00</span>
                  </li>
                  <li className="flex justify-between items-center text-muted-foreground">
                    <span className="truncate w-40">GPU: RTX 4090</span>
                    <span>R$ 11.499,00</span>
                  </li>
                  <li className="flex justify-between items-center text-muted-foreground/50 italic">
                    <span className="truncate w-40">Placa-mãe...</span>
                    <span>-</span>
                  </li>
                  <li className="flex justify-between items-center text-muted-foreground/50 italic">
                    <span className="truncate w-40">Memória RAM...</span>
                    <span>-</span>
                  </li>
                </ul>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between items-center text-muted-foreground text-sm">
                    <span>Subtotal</span>
                    <span>R$ 15.398,00</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-600 text-sm font-medium">
                    <span>Desconto do Bundle (5%)</span>
                    <span>- R$ 769,90</span>
                  </div>
                  <div className="flex justify-between items-end mt-4 pt-2 border-t border-border">
                    <div>
                      <span className="block text-xs text-muted-foreground">Preço Final</span>
                      <span className="text-2xl font-bold text-foreground">R$ 14.628,10</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">Economia: R$ 769,90</span>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-3 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">save</span>Salvar Build
                  </button>
                  <button className="w-full bg-muted hover:opacity-80 text-foreground font-medium py-3 rounded-lg transition-colors border border-border flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">visibility</span>Pré-visualizar
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
