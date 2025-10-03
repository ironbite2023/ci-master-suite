'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type {
  GameState,
  GameControls,
  GameMetrics,
  GameAchievement,
  GameLeaderboard,
  UnlockCriteria,
  UseGameSessionOptions,
  UseGameSessionReturn
} from '@/types/games'

// ============================================================================
// USEGAMESESSION HOOK
// Manages complete game session lifecycle with auto-save and achievements
// ============================================================================

export function useGameSession({
  gameKey,
  difficulty,
  autoSaveInterval = 30000, // 30 seconds default
  onAchievementUnlocked,
  onLeaderboardUpdate
}: UseGameSessionOptions): UseGameSessionReturn {
  const supabase = createClient()
  
  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState>({
    phase: 'initial',
    score: 0,
    maxScore: 0,
    timeElapsed: 0,
    isPaused: false,
    isComplete: false,
    mistakes: 0,
    hintsUsed: 0,
    achievements: [],
    data: {}
  })
  
  const [gameControls, setGameControls] = useState<GameControls>({
    isPaused: false,
    isRunning: false,
    canUndo: false,
    canRedo: false,
    canReset: false,
    canHint: true
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Refs for timers and tracking
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const gameTickerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const pauseTimeRef = useRef<number>(0)
  const totalPausedDurationRef = useRef<number>(0)
  const userIdRef = useRef<string | null>(null)
  const gameIdRef = useRef<string | null>(null)
  
  // ============================================================================
  // START GAME
  // ============================================================================
  
  const startGame = useCallback(async (initialData?: Record<string, unknown>) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User must be authenticated to start game')
      }
      userIdRef.current = user.id
      
      // Get game by gameKey
      const { data: game, error: gameError } = await supabase
        .from('games')
        .select('id')
        .eq('game_key', gameKey)
        .eq('is_active', true)
        .single()
      
      if (gameError || !game) {
        throw new Error('Game not found')
      }
      gameIdRef.current = game.id
      
      // Get attempt number (count previous sessions)
      const { data: previousSessions } = await supabase
        .from('game_sessions')
        .select('attempt_number')
        .eq('user_id', user.id)
        .eq('game_id', game.id)
        .eq('difficulty_level', difficulty)
        .order('attempt_number', { ascending: false })
        .limit(1)
      
      const attemptNumber = previousSessions && previousSessions.length > 0
        ? previousSessions[0].attempt_number + 1
        : 1
      
      // Create new session
      const { data: session, error: sessionError } = await supabase
        .from('game_sessions')
        .insert({
          user_id: user.id,
          game_id: game.id,
          difficulty_level: difficulty,
          attempt_number: attemptNumber,
          status: 'in_progress',
          session_data: initialData || {},
          device_type: getDeviceType(),
          browser: getBrowserInfo(),
          screen_resolution: `${window.screen.width}x${window.screen.height}`
        })
        .select()
        .single()
      
      if (sessionError || !session) {
        throw new Error('Failed to create game session')
      }
      
      // Set session and initialize state
      setSessionId(session.id)
      startTimeRef.current = Date.now()
      totalPausedDurationRef.current = 0
      
      setGameState({
        phase: 'playing',
        score: 0,
        maxScore: 0,
        timeElapsed: 0,
        isPaused: false,
        isComplete: false,
        mistakes: 0,
        hintsUsed: 0,
        achievements: [],
        data: initialData || {}
      })
      
      setGameControls({
        isPaused: false,
        isRunning: true,
        canUndo: false,
        canRedo: false,
        canReset: true,
        canHint: true
      })
      
      // Start game ticker (updates time every second)
      startGameTicker()
      
      // Start auto-save
      startAutoSave()
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start game'
      setError(errorMessage)
      console.error('Error starting game:', err)
    } finally {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameKey, difficulty, supabase])
  
  // ============================================================================
  // PAUSE GAME
  // ============================================================================
  
  const pauseGame = useCallback(() => {
    if (!sessionId || gameState.isPaused) return
    
    pauseTimeRef.current = Date.now()
    stopGameTicker()
    
    setGameState(prev => ({ ...prev, isPaused: true }))
    setGameControls(prev => ({ ...prev, isPaused: true, isRunning: false }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, gameState.isPaused])
  
  // ============================================================================
  // RESUME GAME
  // ============================================================================
  
  const resumeGame = useCallback(() => {
    if (!sessionId || !gameState.isPaused) return
    
    // Track paused duration
    const pausedDuration = Date.now() - pauseTimeRef.current
    totalPausedDurationRef.current += pausedDuration
    
    startGameTicker()
    
    setGameState(prev => ({ ...prev, isPaused: false }))
    setGameControls(prev => ({ ...prev, isPaused: false, isRunning: true }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, gameState.isPaused])
  
  // ============================================================================
  // UPDATE PROGRESS
  // ============================================================================
  
  const updateProgress = useCallback(async (
    updates: Partial<GameState>,
    sessionData?: Record<string, unknown>
  ) => {
    if (!sessionId) return
    
    // Update local state
    setGameState(prev => ({
      ...prev,
      ...updates,
      data: sessionData ? { ...prev.data, ...sessionData } : prev.data
    }))
    
    // Update in database (debounced by auto-save)
    try {
      await supabase
        .from('game_sessions')
        .update({
          current_phase: updates.phase || gameState.phase,
          mistakes_made: updates.mistakes ?? gameState.mistakes,
          hints_used: updates.hintsUsed ?? gameState.hintsUsed,
          session_data: sessionData || gameState.data,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
    } catch (err) {
      console.error('Error updating progress:', err)
    }
  }, [sessionId, gameState, supabase])
  
  // ============================================================================
  // COMPLETE GAME
  // ============================================================================
  
  const completeGame = useCallback(async (
    finalScore: number,
    metrics: GameMetrics,
    sessionData: Record<string, unknown>
  ) => {
    if (!sessionId || !userIdRef.current || !gameIdRef.current) return
    
    setIsLoading(true)
    
    try {
      const completedAt = new Date().toISOString()
      const totalTimeSeconds = Math.floor(
        (Date.now() - startTimeRef.current - totalPausedDurationRef.current) / 1000
      )
      const scorePercentage = gameState.maxScore > 0
        ? (finalScore / gameState.maxScore) * 100
        : 0
      
      // Update session as completed
      const { error: updateError } = await supabase
        .from('game_sessions')
        .update({
          status: 'completed',
          completed_at: completedAt,
          time_spent_seconds: totalTimeSeconds,
          paused_duration: Math.floor(totalPausedDurationRef.current / 1000),
          final_score: finalScore,
          max_possible_score: gameState.maxScore,
          score_percentage: scorePercentage,
          performance_metrics: metrics,
          session_data: sessionData
        })
        .eq('id', sessionId)
      
      if (updateError) throw updateError
      
      // Check and unlock achievements
      await checkAchievements(finalScore, metrics, sessionData)
      
      // Update leaderboard
      await updateLeaderboard(finalScore, totalTimeSeconds, metrics.accuracy)
      
      // Update local state
      setGameState(prev => ({
        ...prev,
        score: finalScore,
        isComplete: true,
        timeElapsed: totalTimeSeconds
      }))
      
      setGameControls({
        isPaused: false,
        isRunning: false,
        canUndo: false,
        canRedo: false,
        canReset: false,
        canHint: false
      })
      
      // Stop timers
      stopGameTicker()
      stopAutoSave()
      
    } catch (err) {
      console.error('Error completing game:', err)
      setError('Failed to complete game')
    } finally {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, gameState.maxScore, supabase])
  
  // ============================================================================
  // QUIT GAME
  // ============================================================================
  
  const quitGame = useCallback(async () => {
    if (!sessionId) return
    
    try {
      // Mark session as abandoned
      await supabase
        .from('game_sessions')
        .update({
          status: 'abandoned',
          time_spent_seconds: Math.floor(
            (Date.now() - startTimeRef.current - totalPausedDurationRef.current) / 1000
          )
        })
        .eq('id', sessionId)
      
      // Stop timers
      stopGameTicker()
      stopAutoSave()
      
      // Reset state
      setSessionId(null)
      setGameState({
        phase: 'initial',
        score: 0,
        maxScore: 0,
        timeElapsed: 0,
        isPaused: false,
        isComplete: false,
        mistakes: 0,
        hintsUsed: 0,
        achievements: [],
        data: {}
      })
      
      setGameControls({
        isPaused: false,
        isRunning: false,
        canUndo: false,
        canRedo: false,
        canReset: false,
        canHint: false
      })
      
    } catch (err) {
      console.error('Error quitting game:', err)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, supabase])
  
  // ============================================================================
  // SAVE PROGRESS
  // ============================================================================
  
  const saveProgress = useCallback(async () => {
    if (!sessionId || gameState.isPaused || gameState.isComplete) return
    
    try {
      const timeElapsed = Math.floor(
        (Date.now() - startTimeRef.current - totalPausedDurationRef.current) / 1000
      )
      
      await supabase
        .from('game_sessions')
        .update({
          current_phase: gameState.phase,
          mistakes_made: gameState.mistakes,
          hints_used: gameState.hintsUsed,
          session_data: gameState.data,
          time_spent_seconds: timeElapsed,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
    } catch (err) {
      console.error('Error saving progress:', err)
    }
  }, [sessionId, gameState, supabase])
  
  // ============================================================================
  // AUTO-SAVE CONTROL
  // ============================================================================
  
  const startAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) return
    
    autoSaveTimerRef.current = setInterval(() => {
      saveProgress()
    }, autoSaveInterval)
  }, [saveProgress, autoSaveInterval])
  
  const stopAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current)
      autoSaveTimerRef.current = null
    }
  }, [])
  
  // ============================================================================
  // GAME TICKER (updates time every second)
  // ============================================================================
  
  const startGameTicker = useCallback(() => {
    if (gameTickerRef.current) return
    
    gameTickerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.isPaused || prev.isComplete) return prev
        
        const timeElapsed = Math.floor(
          (Date.now() - startTimeRef.current - totalPausedDurationRef.current) / 1000
        )
        
        return { ...prev, timeElapsed }
      })
    }, 1000)
  }, [])
  
  const stopGameTicker = useCallback(() => {
    if (gameTickerRef.current) {
      clearInterval(gameTickerRef.current)
      gameTickerRef.current = null
    }
  }, [])
  
  // ============================================================================
  // ACHIEVEMENT CHECKING
  // ============================================================================
  
  const checkAchievements = useCallback(async (
    score: number,
    metrics: GameMetrics,
    sessionData: Record<string, unknown>
  ) => {
    if (!userIdRef.current || !gameIdRef.current || !sessionId) return
    
    try {
      // Get all achievements for this game
      const { data: achievements } = await supabase
        .from('game_achievements')
        .select('*')
        .eq('game_id', gameIdRef.current)
        .eq('is_active', true)
      
      if (!achievements) return
      
      // Check which achievements were unlocked
      for (const achievement of achievements) {
        // Check if user already has this achievement
        const { data: existing } = await supabase
          .from('user_game_achievements')
          .select('id')
          .eq('user_id', userIdRef.current)
          .eq('achievement_id', achievement.id)
          .single()
        
        if (existing) continue // Already unlocked
        
        // Check unlock criteria
        const unlocked = evaluateUnlockCriteria(
          achievement.unlock_criteria,
          { score, ...metrics, ...sessionData }
        )
        
        if (unlocked) {
          // Unlock achievement
          const { error: unlockError } = await supabase
            .from('user_game_achievements')
            .insert({
              user_id: userIdRef.current,
              achievement_id: achievement.id,
              game_session_id: sessionId,
              points_earned: achievement.points_awarded
            })
          
          if (!unlockError) {
            // Trigger callback
            onAchievementUnlocked?.(achievement as GameAchievement)
            
            // Update local state
            setGameState(prev => ({
              ...prev,
              achievements: [...prev.achievements, achievement.achievement_key]
            }))
          }
        }
      }
    } catch (err) {
      console.error('Error checking achievements:', err)
    }
  }, [sessionId, supabase, onAchievementUnlocked])
  
  // ============================================================================
  // LEADERBOARD UPDATE
  // ============================================================================
  
  const updateLeaderboard = useCallback(async (
    score: number,
    timeSeconds: number,
    accuracy: number
  ) => {
    if (!userIdRef.current || !gameIdRef.current) return
    
    try {
      // Get existing leaderboard entry
      const { data: existingEntry } = await supabase
        .from('game_leaderboards')
        .select('*')
        .eq('game_id', gameIdRef.current)
        .eq('user_id', userIdRef.current)
        .eq('difficulty_level', difficulty)
        .single()
      
      if (existingEntry) {
        // Update if new score is better
        if (score > existingEntry.best_score) {
          const { error: updateError } = await supabase
            .from('game_leaderboards')
            .update({
              best_score: score,
              best_score_session_id: sessionId,
              best_time_seconds: timeSeconds,
              best_accuracy: accuracy,
              total_plays: existingEntry.total_plays + 1,
              total_completions: existingEntry.total_completions + 1,
              last_played_at: new Date().toISOString(),
              best_score_at: new Date().toISOString()
            })
            .eq('id', existingEntry.id)
            .select()
            .single()
          
          if (!updateError) {
            onLeaderboardUpdate?.(updateError as unknown as GameLeaderboard)
          }
        } else {
          // Just update play count
          await supabase
            .from('game_leaderboards')
            .update({
              total_plays: existingEntry.total_plays + 1,
              total_completions: existingEntry.total_completions + 1,
              last_played_at: new Date().toISOString()
            })
            .eq('id', existingEntry.id)
        }
      } else {
        // Create new leaderboard entry
        const { data: newEntry, error: insertError } = await supabase
          .from('game_leaderboards')
          .insert({
            game_id: gameIdRef.current,
            user_id: userIdRef.current,
            difficulty_level: difficulty,
            best_score: score,
            best_score_session_id: sessionId,
            best_time_seconds: timeSeconds,
            best_accuracy: accuracy,
            total_plays: 1,
            total_completions: 1
          })
          .select()
          .single()
        
        if (!insertError && newEntry) {
          onLeaderboardUpdate?.(newEntry as GameLeaderboard)
        }
      }
    } catch (err) {
      console.error('Error updating leaderboard:', err)
    }
  }, [difficulty, sessionId, supabase, onLeaderboardUpdate])
  
  // ============================================================================
  // CLEANUP
  // ============================================================================
  
  useEffect(() => {
    return () => {
      stopGameTicker()
      stopAutoSave()
    }
  }, [stopGameTicker, stopAutoSave])
  
  // ============================================================================
  // RETURN HOOK API
  // ============================================================================
  
  return {
    // State
    sessionId,
    gameState,
    gameControls,
    isLoading,
    error,
    
    // Actions
    startGame,
    pauseGame,
    resumeGame,
    updateProgress,
    completeGame,
    quitGame,
    saveProgress,
    
    // Auto-save control
    startAutoSave,
    stopAutoSave
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function evaluateUnlockCriteria(
  criteria: UnlockCriteria | Record<string, unknown>,
  data: Record<string, unknown>
): boolean {
  const { metric, value, operator = 'gte', conditions, conditionLogic } = criteria as Record<string, unknown>
  
  // Handle composite criteria
  if (conditions && Array.isArray(conditions) && conditions.length > 0) {
    const results = conditions.map((cond: UnlockCriteria | Record<string, unknown>) => evaluateUnlockCriteria(cond, data))
    return conditionLogic === 'OR'
      ? results.some(r => r)
      : results.every(r => r)
  }
  
  // Get the value to compare
  const metricKey = typeof metric === 'string' ? metric : 'score'
  const dataValue = metric ? data[metricKey] : data.score
  if (dataValue === undefined || dataValue === null) return false
  
  // Compare based on operator
  const numericDataValue = Number(dataValue)
  const numericValue = Number(value)
  
  switch (operator) {
    case 'gte': return numericDataValue >= numericValue
    case 'lte': return numericDataValue <= numericValue
    case 'gt': return numericDataValue > numericValue
    case 'lt': return numericDataValue < numericValue
    case 'eq': return numericDataValue === numericValue
    default: return false
  }
}

function getDeviceType(): string {
  const ua = navigator.userAgent
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet'
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile'
  }
  return 'desktop'
}

function getBrowserInfo(): string {
  const ua = navigator.userAgent
  let browser = 'Unknown'
  
  if (ua.indexOf('Firefox') > -1) browser = 'Firefox'
  else if (ua.indexOf('Chrome') > -1) browser = 'Chrome'
  else if (ua.indexOf('Safari') > -1) browser = 'Safari'
  else if (ua.indexOf('Edge') > -1) browser = 'Edge'
  else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1) browser = 'IE'
  
  return browser
}
