import type { GameSession, GameMetrics } from '@/types/games'

// ============================================================================
// STATISTICS CALCULATOR
// ============================================================================

export const statisticsCalculator = {
  // ========================================
  // CALCULATE SESSION STATS
  // ========================================
  calculateSessionStats(sessions: GameSession[]): {
    totalSessions: number
    completedSessions: number
    abandonedSessions: number
    averageScore: number
    highestScore: number
    lowestScore: number
    totalTimeSpent: number
    averageTimePerSession: number
    completionRate: number
  } {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        completedSessions: 0,
        abandonedSessions: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        totalTimeSpent: 0,
        averageTimePerSession: 0,
        completionRate: 0
      }
    }
    
    const completed = sessions.filter(s => s.status === 'completed')
    const abandoned = sessions.filter(s => s.status === 'abandoned')
    
    const scores = completed.map(s => s.finalScore ?? 0)
    const totalTimeSpent = sessions.reduce((sum, s) => sum + (s.timeSpentSeconds ?? 0), 0)
    
    return {
      totalSessions: sessions.length,
      completedSessions: completed.length,
      abandonedSessions: abandoned.length,
      averageScore: scores.length > 0
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length
        : 0,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
      lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
      totalTimeSpent,
      averageTimePerSession: totalTimeSpent / sessions.length,
      completionRate: (completed.length / sessions.length) * 100
    }
  },
  
  // ========================================
  // CALCULATE STREAK
  // ========================================
  calculateStreak(sessions: GameSession[]): {
    currentStreak: number
    longestStreak: number
    lastPlayedDate: Date | null
  } {
    if (sessions.length === 0) {
      return { currentStreak: 0, longestStreak: 0, lastPlayedDate: null }
    }
    
    // Sort by date descending (most recent first)
    const sorted = [...sessions].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    const lastPlayedDate = new Date(sorted[0].createdAt)
    
    // Calculate current streak (consecutive days with completed sessions)
    let currentStreak = 0
    const checkDate = new Date()
    checkDate.setHours(0, 0, 0, 0)
    
    for (const session of sorted) {
      const sessionDate = new Date(session.createdAt)
      sessionDate.setHours(0, 0, 0, 0)
      
      if (session.status === 'completed') {
        if (sessionDate.getTime() === checkDate.getTime()) {
          currentStreak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else if (sessionDate.getTime() < checkDate.getTime()) {
          break
        }
      }
    }
    
    // Calculate longest streak
    let longestStreak = 0
    let tempStreak = 0
    let prevDate: Date | null = null
    
    for (const session of sorted.reverse()) {
      if (session.status === 'completed') {
        const sessionDate = new Date(session.createdAt)
        sessionDate.setHours(0, 0, 0, 0)
        
        if (prevDate === null || sessionDate.getTime() === prevDate.getTime() + 86400000) {
          tempStreak++
        } else {
          longestStreak = Math.max(longestStreak, tempStreak)
          tempStreak = 1
        }
        
        prevDate = sessionDate
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak)
    
    return { currentStreak, longestStreak, lastPlayedDate }
  },
  
  // ========================================
  // CALCULATE ACCURACY
  // ========================================
  calculateAccuracy(
    correctActions: number,
    totalActions: number
  ): number {
    if (totalActions === 0) return 0
    return (correctActions / totalActions) * 100
  },
  
  // ========================================
  // CALCULATE SCORE TREND
  // ========================================
  calculateScoreTrend(sessions: GameSession[]): {
    trend: 'improving' | 'declining' | 'stable' | 'insufficient-data'
    trendPercentage: number
    recentAverage: number
    previousAverage: number
  } {
    const completed = sessions
      .filter(s => s.status === 'completed')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    
    if (completed.length < 4) {
      return {
        trend: 'insufficient-data',
        trendPercentage: 0,
        recentAverage: 0,
        previousAverage: 0
      }
    }
    
    const midpoint = Math.floor(completed.length / 2)
    const recent = completed.slice(midpoint)
    const previous = completed.slice(0, midpoint)
    
    const recentAverage = recent.reduce((sum, s) => sum + (s.finalScore ?? 0), 0) / recent.length
    const previousAverage = previous.reduce((sum, s) => sum + (s.finalScore ?? 0), 0) / previous.length
    
    const trendPercentage = previousAverage > 0
      ? ((recentAverage - previousAverage) / previousAverage) * 100
      : 0
    
    let trend: 'improving' | 'declining' | 'stable'
    if (Math.abs(trendPercentage) < 5) {
      trend = 'stable'
    } else if (trendPercentage > 0) {
      trend = 'improving'
    } else {
      trend = 'declining'
    }
    
    return { trend, trendPercentage, recentAverage, previousAverage }
  },
  
  // ========================================
  // CALCULATE PERFORMANCE METRICS
  // ========================================
  calculatePerformanceMetrics(metrics: GameMetrics): {
    efficiencyScore: number
    consistencyScore: number
    speedScore: number
    overallRating: 'S' | 'A' | 'B' | 'C' | 'D' | 'F'
  } {
    // Efficiency: accuracy × completion percentage (using custom.progress if available)
    const progress = (metrics.custom?.progress as number | undefined) ?? 100
    const efficiency = (metrics.accuracy || 0) * progress / 100
    
    // Consistency: 100 - (mistakes / expected mistakes ratio)
    const expectedMistakes = 10 // Baseline
    const consistency = Math.max(0, 100 - ((metrics.mistakes || 0) / expectedMistakes) * 100)
    
    // Speed: based on time vs expected time
    const expectedTime = 300 // 5 minutes baseline
    const speed = Math.max(0, 100 - (((metrics.timeElapsed ?? expectedTime) - expectedTime) / expectedTime) * 50)
    
    // Overall rating
    const overallScore = (efficiency + consistency + speed) / 3
    
    let overallRating: 'S' | 'A' | 'B' | 'C' | 'D' | 'F'
    if (overallScore >= 95) overallRating = 'S'
    else if (overallScore >= 85) overallRating = 'A'
    else if (overallScore >= 75) overallRating = 'B'
    else if (overallScore >= 65) overallRating = 'C'
    else if (overallScore >= 50) overallRating = 'D'
    else overallRating = 'F'
    
    return {
      efficiencyScore: efficiency,
      consistencyScore: consistency,
      speedScore: speed,
      overallRating
    }
  },
  
  // ========================================
  // CALCULATE TIME DISTRIBUTION
  // ========================================
  calculateTimeDistribution(sessions: GameSession[]): {
    byHour: Record<number, number>
    byDayOfWeek: Record<string, number>
    peakPlayTime: { hour: number; count: number }
    peakPlayDay: { day: string; count: number }
  } {
    const byHour: Record<number, number> = {}
    const byDayOfWeek: Record<string, number> = {}
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    // Initialize
    for (let i = 0; i < 24; i++) {
      byHour[i] = 0
    }
    days.forEach(day => { byDayOfWeek[day] = 0 })
    
    // Count sessions
    sessions.forEach(session => {
      const date = new Date(session.createdAt)
      const hour = date.getHours()
      const day = days[date.getDay()]
      
      byHour[hour]++
      byDayOfWeek[day]++
    })
    
    // Find peaks
    const peakHour = Object.entries(byHour).reduce((max, [hour, count]) =>
      count > max.count ? { hour: parseInt(hour), count } : max,
      { hour: 0, count: 0 }
    )
    
    const peakDay = Object.entries(byDayOfWeek).reduce((max, [day, count]) =>
      count > max.count ? { day, count } : max,
      { day: days[0], count: 0 }
    )
    
    return {
      byHour,
      byDayOfWeek,
      peakPlayTime: peakHour,
      peakPlayDay: peakDay
    }
  },
  
  // ========================================
  // CALCULATE SKILL LEVEL
  // ========================================
  calculateSkillLevel(sessions: GameSession[]): {
    level: number
    levelName: string
    experiencePoints: number
    nextLevelXP: number
    progressToNextLevel: number
  } {
    const completed = sessions.filter(s => s.status === 'completed')
    
    // Calculate XP (score + time bonus + completion bonus)
    const experiencePoints = completed.reduce((xp, session) => {
      let sessionXP = session.finalScore ?? 0
      
      // Time bonus (faster = more XP)
      const timeSpent = session.timeSpentSeconds ?? 0
      if (timeSpent < 60) sessionXP += 50
      else if (timeSpent < 120) sessionXP += 30
      else if (timeSpent < 300) sessionXP += 10
      
      // Completion bonus (check sessionData for progress)
      const progress = (session.sessionData?.progress as number | undefined) ?? 0
      if (progress === 100) sessionXP += 20
      
      return xp + sessionXP
    }, 0)
    
    // Calculate level (exponential curve)
    const level = Math.floor(Math.sqrt(experiencePoints / 100)) + 1
    
    // XP needed for next level
    const nextLevelXP = Math.pow(level, 2) * 100
    const currentLevelXP = Math.pow(level - 1, 2) * 100
    const progressToNextLevel = ((experiencePoints - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    
    // Level name
    const levelNames = [
      'Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert',
      'Master', 'Grandmaster', 'Champion', 'Legend', 'Mythic'
    ]
    const levelIndex = Math.min(Math.floor(level / 5), levelNames.length - 1)
    const levelName = levelNames[levelIndex]
    
    return {
      level,
      levelName,
      experiencePoints,
      nextLevelXP,
      progressToNextLevel
    }
  },
  
  // ========================================
  // CALCULATE COMPARATIVE STATS
  // ========================================
  calculateComparativeStats(
    userSessions: GameSession[],
    allUsersSessions: GameSession[]
  ): {
    betterThan: number
    averageComparison: number
    rankPercentile: number
  } {
    if (userSessions.length === 0 || allUsersSessions.length === 0) {
      return { betterThan: 0, averageComparison: 0, rankPercentile: 0 }
    }
    
    const userAverage = userSessions
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + (s.finalScore ?? 0), 0) / userSessions.length
    
    const allUsersAverage = allUsersSessions
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + (s.finalScore ?? 0), 0) / allUsersSessions.length
    
    const betterScores = allUsersSessions.filter(s =>
      s.status === 'completed' && (s.finalScore ?? 0) < userAverage
    )
    
    const betterThan = (betterScores.length / allUsersSessions.length) * 100
    const averageComparison = ((userAverage - allUsersAverage) / allUsersAverage) * 100
    const rankPercentile = 100 - betterThan
    
    return { betterThan, averageComparison, rankPercentile }
  },
  
  // ========================================
  // GENERATE INSIGHTS
  // ========================================
  generateInsights(sessions: GameSession[]): string[] {
    const insights: string[] = []
    
    if (sessions.length === 0) {
      return ['Play your first game to see insights!']
    }
    
    const stats = this.calculateSessionStats(sessions)
    const streak = this.calculateStreak(sessions)
    const trend = this.calculateScoreTrend(sessions)
    
    // Completion rate insights
    if (stats.completionRate > 90) {
      insights.push('🎯 Excellent completion rate! You finish what you start.')
    } else if (stats.completionRate < 50) {
      insights.push('💡 Tip: Try to complete more sessions to improve your stats.')
    }
    
    // Streak insights
    if (streak.currentStreak >= 7) {
      insights.push(`🔥 Amazing! ${streak.currentStreak} day streak!`)
    } else if (streak.currentStreak >= 3) {
      insights.push(`✨ Keep it up! ${streak.currentStreak} day streak!`)
    }
    
    // Trend insights
    if (trend.trend === 'improving') {
      insights.push(`📈 Your scores are improving by ${trend.trendPercentage.toFixed(1)}%!`)
    } else if (trend.trend === 'declining') {
      insights.push('💪 Scores dipped recently, but you can bounce back!')
    }
    
    // Time insights
    if (stats.averageTimePerSession < 60) {
      insights.push('⚡ Lightning fast! You complete games quickly.')
    } else if (stats.averageTimePerSession > 300) {
      insights.push('🐢 You take your time - quality over speed!')
    }
    
    // High score insight
    if (stats.highestScore > 5000) {
      insights.push(`🏆 Impressive high score of ${stats.highestScore.toLocaleString()}!`)
    }
    
    return insights
  }
}

// ============================================================================
// DATA VISUALIZATION HELPERS
// ============================================================================

export const chartDataHelpers = {
  /**
   * Format sessions for score line chart
   */
  formatScoreChartData(sessions: GameSession[]): Array<{ date: string; score: number }> {
    return sessions
      .filter(s => s.status === 'completed')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map(s => ({
        date: new Date(s.createdAt).toLocaleDateString(),
        score: s.finalScore ?? 0
      }))
  },
  
  /**
   * Format sessions for time distribution chart
   */
  formatTimeDistributionData(sessions: GameSession[]): Array<{ hour: string; plays: number }> {
    const distribution = statisticsCalculator.calculateTimeDistribution(sessions)
    return Object.entries(distribution.byHour).map(([hour, count]) => ({
      hour: `${hour}:00`,
      plays: count
    }))
  },
  
  /**
   * Format sessions for difficulty breakdown
   */
  formatDifficultyBreakdown(sessions: GameSession[]): Array<{ difficulty: string; count: number }> {
    const breakdown: Record<string, number> = {}
    
    sessions.forEach(s => {
      const diff = s.difficultyLevel || 'intermediate'
      breakdown[diff] = (breakdown[diff] || 0) + 1
    })
    
    return Object.entries(breakdown).map(([difficulty, count]) => ({
      difficulty,
      count
    }))
  },
  
  /**
   * Format sessions for progress over time
   */
  formatProgressData(sessions: GameSession[]): Array<{
    session: number
    score: number
    average: number
  }> {
    const completed = sessions
      .filter(s => s.status === 'completed')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    
    let runningTotal = 0
    
    return completed.map((s, i) => {
      const score = s.finalScore ?? 0
      runningTotal += score
      return {
        session: i + 1,
        score: score,
        average: runningTotal / (i + 1)
      }
    })
  }
}
