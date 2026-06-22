import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// ATENÇÃO: Este guard serve apenas para fins de UX (melhorar a experiência do usuário,
// escondendo a interface administrativa de quem não é admin).
// A segurança real dos dados e as permissões de escrita/leitura são garantidas
// pelas políticas RLS (Row Level Security) diretamente no banco de dados do Supabase.
const AdminRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, session, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border border-border rounded-xl p-8 max-w-md text-center shadow-lg">
          <span className="material-symbols-outlined text-5xl text-destructive mb-4">block</span>
          <h1 className="text-xl font-bold text-foreground mb-2">Acesso Negado</h1>
          <p className="text-sm text-muted-foreground mb-6">Sua conta não possui permissões de administrador.</p>
          <button
            onClick={() => window.location.href = "/"}
            className="bg-primary text-primary-foreground font-medium px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRouteGuard;
