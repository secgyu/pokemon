import { useState, useEffect, useCallback } from "react";
import type { AuthUser } from "@/lib/api";
import { apiLogin, apiSignup, apiFetchMe } from "@/lib/api";

const TOKEN_KEY = "pokemon-auth-token";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }

    apiFetchMe(stored)
      .then((me) => {
        setToken(stored);
        setUser(me);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    localStorage.setItem(TOKEN_KEY, result.accessToken);
    setToken(result.accessToken);
    setUser(result.user);
  }, []);

  const signup = useCallback(
    async (email: string, nickname: string, password: string) => {
      const result = await apiSignup(email, nickname, password);
      localStorage.setItem(TOKEN_KEY, result.accessToken);
      setToken(result.accessToken);
      setUser(result.user);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
  } as const;
}
