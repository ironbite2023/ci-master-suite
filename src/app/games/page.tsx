'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Gamepad2, TrendingUp, Trophy, Users } from 'lucide-react'
import { FeaturedGameCard } from '@/components/games/GameCard'
import { GameGrid, GameGridSection } from '@/components/games/GameGrid'
import { GameFilters, type GameFilterOptions } from '@/components/games/GameFilters'
import {
  getAllGames,
  getFeaturedGames,
  getAvailableGames,
  getComingSoonGames,
  getGamesByCategory,
  searchGames,
  type GameMetadata
} from '@/lib/games/gameRegistry'

// ============================================================================
// GAMES HUB PAGE
// ============================================================================

export default function GamesPage() {
  const [filters, setFilters] = useState<GameFilterOptions>({
    search: '',
    category: 'all',
    difficulty: 'all',
    status: 'all',
    layout: 'grid'
  })

  // Get all games
  const allGames = getAllGames()
  const featuredGames = getFeaturedGames()
  const firstFeaturedGame = featuredGames[0]

  // Apply filters
  const filteredGames = useMemo(() => {
    let games: GameMetadata[] = allGames

    // Search
    if (filters.search) {
      games = searchGames(filters.search)
    }

    // Category
    if (filters.category !== 'all') {
      games = games.filter(g => g.category === filters.category)
    }

    // Difficulty
    if (filters.difficulty !== 'all') {
      games = games.filter(g => g.difficulty === filters.difficulty)
    }

    // Status
    if (filters.status === 'available') {
      games = games.filter(g => !g.isComingSoon)
    } else if (filters.status === 'coming-soon') {
      games = games.filter(g => g.isComingSoon)
    }

    return games
  }, [allGames, filters])

  const availableGames = getAvailableGames()
  const comingSoonGames = getComingSoonGames()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-blue-400">
            <Gamepad2 className="h-5 w-5" />
            <span className="text-sm font-medium">CI Master Games</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Learn Through Play
          </h1>
          <p className="max-w-2xl text-lg text-gray-400">
            Master Lean, Six Sigma, and Continuous Improvement through
            engaging, interactive games. Practice real methodologies in a
            risk-free environment.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={<Gamepad2 className="h-5 w-5" />}
            label="Total Games"
            value={allGames.length}
            color="blue"
          />
          <StatsCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Available Now"
            value={availableGames.length}
            color="green"
          />
          <StatsCard
            icon={<Trophy className="h-5 w-5" />}
            label="Achievements"
            value="50+"
            color="yellow"
          />
          <StatsCard
            icon={<Users className="h-5 w-5" />}
            label="Players"
            value="1,000+"
            color="purple"
          />
        </div>

        {/* Featured Game Hero */}
        {firstFeaturedGame && !filters.search && filters.category === 'all' && (
          <div className="mb-12">
            <FeaturedGameCard game={firstFeaturedGame} />
          </div>
        )}

        {/* Filters */}
        <div className="mb-8">
          <GameFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filteredGames.length}
          />
        </div>

        {/* Filtered Results */}
        {(filters.search || filters.category !== 'all' || filters.difficulty !== 'all' || filters.status !== 'all') ? (
          <GameGrid
            games={filteredGames}
            layout={filters.layout}
            showStats
          />
        ) : (
          /* Sectioned View */
          <div className="space-y-12">
            {/* Available Games */}
            <GameGridSection
              title="Play Now"
              description="Jump in and start learning"
              games={availableGames}
              layout={filters.layout}
              showStats
            />

            {/* Coming Soon */}
            {comingSoonGames.length > 0 && (
              <GameGridSection
                title="Coming Soon"
                description="New games in development"
                games={comingSoonGames}
                layout={filters.layout}
              />
            )}

            {/* By Category: Lean */}
            <GameGridSection
              title="Lean Manufacturing"
              description="Master Lean principles and tools"
              games={getGamesByCategory('lean')}
              layout={filters.layout}
              showStats
            />

            {/* By Category: Six Sigma */}
            <GameGridSection
              title="Six Sigma"
              description="Perfect your analytical skills"
              games={getGamesByCategory('six-sigma')}
              layout={filters.layout}
              showStats
            />
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16">
          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">
              Ready to Level Up Your Skills?
            </h2>
            <p className="mb-6 text-gray-300">
              Join thousands of professionals mastering Lean and Six Sigma through gamified learning
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Playing
              </Button>
              <Button size="lg" variant="outline">
                View Leaderboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// STATS CARD COMPONENT
// ============================================================================

function StatsCard({
  icon,
  label,
  value,
  color
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  color: 'blue' | 'green' | 'yellow' | 'purple'
}) {
  const colorClasses = {
    blue: 'from-blue-900/50 to-blue-800/50 border-blue-500/20',
    green: 'from-green-900/50 to-green-800/50 border-green-500/20',
    yellow: 'from-yellow-900/50 to-yellow-800/50 border-yellow-500/20',
    purple: 'from-purple-900/50 to-purple-800/50 border-purple-500/20'
  }[color]

  const iconColors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400'
  }[color]

  return (
    <Card className={`bg-gradient-to-br ${colorClasses} p-6`}>
      <div className="flex items-center gap-4">
        <div className={`${iconColors}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
      </div>
    </Card>
  )
}
