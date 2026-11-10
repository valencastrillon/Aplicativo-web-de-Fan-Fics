import { Link } from "react-router-dom";
import { Play, Plus, TrendingUp, Heart, History, X } from "lucide-react";
import { stories, CATEGORIES, FANDOMS } from "../data";
import { StoryCard, Tag, Stats } from "../ui";
import { useState } from "react";
import { cn } from "@/lib/utils";

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

const Chips = ({ items, selected, onToggle, tone = "primary" }: { items: string[]; selected: string[]; onToggle: (v: string) => void; tone?: "primary" | "accent" }) => (
  <div className="mt-2 flex flex-wrap gap-1.5">
    {items.map((x) => (
      <button key={x} onClick={() => onToggle(x)} aria-pressed={selected.includes(x)} className={cn("rounded-full px-3 h-8 text-xs font-medium transition-colors", selected.includes(x) ? (tone === "accent" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground") : "bg-secondary text-muted-foreground hover:text-foreground")}>{x}</button>
    ))}
  </div>
);

const Row = ({ title, icon: Icon, items }: { title: string; icon: any; items: typeof stories }) => (
  <section className="mt-10">
    <div className="flex items-center justify-between px-4 sm:px-6 mb-4">
      <h2 className="flex items-center gap-3 text-lg sm:text-xl font-bold">{title}</h2>
      <button className="text-sm text-muted-foreground hover:text-primary">Ver todo</button>
    </div>
    <div className="flex gap-4 overflow-x-auto scrollbar-none px-4 sm:px-6 snap-x">
      {items.map((s) => <div key={s.id} className="snap-start"><StoryCard s={s} /></div>)}
    </div>
  </section>
);

export default function Discover() {
  const hero = stories[3];
  const [cats, setCats] = useState<string[]>([]);
  const [fans, setFans] = useState<string[]>([]);
  const active = cats.length + fans.length > 0;
  const filtered = stories.filter((s) => (!cats.length || cats.includes(s.genre)) && (!fans.length || fans.includes(s.fandomType)));
  return (
    <main className="mx-auto max-w-7xl pb-16">
      <section className="px-4 sm:px-6 pt-6">
        <div className="relative overflow-hidden rounded-xl min-h-[420px] sm:min-h-[480px] flex items-end">
          <img src={hero.cover} alt={hero.title} width={1536} height={864} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="relative p-6 sm:p-10 max-w-xl">
            <Tag tone="fandom">Destacada de la semana</Tag>
            <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold leading-tight">{hero.title}</h1>
            <p className="mt-3 text-sm sm:text-base text-foreground/80 line-clamp-3">{hero.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">{hero.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
            <div className="mt-5 flex gap-3">
              <Link to={`/leer/${hero.id}/1`} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 h-12 font-semibold text-primary-foreground shadow-glow hover:scale-105 active:scale-95 transition-transform"><Play className="h-4 w-4 fill-current" />Empezar a leer</Link>
              <Link to={`/historia/${hero.id}`} className="inline-flex items-center gap-2 rounded-full bg-secondary/80 backdrop-blur px-5 h-12 font-semibold hover:bg-secondary transition-colors"><Plus className="h-4 w-4" />Detalles</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-2 lg:grid lg:grid-cols-[1fr_300px] lg:gap-2">
        <aside className="lg:order-last px-4 sm:px-6 lg:pl-0 mt-8 lg:mt-10">
          <div className="lg:sticky lg:top-24 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Filtrar obras</h2>
              {active && <button onClick={() => { setCats([]); setFans([]); }} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><X className="h-3 w-3" />Limpiar</button>}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Categorías</p>
            <Chips items={CATEGORIES} selected={cats} onToggle={(v) => setCats(toggle(cats, v))} tone="accent" />
            <p className="mt-4 text-xs text-muted-foreground">Fandoms</p>
            <Chips items={FANDOMS} selected={fans} onToggle={(v) => setFans(toggle(fans, v))} />
          </div>
        </aside>
        <div className="min-w-0">
      {active && !filtered.length && <p className="mt-10 px-4 sm:px-6 text-sm text-muted-foreground">No hay obras con esos filtros todavía. Prueba con otra categoría o fandom.</p>}
      {filtered.length > 0 && <Row title="Tendencias" icon={TrendingUp} items={[...filtered].sort((a, b) => b.reads - a.reads)} />}

      {filtered.length > 0 && <section className="mt-10 px-4 sm:px-6">
        <h2 className="flex items-center gap-3 text-lg sm:text-xl font-bold mb-4">Para ti</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.slice(0, 2).map((s) => (
            <Link key={s.id} to={`/historia/${s.id}`} className="group flex gap-4 rounded-xl bg-card border border-border p-3 hover:border-primary/50 transition-colors">
              <img src={s.cover} alt={s.title} loading="lazy" width={768} height={1024} className="w-28 sm:w-32 aspect-[3/4] rounded-xl object-cover" />
              <div className="min-w-0 py-1 flex flex-col">
                <Tag tone="fandom" className="self-start">{s.fandom}</Tag>
                <h3 className="mt-2 font-bold group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.summary}</p>
                <div className="mt-auto pt-2 flex flex-wrap gap-1">{s.warnings.slice(0, 1).map((w) => <Tag key={w} tone="warn">{w}</Tag>)}<Tag tone="rel">{s.genre}</Tag></div>
                <Stats s={s} className="mt-2" />
              </div>
            </Link>
          ))}
        </div>
      </section>}

      {filtered.length > 0 && <Row title="Actualizadas recientemente" icon={History} items={[...filtered].reverse()} />}
        </div>
      </div>
    </main>
  );
}
