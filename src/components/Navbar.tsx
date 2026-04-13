import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { X, Menu, Search } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import SearchSuggestions from "@/components/SearchSuggestions";
import logoImg from "@/assets/logo.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);
  const isActive = (path: string) => location.pathname === path;
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setLocalQuery(searchQuery);
    setMobileSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setShowSuggestions(false);
    setShowMobileSuggestions(false);
  }, [location.pathname]);

  // Auto-focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => mobileInputRef.current?.focus(), 100);
    }
  }, [mobileSearchOpen]);

  // Close desktop suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = localQuery.trim();
    setSearchQuery(trimmed);
    setShowSuggestions(false);
    const isOnSearchablePage = ["/", "/ofertas", "/builds"].includes(location.pathname);
    if (!isOnSearchablePage && trimmed) {
      navigate("/");
    }
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = mobileSearchQuery.trim();
    setSearchQuery(trimmed);
    setMobileSearchOpen(false);
    setShowMobileSuggestions(false);
    const isOnSearchablePage = ["/", "/ofertas", "/builds"].includes(location.pathname);
    if (!isOnSearchablePage && trimmed) {
      navigate("/");
    } else if (!isOnSearchablePage) {
      navigate("/");
    }
  };

  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const handleMobileClear = () => {
    setMobileSearchQuery("");
    mobileInputRef.current?.focus();
  };

  return (
    <>
      <nav className="bg-surface border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <img alt="DescontoGamer Logo" className="w-10 h-10 object-contain" src={logoImg} />
            <span className="font-bold text-xl text-foreground hidden md:block">DescontoGamer</span>
          </Link>

          <form ref={desktopSearchRef} onSubmit={handleSubmit} className="flex-1 max-w-xl mx-auto hidden sm:block relative">
            <div className="relative">
              <input
                ref={inputRef}
                className="w-full bg-muted border-none rounded-full py-2.5 pl-4 pr-20 text-sm focus:ring-2 focus:ring-primary text-foreground shadow-inner"
                placeholder="Buscar ofertas, hardware, periféricos..."
                type="text"
                value={localQuery}
                onChange={(e) => { setLocalQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
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
            {showSuggestions && (
              <SearchSuggestions
                query={localQuery}
                onSelect={() => { setShowSuggestions(false); setLocalQuery(""); setSearchQuery(""); }}
              />
            )}
          </form>

          <div className="flex items-center gap-6">
            {/* Desktop nav links */}
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

            {/* Mobile: search icon + hamburger */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                className="text-muted-foreground hover:text-foreground p-1.5"
                onClick={() => {
                  setMobileSearchOpen((v) => !v);
                  setMobileMenuOpen(false);
                }}
                aria-label="Buscar"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                className="text-muted-foreground hover:text-foreground p-1.5"
                onClick={() => {
                  setMobileMenuOpen((v) => !v);
                  setMobileSearchOpen(false);
                }}
                aria-label="Abrir menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Tablet hamburger (sm-lg) */}
            <div className="hidden sm:flex lg:hidden items-center">
              <button
                className="text-muted-foreground hover:text-foreground p-1"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Abrir menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile search bar dropdown */}
      {mobileSearchOpen && (
        <div className="sm:hidden fixed top-16 left-0 right-0 z-40 bg-surface border-b border-border shadow-lg px-4 py-3 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleMobileSubmit} className="relative">
            <div className="relative">
              <input
                ref={mobileInputRef}
                className="w-full bg-muted border-none rounded-full py-2.5 pl-4 pr-20 text-sm focus:ring-2 focus:ring-primary text-foreground shadow-inner"
                placeholder="Buscar ofertas, hardware..."
                type="text"
                value={mobileSearchQuery}
                onChange={(e) => { setMobileSearchQuery(e.target.value); setShowMobileSuggestions(true); }}
                onFocus={() => setShowMobileSuggestions(true)}
              />
              {mobileSearchQuery && (
                <button
                  type="button"
                  onClick={handleMobileClear}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">search</span>
              </button>
            </div>
            {showMobileSuggestions && (
              <SearchSuggestions
                query={mobileSearchQuery}
                onSelect={() => { setShowMobileSuggestions(false); setMobileSearchOpen(false); setMobileSearchQuery(""); }}
              />
            )}
          </form>
        </div>
      )}

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-surface border-b border-border shadow-xl px-4 py-5 flex flex-col gap-5 animate-in slide-in-from-top duration-200">
            {/* Nav links */}
            <nav className="flex flex-col gap-1">
              <Link
                to="/ofertas"
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors ${isActive("/ofertas") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
              >
                <span className="material-symbols-outlined text-xl">local_offer</span>
                Ofertas Tech
              </Link>
              <Link
                to="/builds"
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors ${isActive("/builds") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
              >
                <span className="material-symbols-outlined text-xl">memory</span>
                Builds de PC
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
