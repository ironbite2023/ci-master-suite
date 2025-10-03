-- =====================================================
-- CI MASTER ACADEMY - COMPLETE DATABASE SCHEMA
-- =====================================================
-- Version: 1.0
-- Date: October 2, 2025
-- Purpose: Learning Management System for CI/Lean/Six Sigma Training
-- =====================================================

-- =====================================================
-- TABLE 1: LEARNING PATHS (Belt Levels & Tracks)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    belt_level INTEGER NOT NULL CHECK (belt_level BETWEEN 1 AND 5),
    -- 1: Foundation, 2: Practitioner, 3: Specialist, 4: Expert, 5: Master
    specialization VARCHAR(50), -- 'lean', 'six-sigma', 'ci-integration', NULL for foundation
    estimated_hours INTEGER NOT NULL,
    prerequisites JSONB DEFAULT '[]'::jsonb,
    sequence INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 2: COURSES (Within Learning Paths)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    sequence INTEGER NOT NULL,
    estimated_hours INTEGER NOT NULL,
    tool_integration VARCHAR(100), -- Which CI Master Suite tool this course uses
    difficulty_level VARCHAR(20) DEFAULT 'beginner', -- beginner, intermediate, advanced
    is_published BOOLEAN DEFAULT false,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(learning_path_id, slug)
);

-- =====================================================
-- TABLE 3: LESSONS (Within Courses)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'video', 'text', 'interactive', 'quiz', 'practical'
    content_url TEXT, -- Video URL, article URL, etc.
    transcript TEXT,
    description TEXT,
    sequence INTEGER NOT NULL,
    estimated_minutes INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT false,
    allow_skip BOOLEAN DEFAULT false, -- Can skip before watching full video?
    resources JSONB DEFAULT '[]'::jsonb, -- Downloadable resources
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, slug)
);

-- =====================================================
-- TABLE 4: USER ENROLLMENTS (User -> Learning Path)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, learning_path_id)
);

-- =====================================================
-- TABLE 5: USER PROGRESS (Lesson-level tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    progress_percentage DECIMAL(5,2) DEFAULT 0, -- Video watch percentage
    time_spent_seconds INTEGER DEFAULT 0,
    last_position_seconds INTEGER DEFAULT 0, -- Resume point for videos
    score DECIMAL(5,2), -- For quiz lessons
    attempts INTEGER DEFAULT 0,
    first_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- =====================================================
-- TABLE 6: ASSESSMENTS (Quizzes & Exams)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'quiz', 'exam', 'practical', 'project'
    passing_score DECIMAL(5,2) NOT NULL DEFAULT 70.0,
    time_limit_minutes INTEGER,
    max_attempts INTEGER DEFAULT 3,
    questions JSONB NOT NULL, -- Array of question objects
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 7: USER ASSESSMENTS (Assessment attempts)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL,
    max_score DECIMAL(5,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    passed BOOLEAN NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 1,
    time_taken_seconds INTEGER,
    answers JSONB NOT NULL, -- User's answers
    feedback JSONB, -- Per-question feedback
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 8: PROJECTS (Capstone projects)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT NOT NULL,
    rubric JSONB NOT NULL, -- Scoring rubric
    max_score DECIMAL(5,2) NOT NULL DEFAULT 100.0,
    submission_types JSONB NOT NULL, -- ['file', 'text', 'url']
    due_date TIMESTAMP WITH TIME ZONE,
    requires_peer_review BOOLEAN DEFAULT false,
    peer_reviews_required INTEGER DEFAULT 2,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 9: PROJECT SUBMISSIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.project_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    submission_text TEXT,
    submission_files JSONB DEFAULT '[]'::jsonb, -- Array of file URLs
    submission_url TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- draft, submitted, under_review, graded
    score DECIMAL(5,2),
    instructor_feedback TEXT,
    graded_by UUID REFERENCES auth.users(id),
    graded_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, project_id)
);

-- =====================================================
-- TABLE 10: PEER REVIEWS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.peer_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.project_submissions(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score DECIMAL(5,2),
    feedback TEXT,
    rubric_scores JSONB, -- Scores per rubric criteria
    status VARCHAR(50) DEFAULT 'assigned', -- assigned, in_progress, completed
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(submission_id, reviewer_id)
);

-- =====================================================
-- TABLE 11: CERTIFICATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    belt_level INTEGER NOT NULL,
    specialization VARCHAR(50),
    certificate_url TEXT,
    verification_code VARCHAR(50) UNIQUE NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE, -- NULL = never expires
    is_active BOOLEAN DEFAULT true,
    metadata JSONB, -- Additional certificate data
    UNIQUE(user_id, learning_path_id)
);

