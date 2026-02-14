import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import OfferCard from "@/components/OfferCard";
import BuildCard from "@/components/BuildCard";

const IMG_PC1 = "https://lh3.googleusercontent.com/aida-public/AB6AXuClWAJthYb-I5gj8rjlSxUAJvHgqV7rY8JfZJYrg6C-ilTVXQ9Twr-xig79W3IeYZUt6QI3n6i1Ds4CtHC8Om7NYyKvPZz-xGk6cXgfgPWVk084FxpBI1PNi8_vCbbgt2v2LYWD-t2ZGpyU8iqdxuMGVYwkRZpIEBVz-uDDggt5u8HvqF67ZJ7QOuP0iEjwLO5_heKgUVsA8_PP-aYnvwgZ5Rwc0TgFMLdLEELxFLl9pTIpq5cHId7w2qli37SsnfKaPfCmlllY7Q";
const IMG_PC2 = "https://lh3.googleusercontent.com/aida-public/AB6AXuB3VnpSkouEwhPCud8E87nYLpCKr8Cpk8LExBEarip6MFvzckKYWGLHHUeYYOEn-ZgWNKlco6UQ8minrCUt6B_PFSw--plMwbokeTcJT1jKWInEmxJru9IolHqf_shnhEa59I7XYeSkNvZ2P4esxMD-OJrvZYBlg8gCePFNppvv5YPa2Z0uVFA7SE_TyUtM6URAWco7WiFWKr6uAXA1jK8xwNOBv0ZvV1dUM3n3ejlgRKzHYN27m3Oiwn2cfwWW8o_wDCx4j48y_w";
const IMG_PC3 = "https://lh3.googleusercontent.com/aida-public/AB6AXuCiNlw41netxPaJjQvBjt3MNaIGXPmS5yjIe3LmOXXcCRl_Un8di-_n_THwqbJ2eu9rTNkXbLX47--BzQA4guQrLeU-6YF9Qq4SEulOJ-g7z1kJPLMZcIhgs1TRfnaTkpIaVXH0nyO5d8bjQH95hLFi47SxRxswWmXa66l5O2ozuO2qHtZA0reTG65GX5ZV1t9MNO6G-b-5oK0DoEWCaRezeOCFprY2c51nRiQUmzOm5tn5mHOwnU5cM2RGBqD60IuswYl13NlgRA";
const IMG_IPHONE = "https://lh3.googleusercontent.com/aida-public/AB6AXuBta2gopW6oGAGdy5rD8qFBk0bzVQzoq2OqQN1eXzgxCPMLLBOtzdqBRxuOgmhovIpPAao3pklK4B_NS_NQEQOyGurv9t-ypWvlZ6tc3dgTyC0PTFnQj1xuAQS3ap4ebnSoof-B2AMF2punEi4BqbOz8BYfLgCJQKA3OzNaMPD5cpcj87gEHSvMej8WvK62-OVYX2j5qLRtB8vPhhUNd2bEpOuWfNHqy6tGgB99IRMYDoBxOuwnt9AJa8KJnApDjgvp3I6A6aamcg";
const IMG_TABLET = "https://lh3.googleusercontent.com/aida-public/AB6AXuBpUH1nXPTRywV4pgIWNorBhrxPUTFJ29a11qs36UiKJVO0lnfDXkQhKDi2WctYMiBArf9bJky_KK3-MbpvuN1Yt3V8O3-bs7Jqtxd_Ik2nRDzUoaphHIpdVoc_mLbvbahr6unYu7HkKlSXOEN2dLCxpEOn_f-7w_xl-UwPIN0GcVNpndkTXvlkEYC5P1zNkxB1a9JijUJ5PMGRCsg9wVYidr2zXFbHtW_2i_8ADuZSnN4Gp0RzJHu7P6czYdYMVH2ryiEfEFNiUg";

const builds = [
  { title: 'O "1080p King" Starter', badgeText: "Entry Pro", badgeColor: "bg-emerald-900/80 text-emerald-400 border border-emerald-500/30", oldPrice: "R$ 4.899", newPrice: "R$ 3.799,00", discount: "+22% OFF", image: IMG_PC1 },
  { title: "1440p High Refresh Streamer", badgeText: "Streamer Pro", badgeColor: "bg-blue-900/80 text-blue-400 border border-blue-500/30", oldPrice: "R$ 8.299", newPrice: "R$ 6.999,00", discount: "+15% OFF", image: IMG_PC2 },
  { title: "The 4K Monster", badgeText: "Ultra Enthusiast", badgeColor: "bg-purple-900/80 text-purple-400 border border-purple-500/30", oldPrice: "R$ 12.499", newPrice: "R$ 10.999,00", discount: "+12% OFF", image: IMG_PC3 },
];

