import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface AddDocumentFormProps {
  type: "Manual" | "Acta" | "Procedimiento";
  onSubmit: (data: { title: string; desc: string; file?: File }) => void;
  onCancel: () => void;
  loading?: boolean;
}

const AddDocumentForm: React.FC<AddDocumentFormProps> = ({ type, onSubmit, onCancel, loading }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), desc: desc.trim() || "Sin descripción", file: file || undefined });
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm animate-fade-in-up">
      <div className="bg-primary px-5 py-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary-foreground flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Subir nuevo {type}
        </h3>
        <button onClick={onCancel} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="doc-title">Título <span className="text-destructive">*</span></Label>
            <Input id="doc-title" placeholder={`Ej: ${type} de Usuario Sistema X`} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doc-desc">Descripción</Label>
            <Input id="doc-desc" placeholder={`Breve descripción del ${type.toLowerCase()}`} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="doc-file">Archivo PDF <span className="text-destructive">*</span></Label>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="shrink-0 active:scale-[0.97] transition-transform">
              Seleccionar archivo
            </Button>
            <span className="text-sm text-muted-foreground truncate">{file?.name || "Ningún archivo seleccionado"}</span>
            <input ref={fileRef} id="doc-file" type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="outline" size="sm" onClick={onCancel} className="active:scale-[0.97] transition-transform">Cancelar</Button>
          <Button type="submit" size="sm" disabled={loading} className="active:scale-[0.97] transition-transform">
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            {loading ? "Subiendo..." : "Subir"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddDocumentForm;
