import { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle, XCircle, ArrowLeft, ArrowRight, Award, RefreshCw } from 'lucide-react';
import { quizService } from '../../lib/supabase';
import { useAppStore } from '../../store/useStore';
import { useApp } from '../../contexts/AppContext';
import type { Quiz, Page } from '../../types';

interface QuizPageProps {
  onNavigate?: (page: Page, courseId?: string) => void;
}

export default function QuizPage({ onNavigate }: QuizPageProps) {
  const { selectedCourseId, navigate: storeNavigate } = useAppStore();
  const navigate = onNavigate || storeNavigate;
  const { t, theme } = useApp();
  const courseId = selectedCourseId;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    quizService.getQuiz(courseId).then(({ data }) => {
      if (data) {
        setQuiz(data);
        if (data.timeLimit) setTimeLeft(data.timeLimit * 60);
      }
      setLoading(false);
    });
  }, [courseId]);

  useEffect(() => {
    if (!timeLeft || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setSubmitted(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  if (loading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${isDark ? 'border-slate-600' : 'border-slate-300'}`} />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <AlertCircle className={`h-12 w-12 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
        <h2 className={`mt-4 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('quiz.notFound')}</h2>
        <button onClick={() => navigate('course-detail', courseId || undefined)} className={`mt-4 rounded-xl px-6 py-2 text-sm font-medium ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'}`}>{t('common.back')}</button>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const currentQ = questions[currentQuestion];
  const isLast = currentQuestion === questions.length - 1;
  const score = submitted ? questions.reduce((acc, q, idx) => acc + (Number(answers[idx]) === q.correctAnswer ? 1 : 0), 0) : 0;
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = percentage >= (quiz.passingScore || 70);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (submitted) {
    return (
      <div className={`min-h-screen p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="mx-auto max-w-2xl">
          <div className={`rounded-2xl border p-6 text-center shadow-lg ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
            {passed ? (
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success-50 dark:bg-success-900/30">
                <CheckCircle className="h-10 w-10 text-success-500" />
              </div>
            ) : (
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-danger-50 dark:bg-danger-900/30">
                <XCircle className="h-10 w-10 text-danger-500" />
              </div>
            )}
            <h2 className={`mt-4 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {passed ? t('quiz.passed') : t('quiz.failed')}
            </h2>
            <p className={`mt-2 text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('quiz.score')}: {score}/{questions.length} ({percentage}%)
            </p>
            <div className={`mx-auto mt-6 h-2 w-full max-w-xs rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div className={`h-full rounded-full transition-all duration-1000 ${passed ? 'bg-success-500' : 'bg-danger-500'}`} style={{ width: `${percentage}%` }} />
            </div>

            <div className="mt-8 space-y-4">
              {questions.map((q, idx) => {
                const isCorrect = Number(answers[idx]) === q.correctAnswer;
                return (
                  <div key={idx} className={`rounded-xl border p-4 text-left ${isCorrect ? 'border-success-200 bg-success-50/50 dark:border-success-900/30 dark:bg-success-900/10' : 'border-danger-200 bg-danger-50/50 dark:border-danger-900/30 dark:bg-danger-900/10'}`}>
                    <div className="flex items-start gap-3">
                      {isCorrect ? <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-success-500" /> : <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-danger-500" />}
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{q.text}</p>
                        <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {t('quiz.restart')}: {answers[idx] || '—'} | {t('quiz.restart')}: {q.correctAnswer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button onClick={() => navigate('course-detail', courseId || undefined)}
                className={`rounded-xl border px-6 py-2.5 text-sm font-medium ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {t('common.back')}
              </button>
              <button onClick={() => { setSubmitted(false); setCurrentQuestion(0); setAnswers({}); setTimeLeft(quiz.timeLimit ? quiz.timeLimit * 60 : 0); }}
                className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
                <RefreshCw className="h-4 w-4" /> {t('quiz.retake')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-3xl">
        <div className={`mb-4 flex items-center justify-between rounded-2xl border px-6 py-4 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <div>
            <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{quiz.title}</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{quiz.description}</p>
          </div>
          {quiz.timeLimit && (
            <div className={`flex items-center gap-2 rounded-xl px-4 py-2 ${timeLeft < 60 ? 'bg-danger-50 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              <Clock className="h-4 w-4" />
              <span className="text-sm font-semibold">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        <div className={`mb-4 h-2 w-full overflow-hidden rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
          <div className="h-full rounded-full bg-primary-500 transition-all duration-300" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
        </div>
        <p className={`mb-6 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('quiz.question')} {currentQuestion + 1}/{questions.length}</p>

        <div className={`rounded-2xl border p-6 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentQ?.text}</h2>
          <div className="mt-6 space-y-3">
            {(currentQ?.options || []).map((option, idx) => (
              <button key={idx} onClick={() => setAnswers(a => ({ ...a, [currentQuestion]: option }))}
                className={`flex w-full items-center rounded-xl border px-4 py-3.5 text-left text-sm transition-all ${answers[currentQuestion] === option ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : isDark ? 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700' : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}>
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${answers[currentQuestion] === option ? 'bg-primary-500 text-white' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="ml-3">{option}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`mt-6 flex items-center justify-between rounded-2xl border px-6 py-4 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <button onClick={() => setCurrentQuestion(p => Math.max(0, p - 1))} disabled={currentQuestion === 0}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${currentQuestion === 0 ? 'text-slate-400 cursor-not-allowed' : isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>
            <ArrowLeft className="h-4 w-4" /> {t('quiz.previous')}
          </button>
          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {answers[currentQuestion] ? t('quiz.answered') : t('quiz.notAnswered')}
          </span>
          {isLast ? (
            <button onClick={() => setSubmitted(true)}
              className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700">
              <Award className="h-4 w-4" /> {t('quiz.submit')}
            </button>
          ) : (
            <button onClick={() => setCurrentQuestion(p => Math.min(questions.length - 1, p + 1))}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>
              {t('quiz.next')} <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