-- =====================================================
-- TABLE 12: BADGES (Badge definitions)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'tool-mastery', 'methodology', 'streak', 'achievement', 'community', 'project'
    criteria JSONB NOT NULL, -- Earning criteria
    icon_url TEXT,
    rarity VARCHAR(20) DEFAULT 'common', -- common, rare, epic, legendary
    points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 13: USER BADGES (User achievements)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    progress JSONB, -- Progress toward badge if not yet earned
    metadata JSONB, -- Additional data about how it was earned
    UNIQUE(user_id, badge_id)
);

-- =====================================================
-- TABLE 14: DISCUSSION FORUMS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.forum_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    upvote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 15: FORUM REPLIES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_reply_id UUID REFERENCES public.forum_replies(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT false, -- Marked as solution by instructor
    upvote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 16: FORUM VOTES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.forum_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE,
    reply_id UUID REFERENCES public.forum_replies(id) ON DELETE CASCADE,
    vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)), -- -1 downvote, 1 upvote
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, thread_id),
    UNIQUE(user_id, reply_id),
    CHECK ((thread_id IS NOT NULL AND reply_id IS NULL) OR (thread_id IS NULL AND reply_id IS NOT NULL))
);

-- =====================================================
-- TABLE 17: STUDY GROUPS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.study_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT true,
    max_members INTEGER DEFAULT 50,
    member_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 18: STUDY GROUP MEMBERS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.study_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- owner, moderator, member
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, user_id)
);

-- =====================================================
-- TABLE 19: LEARNING STREAKS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.learning_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    streak_freeze_available BOOLEAN DEFAULT true,
    streak_freeze_used_at TIMESTAMP WITH TIME ZONE,
    total_learning_days INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 20: DAILY GOALS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.daily_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_date DATE NOT NULL,
    minutes_goal INTEGER DEFAULT 30,
    minutes_completed INTEGER DEFAULT 0,
    lessons_goal INTEGER DEFAULT 2,
    lessons_completed INTEGER DEFAULT 0,
    goal_met BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, goal_date)
);

