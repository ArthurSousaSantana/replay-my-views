interface HeroBannerProps {
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  contained?: boolean;
}

const HeroBanner = ({ children, size = "md", contained = false }: HeroBannerProps) => {
  const heights = {
    sm: "min-h-[128px] md:min-h-[160px]",
    md: "min-h-[200px] py-16",
    lg: "min-h-[400px] md:min-h-[450px]",
  };

  const inner = (
    <div className={`relative overflow-hidden flex items-center justify-center text-primary-foreground hero-gradient ${heights[size]} ${contained ? "rounded-2xl shadow-xl" : ""}`}>
      <div className="wave-shape wave-1" />
      <div className="wave-shape wave-2" />
      <div className="wave-shape wave-3" />
      <div className="flow-overlay" />
      <div className="smooth-curve" style={{ top: "40%", opacity: 0.1 }} />
      <div className="smooth-curve" style={{ top: "60%", transform: "rotate(5deg)", opacity: 0.05 }} />
      <div className="z-20 relative px-4 w-full">
        {children}
      </div>
    </div>
  );

  if (contained) {
    return (
      <section className="container mx-auto px-4 pt-8 pb-4">
        {inner}
      </section>
    );
  }

  return <header>{inner}</header>;
};

export default HeroBanner;
