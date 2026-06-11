import { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  RotateCcw,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import { quizzes } from '../../data/mockData';
import { Page } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface QuizPageProps {
  onNavigate: (page: Page) => void;
}

type QuizState = 'intro' | 'playing' | 'result';

export default function QuizPage({ onNavigate }: QuizPageProps) {
  const { t, theme } = useApp();
  const isDark = theme === 'dark';

  const quiz = quizzes[0];
  const [state, setState] = useState<QuizState>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (answerIdx: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQ] = answerIdx;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setState('result');
    }
  };

  const correctCount = selectedAnswers.filter(
    (a, i) => a === quiz.questions[i].correctAnswer
  ).length;
  const score = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = score >= quiz.passingScore;

  const restart = () => {
    setState('intro');
    setCurrentQ(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    setShowExplanation(false);
  };

  if (state === 'intro') {
    return (
      <div className={`flex min-h-[80vh] items-center justify-center p-4 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className={`w-full max-w-lg rounded-2xl border p-8 text-center shadow-lg ${
          isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
        }`}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className={`mt-4 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{quiz.title}</h1>
          <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{quiz.description}</p>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className={`rounded-xl p-3 ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{quiz.questions.length}</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('quiz.questions')}</p>
            </div>
            <div className={`rounded-xl p-3 ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{quiz.timeLimit}min</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('quiz.duration')}</p>
            </div>
            <div className={`rounded-xl p-3 ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{quiz.passingScore}%</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('quiz.minScore')}</p>
            </div>
          </div>

          <button
            onClick={() => setState('playing')}
            className="mt-6 w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:bg-primary-700"
          >
            {t('quiz.startQuiz')}
          </button>
          <button
            onClick={() => onNavigate('my-courses')}
            className={`mt-3 flex w-full items-center justify-center gap-2 text-sm ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ArrowLeft className="h-4 w-4" /> {t('common.back')}
          </button>
        </div>
      </div>
    );
  }

  if (state === 'result') {
    return (
      <div className={`flex min-h-[80vh] items-center justify-center p-4 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className={`w-full max-w-lg rounded-2xl border p-8 text-center shadow-lg ${
          isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
        }`}>
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
              passed
                ? 'bg-gradient-to-br from-success-500 to-emerald-400'
                : 'bg-gradient-to-br from-danger-500 to-red-400'
            } text-white`}
          >
            {passed ? <Trophy className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
          </div>

          <h1 className={`mt-4 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {passed ? t('quiz.congratulations') : t('quiz.notYet')}
          </h1>
          <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {passed
              ? t('quiz.passedMessage')
              : t('quiz.failedMessage', { score: quiz.passingScore })}
          </p>

          {/* Score Circle */}
          <div className={`mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full border-8 ${
            isDark ? 'border-slate-700' : 'border-slate-100'
          }`}>
            <div className="text-center">
              <p className={`text-3xl font-bold ${passed ? 'text-success-600' : 'text-danger-600'}`}>
                {score}%
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {correctCount}/{quiz.questions.length}
              </p>
            </div>
          </div>

          {/* Question Review */}
          <div className="mt-6 space-y-2">
            {quiz.questions.map((q, i) => {
              const isCorrect = selectedAnswers[i] === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`flex items-center gap-3 rounded-xl p-3 text-left ${
                    isCorrect 
                      ? isDark ? 'bg-success-900/30' : 'bg-success-50' 
                      : isDark ? 'bg-danger-900/30' : 'bg-danger-50'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-500" />
                  ) : (
                    <XCircle className="h-5 w-5 flex-shrink-0 text-danger-500" />
                  )}
                  <p className={`flex-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{q.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={restart}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium ${
                isDark
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <RotateCcw className="h-4 w-4" /> {t('quiz.restart')}
            </button>
            <button
              onClick={() => onNavigate('my-courses')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-medium text-white hover:bg-primary-700"
            >
              {t('myCourses.continue')} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing state
  const question = quiz.questions[currentQ];
  const selectedAnswer = selectedAnswers[currentQ];

  return (
    <div className={`flex min-h-[80vh] flex-col p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Quiz Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setState('intro')}
          className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <ArrowLeft className="h-4 w-4" /> {t('quiz.quit')}
        </button>
        <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <Clock className="h-4 w-4" />
          <span>{quiz.timeLimit}:00</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className={`flex items-center justify-between text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>
            {t('quiz.question')} {currentQ + 1} {t('quiz.of')} {quiz.questions.length}
          </span>
          <span className="font-medium text-primary-600 dark:text-primary-400">
            {Math.round(((currentQ + 1) / quiz.questions.length) * 100)}%
          </span>
        </div>
        <div className={`mt-2 h-2 overflow-hidden rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
            style={{ width: `${((currentQ + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mx-auto w-full max-w-2xl flex-1">
        <div className={`rounded-2xl border p-6 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{question.text}</h2>

          <div className="mt-6 space-y-3">
            {question.options.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = i === question.correctAnswer;
              const showResult = showExplanation;

              return (
                <button
                  key={i}
                  onClick={() => !showExplanation && handleAnswer(i)}
                  disabled={showExplanation}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left text-sm transition-all ${
                    showResult
                      ? isCorrect
                        ? isDark ? 'border-success-500 bg-success-900/30' : 'border-success-500 bg-success-50'
                        : isSelected
                        ? isDark ? 'border-danger-500 bg-danger-900/30' : 'border-danger-500 bg-danger-50'
                        : isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
                      : isSelected
                      ? isDark ? 'border-primary-500 bg-primary-900/30' : 'border-primary-500 bg-primary-50'
                      : isDark
                      ? 'border-slate-700 bg-slate-800 hover:border-slate-600 hover:bg-slate-700'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      showResult
                        ? isCorrect
                          ? 'bg-success-500 text-white'
                          : isSelected
                          ? 'bg-danger-500 text-white'
                          : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                        : isSelected
                        ? 'bg-primary-500 text-white'
                        : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className={`flex-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{option}</span>
                  {showResult && isCorrect && <CheckCircle2 className="h-5 w-5 text-success-500" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-danger-500" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`mt-4 rounded-xl p-4 ${isDark ? 'bg-primary-900/30' : 'bg-primary-50'}`}>
              <div className="flex items-start gap-2">
                <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500" />
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-primary-400' : 'text-primary-900'}`}>
                    {t('quiz.explanation')}
                  </p>
                  <p className={`mt-1 text-sm ${isDark ? 'text-primary-300' : 'text-primary-700'}`}>
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {showExplanation && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:bg-primary-700"
            >
              {currentQ < quiz.questions.length - 1 ? (
                <>
                  {t('quiz.nextQuestion')} <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  {t('quiz.seeResults')} <Trophy className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Question dots */}
      <div className="mt-6 flex justify-center gap-2">
        {quiz.questions.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all ${
              i === currentQ
                ? 'w-6 bg-primary-500'
                : selectedAnswers[i] !== null
                ? selectedAnswers[i] === quiz.questions[i].correctAnswer
                  ? 'bg-success-500'
                  : 'bg-danger-500'
                : isDark ? 'bg-slate-700' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
