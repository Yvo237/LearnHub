import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Trophy,
  Calendar,
  MessageSquare,
  Award,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Flame,
  X,
  LogOut,
} from 'lucide-react';
import { Page } from '../../types';
import { currentUser } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';

interface SidebarProps {
  currentPage: Page;
  isOpen: boolean;
  onNavigate: (page: Page) => void;
  onToggle: () => void;
}

export default function Sidebar({ currentPage, isOpen, onNavigate, onToggle }: SidebarProps) {
  const { t, theme, user, signOut } = useApp();
  
  // Utiliser le nom de l'utilisateur connecte ou les donnees de demo
  const displayName = user?.user_metadata?.full_name || currentUser.name;
  const displayEmail = user?.email || currentUser.email;

  const menuItems = [
    { id: 'dashboard' as Page, label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'catalog' as Page, label: t('nav.catalog'), icon: BookOpen },
    { id: 'my-courses' as Page, label: t('nav.myCourses'), icon: GraduationCap },
    { id: 'certificates' as Page, label: t('nav.certificates'), icon: Award },
    { id: 'calendar' as Page, label: t('nav.calendar'), icon: Calendar },
    { id: 'forum' as Page, label: t('nav.forum'), icon: MessageSquare },
    { id: 'leaderboard' as Page, label: t('nav.leaderboard'), icon: Trophy },
  ];

  const bottomItems = [
    { id: 'profile' as Page, label: t('nav.profile'), icon: User },
    { id: 'settings' as Page, label: t('nav.settings'), icon: Settings },
  ];

  const isDark = theme === 'dark';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-full flex-col border-r transition-all duration-300 lg:relative lg:z-auto ${
          isOpen ? 'w-64' : 'w-0 lg:w-20'
        } ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}
      >
        {/* Logo */}
        <div className={`flex h-16 items-center border-b px-4 ${!isOpen && 'lg:justify-center'} ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          {isOpen ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 text-white">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>LearnHub</span>
              </div>
              <button
                onClick={onToggle}
                className={`rounded-lg p-1.5 lg:hidden ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
              >
                <X className="h-5 w-5" />
              </button>
              <button
                onClick={onToggle}
                className={`hidden rounded-lg p-1.5 lg:block ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onToggle}
              className={`hidden rounded-lg p-1.5 lg:block ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto px-3 py-4 ${!isOpen && 'hidden lg:block'}`}>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 shadow-sm dark:bg-primary-900/30 dark:text-primary-400'
                      : isDark
                      ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } ${!isOpen && 'lg:justify-center lg:px-0'}`}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                  {isOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Streak Card */}
          {isOpen && (
            <div className={`mt-6 rounded-xl p-4 ${isDark ? 'bg-orange-900/20' : 'bg-gradient-to-br from-orange-50 to-amber-50'}`}>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className={`text-sm font-semibold ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>
                  {currentUser.streak} {t('sidebar.streakMessage')}
                </span>
              </div>
              <p className={`mt-1 text-xs ${isDark ? 'text-orange-400/70' : 'text-orange-600'}`}>
                {t('dashboard.keepItUp')}
              </p>
              <div className={`mt-2 h-1.5 overflow-hidden rounded-full ${isDark ? 'bg-orange-900/50' : 'bg-orange-200'}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400"
                  style={{ width: `${(currentUser.streak / 30) * 100}%` }}
                />
              </div>
            </div>
          )}
        </nav>

        {/* Bottom nav */}
        <div className={`border-t px-3 py-3 ${!isOpen && 'hidden lg:block'} ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : isDark
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                } ${!isOpen && 'lg:justify-center lg:px-0'}`}
                title={!isOpen ? item.label : undefined}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                {isOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* User Card */}
        {isOpen && (
          <div className={`border-t px-3 py-3 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <button
              onClick={() => onNavigate('profile')}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-semibold text-white">
                {displayName.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div className="flex-1 text-left">
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{displayName}</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{displayEmail}</p>
              </div>
            </button>
            <button
              onClick={() => signOut()}
              className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium ${
                isDark 
                  ? 'text-danger-400 hover:bg-danger-900/20' 
                  : 'text-danger-600 hover:bg-danger-50'
              }`}
            >
              <LogOut className="h-4 w-4" />
              {t('auth.signOut')}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
