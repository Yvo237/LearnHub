import { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Star,
  Users,
  Clock,
  BookOpen,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { courses, categories } from '../../data/mockData';
import { Page, Course } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface CatalogProps {
  onNavigate: (page: Page, courseId?: string) => void;
  searchQuery: string;
}

export default function Catalog({ onNavigate, searchQuery }: CatalogProps) {
  const { t, theme } = useApp();
  const isDark = theme === 'dark';

  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedLevel, setSelectedLevel] = useState('Tous');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState('all');

  const levels = ['Tous', 'Debutant', 'Intermediaire', 'Avance'];

  let filtered = courses.filter((course) => {
    const matchSearch =
      !searchQuery ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory = selectedCategory === 'Tous' || course.category === selectedCategory;
    const matchLevel = selectedLevel === 'Tous' || course.level === selectedLevel;
    const matchPrice =
      priceFilter === 'all' ||
      (priceFilter === 'free' && course.isFree) ||
      (priceFilter === 'paid' && !course.isFree);

    return matchSearch && matchCategory && matchLevel && matchPrice;
  });

  if (sortBy === 'popular') filtered.sort((a, b) => b.studentsCount - a.studentsCount);
  if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  if (sortBy === 'newest') filtered.sort((a, b) => b.id.localeCompare(a.id));
  if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);

  const courseColors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-emerald-500 to-teal-500',
    'from-indigo-500 to-violet-500',
    'from-rose-500 to-orange-500',
    'from-teal-500 to-blue-500',
    'from-fuchsia-500 to-purple-500',
  ];

  return (
    <div className={`p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('catalog.title')}</h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {t('catalog.subtitle', { count: courses.length })}
        </p>
      </div>

      {/* Categories Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                : isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm ${
            isDark
              ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {t('catalog.filters')}
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 shadow-sm ${
          isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
        }`}>
          <Filter className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`bg-transparent text-sm outline-none ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
          >
            <option value="popular">{t('catalog.mostPopular')}</option>
            <option value="rating">{t('catalog.bestRated')}</option>
            <option value="newest">{t('catalog.newest')}</option>
            <option value="price-low">{t('catalog.priceLow')}</option>
            <option value="price-high">{t('catalog.priceHigh')}</option>
          </select>
        </div>

        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {filtered.length} {t('catalog.coursesFound')}
        </span>
      </div>

      {/* Extended Filters */}
      {showFilters && (
        <div className={`mb-6 rounded-2xl border p-5 shadow-sm ${
          isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
        }`}>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className={`mb-2 block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {t('level.beginner').split(' ')[0]}
              </label>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                      selectedLevel === level
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : isDark
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={`mb-2 block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                Prix
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: t('catalog.all') },
                  { value: 'free', label: t('common.free') },
                  { value: 'paid', label: t('catalog.paid') },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPriceFilter(opt.value)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                      priceFilter === opt.value
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : isDark
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((course, idx) => (
          <CourseCard
            key={course.id}
            course={course}
            color={courseColors[idx % courseColors.length]}
            onClick={() => onNavigate('course-detail', course.id)}
            isDark={isDark}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Search className={`h-12 w-12 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
          <h3 className={`mt-4 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('catalog.noCourses')}
          </h3>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {t('catalog.tryDifferentFilters')}
          </p>
        </div>
      )}
    </div>
  );
}

function CourseCard({
  course,
  color,
  onClick,
  isDark,
}: {
  course: Course;
  color: string;
  onClick: () => void;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col overflow-hidden rounded-2xl border text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
        isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
      }`}
    >
      {/* Thumbnail */}
      <div className={`relative h-40 bg-gradient-to-br ${color} p-5`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative">
          <span
            className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${
              course.isFree
                ? 'bg-white/90 text-emerald-700'
                : 'bg-white/90 text-slate-700'
            }`}
          >
            {course.isFree ? 'Gratuit' : `${course.price}EUR`}
          </span>
        </div>
        <div className="absolute bottom-4 left-5">
          <span className="inline-flex items-center gap-1 rounded-lg bg-black/30 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <BookOpen className="h-3 w-3" /> {course.totalLessons} lecons
          </span>
        </div>
        {course.isEnrolled && (
          <div className="absolute right-4 top-4">
            <span className="rounded-lg bg-white/90 px-2 py-1 text-xs font-semibold text-primary-700">
              Inscrit
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${
            isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}>
            {course.level}
          </span>
          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{course.category}</span>
        </div>
        <h3 className={`mt-2 line-clamp-2 text-sm font-semibold group-hover:text-primary-600 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {course.title}
        </h3>
        <p className={`mt-1 line-clamp-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {course.shortDescription}
        </p>

        <div className="mt-auto pt-3">
          <div className={`flex items-center justify-between text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>{course.rating}</span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {course.studentsCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {course.duration}
            </span>
          </div>

          {course.isEnrolled && course.progress !== undefined && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Progression</span>
                <span className="font-semibold text-primary-600 dark:text-primary-400">{course.progress}%</span>
              </div>
              <div className={`mt-1 h-1.5 overflow-hidden rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          )}

          <div className={`mt-3 flex items-center gap-2 border-t pt-3 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${
              isDark ? 'bg-slate-700 text-slate-300' : 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600'
            }`}>
              {course.instructor.split(' ').map(n => n[0]).join('')}
            </div>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{course.instructor}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
