import { useState, useEffect } from 'react';
import { BookOpen, Clock, Award, TrendingUp, Play, ArrowRight, Flame, Target, BarChart3, Zap } from 'lucide-react';
import { courseService, calendarService } from '../../lib/supabase';
import { useAppStore } from '../../store/useStore';
import { useApp } from '../../contexts/AppContext';
import type { CalendarEvent, Page } from '../../types';

interface DashboardProps {
  onNavigate: (page: Page, courseId?: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { t, theme, user } = useApp();
  const { navigate } = useAppStore();
  const nav = onNavigate || navigate;
  const [courses, setCourses] = useState<any[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!user) return;
    Promise.all([
      courseService.getEnrolledCourses(user.id),
      calendarService.getUserEvents(user.id).catch(() => ({ data: [] })),
    ]).then(([coursesRes, eventsRes]: any[]) => {
      const enrolled = (coursesRes.data || []).map((e: any) => ({
        ...e.course,
        isEnrolled: true,
        progress: e.progress || 0,
        lastAccessed: e.last_accessed_at,
      }));
      setCourses(enrolled);
      setEvents(eventsRes.data || []);
      setLoading(false);
    });
  }, [user]);

  const completedLessons = 0;
  const totalLessons = 0;
  const upcomingEvents = events.slice(0, 3);

  const stats = [
    { label: t('dashboard.coursesInProgress'), value: courses.length, icon: BookOpen, bgColor: isDark ? 'bg-blue-900/30' : 'bg-blue-50', textColor: isDark ? 'text-blue-400' : 'text-blue-600', change: `+2 ${t('dashboard.thisMonth')}` },
    { label: t('dashboard.lessonsCompleted'), value: completedLessons, icon: Target, bgColor: isDark ? 'bg-emerald-900/30' : 'bg-emerald-50', textColor: isDark ? 'text-emerald-400' : 'text-emerald-600', change: `${totalLessons} ${t('dashboard.total')}` },
    { label: t('dashboard.certificatesEarned'), value: 0, icon: Award, bgColor: isDark ? 'bg-amber-900/30' : 'bg-amber-50', textColor: isDark ? 'text-amber-400' : 'text-amber-600', change: `+0 ${t('dashboard.recently')}` },
    { label: t('dashboard.xpPoints'), value: '0', icon: Zap, bgColor: isDark ? 'bg-purple-900/30' : 'bg-purple-50', textColor: isDark ? 'text-purple-400' : 'text-purple-600', change: t('dashboard.top10') },
  ];

  const weeklyData = [40, 65, 45, 80, 55, 70, 90];
  const weekDays = [t('day.mon'), t('day.tue'), t('day.wed'), t('day.thu'), t('day.fri'), t('day.sat'), t('day.sun')];
  const maxVal = Math.max(...weeklyData);

  return (
    <div className={`space-y-6 p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-accent-700 p-6 text-white md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary-200">
            <Flame className="h-5 w-5 text-orange-300" />
            <span className="text-sm font-medium">{user?.fullName.split(' ')[0] || ''}, {t('dashboard.streak')}</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">
            {t('dashboard.welcome')} {user?.fullName.split(' ')[0] || ''} !
          </h1>
          <p className="mt-2 max-w-lg text-sm text-primary-100 md:text-base">
            {t('dashboard.completedLessons', { count: completedLessons })}
          </p>
          <button onClick={() => { const last = courses.sort((a, b) => (b.lastAccessed || '').localeCompare(a.lastAccessed || ''))[0]; if (last) nav('course-detail', last.id); }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30">
            <Play className="h-4 w-4" /> {t('dashboard.resumeCourse')}
          </button>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -right-4 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 right-20 h-24 w-24 rounded-full bg-white/5" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${isDark ? 'border-slate-600' : 'border-slate-300'}`} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`group rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md md:p-5 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div className={`rounded-xl ${stat.bgColor} p-2.5`}>
                      <Icon className={`h-5 w-5 ${stat.textColor}`} />
                    </div>
                    <span className={`text-xs font-medium ${stat.textColor}`}>{stat.change}</span>
                  </div>
                  <p className={`mt-3 text-2xl font-bold md:text-3xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                  <p className={`mt-0.5 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('dashboard.continueLearning')}</h2>
                <button onClick={() => nav('my-courses')} className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
                  {t('common.seeAll')} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {courses.length === 0 ? (
                  <div className={`rounded-2xl border p-8 text-center ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                    <BookOpen className={`mx-auto h-8 w-8 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                    <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('dashboard.noCourses')}</p>
                    <button onClick={() => nav('catalog')} className="mt-3 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">{t('catalog.browseCourses')}</button>
                  </div>
                ) : courses.map((course: any) => {
                  return (
                    <button key={course.id} onClick={() => nav('course-detail', course.id)}
                      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${isDark ? 'border-slate-700 bg-slate-800 hover:border-primary-600' : 'border-slate-200 bg-white hover:border-primary-200'}`}>
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/50 dark:to-accent-900/50">
                        <BookOpen className={`h-6 w-6 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`truncate text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{course.title}</h3>
                        <p className={`mt-0.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {course.instructor} - {course.totalLessons || 0} {t('common.lessons')}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <div className={`h-2 flex-1 overflow-hidden rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                            <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all" style={{ width: `${course.progress || 0}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{course.progress || 0}%</span>
                        </div>
                      </div>
                      <ArrowRight className={`h-5 w-5 flex-shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('dashboard.weeklyActivity')}</h3>
                  <BarChart3 className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                </div>
                <div className="mt-4 flex items-end justify-between gap-2">
                  {weeklyData.map((val, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <div className={`w-full rounded-lg transition-all ${i === 6 ? 'bg-gradient-to-t from-primary-500 to-accent-500' : isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}
                        style={{ height: `${(val / maxVal) * 80}px` }} />
                      <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{weekDays[i]}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Total: 7h 15min</span>
                  <span className="flex items-center gap-1 font-medium text-success-600"><TrendingUp className="h-3 w-3" /> +12%</span>
                </div>
              </div>

              <div className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('dashboard.upcomingEvents')}</h3>
                  <button onClick={() => nav('calendar')} className="text-xs font-medium text-primary-600 hover:text-primary-700">{t('common.seeAll')}</button>
                </div>
                <div className="mt-3 space-y-3">
                  {upcomingEvents.length === 0 ? (
                    <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('calendar.noEvents')}</p>
                  ) : upcomingEvents.map((evt) => (
                    <div key={evt.id} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${evt.type === 'deadline' ? isDark ? 'bg-danger-900/30 text-danger-400' : 'bg-danger-50 text-danger-500' : evt.type === 'live' ? isDark ? 'bg-success-900/30 text-success-400' : 'bg-success-50 text-success-500' : evt.type === 'exam' ? isDark ? 'bg-warning-900/30 text-warning-400' : 'bg-warning-50 text-warning-500' : isDark ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-50 text-primary-500'}`}>
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{evt.title}</p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{evt.date} {evt.time && `- ${evt.time}`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('dashboard.recommendedForYou')}</h3>
                <div className="mt-3 space-y-3">
                  <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('catalog.browseCourses')}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
