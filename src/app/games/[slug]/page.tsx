'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Play,
  Clock,
  Users,
  Trophy,
  Target,
  CheckCircle2,
  Lock,
  Star
} from 'lucide-react'
import {
  getGameBySlug,
  getGameDifficultyLabel,
  getGameCategoryLabel,
  getGameEstimatedTimeLabel
} from '@/lib/games/gameRegistry'

// ============================================================================
// GAME DETAIL PAGE
// ============================================================================

export default function GameDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const game = getGameBySlug(slug)
  
  if (!game) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">Game Not Found</h1>
          <p className="mb-6 text-gray-400">The game you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/games">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const difficultyColor = {
    beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
    intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    advanced: 'bg-red-500/10 text-red-500 border-red-500/20'
  }[game.difficulty]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/games">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Button>
        </Link>

        {/* Hero Section */}
        <div className="mb-8 grid gap-8 lg:grid-cols-2">
          {/* Left: Image/Video */}
          <div>
            <Card className="overflow-hidden border-white/10 bg-slate-800/50">
              <div className="relative aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                {/* Placeholder for game thumbnail/video */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {game.isComingSoon && (
                    <div className="text-center">
                      <Lock className="mx-auto mb-4 h-16 w-16 text-white" />
                      <p className="text-2xl font-bold text-white">Coming Soon</p>
                      {game.releaseDate && (
                        <p className="mt-2 text-gray-300">
                          {new Date(game.releaseDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Featured Badge */}
                {game.isFeatured && (
                  <div className="absolute left-4 top-4">
                    <Badge className="bg-yellow-500/20 text-yellow-500">
                      <Star className="mr-1 h-3 w-3 fill-current" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right: Game Info */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                {getGameCategoryLabel(game.category)}
              </Badge>
              <Badge variant="secondary" className={difficultyColor}>
                {getGameDifficultyLabel(game.difficulty)}
              </Badge>
            </div>

            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              {game.name}
            </h1>

            <p className="mb-6 text-xl text-gray-300">{game.tagline}</p>

            {/* Meta Info */}
            <div className="mb-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="h-4 w-4" />
                <span>{getGameEstimatedTimeLabel(game.estimatedTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="h-4 w-4" />
                <span>{game.playerCount} player</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Trophy className="h-4 w-4" />
                <span>Max Score: {game.maxScore.toLocaleString()}</span>
              </div>
            </div>

            {/* Play Button */}
            {!game.isComingSoon ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href={`/games/play/${game.slug}`}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Play className="mr-2 h-5 w-5" />
                    Play Now
                  </Button>
                </Link>
                <Link href={`/games/leaderboard/${game.id}`}>
                  <Button size="lg" variant="outline">
                    <Trophy className="mr-2 h-5 w-5" />
                    Leaderboard
                  </Button>
                </Link>
              </div>
            ) : (
              <Button size="lg" disabled>
                <Lock className="mr-2 h-5 w-5" />
                Coming Soon
              </Button>
            )}

            {/* User Best Score (placeholder) */}
            <Card className="mt-6 border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Your Best Score</span>
                <div className="flex items-center gap-2 text-lg font-bold text-blue-400">
                  <Trophy className="h-5 w-5" />
                  <span>--</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Description */}
        <Card className="mb-8 border-white/10 bg-slate-800/50 p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">About This Game</h2>
          <p className="whitespace-pre-line text-gray-300">{game.longDescription}</p>
        </Card>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Learning Objectives */}
            <Card className="border-white/10 bg-slate-800/50 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <Target className="h-5 w-5 text-blue-400" />
                Learning Objectives
              </h2>
              <ul className="space-y-2">
                {game.learningObjectives.map((objective, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Features */}
            <Card className="border-white/10 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Key Features</h2>
              <ul className="space-y-2">
                {game.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-blue-400">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* How to Play */}
            <Card className="border-white/10 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">How to Play</h2>
              <ol className="space-y-3">
                {game.instructions.map((instruction, i) => (
                  <li key={i} className="flex gap-3 text-gray-300">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </Card>

            {/* Difficulty Levels */}
            <Card className="border-white/10 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Difficulty Levels</h2>
              <div className="space-y-4">
                <DifficultyLevel
                  label="Beginner"
                  icon="🟢"
                  multiplier={game.difficultyLevels.beginner.multiplier}
                  description={game.difficultyLevels.beginner.description}
                />
                <DifficultyLevel
                  label="Intermediate"
                  icon="🟡"
                  multiplier={game.difficultyLevels.intermediate.multiplier}
                  description={game.difficultyLevels.intermediate.description}
                />
                <DifficultyLevel
                  label="Advanced"
                  icon="🔴"
                  multiplier={game.difficultyLevels.advanced.multiplier}
                  description={game.difficultyLevels.advanced.description}
                />
              </div>
            </Card>

            {/* Tags */}
            <Card className="border-white/10 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        {!game.isComingSoon && (
          <div className="mt-12 text-center">
            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Ready to Master {game.name}?
              </h2>
              <p className="mb-6 text-gray-300">
                Start playing now and compete for the top spot on the leaderboard
              </p>
              <Link href={`/games/play/${game.slug}`}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Play className="mr-2 h-5 w-5" />
                  Start Playing
                </Button>
              </Link>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// DIFFICULTY LEVEL COMPONENT
// ============================================================================

function DifficultyLevel({
  label,
  icon,
  multiplier,
  description
}: {
  label: string
  icon: string
  multiplier: number
  description: string
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <span>{icon}</span>
        <span className="font-bold text-white">{label}</span>
        <Badge variant="secondary" className="ml-auto">
          {multiplier}x Score
        </Badge>
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}
