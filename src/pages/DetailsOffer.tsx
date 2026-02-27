import PublicLayout from "@/components/layouts/PublicLayout";
import HeroBanner from "@/components/HeroBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ShareButtons from "@/components/shared/ShareButtons";
import OfferCard from "@/components/OfferCard";

const IMG_IPHONE = "https://lh3.googleusercontent.com/aida-public/AB6AXuBta2gopW6oGAGdy5rD8qFBk0bzVQzoq2OqQN1eXzgxCPMLLBOtzdqBRxuOgmhovIpPAao3pklK4B_NS_NQEQOyGurv9t-ypWvlZ6tc3dgTyC0PTFnQj1xuAQS3ap4ebnSoof-B2AMF2punEi4BqbOz8BYfLgCJQKA3OzNaMPD5cpcj87gEHSvMej8WvK62-OVYX2j5qLRtB8vPhhUNd2bEpOuWfNHqy6tGgB99IRMYDoBxOuwnt9AJa8KJnApDjgvp3I6A6aamcg";
const IMG_TABLET = "https://lh3.googleusercontent.com/aida-public/AB6AXuBpUH1nXPTRywV4pgIWNorBhrxPUTFJ29a11qs36UiKJVO0lnfDXkQhKDi2WctYMiBArf9bJky_KK3-MbpvuN1Yt3V8O3-bs7Jqtxd_Ik2nRDzUoaphHIpdVoc_mLbvbahr6unYu7HkKlSXOEN2dLCxpEOn_f-7w_xl-UwPIN0GcVNpndkTXvlkEYC5P1zNkxB1a9JijUJ5PMGRCsg9wVYidr2zXFbHtW_2i_8ADuZSnN4Gp0RzJHu7P6czYdYMVH2ryiEfEFNiUg";

const specs = [
  { label: "Marca", value: "Apple" },
  { label: "Modelo", value: "iPhone 15" },
  { label: "Capacidade", value: "128 GB" },
  { label: "Tela", value: '6.1" Super Retina XDR OLED' },
  { label: "Processador", value: "A16 Bionic" },
  { label: "Câmera Traseira", value: "48MP + 12MP" },
  { label: "Câmera Frontal", value: "12MP TrueDepth" },
  { label: "Conectividade", value: "5G, Wi-Fi 6, Bluetooth 5.3, NFC" },
  { label: "Sistema", value: "iOS 17" },
];

const relatedOffers = [
  { title: "Samsung Galaxy Tab S9", image: IMG_TABLET, category: "Tablet", badge: "-10% OFF", badgeColor: "bg-red-500 text-white", oldPrice: "A partir de R$ 6.999", newPrice: "R$ 4.199,00", discount: "+31%" },
  { title: "AirPods Pro (2ª geração)", icon: "headphones", category: "Áudio", oldPrice: "A partir de R$ 2.599", newPrice: "R$ 1.899,00", discount: "+27%" },
  { title: "Apple Watch Series 9", icon: "watch", category: "Wearable", oldPrice: "A partir de R$ 4.999", newPrice: "R$ 3.599,00", discount: "+28%" },
  { title: "Carregador 20W USB-C", icon: "charger", category: "Acessório", oldPrice: "A partir de R$ 219", newPrice: "R$ 159,00", discount: "+27%" },
];

