import { Link } from "react-router-dom";

interface BuildCardProps {
  title: string;
  description: string;
  image: string;
  badgeText: string;
  badgeColor: string;
  oldPrice: string;
  newPrice: string;
  discount: string;
  chips?: string[];
  link?: string;
}

const BuildCard = ({ title, description, image, badgeText, badgeColor, oldPrice, newPrice, discount, chips = [], link = "/builds/1" }: BuildCardProps) => (
  <div className="bg-surface rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-border flex flex-col h-full">
    <div className="relative h-56 bg-gray-900 overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <span className={`${badgeColor} text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm`}>{badgeText}</span>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-1.5 rounded-full text-primary-foreground transition-colors">
          <span className="material-symbols-outlined text-lg">favorite</span>
        </button>
      </div>
      <img alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" src={image} />
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
    <div className="p-5 flex-1 flex flex-col">
      <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
      <div className="mt-auto">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted-foreground line-through">{oldPrice}</span>
          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">{discount}</span>
        </div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-2xl font-bold text-foreground">{newPrice}</span>
            <p className="text-[10px] text-muted-foreground">à vista no PIX</p>
          </div>
        </div>
        <Link to={link} className="w-full bg-secondary hover:opacity-90 text-secondary-foreground font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-sm">
          Ver detalhes <span className="material-symbols-outlined text-xs">chevron_right</span>
        </Link>
      </div>
    </div>
  </div>
);

export default BuildCard;
