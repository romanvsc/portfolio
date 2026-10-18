import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { es } from './es';
import { en } from './en';

export type Lang = 'es' | 'en';
export type Dict = typeof es;
/** Texto bilingüe en content/* */
export type T = { es: string; en: string };

const dicts: Record<Lang, Dict> = { es, en };

const read = (): Lang => {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'es') return q;
    const s = localStorage.getItem('lang');
    if (s === 'en' || s === 'es') return s;
  } catch { /* storage bloqueado */ }
  return navigator.language?.startsWith('es') === false ? 'en' : 'es';
};

const Ctx = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void; tr: (x: T) => string } | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, set] = useState<Lang>(read);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = dicts[lang].meta.title;
  }, [lang]);
  const setLang = useCallback((l: Lang) => {
    set(l);
    try { localStorage.setItem('lang', l); } catch { /* storage bloqueado */ }
  }, []);
  const tr = useCallback((x: T) => x[lang], [lang]);
  return <Ctx.Provider value={{ lang, t: dicts[lang], setLang, tr }}>{children}</Ctx.Provider>;
}

export const useLang = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useLang fuera de <LangProvider>');
  return c;
};
