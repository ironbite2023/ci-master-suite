'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Trophy, ArrowLeft, Play } from 'lucide-react'
import { LeaderboardTable, UserRankCard, LeaderboardEntry } from '@/components/games/LeaderboardTable'
import { getGameByKey } from '@/lib/games/gameRegistry'
import type { GameDifficulty } from '@/types/games'

// ============================================================================
// MOCK DATA
// ============================================================================

const generateMockLeaderboardData = (
  gameId: string,
  difficulty: GameDifficulty | 'all',
  count: number
): LeaderboardEntry[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${gameId}-${difficulty}-${i}`,
    userId: `user-${i + 1}`,
    userName: `Player ${i + 1}`,
    gameId: gameId,
    difficultyLevel: difficulty === 'all' 
      ? (['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)] as GameDifficulty)
      : difficulty,
    bestScore: Math.floor(Math.random() * 10000) + 5000,
    bestScoreSessionId: `session-${i}`,
    bestTimeSeconds: Math.floor(Math.random() * 600) + 60,
    bestAccuracy: Math.random() * 30 + 70,
    totalPlays: Math.floor(Math.random() * 100) + 1,
    totalCompletions: Math.floor(Math.random() * 80) + 1,
    averageScore: Math.floor(Math.random() * 8000) + 4000,
    improvementRate: Math.random() * 20 - 10,
    globalRank: i + 1,
    monthlyRank: i + 1,
    weeklyRank: i + 1,
    firstPlayedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastPlayedAt: new Date().toISOString(),
    bestScoreAt: new Date().toISOString(),
    rank: i + 1
  })).sort((a, b) => b.bestScore - a.bestScore).map((entry, i) => ({ ...entry, rank: i + 1, globalRank: i + 1, monthlyRank: i + 1, weeklyRank: i + 1 }))
}

// ============================================================================
// GAME LEADERBOARD PAGE
// ============================================================================

export default function GameLeaderboardPage() {
  const params = useParams()
  const gameId = params.gameId as string
  
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('all-time')
  const [difficulty, setDifficulty] = useState<GameDifficulty | 'all'>('all')
  
  const game = getGameByKey(gameId as import('@/types/games').GameKey)
  
  if (!game) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">Game Not Found</h1>
          <p className="mb-6 text-gray-400">The game leaderboard you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/games/leaderboard">
            <Button>
              <Trophy className="mr-2 h-4 w-4" />
              View Global Leaderboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const mockData = generateMockLeaderboardData(gameId, difficulty, 100)
  const userRankEntry = mockData[24] // Mock user at 25th place

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/games/leaderboard">
            <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Global Leaderboard
            </Button>
          </Link>

          <div className="mb-4 flex items-center gap-2 text-yellow-400">
            <Trophy className="h-5 w-5" />
            <span className="text-sm font-medium">{game.name} Leaderboard</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {game.name}
          </h1>
          <p className="max-w-2xl text-lg text-gray-400">
            {game.tagline}
          </p>
        </div>

        {/* Game Info Card */}
        <Card className="mb-8 border-white/10 bg-slate-800/50 p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-bold text-white">About This Game</h3>
              <p className="text-gray-300">{game.description}</p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <Link href={`/games/${game.slug}`}>
                <Button variant="outline">
                  View Details
                </Button>
              </Link>
              <Link href={`/games/play/${game.slug}`}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Play className="mr-2 h-4 w-4" />
                  Play Now
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Leaderboard */}
          <div className="lg:col-span-2">
            {/* Filter Controls */}
            <div className="mb-6 flex flex-col gap-4">
              {/* Time Period Tabs */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  Time Period
                </label>
                <Tabs value={timePeriod} onValueChange={(value) => setTimePeriod(value as typeof timePeriod)}>
                  <TabsList className="w-full">
                    <TabsTrigger value="daily" className="flex-1">Daily</TabsTrigger>
                    <TabsTrigger value="weekly" className="flex-1">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly" className="flex-1">Monthly</TabsTrigger>
                    <TabsTrigger value="all-time" className="flex-1">All Time</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  Difficulty
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={difficulty === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDifficulty('all')}
                  >
                    All Levels
                  </Button>
                  <Button
                    variant={difficulty === 'beginner' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDifficulty('beginner')}
                    className={difficulty === 'beginner' ? '' : 'border-green-500/30 text-green-400'}
                  >
                    🟢 Beginner
                  </Button>
                  <Button
                    variant={difficulty === 'intermediate' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDifficulty('intermediate')}
                    className={difficulty === 'intermediate' ? '' : 'border-yellow-500/30 text-yellow-400'}
                  >
                    🟡 Intermediate
                  </Button>
                  <Button
                    variant={difficulty === 'advanced' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDifficulty('advanced')}
                    className={difficulty === 'advanced' ? '' : 'border-red-500/30 text-red-400'}
                  >
                    🔴 Advanced
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters Badge */}
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                {timePeriod === 'daily' && 'Last 24 Hours'}
                {timePeriod === 'weekly' && 'Last 7 Days'}
                {timePeriod === 'monthly' && 'Last 30 Days'}
                {timePeriod === 'all-time' && 'All Time'}
              </Badge>
              {difficulty !== 'all' && (
                <Badge variant="secondary">
                  {difficulty === 'beginner' && '🟢 Beginner'}
                  {difficulty === 'intermediate' && '🟡 Intermediate'}
                  {difficulty === 'advanced' && '🔴 Advanced'}
                </Badge>
              )}
            </div>

            {/* Leaderboard Table */}
            <LeaderboardTable
              entries={mockData}
              showRankChange={timePeriod !== 'all-time'}
              highlightCurrentUser
            />
          </div>

          {/* Right Column: User Stats & Info */}
          <div className="space-y-6">
            {/* User Rank Card */}
            {userRankEntry && (
              <UserRankCard
                entry={userRankEntry}
                totalPlayers={mockData.length}
              />
            )}

            {/* Top 3 Highlights */}
            <Card className="border-white/10 bg-slate-800/50 p-6">
              <h3 className="mb-4 text-lg font-bold text-white">Top 3 Champions</h3>
              <div className="space-y-3">
                {mockData.slice(0, 3).map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 rounded-lg bg-slate-700/50 p-3"
                  >
                    <div className={`text-2xl ${
                      index === 0 ? '👑' :
                      index === 1 ? '🥈' :
                      '🥉'
                    }`}>
                      {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">
                        {entry.userId?.substring(0, 10) || 'Anonymous'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {entry.bestScore.toLocaleString()} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Game Stats */}
            <Card className="border-white/10 bg-slate-800/50 p-6">
              <h3 className="mb-4 text-lg font-bold text-white">Game Statistics</h3>
              <div className="space-y-3">
                <StatRow label="Total Players" value="1,234" />
                <StatRow label="Games Played" value="5,678" />
                <StatRow label="Avg. Score" value="7,542" />
                <StatRow label="High Score" value={mockData[0]?.bestScore.toLocaleString() || '0'} />
              </div>
            </Card>

            {/* CTA */}
            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 text-center">
              <Trophy className="mx-auto mb-3 h-10 w-10 text-yellow-500" />
              <h3 className="mb-2 text-lg font-bold text-white">
                Challenge the Best!
              </h3>
              <p className="mb-4 text-sm text-gray-300">
                Can you beat the top score?
              </p>
              <Link href={`/games/play/${game.slug}`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Play className="mr-2 h-4 w-4" />
                  Play Now
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// STAT ROW COMPONENT
// ============================================================================

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  )
}
