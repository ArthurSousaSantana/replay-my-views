import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OfferCard from "@/components/OfferCard";

const IMG_PC1 = "https://lh3.googleusercontent.com/aida-public/AB6AXuClWAJthYb-I5gj8rjlSxUAJvHgqV7rY8JfZJYrg6C-ilTVXQ9Twr-xig79W3IeYZUt6QI3n6i1Ds4CtHC8Om7NYyKvPZz-xGk6cXgfgPWVk084FxpBI1PNi8_vCbbgt2v2LYWD-t2ZGpyU8iqdxuMGVYwkRZpIEBVz-uDDggt5u8HvqF67ZJ7QOuP0iEjwLO5_heKgUVsA8_PP-aYnvwgZ5Rwc0TgFMLdLEELxFLl9pTIpq5cHId7w2qli37SsnfKaPfCmlllY7Q";

const components = [
  { category: "Processador", name: "Intel Core i5-12400F", desc: "6 Núcleos, 12 Threads, 4.4GHz", oldPrice: "R$ 1.149,00", newPrice: "R$ 899,00", discount: "-22%", icon: "developer_board" },
  { category: "Placa de Vídeo", name: "NVIDIA GeForce RTX 3060 12GB", desc: "12GB GDDR6, Ray Tracing", oldPrice: "R$ 2.299,00", newPrice: "R$ 1.899,00", discount: "-18%", icon: "videogame_asset" },
  { category: "Placa Mãe", name: "Gigabyte B660M DS3H", desc: "DDR4, PCIe 4.0, M.2 Slot", oldPrice: "R$ 879,00", newPrice: "R$ 749,00", discount: "-15%", icon: "settings_input_component" },
  { category: "Memória RAM", name: "16GB (2x8GB) Kingston Fury", desc: "3200MHz DDR4, CL16", oldPrice: "R$ 399,00", newPrice: "R$ 299,00", discount: "-25%", icon: "memory" },
  { category: "Armazenamento", name: "SSD 1TB Kingston NV2 M.2", desc: "NVMe PCIe 4.0, 3500MB/s", oldPrice: "R$ 489,00", newPrice: "R$ 389,00", discount: "-20%", icon: "storage" },
  { category: "Fonte", name: "MSI MAG A650BN 650W", desc: "80 Plus Bronze, PFC Ativo", oldPrice: "R$ 369,00", newPrice: "R$ 329,00", discount: "-10%", icon: "power" },
];

const DetailsBuild = () => {
  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <header className="relative overflow-hidden min-h-[300px] flex items-center hero-gradient shadow-lg">
        <div className="wave-shape wave-1" />
        <div className="wave-shape wave-2" />
        <div className="wave-shape wave-3" />
        <div className="flow-overlay" />
        <div className="smooth-curve" style={{ top: "60%", transform: "rotate(5deg)", opacity: 0.05 }} />
        <div className="container mx-auto px-4 z-20 relative pt-8 pb-12">
          <nav aria-label="Breadcrumb" className="flex text-sm text-blue-200 mb-6">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li><Link to="/" className="inline-flex items-center hover:text-white transition-colors"><span className="material-symbols-outlined text-sm mr-2">home</span>Home</Link></li>
              <li><div className="flex items-center"><span className="material-symbols-outlined text-sm mx-1">chevron_right</span><Link to="/builds" className="hover:text-white transition-colors">Builds de PC</Link></div></li>
              <li aria-current="page"><div className="flex items-center"><span className="material-symbols-outlined text-sm mx-1">chevron_right</span><span className="text-white font-medium">O "1080p King" Starter</span></div></li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-xl text-white mb-2">
            O "1080p King" Starter
          </h1>
          <p className="text-lg text-blue-100 font-light max-w-3xl">
            A combinação perfeita entre custo e benefício para rodar tudo em Full HD com altas taxas de quadros.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 -mt-10 relative z-30 pb-20">
        <div className="bg-surface rounded-xl shadow-xl overflow-hidden border border-border">
          <div className="flex flex-col lg:flex-row">
            {/* Image */}
            <div className="lg:w-1/2 bg-gray-900 relative min-h-[400px] lg:min-h-[600px] flex items-center justify-center p-8 group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              <img alt="PC Gamer" className="max-w-full max-h-full object-contain drop-shadow-2xl transform transition-transform duration-700 group-hover:scale-105" src={IMG_PC1} />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                <button className="w-12 h-12 rounded-lg border-2 border-primary overflow-hidden shadow-lg">
                  <img className="w-full h-full object-cover" src={IMG_PC1} />
                </button>
                {["videocam", "360"].map((icon) => (
                  <button key={icon} className="w-12 h-12 rounded-lg border-2 border-white/20 bg-white/10 flex items-center justify-center text-white hover:border-white/50 transition-colors">
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">verified</span> Best Value
                </span>
                <span className="bg-muted text-muted-foreground text-xs font-bold px-3 py-1 rounded-full">Full HD</span>
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-6">Performance Estimada</h2>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { game: "Fortnite (High)", fps: "144+" },
                  { game: "Valorant (Ultra)", fps: "240+" },
                  { game: "Cyberpunk (Med)", fps: "60+" },
                ].map((perf) => (
                  <div key={perf.game} className="bg-muted rounded-lg p-3 text-center border border-border">
                    <div className="text-xs text-muted-foreground mb-1">{perf.game}</div>
                    <div className="text-xl font-bold text-primary">{perf.fps} <span className="text-sm text-muted-foreground font-normal">FPS</span></div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-border w-full mb-8" />

              <div className="mt-auto">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-4xl font-extrabold text-foreground tracking-tight">R$ 3.799,00</span>
                  <span className="text-lg text-muted-foreground line-through mb-1.5">R$ 4.899,00</span>
                </div>
                <div className="flex items-center gap-2 mb-8">
                  <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-3 py-1 rounded-md border border-emerald-200">
                    Economize R$ 1.100 (22% OFF)
                  </span>
                  <span className="text-sm text-muted-foreground">à vista no PIX</span>
                </div>

                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Compartilhar Build</h4>
                  <div className="flex gap-4">
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                      <span className="material-symbols-outlined">chat</span>
                      <span className="hidden xl:inline">WhatsApp</span>
                    </button>
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                      <span className="material-symbols-outlined">send</span>
                      <span className="hidden xl:inline">Telegram</span>
                    </button>
                    <button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                      <span className="material-symbols-outlined">post</span>
                      <span className="hidden xl:inline">X / Twitter</span>
                    </button>
                    <button className="flex-1 bg-muted hover:opacity-80 text-foreground py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm border border-border">
                      <span className="material-symbols-outlined text-xl">content_copy</span>
                      <span className="hidden xl:inline">Copiar Link</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-center mt-4 text-muted-foreground">
                  <span className="material-symbols-outlined text-sm align-middle mr-1">local_shipping</span>
                  Frete Grátis para Sul e Sudeste
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Components List */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
            <span className="bg-blue-100 p-2 rounded-lg text-primary">
              <span className="material-symbols-outlined">memory</span>
            </span>
            Lista de Componentes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {components.map((comp) => (
              <OfferCard
                key={comp.name}
                title={comp.name}
                icon={comp.icon}
                oldPrice={comp.oldPrice}
                newPrice={comp.newPrice}
                discount={comp.discount}
                badge={comp.discount}
                badgeColor="bg-red-500 text-white"
                category={comp.category}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DetailsBuild;
