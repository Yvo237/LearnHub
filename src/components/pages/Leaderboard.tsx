import {
  Flame,
  TrendingUp,
  Zap,
  BookOpen,
} from 'lucide-react';
import { leaderboard, currentUser } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';

export default function Leaderboard() {
  const { t, theme } = useApp();
  const isDark = theme === 'dark';

  const top3 = leaderboard.slice(0, 3);
  const userRank = leaderboard.findIndex(u => u.name === currentUser.name) + 1;

  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumHeights = ['h-28', 'h-36', 'h-24'];
  const podiumColors = [
    'from-slate-400 to-slate-500',
    'from-amber-400 to-yellow-500',
    'from-orange-400 to-amber-500',
  ];
  const podiumBg = [
    isDark ? 'bg-slate-700' : 'bg-slate-100',
    isDark ? 'bg-amber-900/30' : 'bg-amber-50',
    isDark ? 'bg-orange-900/30' : 'bg-orange-50',
  ];
  const rankLabels = ['2nd', '1st', '3rd'];

  return (
    <div className={`p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('leaderboard.title')}</h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {t('leaderboard.subtitle')}
        </p>
      </div>

      {/* Your Position */}
      <div className={`mb-6 rounded-2xl border p-5 ${
        isDark 
          ? 'border-primary-700 bg-gradient-to-r from-primary-900/30 to-accent-900/30' 
          : 'border-primary-200 bg-gradient-to-r from-primary-50 to-accent-50'
      }`}>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-lg font-bold text-white">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentUser.name}</h3>
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                isDark ? 'bg-primary-900/50 text-primary-400' : 'bg-primary-100 text-primary-700'
              }`}>
                #{userRank}
              </span>
            </div>
            <div className={`mt-1 flex items-center gap-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <span className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-amber-500" /> {currentUser.totalPoints.toLocaleString()} pts
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-primary-500" /> {currentUser.coursesCompleted} {t('leaderboard.courses')}
              </span>
              <span className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" /> {currentUser.streak} {t('common.days')}
              </span>
            </div>
          </div>
          <div className="hidden items-center gap-1 text-sm font-medium text-success-600 md:flex">
            <TrendingUp className="h-4 w-4" /> +2 {t('leaderboard.places')}
          </div>
        </div>
      </div>

      {/* Podium */}
      <div className="mb-8 flex items-end justify-center gap-3 px-4">
        {podiumOrder.map((user, i) => (
          <div key={user.rank} className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className={`flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold ${podiumBg[i]} ${
                i === 1 ? 'ring-4 ring-amber-300' : ''
              } ${isDark ? 'text-white' : 'text-slate-700'}`}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className={`absolute -bottom-1 -right-1 rounded-full px-1.5 py-0.5 text-xs font-bold shadow ${
                isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-700'
              }`}>
                {rankLabels[i]}
              </span>
            </div>
            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name.split(' ')[0]}</p>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user.points.toLocaleString()} pts</p>
            <div className={`mt-2 w-24 rounded-t-xl bg-gradient-to-t ${podiumColors[i]} ${podiumHeights[i]} flex items-center justify-center`}>
              <span className="text-2xl font-bold text-white">{user.rank}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Rest of leaderboard */}
      <div className={`rounded-2xl border shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
        <div className={`border-b px-5 py-3 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('leaderboard.fullRanking')}</h3>
        </div>
        <div className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-100'}`}>
          {leaderboard.map((user) => {
            const isCurrentUser = user.name === currentUser.name;
            return (
              <div
                key={user.rank}
                className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                  isCurrentUser 
                    ? isDark ? 'bg-primary-900/20' : 'bg-primary-50' 
                    : isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    user.rank <= 3
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                      : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {user.rank}
                </span>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                    isCurrentUser
                      ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white'
                      : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    isCurrentUser 
                      ? isDark ? 'text-primary-400' : 'text-primary-700' 
                      : isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {user.name} {isCurrentUser && t('leaderboard.you')}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {user.courses} {t('leaderboard.courses')} - {user.streak} {t('leaderboard.dayStreak')}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.points.toLocaleString()}</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('common.points')}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
