import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import BuildCard from "@/components/BuildCard";

const IMG_PC1 = "https://lh3.googleusercontent.com/aida-public/AB6AXuClWAJthYb-I5gj8rjlSxUAJvHgqV7rY8JfZJYrg6C-ilTVXQ9Twr-xig79W3IeYZUt6QI3n6i1Ds4CtHC8Om7NYyKvPZz-xGk6cXgfgPWVk084FxpBI1PNi8_vCbbgt2v2LYWD-t2ZGpyU8iqdxuMGVYwkRZpIEBVz-uDDggt5u8HvqF67ZJ7QOuP0iEjwLO5_heKgUVsA8_PP-aYnvwgZ5Rwc0TgFMLdLEELxFLl9pTIpq5cHId7w2qli37SsnfKaPfCmlllY7Q";
const IMG_PC2 = "https://lh3.googleusercontent.com/aida-public/AB6AXuB3VnpSkouEwhPCud8E87nYLpCKr8Cpk8LExBEarip6MFvzckKYWGLHHUeYYOEn-ZgWNKlco6UQ8minrCUt6B_PFSw--plMwbokeTcJT1jKWInEmxJru9IolHqf_shnhEa59I7XYeSkNvZ2P4esxMD-OJrvZYBlg8gCePFNppvv5YPa2Z0uVFA7SE_TyUtM6URAWco7WiFWKr6uAXA1jK8xwNOBv0ZvV1dUM3n3ejlgRKzHYN27m3Oiwn2cfwWW8o_wDCx4j48y_w";
const IMG_PC3 = "https://lh3.googleusercontent.com/aida-public/AB6AXuCiNlw41netxPaJjQvBjt3MNaIGXPmS5yjIe3LmOXXcCRl_Un8di-_n_THwqbJ2eu9rTNkXbLX47--BzQA4guQrLeU-6YF9Qq4SEulOJ-g7z1kJPLMZcIhgs1TRfnaTkpIaVXH0nyO5d8bjQH95hLFi47SxRxswWmXa66l5O2ozuO2qHtZA0reTG65GX5ZV1t9MNO6G-b-5oK0DoEWCaRezeOCFprY2c51nRiQUmzOm5tn5mHOwnU5cM2RGBqD60IuswYl13NlgRA";
const IMG_IPHONE = "https://lh3.googleusercontent.com/aida-public/AB6AXuBta2gopW6oGAGdy5rD8qFBk0bzVQzoq2OqQN1eXzgxCPMLLBOtzdqBRxuOgmhovIpPAao3pklK4B_NS_NQEQOyGurv9t-ypWvlZ6tc3dgTyC0PTFnQj1xuAQS3ap4ebnSoof-B2AMF2punEi4BqbOz8BYfLgCJQKA3OzNaMPD5cpcj87gEHSvMej8WvK62-OVYX2j5qLRtB8vPhhUNd2bEpOuWfNHqy6tGgB99IRMYDoBxOuwnt9AJa8KJnApDjgvp3I6A6aamcg";
const IMG_TABLET = "https://lh3.googleusercontent.com/aida-public/AB6AXuBpUH1nXPTRywV4pgIWNorBhrxPUTFJ29a11qs36UiKJVO0lnfDXkQhKDi2WctYMiBArf9bJky_KK3-MbpvuN1Yt3V8O3-bs7Jqtxd_Ik2nRDzUoaphHIpdVoc_mLbvbahr6unYu7HkKlSXOEN2dLCxpEOn_f-7w_xl-UwPIN0GcVNpndkTXvlkEYC5P1zNkxB1a9JijUJ5PMGRCsg9wVYidr2zXFbHtW_2i_8ADuZSnN4Gp0RzJHu7P6czYdYMVH2ryiEfEFNiUg";

