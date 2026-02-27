import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import HeroBanner from "@/components/HeroBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import AdminFormSection from "@/components/shared/AdminFormSection";
import FormField from "@/components/shared/FormField";
import ImageUpload from "@/components/shared/ImageUpload";

const AdminNewOffer = () => {
  const [offerType, setOfferType] = useState<"common" | "part">("common");
  const [specs, setSpecs] = useState([{ id: 1 }, { id: 2 }]);

  return (
    <AdminLayout hideFooter>
      <HeroBanner size="sm">
        <div className="mb-2">
          <Breadcrumb variant="light" items={[{ label: "Painel", to: "/admin" }, { label: "Ofertas" }, { label: "Nova Oferta" }]} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl">add_circle</span>
          Cadastrar Oferta
        </h1>
      </HeroBanner>

      <main className="container mx-auto px-4 py-8 -mt-8 relative z-30 space-y-8 pb-24">
        {/* Type Selector */}
        <div className="bg-card rounded-xl shadow-lg border border-border p-2 flex flex-col sm:flex-row gap-2">
          {[
            { type: "common" as const, icon: "local_offer", title: "Oferta Comum", desc: "Smartphones, Periféricos, etc." },
            { type: "part" as const, icon: "memory", title: "Peça de PC", desc: "Reutilizável em builds (CPU, GPU)" },
          ].map((opt) => (
            <button
              key={opt.type}
              onClick={() => setOfferType(opt.type)}
              className={`flex-1 py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all ${offerType === opt.type ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent hover:border-border"}`}
            >
              <span className="material-symbols-outlined text-2xl">{opt.icon}</span>
              <div className="text-left">
                <div className="font-bold">{opt.title}</div>
                <div className="text-xs opacity-80">{opt.desc}</div>
              </div>
              {offerType === opt.type && <span className="material-symbols-outlined ml-auto">check_circle</span>}
            </button>
          ))}
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <AdminFormSection icon="feed" title="Informações Básicas">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField className="md:col-span-2" type="text" label="Nome do Produto" placeholder="Ex: iPhone 15 128GB Preto" />
                <FormField type="select" label="Marca" options={["Apple", "Samsung", "Logitech", "Nvidia"]} />
                <FormField type="text" label="Modelo" placeholder="Ex: MTP03BZ/A" />
                <FormField type="select" label="Categoria" options={["Smartphones", "Hardware", "Periféricos", "Computadores"]} />
                <FormField type="select" label="Subcategoria" options={["iOS", "Android"]} />
              </div>
            </AdminFormSection>

            {/* Description */}
            <AdminFormSection icon="description" title="Descrição e Conteúdo">
              <div className="space-y-6">
                <FormField type="textarea" label="Descrição Curta (SEO & Cards)" rows={2} hint="Máximo 160 caracteres." />
                <FormField type="textarea" label="Descrição Longa" rows={6} mono hint="Suporta Markdown simples." />
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
            </AdminFormSection>

            {/* Build Data */}
            <AdminFormSection icon="developer_board" title="Dados Técnicos de Build" highlighted={offerType === "part"} headerRight={
              offerType === "common" ? <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Requer 'Peça de PC'</span> : undefined
            }>
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 relative ${offerType === "common" ? "opacity-50 pointer-events-none grayscale select-none" : ""}`}>
                {offerType === "common" && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/50 backdrop-blur-[1px]">
                    <span className="bg-card px-4 py-2 rounded-lg shadow border border-border text-sm font-medium">Selecione "Peça de PC" acima para habilitar</span>
                  </div>
                )}
                <FormField type="select" label="Tipo de Peça" options={["Processador", "Placa de Vídeo", "Placa Mãe"]} />
                <FormField type="select" label="Plataforma" options={["Intel", "AMD"]} />
                <FormField type="select" label="Soquete" options={["LGA 1700", "AM5"]} />
                <FormField type="select" label="Interface Memória" options={["DDR4", "DDR5"]} />
                <FormField type="number" label="TDP (Watts)" />
                <FormField type="text" label="Chipset" />
              </div>
            </AdminFormSection>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Status */}
            <AdminFormSection icon="visibility" title="Status e Visibilidade">
              <div className="space-y-4">
                {["Ativo", "Visível em Ofertas", "Reutilizável em Builds", "Destaque na Home"].map((label, i) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{label}</span>
                    <input type="checkbox" defaultChecked={i < 2} className="rounded border-border text-primary focus:ring-primary h-5 w-5" />
                  </div>
                ))}
              </div>
            </AdminFormSection>

            {/* Price */}
            <AdminFormSection icon="payments" title="Preço e Oferta">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField type="number" label="Preço Antigo" prefix="R$" labelSize="xs" />
                  <FormField type="number" label="Preço Atual" prefix="R$" labelSize="xs" />
                </div>
                <FormField type="text" label="% Desconto (Auto)" disabled defaultValue="25%" labelSize="xs" />
                <FormField type="select" label="Badge Promocional" options={["Nenhuma", "Frete Grátis", "Lançamento", "Black Friday"]} labelSize="xs" />
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
            </AdminFormSection>

            {/* Media */}
            <AdminFormSection icon="image" title="Link e Mídia">
              <div className="space-y-4">
                <FormField type="url" label="URL Externa (Afiliado)" prefix="🔗" labelSize="xs" />
                <ImageUpload label="Imagem Principal" compact />
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
            </AdminFormSection>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 text-base">
                <span className="material-symbols-outlined">publish</span>Publicar Oferta
              </button>
              <button type="button" className="w-full bg-muted hover:opacity-80 text-foreground font-medium py-3 rounded-xl transition-colors border border-border flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">draft</span>Salvar Rascunho
              </button>
            </div>
          </div>
        </form>
      </main>
    </AdminLayout>
  );
};

export default AdminNewOffer;
