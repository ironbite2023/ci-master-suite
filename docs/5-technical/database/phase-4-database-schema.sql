-- ============================================================================
-- PHASE 4 DATABASE SCHEMA
-- CI Master Suite - Advanced Tools & Enterprise Features
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CONTINUOUS IMPROVEMENT TOOLS
-- ============================================================================

-- PDCA Cycle Manager
CREATE TABLE IF NOT EXISTS pdca_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES ci_projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    objective TEXT NOT NULL,
    description TEXT,
    current_phase TEXT CHECK (current_phase IN ('plan', 'do', 'check', 'act')) DEFAULT 'plan',
    phase_data JSONB DEFAULT '{}',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    start_date DATE,
    target_date DATE,
    completion_date DATE,
    status TEXT CHECK (status IN ('active', 'completed', 'paused', 'cancelled')) DEFAULT 'active',
    metrics JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- A3 Problem Solving Reports
CREATE TABLE IF NOT EXISTS a3_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES ci_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    background TEXT,
    problem_statement TEXT,
    current_condition JSONB DEFAULT '{}',
    target_condition JSONB DEFAULT '{}',
    root_cause_analysis JSONB DEFAULT '{}',
    countermeasures JSONB DEFAULT '[]',
    implementation_plan JSONB DEFAULT '[]',
    follow_up JSONB DEFAULT '[]',
    status TEXT CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')) DEFAULT 'draft',
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5 Why Analysis
CREATE TABLE IF NOT EXISTS five_why_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES ci_projects(id) ON DELETE CASCADE,
    problem_statement TEXT NOT NULL,
    why_levels JSONB DEFAULT '[]',
    root_cause TEXT,
    countermeasures JSONB DEFAULT '[]',
    verification JSONB DEFAULT '{}',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kaizen Event Planner
CREATE TABLE IF NOT EXISTS kaizen_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES ci_projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    objective TEXT NOT NULL,
    scope TEXT,
    event_date DATE NOT NULL,
    duration_days INTEGER DEFAULT 5,
    team_members UUID[] DEFAULT '{}',
    pre_event_data JSONB DEFAULT '{}',
    event_activities JSONB DEFAULT '[]',
    post_event_results JSONB DEFAULT '{}',
    savings_target DECIMAL(12,2),
    savings_actual DECIMAL(12,2),
    status TEXT CHECK (status IN ('planning', 'in_progress', 'completed', 'cancelled')) DEFAULT 'planning',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gemba Walk Tracker
CREATE TABLE IF NOT EXISTS gemba_walks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    location TEXT NOT NULL,
    walk_date DATE NOT NULL,
    duration_minutes INTEGER,
    participants UUID[] DEFAULT '{}',
    observations JSONB DEFAULT '[]',
    issues_identified JSONB DEFAULT '[]',
    action_items JSONB DEFAULT '[]',
    follow_up_date DATE,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suggestion System
CREATE TABLE IF NOT EXISTS improvement_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    submitter_name TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    area TEXT,
    potential_savings DECIMAL(12,2),
    implementation_cost DECIMAL(12,2),
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    status TEXT CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected', 'implemented')) DEFAULT 'submitted',
    review_comments TEXT,
    implementation_date DATE,
    actual_savings DECIMAL(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SIX SIGMA TOOLS
-- ============================================================================

-- DMAIC Project Manager
CREATE TABLE IF NOT EXISTS dmaic_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    charter JSONB NOT NULL,
    current_phase TEXT CHECK (current_phase IN ('define', 'measure', 'analyze', 'improve', 'control')) DEFAULT 'define',
    phase_data JSONB DEFAULT '{}',
    team_members UUID[] DEFAULT '{}',
    sponsor TEXT,
    start_date DATE,
    target_date DATE,
    completion_date DATE,
    status TEXT CHECK (status IN ('active', 'on_hold', 'completed', 'cancelled')) DEFAULT 'active',
    financial_impact JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DMAIC Deliverables
CREATE TABLE IF NOT EXISTS dmaic_deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES dmaic_projects(id) ON DELETE CASCADE NOT NULL,
    phase TEXT NOT NULL CHECK (phase IN ('define', 'measure', 'analyze', 'improve', 'control')),
    deliverable_type TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'approved')) DEFAULT 'pending',
    data JSONB DEFAULT '{}',
    due_date DATE,
    completion_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Design of Experiments (DOE)
