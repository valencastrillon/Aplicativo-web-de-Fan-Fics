import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginDemo: () => void;
  logout: () => void;
  updateProfile: (data: { username?: string; email?: string; password?: string }) => Promise<boolean>;
}

const TOKEN_KEY = "nocturna_token";

const AuthContext = createContext<AuthContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          localStorage.removeItem(TOKEN_KEY);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error || "Error al iniciar sesión" };

      localStorage.setItem(TOKEN_KEY, data.token);
      setIsDemo(false);
      setUser(data.user);
      return { ok: true };
    } catch {
      return { ok: false, error: "No se pudo conectar con el servidor" };
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error || "Error al registrarse" };

      localStorage.setItem(TOKEN_KEY, data.token);
      setIsDemo(false);
      setUser(data.user);
      return { ok: true };
    } catch {
      return { ok: false, error: "No se pudo conectar con el servidor" };
    }
  }, []);

  const loginDemo = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setIsDemo(true);
    setUser({ id: "demo-001", username: "Lector Demo", email: "demo@nocturna.app" });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setIsDemo(false);
  }, []);

  const updateProfile = useCallback(
    async (data: { username?: string; email?: string; password?: string }) => {
      if (isDemo) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                ...(data.username ? { username: data.username } : {}),
                ...(data.email ? { email: data.email } : {}),
              }
            : prev
        );
        return true;
      }

      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return false;

      try {
        const res = await fetch("/api/auth/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) return false;

        const result = await res.json();
        if (result?.user) setUser(result.user);
        return true;
      } catch {
        return false;
      }
    },
    [isDemo]
  );

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, loginDemo, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};