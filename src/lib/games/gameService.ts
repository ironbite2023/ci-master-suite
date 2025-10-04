/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/client'
import type {
  Game,
  GameSession,
  GameRating,
  GameChallenge,
  GameReplay,
  GameKey,
  GameDifficulty
} from '@/types/games'

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

const supabase = createClient() as any

// ============================================================================
// GAME OPERATIONS
// ============================================================================

export const gameService = {
  // ========================================
  // FETCH ALL GAMES
  // ========================================
  async getAllGames(): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('status', 'active')
      .order('name')
    
    if (error) throw new Error(`Failed to fetch games: ${error.message}`)
    return data as Game[]
  },
  
  // ========================================
  // FETCH GAME BY ID
  // ========================================
  async getGameById(gameId: string): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new Error(`Failed to fetch game: ${error.message}`)
    }
    
    return data as Game
  },
  
  // ========================================
  // FETCH GAME BY KEY
  // ========================================
  async getGameByKey(gameKey: GameKey): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('game_key', gameKey)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new Error(`Failed to fetch game: ${error.message}`)
    }
    
    return data as Game
  },
  
  // ========================================
  // FETCH GAMES BY CATEGORY
  // ========================================
  async getGamesByCategory(category: string): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('category', category)
      .eq('status', 'active')
      .order('name')
    
    if (error) throw new Error(`Failed to fetch games by category: ${error.message}`)
    return data as Game[]
  },
  
  // ========================================
  // FETCH FREE GAMES
  // ========================================
  async getFreeGames(): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_free', true)
      .eq('status', 'active')
      .order('name')
    
    if (error) throw new Error(`Failed to fetch free games: ${error.message}`)
    return data as Game[]
  },
  
  // ========================================
  // INCREMENT PLAY COUNT
  // ========================================
  async incrementPlayCount(gameId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_game_play_count', {
      game_id: gameId
    })
    
    if (error) {
      console.error('Failed to increment play count:', error)
      // Don't throw - this is non-critical
    }
  },
  
  // ========================================
  // UPDATE AVERAGE RATING
  // ========================================
  async updateAverageRating(gameId: string): Promise<void> {
    const { data: ratings, error: fetchError } = await supabase
      .from('game_ratings')
      .select('rating')
      .eq('game_id', gameId)
    
    if (fetchError) {
      console.error('Failed to fetch ratings:', fetchError)
      return
    }
    
    if (!ratings || ratings.length === 0) return
    
    const avgRating = ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length
    
    const { error: updateError } = await supabase
      .from('games')
      .update({ average_rating: avgRating })
      .eq('id', gameId)
    
    if (updateError) {
      console.error('Failed to update average rating:', updateError)
    }
  }
}

// ============================================================================
// GAME SESSION OPERATIONS
// ============================================================================

export const sessionService = {
  // ========================================
  // CREATE SESSION
  // ========================================
  async createSession(
    userId: string,
    gameId: string,
    difficulty: GameDifficulty,
    metadata?: Record<string, unknown>
  ): Promise<GameSession> {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        user_id: userId,
        game_id: gameId,
        status: 'in_progress',
        difficulty,
        score: 0,
        progress: 0,
        time_elapsed: 0,
        metadata: metadata || {}
      })
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create session: ${error.message}`)
    return data as GameSession
  },
  
  // ========================================
  // UPDATE SESSION
  // ========================================
  async updateSession(
    sessionId: string,
    updates: Partial<GameSession>
  ): Promise<void> {
    const { error } = await supabase
      .from('game_sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
    
    if (error) throw new Error(`Failed to update session: ${error.message}`)
  },
  
  // ========================================
  // COMPLETE SESSION
  // ========================================
  async completeSession(
    sessionId: string,
    score: number,
    metrics?: Record<string, unknown>
  ): Promise<void> {
    const { error } = await supabase
      .from('game_sessions')
      .update({
        status: 'completed',
        score,
        progress: 100,
        completed_at: new Date().toISOString(),
        metrics: metrics || {},
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
    
    if (error) throw new Error(`Failed to complete session: ${error.message}`)
  },
  
  // ========================================
  // ABANDON SESSION
  // ========================================
  async abandonSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('game_sessions')
      .update({
        status: 'abandoned',
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
    
    if (error) throw new Error(`Failed to abandon session: ${error.message}`)
  },
  
  // ========================================
  // FETCH USER SESSIONS
  // ========================================
  async getUserSessions(
    userId: string,
    gameId?: string,
    limit: number = 10
  ): Promise<GameSession[]> {
    let query = supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (gameId) {
      query = query.eq('game_id', gameId)
    }
    
    const { data, error } = await query
    
    if (error) throw new Error(`Failed to fetch user sessions: ${error.message}`)
    return data as GameSession[]
  },
  
  // ========================================
  // FETCH SESSION BY ID
  // ========================================
  async getSessionById(sessionId: string): Promise<GameSession | null> {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to fetch session: ${error.message}`)
    }
    
    return data as GameSession
  },
  
  // ========================================
  // FETCH USER BEST SCORE
  // ========================================
  async getUserBestScore(userId: string, gameId: string): Promise<number> {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('score')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .eq('status', 'completed')
      .order('score', { ascending: false })
      .limit(1)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return 0 // No sessions yet
      throw new Error(`Failed to fetch best score: ${error.message}`)
    }
    
    return data?.score || 0
  }
}

// ============================================================================
// RATING OPERATIONS
// ============================================================================

