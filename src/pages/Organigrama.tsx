import React from "react";
import { Network } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrgNode {
  name: string;
  role: string;
  children?: OrgNode[];
}

const orgData: OrgNode = {
  name: "María González",
  role: "Directora General",
  children: [
    {
      name: "Carlos Ramírez",
      role: "Director de Tecnología",
      children: [
        { name: "Ana Torres", role: "Líder de Desarrollo" },
        { name: "Pedro Díaz", role: "Líder de Infraestructura" },
      ],
    },
    {
      name: "Laura Mendoza",
      role: "Directora de Operaciones",
      children: [
        { name: "Jorge Castillo", role: "Coord. de Logística" },
        { name: "Diana Reyes", role: "Coord. de Calidad" },
      ],
    },
    {
      name: "Roberto Silva",
      role: "Director Financiero",
      children: [
        { name: "Sofía Herrera", role: "Contadora Senior" },
        { name: "Miguel Vargas", role: "Analista Financiero" },
      ],
    },
    {
      name: "Patricia Luna",
      role: "Directora de RRHH",
      children: [
        { name: "Fernando Ruiz", role: "Coord. de Selección" },
        { name: "Camila Ortiz", role: "Coord. de Bienestar" },
      ],
    },
  ],
};

const OrgCard: React.FC<{ name: string; role: string; isRoot?: boolean }> = ({ name, role, isRoot }) => (
  <div className={cn(
    "bg-card border border-border rounded-xl px-4 py-3 text-center shadow-sm hover:shadow-md transition-shadow min-w-[140px]",
    isRoot && "border-primary/30 bg-primary/5"
  )}>
    <div className={cn(
      "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold",
      isRoot ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
    )}>
      {name.split(" ").map((n) => n[0]).join("")}
    </div>
    <p className="text-sm font-semibold text-foreground leading-tight">{name}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{role}</p>
  </div>
);

const Organigrama: React.FC = () => {
  return (
    <div className="max-w-6xl space-y-8">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-1">
          <Network className="w-7 h-7 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Organigrama</h1>
        </div>
        <p className="text-muted-foreground ml-10">Estructura organizacional de la empresa</p>
      </div>

      <div className="overflow-x-auto pb-4 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
        <div className="flex flex-col items-center gap-2 min-w-[700px] px-4">
          {/* CEO */}
          <OrgCard name={orgData.name} role={orgData.role} isRoot />

          {/* Connector line */}
          <div className="w-px h-6 bg-border" />

          {/* Horizontal line */}
          <div className="relative w-full max-w-3xl">
            <div className="absolute top-0 left-[12.5%] right-[12.5%] h-px bg-border" />
          </div>

          {/* Directors row */}
          <div className="grid grid-cols-4 gap-4 w-full max-w-3xl">
            {orgData.children?.map((dir) => (
              <div key={dir.name} className="flex flex-col items-center gap-2">
                <div className="w-px h-4 bg-border" />
                <OrgCard name={dir.name} role={dir.role} />
                <div className="w-px h-4 bg-border" />
                {/* Sub-reports */}
                <div className="flex flex-col items-center gap-2 w-full">
                  {dir.children?.map((sub) => (
                    <OrgCard key={sub.name} name={sub.name} role={sub.role} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organigrama;
