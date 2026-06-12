import { createClient } from '@supabase/supabase-js';
import type { Course, Certificate, CalendarEvent, Notification, ForumPost } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ─── Helpers ───────────────────────────────────────────

function mapLevel(dbLevel: string): Course['level'] {
  const map: Record<string, Course['level']> = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
  };
  return map[dbLevel] || 'Intermédiaire';
}

function mapDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

// ─── Auth ──────────────────────────────────────────────

export const authService = {
  async signUp(email: string, password: string, fullName: string) {
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };
    return supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
  },
  async signIn(email: string, password: string) {
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };
    return supabase.auth.signInWithPassword({ email, password });
  },
  async signOut() {
    if (!supabase) return { error: null };
    return supabase.auth.signOut();
  },
  async getSession() {
    if (!supabase) return { data: { session: null }, error: null };
    return supabase.auth.getSession();
  },
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange(callback);
  },
};

// ─── Profiles / Users ──────────────────────────────────

export const userService = {
  async getProfile(userId: string) {
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };
    return supabase.from('profiles').select('*').eq('id', userId).single();
  },

  async updateProfile(userId: string, updates: Partial<any>) {
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };
    return supabase.from('profiles').update(updates).eq('id', userId).select().single();
  },

  async getLeaderboard(limit = 50) {
    if (!supabase) return { data: [], error: null };
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, total_points, streak, courses_completed')
      .order('total_points', { ascending: false })
      .limit(limit);
    return { data: data || [], error };
  },
};

export const leaderboardService = {
  getLeaderboard: async (limit = 50) => {
    if (!supabase) return { data: [], error: null };
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, total_points, streak, courses_completed')
      .order('total_points', { ascending: false })
      .limit(limit);
    const mapped = (data || []).map(p => ({
      id: p.id,
      name: p.full_name || 'Anonyme',
      points: p.total_points || 0,
      streak: p.streak || 0,
      coursesCompleted: p.courses_completed || 0,
      title: '',
      change: 0,
    }));
    return { data: mapped, error };
  },
};

// ─── Courses ───────────────────────────────────────────

async function getAllCoursesFn(userId?: string) {
  if (!supabase) return { data: [], error: new Error('Supabase non configuré') };
  const { data, error } = await supabase
    .from('courses')
    .select('*, modules(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  return { data: (data || []).map(c => toCourse(c, userId)), error };
}

function getCatEmoji(_name: string): string {
  return '';
}

export const courseService = {
  getCourses: getAllCoursesFn,
  getAllCourses: getAllCoursesFn,

  async getCourseById(courseId: string, userId?: string) {
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };
    const { data, error } = await supabase
      .from('courses')
      .select('*, modules(*, lessons(*))')
      .eq('id', courseId)
      .single();
    return { data: data ? toCourse(data, userId) : null, error };
  },

  async enroll(userId: string, courseId: string) {
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };
    return supabase.from('enrollments').insert({ user_id: userId, course_id: courseId }).select().single();
  },

  async getUserEnrollments(userId: string) {
    if (!supabase) return { data: [], error: new Error('Supabase non configuré') };
    return supabase
      .from('enrollments')
      .select('*, course:courses(*)')
      .eq('user_id', userId);
  },

  getEnrolledCourses: async (userId: string) => {
    if (!supabase) return { data: [], error: new Error('Supabase non configuré') };
    return supabase.from('enrollments').select('*, course:courses(*)').eq('user_id', userId);
  },

  async updateProgress(enrollmentId: string, progress: number) {
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };
    return supabase
      .from('enrollments')
      .update({ progress, last_accessed_at: new Date().toISOString() })
      .eq('id', enrollmentId)
      .select()
      .single();
  },

  async getCategories() {
    if (!supabase) return { data: [], error: null };
    const { data, error } = await supabase.from('courses').select('category');
    const cats = [...new Set((data || []).map(c => c.category))].sort();
    return { data: cats.map((name, i) => ({ id: `cat-${i}`, name, icon: getCatEmoji(name), count: 0 })), error };
  },
};

// ─── Lessons ───────────────────────────────────────────

