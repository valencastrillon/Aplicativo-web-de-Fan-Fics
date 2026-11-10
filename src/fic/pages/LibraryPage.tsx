import { stories } from "../data";
import { StoryCard } from "../ui";
import { useList } from "../library";

const Section = ({ title, ids, empty }: { title: string; ids: string[]; empty: string }) => {
  const list = stories.filter((s) => ids.includes(s.id));
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold">{title} <span className="text-muted-foreground font-normal">({list.length})</span></h2>
      {list.length ? (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">{list.map((s) => <StoryCard key={s.id} s={s} wide />)}</div>
      ) : <p className="mt-3 text-sm text-muted-foreground">{empty}</p>}
    </section>
  );
};

export default function LibraryPage() {
  const saved = useList("saved");
  const liked = useList("liked");
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-extrabold">Tu biblioteca</h1>
      <p className="text-muted-foreground mt-1">Tus obras guardadas y las que te gustan</p>
      <Section title="Guardados" ids={saved} empty="Aún no has guardado obras. Usa el botón Guardar en cualquier historia." />
      <Section title="Me gusta" ids={liked} empty="Aún no has marcado obras con me gusta. Toca el corazón en cualquier historia." />
    </main>
  );
}
