import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Play,
  ArrowRight,
  Flame,
  Target,
  Star,
  Users,
  BarChart3,
  Zap,
} from 'lucide-react';
import { courses, currentUser, calendarEvents } from '../../data/mockData';
import { Page } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface DashboardProps {
  onNavigate: (page: Page, courseId?: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { t, theme } = useApp();
  const isDark = theme === 'dark';

  const enrolledCourses = courses.filter(c => c.isEnrolled);
  const completedLessons = enrolledCourses.reduce((sum, c) => {
    return sum + c.modules.reduce((mSum, m) => mSum + m.lessons.filter(l => l.isCompleted).length, 0);
  }, 0);
  const totalLessons = enrolledCourses.reduce((sum, c) => {
    return sum + c.modules.reduce((mSum, m) => mSum + m.lessons.length, 0);
  }, 0);

  const upcomingEvents = calendarEvents.slice(0, 3);

  const stats = [
    {
      label: t('dashboard.coursesInProgress'),
      value: enrolledCourses.length,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: isDark ? 'bg-blue-900/30' : 'bg-blue-50',
      textColor: isDark ? 'text-blue-400' : 'text-blue-600',
      change: `+2 ${t('dashboard.thisMonth')}`,
    },
    {
      label: t('dashboard.lessonsCompleted'),
      value: completedLessons,
      icon: Target,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: isDark ? 'bg-emerald-900/30' : 'bg-emerald-50',
      textColor: isDark ? 'text-emerald-400' : 'text-emerald-600',
      change: `${totalLessons} ${t('dashboard.total')}`,
    },
    {
      label: t('dashboard.certificatesEarned'),
      value: currentUser.coursesCompleted,
      icon: Award,
      color: 'from-amber-500 to-orange-500',
      bgColor: isDark ? 'bg-amber-900/30' : 'bg-amber-50',
      textColor: isDark ? 'text-amber-400' : 'text-amber-600',
      change: `+1 ${t('dashboard.recently')}`,
    },
    {
      label: t('dashboard.xpPoints'),
      value: currentUser.totalPoints.toLocaleString(),
      icon: Zap,
      color: 'from-purple-500 to-violet-600',
      bgColor: isDark ? 'bg-purple-900/30' : 'bg-purple-50',
      textColor: isDark ? 'text-purple-400' : 'text-purple-600',
      change: t('dashboard.top10'),
    },
  ];

  const weeklyData = [40, 65, 45, 80, 55, 70, 90];
  const weekDays = [
    t('day.mon'), t('day.tue'), t('day.wed'), t('day.thu'), t('day.fri'), t('day.sat'), t('day.sun')
  ];
  const maxVal = Math.max(...weeklyData);

  return (
    <div className={`space-y-6 p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-accent-700 p-6 text-white md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary-200">
            <Flame className="h-5 w-5 text-orange-300" />
            <span className="text-sm font-medium">{currentUser.streak} {t('dashboard.streak')}</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">
            {t('dashboard.welcome')} {currentUser.name.split(' ')[0]} !
          </h1>
          <p className="mt-2 max-w-lg text-sm text-primary-100 md:text-base">
            {t('dashboard.completedLessons', { count: completedLessons })}
          </p>
          <button
            onClick={() => {
              const lastCourse = enrolledCourses.sort((a, b) => 
                (b.lastAccessed || '').localeCompare(a.lastAccessed || '')
              )[0];
              if (lastCourse) onNavigate('course-detail', lastCourse.id);
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30"
          >
            <Play className="h-4 w-4" />
            {t('dashboard.resumeCourse')}
          </button>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -right-4 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 right-20 h-24 w-24 rounded-full bg-white/5" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`group rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md md:p-5 ${
                isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
              }`}
            >
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
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('dashboard.continueLearning')}</h2>
            <button
              onClick={() => onNavigate('my-courses')}
              className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {t('common.seeAll')} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {enrolledCourses.map((course) => {
              const totalL = course.modules.reduce((s, m) => s + m.lessons.length, 0);
              const completedL = course.modules.reduce(
                (s, m) => s + m.lessons.filter(l => l.isCompleted).length, 0
              );
              return (
                <button
                  key={course.id}
                  onClick={() => onNavigate('course-detail', course.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${
                    isDark ? 'border-slate-700 bg-slate-800 hover:border-primary-600' : 'border-slate-200 bg-white hover:border-primary-200'
                  }`}
                >
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/50 dark:to-accent-900/50">
                    <BookOpen className={`h-6 w-6 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`truncate text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{course.title}</h3>
                    <p className={`mt-0.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {course.instructor} - {completedL}/{totalL} {t('common.lessons')}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className={`h-2 flex-1 overflow-hidden rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
                          style={{ width: `${course.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                        {course.progress || 0}%
                      </span>
                    </div>
                  </div>
                  <ArrowRight className={`h-5 w-5 flex-shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Weekly Activity */}
          <div className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('dashboard.weeklyActivity')}</h3>
              <BarChart3 className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            </div>
            <div className="mt-4 flex items-end justify-between gap-2">
              {weeklyData.map((val, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-lg transition-all ${
                      i === 6
                        ? 'bg-gradient-to-t from-primary-500 to-accent-500'
                        : isDark
                        ? 'bg-slate-700 hover:bg-slate-600'
                        : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                    style={{ height: `${(val / maxVal) * 80}px` }}
                  />
                  <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{weekDays[i]}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Total: 7h 15min</span>
              <span className="flex items-center gap-1 font-medium text-success-600">
                <TrendingUp className="h-3 w-3" /> +12%
              </span>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('dashboard.upcomingEvents')}</h3>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                {t('common.seeAll')}
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                      event.type === 'deadline'
                        ? isDark ? 'bg-danger-900/30 text-danger-400' : 'bg-danger-50 text-danger-500'
                        : event.type === 'live'
                        ? isDark ? 'bg-success-900/30 text-success-400' : 'bg-success-50 text-success-500'
                        : event.type === 'exam'
                        ? isDark ? 'bg-warning-900/30 text-warning-400' : 'bg-warning-50 text-warning-500'
                        : isDark ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-50 text-primary-500'
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.title}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {event.date} {event.time && `- ${event.time}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended */}
          <div className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('dashboard.recommendedForYou')}</h3>
            <div className="mt-3 space-y-3">
              {courses.filter(c => !c.isEnrolled).slice(0, 2).map((course) => (
                <button
                  key={course.id}
                  onClick={() => onNavigate('course-detail', course.id)}
                  className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
                >
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${isDark ? 'bg-accent-900/30' : 'bg-gradient-to-br from-accent-100 to-primary-100'}`}>
                    <Star className={`h-4 w-4 ${isDark ? 'text-accent-400' : 'text-accent-600'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{course.title}</p>
                    <p className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {course.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {course.studentsCount.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
