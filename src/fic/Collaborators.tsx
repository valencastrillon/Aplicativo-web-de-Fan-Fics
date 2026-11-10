import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Invite = { id: string; story_id: string; story_title: string; owner_name: string; invitee_email: string; status: string };
const label: Record<string, string> = { pending: "Pendiente", accepted: "Colaborador", declined: "Rechazada" };

export default function Collaborators({ storyId, storyTitle }: { storyId: string; storyTitle: string }) {
  const { user } = useAuth();
  const demo = !user || user.id === "demo-001";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState<Invite[]>([]);
  const [received, setReceived] = useState<Invite[]>([]);

  const load = async () => {
    if (demo) return;
    const { data } = await supabase.from("story_collaborators").select("*").order("created_at", { ascending: false });
    const rows = (data ?? []) as Invite[] & { owner_id?: string }[];
    setSent(rows.filter((r: any) => r.owner_id === user!.id && r.story_id === storyId));
    setReceived(rows.filter((r: any) => r.owner_id !== user!.id && r.status === "pending"));
  };
  useEffect(() => { load(); }, [storyId, user?.id]);

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    if (!v) return;
    if (demo) return toast("Estás en una versión demo. Regístrate para invitar colaboradores.");
    if (v === user!.email.toLowerCase()) return toast.error("No puedes invitarte a ti mismo");
    const { error } = await supabase.from("story_collaborators").insert({ story_id: storyId, story_title: storyTitle, owner_id: user!.id, owner_name: user!.username, invitee_email: v });
    if (error) return toast.error(error.code === "23505" ? "Ya invitaste a este usuario" : "No se pudo enviar la invitación");
    toast.success("Invitación enviada"); setEmail(""); load();
  };
  const remove = async (id: string) => { await supabase.from("story_collaborators").delete().eq("id", id); load(); };
  const respond = async (id: string, status: "accepted" | "declined") => {
    const { error } = await supabase.from("story_collaborators").update({ status }).eq("id", id);
    if (error) return toast.error("No se pudo responder");
    toast.success(status === "accepted" ? "Ahora puedes editar esta obra" : "Invitación rechazada"); load();
  };

  return (
    <>
      {received.length > 0 && (
        <section className="rounded-xl bg-card border border-primary/40 p-5">
          <h2 className="font-bold">Invitaciones recibidas</h2>
          <ul className="mt-3 space-y-2">
            {received.map((r) => (
              <li key={r.id} className="rounded-xl bg-secondary p-3">
                <p className="text-sm"><span className="font-medium">@{r.owner_name}</span> te invitó a editar <span className="font-medium">{r.story_title}</span></p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => respond(r.id, "accepted")} className="flex items-center gap-1 rounded-lg bg-primary text-primary-foreground px-3 h-8 text-xs font-semibold"><Check className="h-3.5 w-3.5" />Aceptar</button>
                  <button onClick={() => respond(r.id, "declined")} className="rounded-lg border border-border px-3 h-8 text-xs">Rechazar</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="rounded-xl bg-card border border-border p-5">
        <h2 className="font-bold">Colaboradores</h2>
        <p className="mt-1 text-xs text-muted-foreground">Invita por correo a otra persona registrada para que pueda editar esta obra.</p>
        <form onSubmit={invite} className="mt-3 flex gap-2">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" className="min-w-0 flex-1 rounded-xl bg-secondary px-3 h-10 text-sm outline-none focus:ring-2 ring-primary" />
          <button className="rounded-xl bg-primary text-primary-foreground px-4 text-sm font-semibold">Invitar</button>
        </form>
        <ul className="mt-3 space-y-2">
          {sent.map((c) => (
            <li key={c.id} className="flex items-center gap-2 rounded-xl bg-secondary p-3">
              <div className="min-w-0 flex-1"><p className="text-sm truncate">{c.invitee_email}</p><p className="text-xs text-primary">{label[c.status]}</p></div>
              <button onClick={() => remove(c.id)} aria-label="Quitar colaborador" className="grid h-8 w-8 place-items-center rounded-full hover:bg-background"><X className="h-4 w-4" /></button>
            </li>
          ))}
          {sent.length === 0 && <li className="text-xs text-muted-foreground">Aún no hay colaboradores en esta obra.</li>}
        </ul>
      </section>
    </>
  );
}
