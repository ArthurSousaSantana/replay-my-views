import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OfferCard from "@/components/OfferCard";

const IMG_IPHONE = "https://lh3.googleusercontent.com/aida-public/AB6AXuBta2gopW6oGAGdy5rD8qFBk0bzVQzoq2OqQN1eXzgxCPMLLBOtzdqBRxuOgmhovIpPAao3pklK4B_NS_NQEQOyGurv9t-ypWvlZ6tc3dgTyC0PTFnQj1xuAQS3ap4ebnSoof-B2AMF2punEi4BqbOz8BYfLgCJQKA3OzNaMPD5cpcj87gEHSvMej8WvK62-OVYX2j5qLRtB8vPhhUNd2bEpOuWfNHqy6tGgB99IRMYDoBxOuwnt9AJa8KJnApDjgvp3I6A6aamcg";
const IMG_TABLET = "https://lh3.googleusercontent.com/aida-public/AB6AXuBpUH1nXPTRywV4pgIWNorBhrxPUTFJ29a11qs36UiKJVO0lnfDXkQhKDi2WctYMiBArf9bJky_KK3-MbpvuN1Yt3V8O3-bs7Jqtxd_Ik2nRDzUoaphHIpdVoc_mLbvbahr6unYu7HkKlSXOEN2dLCxpEOn_f-7w_xl-UwPIN0GcVNpndkTXvlkEYC5P1zNkxB1a9JijUJ5PMGRCsg9wVYidr2zXFbHtW_2i_8ADuZSnN4Gp0RzJHu7P6czYdYMVH2ryiEfEFNiUg";

const allOffers = [
  { title: "iPhone 15 128GB - Preto Espacial", image: IMG_IPHONE, category: "Smartphone", badge: "-25% OFF", badgeColor: "bg-red-500 text-white", oldPrice: "De R$ 6.799", newPrice: "R$ 5.099,00", discount: "+25%" },
  { title: "Samsung Galaxy Tab S9 WiFi", image: IMG_TABLET, category: "Tablet", badge: "Melhor Preço", badgeColor: "bg-yellow-400 text-yellow-900 uppercase", oldPrice: "De R$ 6.999", newPrice: "R$ 4.199,00", discount: "+31%" },
  { title: "SSD Samsung 980 PRO 1TB NVMe", icon: "storage", category: "Armazenamento", badge: "Menor Preço", badgeColor: "bg-blue-500 text-white uppercase", oldPrice: "De R$ 1.699", newPrice: "R$ 1.199,00", discount: "+26%" },
  { title: "Corsair Vengeance RGB 32GB DDR5", icon: "memory", category: "Memória RAM", badge: "Oferta Limitada", badgeColor: "bg-yellow-400 text-yellow-900 uppercase", oldPrice: "De R$ 1.299", newPrice: "R$ 899,00", discount: "+30%" },
  { title: "GeForce RTX 4070 Super 12GB", icon: "videogame_asset", category: "GPU", badge: "Lançamento", badgeColor: "bg-purple-500 text-white uppercase", oldPrice: "De R$ 4.599", newPrice: "R$ 4.049,00", discount: "+12%" },
  { title: "Fonte Corsair RM750e Modular", icon: "power", category: "Fonte", badge: "80+ Gold", badgeColor: "bg-blue-500 text-white uppercase", oldPrice: "De R$ 899", newPrice: "R$ 679,00", discount: "+24%" },
  { title: "ASUS ROG Strix Z790-E Gaming", icon: "developer_board", category: "Placa Mãe", oldPrice: "De R$ 3.899", newPrice: "R$ 3.199,00", discount: "+18%" },
  { title: "Keychron K2 V2 Wireless", icon: "keyboard", category: "Teclado", badge: "RGB Pro", badgeColor: "bg-purple-500 text-white uppercase", oldPrice: "De R$ 950", newPrice: "R$ 759,00", discount: "+20%" },
];

const ListingOffers = () => {
  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <div className="relative overflow-hidden hero-gradient h-32 md:h-40 flex items-center">
        <div className="wave-shape wave-1" />
        <div className="wave-shape wave-2" />
        <div className="flow-overlay" />
        <div className="container mx-auto px-4 z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">Ofertas Tech em Destaque</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <nav aria-label="Breadcrumb" className="flex mb-6 text-sm text-muted-foreground">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="inline-flex items-center hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg mr-1">home</span>Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-lg mx-1">chevron_right</span>
                <span className="font-medium text-foreground">Ofertas Tech em Destaque</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-surface rounded-xl shadow-sm border border-border p-5 sticky top-24">
              <h3 className="font-bold text-lg text-foreground mb-6">Filtros</h3>
              <div className="mb-6 border-b border-border pb-6">
                <h4 className="font-semibold text-sm text-foreground mb-3">Categorias</h4>
                <div className="space-y-2">
                  {["Smartphones", "Hardware PC", "Periféricos", "Monitores", "Laptops"].map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border text-primary focus:ring-primary bg-muted" defaultChecked={cat === "Hardware PC"} />
                      <span className="text-sm text-muted-foreground">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-6 border-b border-border pb-6">
                <h4 className="font-semibold text-sm text-foreground mb-3">Marcas</h4>
                <div className="space-y-2">
                  {["Apple", "Samsung", "NVIDIA", "Corsair"].map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border text-primary focus:ring-primary bg-muted" />
                      <span className="text-sm text-muted-foreground">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-6 border-b border-border pb-6">
                <h4 className="font-semibold text-sm text-foreground mb-3">Preço</h4>
                <div className="flex items-center gap-2 mb-2">
                  <input className="w-full text-sm bg-muted border border-border rounded px-2 py-1.5 focus:ring-1 focus:ring-primary" placeholder="Min" type="number" />
                  <span className="text-muted-foreground">-</span>
                  <input className="w-full text-sm bg-muted border border-border rounded px-2 py-1.5 focus:ring-1 focus:ring-primary" placeholder="Max" type="number" />
                </div>
                <button className="w-full mt-2 bg-muted hover:opacity-80 text-muted-foreground text-xs font-medium py-1.5 rounded transition-colors">Aplicar</button>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-3">Desconto</h4>
                <div className="space-y-2">
                  {["Qualquer desconto", "Mais de 10%", "Mais de 30%", "Mais de 50%"].map((d) => (
                    <label key={d} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="discount" className="border-border text-primary focus:ring-primary bg-muted" />
                      <span className="text-sm text-muted-foreground">{d}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-muted-foreground">Mostrando <strong>8</strong> de <strong>42</strong> resultados</span>
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground hidden sm:block" htmlFor="sort">Ordenar por:</label>
                <select className="bg-surface border border-border text-sm rounded-lg focus:ring-primary focus:border-primary block p-2" id="sort">
                  <option>Relevância</option>
                  <option>Menor Preço</option>
                  <option>Maior Preço</option>
                  <option>Maior Desconto</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allOffers.map((offer) => (
                <OfferCard key={offer.title} {...offer} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-surface text-muted-foreground hover:bg-muted transition-colors">
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground font-medium shadow-sm">1</button>
                <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-surface text-foreground hover:bg-muted transition-colors">2</button>
                <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-surface text-foreground hover:bg-muted transition-colors">3</button>
                <span className="text-muted-foreground px-2">...</span>
                <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-surface text-foreground hover:bg-muted transition-colors">8</button>
                <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-surface text-muted-foreground hover:bg-muted transition-colors">
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </nav>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListingOffers;
