'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Trophy,
  Target,
  Clock,
  Gamepad2,
  Calendar
} from 'lucide-react'
import { getAllGames } from '@/lib/games/gameRegistry'
import type { UserGameAchievement, GameSession } from '@/types/games'

// ============================================================================
// MOCK DATA
// ============================================================================

const mockUser = {
  id: 'user-123',
  name: 'CI Master Player',
  email: 'player@cimaster.com',
  avatar: null,
  joinedAt: '2024-01-15',
  totalGamesPlayed: 156,
  totalPlayTime: 45 * 3600, // 45 hours in seconds
  level: 12,
  xp: 8420,
  xpToNextLevel: 10000
}

const mockAchievements: UserGameAchievement[] = [
  {
    id: 'ach-1',
    userId: 'user-123',
    achievementId: 'first-win',
    gameSessionId: 'session-1',
    earnedAt: '2024-03-01T10:00:00Z',
    pointsEarned: 10,
    isShared: false,
    shareCount: 0,
    unlockContext: { game: 'catapult', score: 1000 }
  },
  {
    id: 'ach-2',
    userId: 'user-123',
    achievementId: 'perfect-score',
    gameSessionId: 'session-2',
    earnedAt: '2024-03-15T14:30:00Z',
    pointsEarned: 50,
    isShared: true,
    shareCount: 3,
    unlockContext: { game: 'catapult', accuracy: 100 }
  },
  {
    id: 'ach-3',
    userId: 'user-123',
    achievementId: 'speed-demon',
    gameSessionId: 'session-3',
    earnedAt: '2024-03-20T16:45:00Z',
    pointsEarned: 100,
    isShared: false,
    shareCount: 0,
    unlockContext: { game: 'smed', time: 58 }
  }
]

const mockRecentGames: GameSession[] = [
  {
    id: 'session-1',
    userId: 'user-123',
    gameId: 'catapult',
    difficultyLevel: 'intermediate',
    attemptNumber: 1,
    startedAt: '2024-03-25T10:00:00Z',
    completedAt: '2024-03-25T10:07:00Z',
    pausedDuration: 0,
    timeSpentSeconds: 420,
    status: 'completed',
    currentPhase: null,
    sessionData: {},
    finalScore: 8540,
    maxPossibleScore: 10000,
    scorePercentage: 85.4,
    performanceMetrics: {
      accuracy: 85,
      speed: 90,
      consistency: 80,
      efficiency: 85,
      improvementRate: 5.2,
      custom: {}
    },
    mistakesMade: 2,
    hintsUsed: 1,
    tutorialCompleted: true,
    learningMilestones: ['first-shot', 'hit-target'],
    deviceType: 'desktop',
    browser: 'chrome',
    screenResolution: '1920x1080',
    createdAt: '2024-03-25T10:00:00Z',
    updatedAt: '2024-03-25T10:07:00Z'
  },
  {
    id: 'session-2',
    userId: 'user-123',
    gameId: 'smed_challenge',
    difficultyLevel: 'advanced',
    attemptNumber: 2,
    startedAt: '2024-03-24T15:00:00Z',
    completedAt: '2024-03-24T15:09:00Z',
    pausedDuration: 0,
    timeSpentSeconds: 540,
    status: 'completed',
    currentPhase: null,
    sessionData: {},
    finalScore: 9200,
    maxPossibleScore: 10000,
    scorePercentage: 92,
    performanceMetrics: {
      accuracy: 92,
      speed: 95,
      consistency: 90,
      efficiency: 93,
      improvementRate: 8.5,
      custom: {}
    },
    mistakesMade: 1,
    hintsUsed: 0,
    tutorialCompleted: true,
    learningMilestones: ['speed-demon', 'perfect-changeover'],
    deviceType: 'desktop',
    browser: 'firefox',
    screenResolution: '1920x1080',
    createdAt: '2024-03-24T15:00:00Z',
    updatedAt: '2024-03-24T15:09:00Z'
  }
]

