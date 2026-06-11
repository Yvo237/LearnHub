import { useState, useEffect } from 'react';
import { BookOpen, Clock, Star, Users, Search, ChevronRight } from 'lucide-react';
import { courseService } from '../../lib/supabase';
import { useAppStore } from '../../store/useStore';
import { useApp } from '../../contexts/AppContext';
import type { Course, Page } from '../../types';

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface CatalogProps {
  onNavigate?: (page: Page, courseId?: string) => void;
  searchQuery?: string;
}

export default function Catalog({ onNavigate, searchQuery: propSearch }: CatalogProps) {
  const { navigate } = useAppStore();
  const { t, theme } = useApp();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(propSearch || '');
  const [activeCategory, setActiveCategory] = useState('all');
  const isDark = theme === 'dark';

  const nav = onNavigate || navigate;

  useEffect(() => {
    setSearchQuery(propSearch || '');
  }, [propSearch]);

  useEffect(() => {
    Promise.all([
      courseService.getCourses(),
      courseService.getCategories(),
    ]).then(([coursesRes, categoriesRes]) => {
      if (coursesRes.data) setCourses(coursesRes.data);
      if (categoriesRes.data) {
        const cats = (coursesRes.data || []);
        setCategories((categoriesRes.data as any[]).map((c: any) => ({
          ...c,
          count: cats.filter(co => co.category === c.name).length,
        })));
      }
      setLoading(false);
    });
  }, []);

  const filteredCourses = courses.filter(c => {
    if (activeCategory !== 'all' && c.category !== activeCategory) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase()) && !c.instructor.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const catColors = ['from-amber-400 to-orange-500', 'from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-purple-500 to-pink-600'];

  return (
    <div className={`p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('nav.catalog')}</h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('catalog.subtitle')}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${isDark ? 'border-slate-600' : 'border-slate-300'}`} />
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('catalog.search')}
                className={`h-10 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition-all ${isDark ? 'border-slate-700 bg-slate-800 text-slate-200 placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20' : 'border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400 focus:border-primary-300 focus:bg-white focus:ring-2 focus:ring-primary-100'}`} />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.slice(0, 4).map((cat, idx) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id === activeCategory ? 'all' : cat.id)}
                className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all hover:shadow-md ${activeCategory === cat.id ? 'border-primary-500 ring-2 ring-primary-500/30' : isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <div className={`absolute right-0 top-0 h-16 w-16 translate-x-4 -translate-y-4 rounded-full bg-gradient-to-br ${catColors[idx]} opacity-20`} />
                <p className={`text-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{cat.icon}</p>
                <h3 className={`mt-2 text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{cat.name}</h3>
                <p className={`mt-0.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{cat.count} {t('catalog.courses')}</p>
              </button>
            ))}
          </div>

          {filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <BookOpen className={`h-12 w-12 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              <h3 className={`mt-4 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('catalog.noResults')}</h3>
              <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('catalog.noResultsDesc')}</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map(course => (
                <div key={course.id} onClick={() => nav('course-detail', course.id)} className={`group cursor-pointer overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-lg ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                  <div className="relative aspect-video overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-block rounded-lg bg-white/20 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">{course.level}</span>
                      <h3 className="mt-1 text-sm font-bold text-white">{course.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className={`text-sm leading-relaxed line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{course.description}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
                        <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{course.rating}</span>
                      </div>
                      <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Users className="h-3.5 w-3.5" /> {course.studentsCount}
                      </span>
                      <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Clock className="h-3.5 w-3.5" /> {course.duration}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{course.price === 0 ? t('catalog.free') : `${course.price.toLocaleString()} FCFA`}</span>
                      <button onClick={e => { e.stopPropagation(); nav('course-detail', course.id); }} className="flex items-center gap-1 rounded-xl bg-primary-600 px-4 py-2 text-xs font-medium text-white transition-all hover:bg-primary-700">
                        {t('catalog.enroll')} <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {categories.length > 4 && (
            <div className={`mt-6 rounded-2xl border p-4 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('catalog.allCategories')}</h3>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{categories.length} {t('catalog.categories').toLowerCase()}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => setActiveCategory('all')}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${activeCategory === 'all' ? 'bg-primary-600 text-white' : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {t('common.all')}
                </button>
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${activeCategory === cat.id ? 'bg-primary-600 text-white' : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