const DetailsOffer = () => (
  <PublicLayout>
    <HeroBanner size="sm">
      <div className="mb-4">
        <Breadcrumb variant="light" items={[{ label: "Home", to: "/" }, { label: "Smartphones", to: "/ofertas" }, { label: "Apple" }]} />
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md text-white">iPhone 15 128GB</h1>
    </HeroBanner>

    <main className="container mx-auto px-4 py-8 -mt-8 relative z-30">
      <div className="bg-surface rounded-xl shadow-xl border border-border overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Image */}
          <div className="lg:w-7/12 p-8 border-b lg:border-b-0 lg:border-r border-border flex flex-col items-center justify-center bg-card">
            <div className="relative w-full max-w-lg aspect-square mb-6 flex items-center justify-center">
              <img alt="iPhone 15 128GB" className="object-contain max-h-full max-w-full drop-shadow-lg" src={IMG_IPHONE} />
            </div>
            <div className="flex gap-4 overflow-x-auto py-2 w-full max-w-lg px-2">
              <button className="w-20 h-20 flex-shrink-0 border-2 border-primary rounded-lg p-2 bg-card flex items-center justify-center">
                <img alt="Thumbnail 1" className="max-h-full max-w-full object-contain" src={IMG_IPHONE} />
              </button>
              {["smartphone", "photo_camera", "battery_charging_full"].map((icon) => (
                <button key={icon} className="w-20 h-20 flex-shrink-0 border border-border rounded-lg p-2 bg-card flex items-center justify-center hover:border-primary transition-colors">
                  <span className="material-symbols-outlined text-muted-foreground text-3xl">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:w-5/12 p-8 flex flex-col">
            <div className="mb-4">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide inline-flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                Melhor Preço
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2 leading-tight">iPhone 15 Apple 128GB</h2>
            <p className="text-muted-foreground text-sm mb-6">Cor: Preto Espacial • Modelo: MTP03BZ/A</p>

            <div className="bg-muted rounded-lg p-6 mb-6 border border-border">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-lg text-muted-foreground line-through decoration-red-500/50 decoration-2">R$ 6.799,00</span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-md">+25% OFF</span>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-xs text-muted-foreground font-medium -mb-4">R$</span>
                <span className="text-5xl font-extrabold text-foreground tracking-tight">5.099,00</span>
              </div>
              <p className="text-sm text-emerald-600 font-medium mb-4">à vista no Pix ou Boleto</p>
              <p className="text-sm text-muted-foreground">
                ou <span className="font-bold text-foreground">R$ 5.665,55</span> em até 12x de R$ 472,12 sem juros
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-bold text-lg py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Ir para a oferta
                <span className="material-symbols-outlined">open_in_new</span>
              </button>
              <ShareButtons variant="compact" />
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-500">check_circle</span>
                  <span>Estoque disponível</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500">verified_user</span>
                  <span>Loja verificada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specs */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface rounded-xl shadow-sm border border-border p-8">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">description</span>
              Descrição do Produto
            </h3>
            <div className="prose max-w-none text-muted-foreground">
              <p className="mb-4">O iPhone 15 traz a Dynamic Island, uma câmera Grande-angular de 48 MP e USB-C. Tudo em um design resistente feito com vidro colorido por infusão e alumínio.</p>
              <h4 className="text-lg font-semibold text-foreground mt-6 mb-2">Dynamic Island</h4>
              <p className="mb-4">A Dynamic Island mostra alertas e Atividades ao Vivo para você não perder nada enquanto faz outras coisas.</p>
              <h4 className="text-lg font-semibold text-foreground mt-6 mb-2">Design Inovador</h4>
              <p className="mb-4">O iPhone 15 tem design resistente feito com vidro colorido por infusão e alumínio. A tela Super Retina XDR de 6,1 pol. é até duas vezes mais visível sob o sol.</p>
              <h4 className="text-lg font-semibold text-foreground mt-6 mb-2">Câmera Grande-Angular de 48 MP</h4>
              <p>A câmera Grande-angular de 48 MP fotografa em altíssima resolução com detalhes incríveis.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-surface rounded-xl shadow-sm border border-border p-6 sticky top-24">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">settings_suggest</span>
              Especificações Técnicas
            </h3>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="min-w-full divide-y divide-border text-sm">
                <tbody className="divide-y divide-border">
                  {specs.map((spec, i) => (
                    <tr key={spec.label} className={i % 2 === 0 ? "bg-muted" : "bg-surface"}>
                      <td className="px-4 py-3 font-medium text-foreground w-1/3">{spec.label}</td>
                      <td className="px-4 py-3 text-muted-foreground">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Related Offers - now using OfferCard */}
      <section className="mt-16 pt-8 border-t border-border">
        <h2 className="text-2xl font-bold text-foreground mb-6">Ofertas Relacionadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedOffers.map((offer) => (
            <OfferCard key={offer.title} {...offer} />
          ))}
        </div>
      </section>
    </main>
  </PublicLayout>
);

export default DetailsOffer;
