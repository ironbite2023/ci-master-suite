/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/client'
import type { GameLeaderboard, GameDifficulty } from '@/types/games'

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

const supabase = createClient() as any

// ============================================================================
// LEADERBOARD SERVICE
// ============================================================================

export const leaderboardService = {
  // ========================================
  // UPSERT LEADERBOARD ENTRY
  // ========================================
  async upsertLeaderboardEntry(
    userId: string,
    gameId: string,
    score: number,
    difficulty: GameDifficulty,
    timeElapsed: number,
    metadata?: Record<string, unknown>
  ): Promise<GameLeaderboard> {
    // Check if user already has an entry
    const { data: existing, error: fetchError } = await supabase
      .from('game_leaderboard')
      .select('*')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .eq('difficulty', difficulty)
      .single()
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(`Failed to check leaderboard: ${fetchError.message}`)
    }
    
    // Only update if new score is better
    if (existing) {
      if (score <= existing.score) {
        // New score is not better, return existing
        return existing as GameLeaderboard
      }
      
      // Update with better score
      const { data, error } = await supabase
        .from('game_leaderboard')
        .update({
          score,
          time_elapsed: timeElapsed,
          metadata: metadata || existing.metadata,
          achieved_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single()
      
      if (error) {
        throw new Error(`Failed to update leaderboard: ${error.message}`)
      }
      
      return data as GameLeaderboard
    }
    
    // Create new entry
    const { data, error } = await supabase
      .from('game_leaderboard')
      .insert({
        user_id: userId,
        game_id: gameId,
        score,
        difficulty,
        time_elapsed: timeElapsed,
        metadata: metadata || {},
        achieved_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      throw new Error(`Failed to create leaderboard entry: ${error.message}`)
    }
    
    return data as GameLeaderboard
  },
  
  // ========================================
  // GET GLOBAL LEADERBOARD
  // ========================================
  async getGlobalLeaderboard(
    gameId: string,
    difficulty?: GameDifficulty,
    limit: number = 100
  ): Promise<GameLeaderboard[]> {
    let query = supabase
      .from('game_leaderboard')
      .select(`
        *,
        user:users(id, email, full_name, avatar_url)
      `)
      .eq('game_id', gameId)
      .order('score', { ascending: false })
      .limit(limit)
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }
    
    const { data, error } = await query
    
    if (error) {
      throw new Error(`Failed to fetch global leaderboard: ${error.message}`)
    }
    
    return data as GameLeaderboard[]
  },
  
  // ========================================
  // GET USER RANK
  // ========================================
  async getUserRank(
    userId: string,
    gameId: string,
    difficulty?: GameDifficulty
  ): Promise<{
    rank: number | null
    totalPlayers: number
    percentile: number
    entry: GameLeaderboard | null
  }> {
    // Get user's entry
    let userQuery = supabase
      .from('game_leaderboard')
      .select('*')
      .eq('user_id', userId)
      .eq('game_id', gameId)
    
    if (difficulty) {
      userQuery = userQuery.eq('difficulty', difficulty)
    }
    
    const { data: userEntry, error: userError } = await userQuery.single()
    
    if (userError) {
      if (userError.code === 'PGRST116') {
        return { rank: null, totalPlayers: 0, percentile: 0, entry: null }
      }
      throw new Error(`Failed to fetch user entry: ${userError.message}`)
    }
    
    // Count players with higher scores
    let rankQuery = supabase
      .from('game_leaderboard')
      .select('id', { count: 'exact', head: true })
      .eq('game_id', gameId)
      .gt('score', userEntry.score)
    
    if (difficulty) {
      rankQuery = rankQuery.eq('difficulty', difficulty)
    }
    
    const { count: higherCount, error: rankError } = await rankQuery
    
    if (rankError) {
      throw new Error(`Failed to calculate rank: ${rankError.message}`)
    }
    
    // Count total players
    let totalQuery = supabase
      .from('game_leaderboard')
      .select('id', { count: 'exact', head: true })
      .eq('game_id', gameId)
    
    if (difficulty) {
      totalQuery = totalQuery.eq('difficulty', difficulty)
    }
    
    const { count: totalPlayers, error: totalError } = await totalQuery
    
    if (totalError) {
      throw new Error(`Failed to count players: ${totalError.message}`)
    }
    
    const rank = (higherCount || 0) + 1
    const percentile = totalPlayers
      ? ((totalPlayers - rank) / totalPlayers) * 100
      : 0
    
    return {
      rank,
      totalPlayers: totalPlayers || 0,
      percentile,
      entry: userEntry as GameLeaderboard
    }
  },
  
  // ========================================
  // GET LEADERBOARD AROUND USER
  // ========================================
  async getLeaderboardAroundUser(
    userId: string,
    gameId: string,
    difficulty?: GameDifficulty,
    range: number = 5
  ): Promise<{
    above: GameLeaderboard[]
    user: GameLeaderboard | null
    below: GameLeaderboard[]
  }> {
    // Get user's entry
    const { entry: userEntry } = await this.getUserRank(userId, gameId, difficulty)
    
    if (!userEntry) {
      return { above: [], user: null, below: [] }
    }
    
    // Get entries above user
    let aboveQuery = supabase
      .from('game_leaderboard')
      .select(`
        *,
        user:users(id, email, full_name, avatar_url)
      `)
      .eq('game_id', gameId)
      .gt('best_score', userEntry.bestScore)
      .order('best_score', { ascending: true })
      .limit(range)
    
    if (difficulty) {
      aboveQuery = aboveQuery.eq('difficulty', difficulty)
    }
    
    const { data: above, error: aboveError } = await aboveQuery
    
    if (aboveError) {
      throw new Error(`Failed to fetch leaderboard above: ${aboveError.message}`)
    }
    
    // Get entries below user
    let belowQuery = supabase
      .from('game_leaderboard')
      .select(`
        *,
        user:users(id, email, full_name, avatar_url)
      `)
      .eq('game_id', gameId)
      .lt('best_score', userEntry.bestScore)
      .order('best_score', { ascending: false })
      .limit(range)
    
    if (difficulty) {
      belowQuery = belowQuery.eq('difficulty', difficulty)
    }
    
    const { data: below, error: belowError } = await belowQuery
    
    if (belowError) {
      throw new Error(`Failed to fetch leaderboard below: ${belowError.message}`)
    }
    
    return {
      above: (above as GameLeaderboard[]).reverse(),
      user: userEntry as GameLeaderboard,
      below: below as GameLeaderboard[]
    }
  },
  
  // ========================================
  // GET TOP PLAYERS
  // ========================================
  async getTopPlayers(
    gameId: string,
    difficulty?: GameDifficulty,
    limit: number = 10
  ): Promise<GameLeaderboard[]> {
    return this.getGlobalLeaderboard(gameId, difficulty, limit)
  },
  
  // ========================================
  // GET FRIENDS LEADERBOARD
  // ========================================
  async getFriendsLeaderboard(
    userId: string,
    friendIds: string[],
    gameId: string,
    difficulty?: GameDifficulty
  ): Promise<GameLeaderboard[]> {
    // Include the user in the list
    const allIds = [userId, ...friendIds]
    
    let query = supabase
      .from('game_leaderboard')
      .select(`
        *,
        user:users(id, email, full_name, avatar_url)
      `)
      .eq('game_id', gameId)
      .in('user_id', allIds)
      .order('score', { ascending: false })
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }
    
    const { data, error } = await query
    
    if (error) {
      throw new Error(`Failed to fetch friends leaderboard: ${error.message}`)
    }
    
    return data as GameLeaderboard[]
  },
  
  // ========================================
  // GET LEADERBOARD STATS
  // ========================================
  async getLeaderboardStats(
    gameId: string,
    difficulty?: GameDifficulty
  ): Promise<{
    totalPlayers: number
    averageScore: number
    highestScore: number
    lowestScore: number
    medianScore: number
  }> {
    let query = supabase
      .from('game_leaderboard')
      .select('score')
      .eq('game_id', gameId)
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }
    
    const { data, error } = await query
    
    if (error) {
      throw new Error(`Failed to fetch leaderboard stats: ${error.message}`)
    }
    
    if (!data || data.length === 0) {
      return {
        totalPlayers: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        medianScore: 0
      }
    }
    
    const scores = data.map((entry: any) => entry.score).sort((a: number, b: number) => a - b)
    const totalPlayers = scores.length
    const sum = scores.reduce((acc: number, score: number) => acc + score, 0)
    const averageScore = sum / totalPlayers
    const highestScore = scores[scores.length - 1]
    const lowestScore = scores[0]
    const medianScore =
      totalPlayers % 2 === 0
        ? (scores[totalPlayers / 2 - 1] + scores[totalPlayers / 2]) / 2
        : scores[Math.floor(totalPlayers / 2)]
    
    return {
      totalPlayers,
      averageScore,
      highestScore,
      lowestScore,
      medianScore
    }
  },
  
  // ========================================
  // GET TIME-BASED LEADERBOARD
  // ========================================
  async getTimeBasedLeaderboard(
    gameId: string,
    timeRange: 'daily' | 'weekly' | 'monthly' | 'all-time',
    difficulty?: GameDifficulty,
    limit: number = 100
  ): Promise<GameLeaderboard[]> {
    const now = new Date()
    let startDate: Date
    
    switch (timeRange) {
      case 'daily':
        startDate = new Date(now.setHours(0, 0, 0, 0))
        break
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - 7))
        break
      case 'monthly':
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        break
      case 'all-time':
      default:
        return this.getGlobalLeaderboard(gameId, difficulty, limit)
    }
    
    let query = supabase
      .from('game_leaderboard')
      .select(`
        *,
        user:users(id, email, full_name, avatar_url)
      `)
      .eq('game_id', gameId)
      .gte('achieved_at', startDate.toISOString())
      .order('score', { ascending: false })
      .limit(limit)
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }
    
    const { data, error } = await query
    
    if (error) {
      throw new Error(`Failed to fetch time-based leaderboard: ${error.message}`)
    }
    
    return data as GameLeaderboard[]
  },
  
  // ========================================
  // CLEAR USER ENTRY
  // ========================================
  async clearUserEntry(
    userId: string,
    gameId: string,
    difficulty?: GameDifficulty
  ): Promise<void> {
    let query = supabase
      .from('game_leaderboard')
      .delete()
      .eq('user_id', userId)
      .eq('game_id', gameId)
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }
    
    const { error } = await query
    
    if (error) {
      throw new Error(`Failed to clear user entry: ${error.message}`)
    }
  }
}

