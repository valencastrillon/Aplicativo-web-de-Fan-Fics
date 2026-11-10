import React, { useState } from "react";
import { Search, BookText, Monitor, Server, Database, GitBranch, Cog, BarChart3, Layout } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const categories = [
  { label: "Todos", value: "all" },
  { label: "Frontend", value: "frontend", icon: Monitor },
  { label: "Backend", value: "backend", icon: Server },
  { label: "Arquitectura", value: "arquitectura", icon: Layout },
  { label: "Base de Datos", value: "database", icon: Database },
  { label: "Automatización", value: "automatizacion", icon: Cog },
  { label: "Versiones", value: "versiones", icon: GitBranch },
  { label: "Gestión", value: "gestion", icon: BarChart3 },
];

const terms = [
  { title: "Frontend", category: "frontend", desc: "La \"cara\" del sistema. Todo lo que ves, tocas y donde haces clic: botones, colores, gráficos. Como el tablero y el volante de un carro.", icon: Monitor },
  { title: "Vue.js / Svelte", category: "frontend", desc: "Herramientas para construir la cara del sistema. Como tener un kit de LEGO profesional en lugar de construir cada pieza desde cero.", icon: GitBranch },
  { title: "Dashboard", category: "frontend", desc: "Un tablero de control con gráficas para ver de un vistazo cómo van las operaciones en tiempo real.", icon: BarChart3 },
  { title: "API REST", category: "backend", desc: "Un canal de comunicación entre sistemas. Como un mesero que toma tu pedido y te trae lo que pediste.", icon: Server },
  { title: "Microservicios", category: "arquitectura", desc: "Dividir un sistema grande en partes pequeñas e independientes, como departamentos de una empresa.", icon: Layout },
  { title: "SQL", category: "database", desc: "El idioma para hablar con bases de datos. Puedes pedir, guardar o modificar información.", icon: Database },
  { title: "CI/CD", category: "automatizacion", desc: "Automatizar las pruebas y la publicación del software, como una línea de ensamblaje en una fábrica.", icon: Cog },
  { title: "Git", category: "versiones", desc: "Un sistema para guardar cada versión de tu código. Como un historial de cambios que nunca se pierde.", icon: GitBranch },
  { title: "Scrum", category: "gestion", desc: "Metodología ágil para organizar proyectos en ciclos cortos de trabajo llamados sprints.", icon: BarChart3 },
];

const GlosarioTecnico: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = terms.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "all" || t.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-5xl space-y-6">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-1">
          <BookText className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Glosario Técnico</h1>
        </div>
        <p className="text-muted-foreground ml-10 border-l-4 border-primary pl-3 mt-2">
          Tu diccionario visual de tecnología - Explicado en lenguaje simple
        </p>
      </div>

      {/* Search */}
      <div className="relative animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar término técnico..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-[0.97]",
              activeCategory === cat.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground border border-border hover:bg-muted"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        {filtered.map((term) => (
          <div key={term.title} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="card-header-accent p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <term.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{term.title}</h3>
                <p className="text-xs text-primary font-medium uppercase">{term.category}</p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">{term.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlosarioTecnico;
