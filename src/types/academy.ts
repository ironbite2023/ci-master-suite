// =====================================================
// CI MASTER ACADEMY - TYPESCRIPT TYPES
// =====================================================

export interface LearningPath {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  belt_level: 1 | 2 | 3 | 4 | 5;
  specialization: 'lean' | 'six-sigma' | 'ci-integration' | null;
  estimated_hours: number;
  prerequisites: string[];
  sequence: number;
  is_active: boolean;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  learning_path_id: string;
  title: string;
  slug: string;
  description: string | null;
  sequence: number;
  estimated_hours: number;
  tool_integration: string | null;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  is_published: boolean;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  content_type: 'video' | 'text' | 'interactive' | 'quiz' | 'practical';
  content_url: string | null;
  transcript: string | null;
  description: string | null;
  sequence: number;
  estimated_minutes: number;
  is_published: boolean;
  allow_skip: boolean;
  resources: Resource[];
  created_at: string;
  updated_at: string;
}

export interface Resource {
  name: string;
  url: string;
  type: 'pdf' | 'excel' | 'video' | 'link';
  size?: number;
}

export interface UserEnrollment {
  id: string;
  user_id: string;
  learning_path_id: string;
  enrolled_at: string;
  started_at: string | null;
  completed_at: string | null;
  progress_percentage: number;
  last_accessed_at: string | null;
  is_active: boolean;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  completed: boolean;
  progress_percentage: number;
  time_spent_seconds: number;
  last_position_seconds: number;
  score: number | null;
  attempts: number;
  first_viewed_at: string;
  completed_at: string | null;
  updated_at: string;
}

export interface Assessment {
  id: string;
  course_id: string | null;
  learning_path_id: string | null;
  title: string;
  description: string | null;
  type: 'quiz' | 'exam' | 'practical' | 'project';
  passing_score: number;
  time_limit_minutes: number | null;
  max_attempts: number;
  questions: Question[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'calculation' | 'short-answer';
  question: string;
  options?: string[];
  correct_answer: string | number;
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserAssessment {
  id: string;
  user_id: string;
  assessment_id: string;
  score: number;
  max_score: number;
  percentage: number;
  passed: boolean;
  attempts: number;
  time_taken_seconds: number | null;
  answers: Record<string, unknown>;
  feedback: Record<string, unknown> | null;
  started_at: string;
  submitted_at: string;
  created_at: string;
}

export interface Project {
  id: string;
  course_id: string | null;
  learning_path_id: string | null;
  title: string;
  description: string;
  instructions: string;
  rubric: RubricCriteria[];
  max_score: number;
  submission_types: ('file' | 'text' | 'url')[];
  due_date: string | null;
  requires_peer_review: boolean;
  peer_reviews_required: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface RubricCriteria {
  name: string;
  description: string;
  points: number;
}

export interface ProjectSubmission {
  id: string;
  user_id: string;
  project_id: string;
  submission_text: string | null;
  submission_files: FileSubmission[];
  submission_url: string | null;
  status: 'draft' | 'submitted' | 'under_review' | 'graded';
  score: number | null;
  instructor_feedback: string | null;
  graded_by: string | null;
  graded_at: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FileSubmission {
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface PeerReview {
  id: string;
  submission_id: string;
  reviewer_id: string;
  score: number | null;
  feedback: string | null;
  rubric_scores: Record<string, number> | null;
  status: 'assigned' | 'in_progress' | 'completed';
  assigned_at: string;
  completed_at: string | null;
}

export interface Certification {
  id: string;
  user_id: string;
  learning_path_id: string;
  belt_level: number;
  specialization: string | null;
  certificate_url: string | null;
  verification_code: string;
  issued_at: string;
  expires_at: string | null;
  is_active: boolean;
  metadata: Record<string, unknown> | null;
}

export interface Badge {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'tool-mastery' | 'methodology' | 'streak' | 'achievement' | 'community' | 'project';
  criteria: Record<string, unknown>;
  icon_url: string | null;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  is_active: boolean;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  progress: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
}

export interface ForumThread {
  id: string;
  user_id: string;
  course_id: string | null;
  lesson_id: string | null;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  reply_count: number;
  upvote_count: number;
  created_at: string;
  updated_at: string;
}

export interface ForumReply {
  id: string;
  thread_id: string;
  user_id: string;
  parent_reply_id: string | null;
  content: string;
  is_solution: boolean;
  upvote_count: number;
  created_at: string;
  updated_at: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  learning_path_id: string | null;
  is_public: boolean;
  max_members: number;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface StudyGroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'owner' | 'moderator' | 'member';
  joined_at: string;
}

export interface LearningStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  streak_freeze_available: boolean;
  streak_freeze_used_at: string | null;
  total_learning_days: number;
  created_at: string;
  updated_at: string;
}

export interface DailyGoal {
  id: string;
  user_id: string;
  goal_date: string;
  minutes_goal: number;
  minutes_completed: number;
  lessons_goal: number;
  lessons_completed: number;
  goal_met: boolean;
  created_at: string;
}

export interface LeaderboardPoints {
  id: string;
  user_id: string;
  total_points: number;
  weekly_points: number;
  monthly_points: number;
  lessons_completed: number;
  quizzes_passed: number;
  projects_submitted: number;
  peer_reviews_given: number;
  forum_posts: number;
  last_points_reset: string;
  updated_at: string;
}

export interface Mentorship {
  id: string;
  mentor_id: string;
  mentee_id: string;
  status: 'active' | 'completed' | 'paused';
  started_at: string;
  ended_at: string | null;
  goals: string | null;
  meeting_notes: MeetingNote[];
}

export interface MeetingNote {
  date: string;
  notes: string;
  action_items: string[];
}

// UI Component Types
export interface VideoPlayerProps {
  videoUrl: string;
  lessonId: string;
  userId: string;
  onProgress: (percentage: number) => void;
  onComplete: () => void;
  initialPosition?: number;
}

export interface QuizEngineProps {
  assessment: Assessment;
  onSubmit: (answers: Record<string, unknown>) => void;
  timeLimit?: number;
}

export interface BadgeDisplayProps {
  badge: Badge;
  earned?: boolean;
  progress?: number;
}

export interface ProgressTrackerProps {
  current: number;
  total: number;
  type: 'circular' | 'linear';
  showLabel?: boolean;
}

export interface CertificateData {
  userName: string;
  beltLevel: number;
  specialization: string | null;
  issueDate: string;
  verificationCode: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Hook Return Types
export interface UseEnrollmentReturn {
  enrollment: UserEnrollment | null;
  enroll: (pathId: string) => Promise<void>;
  updateProgress: () => void;
  loading: boolean;
  error: Error | null;
}

export interface UseProgressReturn {
  progress: UserProgress[];
  updateProgress: (lessonId: string, data: Partial<UserProgress>) => Promise<void>;
  completeLesson: (lessonId: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export interface UseStreakReturn {
  streak: LearningStreak | null;
  updateStreak: () => Promise<void>;
  useFreeze: () => Promise<void>;
  loading: boolean;
  error: Error | null;
}
