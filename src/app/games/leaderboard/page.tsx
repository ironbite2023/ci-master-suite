'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Trophy, ArrowLeft, Calendar, Gamepad2 } from 'lucide-react'
import { LeaderboardTable, type LeaderboardEntry } from '@/components/games/LeaderboardTable'
import { getAllGames } from '@/lib/games/gameRegistry'
import type { GameDifficulty } from '@/types/games'

// ============================================================================
// MOCK DATA (Replace with real data from Supabase)
// ============================================================================

const mockUserNames = ['Alex Chen', 'Jordan Smith', 'Riley Johnson', 'Casey Williams', 'Morgan Brown', 'Taylor Davis', 'Jamie Wilson', 'Drew Martinez', 'Cameron Garcia', 'Skylar Rodriguez']

const generateMockLeaderboardData = (gameId: string, count: number): LeaderboardEntry[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${gameId}-${i}`,
    userId: `user-${i + 1}`,
    userName: mockUserNames[i % mockUserNames.length] || `Player ${i + 1}`,
    gameId: gameId,
    difficultyLevel: (['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)] as GameDifficulty),
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
    rank: i + 1,
    firstPlayedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastPlayedAt: new Date().toISOString(),
    bestScoreAt: new Date().toISOString()
  })).sort((a, b) => b.bestScore - a.bestScore).map((entry, i) => ({ ...entry, globalRank: i + 1, monthlyRank: i + 1, weeklyRank: i + 1, rank: i + 1 }))
}

// ============================================================================
// GLOBAL LEADERBOARD PAGE
// ============================================================================

export default function GlobalLeaderboardPage() {
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('all-time')
  const [selectedGame, setSelectedGame] = useState<string>('all')
  
  const allGames = getAllGames()
  const mockData = generateMockLeaderboardData('global', 50)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/games">
            <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </Link>

          <div className="mb-4 flex items-center gap-2 text-yellow-400">
            <Trophy className="h-5 w-5" />
            <span className="text-sm font-medium">Global Leaderboard</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Top Players
          </h1>
          <p className="max-w-2xl text-lg text-gray-400">
            Compete with players worldwide and climb to the top of the rankings
          </p>
        </div>

        {/* Stats Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="Total Players"
            value="1,234"
            icon={<Trophy className="h-5 w-5" />}
            color="blue"
          />
          <StatsCard
            label="Games Played"
            value="15,678"
            icon={<Gamepad2 className="h-5 w-5" />}
            color="purple"
          />
          <StatsCard
            label="Active Today"
            value="456"
            icon={<Calendar className="h-5 w-5" />}
            color="green"
          />
          <StatsCard
            label="New This Week"
            value="89"
            icon={<Trophy className="h-5 w-5" />}
            color="yellow"
          />
        </div>

        {/* Filter Controls */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Time Period Tabs */}
          <Tabs value={timePeriod} onValueChange={(value) => setTimePeriod(value as typeof timePeriod)}>
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="all-time">All Time</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Game Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedGame === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedGame('all')}
            >
              All Games
            </Button>
            {allGames.filter(g => !g.isComingSoon).map(game => (
              <Button
                key={game.id}
                variant={selectedGame === game.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedGame(game.id)}
              >
                {game.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Time Period Badge */}
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            {timePeriod === 'daily' && 'Last 24 Hours'}
            {timePeriod === 'weekly' && 'Last 7 Days'}
            {timePeriod === 'monthly' && 'Last 30 Days'}
            {timePeriod === 'all-time' && 'All Time Leaders'}
          </Badge>
          {selectedGame !== 'all' && (
            <Badge variant="secondary">
              {allGames.find(g => g.id === selectedGame)?.name || 'Game'}
            </Badge>
          )}
        </div>

        {/* Leaderboard Table */}
        <LeaderboardTable
          entries={mockData}
          showRankChange={timePeriod !== 'all-time'}
          highlightCurrentUser
        />

        {/* Game-Specific Leaderboards */}
        {selectedGame === 'all' && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Game Leaderboards
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {allGames.filter(g => !g.isComingSoon).map(game => (
                <GameLeaderboardCard
                  key={game.id}
                  game={game}
                  entries={generateMockLeaderboardData(game.id, 5)}
                />
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8">
            <Trophy className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
            <h2 className="mb-4 text-2xl font-bold text-white">
              Ready to Climb the Ranks?
            </h2>
            <p className="mb-6 text-gray-300">
              Play games, improve your skills, and compete for the top spot
            </p>
            <Link href="/games">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Gamepad2 className="mr-2 h-5 w-5" />
                Browse Games
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// STATS CARD
// ============================================================================

function StatsCard({
  label,
  value,
  icon,
  color
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: 'blue' | 'purple' | 'green' | 'yellow'
}) {
  const colorClasses = {
    blue: 'from-blue-900/50 to-blue-800/50 border-blue-500/20 text-blue-400',
    purple: 'from-purple-900/50 to-purple-800/50 border-purple-500/20 text-purple-400',
    green: 'from-green-900/50 to-green-800/50 border-green-500/20 text-green-400',
    yellow: 'from-yellow-900/50 to-yellow-800/50 border-yellow-500/20 text-yellow-400'
  }[color]

  return (
    <Card className={`bg-gradient-to-br ${colorClasses} p-6`}>
      <div className="flex items-center gap-4">
        <div>{icon}</div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// GAME LEADERBOARD CARD (mini preview)
// ============================================================================

function GameLeaderboardCard({
  game,
  entries
}: {
  game: { id: string; name: string; slug: string }
  entries: LeaderboardEntry[]
}) {
  return (
    <Card className="border-white/10 bg-slate-800/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{game.name}</h3>
        <Link href={`/games/leaderboard/${game.id}`}>
          <Button variant="ghost" size="sm">
            View All →
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {entries.slice(0, 3).map((entry, index) => (
          <div
            key={entry.id}
            className="flex items-center justify-between rounded-lg bg-slate-700/50 p-3"
          >
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold ${
                index === 0 ? 'text-yellow-500' :
                index === 1 ? 'text-gray-400' :
                'text-orange-600'
              }`}>
                #{index + 1}
              </span>
              <span className="text-sm text-white">
                {entry.userId?.substring(0, 10) || 'Anonymous'}
              </span>
            </div>
            <span className="text-sm font-bold text-white">
              {entry.bestScore.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
