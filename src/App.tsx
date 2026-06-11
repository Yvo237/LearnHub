import { useAppStore } from './store/useStore';
import { useApp } from './contexts/AppContext';
import AuthPage from './components/auth/AuthPage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/pages/Dashboard';
import Catalog from './components/pages/Catalog';
import MyCourses from './components/pages/MyCourses';
import CourseDetail from './components/pages/CourseDetail';
import LessonView from './components/pages/LessonView';
import QuizPage from './components/pages/QuizPage';
import Certificates from './components/pages/Certificates';
import CalendarPage from './components/pages/CalendarPage';
import Forum from './components/pages/Forum';
import Leaderboard from './components/pages/Leaderboard';
import Profile from './components/pages/Profile';
import Settings from './components/pages/Settings';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { theme, user, isLoading } = useApp();
  const isDark = theme === 'dark';

  const {
    currentPage,
    selectedCourseId,
    selectedLessonId,
    sidebarOpen,
    searchQuery,
    navigate,
    toggleSidebar,
    setSearchQuery,
  } = useAppStore();

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className={`h-10 w-10 animate-spin ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Chargement...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show auth page
  if (!user) {
    return <AuthPage />;
  }

  // Authenticated - show main app
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={navigate} />;
      case 'catalog':
        return <Catalog onNavigate={navigate} searchQuery={searchQuery} />;
      case 'my-courses':
        return <MyCourses onNavigate={navigate} />;
      case 'course-detail':
        return <CourseDetail courseId={selectedCourseId} onNavigate={navigate} />;
      case 'lesson':
        return <LessonView courseId={selectedCourseId} lessonId={selectedLessonId} onNavigate={navigate} />;
      case 'quiz':
        return <QuizPage onNavigate={navigate} />;
      case 'certificates':
        return <Certificates />;
      case 'calendar':
        return <CalendarPage />;
      case 'forum':
        return <Forum />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'profile':
        return <Profile onNavigate={navigate} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <div className={`flex h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <Sidebar
        currentPage={currentPage}
        isOpen={sidebarOpen}
        onNavigate={navigate}
        onToggle={toggleSidebar}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onToggleSidebar={toggleSidebar}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavigate={navigate}
        />
        <main className={`flex-1 overflow-y-auto ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
