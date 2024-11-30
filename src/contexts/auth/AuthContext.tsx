"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/auth/auth";
import { AuthContextType } from "@/lib/types/auth";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(AuthService.isTokenValid());
  }, []);

  const login = (token: string) => {
    AuthService.setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    AuthService.removeToken();
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
