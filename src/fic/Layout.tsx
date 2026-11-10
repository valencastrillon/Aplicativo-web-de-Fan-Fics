import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { Compass, BookOpen, PenSquare, Search, Library } from "lucide-react";
import LanguageFooter from "./LanguageFooter";
import UserMenu from "./UserMenu";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Descubrir", icon: Compass, end: true },
  { to: "/biblioteca", label: "Biblioteca", icon: Library },
  { to: "/estudio", label: "Estudio", icon: PenSquare },
];

export default function FicLayout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6 h-[72px]">
          <Link to="/" className="flex items-center gap-2 tracking-tight">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-read font-medium text-2xl">Nocturna</span>
          </Link>
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 ml-2 lg:ml-4">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cn("rounded-full px-3 lg:px-4 py-2 text-sm font-medium transition-colors", isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}>{n.label}</NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <form onSubmit={(e) => { e.preventDefault(); const v = new FormData(e.currentTarget).get("q")?.toString().trim(); navigate(v ? `/buscar?q=${encodeURIComponent(v)}` : "/buscar"); }} className="hidden sm:flex items-center gap-2 rounded-full bg-secondary px-4 h-10 w-44 lg:w-64 min-w-0">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input name="q" placeholder="Autores, obras, categorías…" className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground" />
            </form>
            <Link to="/buscar" aria-label="Buscar" className="sm:hidden grid h-10 w-10 place-items-center rounded-full bg-secondary"><Search className="h-4 w-4 text-muted-foreground" /></Link>
            <UserMenu />
          </div>
        </div>
      </header>
      <Outlet />
      <LanguageFooter />
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/90 backdrop-blur-xl grid grid-cols-3">
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cn("flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
            <n.icon className="h-5 w-5" />{n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
