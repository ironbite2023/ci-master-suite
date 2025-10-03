import type { GameKey, GameCategory, GameDifficulty } from '@/types/games'

// ============================================================================
// GAME METADATA TYPES
// ============================================================================

export interface GameMetadata {
  id: string
  key: GameKey
  name: string
  slug: string
  tagline: string
  description: string
  longDescription: string
  category: GameCategory
  difficulty: GameDifficulty
  estimatedTime: number // in minutes
  playerCount: '1' | '1-2' | '1-4' | 'unlimited'
  tags: string[]
  learningObjectives: string[]
  features: string[]
  instructions: string[]
  thumbnail: string
  coverImage: string
  videoUrl?: string
  isFeatured: boolean
  isComingSoon: boolean
  releaseDate?: string
  minScore: number
  maxScore: number
  difficultyLevels: {
    beginner: { multiplier: number; description: string }
    intermediate: { multiplier: number; description: string }
    advanced: { multiplier: number; description: string }
  }
}

// ============================================================================
// GAME REGISTRY
// ============================================================================

export const GAME_REGISTRY: Record<GameKey, GameMetadata> = {
  catapult: {
    id: 'catapult',
    key: 'catapult',
    name: 'DOE Catapult Challenge',
    slug: 'catapult',
    tagline: 'Master Design of Experiments through projectile physics',
    description: 'Learn Design of Experiments (DOE) by optimizing catapult parameters to hit targets consistently.',
    longDescription: `
      The DOE Catapult Challenge teaches you the fundamentals of Design of Experiments through an engaging physics-based game.
      You'll experiment with different variables like angle, power, and weight to understand how they affect your projectile's trajectory.
      
      Apply real Six Sigma methodologies including factorial designs, response surface methodology, and optimization techniques
      to achieve the highest accuracy. Perfect for learning how to design experiments, analyze data, and make data-driven decisions.
    `,
    category: 'six-sigma',
    difficulty: 'intermediate',
    estimatedTime: 15,
    playerCount: '1',
    tags: ['Physics', 'DOE', 'Optimization', 'Six Sigma', 'Analytics'],
    learningObjectives: [
      'Understand factorial experiment design',
      'Learn parameter optimization techniques',
      'Practice data-driven decision making',
      'Master cause-and-effect relationships',
      'Apply response surface methodology'
    ],
    features: [
      'Realistic physics simulation',
      'Multiple target configurations',
      'Full factorial and fractional designs',
      'Real-time data analysis',
      'Achievement system for mastery'
    ],
    instructions: [
      'Adjust catapult parameters (angle, power, weight)',
      'Launch projectiles to hit targets',
      'Record results for each parameter combination',
      'Analyze the data to identify optimal settings',
      'Achieve consistent accuracy through optimization'
    ],
    thumbnail: '/games/catapult/thumbnail.jpg',
    coverImage: '/games/catapult/cover.jpg',
    videoUrl: '/games/catapult/demo.mp4',
    isFeatured: true,
    isComingSoon: false,
    releaseDate: '2025-01-15',
    minScore: 0,
    maxScore: 10000,
    difficultyLevels: {
      beginner: {
        multiplier: 1,
        description: 'Large targets, generous scoring zones'
      },
      intermediate: {
        multiplier: 1.5,
        description: 'Normal targets, standard scoring'
      },
      advanced: {
        multiplier: 2,
        description: 'Small targets, precision required'
      }
    }
  },

  smed_challenge: {
    id: 'smed_challenge',
    key: 'smed_challenge',
    name: 'SMED Changeover Challenge',
    slug: 'smed',
    tagline: 'Optimize changeover times with Single-Minute Exchange of Die',
    description: 'Reduce setup times by identifying and converting internal tasks to external in this fast-paced simulation.',
    longDescription: `
      The SMED Changeover Challenge immerses you in the world of quick changeovers and setup reduction.
      Based on Shigeo Shingo's revolutionary Single-Minute Exchange of Die methodology, you'll practice identifying
      internal and external activities, converting internal to external, and streamlining all operations.
      
      Race against the clock to perform changeovers, optimize your process, and achieve world-class setup times.
      Learn to apply SMED principles that can reduce changeover times by 90% or more in real manufacturing environments.
    `,
    category: 'lean',
    difficulty: 'intermediate',
    estimatedTime: 10,
    playerCount: '1',
    tags: ['SMED', 'Lean', 'Setup Reduction', 'Manufacturing', 'Time Management'],
    learningObjectives: [
      'Identify internal vs external activities',
      'Convert internal to external tasks',
      'Streamline changeover processes',
      'Reduce setup times systematically',
      'Apply SMED methodology'
    ],
    features: [
      'Realistic changeover simulation',
      'Drag-and-drop task management',
      'Real-time performance metrics',
      'Progressive difficulty levels',
      'SMED checklist integration'
    ],
    instructions: [
      'Review the current changeover process',
      'Classify activities as internal or external',
      'Convert internal activities to external where possible',
      'Optimize the sequence of remaining internal activities',
      'Execute the changeover as fast as possible'
    ],
    thumbnail: '/games/smed/thumbnail.jpg',
    coverImage: '/games/smed/cover.jpg',
    isFeatured: true,
    isComingSoon: false,
    releaseDate: '2025-02-01',
    minScore: 0,
    maxScore: 10000,
    difficultyLevels: {
      beginner: {
        multiplier: 1,
        description: 'Fewer steps, more time'
      },
      intermediate: {
        multiplier: 1.5,
        description: 'Standard changeover complexity'
      },
      advanced: {
        multiplier: 2,
        description: 'Complex changeover, tight time limits'
      }
    }
  },

  five_s_factory: {
    id: 'five_s_factory',
    key: 'five_s_factory',
    name: '5S Workplace Organization',
    slug: 'five-s',
    tagline: 'Transform chaos into organized efficiency',
    description: 'Apply the 5S methodology to organize a messy workspace and improve efficiency.',
    longDescription: `
      The 5S Workplace Organization game teaches you the foundational Lean tool for creating organized,
      efficient, and safe workspaces. Through interactive gameplay, you'll practice Sort, Set in Order,
      Shine, Standardize, and Sustain.
      
      Transform cluttered, inefficient workspaces into models of organization. Learn to identify waste,
      create visual management systems, and establish standards that stick. This game reinforces the
      habits and thinking patterns that make 5S successful in real manufacturing and office environments.
    `,
    category: 'lean',
    difficulty: 'beginner',
    estimatedTime: 8,
    playerCount: '1',
    tags: ['5S', 'Lean', 'Organization', 'Workplace', 'Visual Management'],
    learningObjectives: [
      'Master the 5S methodology',
      'Identify and eliminate waste',
      'Create visual management systems',
      'Establish sustainable standards',
      'Improve workplace safety and efficiency'
    ],
    features: [
      'Interactive workspace environments',
      'Drag-and-drop organization',
      'Before/after comparisons',
      'Scoring based on 5S principles',
      'Multiple workplace scenarios'
    ],
    instructions: [
      'Sort: Remove unnecessary items',
      'Set in Order: Arrange items for easy access',
      'Shine: Clean and inspect the workspace',
      'Standardize: Create visual standards',
      'Sustain: Establish maintenance systems'
    ],
    thumbnail: '/games/5s/thumbnail.jpg',
    coverImage: '/games/5s/cover.jpg',
    isFeatured: true,
    isComingSoon: true,
    releaseDate: '2025-02-15',
    minScore: 0,
    maxScore: 5000,
    difficultyLevels: {
      beginner: {
        multiplier: 1,
        description: 'Small workspace, clear improvements'
      },
      intermediate: {
        multiplier: 1.5,
        description: 'Larger area, more complexity'
      },
      advanced: {
        multiplier: 2,
        description: 'Complete facility, multiple departments'
      }
    }
  },

  kanban_flow: {
    id: 'kanban_flow',
    key: 'kanban_flow',
    name: 'Kanban Flow Master',
    slug: 'kanban',
    tagline: 'Optimize workflow with visual management',
    description: 'Manage work in progress and optimize flow using Kanban principles in this production simulation.',
    longDescription: `
      The Kanban Flow Master game teaches you to manage and optimize workflow using the powerful Kanban system.
      Balance work in progress, identify bottlenecks, and maintain smooth flow through a simulated production system.
      
      You'll practice setting WIP limits, managing pull systems, visualizing workflow, and making real-time decisions
      to optimize throughput. Learn the principles that Toyota used to revolutionize manufacturing, now applied across
      industries from software development to healthcare.
    `,
    category: 'lean',
    difficulty: 'intermediate',
    estimatedTime: 12,
    playerCount: '1',
    tags: ['Kanban', 'Lean', 'Flow', 'WIP', 'Pull System'],
    learningObjectives: [
      'Understand Kanban principles',
      'Manage work in progress (WIP)',
      'Identify and eliminate bottlenecks',
      'Optimize flow and throughput',
      'Implement pull systems'
    ],
    features: [
      'Real-time production simulation',
      'Dynamic WIP visualization',
      'Bottleneck identification',
      'Flow metrics and analytics',
      'Multiple production scenarios'
    ],
    instructions: [
      'Set WIP limits for each process stage',
      'Monitor work flowing through the system',
      'Identify and address bottlenecks',
      'Balance capacity across stages',
      'Optimize for maximum throughput'
    ],
    thumbnail: '/games/kanban/thumbnail.jpg',
    coverImage: '/games/kanban/cover.jpg',
    isFeatured: false,
    isComingSoon: true,
    releaseDate: '2025-03-01',
    minScore: 0,
    maxScore: 15000,
    difficultyLevels: {
      beginner: {
        multiplier: 1,
        description: '3-stage process, clear bottlenecks'
      },
      intermediate: {
        multiplier: 1.5,
        description: '5-stage process, variable demand'
      },
      advanced: {
        multiplier: 2,
        description: '7+ stages, complex dependencies'
      }
    }
  },

  defect_detective: {
    id: 'defect_detective',
    key: 'defect_detective',
    name: 'Defect Detective',
    slug: 'defect-detective',
    tagline: 'Hunt down root causes with systematic analysis',
    description: 'Use Six Sigma tools to identify, analyze, and eliminate defects in a production process.',
    longDescription: `
      Become a Defect Detective and master the systematic approach to problem-solving used by Six Sigma professionals
      worldwide. You'll use tools like fishbone diagrams, Pareto analysis, and hypothesis testing to track down
      the root causes of quality issues.
      
      Each case presents a unique quality challenge where you must gather data, analyze patterns, form hypotheses,
      and implement solutions. Learn to think like a quality engineer and develop the analytical skills that drive
      continuous improvement.
    `,
    category: 'six-sigma',
    difficulty: 'advanced',
    estimatedTime: 20,
    playerCount: '1',
    tags: ['Six Sigma', 'Root Cause Analysis', 'Quality', 'Problem Solving', 'DMAIC'],
    learningObjectives: [
      'Apply systematic problem-solving',
      'Use root cause analysis tools',
      'Conduct hypothesis testing',
      'Implement effective solutions',
      'Master Six Sigma methodology'
    ],
    features: [
      'Multiple investigation cases',
      'Interactive analysis tools',
      'Data collection simulation',
      'Hypothesis testing mechanics',
      'Solution validation system'
    ],
    instructions: [
      'Define the problem clearly',
      'Measure and collect relevant data',
      'Analyze data to identify patterns',
      'Identify root causes',
      'Implement and verify solutions'
    ],
    thumbnail: '/games/defect-detective/thumbnail.jpg',
    coverImage: '/games/defect-detective/cover.jpg',
    isFeatured: false,
    isComingSoon: true,
    releaseDate: '2025-03-15',
    minScore: 0,
    maxScore: 20000,
    difficultyLevels: {
      beginner: {
        multiplier: 1,
        description: 'Clear defects, obvious causes'
      },
      intermediate: {
        multiplier: 1.5,
        description: 'Multiple potential causes'
      },
      advanced: {
        multiplier: 2,
        description: 'Complex interactions, hidden factors'
      }
    }
  },

  vsm_puzzle: {
    id: 'vsm_puzzle',
    key: 'vsm_puzzle',
    name: 'VSM Puzzle Master',
    slug: 'vsm-puzzle',
    tagline: 'Optimize value streams and eliminate waste',
    description: 'Map current state, design future state, and eliminate waste in complex value streams.',
    longDescription: `
      The VSM Puzzle Master game teaches you to see and optimize entire value streams from end to end.
      You'll practice creating current state maps, identifying waste, designing future states, and implementing
      improvements across complex processes.
      
      Learn to calculate lead times, identify value-added vs non-value-added activities, and create visual maps
      that drive organizational transformation. Master the tool that Lean practitioners use to achieve breakthrough
      improvements in flow, quality, and cost.
    `,
    category: 'lean',
    difficulty: 'advanced',
    estimatedTime: 25,
    playerCount: '1',
    tags: ['VSM', 'Lean', 'Value Stream', 'Waste Elimination', 'Process Improvement'],
    learningObjectives: [
      'Create current state value stream maps',
      'Identify and quantify waste',
      'Design future state maps',
      'Calculate lead time and cycle time',
      'Implement flow improvements'
    ],
    features: [
      'Interactive mapping tools',
      'Waste identification system',
      'Lead time calculations',
      'Before/after comparisons',
      'Multiple industry scenarios'
    ],
    instructions: [
      'Map the current state process',
      'Identify all forms of waste',
      'Calculate process metrics',
      'Design an improved future state',
      'Implement changes and measure results'
    ],
    thumbnail: '/games/vsm/thumbnail.jpg',
    coverImage: '/games/vsm/cover.jpg',
    isFeatured: false,
    isComingSoon: true,
    releaseDate: '2025-04-01',
    minScore: 0,
    maxScore: 25000,
    difficultyLevels: {
      beginner: {
        multiplier: 1,
        description: 'Simple linear process'
      },
      intermediate: {
        multiplier: 1.5,
        description: 'Multiple paths, some branches'
      },
      advanced: {
        multiplier: 2,
        description: 'Complex network, multiple products'
      }
    }
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getAllGames(): GameMetadata[] {
  return Object.values(GAME_REGISTRY)
}

export function getGameBySlug(slug: string): GameMetadata | undefined {
  return Object.values(GAME_REGISTRY).find(game => game.slug === slug)
}

export function getGameByKey(key: GameKey): GameMetadata | undefined {
  return GAME_REGISTRY[key]
}

export function getFeaturedGames(): GameMetadata[] {
  return Object.values(GAME_REGISTRY).filter(game => game.isFeatured)
}

export function getGamesByCategory(category: GameCategory): GameMetadata[] {
  return Object.values(GAME_REGISTRY).filter(game => game.category === category)
}

export function getAvailableGames(): GameMetadata[] {
  return Object.values(GAME_REGISTRY).filter(game => !game.isComingSoon)
}

export function getComingSoonGames(): GameMetadata[] {
  return Object.values(GAME_REGISTRY).filter(game => game.isComingSoon)
}

export function searchGames(query: string): GameMetadata[] {
  const lowercaseQuery = query.toLowerCase()
  return Object.values(GAME_REGISTRY).filter(game =>
    game.name.toLowerCase().includes(lowercaseQuery) ||
    game.description.toLowerCase().includes(lowercaseQuery) ||
    game.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export function getGamesByTag(tag: string): GameMetadata[] {
  return Object.values(GAME_REGISTRY).filter(game =>
    game.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}

export function getGameDifficultyLabel(difficulty: GameDifficulty): string {
  const labels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  }
  return labels[difficulty]
}

export function getGameCategoryLabel(category: GameCategory): string {
  const labels = {
    lean: 'Lean Manufacturing',
    'six-sigma': 'Six Sigma',
    'continuous-improvement': 'Continuous Improvement'
  }
  return labels[category]
}

export function getGameEstimatedTimeLabel(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}
