/**
 * DOE Supabase Service
 * Manages DOE session persistence to Supabase database
 * Works in tandem with localStorage for optimal performance
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { DOEExperiment } from '@/types/catapult'
import { performDOEAnalysis } from './doeCalculations'

// ============================================================================
// TYPES
// ============================================================================

export interface DOESession {
  id: string
  user_id: string
  game_id: string
  started_at: string
  completed_at: string | null
  status: 'in_progress' | 'completed' | 'abandoned'
  experiments: DOEExperiment[]
  main_effects: {
    angle: number
    force: number
    weight: number
  } | null
  interactions: {
    angleForce: number
    angleWeight: number
    forceWeight: number
  } | null
  optimal_settings: {
    angle: number
    force: number
    weight: string
  } | null
  created_at: string
  updated_at: string
}

export interface DOEStats {
  total_sessions: number
  completed_sessions: number
  first_completion: string | null
  last_completion: string | null
  avg_completion_time_minutes: number | null
}

// ============================================================================
// DOE SUPABASE SERVICE
// ============================================================================

class DOESupabaseService {
  private supabase = createClientComponentClient()
  private gameId: string | null = null

  /**
   * Get or create the catapult game ID
   */
  private async getGameId(): Promise<string> {
    if (this.gameId) return this.gameId

    const { data, error } = await this.supabase
      .from('games')
      .select('id')
      .eq('game_key', 'catapult')
      .single()

    if (error || !data || !data.id) {
      throw new Error('Catapult game not found in database')
    }

    this.gameId = data.id as string
    return this.gameId
  }

  /**
   * Create a new DOE session
   */
  async createSession(experiments: DOEExperiment[]): Promise<DOESession> {
    const { data: userData } = await this.supabase.auth.getUser()
    if (!userData.user) {
      throw new Error('User not authenticated')
    }

    const gameId = await this.getGameId()

    const { data, error } = await this.supabase
      .from('doe_sessions')
      .insert({
        user_id: userData.user.id,
        game_id: gameId,
        status: 'in_progress',
        experiments: experiments,
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating DOE session:', error)
      throw error
    }

    return data as DOESession
  }

  /**
   * Get the most recent DOE session for current user
   */
  async getMostRecentSession(): Promise<DOESession | null> {
    const { data: userData } = await this.supabase.auth.getUser()
    if (!userData.user) return null

    const { data, error } = await this.supabase
      .from('doe_sessions')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null
      }
      console.error('Error fetching DOE session:', error)
      return null
    }

    return data as DOESession
  }

  /**
   * Get a specific DOE session by ID
   */
  async getSession(sessionId: string): Promise<DOESession | null> {
    const { data, error } = await this.supabase
      .from('doe_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error) {
      console.error('Error fetching DOE session:', error)
      return null
    }

    return data as DOESession
  }

  /**
   * Update DOE session experiments
   */
  async updateSessionExperiments(
    sessionId: string,
    experiments: DOEExperiment[]
  ): Promise<void> {
    const { error } = await this.supabase
      .from('doe_sessions')
      .update({
        experiments: experiments,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)

    if (error) {
      console.error('Error updating DOE session:', error)
      throw error
    }
  }

  /**
   * Complete a DOE session with analysis results
   */
  async completeSession(
    sessionId: string,
    experiments: DOEExperiment[]
  ): Promise<void> {
    // Calculate analysis
    const analysis = performDOEAnalysis(experiments)

    const { error } = await this.supabase
      .from('doe_sessions')
      .update({
        experiments: experiments,
        status: 'completed',
        completed_at: new Date().toISOString(),
        main_effects: analysis.mainEffects,
        interactions: analysis.interactions,
        optimal_settings: analysis.optimalSettings,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)

    if (error) {
      console.error('Error completing DOE session:', error)
      throw error
    }
  }

  /**
   * Abandon a DOE session
   */
  async abandonSession(sessionId: string): Promise<void> {
    const { error } = await this.supabase
      .from('doe_sessions')
      .update({
        status: 'abandoned',
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)

    if (error) {
      console.error('Error abandoning DOE session:', error)
      throw error
    }
  }

  /**
   * Get all DOE sessions for current user
   */
  async getUserSessions(limit = 10): Promise<DOESession[]> {
    const { data: userData } = await this.supabase.auth.getUser()
    if (!userData.user) return []

    const { data, error } = await this.supabase
      .from('doe_sessions')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching user DOE sessions:', error)
      return []
    }

    return data as DOESession[]
  }

  /**
   * Get user DOE statistics
   */
  async getUserStats(): Promise<DOEStats | null> {
    const { data: userData } = await this.supabase.auth.getUser()
    if (!userData.user) return null

    const { data, error } = await this.supabase
      .from('user_doe_stats')
      .select('*')
      .eq('user_id', userData.user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No stats yet
        return {
          total_sessions: 0,
          completed_sessions: 0,
          first_completion: null,
          last_completion: null,
          avg_completion_time_minutes: null
        }
      }
      console.error('Error fetching DOE stats:', error)
      return null
    }

    return data as DOEStats
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const { data } = await this.supabase.auth.getUser()
    return !!data.user
  }

  /**
   * Delete a DOE session
   */
  async deleteSession(sessionId: string): Promise<void> {
    const { error } = await this.supabase
      .from('doe_sessions')
      .delete()
      .eq('id', sessionId)

    if (error) {
      console.error('Error deleting DOE session:', error)
      throw error
    }
  }
}

// Export singleton instance
export const doeSupabaseService = new DOESupabaseService()
