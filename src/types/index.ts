export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'instructor' | 'admin';
  bio: string;
  joinedDate: string;
  coursesCompleted: number;
  totalPoints: number;
  streak: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  instructor: string;
  instructorAvatar: string;
  thumbnail: string;
  category: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration: string;
  totalLessons: number;
  rating: number;
  studentsCount: number;
  price: number;
  isFree: boolean;
  tags: string[];
  modules: Module[];
  isEnrolled?: boolean;
  progress?: number;
  lastAccessed?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  duration: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'exercise';
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  content?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number;
  passingScore: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  earnedDate: string;
  grade: string;
  instructorName: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'deadline' | 'live' | 'exam' | 'reminder';
  courseId?: string;
  courseName?: string;
  time?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'course';
}

export interface ForumPost {
  id: string;
  courseId: string;
  author: string;
  authorAvatar: string;
  title: string;
  content: string;
  date: string;
  replies: number;
  likes: number;
}

export type Page = 
  | 'dashboard' 
  | 'catalog' 
  | 'my-courses' 
  | 'course-detail' 
  | 'lesson' 
  | 'quiz' 
  | 'certificates' 
  | 'calendar' 
  | 'profile' 
  | 'settings'
  | 'forum'
  | 'leaderboard';