export const lessonService = {
  async markComplete(userId: string, lessonId: string) {
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };
    return supabase
      .from('lesson_progress')
      .upsert({ user_id: userId, lesson_id: lessonId, is_completed: true, completed_at: new Date().toISOString() })
      .select()
      .single();
  },

  async saveNotes(userId: string, lessonId: string, notes: string) {
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };
    return supabase.from('lesson_progress').upsert({ user_id: userId, lesson_id: lessonId, notes }).select().single();
  },

  async getProgress(userId: string, courseId: string) {
    if (!supabase) return { data: [], error: null };
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*, lesson:lessons!inner(module:modules!inner(course_id))')
      .eq('user_id', userId)
      .eq('lesson.module.course_id', courseId);
    return { data: data || [], error };
  },
};

// ─── Quizzes ───────────────────────────────────────────

export const quizService = {
  async getQuizByCourse(courseId: string) {
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };
    return supabase.from('quizzes').select('*, questions(*)').eq('course_id', courseId).single();
  },

  async submitAttempt(userId: string, quizId: string, answers: Record<string, number>, score: number) {
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };
    return supabase
      .from('quiz_attempts')
      .insert({ user_id: userId, quiz_id: quizId, answers, score, completed_at: new Date().toISOString() })
      .select()
      .single();
  },

  async getAttempts(userId: string, quizId: string) {
    if (!supabase) return { data: [], error: null };
    return supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('quiz_id', quizId)
      .order('completed_at', { ascending: false });
  },
};

// ─── Certificates ──────────────────────────────────────

export const certificateService = {
  async getUserCertificates(userId: string) {
    if (!supabase) return { data: [], error: new Error('Supabase non configuré') };
    const { data, error } = await supabase
      .from('certificates')
      .select('*, course:courses(title, instructor_id)')
      .eq('user_id', userId)
      .order('issued_at', { ascending: false });
    return { data: (data || []).map(toCertificate), error };
  },

  async issue(userId: string, courseId: string, grade: string) {
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };
    return supabase.from('certificates').insert({ user_id: userId, course_id: courseId, grade }).select().single();
  },
};

// ─── Forum ─────────────────────────────────────────────

async function getForumPostsFn(courseId?: string) {
  if (!supabase) return { data: [], error: new Error('Supabase non configuré') };
  let query = supabase
    .from('forum_posts')
    .select('*, author:profiles(full_name, avatar_url)')
    .order('created_at', { ascending: false });
  if (courseId) query = query.eq('course_id', courseId);
  const { data, error } = await query;
  return { data: (data || []).map(toForumPost), error };
}

export const forumService = {
  getPosts: getForumPostsFn,
  getForumPosts: getForumPostsFn,
  createPost: async (userId: string, courseId: string, title: string, content: string) => {
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };
    return supabase.from('forum_posts').insert({ author_id: userId, course_id: courseId, title, content }).select().single();
  },
};

// ─── Calendar ──────────────────────────────────────────

export const calendarService = {
  async getUserEvents(userId: string, year?: number, month?: number) {
    if (!supabase) return { data: [], error: new Error('Supabase non configuré') };
    let query = supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId)
      .order('event_date', { ascending: true });
    if (year && month !== undefined) {
      const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const end = `${year}-${String(month + 1).padStart(2, '0')}-31`;
      query = query.gte('event_date', start).lte('event_date', end);
    }
    const { data, error } = await query;
    return { data: (data || []).map(toCalendarEvent), error };
  },

  async createEvent(userId: string, title: string, eventDate: string, eventType: string, courseId?: string) {
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };
    return supabase.from('calendar_events').insert({ user_id: userId, title, event_date: eventDate, event_type: eventType, course_id: courseId }).select().single();
  },
};

// ─── Notifications ─────────────────────────────────────

export const notificationService = {
  async getUserNotifications(userId: string) {
    if (!supabase) return { data: [], error: new Error('Supabase non configuré') };
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    return { data: (data || []).map(toNotification), error };
  },

  async markAsRead(notificationId: string) {
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };
    return supabase.from('notifications').update({ is_read: true }).eq('id', notificationId).select().single();
  },
};

