import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import HeroBanner from "@/components/HeroBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import AdminFormSection from "@/components/shared/AdminFormSection";
import FormField from "@/components/shared/FormField";
import ImageUpload from "@/components/shared/ImageUpload";

const AdminNewOffer = () => {
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
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <AdminFormSection icon="feed" title="Informações Básicas">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField className="md:col-span-2" type="text" label="Nome do Produto" placeholder="Ex: iPhone 15 128GB Preto" />
                <FormField type="select" label="Categoria" options={["Hardware", "Smartphones", "Periféricos", "Mobiliário", "Acessórios", "Gadgets", "Notebooks", "Áudio", "Monitores", "Redes", "Armazenamento", "Games", "Iluminação", "Escritório", "Ergonomia", "Componentes", "Conectividade", "Tablets", "Wearables", "Suportes"]} />
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
