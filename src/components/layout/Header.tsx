import { useState, useEffect } from 'react';
import { Menu, Search, Bell, Sun, Moon, X, Globe } from 'lucide-react';
import { notificationService } from '../../lib/supabase';
import { useApp } from '../../contexts/AppContext';
import type { Page, Notification } from '../../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigate: (page: Page) => void;
}

export default function Header({ onToggleSidebar, searchQuery, onSearchChange, onNavigate }: HeaderProps) {
  const { theme, toggleTheme, language, setLanguage, t, user } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const isDark = theme === 'dark';
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (user) {
      notificationService.getUserNotifications(user.id).then(({ data }) => {
        if (data) setNotifications(data);
      });
    }
  }, [user]);

  return (
    <header className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-xl md:px-6 ${isDark ? 'border-slate-700 bg-slate-900/80' : 'border-slate-200 bg-white/80'}`}>
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className={`rounded-lg p-2 lg:hidden ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}>
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden md:block">
          <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input type="text" value={searchQuery} onChange={e => onSearchChange(e.target.value)} placeholder={t('common.search')}
            className={`h-10 w-80 rounded-xl border pl-10 pr-4 text-sm outline-none transition-all ${isDark ? 'border-slate-700 bg-slate-800 text-slate-200 placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20' : 'border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400 focus:border-primary-300 focus:bg-white focus:ring-2 focus:ring-primary-100'}`} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setShowSearch(!showSearch)} className={`rounded-lg p-2 md:hidden ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}>
          <Search className="h-5 w-5" />
        </button>

        <div className="relative">
          <button onClick={() => setShowLangMenu(!showLangMenu)} className={`flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
            <Globe className="h-4 w-4" /><span className="uppercase">{language}</span>
          </button>
          {showLangMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
              <div className={`absolute right-0 z-50 mt-2 w-32 overflow-hidden rounded-xl border shadow-lg ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <button onClick={() => { setLanguage('fr'); setShowLangMenu(false); }} className={`flex w-full items-center gap-2 px-3 py-2 text-sm ${language === 'fr' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                  <span>FR</span><span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Français</span>
                </button>
                <button onClick={() => { setLanguage('en'); setShowLangMenu(false); }} className={`flex w-full items-center gap-2 px-3 py-2 text-sm ${language === 'en' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                  <span>EN</span><span className={isDark ? 'text-slate-400' : 'text-slate-500'}>English</span>
                </button>
              </div>
            </>
          )}
        </div>

        <button onClick={toggleTheme} className={`rounded-lg p-2 ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-amber-400' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="relative">
          <button onClick={() => setShowNotifs(!showNotifs)} className={`relative rounded-lg p-2 ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white">{unreadCount}</span>}
          </button>
          {showNotifs && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
              <div className={`absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border shadow-xl ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <div className={`flex items-center justify-between border-b px-4 py-3 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                  <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notifications</h3>
                  <button onClick={() => setShowNotifs(false)} className={`rounded-lg p-1 ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className={`px-4 py-8 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Aucune notification</p>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className={`border-b px-4 py-3 transition-colors ${isDark ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-50 hover:bg-slate-50'} ${!notif.isRead ? (isDark ? 'bg-primary-900/20' : 'bg-primary-50/50') : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${notif.type === 'success' ? 'bg-success-500' : notif.type === 'warning' ? 'bg-warning-500' : notif.type === 'course' ? 'bg-primary-500' : 'bg-slate-400'}`} />
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{notif.title}</p>
                            <p className={`mt-0.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{notif.message}</p>
                            <p className={`mt-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className={`border-t p-2 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                    <button className="w-full rounded-lg py-2 text-center text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20">{t('common.seeAll')}</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <button onClick={() => onNavigate('profile')} className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-semibold text-white ring-2 ring-white dark:ring-slate-800">
          {(user?.fullName || 'U').split(' ').map(n => n[0]).join('')}
        </button>
      </div>

      {showSearch && (
        <div className={`absolute left-0 top-16 w-full border-b p-3 md:hidden ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input type="text" value={searchQuery} onChange={e => onSearchChange(e.target.value)} placeholder={t('common.search')} autoFocus
              className={`h-10 w-full rounded-xl border pl-10 pr-4 text-sm outline-none ${isDark ? 'border-slate-700 bg-slate-800 text-slate-200 placeholder-slate-500 focus:border-primary-500' : 'border-slate-200 bg-slate-50 placeholder-slate-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100'}`} />
          </div>
        </div>
      )}
    </header>
  );
}
