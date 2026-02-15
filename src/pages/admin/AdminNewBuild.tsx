import { useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import HeroBanner from "@/components/HeroBanner";

interface PerformanceRow {
  id: number;
  game: string;
  quality: string;
  fps: number;
}

const AdminNewBuild = () => {
  const [performances, setPerformances] = useState<PerformanceRow[]>([
    { id: 1, game: "Cyberpunk 2077", quality: "4K Ultra / DLSS On", fps: 85 },
    { id: 2, game: "Call of Duty: Warzone", quality: "1440p Competitive", fps: 165 },
  ]);

  const addPerformance = () => {
    setPerformances([...performances, { id: Date.now(), game: "", quality: "1080p Ultra", fps: 60 }]);
  };

  const removePerformance = (id: number) => {
    setPerformances(performances.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <AdminNavbar />

      <HeroBanner size="sm">
        <div className="flex items-center gap-2 text-blue-200 text-sm mb-2 font-medium">
          <a className="hover:text-white" href="/admin">Admin</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span>Builds</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span>Nova Build</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-xl">
          Cadastrar Nova Build
        </h1>
        <p className="text-blue-100 mt-2 max-w-2xl font-light">Crie uma nova configuração de PC para oferecer aos clientes.</p>
      </HeroBanner>

      <main className="container mx-auto px-4 py-8 -mt-8 z-30 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <section className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="border-b border-border p-6 flex justify-between items-center bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <span className="material-symbols-outlined">description</span>
                  </span>
                  <h2 className="text-lg font-bold text-foreground">Informações Básicas</h2>
                </div>
                <label className="flex items-center cursor-pointer gap-3">
                  <span className="text-sm font-medium text-muted-foreground">Destaque</span>
                  <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                </label>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Nome da Build</label>
                    <input className="w-full rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary px-3 py-2 text-sm" placeholder="Ex: The 4K Monster" type="text" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Subtítulo Promocional</label>
                    <input className="w-full rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary px-3 py-2 text-sm" placeholder="Ex: Performance extrema para criadores" type="text" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Categoria</label>
                    <select className="w-full rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary px-3 py-2 text-sm">
                      <option>Selecionar Categoria...</option>
                      <option>Gamer Entry-Level</option>
                      <option>Gamer Mid-Range</option>
                      <option>Gamer High-End</option>
                      <option>Workstation</option>
                      <option>Office</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Badges / Tags</label>
                    <select className="w-full rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary px-3 py-2 text-sm" multiple>
                      <option>Lançamento</option>
                      <option>Oferta Limitada</option>
                      <option>RGB Pro</option>
                      <option>Silent Build</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Descrição Longa</label>
                  <textarea className="w-full rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary px-3 py-2 text-sm" placeholder="Descreva os principais benefícios e casos de uso desta build..." rows={4} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Imagem Principal</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-4xl text-muted-foreground mb-2">cloud_upload</span>
                    <p className="text-sm text-muted-foreground">Arraste uma imagem ou clique para selecionar</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG até 5MB</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Performance */}
            <section className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="border-b border-border p-6 flex justify-between items-center bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <span className="material-symbols-outlined">speed</span>
                  </span>
                  <h2 className="text-lg font-bold text-foreground">Performance Estimada</h2>
                </div>
                <button onClick={addPerformance} className="text-primary hover:underline text-sm font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">add_circle</span> Adicionar Performance
                </button>
              </div>
              <div className="p-6 space-y-4">
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
            </section>

            {/* PC Composition */}
            <section className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="border-b border-border p-6 flex justify-between items-center bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <span className="material-symbols-outlined">memory</span>
                  </span>
                  <h2 className="text-lg font-bold text-foreground">Composição do PC</h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* CPU */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Processador (CPU)</label>
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex-1 w-full relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-muted-foreground">search</span>
                      <input className="w-full pl-10 rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary text-sm px-3 py-2" placeholder="Buscar processador..." />
                    </div>
                    <button className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium transition-colors">Adicionar Novo</button>
                  </div>
                  <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-card rounded border border-border flex items-center justify-center">
                        <span className="material-symbols-outlined text-muted-foreground text-xl">developer_board</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Intel Core i9-13900K</p>
                        <p className="text-xs text-muted-foreground">24 Cores / 32 Threads - 5.8GHz</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-foreground">R$ 3.899,00</span>
                      <button className="text-primary text-xs font-medium underline">Trocar</button>
                    </div>
                  </div>
                </div>

                <hr className="border-border" />

                {/* GPU */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Placa de Vídeo (GPU)</label>
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex-1 w-full relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-muted-foreground">search</span>
                      <input className="w-full pl-10 rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary text-sm px-3 py-2" placeholder="Buscar GPU..." />
                    </div>
                    <button className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium transition-colors">Adicionar Novo</button>
                  </div>
                  <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-card rounded border border-border flex items-center justify-center">
                        <span className="material-symbols-outlined text-muted-foreground text-xl">videogame_asset</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">NVIDIA GeForce RTX 4090 24GB</p>
                        <p className="text-xs text-muted-foreground">ASUS ROG Strix OC Edition</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-foreground">R$ 11.499,00</span>
                      <button className="text-primary text-xs font-medium underline">Trocar</button>
                    </div>
                  </div>
                </div>

                <hr className="border-border" />

                {/* Motherboard */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Placa-Mãe</label>
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex-1 w-full relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-muted-foreground">search</span>
                      <input className="w-full pl-10 rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary text-sm px-3 py-2" placeholder="Buscar placa-mãe..." />
                    </div>
                    <button className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium transition-colors">Adicionar Novo</button>
                  </div>
                  <div className="mt-3 border border-dashed border-border rounded-lg p-3 flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    Nenhum produto selecionado
                  </div>
                </div>

                {/* Other components */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["Memória RAM", "Armazenamento (SSD)", "Fonte (PSU)", "Gabinete"].map((label) => (
                    <div key={label}>
                      <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">{label}</label>
                      <select className="w-full rounded-lg border border-border bg-card text-foreground text-sm px-3 py-2">
                        <option>Selecionar {label}...</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </section>
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
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex gap-2">
                    <span className="material-symbols-outlined text-yellow-600 text-xl">warning</span>
                    <p className="text-xs text-yellow-800">
                      Atenção: A build está incompleta. Selecione Placa-Mãe, RAM, SSD e Fonte para validar.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg z-50">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground hidden sm:block">
            Última alteração: <span className="font-medium text-foreground">Agora mesmo</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 border border-border rounded-lg text-foreground font-medium hover:bg-muted transition-colors">
              Cancelar
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 border border-destructive/20 text-destructive bg-destructive/5 rounded-lg font-medium hover:bg-destructive/10 transition-colors">
              Excluir Build
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">visibility</span> Visualizar
            </button>
            <button className="flex-1 sm:flex-none px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">save</span> Salvar Build
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewBuild;
