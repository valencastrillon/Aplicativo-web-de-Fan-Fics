import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { StoryCard } from "../ui";
import { searchStories } from "../search";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const results = searchStories(q);
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-extrabold">Buscar</h1>
      <div className="mt-4 flex items-center gap-2 rounded-full bg-secondary px-4 h-12 max-w-xl">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input autoFocus value={q} onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })} placeholder="Título, autor, categoría, etiqueta o fandom" className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground" />
      </div>
      {q.trim() ? (
        <>
          <p className="mt-6 text-sm text-muted-foreground">{results.length} resultado{results.length === 1 ? "" : "s"} para "{q}"</p>
          {results.length ? (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {results.map(({ story, matches }) => (
                <div key={story.id}>
                  <StoryCard s={story} wide />
                  <p className="mt-1 text-[11px] text-muted-foreground">Coincide en: {matches.join(", ")}</p>
                </div>
              ))}
            </div>
          ) : <p className="mt-3 text-sm text-muted-foreground">No encontramos obras. Prueba con otro nombre, categoría o etiqueta.</p>}
        </>
      ) : <p className="mt-6 text-sm text-muted-foreground">Escribe el nombre de un autor, el título de una obra, una categoría, una etiqueta o un fandom.</p>}
    </main>
  );
}
