import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface BannerSlide {
  id: string;
  title: string;
  link: string;
  image_desktop: string;
  image_tablet: string;
  image_mobile: string;
}

const placeholderSlides: BannerSlide[] = [
  {
    id: "1",
    title: "As melhores ofertas tech",
    link: "/ofertas",
    image_desktop: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&h=450&fit=crop",
    image_tablet: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=400&fit=crop",
    image_mobile: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=170&fit=crop",
  },
];

interface HeroCarouselProps {
  autoPlayInterval?: number;
}

const HeroCarousel = ({ autoPlayInterval = 5000 }: HeroCarouselProps) => {
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        setSlides(data as BannerSlide[]);
      } else {
        setSlides(placeholderSlides);
      }
    };
    fetchBanners();
  }, []);

  const next = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [next, autoPlayInterval, isPaused, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section className="container mx-auto px-4 pt-8 pb-4">
      <div
        className="relative overflow-hidden rounded-2xl shadow-xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={cn("min-w-full relative", slide.link && "cursor-pointer")}
              onClick={() => slide.link && navigate(slide.link)}
            >
              <div className="relative h-[280px] md:h-[400px] lg:h-[450px] bg-[#0E2240]">
                <img
                  src={slide.image_desktop || slide.image_tablet || slide.image_mobile}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-contain object-center"
                />
              </div>
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <>
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
          </>
        )}
      </div>
    </section>
  );
};

export default HeroCarousel;
