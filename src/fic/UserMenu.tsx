import { Link, useNavigate } from "react-router-dom";
import { User, Settings, PenSquare, Moon, Sun, LogOut, BookOpen } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const nav = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label="Menú de usuario" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-sm font-semibold transition-all hover:border-primary hover:shadow-glow">
          {user ? <span className="text-primary">{initials(user.username)}</span> : <User className="h-4 w-4 text-muted-foreground" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 rounded-xl p-2">
        {!user ? (
          <div className="p-4 text-center space-y-4">
            <BookOpen className="mx-auto h-6 w-6 text-primary" />
            <div>
              <p className="font-read text-xl">Bienvenido a Nocturna</p>
              <p className="text-sm text-muted-foreground mt-1">Guarda historias, comenta y publica.</p>
            </div>
            <div className="space-y-2">
              <Button className="w-full rounded-xl" onClick={() => nav("/login")}>Iniciar Sesión</Button>
              <Button variant="outline" className="w-full rounded-xl" onClick={() => nav("/registro")}>Registrarse</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 p-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary font-semibold text-primary">{initials(user.username)}</span>
              <div className="min-w-0">
                <p className="font-medium truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="rounded-lg py-2.5"><Link to="/perfil"><User className="mr-2 h-4 w-4" />Mi Perfil</Link></DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg py-2.5"><Link to="/cuenta?tab=config"><Settings className="mr-2 h-4 w-4" />Configuración de Cuenta</Link></DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg py-2.5"><Link to="/estudio"><PenSquare className="mr-2 h-4 w-4" />Mis Historias (Estudio)</Link></DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg py-2.5" onSelect={(e) => { e.preventDefault(); toggle(); }}>
              {isDark ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}Modo {isDark ? "Oscuro" : "Claro"}
              <Switch checked={isDark} className="ml-auto pointer-events-none" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg py-2.5 text-destructive focus:text-destructive" onSelect={() => { logout(); nav("/"); }}>
              <LogOut className="mr-2 h-4 w-4" />Cerrar Sesión
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
