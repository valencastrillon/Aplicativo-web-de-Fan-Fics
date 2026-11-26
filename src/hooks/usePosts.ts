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

const getDemoPosts = (): Post[] => {
  const now = Date.now();
  return [
    {
      id: "demo-post-1",
      user_id: "demo-user-1",
      author_name: "Carlos Méndez",
      text: "Se informa que el próximo viernes 28 de marzo se realizará mantenimiento preventivo en los servidores. Por favor, guarden sus avances antes de las 6:00 PM.",
      image_url: null,
      likes_count: 3,
      created_at: new Date(now - 2 * 86400000).toISOString(),
      liked: false,
      comments: [
        { id: "demo-c1", user_id: "demo-user-2", author_name: "Laura Jiménez", text: "Gracias por el aviso, Carlos. ¿Se verá afectado el acceso al correo corporativo?", created_at: new Date(now - 46 * 3600000).toISOString() },
        { id: "demo-c2", user_id: "demo-user-1", author_name: "Carlos Méndez", text: "No, el correo no se verá afectado. Solo los sistemas internos estarán fuera de servicio por aproximadamente 2 horas.", created_at: new Date(now - 45 * 3600000).toISOString() },
        { id: "demo-c3", user_id: "demo-user-3", author_name: "Andrés Rojas", text: "Entendido. Informaré a mi equipo para que tomen las precauciones necesarias.", created_at: new Date(now - 44 * 3600000).toISOString() },
      ],
    },
    {
      id: "demo-post-2",
      user_id: "demo-user-2",
      author_name: "Laura Jiménez",
      text: "Felicidades al equipo de Recursos Humanos por la exitosa jornada de capacitación de ayer. Excelente organización y contenido.",
      image_url: null,
      likes_count: 5,
      created_at: new Date(now - 86400000).toISOString(),
      liked: true,
      comments: [
        { id: "demo-c4", user_id: "demo-user-1", author_name: "Carlos Méndez", text: "Totalmente de acuerdo, fue una jornada muy productiva.", created_at: new Date(now - 20 * 3600000).toISOString() },
        { id: "demo-c5", user_id: "demo-user-3", author_name: "Andrés Rojas", text: "¿Habrá material disponible para quienes no pudimos asistir?", created_at: new Date(now - 18 * 3600000).toISOString() },
        { id: "demo-c6", user_id: "demo-user-2", author_name: "Laura Jiménez", text: "Sí, Andrés. Subiré las presentaciones a la sección de Manuales esta tarde.", created_at: new Date(now - 17 * 3600000).toISOString() },
      ],
    },
    {
      id: "demo-post-3",
      user_id: "demo-user-3",
      author_name: "Andrés Rojas",
      text: "Recordatorio: la reunión de planeación trimestral será el lunes a las 9:00 AM en la sala de conferencias principal. Confirmen asistencia.",
      image_url: null,
      likes_count: 2,
      created_at: new Date(now - 5 * 3600000).toISOString(),
      liked: false,
      comments: [
        { id: "demo-c7", user_id: "demo-user-2", author_name: "Laura Jiménez", text: "Confirmada mi asistencia. ¿Se necesita preparar algún informe previo?", created_at: new Date(now - 4 * 3600000).toISOString() },
        { id: "demo-c8", user_id: "demo-user-3", author_name: "Andrés Rojas", text: "Sí, por favor traigan el avance de objetivos del trimestre actual.", created_at: new Date(now - 3 * 3600000).toISOString() },
      ],
    },
  ];
};

export interface Post {
  id: string;
  user_id: string;
  author_name: string;
  text: string;
  image_url: string | null;
  likes_count: number;
  created_at: string;
  liked: boolean;
  comments: Comment[];
}

export interface Comment {
  id: string;
  user_id: string;
  author_name: string;
  text: string;
  created_at: string;
}

export const usePosts = () => {
  const { user } = useAuth();
  const isDemo = user?.id === "demo-001";

  return useQuery({
    queryKey: ["posts", user?.id],
    queryFn: async (): Promise<Post[]> => {
      if (isDemo) return getDemoPosts();

      const res = await fetch("/api/posts", {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Error cargando publicaciones");
      return res.json();
    },
    enabled: !!user,
    staleTime: isDemo ? Infinity : 0,
  });
};

export const useCreatePost = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: { text: string; imageFile?: File }) => {
      const image_url = data.imageFile ? await fileToDataUrl(data.imageFile) : null;

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ text: data.text, image_url }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Error creando publicación");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useToggleLike = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId }: { postId: string; liked?: boolean }) => {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Error al dar like");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useAddComment = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, text }: { postId: string; text: string }) => {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Error agregando comentario");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useEditComment = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, text }: { commentId: string; text: string }) => {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Error editando comentario");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDeleteComment = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Error eliminando comentario");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDeletePost = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Error eliminando publicación");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};