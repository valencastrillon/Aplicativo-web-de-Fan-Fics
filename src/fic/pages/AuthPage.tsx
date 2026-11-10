import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { lovable } from "@/integrations/lovable/index";

export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const { login, register, loginDemo } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ username: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const r = isLogin ? await login(f.email, f.password) : await register(f.username, f.email, f.password);
    setBusy(false);
    if (!r.ok) return toast.error(r.error || "No se pudo continuar");
    if (isLogin) nav("/");
    else { toast.success("Revisa tu correo para confirmar tu cuenta."); nav("/login"); }
  };

  const social = async (p: "google") => {
    const r = await lovable.auth.signInWithOAuth(p, { redirect_uri: window.location.origin });
    if (r.error) toast.error("No se pudo iniciar sesión");
    else if (!r.redirected) nav("/");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-5 py-12">
      <div className="w-full max-w-sm animate-fade-in">
        <Link to="/" className="flex flex-col items-center gap-3 mb-10">
          <BookOpen className="h-7 w-7 text-primary" />
          <span className="font-read text-3xl tracking-tight">Nocturna</span>
        </Link>
        <h1 className="text-center text-xl font-semibold">{isLogin ? "Iniciar sesión" : "Crear cuenta"}</h1>
        <p className="text-center text-sm text-muted-foreground mt-1 mb-8">{isLogin ? "Continúa donde dejaste tu lectura." : "Únete a la comunidad de lectores y autores."}</p>

        <div className="grid gap-3">
          <Button variant="outline" className="h-11 rounded-xl" onClick={() => social("google")}>Continuar con Google</Button>
        </div>
        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />o con tu correo<span className="h-px flex-1 bg-border" /></div>

        <form onSubmit={submit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5"><Label htmlFor="u">Nombre de usuario</Label>
              <Input id="u" required value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} className="h-11 rounded-xl" /></div>
          )}
          <div className="space-y-1.5"><Label htmlFor="e">Correo electrónico</Label>
            <Input id="e" type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className="h-11 rounded-xl" /></div>
          <div className="space-y-1.5"><Label htmlFor="p">Contraseña</Label>
            <Input id="p" type="password" minLength={6} required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} className="h-11 rounded-xl" /></div>
          <Button type="submit" disabled={busy} className="w-full h-11 rounded-xl">{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isLogin ? "Entrar" : "Registrarme"}</Button>
        </form>
        {isLogin && <Button variant="ghost" className="w-full mt-2 rounded-xl text-muted-foreground" onClick={() => { loginDemo(); nav("/"); }}>Probar demo</Button>}
        <p className="text-center text-sm text-muted-foreground mt-8">
          {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <Link to={isLogin ? "/registro" : "/login"} className="text-primary font-medium hover:underline">{isLogin ? "Regístrate" : "Inicia sesión"}</Link>
        </p>
      </div>
    </div>
  );
}