export const ratingService = {
  // ========================================
  // RATE GAME
  // ========================================
  async rateGame(
    userId: string,
    gameId: string,
    rating: number,
    review?: string
  ): Promise<void> {
    // Upsert rating (insert or update if exists)
    const { error } = await supabase
      .from('game_ratings')
      .upsert({
        user_id: userId,
        game_id: gameId,
        rating,
        review: review || null,
        updated_at: new Date().toISOString()
      })
    
    if (error) throw new Error(`Failed to rate game: ${error.message}`)
    
    // Update game's average rating
    await gameService.updateAverageRating(gameId)
  },
  
  // ========================================
  // FETCH USER RATING
  // ========================================
  async getUserRating(userId: string, gameId: string): Promise<GameRating | null> {
    const { data, error } = await supabase
      .from('game_ratings')
      .select('*')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to fetch user rating: ${error.message}`)
    }
    
    return data as GameRating
  },
  
  // ========================================
  // FETCH GAME RATINGS
  // ========================================
  async getGameRatings(gameId: string, limit: number = 10): Promise<GameRating[]> {
    const { data, error } = await supabase
      .from('game_ratings')
      .select('*')
      .eq('game_id', gameId)
      .not('review', 'is', null)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw new Error(`Failed to fetch game ratings: ${error.message}`)
    return data as GameRating[]
  }
}

// ============================================================================
// CHALLENGE OPERATIONS
// ============================================================================

export const challengeService = {
  // ========================================
  // CREATE CHALLENGE
  // ========================================
  async createChallenge(
    challengerId: string,
    opponentId: string,
    gameId: string,
    targetScore: number,
    expiresAt: Date
  ): Promise<GameChallenge> {
    const { data, error } = await supabase
      .from('game_challenges')
      .insert({
        challenger_id: challengerId,
        opponent_id: opponentId,
        game_id: gameId,
        target_score: targetScore,
        status: 'pending',
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create challenge: ${error.message}`)
    return data as GameChallenge
  },
  
  // ========================================
  // ACCEPT CHALLENGE
  // ========================================
  async acceptChallenge(challengeId: string): Promise<void> {
    const { error } = await supabase
      .from('game_challenges')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', challengeId)
    
    if (error) throw new Error(`Failed to accept challenge: ${error.message}`)
  },
  
  // ========================================
  // DECLINE CHALLENGE
  // ========================================
  async declineChallenge(challengeId: string): Promise<void> {
    const { error } = await supabase
      .from('game_challenges')
      .update({ status: 'declined' })
      .eq('id', challengeId)
    
    if (error) throw new Error(`Failed to decline challenge: ${error.message}`)
  },
  
  // ========================================
  // COMPLETE CHALLENGE
  // ========================================
  async completeChallenge(
    challengeId: string,
    winnerId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('game_challenges')
      .update({
        status: 'completed',
        winner_id: winnerId,
        completed_at: new Date().toISOString()
      })
      .eq('id', challengeId)
    
    if (error) throw new Error(`Failed to complete challenge: ${error.message}`)
  },
  
  // ========================================
  // FETCH USER CHALLENGES
  // ========================================
  async getUserChallenges(userId: string, status?: string): Promise<GameChallenge[]> {
    let query = supabase
      .from('game_challenges')
      .select('*')
      .or(`challenger_id.eq.${userId},opponent_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query
    
    if (error) throw new Error(`Failed to fetch challenges: ${error.message}`)
    return data as GameChallenge[]
  }
}

// ============================================================================
// REPLAY OPERATIONS
// ============================================================================

export const replayService = {
  // ========================================
  // SAVE REPLAY
  // ========================================
  async saveReplay(
    sessionId: string,
    userId: string,
    gameId: string,
    replayData: Record<string, unknown>,
    isPublic: boolean = false
  ): Promise<GameReplay> {
    const { data, error } = await supabase
      .from('game_replays')
      .insert({
        session_id: sessionId,
        user_id: userId,
        game_id: gameId,
        replay_data: replayData,
        is_public: isPublic,
        views: 0
      })
      .select()
      .single()
    
    if (error) throw new Error(`Failed to save replay: ${error.message}`)
    return data as GameReplay
  },
  
  // ========================================
  // FETCH REPLAY
  // ========================================
  async getReplay(replayId: string): Promise<GameReplay | null> {
    const { data, error } = await supabase
      .from('game_replays')
      .select('*')
      .eq('id', replayId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to fetch replay: ${error.message}`)
    }
    
    // Increment view count
    await supabase.rpc('increment_replay_views', { replay_id: replayId })
    
    return data as GameReplay
  },
  
  // ========================================
  // FETCH USER REPLAYS
  // ========================================
  async getUserReplays(userId: string, limit: number = 10): Promise<GameReplay[]> {
    const { data, error } = await supabase
      .from('game_replays')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw new Error(`Failed to fetch user replays: ${error.message}`)
    return data as GameReplay[]
  },
  
  // ========================================
  // FETCH PUBLIC REPLAYS
  // ========================================
  async getPublicReplays(gameId?: string, limit: number = 20): Promise<GameReplay[]> {
    let query = supabase
      .from('game_replays')
      .select('*')
      .eq('is_public', true)
      .order('views', { ascending: false })
      .limit(limit)
    
    if (gameId) {
      query = query.eq('game_id', gameId)
    }
    
    const { data, error } = await query
    
    if (error) throw new Error(`Failed to fetch public replays: ${error.message}`)
    return data as GameReplay[]
  },
  
  // ========================================
  // DELETE REPLAY
  // ========================================
  async deleteReplay(replayId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('game_replays')
      .delete()
      .eq('id', replayId)
      .eq('user_id', userId) // Ensure user owns the replay
    
    if (error) throw new Error(`Failed to delete replay: ${error.message}`)
  }
}
