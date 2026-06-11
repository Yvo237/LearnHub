import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
// Pour activer Supabase, ajoutez dans un fichier .env a la racine:
//   VITE_SUPABASE_URL=https://votre-projet.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJ... (votre cle anon)
// L'application fonctionne en mode demo sans ces variables.
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Mode demo si pas de cle valide
export const isDemoMode: boolean = !supabaseAnonKey || supabaseAnonKey.length < 10;

// Creer le client Supabase seulement si on a une cle valide
export const supabase = supabaseAnonKey.length > 10
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Types pour la base de donnees
export interface DbUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: 'student' | 'instructor' | 'admin';
  bio: string | null;
  created_at: string;
  updated_at: string;
  streak: number;
  total_points: number;
  preferred_language: 'fr' | 'en';
  theme: 'light' | 'dark';
}

export interface DbCourse {
  id: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  short_description: string;
  short_description_en: string;
  instructor_id: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  total_lessons: number;
  rating: number;
  students_count: number;
  price: number;
  is_free: boolean;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  is_published: boolean;
}

export interface DbEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  enrolled_at: string;
  last_accessed_at: string;
  completed_at: string | null;
}

export interface DbLesson {
  id: string;
  module_id: string;
  title: string;
  title_en: string;
  type: 'video' | 'article' | 'quiz' | 'exercise';
  duration_minutes: number;
  content: string | null;
  content_en: string | null;
  video_url: string | null;
  order_index: number;
  created_at: string;
}

export interface DbLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  completed_at: string | null;
  notes: string | null;
}

export interface DbQuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  answers: Record<string, number>;
  started_at: string;
  completed_at: string | null;
}

export interface DbCertificate {
  id: string;
  user_id: string;
  course_id: string;
  grade: string;
  issued_at: string;
  certificate_url: string | null;
}

// Fonctions d'authentification
export const authService = {
  async signUp(email: string, password: string, fullName: string) {
    if (!supabase) {
      return { data: null, error: { message: 'Mode demo - Supabase non configure' } };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    if (!supabase) {
      return { data: null, error: { message: 'Mode demo - Supabase non configure' } };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    if (!supabase) {
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getSession() {
    if (!supabase) {
      return { data: { session: null }, error: null };
    }
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  async getUser() {
    if (!supabase) {
      return { data: { user: null }, error: null };
    }
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!supabase) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Fonctions pour les cours
export const courseService = {
  async getAllCourses() {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getCourseById(courseId: string) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        modules (
          *,
          lessons (*)
        )
      `)
      .eq('id', courseId)
      .single();
    return { data, error };
  },

  async enrollInCourse(userId: string, courseId: string) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('enrollments')
      .insert({ user_id: userId, course_id: courseId })
      .select()
      .single();
    return { data, error };
  },

  async getUserEnrollments(userId: string) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses(*)
      `)
      .eq('user_id', userId);
    return { data, error };
  },

  async updateProgress(enrollmentId: string, progress: number) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('enrollments')
      .update({ progress, last_accessed_at: new Date().toISOString() })
      .eq('id', enrollmentId)
      .select()
      .single();
    return { data, error };
  },
};

// Fonctions pour les lecons
export const lessonService = {
  async markLessonComplete(userId: string, lessonId: string) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();
    return { data, error };
  },

  async saveNotes(userId: string, lessonId: string, notes: string) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        notes,
      })
      .select()
      .single();
    return { data, error };
  },

  async getUserLessonProgress(userId: string, courseId: string) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('lesson_progress')
      .select(`
        *,
        lesson:lessons(*, module:modules(course_id))
      `)
      .eq('user_id', userId);
    
    const filtered = data?.filter(
      (p: any) => p.lesson?.module?.course_id === courseId
    );
    return { data: filtered, error };
  },
};

// Fonctions pour les quiz
export const quizService = {
  async submitQuizAttempt(
    userId: string,
    quizId: string,
    answers: Record<string, number>,
    score: number
  ) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        quiz_id: quizId,
        answers,
        score,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();
    return { data, error };
  },

  async getUserQuizAttempts(userId: string, quizId: string) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('quiz_id', quizId)
      .order('completed_at', { ascending: false });
    return { data, error };
  },
};

// Fonctions pour les certificats
export const certificateService = {
  async getUserCertificates(userId: string) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        course:courses(title, title_en, instructor_id)
      `)
      .eq('user_id', userId);
    return { data, error };
  },

  async issueCertificate(userId: string, courseId: string, grade: string) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('certificates')
      .insert({
        user_id: userId,
        course_id: courseId,
        grade,
      })
      .select()
      .single();
    return { data, error };
  },
};

// Fonctions pour le profil utilisateur
export const userService = {
  async getProfile(userId: string) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async updateProfile(userId: string, updates: Partial<DbUser>) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  async updatePreferences(userId: string, theme: 'light' | 'dark', language: 'fr' | 'en') {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('profiles')
      .update({ theme, preferred_language: language })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },
};

// Fonctions pour le forum
export const forumService = {
  async getPosts(courseId?: string) {
    if (!supabase) return { data: null, error: null };
    let query = supabase
      .from('forum_posts')
      .select(`
        *,
        author:profiles(full_name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async createPost(userId: string, courseId: string, title: string, content: string) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        author_id: userId,
        course_id: courseId,
        title,
        content,
      })
      .select()
      .single();
    return { data, error };
  },

  async likePost(userId: string, postId: string) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('forum_likes')
      .insert({ user_id: userId, post_id: postId })
      .select()
      .single();
    return { data, error };
  },
};

// Fonctions pour le classement
export const leaderboardService = {
  async getLeaderboard(limit = 10) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, total_points, streak')
      .order('total_points', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  async getUserRank(userId: string) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .rpc('get_user_rank', { user_id: userId });
    return { data, error };
  },
};

// Fonctions pour le calendrier
export const calendarService = {
  async getUserEvents(userId: string) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId)
      .order('event_date', { ascending: true });
    return { data, error };
  },

  async createEvent(
    userId: string,
    title: string,
    eventDate: string,
    eventType: string,
    courseId?: string
  ) {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('calendar_events')
      .insert({
        user_id: userId,
        title,
        event_date: eventDate,
        event_type: eventType,
        course_id: courseId,
      })
      .select()
      .single();
    return { data, error };
  },
};
