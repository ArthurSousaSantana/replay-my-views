interface HeroBannerProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const HeroBanner = ({ children, size = "md" }: HeroBannerProps) => {
  const heights = {
    sm: "min-h-[128px] md:min-h-[160px]",
    md: "min-h-[200px] py-16",
    lg: "min-h-[500px] pb-20",
  };

  return (
    <header className={`relative overflow-hidden flex items-center justify-center text-primary-foreground hero-gradient ${heights[size]}`}>
      <div className="wave-shape wave-1" />
      <div className="wave-shape wave-2" />
      <div className="wave-shape wave-3" />
      <div className="flow-overlay" />
      <div className="smooth-curve" style={{ top: "40%", opacity: 0.1 }} />
      <div className="smooth-curve" style={{ top: "60%", transform: "rotate(5deg)", opacity: 0.05 }} />
      <div className="container mx-auto px-4 z-20 relative">
        {children}
      </div>
    </header>
  );
};

export default HeroBanner;
