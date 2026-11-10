import { stories, type Story } from "./data";
import { getAuthor } from "./authors";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export type Field = "Título" | "Autor" | "Categoría" | "Etiqueta" | "Fandom";

export function searchStories(q: string): { story: Story; matches: Field[] }[] {
  const n = norm(q.trim());
  if (!n) return [];
  return stories
    .map((s) => {
      const a = getAuthor(s.author);
      const m: Field[] = [];
      if (norm(s.title).includes(n)) m.push("Título");
      if (norm(s.author).includes(n.replace(/^@/, "")) || norm(a.name).includes(n)) m.push("Autor");
      if (norm(s.genre).includes(n)) m.push("Categoría");
      if (s.tags.some((t) => norm(t).includes(n))) m.push("Etiqueta");
      if (norm(s.fandom).includes(n)) m.push("Fandom");
      return { story: s, matches: m };
    })
    .filter((r) => r.matches.length);
}
