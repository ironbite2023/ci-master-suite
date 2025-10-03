import type {
  Shot,
  TargetZone,
  ScoreBreakdown,
  GameStats
} from '@/types/catapult'

// ============================================================================
// SCORE CALCULATION
// ============================================================================

export function calculateScore(
  landingDistance: number,
  targetHit: TargetZone | null,
  isInBullseye: boolean,
  distanceFromCenter: number,
  shotTime: number,
  consecutiveHits: number,
  difficultyMultiplier: number = 1.0
): ScoreBreakdown {
  let basePoints = 0
  let accuracyBonus = 0
  const timePenalty = Math.max(0, shotTime - 30) * -1
  let comboMultiplier = 1.0
  
  // Base points from target
  if (targetHit) {
    basePoints = targetHit.points
    
    // Add bullseye bonus
    if (isInBullseye && targetHit.bullseyeBonus) {
      basePoints += targetHit.bullseyeBonus
    }
    
    // Calculate accuracy bonus (0-50 points based on distance from center)
    const maxDistance = targetHit.width / 2
    const accuracyRatio = 1 - (distanceFromCenter / maxDistance)
    accuracyBonus = Math.floor(50 * accuracyRatio)
  }
  
  // Combo multiplier for consecutive hits
  if (consecutiveHits >= 3) {
    comboMultiplier = 1.5
  } else if (consecutiveHits >= 5) {
    comboMultiplier = 2.0
  } else if (consecutiveHits >= 10) {
    comboMultiplier = 3.0
  }
  
  // Calculate total with difficulty multiplier
  const subtotal = (basePoints + accuracyBonus + timePenalty)
  const totalScore = Math.max(0, Math.floor(subtotal * comboMultiplier * difficultyMultiplier))
  
  return {
    basePoints,
    accuracyBonus,
    consistencyBonus: 0, // Calculated separately after multiple shots
    timePenalty,
    comboMultiplier,
    totalScore
  }
}

// ============================================================================
// CONSISTENCY BONUS
// ============================================================================

export function calculateConsistencyBonus(shots: Shot[]): number {
  if (shots.length < 3) {
    return 0
  }
  
  const successfulShots = shots.filter(s => s.targetHit !== null)
  const consistencyRatio = successfulShots.length / shots.length
  
  // Award bonus if 75%+ shots hit targets
  if (consistencyRatio >= 0.75) {
    return Math.floor(100 * consistencyRatio)
  }
  
  return 0
}

// ============================================================================
// GAME STATISTICS
// ============================================================================

export function calculateGameStats(shots: Shot[]): GameStats {
  const totalShots = shots.length
  const successfulHits = shots.filter(s => s.targetHit !== null).length
  const accuracy = totalShots > 0 ? (successfulHits / totalShots) * 100 : 0
  
  const distances = shots.map(s => s.landingDistance)
  const averageDistance = distances.length > 0
    ? distances.reduce((sum, d) => sum + d, 0) / distances.length
    : 0
  
  const bestDistance = distances.length > 0 ? Math.max(...distances) : 0
  const totalScore = shots.reduce((sum, s) => sum + s.score, 0)
  
  return {
    totalShots,
    successfulHits,
    accuracy,
    averageDistance,
    bestDistance,
    totalScore,
    experimentsCompleted: 0 // Updated by DOE system
  }
}

// ============================================================================
// PERFORMANCE RATING
// ============================================================================

export function getPerformanceRating(accuracy: number, totalScore: number): {
  rating: string
  stars: number
  message: string
} {
  let rating: string
  let stars: number
  let message: string
  
  if (accuracy >= 80 && totalScore >= 1000) {
    rating = 'Expert'
    stars = 5
    message = "Outstanding! You've mastered the catapult!"
  } else if (accuracy >= 60 && totalScore >= 750) {
    rating = 'Advanced'
    stars = 4
    message = "Excellent work! Your aim is getting precise!"
  } else if (accuracy >= 40 && totalScore >= 500) {
    rating = 'Intermediate'
    stars = 3
    message = 'Good progress! Keep practicing!'
  } else if (accuracy >= 20 && totalScore >= 250) {
    rating = 'Beginner'
    stars = 2
    message = "Nice start! You're learning the basics!"
  } else {
    rating = 'Novice'
    stars = 1
    message = "Keep trying! Every shot teaches you something!"
  }
  
  return { rating, stars, message }
}

// ============================================================================
// SCORE FORMATTING
// ============================================================================

export function formatScore(score: number): string {
  return score.toLocaleString()
}

export function formatDistance(distance: number): string {
  return `${Math.round(distance)}m`
}

export function formatAccuracy(accuracy: number): string {
  return `${accuracy.toFixed(1)}%`
}

// ============================================================================
// ACHIEVEMENT CHECKS
// ============================================================================

export function checkAchievements(stats: GameStats): string[] {
  const achievements: string[] = []
  
  // First hit
  if (stats.successfulHits === 1 && stats.totalShots === 1) {
    achievements.push('first-hit')
  }
  
  // Perfect accuracy (5+ shots, 100%)
  if (stats.totalShots >= 5 && stats.accuracy === 100) {
    achievements.push('perfect-accuracy')
  }
  
  // Marksman (10+ shots, 80%+ accuracy)
  if (stats.totalShots >= 10 && stats.accuracy >= 80) {
    achievements.push('marksman')
  }
  
  // Distance master (300m+ shot)
  if (stats.bestDistance >= 300) {
    achievements.push('distance-master')
  }
  
  // High scorer (1000+ points)
  if (stats.totalScore >= 1000) {
    achievements.push('high-scorer')
  }
  
  return achievements
}

// ============================================================================
// DIFFICULTY MULTIPLIERS
// ============================================================================

export const DIFFICULTY_MULTIPLIERS = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0
}
