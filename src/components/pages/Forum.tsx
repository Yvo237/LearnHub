import { useState, useEffect } from 'react';
import { MessageSquare, Search, Plus, Heart, MessageCircle, Clock } from 'lucide-react';
import { courseService, forumService } from '../../lib/supabase';
import { useApp } from '../../contexts/AppContext';
import type { ForumPost, Course } from '../../types';

export default function Forum() {
  const { t, theme } = useApp();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const isDark = theme === 'dark';

  useEffect(() => {
    Promise.all([
      forumService.getForumPosts(),
      courseService.getCourses(),
    ]).then(([postsRes, coursesRes]: any[]) => {
      if (postsRes.data) setPosts(postsRes.data);
      if (coursesRes.data) setCourses(coursesRes.data);
      setLoading(false);
    });
  }, []);

  const getCourseTitle = (courseId: string) => courses.find(c => c.id === courseId)?.title || '';

  const filteredPosts = posts.filter(post => {
    if (filter === 'popular') return post.likes >= 5;
    if (filter === 'unanswered') return post.replies === 0;
    return true;
  }).filter(post =>
    !searchQuery || post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('nav.forum')}</h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('forum.subtitle')}</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> {t('forum.newDiscussion')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${isDark ? 'border-slate-600' : 'border-slate-300'}`} />
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('forum.searchDiscussions')}
                className={`h-10 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition-all ${isDark ? 'border-slate-700 bg-slate-800 text-slate-200 placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20' : 'border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400 focus:border-primary-300 focus:bg-white focus:ring-2 focus:ring-primary-100'}`} />
            </div>
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'forum.recent' },
                { id: 'popular', label: 'forum.popular' },
                { id: 'unanswered', label: 'forum.noDiscussions' },
              ].map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${filter === f.id ? 'bg-primary-600 text-white' : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>{t(f.label)}</button>
              ))}
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <MessageSquare className={`h-12 w-12 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              <h3 className={`mt-4 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('forum.noDiscussions')}</h3>
              <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('forum.beFirst')}</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredPosts.map(post => (
                <div key={post.id} className={`overflow-hidden rounded-2xl border transition-all hover:shadow-md ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                  <div className="p-4 md:p-5">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-bold text-white">
                        {post.author.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                          <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{post.title}</h3>
                        </div>
                        <p className={`mt-1.5 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{post.content}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                            {getCourseTitle(post.courseId) || post.courseId}
                          </span>
                          <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            <Clock className="h-3 w-3" /> {post.date}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center gap-4 border-t pt-3 dark:border-slate-700">
                          <button className={`flex items-center gap-1.5 text-xs transition-colors ${isDark ? 'text-slate-400 hover:text-danger-400' : 'text-slate-500 hover:text-danger-600'}`}>
                            <Heart className="h-3.5 w-3.5" /> {post.likes}
                          </button>
                          <button className={`flex items-center gap-1.5 text-xs transition-colors ${isDark ? 'text-slate-400 hover:text-primary-400' : 'text-slate-500 hover:text-primary-600'}`}>
                            <MessageCircle className="h-3.5 w-3.5" /> {post.replies} {t('forum.replies')}
                          </button>
                          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('forum.beFirst')}: {post.author}</span>
                        </div>
                      </div>
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
