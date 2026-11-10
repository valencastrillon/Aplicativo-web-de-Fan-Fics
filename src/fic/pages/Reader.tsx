import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Type, Music, Pause, Play, MessageSquare, X, ChevronLeft, ChevronRight, Minus, Plus, Sun, Moon } from "lucide-react";
import { getStory, sampleParagraphs, commentsFor, chapterComments } from "../data";
import { markRead } from "../library";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";


export default function Reader() {
  const { id, ch } = useParams();
  const s = getStory(id);
  const n = Number(ch) || 1;
  const chapter = s.chapters[n - 1] ?? s.chapters[0];
  const { isDark, toggle } = useTheme();
  const [size, setSize] = useState(19);
  const [panel, setPanel] = useState(false);
  const { user } = useAuth();
  const [draft, setDraft] = useState("");
  const [, bump] = useState(0);
  const chComments = commentsFor(s.id, n);
  const publish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Inicia sesión para comentar");
    if (!draft.trim()) return;
    chapterComments.unshift({ story: s.id, user: user.username, ch: n, text: draft.trim(), likes: 0 });
    setDraft(""); bump((x) => x + 1);
  };
  const [progress, setProgress] = useState(0);
  const [chrome, setChrome] = useState(true);

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      setProgress(h > 0 ? (scrollY / h) * 100 : 0);
      setChrome(scrollY < last || scrollY < 80); last = scrollY;
    };
    addEventListener("scroll", on); return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [n]);

  const paras = [...sampleParagraphs, ...sampleParagraphs.slice(0, 4)];

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 inset-x-0 z-40 h-1 bg-transparent"><div className="h-full bg-gradient-to-r from-primary to-accent transition-[width]" style={{ width: `${progress}%` }} /></div>
      <header className={cn("fixed top-1 inset-x-0 z-30 transition-transform duration-300", chrome ? "translate-y-0" : "-translate-y-24")}>
        <div className="mx-auto max-w-3xl m-2 flex items-center gap-2 rounded-full bg-card/85 backdrop-blur-xl border border-border px-2 h-14">
          <Link to={`/historia/${s.id}`} className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary" aria-label="Volver"><ArrowLeft className="h-5 w-5" /></Link>
          <div className="min-w-0 flex-1"><p className="text-xs text-muted-foreground truncate">{s.title}</p><p className="text-sm font-semibold truncate">Cap. {chapter.n} · {chapter.title}</p></div>
          <button onClick={() => setPanel(!panel)} className={cn("grid h-10 w-10 place-items-center rounded-full hover:bg-secondary", panel && "bg-secondary text-primary")} aria-label="Tipografía"><Type className="h-5 w-5" /></button>
          <button onClick={toggle} className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary" aria-label="Tema">{isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
        </div>
        {panel && (
          <div className="mx-auto max-w-3xl px-2 animate-fade-in">
            <div className="ml-auto w-64 rounded-xl bg-card border border-border p-4 shadow-glow">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Tamaño de texto</p>
              <div className="mt-3 flex items-center gap-3">
                <button onClick={() => setSize(Math.max(14, size - 1))} className="grid h-9 w-9 place-items-center rounded-full bg-secondary"><Minus className="h-4 w-4" /></button>
                <input type="range" min={14} max={28} value={size} onChange={(e) => setSize(+e.target.value)} className="flex-1 accent-primary" />
                <button onClick={() => setSize(Math.min(28, size + 1))} className="grid h-9 w-9 place-items-center rounded-full bg-secondary"><Plus className="h-4 w-4" /></button>
              </div>
              <p className="mt-2 text-center text-sm text-muted-foreground tabular-nums">{size}px</p>
            </div>
          </div>
        )}
      </header>

      <article className="mx-auto max-w-2xl px-5 sm:px-8 pt-28 pb-48">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-accent">Capítulo {chapter.n}</p>
        <h1 className="mt-3 text-center text-3xl sm:text-4xl font-extrabold">{chapter.title}</h1>
        <div className="mx-auto mt-6 mb-12 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="font-read" style={{ fontSize: size, lineHeight: 1.85 }}>
          {paras.map((p, i) => <p key={i} className="mb-7">{p}</p>)}
        </div>
        <section className="mt-16 font-sans">
          <h2 className="text-lg font-semibold flex items-center gap-2">Comentarios del capítulo ({chComments.length})</h2>
          <form onSubmit={publish} className="mt-4 flex gap-2">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={user ? "Comparte tu opinión, sin spoilers…" : "Inicia sesión para comentar"} className="flex-1 rounded-xl bg-secondary px-4 h-11 text-sm outline-none focus:ring-2 ring-primary" />
            <button className="rounded-xl bg-primary text-primary-foreground px-5 text-sm font-semibold active:scale-95 transition-transform">Publicar</button>
          </form>
          <div className="mt-4 space-y-3">
            {chComments.map((c, i) => (
              <div key={i} className="rounded-xl bg-card border border-border p-4 text-sm"><span className="font-semibold text-primary">@{c.user}</span><p className="mt-1">{c.text}</p></div>
            ))}
            {chComments.length === 0 && <p className="text-sm text-muted-foreground">Aún no hay comentarios en este capítulo.</p>}
          </div>
        </section>
        <div className="mt-12 flex justify-between gap-3 font-sans">
          <Link to={`/leer/${s.id}/${Math.max(1, n - 1)}`} className={cn("flex items-center gap-2 rounded-full bg-secondary px-5 h-12 text-sm font-semibold", n <= 1 && "pointer-events-none opacity-40")}><ChevronLeft className="h-4 w-4" />Anterior</Link>
          <Link to={`/leer/${s.id}/${Math.min(s.chapters.length, n + 1)}`} onClick={() => markRead(s.id, n)} className={cn("flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 h-12 text-sm font-semibold shadow-glow", n >= s.chapters.length && "pointer-events-none opacity-40")}>Siguiente<ChevronRight className="h-4 w-4" /></Link>
        </div>
      </article>



    </div>
  );
}
