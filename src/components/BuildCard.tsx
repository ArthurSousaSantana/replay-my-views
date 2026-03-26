import { Link } from "react-router-dom";

interface BuildCardProps {
  title: string;
  image: string;
  badgeText: string;
  badgeColor: string;
  oldPrice: string;
  newPrice: string;
  discount: string;
  description?: string;
  chips?: string[];
  link?: string;
  compact?: boolean;
}

const BuildCard = ({ title, image, badgeText, badgeColor, oldPrice, newPrice, discount, description, chips = [], link = "/builds/1", compact = false }: BuildCardProps) => {
  if (compact) {
    return (
      <div className="bg-surface rounded-xl shadow-md border border-border flex flex-col h-full overflow-hidden">
        <div className="relative h-28 bg-white overflow-hidden flex items-center justify-center">
          <div className="absolute top-1.5 left-1.5 z-10">
            <span className={`${badgeColor} text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm uppercase tracking-wider`}>{badgeText}</span>
          </div>
          <img alt={title} className="max-w-full max-h-full object-contain p-2" src={image} />
        </div>
        <div className="p-2.5 flex-1 flex flex-col">
          <h3 className="text-xs font-bold text-foreground mb-1 line-clamp-2 leading-tight">{title}</h3>
          <div className="mt-auto">
            <span className="text-[10px] text-muted-foreground line-through">{oldPrice}</span>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-foreground">{newPrice}</span>
              <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded">{discount}</span>
            </div>
            <Link to={link} className="w-full bg-secondary hover:opacity-90 text-secondary-foreground text-[10px] font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-sm">
              Ver detalhes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border border-border flex flex-col h-full">
      <div className="relative h-64 bg-white overflow-hidden flex items-center justify-center">
        <div className="absolute top-4 left-4 z-10">
          <span className={`${badgeColor} text-xs font-bold px-3 py-1 rounded-md backdrop-blur-sm uppercase tracking-wider`}>{badgeText}</span>
        </div>
        <img alt={title} className="max-w-full max-h-full object-contain p-4" src={image} />
        {chips.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex gap-2 text-xs font-medium text-white/90">
              {chips.map((chip) => (
                <span key={chip} className="bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">{chip}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        )}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-muted-foreground line-through">{oldPrice}</span>
          </div>
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">A partir de</p>
              <span className="text-2xl font-bold text-foreground">{newPrice}</span>
            </div>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">{discount}</span>
          </div>
          <Link to={link} className="w-full bg-secondary hover:opacity-90 text-secondary-foreground font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
            Ver detalhes <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuildCard;
