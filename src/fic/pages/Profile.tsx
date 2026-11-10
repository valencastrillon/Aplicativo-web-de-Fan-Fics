import { useEffect, useRef, useState } from "react";
import { XLogo } from "../XLogo";
import { Navigate, Link } from "react-router-dom";
import { Camera, Instagram, Globe, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type P = { display_name: string; bio: string; location: string; avatar_url: string | null; instagram: string; x_handle: string; website: string };
const empty: P = { display_name: "", bio: "", location: "", avatar_url: null, instagram: "", x_handle: "", website: "" };
const DEMO_KEY = "nocturna-demo-profile";

// Reduce la foto a 256px y la guarda como imagen ligera.
const toSmallImage = (file: File) => new Promise<string>((res, rej) => {
  const img = new Image();
  img.onload = () => {
    const s = 256, c = document.createElement("canvas"); c.width = c.height = s;
    const m = Math.min(img.width, img.height);
    c.getContext("2d")!.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, s, s);
    res(c.toDataURL("image/jpeg", 0.85));
  };
  img.onerror = rej; img.src = URL.createObjectURL(file);
});

export default function Profile() {
  const { user, loading } = useAuth();
  const demo = user?.id === "demo-001";
  const [p, setP] = useState<P>(empty);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    if (demo) { setP({ ...empty, display_name: user.username, ...JSON.parse(localStorage.getItem(DEMO_KEY) || "{}") }); return; }
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => setP({ ...empty, display_name: user.username, ...(data ?? {}) }));
  }, [user?.id]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const pick = async (f?: File) => { if (!f) return; if (!f.type.startsWith("image/")) return toast.error("Elige una imagen"); setP({ ...p, avatar_url: await toSmallImage(f) }); };
  const clean = (v: string) => v.trim().replace(/^@/, "");
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...p, display_name: p.display_name.trim(), instagram: clean(p.instagram), x_handle: clean(p.x_handle), website: p.website.trim().replace(/^https?:\/\//, "") };
    setBusy(true);
    if (demo) localStorage.setItem(DEMO_KEY, JSON.stringify(data));
    else {
      const { error } = await supabase.from("profiles").upsert({ id: user.id, ...data });
      if (error) { setBusy(false); return toast.error("No se pudo guardar tu perfil"); }
    }
    setBusy(false); setP(data); toast.success("Perfil actualizado");
  };
  const f = (k: keyof P) => ({ value: (p[k] as string) ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setP({ ...p, [k]: e.target.value }) });

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 grid lg:grid-cols-[1fr_360px] gap-8">
      <form onSubmit={save} className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-5">
        <div>
          <h1 className="font-read text-4xl">Mi perfil</h1>
          <p className="text-muted-foreground mt-1">Así te verán los lectores cuando entren a tu perfil de autor.</p>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => fileRef.current?.click()} className="group relative h-24 w-24 shrink-0 rounded-full overflow-hidden border border-border bg-secondary" aria-label="Cambiar foto de perfil">
            {p.avatar_url ? <img src={p.avatar_url} alt="Foto de perfil" className="h-full w-full object-cover" /> : <span className="grid h-full w-full place-items-center text-2xl font-semibold text-primary">{(p.display_name || user.username)[0]?.toUpperCase()}</span>}
            <span className="absolute inset-0 grid place-items-center bg-foreground/40 text-background opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="h-5 w-5" /></span>
          </button>
          <div className="text-sm"><Button type="button" variant="outline" className="rounded-xl" onClick={() => fileRef.current?.click()}>Cambiar foto</Button><p className="mt-1 text-xs text-muted-foreground">JPG o PNG</p></div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        </div>
        <div className="space-y-1.5"><Label htmlFor="n">Nombre visible</Label><Input id="n" maxLength={60} {...f("display_name")} className="h-11 rounded-xl" /></div>
        <div className="space-y-1.5"><Label htmlFor="b">Bio</Label><Textarea id="b" maxLength={300} rows={4} placeholder="Cuéntales a tus lectores qué escribes…" {...f("bio")} className="rounded-xl" /><p className="text-xs text-muted-foreground text-right">{p.bio.length}/300</p></div>
        <div className="space-y-1.5"><Label htmlFor="l">Ciudad</Label><Input id="l" maxLength={60} {...f("location")} className="h-11 rounded-xl" /></div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1.5"><Label htmlFor="ig">Instagram</Label><Input id="ig" placeholder="@usuario" maxLength={40} {...f("instagram")} className="h-11 rounded-xl" /></div>
          <div className="space-y-1.5"><Label htmlFor="x">X</Label><Input id="x" placeholder="@usuario" maxLength={40} {...f("x_handle")} className="h-11 rounded-xl" /></div>
          <div className="space-y-1.5"><Label htmlFor="w">Sitio web</Label><Input id="w" placeholder="misitio.com" maxLength={100} {...f("website")} className="h-11 rounded-xl" /></div>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Button type="submit" disabled={busy} className="rounded-xl h-11 px-6">{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Guardar perfil</Button>
          <Link to="/cuenta?tab=config" className="text-sm text-muted-foreground hover:text-primary">Cambiar correo o contraseña</Link>
        </div>
      </form>

      <aside className="rounded-xl border border-border bg-card p-6 h-fit lg:sticky lg:top-24 text-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Vista previa</p>
        {p.avatar_url ? <img src={p.avatar_url} alt="" className="mx-auto h-24 w-24 rounded-full object-cover border border-border" /> : <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-secondary text-2xl font-semibold text-primary">{(p.display_name || user.username)[0]?.toUpperCase()}</span>}
        <p className="font-read text-2xl mt-3">{p.display_name || user.username}</p>
        <p className="text-primary text-sm">@{user.username}</p>
        {p.location && <p className="mt-1 text-xs text-muted-foreground inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</p>}
        <p className="mt-3 text-sm text-foreground/90">{p.bio || "Tu bio aparecerá aquí."}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
          {p.instagram && <span className="inline-flex items-center gap-1 rounded-lg border border-border px-2 h-7"><Instagram className="h-3.5 w-3.5" />@{clean(p.instagram)}</span>}
          {p.x_handle && <span className="inline-flex items-center gap-1 rounded-lg border border-border px-2 h-7"><XLogo className="h-3.5 w-3.5" />@{clean(p.x_handle)}</span>}
          {p.website && <span className="inline-flex items-center gap-1 rounded-lg border border-border px-2 h-7"><Globe className="h-3.5 w-3.5" />{p.website.replace(/^https?:\/\//, "")}</span>}
        </div>
      </aside>
    </main>
  );
}
