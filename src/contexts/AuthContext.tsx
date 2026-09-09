import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleChecking, setIsRoleChecking] = useState(false);

  const checkAdminRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    return !!data;
  };

  useEffect(() => {
    let mounted = true;
    let currentUserId: string | null = null;

    // First, restore session from storage
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      currentUserId = session?.user?.id ?? null;

      if (session?.user) {
        const admin = await checkAdminRole(session.user.id);
        if (mounted) setIsAdmin(admin);
      }
      if (mounted) setIsLoading(false);
    });

    // Then listen for future changes (sign in/out / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);

        const newUserId = session?.user?.id ?? null;
        const userChanged = newUserId !== currentUserId;
        currentUserId = newUserId;

        // Ignore noise events that don't change the user (TOKEN_REFRESHED,
        // INITIAL_SESSION on tab focus). Avoid toggling isLoading because it
        // unmounts protected routes and wipes form state.
        if (!userChanged) return;

        if (session?.user) {
          // Recheck role WITHOUT flipping isLoading so the admin route
          // children (forms) don't get unmounted. isRoleChecking keeps the
          // guard in a loading state instead of flashing "Acesso Negado".
          setIsRoleChecking(true);
          setTimeout(async () => {
            if (!mounted) return;
            const admin = await checkAdminRole(session.user.id);
            if (!mounted) return;
            setIsAdmin(admin);
            setIsRoleChecking(false);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsRoleChecking(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ session, user, isAdmin, isLoading: isLoading || isRoleChecking, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