CREATE TABLE IF NOT EXISTS doe_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES dmaic_projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    design_type TEXT CHECK (design_type IN ('full_factorial', 'fractional_factorial', 'response_surface', 'plackett_burman', 'taguchi')) NOT NULL,
    factors JSONB NOT NULL DEFAULT '[]',
    responses JSONB NOT NULL DEFAULT '[]',
    design_matrix JSONB DEFAULT '{}',
    run_data JSONB DEFAULT '[]',
    analysis_results JSONB DEFAULT '{}',
    status TEXT CHECK (status IN ('design', 'data_collection', 'analysis', 'completed')) DEFAULT 'design',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Measurement System Analysis (MSA)
CREATE TABLE IF NOT EXISTS msa_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES dmaic_projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    study_type TEXT CHECK (study_type IN ('gage_rr', 'bias', 'linearity', 'stability', 'attribute')) NOT NULL,
    measurement_system TEXT NOT NULL,
    parts INTEGER,
    operators INTEGER,
    trials INTEGER,
    measurement_data JSONB DEFAULT '[]',
    specifications JSONB DEFAULT '{}',
    analysis_results JSONB DEFAULT '{}',
    acceptable BOOLEAN,
    certification_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fishbone/Ishikawa Diagrams
CREATE TABLE IF NOT EXISTS fishbone_diagrams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES ci_projects(id) ON DELETE CASCADE,
    problem_statement TEXT NOT NULL,
    categories JSONB DEFAULT '[]',
    causes JSONB DEFAULT '[]',
    diagram_layout TEXT CHECK (diagram_layout IN ('traditional', 'modern')) DEFAULT 'traditional',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pareto Analysis
CREATE TABLE IF NOT EXISTS pareto_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES ci_projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    data_points JSONB NOT NULL DEFAULT '[]',
    analysis_results JSONB DEFAULT '{}',
    eighty_twenty_items TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FMEA Analysis
CREATE TABLE IF NOT EXISTS fmea_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES dmaic_projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    fmea_type TEXT CHECK (fmea_type IN ('process', 'design', 'system')) NOT NULL,
    failure_modes JSONB DEFAULT '[]',
    rpn_threshold INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LEAN TOOLS
-- ============================================================================

-- Poka-Yoke Designer
CREATE TABLE IF NOT EXISTS poka_yoke_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES ci_projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    error_mode TEXT NOT NULL,
    device_type TEXT CHECK (device_type IN ('prevention', 'detection')) NOT NULL,
    category TEXT CHECK (category IN ('contact', 'fixed_value', 'motion_step')) NOT NULL,
    description TEXT,
    implementation_cost DECIMAL(12,2),
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 10),
    implementation_date DATE,
    status TEXT CHECK (status IN ('concept', 'approved', 'implemented', 'validated')) DEFAULT 'concept',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Takt Time Advanced
CREATE TABLE IF NOT EXISTS takt_time_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES ci_projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    products JSONB DEFAULT '[]',
    capacity_data JSONB DEFAULT '{}',
    line_balancing JSONB DEFAULT '{}',
    staffing_requirements JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROJECT MANAGEMENT
-- ============================================================================

