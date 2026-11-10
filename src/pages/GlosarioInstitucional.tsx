import React from "react";
import { BookText, Building2 } from "lucide-react";

const terms = [
  { title: "KPI", desc: "Indicador Clave de Rendimiento. Métricas que miden el éxito de objetivos específicos de la organización." },
  { title: "SLA", desc: "Acuerdo de Nivel de Servicio. Un compromiso formal sobre la calidad y tiempos de respuesta del servicio." },
  { title: "Stakeholder", desc: "Persona o grupo con interés en el resultado de un proyecto o decisión empresarial." },
  { title: "Compliance", desc: "Cumplimiento normativo. Asegurar que la empresa sigue las leyes, regulaciones y políticas internas." },
  { title: "Governance", desc: "Marco de reglas, prácticas y procesos con los que se dirige y controla la organización." },
  { title: "Due Diligence", desc: "Proceso de investigación y análisis previo a una decisión importante de negocio." },
];

const GlosarioInstitucional: React.FC = () => (
  <div className="max-w-5xl space-y-6">
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-3 mb-1">
        <Building2 className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Glosario Institucional</h1>
      </div>
      <p className="text-muted-foreground ml-10 border-l-4 border-primary pl-3 mt-2">
        Términos organizacionales y de gestión empresarial
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
      {terms.map((t) => (
        <div key={t.title} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="card-header-accent p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookText className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground">{t.title}</h3>
          </div>
          <div className="p-5">
            <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default GlosarioInstitucional;
