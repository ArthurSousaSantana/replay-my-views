import { Link, useLocation } from "react-router-dom";
import logoImg from "@/assets/logo.png";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
          <img alt="DescontoGamer Logo" className="w-10 h-10 object-contain" src={logoImg} />
          <span className="font-bold text-xl text-foreground hidden md:block">DescontoGamer</span>
        </Link>
        <div className="flex-1 max-w-xl mx-auto hidden sm:block">
          <div className="relative">
            <input
              className="w-full bg-muted border-none rounded-full py-2.5 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary text-foreground shadow-inner"
              placeholder="Buscar ofertas, hardware, periféricos..."
              type="text"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <ul className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <li>
              <Link to="/ofertas" className={`hover:text-primary transition-colors ${isActive("/ofertas") ? "font-semibold text-primary" : ""}`}>
                Ofertas
              </Link>
            </li>
            <li>
              <Link to="/builds" className={`hover:text-primary transition-colors ${isActive("/builds") ? "font-semibold text-primary" : ""}`}>
                Builds
              </Link>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">Hardware</a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">Comunidade</a>
            </li>
          </ul>
          <div className="flex items-center gap-3 border-l border-border pl-6">
            <button className="sm:hidden text-muted-foreground hover:text-foreground">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="lg:hidden text-muted-foreground hover:text-foreground">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
