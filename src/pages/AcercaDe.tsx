import React from "react";
import { Building2, Target, Eye, Compass, CheckCircle } from "lucide-react";

const AcercaDe: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-1">
          <Building2 className="w-7 h-7 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Acerca de la Empresa</h1>
        </div>
        <p className="text-muted-foreground ml-10">Conoce nuestra identidad corporativa</p>
      </div>

      {/* Misión */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <div className="card-header-accent px-6 py-4 flex items-center gap-3">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Misión</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Somos una empresa comprometida con la excelencia operativa y la innovación tecnológica, dedicada a brindar soluciones integrales que optimicen los procesos de nuestros clientes. Trabajamos con responsabilidad, transparencia y un enfoque centrado en las personas, generando valor sostenible para nuestros colaboradores, socios y la comunidad.
          </p>
        </div>
      </div>

      {/* Visión */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <div className="card-header-accent px-6 py-4 flex items-center gap-3">
          <Eye className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Visión</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Para el año 2030, ser reconocidos como líderes en transformación digital a nivel regional, destacándonos por la calidad de nuestros servicios, la innovación constante y el desarrollo del talento humano, contribuyendo al crecimiento económico y social de las comunidades donde operamos.
          </p>
        </div>
      </div>

      {/* Objetivo General */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm animate-fade-in-up" style={{ animationDelay: "300ms" }}>
        <div className="card-header-accent px-6 py-4 flex items-center gap-3">
          <Compass className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Objetivo General</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Consolidar la posición de la empresa en el mercado mediante la implementación de estrategias de innovación, mejora continua y desarrollo organizacional que garanticen la satisfacción del cliente y el crecimiento sostenible del negocio.
          </p>
        </div>
      </div>

      {/* Objetivos Específicos */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm animate-fade-in-up" style={{ animationDelay: "400ms" }}>
        <div className="card-header-accent px-6 py-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Objetivos Específicos</h2>
        </div>
        <div className="p-6 space-y-3">
          {[
            "Incrementar la eficiencia operativa en un 20% mediante la automatización de procesos clave.",
            "Desarrollar e implementar un programa de capacitación continua para todos los colaboradores.",
            "Expandir la cartera de clientes en un 15% anual a través de estrategias de marketing digital.",
            "Reducir los tiempos de respuesta al cliente en un 30% mediante la optimización de canales de atención.",
            "Implementar un sistema de gestión de calidad certificado bajo estándares internacionales.",
            "Fomentar una cultura organizacional basada en la innovación, la colaboración y la responsabilidad social.",
          ].map((obj, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">{i + 1}</span>
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">{obj}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcercaDe;
