import { useState, useCallback } from 'react';
import { Page } from '../types';

interface AppState {
  currentPage: Page;
  selectedCourseId: string | null;
  selectedLessonId: string | null;
  selectedQuizId: string | null;
  sidebarOpen: boolean;
  searchQuery: string;
}

const initialState: AppState = {
  currentPage: 'dashboard',
  selectedCourseId: null,
  selectedLessonId: null,
  selectedQuizId: null,
  sidebarOpen: true,
  searchQuery: '',
};

export function useAppStore() {
  const [state, setState] = useState<AppState>(initialState);

  const navigate = useCallback((page: Page, courseId?: string, lessonId?: string) => {
    setState(prev => ({
      ...prev,
      currentPage: page,
      selectedCourseId: courseId ?? prev.selectedCourseId,
      selectedLessonId: lessonId ?? null,
    }));
  }, []);

  const setSelectedCourse = useCallback((courseId: string) => {
    setState(prev => ({ ...prev, selectedCourseId: courseId }));
  }, []);

  const setSelectedQuiz = useCallback((quizId: string) => {
    setState(prev => ({ ...prev, selectedQuizId: quizId }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  return {
    ...state,
    navigate,
    setSelectedCourse,
    setSelectedQuiz,
    toggleSidebar,
    setSearchQuery,
  };
}
