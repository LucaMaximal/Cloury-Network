import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocation } from "wouter";
import { AuthUser } from "@workspace/api-client-react";
import { 
  useGetMe,
  getGetMeQueryKey,
  useLogin, 
  useLogout, 
  useRegister,
  LoginInput,
  RegisterInput 
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isTeam: boolean;
  login: (data: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: user, isLoading, refetch } = useGetMe({
    query: {
      retry: false,
      queryKey: getGetMeQueryKey(),
    }
  });

  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();

  const login = async (data: LoginInput) => {
    try {
      await loginMutation.mutateAsync({ data });
      await refetch();
      const me = await refetch();
      if (me.data?.role && me.data.role !== "Player") {
        setLocation("/dashboard");
      } else {
        setLocation(`/profile/${me.data?.username}`);
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Fehler beim Login",
        description: "Bitte überprüfe deine Zugangsdaten.",
      });
      throw e;
    }
  };

  const registerUser = async (data: RegisterInput) => {
    try {
      await registerMutation.mutateAsync({ data });
      await refetch();
      const me = await refetch();
      setLocation(`/profile/${me.data?.username}`);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Fehler bei der Registrierung",
        description: "Möglicherweise ist die E-Mail oder der Username bereits vergeben.",
      });
      throw e;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      await refetch();
      setLocation("/");
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  const isAuthenticated = !!user;
  const isTeam = isAuthenticated && user?.role !== "Player";

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isAuthenticated,
        isTeam,
        login,
        logout,
        register: registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
