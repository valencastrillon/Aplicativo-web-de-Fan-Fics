import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const postIds = (posts || []).map((p) => p.id);

      const { data: comments } = await supabase
        .from("comments")
        .select("*")
        .in("post_id", postIds.length > 0 ? postIds : ["__none__"])
        .order("created_at", { ascending: true });

      const { data: likes } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", user!.id);

      const likedSet = new Set(likes?.map((l) => l.post_id) || []);
      const commentsByPost: Record<string, Comment[]> = {};
      (comments || []).forEach((c) => {
        if (!commentsByPost[c.post_id]) commentsByPost[c.post_id] = [];
        commentsByPost[c.post_id].push(c);
      });

      return (posts || []).map((p) => ({
        ...p,
        text: p.text || "",
        liked: likedSet.has(p.id),
        comments: commentsByPost[p.id] || [],
      }));
    },
    enabled: !!user,
    staleTime: isDemo ? Infinity : 0,
  });
};

export const useCreatePost = () => {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: { text: string; imageFile?: File }) => {
      let image_url: string | null = null;

      if (data.imageFile) {
        const path = `${user!.id}/${Date.now()}_${data.imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from("post-images").upload(path, data.imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(path);
        image_url = urlData.publicUrl;
      }

      const { error } = await supabase.from("posts").insert({
        user_id: user!.id,
        author_name: user!.username,
        text: data.text,
        image_url,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useToggleLike = () => {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, liked }: { postId: string; liked: boolean }) => {
      if (liked) {
        await supabase.from("post_likes").delete().eq("user_id", user!.id).eq("post_id", postId);
        await supabase.from("posts").update({ likes_count: Math.max(0, 0) }).eq("id", postId);
      } else {
        await supabase.from("post_likes").insert({ user_id: user!.id, post_id: postId });
      }
      // Update count
      const { count } = await supabase.from("post_likes").select("*", { count: "exact", head: true }).eq("post_id", postId);
      await supabase.from("posts").update({ likes_count: count || 0 }).eq("id", postId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useAddComment = () => {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, text }: { postId: string; text: string }) => {
      const { error } = await supabase.from("comments").insert({
        user_id: user!.id,
        post_id: postId,
        author_name: user!.username,
        text,
      });
      if (error) throw error;
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
      const { error } = await supabase.from("comments").update({ text }).eq("id", commentId);
      if (error) throw error;
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
      const { error } = await supabase.from("comments").delete().eq("id", commentId);
      if (error) throw error;
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
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
