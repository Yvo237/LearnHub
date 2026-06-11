import {
  BookOpen,
  Clock,
  ArrowRight,
  CheckCircle2,
  Play,
} from 'lucide-react';
import { useState } from 'react';
import { courses } from '../../data/mockData';
import { Page } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface MyCoursesProps {
  onNavigate: (page: Page, courseId?: string) => void;
}

export default function MyCourses({ onNavigate }: MyCoursesProps) {
  const { t, theme } = useApp();
  const isDark = theme === 'dark';

  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  const enrolledCourses = courses.filter(c => c.isEnrolled);
  const filteredCourses = enrolledCourses.filter(c => {
    if (filter === 'in-progress') return (c.progress || 0) < 100;
    if (filter === 'completed') return (c.progress || 0) >= 90;
    return true;
  });

  const totalProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((s, c) => s + (c.progress || 0), 0) / enrolledCourses.length)
    : 0;

  const filters = [
    { id: 'all' as const, label: t('catalog.all'), count: enrolledCourses.length },
    { id: 'in-progress' as const, label: t('myCourses.inProgress'), count: enrolledCourses.filter(c => (c.progress || 0) < 100).length },
    { id: 'completed' as const, label: t('myCourses.completed'), count: enrolledCourses.filter(c => (c.progress || 0) >= 90).length },
  ];

  const courseColors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-emerald-500 to-teal-500',
  ];

  return (
    <div className={`p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('myCourses.title')}</h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {t('myCourses.subtitle')}
        </p>
      </div>

      {/* Overall Progress */}
      <div className={`mb-6 rounded-2xl border p-5 ${
        isDark 
          ? 'border-slate-700 bg-gradient-to-r from-primary-900/30 to-accent-900/30' 
          : 'border-slate-200 bg-gradient-to-r from-primary-50 to-accent-50'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {t('myCourses.overallProgress')}
            </h3>
            <p className={`mt-1 text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalProgress}%</p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{enrolledCourses.length}</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('myCourses.enrolled')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success-600">
                {enrolledCourses.filter(c => (c.progress || 0) >= 90).length}
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('myCourses.completed')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning-600">
                {enrolledCourses.reduce((s, c) => {
                  return s + c.modules.reduce((ms, m) => ms + m.lessons.filter(l => l.isCompleted).length, 0);
                }, 0)}
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('myCourses.lessonsDone')}</p>
            </div>
          </div>
        </div>
        <div className={`mt-4 h-3 overflow-hidden rounded-full ${isDark ? 'bg-slate-700' : 'bg-white/70'}`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              filter === f.id
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                : isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs ${
                filter === f.id 
                  ? 'bg-white/20' 
                  : isDark ? 'bg-slate-700' : 'bg-slate-200'
              }`}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {filteredCourses.map((course, idx) => {
          const totalL = course.modules.reduce((s, m) => s + m.lessons.length, 0);
          const completedL = course.modules.reduce(
            (s, m) => s + m.lessons.filter(l => l.isCompleted).length, 0
          );
          const nextLesson = course.modules
            .flatMap(m => m.lessons)
            .find(l => !l.isCompleted && !l.isLocked);

          return (
            <div
              key={course.id}
              className={`overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md ${
                isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex flex-col md:flex-row">
                {/* Color Bar */}
                <div className={`h-2 bg-gradient-to-r ${courseColors[idx % courseColors.length]} md:h-auto md:w-2`} />

                <div className="flex flex-1 flex-col gap-4 p-5 md:flex-row md:items-center">
                  {/* Course Icon */}
                  <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${courseColors[idx % courseColors.length]} text-white`}>
                    <BookOpen className="h-6 w-6" />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{course.title}</h3>
                    <p className={`mt-0.5 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{course.instructor}</p>
                    <div className={`mt-2 flex flex-wrap items-center gap-3 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" /> {completedL}/{totalL} {t('common.lessons')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {course.duration}
                      </span>
                      {nextLesson && (
                        <span className="flex items-center gap-1 text-primary-600 dark:text-primary-400">
                          <Play className="h-3.5 w-3.5" /> {t('myCourses.nextLesson')} {nextLesson.title}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className={`h-2 flex-1 overflow-hidden rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <div
                          className={`h-full rounded-full transition-all ${
                            (course.progress || 0) >= 90
                              ? 'bg-gradient-to-r from-success-500 to-emerald-400'
                              : 'bg-gradient-to-r from-primary-500 to-accent-500'
                          }`}
                          style={{ width: `${course.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{course.progress || 0}%</span>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => onNavigate('course-detail', course.id)}
                    className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-primary-500/25 transition-all hover:bg-primary-700"
                  >
                    {(course.progress || 0) >= 90 ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> {t('myCourses.review')}
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" /> {t('myCourses.continue')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <BookOpen className={`h-12 w-12 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
          <h3 className={`mt-4 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('myCourses.noCourses')}
          </h3>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {filter === 'all' ? t('myCourses.enrollFirst') : t('catalog.tryDifferentFilters')}
          </p>
          <button
            onClick={() => onNavigate('catalog')}
            className="mt-4 flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            {t('myCourses.exploreCatalog')} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
