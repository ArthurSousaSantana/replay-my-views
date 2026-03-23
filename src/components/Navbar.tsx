import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSearch } from "@/contexts/SearchContext";
import logoImg from "@/assets/logo.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const isActive = (path: string) => location.pathname === path;
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync local query when context changes (e.g. clearing from another page)
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = localQuery.trim();
    setSearchQuery(trimmed);

    // If on a detail or unrelated page, navigate to home
    const isOnSearchablePage = ["/", "/ofertas", "/builds"].includes(location.pathname);
    if (!isOnSearchablePage && trimmed) {
      navigate("/");
    }
  };

  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery("");
    inputRef.current?.focus();
  };

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
          <img alt="DescontoGamer Logo" className="w-10 h-10 object-contain" src={logoImg} />
          <span className="font-bold text-xl text-foreground hidden md:block">DescontoGamer</span>
        </Link>
        <form onSubmit={handleSubmit} className="flex-1 max-w-xl mx-auto hidden sm:block">
          <div className="relative">
            <input
              ref={inputRef}
              className="w-full bg-muted border-none rounded-full py-2.5 pl-4 pr-20 text-sm focus:ring-2 focus:ring-primary text-foreground shadow-inner"
              placeholder="Buscar ofertas, hardware, periféricos..."
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
            />
            {localQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
          </div>
        </form>
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