export const adminService = {
  async getAllCourses() {
    if (!supabase) return { data: [], error: new Error('Supabase non configure') };
    const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    return { data: data || [], error };
  },

  async upsertCourse(course: any) {
    if (!supabase) return { data: null, error: new Error('Supabase non configure') };
    const { data, error } = await supabase.from('courses').upsert(course).select().single();
    return { data, error };
  },

  async deleteCourse(id: string) {
    if (!supabase) return { error: new Error('Supabase non configure') };
    return supabase.from('courses').delete().eq('id', id);
  },

  async getAllUsers() {
    if (!supabase) return { data: [], error: new Error('Supabase non configure') };
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    return { data: data || [], error };
  },

  async updateUserRole(userId: string, role: string) {
    if (!supabase) return { data: null, error: new Error('Supabase non configure') };
    return supabase.from('profiles').update({ role }).eq('id', userId).select().single();
  },

  async getStats() {
    if (!supabase) return { data: null, error: new Error('Supabase non configure') };
    const [coursesRes, usersRes, enrollmentsRes] = await Promise.all([
      supabase.from('courses').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('enrollments').select('id', { count: 'exact', head: true }),
    ]);
    return {
      data: {
        totalCourses: coursesRes.count || 0,
        totalUsers: usersRes.count || 0,
        totalEnrollments: enrollmentsRes.count || 0,
      },
      error: null,
    };
  },
};

// ─── Transform helpers ─────────────────────────────────

function toCourse(dbCourse: any, _userId?: string): Course {
  const modules = (dbCourse.modules || []).map((m: any) => ({
    id: m.id,
    title: m.title,
    duration: mapDuration(m.duration_minutes || 0),
    lessons: (m.lessons || []).map((l: any) => ({
      id: l.id,
      title: l.title,
      type: l.type,
      duration: mapDuration(l.duration_minutes || 0),
      isCompleted: false,
      isLocked: l.order_index > 1,
      content: l.content || undefined,
    })),
  }));

  return {
    id: dbCourse.id,
    title: dbCourse.title,
    description: dbCourse.description || '',
    shortDescription: dbCourse.short_description || '',
    instructor: dbCourse.instructor_name || '',
    instructorAvatar: '',
    thumbnail: dbCourse.thumbnail_url || '',
    category: dbCourse.category || '',
    level: mapLevel(dbCourse.level),
    duration: mapDuration(dbCourse.duration_minutes || 0),
    totalLessons: dbCourse.total_lessons || 0,
    rating: dbCourse.rating || 0,
    studentsCount: dbCourse.students_count || 0,
    price: dbCourse.price || 0,
    isFree: dbCourse.is_free || dbCourse.price === 0,
    tags: dbCourse.tags || [],
    modules,
    isEnrolled: false,
    progress: 0,
    lastAccessed: undefined,
  };
}

function toCertificate(dbCert: any): Certificate {
  return {
    id: dbCert.id,
    courseId: dbCert.course_id,
    courseTitle: dbCert.course?.title || '',
    earnedDate: dbCert.issued_at?.split('T')[0] || '',
    grade: dbCert.grade || '',
    instructorName: '',
  };
}

function toForumPost(dbPost: any): ForumPost {
  return {
    id: dbPost.id,
    courseId: dbPost.course_id,
    author: dbPost.author?.full_name || 'Anonyme',
    authorAvatar: '',
    title: dbPost.title,
    content: dbPost.content,
    date: dbPost.created_at?.split('T')[0] || '',
    replies: 0,
    likes: 0,
  };
}

function toCalendarEvent(dbEvent: any): CalendarEvent {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    date: dbEvent.event_date || '',
    type: dbEvent.event_type || 'reminder',
    courseId: dbEvent.course_id,
    courseName: dbEvent.course_name,
    time: dbEvent.event_time,
  };
}

function toNotification(dbNotif: any): Notification {
  return {
    id: dbNotif.id,
    title: dbNotif.title,
    message: dbNotif.message,
    time: dbNotif.created_at || '',
    isRead: dbNotif.is_read || false,
    type: dbNotif.type || 'info',
  };
}
