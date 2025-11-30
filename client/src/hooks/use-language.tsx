import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "../lang/en.json";
import it from "../lang/it.json";

type Language = "en" | "it";
type Dictionary = typeof en;

// Helper type to access nested keys
// This is a simplified version. For deep nesting, a recursive type would be better,
// but for this prototype, we can stick to simple key access or known structure.
// To keep it typesafe but simple, let's treat the dictionary as `any` for the t function 
// or strictly type specific paths if we want to be pedantic.
// For rapid prototyping, `any` allows flexibility, but let's try to be safe.

const dictionaries: Record<Language, Dictionary> = {
  en,
  it
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Check localStorage first
    const savedLang = localStorage.getItem("mysteryfy_language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "it")) {
      setLanguageState(savedLang);
    } else {
      // Check device language
      const deviceLang = navigator.language.split("-")[0];
      if (deviceLang === "it") {
        setLanguageState("it");
      } else {
        setLanguageState("en"); // Default to English
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("mysteryfy_language", lang);
  };

  // Simple translation function that handles dot notation (e.g., "auth.signIn")
  const t = (path: string): string => {
    const keys = path.split(".");
    let current: any = dictionaries[language];
    
    for (const key of keys) {
      if (current && current[key]) {
        current = current[key];
      } else {
        // Fallback to English if missing in current language
        console.warn(`Missing translation for key: ${path} in language: ${language}`);
        return path; 
      }
    }
    
    if (typeof current === 'string') {
        return current;
    }
    
    return path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