-- CI Projects (parent table for all projects)
CREATE TABLE IF NOT EXISTS ci_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    project_type TEXT CHECK (project_type IN ('kaizen', 'dmaic', 'lean', 'general', 'a3', 'pdca')) DEFAULT 'general',
    status TEXT CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')) DEFAULT 'planning',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    team_members UUID[] DEFAULT '{}',
    tools_used TEXT[] DEFAULT '{}',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    roi_target DECIMAL(5,2),
    roi_actual DECIMAL(5,2),
    savings_target DECIMAL(12,2),
    savings_actual DECIMAL(12,2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    members UUID[] DEFAULT '{}',
    projects UUID[] DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Invitations
CREATE TABLE IF NOT EXISTS team_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    role TEXT CHECK (role IN ('owner', 'admin', 'member', 'viewer')) DEFAULT 'member',
    token TEXT UNIQUE NOT NULL,
    invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    accepted BOOLEAN DEFAULT FALSE,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Feed
CREATE TABLE IF NOT EXISTS activity_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES ci_projects(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE pdca_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE five_why_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE kaizen_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gemba_walks ENABLE ROW LEVEL SECURITY;
ALTER TABLE improvement_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmaic_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmaic_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE doe_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE msa_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE fishbone_diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE pareto_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE fmea_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE poka_yoke_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE takt_time_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ci_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can access their own data)

-- PDCA Cycles
CREATE POLICY "Users can view own PDCA cycles" ON pdca_cycles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own PDCA cycles" ON pdca_cycles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own PDCA cycles" ON pdca_cycles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own PDCA cycles" ON pdca_cycles FOR DELETE USING (auth.uid() = user_id);

-- A3 Reports
CREATE POLICY "Users can view own A3 reports" ON a3_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own A3 reports" ON a3_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own A3 reports" ON a3_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own A3 reports" ON a3_reports FOR DELETE USING (auth.uid() = user_id);

-- 5 Why Analyses
CREATE POLICY "Users can view own 5 Why analyses" ON five_why_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own 5 Why analyses" ON five_why_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own 5 Why analyses" ON five_why_analyses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own 5 Why analyses" ON five_why_analyses FOR DELETE USING (auth.uid() = user_id);

-- Kaizen Events
CREATE POLICY "Users can view own Kaizen events" ON kaizen_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own Kaizen events" ON kaizen_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own Kaizen events" ON kaizen_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own Kaizen events" ON kaizen_events FOR DELETE USING (auth.uid() = user_id);

-- Gemba Walks
CREATE POLICY "Users can view own Gemba walks" ON gemba_walks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own Gemba walks" ON gemba_walks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own Gemba walks" ON gemba_walks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own Gemba walks" ON gemba_walks FOR DELETE USING (auth.uid() = user_id);

-- Improvement Suggestions
CREATE POLICY "Users can view own suggestions" ON improvement_suggestions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own suggestions" ON improvement_suggestions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own suggestions" ON improvement_suggestions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own suggestions" ON improvement_suggestions FOR DELETE USING (auth.uid() = user_id);

-- DMAIC Projects
CREATE POLICY "Users can view own DMAIC projects" ON dmaic_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own DMAIC projects" ON dmaic_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own DMAIC projects" ON dmaic_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own DMAIC projects" ON dmaic_projects FOR DELETE USING (auth.uid() = user_id);

-- DMAIC Deliverables (access through project ownership)
CREATE POLICY "Users can view deliverables of own projects" ON dmaic_deliverables FOR SELECT 
  USING (EXISTS (SELECT 1 FROM dmaic_projects WHERE dmaic_projects.id = project_id AND dmaic_projects.user_id = auth.uid()));
CREATE POLICY "Users can insert deliverables to own projects" ON dmaic_deliverables FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM dmaic_projects WHERE dmaic_projects.id = project_id AND dmaic_projects.user_id = auth.uid()));
CREATE POLICY "Users can update deliverables of own projects" ON dmaic_deliverables FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM dmaic_projects WHERE dmaic_projects.id = project_id AND dmaic_projects.user_id = auth.uid()));
CREATE POLICY "Users can delete deliverables of own projects" ON dmaic_deliverables FOR DELETE 
  USING (EXISTS (SELECT 1 FROM dmaic_projects WHERE dmaic_projects.id = project_id AND dmaic_projects.user_id = auth.uid()));

-- DOE Designs
CREATE POLICY "Users can view own DOE designs" ON doe_designs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own DOE designs" ON doe_designs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own DOE designs" ON doe_designs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own DOE designs" ON doe_designs FOR DELETE USING (auth.uid() = user_id);

-- MSA Studies
CREATE POLICY "Users can view own MSA studies" ON msa_studies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own MSA studies" ON msa_studies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own MSA studies" ON msa_studies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own MSA studies" ON msa_studies FOR DELETE USING (auth.uid() = user_id);

-- Fishbone Diagrams
CREATE POLICY "Users can view own Fishbone diagrams" ON fishbone_diagrams FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own Fishbone diagrams" ON fishbone_diagrams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own Fishbone diagrams" ON fishbone_diagrams FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own Fishbone diagrams" ON fishbone_diagrams FOR DELETE USING (auth.uid() = user_id);

-- Pareto Analyses
CREATE POLICY "Users can view own Pareto analyses" ON pareto_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own Pareto analyses" ON pareto_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own Pareto analyses" ON pareto_analyses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own Pareto analyses" ON pareto_analyses FOR DELETE USING (auth.uid() = user_id);

