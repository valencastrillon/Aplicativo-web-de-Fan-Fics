import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, FileText, BookText, Users, TrendingUp, Clock } from "lucide-react";

const stats = [
  { label: "Documentos", value: "24", icon: FileText, color: "text-primary" },
  { label: "Glosarios", value: "2", icon: BookText, color: "text-accent-foreground" },
  { label: "Usuarios activos", value: "18", icon: Users, color: "text-success" },
  { label: "Actualizaciones", value: "7", icon: TrendingUp, color: "text-warning" },
];

const recentDocs = [
  { title: "Manual Cierre Bot", date: "02/03/2026", type: "PDF" },
  { title: "Manual de Usuario - Módulo Back UMM", date: "27/02/2026", type: "PDF" },
  { title: "Procedimiento de Seguridad v3", date: "25/02/2026", type: "PDF" },
  { title: "Acta Reunión Trimestral", date: "20/02/2026", type: "DOC" },
];

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-1">
          <Building2 className="w-7 h-7 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Bienvenido, {user?.username}</h1>
        </div>
        <p className="text-muted-foreground ml-10">Panel principal de la Intranet Empresarial</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">{s.value}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          Documentos recientes
        </h2>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {recentDocs.map((doc, i) => (
            <div key={doc.title} className={`flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-muted/50 transition-colors cursor-pointer ${i !== recentDocs.length - 1 ? "border-b border-border" : ""}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg card-header-accent flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.date}</p>
                </div>
              </div>
              <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full shrink-0 ml-2">{doc.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
