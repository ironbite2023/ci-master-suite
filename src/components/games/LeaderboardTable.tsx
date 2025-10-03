'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Trophy, Medal, Crown, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { GameLeaderboard } from '@/types/games'

// ============================================================================
// TYPES
// ============================================================================

export interface LeaderboardEntry extends GameLeaderboard {
  rank: number
  userName: string
  userAvatar?: string
  rank_change?: number
}

export interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  currentUserId?: string
  showRankChange?: boolean
  highlightCurrentUser?: boolean
  compact?: boolean
  maxEntries?: number
  className?: string
}

// ============================================================================
// LEADERBOARD TABLE COMPONENT
// ============================================================================

export function LeaderboardTable({
  entries,
  currentUserId,
  showRankChange = false,
  highlightCurrentUser = true,
  compact = false,
  maxEntries,
  className = ''
}: LeaderboardTableProps) {
  const displayEntries = maxEntries ? entries.slice(0, maxEntries) : entries

  if (entries.length === 0) {
    return (
      <Card className={`border-white/10 bg-slate-800/50 p-12 text-center ${className}`}>
        <Trophy className="mx-auto mb-4 h-12 w-12 text-gray-600" />
        <h3 className="mb-2 text-lg font-bold text-white">No Rankings Yet</h3>
        <p className="text-gray-400">Be the first to play and claim the top spot!</p>
      </Card>
    )
  }

  return (
    <Card className={`border-white/10 bg-slate-800/50 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Rank</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Player</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Score</th>
              {!compact && (
                <>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Time</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Accuracy</th>
                </>
              )}
              {showRankChange && (
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-400">Change</th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayEntries.map((entry, index) => {
              const isCurrentUser = currentUserId && entry.userId === currentUserId
              const rowClasses = isCurrentUser && highlightCurrentUser
                ? 'bg-blue-500/10 border-l-4 border-l-blue-500'
                : 'hover:bg-white/5'

              return (
                <tr
                  key={entry.id || index}
                  className={`border-b border-white/5 transition-colors ${rowClasses}`}
                >
                  {/* Rank */}
                  <td className="px-4 py-4">
                    <RankBadge rank={entry.rank} />
                  </td>

                  {/* Player */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600">
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                          {entry.userId?.substring(0, 2).toUpperCase() || 'U'}
                        </div>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white">
                          {entry.userId || 'Anonymous'}
                          {isCurrentUser && (
                            <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-400">
                              You
                            </Badge>
                          )}
                        </div>
                        {!compact && entry.difficultyLevel && (
                          <div className="text-xs text-gray-400">
                            {getDifficultyLabel(entry.difficultyLevel)}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="px-4 py-4 text-right">
                    <div className="font-bold text-white">
                      {entry.bestScore.toLocaleString()}
                    </div>
                  </td>

                  {/* Time (not compact) */}
                  {!compact && (
                    <td className="px-4 py-4 text-right">
                      <div className="text-sm text-gray-300">
                        {formatTime(entry.bestTimeSeconds || 0)}
                      </div>
                    </td>
                  )}

                  {/* Accuracy (not compact) */}
                  {!compact && (
                    <td className="px-4 py-4 text-right">
                      <div className="text-sm text-gray-300">
                        {entry.bestAccuracy ? `${entry.bestAccuracy.toFixed(1)}%` : 'N/A'}
                      </div>
                    </td>
                  )}

                  {/* Rank Change */}
                  {showRankChange && (
                    <td className="px-4 py-4">
                      <RankChange change={entry.rank_change || 0} />
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ============================================================================
// RANK BADGE COMPONENT
// ============================================================================

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex items-center gap-2">
        <Crown className="h-5 w-5 fill-yellow-500 text-yellow-500" />
        <span className="font-bold text-yellow-500">1st</span>
      </div>
    )
  }

  if (rank === 2) {
    return (
      <div className="flex items-center gap-2">
        <Medal className="h-5 w-5 text-gray-400" />
        <span className="font-bold text-gray-400">2nd</span>
      </div>
    )
  }

  if (rank === 3) {
    return (
      <div className="flex items-center gap-2">
        <Medal className="h-5 w-5 text-orange-600" />
        <span className="font-bold text-orange-600">3rd</span>
      </div>
    )
  }

  return (
    <span className="font-medium text-gray-400">
      {rank}th
    </span>
  )
}

// ============================================================================
// RANK CHANGE INDICATOR
// ============================================================================

function RankChange({ change }: { change: number }) {
  if (change > 0) {
    return (
      <div className="flex items-center justify-center gap-1 text-green-400">
        <TrendingUp className="h-4 w-4" />
        <span className="text-xs font-medium">+{change}</span>
      </div>
    )
  }

  if (change < 0) {
    return (
      <div className="flex items-center justify-center gap-1 text-red-400">
        <TrendingDown className="h-4 w-4" />
        <span className="text-xs font-medium">{change}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center text-gray-500">
      <Minus className="h-4 w-4" />
    </div>
  )
}

// ============================================================================
// COMPACT LEADERBOARD (for sidebars)
// ============================================================================

export function CompactLeaderboard({
  entries,
  maxEntries = 10,
  className = ''
}: {
  entries: GameLeaderboard[]
  maxEntries?: number
  className?: string
}) {
  const displayEntries = entries.slice(0, maxEntries)

  return (
    <div className={`space-y-2 ${className}`}>
      {displayEntries.map((entry, index) => (
        <Card
          key={entry.id || index}
          className="flex items-center justify-between border-white/10 bg-slate-800/50 p-3"
        >
          <div className="flex items-center gap-3">
            <RankBadge rank={index + 1} />
            <div>
              <div className="text-sm font-medium text-white">
                {entry.userId?.substring(0, 10) || 'Anonymous'}
              </div>
              <div className="text-xs text-gray-400">
                {formatTime(entry.bestTimeSeconds || 0)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-white">
              {entry.bestScore.toLocaleString()}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ============================================================================
// USER RANK CARD (show user's position)
// ============================================================================

export function UserRankCard({
  entry,
  totalPlayers,
  className = ''
}: {
  entry: LeaderboardEntry
  totalPlayers: number
  className?: string
}) {
  const percentile = ((totalPlayers - entry.rank + 1) / totalPlayers) * 100

  return (
    <Card className={`border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 ${className}`}>
      <div className="mb-4 text-sm font-medium text-gray-400">Your Ranking</div>
      
      <div className="mb-4 flex items-center gap-4">
        <RankBadge rank={entry.rank} />
        <div>
          <div className="text-3xl font-bold text-white">
            {entry.bestScore.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">
            Top {percentile.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
        <div>
          <div className="text-xs text-gray-400">Time</div>
          <div className="font-medium text-white">
            {formatTime(entry.bestTimeSeconds || 0)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Accuracy</div>
          <div className="font-medium text-white">
            {entry.bestAccuracy ? `${entry.bestAccuracy.toFixed(1)}%` : 'N/A'}
          </div>
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    easy: '🟢 Easy',
    medium: '🟡 Medium',
    hard: '🔴 Hard'
  }
  return labels[difficulty] || difficulty
}