-- =====================================================
-- TABLE 21: LEADERBOARD POINTS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.leaderboard_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    weekly_points INTEGER DEFAULT 0,
    monthly_points INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    quizzes_passed INTEGER DEFAULT 0,
    projects_submitted INTEGER DEFAULT 0,
    peer_reviews_given INTEGER DEFAULT 0,
    forum_posts INTEGER DEFAULT 0,
    last_points_reset TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 22: MENTORSHIPS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.mentorships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active', -- active, completed, paused
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    goals TEXT,
    meeting_notes JSONB DEFAULT '[]'::jsonb,
    UNIQUE(mentor_id, mentee_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Learning Paths
CREATE INDEX idx_learning_paths_belt_level ON public.learning_paths(belt_level);
CREATE INDEX idx_learning_paths_specialization ON public.learning_paths(specialization);
CREATE INDEX idx_learning_paths_active ON public.learning_paths(is_active) WHERE is_active = true;

-- Courses
CREATE INDEX idx_courses_learning_path ON public.courses(learning_path_id);
CREATE INDEX idx_courses_published ON public.courses(is_published) WHERE is_published = true;
CREATE INDEX idx_courses_tool ON public.courses(tool_integration);

-- Lessons
CREATE INDEX idx_lessons_course ON public.lessons(course_id);
CREATE INDEX idx_lessons_content_type ON public.lessons(content_type);
CREATE INDEX idx_lessons_published ON public.lessons(is_published) WHERE is_published = true;

-- User Enrollments
CREATE INDEX idx_user_enrollments_user ON public.user_enrollments(user_id);
CREATE INDEX idx_user_enrollments_path ON public.user_enrollments(learning_path_id);
CREATE INDEX idx_user_enrollments_active ON public.user_enrollments(user_id, is_active) WHERE is_active = true;

-- User Progress
CREATE INDEX idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_lesson ON public.user_progress(lesson_id);
CREATE INDEX idx_user_progress_course ON public.user_progress(course_id);
CREATE INDEX idx_user_progress_completed ON public.user_progress(user_id, completed) WHERE completed = true;

-- Assessments
CREATE INDEX idx_user_assessments_user ON public.user_assessments(user_id);
CREATE INDEX idx_user_assessments_assessment ON public.user_assessments(assessment_id);
CREATE INDEX idx_user_assessments_passed ON public.user_assessments(user_id, passed) WHERE passed = true;

-- Projects
CREATE INDEX idx_project_submissions_user ON public.project_submissions(user_id);
CREATE INDEX idx_project_submissions_project ON public.project_submissions(project_id);
CREATE INDEX idx_project_submissions_status ON public.project_submissions(status);

-- Certifications
CREATE INDEX idx_certifications_user ON public.certifications(user_id);
CREATE INDEX idx_certifications_verification ON public.certifications(verification_code);
CREATE INDEX idx_certifications_active ON public.certifications(is_active) WHERE is_active = true;

-- Badges
CREATE INDEX idx_user_badges_user ON public.user_badges(user_id);
CREATE INDEX idx_user_badges_badge ON public.user_badges(badge_id);
CREATE INDEX idx_badges_category ON public.badges(category);

-- Forums
CREATE INDEX idx_forum_threads_course ON public.forum_threads(course_id);
CREATE INDEX idx_forum_threads_lesson ON public.forum_threads(lesson_id);
CREATE INDEX idx_forum_threads_user ON public.forum_threads(user_id);
CREATE INDEX idx_forum_threads_created ON public.forum_threads(created_at DESC);
CREATE INDEX idx_forum_replies_thread ON public.forum_replies(thread_id);
CREATE INDEX idx_forum_replies_user ON public.forum_replies(user_id);

-- Study Groups
CREATE INDEX idx_study_groups_owner ON public.study_groups(owner_id);
CREATE INDEX idx_study_groups_public ON public.study_groups(is_public) WHERE is_public = true;
CREATE INDEX idx_study_group_members_group ON public.study_group_members(group_id);
CREATE INDEX idx_study_group_members_user ON public.study_group_members(user_id);

-- Leaderboard
CREATE INDEX idx_leaderboard_total_points ON public.leaderboard_points(total_points DESC);
CREATE INDEX idx_leaderboard_weekly_points ON public.leaderboard_points(weekly_points DESC);
CREATE INDEX idx_leaderboard_monthly_points ON public.leaderboard_points(monthly_points DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorships ENABLE ROW LEVEL SECURITY;

-- Public read for published content
CREATE POLICY "Public content readable by all authenticated users"
ON public.learning_paths FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Published courses readable by all authenticated users"
ON public.courses FOR SELECT
TO authenticated
USING (is_published = true);

CREATE POLICY "Published lessons readable by all authenticated users"
ON public.lessons FOR SELECT
TO authenticated
USING (is_published = true);

CREATE POLICY "Published assessments readable by enrolled users"
ON public.assessments FOR SELECT
TO authenticated
USING (is_published = true);

CREATE POLICY "Projects readable by enrolled users"
ON public.projects FOR SELECT
TO authenticated
USING (is_published = true);

CREATE POLICY "Badges readable by all authenticated users"
ON public.badges FOR SELECT
TO authenticated
USING (is_active = true);

-- User-specific data policies
CREATE POLICY "Users can view their own enrollments"
ON public.user_enrollments FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves"
ON public.user_enrollments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments"
ON public.user_enrollments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own progress"
ON public.user_progress FOR ALL
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own assessment attempts"
ON public.user_assessments FOR ALL
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own project submissions"
ON public.project_submissions FOR ALL
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view assigned peer reviews"
ON public.peer_reviews FOR SELECT
TO authenticated
USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can complete assigned peer reviews"
ON public.peer_reviews FOR UPDATE
TO authenticated
USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can view their own certifications"
ON public.certifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own badges"
ON public.user_badges FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Forum policies
CREATE POLICY "Anyone can view forum threads"
ON public.forum_threads FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create forum threads"
ON public.forum_threads FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threads"
ON public.forum_threads FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view forum replies"
ON public.forum_replies FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create forum replies"
ON public.forum_replies FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own replies"
ON public.forum_replies FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own votes"
ON public.forum_votes FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- Study group policies
CREATE POLICY "Public study groups readable by all"
ON public.study_groups FOR SELECT
TO authenticated
USING (is_public = true OR owner_id = auth.uid());

CREATE POLICY "Users can create study groups"
ON public.study_groups FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their groups"
ON public.study_groups FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Users can view their group memberships"
ON public.study_group_members FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can join study groups"
ON public.study_group_members FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Personal data policies
CREATE POLICY "Users can view their own streak data"
ON public.learning_streaks FOR ALL
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their daily goals"
ON public.daily_goals FOR ALL
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Leaderboard readable by all authenticated users"
ON public.leaderboard_points FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can view their mentorships"
ON public.mentorships FOR SELECT
TO authenticated
USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON public.learning_paths
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_submissions_updated_at BEFORE UPDATE ON public.project_submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_threads_updated_at BEFORE UPDATE ON public.forum_threads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON public.forum_replies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_groups_updated_at BEFORE UPDATE ON public.study_groups
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_streaks_updated_at BEFORE UPDATE ON public.learning_streaks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboard_points_updated_at BEFORE UPDATE ON public.leaderboard_points
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create leaderboard entry for new users
CREATE OR REPLACE FUNCTION create_user_leaderboard_entry()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.leaderboard_points (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    INSERT INTO public.learning_streaks (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION create_user_leaderboard_entry();

-- Function to update forum reply count
CREATE OR REPLACE FUNCTION update_thread_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.forum_threads
        SET reply_count = reply_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.thread_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.forum_threads
        SET reply_count = GREATEST(0, reply_count - 1),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.thread_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_thread_reply_count_trigger
AFTER INSERT OR DELETE ON public.forum_replies
FOR EACH ROW EXECUTE FUNCTION update_thread_reply_count();

-- Function to update vote counts
CREATE OR REPLACE FUNCTION update_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.thread_id IS NOT NULL THEN
            UPDATE public.forum_threads
            SET upvote_count = upvote_count + NEW.vote_type
            WHERE id = NEW.thread_id;
        ELSIF NEW.reply_id IS NOT NULL THEN
            UPDATE public.forum_replies
            SET upvote_count = upvote_count + NEW.vote_type
            WHERE id = NEW.reply_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.thread_id IS NOT NULL THEN
            UPDATE public.forum_threads
            SET upvote_count = upvote_count - OLD.vote_type
            WHERE id = OLD.thread_id;
        ELSIF OLD.reply_id IS NOT NULL THEN
            UPDATE public.forum_replies
            SET upvote_count = upvote_count - OLD.vote_type
            WHERE id = OLD.reply_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vote_counts_trigger
AFTER INSERT OR DELETE ON public.forum_votes
FOR EACH ROW EXECUTE FUNCTION update_vote_counts();

-- Function to update study group member count
CREATE OR REPLACE FUNCTION update_study_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.study_groups
        SET member_count = member_count + 1
        WHERE id = NEW.group_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.study_groups
        SET member_count = GREATEST(0, member_count - 1)
        WHERE id = OLD.group_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_study_group_member_count_trigger
AFTER INSERT OR DELETE ON public.study_group_members
FOR EACH ROW EXECUTE FUNCTION update_study_group_member_count();

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to calculate user's progress in a learning path
CREATE OR REPLACE FUNCTION calculate_learning_path_progress(p_user_id UUID, p_learning_path_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
BEGIN
    SELECT COUNT(l.id) INTO total_lessons
    FROM public.lessons l
    JOIN public.courses c ON l.course_id = c.id
    WHERE c.learning_path_id = p_learning_path_id
    AND l.is_published = true;
    
    IF total_lessons = 0 THEN
        RETURN 0;
    END IF;
    
    SELECT COUNT(up.id) INTO completed_lessons
    FROM public.user_progress up
    JOIN public.lessons l ON up.lesson_id = l.id
    JOIN public.courses c ON l.course_id = c.id
    WHERE c.learning_path_id = p_learning_path_id
    AND up.user_id = p_user_id
    AND up.completed = true;
    
    RETURN ROUND((completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to award points
CREATE OR REPLACE FUNCTION award_points(p_user_id UUID, p_points INTEGER, p_reason VARCHAR)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.leaderboard_points (user_id, total_points, weekly_points, monthly_points)
    VALUES (p_user_id, p_points, p_points, p_points)
    ON CONFLICT (user_id)
    DO UPDATE SET
        total_points = public.leaderboard_points.total_points + p_points,
        weekly_points = public.leaderboard_points.weekly_points + p_points,
        monthly_points = public.leaderboard_points.monthly_points + p_points,
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS VARCHAR AS $$
DECLARE
    code VARCHAR;
    exists BOOLEAN;
BEGIN
    LOOP
        code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 12));
        SELECT EXISTS(SELECT 1 FROM public.certifications WHERE verification_code = code) INTO exists;
        EXIT WHEN NOT exists;
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert Foundation Belt Learning Path
INSERT INTO public.learning_paths (name, slug, description, belt_level, specialization, estimated_hours, sequence)
VALUES (
    'Foundation Belt (White Belt)',
    'foundation-belt',
    'Introduction to Continuous Improvement, Lean Manufacturing, and Six Sigma fundamentals',
    1,
    NULL,
    30,
    1
);

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================
-- Total Tables: 22
-- Total Indexes: 40+
-- Total RLS Policies: 30+
-- Total Functions: 8
-- Total Triggers: 14
-- =====================================================
