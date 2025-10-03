// ============================================================================
// GAMES TYPE DEFINITIONS
// Comprehensive types for the CI Master Games system
// ============================================================================

// Game Keys (unique identifiers)
export type GameKey =
  | 'catapult'
  | 'smed_challenge'
  | 'five_s_factory'
  | 'kanban_flow'
  | 'defect_detective'
  | 'vsm_puzzle'

export type GameCategory = 'lean' | 'six-sigma' | 'continuous-improvement'
export type GameDifficulty = 'beginner' | 'intermediate' | 'advanced'
export type GameStatus = 'in_progress' | 'completed' | 'abandoned' | 'paused'

// ============================================================================
// GAME ENTITY TYPES
// ============================================================================

export interface Game {
  id: string
  gameKey: GameKey
  title: string
  description: string | null
  shortDescription: string | null
  thumbnailUrl: string | null
  heroImageUrl: string | null
  learningObjectives: string[]
  difficultyLevels: GameDifficulty[]
  estimatedPlayTime: number
  category: GameCategory
  instructionsVideoUrl: string | null
  tutorialSteps: TutorialStep[] | null
  gameConfig: Record<string, unknown> | null
  isActive: boolean
  isFeatured: boolean
  isFree: boolean
  tags: string[] | null
  playCount: number
  averageRating: number
  createdAt: string
  updatedAt: string
}

export interface GameSession {
  id: string
  userId: string
  gameId: string
  difficultyLevel: GameDifficulty
  attemptNumber: number
  
  startedAt: string
  completedAt: string | null
  pausedDuration: number
  timeSpentSeconds: number | null
  
  status: GameStatus
  currentPhase: string | null
  sessionData: Record<string, unknown>
  
  finalScore: number | null
  maxPossibleScore: number | null
  scorePercentage: number | null
  performanceMetrics: GameMetrics
  
  mistakesMade: number
  hintsUsed: number
  tutorialCompleted: boolean
  learningMilestones: string[]
  
  deviceType: string | null
  browser: string | null
  screenResolution: string | null
  
  createdAt: string
  updatedAt: string
}

export interface GameAchievement {
  id: string
  gameId: string | null
  achievementKey: string
  
  title: string
  description: string
  badgeIconUrl: string | null
  badgeColor: string | null
  unlockMessage: string | null
  unlockCriteria: UnlockCriteria
  
  pointsAwarded: number
  badgeAwarded: boolean
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockCount: number
  unlockPercentage: number
  
  isSecret: boolean
  displayOrder: number
  isActive: boolean
  
  createdAt: string
}

export interface UserGameAchievement {
  id: string
  userId: string
  achievementId: string
  gameSessionId: string | null
  
  earnedAt: string
  pointsEarned: number
  
  isShared: boolean
  shareCount: number
  unlockContext: Record<string, unknown> | null
}

export interface GameLeaderboard {
  id: string
  gameId: string
  userId: string
  difficultyLevel: GameDifficulty
  
  bestScore: number
  bestScoreSessionId: string | null
  bestTimeSeconds: number | null
  bestAccuracy: number | null
  
  totalPlays: number
  totalCompletions: number
  averageScore: number | null
  improvementRate: number | null
  
  globalRank: number | null
  monthlyRank: number | null
  weeklyRank: number | null
  
  firstPlayedAt: string
  lastPlayedAt: string
  bestScoreAt: string
}

export interface GameRating {
  id: string
  gameId: string
  userId: string
  
  rating: number
  reviewText: string | null
  funRating: number | null
  educationalValue: number | null
  difficultyAppropriate: boolean | null
  
  helpfulCount: number
  notHelpfulCount: number
  isVerifiedPlayer: boolean
  isFlagged: boolean
  isFeatured: boolean
  
  createdAt: string
  updatedAt: string
}

export interface GameChallenge {
  id: string
  gameId: string
  challengerUserId: string
  challengedUserId: string
  
  difficultyLevel: GameDifficulty
  targetScore: number
  message: string | null
  
  status: 'pending' | 'accepted' | 'completed' | 'expired' | 'declined'
  challengerBestScore: number | null
  challengedBestScore: number | null
  winnerUserId: string | null
  
  createdAt: string
  expiresAt: string
  acceptedAt: string | null
  completedAt: string | null
}

export interface GameReplay {
  id: string
  gameSessionId: string
  userId: string
  gameId: string
  
  replayData: ReplayAction[]
  durationSeconds: number
  
  title: string | null
  description: string | null
  thumbnailUrl: string | null
  
  isPublic: boolean
  viewCount: number
  likeCount: number
  shareCount: number
  
  isFeatured: boolean
  featuredAt: string | null
  
  createdAt: string
}

// ============================================================================
// GAME STATE TYPES
// ============================================================================

export interface GameState {
  phase: string
  score: number
  maxScore: number
  timeElapsed: number
  isPaused: boolean
  isComplete: boolean
  mistakes: number
  hintsUsed: number
  achievements: string[]
  
  // Game-specific data
  data: Record<string, unknown>
}

export interface GameControls {
  isPaused: boolean
  isRunning: boolean
  canUndo: boolean
  canRedo: boolean
  canReset: boolean
  canHint: boolean
}

export interface GameMetrics {
  accuracy: number
  efficiency: number
  speed: number
  consistency: number
  improvementRate: number
  
  // Core game metrics
  score?: number
  timeElapsed?: number
  isPerfect?: boolean
  mistakes?: number
  consecutiveWins?: number
  totalPlays?: number
  
  // Game-specific metrics
  custom: Record<string, number>
}

// ============================================================================
// TUTORIAL & HELP TYPES
// ============================================================================

