import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Sin sesión, cualquier pantalla de la app redirige al inicio de sesión.
export default function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const loc = useLocation();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return <Outlet />;
}
