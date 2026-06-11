import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { translations, TranslationKey, Language } from '../i18n/translations';
import { supabase, isDemoMode } from '../lib/supabase';

type Theme = 'light' | 'dark';

// Type utilisateur simplifie pour le mode demo
interface DemoUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
  };
}

interface AppContextType {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;

  // Auth
  user: DemoUser | null;
  isLoading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  // Theme state
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('learnhub-theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Language state
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('learnhub-language');
      if (saved === 'fr' || saved === 'en') return saved;
      const browserLang = navigator.language.split('-')[0];
      return browserLang === 'fr' ? 'fr' : 'en';
    }
    return 'fr';
  });

  // Auth state
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('learnhub-theme', theme);
  }, [theme]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('learnhub-language', language);
    document.documentElement.lang = language;
  }, [language]);

  // Auth state listener
  useEffect(() => {
    if (isDemoMode) {
      // En mode demo, verifier si on a un utilisateur sauvegarde
      const savedUser = localStorage.getItem('learnhub-demo-user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      }
      setIsLoading(false);
      return;
    }

    // Mode Supabase reel
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            user_metadata: {
              full_name: session.user.user_metadata?.full_name || 'Utilisateur',
            },
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            user_metadata: {
              full_name: session.user.user_metadata?.full_name || 'Utilisateur',
            },
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Theme functions
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // Language functions
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  // Translation function
  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return String(key);
    }
    
    let text: string = translation[language];
    
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(`{${paramKey}}`, String(value));
      });
    }
    
    return text;
  }, [language]);

  // Auth functions
  const signIn = useCallback(async (email: string, password: string) => {
    if (isDemoMode) {
      // Mode demo - accepter n'importe quel email/password
      const demoUser: DemoUser = {
        id: 'demo-user-' + Date.now(),
        email: email,
        user_metadata: {
          full_name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        },
      };
      setUser(demoUser);
      localStorage.setItem('learnhub-demo-user', JSON.stringify(demoUser));
      return { error: null };
    }

    if (!supabase) {
      return { error: { message: 'Supabase non configure' } };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    if (isDemoMode) {
      // Mode demo - creer un utilisateur fictif
      const demoUser: DemoUser = {
        id: 'demo-user-' + Date.now(),
        email: email,
        user_metadata: {
          full_name: fullName,
        },
      };
      setUser(demoUser);
      localStorage.setItem('learnhub-demo-user', JSON.stringify(demoUser));
      return { error: null };
    }

    if (!supabase) {
      return { error: { message: 'Supabase non configure' } };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    if (isDemoMode) {
      setUser(null);
      localStorage.removeItem('learnhub-demo-user');
      return;
    }

    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  }, []);

  const value: AppContextType = {
    theme,
    setTheme,
    toggleTheme,
    language,
    setLanguage,
    t,
    user,
    isLoading,
    isDemo: isDemoMode,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Convenience hooks
export function useTheme() {
  const { theme, setTheme, toggleTheme } = useApp();
  return { theme, setTheme, toggleTheme };
}

export function useLanguage() {
  const { language, setLanguage, t } = useApp();
  return { language, setLanguage, t };
}

export function useAuth() {
  const { user, isLoading, isDemo, signIn, signUp, signOut } = useApp();
  return { user, isLoading, isDemo, signIn, signUp, signOut };
}
