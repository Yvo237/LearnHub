import { useState, useEffect } from 'react';
import { BookOpen, Clock, TrendingUp, Star, PlayCircle } from 'lucide-react';
import { courseService } from '../../lib/supabase';
import { useAppStore } from '../../store/useStore';
import { useApp } from '../../contexts/AppContext';
import type { Course, Page } from '../../types';

interface MyCoursesProps {
  onNavigate?: (page: Page, courseId?: string) => void;
}

export default function MyCourses({ onNavigate }: MyCoursesProps) {
  const { navigate } = useAppStore();
  const { t, theme, user } = useApp();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const isDark = theme === 'dark';

  const nav = onNavigate || navigate;

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    courseService.getEnrolledCourses(user.id).then(({ data }: any) => {
      if (data) {
        const mapped: Course[] = data.map((e: any) => ({
          ...e.course,
          isEnrolled: true,
          progress: e.progress || 0,
          lastAccessed: e.last_accessed_at,
          status: e.progress >= 100 ? 'completed' : 'in-progress',
        }));
        setCourses(mapped);
      }
      setLoading(false);
    });
  }, [user]);

  const filteredCourses = filter === 'all' ? courses : courses.filter((c: any) => c.status === filter);

  const stats = [
    { label: t('myCourses.inProgress'), value: courses.filter((c: any) => c.status === 'in-progress').length, icon: Clock, color: isDark ? 'text-accent-400' : 'text-accent-600', bg: isDark ? 'bg-accent-900/30' : 'bg-accent-50' },
    { label: t('myCourses.completed'), value: courses.filter((c: any) => c.status === 'completed').length, icon: TrendingUp, color: isDark ? 'text-success-400' : 'text-success-600', bg: isDark ? 'bg-success-900/30' : 'bg-success-50' },
    { label: t('myCourses.total'), value: courses.length, icon: BookOpen, color: isDark ? 'text-primary-400' : 'text-primary-600', bg: isDark ? 'bg-primary-900/30' : 'bg-primary-50' },
  ];

  return (
    <div className={`p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('nav.myCourses')}</h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('myCourses.subtitle')}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${isDark ? 'border-slate-600' : 'border-slate-300'}`} />
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-3 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className={`rounded-2xl border p-4 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className={`mt-3 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mb-6 flex gap-2">
            {['all', 'in-progress', 'completed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${filter === f ? 'bg-primary-600 text-white' : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
                {f === 'all' ? t('common.all') : f === 'in-progress' ? t('myCourses.inProgress') : t('myCourses.completed')}
              </button>
            ))}
          </div>

          {filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <BookOpen className={`h-12 w-12 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              <h3 className={`mt-4 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('myCourses.empty')}</h3>
              <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('myCourses.emptyDesc')}</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course: any) => (
                <div key={course.id} onClick={() => nav('course-detail', course.id)} className={`group cursor-pointer overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-lg ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary-500 to-accent-600">
                    <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className={`mb-1.5 inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-semibold text-white ${course.status === 'in-progress' ? 'bg-accent-500/90' : course.status === 'completed' ? 'bg-success-500/90' : 'bg-primary-500/90'}`}>
                        <PlayCircle className="h-3 w-3" />
                        {course.status === 'in-progress' ? t('myCourses.continue') : course.status === 'completed' ? t('myCourses.completed') : t('myCourses.enrolled')}
                      </div>
                      <h3 className="text-sm font-bold text-white line-clamp-2">{course.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{course.instructor}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
                        <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{course.rating}</span>
                      </div>
                    </div>
                    {course.progress !== undefined && (
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{t('course.progress')}</span>
                          <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{course.progress}%</span>
                        </div>
                        <div className={`mt-1 h-1.5 overflow-hidden rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                          <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500" style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Clock className="h-3 w-3" /> {course.duration}
                      </span>
                      <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <BookOpen className="h-3 w-3" /> {course.totalLessons} {t('course.lessons')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
