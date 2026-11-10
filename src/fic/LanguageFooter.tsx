import { useEffect, useState } from "react";
import { Languages } from "lucide-react";

// Traduce página y contenido con el traductor de Google (es → en / pt).
const LANGS = [{ code: "es", label: "Español" }, { code: "en", label: "English" }, { code: "pt", label: "Português" }];

const current = () => document.cookie.match(/googtrans=\/es\/(\w+)/)?.[1] ?? "es";

function setLang(code: string) {
  const host = location.hostname;
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  ["", `;domain=${host}`, `;domain=.${host}`].forEach((d) => (document.cookie = `googtrans=;${expire};path=/${d}`));
  if (code !== "es") document.cookie = `googtrans=/es/${code};path=/`;
  location.reload();
}

export default function LanguageFooter() {
  const [lang] = useState(current);
  useEffect(() => {
    if (lang === "es" || document.getElementById("gt-script")) return;
    (window as any).googleTranslateElementInit = () =>
      new (window as any).google.translate.TranslateElement({ pageLanguage: "es", includedLanguages: "en,pt", autoDisplay: false }, "gt-el");
    const s = document.createElement("script");
    s.id = "gt-script";
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(s);
  }, [lang]);

  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-6 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Nocturna</p>
        <label className="notranslate inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 h-10">
          <Languages className="h-4 w-4 text-primary" />
          <span className="sr-only">Idioma</span>
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-transparent text-foreground outline-none">
            {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </label>
      </div>
      <div id="gt-el" className="hidden" />
    </footer>
  );
}
