import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

export default function Account() {
  const { user, updateProfile, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [f, setF] = useState({ username: user?.username || "", email: user?.email || "", password: "" });
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateProfile({
      username: f.username !== user.username ? f.username : undefined,
      email: f.email !== user.email ? f.email : undefined,
      password: f.password || undefined,
    });
    ok ? toast.success("Cambios guardados") : toast.error("No se pudieron guardar los cambios");
    setF({ ...f, password: "" });
  };
  const deleteAccount = async () => {
    if (user.id === "demo-001") { await logout(); navigate("/"); return toast("La cuenta demo no se puede eliminar; cerramos la sesión."); }
    setDeleting(true);
    const { error } = await supabase.functions.invoke("delete-account");
    setDeleting(false);
    if (error) return toast.error("No se pudo eliminar la cuenta. Inténtalo de nuevo.");
    await logout();
    toast.success("Tu cuenta fue eliminada");
    navigate("/");
  };
  return (
    <main className="mx-auto max-w-xl px-5 py-12">
      <h1 className="font-read text-4xl">Mi cuenta</h1>
      <p className="text-muted-foreground mt-2 mb-10">Gestiona tu perfil y tus datos de acceso.</p>
      <form onSubmit={save} className="space-y-5 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="space-y-1.5"><Label htmlFor="u">Nombre de usuario</Label><Input id="u" value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} className="h-11 rounded-xl" /></div>
        <div className="space-y-1.5"><Label htmlFor="e">Correo electrónico</Label><Input id="e" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className="h-11 rounded-xl" /></div>
        <div className="space-y-1.5"><Label htmlFor="p">Nueva contraseña</Label><Input id="p" type="password" minLength={6} placeholder="Déjalo vacío para no cambiarla" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} className="h-11 rounded-xl" /></div>
        <Button type="submit" className="rounded-xl h-11 px-6">Guardar cambios</Button>
      </form>

      <section className="mt-8 rounded-xl border border-destructive/40 bg-destructive/5 p-6 sm:p-8">
        <h2 className="font-bold text-destructive">Eliminar mi cuenta</h2>
        <p className="mt-1 text-sm text-muted-foreground">Se borrarán tu cuenta y todos tus datos. Esta acción no se puede deshacer.</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="mt-4 rounded-xl h-11 px-6" disabled={deleting}>{deleting ? "Eliminando…" : "Eliminar mi cuenta"}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar tu cuenta?</AlertDialogTitle>
              <AlertDialogDescription>Perderás tu perfil, tus comentarios e invitaciones. No podrás recuperarlos.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={deleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Sí, eliminar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </main>
  );
}
