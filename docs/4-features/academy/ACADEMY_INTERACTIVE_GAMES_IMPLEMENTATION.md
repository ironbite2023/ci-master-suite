# 🎮 CI MASTER ACADEMY - INTERACTIVE GAMES IMPLEMENTATION
## Gamification Layer for Maximum Engagement

**Project:** Interactive Learning Games Integration  
**Goal:** Transform abstract CI/Lean/Six Sigma concepts into engaging, playable experiences  
**Approach:** Build web-based simulation games with real-time analytics  
**Status:** Implementation Phase  
**Started:** October 2, 2025  
**Estimated Duration:** 17 Weeks (4.25 Months)

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Prerequisites & Dependencies](#prerequisites--dependencies)
3. [Database Schema Implementation](#database-schema-implementation)
4. [Phase 1: Game Infrastructure](#phase-1-game-infrastructure-3-weeks)
5. [Phase 2: Catapult Game](#phase-2-catapult-game-4-weeks)
6. [Phase 3: SMED Challenge](#phase-3-smed-challenge-3-weeks)
7. [Phase 4: Additional Games](#phase-4-additional-games-4-weeks)
8. [Phase 5: Social Features](#phase-5-social-features-2-weeks)
9. [Phase 6: Analytics](#phase-6-analytics-1-week)
10. [Testing & Deployment](#testing--deployment)
11. [Success Metrics](#success-metrics)

---

## 🎯 PROJECT OVERVIEW

### **What We're Building:**

An integrated collection of **6 interactive simulation games** that teach Lean, Six Sigma, and Continuous Improvement concepts through hands-on gameplay:

1. **Catapult Statistical Simulator** - Teaches process capability, variation, DOE
2. **SMED Challenge** - Teaches quick changeover and setup reduction
3. **5S Factory Game** - Teaches workplace organization
4. **Kanban Flow Game** - Teaches pull systems and WIP limits
5. **Defect Detective** - Teaches SPC and quality control
6. **Value Stream Puzzle** - Teaches VSM and waste elimination

### **Why This Matters:**

- **75% retention rate** with active learning vs 5% with lectures
- **90%+ completion rate** for gamified courses vs 15-30% industry average
- **Competitive differentiation** - No competitor offers game-based learning
- **Viral marketing** - Students share fun experiences naturally
- **Better understanding** - Abstract statistics become tangible through gameplay

### **Core Features:**

✅ Real-time game physics and animations  
✅ Automated achievement/badge system  
✅ Global and friend leaderboards  
✅ Tutorial systems with guided practice  
✅ Analytics dashboard tracking learning outcomes  
✅ Integration with academy learning paths  
✅ Mobile-responsive gameplay  
✅ Replay and sharing capabilities  

---

## 📋 PREREQUISITES & DEPENDENCIES

### **Completed Requirements:**

- ✅ CI Master Suite base platform operational
- ✅ Next.js 15 + TypeScript + Tailwind CSS setup
- ✅ Supabase authentication and database
- ✅ Academy database schema (Phase 1 from ACADEMY_IMPLEMENTATION_PLAN.md)
- ✅ User progress tracking system
- ✅ Badge/achievement infrastructure

### **New Dependencies to Install:**

```bash
# Animation and physics
npm install framer-motion matter-js gsap

# Canvas rendering
npm install konva react-konva

# Drag and drop
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Sound effects
npm install howler

# Charts for game analytics
npm install recharts d3

# PDF generation for certificates
npm install jspdf html2canvas

# Confetti effects
npm install canvas-confetti

# State management
npm install zustand immer
```

### **Package.json Updates:**

```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "matter-js": "^0.19.0",
    "gsap": "^3.12.0",
    "konva": "^9.3.0",
    "react-konva": "^18.2.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.0",
    "howler": "^2.2.0",
    "canvas-confetti": "^1.9.0",
    "zustand": "^4.5.0",
    "immer": "^10.0.0"
  }
}
```

---

## 🗄️ DATABASE SCHEMA IMPLEMENTATION

### **Step 1: Create Game Tables (Week 1, Day 1-2)**

Create file: `game-system-schema.sql`

```sql
-- ============================================================================
-- INTERACTIVE GAMES DATABASE SCHEMA
-- CI Master Academy - Gamification Layer
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: games
-- Stores metadata for all available games
-- ============================================================================
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_key TEXT UNIQUE NOT NULL, -- 'catapult', 'smed_challenge', 'five_s_factory', etc.
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT, -- For cards
  thumbnail_url TEXT,
  hero_image_url TEXT,
  learning_objectives JSONB NOT NULL DEFAULT '[]', -- Array of learning outcomes
  difficulty_levels JSONB NOT NULL DEFAULT '["beginner","intermediate","advanced"]',
  estimated_play_time INTEGER NOT NULL DEFAULT 15, -- minutes
  min_play_time INTEGER, -- Optional minimum time
  max_play_time INTEGER, -- Optional maximum time
  category TEXT NOT NULL, -- 'six-sigma', 'lean', 'ci', 'integrated'
  related_course_ids UUID[], -- Links to courses table
  related_tool_key TEXT, -- Link to existing CI tools
  instructions_video_url TEXT,
  tutorial_steps JSONB, -- Interactive tutorial data
  game_config JSONB, -- Game-specific configuration
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  release_date DATE,
  version TEXT DEFAULT '1.0.0',
  min_belt_level TEXT, -- 'foundation', 'practitioner', 'specialist'
  tags TEXT[], -- ['statistics', 'variation', 'doe', 'fun']
  play_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_games_game_key ON games(game_key);
CREATE INDEX idx_games_category ON games(category);
CREATE INDEX idx_games_is_active ON games(is_active);
CREATE INDEX idx_games_is_featured ON games(is_featured);

-- ============================================================================
-- TABLE: game_sessions
-- Tracks individual gameplay sessions
-- ============================================================================
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  difficulty_level TEXT NOT NULL, -- 'beginner', 'intermediate', 'advanced'
  attempt_number INTEGER NOT NULL DEFAULT 1, -- 1st, 2nd, 3rd attempt at this game
  
  -- Session timing
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  paused_duration INTEGER DEFAULT 0, -- seconds spent paused
  time_spent_seconds INTEGER, -- actual play time (excluding pauses)
  
  -- Session state
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned', 'failed'
  current_phase TEXT, -- Game-specific phase tracking
  session_data JSONB DEFAULT '{}', -- Complete game state for resume
  
  -- Performance metrics
  final_score INTEGER,
  max_possible_score INTEGER,
  score_percentage DECIMAL(5,2),
  performance_metrics JSONB DEFAULT '{}', -- Game-specific metrics
  
  -- Learning assessment
  mistakes_made INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  tutorial_completed BOOLEAN DEFAULT false,
  learning_milestones JSONB DEFAULT '[]', -- Achievements during play
  
  -- Device info
  device_type TEXT, -- 'desktop', 'tablet', 'mobile'
  browser TEXT,
  screen_resolution TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_game_id ON game_sessions(game_id);
CREATE INDEX idx_game_sessions_status ON game_sessions(status);
CREATE INDEX idx_game_sessions_started_at ON game_sessions(started_at DESC);
CREATE INDEX idx_game_sessions_user_game ON game_sessions(user_id, game_id);

-- ============================================================================
-- TABLE: game_achievements
-- Defines all possible achievements for games
-- ============================================================================
CREATE TABLE game_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE, -- NULL = global achievement
  achievement_key TEXT UNIQUE NOT NULL, -- 'catapult_perfectionist', 'smed_speedster'
  
  -- Achievement metadata
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  badge_icon_url TEXT,
  badge_color TEXT, -- Hex color for badge background
  unlock_message TEXT, -- Shown when unlocked
  
  -- Unlock criteria
  unlock_criteria JSONB NOT NULL, -- Conditions to unlock
  /*
    Example criteria:
    {
      "type": "score_threshold",
      "value": 1000,
      "operator": "gte"
    }
    OR
    {
      "type": "metric_threshold",
      "metric": "cpk",
      "value": 2.0,
      "operator": "gte"
    }
    OR
    {
      "type": "combo",
      "conditions": [
        {"metric": "time_spent_seconds", "value": 300, "operator": "lt"},
        {"metric": "score", "value": 80, "operator": "gte"}
      ]
    }
  */
  
  -- Rewards
  points_awarded INTEGER DEFAULT 0,
  badge_awarded BOOLEAN DEFAULT true,
  
  -- Achievement stats
  rarity TEXT DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  unlock_count INTEGER DEFAULT 0, -- How many users have unlocked
  unlock_percentage DECIMAL(5,2) DEFAULT 0.00, -- % of players
  
  -- Display settings
  is_secret BOOLEAN DEFAULT false, -- Hidden until unlocked
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_game_achievements_game_id ON game_achievements(game_id);
CREATE INDEX idx_game_achievements_key ON game_achievements(achievement_key);
CREATE INDEX idx_game_achievements_rarity ON game_achievements(rarity);

-- ============================================================================
-- TABLE: user_game_achievements
-- Junction table: users <-> achievements
-- ============================================================================
CREATE TABLE user_game_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES game_achievements(id) ON DELETE CASCADE,
  game_session_id UUID REFERENCES game_sessions(id) ON DELETE SET NULL,
  
  earned_at TIMESTAMPTZ DEFAULT now(),
  points_earned INTEGER DEFAULT 0,
  
  -- Social features
  is_shared BOOLEAN DEFAULT false,
  share_count INTEGER DEFAULT 0,
  
  -- Metadata
  unlock_context JSONB, -- What triggered the unlock
  
  UNIQUE(user_id, achievement_id) -- Can only earn each achievement once
);

CREATE INDEX idx_user_game_achievements_user ON user_game_achievements(user_id);
CREATE INDEX idx_user_game_achievements_achievement ON user_game_achievements(achievement_id);
CREATE INDEX idx_user_game_achievements_earned_at ON user_game_achievements(earned_at DESC);

-- ============================================================================
-- TABLE: game_leaderboards
-- Stores best scores per user per game
-- ============================================================================
CREATE TABLE game_leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  difficulty_level TEXT NOT NULL,
  
  -- Best performance
  best_score INTEGER NOT NULL,
  best_score_session_id UUID REFERENCES game_sessions(id),
  best_time_seconds INTEGER,
  best_accuracy DECIMAL(5,2),
  
  -- Aggregate stats
  total_plays INTEGER DEFAULT 1,
  total_completions INTEGER DEFAULT 0,
  average_score DECIMAL(8,2),
  improvement_rate DECIMAL(5,2), -- % improvement from first to best
  
  -- Ranking
  global_rank INTEGER,
  monthly_rank INTEGER,
  weekly_rank INTEGER,
  
  -- Timestamps
  first_played_at TIMESTAMPTZ DEFAULT now(),
  last_played_at TIMESTAMPTZ DEFAULT now(),
  best_score_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(game_id, user_id, difficulty_level)
);

CREATE INDEX idx_leaderboards_game_difficulty ON game_leaderboards(game_id, difficulty_level);
CREATE INDEX idx_leaderboards_best_score ON game_leaderboards(best_score DESC);
CREATE INDEX idx_leaderboards_user ON game_leaderboards(user_id);
CREATE INDEX idx_leaderboards_global_rank ON game_leaderboards(global_rank);

-- ============================================================================
-- TABLE: game_ratings
-- User ratings and reviews for games
-- ============================================================================
CREATE TABLE game_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  
  -- What aspects they rated
  fun_rating INTEGER CHECK (fun_rating >= 1 AND fun_rating <= 5),
  educational_value INTEGER CHECK (educational_value >= 1 AND educational_value <= 5),
  difficulty_appropriate BOOLEAN,
  
  -- Helpfulness
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  
  -- Moderation
  is_verified_player BOOLEAN DEFAULT false, -- Completed the game
  is_flagged BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(game_id, user_id) -- One review per user per game
);

CREATE INDEX idx_game_ratings_game ON game_ratings(game_id);
CREATE INDEX idx_game_ratings_rating ON game_ratings(rating DESC);
CREATE INDEX idx_game_ratings_helpful ON game_ratings(helpful_count DESC);

-- ============================================================================
-- TABLE: game_challenges
-- User-to-user challenges
-- ============================================================================
CREATE TABLE game_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  challenger_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenged_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Challenge details
  difficulty_level TEXT NOT NULL,
  target_score INTEGER NOT NULL,
  message TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'completed', 'expired'
  challenger_best_score INTEGER,
  challenged_best_score INTEGER,
  winner_user_id UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_challenges_challenged_user ON game_challenges(challenged_user_id, status);
CREATE INDEX idx_challenges_challenger_user ON game_challenges(challenger_user_id);
CREATE INDEX idx_challenges_status ON game_challenges(status);

-- ============================================================================
-- TABLE: game_replays
-- Store replay data for sharing
-- ============================================================================
CREATE TABLE game_replays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  
  -- Replay data
  replay_data JSONB NOT NULL, -- Complete action log for playback
  duration_seconds INTEGER NOT NULL,
  
  -- Metadata
  title TEXT,
  description TEXT,
  thumbnail_url TEXT,
  
  -- Sharing
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  
  -- Featured
  is_featured BOOLEAN DEFAULT false,
  featured_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_replays_user ON game_replays(user_id);
CREATE INDEX idx_replays_game ON game_replays(game_id);
CREATE INDEX idx_replays_public ON game_replays(is_public, view_count DESC);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update game play count
CREATE OR REPLACE FUNCTION increment_game_play_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE games 
  SET play_count = play_count + 1,
      updated_at = now()
  WHERE id = NEW.game_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_play_count
AFTER INSERT ON game_sessions
FOR EACH ROW
EXECUTE FUNCTION increment_game_play_count();

-- Function to update leaderboard ranks
CREATE OR REPLACE FUNCTION update_leaderboard_ranks()
RETURNS TRIGGER AS $$
BEGIN
  -- Update global ranks for the game/difficulty
  WITH ranked AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        ORDER BY best_score DESC, best_time_seconds ASC, last_played_at DESC
      ) as new_rank
    FROM game_leaderboards
    WHERE game_id = NEW.game_id AND difficulty_level = NEW.difficulty_level
  )
  UPDATE game_leaderboards gl
  SET global_rank = ranked.new_rank
  FROM ranked
  WHERE gl.id = ranked.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ranks
AFTER INSERT OR UPDATE OF best_score ON game_leaderboards
FOR EACH ROW
EXECUTE FUNCTION update_leaderboard_ranks();

-- Function to update achievement unlock percentage
CREATE OR REPLACE FUNCTION update_achievement_stats()
RETURNS TRIGGER AS $$
DECLARE
  total_players INTEGER;
BEGIN
  -- Get total unique players for this game
  SELECT COUNT(DISTINCT user_id) INTO total_players
  FROM game_sessions
  WHERE game_id = (
    SELECT game_id FROM game_achievements WHERE id = NEW.achievement_id
  );
  
  -- Update achievement stats
  UPDATE game_achievements
  SET 
    unlock_count = unlock_count + 1,
    unlock_percentage = CASE 
      WHEN total_players > 0 THEN (unlock_count + 1) * 100.0 / total_players 
      ELSE 0 
    END
  WHERE id = NEW.achievement_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_achievement_stats
AFTER INSERT ON user_game_achievements
FOR EACH ROW
EXECUTE FUNCTION update_achievement_stats();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_game_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_replays ENABLE ROW LEVEL SECURITY;

-- Games: Everyone can read active games
CREATE POLICY "Games are viewable by everyone"
  ON games FOR SELECT
  USING (is_active = true);

-- Game Sessions: Users can only manage their own sessions
CREATE POLICY "Users can insert their own game sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own game sessions"
  ON game_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own game sessions"
  ON game_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Achievements: Everyone can read, system awards them
CREATE POLICY "Achievements are viewable by everyone"
  ON game_achievements FOR SELECT
  USING (is_active = true);

-- User achievements: Users can view their own and others' achievements
CREATE POLICY "Users can view all earned achievements"
  ON user_game_achievements FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own achievements"
  ON user_game_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Leaderboards: Everyone can read
CREATE POLICY "Leaderboards are viewable by everyone"
  ON game_leaderboards FOR SELECT
  USING (true);

CREATE POLICY "Users can insert/update their own leaderboard entries"
  ON game_leaderboards FOR ALL
  USING (auth.uid() = user_id);

-- Ratings: Users can manage their own ratings
CREATE POLICY "Users can view all ratings"
  ON game_ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own ratings"
  ON game_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON game_ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- Challenges: Users can view challenges involving them
CREATE POLICY "Users can view their challenges"
  ON game_challenges FOR SELECT
  USING (auth.uid() = challenger_user_id OR auth.uid() = challenged_user_id);

CREATE POLICY "Users can create challenges"
  ON game_challenges FOR INSERT
  WITH CHECK (auth.uid() = challenger_user_id);

CREATE POLICY "Users can update challenges they're involved in"
  ON game_challenges FOR UPDATE
  USING (auth.uid() = challenger_user_id OR auth.uid() = challenged_user_id);

-- Replays: Public replays viewable by all, private only by owner
CREATE POLICY "Public replays are viewable by everyone"
  ON game_replays FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own replays"
  ON game_replays FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own replays"
  ON game_replays FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- VIEWS FOR ANALYTICS
-- ============================================================================

-- Comprehensive game analytics view
CREATE VIEW game_analytics AS
SELECT 
  g.game_key,
  g.title,
  g.category,
  COUNT(DISTINCT gs.user_id) as unique_players,
  COUNT(gs.id) as total_sessions,
  COUNT(CASE WHEN gs.status = 'completed' THEN 1 END) as completed_sessions,
  (COUNT(CASE WHEN gs.status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(gs.id), 0)) as completion_rate,
  AVG(gs.final_score) as avg_score,
  MAX(gs.final_score) as max_score,
  AVG(gs.time_spent_seconds) as avg_time_seconds,
  AVG(gs.mistakes_made) as avg_mistakes,
  AVG(gs.hints_used) as avg_hints_used,
  g.average_rating,
  COUNT(DISTINCT gr.id) as review_count
FROM games g
LEFT JOIN game_sessions gs ON g.id = gs.game_id
LEFT JOIN game_ratings gr ON g.id = gr.game_id
GROUP BY g.id, g.game_key, g.title, g.category, g.average_rating;

-- User game progress view
CREATE VIEW user_game_progress AS
SELECT 
  u.id as user_id,
  u.email,
  g.game_key,
  g.title,
  COUNT(gs.id) as total_plays,
  MAX(gl.best_score) as best_score,
  MAX(gl.global_rank) as best_rank,
  COUNT(DISTINCT uga.achievement_id) as achievements_earned,
  MAX(gs.completed_at) as last_played
FROM auth.users u
CROSS JOIN games g
LEFT JOIN game_sessions gs ON u.id = gs.user_id AND g.id = gs.game_id
LEFT JOIN game_leaderboards gl ON u.id = gl.user_id AND g.id = gl.game_id
LEFT JOIN user_game_achievements uga ON u.id = uga.user_id
LEFT JOIN game_achievements ga ON uga.achievement_id = ga.id AND ga.game_id = g.id
GROUP BY u.id, u.email, g.game_key, g.title;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert initial games
INSERT INTO games (game_key, title, description, short_description, category, estimated_play_time, learning_objectives, difficulty_levels, min_belt_level, tags) VALUES
('catapult', 
 'Catapult Statistical Simulator', 
 'Master process capability and variation by operating a virtual catapult. Reduce variation, optimize settings using DOE, and achieve world-class process capability.', 
 'Learn statistics through catapult physics',
 'six-sigma', 
 20,
 '["Understand process variation", "Calculate process capability (Cp, Cpk)", "Apply design of experiments", "Interpret control charts", "Reduce common cause variation"]'::jsonb,
 '["beginner", "intermediate", "advanced"]'::jsonb,
 'foundation',
 ARRAY['statistics', 'variation', 'doe', 'capability', 'spc']),

('smed_challenge', 
 'SMED Quick Changeover Challenge', 
 'Race against time to optimize machine changeover. Convert internal activities to external, implement parallel operations, and achieve single-minute exchange of die.', 
 'Master quick changeover techniques',
 'lean', 
 15,
 '["Understand SMED principles", "Identify internal vs external activities", "Convert internal to external setup", "Implement parallel operations", "Reduce changeover time by 75%"]'::jsonb,
 '["beginner", "intermediate", "advanced"]'::jsonb,
 'foundation',
 ARRAY['smed', 'lean', 'changeover', 'setup-reduction', 'oee']),

('five_s_factory', 
 '5S Factory Organization', 
 'Transform a messy factory floor using 5S principles. Sort, Set in Order, Shine, Standardize, and Sustain to create the ideal workplace.', 
 'Organize a virtual factory with 5S',
 'lean', 
 12,
 '["Apply 5S methodology", "Identify unnecessary items", "Create visual standards", "Optimize workplace layout", "Build sustainable systems"]'::jsonb,
 '["beginner", "intermediate", "advanced"]'::jsonb,
 'foundation',
 ARRAY['5s', 'lean', 'workplace-organization', 'visual-management']),

('kanban_flow', 
 'Kanban Flow Game', 
 'Manage work-in-progress limits and optimize flow through a pull system. Balance capacity, eliminate bottlenecks, and maximize throughput.', 
 'Master pull systems and WIP limits',
 'lean', 
 18,
 '["Understand pull systems", "Optimize WIP limits", "Identify bottlenecks", "Balance flow", "Minimize cycle time"]'::jsonb,
 '["beginner", "intermediate", "advanced"]'::jsonb,
 'practitioner',
 ARRAY['kanban', 'lean', 'flow', 'wip-limits', 'pull-system']),

('defect_detective', 
 'Defect Detective', 
 'Use statistical process control to catch defects before they escape. Identify patterns, investigate special causes, and optimize your inspection strategy.', 
 'Find defects using SPC principles',
 'six-sigma', 
 15,
 '["Apply SPC principles", "Identify control chart patterns", "Distinguish special vs common cause", "Optimize inspection strategy", "Balance cost of quality"]'::jsonb,
 '["beginner", "intermediate", "advanced"]'::jsonb,
 'foundation',
 ARRAY['spc', 'quality', 'control-charts', 'inspection', 'defects']),

('vsm_puzzle', 
 'Value Stream Puzzle', 
 'Rearrange process steps to eliminate waste and maximize flow. Calculate cycle efficiency, identify value-added activities, and design the ideal future state.', 
 'Optimize process flow and eliminate waste',
 'lean', 
 20,
 '["Create value stream maps", "Identify 8 wastes", "Calculate process cycle efficiency", "Design future state", "Prioritize improvements"]'::jsonb,
 '["beginner", "intermediate", "advanced"]'::jsonb,
 'practitioner',
 ARRAY['vsm', 'lean', 'waste', 'flow', 'process-improvement']);

-- Insert sample achievements for Catapult game
INSERT INTO game_achievements (game_id, achievement_key, title, description, unlock_criteria, points_awarded, rarity) 
SELECT 
  id,
  'catapult_first_shot',
  'First Blood',
  'Complete your first catapult shot',
  '{"type": "action_count", "action": "fire_catapult", "value": 1, "operator": "gte"}'::jsonb,
  10,
  'common'
FROM games WHERE game_key = 'catapult';

INSERT INTO game_achievements (game_id, achievement_key, title, description, unlock_criteria, points_awarded, rarity) 
SELECT 
  id,
  'catapult_bullseye',
  'Bullseye!',
  'Hit the exact center of the target',
  '{"type": "metric_threshold", "metric": "distance_from_center", "value": 1, "operator": "lte"}'::jsonb,
  25,
  'rare'
FROM games WHERE game_key = 'catapult';

INSERT INTO game_achievements (game_id, achievement_key, title, description, unlock_criteria, points_awarded, rarity) 
SELECT 
  id,
  'catapult_capable_process',
  'Process Capable',
  'Achieve Cpk >= 1.33 (industry standard)',
  '{"type": "metric_threshold", "metric": "cpk", "value": 1.33, "operator": "gte"}'::jsonb,
  100,
  'epic'
FROM games WHERE game_key = 'catapult';

INSERT INTO game_achievements (game_id, achievement_key, title, description, unlock_criteria, points_awarded, rarity) 
SELECT 
  id,
  'catapult_six_sigma',
  'Six Sigma Master',
  'Achieve Cpk >= 2.0 (world-class)',
  '{"type": "metric_threshold", "metric": "cpk", "value": 2.0, "operator": "gte"}'::jsonb,
  200,
  'legendary'
FROM games WHERE game_key = 'catapult';

INSERT INTO game_achievements (game_id, achievement_key, title, description, unlock_criteria, points_awarded, rarity) 
SELECT 
  id,
  'catapult_efficient',
  'Efficient Experimenter',
  'Complete the challenge in under 15 shots',
  '{"type": "metric_threshold", "metric": "total_shots", "value": 15, "operator": "lt"}'::jsonb,
  75,
  'epic'
FROM games WHERE game_key = 'catapult';

INSERT INTO game_achievements (game_id, achievement_key, title, description, unlock_criteria, points_awarded, rarity) 
SELECT 
  id,
  'catapult_doe_master',
  'DOE Expert',
  'Use full factorial design of experiments',
  '{"type": "action_performed", "action": "use_doe_wizard", "value": true}'::jsonb,
  150,
  'epic'
FROM games WHERE game_key = 'catapult';

-- Add more achievements for other games as needed...

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
```

**Deployment Steps:**

1. Run this SQL in Supabase SQL Editor
2. Verify all tables created successfully
3. Test RLS policies with test user account
4. Seed initial game data
5. Create database backup

---

## 📦 PHASE 1: GAME INFRASTRUCTURE (3 WEEKS)

### **WEEK 1: Core Architecture**

#### **Day 1-2: TypeScript Types & Interfaces**

Create `/src/types/games.ts`:

```typescript
// ============================================================================
// GAME TYPE DEFINITIONS
// ============================================================================

export type GameKey = 
  | 'catapult' 
  | 'smed_challenge' 
  | 'five_s_factory' 
  | 'kanban_flow' 
  | 'defect_detective' 
  | 'vsm_puzzle';

export type GameCategory = 'six-sigma' | 'lean' | 'ci' | 'integrated';

export type GameDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type GameStatus = 'in_progress' | 'completed' | 'abandoned' | 'failed';

export type ChallengeStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'expired';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

// ============================================================================
// CORE INTERFACES
// ============================================================================

export interface Game {
  id: string;
  gameKey: GameKey;
  title: string;
  description: string;
  shortDescription: string;
  thumbnailUrl?: string;
  heroImageUrl?: string;
  learningObjectives: string[];
  difficultyLevels: GameDifficulty[];
  estimatedPlayTime: number;
  minPlayTime?: number;
  maxPlayTime?: number;
  category: GameCategory;
  relatedCourseIds: string[];
  relatedToolKey?: string;
  instructionsVideoUrl?: string;
  tutorialSteps?: TutorialStep[];
  gameConfig?: Record<string, any>;
  isActive: boolean;
  isFeatured: boolean;
  releaseDate?: string;
  version: string;
  minBeltLevel?: string;
  tags: string[];
  playCount: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface GameSession {
  id: string;
  userId: string;
  gameId: string;
  difficultyLevel: GameDifficulty;
  attemptNumber: number;
  
  // Timing
  startedAt: string;
  completedAt?: string;
  pausedDuration: number;
  timeSpentSeconds?: number;
  
  // State
  status: GameStatus;
  currentPhase?: string;
  sessionData: Record<string, any>;
  
  // Performance
  finalScore?: number;
  maxPossibleScore?: number;
  scorePercentage?: number;
  performanceMetrics: Record<string, any>;
  
  // Learning
  mistakesMade: number;
  hintsUsed: number;
  tutorialCompleted: boolean;
  learningMilestones: string[];
  
  // Device
  deviceType?: string;
  browser?: string;
  screenResolution?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface GameAchievement {
  id: string;
  gameId?: string;
  achievementKey: string;
  title: string;
  description: string;
  badgeIconUrl?: string;
  badgeColor?: string;
  unlockMessage?: string;
  unlockCriteria: UnlockCriteria;
  pointsAwarded: number;
  badgeAwarded: boolean;
  rarity: AchievementRarity;
  unlockCount: number;
  unlockPercentage: number;
  isSecret: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface UserGameAchievement {
  id: string;
  userId: string;
  achievementId: string;
  gameSessionId?: string;
  earnedAt: string;
  pointsEarned: number;
  isShared: boolean;
  shareCount: number;
  unlockContext?: Record<string, any>;
  achievement?: GameAchievement; // Populated via join
}

export interface GameLeaderboard {
  id: string;
  gameId: string;
  userId: string;
  difficultyLevel: GameDifficulty;
  bestScore: number;
  bestScoreSessionId?: string;
  bestTimeSeconds?: number;
  bestAccuracy?: number;
  totalPlays: number;
  totalCompletions: number;
  averageScore: number;
  improvementRate: number;
  globalRank?: number;
  monthlyRank?: number;
  weeklyRank?: number;
  firstPlayedAt: string;
  lastPlayedAt: string;
  bestScoreAt: string;
  // Populated via joins
  userEmail?: string;
  userName?: string;
}

export interface GameRating {
  id: string;
  gameId: string;
  userId: string;
  rating: number;
  reviewText?: string;
  funRating?: number;
  educationalValue?: number;
  difficultyAppropriate?: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  isVerifiedPlayer: boolean;
  isFlagged: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GameChallenge {
  id: string;
  gameId: string;
  challengerUserId: string;
  challengedUserId: string;
  difficultyLevel: GameDifficulty;
  targetScore: number;
  message?: string;
  status: ChallengeStatus;
  challengerBestScore?: number;
  challengedBestScore?: number;
  winnerUserId?: string;
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

export interface GameReplay {
  id: string;
  gameSessionId: string;
  userId: string;
  gameId: string;
  replayData: ReplayAction[];
  durationSeconds: number;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  isFeatured: boolean;
  featuredAt?: string;
  createdAt: string;
}

// ============================================================================
// GAME-SPECIFIC INTERFACES
// ============================================================================

export interface GameState {
  status: 'loading' | 'ready' | 'playing' | 'paused' | 'completed' | 'failed';
  score: number;
  maxScore: number;
  timeElapsed: number;
  lives?: number;
  level?: number;
  phase: string;
  isPaused: boolean;
  isLoading: boolean;
  error?: string;
}

export interface GameControls {
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  onComplete: (finalScore: number, metrics: GameMetrics) => void;
}

export interface GameMetrics {
  timeSpent: number;
  accuracy: number;
  efficiency: number;
  mistakeCount: number;
  hintsUsed: number;
  customMetrics: Record<string, number | string | boolean>;
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  highlightArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  action?: {
    type: 'click' | 'drag' | 'input' | 'wait';
    target?: string;
    expectedValue?: any;
  };
  canSkip: boolean;
  autoAdvance: boolean;
  order: number;
}

export interface UnlockCriteria {
  type: 'score_threshold' | 'metric_threshold' | 'action_count' | 'action_performed' | 'combo' | 'time_based';
  metric?: string;
  action?: string;
  value?: any;
  operator?: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
  conditions?: UnlockCriteria[];
}

export interface ReplayAction {
  timestamp: number;
  type: string;
  data: Record<string, any>;
}

export interface GameAnalytics {
  gameKey: string;
  title: string;
  category: GameCategory;
  uniquePlayers: number;
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  avgScore: number;
  maxScore: number;
  avgTimeSeconds: number;
  avgMistakes: number;
  avgHintsUsed: number;
  averageRating: number;
  reviewCount: number;
}

// ============================================================================
// CATAPULT GAME SPECIFIC TYPES
// ============================================================================

export interface CatapultSettings {
  angle: number;              // 0-90 degrees
  tension: number;            // 0-100%
  counterWeight: number;      // 0-100 kg
  releasePoint: number;       // 0-100%
}

export interface Shot {
  id: string;
  attemptNumber: number;
  settings: CatapultSettings;
  landingDistance: number;
  targetDistance: number;
  deviation: number;
  timestamp: number;
}

export interface CatapultGameState extends GameState {
  phase: 'baseline' | 'experimentation' | 'optimization' | 'complete';
  settings: CatapultSettings;
  shots: Shot[];
  targetDistance: number;
  targetWidth: number;
  statistics: {
    mean: number;
    stdDev: number;
    cp: number;
    cpk: number;
    hitRate: number;
  };
  doeActive: boolean;
  doeDesign?: DOEDesign;
}

export interface DOEDesign {
  factors: string[];
  levels: number;
  runs: DOERun[];
  currentRun: number;
  results: DOEResult[];
}

export interface DOERun {
  runNumber: number;
  settings: CatapultSettings;
  completed: boolean;
  result?: number;
}

export interface DOEResult {
  factor: string;
  effect: number;
  significance: number;
}

// ============================================================================
// SMED GAME SPECIFIC TYPES
// ============================================================================

export interface ChangeoverActivity {
  id: string;
  name: string;
  description: string;
  initialType: 'internal' | 'external';
  currentType: 'internal' | 'external';
  canConvert: boolean;
  duration: number;              // seconds
  dependencies: string[];        // activity IDs that must complete first
  category: 'tool' | 'die' | 'cleaning' | 'adjustment' | 'inspection' | 'material';
  operator?: 1 | 2;             // For parallel operations
  completed: boolean;
  startTime?: number;
  endTime?: number;
}

export interface SMEDGameState extends GameState {
  phase: 'baseline' | 'analysis' | 'improvement' | 'optimized' | 'results';
  activities: ChangeoverActivity[];
  baselineDuration: number;
  currentDuration: number;
  timeReduction: number;
  reductionPercentage: number;
  parallelOperationsEnabled: boolean;
  improvements: {
    converted: number;
    parallelized: number;
    eliminated: number;
    streamlined: number;
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface HUDData {
  score: number;
  maxScore?: number;
  time: number;
  timeLimit?: number;
  lives?: number;
  maxLives?: number;
  level?: number;
  streak?: number;
  multiplier?: number;
}

export interface ModalData {
  type: 'pause' | 'tutorial' | 'results' | 'achievement' | 'challenge' | 'error';
  title: string;
  content: React.ReactNode | string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  onClose?: () => void;
  canClose?: boolean;
}

export interface SoundEffect {
  key: string;
  url: string;
  volume?: number;
  loop?: boolean;
}

export interface VisualEffect {
  type: 'confetti' | 'explosion' | 'sparkle' | 'shake' | 'pulse' | 'glow';
  x?: number;
  y?: number;
  color?: string;
  duration?: number;
  intensity?: number;
}
```

#### **Day 3-4: Game Session Hook**

Create `/src/hooks/useGameSession.ts`:

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { GameSession, GameState, GameMetrics, GameKey, GameDifficulty } from '@/types/games';
import { checkAchievements } from '@/lib/achievements/achievementEngine';
import { updateLeaderboard } from '@/lib/games/leaderboardService';

interface UseGameSessionOptions {
  gameKey: GameKey;
  difficulty: GameDifficulty;
  autoSaveInterval?: number; // milliseconds (default: 30000)
  onAchievementUnlocked?: (achievement: any) => void;
  onLeaderboardUpdate?: (rank: number) => void;
}

export const useGameSession = ({
  gameKey,
  difficulty,
  autoSaveInterval = 30000,
  onAchievementUnlocked,
  onLeaderboardUpdate
}: UseGameSessionOptions) => {
  const supabase = useSupabaseClient();
  const user = useUser();
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    status: 'loading',
    score: 0,
    maxScore: 0,
    timeElapsed: 0,
    phase: 'init',
    isPaused: false,
    isLoading: true
  });
  
  const [startTime, setStartTime] = useState<number>(0);
  const [pauseTime, setpauseTime] = useState<number>(0);
  const [totalPausedDuration, setTotalPausedDuration] = useState<number>(0);
  
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();
  const gameTickerRef = useRef<NodeJS.Timeout>();
  
  // ========================================================================
  // START GAME SESSION
  // ========================================================================
  const startGame = useCallback(async (initialData?: Record<string, any>) => {
    if (!user) {
      throw new Error('User must be authenticated to start game');
    }
    
    try {
      // Get game ID
      const { data: game, error: gameError } = await supabase
        .from('games')
        .select('id')
        .eq('game_key', gameKey)
        .single();
      
      if (gameError || !game) {
        throw new Error('Game not found');
      }
      
      // Get attempt number
      const { data: sessions } = await supabase
        .from('game_sessions')
        .select('attempt_number')
        .eq('user_id', user.id)
        .eq('game_id', game.id)
        .order('attempt_number', { ascending: false })
        .limit(1);
      
      const attemptNumber = sessions && sessions.length > 0 
        ? sessions[0].attempt_number + 1 
        : 1;
      
      // Create game session
      const { data: session, error: sessionError } = await supabase
        .from('game_sessions')
        .insert({
          user_id: user.id,
          game_id: game.id,
          difficulty_level: difficulty,
          attempt_number: attemptNumber,
          status: 'in_progress',
          session_data: initialData || {},
          started_at: new Date().toISOString(),
          device_type: getDeviceType(),
          browser: getBrowserInfo(),
          screen_resolution: `${window.screen.width}x${window.screen.height}`
        })
        .select()
        .single();
      
      if (sessionError || !session) {
        throw new Error('Failed to create game session');
      }
      
      setSessionId(session.id);
      setStartTime(Date.now());
      setGameState(prev => ({
        ...prev,
        status: 'playing',
        isLoading: false
      }));
      
      // Start auto-save timer
      startAutoSave();
      
      // Start game ticker (updates time elapsed every second)
      startGameTicker();
      
      return session;
    } catch (error) {
      console.error('Error starting game:', error);
      setGameState(prev => ({
        ...prev,
        status: 'ready',
        isLoading: false,
        error: error.message
      }));
      throw error;
    }
  }, [user, gameKey, difficulty, supabase]);
  
  // ========================================================================
  // PAUSE GAME
  // ========================================================================
  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: true, status: 'paused' }));
    setPauseTime(Date.now());
    stopGameTicker();
  }, []);
  
  // ========================================================================
  // RESUME GAME
  // ========================================================================
  const resumeGame = useCallback(() => {
    const pauseDuration = Date.now() - pauseTime;
    setTotalPausedDuration(prev => prev + pauseDuration);
    setGameState(prev => ({ ...prev, isPaused: false, status: 'playing' }));
    startGameTicker();
  }, [pauseTime]);
  
  // ========================================================================
  // UPDATE PROGRESS
  // ========================================================================
  const updateProgress = useCallback(async (updates: Partial<GameState>, sessionData?: Record<string, any>) => {
    if (!sessionId) return;
    
    setGameState(prev => ({ ...prev, ...updates }));
    
    try {
      await supabase
        .from('game_sessions')
        .update({
          session_data: sessionData,
          performance_metrics: {
            score: updates.score,
            timeElapsed: updates.timeElapsed,
            phase: updates.phase
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, [sessionId, supabase]);
  
  // ========================================================================
  // COMPLETE GAME
  // ========================================================================
  const completeGame = useCallback(async (
    finalScore: number, 
    metrics: GameMetrics,
    sessionData: Record<string, any>
  ) => {
    if (!sessionId || !user) return;
    
    stopGameTicker();
    stopAutoSave();
    
    const actualPlayTime = Math.floor((Date.now() - startTime - totalPausedDuration) / 1000);
    
    try {
      // Get game details
      const { data: game } = await supabase
        .from('games')
        .select('id, game_key')
        .eq('game_key', gameKey)
        .single();
      
      if (!game) throw new Error('Game not found');
      
      // Calculate score percentage
      const scorePercentage = gameState.maxScore > 0 
        ? (finalScore / gameState.maxScore) * 100 
        : 0;
      
      // Update session as completed
      const { error: updateError } = await supabase
        .from('game_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          time_spent_seconds: actualPlayTime,
          paused_duration: Math.floor(totalPausedDuration / 1000),
          final_score: finalScore,
          max_possible_score: gameState.maxScore,
          score_percentage: scorePercentage,
          performance_metrics: metrics,
          session_data: sessionData
        })
        .eq('id', sessionId);
      
      if (updateError) throw updateError;
      
      // Check for achievements
      const unlockedAchievements = await checkAchievements(
        game.id,
        user.id,
        sessionId,
        {
          ...metrics,
          finalScore,
          scorePercentage,
          timeSpent: actualPlayTime
        }
      );
      
      // Notify about achievements
      if (unlockedAchievements.length > 0 && onAchievementUnlocked) {
        unlockedAchievements.forEach(achievement => {
          onAchievementUnlocked(achievement);
        });
      }
      
      // Update leaderboard
      const leaderboardResult = await updateLeaderboard(
        game.id,
        user.id,
        difficulty,
        finalScore,
        actualPlayTime,
        sessionId,
        metrics.accuracy
      );
      
      if (leaderboardResult?.rank && onLeaderboardUpdate) {
        onLeaderboardUpdate(leaderboardResult.rank);
      }
      
      setGameState(prev => ({
        ...prev,
        status: 'completed',
        score: finalScore
      }));
      
      return {
        sessionId,
        achievements: unlockedAchievements,
        leaderboardRank: leaderboardResult?.rank
      };
    } catch (error) {
      console.error('Error completing game:', error);
      throw error;
    }
  }, [sessionId, user, gameKey, difficulty, gameState.maxScore, startTime, totalPausedDuration, supabase, onAchievementUnlocked, onLeaderboardUpdate]);
  
  // ========================================================================
  // QUIT/ABANDON GAME
  // ========================================================================
  const quitGame = useCallback(async () => {
    if (!sessionId) return;
    
    stopGameTicker();
    stopAutoSave();
    
    try {
      await supabase
        .from('game_sessions')
        .update({
          status: 'abandoned',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);
      
      setGameState(prev => ({ ...prev, status: 'ready' }));
      setSessionId(null);
    } catch (error) {
      console.error('Error quitting game:', error);
    }
  }, [sessionId, supabase]);
  
  // ========================================================================
  // AUTO-SAVE
  // ========================================================================
  const saveProgress = useCallback(async () => {
    if (!sessionId || gameState.isPaused) return;
    
    try {
      await supabase
        .from('game_sessions')
        .update({
          performance_metrics: {
            score: gameState.score,
            timeElapsed: gameState.timeElapsed,
            phase: gameState.phase
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [sessionId, gameState, supabase]);
  
  const startAutoSave = useCallback(() => {
    autoSaveTimerRef.current = setInterval(saveProgress, autoSaveInterval);
  }, [saveProgress, autoSaveInterval]);
  
  const stopAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }
  }, []);
  
  // ========================================================================
  // GAME TICKER (updates time every second)
  // ========================================================================
  const startGameTicker = useCallback(() => {
    gameTickerRef.current = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeElapsed: prev.timeElapsed + 1
      }));
    }, 1000);
  }, []);
  
  const stopGameTicker = useCallback(() => {
    if (gameTickerRef.current) {
      clearInterval(gameTickerRef.current);
    }
  }, []);
  
  // ========================================================================
  // CLEANUP
  // ========================================================================
  useEffect(() => {
    return () => {
      stopAutoSave();
      stopGameTicker();
    };
  }, [stopAutoSave, stopGameTicker]);
  
  return {
    sessionId,
    gameState,
    setGameState,
    startGame,
    pauseGame,
    resumeGame,
    updateProgress,
    completeGame,
    quitGame,
    saveProgress,
    isPlaying: gameState.status === 'playing',
    isPaused: gameState.isPaused,
    isCompleted: gameState.status === 'completed'
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

function getBrowserInfo(): string {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  
  if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
  else if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
  else if (ua.indexOf('Safari') > -1) browser = 'Safari';
  else if (ua.indexOf('Edge') > -1) browser = 'Edge';
  
  return browser;
}
```

---

### **Continue with remaining weeks...**

The file is quite extensive. Would you like me to:

1. **Continue creating the complete implementation file** with all phases detailed
2. **Create separate files** for each phase for better organization
3. **Focus on a specific game** (like Catapult) with complete code first

What would be most useful for you?
