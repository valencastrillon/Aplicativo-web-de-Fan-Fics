import { useCallback, useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type Invite = {
  id: string;
  story_id: string;
  story_title: string;
  owner_id: string;
  owner_name: string;
  invitee_email: string;
  status: string;
};

const label: Record<string, string> = {
  pending: "Pendiente",
  accepted: "Colaborador",
  declined: "Rechazada",
};

const TOKEN_KEY = "nocturna_token";

const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function Collaborators({ storyId, storyTitle }: { storyId: string; storyTitle: string }) {
  const { user } = useAuth();
  const demo = !user || user.id === "demo-001";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState<Invite[]>([]);
  const [received, setReceived] = useState<Invite[]>([]);

  const load = useCallback(async () => {
    if (demo) return;
    try {
      const res = await fetch("/api/collaborators", {
        headers: authHeaders(),
      });
      if (!res.ok) return;
      const rows: Invite[] = await res.json();
      setSent(rows.filter((r) => r.owner_id === user!.id && r.story_id === storyId));
      setReceived(rows.filter((r) => r.owner_id !== user!.id && r.status === "pending"));
    } catch {
      // Silenciar error de red puntual en carga
    }
  }, [demo, user, storyId]);

  useEffect(() => {
    load();
  }, [load]);

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    if (!v) return;
    if (demo) return toast("Estás en una versión demo. Regístrate para invitar colaboradores.");
    if (v === user!.email.toLowerCase()) return toast.error("No puedes invitarte a ti mismo");

    const res = await fetch("/api/collaborators", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        story_id: storyId,
        story_title: storyTitle,
        invitee_email: v,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return toast.error(res.status === 409 ? "Ya invitaste a este usuario" : err.error || "No se pudo enviar la invitación");
    }

    toast.success("Invitación enviada");
    setEmail("");
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/collaborators/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    load();
  };

  const respond = async (id: string, status: "accepted" | "declined") => {
    const res = await fetch(`/api/collaborators/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) return toast.error("No se pudo responder");
    toast.success(status === "accepted" ? "Ahora puedes editar esta obra" : "Invitación rechazada");
    load();
  };

  return (
    <>
      {received.length > 0 && (
        <section className="rounded-xl bg-card border border-primary/40 p-5">
          <h2 className="font-bold">Invitaciones recibidas</h2>
          <ul className="mt-3 space-y-2">
            {received.map((r) => (
              <li key={r.id} className="rounded-xl bg-secondary p-3">
                <p className="text-sm">
                  <span className="font-medium">@{r.owner_name}</span> te invitó a editar{" "}
                  <span className="font-medium">{r.story_title}</span>
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => respond(r.id, "accepted")}
                    className="flex items-center gap-1 rounded-lg bg-primary text-primary-foreground px-3 h-8 text-xs font-semibold"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Aceptar
                  </button>
                  <button
                    onClick={() => respond(r.id, "declined")}
                    className="rounded-lg border border-border px-3 h-8 text-xs"
                  >
                    Rechazar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="rounded-xl bg-card border border-border p-5">
        <h2 className="font-bold">Colaboradores</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Invita por correo a otra persona registrada para que pueda editar esta obra.
        </p>
        <form onSubmit={invite} className="mt-3 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            className="min-w-0 flex-1 rounded-xl bg-secondary px-3 h-10 text-sm outline-none focus:ring-2 ring-primary"
          />
          <button className="rounded-xl bg-primary text-primary-foreground px-4 text-sm font-semibold">
            Invitar
          </button>
        </form>
        <ul className="mt-3 space-y-2">
          {sent.map((c) => (
            <li key={c.id} className="flex items-center gap-2 rounded-xl bg-secondary p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{c.invitee_email}</p>
                <p className="text-xs text-primary">{label[c.status]}</p>
              </div>
              <button
                onClick={() => remove(c.id)}
                aria-label="Quitar colaborador"
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-background"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
          {sent.length === 0 && (
            <li className="text-xs text-muted-foreground">Aún no hay colaboradores en esta obra.</li>
          )}
        </ul>
      </section>
    </>
  );
}