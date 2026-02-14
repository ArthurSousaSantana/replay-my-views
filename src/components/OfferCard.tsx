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
}

const OfferCard = ({ title, image, icon, oldPrice, newPrice, discount, badge, badgeColor = "bg-red-500 text-white", category, link = "/ofertas/1" }: OfferCardProps) => (
  <div className="bg-surface rounded-xl shadow-sm hover:shadow-md transition-all border border-border p-4 flex flex-col group h-full">
    <div className="relative mb-4 bg-card rounded-lg p-6 flex items-center justify-center h-48 overflow-hidden">
      {badge && (
        <div className="absolute top-2 left-2 z-10">
          <span className={`${badgeColor} text-[10px] font-bold px-2 py-1 rounded shadow-sm`}>{badge}</span>
        </div>
      )}
      {image ? (
        <img alt={title} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300" src={image} />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted rounded text-muted-foreground">
          <span className="material-symbols-outlined text-6xl group-hover:scale-110 transition-transform duration-300">{icon || "devices"}</span>
        </div>
      )}
    </div>
    <div className="flex-1 flex flex-col">
      {category && (
        <div className="mb-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{category}</span>
        </div>
      )}
      <h3 className="font-semibold text-foreground mb-auto text-sm md:text-base leading-tight">{title}</h3>
      <div className="mt-4">
        <p className="text-xs text-muted-foreground line-through">{oldPrice}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-foreground">{newPrice}</span>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">{discount}</span>
        </div>
        <Link to={link} className="w-full bg-secondary hover:opacity-90 text-secondary-foreground text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-sm">
          Ver oferta <span className="material-symbols-outlined text-xs">chevron_right</span>
        </Link>
      </div>
    </div>
  </div>
);

export default OfferCard;
