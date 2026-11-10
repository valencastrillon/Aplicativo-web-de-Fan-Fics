import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Home, Info, FolderOpen, BookText, Settings, LogOut, ChevronDown, FileText, FileCheck, ListChecks, Moon, Sun, Building2, Menu, X, MessageSquare, Network,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Inicio", icon: Home, to: "/" },
  {
    label: "Información General",
    icon: Info,
    children: [
      { label: "Acerca de", to: "/info/acerca", icon: Building2 },
      { label: "Organigrama", to: "/info/organigrama", icon: Network },
    ],
  },
  {
    label: "Documentos",
    icon: FolderOpen,
    children: [
      { label: "Manuales", to: "/documentos/manuales", icon: FileText },
      { label: "Actas", to: "/documentos/actas", icon: FileCheck },
      { label: "Procedimientos", to: "/documentos/procedimientos", icon: ListChecks },
    ],
  },
  {
    label: "Glosarios",
    icon: BookText,
    children: [
      { label: "Técnico", to: "/glosarios/tecnico", icon: Settings },
      { label: "Institucional", to: "/glosarios/institucional", icon: BookText },
    ],
  },
  { label: "Chat Empresarial", icon: MessageSquare, to: "/chat" },
];

const SidebarNav: React.FC = () => {
  const { logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ Documentos: true, Glosarios: true });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const closeMobile = () => setMobileOpen(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-sidebar-foreground leading-tight">Intranet</h2>
            <h2 className="text-sm font-bold text-sidebar-foreground leading-tight">Empresarial</h2>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) =>
          item.children ? (
            <div key={item.label}>
              <button
                onClick={() => toggleMenu(item.label)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", openMenus[item.label] && "rotate-180")} />
              </button>
              {openMenus[item.label] && (
                <div className="ml-5 pl-4 border-l border-sidebar-border space-y-0.5 mt-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )
                      }
                    >
                      {child.icon && <child.icon className="w-3.5 h-3.5" />}
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMobile}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          )
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button onClick={toggle} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDark ? "Modo claro" : "Modo oscuro"}
        </button>
        <NavLink
          to="/configuracion"
          onClick={closeMobile}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent"
            )
          }
        >
          <Settings className="w-4 h-4" />
          Configuración
        </NavLink>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center shadow-md"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40" onClick={closeMobile} />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button onClick={closeMobile} className="absolute top-4 right-4 text-sidebar-foreground">
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex-col shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
};

export default SidebarNav;
