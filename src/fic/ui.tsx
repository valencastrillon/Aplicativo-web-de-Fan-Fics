import { Link } from "react-router-dom";
import { Eye, Heart } from "lucide-react";
import { Story, fmt } from "./data";
import { cn } from "@/lib/utils";

export const Tag = ({ children, tone = "default", className }: { children: React.ReactNode; tone?: "default" | "rel" | "warn" | "fandom"; className?: string }) => (
  <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap border",
    tone === "default" && "bg-secondary text-secondary-foreground border-transparent",
    tone === "fandom" && "bg-card/95 text-primary border-border shadow-sm",
    tone === "rel" && "bg-accent/15 text-accent border-accent/30",
    tone === "warn" && "bg-destructive/15 text-destructive border-destructive/30", className)}>{children}</span>
);

export const Stats = ({ s, className }: { s: Story; className?: string }) => (
  <div className={cn("flex items-center gap-3 text-xs text-muted-foreground", className)}>
    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{fmt(s.reads)}</span>
    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{fmt(s.likes)}</span>
  </div>
);

export const StoryCard = ({ s, wide }: { s: Story; wide?: boolean }) => (
  <Link to={`/historia/${s.id}`} className={cn("group shrink-0 block", wide ? "w-full" : "w-40 sm:w-48")}>
    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
      <img src={s.cover} alt={s.title} loading="lazy" width={768} height={1024}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
      <Tag tone="fandom" className="absolute top-2 left-2 backdrop-blur-md">{s.fandom}</Tag>
      {s.warnings[0] !== "Sin advertencias aplicables" && <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" title="Contiene advertencias" />}
      <div className="absolute bottom-0 p-3"><Stats s={s} className="text-foreground/80" /></div>
    </div>
    <h3 className="mt-2 text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">{s.title}</h3>
    <p className="text-xs text-muted-foreground">@{s.author}</p>
    <div className="mt-1.5 flex gap-1 overflow-hidden"><Tag tone="rel">{s.genre}</Tag></div>
  </Link>
);
