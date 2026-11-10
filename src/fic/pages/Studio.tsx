import { useState } from "react";
import { BarChart3, CalendarClock, FileText, Plus, Send, Tag as TagIcon, X, Trash2, Pencil, Eye, Heart, Users } from "lucide-react";
import { stories, fmt, CATEGORIES, FANDOMS, sampleParagraphs } from "../data";
import { Tag } from "../ui";
import { followedNow } from "../library";
import Collaborators from "../Collaborators";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const baseSuggested = ["Slow burn", "Fluff", "Angst", "Hurt/Comfort", "AU", "Found family", "Enemies to lovers"];
// Etiquetas libres: sugerimos las creadas por otros autores + comunes.
const suggested = Array.from(new Set([...baseSuggested, ...stories.flatMap((x) => x.tags)]));
const warnOpts = ["Violencia gráfica", "Muerte de personaje", "Temas maduros", "Ansiedad"];

export default function Studio() {
  const [story, setStory] = useState(stories[0].id);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>(["Slow burn", "Magia oscura"]);
  const [warns, setWarns] = useState<string[]>(["Violencia gráfica"]);
  const [input, setInput] = useState("");
  const [, bump] = useState(0);
  const [fandoms, setFandoms] = useState<string[]>(["Libros & literatura"]);
  const [cats, setCats] = useState<string[]>(["Fantasía"]);
  const [mode, setMode] = useState<"now" | "later">("now");
  const [date, setDate] = useState("");
  type Q = { story: string; t: string; body: string; date: string };
  const [queue, setQueue] = useState<Q[]>([{ story: stories[0].id, t: "Cap. 6 · El eco de las runas", body: "El eco de las runas resonó en la torre…", date: "2026-11-15T18:00" }]);
  const [bodies, setBodies] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<{ kind: "pub"; n: number } | { kind: "sched"; i: number } | null>(null);
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  const addTag = (t: string) => { const v = t.trim(); if (v && !tags.includes(v)) setTags([...tags, v]); setInput(""); };
  const fmtDate = (d: string) => new Date(d).toLocaleString("es", { dateStyle: "medium", timeStyle: "short" });
  const reset = () => { setTitle(""); setBody(""); setDate(""); setMode("now"); setEditing(null); };
  const today = () => new Date().toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" });

  const openPublished = (n: number) => {
    const c = s.chapters.find((x) => x.n === n)!;
    setEditing({ kind: "pub", n }); setTitle(c.title); setMode("now");
    setBody(bodies[`${story}:${n}`] ?? sampleParagraphs.join("\n\n"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openScheduled = (i: number) => {
    const q = queue[i];
    setEditing({ kind: "sched", i }); setTitle(q.t); setBody(q.body); setDate(q.date); setMode("later");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const removeChapter = (n: number) => {
    if (!confirm("¿Eliminar este capítulo? No se puede deshacer.")) return;
    s.chapters = s.chapters.filter((c) => c.n !== n);
    if (editing?.kind === "pub" && editing.n === n) reset();
    bump((v) => v + 1);
    toast.success("Capítulo eliminado");
  };
  const removeScheduled = (i: number) => {
    if (!confirm("¿Eliminar este capítulo programado?")) return;
    setQueue(queue.filter((_, j) => j !== i));
    if (editing?.kind === "sched") reset();
    toast.success("Programado eliminado");
  };

  const submit = () => {
    if (!title.trim() || !body.trim()) return toast.error("Agrega título y contenido");
    if (mode === "later" && !date) return toast.error("Elige fecha y hora");
    // Quitar la versión anterior si se está editando
    let q = queue;
    if (editing?.kind === "sched") q = queue.filter((_, j) => j !== editing.i);
    if (editing?.kind === "pub" && mode === "later") s.chapters = s.chapters.filter((c) => c.n !== editing.n);
    if (mode === "later") {
      setQueue([...q, { story, t: title, body, date }]);
      toast.success(editing ? "Programado actualizado" : "Capítulo programado");
    } else {
      setQueue(q);
      if (editing?.kind === "pub") {
        s.chapters = s.chapters.map((c) => (c.n === editing.n ? { ...c, title } : c));
        setBodies({ ...bodies, [`${story}:${editing.n}`]: body });
        toast.success("Capítulo actualizado");
      } else {
        const n = (s.chapters.at(-1)?.n ?? 0) + 1;
        s.chapters = [...s.chapters, { n, title, date: today() }];
        setBodies({ ...bodies, [`${story}:${n}`]: body });
        toast.success("Capítulo publicado");
        if (followedNow().includes(story)) toast(`Nuevo capítulo de "${s.title}"`, { description: `${title} ya está disponible.` });
      }
    }
    reset();
  };

  const s = stories.find((x) => x.id === story)!;
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs uppercase tracking-[0.3em] text-accent">Estudio de autor</p><h1 className="mt-1 text-3xl font-extrabold">Hola, @lunarquill</h1></div>
        <select value={story} onChange={(e) => { setStory(e.target.value); reset(); }} className="rounded-full bg-secondary px-4 h-11 text-sm outline-none">
          {stories.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
        </select>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{ l: "Lecturas", v: fmt(s.reads), i: Eye }, { l: "Likes", v: fmt(s.likes), i: Heart }, { l: "Suscriptores", v: "8.2k", i: Users }, { l: "Capítulos", v: s.chapters.length, i: BarChart3 }].map((k) => (
          <div key={k.l} className="rounded-xl bg-card border border-border p-5"><k.i className="h-5 w-5 text-primary" /><p className="mt-3 text-2xl font-extrabold tabular-nums">{k.v}</p><p className="text-xs text-muted-foreground">{k.l}</p></div>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="self-start space-y-6">
        <section className="rounded-xl bg-card border border-border p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold">{editing ? (editing.kind === "pub" ? "Editar capítulo publicado" : "Editar capítulo programado") : "Nuevo capítulo"}</h2>
            {editing && <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground">Cancelar edición</button>}
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del capítulo" className="mt-4 w-full bg-transparent text-2xl font-bold outline-none placeholder:text-muted-foreground/60" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Había una vez…" rows={14} className="mt-4 w-full resize-y rounded-xl bg-secondary/60 p-5 font-read text-lg leading-relaxed outline-none focus:ring-2 ring-primary" />
          <p className="mt-2 text-xs text-muted-foreground tabular-nums">{words} palabras · ~{Math.max(1, Math.round(words / 230))} min de lectura</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex rounded-full bg-secondary p-1">
              {(["now", "later"] as const).map((m) => <button key={m} onClick={() => setMode(m)} className={cn("rounded-full px-4 h-9 text-sm font-medium transition-colors", mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>{m === "now" ? "Publicar ahora" : "Programar"}</button>)}
            </div>
            {mode === "later" && <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-full bg-secondary px-4 h-11 text-sm outline-none" />}
            <button onClick={submit} className="ml-auto inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-6 h-11 font-semibold active:scale-95 transition-transform">
              {mode === "now" ? <Send className="h-4 w-4" /> : <CalendarClock className="h-4 w-4" />}{editing ? "Guardar cambios" : mode === "now" ? "Publicar" : "Programar"}
            </button>
          </div>
        </section>
        <section className="rounded-xl bg-card border border-border p-5 sm:p-6">
            <h2 className="font-bold">Capítulos de la obra</h2>
            {s.chapters.length ? (
              <ul className="mt-3 space-y-2">{s.chapters.map((c) => (
                <li key={c.n} className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                  <button onClick={() => openPublished(c.n)} className="min-w-0 flex-1 text-left"><p className="truncate text-sm font-medium">Cap. {c.n} · {c.title}</p><p className="text-xs text-muted-foreground">{c.date}</p></button>
                  <button onClick={() => openPublished(c.n)} aria-label={`Editar capítulo ${c.n}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => removeChapter(c.n)} aria-label={`Eliminar capítulo ${c.n}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                </li>))}</ul>
            ) : <p className="mt-3 text-sm text-muted-foreground">Esta obra aún no tiene capítulos.</p>}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl bg-card border border-border p-5">
            <h2 className="font-bold">Información adicional</h2>
            <p className="mt-4 text-xs text-muted-foreground">Etiquetas</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">{tags.map((t) => <button key={t} onClick={() => setTags(tags.filter((x) => x !== t))}><Tag className="gap-1">{t}<X className="h-3 w-3" /></Tag></button>)}</div>
            <form onSubmit={(e) => { e.preventDefault(); addTag(input); }} className="mt-3 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Añadir etiqueta" className="flex-1 rounded-full bg-secondary px-4 h-10 text-sm outline-none" />
              <button className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"><Plus className="h-4 w-4" /></button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">Sugeridas (usadas por otros autores)</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">{suggested.filter((t) => !tags.includes(t)).slice(0, 4).map((t) => <button key={t} onClick={() => addTag(t)} className="rounded-full border border-dashed border-border px-2.5 py-0.5 text-[11px] text-muted-foreground hover:border-primary hover:text-primary">+ {t}</button>)}</div>
            <p className="mt-4 text-xs text-muted-foreground">Fandoms</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">{FANDOMS.map((f) => <button key={f} onClick={() => setFandoms(fandoms.includes(f) ? fandoms.filter((x) => x !== f) : [...fandoms, f])}><Tag tone={fandoms.includes(f) ? "fandom" : "default"}>{f}</Tag></button>)}</div>
            <p className="mt-4 text-xs text-muted-foreground">Categorías</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">{CATEGORIES.map((c) => <button key={c} onClick={() => setCats(cats.includes(c) ? cats.filter((x) => x !== c) : [...cats, c])}><Tag tone={cats.includes(c) ? "rel" : "default"}>{c}</Tag></button>)}</div>
            <p className="mt-4 text-xs text-muted-foreground">Advertencias</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">{warnOpts.map((w) => <button key={w} onClick={() => setWarns(warns.includes(w) ? warns.filter((x) => x !== w) : [...warns, w])}><Tag tone={warns.includes(w) ? "warn" : "default"}>{w}</Tag></button>)}</div>
          </section>
          <Collaborators storyId={s.id} storyTitle={s.title} />
          <section className="rounded-xl bg-card border border-border p-5">
            <h2 className="flex items-center gap-2 font-bold">Programados</h2>
            {queue.some((q) => q.story === story) ? (
              <ul className="mt-3 space-y-2">{queue.map((q, i) => q.story !== story ? null : (
                <li key={i} className="flex items-center gap-2 rounded-xl bg-secondary p-3">
                  <button onClick={() => openScheduled(i)} className="min-w-0 flex-1 text-left"><p className="truncate text-sm font-medium">{q.t}</p><p className="text-xs text-accent">{fmtDate(q.date)}</p></button>
                  <button onClick={() => openScheduled(i)} aria-label="Editar programado" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => removeScheduled(i)} aria-label="Eliminar programado" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                </li>))}</ul>
            ) : <p className="mt-3 text-sm text-muted-foreground">No hay capítulos programados.</p>}
          </section>
        </aside>
      </div>
    </main>
  );
}