// ============================================================================
// LEADERBOARD FORMATTING HELPERS
// ============================================================================

export const leaderboardFormatters = {
  /**
   * Format rank with ordinal suffix (1st, 2nd, 3rd, etc.)
   */
  formatRank(rank: number): string {
    const j = rank % 10
    const k = rank % 100
    
    if (j === 1 && k !== 11) return `${rank}st`
    if (j === 2 && k !== 12) return `${rank}nd`
    if (j === 3 && k !== 13) return `${rank}rd`
    return `${rank}th`
  },
  
  /**
   * Format score with commas
   */
  formatScore(score: number): string {
    return score.toLocaleString()
  },
  
  /**
   * Format time elapsed (seconds to MM:SS)
   */
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  },
  
  /**
   * Format percentile
   */
  formatPercentile(percentile: number): string {
    return `Top ${(100 - percentile).toFixed(1)}%`
  },
  
  /**
   * Get rank color/tier
   */
  getRankTier(rank: number): {
    tier: 'gold' | 'silver' | 'bronze' | 'default'
    color: string
    label: string
  } {
    if (rank === 1) {
      return { tier: 'gold', color: '#FFD700', label: 'Champion' }
    }
    if (rank === 2) {
      return { tier: 'silver', color: '#C0C0C0', label: 'Runner-up' }
    }
    if (rank === 3) {
      return { tier: 'bronze', color: '#CD7F32', label: '3rd Place' }
    }
    return { tier: 'default', color: '#6B7280', label: 'Competitor' }
  }
}
