import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import logoImg from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  const links = [
    { to: "/admin", label: "Dashboard", exact: true },
    { to: "/admin/produtos", label: "Produtos" },
    { to: "/admin/ofertas/nova", label: "Ofertas" },
    { to: "/admin/builds/nova", label: "Builds" },
    { to: "/admin/banners", label: "Banners" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  const email = user?.email ?? "";
  const initial = (email[0] || "A").toUpperCase();

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted text-foreground"
                aria-label="Abrir menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle className="flex items-center gap-2">
                  <img alt="DescontoGamer" className="h-8 w-auto object-contain" src={logoImg} />
                  <span className="text-xs font-normal bg-muted px-2 py-0.5 rounded text-muted-foreground">
                    Admin
                  </span>
                </SheetTitle>
              </SheetHeader>
              <ul className="flex flex-col p-2">
                {links.map((link) => {
                  const active = link.exact
                    ? location.pathname === link.to
                    : isActive(link.to);
                  return (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-sm transition-colors ${
                          active
                            ? "bg-primary/10 font-bold text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-border p-2 mt-auto">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/admin" className="flex-shrink-0 flex items-center gap-2">
            <img alt="DescontoGamer" className="h-9 md:h-10 w-auto object-contain" src={logoImg} />
            <span className="text-xs font-normal bg-muted px-2 py-0.5 rounded text-muted-foreground hidden md:inline">
              Admin
            </span>
          </Link>
        </div>

        <div className="flex-1 max-w-xl mx-auto hidden sm:block">
          <div className="relative">
            <input
              className="w-full bg-muted border-none rounded-full py-2.5 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary text-foreground shadow-inner"
              placeholder="Buscar no painel..."
              type="text"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <ul className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            {links.map((link) => {
              const active = link.exact
                ? location.pathname === link.to
                : isActive(link.to);
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`hover:text-primary transition-colors ${active ? "font-bold text-primary" : ""}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-3 border-l border-border pl-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded-lg transition-colors outline-none">
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {initial}
                  </div>
                  <div className="hidden md:block text-left max-w-[160px]">
                    <p className="text-xs font-bold text-foreground truncate">{email || "Admin"}</p>
                    <p className="text-[10px] text-muted-foreground">Administrador</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-normal">Logado como</span>
                    <span className="text-sm font-semibold truncate">{email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
