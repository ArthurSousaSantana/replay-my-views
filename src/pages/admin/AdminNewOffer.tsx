import { useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import HeroBanner from "@/components/HeroBanner";

const AdminNewOffer = () => {
  const [offerType, setOfferType] = useState<"common" | "part">("common");
  const [specs, setSpecs] = useState([{ id: 1 }, { id: 2 }]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <AdminNavbar />

      <HeroBanner size="sm">
        <nav className="flex mb-2 text-sm font-medium text-blue-200">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a className="inline-flex items-center hover:text-white" href="/admin">
                <span className="material-symbols-outlined text-sm mr-2">dashboard</span>Painel
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
                <span>Ofertas</span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
                <span className="text-white">Nova Oferta</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl">add_circle</span>
          Cadastrar Oferta
        </h1>
      </HeroBanner>

      <main className="container mx-auto px-4 py-8 -mt-8 relative z-30 space-y-8">
        {/* Type Selector */}
        <div className="bg-card rounded-xl shadow-lg border border-border p-2 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setOfferType("common")}
            className={`flex-1 py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all ${offerType === "common" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent hover:border-border"}`}
          >
            <span className="material-symbols-outlined text-2xl">local_offer</span>
            <div className="text-left">
              <div className="font-bold">Oferta Comum</div>
              <div className="text-xs opacity-80">Smartphones, Periféricos, etc.</div>
            </div>
            {offerType === "common" && <span className="material-symbols-outlined ml-auto">check_circle</span>}
          </button>
          <button
            onClick={() => setOfferType("part")}
            className={`flex-1 py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all ${offerType === "part" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent hover:border-border"}`}
          >
            <span className="material-symbols-outlined text-2xl">memory</span>
            <div className="text-left">
              <div className="font-bold">Peça de PC</div>
              <div className="text-xs opacity-70">Reutilizável em builds (CPU, GPU)</div>
            </div>
            {offerType === "part" && <span className="material-symbols-outlined ml-auto">check_circle</span>}
          </button>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/50 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">feed</span>
                <h3 className="font-bold text-foreground">Informações Básicas</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Nome do Produto</label>
                  <input className="w-full rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary shadow-sm px-3 py-2 text-sm" placeholder="Ex: iPhone 15 128GB Preto" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Marca</label>
                  <select className="w-full rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary shadow-sm px-3 py-2 text-sm">
                    <option>Apple</option><option>Samsung</option><option>Logitech</option><option>Nvidia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Modelo</label>
                  <input className="w-full rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary shadow-sm px-3 py-2 text-sm" placeholder="Ex: MTP03BZ/A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Categoria</label>
                  <select className="w-full rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary shadow-sm px-3 py-2 text-sm">
                    <option>Smartphones</option><option>Hardware</option><option>Periféricos</option><option>Computadores</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Subcategoria</label>
                  <select className="w-full rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary shadow-sm px-3 py-2 text-sm">
                    <option>iOS</option><option>Android</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/50 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">description</span>
                <h3 className="font-bold text-foreground">Descrição e Conteúdo</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Descrição Curta (SEO & Cards)</label>
                  <textarea className="w-full rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary shadow-sm text-sm px-3 py-2" rows={2} />
                  <p className="text-xs text-muted-foreground mt-1">Máximo 160 caracteres.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Descrição Longa</label>
                  <textarea className="w-full rounded-lg border border-border bg-card text-foreground focus:ring-primary focus:border-primary shadow-sm text-sm font-mono px-3 py-2" rows={6} />
                  <p className="text-xs text-muted-foreground mt-1">Suporta Markdown simples.</p>
                </div>
                <div className="border-t border-border pt-6">
                  <label className="block text-sm font-medium text-foreground mb-4">Especificações Técnicas (Key/Value)</label>
                  <div className="space-y-3">
                    {specs.map((spec) => (
                      <div key={spec.id} className="flex gap-4">
                        <input className="flex-1 rounded-lg border border-border bg-card text-sm px-3 py-2" placeholder="Característica (ex: Tela)" />
                        <input className="flex-1 rounded-lg border border-border bg-card text-sm px-3 py-2" placeholder="Valor (ex: 6.1 OLED)" />
                        <button type="button" onClick={() => setSpecs(specs.filter((s) => s.id !== spec.id))} className="text-destructive hover:text-destructive/80">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setSpecs([...specs, { id: Date.now() }])} className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                      <span className="material-symbols-outlined text-base">add</span> Adicionar Linha
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Build Data (disabled for common) */}
            <div className={`bg-card rounded-xl shadow-sm border overflow-hidden ${offerType === "part" ? "border-primary/30 ring-1 ring-primary/20" : "border-border"}`}>
              <div className={`px-6 py-4 border-b border-border flex items-center justify-between ${offerType === "part" ? "bg-primary/5" : "bg-muted/50"}`}>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">developer_board</span>
                  <h3 className="font-bold text-foreground">Dados Técnicos de Build</h3>
                </div>
                {offerType === "common" && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Requer 'Peça de PC'</span>
                )}
              </div>
              <div className={`p-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative ${offerType === "common" ? "opacity-50 pointer-events-none grayscale select-none" : ""}`}>
                {offerType === "common" && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/50 backdrop-blur-[1px]">
                    <span className="bg-card px-4 py-2 rounded-lg shadow border border-border text-sm font-medium">Selecione "Peça de PC" acima para habilitar</span>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Tipo de Peça</label>
                  <select className="w-full rounded-lg border border-border bg-card text-foreground px-3 py-2 text-sm">
                    <option>Processador</option><option>Placa de Vídeo</option><option>Placa Mãe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Plataforma</label>
                  <select className="w-full rounded-lg border border-border bg-card text-foreground px-3 py-2 text-sm">
                    <option>Intel</option><option>AMD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Soquete</label>
                  <select className="w-full rounded-lg border border-border bg-card text-foreground px-3 py-2 text-sm">
                    <option>LGA 1700</option><option>AM5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Interface Memória</label>
                  <select className="w-full rounded-lg border border-border bg-card text-foreground px-3 py-2 text-sm">
                    <option>DDR4</option><option>DDR5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">TDP (Watts)</label>
                  <input className="w-full rounded-lg border border-border bg-card text-foreground px-3 py-2 text-sm" type="number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Chipset</label>
                  <input className="w-full rounded-lg border border-border bg-card text-foreground px-3 py-2 text-sm" type="text" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Status */}
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/50 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">visibility</span>
                <h3 className="font-bold text-foreground">Status e Visibilidade</h3>
              </div>
              <div className="p-6 space-y-4">
                {["Ativo", "Visível em Ofertas", "Reutilizável em Builds", "Destaque na Home"].map((label, i) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{label}</span>
                    <input type="checkbox" defaultChecked={i < 2} className="rounded border-border text-primary focus:ring-primary h-5 w-5" />
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/50 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                <h3 className="font-bold text-foreground">Preço e Oferta</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Preço Antigo</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-muted-foreground text-sm">R$</span>
                      <input className="w-full pl-8 py-1.5 rounded-lg border border-border bg-card text-sm" type="number" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Preço Atual</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-muted-foreground text-sm">R$</span>
                      <input className="w-full pl-8 py-1.5 rounded-lg border border-emerald-500 bg-card text-sm focus:ring-emerald-500" type="number" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">% Desconto (Auto)</label>
                  <input className="w-full py-1.5 rounded-lg border border-border bg-muted text-muted-foreground text-sm cursor-not-allowed" disabled value="25%" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Badge Promocional</label>
                  <select className="w-full py-1.5 rounded-lg border border-border bg-card text-sm">
                    <option>Nenhuma</option><option>Frete Grátis</option><option>Lançamento</option><option>Black Friday</option>
                  </select>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input className="rounded border-border text-primary focus:ring-primary" type="checkbox" />
                    Oferta Limitada
                  </label>
                  <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input className="rounded border-border text-primary focus:ring-primary" type="checkbox" defaultChecked />
                    Melhor Preço
                  </label>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/50 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">image</span>
                <h3 className="font-bold text-foreground">Link e Mídia</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">URL Externa (Afiliado)</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-2 top-1.5 text-muted-foreground text-lg">link</span>
                    <input className="w-full pl-8 py-1.5 rounded-lg border border-border bg-card text-sm" type="url" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-2">Imagem Principal</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors">
                    <span className="material-symbols-outlined text-3xl text-muted-foreground mb-1">cloud_upload</span>
                    <span className="text-xs text-muted-foreground">Clique para upload</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-2">Galeria</label>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border border-border">
                      <span className="material-symbols-outlined text-muted-foreground text-xs">add_photo_alternate</span>
                    </div>
                    <div className="aspect-square bg-muted rounded-lg" />
                    <div className="aspect-square bg-muted rounded-lg" />
                    <div className="aspect-square bg-muted rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto flex items-center justify-end gap-4">
          <button className="px-6 py-2.5 rounded-lg border border-destructive/20 text-destructive hover:bg-destructive/5 font-medium transition-colors mr-auto" type="button">
            Excluir
          </button>
          <button className="px-6 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted font-medium transition-colors" type="button">
            Cancelar
          </button>
          <button className="px-8 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2" type="button">
            <span className="material-symbols-outlined">save</span>
            Salvar Oferta
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AdminNewOffer;
