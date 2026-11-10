import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

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

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const mapUser = (su: SupabaseUser): User => ({
  id: su.id,
  username: su.user_metadata?.username || su.email?.split("@")[0] || "Usuario",
  email: su.email || "",
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapUser(session.user));
        setIsDemo(false);
      } else if (!isDemo) {
        setUser(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapUser(session.user));
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username }, emailRedirectTo: window.location.origin },
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const loginDemo = useCallback(() => {
    setIsDemo(true);
    setUser({ id: "demo-001", username: "Lector Demo", email: "demo@nocturna.app" });
  }, []);

  const logout = useCallback(async () => {
    if (isDemo) {
      setUser(null);
      setIsDemo(false);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
  }, [isDemo]);

  const updateProfile = useCallback(async (data: { username?: string; email?: string; password?: string }) => {
    if (isDemo) {
      setUser((prev) => prev ? { ...prev, ...(data.username ? { username: data.username } : {}), ...(data.email ? { email: data.email } : {}) } : prev);
      return true;
    }
    const updates: Record<string, unknown> = {};
    if (data.email) updates.email = data.email;
    if (data.password) updates.password = data.password;
    if (data.username) updates.data = { username: data.username };
    const { error } = await supabase.auth.updateUser(updates);
    if (error) return false;
    if (data.username || data.email) {
      setUser((prev) => prev ? { ...prev, ...(data.username ? { username: data.username } : {}), ...(data.email ? { email: data.email } : {}) } : prev);
    }
    return true;
  }, [isDemo]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, loginDemo, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
