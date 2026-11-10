import { Link, useParams } from "react-router-dom";
import { Bookmark, Bell, BellRing, Heart, Play, AlertTriangle, MessageCircle, BookOpen, Check } from "lucide-react";
import { getStory, fmt, commentsFor } from "../data";
import { Tag } from "../ui";
import { useList, toggleIn, chapterKey } from "../library";
import { cn } from "@/lib/utils";
import { toast } from "sonner";


export default function StoryDetail() {
  const s = getStory(useParams().id);
  const saved = useList("saved").includes(s.id);
  const followed = useList("followed").includes(s.id);
  const liked = useList("liked").includes(s.id);
  const readList = useList("read");
  const list = commentsFor(s.id);
  const Row = ({ k, children }: { k: string; children: React.ReactNode }) => (
    <div className="grid grid-cols-[110px_1fr] gap-3 py-3 border-b border-border last:border-0">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground pt-1">{k}</dt>
      <dd className="flex flex-wrap gap-1.5">{children}</dd>
    </div>
  );
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 animate-fade-in">
      <div className="grid md:grid-cols-[280px_1fr] gap-8">
        <div>
          <img src={s.cover} alt={s.title} width={768} height={1024} className="w-full max-w-[280px] mx-auto aspect-[3/4] object-cover rounded-xl shadow-glow" />
          <div className="mt-5 grid grid-cols-3 gap-2 max-w-[280px] mx-auto">
            <button onClick={() => toggleIn("liked", s.id)} className={cn("flex flex-col items-center gap-1 rounded-xl py-3 text-xs bg-secondary transition-all active:scale-90", liked && "text-destructive")}><Heart className={cn("h-5 w-5", liked && "fill-current")} />{fmt(s.likes + (liked ? 1 : 0))}</button>
            <button onClick={() => { toggleIn("saved", s.id); toast(saved ? "Quitada de tu biblioteca" : "Guardada en tu biblioteca"); }} className={cn("flex flex-col items-center gap-1 rounded-xl py-3 text-xs bg-secondary transition-all active:scale-90", saved && "text-accent")}>{saved ? <Check className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}{saved ? "Guardada" : "Guardar"}</button>
            <button onClick={() => { toggleIn("followed", s.id); toast(followed ? "Dejaste de seguir esta obra" : "Te avisaremos cuando haya un nuevo capítulo"); }} aria-pressed={followed} className={cn("flex flex-col items-center gap-1 rounded-xl py-3 text-xs bg-secondary active:scale-90 transition-all", followed && "text-primary")}>{followed ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}{followed ? "Siguiendo" : "Seguir"}</button>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap gap-2"><Tag tone="fandom" className="gap-1"><span className="opacity-70">Fandom:</span>{s.fandom}</Tag><Tag>{s.status === "Completa" ? "Finalizada" : s.status}</Tag></div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold">{s.title}</h1>
          <p className="mt-1 text-muted-foreground">por <Link to={`/autor/${s.author}`} className="text-primary font-medium hover:underline">@{s.author}</Link></p>
          <p className="mt-4 font-read text-lg leading-relaxed text-foreground/90">{s.summary}</p>
          <Link to={`/leer/${s.id}/1`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 h-12 font-semibold text-primary-foreground shadow-glow hover:scale-105 active:scale-95 transition-transform"><Play className="h-4 w-4 fill-current" />Leer capítulo 1</Link>

          <div className="mt-8 rounded-xl border border-destructive/40 bg-destructive/10 p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div><p className="text-sm font-semibold">Advertencias de contenido</p><div className="mt-2 flex flex-wrap gap-1.5">{s.warnings.map((w) => <Tag key={w} tone="warn">{w}</Tag>)}</div></div>
          </div>

          <dl className="mt-6 rounded-xl bg-card border border-border px-5">
            <Row k="Categorías"><Tag tone="rel">{s.genre}</Tag></Row>
            <Row k="Etiquetas">{s.tags.map((t) => <Tag key={t}>{t}</Tag>)}</Row>
            <Row k="Estadísticas"><span className="text-sm">{s.words.toLocaleString("es")} palabras · {s.chapters.length} capítulos · {fmt(s.reads)} lecturas</span></Row>
            <Row k="Idioma"><span className="text-sm">Español</span></Row>
          </dl>

          <h2 className="mt-10 mb-3 text-xl font-bold flex items-center gap-2">Capítulos</h2>
          <ol className="rounded-xl bg-card border border-border divide-y divide-border overflow-hidden">
            {s.chapters.map((c) => (
              <li key={c.n} className="flex items-center hover:bg-secondary transition-colors"><Link to={`/leer/${s.id}/${c.n}`} className="flex flex-1 min-w-0 items-center gap-4 pl-5 py-4">
                <span className="text-sm font-bold text-primary tabular-nums w-6">{c.n}</span>
                <span className="flex-1 font-medium">{c.title}</span>
                <span className="text-xs text-muted-foreground">{c.date}</span>
              </Link>
              {(() => { const done = readList.includes(chapterKey(s.id, c.n)); return (
                <button onClick={() => toggleIn("read", chapterKey(s.id, c.n))} aria-label={done ? "Marcar como no leído" : "Marcar como leído"} aria-pressed={done}
                  className={cn("mx-4 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors", done ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary")}>
                  <Check className="h-4 w-4" />
                </button>); })()}
              </li>
            ))}
          </ol>

          <h2 className="mt-10 mb-3 text-xl font-bold flex items-center gap-2">Comentarios ({list.length})</h2>
          <p className="text-sm text-muted-foreground">Para comentar, abre un capítulo y escribe al final de la lectura.</p>
          <div className="mt-4 space-y-3">
            {list.map((c, i) => (
              <div key={i} className="rounded-xl bg-card border border-border p-4">
                <div className="flex items-center gap-2 text-sm"><span className="grid h-7 w-7 place-items-center rounded-full bg-primary/20 text-primary text-xs font-bold">{c.user[0].toUpperCase()}</span><span className="font-semibold">@{c.user}</span><Link to={`/leer/${s.id}/${c.ch}`}><Tag>Cap. {c.ch}</Tag></Link></div>
                <p className="mt-2 text-sm text-foreground/90">{c.text}</p>
                <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1"><Heart className="h-3 w-3" />{c.likes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
