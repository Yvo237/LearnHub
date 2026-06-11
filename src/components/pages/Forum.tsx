import { useState } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  ThumbsUp,
  MessageCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { forumPosts, courses } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';

export default function Forum() {
  const { t, theme } = useApp();
  const isDark = theme === 'dark';

  const [selectedCourse, setSelectedCourse] = useState('all');
  const [searchQ, setSearchQ] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const enrolledCourses = courses.filter(c => c.isEnrolled);

  let filtered = forumPosts.filter(p => {
    const matchCourse = selectedCourse === 'all' || p.courseId === selectedCourse;
    const matchSearch = !searchQ || 
      p.title.toLowerCase().includes(searchQ.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQ.toLowerCase());
    return matchCourse && matchSearch;
  });

  if (sortBy === 'popular') filtered.sort((a, b) => b.likes - a.likes);
  if (sortBy === 'recent') filtered.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className={`p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('forum.title')}</h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {t('forum.subtitle')}
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary-500/25 hover:bg-primary-700">
          <Plus className="h-4 w-4" /> {t('forum.newDiscussion')}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCourse('all')}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedCourse === 'all'
                ? 'bg-primary-600 text-white'
                : isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('forum.allCourses')}
          </button>
          {enrolledCourses.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCourse(c.id)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCourse === c.id
                  ? 'bg-primary-600 text-white'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.title.split(' - ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Sort */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder={t('forum.searchDiscussions')}
            className={`h-10 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition-all ${
              isDark
                ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-primary-500'
                : 'border-slate-200 bg-white placeholder-slate-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100'
            }`}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('recent')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              sortBy === 'recent'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : isDark
                ? 'text-slate-400 hover:bg-slate-800'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Clock className="h-4 w-4" /> {t('forum.recent')}
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              sortBy === 'popular'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : isDark
                ? 'text-slate-400 hover:bg-slate-800'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="h-4 w-4" /> {t('forum.popular')}
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {filtered.map((post) => {
          const course = courses.find(c => c.id === post.courseId);
          return (
            <div
              key={post.id}
              className={`group cursor-pointer rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${
                isDark
                  ? 'border-slate-700 bg-slate-800 hover:border-primary-600'
                  : 'border-slate-200 bg-white hover:border-primary-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  isDark 
                    ? 'bg-gradient-to-br from-primary-600 to-accent-600 text-white' 
                    : 'bg-gradient-to-br from-primary-200 to-accent-200 text-primary-700'
                }`}>
                  {post.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`text-base font-semibold group-hover:text-primary-600 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {post.title}
                      </h3>
                      <div className={`mt-1 flex items-center gap-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{post.author}</span>
                        <span>-</span>
                        <span>{post.date}</span>
                        {course && (
                          <>
                            <span>-</span>
                            <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                              isDark ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-50 text-primary-600'
                            }`}>
                              {course.title.split(' - ')[0]}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className={`mt-2 text-sm line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{post.content}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <button className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                      isDark
                        ? 'text-slate-400 hover:bg-slate-700 hover:text-primary-400'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-primary-600'
                    }`}>
                      <ThumbsUp className="h-3.5 w-3.5" /> {post.likes}
                    </button>
                    <button className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                      isDark
                        ? 'text-slate-400 hover:bg-slate-700 hover:text-primary-400'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-primary-600'
                    }`}>
                      <MessageCircle className="h-3.5 w-3.5" /> {post.replies} {t('forum.replies')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <MessageSquare className={`h-12 w-12 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
          <h3 className={`mt-4 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('forum.noDiscussions')}
          </h3>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('forum.beFirst')}</p>
        </div>
      )}
    </div>
  );
}
