-- ============================================================
-- LearnHub - Migration SQL complète pour Supabase
-- Exécute tout ce script dans l'éditeur SQL de Supabase Dashboard
-- (SQL Editor > New Query > Coller > Run)
-- ============================================================

-- 0. Extension UUID (disponible par défaut sur Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  total_points INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  courses_completed INTEGER DEFAULT 0,
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger : créer un profil automatiquement à l'inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    ''
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 2. COURSES
-- ============================================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  short_description TEXT DEFAULT '',
  instructor_name TEXT DEFAULT '',
  instructor_id UUID REFERENCES profiles(id),
  thumbnail_url TEXT DEFAULT '',
  category TEXT DEFAULT '',
  level TEXT DEFAULT 'intermediate' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  price NUMERIC(10,2) DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published courses are visible to all"
  ON courses FOR SELECT
  USING (is_published = true);

CREATE POLICY "Instructors can manage own courses"
  ON courses FOR ALL
  USING (instructor_id = auth.uid());

-- ============================================================
-- 3. MODULES
-- ============================================================
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules readable by all"
  ON modules FOR SELECT
  USING (true);

-- ============================================================
-- 4. LESSONS
-- ============================================================
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'article', 'quiz', 'exercise')),
  duration_minutes INTEGER DEFAULT 0,
  content TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons readable by all"
  ON lessons FOR SELECT
  USING (true);

-- ============================================================
-- 5. ENROLLMENTS
-- ============================================================
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll"
  ON enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON enrollments FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- 6. LESSON_PROGRESS
-- ============================================================
CREATE TABLE lesson_progress (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  notes TEXT DEFAULT '',
  PRIMARY KEY (user_id, lesson_id)
);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- 7. QUIZZES
-- ============================================================
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  time_limit INTEGER DEFAULT 0,
  passing_score INTEGER DEFAULT 70
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quizzes readable by all"
  ON quizzes FOR SELECT
  USING (true);

-- ============================================================
-- 8. QUESTIONS
-- ============================================================
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer INTEGER NOT NULL,
  explanation TEXT DEFAULT ''
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions readable by all"
  ON questions FOR SELECT
  USING (true);

-- ============================================================
-- 9. QUIZ_ATTEMPTS
-- ============================================================
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  score INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attempts"
  ON quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can submit attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 10. CERTIFICATES
-- ============================================================
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  grade TEXT DEFAULT '',
  issued_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates"
  ON certificates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can earn certificates"
  ON certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 11. FORUM_POSTS
-- ============================================================
CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Forum posts are publicly readable"
  ON forum_posts FOR SELECT
  USING (true);

CREATE POLICY "Users can create posts"
  ON forum_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- ============================================================
-- 12. CALENDAR_EVENTS
-- ============================================================
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'reminder' CHECK (event_type IN ('deadline', 'live', 'exam', 'reminder')),
  event_time TEXT DEFAULT '',
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  course_name TEXT DEFAULT ''
);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events"
  ON calendar_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create events"
  ON calendar_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 13. NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'course')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark as read"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_quizzes_course ON quizzes(course_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_forum_posts_course ON forum_posts(course_id);
CREATE INDEX idx_calendar_events_user ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_date ON calendar_events(event_date);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- ============================================================
-- DONNÉES DE DÉMO
-- ============================================================

-- Créer un instructeur de démo (utiliser un vrai UUID après inscription)
-- Remplacer 'INSTRUCTEUR_UUID' par l'UUID de l'utilisateur qui sera l'instructeur
/*
INSERT INTO courses (title, description, short_description, instructor_name, category, level, duration_minutes, total_lessons, rating, students_count, price, is_free, tags, is_published) VALUES
('Introduction au Développement Web', 'Apprenez les bases du développement web : HTML, CSS et JavaScript. Ce cours vous guidera pas à pas pour créer votre premier site web interactif.', 'Un cours complet pour débuter dans le développement web.', 'Jean Dupont', 'Développement Web', 'beginner', 480, 24, 4.8, 12500, 0, true, ARRAY['HTML', 'CSS', 'JavaScript', 'Débutant'], true),
('React pour les Nuls', 'Maîtrisez React de zéro. Composants, hooks, état global, routing et déploiement.', 'Devenez développeur React en partant de zéro.', 'Marie Martin', 'Développement Web', 'intermediate', 720, 36, 4.9, 8900, 49000, false, ARRAY['React', 'Hooks', 'TypeScript', 'Frontend'], true),
('Data Science avec Python', 'Analyse de données, visualisation et machine learning avec Python, Pandas et Scikit-learn.', 'Le guide complet de la data science avec Python.', 'Pierre Durand', 'Data Science', 'advanced', 960, 48, 4.7, 6200, 69000, false, ARRAY['Python', 'Pandas', 'ML', 'Data'], true);

-- Ajouter des modules pour chaque cours
INSERT INTO modules (course_id, title, duration_minutes, order_index)
SELECT id, 'Les Fondamentaux', 120, 1 FROM courses WHERE title = 'Introduction au Développement Web';

INSERT INTO modules (course_id, title, duration_minutes, order_index)
SELECT id, 'Mise en Pratique', 180, 2 FROM courses WHERE title = 'Introduction au Développement Web';

INSERT INTO modules (course_id, title, duration_minutes, order_index)
SELECT id, 'Projet Final', 180, 3 FROM courses WHERE title = 'Introduction au Développement Web';

-- Ajouter des leçons
INSERT INTO lessons (module_id, title, type, duration_minutes, content, order_index)
SELECT m.id, 'Introduction à HTML', 'video', 15, '<p>Dans cette leçon, nous découvrons les bases du HTML.</p>', 1
FROM modules m JOIN courses c ON c.id = m.course_id
WHERE c.title = 'Introduction au Développement Web' AND m.title = 'Les Fondamentaux';
*/

-- ============================================================
-- ADMIN RLS : fonction utilitaire + politiques
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- Donner accès admin à toutes les tables
CREATE POLICY "Admins can read all courses"
  ON courses FOR SELECT
  USING (is_admin() OR is_published = true);

CREATE POLICY "Admins can insert courses"
  ON courses FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update courses"
  ON courses FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete courses"
  ON courses FOR DELETE
  USING (is_admin());

CREATE POLICY "Admins can read all enrollments"
  ON enrollments FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can read all users"
  ON profiles FOR SELECT
  USING (is_admin() OR auth.uid() = id);

-- Pour definir un admin : UPDATE profiles SET role = 'admin' WHERE id = 'UUID_UTILISATEUR';
