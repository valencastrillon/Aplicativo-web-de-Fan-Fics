import c1 from "@/assets/cover-1.jpg";
import c2 from "@/assets/cover-2.jpg";
import c3 from "@/assets/cover-3.jpg";
import c4 from "@/assets/cover-4.jpg";

export type Story = {
  id: string; title: string; author: string; cover: string; summary: string;
  fandom: string; relationships: string[]; warnings: string[]; tags: string[];
  rating: "General" | "Adolescentes" | "Maduro"; status: "En curso" | "Completa";
  reads: number; likes: number; words: number; chapters: { n: number; title: string; date: string }[];
  genre: string; fandomType: string;
};

const ch = (titles: string[]) => titles.map((t, i) => ({ n: i + 1, title: t, date: `${2 + i} oct 2026` }));

export const stories: Story[] = [
  { id: "runas", title: "Runas de Medianoche", author: "lunarquill", cover: c1, genre: "Fantasía",
    summary: "Dos magos rivales se ven obligados a compartir un hechizo prohibido. Cada runa que trazan juntos los acerca más a la verdad sobre la torre que los creó.",
    fandom: "Arcana Academy", fandomType: "Anime & manga", relationships: ["Cael/Ren", "Rivales a amantes"], warnings: ["Violencia gráfica", "Muerte de personaje"],
    tags: ["Slow burn", "Magia oscura", "Enemies to lovers", "Worldbuilding"], rating: "Adolescentes", status: "En curso",
    reads: 284000, likes: 31200, words: 98400, chapters: ch(["El hechizo partido", "Tinta y ceniza", "La torre sin puertas", "Juramento", "Lo que ocultan las estrellas"]) },
  { id: "neon", title: "Lluvia sobre Neo-Kairo", author: "orbitalsea", cover: c2, genre: "Ciencia ficción",
    summary: "Una piloto en cuarentena observa la ciudad que juró proteger. Una transmisión anónima cambia todo lo que creía sobre la guerra.",
    fandom: "Original", fandomType: "Libros & literatura", relationships: ["Mira/Joss"], warnings: ["Sin advertencias aplicables"],
    tags: ["Cyberpunk", "Found family", "Misterio"], rating: "General", status: "Completa",
    reads: 152000, likes: 18900, words: 64200, chapters: ch(["Estática", "Cielo bajo", "Señal fantasma", "Ruido blanco"]) },
  { id: "biblioteca", title: "La Biblioteca de los Susurros", author: "inkandtea", cover: c3, genre: "Romance",
    summary: "En el ala cerrada de la biblioteca, los libros eligen a sus lectores. Este año eligieron a dos personas que no se soportan.",
    fandom: "Hogwarts AU", fandomType: "Libros & literatura", relationships: ["Elian/Sora", "Amistad"], warnings: ["Ansiedad"],
    tags: ["Fluff", "Academia mágica", "Comfort", "Escrito a mano"], rating: "General", status: "En curso",
    reads: 412000, likes: 52300, words: 120800, chapters: ch(["Prólogo de polvo", "Estante 13", "Notas al margen", "Lámparas", "El índice perdido", "Encuadernados"]) },
  { id: "dragon", title: "El Último Juramento del Dragón", author: "ashenvow", cover: c4, genre: "Fantasía",
    summary: "Bajo la luna violeta, un caballero sin nombre regresa a la fortaleza en ruinas para cumplir una promesa que no recuerda haber hecho.",
    fandom: "Crónicas de Velmora", fandomType: "Videojuegos", relationships: ["Caballero & Dragón"], warnings: ["Violencia gráfica", "Temas maduros"],
    tags: ["Dark fantasy", "Redención", "Amnesia"], rating: "Maduro", status: "En curso",
    reads: 98000, likes: 12400, words: 45300, chapters: ch(["Luna violeta", "Niebla verde", "Las puertas caídas"]) },
];

// Portadas subidas desde el Estudio (guardadas en este navegador).
const COVERS_KEY = "nocturna-covers";
try {
  const saved = JSON.parse(localStorage.getItem(COVERS_KEY) || "{}") as Record<string, string>;
  stories.forEach((st) => { if (saved[st.id]) st.cover = saved[st.id]; });
} catch { /* ignore */ }
export const setCover = (id: string, url: string) => {
  const st = stories.find((x) => x.id === id); if (st) st.cover = url;
  try {
    const saved = JSON.parse(localStorage.getItem(COVERS_KEY) || "{}");
    localStorage.setItem(COVERS_KEY, JSON.stringify({ ...saved, [id]: url }));
    return true;
  } catch { return false; }
};

export const getStory = (id?: string) => stories.find((s) => s.id === id) ?? stories[0];
export const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : `${n}`);

export const sampleParagraphs = [
  "La tinta todavía estaba húmeda cuando Ren levantó la mirada. Al otro lado de la mesa, Cael sostenía el pergamino como si fuera una herida abierta.",
  "—No tenías derecho a terminarlo sin mí —dijo, y su voz sonó más cansada que furiosa.",
  "Afuera, la torre crujía con el viento de medianoche. Las runas del techo se encendían una a una, verdes como brasas de otro mundo, siguiendo un patrón que ninguno de los dos había trazado.",
  "Ren dejó la pluma. Por primera vez en tres años de rivalidad, no tenía una respuesta preparada. Solo la certeza incómoda de que el hechizo los había elegido a ambos.",
  "—Entonces lo deshacemos juntos —murmuró al fin—. O nos consume juntos.",
  "Cael rió, un sonido breve y sin alegría. Pero acercó su silla, y cuando sus dedos rozaron el borde del pergamino, la luz de las runas tembló como si respirara.",
  "Ninguno lo dijo en voz alta, pero ambos lo sintieron: algo en la torre acababa de despertar.",
];

export const paragraphComments: Record<number, { user: string; text: string }[]> = {
  1: [{ user: "nyx_reads", text: "ESTA LÍNEA. Me destruyó." }, { user: "pluma_azul", text: "El cansancio en vez de rabia, qué detalle." }],
  2: [{ user: "runefan", text: "Las runas verdes otra vez… teoría: la torre está viva." }],
  4: [{ user: "kei", text: "Lo deshacemos juntos 😭" }, { user: "lunarquill", text: "Autora aquí: guarden esta frase 👀" }, { user: "mar", text: "Slow burn de calidad" }],
};

export type ChapterComment = { story: string; user: string; ch: number; text: string; likes: number };
// Comentarios por capítulo (en memoria). Se publican solo desde el final de cada capítulo.
export const chapterComments: ChapterComment[] = [
  { story: "*", user: "nyx_reads", ch: 3, text: "La forma en que describes la torre me da escalofríos. El capítulo 3 es una obra maestra del worldbuilding.", likes: 214 },
  { story: "*", user: "pluma_azul", ch: 1, text: "No estaba preparada para ese final. ¿Cómo que hay que esperar una semana?", likes: 98 },
];
export const commentsFor = (story: string, ch?: number) =>
  chapterComments.filter((c) => (c.story === "*" || c.story === story) && (ch === undefined || c.ch === ch));

export const CATEGORIES = ["Drama", "Fantasía", "Comedia", "Acción", "Recuentos de la vida", "Romance", "Superhéroes", "Ciencia ficción", "Terror", "Sobrenatural", "Misterio", "Deportes", "Histórico", "Informativo"];

export const FANDOMS = ["Anime & manga", "Libros & literatura", "Cartoon & cómics", "Celebridades & personas reales", "Películas", "Música & bandas", "Teatro", "Shows de televisión", "Videojuegos"];
