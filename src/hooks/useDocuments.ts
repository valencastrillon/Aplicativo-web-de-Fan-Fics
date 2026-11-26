import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const TOKEN_KEY = "nocturna_token";

const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getDemoDocs = (category: DocCategory): Document[] => {
  const now = Date.now();
  const demos: Record<DocCategory, Document[]> = {
    manual: [
      { id: "demo-m1", title: "Manual de Usuario - Sistema ERP", description: "Guía completa para el uso del sistema ERP corporativo", category: "manual", file_url: null, file_name: "manual_erp.pdf", created_at: new Date(now - 5 * 86400000).toISOString(), user_id: "demo-001", starred: true },
      { id: "demo-m2", title: "Manual de Procesos Internos", description: "Documentación de procesos y flujos de trabajo internos", category: "manual", file_url: null, file_name: "procesos_internos.pdf", created_at: new Date(now - 12 * 86400000).toISOString(), user_id: "demo-001", starred: false },
      { id: "demo-m3", title: "Manual de Seguridad Informática", description: "Políticas y procedimientos de seguridad de la información", category: "manual", file_url: null, file_name: "seguridad_info.pdf", created_at: new Date(now - 20 * 86400000).toISOString(), user_id: "demo-001", starred: false },
    ],
    acta: [
      { id: "demo-a1", title: "Acta de Reunión - Junta Directiva", description: "Acta de la reunión ordinaria de junta directiva del mes de marzo", category: "acta", file_url: null, file_name: "acta_junta_marzo.pdf", created_at: new Date(now - 3 * 86400000).toISOString(), user_id: "demo-001", starred: true },
      { id: "demo-a2", title: "Acta de Comité de Calidad", description: "Resultados de la auditoría interna y plan de mejora", category: "acta", file_url: null, file_name: "acta_calidad.pdf", created_at: new Date(now - 10 * 86400000).toISOString(), user_id: "demo-001", starred: false },
      { id: "demo-a3", title: "Acta de Entrega de Proyecto", description: "Acta de entrega formal del proyecto de modernización tecnológica", category: "acta", file_url: null, file_name: "acta_entrega_proyecto.pdf", created_at: new Date(now - 15 * 86400000).toISOString(), user_id: "demo-001", starred: false },
    ],
    procedimiento: [
      { id: "demo-p1", title: "Procedimiento de Compras", description: "Proceso estándar para solicitudes y aprobación de compras", category: "procedimiento", file_url: null, file_name: "proc_compras.pdf", created_at: new Date(now - 2 * 86400000).toISOString(), user_id: "demo-001", starred: false },
      { id: "demo-p2", title: "Procedimiento de Onboarding", description: "Proceso de incorporación de nuevos empleados a la empresa", category: "procedimiento", file_url: null, file_name: "proc_onboarding.pdf", created_at: new Date(now - 8 * 86400000).toISOString(), user_id: "demo-001", starred: true },
      { id: "demo-p3", title: "Procedimiento de Soporte Técnico", description: "Flujo de atención y escalamiento de incidencias técnicas", category: "procedimiento", file_url: null, file_name: "proc_soporte.pdf", created_at: new Date(now - 18 * 86400000).toISOString(), user_id: "demo-001", starred: false },
    ],
  };
  return demos[category];
};

export type DocCategory = "manual" | "acta" | "procedimiento";

export interface Document {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
  user_id: string;
  starred: boolean;
}

export const useDocuments = (category: DocCategory) => {
  const { user } = useAuth();
  const isDemo = user?.id === "demo-001";

  return useQuery({
    queryKey: ["documents", category, user?.id],
    queryFn: async (): Promise<Document[]> => {
      if (isDemo) return getDemoDocs(category);

      const res = await fetch(`/api/documents?category=${encodeURIComponent(category)}`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Error cargando documentos");
      return res.json();
    },
    enabled: !!user,
    staleTime: isDemo ? Infinity : 0,
  });
};

export const useAddDocument = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; description: string; category: DocCategory; file?: File }) => {
      const file_url = data.file ? await fileToDataUrl(data.file) : null;
      const file_name = data.file ? data.file.name : null;

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.category,
          file_url,
          file_name,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Error guardando documento");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};

export const useToggleFavorite = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId }: { documentId: string; starred?: boolean }) => {
      const res = await fetch(`/api/documents/${documentId}/favorite`, {
        method: "POST",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Error actualizando favorito");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};