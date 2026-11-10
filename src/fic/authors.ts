import a1 from "@/assets/avatar-lunarquill.jpg";
import a2 from "@/assets/avatar-orbitalsea.jpg";
import a3 from "@/assets/avatar-inkandtea.jpg";
import a4 from "@/assets/avatar-ashenvow.jpg";

export type Author = { handle: string; name: string; avatar: string; bio: string; location: string; socials: { instagram?: string; x?: string; web?: string } };
export const authors: Record<string, Author> = {
  lunarquill: { handle: "lunarquill", name: "Luna Quintero", avatar: a1, location: "Bogotá", bio: "Escribo fantasía mágica y slow burn entre bibliotecas antiguas. Café, lavanda y runas.", socials: { instagram: "lunarquill", x: "lunarquill" } },
  orbitalsea: { handle: "orbitalsea", name: "Mateo Orbe", avatar: a2, location: "Valparaíso", bio: "Ciencia ficción melancólica sobre ciudades bajo la lluvia y personas que se buscan.", socials: { x: "orbitalsea", web: "orbitalsea.blog" } },
  inkandtea: { handle: "inkandtea", name: "Clara Té", avatar: a3, location: "Madrid", bio: "Misterio acogedor, libros que susurran y mucho té. Actualizo cada domingo.", socials: { instagram: "inkandtea", web: "inkandtea.com" } },
  ashenvow: { handle: "ashenvow", name: "Iker Ceniza", avatar: a4, location: "Ciudad de México", bio: "Fantasía oscura, caballeros sin nombre y dragones que recuerdan.", socials: { instagram: "ashenvow", x: "ashenvow" } },
};
export const getAuthor = (h?: string): Author =>
  authors[h ?? ""] ?? { handle: h ?? "autor", name: h ?? "Autor", avatar: "", location: "", bio: "Este autor aún no ha escrito su biografía.", socials: {} };
