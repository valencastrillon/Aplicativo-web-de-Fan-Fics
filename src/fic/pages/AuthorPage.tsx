import { useParams } from "react-router-dom";
import { XLogo } from "../XLogo";
import { Instagram, Globe, MapPin } from "lucide-react";
import { stories, fmt } from "../data";
import { StoryCard } from "../ui";
import { getAuthor } from "../authors";

export default function AuthorPage() {
  const a = getAuthor(useParams().handle);
  const works = stories.filter((s) => s.author === a.handle);
  const reads = works.reduce((n, s) => n + s.reads, 0);
  const links = [
    a.socials.instagram && { icon: Instagram, label: `@${a.socials.instagram}`, href: `https://instagram.com/${a.socials.instagram}` },
    a.socials.x && { icon: XLogo, label: `@${a.socials.x}`, href: `https://x.com/${a.socials.x}` },
    a.socials.web && { icon: Globe, label: a.socials.web, href: `https://${a.socials.web}` },
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; label: string; href: string }[];

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <section className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        {a.avatar ? <img src={a.avatar} alt={a.name} width={816} height={816} className="h-32 w-32 rounded-full object-cover border border-border" />
          : <span className="grid h-32 w-32 place-items-center rounded-full bg-secondary text-3xl font-semibold text-primary">{a.handle[0].toUpperCase()}</span>}
        <div className="flex-1">
          <h1 className="font-read text-4xl">{a.name}</h1>
          <p className="text-primary font-medium mt-1">@{a.handle}</p>
          {a.location && <p className="mt-2 text-sm text-muted-foreground inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{a.location}</p>}
          <p className="mt-4 max-w-xl text-foreground/90 leading-relaxed">{a.bio}</p>
          <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
            {links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 h-9 text-sm hover:border-primary hover:text-primary transition-colors"><l.icon className="h-4 w-4" />{l.label}</a>)}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{works.length} {works.length === 1 ? "obra" : "obras"} · {fmt(reads)} lecturas</p>
        </div>
      </section>
      <h2 className="mt-12 text-xl font-bold">Obras de @{a.handle}</h2>
      {works.length ? <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{works.map((s) => <StoryCard key={s.id} s={s} wide />)}</div>
        : <p className="mt-3 text-sm text-muted-foreground">Este autor aún no ha publicado obras.</p>}
    </main>
  );
}
