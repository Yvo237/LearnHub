import {
  Mail,
  Calendar,
  BookOpen,
  Award,
  Zap,
  Flame,
  MapPin,
  Edit3,
  ExternalLink,
  TrendingUp,
  Target,
  Trophy,
  Users,
  Atom,
} from 'lucide-react';
import { currentUser, courses, certificates } from '../../data/mockData';
import { Page } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface ProfileProps {
  onNavigate: (page: Page, courseId?: string) => void;
}

export default function Profile({ onNavigate }: ProfileProps) {
  const { t, theme } = useApp();
  const isDark = theme === 'dark';

  const enrolledCourses = courses.filter(c => c.isEnrolled);

  const skills = [
    { name: 'React', level: 85 },
    { name: 'TypeScript', level: 72 },
    { name: 'Node.js', level: 90 },
    { name: 'Python', level: 45 },
    { name: 'CSS/Tailwind', level: 78 },
    { name: 'Git', level: 88 },
  ];

  const activityData = [2, 4, 1, 5, 3, 6, 4, 2, 5, 7, 3, 4, 6, 2, 5, 3, 7, 4, 6, 3, 5, 2, 4, 6, 3, 5, 7, 4, 2, 5];

  return (
    <div className={`p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Profile Header */}
      <div className={`relative overflow-hidden rounded-2xl border shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
        <div className="h-32 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700" />
        <div className="px-6 pb-6">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
            <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-2xl border-4 bg-gradient-to-br from-primary-500 to-accent-500 text-2xl font-bold text-white shadow-lg border-white dark:border-slate-800">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentUser.name}</h1>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isDark ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-100 text-primary-700'
                }`}>
                  {t('profile.learner')}
                </span>
              </div>
              <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currentUser.bio}</p>
              <div className={`mt-2 flex flex-wrap items-center gap-3 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> {currentUser.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {t('profile.memberSince')} {currentUser.joinedDate}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> Paris, France
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('settings')}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium ${
                isDark
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Edit3 className="h-4 w-4" /> {t('profile.editProfile')}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: t('profile.coursesCompleted'), value: currentUser.coursesCompleted, icon: BookOpen, color: isDark ? 'text-primary-400' : 'text-primary-600', bg: isDark ? 'bg-primary-900/30' : 'bg-primary-50' },
          { label: t('certificates.earned'), value: certificates.length, icon: Award, color: isDark ? 'text-amber-400' : 'text-amber-600', bg: isDark ? 'bg-amber-900/30' : 'bg-amber-50' },
          { label: t('dashboard.xpPoints'), value: currentUser.totalPoints.toLocaleString(), icon: Zap, color: isDark ? 'text-purple-400' : 'text-purple-600', bg: isDark ? 'bg-purple-900/30' : 'bg-purple-50' },
          { label: t('profile.dayStreak'), value: currentUser.streak, icon: Flame, color: isDark ? 'text-orange-400' : 'text-orange-600', bg: isDark ? 'bg-orange-900/30' : 'bg-orange-50' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`rounded-2xl border p-4 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
              <div className={`inline-flex rounded-xl ${stat.bg} p-2.5`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Skills */}
        <div className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('profile.skills')}</h3>
            <Target className={`h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          </div>
          <div className="mt-4 space-y-3">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{skill.name}</span>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{skill.level}%</span>
                </div>
                <div className={`mt-1 h-2 overflow-hidden rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('profile.activity30Days')}</h3>
            <TrendingUp className={`h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          </div>
          <div className="mt-4 grid grid-cols-10 gap-1.5">
            {activityData.map((val, i) => (
              <div
                key={i}
                className={`h-7 rounded-md transition-all ${
                  val === 0
                    ? isDark ? 'bg-slate-700' : 'bg-slate-100'
                    : val <= 2
                    ? isDark ? 'bg-primary-900/50' : 'bg-primary-100'
                    : val <= 4
                    ? isDark ? 'bg-primary-700' : 'bg-primary-300'
                    : val <= 6
                    ? 'bg-primary-500'
                    : 'bg-primary-700'
                }`}
                title={`${val} heures`}
              />
            ))}
          </div>
          <div className={`mt-3 flex items-center justify-between text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>{t('profile.lessActive')}</span>
            <div className="flex gap-1">
              {[
                isDark ? 'bg-slate-700' : 'bg-slate-100',
                isDark ? 'bg-primary-900/50' : 'bg-primary-100',
                isDark ? 'bg-primary-700' : 'bg-primary-300',
                'bg-primary-500',
                'bg-primary-700'
              ].map((c, i) => (
                <div key={i} className={`h-3 w-3 rounded-sm ${c}`} />
              ))}
            </div>
            <span>{t('profile.moreActive')}</span>
          </div>
        </div>

        {/* Badges */}
        <div className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('profile.badgesEarned')}</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {currentUser.badges.map((badge) => {
              const badgeIcons: Record<string, React.ReactNode> = {
                target: <Target className="h-6 w-6 text-primary-500" />,
                flame: <Flame className="h-6 w-6 text-orange-500" />,
                atom: <Atom className="h-6 w-6 text-blue-500" />,
                trophy: <Trophy className="h-6 w-6 text-amber-500" />,
                users: <Users className="h-6 w-6 text-emerald-500" />,
              };
              return (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center rounded-xl p-3 text-center transition-all ${
                    isDark ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm ${
                    isDark ? 'bg-slate-800' : 'bg-white'
                  }`}>
                    {badgeIcons[badge.icon] || <Award className={`h-6 w-6 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />}
                  </div>
                  <p className={`mt-2 text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{badge.name}</p>
                  <p className={`mt-0.5 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{badge.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('profile.coursesInProgress')}</h3>
            <button
              onClick={() => onNavigate('my-courses')}
              className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              {t('common.seeAll')} <ExternalLink className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {enrolledCourses.map((course) => (
              <button
                key={course.id}
                className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors ${
                  isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
                }`}
                onClick={() => onNavigate('course-detail', course.id)}
              >
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                  isDark ? 'bg-primary-900/30' : 'bg-gradient-to-br from-primary-100 to-accent-100'
                }`}>
                  <BookOpen className={`h-5 w-5 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{course.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className={`h-1.5 flex-1 overflow-hidden rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <div
                        className="h-full rounded-full bg-primary-500"
                        style={{ width: `${course.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{course.progress || 0}%</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