const offers = [
  { title: "iPhone 15 128GB", image: IMG_IPHONE, category: "Smartphone", badge: "-25% OFF", badgeColor: "bg-red-500 text-white", oldPrice: "A partir de R$ 6.799", newPrice: "R$ 5.099,00", discount: "+25%" },
  { title: "Samsung Galaxy Tab S9", image: IMG_TABLET, category: "Tablet", badge: "Melhor Preço", badgeColor: "bg-yellow-400 text-yellow-900 uppercase", oldPrice: "A partir de R$ 6.999", newPrice: "R$ 4.199,00", discount: "+31%" },
  { title: "Samsung 980 PRO NVMe", icon: "storage", category: "Armazenamento", badge: "Menor Preço", badgeColor: "bg-blue-500 text-white uppercase", oldPrice: "A partir de R$ 1.699", newPrice: "R$ 1.199,00", discount: "+26%" },
  { title: "Corsair Vengeance RGB", icon: "memory", category: "Memória RAM", badge: "Oferta Limitada", badgeColor: "bg-yellow-400 text-yellow-900 uppercase", oldPrice: "32GB (2x16) DDR5", newPrice: "R$ 899,00", discount: "+98%" },
];

const hardwareOffers = [
  { title: "GeForce RTX 4070 12GB", icon: "videogame_asset", category: "GPU", badge: "-12% OFF", oldPrice: "De R$ 4.599,00", newPrice: "R$ 4.049,00", discount: "12%" },
  { title: "ASUS ROG Strix Z790-E", icon: "developer_board", category: "Placa Mãe", badge: "Lançamento", badgeColor: "bg-yellow-400 text-yellow-900 uppercase", oldPrice: "De R$ 3.899,00", newPrice: "R$ 3.199,00", discount: "18%" },
  { title: "Fonte Corsair RM750e", icon: "power", category: "Fonte", badge: "80+ Gold", badgeColor: "bg-blue-500 text-white uppercase", oldPrice: "De R$ 899,00", newPrice: "R$ 679,00", discount: "24%" },
  { title: "Teclado Mecânico Keychron K2", icon: "keyboard", category: "Periférico", badge: "RGB Pro", badgeColor: "bg-purple-500 text-white uppercase", oldPrice: "De R$ 950,00", newPrice: "R$ 759,00", discount: "20%" },
];

const Index = () => {
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      
      <HeroBanner size="lg">
        <div className="text-center py-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-xl text-white">
            As melhores ofertas <span className="text-blue-200">tech</span>,<br /> em um só lugar.
          </h1>
          <p className="text-lg md:text-xl text-blue-50 mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
            PCs, celulares, acessórios, tablets e mais, a preços imperdíveis. Otimizados para desempenho e prontos para você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/ofertas" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 border border-blue-400/30 ring-1 ring-blue-400/20">
              <span className="material-symbols-outlined text-sm">send</span>
              Encontrar ofertas
            </Link>
            <Link to="/builds" className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold py-3 px-8 rounded-lg flex items-center gap-2 shadow-lg transition-all hover:border-white/40">
              <span className="material-symbols-outlined text-sm">computer</span>
              Ver builds de PC
            </Link>
          </div>
        </div>
      </HeroBanner>

      {/* Builds Section */}
      <section className="container mx-auto px-4 py-12 relative z-30">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Builds de PC</h2>
            <p className="text-muted-foreground mt-2">Configurações otimizadas para jogos e desempenho.</p>
          </div>
          <Link to="/builds" className="inline-flex items-center justify-center px-6 py-2 border border-border rounded-full text-sm font-medium text-muted-foreground bg-surface hover:bg-muted transition-colors">
            Ver builds
            <span className="material-symbols-outlined text-sm ml-2">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {builds.map((build) => (
            <BuildCard key={build.title} {...build} link="/builds/1" />
          ))}
        </div>
      </section>

      {/* Tech Offers Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Ofertas Tech em Destaque</h2>
            <p className="text-muted-foreground">As melhores promoções além do mundo dos PCs.</p>
          </div>
          <Link to="/ofertas" className="inline-flex items-center justify-center px-6 py-2 border border-border rounded-full text-sm font-medium text-muted-foreground bg-surface hover:bg-muted transition-colors">
            Ver todas as ofertas
            <span className="material-symbols-outlined text-sm ml-2">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer) => (
            <OfferCard key={offer.title} {...offer} />
          ))}
        </div>
      </section>

      {/* Hardware Offers Section */}
      <section className="container mx-auto px-4 py-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Ofertas em Hardware de PC</h2>
            <p className="text-muted-foreground mt-2">Descontos reais em peças e componentes.</p>
          </div>
          <Link to="/ofertas" className="inline-flex items-center justify-center px-6 py-2 border border-border rounded-full text-sm font-medium text-muted-foreground bg-surface hover:bg-muted transition-colors">
            Ver todas as ofertas
            <span className="material-symbols-outlined text-sm ml-2">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hardwareOffers.map((offer) => (
            <OfferCard key={offer.title} {...offer} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
