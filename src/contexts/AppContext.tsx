import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { translations, Language } from '../i18n/translations';
import { supabase, authService } from '../lib/supabase';

type Theme = 'light' | 'dark';

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'instructor' | 'admin';
}

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('learnhub-theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('learnhub-language');
      if (saved === 'fr' || saved === 'en') return saved;
      return navigator.language.startsWith('fr') ? 'fr' : 'en';
    }
    return 'fr';
  });

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('learnhub-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('learnhub-language', language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    async function loadUser(session: any): Promise<AuthUser | null> {
      if (!session?.user) return null;
      let role: 'student' | 'instructor' | 'admin' = 'student';
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (profile?.role === 'admin' || profile?.role === 'instructor') role = profile.role;
      return {
        id: session.user.id,
        email: session.user.email || '',
        fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Utilisateur',
        role,
      };
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(await loadUser(session));
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(await loadUser(session));
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(() => setThemeState(p => p === 'light' ? 'dark' : 'light'), []);

  const setLanguage = useCallback((l: Language) => setLanguageState(l), []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const translation = (translations as any)[key];
    if (!translation) return String(key);
    let text = translation[language];
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  }, [language]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await authService.signIn(email, password);
    return { error };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { error } = await authService.signUp(email, password, fullName);
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  return (
    <AppContext.Provider value={{ theme, setTheme, toggleTheme, language, setLanguage, t, user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useApp();
  return { theme, setTheme, toggleTheme };
}

export function useLanguage() {
  const { language, setLanguage, t } = useApp();
  return { language, setLanguage, t };
}

export function useAuth() {
  const { user, isLoading, signIn, signUp, signOut } = useApp();
  return { user, isLoading, signIn, signUp, signOut };
}
