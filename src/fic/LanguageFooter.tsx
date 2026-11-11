import { useEffect } from "react";

// Traduce la página automáticamente al idioma del navegador (en / pt); español por defecto.
const SUPPORTED = ["en", "pt"];

const browserLang = () => {
  const list = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const l of list) {
    const code = (l || "").slice(0, 2).toLowerCase();
    if (code === "es") return "es";
    if (SUPPORTED.includes(code)) return code;
  }
  return "es";
};

export default function LanguageFooter() {
  useEffect(() => {
    const lang = browserLang();
    const host = location.hostname;
    const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
    ["", `;domain=${host}`, `;domain=.${host}`].forEach((d) => (document.cookie = `googtrans=;${expire};path=/${d}`));
    if (lang === "es" || document.getElementById("gt-script")) return;
    document.cookie = `googtrans=/es/${lang};path=/`;
    (window as any).googleTranslateElementInit = () =>
      new (window as any).google.translate.TranslateElement({ pageLanguage: "es", includedLanguages: "en,pt", autoDisplay: false }, "gt-el");
    const s = document.createElement("script");
    s.id = "gt-script";
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(s);
  }, []);

  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Nocturna</p>
      </div>
      <div id="gt-el" className="hidden" />
    </footer>
  );
}
