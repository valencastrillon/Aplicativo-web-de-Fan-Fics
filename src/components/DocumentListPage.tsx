import React, { useState, useMemo } from "react";
import { Search, Calendar, Star, Eye, Download, Plus, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddDocumentForm from "@/components/AddDocumentForm";
import { useDocuments, useAddDocument, useToggleFavorite, type DocCategory, type Document } from "@/hooks/useDocuments";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DocumentListPageProps {
  category: DocCategory;
  title: string;
  formType: "Manual" | "Acta" | "Procedimiento";
  icon: React.ReactNode;
}

const DocumentListPage: React.FC<DocumentListPageProps> = ({ category, title, formType, icon }) => {
  const { user } = useAuth();
  const isDemo = user?.id === "demo-001";
  const { data: docs = [], isLoading } = useDocuments(category);
  const addDoc = useAddDocument();
  const toggleFav = useToggleFavorite();

  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filtered = useMemo(() => {
    const list = docs.filter((d) => {
      const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || (d.description || "").toLowerCase().includes(search.toLowerCase());
      const matchFav = !showFavorites || d.starred;
      return matchSearch && matchFav;
    });
    return list.sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });
  }, [docs, search, showFavorites, sortOrder]);

  const handleAdd = (data: { title: string; desc: string; file?: File }) => {
    if (isDemo) {
      toast.info("Funcionalidad no disponible en modo demo. Regístrate para usarla.");
      return;
    }
    addDoc.mutate(
      { title: data.title, description: data.desc, category, file: data.file },
      {
        onSuccess: () => {
          toast.success(`${formType} agregado correctamente`);
          setShowForm(false);
        },
        onError: () => toast.error("Error al agregar el documento"),
      }
    );
  };

  const handleToggleStar = (doc: Document) => {
    if (isDemo) return;
    toggleFav.mutate({ documentId: doc.id, starred: doc.starred });
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-1">
          {icon}
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h1>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder={`Buscar ${formType.toLowerCase()} por título o descripción...`} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
        <Button onClick={() => setShowForm(true)} size="sm" className="active:scale-[0.97] transition-transform" disabled={showForm}>
          <Plus className="w-4 h-4 mr-1.5" />
          Agregar {formType}
        </Button>
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-[0.97]",
            showFavorites ? "bg-primary text-primary-foreground shadow-sm" : "bg-card text-muted-foreground border border-border hover:bg-muted"
          )}
        >
          <Star className={cn("w-3.5 h-3.5", showFavorites && "fill-primary-foreground")} />
          Favoritos
        </button>
        <button
          onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-card text-muted-foreground border border-border hover:bg-muted transition-all active:scale-[0.97]"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          {sortOrder === "newest" ? "Más recientes" : "Más antiguos"}
        </button>
      </div>

      {showForm && (
        <AddDocumentForm type={formType} onSubmit={handleAdd} onCancel={() => setShowForm(false)} loading={addDoc.isPending} />
      )}

      {isDemo && (
        <div className="bg-accent rounded-lg p-4 text-sm text-accent-foreground animate-fade-in-up">
          Estás en modo demo. Los datos no se guardan. Regístrate para usar todas las funcionalidades.
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl border border-border h-52 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center animate-fade-in-up">
          <p className="text-muted-foreground">
            {showFavorites ? "No tienes favoritos en esta sección." : `No hay ${title.toLowerCase()} disponibles. Agrega el primero.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          {filtered.map((doc) => (
            <div key={doc.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="card-header-accent p-4 sm:p-5 flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  {icon}
                </div>
                <span className="text-xs font-bold bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
                  {doc.file_name ? doc.file_name.split(".").pop()?.toUpperCase() || "PDF" : "PDF"}
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground leading-snug">{doc.title}</h3>
                  <button onClick={() => handleToggleStar(doc)} className="shrink-0 text-muted-foreground hover:text-warning transition-colors">
                    <Star className={cn("w-4 h-4", doc.starred && "fill-warning text-warning")} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(doc.created_at), "dd/MM/yyyy")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{doc.description || "Sin descripción"}</p>
                <div className="flex gap-2 mt-4">
                  {isDemo ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => toast.info("Estás en una versión demo. Por favor, regístrate para poder descargar este documento.")}>
                        <Eye className="w-3.5 h-3.5 mr-1" /> Vista Previa
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => toast.info("Estás en una versión demo. Por favor, regístrate para poder descargar este documento.")}>
                        <Download className="w-3.5 h-3.5 mr-1" /> Descargar
                      </Button>
                    </>
                  ) : doc.file_url ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1 text-xs active:scale-[0.97] transition-transform" asChild>
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                          <Eye className="w-3.5 h-3.5 mr-1" /> Vista Previa
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs active:scale-[0.97] transition-transform" asChild>
                        <a href={doc.file_url} download={doc.file_name}>
                          <Download className="w-3.5 h-3.5 mr-1" /> Descargar
                        </a>
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" className="flex-1 text-xs" disabled>
                      Sin archivo adjunto
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentListPage;
