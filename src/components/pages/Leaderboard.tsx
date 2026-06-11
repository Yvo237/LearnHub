import { useState, useEffect } from 'react';
import { Trophy, Medal, Zap, BookOpen, Flame, ArrowUp, ArrowDown, Crown } from 'lucide-react';
import { leaderboardService } from '../../lib/supabase';
import { useApp } from '../../contexts/AppContext';
import type { LeaderboardEntry } from '../../types';

export default function LeaderboardPage() {
  const { t, theme, user } = useApp();
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => {
    leaderboardService.getLeaderboard().then(({ data: res }) => {
      if (res) setData(res);
      setLoading(false);
    });
  }, []);

  const userRank = data.findIndex(u => u.name === (user?.fullName || ''));

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Crown className="h-5 w-5 text-amber-400" />;
    if (rank === 1) return <Medal className="h-5 w-5 text-slate-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold text-slate-400">#{rank + 1}</span>;
  };

  return (
    <div className={`p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('nav.leaderboard')}</h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('leaderboard.subtitle')}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${isDark ? 'border-slate-600' : 'border-slate-300'}`} />
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Trophy className={`h-12 w-12 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                  <h3 className={`mt-4 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('leaderboard.title')}</h3>
        </div>
      ) : (
        <>
          {user && userRank >= 0 && (
            <div className={`mb-6 overflow-hidden rounded-2xl border shadow-sm ${isDark ? 'border-primary-700 bg-gradient-to-br from-primary-900/40 to-slate-800' : 'border-primary-200 bg-gradient-to-br from-primary-50 to-white'}`}>
              <div className="flex items-center gap-4 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-xl font-bold text-white ring-2 ring-white dark:ring-slate-800">
                  {user.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.fullName}</h3>
                  <p className={`text-xs font-medium ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>{t('leaderboard.yourPosition')} #{userRank + 1} / {data.length}</p>
                </div>
              </div>
              <div className={`flex border-t px-4 py-3 ${isDark ? 'border-primary-800' : 'border-primary-100'}`}>
                <div className="flex flex-1 items-center gap-1.5 justify-center border-r dark:border-primary-800">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{data[userRank].points.toLocaleString()} pts</span>
                </div>
                <div className="flex flex-1 items-center gap-1.5 justify-center border-r dark:border-primary-800">
                  <BookOpen className="h-4 w-4 text-primary-500" />
                  <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{data[userRank].coursesCompleted} {t('leaderboard.courses')}</span>
                </div>
                <div className="flex flex-1 items-center gap-1.5 justify-center">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{data[userRank].streak} {t('common.days')}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            {data.map((userData, idx) => {
              const isCurrentUser = userData.name === (user?.fullName || '');
              const Icon = getRankIcon(idx);
              return (
                <div key={userData.id || idx} className={`group flex items-center gap-4 rounded-xl border px-4 py-3 transition-all ${isCurrentUser ? isDark ? 'border-primary-700 bg-primary-900/30' : 'border-primary-200 bg-primary-50' : isDark ? 'border-slate-700 bg-slate-800 hover:bg-slate-700' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className="flex h-10 w-10 items-center justify-center">{Icon}</div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-bold text-white ring-2 ${isCurrentUser ? 'ring-primary-400' : 'ring-transparent'}`}>
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{userData.name}</p>
                    {userData.title && <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{userData.title}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1 rounded-lg px-2 py-1 ${isDark ? 'bg-amber-900/30' : 'bg-amber-50'}`}>
                      <Zap className={`h-3.5 w-3.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                      <span className={`text-xs font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{userData.points.toLocaleString()}</span>
                    </div>
                    <div className={`rounded-lg px-2 py-1 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{userData.coursesCompleted} {t('leaderboard.courses').toLowerCase()}</span>
                    </div>
                    <div className={`rounded-lg px-2 py-1 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{userData.streak}d</span>
                    </div>
                    {userData.change !== undefined && userData.change !== 0 && (
                      <div className={`flex items-center gap-0.5 ${userData.change > 0 ? 'text-success-500' : 'text-danger-500'}`}>
                        {userData.change > 0 ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
                        <span className="text-xs font-medium">{Math.abs(userData.change)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
