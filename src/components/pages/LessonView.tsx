import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  CheckCircle2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Code,
  Lock,
  ThumbsUp,
  Bookmark,
  Settings,
  Volume2,
  Maximize2,
  SkipForward,
} from 'lucide-react';
import { courses } from '../../data/mockData';
import { Page } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface LessonViewProps {
  courseId: string | null;
  lessonId: string | null;
  onNavigate: (page: Page, courseId?: string, lessonId?: string) => void;
}

const lessonIcons = {
  video: Play,
  article: FileText,
  quiz: HelpCircle,
  exercise: Code,
};

export default function LessonView({ courseId, lessonId, onNavigate }: LessonViewProps) {
  const { t, theme } = useApp();
  const isDark = theme === 'dark';

  const course = courses.find(c => c.id === courseId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [expandedModules, setExpandedModules] = useState<string[]>(
    course?.modules.map(m => m.id) || []
  );
  const [notes, setNotes] = useState('');

  if (!course) {
    return (
      <div className={`flex h-full items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>{t('course.notFound')}</p>
      </div>
    );
  }

  const allLessons = course.modules.flatMap(m => m.lessons);
  const currentLesson = allLessons.find(l => l.id === lessonId) || allLessons.find(l => !l.isCompleted && !l.isLocked) || allLessons[0];
  const currentIndex = allLessons.indexOf(currentLesson);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const completedCount = allLessons.filter(l => l.isCompleted).length;
  const progress = Math.round((completedCount / allLessons.length) * 100);

  return (
    <div className={`flex h-[calc(100vh-64px)] flex-col lg:flex-row ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Video / Content Area */}
        <div className={`relative ${isDark ? 'bg-slate-950' : 'bg-slate-900'}`}>
          {currentLesson.type === 'video' ? (
            <div className="relative flex aspect-video max-h-[60vh] items-center justify-center">
              <img
                src="/images/hero-learning.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-30"
              />
              <div className="relative z-10 flex flex-col items-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-110"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8 text-white" />
                  ) : (
                    <Play className="h-8 w-8 text-white ml-1" />
                  )}
                </button>
                <p className="mt-4 text-sm text-white/80">{currentLesson.title}</p>
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="mb-2 h-1 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-1/3 rounded-full bg-primary-500" />
                </div>
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                    <button><SkipForward className="h-5 w-5" /></button>
                    <button><Volume2 className="h-5 w-5" /></button>
                    <span className="text-xs">12:34 / {currentLesson.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button><Settings className="h-5 w-5" /></button>
                    <button><Maximize2 className="h-5 w-5" /></button>
                  </div>
                </div>
              </div>
            </div>
          ) : currentLesson.type === 'article' ? (
            <div className={`p-8 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="mx-auto max-w-3xl">
                <span className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium ${
                  isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                }`}>
                  <FileText className="h-3 w-3" /> Article
                </span>
                <h1 className={`mt-3 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentLesson.title}</h1>
                <div className={`mt-6 leading-relaxed space-y-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <p>Bienvenue dans cette lecon. Vous allez apprendre les concepts fondamentaux necessaires pour maitriser ce sujet en profondeur.</p>
                  <p>Les points cles abordes dans cette lecon incluent les definitions de base, les exemples pratiques, et les meilleures pratiques recommandees par les experts du domaine.</p>
                  <div className={`rounded-xl p-4 border-l-4 border-primary-500 ${isDark ? 'bg-primary-900/20' : 'bg-primary-50'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-primary-400' : 'text-primary-900'}`}>{t('lesson.importantPoint')}</p>
                    <p className={`mt-1 text-sm ${isDark ? 'text-primary-300' : 'text-primary-700'}`}>N'oubliez pas de pratiquer regulierement pour renforcer vos connaissances.</p>
                  </div>
                  <p>Continuez a explorer les exemples ci-dessous et n'hesitez pas a poser vos questions sur le forum de discussion.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={`flex aspect-video max-h-[40vh] items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <div className="text-center">
                <Code className={`mx-auto h-12 w-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{currentLesson.title}</p>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {currentLesson.type === 'quiz' ? 'Quiz interactif' : 'Exercice pratique'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Lesson Info Bar */}
        <div className={`flex items-center justify-between border-b px-4 py-3 md:px-6 ${
          isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('course-detail', courseId || undefined)}
              className={`flex items-center gap-1 text-sm ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden md:inline">{t('lesson.backToCourse')}</span>
            </button>
            <div className={`h-4 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            <h2 className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentLesson.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className={`rounded-lg p-2 ${isDark ? 'text-slate-500 hover:bg-slate-700 hover:text-slate-300' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
              <Bookmark className="h-4 w-4" />
            </button>
            <button className={`rounded-lg p-2 ${isDark ? 'text-slate-500 hover:bg-slate-700 hover:text-slate-300' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`rounded-lg p-2 lg:hidden ${isDark ? 'text-slate-500 hover:bg-slate-700 hover:text-slate-300' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
            >
              <BookOpen className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bottom navigation + Notes */}
        <div className={`flex-1 overflow-y-auto p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="mx-auto max-w-3xl">
            {/* Notes */}
            <div className="mb-6">
              <h3 className={`mb-2 text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('lesson.myNotes')}</h3>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={t('lesson.takeNotes')}
                className={`h-24 w-full rounded-xl border p-3 text-sm outline-none resize-none ${
                  isDark
                    ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-primary-500'
                    : 'border-slate-200 bg-white placeholder-slate-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100'
                }`}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => prevLesson && onNavigate('lesson', courseId || undefined, prevLesson.id)}
                disabled={!prevLesson}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium disabled:opacity-40 ${
                  isDark
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ArrowLeft className="h-4 w-4" /> {t('common.previous')}
              </button>

              <button className="flex items-center gap-2 rounded-xl bg-success-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-success-700">
                <CheckCircle2 className="h-4 w-4" /> {t('lesson.markComplete')}
              </button>

              <button
                onClick={() => nextLesson && onNavigate('lesson', courseId || undefined, nextLesson.id)}
                disabled={!nextLesson}
                className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-md hover:bg-primary-700 disabled:opacity-40"
              >
                {t('common.next')} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Sidebar */}
      {showSidebar && (
        <div className={`w-full border-l lg:w-80 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <div className={`flex items-center justify-between border-b px-4 py-3 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
            <div>
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('lesson.courseContent')}</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{completedCount}/{allLessons.length} - {progress}%</p>
            </div>
          </div>
          <div className={`h-1 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <div className="h-full bg-primary-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            {course.modules.map((module) => {
              const isExpanded = expandedModules.includes(module.id);
              return (
                <div key={module.id}>
                  <button
                    onClick={() => toggleModule(module.id)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
                  >
                    <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{module.title}</span>
                    {isExpanded ? (
                      <ChevronUp className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    ) : (
                      <ChevronDown className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    )}
                  </button>
                  {isExpanded && (
                    <div>
                      {module.lessons.map((lesson) => {
                        const Icon = lessonIcons[lesson.type];
                        const isCurrent = lesson.id === currentLesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => !lesson.isLocked && onNavigate('lesson', courseId || undefined, lesson.id)}
                            disabled={lesson.isLocked}
                            className={`flex w-full items-center gap-3 px-4 py-2 text-left text-xs transition-all ${
                              isCurrent
                                ? isDark
                                  ? 'bg-primary-900/30 border-l-2 border-primary-500'
                                  : 'bg-primary-50 border-l-2 border-primary-500'
                                : lesson.isLocked
                                ? 'opacity-40'
                                : isDark
                                ? 'hover:bg-slate-700'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            {lesson.isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success-500" />
                            ) : lesson.isLocked ? (
                              <Lock className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                            ) : (
                              <Icon className={`h-4 w-4 flex-shrink-0 ${isCurrent ? 'text-primary-500' : isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                            )}
                            <span className={`flex-1 truncate ${
                              isCurrent 
                                ? isDark ? 'font-medium text-primary-400' : 'font-medium text-primary-700' 
                                : isDark ? 'text-slate-300' : 'text-slate-600'
                            }`}>
                              {lesson.title}
                            </span>
                            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{lesson.duration}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
