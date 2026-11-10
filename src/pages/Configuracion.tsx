import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, User, Mail, Lock, Check } from "lucide-react";
import { toast } from "sonner";

const Configuracion: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const isDemo = user?.id === "demo-001";
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (isDemo) { toast.info("Regístrate para modificar tu perfil."); return; }
    setSaving(true);
    const ok = await updateProfile({ username, email });
    setSaving(false);
    if (ok) toast.success("Perfil actualizado correctamente");
    else toast.error("Error al actualizar el perfil");
  };

  const handleChangePassword = async () => {
    if (isDemo) { toast.info("Regístrate para cambiar tu contraseña."); return; }
    if (newPassword.length < 6) { toast.error("La contraseña debe tener al menos 6 caracteres"); return; }
    if (newPassword !== confirmPassword) { toast.error("Las contraseñas no coinciden"); return; }
    setSaving(true);
    const ok = await updateProfile({ password: newPassword });
    setSaving(false);
    if (ok) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Contraseña actualizada correctamente");
    } else {
      toast.error("Error al actualizar la contraseña");
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-1">
          <Settings className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        </div>
        <p className="text-muted-foreground ml-10">Administra tu cuenta y preferencias</p>
      </div>

      {isDemo && (
        <div className="bg-accent rounded-lg p-4 text-sm text-accent-foreground animate-fade-in-up">
          Estás en modo demo. Regístrate para modificar tu perfil.
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-6 space-y-5 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <User className="w-5 h-5 text-muted-foreground" /> Información del perfil
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cfg-username">Nombre de usuario</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="cfg-username" value={username} onChange={(e) => setUsername(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cfg-email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="cfg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
            </div>
          </div>
        </div>
        <Button onClick={handleSaveProfile} disabled={saving} className="active:scale-[0.98] transition-transform">
          <Check className="w-4 h-4 mr-1" /> {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-5 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Lock className="w-5 h-5 text-muted-foreground" /> Cambiar contraseña
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-pw">Contraseña actual</Label>
            <Input id="current-pw" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-pw">Nueva contraseña</Label>
            <Input id="new-pw" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-pw">Confirmar nueva contraseña</Label>
            <Input id="confirm-pw" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
          </div>
        </div>
        <Button onClick={handleChangePassword} disabled={saving} className="active:scale-[0.98] transition-transform">
          <Lock className="w-4 h-4 mr-1" /> {saving ? "Actualizando..." : "Actualizar contraseña"}
        </Button>
      </div>
    </div>
  );
};

export default Configuracion;
