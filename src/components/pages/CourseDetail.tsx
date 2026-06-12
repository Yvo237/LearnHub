import { useState, useEffect } from 'react';
import { ArrowLeft, Play, FileText, HelpCircle, Code, Lock, CheckCircle2, Clock, Star, Users, BookOpen, Award, ChevronDown, ChevronUp, MessageSquare, Share2, Heart, BarChart3 } from 'lucide-react';
import { courseService, forumService } from '../../lib/supabase';
import { useAppStore } from '../../store/useStore';
import { useApp } from '../../contexts/AppContext';
import { getCourseImage } from '../../utils/images';
import type { Course, ForumPost, Page } from '../../types';

interface CourseDetailProps {
  courseId: string | null;
  onNavigate: (page: Page, courseId?: string, lessonId?: string) => void;
}

const lessonIcons: Record<string, any> = { video: Play, article: FileText, quiz: HelpCircle, exercise: Code };

export default function CourseDetail({ courseId, onNavigate }: CourseDetailProps) {
  const { t, theme, user } = useApp();
  const { navigate } = useAppStore();
  const nav = onNavigate || navigate;
  const isDark = theme === 'dark';
  const [course, setCourse] = useState<Course | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'overview' | 'forum' | 'reviews'>('content');

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    Promise.all([
      courseService.getCourseById(courseId, user?.id),
      forumService.getPosts(courseId),
    ]).then(([courseRes, postsRes]) => {
      if (courseRes.data) {
        setCourse(courseRes.data);
        setExpandedModules(courseRes.data.modules.map(m => m.id));
      }
      if (postsRes.data) setPosts(postsRes.data);
      setLoading(false);
    });
  }, [courseId, user]);

  if (loading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${isDark ? 'border-slate-600' : 'border-slate-300'}`} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <BookOpen className={`h-12 w-12 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
        <h3 className={`mt-4 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('course.notFound')}</h3>
        <button onClick={() => nav('catalog')} className="mt-4 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700">{t('course.backToCatalog')}</button>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedLessons = course.modules.reduce((s, m) => s + m.lessons.filter(l => l.isCompleted).length, 0);
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const toggleModule = (moduleId: string) => setExpandedModules(prev =>
    prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className={`relative px-4 py-6 text-white md:px-6 md:py-10`}>
        <img src={getCourseImage(course)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
        <div className="relative">
          <button onClick={() => nav(course.isEnrolled ? 'my-courses' : 'catalog')}
            className="mb-4 flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1.5 text-sm font-medium backdrop-blur-sm hover:bg-white/30">
            <ArrowLeft className="h-4 w-4" /> {t('common.back')}
          </button>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">{course.category}</span>
                <span className="rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">{course.level}</span>
              </div>
              <h1 className="mt-3 text-2xl font-bold md:text-3xl">{course.title}</h1>
              <p className="mt-2 text-sm text-white/80 md:text-base">{course.shortDescription}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><strong>{course.rating}</strong></span>
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {course.studentsCount.toLocaleString()} {t('common.students')}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {course.duration}</span>
                <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {totalLessons} {t('common.lessons')}</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold backdrop-blur-sm">
                  {course.instructor.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold">{course.instructor}</p>
                  <p className="text-xs text-white/70">{t('course.instructor')}</p>
                </div>
              </div>
            </div>

            <div className={`w-full rounded-2xl p-5 shadow-xl lg:w-80 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              {course.isEnrolled ? (
                <>
                  <div className="mb-4">
                    <div className={`flex items-center justify-between text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <span className="font-medium">{t('catalog.progress')}</span>
                      <span className="font-bold text-primary-600 dark:text-primary-400">{progress}%</span>
                    </div>
                    <div className={`mt-2 h-3 overflow-hidden rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{completedLessons}/{totalLessons} {t('course.lessonsCompleted')}</p>
                  </div>
                  <button onClick={() => { const next = course.modules.flatMap(m => m.lessons).find(l => !l.isCompleted && !l.isLocked); if (next) nav('lesson', course.id, next.id); }}
                    className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-700">
                    <span className="flex items-center justify-center gap-2"><Play className="h-4 w-4" /> {t('course.continueCourse')}</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-4 text-center">
                    {course.isFree ? <p className="text-2xl font-bold text-emerald-600">{t('common.free')}</p> : <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{course.price} FCFA</p>}
                  </div>
                  <button className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-700">
                    {course.isFree ? t('course.enrollFree') : t('course.buyCourse')}
                  </button>
                  <button className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                    <Heart className="h-4 w-4" /> {t('course.addToFavorites')}
                  </button>
                </>
              )}
              <div className={`mt-4 space-y-2 border-t pt-4 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}><Award className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} /> {t('course.certificate')}</div>
                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}><Clock className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} /> {t('course.unlimitedAccess')}</div>
                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}><BarChart3 className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} /> {t('course.progressTracking')}</div>
              </div>
              <button className={`mt-3 flex w-full items-center justify-center gap-2 text-sm ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}>
                <Share2 className="h-4 w-4" /> {t('course.share')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`border-b px-4 md:px-6 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
        <div className="flex gap-6">
          {(['content', 'overview', 'forum', 'reviews'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`border-b-2 py-3 text-sm font-medium transition-all ${activeTab === tab ? 'border-primary-600 text-primary-600 dark:text-primary-400' : `border-transparent ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}`}>
              {tab === 'content' && t('course.content')}{tab === 'overview' && t('course.overview')}{tab === 'forum' && `Forum (${posts.length})`}{tab === 'reviews' && t('course.reviews')}
            </button>
          ))}
        </div>
      </div>

      <div className={`p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        {activeTab === 'content' && (
          <div className="max-w-3xl space-y-3">
            {course.modules.map((module, mIdx) => {
              const isExpanded = expandedModules.includes(module.id);
              const moduleCompleted = module.lessons.filter(l => l.isCompleted).length;
              return (
                <div key={module.id} className={`overflow-hidden rounded-2xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                  <button onClick={() => toggleModule(module.id)} className={`flex w-full items-center justify-between p-4 text-left ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${isDark ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-100 text-primary-700'}`}>{mIdx + 1}</span>
                      <div>
                        <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{module.title}</h3>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{module.lessons.length} {t('common.lessons')} - {module.duration} - {moduleCompleted}/{module.lessons.length}</p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className={`h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} /> : <ChevronDown className={`h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />}
                  </button>
                  {isExpanded && (
                    <div className={`border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                      {module.lessons.map((lesson, lIdx) => {
                        const Icon = lessonIcons[lesson.type] || FileText;
                        return (
                          <div key={lesson.id} onClick={() => { if (!lesson.isLocked && course.isEnrolled) { if (lesson.type === 'quiz') nav('quiz', course.id); else nav('lesson', course.id, lesson.id); } }}
                            className={`flex cursor-pointer items-center gap-3 border-b px-4 py-3 last:border-b-0 ${lesson.isLocked ? 'opacity-50' : isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} ${isDark ? 'border-slate-700' : 'border-slate-50'}`}>
                            {lesson.isCompleted ? <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-500" /> : lesson.isLocked ? <Lock className={`h-5 w-5 flex-shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} /> :
                              <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
                                <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{lIdx + 1}</span>
                              </div>
                            }
                            <Icon className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                            <div className="flex-1"><p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{lesson.title}</p></div>
                            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{lesson.duration}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="max-w-3xl">
            <div className="prose prose-sm prose-slate dark:prose-invert">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('course.aboutCourse')}</h2>
              <p className={`mt-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{course.description}</p>
              <h3 className={`mt-6 text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('course.whatYouWillLearn')}</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {['Comprendre les concepts fondamentaux', 'Creer des projets professionnels', 'Maitriser les bonnes pratiques', 'Resoudre des problemes complexes', 'Preparer des entretiens techniques', 'Developper un portfolio solide'].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success-500" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item}</span>
                  </div>
                ))}
              </div>
              <h3 className={`mt-6 text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('course.tags')}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span key={tag} className={`rounded-lg px-3 py-1 text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forum' && (
          <div className="max-w-3xl space-y-3">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center py-12">
                <MessageSquare className={`h-10 w-10 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                <p className={`mt-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('forum.noDiscussions')}</p>
              </div>
            ) : posts.map((post) => (
              <div key={post.id} className={`rounded-2xl border p-4 ${isDark ? 'border-slate-700 bg-slate-800 hover:border-primary-600' : 'border-slate-200 bg-white hover:border-primary-200'}`}>
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${isDark ? 'bg-primary-900/30 text-primary-400' : 'bg-gradient-to-br from-primary-200 to-accent-200 text-primary-700'}`}>
                    {post.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{post.title}</h4>
                    <p className={`mt-1 text-xs line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{post.content}</p>
                    <div className={`mt-2 flex items-center gap-4 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post.replies}</span>
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {post.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-3xl">
            <div className={`rounded-2xl border p-6 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{course.rating}</p>
                  <div className="mt-1 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-4 w-4 ${s <= Math.floor(course.rating) ? 'fill-amber-400 text-amber-400' : isDark ? 'text-slate-600' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{course.studentsCount.toLocaleString()} avis</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = star === 5 ? 72 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 2 : 1;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className={`w-3 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{star}</span>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <div className={`h-2 flex-1 overflow-hidden rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                          <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                        </div>
                        <span className={`w-8 text-right text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
