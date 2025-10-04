/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/client'
import type {
  GameAchievement,
  UserGameAchievement,
  UnlockCriteria,
  GameMetrics
} from '@/types/games'

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

const supabase = createClient() as any

// ============================================================================
// ACHIEVEMENT ENGINE
// ============================================================================

export const achievementEngine = {
  // ========================================
  // FETCH GAME ACHIEVEMENTS
  // ========================================
  async getGameAchievements(gameId: string): Promise<GameAchievement[]> {
    const { data, error } = await supabase
      .from('game_achievements')
      .select('*')
      .eq('game_id', gameId)
      .order('points', { ascending: false })
    
    if (error) {
      throw new Error(`Failed to fetch achievements: ${error.message}`)
    }
    
    return data as GameAchievement[]
  },
  
  // ========================================
  // FETCH USER ACHIEVEMENTS
  // ========================================
  async getUserAchievements(
    userId: string,
    gameId?: string
  ): Promise<UserGameAchievement[]> {
    let query = supabase
      .from('user_game_achievements')
      .select(`
        *,
        achievement:game_achievements(*)
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })
    
    if (gameId) {
      query = query.eq('game_id', gameId)
    }
    
    const { data, error } = await query
    
    if (error) {
      throw new Error(`Failed to fetch user achievements: ${error.message}`)
    }
    
    return data as UserGameAchievement[]
  },
  
  // ========================================
  // CHECK IF USER HAS ACHIEVEMENT
  // ========================================
  async hasAchievement(
    userId: string,
    achievementId: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_game_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return false // Not found
      throw new Error(`Failed to check achievement: ${error.message}`)
    }
    
    return !!data
  },
  
  // ========================================
  // UNLOCK ACHIEVEMENT
  // ========================================
  async unlockAchievement(
    userId: string,
    gameId: string,
    achievementId: string
  ): Promise<UserGameAchievement> {
    // Check if already unlocked
    const hasIt = await this.hasAchievement(userId, achievementId)
    
    if (hasIt) {
      throw new Error('Achievement already unlocked')
    }
    
    // Unlock achievement
    const { data, error } = await supabase
      .from('user_game_achievements')
      .insert({
        user_id: userId,
        game_id: gameId,
        achievement_id: achievementId,
        unlocked_at: new Date().toISOString()
      })
      .select(`
        *,
        achievement:game_achievements(*)
      `)
      .single()
    
    if (error) {
      throw new Error(`Failed to unlock achievement: ${error.message}`)
    }
    
    return data as UserGameAchievement
  },
  
  // ========================================
  // EVALUATE CRITERIA
  // ========================================
  evaluateCriteria(criteria: UnlockCriteria, metrics: GameMetrics): boolean {
    // Min score
    if (criteria.minScore !== undefined && metrics.score !== undefined && metrics.score < criteria.minScore) {
      return false
    }
    
    // Max time
    if (criteria.maxTime !== undefined && metrics.timeElapsed !== undefined && metrics.timeElapsed > criteria.maxTime) {
      return false
    }
    
    // Min accuracy
    if (
      criteria.minAccuracy !== undefined &&
      metrics.accuracy !== undefined &&
      metrics.accuracy < criteria.minAccuracy
    ) {
      return false
    }
    
    // Perfect score
    if (criteria.perfectScore && !metrics.isPerfect) {
      return false
    }
    
    // No mistakes
    if (criteria.noMistakes && metrics.mistakes && metrics.mistakes > 0) {
      return false
    }
    
    // Consecutive wins
    if (
      criteria.consecutiveWins !== undefined &&
      metrics.consecutiveWins !== undefined &&
      metrics.consecutiveWins < criteria.consecutiveWins
    ) {
      return false
    }
    
    // Total plays
    if (
      criteria.totalPlays !== undefined &&
      metrics.totalPlays !== undefined &&
      metrics.totalPlays < criteria.totalPlays
    ) {
      return false
    }
    
    // Specific conditions (custom logic per game)
    if (criteria.specificConditions) {
      for (const [key, value] of Object.entries(criteria.specificConditions)) {
        const metricValue = (metrics as unknown as Record<string, unknown>)[key]
        
        if (metricValue === undefined || metricValue === null) return false
        
        // Support different comparison types
        if (typeof value === 'object' && value !== null) {
          // Complex condition: { operator: 'gte', value: 10 }
          const condition = value as { operator: string; value: number | string | boolean }
          
          switch (condition.operator) {
            case 'eq':
              if (metricValue !== condition.value) return false
              break
            case 'ne':
              if (metricValue === condition.value) return false
              break
            case 'gt':
              if (metricValue <= condition.value) return false
              break
            case 'gte':
              if (metricValue < condition.value) return false
              break
            case 'lt':
              if (metricValue >= condition.value) return false
              break
            case 'lte':
              if (metricValue > condition.value) return false
              break
            default:
              return false
          }
        } else {
          // Simple equality check
          if (metricValue !== value) return false
        }
      }
    }
    
    // All criteria passed
    return true
  },
  
  // ========================================
  // CHECK AND UNLOCK ACHIEVEMENTS
  // ========================================
  async checkAndUnlockAchievements(
    userId: string,
    gameId: string,
    metrics: GameMetrics
  ): Promise<UserGameAchievement[]> {
    // Fetch all achievements for this game
    const achievements = await this.getGameAchievements(gameId)
    
    // Fetch user's current achievements
    const userAchievements = await this.getUserAchievements(userId, gameId)
    const unlockedIds = new Set(
      userAchievements.map(ua => ua.achievementId)
    )
    
    // Check each achievement
    const newlyUnlocked: UserGameAchievement[] = []
    
    for (const achievement of achievements) {
      // Skip if already unlocked
      if (unlockedIds.has(achievement.id)) continue
      
      // Evaluate criteria
      const criteria = achievement.unlockCriteria as UnlockCriteria
      const isUnlocked = this.evaluateCriteria(criteria, metrics)
      
      if (isUnlocked) {
        try {
          const userAchievement = await this.unlockAchievement(
            userId,
            gameId,
            achievement.id
          )
          newlyUnlocked.push(userAchievement)
        } catch (error) {
          console.error(`Failed to unlock achievement ${achievement.id}:`, error)
        }
      }
    }
    
    return newlyUnlocked
  },
  
  // ========================================
  // GET ACHIEVEMENT PROGRESS
  // ========================================
  getAchievementProgress(
    criteria: UnlockCriteria,
    metrics: GameMetrics
  ): {
    total: number
    completed: number
    percentage: number
    breakdown: Array<{ criterion: string; current: number; target: number; completed: boolean }>
  } {
    const breakdown: Array<{
      criterion: string
      current: number
      target: number
      completed: boolean
    }> = []
    
    // Min score
    if (criteria.minScore !== undefined && metrics.score !== undefined) {
      breakdown.push({
        criterion: 'Minimum Score',
        current: metrics.score,
        target: criteria.minScore,
        completed: metrics.score >= criteria.minScore
      })
    }
    
    // Max time
    if (criteria.maxTime !== undefined && metrics.timeElapsed !== undefined) {
      breakdown.push({
        criterion: 'Time Limit',
        current: metrics.timeElapsed,
        target: criteria.maxTime,
        completed: metrics.timeElapsed <= criteria.maxTime
      })
    }
    
    // Min accuracy
    if (criteria.minAccuracy !== undefined && metrics.accuracy !== undefined) {
      breakdown.push({
        criterion: 'Minimum Accuracy',
        current: metrics.accuracy,
        target: criteria.minAccuracy,
        completed: metrics.accuracy >= criteria.minAccuracy
      })
    }
    
    // Perfect score
    if (criteria.perfectScore) {
      breakdown.push({
        criterion: 'Perfect Score',
        current: metrics.isPerfect ? 1 : 0,
        target: 1,
        completed: metrics.isPerfect || false
      })
    }
    
    // No mistakes
    if (criteria.noMistakes) {
      breakdown.push({
        criterion: 'No Mistakes',
        current: metrics.mistakes || 0,
        target: 0,
        completed: (metrics.mistakes || 0) === 0
      })
    }
    
    // Consecutive wins
    if (criteria.consecutiveWins !== undefined && metrics.consecutiveWins !== undefined) {
      breakdown.push({
        criterion: 'Consecutive Wins',
        current: metrics.consecutiveWins,
        target: criteria.consecutiveWins,
        completed: metrics.consecutiveWins >= criteria.consecutiveWins
      })
    }
    
    // Total plays
    if (criteria.totalPlays !== undefined && metrics.totalPlays !== undefined) {
      breakdown.push({
        criterion: 'Total Plays',
        current: metrics.totalPlays,
        target: criteria.totalPlays,
        completed: metrics.totalPlays >= criteria.totalPlays
      })
    }
    
    const total = breakdown.length
    const completed = breakdown.filter(b => b.completed).length
    const percentage = total > 0 ? (completed / total) * 100 : 0
    
    return {
      total,
      completed,
      percentage,
      breakdown
    }
  },
  
  // ========================================
  // GET USER ACHIEVEMENT STATS
  // ========================================
  async getUserAchievementStats(
    userId: string,
    gameId?: string
  ): Promise<{
    totalEarned: number
    totalPoints: number
    recentAchievements: UserGameAchievement[]
    rareAchievements: UserGameAchievement[]
  }> {
    const userAchievements = await this.getUserAchievements(userId, gameId)
    
    const totalEarned = userAchievements.length
    const totalPoints = userAchievements.reduce(
      (sum, ua) => sum + ua.pointsEarned,
      0
    )
    
    // Recent (last 5)
    const recentAchievements = userAchievements.slice(0, 5)
    
    // Rare achievements - would need to join with game_achievements table
    // For now, return empty array as we don't have rarity info in UserGameAchievement
    const rareAchievements: UserGameAchievement[] = []
    
    return {
      totalEarned,
      totalPoints,
      recentAchievements,
      rareAchievements
    }
  }
}

// ============================================================================
// PREDEFINED ACHIEVEMENT TEMPLATES
// ============================================================================

export const ACHIEVEMENT_TEMPLATES: Record<string, Partial<GameAchievement>> = {
  firstWin: {
    title: 'First Victory',
    description: 'Complete your first game',
    badgeIconUrl: '/achievements/first-win.svg',
    pointsAwarded: 10,
    rarity: 'common',
    unlockCriteria: {
      type: 'completion_count',
      value: 1,
      totalPlays: 1
    }
  },
  
  perfectionist: {
    title: 'Perfectionist',
    description: 'Achieve a perfect score',
    badgeIconUrl: '/achievements/perfect.svg',
    pointsAwarded: 50,
    rarity: 'rare',
    unlockCriteria: {
      type: 'custom',
      value: 1,
      perfectScore: true
    }
  },
  
  speedRunner: {
    title: 'Speed Runner',
    description: 'Complete the game in record time',
    badgeIconUrl: '/achievements/speed.svg',
    pointsAwarded: 30,
    rarity: 'rare',
    unlockCriteria: {
      type: 'time_threshold',
      value: 60,
      operator: 'lte',
      maxTime: 60
    }
  },
  
  flawless: {
    title: 'Flawless',
    description: 'Complete without any mistakes',
    badgeIconUrl: '/achievements/flawless.svg',
    pointsAwarded: 40,
    rarity: 'rare',
    unlockCriteria: {
      type: 'custom',
      value: 1,
      noMistakes: true
    }
  },
  
  highScorer: {
    title: 'High Scorer',
    description: 'Achieve a high score',
    badgeIconUrl: '/achievements/high-score.svg',
    pointsAwarded: 25,
    rarity: 'rare',
    unlockCriteria: {
      type: 'score_threshold',
      value: 1000,
      operator: 'gte',
      minScore: 1000
    }
  },
  
  streakMaster: {
    title: 'Streak Master',
    description: 'Win multiple games in a row',
    badgeIconUrl: '/achievements/streak.svg',
    pointsAwarded: 60,
    rarity: 'epic',
    unlockCriteria: {
      type: 'streak',
      value: 5,
      consecutiveWins: 5
    }
  },
  
  dedicated: {
    title: 'Dedicated Player',
    description: 'Play the game many times',
    badgeIconUrl: '/achievements/dedicated.svg',
    pointsAwarded: 35,
    rarity: 'rare',
    unlockCriteria: {
      type: 'completion_count',
      value: 50,
      totalPlays: 50
    }
  },
  
  master: {
    title: 'Master',
    description: 'Complete the game with mastery',
    badgeIconUrl: '/achievements/master.svg',
    pointsAwarded: 100,
    rarity: 'legendary',
    unlockCriteria: {
      type: 'custom',
      value: 1,
      conditions: [
        {
          type: 'score_threshold',
          value: 5000,
          operator: 'gte',
          minScore: 5000
        },
        {
          type: 'accuracy_threshold',
          value: 95,
          operator: 'gte',
          minAccuracy: 95
        }
      ],
      conditionLogic: 'AND'
    }
  }
}

// ============================================================================
// HELPER: Create Achievement from Template
// ============================================================================

export function createAchievementFromTemplate(
  templateKey: string,
  gameId: string,
  overrides?: Partial<GameAchievement>
): Partial<GameAchievement> {
  const template = ACHIEVEMENT_TEMPLATES[templateKey]
  
  if (!template) {
    throw new Error(`Achievement template not found: ${templateKey}`)
  }
  
  return {
    ...template,
    gameId: gameId,
    ...overrides
  }
}