export interface TutorialStep {
  id: string
  title: string
  description: string
  targetElement: string | null
  position: 'top' | 'right' | 'bottom' | 'left'
  imageUrl: string | null
  videoUrl: string | null
  actionRequired: boolean
  actionText: string | null
  nextTrigger: 'click' | 'auto' | 'manual'
}

// ============================================================================
// ACHIEVEMENT & UNLOCK TYPES
// ============================================================================

export interface UnlockCriteria {
  type: 'score_threshold' | 'time_threshold' | 'accuracy_threshold' | 'streak' | 'completion_count' | 'custom'
  metric?: string
  value: number
  operator?: 'gte' | 'lte' | 'eq' | 'gt' | 'lt'
  conditions?: UnlockCriteria[]
  conditionLogic?: 'AND' | 'OR'
  // Additional properties for achievement evaluation
  minScore?: number
  maxTime?: number
  minAccuracy?: number
  perfectScore?: boolean
  noMistakes?: boolean
  consecutiveWins?: number
  totalPlays?: number
  specificConditions?: Record<string, unknown>
}

// ============================================================================
// REPLAY TYPES
// ============================================================================

export interface ReplayAction {
  timestamp: number
  type: string
  data: Record<string, unknown>
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface GameAnalytics {
  totalPlays: number
  totalCompletions: number
  averageScore: number
  averageTime: number
  completionRate: number
  averageRetries: number
  popularDifficulty: GameDifficulty
  peakPlayTime: string
  
  userRetention: {
    day1: number
    day7: number
    day30: number
  }
  
  achievementStats: {
    achievementId: string
    unlockRate: number
    averageAttemptsToUnlock: number
  }[]
}

// ============================================================================
// CATAPULT GAME TYPES
// ============================================================================

export interface CatapultSettings {
  angle: number
  power: number
  weight: number
  armLength: number
}

export interface Shot {
  id: string
  settings: CatapultSettings
  result: {
    distance: number
    accuracy: number
    targetHit: boolean
  }
  timestamp: number
}

export interface CatapultGameState extends GameState {
  data: {
    shots: Shot[]
    currentSettings: CatapultSettings
    targetDistance: number
    bestShot: Shot | null
    cpk: number | null
    sigma: number | null
  }
}

// ============================================================================
// DOE (Design of Experiments) TYPES
// ============================================================================

export interface DOEDesign {
  type: 'full_factorial' | 'fractional_factorial' | 'one_factor_at_a_time'
  factors: {
    name: string
    low: number
    high: number
  }[]
  runs: DOERun[]
}

export interface DOERun {
  runNumber: number
  factorValues: Record<string, number>
  result: number | null
  completed: boolean
}

export interface DOEResult {
  mainEffects: Record<string, number>
  interactions: Record<string, number>
  optimalSettings: Record<string, number>
  predictedResult: number
}

// ============================================================================
// SMED GAME TYPES
// ============================================================================

export interface ChangeoverActivity {
  id: string
  name: string
  type: 'internal' | 'external' | 'parallel'
  originalDuration: number
  optimizedDuration: number | null
  canConvertToExternal: boolean
  canParallelize: boolean
  order: number
  dependencies: string[]
}

export interface SMEDGameState extends GameState {
  data: {
    activities: ChangeoverActivity[]
    totalTime: number
    targetTime: number
    reductionPercentage: number
    phase: 'analysis' | 'optimization' | 'validation'
  }
}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

export interface HUDData {
  score: number
  time: string
  timeElapsed?: number
  level?: number
  streak?: number
  accuracy?: number
  achievements?: number
  message?: string
  phase: string
  objective: string
  hints: number
  progress: number
}

export interface ModalData {
  type: 'tutorial' | 'hint' | 'achievement' | 'completion' | 'pause' | 'start' | 'complete' | 'gameover' | 'custom'
  title: string
  description?: string
  content?: string | React.ReactNode
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  instructions?: string[]
  stats?: {
    bestScore?: number
    avgScore?: number
    totalPlays?: number
  }
  score?: number
  timeElapsed?: number
  progress?: number
  level?: number
  isNewBest?: boolean
  rank?: number | null
  accuracy?: number
  achievements?: Array<{ name: string; icon?: string; description?: string; points?: number }>
  tip?: string
  steps?: Array<{ title: string; description: string; image?: string }>
  actions?: {
    label: string
    value?: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'destructive'
  }[]
}

export interface SoundEffect {
  key: string
  src: string
  volume?: number
  loop?: boolean
}

export interface VisualEffect {
  type: 'confetti' | 'particles' | 'flash' | 'shake' | 'glow'
  target?: string
  duration?: number
  options?: Record<string, unknown>
}

// ============================================================================
// HOOK TYPES
// ============================================================================

export interface UseGameSessionOptions {
  gameKey: GameKey
  difficulty: GameDifficulty
  autoSaveInterval?: number
  onAchievementUnlocked?: (achievement: GameAchievement) => void
  onLeaderboardUpdate?: (entry: GameLeaderboard) => void
}

export interface UseGameSessionReturn {
  // State
  sessionId: string | null
  gameState: GameState
  gameControls: GameControls
  isLoading: boolean
  error: string | null
  
  // Actions
  startGame: (initialData?: Record<string, unknown>) => Promise<void>
  pauseGame: () => void
  resumeGame: () => void
  updateProgress: (updates: Partial<GameState>, sessionData?: Record<string, unknown>) => Promise<void>
  completeGame: (finalScore: number, metrics: GameMetrics, sessionData: Record<string, unknown>) => Promise<void>
  quitGame: () => Promise<void>
  saveProgress: () => Promise<void>
  
  // Auto-save control
  startAutoSave: () => void
  stopAutoSave: () => void
}