-- FMEA Analyses
CREATE POLICY "Users can view own FMEA analyses" ON fmea_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own FMEA analyses" ON fmea_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own FMEA analyses" ON fmea_analyses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own FMEA analyses" ON fmea_analyses FOR DELETE USING (auth.uid() = user_id);

-- Poka-Yoke Devices
CREATE POLICY "Users can view own Poka-Yoke devices" ON poka_yoke_devices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own Poka-Yoke devices" ON poka_yoke_devices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own Poka-Yoke devices" ON poka_yoke_devices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own Poka-Yoke devices" ON poka_yoke_devices FOR DELETE USING (auth.uid() = user_id);

-- Takt Time Calculations
CREATE POLICY "Users can view own takt time calculations" ON takt_time_calculations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own takt time calculations" ON takt_time_calculations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own takt time calculations" ON takt_time_calculations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own takt time calculations" ON takt_time_calculations FOR DELETE USING (auth.uid() = user_id);

-- CI Projects
CREATE POLICY "Users can view own CI projects" ON ci_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own CI projects" ON ci_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own CI projects" ON ci_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own CI projects" ON ci_projects FOR DELETE USING (auth.uid() = user_id);

-- Teams
CREATE POLICY "Users can view teams they own or are members of" ON teams FOR SELECT 
  USING (auth.uid() = owner_id OR auth.uid() = ANY(members));
CREATE POLICY "Users can insert teams" ON teams FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update teams they own" ON teams FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete teams they own" ON teams FOR DELETE USING (auth.uid() = owner_id);

-- Team Invitations
CREATE POLICY "Users can view invitations to their email" ON team_invitations FOR SELECT 
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
CREATE POLICY "Team owners can manage invitations" ON team_invitations FOR ALL 
  USING (EXISTS (SELECT 1 FROM teams WHERE teams.id = team_id AND teams.owner_id = auth.uid()));

-- Activity Feed
CREATE POLICY "Users can view own activity" ON activity_feed FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON activity_feed FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_pdca_cycles_user_id ON pdca_cycles(user_id);
CREATE INDEX IF NOT EXISTS idx_pdca_cycles_project_id ON pdca_cycles(project_id);
CREATE INDEX IF NOT EXISTS idx_pdca_cycles_status ON pdca_cycles(status);

CREATE INDEX IF NOT EXISTS idx_a3_reports_user_id ON a3_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_a3_reports_project_id ON a3_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_a3_reports_status ON a3_reports(status);

CREATE INDEX IF NOT EXISTS idx_dmaic_projects_user_id ON dmaic_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_dmaic_projects_status ON dmaic_projects(status);
CREATE INDEX IF NOT EXISTS idx_dmaic_projects_phase ON dmaic_projects(current_phase);

CREATE INDEX IF NOT EXISTS idx_ci_projects_user_id ON ci_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_ci_projects_team_id ON ci_projects(team_id);
CREATE INDEX IF NOT EXISTS idx_ci_projects_status ON ci_projects(status);

CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);

CREATE INDEX IF NOT EXISTS idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_project_id ON activity_feed(project_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pdca_cycles_updated_at BEFORE UPDATE ON pdca_cycles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_a3_reports_updated_at BEFORE UPDATE ON a3_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_five_why_analyses_updated_at BEFORE UPDATE ON five_why_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kaizen_events_updated_at BEFORE UPDATE ON kaizen_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gemba_walks_updated_at BEFORE UPDATE ON gemba_walks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_improvement_suggestions_updated_at BEFORE UPDATE ON improvement_suggestions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dmaic_projects_updated_at BEFORE UPDATE ON dmaic_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doe_designs_updated_at BEFORE UPDATE ON doe_designs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_msa_studies_updated_at BEFORE UPDATE ON msa_studies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fishbone_diagrams_updated_at BEFORE UPDATE ON fishbone_diagrams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pareto_analyses_updated_at BEFORE UPDATE ON pareto_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fmea_analyses_updated_at BEFORE UPDATE ON fmea_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_poka_yoke_devices_updated_at BEFORE UPDATE ON poka_yoke_devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_takt_time_calculations_updated_at BEFORE UPDATE ON takt_time_calculations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ci_projects_updated_at BEFORE UPDATE ON ci_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PHASE 4 DATABASE SCHEMA COMPLETE
-- ============================================================================