// ============================================================================
// USER PROFILE PAGE
// ============================================================================

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const allGames = getAllGames()

  const levelProgress = (mockUser.xp / mockUser.xpToNextLevel) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8 border-white/10 bg-slate-800/50 p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24 bg-gradient-to-br from-blue-600 to-purple-600">
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white">
                  {mockUser.name.substring(0, 2).toUpperCase()}
                </div>
              </Avatar>
              <div>
                <h1 className="mb-1 text-3xl font-bold text-white">
                  {mockUser.name}
                </h1>
                <p className="text-gray-400">{mockUser.email}</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(mockUser.joinedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Level & XP */}
            <div className="ml-auto flex-1 md:max-w-md">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <Badge className="bg-blue-600">Level {mockUser.level}</Badge>
                </div>
                <span className="text-sm text-gray-400">
                  {mockUser.xp.toLocaleString()} / {mockUser.xpToNextLevel.toLocaleString()} XP
                </span>
              </div>
              <Progress value={levelProgress} className="h-3" />
              <p className="mt-1 text-xs text-gray-500">
                {mockUser.xpToNextLevel - mockUser.xp} XP to next level
              </p>
            </div>
          </div>
        </Card>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Gamepad2 className="h-5 w-5" />}
            label="Games Played"
            value={mockUser.totalGamesPlayed.toString()}
            color="blue"
          />
          <StatCard
            icon={<Trophy className="h-5 w-5" />}
            label="Achievements"
            value={mockAchievements.length.toString()}
            color="yellow"
          />
          <StatCard
            icon={<Clock className="h-5 w-5" />}
            label="Play Time"
            value={`${Math.floor(mockUser.totalPlayTime / 3600)}h`}
            color="purple"
          />
          <StatCard
            icon={<Target className="h-5 w-5" />}
            label="Avg. Accuracy"
            value="87%"
            color="green"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="history">Game History</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Recent Games */}
            <div>
              <h2 className="mb-4 text-2xl font-bold text-white">Recent Games</h2>
              <div className="space-y-3">
                {mockRecentGames.map((session) => {
                  const game = allGames.find(g => g.id === session.gameId)
                  return (
                    <RecentGameCard key={session.id} session={session} game={game} />
                  )
                })}
              </div>
            </div>

            {/* Recent Achievements */}
            <div>
              <h2 className="mb-4 text-2xl font-bold text-white">Recent Achievements</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mockAchievements.slice(0, 3).map(ach => (
                  <AchievementCard key={ach.id} achievement={ach} />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">All Achievements</h2>
              <Badge variant="secondary">
                {mockAchievements.length} / 50 Unlocked
              </Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockAchievements.map(ach => (
                <AchievementCard key={ach.id} achievement={ach} detailed />
              ))}
              {/* Locked achievements */}
              {Array.from({ length: 3 }).map((_, i) => (
                <LockedAchievementCard key={`locked-${i}`} />
              ))}
            </div>
          </TabsContent>

          {/* Game History Tab */}
          <TabsContent value="history">
            <h2 className="mb-4 text-2xl font-bold text-white">Game History</h2>
            <div className="space-y-3">
              {mockRecentGames.map((session) => {
                const game = allGames.find(g => g.id === session.gameId)
                return (
                  <RecentGameCard key={session.id} session={session} game={game} detailed />
                )
              })}
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Performance by Game */}
              <Card className="border-white/10 bg-slate-800/50 p-6">
                <h3 className="mb-4 text-lg font-bold text-white">Performance by Game</h3>
                <div className="space-y-4">
                  {allGames.filter(g => !g.isComingSoon).slice(0, 3).map(game => (
                    <GamePerformanceRow key={game.id} game={game} />
                  ))}
                </div>
              </Card>

              {/* Skill Progression */}
              <Card className="border-white/10 bg-slate-800/50 p-6">
                <h3 className="mb-4 text-lg font-bold text-white">Skill Progression</h3>
                <div className="space-y-4">
                  <SkillBar skill="Problem Solving" level={85} />
                  <SkillBar skill="Analytical Thinking" level={78} />
                  <SkillBar skill="Process Optimization" level={92} />
                  <SkillBar skill="Data Analysis" level={70} />
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ============================================================================
// STAT CARD
// ============================================================================

