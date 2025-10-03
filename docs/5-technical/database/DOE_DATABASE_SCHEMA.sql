-- ============================================================================
-- DOE MODE DATABASE SCHEMA (OPTIONAL ENHANCEMENT)
-- ============================================================================
-- This is OPTIONAL - the DOE mode works perfectly with localStorage only.
-- Add this if you want cross-device sync, history, and social features.

-- ============================================================================
-- DOE SESSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS doe_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL DEFAULT 'catapult',
  
  -- Session metadata
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  
  -- Experiment data
  experiments JSONB NOT NULL, -- Array of 8 DOEExperiment objects
  
  -- Analysis results (populated when complete)
  main_effects JSONB,
  interactions JSONB,
  optimal_settings JSONB,
  
  -- Metadata
  device_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for querying user's sessions
CREATE INDEX idx_doe_sessions_user_id ON doe_sessions(user_id);
CREATE INDEX idx_doe_sessions_status ON doe_sessions(status);
CREATE INDEX idx_doe_sessions_completed_at ON doe_sessions(completed_at);

-- ============================================================================
-- DOE RESULTS TABLE (Individual experiment results)
-- ============================================================================
CREATE TABLE IF NOT EXISTS doe_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES doe_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Experiment details
  run_number INTEGER NOT NULL CHECK (run_number BETWEEN 1 AND 8),
  angle_level TEXT NOT NULL CHECK (angle_level IN ('low', 'high')),
  force_level TEXT NOT NULL CHECK (force_level IN ('low', 'high')),
  weight_level TEXT NOT NULL CHECK (weight_level IN ('low', 'high')),
  angle_value NUMERIC NOT NULL,
  force_value NUMERIC NOT NULL,
  weight_value TEXT NOT NULL,
  
  -- Results
  distance NUMERIC NOT NULL,
  accuracy NUMERIC NOT NULL,
  score INTEGER NOT NULL,
  
  -- Timing
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(session_id, run_number)
);

-- Index for querying session results
CREATE INDEX idx_doe_results_session_id ON doe_results(session_id);
CREATE INDEX idx_doe_results_user_id ON doe_results(user_id);

-- ============================================================================
-- DOE ACHIEVEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS doe_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  achievement_type TEXT NOT NULL CHECK (achievement_type IN (
    'first_complete',
    'perfect_run',
    'ten_complete',
    'optimal_finder',
    'data_master'
  )),
  
  achieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB,
  
  UNIQUE(user_id, achievement_type)
);

CREATE INDEX idx_doe_achievements_user_id ON doe_achievements(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE doe_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE doe_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE doe_achievements ENABLE ROW LEVEL SECURITY;

-- DOE Sessions Policies
CREATE POLICY "Users can view own DOE sessions"
  ON doe_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own DOE sessions"
  ON doe_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own DOE sessions"
  ON doe_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- DOE Results Policies
CREATE POLICY "Users can view own DOE results"
  ON doe_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own DOE results"
  ON doe_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- DOE Achievements Policies
CREATE POLICY "Users can view own achievements"
  ON doe_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON doe_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_doe_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER doe_sessions_updated_at
  BEFORE UPDATE ON doe_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_doe_session_timestamp();

-- Auto-complete session when all 8 experiments done
CREATE OR REPLACE FUNCTION check_doe_completion()
RETURNS TRIGGER AS $$
DECLARE
  result_count INTEGER;
BEGIN
  -- Count completed results for this session
  SELECT COUNT(*) INTO result_count
  FROM doe_results
  WHERE session_id = NEW.session_id;
  
  -- If all 8 complete, mark session as complete
  IF result_count = 8 THEN
    UPDATE doe_sessions
    SET status = 'completed',
        completed_at = NOW()
    WHERE id = NEW.session_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER doe_results_completion_check
  AFTER INSERT ON doe_results
  FOR EACH ROW
  EXECUTE FUNCTION check_doe_completion();

-- ============================================================================
-- HELPER VIEWS
-- ============================================================================

-- User DOE Statistics
CREATE OR REPLACE VIEW user_doe_stats AS
SELECT 
  user_id,
  COUNT(*) as total_sessions,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_sessions,
  COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_sessions,
  MIN(completed_at) as first_completion,
  MAX(completed_at) as last_completion,
  AVG(
    CASE WHEN status = 'completed' 
    THEN EXTRACT(EPOCH FROM (completed_at - started_at))/60 
    END
  ) as avg_completion_time_minutes
FROM doe_sessions
GROUP BY user_id;

-- Global DOE Leaderboard (best optimal settings)
CREATE OR REPLACE VIEW doe_leaderboard AS
SELECT 
  ds.user_id,
  ds.id as session_id,
  ds.completed_at,
  ds.optimal_settings->>'angle' as optimal_angle,
  ds.optimal_settings->>'force' as optimal_force,
  ds.optimal_settings->>'weight' as optimal_weight,
  (ds.main_effects->>'angle')::numeric as angle_effect,
  (ds.main_effects->>'force')::numeric as force_effect,
  (ds.main_effects->>'weight')::numeric as weight_effect,
  GREATEST(
    ABS((ds.main_effects->>'angle')::numeric),
    ABS((ds.main_effects->>'force')::numeric),
    ABS((ds.main_effects->>'weight')::numeric)
  ) as max_effect_size,
  ROW_NUMBER() OVER (ORDER BY ds.completed_at ASC) as completion_rank
FROM doe_sessions ds
WHERE ds.status = 'completed'
  AND ds.optimal_settings IS NOT NULL
ORDER BY ds.completed_at DESC;

-- ============================================================================
-- SAMPLE QUERIES
-- ============================================================================

-- Get user's most recent DOE session
-- SELECT * FROM doe_sessions 
-- WHERE user_id = auth.uid() 
-- ORDER BY created_at DESC 
-- LIMIT 1;

-- Get all results for a specific session
-- SELECT * FROM doe_results 
-- WHERE session_id = 'session-id-here' 
-- ORDER BY run_number;

-- Get user's achievements
-- SELECT * FROM doe_achievements 
-- WHERE user_id = auth.uid() 
-- ORDER BY achieved_at DESC;

-- Get user's DOE statistics
-- SELECT * FROM user_doe_stats 
-- WHERE user_id = auth.uid();

-- Get top 10 on leaderboard
-- SELECT * FROM doe_leaderboard 
-- LIMIT 10;
