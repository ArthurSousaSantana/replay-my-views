import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

const placeholderSlides: BannerSlide[] = [
  {
    id: 1,
    title: "As melhores ofertas tech",
    subtitle: "PCs, celulares, acessórios e mais a preços imperdíveis.",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&h=500&fit=crop",
    ctaText: "Ver ofertas",
    ctaLink: "/ofertas",
  },
  {
    id: 2,
    title: "Builds de PC Gamer",
    subtitle: "Configurações otimizadas para jogos e desempenho máximo.",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200&h=500&fit=crop",
    ctaText: "Ver builds",
    ctaLink: "/builds",
  },
  {
    id: 3,
    title: "Periféricos com desconto",
    subtitle: "Teclados, mouses e headsets das melhores marcas.",
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=1200&h=500&fit=crop",
    ctaText: "Conferir",
    ctaLink: "/ofertas",
  },
  {
    id: 4,
    title: "Monitores em promoção",
    subtitle: "Alta resolução e taxa de atualização para sua jogatina.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&h=500&fit=crop",
    ctaText: "Ver monitores",
    ctaLink: "/ofertas",
  },
  {
    id: 5,
    title: "Notebooks potentes",
    subtitle: "Para trabalho e jogos, com os melhores preços.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=500&fit=crop",
    ctaText: "Ver notebooks",
    ctaLink: "/ofertas",
  },
];

interface HeroCarouselProps {
  slides?: BannerSlide[];
  autoPlayInterval?: number;
}

const HeroCarousel = ({ slides = placeholderSlides, autoPlayInterval = 5000 }: HeroCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [next, autoPlayInterval, isPaused]);

  return (
    <section className="container mx-auto px-4 pt-8 pb-4">
      <div
        className="relative overflow-hidden rounded-2xl shadow-xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full relative">
              <div className="relative h-[170px] md:h-[400px] lg:h-[450px]">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
          aria-label="Banner anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
          aria-label="Próximo banner"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir para banner ${i + 1}`}
              className={cn(
                "rounded-full transition-all duration-300",
                i === current
                  ? "w-8 h-3 bg-primary"
                  : "w-3 h-3 bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
