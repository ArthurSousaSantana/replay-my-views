import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import HeroBanner from "@/components/HeroBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import AdminFormSection from "@/components/shared/AdminFormSection";
import FormField from "@/components/shared/FormField";
import ImageUpload from "@/components/shared/ImageUpload";

interface PerformanceRow {
  id: number;
  game: string;
  quality: string;
  fps: number;
}

interface PartRow {
  id: number;
  name: string;
  description: string;
  category: string;
  price: string;
}

const AdminNewBuild = () => {
  const [performances, setPerformances] = useState<PerformanceRow[]>([
    { id: 1, game: "Cyberpunk 2077", quality: "4K Ultra / DLSS On", fps: 85 },
    { id: 2, game: "Call of Duty: Warzone", quality: "1440p Competitive", fps: 165 },
  ]);

  const [parts, setParts] = useState<PartRow[]>([
    { id: 1, name: "Intel Core i9-13900K", description: "24 Cores / 32 Threads", category: "Processador (CPU)", price: "3899" },
    { id: 2, name: "NVIDIA GeForce RTX 4090", description: "24GB GDDR6X", category: "Placa de Vídeo (GPU)", price: "11499" },
  ]);

  const addPerformance = () => {
    setPerformances([...performances, { id: Date.now(), game: "", quality: "1080p Ultra", fps: 60 }]);
  };

  const removePerformance = (id: number) => {
    setPerformances(performances.filter((p) => p.id !== id));
  };

  const addPart = () => {
    setParts([...parts, { id: Date.now(), name: "", description: "", category: "", price: "" }]);
  };

  const removePart = (id: number) => {
    setParts(parts.filter((p) => p.id !== id));
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
                  <FormField type="select" label="Badges / Tags" options={["Lançamento", "Oferta Limitada", "RGB Pro", "Silent Build"]} multiple />
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
            <AdminFormSection icon="memory" iconColor="bg-emerald-100 text-emerald-600" title="Composição do PC" headerRight={
              <button type="button" onClick={addPart} className="text-primary hover:underline text-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">add_circle</span> Adicionar Peça
              </button>
            }>
              <div className="space-y-4">
                {parts.length === 0 && (
                  <div className="border border-dashed border-border rounded-lg p-6 flex items-center justify-center text-muted-foreground text-sm">
                    Nenhuma peça adicionada. Clique em "Adicionar Peça" para começar.
                  </div>
                )}
                {parts.map((part, index) => (
                  <div key={part.id} className="bg-muted/50 p-4 rounded-lg border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Peça #{index + 1}</span>
                      <button type="button" onClick={() => removePart(part.id)} className="text-destructive hover:text-destructive/80 p-1 rounded hover:bg-destructive/10">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input className="w-full text-sm rounded-lg border border-border bg-card text-foreground px-3 py-2" placeholder="Nome da peça (ex: RTX 4090)" defaultValue={part.name} />
                      <input className="w-full text-sm rounded-lg border border-border bg-card text-foreground px-3 py-2" placeholder="Descrição curta (ex: 24GB GDDR6X)" defaultValue={part.description} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select className="w-full text-sm rounded-lg border border-border bg-card text-foreground px-3 py-2" defaultValue={part.category}>
                        <option value="">Tipo de peça...</option>
                        <option>Processador (CPU)</option>
                        <option>Placa de Vídeo (GPU)</option>
                        <option>Placa-Mãe</option>
                        <option>Memória RAM</option>
                        <option>Armazenamento (SSD/HDD)</option>
                        <option>Fonte (PSU)</option>
                        <option>Gabinete</option>
                        <option>Cooler / Refrigeração</option>
                        <option>Outro</option>
                      </select>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                        <input className="w-full text-sm rounded-lg border border-border bg-card text-foreground pl-9 pr-3 py-2" type="number" placeholder="0,00" defaultValue={part.price} />
                      </div>
                    </div>
                  </div>
                ))}
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