function StatCard({
  icon,
  label,
  value,
  color
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: 'blue' | 'yellow' | 'purple' | 'green'
}) {
  const colorClasses = {
    blue: 'from-blue-900/50 to-blue-800/50 border-blue-500/20 text-blue-400',
    yellow: 'from-yellow-900/50 to-yellow-800/50 border-yellow-500/20 text-yellow-400',
    purple: 'from-purple-900/50 to-purple-800/50 border-purple-500/20 text-purple-400',
    green: 'from-green-900/50 to-green-800/50 border-green-500/20 text-green-400'
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
// RECENT GAME CARD
// ============================================================================

function RecentGameCard({
  session,
  game,
  detailed = false
}: {
  session: GameSession
  game?: { id: string; name: string }
  detailed?: boolean
}) {
  return (
    <Card className="border-white/10 bg-slate-800/50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
            <Gamepad2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">{game?.name || 'Unknown Game'}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Badge variant="secondary" className={`${
                session.difficultyLevel === 'beginner' ? 'bg-green-500/20 text-green-400' :
                session.difficultyLevel === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {session.difficultyLevel}
              </Badge>
              <span>•</span>
              <span>{new Date(session.startedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-white">
            {session.finalScore?.toLocaleString() || '0'}
          </div>
          <div className="text-xs text-gray-400">
            {Math.floor((session.timeSpentSeconds || 0) / 60)}:{((session.timeSpentSeconds || 0) % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </div>
      {detailed && (
        <div className="mt-4 flex gap-6 border-t border-white/10 pt-4 text-sm">
          <div>
            <span className="text-gray-400">Status:</span>{' '}
            <span className="text-white">{session.status}</span>
          </div>
          <div>
            <span className="text-gray-400">Difficulty:</span>{' '}
            <span className="text-white">{session.difficultyLevel}</span>
          </div>
        </div>
      )}
    </Card>
  )
}

// ============================================================================
// ACHIEVEMENT CARD
// ============================================================================

function AchievementCard({
  achievement,
  detailed = false
}: {
  achievement: UserGameAchievement
  detailed?: boolean
}) {
  const rarityColors = {
    common: 'from-gray-600 to-gray-700 border-gray-500/20',
    rare: 'from-blue-600 to-blue-700 border-blue-500/20',
    epic: 'from-purple-600 to-purple-700 border-purple-500/20',
    legendary: 'from-yellow-600 to-yellow-700 border-yellow-500/20'
  }

  // Mock achievement details - in real app, fetch from achievements table
  const achievementDetails = {
    'first-win': { name: 'First Victory', description: 'Complete your first successful experiment', icon: '🏆', rarity: 'common' as const, points: 10 },
    'perfect-score': { name: 'Perfect Aim', description: 'Achieve 100% accuracy in a game', icon: '🎯', rarity: 'rare' as const, points: 50 },
    'speed-demon': { name: 'Speed Demon', description: 'Complete a changeover in under 60 seconds', icon: '⚡', rarity: 'epic' as const, points: 100 }
  }
  
  const details = achievementDetails[achievement.achievementId as keyof typeof achievementDetails] || {
    name: 'Achievement',
    description: 'Unlocked achievement',
    icon: '🏅',
    rarity: 'common' as const,
    points: achievement.pointsEarned
  }

  return (
    <Card className={`bg-gradient-to-br ${rarityColors[details.rarity]} p-4`}>
      <div className="mb-2 text-4xl">{details.icon}</div>
      <h3 className="mb-1 font-bold text-white">{details.name}</h3>
      <p className="mb-2 text-sm text-gray-300">{details.description}</p>
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="capitalize">
          {details.rarity}
        </Badge>
        <span className="text-sm text-gray-300">
          {achievement.pointsEarned} pts
        </span>
      </div>
      {detailed && (
        <div className="mt-2 text-xs text-gray-400">
          Unlocked {new Date(achievement.earnedAt).toLocaleDateString()}
        </div>
      )}
    </Card>
  )
}

// ============================================================================
// LOCKED ACHIEVEMENT CARD
// ============================================================================

function LockedAchievementCard() {
  return (
    <Card className="border-white/10 bg-slate-800/30 p-4 opacity-50">
      <div className="mb-2 text-4xl">🔒</div>
      <h3 className="mb-1 font-bold text-gray-500">Locked Achievement</h3>
      <p className="mb-2 text-sm text-gray-600">Complete specific challenges to unlock</p>
      <Badge variant="secondary" className="bg-gray-700/50 text-gray-500">
        ???
      </Badge>
    </Card>
  )
}

// ============================================================================
// GAME PERFORMANCE ROW
// ============================================================================

function GamePerformanceRow({ game }: { game: { name: string } }) {
  const played = Math.floor(Math.random() * 30) + 5
  const bestScore = Math.floor(Math.random() * 5000) + 5000

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-white">{game.name}</span>
        <span className="text-gray-400">{played} plays</span>
      </div>
      <div className="mb-1">
        <Progress value={(played / 50) * 100} className="h-2" />
      </div>
      <div className="text-xs text-gray-500">Best: {bestScore.toLocaleString()}</div>
    </div>
  )
}

// ============================================================================
// SKILL BAR
// ============================================================================

function SkillBar({ skill, level }: { skill: string; level: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-white">{skill}</span>
        <span className="text-gray-400">{level}%</span>
      </div>
      <Progress value={level} className="h-2" />
    </div>
  )
}
