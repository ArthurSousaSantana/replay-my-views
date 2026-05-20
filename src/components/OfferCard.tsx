import { Link } from "react-router-dom";

interface OfferCardProps {
  title: string;
  image?: string;
  icon?: string;
  oldPrice: string;
  newPrice: string;
  discount: string;
  badge?: string;
  badgeColor?: string;
  category?: string;
  link?: string;
  compact?: boolean;
}

const OfferCard = ({ title, image, icon, oldPrice, newPrice, discount, badge, badgeColor = "bg-red-500 text-white", category, link = "/ofertas/1", compact = false }: OfferCardProps) => {
  if (compact) {
    return (
      <Link to={link} className="bg-surface rounded-xl shadow-sm border border-border p-3 flex items-center gap-3 group hover:shadow-md transition-shadow">
        <div className="relative w-20 h-20 shrink-0 bg-card rounded-lg flex items-center justify-center overflow-hidden">
          {badge && (
            <div className="absolute top-0.5 left-0.5 z-10">
              <span className={`${badgeColor} text-[8px] font-bold px-1 py-0.5 rounded shadow-sm`}>{badge}</span>
            </div>
          )}
          {image ? (
            <img alt={title} loading="lazy" className="max-h-full max-w-full object-contain p-1 group-hover:scale-110 transition-transform duration-300" src={image} />
          ) : (
            <span className="material-symbols-outlined text-3xl text-muted-foreground">{icon || "devices"}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {category && (
            <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">{category}</span>
          )}
          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground line-through">{oldPrice}</span>
            <span className="text-base font-bold text-foreground">{newPrice}</span>
            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1 py-0.5 rounded">{discount}</span>
          </div>
        </div>
        <span className="shrink-0 text-muted-foreground">
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </span>
      </Link>
    );
  }

  return (
    <Link to={link} className="bg-surface rounded-xl shadow-sm hover:shadow-md transition-all border border-border p-3 flex flex-col group h-full">
      <div className="relative mb-3 bg-card rounded-lg p-3 flex items-center justify-center h-28 md:h-48 overflow-hidden">
        {badge && (
          <div className="absolute top-1.5 left-1.5 z-10">
            <span className={`${badgeColor} text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm`}>{badge}</span>
          </div>
        )}
        {image ? (
          <img alt={title} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300" src={image} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted rounded text-muted-foreground">
            <span className="material-symbols-outlined text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-300">{icon || "devices"}</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        {category && (
          <div className="mb-1">
            <span className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{category}</span>
          </div>
        )}
        <h3 className="font-semibold text-foreground mb-auto text-xs md:text-base leading-tight line-clamp-2">{title}</h3>
        <div className="mt-2 md:mt-4">
          <p className="text-[10px] md:text-xs text-muted-foreground line-through">{oldPrice}</p>
          <div className="flex justify-between items-center">
            <span className="text-base md:text-xl font-bold text-foreground">{newPrice}</span>
            <span className="bg-emerald-100 text-emerald-800 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded">{discount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OfferCard;