const builds = [
  { title: "1080p Entry-Level Fighter", description: "Perfeito para eSports e jogos competitivos em Full HD com alta taxa de quadros.", image: IMG_PC1, badgeText: "Best Value", badgeColor: "bg-emerald-600", oldPrice: "R$ 4.299,00", newPrice: "R$ 3.799,00", discount: "-12%", chips: ["Ryzen 5 5600", "RX 6600"] },
  { title: "1440p Competitive Pro", description: "Domine o campo de batalha com DLSS 3 e Ray Tracing em resolução Quad HD.", image: IMG_PC2, badgeText: "High FPS", badgeColor: "bg-blue-600", oldPrice: "R$ 6.899,00", newPrice: "R$ 6.199,00", discount: "-10%", chips: ["i5-13400F", "RTX 4060 Ti"] },
  { title: "4K Ultimate Creator", description: "Potência bruta para renderização 3D, edição de vídeo 4K e jogos no ultra.", image: IMG_PC3, badgeText: "Ultimate", badgeColor: "bg-purple-600", oldPrice: "R$ 15.999,00", newPrice: "R$ 13.599,00", discount: "-15%", chips: ["Ryzen 9 7900X", "RTX 4080"] },
  { title: "Streamer Elite Setup", description: "Multitarefa sem esforço. Jogue e transmita simultaneamente com qualidade máxima.", image: IMG_IPHONE, badgeText: "Streamer", badgeColor: "bg-indigo-600", oldPrice: "R$ 8.999,00", newPrice: "R$ 7.379,00", discount: "-18%", chips: ["i7-12700K", "RTX 3070"] },
  { title: "Entry Level Starter", description: "Sua porta de entrada para o mundo PC Gamer. Rode jogos populares como Valorant e LoL.", image: "", badgeText: "Budget King", badgeColor: "bg-orange-500", oldPrice: "R$ 2.899,00", newPrice: "R$ 2.499,00", discount: "-14%", chips: ["Ryzen 5 4500", "GTX 1650"] },
  { title: "Silent Worker Pro", description: "Focado em silêncio e eficiência. Gabinete com isolamento acústico e fans premium.", image: IMG_TABLET, badgeText: "Silent", badgeColor: "bg-teal-500", oldPrice: "R$ 9.200,00", newPrice: "R$ 8.460,00", discount: "-8%", chips: ["i5-14600K", "RTX 4070"] },
];

const ListingBuilds = () => {
  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <HeroBanner size="md">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-xl text-white">
            Builds de PC Recomendadas
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto font-light drop-shadow-md">
            Escolha sua performance. De configurações básicas a máquinas extremas para 4K, tudo testado e aprovado.
          </p>
        </div>
      </HeroBanner>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-surface rounded-xl shadow-sm border border-border p-5 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-foreground text-lg">Filtros</h3>
                <button className="text-xs text-primary hover:underline font-medium">Limpar</button>
              </div>
              <div className="mb-6 border-b border-border pb-6">
                <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Orçamento</h4>
                <div className="space-y-2">
                  {["Até R$ 3.000", "R$ 3.000 - R$ 5.000", "R$ 5.000 - R$ 8.000", "Acima de R$ 8.000"].map((b, i) => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="rounded border-border text-primary focus:ring-primary h-4 w-4" defaultChecked={i === 1} />
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">{b}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-6 border-b border-border pb-6">
                <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Uso Principal</h4>
                <div className="space-y-2">
                  {["Gaming (Jogos)", "Trabalho / Office", "Streaming / Edição"].map((u, i) => (
                    <label key={u} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="rounded border-border text-primary focus:ring-primary h-4 w-4" defaultChecked={i === 0} />
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">{u}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Plataforma</h4>
                <div className="space-y-2">
                  {["Intel", "AMD"].map((p) => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="rounded border-border text-primary focus:ring-primary h-4 w-4" />
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground text-sm">Mostrando <span className="font-bold text-foreground">6</span> resultados</p>
              <select className="bg-surface border border-border text-sm rounded-lg focus:ring-primary focus:border-primary block p-2">
                <option>Relevância</option>
                <option>Menor Preço</option>
                <option>Maior Preço</option>
                <option>Mais Vendidos</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {builds.map((build) => (
                <BuildCard key={build.title} {...build} link="/builds/1" />
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
                <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-surface text-muted-foreground hover:bg-muted transition-colors">
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ListingBuilds;
