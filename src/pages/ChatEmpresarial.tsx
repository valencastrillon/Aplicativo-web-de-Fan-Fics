import React, { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Image, Send, Heart, MessageCircle, Clock, X, Trash2, Pencil, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { usePosts, useCreatePost, useToggleLike, useAddComment, useDeletePost, useEditComment, useDeleteComment } from "@/hooks/usePosts";
import { toast } from "sonner";

const ChatEmpresarial: React.FC = () => {
  const { user } = useAuth();
  const isDemo = user?.id === "demo-001";
  const { data: posts = [], isLoading } = usePosts();
  const createPost = useCreatePost();
  const toggleLike = useToggleLike();
  const addComment = useAddComment();
  const deletePost = useDeletePost();
  const editComment = useEditComment();
  const deleteComment = useDeleteComment();

  const [newPost, setNewPost] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    if (isDemo) { toast.info("Regístrate para publicar."); return; }
    if (!newPost.trim() && !imageFile) return;
    createPost.mutate(
      { text: newPost.trim(), imageFile: imageFile || undefined },
      {
        onSuccess: () => {
          setNewPost("");
          setImageFile(null);
          setImagePreview(null);
          toast.success("Publicación creada");
        },
        onError: () => toast.error("Error al publicar"),
      }
    );
  };

  const handleLike = (postId: string, liked: boolean) => {
    if (isDemo) return;
    toggleLike.mutate({ postId, liked });
  };

  const handleComment = (postId: string) => {
    if (isDemo) { toast.info("Regístrate para comentar."); return; }
    const text = commentTexts[postId]?.trim();
    if (!text) return;
    addComment.mutate(
      { postId, text },
      {
        onSuccess: () => setCommentTexts((prev) => ({ ...prev, [postId]: "" })),
      }
    );
  };

  const handleDelete = (postId: string) => {
    deletePost.mutate(postId, { onSuccess: () => toast.success("Publicación eliminada") });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-1">
          <MessageSquare className="w-7 h-7 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Chat Empresarial</h1>
        </div>
        <p className="text-muted-foreground ml-10">Comparte novedades con tus compañeros</p>
      </div>

      {isDemo && (
        <div className="bg-accent rounded-lg p-4 text-sm text-accent-foreground animate-fade-in-up">
          Estás en modo demo. Regístrate para publicar y comentar.
        </div>
      )}

      {/* New post */}
      <div className="bg-card rounded-xl border border-border p-4 sm:p-5 shadow-sm animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
            {(user?.username || "U").substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <Textarea placeholder="¿Qué quieres compartir con el equipo?" value={newPost} onChange={(e) => setNewPost(e.target.value)} className="min-h-[80px] resize-none" />
            {imagePreview && (
              <div className="relative mt-3 inline-block">
                <img src={imagePreview} alt="Vista previa" className="max-h-48 rounded-lg border border-border" />
                <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div className="flex items-center justify-between mt-3">
              <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Image className="w-4 h-4" /> Foto
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              <Button size="sm" onClick={handlePublish} disabled={(!newPost.trim() && !imageFile) || createPost.isPending} className="active:scale-[0.97] transition-transform">
                <Send className="w-3.5 h-3.5 mr-1.5" /> {createPost.isPending ? "Publicando..." : "Publicar"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="bg-card rounded-xl border border-border h-40 animate-pulse" />)}</div>
      ) : posts.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center animate-fade-in-up">
          <p className="text-muted-foreground">No hay publicaciones aún. Sé el primero en compartir algo.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, idx) => (
            <div key={post.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm animate-fade-in-up" style={{ animationDelay: `${200 + idx * 80}ms` }}>
              <div className="px-4 sm:px-5 pt-4 sm:pt-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground text-xs font-bold">
                    {post.author_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{post.author_name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(post.created_at), "d MMM yyyy, HH:mm", { locale: es })}
                    </p>
                  </div>
                </div>
                {post.user_id === user?.id && (
                  <button onClick={() => handleDelete(post.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="px-4 sm:px-5 py-3">
                {post.text && <p className="text-sm text-foreground leading-relaxed">{post.text}</p>}
                {post.image_url && <img src={post.image_url} alt="Publicación" className="mt-3 rounded-lg border border-border max-h-80 w-full object-cover" />}
              </div>

              <div className="px-4 sm:px-5 py-2 border-t border-border flex items-center gap-4">
                <button onClick={() => handleLike(post.id, post.liked)} className={cn("flex items-center gap-1.5 text-sm transition-colors active:scale-[0.95]", post.liked ? "text-destructive" : "text-muted-foreground hover:text-destructive")}>
                  <Heart className={cn("w-4 h-4", post.liked && "fill-destructive")} /> {post.likes_count}
                </button>
                <button onClick={() => setShowComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-4 h-4" /> {post.comments.length}
                </button>
              </div>

              {showComments[post.id] && (
                <div className="px-4 sm:px-5 pb-4 border-t border-border pt-3 space-y-3">
                  {post.comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-2.5 group">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-foreground text-[10px] font-bold shrink-0">
                        {c.author_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="bg-muted rounded-lg px-3 py-2 flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground">{c.author_name}</p>
                        {editingComment === c.id ? (
                          <div className="flex items-center gap-1.5 mt-1">
                            <input
                              type="text"
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  editComment.mutate({ commentId: c.id, text: editCommentText.trim() }, { onSuccess: () => setEditingComment(null) });
                                } else if (e.key === "Escape") {
                                  setEditingComment(null);
                                }
                              }}
                              className="flex-1 h-6 rounded border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                              autoFocus
                            />
                            <button
                              onClick={() => editComment.mutate({ commentId: c.id, text: editCommentText.trim() }, { onSuccess: () => setEditingComment(null) })}
                              className="text-primary hover:text-primary/80 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setEditingComment(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-0.5">{c.text}</p>
                        )}
                      </div>
                      {c.user_id === user?.id && editingComment !== c.id && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 pt-1">
                          <button
                            onClick={() => { setEditingComment(c.id); setEditCommentText(c.text); }}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteComment.mutate(c.id, { onSuccess: () => toast.success("Comentario eliminado") })}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Escribe un comentario..."
                      value={commentTexts[post.id] || ""}
                      onChange={(e) => setCommentTexts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleComment(post.id)}
                      className="flex-1 h-8 rounded-lg border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <Button size="sm" variant="ghost" onClick={() => handleComment(post.id)} className="h-8 w-8 p-0">
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatEmpresarial;
